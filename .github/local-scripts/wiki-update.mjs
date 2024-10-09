// wiki-id アップデートのみ 新ページを読まない
import { wikiScraping } from '../actions/update/src/wiki-scraping.js'
const update = async () => {
  await wikiScraping('hash', 1000)
  await wikiScraping('null', 100)
  await wikiScraping('new', 100)
}
await update()
