<script lang="ts">
import { fetchUid, uidTest } from '@components/api'
import type { ApiData } from '@components/api'
import { onMount } from 'svelte'

export let uidData: ApiData | undefined
export let status: number
let uid: number | undefined = undefined
let disabled = true
$: disabled = !uidTest(uid)

onMount(async () => {
  const lsUid = localStorage.getItem('uid')
  uid = lsUid ? Number(lsUid) : undefined
  if (uid) {
    const res = await fetchUid(uid, 'cache')
    uidData = res.json
    status = res.status
  }
})

const clickHandler = async () => {
  const res = await fetchUid(uid)
  uidData = res.json
  status = res.status
}
</script>

<div>
  <input type="number" placeholder="UID" bind:value={uid} class="input input-bordered w-full max-w-xs bg-neutral" />
  <button class="btn btn-neutral" on:click={clickHandler} {disabled}>fetch</button>
</div>
