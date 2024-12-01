export const avatar: {
  name: Name
  elem?: Elem
  score: [number, number, number, number] // main, sub, support, healer
  burstDep?: number // 爆発依存度 40,60,80族 -> 1,2,3 くらい
  dmg?: Dmg[] // main, sub のダメージタイプ
  stat?: Stat[] // main, sub のダメージのステータスタイプ
  explor?: Explor
  coop?: {
    score: number
    add?: (Member | Member[])[] // 全て加算
    or?: (Member | Member[])[] // いずれか
  }[]
  filter: {
    score: number
    roll: Roll
  }
}[] = [
  {
    name: 'Kamisato Ayaka',
    score: [4, 3, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
    stat: ['ATK'],
    filter: {
      score: 4,
      roll: 'main',
    },
  },
]

type Name = string
type Roll = 'main' | 'sub' | 'support' | 'healer'
type Elem = '4elem' | 'Pyro' | 'Hydro' | 'Cryo' | 'Electro' | 'Dendro' | 'Anemo' | 'Geo'
type Dmg = 'normal' | 'charge' | 'plunge' | 'skill' | 'burst'
type Stat = 'HP' | 'ATK' | 'DEF'
type Scope = {
  roll?: Roll[]
  elem?: Elem[]
  dmg?: Dmg[]
  stat?: Stat[]
  exclude?: (Roll | Elem | Dmg)[]
}
type Member = Name | Scope
type Explor = ['run' | 'run-speed' | 'run-stamina' | 'climb' | 'boat' | 'fly', number]
/*
type Avatar = {
  name: Name
  elem?: Elem
  score: [number, number, number, number] // 'main' | 'sub' | 'support' | 'healer'
  burstDep?: number // 爆発依存度 探索には-1点分影響させる // + max(点数, max(星4キャラ数, 星5キャラ数)×0.1) - 点数 // 爆発依存有りで40,60,80族 -> 1,2,3 辺りで
  dmg?: Dmg[] // roll: main, sub のダメージタイプ
  stat?: Stat[] // roll: main, sub のダメージタイプ
  explor?: Explor // × minmax(0, (星5キャラ数-10)×0.1,1)
  coop?: {
    score: number
    add?: (Member | Member[])[] // 全て加算 // Array.isArray() -> typeof string -> Scope
    or?: (Member | Member[])[] // いずれか
  }[]
  filter: {
    score: number
    roll: Roll
  }
}
*/
