import avatarJson from '@game/avatar.json'
import materialJson from '@game/material.json'
import profilePictureJson from '@game/profile-picture.json'
import textMapJson from '@game/text-map.json'
import weaponJson from '@game/weapon.json'
const textMap: { en: Record<number, string> } = textMapJson

type FolderName =
  | 'ui'
  | 'card-assets'
  | 'element'
  | 'weapon-type'
  | 'official'
  | 'player-card/sample'
  | 'player-card/fukafukafuka29'
  | 'player-card/fukafukafuka29-sample'

export const src = (folder: FolderName, name: string | null | undefined, extension: 'webp' | 'png' = 'webp') =>
  name ? `/images/${folder}/${name}.${extension}` : '/images/Empty.webp'

const wh = (size: number) => ({ width: size, height: size })

const join = (...args: (string | null | undefined)[]) => args.filter(e => e).join(' ')

const roundedStyle = 'bg-cover w-full rounded-[4%_4%_27%]'
const pfpStyle = 'bg-[#DAAB86] border border-[#F0EBE1] rounded-full'

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

export const dummyProps = (className?: string | null | undefined) => ({
  ...wh(280),
  src: '/images/Empty.webp',
  alt: 'None',
  class: className,
})

export const avatarProps = (id: number, skinId?: number | undefined, className?: string, nonBg?: boolean) => {
  const a = avatarJson.find(e => e.id === id)
  if (!a) return dummyProps()
  const key = a.costumes?.find(e => e.skinId === skinId)?.key || a.key
  return {
    ...wh(192),
    src: `/images/ui/Min_UI_AvatarIcon_${key}.webp`,
    alt: textMap.en[a.nameTextMapHash],
    class: join(roundedStyle, nonBg ? '' : `bg-rank-${rankNum[a.qualityType] || 1}`, className),
  }
}

export const weaponProps = (id: number, className?: string, nonBg?: boolean) => {
  const w = weaponJson.find(e => e.id === id)
  if (!w) return dummyProps()
  return {
    ...wh(128),
    src: `/images/ui/Min_${w.icon}.webp`,
    alt: textMap.en[w.nameTextMapHash],
    class: join(roundedStyle, nonBg ? '' : `bg-rank-${w.rankLevel}`, className),
  }
}

export const materialProps = (id: number, className?: string) => {
  const m = materialJson.find(e => e.id === id)
  if (!m) return dummyProps()
  return {
    ...wh(128),
    src: `/images/ui/Min_${m.icon}.webp`,
    alt: textMap.en[m.nameTextMapHash],
    class: join(roundedStyle, `bg-rank-${m.rankLevel || 1}`, className),
  }
}

export const pfpProps = (id: number, className?: string) => {
  const pfp =
    (profilePictureJson as Record<string | number, string>)[id] ||
    `UI_AvatarIcon_${avatarJson.find(e => e.id === id)?.key}`
  return {
    width: undefined,
    height: 128,
    src: `/images/ui/Min_${pfp}.webp`,
    alt: pfp?.split('_')[2] || '',
    class: join(pfpStyle, className),
  }
}

export const sideProps = (id: number, skinId: number | undefined) => {
  const a = avatarJson.find(e => e.id === id)
  if (!a) return dummyProps()
  const key = a.costumes?.find(e => e.skinId === skinId)?.key || a.key
  return {
    ...wh(128),
    src: `/images/ui/UI_AvatarIcon_Side_${key}.webp`,
    alt: textMap.en[a.nameTextMapHash],
  }
}

export const elementProps = (id: string) => ({
  ...wh(84),
  src: `/images/element/${id}.webp`,
  alt: id,
})

export const weaponTypeProps = (id: string) => ({
  ...wh(56),
  src: `/images/weapon-type/${id}.webp`,
  alt: id,
})

export const statProps = (id: keyof typeof stats) => ({
  ...wh(256),
  src: `/images/card-assets/${stats[id]}.webp`,
  alt: id.toString(),
})
