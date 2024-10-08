<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo } from '@components/api'
import Dialog from '@components/dialog.svelte'
import Icon from '@components/icon.svelte'
import Svg from '@components/svg.svelte'
import type { Lang } from '@i18n/utils'
import { useTranslatedPath, useTranslations } from '@i18n/utils'
import SubStatsJson from '@manual/showcase-sub-stats.json'
import Card from './card.svelte'
// biome-ignore lint: svelte
import { defineSub, defineToName } from './utils'
const SubStats = SubStatsJson as Record<keyof typeof SubStatsJson, (typeof defineSub)[number][]>
const initSub = (id: number | undefined) =>
  SubStats[useTranslations('en')(id || -1, 'avatar') as keyof typeof SubStatsJson] || SubStats.default

const {
  lang,
  avatarInfo,
}: {
  lang: Lang
  avatarInfo: AvatarInfo // 簡易初期化のため上流でundefinedをはじく
} = $props()
const t = useTranslations(lang)
const translatePath = useTranslatedPath(lang)

let dialog = $state<HTMLDialogElement>()
let subMarks = $state(initSub(avatarInfo?.avatarId))

const onClick = (stat: (typeof defineSub)[number]) => {
  if (!subMarks.includes(stat)) subMarks.push(stat)
  else subMarks = subMarks.filter(e => e !== stat)
}

let avatarIdLog = avatarInfo?.avatarId
$effect.pre(() => {
  if (avatarIdLog !== avatarInfo?.avatarId) {
    subMarks = initSub(avatarInfo?.avatarId)
    avatarIdLog = avatarInfo?.avatarId
  }
})
</script>

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto mb-2">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} {avatarInfo} {subMarks} />
  </div>
</div>
<div class="flex justify-around sm:justify-evenly">
  <div class="flex justify-center">
    <button class="btn btn-sm btn-primary leading-8 mr-2 sm:mr-4">
      <Svg icon="download" class="py-1.5" height="100%" />{t("card.download")}
    </button>
    <button class="btn btn-sm btn-primary leading-8 btn-circle" aria-label="sub stats config" onclick={() => dialog?.showModal()}>
      <Svg icon="list-check" class="py-1.5" height="100%" />
    </button>
  </div>
  <a role="button" class="btn btn-sm btn-primary leading-8 btn-outline" href={translatePath("/artifacter/")}>
    <Svg icon="circlet" class="py-1.5" height="100%" />Artifacter
  </a>
</div>
<Dialog bind:dialog>
  <div class="m-1">
  {#each defineSub as stat }
    <div class="form-control m-1">
      <label class="label cursor-pointer justify-normal">
        <input type="checkbox" checked={subMarks.includes(stat)} class="checkbox checkbox-primary" onclick={() => onClick(stat)} />
        <Icon id={defineToName[stat]} ui="stat" style="w-6 mx-1" />
        <span class="label-text leading-6">{t(defineToName[stat])}</span>
      </label>
    </div>
  {/each}
  </div>
</Dialog>
{/if}
