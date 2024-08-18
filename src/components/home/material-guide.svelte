<script lang="ts">
// client:load
import Dialog from '@components/dialog.svelte'
import ExternalA from '@components/external-a.svelte'
import Icon from '@components/icon.svelte'
import avatarRaw from '@game/avatar.json'
import material from '@game/material.json'
import weaponRaw from '@game/weapon.json'
import type { Lang } from '@i18n/utils'
import { useTranslations } from '@i18n/utils'
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
const weaponTypeFilter = (type: string) =>
  weaponRaw
    .filter(e => e.weaponType === type)
    .sort((a, b) => a.rankLevel - b.rankLevel)
    .reverse()
const weapons = [
  ...weaponTypeFilter('WEAPON_SWORD_ONE_HAND'),
  ...weaponTypeFilter('WEAPON_CLAYMORE'),
  ...weaponTypeFilter('WEAPON_POLE'),
  ...weaponTypeFilter('WEAPON_CATALYST'),
  ...weaponTypeFilter('WEAPON_BOW'),
]

export let lang: Lang
const t = useTranslations(lang)

type Data = {
  element?: string | null
  weaponType: string
  allCosts: {
    promoteCoin: number
    skillCoin?: number
    materials: Record<string, number | undefined>
  }
  wikiId: number
}

let select = avatars.slice(0, -1)[0].id
let selectData: Data = avatars.slice(0, -1)[0] as Data
let isAvatarLoading = false
let isWeaponLoading = false

const avatarLoadHandler = () => {
  isAvatarLoading = true
}
const weaponLoadHandler = () => {
  isWeaponLoading = true
}

const avatarHandler = (id: number) => {
  select = id
  selectData = avatars.find(e => e.id === id) as Data
}

const weaponHandler = (id: number) => {
  select = id
  selectData = weapons.find(e => e.id === id) as Data
}

// tsエラー回避用
const onclick: HTMLButtonAttributes = {
  // @ts-expect-error
  onclick: 'modal.showModal()',
}
</script>

<div class="grid grid-cols-4 gap-4">
  <button {...onclick} on:click={avatarLoadHandler}>
    <Icon id={select} ui={selectData.element ? "avatar" : "weapon"} />
  </button>
  <div class="col-span-3 flex flex-col justify-evenly">
    <button class="mr-auto text-xl" {...onclick} on:click={avatarLoadHandler}>{t(select, selectData.element ? "avatar" : "weapon")}</button>
    <div class="mr-auto flex items-center">
      {#if selectData.element}
      <img class="h-7 mr-2" src="/images/element/{selectData.element}.webp" alt={selectData.element} />
      {/if}
      <img class="h-7 mr-2" src="/images/weapon-type/{selectData.weaponType}.webp" alt={selectData.weaponType} />
      <ExternalA class="text-sm text-link" href="//wiki.hoyolab.com/m/genshin/entry/{selectData.wikiId}">HoYoWiki</ExternalA>
    </div>
  </div>
</div>
<Dialog id="modal">
  <div role="tablist" class="tabs tabs-lg tabs-bordered grid-cols-2">
    <input type="radio" name="my_tabs_1" role="tab" class="tab w-1/2 text-primary-345 checked:text-primary-230 checked:bg-primary-630" aria-label={t("game.characters")} checked />
    <div role="tabpanel" class="tab-content">
      <form class="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2" method="dialog">
        {#each avatars as avatar}
          <button class="aspect-square" on:click={_ => avatarHandler(avatar.id)}>
            <Icon id={avatar.id} isLoading={isAvatarLoading} loading="lazy" />
          </button>
        {/each}
      </form>
    </div>
    <input type="radio" name="my_tabs_1" role="tab" class="tab w-1/2 text-primary-345 checked:text-primary-230 checked:bg-primary-630" aria-label={t("game.weapons")} on:click={weaponLoadHandler} />
    <div role="tabpanel" class="tab-content">
      {#if isAvatarLoading}
      <form class="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2" method="dialog">
        {#each weapons as weapon}
          <button class="aspect-square" on:click={_ => weaponHandler(weapon.id)}>
            <Icon id={weapon.id} ui="weapon" isLoading={isWeaponLoading} loading="lazy" />
          </button>
        {/each}
      </form>
      {/if}
    </div>
  </div>
</Dialog>
