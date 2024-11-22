<script lang="ts">
import type { ApiData, AvatarInfo } from '@components/api-uid-types'
import DialogDelayIcon from '@components/dialog-delay-Icon.svelte'
import Dialog from '@components/dialog.svelte'
import { sideProps } from '@components/img-props'
import Img from '@components/img.svelte'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'

let {
  lang,
  apiData,
  avatarInfo = $bindable(),
  sticky,
}: {
  lang: Lang
  apiData: ApiData | undefined
  avatarInfo: AvatarInfo | undefined
  sticky?: boolean
} = $props()
const t = useTranslations(lang)

let scrollElement: HTMLElement
let scrollLeft = 0
let dialog: HTMLDialogElement
let isList = $state(false)
let listLength = 0
let isDialogVisible = $state(false)

const onSelect = (id: number) => {
  avatarInfo = apiData?.avatarInfoList?.find(e => e.avatarId === id)
}

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const wheelHandler = (e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
  if (!scrollElement || dialog?.open || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
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

const onModal = () => {
  isDialogVisible = true
  dialog?.showModal()
}

const setIsList = (apiData?: ApiData) => {
  // when update ApiData
  if (!scrollElement) return
  if (apiData?.avatarInfoList && listLength > apiData.avatarInfoList.length) isList = false
  if (apiData) listLength = apiData.avatarInfoList?.length || 0
  setTimeout(() => {
    if (!scrollElement) return
    isList = scrollElement?.offsetWidth < scrollElement?.scrollWidth
  }, 0)
}

onMount(() => {
  const listener = () => setIsList()
  window.addEventListener('resize', listener)
  return () => {
    window.removeEventListener('resize', listener)
  }
})

let uidLog = apiData?.uid
$effect(() => {
  if (uidLog !== apiData?.uid) {
    avatarInfo = apiData?.avatarInfoList?.[0]
    setIsList(apiData)
    uidLog = apiData?.uid
  }
})
</script>

{#if apiData?.avatarInfoList && apiData.playerInfo.showAvatarInfoList}
<div class="{sticky ? "sticky -top-px z-10" : "relative"} flex justify-center mb-3 mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-[-2rem]">
  <div class="absolute inset-0 backdrop-blur avatar-list-bg"></div>
  <div
    class="flex flex-nowrap overflow-x-auto scrollbar-hidden{isList ? "" : " px-3"} lg:px-12"
    bind:this={scrollElement}
    onwheel={e => wheelHandler(e)}
  >
    {#if isList}
      <button class="relative flex-none w-12 h-12 my-auto mx-3 menu-outline rounded-full" onclick={onModal} aria-label="character list">
        <Svg icon="menu-tile" class="absolute top-1/2 left-1/2 -transform-1/2 w-9" />
      </button>
      <Dialog bind:dialog visible={isDialogVisible}>
        <DialogDelayIcon
          {lang}
          style="m-2{apiData.avatarInfoList.length < 13 ? " !grid-cols-4 max-w-72" : ""}"
          ids={apiData.avatarInfoList.map(e => e.costumeId ? [e.avatarId, e.costumeId] : e.avatarId)}
          ui="avatar"
          onclick={onSelect}
        />
      </Dialog>
    {/if}
    {#each apiData.avatarInfoList as avatar, i}
      {@const id = avatar.avatarId}
      {@const skinId = avatar.costumeId}
      {@const active = apiData.playerInfo.showAvatarInfoList.length - i > 0}
      {@const select = avatar.avatarId === avatarInfo?.avatarId}
      <button class="relative flex-none w-[4.5rem] h-[4.5rem] pointer" onclick={() => onSelect(id)} aria-label={t(id, "avatar")}>
        <div class="side-bg absolute top-1/2 left-1/2 -transform-1/2 outline outline-[3px] w-12 h-12 rounded-full transition-all{(select ? ' side-bg-select' : "") + (active ? ' side-bg-active' : "")}"></div>
        <div class="absolute bottom-0 left-1/2 -transform-x-1/2 border border-b-2 transition-all {select ? "w-full side-bottom-color": "w-0 border-transparent"}"></div>
        <Img {...sideProps(id, skinId)} class="absolute bottom-3 left-1/2 -transform-x-1/2 max-w-none transition-all {select ? "w-20" : "w-[4.6rem]"}" />
      </button>
    {/each}
  </div>
  <div class="absolute top-0 bottom-0 left-0 w-16 pointer-events-none list-bg-left hidden lg:block"></div>
  <div class="absolute top-0 bottom-0 right-0 w-16 pointer-events-none list-bg-right hidden lg:block"></div>
</div>
{/if}

<style>
  .avatar-list-bg {
    z-index: -1;
    background: #242734bb;
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

  .side-bg {
    outline-color: rgba(255, 255, 255, .2);
    background: rgba(0, 0, 0, .2);
  }
  .side-bg-active {
    outline-color: #96db8380;
  }
  .side-bg-select {
    outline-color: #4fccf099;
    background: #4fccf099;
    box-shadow: 0 0 1.5rem #4fccf080;
  }
  .side-bg-active.side-bg-select {
    outline-color: #96db83;
  }
  .side-bottom-color {
    border-color: #4fccf0;
  }
</style>
