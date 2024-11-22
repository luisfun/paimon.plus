<script lang="ts">
import type { StatisticsRemapped } from '@components/api-statistics'
import { src } from '@components/img-props'
import Img from '@components/img.svelte'
import { elementColor } from '@components/showcase-utils'
import StatisticsEquip from '@components/statistics-equip.svelte'
import { type Lang, useTranslations } from '@i18n/utils'

const { lang, avatarInfo }: { lang: Lang; avatarInfo: StatisticsRemapped['avatarInfoList'][number] } = $props()
const t = useTranslations(lang)
</script>

{#snippet label(text: string | number, color: string)}
  <div class="absolute bottom-0 right-0 px-1 py-px rounded" style="background-color: {color};">{text}</div>
{/snippet}
{#snippet per(num: string | number, mt?: boolean)}
  <div class="text-center" class:mt-1={mt}>{num}<span class="text-xs text-text-sub">%</span></div>
{/snippet}

<div class="mt-6 flex">
{#if avatarInfo.travelerElement}
  {#each avatarInfo.travelerElement as e}
    <div class="relative w-[calc(100%/7)] px-1">
      <Img class="border-2 rounded-full bg-neutral w-full" style="border-color: {elementColor(e.element, true)};" src={src("element", e.element)} alt={e.element} />
      {@render per(e.display, true)}
    </div>
  {/each}
{:else}
  {#each avatarInfo.talentIcons as t, i}
  <div class="w-[calc(100%/7)] px-1">
    <div class="relative">
      <Img class="border-2 rounded-full bg-neutral w-full" style="border-color: {elementColor(avatarInfo.element, true)};" src={src("ui", t.icon)} alt="c{i}" />
      {@render label(`c${i}`, elementColor(avatarInfo.element))}
    </div>
    {@render per(t.display, true)}
  </div>
  {/each}
{/if}
</div>
<div class="divider mx-12 my-2"></div>
<StatisticsEquip class="flex justify-center" {lang} view={5} weapon={avatarInfo.weapon} dropEnd />
<div class="divider mx-12 my-2"></div>
<StatisticsEquip class="flex justify-center" {lang} view={5} reliquarySet={avatarInfo.reliquarySet} dropEnd />
<div class="divider mx-12 my-2"></div>
{#if !avatarInfo.travelerElement}
<div class="text-center font-bold">{t("statistics.talent")}</div>
<div class="mt-2 flex justify-center">
  {#each avatarInfo.skills as s}
    <div class="relative w-1/6 px-2">
      <Img class="border-2 rounded-full bg-neutral w-full" style="border-color: {elementColor(avatarInfo.element, true)};" src={src("ui", s.icon)} alt={s.icon} />
      {@render label("display" in s ? s.display : "", elementColor(avatarInfo.element))}
    </div>
  {/each}
</div>
<div class="divider mx-12 my-2"></div>
{/if}
<div class="text-center font-bold">{t("statistics.stats")}</div>
<div class="max-w-80 mx-auto mt-2 px-6 py-3 bg-neutral rounded-2xl">
  {#each avatarInfo.stats as s}
    <div class="flex justify-between items-center mb-4 last:mb-0">
      <div class="flex items-center">
        <img class="w-5 h-5 mr-2" src={src("card-assets", s.icon)} alt={s.icon} />
        <div>{t(s.type)}</div>
      </div>
      <div>{s.display}</div>
    </div>
  {/each}
</div>
