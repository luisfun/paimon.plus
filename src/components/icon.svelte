<script lang="ts">
import avatar from '@game/avatar.json'
import material from '@game/material.json'
import textMap from '@game/text-map.json'
import type { HTMLImgAttributes } from 'svelte/elements'
type TextMap = { en: Record<number, string> }

export let id: number
export let ui: 'avatar' | 'material' = 'avatar'
//export let costumes = ''
export let text = ''
export let loading: HTMLImgAttributes["loading"] = undefined
export let isLoading = true
export let expand = true

let src = '/images/None.webp'
let alt = 'None'
let rank = 1

const rankNum: Record<string, number> = {
  QUALITY_ORANGE: 5,
  QUALITY_PURPLE: 4,
}

$: if (isLoading)
  switch (ui) {
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
</script>

{#if text}
<div />
{:else}
<img {loading} {src} {alt} class="bg-rank-{rank} w-full rounded-[3%_3%_27%_3%] {(ui === "avatar" && expand) ? "icon-expand" : ""}" />
{/if}

<style>
  .icon-expand {
    object-view-box: inset(2px 32px 62px 32px);
  }
</style>
