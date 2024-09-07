<script lang="ts">
import { fetchUid, uidTest } from '@components/api'
import type { ApiData } from '@components/api'
import Svg from '@components/svg.svelte'
import { onMount } from 'svelte'

export let uid: number | undefined
export let apiData: ApiData | undefined
export let status: number
let disabled = true
$: disabled = !uidTest(uid)
let isInitInput = false

onMount(async () => {
  const lsUid = localStorage.getItem('uid')
  uid = lsUid ? Number(lsUid) : undefined
  if (uid) {
    const res = await fetchUid(uid, 'cache')
    apiData = res.json
    status = res.status
  }
  isInitInput = true
})

const clickHandler = async () => {
  const res = await fetchUid(uid)
  apiData = res.json
  status = res.status
}
</script>

<div class="flex justify-center mt-[15svh]">
  {#if isInitInput}
  <div class="flex items-center input input-bordered px-1 bg-neutral rounded-full">
    <input type="number" placeholder="UID" bind:value={uid} class="no-spin w-48 text-center text-2xl leading-[3rem]" />
    <button class="btn btn-neutral p-0.5 min-h-8 w-8 h-8 rounded-full" on:click={clickHandler} {disabled}>
      <Svg icon="angle-right" height="100%" />
    </button>
  </div>
  {:else}
  <div class="loading loading-ring w-24" />
  {/if}
</div>
