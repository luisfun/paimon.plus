<script lang="ts">
import type { ApiData, AvatarInfo } from '@components/api'
import SideIcon from '@components/showcase-side-icon.svelte'
import { onMount } from 'svelte'
import DialogDelayIcon from './dialog-delay-Icon.svelte'
import Dialog from './dialog.svelte'
import Svg from './svg.svelte'

export let apiData: ApiData | undefined
export let avatarInfo: AvatarInfo | undefined

let scrollElement: HTMLElement
let scrollLeft = 0
let dialog: HTMLDialogElement
let isList = false
let isDialogVisible = false

const onSelect = (id: number) => {
  avatarInfo = apiData?.avatarInfoList?.find(e => e.avatarId === id)
}
$: avatarInfo = apiData?.avatarInfoList?.[0]

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const wheelHandler = (e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
  if (dialog.open) return
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

const setIsList = (apiData?: ApiData | undefined) => {
  // when update ApiData
  if (apiData) isList = false
  setTimeout(() => {
    isList = scrollElement?.offsetWidth < scrollElement?.scrollWidth
  }, 0)
}
$: setIsList(apiData)
onMount(() => {
  const listener = () => setIsList()
  window.addEventListener('resize', listener)
  return () => {
    window.removeEventListener('resize', listener)
  }
})

const onModal = () => {
  isDialogVisible = true
  dialog.showModal()
}
</script>

{#if apiData?.avatarInfoList && apiData.playerInfo.showAvatarInfoList}
<div class="sticky top-0 flex justify-center mb-3 mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-[-2rem]">
  <div class="absolute top-0 left-0 w-full h-full backdrop-blur avatar-list-bg" />
  <div
    class="flex flex-nowrap overflow-x-auto scrollbar-hidden{isList ? "" : " px-3"} lg:px-12"
    bind:this={scrollElement}
    on:wheel={e => wheelHandler(e)}
  >
    {#if isList}
      <button class="flex-none w-12 h-12 my-auto mx-3 menu-outline rounded-full" on:click={onModal}>
        <Svg icon="menu-tile" class="w-9 m-auto" />
      </button>
      <Dialog bind:dialog visible={isDialogVisible}>
        <DialogDelayIcon
          style="m-2"
          ids={apiData.avatarInfoList.map(e => e.costumeId ? [e.avatarId, e.costumeId] : e.avatarId)}
          ui="avatar"
          onclick={onSelect}
        />
      </Dialog>
    {/if}
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
  <div class="absolute top-0 left-0 w-16 h-full pointer-events-none list-bg-left hidden lg:block" />
  <div class="absolute top-0 right-0 w-16 h-full pointer-events-none list-bg-right hidden lg:block" />
</div>
{/if}

<style>
  .avatar-list-bg {
    z-index: -1;
    background: hsl(223 6.7% 20.6% / .8);
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
  .menu-outline {
    outline: solid 3px rgba(255, 255, 255, .2);
  }
</style>
