import avatarJson from '@game/avatar.json'
import affixJson from '@game/reliquary-affix.json'

export const API_VER = '0.3.0'
export const uidTest = (uid: string | number | undefined) => /^(18|[1-35-9])\d{8}$/.test(uid?.toString() || '')

export const fetchUid = async (uid: number | undefined, cache?: 'cache') => {
  if (!uidTest(uid)) return { json: undefined, status: 499 }
  const res = await fetch(
    `/api/uid/${uid}`,
    cache ? { cache: 'force-cache', headers: { 'Cache-Control': 'force-cache' } } : undefined,
  )
  if (200 <= res.status && res.status <= 399) {
    const json = (await res.json()) as ApiData
    localStorage.setItem('uid', uid?.toString() || '')
    const newLog = { name: json.playerInfo.nickname, uid: uid?.toString() || '' }
    const uidLog = JSON.parse(localStorage.getItem('uid-log') || '[]') as { name: string; uid: string }[]
    localStorage.setItem('uid-log', JSON.stringify([...new Map([newLog, ...uidLog].map(e => [e.uid, e])).values()]))
    return { json, status: res.status }
  }
  return { json: undefined, status: res.status }
}

export const avatarRemap = (info: AvatarInfo) => {
  const data = avatarJson.find(e => e.id === info.avatarId && e.skillDepotId === info.skillDepotId)
  const costume = data?.costumes?.find(e => e.skinId === info.costumeId)
  const level = Number(info.propMap['4001'].val)
  const levelLimit = get_ascension_level(info.propMap['1002'].val)
  const nameTextMapHash = data?.nameTextMapHash
  const element = data?.element
  const sideIcon = costume ? `UI_AvatarIcon_Side_${costume.key}` : `UI_AvatarIcon_Side_${data?.key}`
  const avatarImg = costume ? `UI_Costume_${costume.key}` : `UI_Gacha_AvatarImg_${data?.key}`
  const talentIcons =
    data?.consts.map((icon, i) => ({ icon, unlock: i < (info.talentIdList?.length || 0) })) ||
    Array(6)
      .fill(0)
      .map(() => ({ icon: null, unlock: false }))
  const skills = (JSON.parse(JSON.stringify(data?.skills)) as (typeof avatarJson)[number]['skills'] | undefined)?.map(
    skill => ({
      ...skill,
      level: info.skillLevelMap[skill.id || 0],
      add: info.proudSkillExtraLevelMap?.[skill.proud || 0] || 0,
    }),
  )
  const stats = get_character_stats(info)
  const reliquarySets = get_reliquary_sets(info)
  const re = {
    ...(JSON.parse(JSON.stringify(info)) as AvatarInfo),
    level,
    levelLimit,
    nameTextMapHash,
    element,
    sideIcon,
    avatarImg,
    talentIcons,
    skills,
    stats,
    reliquarySets,
  }
  for (const equip of re.equipList || []) {
    if ('reliquary' in equip) {
      const eq = equip as ReliquaryRemap
      const main = eq.flat.reliquaryMainstat
      const type = get_prop_type(main.mainPropId)
      const display = statToString(type, main.statValue)
      eq.flat.reliquaryMainstat = { ...eq.flat.reliquaryMainstat, type, display }
      // reliquarySubstats
      const rollSet = get_reliquary_roll_set(eq.reliquary.appendPropIdList)
      for (const sub of eq.flat.reliquarySubstats || []) {
        const type = get_prop_type(sub.appendPropId)
        sub.display = statToString(type, sub.statValue)
        sub.rolls = rollSet.find(e => e.prop === sub.appendPropId)?.rolls || []
      }
    } else if ('weapon' in equip) {
      const eq = equip as WeaponRemap
      eq.weapon.levelLimit = get_ascension_level(equip.weapon.promoteLevel)
      // weaponStats
      for (const stat of eq.flat.weaponStats) {
        const type = get_prop_type(stat.appendPropId)
        stat.type = type
        stat.display = statToString(type, stat.statValue)
      }
    }
  }
  return re // as Omit<typeof re, "equipList"> & { equipList?: (WeaponRemap | ReliquaryRemap)[] }
}
const get_ascension_level = (ascension: string | number | undefined) =>
  [20, 40, 50, 60, 70, 80, 90][Number(ascension)] || 20
