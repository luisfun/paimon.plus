<script lang="ts">
// client:load
import CritRatioChart from '@components/crit-ratio-chart.svelte'
import CritRatioNote from '@components/crit-ratio-note.svelte'
import { type NoteArr, avg } from '@components/crit-ratio-utils'
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let type = $state<'ATK' | 'HP' | 'DEF'>('ATK')
let base = $state<number>()
let add = $state<number>()
let cr = $state<number>()
let cd = $state<number>()
let noteArr = $state<NoteArr>([])
let checked = $state(true)

const selectType = ['ATK', 'HP', 'DEF'] as const

const onclick = () => {
  if (base && add && cr && cd) {
    checked = false
    noteArr.unshift({
      type,
      base,
      add,
      cr,
      cd,
      avg: avg(base, add, cr / 100, cd / 100),
      cDmg: avg(base, add, 1, cd / 100),
    })
  }
}

onMount(() => {
  const params = new URLSearchParams(window.location.search)
  const typePram = params.get('type')
  // @ts-expect-error
  type = selectType.includes(typePram) ? typePram : 'ATK'
  base = Number(params.get('base'))
  add = Number(params.get('add'))
  cr = Number(params.get('cr'))
  cd = Number(params.get('cd'))
})

$effect(() => {
  if (!noteArr[0]) checked = true
})
</script>

<div>
  <select bind:value={type} class="select select-sm text-base leading-8">
    {#each selectType as stat}
      <option value={stat}>{t(stat)}</option>
    {/each}
  </select>
  {t("crit-ratio.(wg)")}
  <div class="flex items-center ml-6 mt-2 mb-6">
    <input bind:value={base} type="number" class="input input-bordered text-3xl w-32" />
    <div class="mx-2 text-3xl">+</div>
    <input bind:value={add} type="number" class="input input-bordered text-3xl w-32" />
  </div>
  {t("CRIT Rate")}
  <div class="ml-6 mt-2 mb-6">
    <input bind:value={cr} type="number" class="input input-bordered text-3xl w-32" />
  </div>
  {t("CRIT DMG")}
  <div class="ml-6 mt-2 mb-6">
    <input bind:value={cd} type="number" class="input input-bordered text-3xl w-32" />
  </div>
</div>
<div>
  {#if base && add && cr && cd}
  <CritRatioChart {lang} {checked} {type} {base} {add} cr={cr/100} cd={cd/100}>
    <div class="text-right">
      <button class="btn btn-sm btn-primary" {onclick}>{t("crit-ratio.keep")}</button>
    </div>
  </CritRatioChart>
  {/if}
</div>
<CritRatioNote {lang} bind:noteArr />
