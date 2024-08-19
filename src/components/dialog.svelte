<script lang="ts">
export let id: string
export let maxH = false
export let visible = true
</script>

<dialog {id} class="modal">
  <div class="modal-box bg-primary-730 p-0 border border-primary-560 sm:max-w-xl md:max-w-2xl max-h-[calc(100svh-5rem)] {maxH && "h-full"}">
    {#if visible}
    <slot />
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button aria-label="Close" />
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
