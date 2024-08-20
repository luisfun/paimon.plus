<script lang="ts">
import Icon from '@components/icon.svelte'
import materialJson from '@game/material.json'

export let costs: {
  promoteCoin: number
  skillCoin?: number
  materials: Record<string, number | undefined>
}

let materials: {
  rank: number
  order: number
  materials: {
    id: number
    icon: string
    level: number
    count: number
  }[]
}[] = []
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
  } else {
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
}
$: {
  if (costs.skillCoin) costs.materials['104003'] = 419 // avatar exp
  else costs.materials["104013"] = 1 // weapon exp
  materials = []
  for (const id of Object.keys(costs.materials).map(e => Number(e))) {
    const data = materialJson.find(e => e.id === id)
    if (!data) continue
    const index = materials.findIndex(e => e.rank === data.rank)
    if (index === -1 || data.rank === 11101)
      // ボスを分離
      materials.push({
        rank: data.rank,
        order: order(data.rank !== 11101 ? data.rank : ~(data.rankLevel || 0)),
        materials: [{ id, icon: data.icon, level: data.rankLevel || 1, count: costs.materials[id] || 0 }],
      })
    else
      materials[index].materials.push({
        id,
        icon: data.icon,
        level: data.rankLevel || 1,
        count: costs.materials[id] || 0,
      })
  }
  for (const m of materials) m.materials.sort((a, b) => a.level - b.level)
  materials.sort((a, b) => a.order - b.order)
}
</script>

<div class="grid grid-cols-4 gap-3 mt-3">
  {#each materials as material}
    <Icon id={material.materials[0].id} ui="material" />
  {/each}
</div>

