<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo } from '@components/api'
import Dialog from '@components/dialog.svelte'
import { type ScoreType, scoreTypeMenuItems } from '@components/showcase-utils'
import Svg from '@components/svg.svelte'
import type { Lang } from '@i18n/utils'
import { useTranslations } from '@i18n/utils'
import { imageDownload } from '@luisfun/x-canvas'
import CharacterCard from './character-card.svelte'
import GradeHintDialog from './grade-hint-dialog.svelte'

const {
  lang,
  avatarInfo,
}: {
  lang: Lang
  avatarInfo: AvatarInfo // 簡易初期化のため上流でundefinedをはじく
} = $props()
const t = useTranslations(lang)

let canvas: HTMLCanvasElement
let dialog: HTMLDialogElement
let scoreType = $state<ScoreType>(scoreTypeMenuItems[0])
</script>

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto mb-2">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <CharacterCard {lang} {avatarInfo} {scoreType} bind:canvas />
  </div>
</div>
<div class="flex justify-around sm:justify-evenly">
  <button class="btn btn-sm btn-primary leading-8" onclick={() => imageDownload(canvas, "card")}>
    <Svg icon="download" class="py-1.5 inline-block" height="100%" />{t("card.download")}
  </button>
  <div class="flex justify-center">
    <select bind:value={scoreType} class="select select-bordered select-primary select-sm w-full max-w-xs mr-2 sm:mr-4">
      {#each scoreTypeMenuItems as item}
        <option value={item}>{t(item)}</option>
      {/each}
    </select>
    <button class="btn btn-circle btn-xs btn-ghost text-warning my-auto" onclick={() => dialog?.showModal()}>
      <Svg icon="circle-question" height="100%" />
    </button>
  </div>
</div>
<Dialog bind:dialog>
  <GradeHintDialog {lang} />
</Dialog>
{/if}
