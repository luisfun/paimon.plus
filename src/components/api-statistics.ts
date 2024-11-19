import type { Statistics, StatisticsAvatar } from '@components/api-statistics-types'
import avatarJson from '@game/avatar.json'
import reliquarySetJson from '@game/reliquary-set.json'
import weaponJson from '@game/weapon.json'

export const API_VER = '0.0.1'

export const fetchStatistics = async (): Promise<{ json: Statistics | undefined; status: number }> => {
  const res = await fetch('/api/statistics')
  if (200 <= res.status && res.status <= 399) {
    const json = (await res.json()) as Statistics
    // ver check
    if (API_VER !== json.ver) {
      // error
      return { json: undefined, status: res.status }
    }
    // Successful
    return { json, status: res.status }
  }
  // error
  return { json: undefined, status: res.status }
}

const remap = (json: Statistics) => {
  const { avatarInfoList } = json
  for (const a of avatarInfoList) {
    const data = avatarJson.find(e => e.id === a.avatarId)
    if (!data) throw new Error('statistics remap: no avatar data')
    const nameTextMapHash = data.nameTextMapHash
    const element = data.element
    const talentIcons = data.consts.map((icon, i) => ({ icon, count: a.consts[i] }))
    const skills = (JSON.parse(JSON.stringify(data.skills)) as (typeof avatarJson)[number]['skills']).map(skill => {
      const s = a.skills?.find(e => e.id === skill.id)
      if (!s) return skill
      return { ...skill, ...s }
    })
    const stats = get_character_stats(a)
  }
}

const get_character_stats = (a: StatisticsAvatar) => {}
