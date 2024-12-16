<script lang="ts">
// client:only="svelte"
import { TypedWorker } from '@codianz/typed-worker'
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import TeamBuilderInput from '@components/team-builder-input.svelte'
import { avatar } from '@components/team-builder-utils'
import { type Lang, useTranslations } from '@i18n/utils'
import { globalCoop } from '@manual/team-builder-data'
import Icon from './icon.svelte'
import Result from './result.svelte'
import { teamBuild } from './worker'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let favoriteIds = $state<string[]>([])
let list = $state<string[]>([])
let result = $state<ReturnType<typeof teamBuild>>()
let loadingIndicator = $state(true)
const dialogs: HTMLDialogElement[] = []

const worker = new TypedWorker(teamBuild)
let exe: ReturnType<typeof worker.execute>
$effect(() => {
  loadingIndicator = true
  if (exe) exe.abort()
  exe = worker.execute([
    avatar.filter(e => [...favoriteIds, ...list].includes(e.id)),
    favoriteIds.filter(e => e),
    globalCoop,
  ])
  exe.promise.then(res => {
    result = res
    loadingIndicator = false
  })
})
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <Result {lang} {result} {loadingIndicator} />
  <div class="mb-auto">
    <div class="mb-4 text-base">{t("team-builder.favorite")}</div>
    <div class="flex justify-around mb-4">
      {#each [0, 1, 2] as i}
        {@const fav = avatar.find(e => favoriteIds[i] === e.id)}
        <button class="relative w-1/5" onclick={() => dialogs[i]?.showModal()} aria-label="favorite character select">
          <Icon {...avatarProps(fav?.avatarId ?? -1)} elem={fav?.name === 'Traveler' ? fav?.elem : undefined} />
        </button>
        <Dialog bind:dialog={dialogs[i]}>
          <form class="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2 m-2" method="dialog">
            <button onclick={() => favoriteIds[i] = ""} aria-label={"none"}>
              <Icon {...avatarProps(-1)} />
            </button>
            {#each avatar as a}
              <button class="relative" onclick={() => favoriteIds[i] = a.id} aria-label={a.id}>
                <Icon {...avatarProps(a.avatarId ?? -1)} elem={a.name === 'Traveler' ? a.elem : undefined} />
              </button>
            {/each}
          </form>
        </Dialog>
      {/each}
    </div>
    <TeamBuilderInput {lang} bind:list {dialogs} />
  </div>
</div>
