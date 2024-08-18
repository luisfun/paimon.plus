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
  await getUiImages(uiFiles)
  await getMaterialImages(uiFiles)
}

/**
 * @param {string[]} uiFiles
 */
const getUiImages = async uiFiles => {
  const avatar = JSON.parse(fs.readFileSync(`${folder.dist}avatar.json`, 'utf8'))
  const imageList = avatar.map(e => e.iconName)
  const dlList = imageList.filter(e => !uiFiles.includes(`${e}.png`)).map(e => `${e}.png`)
  if (dlList.length > 100) dlList.length = 100
  for (const name of dlList) {
    if (!name) continue
    const res = await fetch(ambrUrl + name)
    if (res.ok) pipeline(res.body, fs.createWriteStream(folder.ui + name))
    else console.log('NG', name)
    await sleep(100)
  }
}

/**
 * @param {string[]} uiFiles
 */
const getMaterialImages = async uiFiles => {
  const imageList = JSON.parse(fs.readFileSync(`${folder.dist}material.json`, 'utf8')).map(e => e.icon)
  const dlList = imageList.filter(e => !uiFiles.includes(`${e}.png`)).map(e => `${e}.png`)
  if (!dlList.length) return
  if (dlList.length > 100) dlList.length = 100
  for (const name of dlList) {
    if (!name) continue
    const res = await fetch(ambrUrl + name)
    if (res.ok) pipeline(res.body, fs.createWriteStream(folder.ui + name))
    else console.log('NG', name)
    await sleep(100)
  }
}
