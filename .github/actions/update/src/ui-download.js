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
  await getAvatarImages(uiFiles)
  await getWeaponImages(uiFiles)
  await getMaterialImages(uiFiles)
  await getProfilePicture(uiFiles)
}

/**
 * @param {string[]} uiFiles
 */
const getAvatarImages = async uiFiles => {
  const avatars = JSON.parse(fs.readFileSync(`${folder.dist}avatar.json`, 'utf8'))
  const ambrDLList = []
  const enkaDLList = []
  for (const avatar of avatars) {
    const key = avatar.key
    ambrDLList.push(`UI_AvatarIcon_${key}`)
    enkaDLList.push(`UI_AvatarIcon_Side_${key}`)
    ambrDLList.push(`UI_Gacha_AvatarImg_${key}`)
    if (avatar.costumes)
      for (const key of avatar.costumes.map(e => e.key)) {
        ambrDLList.push(`UI_AvatarIcon_${key}`)
        enkaDLList.push(`UI_AvatarIcon_Side_${key}`)
        ambrDLList.push(`UI_Costume_${key}`)
      }
  }
  await Promise.all([
    download(ambrUrl, ambrDLList, uiFiles),
    download(enkaUrl, enkaDLList, uiFiles)
  ])
}

const getWeaponImages = async uiFiles => {
  const imageList = JSON.parse(fs.readFileSync(`${folder.dist}weapon.json`, 'utf8')).flatMap(e => [
    e.icon,
    `${e.icon}_Awaken`,
  ])
  await download(ambrUrl, imageList, uiFiles)
}

/**
 * @param {string[]} uiFiles
 */
const getMaterialImages = async uiFiles => {
  const imageList = JSON.parse(fs.readFileSync(`${folder.dist}material.json`, 'utf8')).map(e => e.icon)
  await download(ambrUrl, imageList, uiFiles)
}

/**
 * @param {string[]} uiFiles
 */
const getProfilePicture = async uiFiles => {
  const imageList = Object.values(JSON.parse(fs.readFileSync(`${folder.dist}profile-picture.json`, 'utf8')))
  await download(enkaUrl, imageList, uiFiles)
}

/**
 * @param {string} baseUrl
 * @param {string[]} imageList
 * @param {string[]} uiFiles
 */
const download = async (baseUrl, imageList, uiFiles) => {
  const names = imageList.filter(e => e && !uiFiles.includes(`${e}.png`)).map(e => `${e}.png`)
  if (!names.length) return
  if (names.length > 100) names.length = 100
  for (const name of names) {
    const res = await fetch(baseUrl + name)
    if (res.ok) pipeline(res.body, fs.createWriteStream(folder.ui + name))
    else console.log(`NG: ${name}`)
    await sleep(100)
  }
}
