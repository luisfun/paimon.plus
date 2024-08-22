<script lang="ts">
import avatar from '@game/avatar.json'
import material from '@game/material.json'
import textMap from '@game/text-map.json'
import weapon from '@game/weapon.json'
import type { HTMLImgAttributes } from 'svelte/elements'
type TextMap = { en: Record<number, string> }

export let id: number | string
export let ui: 'avatar' | 'weapon' | 'material' | 'element' | 'weapon-type'
export let text: string | number = ''
export let loading: HTMLImgAttributes['loading'] = undefined
export let style = ''

const dummySrc = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7'
let src = dummySrc
let alt = 'None'
let rank = 1
let width = 1
let height = 1

const rankNum: Record<string, number> = {
  QUALITY_ORANGE: 5,
  QUALITY_PURPLE: 4,
  QUALITY_ORANGE_SP: 5,
}

const setSrc = (newSrc: string, px: number) => {
  width = px
  height = px
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
$: switch (ui) {
  case 'avatar': {
    const a = avatar.find(e => e.id === id)
    if (!a) break
    setSrc(`/images/ui/Min_UI_AvatarIcon_${a.key}.webp`, 192)
    alt = (textMap as TextMap).en[a.nameTextMapHash]
    rank = rankNum[a.qualityType] || 1
    break
  }
  case 'weapon': {
    const w = weapon.find(e => e.id === id)
    if (!w) break
    setSrc(`/images/ui/Min_${w.icon}.webp`, 128)
    alt = (textMap as TextMap).en[w.nameTextMapHash]
    rank = w.rankLevel
    break
  }
  case 'material': {
    const m = material.find(e => e.id === id)
    if (!m) break
    setSrc(`/images/ui/Min_${m.icon}.webp`, 128)
    alt = (textMap as TextMap).en[m.nameTextMapHash]
    rank = m.rankLevel || 1
    break
  }
  case 'element': {
    setSrc(`/images/element/${id}.webp`, 84)
    alt = id.toString()
    rank = 0
    break
  }
  case 'weapon-type': {
    setSrc(`/images/weapon-type/${id}.webp`, 56)
    alt = id.toString()
    rank = 0
    break
  }
}
</script>

{#if text}
<div class="relative rounded-[4%_4%_27%] overflow-hidden">
  <img {loading} {width} {height} {src} {alt} class={(ui === "element" || ui === "weapon-type") ? style : `bg-rank-${rank} bg-cover w-full ${style}`} />
  <div class="absolute top-0 right-0 bg-neutral rounded-bl-md px-1 text-xs">{text}</div>
</div>
{:else}
<img {loading} {width} {height} {src} {alt} class={(ui === "element" || ui === "weapon-type") ? style : `bg-rank-${rank} bg-cover w-full rounded-[4%_4%_27%] ${style}`} />
{/if}
