<svelte:options runes={true} />
<script lang="ts">
import type { SvelteHTMLElements } from 'svelte/elements'

const { self, children, ...rest }: { self: boolean } & SvelteHTMLElements['a'] = $props()

const externalProps = self
  ? {}
  : {
      rel: 'noreferrer noopener',
      target: '_blank',
    }
</script>

<a {...externalProps} {...rest}>{@render children?.()}</a>
