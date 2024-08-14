import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { folder, sleep } from './utils.js'

// @anonsbelle https://ambr.top
// @Algoinde https://enka.network
const ambrUrl = 'https://api.ambr.top/assets/UI/'
const enkaUrl = 'https://enka.network/ui/'

export const uiDownload = async () => {
  // Downloaded Images
  const uiFiles = fs.readdirSync(folder.ui)
  //await getUiImages(uiFiles)
  await getMaterialImages(uiFiles)
}

/**
 * @param {string[]} uiFiles
 */
const getUiImages = async uiFiles => {
  // JSONファイル読み込み
  const jsonNames = ['AvatarExcelConfigData', 'AvatarCostumeExcelConfigData']
  const jsons = {}
  for (const name of jsonNames) {
    jsons[name] = JSON.parse(fs.readFileSync(`${folder.data + name}.json`, 'utf8'))
  }
  // 必要な画像リスト生成
  const imageList = jsons.AvatarExcelConfigData.map(e => e.iconName)
  const ngList = ['UI_AvatarIcon_Kate']
  const dlList = imageList
    .filter(e => !uiFiles.includes(`${e}.png`))
    .filter(e => !ngList.includes(e))
    .map(e => `${e}.png`)
  dlList.length = 3
  //console.log(dlList)
  //
  for (const name of dlList) {
    const res = await fetch(ambrUrl + name)
    if (res.ok) pipeline(res.body, fs.createWriteStream(folder.ui + name))
    else console.log('NG', name)
  }
}

/**
 * @param {string[]} uiFiles
 */
const getMaterialImages = async uiFiles => {
  // Material Image List
  const imageList = JSON.parse(fs.readFileSync(`${folder.dist}material.json`, 'utf8')).map(e => e.icon)
  const dlList = imageList.filter(e => !uiFiles.includes(`${e}.png`)).map(e => `${e}.png`)
  if (!dlList.length) return
  dlList.length = 100
  for (const name of dlList) {
    const res = await fetch(ambrUrl + name)
    if (res.ok) pipeline(res.body, fs.createWriteStream(folder.ui + name))
    else console.log('NG', name)
    await sleep(100)
  }
}
