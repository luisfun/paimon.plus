type Name = string
type Roll = 'main' | 'sub' | 'support' | 'healer'
type Elem = '4elem' | '' | ''
type Dmg = 'normal' | 'charge' | '落下' | 'skill' | 'burst'
type Scope = {
  roll?: Roll[]
  elem?: Elem[]
  dmg?: Dmg[]
  exclude?: (Roll | Elem | Dmg)[]
}
type Member = Name | Scope
type Explor = ['run' | 'run-speed' | 'run-stamina' | 'climb' | 'boat' | 'fly', number]
type Avatar = {
  name: Name
  score: [number, number, number, number]
  burstDep: number // 爆発依存度 探索には-1点分影響させる // + max(点数, max(星4キャラ数, 星5キャラ数)×0.1) - 点数 // 爆発依存有りで40,60,80族 -> 1,2,3 辺りで
  dmg?: Dmg[] // roll: main, sub のダメージタイプ
  explor?: Explor // × minmax(0, (星5キャラ数-10)×0.1,1)
  coop: {
    score: number
    add?: (Member | Member[])[] // 全て加算 // Array.isArray() -> typeof string -> Scope
    or?: (Member | Member[])[] // いずれか
  }[]
  filter: {
    score: number
    roll: Roll
  }
}
