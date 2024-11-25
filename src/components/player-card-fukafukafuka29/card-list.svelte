<script lang="ts">
import Dialog from '@components/dialog.svelte'
import { src } from '@components/img-props'
import { data } from '@components/player-card/canvas-data'
import Svg from '@components/svg.svelte'
import avatarJson from '@game/avatar.json'
import { type Lang, useTranslations } from '@i18n/utils'

const fileNames = Object.keys(
  import.meta.glob('../../../public/images/player-card/fukafukafuka29-sample/*.webp', { eager: true }),
).map(path => path.split('/').at(-1)?.replace('.webp', ''))
const reverseList = data.find(e => e.id === 'fukafukafuka29')?.right_field ?? []

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const en = useTranslations('en')

let select = $state<string>()
let dialog: HTMLDialogElement

const names = avatarJson
  .map(e => en(e.id, 'avatar'))
  .filter(e => fileNames.includes(e))
  .concat('Aether', 'Lumine', 'Paimon', 'Dainsleif')
  .map(name => ({ name, reverse: reverseList.includes(name) }))

const onclick = (name: string) => {
  select = name
  dialog.showModal()
}
const download = () => {
  const a = document.createElement('a')
  a.href = `/images/player-card/fukafukafuka29/${select}.png`
  a.download = `${select}.png`
  a.click()
}
</script>

<div class="grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
  {#each names as e}
    <button class="relative aspect-square rounded-full overflow-hidden" onclick={() => onclick(e.name)}>
      <img
        class={`absolute aspect-video h-full max-w-none top-1/2 ${e.reverse ? "left-0" : "right-0"} -transform-y-1/2`}
        src={src("player-card/fukafukafuka29-sample", e.name)}
        alt={e.name}
      />
    </button>
  {/each}
  <Dialog bind:dialog>
    {#if select}
      <img
        class="aspect-video w-full"
        src={src("player-card/fukafukafuka29", select, "png")}
        alt={select}
      />
    {/if}
    <button class="btn btn-sm btn-primary flex mx-auto my-2" onclick={download}>
      <Svg icon="download" class="w-4 h-4" />{t("card.download")}
    </button>
  </Dialog>
</div>
