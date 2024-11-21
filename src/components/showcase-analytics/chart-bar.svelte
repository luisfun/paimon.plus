<script lang="ts">
import type { StatisticsPlayer } from '@components/api-statistics-types'
import { ArcElement, BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js'
import { onMount } from 'svelte'

Chart.register(BarController, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend)

const { playerInfo }: { playerInfo: StatisticsPlayer } = $props()

let canvas: HTMLCanvasElement

const data = $state.snapshot({
  labels: playerInfo.finishAchievementNum100.map((_, i) => `${i * 100}~`),
  datasets: [{ data: playerInfo.finishAchievementNum100 }],
})

const options = {
  datasets: {
    bar: {
      backgroundColor: '#0000',
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 6,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      ticks: {
        color: '#fff',
      },
      border: {
        color: '#fff',
        width: 2,
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
}

onMount(() => {
  if (canvas) new Chart(canvas, { type: 'bar', data, options })
})
</script>

<canvas class="max-w-[485px] max-h-[285px]" bind:this={canvas}></canvas>
