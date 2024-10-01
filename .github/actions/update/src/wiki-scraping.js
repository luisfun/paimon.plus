import fs from 'node:fs'
import puppeteer from 'puppeteer'
import { folder, sleep } from './utils.js'

const fileName = 'id'
const maxNullCount = 50 // no pageをn回まで許容
const scrapingMaxCount = 1000 // newスクレイピングの最大回数

/**
 * 実行用
 * @param {"new" | "hash" | "null"} type ローカル用
 * @param {boolean} updateOnly ローカル用 アップデートのみ 新ページを読まない
 * @param {number} num アップデートする数
 */
export const wikiScraping = async (type = undefined, num = scrapingMaxCount) => {
  console.log('Wiki Scraping Start')
  // 読み取り済みIDの取得
  const wikiJson = JSON.parse(fs.readFileSync(`${folder.wiki + fileName}.json`, 'utf8'))
  // ブラウザの立ち上げ
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(60_000)
  //
  switch (type) {
    case 'new':
      await newScraping(wikiJson, page, num)
      break
    case 'hash':
      await hashScraping(wikiJson, page, num)
      break
    case 'null':
      await nullScraping(wikiJson, page, num)
      break
    default:
      await hashScraping(wikiJson, page, maxNullCount)
      await nullScraping(wikiJson, page, maxNullCount)
      await newScraping(wikiJson, page, maxNullCount)
      break
  }
  // ブラウザクローズ
  await browser.close()
  // 保存
  fs.writeFileSync(`${folder.wiki + fileName}.json`, JSON.stringify(wikiJson, null, 2))
  console.log('Wiki Scraping End')
}

/**
 * 画像なしページ("#")の再スクレイピング
 * @param {*} wikiJson
 * @param {Page} page
 * @param {number} num
 */
const hashScraping = async (wikiJson, page, num) => {
  const hashIds = []
  for (const id in wikiJson) {
    if (Object.hasOwn(wikiJson, id) && wikiJson[id] === '#') hashIds.push(id) // #要素のID抽出
  }
  const checkIds = hashIds.slice(-num) // スクレイピングする範囲設定
  for (const i of checkIds) {
    // スクレイピング、テキストデータの追加と後処理
    wikiJson[i] = await scrapingCore(page, i)
    console.log(`#${i}`, wikiJson[i])
  }
}

/**
 * nullページ("")の再スクレイピング
 * @param {*} wikiJson
 * @param {Page} page
 * @param {number} num アップデートする数（後ろからnum個）
 */
const nullScraping = async (wikiJson, page, num) => {
  const nullIds = []
  for (const id in wikiJson) {
    if (Object.hasOwn(wikiJson, id) && wikiJson[id] === '') nullIds.push(id) // null要素のID抽出
  }
  const checkIds = nullIds.slice(-(num + maxNullCount), -maxNullCount) // スクレイピングする範囲設定
  for (const i of checkIds) {
    // スクレイピング、テキストデータの追加と後処理
    wikiJson[i] = await scrapingCore(page, i)
    console.log(` ${i}`, wikiJson[i])
  }
}

/**
 * 新しいページのスクレイピング
 * @param {*} wikiJson
 * @param {Page} page
 */
const newScraping = async (wikiJson, page, num) => {
  const wikiValues = Object.values(wikiJson)
  while (wikiValues.length > 0 && wikiValues[wikiValues.length - 1] === '') wikiValues.pop() // 最後の空要素を取り除く
  let noPageCount = 0 // 中断カウント
  let maxCount = scrapingMaxCount // 最大回数
  for (let i = wikiValues.length; noPageCount < num; i++) {
    // n回nullが続いたらストップ
    // スクレイピング、テキストデータの追加と後処理
    wikiJson[i] = await scrapingCore(page, i)
    console.log(i, wikiJson[i])
    if (wikiJson[i] !== '')
      noPageCount = 0 // 中断カウントリセット
    else noPageCount++ // 中断カウント＋＋
    if (!maxCount--) break // 最大回数
  }
}

/**
 * スクレイピングのコア
 * @param {Page} page
 * @param {number} i hoyowiki id
 * @returns no page "", no image "#", tcg "TCG: ~~~", title "~~~"
 */
const scrapingCore = async (page, i) => {
  // ページ移動
  await page.goto(`https://wiki.hoyolab.com/pc/genshin/entry/${i}`) // 移動
  // タイトルテキスト抽出
  const titleSelector = '.detail-header-common-name > span, .detail-header-cover-name > span'
  await page.waitForSelector(titleSelector) // 待機
  const title = await page.$(titleSelector)
  const text = await (await title.getProperty('textContent')).jsonValue()
  if (text === '') return '' // no page, no title
  // 画像がないページの確認
  await page.waitForSelector('.detail-header-common-icon, .detail-header-cover-avatar, .tcg-icon-list') // icon画像を待機
  await sleep(500) // 待機（苦肉の策）
  const noImageElem = await page.$('.detail-header-common-icon > .default') // デフォルト画像要素
  if (noImageElem) return '#' // no image
  // TCGの確認
  const tcgElem = await page.$('.tcg-icon-list') // TCG画像要素
  return ((tcgElem ? 'TCG: ' : '') + text).replace(' (Coming Soon)', '')
}
