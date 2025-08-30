<script lang="ts">
import { avatarProps } from '@components/img-props'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import Icon from './icon.svelte'
import type { Elem } from './types'
import type { teamBuild } from './worker'

const {
  lang,
  result,
  loadingIndicator,
  addTeam,
  stopAddTeam,
}: {
  lang: Lang
  result: ReturnType<typeof teamBuild> | undefined
  loadingIndicator: boolean
  addTeam: (team: ReturnType<typeof teamBuild>['battle'][number]['all'][number]) => void
  stopAddTeam: boolean
} = $props()
const t = useTranslations(lang)
console.log(stopAddTeam)
</script>

{#snippet teamGrid(team: {avatarId: number | undefined; elem?: Elem; name?: string}[])}
  {#each team as avatar}
    <div class="relative">
      <Icon {...avatarProps(avatar.avatarId ?? -1)} elem={avatar.name === 'Traveler' ? avatar.elem : undefined} />
    </div>
  {/each}
{/snippet}

{#snippet indicator(show: boolean)}
  <div class="absolute z-10 inset-0 bg-background bg-opacity-50" class:hidden={!show}>
    <span class="absolute top-1/2 left-1/2 -transform-1/2 loading loading-bars loading-lg"></span>
  </div>
{/snippet}

{#snippet teamsView(teams: ReturnType<typeof teamBuild>["battle"] | undefined, battle: boolean)}
  {#if teams?.[0]}
    {#each teams as team}
      <div class="collapse bg-neutral my-3 relative">
        <input type="checkbox" class="cursor-pointer" aria-label="more" />
        <div class="collapse-title grid grid-cols-4 gap-6 p-6">
          {@render teamGrid(team.base)}
          <div class="svg-down aspect-square relative">
            <Svg icon="angle-down" class="absolute inset-0 max-h-1/2 m-auto" />
          </div>
        </div>
        <div class="collapse-content">
          {#each team.all as all}
            <div class="flex">
              <div class="relative w-1/10" class:opacity-0={!(battle ? all.battleHiScore : all.explorHiScore)}>
                <Svg icon="thumbs-up" class="absolute inset-0 max-h-1/2 m-auto" />
              </div>
              <div class="collapse-title w-full grid grid-cols-4 gap-4 py-3 px-4">
                {@render teamGrid(all.data)}
              </div>
              <button class="btn btn-circle btn-sm relative my-auto" disabled={stopAddTeam} onclick={() => addTeam(all)}>
                <Svg icon="plus" class="absolute inset-0 h-3/4 m-auto" />
              </button>
            </div>
          {/each}
        </div>
        {@render indicator(loadingIndicator)}
      </div>
    {/each}
  {:else}
    <div class="grid grid-cols-4 gap-6 p-6 relative">
      {@render teamGrid([{avatarId: -1}])}
      {@render indicator(loadingIndicator)}
    </div>
  {/if}
{/snippet}

<div role="tablist" class="relative tabs tabs-lg tabs-bordered grid-cols-2">
  <input type="radio" name="team_builder_result" role="tab" class="tab" aria-label={t("team-builder.battle")} defaultChecked />
  <div role="tabpanel" class="tab-content">
    {@render teamsView(result?.battle, true)}
  </div>
  <input type="radio" name="team_builder_result" role="tab" class="tab" aria-label={t("team-builder.explor")} />
  <div role="tabpanel" class="tab-content">
    {@render teamsView(result?.explor, false)}
  </div>
</div>
