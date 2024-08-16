<script lang="ts">
export let id: string
</script>

<dialog {id} class="modal">
  <div class="modal-box bg-neutral p-1 border border-primary-560 sm:max-w-xl md:max-w-2xl max-h-[calc(100svh-5rem)]">
    <slot />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button aria-label="Close" />
  </form>
</dialog>
