import type { Statistics, StatisticsAvatar } from '@components/api-statistics-types'
import { displayStatus, fightProps, get_prop_type, statToString } from '@components/api-utils'
import avatarJson from '@game/avatar.json'
import reliquarySetJson from '@game/reliquary-set.json'
import weaponJson from '@game/weapon.json'

export type StatisticsRemapped = ReturnType<typeof remap>

export const API_VER = '0.0.1'

export const fetchStatistics = async (): Promise<{ json: StatisticsRemapped | undefined; status: number }> => {
  const res = await fetch('/api/statistics', import.meta.env.DEV ? { cache: 'force-cache' } : undefined)
  if (200 <= res.status && res.status <= 399) {
    const json = (await res.json()) as Statistics
    // ver check
    if (API_VER !== json.ver) {
      // error
      return { json: undefined, status: res.status }
    }
    // Successful
    return { json: remap(json), status: res.status }
  }
  // error
  return { json: undefined, status: res.status }
}

const remap = (json: Statistics) => {
  const avatarInfoList = json.avatarInfoList
    .map(a => {
      const data = avatarJson.find(e => e.id === a.avatarId)
      if (!data) throw new Error('statistics remap: no avatar data')
      const element = data.element
      const travelerElement = a.travelerElement?.map(elem => ({
        display: per(a.count, elem.count),
        element: avatarJson.find(e => e.id === a.avatarId && e.skillDepotId === elem.id)?.element,
      }))
      const talentIcons = a.consts.map((e, i) => ({
        icon: i === 0 ? null : data.consts[i - 1],
        display: per(a.count, e),
      }))
      const skills = data.skills.map(skill => {
        const s = a.skills?.find(e => e.id === skill.id)
        if (!s) return skill
        return { ...skill, display: s.median }
      })
      const stats = get_character_stats(a)
      const weapon = a.weapon.map(w => {
        const wj = weaponJson.find(e => e.id === w.id)
        return {
          ...w,
          display: per(a.count, w.count),
          wikiId: wj?.wikiId ?? -1,
          rankLevel: wj?.rankLevel ?? 1,
        }
      })
      const reliquarySet = a.reliquarySet.map(rs => ({
        display: per(a.count, rs.count),
        set: rs.set.map(s => {
          const set = reliquarySetJson.find(e => e.id === s.id)
          return { ...s, wikiId: set?.wikiId ?? -1, nameTextMapHash: set?.nameTextMapHash }
        }),
      }))
      const qualityType = data.qualityType // ソート用
      const reInfo = { ...a, element, travelerElement, talentIcons, skills, stats, weapon, reliquarySet, qualityType }
      return reInfo
    })
    .sort((a, b) => {
      if (a.qualityType === 'QUALITY_ORANGE_SP') return -1
      if (a.qualityType === b.qualityType) return 0
      return a.qualityType < b.qualityType ? 1 : -1 // QUALITY_PURPLE -> QUALITY_ORANGE
    })
    .reverse()
  return {
    ...json,
    avatarInfoList: [
      ...avatarInfoList.filter(e => e.avatarId !== 10000005 && e.avatarId !== 10000007),
      ...avatarInfoList.filter(e => e.avatarId === 10000005 || e.avatarId === 10000007),
    ],
  }
}

const get_character_stats = (a: StatisticsAvatar) => {
  const stats: {
    type: (typeof displayStatus)[number] | 'Elemental DMG Bonus'
    icon: string
    value: number
    display: string
  }[] = displayStatus.map(type => {
    const fightProp = fightProps.find(e => e.type === type)
    if (!fightProp) return { type, icon: '', value: 0, display: '' }
    const statValue = a.stats.find(e => e.fightProp === fightProp.prop)?.value.median ?? 0
    return {
      type,
      icon: get_prop_type(type, true),
      value: statValue,
      display: statToString(type, statValue, true),
    }
  })
  const elDmg = a.stats.find(e => !e.fightProp)?.value.median ?? 0
  const statElDmg = {
    type: 'Elemental DMG Bonus',
    icon: '',
    value: elDmg,
    display: statToString('', elDmg, true),
  } as const
  return stats.concat(statElDmg)
}

const per = (all: number, count: number) => {
  const p = (count / all) * 100
  return p.toFixed(p < 1 ? 1 : 0)
}
