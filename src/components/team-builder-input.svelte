<script lang="ts">
// client:only="svelte"
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import Svg from '@components/svg.svelte'
import { avatar } from '@components/team-builder-utils'
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'
import Icon from './team-builder/icon.svelte'

type ListData = { listName: string; list: string[] }

const LocalStorageKey = 'team-builder'

let { lang, list = $bindable(), dialogs }: { lang: Lang; list: string[]; dialogs?: HTMLDialogElement[] } = $props()
const t = useTranslations(lang)

const initList = avatar.filter(e => e.qualityType === 'QUALITY_PURPLE' || e.name === 'Traveler').map(e => e.id)
let tabIndex = $state(0)
let listData = $state<ListData[]>([{ listName: t('team-builder.owned'), list: initList }])
let dialog: HTMLDialogElement
let scrollElement: HTMLElement
let scrollLeft = 0

// !!!!!!!!!! tabsが短いとスクロールが切り替わらないバグがある !!!!!!!!!!!!
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const wheelHandler = (e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
  if (!scrollElement || dialog?.open || dialogs?.some(e => e.open) || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
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

const ownedClick = (id: string) => {
  const ids = listData[tabIndex].list
  listData[tabIndex].list = ids.includes(id) ? ids.filter(e => e !== id) : [...ids, id]
}

const listAdd = (copyIndex?: number) => {
  if (typeof copyIndex === 'number') listData = [...listData, structuredClone($state.snapshot(listData[copyIndex]))]
  else listData.push({ listName: (listData.length + 1).toString(), list: initList })
  tabIndex = listData.length - 1
  dialog.close()
}

const listDelete = (i: number) => {
  listData = listData.filter((_, j) => i !== j)
  if (listData.length === tabIndex) tabIndex--
}

onMount(() => {
  const lsData = JSON.parse(localStorage.getItem(LocalStorageKey) ?? '{}') as ListData[] | undefined
  // 古いバージョン（連想配列）の時は無視する
  if (Array.isArray(lsData)) listData = lsData
})

$effect(() => {
  localStorage.setItem(LocalStorageKey, JSON.stringify(listData))
  if (!dialog.open) list = listData[tabIndex].list
})
</script>

<div
  role="tablist"
  class="tabs tabs-lg tabs-bordered flex flex-nowrap overflow-x-auto scrollbar-hidden items-center mb-2"
  bind:this={scrollElement}
  onwheel={wheelHandler}
>
  {#each listData as data, i}
    <input
      type="radio" name="my_tabs_1" role="tab" class="tab !ps-4 !pe-4 whitespace-nowrap"
      aria-label={data.listName}
      onclick={() => tabIndex = i}
      checked={tabIndex === i}
    />
  {/each}
  <button class="btn btn-sm btn-primary leading-8 btn-circle mx-3" aria-label="config" onclick={() => dialog.showModal()}>
    <Svg icon="gear" class="w-4 h-4" />
  </button>
  <Dialog bind:dialog>
    <div class="grid grid-cols-[auto_auto_auto] gap-3 leading-8 m-4">
      {#each listData as data, i}
        <button
          class="btn btn-sm leading-8 btn-circle"
          aria-label="config"
          onclick={() => listDelete(i)}
          disabled={listData.length === 1}
        >
          <Svg icon="trash-can" class="w-4 h-4" />
        </button>
        <input type="text" placeholder={t("team-builder.owned")} class="input input-sm input-bordered" bind:value={data.listName} />
        <button
          class="btn btn-sm leading-8 btn-circle"
          aria-label="copy"
          onclick={() => listAdd(i)}
        >
          <Svg icon="copy" class="w-4 h-4" />
        </button>
      {/each}
      <button
        class="btn btn-sm btn-wide col-span-3 text-xl mx-auto"
        onclick={() => listAdd()}
      >+</button>
    </div>
  </Dialog>
</div>
<div class="grid grid-cols-6 gap-3 mx-1">
{#each avatar as a}
  <button class="relative" onclick={() => ownedClick(a.id)} aria-label={a.name}>
    <Icon {...avatarProps(a.avatarId ?? -1, undefined, listData[tabIndex].list.includes(a.id) ? "outline outline-primary outline-offset-2" : "opacity-50")} elem={a.name === 'Traveler' ? a.elem : undefined} />
  </button>
{/each}
</div>
