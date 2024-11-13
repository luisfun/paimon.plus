<script lang="ts">
import CritRatioChart from '@components/crit-ratio-chart.svelte'
// client:load
import type { Lang } from '@i18n/utils'

const { lang }: { lang: Lang } = $props()

let type = $state<'ATK' | 'HP' | 'DEF'>('ATK')
let base = $state(123)
let add = $state(123)
let cr = $state(66)
let cd = $state(123)
</script>

<div>no input</div>

<CritRatioChart {lang} {type} {base} {add} cr={cr/100} cd={cd/100} />
