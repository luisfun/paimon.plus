export const displayStatus = [
  'HP',
  'ATK',
  'DEF',
  'Elemental Mastery',
  'CRIT Rate',
  'CRIT DMG',
  'Energy Recharge',
] as const

export const fightProps = [
  { type: 'HP', prop: 2000, icon: 'FIGHT_PROP_HP' },
  { type: 'ATK', prop: 2001, icon: 'FIGHT_PROP_ATTACK' },
  { type: 'DEF', prop: 2002, icon: 'FIGHT_PROP_DEFENSE' },
  { type: 'Elemental Mastery', prop: 28, icon: 'FIGHT_PROP_ELEMENT_MASTERY' },
  { type: 'CRIT Rate', prop: 20, icon: 'FIGHT_PROP_CRITICAL' },
  { type: 'CRIT DMG', prop: 22, icon: 'FIGHT_PROP_CRITICAL_HURT' },
  { type: 'Energy Recharge', prop: 23, icon: 'FIGHT_PROP_CHARGE_EFFICIENCY' },
  { type: 'Physical DMG Bonus', prop: 30, icon: 'FIGHT_PROP_PHYSICAL_ADD_HURT' },
  { type: 'Pyro DMG Bonus', prop: 40, icon: 'FIGHT_PROP_FIRE_ADD_HURT' },
  { type: 'Electro DMG Bonus', prop: 41, icon: 'FIGHT_PROP_ELEC_ADD_HURT' },
  { type: 'Hydro DMG Bonus', prop: 42, icon: 'FIGHT_PROP_WATER_ADD_HURT' },
  { type: 'Dendro DMG Bonus', prop: 43, icon: 'FIGHT_PROP_GRASS_ADD_HURT' },
  { type: 'Anemo DMG Bonus', prop: 44, icon: 'FIGHT_PROP_WIND_ADD_HURT' },
  { type: 'Geo DMG Bonus', prop: 45, icon: 'FIGHT_PROP_ROCK_ADD_HURT' },
  { type: 'Cryo DMG Bonus', prop: 46, icon: 'FIGHT_PROP_ICE_ADD_HURT' },
]

export const get_prop_type = (prop: string, reverse?: boolean) => {
  const props = [
    { type: 'Base ATK', prop: 'FIGHT_PROP_BASE_ATTACK' },
    { type: 'HP', prop: 'FIGHT_PROP_HP' },
    { type: 'ATK', prop: 'FIGHT_PROP_ATTACK' },
    { type: 'DEF', prop: 'FIGHT_PROP_DEFENSE' },
    { type: 'HP %', prop: 'FIGHT_PROP_HP_PERCENT' },
    { type: 'ATK %', prop: 'FIGHT_PROP_ATTACK_PERCENT' },
    { type: 'DEF %', prop: 'FIGHT_PROP_DEFENSE_PERCENT' },
    { type: 'CRIT Rate', prop: 'FIGHT_PROP_CRITICAL' },
    { type: 'CRIT DMG', prop: 'FIGHT_PROP_CRITICAL_HURT' },
    { type: 'Energy Recharge', prop: 'FIGHT_PROP_CHARGE_EFFICIENCY' },
    { type: 'Elemental Mastery', prop: 'FIGHT_PROP_ELEMENT_MASTERY' },

    { type: 'Healing Bonus', prop: 'FIGHT_PROP_HEAL_ADD' },
    { type: 'Physical DMG Bonus', prop: 'FIGHT_PROP_PHYSICAL_ADD_HURT' },
    { type: 'Pyro DMG Bonus', prop: 'FIGHT_PROP_FIRE_ADD_HURT' },
    { type: 'Electro DMG Bonus', prop: 'FIGHT_PROP_ELEC_ADD_HURT' },
    { type: 'Hydro DMG Bonus', prop: 'FIGHT_PROP_WATER_ADD_HURT' },
    { type: 'Dendro DMG Bonus', prop: 'FIGHT_PROP_GRASS_ADD_HURT' },
    { type: 'Anemo DMG Bonus', prop: 'FIGHT_PROP_WIND_ADD_HURT' },
    { type: 'Cryo DMG Bonus', prop: 'FIGHT_PROP_ICE_ADD_HURT' },
    { type: 'Geo DMG Bonus', prop: 'FIGHT_PROP_ROCK_ADD_HURT' },
  ]
  if (!reverse) return props.find(e => e.prop === prop)?.type || ''
  return props.find(e => e.type === prop)?.prop || ''
}

export const statToString = (type: string | undefined, value: number, x100?: boolean) =>
  isFlat(type)
    ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : `${(value * (x100 ? 100 : 1)).toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`

export const rollStatToString = (prop: string, value: number) =>
  isFlat(get_prop_type(prop)) ? value.toFixed(0) : (value * 100).toFixed(1)

const isFlat = (type: string | undefined) => ['Base ATK', 'HP', 'ATK', 'DEF', 'Elemental Mastery'].some(e => e === type)
