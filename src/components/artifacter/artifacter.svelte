<script lang="ts">
// client:only="svelte"
import type { ApiData, AvatarInfo } from '@components/api'
import ShowcaseSelector from '@components/showcase-selector.svelte'
import UidInput from '@components/uid-input.svelte'
import type { Lang } from '@i18n/utils'
import Character from './character.svelte'
import Team from './team.svelte'

const { lang }: { lang: Lang } = $props()

let apiData = $state<ApiData>()
let avatarInfo = $state<AvatarInfo>()
</script>

<UidInput {lang} bind:apiData />
<ShowcaseSelector {lang} {apiData} bind:avatarInfo />
{#if avatarInfo}
<Character {lang} {avatarInfo} />
{/if}
{#if apiData?.avatarInfoList}
<Team {lang} avatarInfoList={apiData.avatarInfoList} />
{/if}
