<script lang="ts">
import { avatarProps } from '@components/img-props'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import type { teamBuild } from './worker'

const {
  lang,
  result,
  loadingIndicator,
}: { lang: Lang; result: ReturnType<typeof teamBuild> | undefined; loadingIndicator: boolean } = $props()
const t = useTranslations(lang)
</script>

{#snippet teamGrid(team: {avatarId: number | undefined; elem?: string}[])}
  {#each team as avatar}
    <div>
      <img {...avatarProps(avatar.avatarId ?? -1)} />
    </div>
  {/each}
{/snippet}

{#snippet teamsView(teams: ReturnType<typeof teamBuild>["battle"] | undefined)}
  {#if teams?.[0]}
    {#each teams as team}
      <div class="collapse bg-neutral my-3">
        <input type="checkbox" class="cursor-pointer" aria-label="more" />
        <div class="collapse-title grid grid-cols-4 gap-6 p-6">
          {@render teamGrid(team.base)}
          <div class="aspect-square relative">
            <Svg icon="angle-down" class="absolute inset-0 h-1/2 m-auto" />
          </div>
        </div>
        <div class="collapse-content">
          {#each team.all as all}
            <div class="collapse-title grid grid-cols-4 gap-6 py-3 px-6">
              {@render teamGrid(all.data)}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {:else}
    <div class="grid grid-cols-4 gap-6 p-6">
      {@render teamGrid([{avatarId: -1}])}
    </div>
  {/if}
{/snippet}

<div role="tablist" class="relative tabs tabs-lg tabs-bordered grid-cols-2 mb-auto">
  <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label={t("team-builder.battle")} defaultChecked />
  <div role="tabpanel" class="tab-content">
    {@render teamsView(result?.battle)}
  </div>
  <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label={t("team-builder.explor")} />
  <div role="tabpanel" class="tab-content">
    {@render teamsView(result?.explor)}
  </div>
  <progress class="absolute inset-x-1/2 bottom-[-1.5rem] -transform-x-1/2 progress progress-primary w-56" class:inline-block={loadingIndicator} class:hidden={!loadingIndicator}></progress>
</div>
