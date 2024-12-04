import type { Avatar } from './types'

type AvatarData = Avatar & { id: string; avatarId: number | undefined }
type ScoreData = { data: AvatarData[]; explorScore: number; domainScore: number }
type CalcScoreFunc = (data: AvatarData[], map: Map<string, ScoreData>) => void

export const singleTeam = (ownedList: AvatarData[], favoriteIds: string[], globalParam: undefined) => {
  const ROLL_LIMIT = 15
  const RESULT_LIMIT = 10

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
    const domainScore = calcDomainScore(data)
    const explorScore = calcExplorScore(data, domainScore)
    const tmp = resultMap.get(key)
    if (!tmp || tmp.domainScore < domainScore) resultMap.set(key, { data, explorScore, domainScore })
  }

  ////////////////////////////// 結果と後処理 //////////////////////////////

  // 計算と結果
  const result = totalHit(calcScore)
  const maxScore = {
    explor: Math.max(...result.map(e => e.explorScore)),
    domain: Math.max(...result.map(e => e.domainScore)),
  }
  // explor
  let explorScoreList: ScoreData[] = []
  for (let i = 0; i < maxScore.explor; i++) {
    if (RESULT_LIMIT < explorScoreList.length) break
    explorScoreList = result.filter(e => maxScore.explor - i <= e.explorScore)
  }
  explorScoreList.sort((a, b) => b.explorScore - a.explorScore)
  // domain
  let domainScoreList: ScoreData[] = []
  for (let i = 0; i < maxScore.domain; i++) {
    if (RESULT_LIMIT < domainScoreList.length) break
    domainScoreList = result.filter(e => maxScore.domain - i <= e.domainScore)
  }
  domainScoreList.sort((a, b) => b.domainScore - a.domainScore)

  return { explorScoreList, domainScoreList }
}
