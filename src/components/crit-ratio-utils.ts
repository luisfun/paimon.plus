export type InputStats = {
  type: 'ATK' | 'HP' | 'DEF'
  base: number
  add: number
  cr: number
  cd: number
}

export type NoteArr = (Pick<InputStats, 'type' | 'cr' | 'cd'> &
  Partial<Pick<InputStats, 'base' | 'add'>> & {
    avg: number
    cDmg: number
  })[]

export const avg = (base: number, add: number, cr: number, cd: number) =>
  Number(((base + add) * (1 + clip01(cr) * cd)).toFixed(1))
const clip01 = (num: number) => (num < 0 ? 0 : num > 1 ? 1 : num)

export const text = 'rgba(255, 255, 255, 0.85)'
export const textSub = 'rgba(255, 255, 255, 0.45)'
