<script lang="ts">
import { avatarProps } from '@components/img-props'
import Icon from './icon.svelte'
import type { Elem } from './types'

const { team }: { team: { avatarId: number | undefined; elem?: Elem; name?: string }[] } = $props()
</script>

{#each team as avatar}
  <div class="relative">
    <Icon {...avatarProps(avatar.avatarId ?? -1)} elem={avatar.name === 'Traveler' ? avatar.elem : undefined} />
  </div>
{/each}
