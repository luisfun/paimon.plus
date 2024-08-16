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
  const downloadedFiles = fs.readdirSync(folder.ui).map(e => e.slice(0, -4)).filter(e => iconNames.includes(e))
  const iconNamesMin = iconNames.map(e => `${e}_Min`)
  const sharpedFiles = fs.readdirSync(folder.webp).map(e => e.slice(0, -9)).filter(e => iconNamesMin.includes(e))
  const diffFiles = downloadedFiles.filter(e => sharpedFiles.indexOf(e) === -1)
  if (!diffFiles[0]) return
  await Promise.all(
    diffFiles.map(name =>
      sharp(`${folder.ui + name}.png`)
        .resize(128)
        .extract({left: 16, top: 1, width: 96, height: 96})
        .webp()
        .toFile(`${folder.webp + name}_Min.webp`),
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
