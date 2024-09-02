<script lang="ts">
// client:only="svelte"
import type { ApiData, AvatarInfo } from '@components/api'
import UidInit from '@components/uid-init.svelte'
import UidNext from '@components/uid-next.svelte'
import type { Lang } from '@i18n/utils'
import Card from './card.svelte'
import SideIcon from './side-icon.svelte'

export let lang: Lang

let uid: number | undefined
let apiData: ApiData | undefined
let status = 0
let avatarInfo: AvatarInfo | undefined = undefined

const onSelect = (id: number) => {
  avatarInfo = apiData?.avatarInfoList?.find(e => e.avatarId === id)
}
$: avatarInfo = apiData?.avatarInfoList?.[0]
</script>

{#if !apiData}
<UidInit bind:uid bind:apiData bind:status />
{:else}
<UidNext bind:uid bind:apiData bind:status />
{/if}

{#if apiData?.avatarInfoList && apiData.playerInfo.showAvatarInfoList}
<div class="sticky top-0 relative avatar-list mb-3 mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-[-2rem]">
  <div class="absolute top-0 left-0 w-16 h-full z-10 pointer-events-none list-bg-left hidden lg:block" />
  <div class="flex flex-nowrap overflow-x-auto scrollbar-hidden">
    {#each apiData.avatarInfoList as avatar, i}
      <SideIcon
        id={avatar.avatarId}
        skinId={avatar.costumeId}
        active={apiData.playerInfo.showAvatarInfoList.length - i > 0}
        select={avatar.avatarId === avatarInfo?.avatarId}
        {onSelect}
      />
    {/each}
  </div>
  <div class="absolute top-0 right-0 w-16 h-full z-10 pointer-events-none list-bg-right hidden lg:block" />
</div>
{/if}

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} {avatarInfo} />
  </div>
</div>
{/if}

<div class="h-svh" />

<style>
  .avatar-list::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: hsl(223 6.7% 20.6% / .8);
    backdrop-filter: blur(.5rem);
  }
  .list-bg-left {
    background: linear-gradient(to right, var(--background) calc(100% - 4rem), transparent);
  }
  .list-bg-right {
    background: linear-gradient(to left, var(--background) calc(100% - 4rem), transparent);
  }
  .scrollbar-hidden {
    scrollbar-width: none;
  }
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
</style>
