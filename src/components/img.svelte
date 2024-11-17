<script lang="ts">
import type { SvelteHTMLElements } from 'svelte/elements'

const {
  dummy = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7',
  ...rest
}: { dummy?: string } & SvelteHTMLElements['img'] = $props()

let overwrite = $state<SvelteHTMLElements['img']>({})
let srcLog = rest.src

$effect(() => {
  if (srcLog === rest.src || !rest.src) overwrite = {}
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
