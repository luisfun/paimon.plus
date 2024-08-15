<script lang="ts">
import Dialog from '@components/dialog.svelte'
import Icon from '@components/icon.svelte'
import avatarRaw from '@game/avatar.json'
import material from '@game/material.json'
import type { Lang } from '@i18n/utils'
import { useTranslations } from '@i18n/utils'
import ExternalA from '@components/external-a.svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'
const avatars = avatarRaw
  .filter(e => !(e.id === 10000005 || e.id === 10000007))
  .sort((a, b) => {
    if (a.qualityType === 'QUALITY_ORANGE_SP') return -1
    if (a.qualityType === 'QUALITY_PURPLE' && b.qualityType === 'QUALITY_ORANGE') return -1
    if (a.qualityType === 'QUALITY_ORANGE' && b.qualityType === 'QUALITY_PURPLE') return 1
    return 0
  })
  .reverse()

export let lang: Lang
const t = useTranslations(lang)

let select = avatars.slice(0, -1)[0].id
let selectData: (typeof avatarRaw)[number]
$: selectData = avatars.find(e => e.id === select) as (typeof avatarRaw)[number]
let isLoading = false

const weaponIcon: Record<string, string> = {
  "WEAPON_SWORD_ONE_HAND": "UI_ItemIcon_101101",
  "WEAPON_CLAYMORE": "UI_ItemIcon_101103",
  "WEAPON_POLE": "UI_ItemIcon_101105",
  "WEAPON_CATALYST": "UI_ItemIcon_101104",
  "WEAPON_BOW": "UI_ItemIcon_101102",
}

const loadHandler = () => {
  isLoading = true
}

const clickHandler = (id: number) => {
  select = id
}

// tsエラー回避用
const onclick: HTMLButtonAttributes = {
  // @ts-expect-error
  onclick: 'modal.showModal()',
}
</script>

<div class="grid grid-cols-4 gap-4">
  <button {...onclick} on:click={loadHandler}>
    <Icon id={select} loading="lazy" />
  </button>
  <div class="col-span-3 flex flex-col justify-evenly">
    <button class="mr-auto text-xl" {...onclick} on:click={loadHandler}>{t(select, "avatar")}</button>
    <div class="mr-auto flex items-center">
      <img class="h-7 mr-2" src="/images/element/{selectData.element}.webp" alt={selectData.element} />
      <img class="h-7 mr-2" src="/images/ui/{weaponIcon[selectData.weaponType]}.webp" alt={selectData.weaponType} />
      <ExternalA class="text-sm text-link" href="//wiki.hoyolab.com/m/genshin/entry/{selectData.wikiId}">HoYoWiki</ExternalA>
    </div>
  </div>
</div>
<Dialog id="modal">
  <div class="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2">
    {#each avatars as avatar}
      <form method="dialog">
        <button on:click={_ => clickHandler(avatar.id)}>
          <Icon id={avatar.id} {isLoading} />
        </button>
      </form>
    {/each}
  </div>
</Dialog>
