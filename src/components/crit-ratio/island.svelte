<script lang="ts">
// client:load
import CritRatioChart from '@components/crit-ratio-chart.svelte'
import CritRatioNote from '@components/crit-ratio-note.svelte'
import { type NoteArr, avg } from '@components/crit-ratio-utils'
import { type Lang, useTranslations } from '@i18n/utils'
import Input from './input.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let type = $state<'ATK' | 'HP' | 'DEF'>('ATK')
let base = $state<number>(123) //()
let add = $state<number>(123) //()
let cr = $state<number>(66) //()
let cd = $state<number>(123) //()
let noteArr = $state<NoteArr>([])

const onclick = () =>
  noteArr.push({ type, base, add, cr, cd, avg: avg(base, add, cr / 100, cd / 100), cDmg: avg(base, add, 1, cd / 100) })
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
<CritRatioNote {lang} bind:noteArr />
