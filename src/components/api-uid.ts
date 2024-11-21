import type { ApiData, AvatarInfo, ReliquaryRemap, WeaponRemap } from '@components/api-uid-types'
import { displayStatus, fightProps, get_prop_type, rollStatToString, statToString } from '@components/api-utils'
import { type UidLog, ls } from '@components/local-storage'
import avatarJson from '@game/avatar.json'
import affixJson from '@game/reliquary-affix.json'

export type AvatarRemapped = ReturnType<typeof avatarRemap>

export const API_VER = '0.3.0'
export const uidTest = (uid: string | number | undefined) => /^(18|[1-35-9])\d{8}$/.test(uid?.toString() || '')

export const fetchUid = async (
  uid: number | undefined,
  cache?: 'cache',
): Promise<{ json: ApiData | undefined; status: number; uidLogs: UidLog[] }> => {
  if (uid === undefined) return { json: undefined, status: 0, uidLogs: ls.uidLog.get() }
  if (!uidTest(uid)) return { json: undefined, status: 499, uidLogs: ls.uidLog.get() }
  const res = await fetch(
    `/api/uid/${uid}`,
    cache ? { cache: 'force-cache', headers: { 'Cache-Control': 'force-cache' } } : undefined,
  )
  if (200 <= res.status && res.status <= 399) {
    const json = (await res.json()) as ApiData
    // ver check
    if (API_VER !== json.ver) {
      // retry
      if (cache) return await fetchUid(uid)
      // error
      return { json: undefined, status: res.status, uidLogs: ls.uidLog.get() }
    }
    // Successful
    localStorage.setItem('uid', uid?.toString() || '')
    const uidLogs = ls.uidLog.set(uid, json)
    return { json, status: res.status, uidLogs }
  }
  // error
  return { json: undefined, status: res.status, uidLogs: ls.uidLog.get() }
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
    reliquarySubStats: [] as { appendPropId: string; statValue: number; display: string; rollCount: number }[],
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
        sub.type = get_prop_type(sub.appendPropId)
        sub.display = statToString(sub.type, sub.statValue)
        sub.rolls = rollSet.find(e => e.prop === sub.appendPropId)?.rolls || []
        // reliquarySubStats All
        const subStat = re.reliquarySubStats.find(e => e.appendPropId === sub.appendPropId)
        if (subStat) {
          subStat.statValue += sub.statValue
          subStat.display = statToString(sub.type, subStat.statValue)
          subStat.rollCount += sub.rolls.length
        } else {
          re.reliquarySubStats.push({
            appendPropId: sub.appendPropId,
            statValue: sub.statValue,
            display: sub.display,
            rollCount: sub.rolls.length,
          })
        }
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
  re.reliquarySubStats.sort((a, b) => getPropNumber(a.appendPropId) - getPropNumber(b.appendPropId))
  return re // as Omit<typeof re, "equipList"> & { equipList?: (WeaponRemap | ReliquaryRemap)[] }
}
const get_ascension_level = (ascension: string | number | undefined) =>
  [20, 40, 50, 60, 70, 80, 90][Number(ascension)] || 20
const get_character_stats = (avatarInfo: AvatarInfo) => {
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
  const baseList = [
    { type: 'HP', prop: 1 },
    { type: 'ATK', prop: 4 },
    { type: 'DEF', prop: 7 },
  ]
  const stats = displayStatus.map(type => {
    const fightProp = fightProps.find(e => e.type === type)
    if (!fightProp) return { type, icon: '', value: { main: 0 }, display: { main: '' } }
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
const getPropNumber = (prop: string) =>
  [
    'FIGHT_PROP_HP_PERCENT',
    'FIGHT_PROP_HP',
    'FIGHT_PROP_ATTACK_PERCENT',
    'FIGHT_PROP_ATTACK',
    'FIGHT_PROP_DEFENSE_PERCENT',
    'FIGHT_PROP_DEFENSE',
    'FIGHT_PROP_ELEMENT_MASTERY',
    'FIGHT_PROP_CRITICAL',
    'FIGHT_PROP_CRITICAL_HURT',
    'FIGHT_PROP_CHARGE_EFFICIENCY',
  ].findIndex(e => e === prop)
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
