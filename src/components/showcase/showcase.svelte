<script lang="ts">
// client:only="svelte"
import type { ApiData, AvatarInfo } from '@components/api'
import ShowcaseSelector from '@components/showcase-selector.svelte'
import UidInit from '@components/uid-init.svelte'
import UidNext from '@components/uid-next.svelte'
import type { Lang } from '@i18n/utils'
import Card from './card.svelte'

export let lang: Lang

let uid: number | undefined
let apiData: ApiData | undefined
let status = 0
let avatarInfo: AvatarInfo | undefined = undefined
</script>

{#if !apiData}
<UidInit bind:uid bind:apiData bind:status />
{:else}
<UidNext bind:uid bind:apiData bind:status />
{/if}

<ShowcaseSelector {apiData} bind:avatarInfo />

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} {avatarInfo} />
  </div>
</div>
{/if}

<div class="h-svh" />
