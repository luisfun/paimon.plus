<script lang="ts">
import { avatarProps } from '@components/img-props'
import avatarJson from '@game/avatar.json'
import { type Lang, useTranslations } from '@i18n/utils'
// client:only="svelte"
import { avatar } from '@manual/team-builder-data'
import type { Avatar, Elem, Name } from './types'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const en = useTranslations('en')

const initOwnedNames = ['Traveler', 'Amber', 'Kaeya', 'Lisa', 'Barbara', 'Noelle']
let owned = $state(avatar) //avatar.filter(e => initOwnedNames.includes(e.name)))

const avatarClick = (name: Name, elem: Elem | undefined) => {
  const eq = (e: Avatar) => e.name === name && e.elem === elem
  if (owned.find(eq)) owned = owned.filter(e => !eq(e))
  else {
    const add = avatar.find(eq)
    if (add) owned = [...owned, add]
  }
}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <div>けっか</div>
  <div>
    <div class="mb-4">{t("team-builder.owned")}</div>
    <div class="grid grid-cols-6 gap-3 mx-1">
      {#each avatar as a}
        {@const id = avatarJson.find(e => en(e.id, "avatar") === a.name)?.id}
        <button onclick={() => avatarClick(a.name, a.elem)} aria-label={a.name}>
          <img {...avatarProps(id ?? -1, undefined, owned.find(e => e.name === a.name && e.elem === a.elem) ? "outline outline-primary outline-offset-2" : "opacity-50")} />
        </button>
      {/each}
    </div>
  </div>
</div>
