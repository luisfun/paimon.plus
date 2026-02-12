export type Name = string
type Roll = 'main' | 'sub' | 'support' | 'healer'
export type Elem = '4elem' | 'Pyro' | 'Hydro' | 'Cryo' | 'Electro' | 'Dendro' | 'Anemo' | 'Geo'
type Group = 'hexerei' | 'moonsign'
type Dmg = 'normal' | 'charge' | 'plunge' | 'skill' | 'burst' | 'element'
type Stat = 'HP' | 'ATK' | 'DEF' | 'EM'
type Trigger = 'normal'
type Scope = {
  roll?: Roll[]
  elem?: Elem[]
  group?: Group[]
  dmg?: Dmg[]
  stat?: Stat[]
  trigger?: Trigger[]
  //exclude?: (Roll | Elem | Dmg)[]
}
export type Member = Name | Scope
export type Explor = ['run' | 'run-speed' | 'run-stamina' | 'climb' | 'boat' | 'fly', number]

export type Avatar = {
  name: Name
  elem?: Elem
  score: [number, number, number, number] // 'main' | 'sub' | 'support' | 'healer'
  group?: Group[] // 魔導、月兆など
  burstDep?: number // 爆発依存度 探索に影響させる 同族有で軽減させる // + max(点数, max(星4キャラ数, 星5キャラ数)×0.1) - 点数
  dmg?: Dmg[] // roll: main, sub のダメージタイプ
  stat?: Stat[] // default: "ATK" roll: main, sub のダメージタイプ
  trigger?: Trigger[] // main 以外の発動条件
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

export type AvatarData = Avatar & { id: string; avatarId: number | undefined }
