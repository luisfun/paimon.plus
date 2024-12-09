<script lang="ts">
import { elementProps } from '@components/img-props'
import type { SvelteHTMLElements } from 'svelte/elements'
import type { Elem } from './types'

const { elem, ...rest }: { elem?: Elem } & SvelteHTMLElements['img'] = $props()

const elemMap: Record<string, string> = {
  Pyro: 'Fire',
  Hydro: 'Water',
  Cryo: 'Ice',
  Electro: 'Electric',
  Dendro: 'Grass',
  Anemo: 'Wind',
  Geo: 'Rock',
}
</script>

<img {...rest} />
{#if elem}
  <img class="absolute top-0 right-0 w-6 bg-neutral rounded-full" {...elementProps(elemMap[elem])} />
{/if}
