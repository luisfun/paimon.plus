<script lang="ts">
import Svg from '@components/svg.svelte'
import { ArcElement, BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js'
import { onMount } from 'svelte'

Chart.register(BarController, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend)

const { array }: { array: number[] } = $props()

let canvas: HTMLCanvasElement

const colors = ['#0ff8', '#0f08', '#ff08', '#f808', '#f008', '#4088']
const colorsLegend = ['#0ffb', '#0f0b', '#ff0b', '#f80b', '#f00b', '#408']
const c0 = array.length - colors.length
const data = {
  labels: [''],
  datasets: array.map((e, i) => ({
    label: i.toString(),
    data: [e],
    backgroundColor: i < c0 ? '#0000' : colors[i - c0],
  })),
}

const options = {
  indexAxis: 'y',
  datasets: {
    bar: {
      borderColor: '#fffb',
      borderWidth: 2,
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
      display: false,
      stacked: true,
      beginAtZero: true,
      max: array.reduce((sum, e) => sum + e, 0),
    },
    y: {
      display: false,
      stacked: true,
    },
  },
} as const

onMount(() => {
  if (canvas) new Chart(canvas, { type: 'bar', data, options })
})
</script>

<canvas class="max-h-10 my-1" bind:this={canvas}></canvas>
<div class="text-center">
  {#each colorsLegend as c,i}
    <Svg icon="square" class="inline-block w-4 h-4" style={`color: ${c};`} />{c0 + i}&nbsp;
  {/each}
</div>
