<script lang="ts">
import { avatarProps } from '@components/img-props'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import type { AvatarData } from './types'
import type { teamBuild } from './worker'

const { lang, result }: { lang: Lang; result: ReturnType<typeof teamBuild> | undefined } = $props()
const t = useTranslations(lang)
</script>

{#snippet teamView(team: AvatarData[])}
  <div class="grid grid-cols-4 p-3">
    {#each team as avatar}
      <div class="p-3">
        <img {...avatarProps(avatar.avatarId ?? -1)} />
      </div>
    {/each}
  </div>
{/snippet}

{#snippet teamsView(teams: ReturnType<typeof teamBuild>["battle"] | undefined)}
  {#if teams?.[0]}
    {#each teams as team}
      {@render teamView(team.base)}
    {/each}
  {:else}
    {@render teamView([{avatarId: -1, id: "", name: "", score: [0, 0, 0, 0], }])}
  {/if}
{/snippet}

<div role="tablist" class="tabs tabs-lg tabs-bordered grid-cols-2 mb-auto">
  <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label={t("team-builder.battle")} defaultChecked />
  <div role="tabpanel" class="tab-content">
    {@render teamsView(result?.battle)}
  </div>
  <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label={t("team-builder.explor")} />
  <div role="tabpanel" class="tab-content">
    {@render teamsView(result?.explor)}
  </div>
</div>
