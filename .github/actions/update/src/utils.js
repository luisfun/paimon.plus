export const folder = {
  data: 'src/game/.data/',
  text: 'src/game/.text/',
  wiki: 'src/game/.wiki/',
  dist: 'src/game/',
  ui: 'src/game/.ui/',
  webp: 'public/images/ui/',
}

/**
 * 待機
 * @param {number} ms milliseconds
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
