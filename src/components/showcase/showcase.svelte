<script lang="ts">
// client:only="svelte"
import type { ApiData } from '@components/api'
import Icon from '@components/icon.svelte'
import UidInit from '@components/uid-init.svelte'
import UidNext from '@components/uid-next.svelte'
import type { Lang } from '@i18n/utils'
import Card from './card.svelte'

export let lang: Lang

let uid: number | undefined
let apiData: ApiData | undefined
let status = 0
</script>

{#if !apiData}
<UidInit bind:uid bind:apiData bind:status />
{:else}
<UidNext bind:uid bind:apiData bind:status />
{/if}
{#if apiData?.avatarInfoList?.[0]}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] sm:mx-auto">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} avatarInfo={apiData.avatarInfoList[0]} />
  </div>
</div>
{/if}
{#if apiData}
<div>
  <div>{apiData.uid}</div>
  {#if apiData.avatarInfoList}
  <div class="flex flex-wrap">
    {#each apiData.avatarInfoList as avatar}
    <div class="w-16">
      <Icon id={avatar.avatarId} ui="avatar" />
    </div>
    {/each}
  </div>
  {/if}
</div>
{/if}
