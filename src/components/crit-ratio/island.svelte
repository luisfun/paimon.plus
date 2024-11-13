<script lang="ts">
import CritRatioChart from '@components/crit-ratio-chart.svelte'
// client:load
import { type Lang, useTranslations } from '@i18n/utils'
import Input from './input.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let type = $state<'ATK' | 'HP' | 'DEF'>('ATK')
let base = $state<number>()
let add = $state<number>()
let cr = $state<number>()
let cd = $state<number>()

const onclick = () => {}
</script>

<div>
  <Input {lang} bind:type bind:base bind:add bind:cr bind:cd />
</div>
<div>
  {#if base && add && cr && cd}
  <CritRatioChart {lang} {type} {base} {add} cr={cr/100} cd={cd/100}>
    <div class="text-right">
      <button class="btn btn-sm btn-primary" {onclick}>{t("crit-ratio.keep")}</button>
    </div>
  </CritRatioChart>
  {/if}
</div>
