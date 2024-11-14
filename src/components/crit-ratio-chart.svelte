<script lang="ts">
import More from '@components/more.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import { Chart, Filler, Legend, LineElement, PointElement, RadarController, RadialLinearScale, Tooltip } from 'chart.js'
import type { Snippet } from 'svelte'
import { type InputStats, avg } from './crit-ratio-utils'

const text = 'rgba(255, 255, 255, 0.85)'
const textSub = 'rgba(255, 255, 255, 0.45)'

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const { lang, type, base, add, cr, cd, children }: { lang: Lang; children?: Snippet } & InputStats = $props()
const t = useTranslations(lang)

let canvas: HTMLCanvasElement
let chart: Chart

// core
const score = (type: string, base: number, add: number, cr: number, cd: number) =>
  (type === 'DEF' ? 0.8 : 1) * (add / base) + 1.5 * cr + 0.75 * cd
const score_ = (type: string, a: number) => a + (type === 'DEF' ? 0.8 : 1) - 1
const def_ = (type: string, x: number) => (type === 'DEF' ? 1.25 : 1) * x
const idealValue = (type: string, a: number) => {
  const a_ = score_(type, a)
  if (a_ < 2.525) {
    return [def_(type, a - 1.5 * 0.05 - 0.375), 0.05, 0.5]
  }
  if (a_ < 2.776) {
    const cr = (a_ - 2.375) / 3
    return [def_(type, a - 1.5 * cr - 0.375), cr, 0.5]
  }
  if (a_ < 4.25) {
    const cr = (a_ + 1 + Math.sqrt((a_ + 1) ** 2 - 13.5)) / 9
    return [def_(type, a - 3 * cr), cr, cr * 2]
  }
  const cd = ((a_ - 1.25) * 2) / 3
  return [def_(type, a - 0.75 * cd - 1.5), 1, cd]
}

// value
const a = $derived(score(type, base, add, cr, cd))
const a_ = $derived(score_(type, a))
const ideal = $derived(idealValue(type, a))
const avgC = $derived(avg(base, add, cr, cd))
const avgI = $derived(avg(base, ideal[0] * base, ideal[1], ideal[2]))
const diff = $derived((avgI - avgC) / avgC)
const low = $derived(a_ < 2.776 ? [2 / 3, 0.5 / ideal[1], 2] : [1, 1, 1])
const data = $derived({
  labels: [`${t(type)} (${t('crit-ratio.green')})`, t('C DMG'), t('C Rate')],
  datasets: [
    {
      label: t('crit-ratio.current'),
      data: [add / base / ideal[0] / low[0], cd / ideal[2] / low[2], cr / ideal[1] / low[1]],
      borderColor: text,
      backgroundColor: 'transparent',
    },
    {
      label: t('crit-ratio.ideal'),
      data: [1 / low[0], 1 / low[2], 1 / low[1]],
      borderColor: '#090',
      backgroundColor: 'transparent',
    },
  ],
})
const options = {
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: text,
        font: {
          size: 16,
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    r: {
      min: 0,
      max: 1.2,
      angleLines: {
        color: textSub,
      },
      pointLabels: {
        font: {
          size: 16,
        },
        color: text,
      },
      ticks: {
        display: false,
      },
      grid: {
        display: false,
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

<div>{`${t(type)} ✕ ${t("CRIT")} (${t("crit-ratio.avg")})`} : <span class="text-3xl">{avgC}</span></div>
<div>{t(`crit-ratio.diff`)} : <span class="text-3xl">{(diff*100).toFixed(2)}</span> %</div>
{@render children?.()}
<More checked>
  <div class="text-lg font-bold mb-4" class:mt-4={!children}>{t(`crit-ratio.${type}`)}</div>
  {#if (a_ < 2.776)}<div>{t("crit-ratio.low")}</div>{/if}
  <canvas class="max-w-[485px] max-h-[485px]" bind:this={canvas}></canvas>
</More>
