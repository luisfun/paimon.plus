import type { Avatar } from './types'

type AvatarData = Avatar & { id: string; avatarId: number | undefined }
type ScoreData = { data: AvatarData[]; explorScore: number; domainScore: number }

export const singleTeam = (ownedList: AvatarData[], globalParam: undefined) => {
  const PREPROCESS_LIMIT = 15
  const RESULT_LIMIT = 10

  // 計算量削減
  const sortedIdMap = ['main', 'sub', 'support', 'healer'].map((roll, i) =>
    [...ownedList]
      .sort(
        (a, b) =>
          (b.filter?.roll === roll ? b.filter.score : b.score[i]) -
          (a.filter?.roll === roll ? a.filter.score : a.score[i]),
      )
      .map(e => e.id),
  )
  for (const ids of sortedIdMap) if (PREPROCESS_LIMIT < ids.length) ids.length = PREPROCESS_LIMIT
  const filteredIds = [...new Set(sortedIdMap.flat())]
  // 実際に計算に使うリスト
  const list = ownedList.filter(e => filteredIds.includes(e.id))

  // 総当たり計算
  const resultMap = new Map<string[], ScoreData>() // key: ids
  const maxScore = { explor: 0, domain: 0 }
  const calcDomainScore = (data: AvatarData[]) => {
    return data.reduce((sum, e) => sum + Math.max(...e.score), 0)
  }
  const calcExplorScore = (data: AvatarData[], domainScore: number) => {
    return domainScore + 3
  }
  for (const main of list) {
    if (main.score[0] === 0) continue
    for (const subsup1 of list) {
      if (subsup1.score[1] === 0 && subsup1.score[2] === 0) continue
      for (const subsup2 of list) {
        if (subsup2.score[1] === 0 && subsup2.score[2] === 0) continue
        for (const heal of list) {
          if (heal.score[3] === 0) continue
          const data = [main, subsup1, subsup2, heal]
          const key = data.map(e => e.id).sort()
          if ([...new Set(key)].length !== 4) continue // 重複回避
          const domainScore = calcDomainScore(data)
          const explorScore = calcExplorScore(data, domainScore)
          if (maxScore.explor < explorScore) maxScore.explor = explorScore
          if (maxScore.domain < domainScore) maxScore.domain = domainScore
          resultMap.set(key, { data, explorScore, domainScore })
        }
      }
    }
  }

  // フィルター、ソート
  const scoreList = Array.from(resultMap.values())
  // explor
  let explorScoreList: ScoreData[] = []
  for (let i = 0; i < maxScore.explor; i++) {
    if (RESULT_LIMIT < explorScoreList.length) break
    explorScoreList = scoreList.filter(e => maxScore.explor - i <= e.explorScore)
  }
  explorScoreList.sort((a, b) => b.explorScore - a.explorScore)
  // domain
  let domainScoreList: ScoreData[] = []
  for (let i = 0; i < maxScore.domain; i++) {
    if (RESULT_LIMIT < domainScoreList.length) break
    domainScoreList = scoreList.filter(e => maxScore.domain - i <= e.domainScore)
  }
  domainScoreList.sort((a, b) => b.domainScore - a.domainScore)

  console.log(explorScoreList)
}
