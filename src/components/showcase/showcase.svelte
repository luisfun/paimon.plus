<script lang="ts">
// client:only="svelte"
import { avatarRemap } from '@components/api-uid'
import type { ApiData, AvatarInfo } from '@components/api-uid-types'
import CritRatioChart from '@components/crit-ratio-chart.svelte'
import ShowcaseSelector from '@components/showcase-selector.svelte'
import UidInput from '@components/uid-input.svelte'
import { type Lang, useTranslatedPath, useTranslations } from '@i18n/utils'
import { statFocus } from '@manual/crit-ratio-focus'
import Stats from './stats.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const translatePath = useTranslatedPath(lang)

let apiData = $state<ApiData>()
let avatarInfo = $state<AvatarInfo>()
</script>

<UidInput {lang} bind:apiData />
<ShowcaseSelector {lang} {apiData} bind:avatarInfo sticky />
{#if avatarInfo}
{@const a = avatarRemap(avatarInfo)}
{@const type = statFocus[useTranslations('en')(a.avatarId, 'avatar')] ?? 'ATK'}
{@const base = a.stats.find(e => e.type === type)?.value.base ?? 0}
{@const add = a.stats.find(e => e.type === type)?.value.add ?? 0}
{@const cr = a.stats.find(e => e.type === "CRIT Rate")?.value.main ?? 0}
{@const cd = a.stats.find(e => e.type === "CRIT DMG")?.value.main ?? 0}
<Stats {lang} {a} />
<div class="divider mt-12">{t("showcase.analysis")}</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
  <div>
    <div class="flex justify-between bg-neutral rounded-full py-3 px-6 mb-2">
      <div>{t("showcase.crit-ratio")}</div>
      {#if type !== "none"}
        <a class="text-link" href={translatePath(`/crit-ratio/?type=${type}&base=${base.toFixed(0)}&add=${add.toFixed(0)}&cr=${(cr*100).toFixed(1)}&cd=${(cd*100).toFixed(1)}`)}>
          {t("showcase.more")}
        </a>
      {/if}
    </div>
    {#if type === "none"}
      <div>none</div>
    {:else}
      <CritRatioChart {lang} {type} {base} {add} {cr} {cd} />
    {/if}
  </div>
</div>
{/if}
