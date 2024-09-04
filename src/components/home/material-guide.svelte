<script lang="ts">
import DialogDelayIcon from '@components/dialog-delay-Icon.svelte'
// client:load
import Dialog from '@components/dialog.svelte'
import ExternalA from '@components/external-a.svelte'
import Icon from '@components/icon.svelte'
import Svg from '@components/svg.svelte'
import avatarJson from '@game/avatar.json'
import weaponJson from '@game/weapon.json'
import type { Lang } from '@i18n/utils'
import { useTranslations } from '@i18n/utils'
import type { HTMLButtonAttributes } from 'svelte/elements'
import Materials from './materials.svelte'
const avatarData = avatarJson.filter(e => !(e.id === 10000005 || e.id === 10000007))

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
  rankLevel?: number
  wikiId: number
}

let select = avatarData.slice(0, -1)[0].id
let selectData: Data = avatarData.slice(0, -1)[0] as Data
let elementFilter: string[] = []
let weaponTypeFilter: string[] = []
let isAvatarLoading = false
let isWeaponLoading = false

const elements = ['Fire', 'Water', 'Grass', 'Electric', 'Wind', 'Ice', 'Rock']
const weaponTypes = ['WEAPON_SWORD_ONE_HAND', 'WEAPON_CLAYMORE', 'WEAPON_BOW', 'WEAPON_CATALYST', 'WEAPON_POLE']

const elementFilterHandler = (elem: string) => {
  if (!elementFilter.includes(elem)) elementFilter = [...elementFilter, elem]
  else elementFilter = elementFilter.filter(e => e !== elem)
}
const weaponTypeFilterHandler = (type: string) => {
  if (!weaponTypeFilter.includes(type)) weaponTypeFilter = [...weaponTypeFilter, type]
  else weaponTypeFilter = weaponTypeFilter.filter(e => e !== type)
}

const avatarLoadHandler = () => {
  isAvatarLoading = true
}
const weaponLoadHandler = () => {
  isWeaponLoading = true
}

const avatarHandler = (id: number) => {
  select = id
  selectData = avatarData.find(e => e.id === id) as Data
}
const weaponHandler = (id: number) => {
  select = id
  selectData = weaponJson.find(e => e.id === id) as Data
}

// tsエラー回避用
const onclick: HTMLButtonAttributes = {
  // @ts-expect-error
  onclick: 'modal.showModal()',
}
</script>

<div class="grid grid-cols-4 gap-3">
  <button {...onclick} on:click={avatarLoadHandler}>
    <Icon id={select} ui={selectData.element ? "avatar" : "weapon"} />
  </button>
  <div class="col-span-3 flex flex-col justify-evenly pl-2">
    <button class="mr-auto text-xl flex items-center" {...onclick} on:click={avatarLoadHandler}>
      {t(select, selectData.element ? "avatar" : "weapon")}<Svg icon="caret-down" class="h-3 ml-2" />
    </button>
    <div class="mr-auto flex items-center">
      {#if selectData.element}
      <Icon id={selectData.element} ui="element" style="w-7 mr-2" />
      {/if}
      <Icon id={selectData.weaponType} ui="weapon-type" style="w-7 mr-2" />
      {#if selectData.wikiId !== -1}
      <ExternalA class="text-sm text-link" href="//wiki.hoyolab.com/m/genshin/entry/{selectData.wikiId}">HoYoWiki</ExternalA>
      {/if}
    </div>
  </div>
</div>
<Dialog id="modal" maxFixed visible={isAvatarLoading}>
  <div role="tablist" class="tabs tabs-lg tabs-bordered grid-cols-2">
    <input type="radio" name="my_tabs_1" role="tab" class="tab w-1/2 text-text-sub checked:text-text checked:bg-neutral" aria-label={t("game.characters")} checked />
    <div role="tabpanel" class="tab-content">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 my-3">
        <div class="grid grid-cols-7 gap-3 mx-auto">
          {#each elements as elem}
            <button class="w-8 bg-neutral border rounded-full {elementFilter.includes(elem) ? "border-yellow-100" : "border-transparent"}" on:click={() => elementFilterHandler(elem)}>
              <Icon id={elem} ui="element" />
            </button>
          {/each}
        </div>
        <div class="grid grid-cols-5 gap-3 mx-auto">
          {#each weaponTypes as type}
            <button class="w-8 bg-neutral border rounded-full {weaponTypeFilter.includes(type) ? "border-yellow-100" : "border-transparent"}" on:click={() => weaponTypeFilterHandler(type)}>
              <Icon id={type} ui="weapon-type" />
            </button>
          {/each}
        </div>
      </div>
      <DialogDelayIcon
        ui="avatar"
        ids={avatarData
          .filter(a => !elementFilter[0] || elementFilter.includes(a.element || ""))
          .filter(a => !weaponTypeFilter[0] || weaponTypeFilter.includes(a.weaponType))
          .map(e => e.id)}
        onclick={avatarHandler}
      />
    </div>
    <input type="radio" name="my_tabs_1" role="tab" class="tab w-1/2 text-text-sub checked:text-text checked:bg-neutral" aria-label={t("game.weapons")} on:click={weaponLoadHandler} />
    <div role="tabpanel" class="tab-content">
      {#if isWeaponLoading}
      <div class="grid grid-cols-1 gap-y-3 my-3">
        <div class="grid grid-cols-5 gap-3 mx-auto">
          {#each weaponTypes as type}
            <button class="w-8 bg-neutral border rounded-full {weaponTypeFilter.includes(type) ? "border-yellow-100" : "border-transparent"}" on:click={() => weaponTypeFilterHandler(type)}>
              <Icon id={type} ui="weapon-type" />
            </button>
          {/each}
        </div>
      </div>
      <DialogDelayIcon
        ui="weapon"
        ids={weaponJson.filter(a => !weaponTypeFilter[0] || weaponTypeFilter.includes(a.weaponType)).map(e => e.id)}
        onclick={weaponHandler}
      />
      {/if}
    </div>
  </div>
</Dialog>
<Materials {lang} costs={selectData.allCosts} rank={selectData.rankLevel} />
