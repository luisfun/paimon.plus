<script lang="ts">
import { type ApiData, fetchUid, uidTest } from '@components/api'
import Dialog from '@components/dialog.svelte'
import Icon from '@components/icon.svelte'
import { ls } from '@components/local-storage'
import More from '@components/more.svelte'
import Svg from '@components/svg.svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'

export let uid: number | undefined
export let apiData: ApiData | undefined
export let status: number
let disabled = true
$: disabled = !uidTest(uid)
let uidLogs = ls.uidLog.get().filter(e => e.uid !== uid?.toString())

const clickHandler = async (getUid: number | undefined, cache?: 'cache') => {
  const res = await fetchUid(getUid, cache)
  uid = getUid
  apiData = res.json
  status = res.status
  uidLogs = res.uidLogs.filter(e => e.uid !== getUid?.toString())
}
const trashHandler = (deleteUid: string) => {
  uidLogs = ls.uidLog.delete(deleteUid).filter(e => e.uid !== uid?.toString())
}

// tsエラー回避用
const onclick: HTMLButtonAttributes = {
  // @ts-expect-error
  onclick: 'uid_log.showModal()',
}
const onclose: HTMLButtonAttributes = {
  // @ts-expect-error
  onclick: 'uid_log.close()',
}
</script>

<div class="flex justify-between items-center h-10 px-1 md:mb-3">
  <div class="flex items-center">
    <div class="w-10 h-10 mr-4 flex justify-center items-center">
      <Icon id={apiData?.playerInfo.profilePicture.id || apiData?.playerInfo.profilePicture.avatarId || 1} ui="circle" />
    </div>
    <div>{apiData?.playerInfo.nickname}</div>
  </div>
  <div class="flex items-center input input-bordered px-1 h-8 bg-neutral rounded-full">
    <button class="btn btn-neutral p-1 min-h-6 w-6 h-6 rounded-full" {...onclick}>
      <Svg icon="clock-rotate-left" />
    </button>
    <input type="number" placeholder="UID" bind:value={uid} class="no-spin w-24 text-center leading-8" />
    <button class="btn btn-neutral p-0.5 min-h-6 w-6 h-6 rounded-full" on:click={_ => clickHandler(uid)} {disabled}>
      <Svg icon="angle-right" height="100%" />
    </button>
  </div>
</div>
<More style="md:hidden" mt0>
  aaa
</More>
<Dialog id="uid_log">
  {#if uidLogs[0]}
  <div class="grid grid-cols-[1.5rem_2rem_auto_auto_1.5rem] gap-3 leading-8 m-4">
    {#each uidLogs as log}
      <button class="btn btn-neutral p-1 min-h-6 w-6 h-6 my-auto rounded-full" on:click={_ => trashHandler(log.uid)}>
        <Svg icon="trash-can" height="100%" />
      </button>
      <Icon id={log.pfp.id || log.pfp.avatarId || 1} ui="circle" />
      <div>{log.name}</div>
      <div>{log.uid}</div>
      <button class="btn btn-neutral p-0.5 min-h-6 w-6 h-6 my-auto rounded-full" on:click={_ => clickHandler(Number(log.uid), "cache")} {...onclose}>
        <Svg icon="angle-right" height="100%" />
      </button>
    {/each}
  </div>
  {:else}
  <div class="m-8">no logs</div>
  {/if}
</Dialog>
