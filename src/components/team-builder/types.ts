export type Name = string
type Roll = 'main' | 'sub' | 'support' | 'healer'
export type Elem = '4elem' | 'Pyro' | 'Hydro' | 'Cryo' | 'Electro' | 'Dendro' | 'Anemo' | 'Geo'
type Dmg = 'normal' | 'charge' | 'plunge' | 'skill' | 'burst' | 'element'
type Stat = 'HP' | 'ATK' | 'DEF'
type Scope = {
  roll?: ('main' | 'sub')[]
  elem?: Elem[]
  dmg?: Dmg[]
  stat?: Stat[]
  exclude?: (Roll | Elem | Dmg)[]
}
type Member = Name | Scope
type Explor = ['run' | 'run-speed' | 'run-stamina' | 'climb' | 'boat' | 'fly', number]

export type Avatar = {
  name: Name
  elem?: Elem
  score: [number, number, number, number] // 'main' | 'sub' | 'support' | 'healer'
  burstDep?: number // 爆発依存度 探索には-1点分影響させる // + max(点数, max(星4キャラ数, 星5キャラ数)×0.1) - 点数 // 爆発依存有りで40,60,80族 -> 1,2,3 辺りで // 3以上はscore-1 同族ありでscore-0
  dmg?: Dmg[] // roll: main, sub のダメージタイプ
  stat?: Stat[] // default: "ATK" roll: main, sub のダメージタイプ
  explor?: Explor // × minmax(0, (星5キャラ数-10)×0.1,1)
  coop?: {
    score: number
    add?: (Member | Member[])[] // 全て加算 // Array.isArray() -> typeof string -> Scope
    or?: (Member | Member[])[] // いずれか
  }[]
  filter?: {
    score: number
    roll: Roll
  }
}
