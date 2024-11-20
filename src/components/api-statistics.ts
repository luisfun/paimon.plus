import type { Statistics, StatisticsAvatar } from '@components/api-statistics-types'
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
  const avatarInfoList = json.avatarInfoList.map(a => {
    const data = avatarJson.find(e => e.id === a.avatarId)
    if (!data) throw new Error('statistics remap: no avatar data')
    const nameTextMapHash = data.nameTextMapHash
    const element = data.element
    const talentIcons = a.consts.map((e, i) => ({ icon: i === 0 ? null : data.consts[i - 1], count: e }))
    const skills = data.skills.map(skill => {
      const s = a.skills?.find(e => e.id === skill.id)
      if (!s) return skill
      return { ...skill, ...s }
    })
    const stats = get_character_stats(a)
    return { ...a, nameTextMapHash, element, talentIcons, skills }
  })
  return { ...json, avatarInfoList }
}

const get_character_stats = (a: StatisticsAvatar) => {}
