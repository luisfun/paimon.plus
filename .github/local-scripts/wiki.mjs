// wiki-id アップデートのみ 新ページを読まない
import { wikiScraping } from '../actions/update/src/wiki-scraping.js'
const update = async () => {
  await wikiScraping('hash', 1000)
  await wikiScraping('null', 200)
  await wikiScraping('new', 30)
}
await update()
