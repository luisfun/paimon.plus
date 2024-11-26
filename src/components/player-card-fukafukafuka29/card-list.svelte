<script lang="ts">
import Dialog from '@components/dialog.svelte'
import { src } from '@components/img-props'
import { data } from '@components/player-card/data'
import Svg from '@components/svg.svelte'
import avatarJson from '@game/avatar.json'
import { type Lang, useTranslations } from '@i18n/utils'

const fileNames = Object.keys(
  import.meta.glob('../../../public/images/player-card/fukafukafuka29-sample/*.webp', { eager: true }),
).map(path => path.split('/').at(-1)?.replace('.webp', ''))
const reverseList = data.find(e => e.x === 'fukafukafuka29')?.custom?.list ?? []

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const en = useTranslations('en')

let dialogs: HTMLDialogElement[] = []
let visibles = $state<boolean[]>([])

const names = avatarJson
  .map(e => en(e.id, 'avatar'))
  .filter(e => fileNames.includes(e))
  .concat('Aether', 'Lumine', 'Paimon', 'Dainsleif')
  .map(name => ({ name, reverse: reverseList.includes(name) }))

const onclick = (i: number) => {
  visibles[i] = true
  dialogs[i].showModal()
}
const download = (name: string) => {
  const a = document.createElement('a')
  a.href = `/images/player-card/fukafukafuka29/${name}.png`
  a.download = `${name}.png`
  a.click()
}
</script>

<div class="grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
  {#each names as e,i}
    <button class="relative aspect-square rounded-full overflow-hidden" onclick={() => onclick(i)}>
      <img
        class={`absolute aspect-video h-full max-w-none top-1/2 ${e.reverse ? "left-0" : "right-0"} -transform-y-1/2`}
        src={src("player-card/fukafukafuka29-sample", e.name)}
        alt={e.name}
      />
    </button>
    <Dialog bind:dialog={dialogs[i]}>
      {#if visibles[i]}
        <img
          class="aspect-video w-screen"
          src={src("player-card/fukafukafuka29", e.name, "png")}
          alt={e.name}
        />
      {/if}
      <button class="btn btn-sm btn-primary flex mx-auto my-2" onclick={() => download(e.name)}>
        <Svg icon="download" class="w-4 h-4" />{t("card.download")}
      </button>
    </Dialog>
  {/each}
</div>
