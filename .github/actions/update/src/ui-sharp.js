import fs from 'node:fs'
import sharp from 'sharp'
import { folder } from './utils.js'

export const uiSharp = async () => {
  await createWebp()
  await createMinIcon()
  //await otherSharp()
}

const createWebp = async () => {
  const uiFiles = fs.readdirSync(folder.ui).map(e => e.slice(0, -4))
  const webpFiles = fs.readdirSync(folder.webp).map(e => e.slice(0, -5))
  const diffFiles = uiFiles.filter(e => webpFiles.indexOf(e) === -1)
  if (!diffFiles[0]) return
  await Promise.all(
    diffFiles.map(name =>
      sharp(`${folder.ui + name}.png`)
        .webp({ lossless: true })
        .toFile(`${folder.webp + name}.webp`),
    ),
  )
}

const createMinIcon = async () => {
  const iconNames = JSON.parse(fs.readFileSync(`${folder.dist}avatar.json`, 'utf8')).map(e => e.iconName)
  const downloadedFiles = fs
    .readdirSync(folder.ui)
    .map(e => e.slice(0, -4))
    .filter(e => iconNames.includes(e))
  const sharpedFiles = fs
    .readdirSync(folder.webp)
    .map(e => e.slice(4, -5))
    .filter(e => iconNames.includes(e))
  const diffFiles = downloadedFiles.filter(e => sharpedFiles.indexOf(e) === -1)
  if (!diffFiles[0]) return
  await Promise.all(
    diffFiles.map(name =>
      sharp(`${folder.ui + name}.png`)
        .resize(256)
        .extract({ left: 32, top: 2, width: 192, height: 192 })
        .webp()
        .toFile(`${folder.webp}Min_${name}.webp`),
    ),
  )
}

const otherSharp = async () => {
  const imgFolder = 'src/game/element/'
  const imgDist = 'public/images/element/'
  const imgFiles = fs.readdirSync(imgFolder).map(e => e.slice(0, -4))
  await Promise.all(
    imgFiles.map(name =>
      sharp(`${imgFolder + name}.png`)
        .webp({ lossless: true })
        .toFile(`${imgDist + name}.webp`),
    ),
  )
}
