<script lang="ts">
// client:only="svelte"
import type { ApiData } from '@components/api'
import Uid from '@components/uid.svelte'
import Icon from "@components/icon.svelte"

let uidData: ApiData | undefined
let status = 0
</script>

<Uid bind:uidData bind:status />
{#if uidData}
<div>
  <div>{uidData.uid}</div>
  {#if uidData.avatarInfoList}
  <div class="flex">
    {#each uidData.avatarInfoList as avatar}
      <Icon id={avatar.avatarId} ui="avatar" />
    {/each}
  </div>
  {/if}
</div>
{/if}
