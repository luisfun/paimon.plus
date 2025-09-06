<script lang="ts">
import type { SvelteHTMLElements } from 'svelte/elements'

const { self, href, children, ...rest }: { self?: boolean } & SvelteHTMLElements['a'] = $props()

const externalProps = self
  ? {}
  : href?.includes('luis.fun')
    ? { target: '_blank' }
    : { rel: 'noreferrer', target: '_blank' }
</script>

<a {...externalProps} {href} {...rest}>{@render children?.()}</a>
