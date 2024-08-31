<script lang="ts">
import Icon from '@components/icon.svelte'
import { onMount } from 'svelte'

export let ids: number[]
export let onclick: (id: number) => void
export let ui: 'avatar' | 'weapon'

let form: HTMLElement
let divs: HTMLElement[] = []
let load = ids.map(() => false)

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

<form bind:this={form} class="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2" method="dialog">
  {#each ids as id, i}
    <button bind:this={divs[i]} on:click={_ => onclick(id)} id={`${ui}-${i}`}>
      <Icon id={id} ui={load[i] ? ui : "dummy"} loading="lazy" />
    </button>
  {/each}
</form>
