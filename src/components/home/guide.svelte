<script lang="ts">
// client:load
import DialogDelayIcon from '@components/dialog-delay-Icon.svelte'
import Dialog from '@components/dialog.svelte'
import HoyoWiki from '@components/hoyo-wiki.svelte'
import { avatarProps, elementProps, weaponProps, weaponTypeProps } from '@components/img-props'
import Img from '@components/img.svelte'
import Svg from '@components/svg.svelte'
import avatarJson from '@game/avatar.json'
import weaponJson from '@game/weapon.json'
import { type Lang, useTranslations } from '@i18n/utils'
import Materials from './materials.svelte'
const avatarData = avatarJson.filter(e => !(e.id === 10000005 || e.id === 10000007))

const { lang }: { lang: Lang } = $props()
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

let select = $state(avatarData.slice(0, -1)[0].id)
let selectData = $state<Data>(avatarData.slice(0, -1)[0] as Data)
let elementFilter = $state<string[]>([])
let weaponTypeFilter = $state<string[]>([])
let isAvatarLoading = $state(false)
let isWeaponLoading = $state(false)
let dialog: HTMLDialogElement

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
  if (dialog) {
    dialog.showModal()
    isAvatarLoading = true
  }
}
const weaponLoadHandler = () => {
  if (dialog) {
    dialog.showModal()
    isWeaponLoading = true
  }
}

const avatarHandler = (id: number) => {
  select = id
  selectData = avatarData.find(e => e.id === id) as Data
}
const weaponHandler = (id: number) => {
  select = id
  selectData = weaponJson.find(e => e.id === id) as Data
}
</script>

<div class="grid grid-cols-4 gap-3">
  <button onclick={avatarLoadHandler} aria-label="character select">
    <Img {...(selectData.element ? avatarProps(select) : weaponProps(select))} />
  </button>
  <div class="col-span-3 flex flex-col justify-evenly pl-2">
    <button class="mr-auto text-xl flex items-center" onclick={avatarLoadHandler}>
      {t(select, selectData.element ? "avatar" : "weapon")}<Svg icon="caret-down" class="h-3 ml-2" />
    </button>
    <div class="mr-auto flex items-center">
      {#if selectData.element}
      <Img {...elementProps(selectData.element)} class="w-7 mr-2" />
      {/if}
      <Img {...weaponTypeProps(selectData.weaponType)} class="w-7 mr-2" />
      <HoyoWiki class="text-sm text-link" {lang} wikiId={selectData.wikiId} />
    </div>
  </div>
</div>
<Dialog bind:dialog maxFixed visible={isAvatarLoading}>
  <div role="tablist" class="tabs tabs-lg tabs-bordered grid-cols-2">
    <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label={t("game.characters")} checked />
    <div role="tabpanel" class="tab-content">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 my-3">
        <div class="grid grid-cols-7 gap-3 mx-auto">
          {#each elements as elem}
            <button class="w-8 bg-neutral border rounded-full {elementFilter.includes(elem) ? "border-yellow-100" : "border-transparent"}" onclick={() => elementFilterHandler(elem)} aria-label={elem}>
              <img {...elementProps(elem)} />
            </button>
          {/each}
        </div>
        <div class="grid grid-cols-5 gap-3 mx-auto">
          {#each weaponTypes as type}
            <button class="w-8 bg-neutral border rounded-full {weaponTypeFilter.includes(type) ? "border-yellow-100" : "border-transparent"}" onclick={() => weaponTypeFilterHandler(type)} aria-label={type}>
              <img {...weaponTypeProps(type)} />
            </button>
          {/each}
        </div>
      </div>
      <DialogDelayIcon
        {lang}
        ui="avatar"
        ids={avatarData
          .filter(a => !elementFilter[0] || elementFilter.includes(a.element || ""))
          .filter(a => !weaponTypeFilter[0] || weaponTypeFilter.includes(a.weaponType))
          .map(e => e.id)}
        onclick={avatarHandler}
      />
    </div>
    <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label={t("game.weapons")} onclick={weaponLoadHandler} />
    <div role="tabpanel" class="tab-content">
      {#if isWeaponLoading}
      <div class="grid grid-cols-1 gap-y-3 my-3">
        <div class="grid grid-cols-5 gap-3 mx-auto">
          {#each weaponTypes as type}
            <button class="w-8 bg-neutral border rounded-full {weaponTypeFilter.includes(type) ? "border-yellow-100" : "border-transparent"}" onclick={() => weaponTypeFilterHandler(type)} aria-label={type}>
              <img {...weaponTypeProps(type)} />
            </button>
          {/each}
        </div>
      </div>
      <DialogDelayIcon
        {lang}
        ui="weapon"
        ids={weaponJson.filter(a => !weaponTypeFilter[0] || weaponTypeFilter.includes(a.weaponType)).map(e => e.id)}
        onclick={weaponHandler}
      />
      {/if}
    </div>
  </div>
</Dialog>
<Materials {lang} costs={selectData.allCosts} rank={selectData.rankLevel} />
