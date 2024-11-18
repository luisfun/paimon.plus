import type { CacheStorage } from '../node_modules/@cloudflare/workers-types/index'

export const resStatus = (status: number) => new Response(null, { status })

/**
 * cache.put(requestUrl, response)
 */
export const cacheSet = async (
  cache: CacheStorage['default'],
  requestUrl: string,
  response: Response,
  sMaxage: number,
) => {
  response.headers.append('Cache-Control', `s-maxage=${sMaxage}`)
  // @ts-expect-error
  await cache.put(requestUrl, response.clone())
}

/*
 * SQL QUERY
 */
export const QUERY_GET_TABLE = 'SELECT name FROM sqlite_master WHERE type="table"'

/*
 * D1 key_value REPLACE
 */
export const QUERY_SET_KV = 'REPLACE INTO key_value (key, updated_at, value) VALUES(?, ?, ?)'

export const dbkvSet = (db: D1Database, key: string, timestamp: number, value: string) =>
  db.prepare(QUERY_SET_KV).bind(key, timestamp, value).all<undefined>()

/*
 * D1 key_value SELECT
 */
export type DBKVResult = { key: string; value: string; updated_at: number } | undefined

export const QUERY_GET_KV = 'SELECT * FROM key_value WHERE key = ? LIMIT 1'

export const dbkvGet = (db: D1Database, key: string) => db.prepare(QUERY_GET_KV).bind(key).first<DBKVResult>()

/*
 * compress
 */
export const compress = (obj: object) =>
  new Response(new Blob([JSON.stringify(obj)]).stream().pipeThrough(new CompressionStream('deflate-raw'))).blob()

export const decompress = <T extends object = object>(blob: Blob): Promise<T> =>
  new Response(blob.stream().pipeThrough(new DecompressionStream('deflate-raw'))).json()

/*
const compressed = await compress({ a: 'hey!' })
const decompressed = await decompress(compressed)
*/
