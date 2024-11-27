<script lang="ts">
import type { Snippet } from 'svelte'
const { title, arrow, plus, children }: { title: string; arrow?: boolean; plus?: boolean; children: Snippet } = $props()
</script>

<div class="collapse bg-neutral" class:collapse-arrow={arrow} class:collapse-plus={plus}>
  <input type="checkbox" class="min-h-12" aria-label={title} />
  <div class="collapse-title min-h-12">{title}</div>
  <div class="collapse-content text-base">
    {@render children?.()}
  </div>
</div>

<style>
  .collapse-arrow > .collapse-title:after,
	.collapse-plus > .collapse-title:after{
		top: 1.55rem;
	}
</style>
