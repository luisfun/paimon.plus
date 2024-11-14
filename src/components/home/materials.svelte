<script lang="ts">
import HoyoWiki from '@components/hoyo-wiki.svelte'
import Icon from '@components/icon.svelte'
import materialJson from '@game/material.json'
import type { Lang } from '@i18n/utils'
import { useTranslations } from '@i18n/utils'

const {
  lang,
  costs,
  rank,
}: {
  lang: Lang
  costs: {
    promoteCoin: number
    skillCoin?: number
    materials: Record<string, number | undefined>
  }
  rank: number | undefined
} = $props()
const t = useTranslations(lang)

const order = (rank: number) => {
  if (costs.skillCoin) {
    switch (true) {
      case rank === 14101: // Crown
        return 8
      case 311 <= rank && rank <= 317: // Local Specialty 317??
        return 3
      case 12102 <= rank && rank <= 12108: // Ascension Material
        return 1
      case 13101 <= rank && rank <= 13200: // Talent Book 13200??
        return 5
      case 10601 <= rank && rank <= 10700: // Enemy Drops
        return 7
      case rank === -5: // Boss
        return 2
      case rank === -6: // Weekly Boss
        return 6
      case rank === 100: // Hero's Wit
        return 4
      //case rank === 11101: // Boss
      default:
        return 1
    }
  }
  switch (true) {
    case rank === 5: // Mystic Enhancement Ore
      return 4
    case 10601 <= rank && rank <= 10700: // Enemy Drops
      return 3
    case 15101 <= rank && rank <= 15200: // Ascension Material 15200??
      return 1
    case 10101 <= rank && rank <= 10200: // Elite Enemy Drops 10101?? 10200??
      return 2
    default:
      return 1
  }
}

const materials = $derived.by(() => {
  const c = { promoteCoin: costs.promoteCoin, skillCoin: costs.skillCoin, materials: { ...costs.materials } }
  if (c.skillCoin)
    c.materials['104003'] = 419 // avatar exp
  else c.materials['104013'] = [0, 72, 108, 399, 605, 907][rank || 0] // weapon exp
  const m = []
  for (const id of Object.keys(c.materials).map(e => Number(e))) {
    const data = materialJson.find(e => e.id === id)
    if (!data) continue
    const index = m.findIndex(e => e.rank === data.rank)
    if (index === -1 || data.rank === 11101)
      // ボスを分離
      m.push({
        rank: data.rank,
        order: order(data.rank !== 11101 ? data.rank : ~(data.rankLevel || 0)),
        materials: [
          { id, icon: data.icon, level: data.rankLevel || 1, count: c.materials[id] || 0, wikiId: data.wikiId },
        ],
      })
    else
      m[index].materials.push({
        id,
        icon: data.icon,
        level: data.rankLevel || 1,
        count: c.materials[id] || 0,
        wikiId: data.wikiId,
      })
  }
  for (const material of m) material.materials.sort((a, b) => a.level - b.level)
  m.sort((a, b) => a.order - b.order)
  return m
})
</script>

<div class="grid grid-cols-4 gap-3 mt-3">
  {#each materials as material, i}
    <div class="dropdown dropdown-hover{i%4 === 3 ? " dropdown-end" : ""}">
      <div tabindex="0" role="button">
        <Icon id={material.materials[0].id} ui="material" text={material.materials.map(e => e.count).reverse().join(", ")} dummyLoading />
      </div>
      <div tabindex="-1" class="dropdown-content bg-neutral rounded-lg w-max max-w-[calc(200%+0.75rem)] z-10 px-3 py-2 text-sm shadow-background">
        <div>{t(material.materials[0].id, "material")}</div>
        {#if material.materials[0].wikiId !== -1}
        <HoyoWiki class="text-link" {lang} wikiId={material.materials[0].wikiId} />
        {/if}
      </div>
    </div>
  {/each}
</div>
