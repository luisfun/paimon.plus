<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo } from '@components/api'
import Dialog from '@components/dialog.svelte'
import Icon from '@components/icon.svelte'
import { type ScoreType, scoreTypeMenuItems } from '@components/showcase-utils'
import Svg from '@components/svg.svelte'
import type { Lang } from '@i18n/utils'
import { useTranslatedPath, useTranslations } from '@i18n/utils'
import { imageDownload } from '@luisfun/x-canvas'
//import CharacterCard from './character-card.svelte'

//import SubStatsJson from '@manual/showcase-sub-stats.json'
// biome-ignore lint: svelte
//import { defineSub, defineToName } from './utils'
//const SubStats = SubStatsJson as Record<keyof typeof SubStatsJson, (typeof defineSub)[number][]>
//const initSub = (id: number | undefined) =>
//  SubStats[useTranslations('en')(id || -1, 'avatar') as keyof typeof SubStatsJson] || SubStats.default

const {
  lang,
  avatarInfo,
}: {
  lang: Lang
  avatarInfo: AvatarInfo // 簡易初期化のため上流でundefinedをはじく
} = $props()
const t = useTranslations(lang)
const translatePath = useTranslatedPath(lang)

let scoreType = $state<ScoreType>(scoreTypeMenuItems[0])
let canvas: HTMLCanvasElement
</script>

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto mb-2">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <!--CharacterCard {lang} {avatarInfo} {subMarks} bind:canvas /-->
  </div>
</div>
<div class="flex justify-around sm:justify-evenly">
  <button class="btn btn-sm btn-primary leading-8" onclick={() => imageDownload(canvas, "card")}>
    <Svg icon="download" class="py-1.5" height="100%" />{t("card.download")}
  </button>
  <div class="flex justify-center">
    <select bind:value={scoreType} class="select select-bordered select-primary select-sm w-full max-w-xs">
      {#each scoreTypeMenuItems as item}
        <option value={item}>{t(item)}</option>
      {/each}
    </select>
  </div>
</div>
{/if}
