<script lang="ts">
import { type StatisticsRemapped, fetchStatistics } from '@components/api-statistics'
// client:only="svelte"
import { avatarRemap } from '@components/api-uid'
import type { ApiData, AvatarInfo } from '@components/api-uid-types'
import CritRatioChart from '@components/crit-ratio-chart.svelte'
import ShowcaseSelector from '@components/showcase-selector.svelte'
import UidInput from '@components/uid-input.svelte'
import { type Lang, type TranslationKey, useTranslatedPath, useTranslations } from '@i18n/utils'
import { statFocus } from '@manual/crit-ratio-focus'
import { onMount } from 'svelte'
import Statistics from './statistics.svelte'
import Stats from './stats.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const en = useTranslations('en')
const translatePath = useTranslatedPath(lang)

let apiData = $state<ApiData>()
let avatarInfo = $state<AvatarInfo>()
let resStat = $state<{ json: StatisticsRemapped | undefined; status: number }>({ json: undefined, status: 0 })

onMount(async () => {
  //resStat = await fetchStatistics()
})
</script>

{#snippet analysisTitle(title: TranslationKey, path: string)}
<div class="flex justify-between bg-neutral rounded-full py-3 px-6 mb-2">
  <div>{t(title)}</div>
  <a class="text-link" href={translatePath(path)}>
    {t("showcase.more")}
  </a>
</div>
{/snippet}

<UidInput {lang} bind:apiData />
<ShowcaseSelector {lang} {apiData} bind:avatarInfo sticky />
{#if avatarInfo}
{@const a = avatarRemap(avatarInfo)}
{@const stat = resStat.json?.avatarInfoList.find(e => e.avatarId === a.avatarId)}
{@const type = statFocus[en(a.avatarId, 'avatar')] ?? 'ATK'}
{@const base = a.stats.find(e => e.type === type)?.value.base ?? 0}
{@const add = a.stats.find(e => e.type === type)?.value.add ?? 0}
{@const cr = a.stats.find(e => e.type === "CRIT Rate")?.value.main ?? 0}
{@const cd = a.stats.find(e => e.type === "CRIT DMG")?.value.main ?? 0}
<Stats {lang} {a} />
<div class="divider mt-12">{t("showcase.analysis")}</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <div>
    {@render analysisTitle("showcase.statistics", `/showcase-analytics/?c=${en(a.avatarId, "avatar")}`)}
    {#if !stat}
      {#if resStat.status === 200}
        <div class="text-center mt-4">{t("showcase.non-stat")}</div>
      {:else}
        <div class="text-center mt-4">Error: {resStat.status}</div>
      {/if}
    {:else}
      <Statistics {lang} {a} {stat} />
    {/if}
  </div>
  <div>
    {@render analysisTitle("showcase.crit-ratio", `/crit-ratio/?type=${type}&base=${base.toFixed(0)}&add=${add.toFixed(0)}&cr=${(cr*100).toFixed(1)}&cd=${(cd*100).toFixed(1)}`)}
    {#if type === "none"}
      <div class="text-center mt-4">{t("showcase.non-crit-ratio")}</div>
    {:else}
      <CritRatioChart {lang} {type} {base} {add} {cr} {cd} />
    {/if}
  </div>
</div>
{/if}
