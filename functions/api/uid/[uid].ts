import type { CacheStorage } from '../../../node_modules/@cloudflare/workers-types/index'
import { API_VER, uidTest } from '../../../src/components/api'
import type { ApiData, EnkaApi, Reliquary, Weapon } from '../../../src/components/api'

// kv key name
const KEY_STATUS = 'enka-status'
const KEY_SHOWCASE = 'showcase-uids'

type Env = {
  kv: KVNamespace
  showcase: D1Database
  statistical: D1Database
}

export const onRequestGet: PagesFunction<Env, 'uid'> = async ctx => {
  const { uid } = ctx.params
  if (ctx.request.headers.get('sec-fetch-site') !== 'same-origin') return resStatus(403)
  if (typeof uid !== 'string' || !uidTest(uid)) return resStatus(400)

  //********** cache section **********
  // cache init
  const cache = (caches as unknown as CacheStorage).default
  const reqUrl = new URL(ctx.request.url)
  const cacheKey = reqUrl.origin + reqUrl.pathname

  // get cache, kv
  const cacheData = await Promise.all([
    cache.match(cacheKey),
    ctx.env.kv.get(KEY_STATUS, { cacheTtl: 180 }), // KEY_STATUS 3m
    ctx.env.kv.get(KEY_SHOWCASE, { cacheTtl: 180 }), // KEY_SHOWCASE 3m
  ])
  const uidCache: ApiData | undefined = await cacheData[0]?.json()

  // response error
  if (cacheData[1]) return resError(cacheData[1], uidCache) // 424/429/500/503

  // response cache
  if (uidCache) {
    const cacheTime = Math.ceil(uidCache.timestamp / 1000 + uidCache.ttl - Date.now() / 1000)
    if (cacheTime > 0) return resJson203(304, { ...uidCache, ttl: cacheTime }, cacheTime)
    if (ctx.request.headers.get('cache-control') === 'force-cache') return resJson203(304, { ...uidCache, ttl: 0 }, 0)
  }

  //if (uid) return resJson({uid}, 200, 60)

  //********** fetch section **********
  const uids: number[] = JSON.parse(cacheData[2])
  const uidData = await Promise.all([
    fetch(`https://enka.network/api/uid/${uid}`, { headers: { 'User-Agent': 'Paimon+@luis.fun/1.0' } }),
    //fetchDB(c, uid),
  ])

  // error response
  const { status } = uidData[0]
  switch (status) {
    case 424:
    case 429:
    case 500:
    case 503:
      await ctx.env.kv.put(KEY_STATUS, status.toString(), { expirationTtl: 180 }) // KEY_STATUS 3m
      //await sendDiscord(status)
      console.log(`fetch enka.status: ${status}, ${uid}`)
      return resError(status, uidCache)
    case 400:
    case 404:
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
      saveShowcase(ctx.env, uid, json, uids),
      saveStatistical(ctx.env, uid, json),
    ]),
  )

  // response
  return res
}

const resStatus = (status: number) => new Response(null, { status })
const resError = (status: string | number, uidCache: ApiData | undefined) =>
  uidCache ? resJson203(status, uidCache, uidCache.ttl) : resStatus(Number(status))
const resJson203 = (status: string | number, uidCache: ApiData | undefined, age: number) =>
  resJson({ ...uidCache, status: Number(status) }, 203, age)
const resJson = (json: unknown, status: number, age: number) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${age}` },
  })

const saveCache = async (cache: CacheStorage['default'], cacheKey: string, res: Response) => {
  res.headers.append('Cache-Control', 's-maxage=7776000') // 90day
  // @ts-expect-error
  await cache.put(cacheKey, res.clone())
}

const saveShowcase = async (env: Env, uid: string, json: ApiData, uids: number[]) => {
  if (!uids.includes(Number(uid))) return
  const db = env.showcase
  const { timestamp } = json
}

const saveStatistical = async (env: Env, uid: string, json: ApiData) => {
  // キャラなし
  if (!json.avatarInfoList) return
  const db = env.statistical
  const { timestamp } = json
  const tableList = (await db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all()).results?.map(
    e => e.name as string,
  )
  const idList = json.avatarInfoList.map(e => `_${e.avatarId}`)
  const diffId = idList.filter(x => tableList.indexOf(x) === -1)
  // テーブル生成
  if (diffId[0])
    await db.batch([
      ...diffId.map(e => db.prepare(`CREATE TABLE IF NOT EXISTS ${e} (uid INT PRIMARY KEY, timestamp INT, data TEXT)`)),
    ])
  await db.batch([
    // プレイヤーデータ保存
    db
      .prepare('REPLACE INTO player (uid, timestamp, data) VALUES(?1, ?2, ?3)')
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
          .prepare(`REPLACE INTO _${e.avatarId} (uid, timestamp, data) VALUES(?1, ?2, ?3)`)
          .bind(uid, timestamp, JSON.stringify(e)),
      ),
  ])
}
