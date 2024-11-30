<script lang="ts">
import type { StatisticsRemapped } from '@components/api-statistics'
import { avatarProps } from '@components/img-props'
import { type Lang, useTranslations } from '@i18n/utils'

const {
  lang,
  avatarInfoList,
  onSelect,
}: { lang: Lang; avatarInfoList: StatisticsRemapped['avatarInfoList']; onSelect: (id: number) => void } = $props()
const t = useTranslations(lang)

const users = avatarInfoList.map(e => ({ avatarId: e.avatarId, num: e.count })).sort((a, b) => b.num - a.num)
const star5 = (e: StatisticsRemapped['avatarInfoList'][number]) =>
  e.qualityType === 'QUALITY_ORANGE' && e.avatarId !== 10000005 && e.avatarId !== 10000007
const c0 = avatarInfoList
  .filter(star5)
  .map(e => ({ avatarId: e.avatarId, num: e.consts[0] / e.count }))
  .sort((a, b) => b.num - a.num)
const c6 = avatarInfoList
  .filter(star5)
  .map(e => ({ avatarId: e.avatarId, num: e.consts[6] / e.count }))
  .sort((a, b) => b.num - a.num)

const per = (num: number) => (num * 100).toFixed(num < 0.1 ? 1 : 0)
</script>

{#snippet tab(title: string, list: {avatarId: number; num: number}[], percent?: boolean, checked?: boolean)}
  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label={title} {checked} />
  <div role="tabpanel" class="tab-content">
    <div class="grid gap-4 grid-cols-5 md:grid-cols-10 mt-4">
      {#each list as icon}
        <button onclick={() => onSelect(icon.avatarId)}>
          <img loading="lazy" fetchpriority="low" {...avatarProps(icon.avatarId)} />
          <div class="text-center text-base">
            {percent ? per(icon.num) : icon.num}{#if percent}<span class="text-xs text-text-sub">%</span>{/if}
          </div>
        </button>
      {/each}
    </div>
  </div>
{/snippet}

<div role="tablist" class="tabs tabs-lg tabs-bordered grid-cols-3">
  {@render tab(t("statistics.tab.users"), users, false, true)}
  {@render tab(t("statistics.tab.c0"), c0, true)}
  {@render tab(t("statistics.tab.c6"), c6, true)}
</div>
