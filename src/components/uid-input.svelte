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
let disabled = true
$: disabled = !uidTest(uid)

const clickHandler = async (getUid: number | undefined, cache?: 'cache', isInit = false) => {
  if (!isInit) isFetching = true
  logDisabled = true
  const res = await fetchUid(getUid, cache)
  uid = getUid
  apiData = res.json
  status = apiData?.status || res.status
  uidLogs = res.uidLogs.filter(e => e.uid !== getUid?.toString())
  if (!isInit) isFetching = false
  logDisabled = !uidLogs[0]
}
const keypressHandler = async (e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
  if (e.code === 'Enter') await clickHandler(uid)
}
const trashHandler = (deleteUid: string) => {
  uidLogs = ls.uidLog.delete(deleteUid).filter(e => e.uid !== uid?.toString())
  logDisabled = !uidLogs[0]
}

onMount(async () => {
  const lsUid = localStorage.getItem('uid')
  const uid = lsUid ? Number(lsUid) : undefined
  isFetching = true
  await Promise.all([
    clickHandler(uid, 'cache', true),
    clickHandler(uid, import.meta.env.MODE === 'development' ? 'cache' : undefined, true),
  ])
  isFetching = false
  isInitLoading = false
})
</script>

{#if isInitLoading && !apiData}
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
    <input type="number" placeholder="UID" bind:value={uid} class="no-spin w-48 text-center text-2xl leading-[3rem]" on:keypress={keypressHandler} />
    {#if isFetching}
    <div class="loading loading-ring w-8" />
    {:else}
    <button class="btn btn-neutral p-0.5 min-h-8 w-8 h-8 rounded-full" on:click={() => clickHandler(uid)} {disabled} aria-label="get uid info">
      <Svg icon="angle-right" height="100%" />
    </button>
    {/if}
  </div>
</div>
{:else}
<div class="flex justify-between items-center h-10 px-1 md:mb-3">
  <div class="flex items-center">
    <div class="w-10 h-10 mr-4 flex justify-center items-center">
      <Icon id={apiData.playerInfo.profilePicture.id || apiData.playerInfo.profilePicture.avatarId || 1} ui="circle" />
    </div>
    <div>{apiData.playerInfo.nickname}</div>
  </div>
  <div class="flex items-center input input-bordered px-1 h-8 bg-neutral rounded-full">
    <button class="btn btn-neutral p-1 min-h-6 w-6 h-6 rounded-full" on:click={() => dialog.showModal()} disabled={isInitLoading || logDisabled} aria-label="uid logs">
      <Svg icon="clock-rotate-left" />
    </button>
    <input type="number" placeholder="UID" bind:value={uid} class="no-spin w-24 text-center leading-8" on:keypress={keypressHandler} />
    {#if isFetching}
    <div class="loading loading-ring w-6" />
    {:else}
    <button class="btn btn-neutral p-0.5 min-h-6 w-6 h-6 rounded-full" on:click={() => clickHandler(uid)} disabled={isInitLoading || disabled} aria-label="get uid info">
      <Svg icon="angle-right" height="100%" />
    </button>
    {/if}
  </div>
</div>
<More mt0>
  <div class="grid justify-center items-center sm:grid-cols-[repeat(3,auto)] gap-x-8 gap-y-2 leading-5 my-2">
    <div>
      <div class="flex justify-between">
        <p class="mr-3">{t("uid.player.ar")}</p>
        <p>{apiData.playerInfo.level}</p>
      </div>
      <div class="flex justify-between">
        <p class="mr-3">{t("uid.player.wl")}</p>
        <p>{apiData.playerInfo.worldLevel || "-"}</p>
      </div>
    </div>
    <div>
      <div class="flex justify-between">
        <p class="mr-3">{t("uid.player.achievements")}</p>
        <p>{apiData.playerInfo.finishAchievementNum || "-"}</p>
      </div>
      <div class="flex justify-between">
        <p class="mr-3">{t("uid.player.friendship")}</p>
        <p>{apiData.playerInfo.fetterCount || "-"}</p>
      </div>
    </div>
    <div>
      <div class="flex justify-between">
        <p class="mr-3">{t("uid.player.tower")}</p>
        <p>{apiData.playerInfo.towerFloorIndex || ""}-{apiData.playerInfo.towerLevelIndex || ""}</p>
      </div>
      <div class="flex justify-between">
        <p class="mr-3">{t("uid.player.theater")}</p>
        <p>{apiData.playerInfo.theaterActIndex || "-"}</p>
      </div>
    </div>
    {#if status >= 400}
    <div class="sm:col-start-3 mt-4 sm:mt-2">
      <div class="flex justify-between">
        <p class="mr-3">{t("uid.player.server")}</p>
        <p>{status}</p>
      </div>
    </div>
    {/if}
  </div>
</More>
<Dialog bind:dialog>
  <div class="grid grid-cols-[1.5rem_2rem_auto_auto_1.5rem] gap-3 leading-8 m-4">
    {#each uidLogs as log}
      <button class="btn btn-neutral p-1 min-h-6 w-6 h-6 my-auto rounded-full" on:click={() => trashHandler(log.uid)} aria-label="delete uid log">
        <Svg icon="trash-can" height="100%" />
      </button>
      <Icon id={log.pfp.id || log.pfp.avatarId || 1} ui="circle" />
      <div>{log.name}</div>
      <div>{log.uid}</div>
      <button class="btn btn-neutral p-0.5 min-h-6 w-6 h-6 my-auto rounded-full" on:click={() => clickHandler(Number(log.uid), "cache")} on:click={() => dialog.close()} aria-label="get uid info">
        <Svg icon="angle-right" height="100%" />
      </button>
    {/each}
  </div>
</Dialog>
{/if}
