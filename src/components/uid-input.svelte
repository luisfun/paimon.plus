<script lang="ts">
import { type ApiData, fetchUid, uidTest } from '@components/api'
import Dialog from '@components/dialog.svelte'
import ExternalA from '@components/external-a.svelte'
import Icon from '@components/icon.svelte'
import { type UidLog, ls } from '@components/local-storage'
import More from '@components/more.svelte'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import { onMount } from 'svelte'

export let lang: Lang
const t = useTranslations(lang)
export let apiData: ApiData | undefined
let uid: number | undefined
let isInitLoading = true
let isFetching = false
let status: number
let dialog: HTMLDialogElement
let uidLogs: UidLog[] = []
let logDisabled = true
$: logDisabled = !uidLogs[0]
let disabled = true
$: disabled = !uidTest(uid)

const clickHandler = async (getUid: number | undefined, cache?: 'cache') => {
  isFetching = true
  const res = await fetchUid(getUid, cache)
  isFetching = false
  uid = getUid
  apiData = res.json
  status = apiData?.status || res.status
  uidLogs = res.uidLogs.filter(e => e.uid !== getUid?.toString())
}
const trashHandler = (deleteUid: string) => {
  uidLogs = ls.uidLog.delete(deleteUid).filter(e => e.uid !== uid?.toString())
}

onMount(async () => {
  const lsUid = localStorage.getItem('uid')
  await clickHandler(lsUid ? Number(lsUid) : undefined, 'cache')
  isInitLoading = false
})
</script>

{#if isInitLoading}
<div class="flex justify-center mt-[15svh]">
  <div class="loading loading-ring w-24" />
</div>
{:else if !apiData}
<div class="flex flex-col items-center mt-[15svh]">
  {#if status !== 0}
  <div class="flex flex-col items-center mb-16">
    <div class="mb-8 text-2xl">Error {status}</div>
    <div class="text-base">
      <div>
        {#if status === 400 || status === 404 || status === 424 || status === 429 || status === 500 || status === 503 }
        {t(`uid.error.${status}`)}
        {:else}
        {t("uid.error.other")}
        {/if}
      </div>
      <ul class="my-6">
        <li>{t("uid.error.li1")}</li>
        <li>{t("uid.error.li2")}</li>
      </ul>
      <div>{t("uid.error.report")}</div>
      <ExternalA href="https://discord.gg/5bKYuCcmfu" aria-label="discord" class="text-link">
        <Svg icon="discord" class="h-4 inline-block" /> Discord
      </ExternalA>
    </div>
  </div>
  {/if}
  <div class="flex items-center input input-bordered px-1.5 bg-neutral rounded-full">
    <input type="number" placeholder="UID" bind:value={uid} class="no-spin w-48 text-center text-2xl leading-[3rem]" />
    {#if isFetching}
    <div class="loading loading-ring w-8" />
    {:else}
    <button class="btn btn-neutral p-0.5 min-h-8 w-8 h-8 rounded-full" on:click={() => clickHandler(uid)} {disabled}>
      <Svg icon="angle-right" height="100%" />
    </button>
    {/if}
  </div>
</div>
{:else}
<div class="flex justify-between items-center h-10 px-1 md:mb-3">
  <div class="flex items-center">
    <div class="w-10 h-10 mr-4 flex justify-center items-center">
      <Icon id={apiData?.playerInfo.profilePicture.id || apiData?.playerInfo.profilePicture.avatarId || 1} ui="circle" />
    </div>
    <div>{apiData?.playerInfo.nickname}</div>
  </div>
  <div class="flex items-center input input-bordered px-1 h-8 bg-neutral rounded-full">
    <button class="btn btn-neutral p-1 min-h-6 w-6 h-6 rounded-full" on:click={() => dialog.showModal()} disabled={logDisabled}>
      <Svg icon="clock-rotate-left" />
    </button>
    <input type="number" placeholder="UID" bind:value={uid} class="no-spin w-24 text-center leading-8" />
    {#if isFetching}
    <div class="loading loading-ring w-6" />
    {:else}
    <button class="btn btn-neutral p-0.5 min-h-6 w-6 h-6 rounded-full" on:click={() => clickHandler(uid)} {disabled}>
      <Svg icon="angle-right" height="100%" />
    </button>
    {/if}
  </div>
</div>
<More style="md:hidden" mt0>
  aaa
</More>
<Dialog bind:dialog>
  <div class="grid grid-cols-[1.5rem_2rem_auto_auto_1.5rem] gap-3 leading-8 m-4">
    {#each uidLogs as log}
      <button class="btn btn-neutral p-1 min-h-6 w-6 h-6 my-auto rounded-full" on:click={() => trashHandler(log.uid)}>
        <Svg icon="trash-can" height="100%" />
      </button>
      <Icon id={log.pfp.id || log.pfp.avatarId || 1} ui="circle" />
      <div>{log.name}</div>
      <div>{log.uid}</div>
      <button class="btn btn-neutral p-0.5 min-h-6 w-6 h-6 my-auto rounded-full" on:click={() => clickHandler(Number(log.uid), "cache")} on:click={() => dialog.close()}>
        <Svg icon="angle-right" height="100%" />
      </button>
    {/each}
  </div>
</Dialog>
{/if}
