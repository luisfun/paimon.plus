<script lang="ts">
// client:load
import { type StatisticsRemapped, fetchStatistics } from '@components/api-statistics'
import { fetchUid } from '@components/api-uid'
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
import Ranking from './ranking.svelte'

const INIT_ACHIEVEMENT = 800

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const en = useTranslations('en')

let isInitLoading = $state(true)
let res = $state<{ json: StatisticsRemapped | undefined; status: number }>({ json: undefined, status: 0 })
let avatarInfo = $state<StatisticsRemapped['avatarInfoList'][number]>()
let achievement = $state(INIT_ACHIEVEMENT)

let dialog: HTMLDialogElement

const onSelect = (id: number) => {
  avatarInfo = res.json?.avatarInfoList.find(e => e.avatarId === id)
}

const topPer = (n: number) => {
  const player = res.json?.playerInfo
  if (!player) return Number.NaN
  let count = 0
  for (let i = 0; i < n; i++) count += player.finishAchievementNum[i]
  count += player.finishAchievementNum[n] / 2
  const per = ((player.count - count) / player.count) * 100
  return per.toFixed(per < 1 ? 1 : 0)
}

onMount(() =>
  Promise.all([
    (async () => {
      res = await fetchStatistics()
      const name = new URLSearchParams(window.location.search).get('c')
      avatarInfo = res.json?.avatarInfoList.find(e => name === en(e.avatarId, 'avatar')) ?? res.json?.avatarInfoList[0]
      isInitLoading = false
    })(),
    (async () => {
      const lsUid = localStorage.getItem('uid')
      const uidData = await fetchUid(lsUid ? Number(lsUid) : undefined, 'cache')
      achievement = uidData.json?.playerInfo.finishAchievementNum ?? INIT_ACHIEVEMENT
    })(),
  ]),
)
</script>

{#if isInitLoading && !res.json}
<div class="flex justify-center mt-[15svh]">
  <div class="loading loading-ring w-24"></div>
</div>
{:else if !res.json}
<div>Error: {res.status}</div>
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
        ids={res.json.avatarInfoList.map(e => e.avatarId)}
        ui="avatar"
        onclick={onSelect}
      />
    </Dialog>
    <Character {lang} {avatarInfo} />
  </div>
  <div class="row-start-2 md:row-start-1">
    <div class="text-2xl font-bold">{t("statistics.player")}</div>
    <div class="text-right text-text-sub">{res.json.playerInfo.count} {t("statistics.users")}</div>
    <div class="text-center font-bold mt-2">{t("statistics.ar")}</div>
    <ChartStacked array={res.json.playerInfo.level} />
    <div class="text-center font-bold mt-12">{t("statistics.achievement")}</div>
    <div class="flex items-center mt-2">
      <div class="w-2/3 max-w-2/3">
        <ChartBar playerInfo={res.json.playerInfo} />
      </div>
      <div class="w-1/3 text-center text-base">
        <div>{t("statistics.achievement.player")}</div>
        <div class="text-2xl">{res.json.playerInfo.finishAchievementNumTop}</div>
        <div class="divider my-0 mx-4"></div>
        {#if achievement < res.json.playerInfo.finishAchievementNumTop}
        <div>{t("statistics.achievement.top")} {topPer(achievement)}%</div>
        {:else}
        <div>{t("statistics.achievement.you")}</div>
        {/if}
        <input type="number" class="input text-2xl w-2/3 h-10 pl-0 text-center" bind:value={achievement} aria-label="Your Achievement" />
      </div>
    </div>
    <div class="text-center font-bold mt-12">{t("statistics.abyss")}</div>
    <ChartStacked array={res.json.playerInfo.towerFloorIndex} />
    <div class="text-center font-bold mt-12">{t("statistics.theater")}</div>
    <ChartStacked array={res.json.playerInfo.theaterActIndex} />
  </div>
  <div class="md:col-span-2">
    <div class="text-2xl font-bold">{t("statistics.ranking")}</div>
    <Ranking {lang} avatarInfoList={res.json.avatarInfoList} {onSelect} />
  </div>
</div>
{:else}
<div>Unknown Error</div>
{/if}
