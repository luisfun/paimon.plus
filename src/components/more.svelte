<script lang="ts">
import Svg from '@components/svg.svelte'
import type { Snippet } from 'svelte'

const { mt0 = false, style = '', children }: { mt0?: boolean; style?: string; children: Snippet } = $props()
</script>

<div class="collapse grid-rows-[0fr_auto] rounded-none {style}">
  <input type="checkbox" class="!row-start-2 {mt0 ? "mt-0" :"mt-3"} min-h-[unset]" aria-label="more" />
  <div class="collapse-title row-start-2 flex justify-center items-center {mt0 ? "mt-0" :"mt-3"} p-0 pb-3 min-h-[unset]">
    <Svg icon="angle-down" class="svg-down w-4" />
    <Svg icon="angle-up" class="svg-up hidden w-4" />
  </div>
  <div class="collapse-content row-start-1 visible overflow-hidden !p-0">
    {@render children?.()}
  </div>
</div>

<style>
  .collapse:has(> input[type="checkbox"]:checked) {
    grid-template-rows: 1fr auto;
  }
</style>
