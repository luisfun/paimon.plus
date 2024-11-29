<script lang="ts">
// client:only="svelte"
import Collapse from '@components/collapse.svelte'
import ExternalA from '@components/external-a.svelte'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import type { data } from './data'
import Editor from './editor.svelte'

const { lang, toolData }: { lang: Lang; toolData: (typeof data)[number] } = $props()
const t = useTranslations(lang)
</script>


