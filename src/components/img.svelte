<script lang="ts">
import { dummySrc } from '@components/img-props'
import type { SvelteHTMLElements } from 'svelte/elements'

const { dummy = dummySrc, ...rest }: { dummy?: string } & SvelteHTMLElements['img'] = $props()

let overwrite = $state<SvelteHTMLElements['img']>({})
let srcLog = $state(rest.src)

$effect(() => {
  if (typeof window === 'undefined' || srcLog === rest.src || !rest.src) overwrite = {}
  else {
    overwrite = { src: dummy }
    const img = new Image()
    img.onload = () => {
      overwrite = {}
      srcLog = rest.src
    }
    img.src = rest.src
  }
})
</script>

<img {...rest} {...overwrite} />
