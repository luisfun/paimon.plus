import type { CacheStorage } from '../../../node_modules/@cloudflare/workers-types/index'
import { API_VER, uidTest } from '../../../src/components/api'
import type { ApiData, EnkaApi, Reliquary, Weapon } from '../../../src/components/api'

type Env = {
  //kv: KVNamespace
  showcase: D1Database
  statistical: D1Database
}

type DBKVResult = { key: string; value: string; updated_at: number } | undefined

const KEY_STATUS = 'enka-status'
const KEY_UIDS = 'showcase-uids'
const KEY_TABLE_NAMES = 'table-names'
const QUERY_GET_TABLE = 'SELECT name FROM sqlite_master WHERE type="table"'
const QUERY_GET_KV = 'SELECT * FROM key_value WHERE key = ? LIMIT 1'
const QUERY_SET_KV = 'REPLACE INTO key_value (key, updated_at, value) VALUES(?, ?, ?)'
const QUERY_SET_UID = 'REPLACE INTO cache_uid (uid, updated_at, status, data) VALUES(?, ?, ?, ?)'

export const onRequestGet: PagesFunction<Env, 'uid'> = async ctx => {
  const { uid } = ctx.params
  if (ctx.request.headers.get('sec-fetch-site') !== 'same-origin') return resStatus(403)
  if (typeof uid !== 'string' || !uidTest(uid)) return resStatus(400)

  //********** create table **********
  //await createTable(ctx.env)

  //********** cache section **********
  // cache init
  const cache = (caches as unknown as CacheStorage).default
  const reqUrl = new URL(ctx.request.url)
  const cacheKey = reqUrl.origin + reqUrl.pathname

  // get db, cache
  const rawCache = await Promise.all([
    (async () => {
      const db = ctx.env.showcase
      const results = (
        await db.batch([
          db.prepare('SELECT * FROM cache_uid WHERE uid = ? LIMIT 1').bind(uid),
          db.prepare(QUERY_GET_KV).bind(KEY_STATUS),
          db.prepare(QUERY_GET_KV).bind(KEY_UIDS),
        ])
      ).map(e => e.results)
      const uidCache = results[0][0] as { uid: string; status: number; data: string; updated_at: number } | undefined
      const enkaStatus = results[1][0] as DBKVResult
      const storedUids = JSON.parse((results[1][0] as DBKVResult)?.value || '[]') as string[]
      return { uidCache, enkaStatus, storedUids }
    })(),
    cache.match(cacheKey),
  ])
  const { uidCache, enkaStatus, storedUids } = rawCache[0]
  const uidCacheData = uidCache ? (JSON.parse(uidCache.data) as ApiData) : await rawCache[1]?.json<ApiData>()
  const timestamp = Date.now()
  const isValid = (result: { updated_at: number } | undefined, sec: number) =>
    !!result && result.updated_at + sec * 1e3 > timestamp
  const resCache = (age: number) => (uidCacheData ? res({ ...uidCacheData, status: 304 }, 203, age) : resStatus(599))
  const resError = (status: number) =>
    uidCacheData ? res({ ...uidCacheData, status }, 203, uidCacheData.ttl) : resStatus(status)

  // response error
  if (isValid(uidCache, 180) && (uidCache?.status === 400 || uidCache?.status === 404)) return resError(uidCache.status)
  if (isValid(enkaStatus, 180)) return resError(Number(enkaStatus.value)) // 424/429/500/503

  // response cache
  if (isValid(uidCache, 60)) {
    //const uidAllData = getDBShowcase(ctx.env, uid)
    const age = Math.ceil(uidCacheData.timestamp / 1000 + uidCacheData.ttl - timestamp / 1000)
    if (age > 0) return resCache(age)
  }
  // response force cache
  if (ctx.request.headers.get('cache-control') === 'force-cache' && uidCacheData) return resCache(0)

  //if (uid) return resJson({uid}, 200, 60)

  //********** fetch section **********
  const uidData = await Promise.all([
    fetch(`https://enka.network/api/uid/${uid}`, { headers: { 'User-Agent': 'Paimon+@luis.fun/1.0' } }),
    //getDBShowcase(ctx.env, uid),
  ])

  // error response
  const { status } = uidData[0]
  switch (status) {
    case 424:
    case 429:
    case 500:
    case 503:
      await putDBKV(ctx.env.showcase, KEY_STATUS, Date.now(), status.toString())
      //await sendDiscord(status)
      console.log(`fetch enka.status: ${status}, ${uid}`)
      return resError(status)
    case 400:
    case 404:
      await putUidCache(ctx.env, uid, Date.now(), status, '')
      return resError(status)
  }
  // other error
  if (status < 200 || 399 < status) {
    console.warn(`unknown error: ${status}`)
    return resError(599)
  }

  const json: ApiData = { ...(await uidData[0].json<EnkaApi>()), ver: API_VER, timestamp: Date.now() }
  const response = res(json, status, json.ttl)
  // save
  ctx.waitUntil(
    Promise.all([
      saveCache(cache, cacheKey, response),
      saveShowcase(ctx.env, uid, json, storedUids),
      saveStatistical(ctx.env, uid, json),
    ]),
  )

  // response
  return response
}

