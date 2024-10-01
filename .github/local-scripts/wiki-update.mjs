// wiki-id アップデートのみ 新ページを読まない
import { wikiScraping } from '../actions/update/src/wiki-scraping.js'
wikiScraping('hash', 1000)
wikiScraping('null', 100)
wikiScraping('new', 100)
