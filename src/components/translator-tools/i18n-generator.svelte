<script lang="ts">
// client:load
import { ui } from '@i18n/ui'
import { type Lang, useTranslations } from '@i18n/utils'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const en = useTranslations('en')
const ja = useTranslations('ja')

type Key = keyof typeof ui.en
const keys = Object.keys(ui.en) as Key[]
const translatedKeys = Object.keys(ui[lang]) as Key[]

let baseLang = $state<'en' | 'ja'>('en')
let untranslated = $state(true)
// @ts-expect-error
let values = $state(keys.map(key => (ui[lang][key] as string) ?? ''))
let buttonText = $state('Download')

const tsText = $derived.by(() => {
  let text = `  ${lang}: {
`
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = values[i]
    if (!value) continue
    const kQuote = !key.includes('-') && !key.includes('.') && !key.includes(' ') ? '' : "'"
    const vQuote = !value.includes("'") ? "'" : !value.includes('"') ? '"' : '`'
    text += `    ${kQuote + key + kQuote}: ${vQuote + value + vQuote},
`
  }
  text += `  },
`
  return text
})

const onclick = () => {
  const url = URL.createObjectURL(new Blob([tsText], { type: 'text/plain' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${lang}.txt`
  a.click()
  URL.revokeObjectURL(url)
  buttonText = 'Downloaded!'
  setTimeout(() => {
    buttonText = 'Download'
  }, 1500)
}
</script>

<div class="overflow-x-auto">
  <table class="table min-w-[768px]">
    <thead>
      <tr>
        <th class="w-[20%]">Key</th>
        <th class="p-0 w-[40%]">
          <select class="select w-full" bind:value={baseLang}>
            <option value="en">{ui.en.label}</option>
            <option value="ja">{ui.ja.label}</option>
          </select>
        </th>
        <th class="w-[40%]">
          <div class="flex justify-between items-center">
            {t("label")}
            <div class="form-control">
              <label class="label cursor-pointer py-0">
                <input type="checkbox" class="checkbox checkbox-primary" bind:checked={untranslated} />
                <span class="label-text text-xs text-text-sub ml-2">Untranslated</span>
              </label>
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each keys as key, i}
      <tr class:hidden={untranslated ? translatedKeys.includes(key) : false}>
        <td>{key}</td>
        <td>"{baseLang === "en" ? en(key) : ja(key)}"</td>
        <td class="p-0"><textarea class="block textarea textarea-bordered w-full h-12" placeholder={translatedKeys.includes(key) ? t(key) : ""} bind:value={values[i]}></textarea></td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="mt-12 mb-4 text-center">
  <button class="btn btn-sm btn-primary ml-2" {onclick}>{buttonText}</button>
</div>
<textarea class="block textarea textarea-bordered w-full h-72 px-0 !cursor-text !text-text-sub !bg-neutral" value={tsText} disabled></textarea>
