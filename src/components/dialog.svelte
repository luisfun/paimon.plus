<script lang="ts">
export let id: string
</script>

<dialog {id} class="modal">
  <div class="modal-box bg-neutral p-1 border border-primary-560">
    <slot />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button />
  </form>
</dialog>
