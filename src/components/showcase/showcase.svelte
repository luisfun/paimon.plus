<script lang="ts">
// client:only="svelte"
import type { ApiData, AvatarInfo } from '@components/api'
import ShowcaseListError from '@components/showcase-list-error.svelte'
import ShowcaseSelector from '@components/showcase-selector.svelte'
import UidInput from '@components/uid-input.svelte'
import type { Lang } from '@i18n/utils'
import StatsCard from './stats-card.svelte'

export let lang: Lang

let apiData: ApiData | undefined = undefined
let avatarInfo: AvatarInfo | undefined = undefined
</script>

<UidInput {lang} bind:apiData />
<ShowcaseListError {lang} {apiData} />
<ShowcaseSelector {apiData} bind:avatarInfo />
<StatsCard {lang} {avatarInfo} />

<div class="h-svh"></div>
