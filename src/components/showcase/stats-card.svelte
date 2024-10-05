<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo } from '@components/api'
import type { Lang } from '@i18n/utils'
import RawSubStats from '@manual/showcase-sub-stats.json'
import Card from './card.svelte'
import { useTranslations } from '@i18n/utils'
const en = useTranslations("en")
type SubStat = 'CRIT' | 'HP' | 'ATK' | 'DEF' | 'ER' | 'EM'
const SubStats = RawSubStats as Record<keyof typeof RawSubStats, SubStat[]>
const subStats = (name: string) => SubStats[name as keyof typeof RawSubStats] || SubStats["default"]

type Props = {
  lang: Lang
  avatarInfo: AvatarInfo | undefined
}
const { lang, avatarInfo }: Props = $props()

let subMarks = $state(subStats(en(avatarInfo?.avatarId || 0, "avatar")))
</script>

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} {avatarInfo} />
  </div>
</div>
{/if}
