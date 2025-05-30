<script lang="ts">
import type { AvatarRemapped } from '@components/api-uid'
import Dialog from '@components/dialog.svelte'
import { statProps } from '@components/img-props'
// biome-ignore lint: svelte
import { defineSub, defineToName } from '@components/showcase-utils'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslatedPath, useTranslations } from '@i18n/utils'
import { imageDownload } from '@luisfun/x-canvas'
import { marks } from '@manual/showcase-default-marks'
import StatsCard from './stats-card.svelte'
const initSub = (id: number | undefined) => marks[useTranslations('en')(id || -1, 'avatar')] ?? marks.default

const {
  lang,
  a,
}: {
  lang: Lang
  a: AvatarRemapped // 簡易初期化のため上流でundefinedをはじく
} = $props()
const t = useTranslations(lang)
const translatePath = useTranslatedPath(lang)

let canvas: HTMLCanvasElement
let dialog: HTMLDialogElement
let subMarks = $state(initSub(a?.avatarId))

const onClick = (stat: (typeof defineSub)[number]) => {
  if (!subMarks.includes(stat)) subMarks.push(stat)
  else subMarks = subMarks.filter(e => e !== stat)
}

let avatarIdLog = a?.avatarId
$effect.pre(() => {
  if (avatarIdLog !== a?.avatarId) {
    subMarks = initSub(a?.avatarId)
    avatarIdLog = a?.avatarId
  }
})
</script>

{#if a}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto mb-2">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <StatsCard {lang} {a} {subMarks} bind:canvas />
  </div>
</div>
<div class="flex justify-around sm:justify-evenly">
  <div class="flex justify-center">
    <button class="btn btn-sm btn-primary leading-8 mr-2 sm:mr-4" onclick={() => imageDownload(canvas, "card")}>
      <Svg icon="download" class="w-4 h-4" />{t("card.download")}
    </button>
    <button class="btn btn-sm btn-primary leading-8 btn-circle" aria-label="sub stats config" onclick={() => dialog?.showModal()}>
      <Svg icon="list-check" class="w-4 h-4" />
    </button>
  </div>
  <a role="button" class="btn btn-sm btn-primary leading-8 btn-outline" href={translatePath("/artifacter/")}>
    <Svg icon="circlet" class="w-4 h-4" />Artifacter
  </a>
</div>
<Dialog bind:dialog>
  <div class="m-1">
  {#each defineSub as stat }
    <div class="form-control m-1">
      <label class="label cursor-pointer justify-normal">
        <input type="checkbox" checked={subMarks.includes(stat)} class="checkbox checkbox-primary" onclick={() => onClick(stat)} />
        <img {...statProps(defineToName[stat])} class="w-6 mx-1" />
        <span class="label-text leading-6">{t(defineToName[stat])}</span>
      </label>
    </div>
  {/each}
  </div>
</Dialog>
{/if}
