<script lang="ts">
import { ui } from "@i18n/ui"
import { type Lang, useTranslations } from '@i18n/utils'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const en = useTranslations("en")
const ja = useTranslations("ja")

let baseLang = $state<"en" | "ja">("en")

type Key = keyof typeof ui.en
const keys = Object.keys(ui.en) as Key[]
const translatedKeys = Object.keys(ui[lang]) as Key[]
</script>

<table class="table">
  <thead>
    <tr>
      <th class="w-[20%]">Key</th><th class="p-0 w-[40%]">
        <select class="select w-full" bind:value={baseLang}>
          <option value="en">en</option>
          <option value="ja">ja</option>
        </select>
      </th><th class="w-[40%]">{lang}</th>
    </tr>
  </thead>
  <tbody>
    {#each keys as key}
    <tr>
      <td>{key}</td><td>{baseLang === "en" ? en(key) : ja(key)}</td><td class="p-0"></td>
    </tr>
    {/each}
  </tbody>
</table>
