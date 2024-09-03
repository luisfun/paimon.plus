<script lang="ts">
import type { ApiData, AvatarInfo } from '@components/api'
import SideIcon from '@components/side-icon.svelte'

export let apiData: ApiData | undefined
export let avatarInfo: AvatarInfo | undefined

let scrollElement: Element
let scrollLeft = 0

const onSelect = (id: number) => {
  avatarInfo = apiData?.avatarInfoList?.find(e => e.avatarId === id)
}
$: avatarInfo = apiData?.avatarInfoList?.[0]

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const wheelHandler = (e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
  if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
  const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth
  if ((scrollElement.scrollLeft <= 0 && e.deltaY < 0) || (scrollElement.scrollLeft >= maxScrollLeft && e.deltaY > 0))
    return
  e.preventDefault()
  scrollLeft += e.deltaY
  if (scrollLeft < 0) scrollLeft = 0
  if (scrollLeft > maxScrollLeft) scrollLeft = maxScrollLeft
  scrollElement.scrollBy({
    left: scrollLeft - scrollElement.scrollLeft,
    behavior: mediaQuery.matches ? 'auto' : 'smooth',
  })
}
</script>

{#if apiData?.avatarInfoList && apiData.playerInfo.showAvatarInfoList}
<div class="sticky top-0 flex justify-center avatar-list mb-3 mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-[-2rem]">
  <div class="absolute top-0 left-0 w-16 h-full z-10 pointer-events-none list-bg-left hidden lg:block" />
  <div class="absolute top-0 right-0 w-16 h-full z-10 pointer-events-none list-bg-right hidden lg:block" />
  <div class="flex flex-nowrap overflow-x-auto scrollbar-hidden px-3 lg:px-12" bind:this={scrollElement} on:wheel={e => wheelHandler(e)}>
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
</div>
{/if}

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
