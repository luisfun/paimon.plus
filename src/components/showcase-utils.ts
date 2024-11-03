import type { ReliquaryRemap } from './api'

export const bga = '#0005'
export const bga2 = '#0007'
//export const colora = `#fffa`
export const bgas = '#282828dd'
export const lightGreen = '#82ff9a'

export const equipTypes = ['EQUIP_BRACER', 'EQUIP_NECKLACE', 'EQUIP_SHOES', 'EQUIP_RING', 'EQUIP_DRESS']

export const elementMap = {
  Rock: '#bb9f4b',
  Wind: '#52B0B1',
  Ice: '#46A8BA',
  Water: '#84A1C6',
  Electric: '#9876AD',
  Fire: '#BA8C83',
  Grass: '#57A45C', // #2D8E34
  None: '#94a0a7',
} as Record<string, string>

export const src = (name: string | null | undefined, folder?: 'ui' | 'element' | 'card-assets', type?: 'jpg') =>
  `/images${folder ? `/${folder}` : ''}/${name ? name : 'Empty'}.${type ? type : 'webp'}`

export const getConsPos = (i: number) => {
  const r = 186
  const th = 15
  const cy = -22
  const cx = -42 // 調節項目
  const rad = ((2 * Math.PI) / 360) * (th * 2.5 - th * i)
  const base = {
    x: Math.cos(rad) * r,
    y: Math.sin(rad) * r,
  }
  return { mt: -base.y + cy, ml: base.x + cx }
}

const colorLight: Record<string, string> = {
  Fire: 'rgba(255,102,64,.65)',
  Ice: 'rgba(122,242,242,.65)',
  Water: 'rgba(0,192,255,.65)',
  Electric: 'rgba(204,128,255,.65)',
  Wind: 'rgba(51,215,160,.65)',
  Rock: 'rgba(255,176,13,.65)',
  Grass: 'rgba(51,215,160,.65)',
  None: 'rgba(192,192,192,.65)',
}
const colorDark: Record<string, string> = {
  Fire: '#3d1818',
  Ice: '#09375c',
  Water: '#15315c',
  Electric: '#2a1a67',
  Wind: '#153434',
  Rock: '#3d3015',
  Grass: '#183d12',
  None: '#333',
}
export const elementColor = (element: string | null | undefined, light?: boolean) =>
  light ? colorLight[element || ''] || colorLight.None : colorDark[element || ''] || colorDark.None

export const sxMiniPaper = {
  position: 'absolute',
  mr: 2,
  mb: 2,
  textAlign: 'center',
  backgroundColor: bgas,
  borderRadius: 8,
  overflow: 'hidden',
} as const

/*
 * showcase only
 */

export const defineSub = ['HP', 'ATK', 'DEF', 'EM', 'CRIT', 'ER'] as const

export const defineToName = {
  HP: 'HP %',
  ATK: 'ATK %',
  DEF: 'DEF %',
  EM: 'Elemental Mastery',
  CRIT: 'CRIT',
  ER: 'Energy Recharge',
} as const

export const defineToProps = (stats: (typeof defineSub)[number][]) =>
  stats.flatMap(
    stat =>
      ({
        HP: 'FIGHT_PROP_HP_PERCENT',
        ATK: 'FIGHT_PROP_ATTACK_PERCENT',
        DEF: 'FIGHT_PROP_DEFENSE_PERCENT',
        EM: 'FIGHT_PROP_ELEMENT_MASTERY',
        CRIT: ['FIGHT_PROP_CRITICAL', 'FIGHT_PROP_CRITICAL_HURT'],
        ER: 'FIGHT_PROP_CHARGE_EFFICIENCY',
      })[stat],
  )

export const getSubRollMark = (markProps: string[], reliquarySub: ReliquaryRemap['flat']['reliquarySubstats']) => {
  const rollMap = reliquarySub?.map(sub => ({ appendPropId: sub.appendPropId, roll: sub.rolls.length }))
  if (!rollMap) return 0
  return rollMap.filter(e => markProps.includes(e.appendPropId)).reduce((sum, e) => sum + e.roll, 0)
}

