<svelte:options runes={true} />
<script lang="ts">
import Icon from './icon.svelte'

const {
  id,
  skinId,
  active = false,
  select = false,
  onSelect,
}: {
  id: number
  skinId: number | undefined
  active: boolean
  select: boolean
  onSelect: (id: number) => void
} = $props()
</script>

<button class="relative flex-none w-[4.5rem] h-[4.5rem] pointer" onclick={() => onSelect(id)}>
  <div class="side-bg absolute top-1/2 left-1/2 -transform-1/2 outline outline-[3px] w-12 h-12 rounded-full transition-all{(select ? ' side-bg-select' : "") + (active ? ' side-bg-active' : "")}"></div>
  <div class="absolute bottom-0 left-1/2 -transform-x-1/2 border border-b-2 transition-all {select ? "w-full side-bottom-color": "w-0 border-transparent"}"></div>
  <Icon {id} {skinId} ui="side" style="absolute bottom-3 left-1/2 -transform-x-1/2 max-w-none transition-all {select ? "w-20" : "w-[4.6rem]"}" />
</button>

<style>
  .side-bg {
    outline-color: rgba(255, 255, 255, .2);
    background: rgba(0, 0, 0, .2);
  }
  .side-bg-active {
    outline-color: #96db8380;
  }
  .side-bg-select {
    outline-color: #4fccf099;
    background: #4fccf099;
    box-shadow: 0 0 1.5rem #4fccf080;
  }
  .side-bg-active.side-bg-select {
    outline-color: #96db83;
  }
  .side-bottom-color {
    border-color: #4fccf0;
  }
</style>
