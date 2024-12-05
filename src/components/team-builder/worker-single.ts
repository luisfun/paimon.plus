import type { Avatar } from './types'

type AvatarData = Avatar & { id: string; avatarId: number | undefined }
type ScoreData = { data: AvatarData[]; explor: number; domain: number }
type CalcScoreFunc = (data: AvatarData[], map: Map<string, ScoreData>) => void

export const singleTeam = (ownedList: AvatarData[], favoriteIds: string[], globalParam: undefined) => {
  const ROLL_LIMIT = 15
  const RESULT_LIMIT = 100
  const MAX_RESULT_GROUP = 5

  ////////////////////////////// 組み合わせロジック //////////////////////////////

  // お気に入りのrollを破壊するかどうか
  const favoriteList = ownedList.filter(e => favoriteIds.includes(e.id))
  const favoriteRoll = ['main', 'sub', 'support', 'healer'].map((roll, i) =>
    favoriteList.reduce(
      (count, fav) =>
        count + Number(fav.filter?.roll ? fav.filter.roll === roll : Math.max(...fav.score) === fav.score[i]),
      0,
    ),
  )
  // biome-ignore format: ternary operator
  const isRollBreak =
    1 < favoriteRoll[0] || 1 < favoriteRoll[3] ? (i: number) => i === 1 || i === 2 :
    2 < favoriteRoll[1] + favoriteRoll[2] ? (i: number) => i === 0 : false

  // 計算量の削減（低スコアを排除）
  const sortedIdMap = ['main', 'sub', 'support', 'healer'].map((roll, i) =>
    [...ownedList]
      .sort(
        (a, b) =>
          (b.filter?.roll === roll ? b.filter.score : b.score[i]) -
          (a.filter?.roll === roll ? a.filter.score : a.score[i]),
      )
      .map(e => e.id),
  )
  for (const ids of sortedIdMap) if (ROLL_LIMIT < ids.length) ids.length = ROLL_LIMIT
  const filteredIds = [...new Set([...sortedIdMap.flat(), ...favoriteIds])]

  // 計算に使うリスト
  const list = ownedList
    .filter(e => filteredIds.includes(e.id))
    .map(e =>
      isRollBreak && favoriteIds.includes(e.id)
        ? ({ ...e, score: e.score.map((num, i) => num + 0.001 * Number(isRollBreak(i))) } as AvatarData)
        : e,
    )

  // 総当たり計算
  const totalHit = (calcScore: CalcScoreFunc) => {
    const resultMap = new Map<string, ScoreData>() // key: ids
    const isZero = (roll: AvatarData, index: number[]) => index.every(i => roll.score[i] === 0) // ゼロスコア排除
    const hasIds = (data: AvatarData[], roll: AvatarData) => data.map(e => e.avatarId).includes(roll.avatarId) // 重複回避
    for (const main of list) {
      if (isZero(main, [0])) continue
      for (const subsup1 of list) {
        if (isZero(subsup1, [1, 2])) continue
        if (hasIds([main], subsup1)) continue
        for (const subsup2 of list) {
          if (isZero(subsup2, [1, 2])) continue
          if (hasIds([main, subsup1], subsup2)) continue
          for (const heal of list) {
            if (isZero(heal, [3])) continue
            if (hasIds([main, subsup1, subsup2], heal)) continue
            const ids = [main, subsup1, subsup2, heal].map(e => e.id)
            if (!favoriteIds.every(id => ids.includes(id))) continue
            calcScore([main, subsup1, subsup2, heal], resultMap)
          }
        }
      }
    }
    return Array.from(resultMap.values())
  }

  ////////////////////////////// スコアロジック //////////////////////////////

  // 秘境スコア
  const calcDomainScore = (data: AvatarData[]) => {
    return data.reduce((sum, e) => sum + Math.max(...e.score), 0)
  }
  // 探索スコア
  const calcExplorScore = (data: AvatarData[], domainScore: number) => {
    return domainScore + 3
  }
  // まとめ
  const calcScore: CalcScoreFunc = (data, resultMap) => {
    const key = data
      .map(e => e.id)
      .sort()
      .join('&')
    const domain = calcDomainScore(data)
    const explor = calcExplorScore(data, domain)
    const tmp = resultMap.get(key)
    if (!tmp || tmp.domain < domain) resultMap.set(key, { data, explor, domain })
  }

  ////////////////////////////// 3キャラ探索 //////////////////////////////

  const scoreFilter = (
    result: ScoreData[],
    maxScore: { explor: number; domain: number },
    index: 'explor' | 'domain',
  ) => {
    let list: ScoreData[] = []
    for (let i = maxScore[index]; i; i--) {
      if (RESULT_LIMIT < list.length) break
      list = result.filter(e => i <= e[index])
    }
    return list.sort((a, b) => b.explor - a.explor)
  }

  const calc3CharaSet = (list: ScoreData[]) => {
    const map = new Map<string, Map<string, ScoreData[]>>() // main-id, {other-ids, ScoreData[]}
    for (const score of list) {
      const mainKey = score.data[0].id
      const subKeys = [1, 2, 3].map(i => [score.data[i].id, score.data[(i % 3) + 1].id].sort().join('&'))
      const main = map.get(mainKey)
      if (!main) {
        const subMap = new Map<string, ScoreData[]>()
        for (const key of subKeys) subMap.set(key, [score])
        map.set(mainKey, subMap)
      } else {
        for (const key of subKeys) {
          const sub = main.get(key)
          if (!sub) main.set(key, [score])
          else main.set(key, [...sub, score])
        }
      }
    }
    const result: { base: AvatarData[]; all: ScoreData[] }[] = []
    for (const [mainKey, subMap] of map) {
      let keyOfMax = ''
      let maxLength = 0
      for (const [subKey, scoreList] of subMap) {
        if (maxLength < scoreList.length) {
          keyOfMax = subKey
          maxLength = scoreList.length
        }
      }
      const sub = subMap.get(keyOfMax)
      if (!sub) continue // error
      const ids = [mainKey, ...keyOfMax.split('&')]
      const base = sub[0].data.filter(e => ids.includes(e.id))
      result.push({ base, all: sub })
    }
    if (MAX_RESULT_GROUP < result.length) result.length = MAX_RESULT_GROUP
    return result
  }

  ////////////////////////////// 結果と後処理 //////////////////////////////

  // 計算と結果
  const result = totalHit(calcScore)
  const maxScore = {
    explor: result.map(e => e.explor).reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY),
    domain: result.map(e => e.domain).reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY),
  }
  // 3キャラPU
  const explor = calc3CharaSet(scoreFilter(result, maxScore, 'explor'))
  const domain = calc3CharaSet(scoreFilter(result, maxScore, 'domain'))

  return { explor, domain }
}
