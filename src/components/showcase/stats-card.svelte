<script lang="ts">
import type { AvatarInfo } from '@components/api'
import type { Lang } from '@i18n/utils'
import RawSubStats from '@manual/showcase-sub-stats.json'
import Card from './card.svelte'

const SubStats = RawSubStats as Record<keyof typeof RawSubStats, ('CRIT' | 'HP' | 'ATK' | 'DEF' | 'ER' | 'EM')[]>

export let lang: Lang
export let avatarInfo: AvatarInfo | undefined
</script>

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} {avatarInfo} />
  </div>
</div>
{/if}
