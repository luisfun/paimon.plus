<script lang="ts">
import avatarJson from '@game/avatar.json'
import materialJson from '@game/material.json'
import profilePictureJson from '@game/profile-picture.json'
import textMapJson from '@game/text-map.json'
import weaponJson from '@game/weapon.json'
import type { HTMLImgAttributes } from 'svelte/elements'
type TextMap = { en: Record<number, string> }

export let id: number | string
export let ui: 'avatar' | 'weapon' | 'material' | 'element' | 'weapon-type' | 'circle' | 'dummy'
export let text: string | number = ''
export let loading: HTMLImgAttributes['loading'] = undefined
export let style = ''

const dummySrc = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7'
let src = dummySrc
let alt = 'None'
let rank = 1
let width: number | undefined = 1
let height: number | undefined = 1
let sx = ''

const rankNum: Record<string, number> = {
  QUALITY_ORANGE: 5,
  QUALITY_PURPLE: 4,
  QUALITY_ORANGE_SP: 5,
}

const setSrc = (newSrc: string, w: number | undefined, h?: number) => {
  width = w
  height = h || w
  if (typeof window === 'undefined') {
    src = newSrc
  } else {
    const img = new Image()
    img.onload = () => {
      src = newSrc
    }
    src = dummySrc
    img.src = newSrc
  }
}
$: {
  sx = 'bg-cover w-full rounded-[4%_4%_27%]'
  switch (ui) {
    case 'avatar': {
      const a = avatarJson.find(e => e.id === id)
      if (!a) break
      setSrc(`/images/ui/Min_UI_AvatarIcon_${a.key}.webp`, 192)
      alt = (textMapJson as TextMap).en[a.nameTextMapHash]
      sx += ` bg-rank-${rankNum[a.qualityType] || 1}`
      break
    }
    case 'weapon': {
      const w = weaponJson.find(e => e.id === id)
      if (!w) break
      setSrc(`/images/ui/Min_${w.icon}.webp`, 128)
      alt = (textMapJson as TextMap).en[w.nameTextMapHash]
      sx += ` bg-rank-${w.rankLevel}`
      break
    }
    case 'material': {
      const m = materialJson.find(e => e.id === id)
      if (!m) break
      setSrc(`/images/ui/Min_${m.icon}.webp`, 128)
      alt = (textMapJson as TextMap).en[m.nameTextMapHash]
      sx += ` bg-rank-${m.rankLevel || 1}`
      break
    }
    case 'element': {
      setSrc(`/images/element/${id}.webp`, 84)
      alt = id.toString()
      rank = 0
      sx = ''
      break
    }
    case 'weapon-type': {
      setSrc(`/images/weapon-type/${id}.webp`, 56)
      alt = id.toString()
      rank = 0
      sx = ''
      break
    }
    case 'circle': {
      const pfp = (profilePictureJson as Record<string | number, string>)[id]
      setSrc(`/images/ui/Min_${pfp}.webp`, undefined, 128)
      alt = pfp.split('_')[2]
      rank = 0
      sx += ' pfp-icon'
      break
    }
  }
  sx += ` ${style}`
}
</script>

{#if text}
<div class="relative rounded-[4%_4%_27%] overflow-hidden">
  <img {loading} {width} {height} {src} {alt} class={sx} />
  <div class="absolute top-0 right-0 bg-neutral rounded-bl-md px-1 text-xs">{text}</div>
</div>
{:else}
<img {loading} {width} {height} {src} {alt} class={sx} />
{/if}
