<script lang="ts">
import type { StatisticsRemapped } from '@components/api-statistics'
import type { AvatarRemapped } from '@components/api-uid'
import { src } from '@components/img-props'
import Img from '@components/img.svelte'
import { elementColor } from '@components/showcase-utils'
import StatisticsEquip from '@components/statistics-equip.svelte'
import { type Lang, type TranslationKey, useTranslations } from '@i18n/utils'

const { lang, a, stat }: { lang: Lang; a: AvatarRemapped; stat: StatisticsRemapped['avatarInfoList'][number] } =
  $props()
const t = useTranslations(lang)

// biome-ignore format: ternary operator
const tFix = (text: TranslationKey): TranslationKey =>
  text === 'Elemental Mastery' ? 'El. Mastery' :
  text === 'Energy Recharge' ? 'En. Recharge' :
  text === 'Elemental DMG Bonus' ? 'El. DMG' : text

const numRange = (type: string) =>
  [
    { type: 'HP', val: 1800 },
    { type: 'ATK', val: 130 },
    { type: 'DEF', val: 160 },
    { type: 'Elemental Mastery', val: 60 },
    { type: 'CRIT Rate', val: 0.1 },
    { type: 'CRIT DMG', val: 0.2 },
    { type: 'Energy Recharge', val: 0.15 },
  ].find(e => e.type === type)?.val || 0.150001
const bgColor = (range: -1 | 0 | 1) =>
  range === 1 ? ' bg-[rgba(0,191,255,.3)]' : range === -1 ? ' bg-[rgba(255,63,0,.3)]' : ''
</script>

<div class="flex">
  <div class="w-1/5 flex justify-center items-center">
    <div>
      {#if !stat.travelerElement}
        {#each stat.skills as s}
          <div class="flex items-end">
            <Img class="border-2 rounded-full bg-neutral w-7 h-7" style="border-color: {elementColor(a.element, true)};" src={src("ui", s.icon)} alt={s.icon} />
            <div class="px-1 py-px rounded" style="background-color: {elementColor(a.element)};">{"display" in s ? s.display : ""}</div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <StatisticsEquip class="w-2/5 flex items-center" {lang} view={2} weapon={stat.weapon} />
  <StatisticsEquip class="w-2/5 flex items-center" {lang} view={2} reliquarySet={stat.reliquarySet} dropEnd />
</div>
<div class="grid gap-y-2 grid-cols-[2fr_1fr_1fr] bg-neutral rounded-2xl p-2 mt-4 leading-6 max-w-sm mx-auto">
  <div class="text-center border-b border-border">{t("showcase.comp")}</div>
  <div class="text-center border-b border-border">{t("showcase.you")}</div>
  <div class="text-center border-b border-border">{t("showcase.median")}</div>
  {#each stat.stats as s}
    {@const playerStat = a.stats.find(e => e.type === s.type) ?? a.stats.slice(-1)[0]}
    {@const num = numRange(s.type)}
    {@const range = (s.value + num < playerStat.value.main) ? 1 : (playerStat.value.main < s.value - num) ? -1 : 0}
    <div class="flex items-center pl-4 rounded-l-lg{bgColor(range)}">
      <img class="w-5 h-5 mr-2" src={src("card-assets", s.icon)} alt={s.icon} />
      <div>{t(tFix(s.type))}</div>
    </div>
    <div class="text-right pr-4 rounded-r-lg{bgColor(range)}">{playerStat.display.main}</div>
    <div class="text-right pr-4">{s.display}</div>
  {/each}
</div>
