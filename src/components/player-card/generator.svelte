<script lang="ts">
// client:only="svelte"
import Collapse from '@components/collapse.svelte'
import ExternalA from '@components/external-a.svelte'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'
import { data } from './data'
import Editor from './editor.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let toolData = $state(data.filter(e => e.toolId)[0])
let collapseChecked = $state(false)

const onChengeToolId = (id: (typeof data)[number]['toolId']) => {
  toolData = data.find(e => e.toolId === id) ?? toolData
  collapseChecked = false
}

onMount(() => {
  const template = new URLSearchParams(window.location.search).get('t')
  if (
    data
      .map(e => e.toolId)
      .filter(e => e)
      // @ts-expect-error
      .includes(template)
  )
    toolData = data.find(e => e.toolId === template) ?? toolData
})
</script>

<Collapse title={t("player-card.change")} arrow checked={collapseChecked} onclick={() => collapseChecked = true}>
  <div class="grid gap-4 sm:gap-12 grid-cols-[3fr_2fr] mt-2">
    {#each [data.filter(e => e.toolId && !e.vertical), data.filter(e => e.toolId && e.vertical)] as dataXY}
      <div class="grid gap-4 sm:gap-12 mb-auto">
        {#each dataXY as d}
          {@const isId = toolData?.toolId === d.toolId}
          <button onclick={() => onChengeToolId(d.toolId)}>
            <img
              class="rounded-lg sm:rounded-2xl"
              class:outline={isId}
              class:outline-primary={isId}
              class:outline-offset-4={isId}
              src={d.sample.src}
              width={d.sample.width}
              height={d.sample.height}
              alt={d.toolId}
            />
          </button>
        {/each}
      </div>
    {/each}
  </div>
</Collapse>

<div class="text-center my-6">{t("player-card.creator")}:
  <ExternalA class="text-link" href={`https://x.com/${toolData.x}`}>
    <Svg class="w-4 h-4 inline-block" icon="x-twitter" />@{toolData.x}
  </ExternalA>
</div>

<Editor {lang} {toolData} />
