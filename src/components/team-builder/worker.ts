import type { globalCoop as gc } from '@manual/team-builder-data'
import type { Avatar, AvatarData, Elem, Explor, Member } from './types'

type ScoreData = { data: AvatarData[]; battle: number; explor: number }
type CalcScoreFunc = (data: AvatarData[], map: Map<string, ScoreData>) => void

// メモ：一般旅人について。UIのバックロジック追加。お気に入りのロール破壊ロジック修正。フィルターロジック修正。の3つで対応可能

export const teamBuild = (ownedList: AvatarData[], favoriteIds: string[], globalCoop: typeof gc) => {
  const ROLL_LIMIT = 15 // 初期のrollフィルター数
  const RESULT_LIMIT = 30 // ハイスコアの最小数
  const MAX_RESULT_GROUP = 5 // 最大表示数

  const ROLLS = ['main', 'sub', 'support', 'healer'] as const

  ////////////////////////////// 組み合わせロジック //////////////////////////////

  // ANDとORロジックの混在を解決したい ///// 一般旅人
  // お気に入りのrollを破壊するかどうか
  const favoriteList = ownedList.filter(e => favoriteIds.includes(e.id))
  const favoriteRoll = ROLLS.map((roll, i) =>
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
  const sortedIdMap = ROLLS.map((roll, i) =>
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
            const hasMainHeal = 1 <= main.score[3] // mainがヒーラー兼任かどうか
            if (hasMainHeal ? isZero(heal, [1, 2]) : isZero(heal, [3])) continue
            if (hasIds([main, subsup1, subsup2], heal)) continue
            const ids = [main, subsup1, subsup2, heal].map(e => e.id)
            if (!favoriteIds.every(id => ids.includes(id))) continue
            // if (!everyFavoriteIds.every(id => ids.includes(id)) && !someFavoriteIds.some(id => ids.includes(id))) continue ///// 一般旅人
            calcScore([main, subsup1, subsup2, heal], resultMap)
          }
        }
      }
    }
    return Array.from(resultMap.values())
  }

  ////////////////////////////// スコアロジック //////////////////////////////

  // define
  type OtherAvatar = AvatarData & { rollIndex: number; roll: (typeof ROLLS)[number] }
  const not4Elem = (a: Avatar) => a.elem !== 'Pyro' && a.elem !== 'Hydro' && a.elem !== 'Cryo' && a.elem !== 'Electro'
  // coopのキャラやScopeにマッチ
  const isMatch = (memberData: Member | Member[], otherData: OtherAvatar[]) => {
    const members = Array.isArray(memberData) ? memberData : [memberData]
    let others = [...otherData]
    const match = members.every(member => {
      // matchするindex
      const index = others.findIndex(other => {
        if (typeof member === 'string') return member === other.name
        if (member.roll?.every(e => e !== other.roll)) return false
        if (member.elem?.every(e => (e === '4elem' ? not4Elem(other) : e !== other.elem))) return false
        if (member.dmg?.every(e => !other.dmg?.includes(e))) return false
        if (member.stat?.every(e => !(other.stat ?? ['ATK']).includes(e))) return false
        if (member.trigger?.every(e => !other.trigger?.includes(e))) return false
        //if (member.exclude && member.exclude.some(e => ))
        return true
      })
      if (index === -1) return false
      // matchしたら除外する
      others = others.filter((_, i) => index !== i)
      return true
    })
    return match
  }
  // coop部分のスコア計算
  const coopScore = (coop: Avatar['coop'], others: OtherAvatar[]) => {
    let score = 0
    for (const c of coop ?? []) {
      for (const members of c.add ?? []) if (isMatch(members, others)) score += c.score
      let orScore = 0
      for (const members of c.or ?? []) if (isMatch(members, others)) orScore = c.score
      score += orScore
    }
    return score
  }
  // 同一元素キャラ数と元素爆発影響度のスコア
  const elemNumBurstDepScore = (data: AvatarData[]) => {
    const elemCount = {} as Record<Elem, number>
    for (const { elem } of data) if (elem) elemCount[elem] = (elemCount[elem] ?? 0) + 1
    let score = 0
    for (const a of data)
      if (a.burstDep && 2 < a.burstDep) score -= Math.max(0, a.burstDep - 1 - (elemCount[a.elem ?? '4elem'] ?? 0))
    return score
  }
  // explor用の値
  const minmax = (min: number, value: number, max: number) => Math.min(Math.max(min, value), max)
  const ownedRate = minmax(0, (ownedList.length / globalCoop.avatarNum) * 2 - 0.5, 1)
  // explor用のスコア
  const explorScore = (data: AvatarData[]) => {
    const scores = {} as Record<Explor[0], number>
    for (const { explor } of data)
      if (explor) scores[explor[0]] = scores[explor[0]] ? Math.max(scores[explor[0]], explor[1]) : explor[1]
    return (
      data.reduce((sum, { burstDep }) => sum - (burstDep ?? 0) * (1 - ownedRate / 2), 0) +
      Object.values(scores).reduce((sum, e) => sum + e, 0) * ownedRate
    )
  }
  // 戦闘スコア
  const calcBattleScore = (data: AvatarData[]) => {
    const hasMainHeal = 1 <= data[0].score[3] // mainがヒーラー兼任かどうか
    let battle = 0
    let explor = 0
    for (const indexs of [
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
    ]) {
      const rollIndexs = [0, ...indexs, hasMainHeal ? 1 : 3]
      const dataRemap = data.map((e, i) => ({ ...e, rollIndex: rollIndexs[i], roll: ROLLS[rollIndexs[i]] }))
      let score = dataRemap.reduce((sum, e) => sum + e.score[e.rollIndex], 0)
      for (let i = 0; i < dataRemap.length; i++)
        score += coopScore(
          dataRemap[i].coop,
          dataRemap.filter((_, j) => i !== j),
        )
      score += coopScore(globalCoop.battleCoop, dataRemap) + elemNumBurstDepScore(data)
      if (battle < score) {
        battle = score
        explor = battle + coopScore(globalCoop.explorCoop, dataRemap) + explorScore(data)
      }
    }
    return { battle, explor }
  }
  // まとめ
  const calcScore: CalcScoreFunc = (data, resultMap) => {
    const key = data
      .map(e => e.id)
      .sort()
      .join('&')
    const { battle, explor } = calcBattleScore(data)
    const tmp = resultMap.get(key)
    if (!tmp || tmp.battle < battle) resultMap.set(key, { data, battle, explor })
  }

  ////////////////////////////// 3キャラ探索 //////////////////////////////

  // ハイスコア順に、RESULT_LIMITを超えるくらいまで数を抑制する
  const scoreFilter = (
    result: ScoreData[],
    maxScore: { battle: number; explor: number },
    index: 'battle' | 'explor',
  ) => {
    let list: ScoreData[] = []
    for (let i = maxScore[index]; 0 < i; i--) {
      if (RESULT_LIMIT < list.length) break
      list = result.filter(e => i <= e[index])
    }
    return list.sort((a, b) => b[index] - a[index])
  }

  // 軽量化用
  const resultAllRemap = (all: ScoreData[]) => {
    const battleHiScore = Math.max(...all.map(e => e.battle))
    const explorHiScore = Math.max(...all.map(e => e.explor))
    return all.map(e => ({
      ...e,
      data: e.data.map(a => ({ avatarId: a.avatarId, id: a.id, name: a.name, elem: a.elem, score: a.score })),
      battleHiScore: battleHiScore - 0.01 < e.battle,
      explorHiScore: explorHiScore - 0.01 < e.explor,
    }))
  }
  // 主要3キャラの組み合わせを作成する
  const calc3CharaSet = (list: ScoreData[]) => {
    const map = new Map<string, Map<string, ScoreData[]>>() // main-id, {other-ids, ScoreData[]}
    // main-others mapの作成
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
    // mapから不要な部分を削除しつつ、結果を作成
    let result: { base: AvatarData[]; all: (ScoreData & { battleHiScore: boolean; explorHiScore: boolean })[] }[] = []
    for (const [mainKey, subMap] of map) {
      let maxLength = 0
      if (map.size === 1) {
        for (const [subKey, scoreList] of subMap) {
          if (maxLength < scoreList.length) maxLength = scoreList.length
          const ids = [mainKey, ...subKey.split('&')]
          const base = scoreList[0].data.filter(e => ids.includes(e.id))
          result.push({ base, all: resultAllRemap(scoreList) })
        }
        if (1 < maxLength) result = result.filter(e => maxLength / 2 < e.all.length)
      } else {
        let keyOfMax = ''
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
        result.push({ base, all: resultAllRemap(sub) })
      }
    }
    if (MAX_RESULT_GROUP < result.length) result.length = MAX_RESULT_GROUP
    return result
  }

  ////////////////////////////// 結果と後処理 //////////////////////////////

  // 計算と結果
  const result = totalHit(calcScore)
  const maxScore = {
    battle: result.map(e => e.battle).reduce((a, b) => Math.max(a, b), 0),
    explor: result.map(e => e.explor).reduce((a, b) => Math.max(a, b), 0),
  }

  // 3キャラ
  const battle = calc3CharaSet(scoreFilter(result, maxScore, 'battle'))
  const explor = calc3CharaSet(scoreFilter(result, maxScore, 'explor'))

  return { battle, explor }
}
