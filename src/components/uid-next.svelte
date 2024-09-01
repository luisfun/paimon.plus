<script lang="ts">
import { fetchUid, uidTest } from '@components/api'
import type { ApiData } from '@components/api'
import Dialog from '@components/dialog.svelte'
import Icon from '@components/icon.svelte'
import More from '@components/more.svelte'
import Svg from '@components/svg.svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'

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

// tsエラー回避用
const onclick: HTMLButtonAttributes = {
  // @ts-expect-error
  onclick: 'uid_log.showModal()',
}
</script>

<div class="flex justify-between items-center h-10 px-1 md:mb-3">
  <div class="flex items-center">
    <div class="w-10 h-10 mr-4 flex justify-center items-center">
      <Icon id={apiData?.playerInfo.profilePicture.id || 2} ui="circle" />
    </div>
    <div>{apiData?.playerInfo.nickname}</div>
  </div>
  <div class="flex items-center input input-bordered px-1 h-8 bg-neutral rounded-full">
    <button class="btn btn-neutral p-1 min-h-6 w-6 h-6 rounded-full" {...onclick}>
      <Svg icon="clock-rotate-left" />
    </button>
    <input type="number" placeholder="UID" bind:value={uid} class="no-spin w-24 text-center leading-8" />
    <button class="btn btn-neutral p-0.5 min-h-6 w-6 h-6 rounded-full" on:click={clickHandler} {disabled}>
      <Svg icon="angle-right" height="100%" />
    </button>
  </div>
</div>
<More style="md:hidden" mt0>
  aaa
</More>
<Dialog id="uid_log">
  <div class="h-12">
  uid
  log
  </div>
</Dialog>
