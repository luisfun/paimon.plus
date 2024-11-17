<script lang="ts">
import type { AvatarInfo } from '@components/api'
import DialogDelayIcon from '@components/dialog-delay-Icon.svelte'
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import { type ScoreType, scoreTypeMenuItems } from '@components/showcase-utils'
import Svg from '@components/svg.svelte'
import type { Lang } from '@i18n/utils'
import { useTranslations } from '@i18n/utils'
import { imageDownload } from '@luisfun/x-canvas'
import TeamCard from './team-card.svelte'

const {
  lang,
  avatarInfoList,
}: {
  lang: Lang
  avatarInfoList: AvatarInfo[] // 簡易初期化のため上流でundefinedをはじく
} = $props()
const t = useTranslations(lang)

let canvas: HTMLCanvasElement
let dialogs: HTMLDialogElement[] = []
let selectTeam = $state<[number, ScoreType][]>([
  [avatarInfoList[0].avatarId, scoreTypeMenuItems[0]],
  [-1, 'CRIT'],
  [-1, 'CRIT'],
  [-1, 'CRIT'],
])

const onReset = (i: number) => {
  selectTeam[i][0] = -1
  dialogs[i].close()
}

$effect.pre(() => {
  selectTeam = [
    [avatarInfoList[0].avatarId, scoreTypeMenuItems[0]],
    [-1, 'CRIT'],
    [-1, 'CRIT'],
    [-1, 'CRIT'],
  ]
})
</script>

{#if avatarInfoList}
<div class="divider mt-12">{t("artifacter.team")}</div>
<div class="mb-3 mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-[-2rem] py-3 gradient">
  <div class="grid gap-3 grid-cols-1 sm:grid-cols-[repeat(4,_max-content)] sm:w-min m-auto">
  {#each selectTeam as member, i}
    <div class="grid gap-3 sm:gap-2 grid-cols-[repeat(2,_max-content)] sm:grid-cols-1 m-auto">
      <button class="w-14 m-auto" onclick={() => dialogs[i].showModal()} aria-label="team select">
        <img {...avatarProps(member[0])} {...(member[0] === -1 ? { src: "/images/Empty.webp" } : {})} />
      </button>
      <select bind:value={member[1]} class="select select-bordered select-primary select-sm w-full max-w-xs m-auto">
        {#each scoreTypeMenuItems as item}
          <option value={item}>{t(item)}</option>
        {/each}
      </select>
    </div>
    <Dialog bind:dialog={dialogs[i]}>
      <button class="h-12 mt-2 mb-0 mx-auto block" onclick={() => onReset(i)}>
        <img class="w-12 h-12" src="/images/Empty.webp" alt="Empty" />
      </button>
      <DialogDelayIcon
        {lang}
        style="m-2{avatarInfoList.length < 13 ? " !grid-cols-4 max-w-72" : ""}"
        ids={avatarInfoList.map(e => e.costumeId ? [e.avatarId, e.costumeId] : e.avatarId)}
        ui="avatar"
        onclick={id => {member[0] = id}}
      />
    </Dialog>
  {/each}
  </div>
</div>
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto mb-2">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <TeamCard {lang} {avatarInfoList} {selectTeam} bind:canvas />
  </div>
</div>
<div class="text-center">
  <button class="btn btn-sm btn-primary leading-8 m-auto" onclick={() => imageDownload(canvas, "card")}>
    <Svg icon="download" class="w-4 h-4" />{t("card.download")}
  </button>
</div>
{/if}

<style>
  .gradient {
    background-image: linear-gradient(to right, transparent, rgb(27, 29, 42) 4rem, rgb(27, 29, 42) calc(100% - 4rem), transparent);
  }
</style>
