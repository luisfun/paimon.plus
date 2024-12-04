<script lang="ts">
// client:only="svelte"
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import avatarJson from '@game/avatar.json'
import { type Lang, useTranslations } from '@i18n/utils'
import { avatar as buildData } from '@manual/team-builder-data'
import type { Elem } from './types'
import { singleTeam } from './worker-single'

const en = useTranslations('en')
const elemMap: Record<string, Elem> = {
  Fire: 'Pyro',
  Water: 'Hydro',
  Ice: 'Cryo',
  Electric: 'Electro',
  Grass: 'Dendro',
  Wind: 'Anemo',
  Rock: 'Geo',
}
const avatar = buildData
  .map(a => {
    const find = avatarJson.find(e => en(e.id, 'avatar') === a.name)
    const newA = { ...a, avatarId: find?.id }
    if (newA.elem || !find?.element) return newA
    newA.elem = elemMap[find.element]
    return newA
  })
  .map(a => ({ ...a, id: `${a.name}:${a.elem}` })) // :でnameとelemを合わせる

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

const initNames = ['Traveler', 'Amber', 'Kaeya', 'Lisa', 'Barbara', 'Noelle']
let favoriteIds = $state<string[]>([])
let ownedIds = $state(avatar.map(e => e.id)) //$state(avatar.filter(e => initNames.includes(e.name)).map(e => e.id))
const ownedList = $derived(avatar.filter(e => [...favoriteIds, ...ownedIds].includes(e.id)))
const dialogs: HTMLDialogElement[] = []

const ownedClick = (id: string) => {
  ownedIds = ownedIds.includes(id) ? ownedIds.filter(e => e !== id) : [...ownedIds, id]
}

$effect(() => {
  console.log(singleTeam(ownedList, favoriteIds, undefined).domainScoreList)
})
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <div>けっか</div>
  <div>
    <div class="mb-4">{t("team-builder.favorite")}</div>
    <div class="flex justify-around mb-4">
      {#each [0, 1, 2] as i}
        {@const fav = avatar.find(e => favoriteIds[i] === e.id)}
        <button class="w-1/5" onclick={() => dialogs[i]?.showModal()} aria-label="favorite character select">
          <img {...avatarProps(fav?.avatarId ?? -1)} />
        </button>
        <Dialog bind:dialog={dialogs[i]}>
          <form class="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2 m-2" method="dialog">
            {#each avatar as a}
              <button onclick={() => favoriteIds[i] = a.id} aria-label={a.id}>
                <img {...avatarProps(a.avatarId ?? -1)} />
              </button>
            {/each}
          </form>
        </Dialog>
      {/each}
    </div>
    <div class="mb-4">{t("team-builder.owned")}</div>
    <div class="grid grid-cols-6 gap-3 mx-1">
      {#each avatar as a}
        <button onclick={() => ownedClick(a.id)} aria-label={a.name}>
          <img {...avatarProps(a.avatarId ?? -1, undefined, ownedIds.includes(a.id) ? "outline outline-primary outline-offset-2" : "opacity-50")} />
        </button>
      {/each}
    </div>
  </div>
</div>
