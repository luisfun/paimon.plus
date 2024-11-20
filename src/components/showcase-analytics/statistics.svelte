<script lang="ts">
// client:load
import { type StatisticsRemapped, fetchStatistics } from '@components/api-statistics'
//import type { Statistics } from '@components/api-statistics-types'
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'
import ChartBar from './chart-bar.svelte'
import ChartStacked from './chart-stacked.svelte'

let { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let isInitLoading = $state(true)
let data = $state<StatisticsRemapped>()
let status = $state(0)

onMount(async () => {
  const res = await fetchStatistics()
  data = res.json
  status = res.status
  isInitLoading = false
})
</script>

{#if isInitLoading && !data}
<div class="flex justify-center mt-[15svh]">
  <div class="loading loading-ring w-24"></div>
</div>
{:else if !data}
<div>{status}</div>
{:else}
<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
  <div>
    <div class="text-2xl font-bold">{t("statistics.player")}</div>
    <div class="text-right text-text-sub">{data.playerInfo.count} users</div>
    <div class="text-center font-bold">{t("statistics.ar")}</div>
    <ChartStacked array={data.playerInfo.level} />
    <div class="text-center font-bold mt-8">{t("statistics.achievement")}</div>
    <ChartBar playerInfo={data.playerInfo} />
    <div class="text-center font-bold mt-8">{t("statistics.abyss")}</div>
    <ChartStacked array={data.playerInfo.towerFloorIndex} />
    <div class="text-center font-bold mt-8">{t("statistics.theater")}</div>
    <ChartStacked array={data.playerInfo.theaterActIndex} />
  </div>
</div>
{/if}
