<script lang="ts">
import Dialog from '@components/dialog.svelte'
import Icon from '@components/icon.svelte'
import avatarRaw from '@game/avatar.json'
import material from '@game/material.json'
import type { Lang } from '@i18n/utils'
import { useTranslations } from "@i18n/utils"
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

export let lang:Lang
const t = useTranslations(lang)

let select = avatars.slice(0, -1)[0].id

const clickHandler = (id: number) => select = id
$: console.log(select)
// tsエラー回避用
const onclick: HTMLButtonAttributes = {
  // @ts-expect-error
  onclick: 'modal.showModal()',
}
</script>

<div class="flex">
  <button {...onclick}>
    <Icon id={select} />
  </button>
  <button {...onclick}>{t(select, "avatar")}</button>
</div>
<Dialog id="modal">
  <div class="grid grid-cols-3 gap-y-8">
    {#each avatars as avatar}
      <form method="dialog">
        <button>
          <Icon id={avatar.id} on:click={_ => clickHandler(avatar.id)} />
        </button>
      </form>
    {/each}
  </div>
</Dialog>

