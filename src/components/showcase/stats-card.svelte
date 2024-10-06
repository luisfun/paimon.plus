<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo } from '@components/api'
import Svg from '@components/svg.svelte'
import type { Lang } from '@i18n/utils'
import { useTranslatedPath, useTranslations } from '@i18n/utils'
import RawSubStats from '@manual/showcase-sub-stats.json'
import Card from './card.svelte'
const en = useTranslations('en')
type SubStat = 'CRIT' | 'HP' | 'ATK' | 'DEF' | 'ER' | 'EM'
const SubStats = RawSubStats as Record<keyof typeof RawSubStats, SubStat[]>
const subStats = (name: string) => SubStats[name as keyof typeof RawSubStats] || SubStats.default

const {
  lang,
  avatarInfo,
}: {
  lang: Lang
  avatarInfo: AvatarInfo | undefined
} = $props()
const t = useTranslations(lang)
const translatePath = useTranslatedPath(lang)

let subMarks = $state(subStats(en(avatarInfo?.avatarId || 0, 'avatar')))
</script>

{#if avatarInfo}
<div class="overflow-x-auto mx-[calc((-100/91.666667+1)/2*100%)] lg:mx-auto mb-2">
  <div class="w-[768px] md:w-[1024px] rounded-lg overflow-hidden">
    <Card {lang} {avatarInfo} />
  </div>
</div>
<div class="flex justify-around sm:justify-evenly">
  <div class="flex justify-center">
    <button class="btn btn-sm btn-primary leading-8 btn-circle mr-2 sm:mr-4" aria-label="sub stats config"><Svg icon="list-check" class="py-1.5" height="100%" /></button>
    <button class="btn btn-sm btn-primary leading-8">
      <Svg icon="download" class="py-1.5" height="100%" />{t("card.download")}
    </button>
  </div>
  <a role="button" class="btn btn-sm btn-primary leading-8 btn-outline" href={translatePath("/artifacter/")}>
    <Svg icon="circlet" class="py-1.5" height="100%" />Artifacter
  </a>
</div>
{/if}
