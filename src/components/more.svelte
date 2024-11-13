<script lang="ts">
import Svg from '@components/svg.svelte'
import type { Snippet } from 'svelte'

const {
  mt0,
  checked,
  style = '',
  children,
}: { mt0?: boolean; checked?: boolean; style?: string; children: Snippet } = $props()
</script>

<div class="collapse grid-rows-[0fr_auto] rounded-none {style}">
  <input type="checkbox" class="!row-start-2 min-h-[unset]" class:mt-0={mt0} class:mt-3={!mt0} aria-label="more" checked={checked} />
  <div class="collapse-title row-start-2 flex justify-center items-center p-0 pb-3 min-h-[unset]" class:mt-0={mt0} class:mt-3={!mt0}>
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
