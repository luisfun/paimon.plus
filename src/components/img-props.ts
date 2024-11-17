import avatarJson from '@game/avatar.json'
import materialJson from '@game/material.json'
import profilePictureJson from '@game/profile-picture.json'
import textMapJson from '@game/text-map.json'
import weaponJson from '@game/weapon.json'
const textMap: { en: Record<number, string> } = textMapJson

export const dummySrc = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7'

const classInit = (c: string | null | undefined) => `bg-cover w-full rounded-[4%_4%_27%]${c ? ` ${c}` : ''}`
const propsInit = (c: string | null | undefined) => ({
  src: dummySrc,
  width: 1,
  height: 1,
  alt: 'None',
  class: classInit(c),
})
const rankNum: Record<string, number> = {
  QUALITY_ORANGE: 5,
  QUALITY_PURPLE: 4,
  QUALITY_ORANGE_SP: 5,
}
const stats = {
  'HP %': 'FIGHT_PROP_HP_PERCENT',
  'ATK %': 'FIGHT_PROP_ATTACK_PERCENT',
  'DEF %': 'FIGHT_PROP_DEFENSE_PERCENT',
  'Elemental Mastery': 'FIGHT_PROP_ELEMENT_MASTERY',
  CRIT: 'FIGHT_PROP_CRITICAL',
  'Energy Recharge': 'FIGHT_PROP_CHARGE_EFFICIENCY',
} as const

export const dummyProps = (className?: string) => propsInit(className)

export const avatarProps = (id: number, skinId?: number | undefined, className?: string, nonBg?: boolean) => {
  const a = avatarJson.find(e => e.id === id)
  if (!a) return propsInit('')
  const key = a.costumes?.find(e => e.skinId === skinId)?.key || a.key
  return {
    src: `/images/ui/Min_UI_AvatarIcon_${key}.webp`,
    width: 192,
    height: 192,
    alt: textMap.en[a.nameTextMapHash],
    class: `${classInit(className)}${nonBg ? '' : ` bg-rank-${rankNum[a.qualityType] || 1}`}`,
  }
}

export const weaponProps = (id: number, className?: string) => {
  const w = weaponJson.find(e => e.id === id)
  if (!w) return propsInit('')
  return {
    src: `/images/ui/Min_${w.icon}.webp`,
    width: 128,
    height: 128,
    alt: textMap.en[w.nameTextMapHash],
    class: `${classInit(className)} bg-rank-${w.rankLevel}`,
  }
}

export const materialProps = (id: number, className?: string) => {
  const m = materialJson.find(e => e.id === id)
  if (!m) return propsInit('')
  return {
    src: `/images/ui/Min_${m.icon}.webp`,
    width: 128,
    height: 128,
    alt: textMap.en[m.nameTextMapHash],
    class: `${classInit(className)} bg-rank-${m.rankLevel || 1}`,
  }
}

export const pfpProps = (id: number, className?: string) => {
  const pfp =
    (profilePictureJson as Record<string | number, string>)[id] ||
    `UI_AvatarIcon_${avatarJson.find(e => e.id === id)?.key}`
  return {
    src: `/images/ui/Min_${pfp}.webp`,
    width: undefined,
    height: 128,
    alt: pfp?.split('_')[2] || '',
    class: `${classInit(className)} pfp-icon`,
  }
}

export const sideProps = (id: number, skinId: number | undefined) => {
  const a = avatarJson.find(e => e.id === id)
  if (!a) return propsInit('')
  const key = a.costumes?.find(e => e.skinId === skinId)?.key || a.key
  return {
    src: `/images/ui/UI_AvatarIcon_Side_${key}.webp`,
    width: 128,
    height: 128,
    alt: textMap.en[a.nameTextMapHash],
  }
}

export const elementProps = (id: string) => ({
  src: `/images/element/${id}.webp`,
  width: 84,
  height: 84,
  alt: id,
})

export const weaponTypeProps = (id: string) => ({
  src: `/images/weapon-type/${id}.webp`,
  width: 56,
  height: 56,
  alt: id,
})

export const statProps = (id: keyof typeof stats) => ({
  src: `/images/card-assets/${stats[id]}.webp`,
  width: 256,
  height: 256,
  alt: id.toString(),
})
