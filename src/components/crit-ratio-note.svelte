<script lang="ts">
import type { NoteArr } from '@components/crit-ratio-utils'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  PointElement,
  ScatterController,
  Title,
  Tooltip,
} from 'chart.js'
import { text, textSub } from './crit-ratio-utils'

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend, ScatterController)

let { lang, noteArr = $bindable() }: { lang: Lang; noteArr: NoteArr } = $props()
const t = useTranslations(lang)

let canvas: HTMLCanvasElement
let chart: Chart

const data = $derived({
  labels: noteArr.map((_, i) => `#${i + 1}`),
  datasets: [
    {
      type: 'bar' as const,
      label: t('crit-ratio.avg'),
      data: noteArr.toReversed().map(e => Number(e.avg)),
      borderColor: text, //palette.text.primary,
      backgroundColor: 'rgba(16,14,35,0.2)',
      borderRadius: 7,
    },
    {
      type: 'scatter' as const,
      label: t('CRIT'),
      data: noteArr.toReversed().map(e => Number(e.cDmg)),
      borderColor: '#ff0',
      backgroundColor: 'rgba(16,14,35,0.2)',
      pointStyle: 'rectRot',
      pointRadius: 8,
    },
  ],
})
const options = {
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: text,
        usePointStyle: true,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    y: {
      ticks: {
        color: text,
        font: {
          size: 16,
        },
      },
      border: {
        color: text,
      },
      grid: {
        display: false,
      },
    },
    x: {
      ticks: {
        color: textSub,
      },
      grid: {
        color: 'rgba(104,105,155,0.1)',
      },
    },
  },
}

$effect(() => {
  if (canvas) {
    if (chart) chart.destroy()
    chart = new Chart(canvas, { type: 'radar', data, options })
  }
  return () => {
    if (chart) chart.destroy()
  }
})
</script>

{#if noteArr[0]}
<div>
  {#each noteArr as note, i}
    {@const isBaseAdd = note.base && note.add}
    <div class="flex justify-between border border-border rounded py-1 px-2 mb-4">
      <div class="grid gap-1 text-sm" class:grid-cols-2={!isBaseAdd} class:grid-cols-3={isBaseAdd}>
        {#if isBaseAdd}
        <div>{t(note.type)}</div><div class="text-right">{note.base}</div><div>+{note.add}</div>
        {/if}
        <div>{t(`C Rate`)}</div><div class="text-right">{note.cr}</div>{#if isBaseAdd}<div></div>{/if}
        <div>{t(`C DMG`)}</div><div class="text-right">{note.cd}</div>{#if isBaseAdd}<div></div>{/if}
      </div>
      <div class="my-auto">
        <div class="text-center">{t("crit-ratio.avg")}</div>
        <div class="text-center text-lg">{note.avg}</div>
      </div>
      <div class="flex flex-col justify-between items-end text-sm text-right">
        <button onclick={() => noteArr.splice(i, 1)} aria-label="delete">
          <Svg icon="xmark" class="w-3 text-red-500" />
        </button>
        <div>#{noteArr.length - i}</div>
      </div>
    </div>
  {/each}
</div>
<div><canvas bind:this={canvas}></canvas></div>
{/if}
