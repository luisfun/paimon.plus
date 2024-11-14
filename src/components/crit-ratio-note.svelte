<script lang="ts">
import type { NoteArr } from '@components/crit-ratio-utils'
import { type Lang, useTranslations } from '@i18n/utils'

let { lang, noteArr = $bindable() }: { lang: Lang; noteArr: NoteArr } = $props()
const t = useTranslations(lang)
</script>

