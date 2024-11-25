type Name = string
type Roll = "main" | "sub" | "support" | "healer"
type Elem = "4elem" | "" | ""
type Dmg = "normal" | "charge" | "落下" | "skill" | "burst"
type Scope = {
  roll?: Roll[]
  elem?: Elem[]
  dmg?: Dmg[]
  exclude?: (Roll | Elem | Dmg)[]
}
type Member = Name | Scope
type Explor = ["run" | "run-speed" | "run-stamina" | "climb" | "boat" | "fly" , number]
type Avatar = {
  name: Name
  score: [number, number, number, number]
  explor?: Explor
  dmg?: Dmg[] // roll: main, sub のダメージタイプ
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