const get_character_stats = (avatarInfo: AvatarInfo) => {
  const displayStatus = ['Max HP', 'ATK', 'DEF', 'Elemental Mastery', 'CRIT Rate', 'CRIT DMG', 'Energy Recharge']
  const displayDmgs = [
    'Physical DMG Bonus',
    'Pyro DMG Bonus',
    'Electro DMG Bonus',
    'Hydro DMG Bonus',
    'Dendro DMG Bonus',
    'Anemo DMG Bonus',
    'Geo DMG Bonus',
    'Cryo DMG Bonus',
  ]
  const fightProps = [
    { type: 'Max HP', prop: 2000, icon: 'FIGHT_PROP_HP' },
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
  const baseList = [
    { type: 'Max HP', prop: 1 },
    { type: 'ATK', prop: 4 },
    { type: 'DEF', prop: 7 },
  ]
  const stats = displayStatus.map(type => {
    const fightProp = fightProps.find(e => e.type === type)
    if (!fightProp) return { type: type, icon: '', value: { main: 0 }, display: { main: '' } }
    const statValue = avatarInfo.fightPropMap[fightProp.prop] || 0
    const re: {
      type: string
      icon: string
      value: {
        main: number
        base?: number
        add?: number
      }
      display: {
        main: string
        base?: string
        add?: string
      }
    } = {
      type: type,
      icon: get_prop_type(type, true),
      value: {
        main: statValue,
      },
      display: {
        main: statToString(type, statValue, true),
      },
    }
    // HP,ATK,DEFのとき
    const baseFightProp = baseList.find(e => e.type === type)
    if (baseFightProp) {
      const baseStatValue = avatarInfo.fightPropMap[baseFightProp.prop]
      re.value.base = baseStatValue
      re.value.add = statValue - baseStatValue
      re.display.base = statToString(type, baseStatValue, true)
      re.display.add = statToString(type, statValue - baseStatValue, true)
    }
    return re
  })
  // dmg
  const dmgValues = displayDmgs.map(e => avatarInfo.fightPropMap[fightProps.find(e2 => e2.type === e)?.prop || 0] || 0)
  const hiValue = Math.max(...dmgValues)
  const hiDmgValues = dmgValues.filter(e => e === hiValue)
  if (hiDmgValues.length === 1) {
    const type = displayDmgs[dmgValues.findIndex(e => e === hiValue)]
    stats.push({
      type: type,
      icon: get_prop_type(type, true),
      value: {
        main: hiValue,
      },
      display: {
        main: statToString(type, hiValue, true),
      },
    })
  } else if (hiDmgValues.length > 1) {
    stats.push({
      type: 'Elemental DMG Bonus',
      icon: '',
      value: {
        main: hiValue,
      },
      display: {
        main: statToString('', hiValue, true),
      },
    })
  }
  return stats
}
const get_prop_type = (prop: string, reverse?: boolean) => {
  const props = [
    { type: 'Base ATK', prop: 'FIGHT_PROP_BASE_ATTACK' },
    { type: 'HP', prop: 'FIGHT_PROP_HP' },
    { type: 'Max HP', prop: 'FIGHT_PROP_HP' },
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
const statToString = (type: string | undefined, value: number, x100?: boolean) =>
  isFlat(type)
    ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : `${(value * (x100 ? 100 : 1)).toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`
const isFlat = (type: string | undefined) =>
  ['Max HP', 'Base ATK', 'HP', 'ATK', 'DEF', 'Elemental Mastery'].some(e => e === type)
const get_reliquary_sets = (avatarInfo: AvatarInfo) => {
  const tmpList: {
    icon: string
    nameTextMapHash: string
  }[] = []
  for (const e of avatarInfo.equipList || []) {
    if ('reliquary' in e)
      tmpList.push({
        icon: `${e.flat.icon.slice(0, -1)}4`,
        nameTextMapHash: e.flat.setNameTextMapHash,
      })
  }
  const uniqueId: string[] = [...new Set(tmpList.map(e => e.nameTextMapHash))]
  const setList = uniqueId.map(e => ({
    nameTextMapHash: e,
    icon: tmpList.find(e2 => e2.nameTextMapHash === e)?.icon || 'None',
    count: 0,
  }))
  for (const e of tmpList) {
    setList[setList.findIndex(e2 => e2.nameTextMapHash === e.nameTextMapHash)].count++
  }
  const reList: {
    icon: string
    nameTextMapHash: string
    count: number
  }[] = []
  for (const e of setList) {
    if (e.count < 2) continue
    if (e.count < 4) reList.push({ icon: e.icon, count: 2, nameTextMapHash: e.nameTextMapHash })
    else reList.push({ icon: e.icon, count: 4, nameTextMapHash: e.nameTextMapHash })
  }
  return reList.sort((a, b) => Number(a?.icon?.slice(-7, -2)) - Number(b?.icon?.slice(-7, -2)))
}
const get_reliquary_roll_set = (idList: number[] | undefined) => {
  const re: {
    prop: string
    rolls: {
      rank: number
      value: number
      display: string
    }[]
  }[] = []
  for (const id of idList || []) {
    const data = affixJson.find(e => e.id === id)
    if (!data) continue
    if (re.findIndex(e => e.prop === data.propType) === -1) {
      re.push({
        prop: data.propType,
        rolls: [
          {
            rank: id % 10,
            value: data.propValue,
            display: rollStatToString(data.propType, data.propValue),
          },
        ],
      })
    } else {
      const i = re.findIndex(e => e.prop === data.propType)
      re[i].rolls.push({
        rank: id % 10,
        value: data.propValue,
        display: rollStatToString(data.propType, data.propValue),
      })
    }
  }
  return re.map(e => ({
    prop: e.prop,
    rolls: e.rolls.sort((a, b) => a.rank - b.rank),
  }))
}
const rollStatToString = (prop: string, value: number) =>
  isFlat(get_prop_type(prop)) ? value.toFixed(0) : (value * 100).toFixed(1)

export type ApiData = EnkaApi & { ver: string; timestamp: number; status?: number }

export type EnkaApi = {
  playerInfo: {
    nickname: string
    level: number
    signature?: string
    worldLevel?: number
    nameCardId: number
    finishAchievementNum?: number
    towerFloorIndex?: number
    towerLevelIndex?: number
    showAvatarInfoList?: {
      avatarId: number
      level: number
      costumeId?: number
    }[]
    showNameCardIdList?: number[]
    profilePicture: {
      id: number
    }
  }
  avatarInfoList?: AvatarInfo[]
  ttl: number
  uid: string
  owner?: unknown
}
export type AvatarInfo = {
  avatarId: number
  propMap: {
    [index: string]: {
      type: number
      ival: string
      val?: string
    }
  }
  talentIdList?: number[]
  fightPropMap: {
    [index: string]: number
  }
  skillDepotId: number
  inherentProudSkillList: number[]
  skillLevelMap: {
    [index: string]: number
  }
  proudSkillExtraLevelMap?: {
    [index: string]: number
  }
  equipList?: (Weapon | Reliquary)[]
  fetterInfo: {
    expLevel: number // 好感度
  }
  costumeId?: number
}
export type Weapon = {
  itemId: number
  weapon: {
    level: number
    promoteLevel?: number
    affixMap?: {
      [index: string]: number // 0-4
    }
  }
  flat: {
    nameTextMapHash: string
    rankLevel: number
    weaponStats: {
      appendPropId: string
      statValue: number
    }[]
    itemType: string
    icon: string
  }
}
export type Reliquary = {
  itemId: number
  reliquary: {
    level: number
    mainPropId: number
    appendPropIdList?: number[]
  }
  flat: {
    nameTextMapHash: string
    setNameTextMapHash: string
    rankLevel: number
    reliquaryMainstat: {
      mainPropId: string
      statValue: number
    }
    reliquarySubstats?: {
      appendPropId: string
      statValue: number
    }[]
    itemType: string
    icon: string
    equipType: string
  }
}

export type WeaponRemap = Weapon & {
  weapon: {
    levelLimit: number
  }
  flat: {
    weaponStats: {
      type: string
      display: string
    }[]
  }
}
export type ReliquaryRemap = {
  itemId: number
  reliquary: {
    level: number
    mainPropId: number
    appendPropIdList?: number[]
  }
  flat: {
    nameTextMapHash: string
    setNameTextMapHash: string
    rankLevel: number
    reliquaryMainstat: {
      mainPropId: string
      statValue: number
      type: string
      display: string
    }
    reliquarySubstats?: {
      appendPropId: string
      statValue: number
      display: string
      rolls: {
        rank: number
        value: number
        display: string
      }[]
    }[]
    itemType: string
    icon: string
    equipType: string
  }
}
