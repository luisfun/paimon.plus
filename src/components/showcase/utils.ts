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
