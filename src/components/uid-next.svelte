<script lang="ts">
import { fetchUid, uidTest } from '@components/api'
import type { ApiData } from '@components/api'
import Icon from './icon.svelte'

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

<div class="flex justify-between items-center h-12 p-1">
  <div class="flex items-center">
    <div class="w-10 h-10 mr-4 flex justify-center items-center">
      <Icon id={apiData?.playerInfo.profilePicture.id || 2} ui="circle" />
    </div>
    <div>{apiData?.playerInfo.nickname}</div>
  </div>
  <div class="flex items-center">
    <input type="number" placeholder="UID" bind:value={uid} class="input input-bordered w-full max-w-xs bg-neutral" />
    <button class="btn btn-neutral" on:click={clickHandler} {disabled}>fetch</button>
  </div>
</div>
