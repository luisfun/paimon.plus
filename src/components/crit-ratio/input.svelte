<script lang="ts">
import type { InputStats } from '@components/crit-ratio-utils'
import { type Lang, useTranslations } from '@i18n/utils'

let {
  lang,
  type = $bindable(),
  base = $bindable(),
  add = $bindable(),
  cr = $bindable(),
  cd = $bindable(),
}: { lang: Lang } & Partial<InputStats> = $props()
const t = useTranslations(lang)

const selectType = ['ATK', 'HP', 'DEF'] as const
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
