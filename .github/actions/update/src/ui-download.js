import fs from 'fs'
import { pipeline } from 'stream/promises'

import { folder } from './utils.js'

// @anonsbelle https://ambr.top
// @Algoinde https://enka.network
const ambrUrl = 'https://api.ambr.top/assets/UI/'
const enkaUrl = 'https://enka.network/ui/'

export const uiDownload = async () => {
  await getUiImages()
}

const getUiImages = async () => {
  // 既存の画像リスト
  const uiFiles = fs.readdirSync(folder.ui)
  //console.log(uiFiles)
  // JSONファイル読み込み
  const jsonNames = ['AvatarExcelConfigData', 'AvatarCostumeExcelConfigData']
  const jsons = {}
  for (const name of jsonNames) {
    jsons[name] = JSON.parse(fs.readFileSync(folder.data + name + '.json', 'utf8'))
  }
  // 必要な画像リスト生成
  const imageList = jsons.AvatarExcelConfigData.map(e => e.iconName)
  const ngList = ['UI_AvatarIcon_Kate']
  const dlList = imageList
    .filter(e => !uiFiles.includes(e + '.png'))
    .filter(e => !ngList.includes(e))
    .map(e => e + '.png')
  dlList.length = 3
  //console.log(dlList)
  //
  for (const name of dlList) {
    const res = await fetch(ambrUrl + name)
    if (res.ok) pipeline(res.body, fs.createWriteStream(folder.ui + name))
    else console.log('NG', name)
  }
}
