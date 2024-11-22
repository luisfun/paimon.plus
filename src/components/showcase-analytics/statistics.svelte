<script lang="ts">
// client:load
import { type StatisticsRemapped, fetchStatistics } from '@components/api-statistics'
import DialogDelayIcon from '@components/dialog-delay-Icon.svelte'
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import Img from '@components/img.svelte'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'
import Character from './character.svelte'
import ChartBar from './chart-bar.svelte'
import ChartStacked from './chart-stacked.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let isInitLoading = $state(true)
let data = $state<StatisticsRemapped>()
let status = $state(0)
let avatarInfo = $state<StatisticsRemapped['avatarInfoList'][number]>()

let dialog: HTMLDialogElement

const onSelect = (id: number) => {
  avatarInfo = data?.avatarInfoList.find(e => e.avatarId === id)
}

onMount(async () => {
  const res = await fetchStatistics()
  data = res.json
  status = res.status
  avatarInfo = res.json?.avatarInfoList[0]
  isInitLoading = false
})
</script>

{#if isInitLoading && !data}
<div class="flex justify-center mt-[15svh]">
  <div class="loading loading-ring w-24"></div>
</div>
{:else if !data}
<div>Error: {status}</div>
{:else if avatarInfo}
<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <div class="col-start-1 md:col-start-2">
    <div class="text-2xl font-bold">{t("statistics.character")}</div>
    <div class="text-right text-text-sub">{avatarInfo.count} {t("statistics.users")}</div>
    <div class="grid grid-cols-4 gap-3">
      <button onclick={() => dialog.showModal()} aria-label="character select">
        <Img {...avatarProps(avatarInfo.avatarId)} />
      </button>
      <div class="col-span-3 flex flex-col justify-evenly pl-2">
        <div class="text-text-sub">{t("statistics.select-character")}</div>
        <button class="mr-auto text-xl flex items-center" onclick={() => dialog.showModal()}>
          {t(avatarInfo.avatarId, "avatar")}<Svg icon="caret-down" class="h-3 ml-2" />
        </button>
      </div>
    </div>
    <Dialog bind:dialog>
      <DialogDelayIcon
        {lang}
        style="m-2"
        ids={data.avatarInfoList.map(e => e.avatarId)}
        ui="avatar"
        onclick={onSelect}
      />
    </Dialog>
    <Character {lang} {avatarInfo} />
  </div>
  <div class="row-start-2 md:row-start-1">
    <div class="text-2xl font-bold">{t("statistics.player")}</div>
    <div class="text-right text-text-sub">{data.playerInfo.count} {t("statistics.users")}</div>
    <div class="text-center font-bold mt-2">{t("statistics.ar")}</div>
    <ChartStacked array={data.playerInfo.level} />
    <div class="text-center font-bold mt-12">{t("statistics.achievement")}</div>
    <ChartBar playerInfo={data.playerInfo} />
    <div class="text-center font-bold mt-12">{t("statistics.abyss")}</div>
    <ChartStacked array={data.playerInfo.towerFloorIndex} />
    <div class="text-center font-bold mt-12">{t("statistics.theater")}</div>
    <ChartStacked array={data.playerInfo.theaterActIndex} />
  </div>
</div>
{:else}
<div>Unknown Error</div>
{/if}
