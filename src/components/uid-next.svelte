<script lang="ts">
import { fetchUid, uidTest } from '@components/api'
import type { ApiData } from '@components/api'

export let uid: number | undefined
export let apiData: ApiData | undefined
export let status: number
let disabled = true
$: disabled = !uidTest(uid)

const clickHandler = async () => {
  const res = await fetchUid(uid)
  apiData = res.json
  status = res.status
}
</script>

<div class="">
  <input type="number" placeholder="UID" bind:value={uid} class="input input-bordered w-full max-w-xs bg-neutral" />
  <button class="btn btn-neutral" on:click={clickHandler} {disabled}>fetch</button>
</div>
