<svelte:options runes={true} />
<script lang="ts">
// client:only="svelte"
import type { ApiData, AvatarInfo } from '@components/api'
import ShowcaseSelector from '@components/showcase-selector.svelte'
import UidInput from '@components/uid-input.svelte'
import type { Lang } from '@i18n/utils'
import StatsCard from './stats-card.svelte'

const { lang }: { lang: Lang } = $props()

let apiData = $state<ApiData>()
let avatarInfo = $state<AvatarInfo>()
</script>

<UidInput {lang} bind:apiData />
<ShowcaseSelector {apiData} bind:avatarInfo />
{#if avatarInfo}
<StatsCard {lang} {avatarInfo} />
{/if}

<div class="h-svh"></div>
