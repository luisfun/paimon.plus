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
const QUERY_GET_KV = 'SELECT * FROM key_value WHERE key = ? LIMIT 1'
const QUERY_SET_KV = 'REPLACE INTO key_value (key, updated_at, value) VALUES(?, ?, ?)'

export const onRequestGet: PagesFunction<Env, 'uid'> = async ctx => {
  const { uid } = ctx.params
  if (ctx.request.headers.get('sec-fetch-site') !== 'same-origin') return resStatus(403)
  if (typeof uid !== 'string' || !uidTest(uid)) return resStatus(400)

  await createTable(ctx.env) //********** create table **********
  //********** cache section **********
  // cache init
  const cache = (caches as unknown as CacheStorage).default
  const reqUrl = new URL(ctx.request.url)
  const cacheKey = reqUrl.origin + reqUrl.pathname

  // get db, cache
  const cacheData = await Promise.all([
    (async () => {
      const db = ctx.env.showcase
      const results = (
        await db.batch([
          db.prepare('SELECT * FROM cache_uid WHERE uid = ? LIMIT 1').bind(uid),
          db.prepare(QUERY_GET_KV).bind(KEY_STATUS),
          db.prepare(QUERY_GET_KV).bind(KEY_UIDS),
        ])
      ).map(e => e.results)
      const cache = results[0][0] as { uid: string; data: string; updated_at: number } | undefined
      const status = results[1][0] as DBKVResult
      const uids = JSON.parse((results[1][0] as DBKVResult)?.value || '[]') as string[]
      return { cache, status, uids }
    })(),
    cache.match(cacheKey),
  ])
  const uidCache: ApiData | undefined = await cacheData[1]?.json()
  const isValid = (result: { updated_at: number } | undefined, sec: number) =>
    !!result && result.updated_at + sec * 1e3 > Date.now()

  // response error
  const uidStatus = cacheData[0].cache?.data
  if (isValid(cacheData[0].cache, 180) && (uidStatus === '400' || uidStatus === '404'))
    return resError(uidStatus, uidCache)
  if (isValid(cacheData[0].status, 180)) return resError(cacheData[0].status.value, uidCache) // 424/429/500/503

  // response cache
  if (isValid(cacheData[0].cache, 60)) {
    const uidData: ApiData = JSON.parse(cacheData[0].cache.data)
    //const uidAllData = getDBShowcase(ctx.env, uid)
    const age = Math.ceil(uidData.timestamp / 1000 + uidData.ttl - Date.now() / 1000)
    if (age > 0) return resJson203(304, uidData, age)
  }
  // response force cache
  if (ctx.request.headers.get('cache-control') === 'force-cache' && uidCache) return resJson203(304, uidCache, 0)

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
      await putDB('kv', ctx.env, KEY_STATUS, status.toString(), Date.now())
      //await sendDiscord(status)
      console.log(`fetch enka.status: ${status}, ${uid}`)
      return resError(status, uidCache)
    case 400:
    case 404:
      await putDB('uid', ctx.env, uid, status.toString(), Date.now())
      return resError(status, uidCache)
  }
  // other error
  if (status < 200 || 399 < status) {
    console.warn(`unknown error: ${status}`)
    return resStatus(599)
  }

  const json = { ...((await uidData[0].json()) as EnkaApi), ver: API_VER, timestamp: Date.now() }
  const res = resJson(json, status, json.ttl)
  // save
  ctx.waitUntil(
    Promise.all([
      saveCache(cache, cacheKey, res),
      saveShowcase(ctx.env, uid, json, cacheData[0].uids),
      saveStatistical(ctx.env, uid, json),
    ]),
  )

  // response
  return res
}

//********** create table **********
const createTable = async (env: Env) => {
  // showcase
  let db = env.showcase
  let tableList = (await db.prepare('SELECT name FROM sqlite_master WHERE type="table"').raw<{ name: string }>()).map(
    e => e.name,
  )
  if (!tableList.includes('key_value'))
    await db.prepare('CREATE TABLE IF NOT EXISTS key_value (key TEXT PRIMARY KEY, updated_at INT, value TEXT)').all()
  if (!tableList.includes('cache_uid'))
    await db.prepare('CREATE TABLE IF NOT EXISTS cache_uid (uid TEXT PRIMARY KEY, updated_at INT, data TEXT)').all()
  // statistical sources
  db = env.statistical
  tableList = (await db.prepare('SELECT name FROM sqlite_master WHERE type="table"').raw<{ name: string }>()).map(
    e => e.name,
  )
  if (!tableList.includes('key_value'))
    await db.prepare('CREATE TABLE IF NOT EXISTS key_value (key TEXT PRIMARY KEY, updated_at INT, value TEXT)').all()
  if (!tableList.includes('player'))
    await db.prepare('CREATE TABLE IF NOT EXISTS player (uid TEXT PRIMARY KEY, updated_at INT, data TEXT)').all()
}

const resStatus = (status: number) => new Response(null, { status })
const resError = (status: string | number, uidCache: ApiData | undefined) =>
  uidCache ? resJson203(status, uidCache, uidCache.ttl) : resStatus(Number(status))
const resJson203 = (status: string | number, apiData: ApiData | undefined, age: number) =>
  resJson({ ...apiData, status: Number(status) }, 203, age)
const resJson = (json: unknown, status: number, age: number) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${age}` },
  })

const getDB = async (type: 'kv', env: Env, key: string) => {
  const db = env.showcase
  const query = 'SELECT * FROM key_value WHERE key = ? LIMIT 1'
  return await db.prepare(query).bind(key).first<{ key: string; value: string; updated_at: number }>()
}
const putDB = async (type: 'kv' | 'uid', env: Env, key: string, value: string, timestamp: number) => {
  const db = env.showcase
  const query = type === 'uid' ? 'REPLACE INTO cache_uid (uid, updated_at, data) VALUES(?, ?, ?)' : QUERY_SET_KV
  return await db.prepare(query).bind(key, timestamp, value).all<undefined>()
}

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
    db
      .prepare('REPLACE INTO cache_uid (uid, updated_at, data) VALUES(?, ?, ?)')
      .bind(uid, timestamp, JSON.stringify(json)),
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
  const diffId = idList.filter(x => tableNames.indexOf(x) === -1)
  // テーブル生成
  if (diffId[0]) {
    const oldNames = (
      await db.prepare('SELECT name FROM sqlite_master WHERE type="table"').raw<{ name: string }>()
    ).map(e => e.name)
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
