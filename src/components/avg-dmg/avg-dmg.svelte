<script lang="ts">
// client:load
import CritRatioNote from '@components/crit-ratio-note.svelte'
import { type NoteArr, clip01 } from '@components/crit-ratio-utils'
import { type Lang, useTranslations } from '@i18n/utils'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let isCrit = $state(true)
let cr = $state<number>()
let cd = $state<number>()
let dmg = $state<number>()
let noteArr = $state<NoteArr>([])
let checked = $state(true)

const avg = (cr: number, cd: number, isCrit: boolean, dmg: number) => {
  if (isCrit) return Number(((dmg * (1 + clip01(cr) * cd)) / (1 + cd)).toFixed(0))
  return Number((dmg * (1 + clip01(cr) * cd)).toFixed(0))
}
const cDmg = (cd: number, isCrit: boolean, dmg: number) => {
  if (isCrit) return Number(dmg.toFixed(0))
  return Number((dmg * (1 + cd)).toFixed(0))
}

const onclick = () => {
  if (cr && cd && dmg) {
    checked = false
    noteArr.unshift({
      cr,
      cd,
      avg: avg(cr / 100, cd / 100, isCrit, dmg),
      cDmg: cDmg(cd / 100, isCrit, dmg),
    })
  }
}
</script>

<div class="flex">
  <div class="w-full">
    <div class="text-lg font-bold mb-4">{t("avg-dmg.stats")}</div>
    {t("CRIT Rate")}
    <div class="ml-6 mt-2 mb-6">
      <input bind:value={cr} type="number" class="input input-bordered text-3xl w-32" />
    </div>
    {t("CRIT DMG")}
    <div class="ml-6 mt-2 mb-6">
      <input bind:value={cd} type="number" class="input input-bordered text-3xl w-32" />
    </div>
  </div>
  <div class="w-full">
    <div class="text-lg font-bold mb-4">{t("avg-dmg.damage")}</div>
    <select bind:value={isCrit} class="select select-sm text-base leading-8">
      <option value={true}>{t("CRIT")}</option>
      <option value={false}>{t("avg-dmg.noncrit")}</option>
    </select>
    <div class="flex items-center ml-6 mt-2 mb-6">
      <input bind:value={dmg} type="number" class="input input-bordered text-3xl w-32" />
    </div>
  </div>
</div>
<div>
  {#if cr && cd && dmg}
  <div>{t("avg-dmg.avg")} : <span class="text-3xl">{avg(cr / 100, cd / 100, isCrit, dmg)}</span></div>
  <div class="text-right">
    <button class="btn btn-sm btn-primary" {onclick}>{t("crit-ratio.keep")}</button>
  </div>
  {/if}
</div>
<CritRatioNote {lang} bind:noteArr />