/*
 * artifacter only
 */

export const scoreTypeMenuItems = ['CRIT', 'HP', 'ATK', 'DEF', 'EM', 'ER'] as const
export type ScoreType = typeof scoreTypeMenuItems[number]

export const menuItemMap = [
  { type: 'EM', name: 'Elemental Mastery' },
  { type: 'ER', name: 'Energy Recharge' },
]

// biome-ignore format: ternary operator
export const statusRename = (name: string) =>
  name === 'Energy Recharge' ? 'En. Recharge' :
  name === 'Elemental Mastery' ? 'El. Mastery' : name

export const getScoreSet = (artifactList: ReliquaryRemap[], type: ScoreType) =>
  equipTypes.map(equipType => {
    const artifact = artifactList.find(e => e.flat.equipType === equipType)
    if (!artifact) return { equipType: equipType, value: 0, grade: '' }
    return { equipType: equipType, value: getScore(artifact, type), grade: getGrade(artifact, type, equipType) }
  })

export const getGrade = (artifact: ReliquaryRemap, type: ScoreType, equipType: string) => {
  const score = Math.round(getScore(artifact, type) * 100) / 100
  // biome-ignore format: ternary operator
  const tmpScore = score + (
    equipType === 'EQUIP_BRACER' || equipType === 'EQUIP_NECKLACE' ? 0 :
    equipType === 'EQUIP_SHOES' || equipType === 'EQUIP_RING' ? 5 :
    equipType === 'EQUIP_DRESS' ? 10 : 0
  ) + (type === 'CRIT' ? 5 : 0)
  // biome-ignore format: ternary operator
  const grade =
    equipType === 'EQUIP_RING' && type !== 'CRIT'
      ? tmpScore < 42 ? 'B' :
        tmpScore < 45 ? 'A' :
        tmpScore < 50 ? 'S' : 'SS'
      : tmpScore < 40 ? 'B' :
        tmpScore < 45 ? 'A' :
        tmpScore < 50 ? 'S' : 'SS'
  return grade
}

export const getScore = (artifact: ReliquaryRemap, type: ScoreType) => {
  let score = 0
  for (const sub of artifact.flat.reliquarySubstats || []) {
    const name = sub.type
    if (name === 'CRIT Rate') score += sub.statValue * 2
    if (name === 'CRIT DMG') score += sub.statValue
    if (type === 'ATK' && name === 'ATK %') score += sub.statValue
    if (type === 'HP' && name === 'HP %') score += sub.statValue
    if (type === 'DEF' && name === 'DEF %') score += sub.statValue
    if (type === 'EM' && name === 'Elemental Mastery') score += sub.statValue / 4
    if (type === 'ER' && name === 'Energy Recharge') score += sub.statValue
  }
  return score
}

export const getTotalScoreSet = (
  scoreSet: {
    equipType: string
    value: number
    grade: string
  }[],
  type: ScoreType,
) => {
  const value = scoreSet.map(e => e.value).reduce((sum, val) => sum + val, 0)
  const tmpScore = value + (type === 'CRIT' ? 20 : 0)
  const grade = tmpScore < 180 ? 'B' : tmpScore < 200 ? 'A' : tmpScore < 220 ? 'S' : 'SS'
  return { value, grade }
}

export const scoreIcon = (name: string) => {
  const props = [
    { name: 'HP', prop: 'FIGHT_PROP_HP' },
    { name: 'ATK', prop: 'FIGHT_PROP_ATTACK' },
    { name: 'DEF', prop: 'FIGHT_PROP_DEFENSE' },
    { name: 'CRIT', prop: 'FIGHT_PROP_CRITICAL' },
    { name: 'ER', prop: 'FIGHT_PROP_CHARGE_EFFICIENCY' },
    { name: 'EM', prop: 'FIGHT_PROP_ELEMENT_MASTERY' },
  ]
  return props.find(e => e.name === name)?.prop || 'FIGHT_PROP_CRITICAL'
}
