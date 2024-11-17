<script lang="ts">
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'
import { avatarProps, dummyProps, weaponProps } from './img-props'

const {
  lang,
  ids,
  onclick,
  ui,
  style = '',
}: {
  lang: Lang
  ids: (number | number[])[]
  onclick: (id: number) => void
  ui: 'avatar' | 'weapon'
  style?: string
} = $props()
const t = useTranslations(lang)

let form: HTMLElement
let divs: HTMLElement[] = []
let load = $state(ids.map(() => false))

onMount(() => {
  const observer = new IntersectionObserver((entries, observer) => {
    for (const e of entries)
      if (e.isIntersecting) {
        load[Number(e.target.id.split('-')[1])] = true
        observer.unobserve(e.target)
      }
  })
  const mutationObserver = new MutationObserver(() => {
    load = ids.map(() => false)
    for (const d of divs) if (d) observer.observe(d)
  })
  mutationObserver.observe(form, { childList: true })
  for (const d of divs) observer.observe(d)
  return () => {
    observer.disconnect()
    mutationObserver.disconnect()
  }
})
</script>

<form bind:this={form} class="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2 {style}" method="dialog">
  {#each ids as idSet, i}
    {@const id = Array.isArray(idSet)? idSet[0]: idSet}
    {@const skinId = Array.isArray(idSet)? idSet[1]: undefined}
    <button bind:this={divs[i]} onclick={() => onclick(id)} id={`${ui}-${i}`} aria-label={t(id, ui)}>
      <img {...(!load[i] ? dummyProps() : ui === "avatar" ? avatarProps(id, skinId) : weaponProps(id))} />
    </button>
  {/each}
</form>
