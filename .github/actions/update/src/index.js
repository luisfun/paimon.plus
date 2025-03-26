import { dataDownload } from './data-download.js'
import { dataShrink } from './data-shrink.js'
import { uiDownload } from './ui-download.js'
import { uiSharp } from './ui-sharp.js'
import { wikiScraping } from './wiki-scraping.js'

const update = async () => {
  //await dataDownload()
  await wikiScraping()
  await dataShrink()
  await uiDownload()
  await uiSharp()
}
await update()
