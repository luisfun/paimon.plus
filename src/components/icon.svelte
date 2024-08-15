<script lang="ts">
import avatar from '@game/avatar.json'
import material from '@game/material.json'
import textMap from '@game/text-map.json'
type TextMap = { en: Record<number, string> }

export let id: number
export let ui: 'avatar' | 'material' = 'avatar'
//export let costumes = ''
export let text = ''

let src = ''
let alt = ''
let rank = 0

const rankNum: Record<string, number> = {
  QUALITY_ORANGE: 5,
  QUALITY_PURPLE: 4,
}

$: switch (ui) {
  case 'avatar': {
    const a = avatar.find(e => e.id === id)
    if (!a) break
    src = `/images/ui/${a.iconName}.webp`
    alt = (textMap as TextMap).en[a.nameTextMapHash]
    rank = rankNum[a.qualityType] || 1
    break
  }
  case 'material': {
    const m = material.find(e => e.id === id)
    if (!m) break
    src = `/images/ui/${m.icon}.webp`
    alt = (textMap as TextMap).en[m.nameTextMapHash]
    rank = m.rankLevel || 1
    break
  }
}
$: if (!src && !alt && !rank) {
  src = `/images/ui/Empty.webp`
  alt = "Empty"
  rank = 1
}
</script>

{#if text}
<div />
{:else}
<img {src} {alt} class="bg-rank-{rank} w-full rounded-[3%_3%_27%_3%]" />
{/if}
