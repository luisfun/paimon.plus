import fs from 'node:fs'
import sharp from 'sharp'
import { folder } from './utils.js'

export const uiSharp = async () => {
  //await otherSharp()
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
