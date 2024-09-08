<script lang="ts">
// client:only="svelte"
import type { ApiData, AvatarInfo } from '@components/api'
import ShowcaseListError from '@components/showcase-list-error.svelte'
import ShowcaseSelector from '@components/showcase-selector.svelte'
import UidInput from '@components/uid-input.svelte'
import type { Lang } from '@i18n/utils'
import Card from './card.svelte'

export let lang: Lang

let apiData: ApiData | undefined = undefined
let avatarInfo: AvatarInfo | undefined = undefined
</script>

<UidInput {lang} bind:apiData />
<ShowcaseListError {lang} {apiData} />
<ShowcaseSelector {apiData} bind:avatarInfo />

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} {avatarInfo} />
  </div>
</div>
{/if}

<div class="h-svh" />
