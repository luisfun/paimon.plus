<script lang="ts">
// client:only="svelte"
import type { ApiData } from '@components/api'
import Icon from '@components/icon.svelte'
import Uid from '@components/uid.svelte'
import type { Lang } from '@i18n/utils'
import Card from './card.svelte';

export let lang: Lang

let uidData: ApiData | undefined
let status = 0
</script>

<Uid bind:uidData bind:status />
{#if uidData?.avatarInfoList?.[0]}
<div class="overflow-x-auto">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} avatarInfo={uidData.avatarInfoList[0]} />
  </div>
</div>
{/if}
{#if uidData}
<div>
  <div>{uidData.uid}</div>
  {#if uidData.avatarInfoList}
  <div class="flex flex-wrap">
    {#each uidData.avatarInfoList as avatar}
    <div class="w-16">
      <Icon id={avatar.avatarId} ui="avatar" />
    </div>
    {/each}
  </div>
  {/if}
</div>
{/if}
