// update action ローカル実行用
import { dataDownload } from '../actions/update/src/data-download.js'
import { dataShrink } from '../actions/update/src/data-shrink.js'
import { uiDownload } from '../actions/update/src/ui-download.js'
import { uiSharp } from '../actions/update/src/ui-sharp.js'
import { wikiScraping } from '../actions/update/src/wiki-scraping.js'

const update = async () => {
  await dataDownload()
  //await wikiScraping()
  await dataShrink()
  await uiDownload()
  await uiSharp()
}
await update()
