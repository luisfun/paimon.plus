<script lang="ts">
// client:only="svelte"
import { avatarProps } from '@components/img-props'
import TeamBuilderInput from '@components/team-builder-input.svelte'
import { avatar } from '@components/team-builder-utils'
import { type Lang, useTranslations } from '@i18n/utils'
import NavSvg from '../home/nav-svg.svelte'
import Icon from '../team-builder/icon.svelte'
import type { Elem } from '../team-builder/types'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let list = $state<string[]>([])
let result = $state<{
  abyss: ReturnType<typeof getAbyss>
  domain: ReturnType<typeof getTeam>
  chara: ReturnType<typeof getChara>
}>()
let dice = $state<number>(0)

const getRandom = <T>(arr: T[]): T | undefined => arr[Math.floor(Math.random() * arr.length)]

const isBuild = (num: number) => {
  const avatarList = avatar.filter(e => list.includes(e.id))
  const rollNum = [0, 1, 2, 3].map(i => [...new Set(avatarList.filter(e => e.score[i]).map(e => e.avatarId))].length)
  if (rollNum[0] < num || rollNum[1] + rollNum[2] < num * 2 || rollNum[3] < num) return false
  return true
}

const getChara = (roll?: 'main' | 'subsup' | 'heal') => {
  const rollIndex = { main: [0], subsup: [1, 2], heal: [3], undefined: [0, 1, 2, 3] }[roll ?? 'undefined']
  return getRandom(avatar.filter(e => list.includes(e.id) && rollIndex.some(i => e.score[i])))
}

const getTeam = () => {
  if (!isBuild(1)) return undefined
  for (let i = 300; i; i--) {
    const team = [getChara('main'), getChara('subsup'), getChara('subsup'), getChara('heal')]
    if (team.includes(undefined)) break
    if ([...new Set(team.map(e => e?.avatarId))].length === 4) return team as typeof avatar
  }
  return undefined
}

const getAbyss = () => {
  if (!isBuild(2)) return undefined
  for (let i = 300; i; i--) {
    const teams = [getTeam(), getTeam()]
    if (teams.includes(undefined)) break
    if ([...new Set(teams.flatMap(team => team?.map(e => e.avatarId)))].length === 8) return teams as (typeof avatar)[]
  }
  return undefined
}

$effect(() => {
  result = { abyss: getAbyss(), domain: getTeam(), chara: getChara() }
  dice // effect
})
</script>

{#snippet teamGrid(team: {avatarId: number | undefined; elem?: Elem; name?: string}[])}
  {#each team as avatar}
    <div class="relative">
      <Icon {...avatarProps(avatar.avatarId ?? -1)} elem={avatar.name === 'Traveler' ? avatar.elem : undefined} />
    </div>
  {/each}
{/snippet}

{#snippet error()}
<div class="my-12 text-center">{t("team-randomizer.error")}</div>
{/snippet}

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <div class="mb-auto">
    <div role="tablist" class="tabs tabs-lg tabs-bordered grid-cols-3 mb-auto">
      <input type="radio" name="team_randomizer_result" role="tab" class="tab" aria-label={t("team-randomizer.abyss")} defaultChecked />
      <div role="tabpanel" class="tab-content">
        {#if result?.abyss}
          <div class="bg-neutral rounded-2xl my-3">
            <div class="grid grid-cols-4 gap-6 p-6 pb-2">{@render teamGrid(result.abyss[0])}</div>
            <div class="divider my-0 mx-12"></div>
            <div class="grid grid-cols-4 gap-6 p-6 pt-2">{@render teamGrid(result.abyss[1])}</div>
          </div>
        {:else}
          {@render error()}
        {/if}
      </div>
      <input type="radio" name="team_randomizer_result" role="tab" class="tab" aria-label={t("team-randomizer.domain")} />
      <div role="tabpanel" class="tab-content">
        {#if result?.domain}
          <div class="grid grid-cols-4 gap-6 p-6 bg-neutral rounded-2xl my-3">
            {@render teamGrid(result.domain)}
          </div>
        {:else}
          {@render error()}
        {/if}
      </div>
      <input type="radio" name="team_randomizer_result" role="tab" class="tab" aria-label={t("team-randomizer.character")} />
      <div role="tabpanel" class="tab-content">
        {#if result?.chara}
          <div class="my-6 mx-auto relative w-24">
            <Icon {...avatarProps(result.chara.avatarId ?? -1)} elem={result.chara.name === 'Traveler' ? result.chara.elem : undefined} />
          </div>
        {:else}
          {@render error()}
        {/if}
      </div>
    </div>
    <button class="block mx-auto my-3 w-20" onclick={_ => dice = Math.random()}>
      <NavSvg icon="dice" />
    </button>
  </div>
  <div class="mb-auto">
    <TeamBuilderInput {lang} bind:list />
  </div>
</div>