//********** create table **********
const createTable = async (env: Env) => {
  const queryCreateKv = 'CREATE TABLE IF NOT EXISTS key_value (key TEXT PRIMARY KEY, updated_at INT, value TEXT)'
  // showcase
  let db = env.showcase
  let tableNames = (await db.prepare(QUERY_GET_TABLE).raw<[string]>()).map(e => e[0])
  if (!tableNames.includes('key_value')) await db.prepare(queryCreateKv).all()
  if (!tableNames.includes('cache_uid'))
    await db
      .prepare('CREATE TABLE IF NOT EXISTS cache_uid (uid TEXT PRIMARY KEY, updated_at INT, status INT, data TEXT)')
      .all()
  // statistical sources
  db = env.statistical
  tableNames = (await db.prepare(QUERY_GET_TABLE).raw<[string]>()).map(e => e[0])
  if (!tableNames.includes('key_value')) await db.prepare(queryCreateKv).all()
  if (!tableNames.includes('player'))
    await db.prepare('CREATE TABLE IF NOT EXISTS player (uid TEXT PRIMARY KEY, updated_at INT, data TEXT)').all()
}

const resStatus = (status: number) => new Response(null, { status })
// biome-ignore format: ternary operator
const res = (data: ApiData | undefined, status: number, age: number) =>
  !data && Number(status) < 400 ? resStatus(599) :
  !data ? resStatus(status) :
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${age}` } })

const putUidCache = (env: Env, uid: string, timestamp: number, status: number, data: string) =>
  env.showcase.prepare(QUERY_SET_UID).bind(uid, timestamp, status, data).all<undefined>()
const putDBKV = (db: D1Database, key: string, timestamp: number, value: string) =>
  db.prepare(QUERY_SET_KV).bind(key, timestamp, value).all<undefined>()

const getDBShowcase = async (env: Env, uid: string) => {}

const saveCache = async (cache: CacheStorage['default'], cacheKey: string, res: Response) => {
  res.headers.append('Cache-Control', 's-maxage=15552000') // 180day
  // @ts-expect-error
  await cache.put(cacheKey, res.clone())
}

const saveShowcase = async (env: Env, uid: string, json: ApiData, uids: string[]) => {
  const db = env.showcase
  const { timestamp } = json
  // cache
  await db.batch([
    db.prepare(QUERY_SET_UID).bind(uid, timestamp, 200, JSON.stringify(json)),
    db.prepare('DELETE FROM cache_uid WHERE updated_at < ?').bind(timestamp - 180_000),
  ])
  // save
  if (!uids?.includes(uid)) return
  //********************************
}

const saveStatistical = async (env: Env, uid: string, json: ApiData) => {
  // キャラなし
  if (!json.avatarInfoList) return
  const db = env.statistical
  const { timestamp } = json
  const tableNames = JSON.parse(
    (await db.prepare(QUERY_GET_KV).bind(KEY_TABLE_NAMES).first<DBKVResult>())?.value || '[]',
  ) as string[]
  const idList = json.avatarInfoList.map(e => `_${e.avatarId}`)
  const diffId = idList.filter(e => tableNames.indexOf(e) === -1)
  // テーブル生成
  if (diffId[0]) {
    const oldNames = (await db.prepare(QUERY_GET_TABLE).raw<[string]>()).map(e => e[0])
    await db.batch([
      ...diffId.flatMap(e =>
        db.prepare(`CREATE TABLE IF NOT EXISTS ${e} (uid TEXT PRIMARY KEY, updated_at INT, data TEXT)`),
      ),
      db.prepare(QUERY_SET_KV).bind(KEY_TABLE_NAMES, timestamp, JSON.stringify([...oldNames, ...diffId])),
    ])
  }
  await db.batch([
    // プレイヤーデータ保存
    db
      .prepare('REPLACE INTO player (uid, updated_at, data) VALUES(?, ?, ?)')
      .bind(uid, timestamp, JSON.stringify(json.playerInfo)),
    // Characterデータ保存
    ...json.avatarInfoList
      .filter(e => {
        const sLvMap = Object.values(e.skillLevelMap)
        const weaponInfo: Weapon[] = []
        const reliquaryList: Reliquary[] = []
        for (const equip of e.equipList) {
          if ('weapon' in equip) weaponInfo.push(equip)
          if ('reliquary' in equip) reliquaryList.push(equip)
        }
        // 装備足りないとき
        if (!weaponInfo[0] || !reliquaryList[0]) return false
        const wLv = weaponInfo[0].weapon.level
        const rLvMap = reliquaryList.map(e => e.reliquary.level)
        //天賦Lv8↑ 武器Lv80↑ 聖遺物Lv16↑×5 (1~21)
        if (Math.max(...sLvMap) >= 8 && wLv >= 80 && rLvMap.length === 5 && Math.min(...rLvMap) > 16) return true
        return false
      })
      .map(e =>
        db
          .prepare(`REPLACE INTO _${e.avatarId} (uid, updated_at, data) VALUES(?, ?, ?)`)
          .bind(uid, timestamp, JSON.stringify(e)),
      ),
  ])
}
