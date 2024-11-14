<script lang="ts">
import ExternalA from '@components/external-a.svelte'
import type { Lang } from '@i18n/utils'
import type { SvelteHTMLElements } from 'svelte/elements'

const { lang, wikiId, ...rest }: { lang: Lang; wikiId: number } & SvelteHTMLElements['a'] = $props()
</script>

{#if wikiId !== -1}
<ExternalA href="//wiki.hoyolab.com/m/genshin/entry/{wikiId}?lang={lang}" {...rest}>HoYoWiki</ExternalA>
{/if}
