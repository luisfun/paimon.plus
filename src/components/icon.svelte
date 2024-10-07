<svelte:options runes={true} />
<script lang="ts">
import avatarJson from '@game/avatar.json'
import materialJson from '@game/material.json'
import profilePictureJson from '@game/profile-picture.json'
import textMapJson from '@game/text-map.json'
import weaponJson from '@game/weapon.json'
import type { HTMLImgAttributes } from 'svelte/elements'
const textMap: { en: Record<number, string> } = textMapJson

const {
  id,
  skinId,
  ui,
  text,
  style,
  dummyLoading,
}: {
  id: number | string
  skinId?: number
  ui: 'avatar' | 'weapon' | 'material' | 'element' | 'weapon-type' | 'circle' | 'dummy'
  text?: string | number
  style?: string
  dummyLoading?: boolean
} = $props()

const dummySrc = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7'
const rankNum: Record<string, number> = {
  QUALITY_ORANGE: 5,
  QUALITY_PURPLE: 4,
  QUALITY_ORANGE_SP: 5,
}
const styleInit = (style: string | undefined) => `bg-cover w-full rounded-[4%_4%_27%]${style ? ` ${style}` : ''}`
const propsInit = (style: string | undefined) => ({
  src: dummySrc,
  width: 1,
  height: 1,
  alt: 'None',
  class: styleInit(style),
})

const imgProps = $derived.by(() => {
  const sx = styleInit(style)
  switch (ui) {
    case 'avatar': {
      const a = avatarJson.find(e => e.id === id)
      if (!a) break
      const key = a.costumes?.find(e => e.skinId === skinId)?.key || a.key
      return {
        src: `/images/ui/Min_UI_AvatarIcon_${key}.webp`,
        width: 192,
        height: 192,
        alt: textMap.en[a.nameTextMapHash],
        class: `${sx} bg-rank-${rankNum[a.qualityType] || 1}`,
      }
    }
    case 'weapon': {
      const w = weaponJson.find(e => e.id === id)
      if (!w) break
      return {
        src: `/images/ui/Min_${w.icon}.webp`,
        width: 128,
        height: 128,
        alt: textMap.en[w.nameTextMapHash],
        class: `${sx} bg-rank-${w.rankLevel}`,
      }
    }
    case 'material': {
      const m = materialJson.find(e => e.id === id)
      if (!m) break
      return {
        src: `/images/ui/Min_${m.icon}.webp`,
        width: 128,
        height: 128,
        alt: textMap.en[m.nameTextMapHash],
        class: `${sx} bg-rank-${m.rankLevel || 1}`,
      }
    }
    case 'element': {
      return {
        src: `/images/element/${id}.webp`,
        width: 84,
        height: 84,
        alt: id.toString(),
        class: style,
      }
    }
    case 'weapon-type': {
      return {
        src: `/images/weapon-type/${id}.webp`,
        width: 56,
        height: 56,
        alt: id.toString(),
        class: style,
      }
    }
    case 'circle': {
      const pfp =
        (profilePictureJson as Record<string | number, string>)[id] ||
        `UI_AvatarIcon_${avatarJson.find(e => e.id === id)?.key}`
      return {
        src: `/images/ui/Min_${pfp}.webp`,
        width: undefined,
        height: 128,
        alt: pfp?.split('_')[2] || '',
        class: `${sx} pfp-icon`,
      }
    }
  }
  return propsInit(style)
})
let overwriteProps = $state<HTMLImgAttributes>({})
let srcLog = $state(dummySrc)
let isInitialRender = $state(true)

$effect(() => {
  if (isInitialRender || !dummyLoading || srcLog === imgProps.src) {
    overwriteProps = {}
    srcLog = imgProps.src
    isInitialRender = false
  } else {
    overwriteProps = { src: dummySrc }
    if (typeof window !== 'undefined') {
      const img = new Image()
      img.onload = () => {
        overwriteProps = {}
        srcLog = imgProps.src
      }
      img.src = imgProps.src
    }
  }
})
</script>

{#if text}
<div class="relative rounded-[4%_4%_27%] overflow-hidden">
  <img {...imgProps} {...overwriteProps} />
  <div class="absolute top-0 right-0 bg-neutral rounded-bl-md px-1 text-xs">{text}</div>
</div>
{:else}
<img {...imgProps} {...overwriteProps} />
{/if}
