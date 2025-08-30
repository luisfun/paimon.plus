<script lang="ts">
// client:only="svelte"
import { TypedWorker } from '@codianz/typed-worker'
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import Svg from '@components/svg.svelte'
import TeamBuilderInput from '@components/team-builder-input.svelte'
import { avatar } from '@components/team-builder-utils'
import { type Lang, useTranslations } from '@i18n/utils'
import { globalCoop } from '@manual/team-builder-data'
import Icon from './icon.svelte'
import Result from './result.svelte'
import TeamGridChildren from './team-grid-children.svelte'
import { teamBuild } from './worker'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let favoriteIds = $state<string[]>([])
let list = $state<string[]>([])
let result = $state<ReturnType<typeof teamBuild>>()
let loadingIndicator = $state(true)
let keepTeams = $state<ReturnType<typeof teamBuild>['battle'][number]['all']>([])
const dialogs: HTMLDialogElement[] = []

const addTeam = (team: ReturnType<typeof teamBuild>['battle'][number]['all'][number]) => {
  keepTeams = [...keepTeams, team].sort((a, b) => b.battle - a.battle)
}
const deleteTeam = (index: number) => {
  keepTeams = keepTeams.filter((_, i) => i !== index)
}

const worker = new TypedWorker(teamBuild)
let exe: ReturnType<typeof worker.execute>
$effect(() => {
  loadingIndicator = true
  if (exe) exe.abort()
  exe = worker.execute([
    avatar
      .filter(e => [...favoriteIds, ...list].includes(e.id))
      .filter(e => !keepTeams.flatMap(team => team.data.map(a => a.id)).includes(e.id)),
    favoriteIds.filter(e => e).filter(e => !keepTeams.flatMap(team => team.data.map(a => a.id)).includes(e)),
    globalCoop,
  ])
  exe.promise.then(res => {
    result = res
    loadingIndicator = false
  })
})
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <div class="mb-auto">
    {#if keepTeams.length > 0}
      <div class="sticky top-0 bg-background z-20">
        {#each keepTeams as team, i}
          <div class="mb-4 flex bg-neutral rounded-2xl px-3">
            <div class="collapse-title w-full grid grid-cols-4 gap-4 p-3">
              <TeamGridChildren team={team.data} />
            </div>
            <button class="btn btn-circle relative my-auto" onclick={() => deleteTeam(i)}>
              <Svg icon="trash-can" class="absolute inset-0 max-h-1/2 m-auto" />
            </button>
          </div>
        {/each}
        <div class="my-4 border-b border-border"></div>
      </div>
    {/if}
    <Result {lang} {result} {loadingIndicator} {addTeam} stopAddTeam={keepTeams.length >= 3} />
  </div>
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
