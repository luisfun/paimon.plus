<svelte:options runes={true} />
<script lang="ts">
import { scoreTypeMenuItems, src } from '@components/showcase-utils'
import type { Lang } from '@i18n/utils'
import { useTranslations } from '@i18n/utils'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

const critTable = [
  ['EQUIP_BRACER', 0, 35, 40, 45],
  ['EQUIP_NECKLACE', 0, 35, 40, 45],
  ['EQUIP_SHOES', 0, 30, 35, 40],
  ['EQUIP_RING', 0, 30, 35, 40],
  ['EQUIP_DRESS', 0, 25, 30, 35],
] as const
const basicType = scoreTypeMenuItems.slice(1)
const basicTable = [
  ['EQUIP_BRACER', 0, 40, 45, 50],
  ['EQUIP_NECKLACE', 0, 40, 45, 50],
  ['EQUIP_SHOES', 0, 35, 40, 45],
  ['EQUIP_RING', 0, 37, 40, 45],
  ['EQUIP_DRESS', 0, 30, 35, 40],
] as const
</script>

<div class="m-4">
  <div class="text-lg font-bold border-b border-border">{t("artifacter.crit")}</div>
  <div class="text-sm text-text-sub text-right">{t("artifacter.hint.none")}</div>
  {t("artifacter.hint.formula")}
  <table class="table bg-neutral rounded-none">
    <tbody>
      <tr>
        <td class="text-center">{t(scoreTypeMenuItems[0])}</td>
        <td>{t("CRIT Rate")} × 2 + {t("CRIT DMG")}</td>
      </tr>
    </tbody>
  </table>
  {t("artifacter.hint.grade")}
  <table class="table bg-neutral rounded-none">
    <tbody>
      <tr>
        <td></td>
        {#each ["B","A","S","SS"] as grade}
          <td><img class="w-5 h-5" src={src(grade, "card-assets")} alt={grade} /></td>
        {/each}
      </tr>
      {#each critTable as eqTr}
        <tr>
          <td><img class="w-5 h-5" src={src(eqTr[0], "card-assets")} alt={eqTr[0]} /></td>
          {#each eqTr.slice(1) as score}<td>{score}~</td>{/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="text-lg font-bold border-b border-border mt-12">{basicType.map(e => t(e)).join(" / ")}</div>
  <div class="text-sm text-text-sub text-right">{t("artifacter.hint.same")}</div>
  {t("artifacter.hint.formula")}
  <table class="table bg-neutral rounded-none">
    <tbody>
      {#each basicType as bt}
        <tr>
          <td class="text-center">{t(bt)}</td>
          <td>{t("CRIT Value")} + {bt === "EM" ? `${t(bt)} / 4` : `${t(bt)}%`}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {t("artifacter.hint.grade")}
  <table class="table bg-neutral rounded-none">
    <tbody>
      <tr>
        <td></td>
        {#each ["B","A","S","SS"] as grade}
          <td><img class="w-5 h-5" src={src(grade, "card-assets")} alt={grade} /></td>
        {/each}
      </tr>
      {#each basicTable as eqTr}
        <tr>
          <td><img class="w-5 h-5" src={src(eqTr[0], "card-assets")} alt={eqTr[0]} /></td>
          {#each eqTr.slice(1) as score}<td>{score}~</td>{/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table :where(th, td) {
    padding-top: .125rem;
    padding-bottom: .125rem
  }
</style>
