<script lang="ts">
// client:only="svelte"
import { TypedWorker } from '@codianz/typed-worker'
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import Svg from '@components/svg.svelte'
import TeamBuilderInput from '@components/team-builder-input.svelte'
import type { avatar } from '@components/team-builder-utils'
import { type Lang, useTranslations } from '@i18n/utils'
import Icon from '../team-builder/icon.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

let list = $state<string[]>([])
let result = $state<typeof avatar>()
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-md md:max-w-full mx-auto">
  <div class="mb-auto">
  </div>
  <div class="mb-auto">
    <TeamBuilderInput {lang} bind:list />
  </div>
</div>
