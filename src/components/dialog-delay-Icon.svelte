<script lang="ts">
import Icon from '@components/icon.svelte'
import { onMount } from 'svelte'

const {
  ids,
  onclick,
  ui,
  style = '',
}: { ids: (number | number[])[]; onclick: (id: number) => void; ui: 'avatar' | 'weapon'; style?: string } = $props()

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
  {#each ids as id, i}
    <button bind:this={divs[i]} onclick={() => onclick(typeof id === "number" ? id : id[0])} id={`${ui}-${i}`}>
      <Icon
        id={typeof id === "number" ? id : id[0]}
        skinId={typeof id === "number" ? undefined : id[1]}
        ui={load[i] ? ui : "dummy"}
      />
    </button>
  {/each}
</form>
