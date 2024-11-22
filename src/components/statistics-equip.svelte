<script lang="ts">
import type { StatisticsRemapped } from '@components/api-statistics'
import { weaponProps } from '@components/img-props'
import Img from '@components/img.svelte'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import type { SvelteHTMLElements } from 'svelte/elements'
import HoyoWiki from './hoyo-wiki.svelte'

const {
  lang,
  view,
  weapon,
  reliquarySet,
  dropEnd,
  ...rest
}: {
  lang: Lang
  view: number
  weapon?: StatisticsRemapped['avatarInfoList'][number]['weapon']
  reliquarySet?: StatisticsRemapped['avatarInfoList'][number]['reliquarySet']
  dropEnd?: boolean
} & SvelteHTMLElements['div'] = $props()
const t = useTranslations(lang)

const widht = view === 5 ? 'w-1/5' : view === 2 ? 'w-1/2' : `w-1/${view}`
const realityColor = ['#868586', '#868586', '#519072', '#5392b8', '#9c75b7', '#b27330']

$effect(() => {
  if (weapon && weapon.length > view) weapon.length = view
  if (reliquarySet && reliquarySet.length > view) reliquarySet.length = view
})
</script>

{#snippet label(text: string | number)}
  <div class="absolute bottom-[10%] right-[10%] px-1 py-px rounded bg-neutral">{text}</div>
{/snippet}
{#snippet per(num: string | number, mt?: boolean)}
  <div class="text-center" class:mt-1={mt}>{num}<span class="text-xs text-text-sub">%</span></div>
{/snippet}

<div {...rest}>
  {#if weapon}
    {#each weapon as w, i}
      <div class="{widht} relative px-1 dropdown dropdown-hover{(dropEnd && view - i === 1) ? " dropdown-end" : ""}">
        <div tabindex="0" role="button">
          <Svg icon="star" class="absolute w-5" style="color: {realityColor[w.rankLevel]};" />
          <Img {...weaponProps(w.id, "w-full", true)} />
          {@render per(w.display)}
        </div>
        <div tabindex="-1" class="dropdown-content bg-neutral rounded-lg w-max max-w-[200%] z-10 px-3 py-2 text-sm shadow-background">
          <div>{t(w.id, "weapon")}</div>
          <HoyoWiki class="text-link" {lang} wikiId={w.wikiId} />
        </div>
      </div>
    {/each}
  {:else if reliquarySet}
    {#each reliquarySet as s, i}
    <div class="{widht} px-1 dropdown dropdown-hover{(dropEnd && view - i === 1) ? " dropdown-end" : ""}">
      <div tabindex="0" role="button">
        {#if !s.set[1]}
          <div class="relative">
            <Img class="w-full" src="/images/ui/UI_RelicIcon_{s.set[0].id}_4.webp" />
            {@render label(s.set[0].piece)}
          </div>
        {:else}
          <div class="relative w-full aspect-square">
            <div class="absolute w-full aspect-square" style="clip-path: polygon(0% 0%, 100% 0%, 100% 100%);">
              <div class="absolute top-0 right-0 w-2/3">
                <Img src="/images/ui/UI_RelicIcon_{s.set[0].id}_4.webp" />
                {@render label(s.set[0].piece)}
              </div>
            </div>
            <div class="absolute w-full aspect-square" style="clip-path: polygon(0% 0%, 0% 100%, 100% 100%);">
              <div class="absolute bottom-0 left-0 w-2/3">
                <Img src="/images/ui/UI_RelicIcon_{s.set[1].id}_4.webp" />
                {@render label(s.set[1].piece)}
              </div>
            </div>
          </div>
        {/if}
        {@render per(s.display)}
      </div>
      <div tabindex="-1" class="dropdown-content bg-neutral rounded-lg w-max max-w-[200%] z-10 px-3 py-2 text-sm shadow-background">
        {#each s.set as set}
          <div>{t(set.nameTextMapHash ?? 0)}</div>
          <HoyoWiki class="text-link" {lang} wikiId={set.wikiId} />
        {/each}
      </div>
    </div>
  {/each}
  {:else}
  <div>Unknown Error</div>
  {/if}
</div>
