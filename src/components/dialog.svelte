<svelte:options runes={true} />
<script lang="ts">
import type { Snippet } from 'svelte'
let {
  dialog = $bindable(),
  id,
  maxFixed = false,
  visible = true,
  children,
}: {
  dialog?: HTMLDialogElement
  id?: string
  maxFixed?: boolean
  visible?: boolean
  children: Snippet
} = $props()
</script>

<dialog bind:this={dialog} {id} class="modal">
  <div class="modal-box bg-background p-0 border border-border sm:max-w-xl md:max-w-2xl max-h-[calc(100svh-5rem)]{maxFixed ? " h-full" : " w-auto"}">
    {#if visible}
      {@render children()}
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button aria-label="Close"></button>
  </form>
</dialog>

<style>
  .modal {
    transition-duration: .1s;
  }
  .modal-box {
    transition-duration: .1s;
  }
</style>
