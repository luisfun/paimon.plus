<script lang="ts">
// client:only="svelte"
import { TypedWorker } from '@codianz/typed-worker'
import Dialog from '@components/dialog.svelte'
import { avatarProps } from '@components/img-props'
import Svg from '@components/svg.svelte'
import avatarJson from '@game/avatar.json'
import { type Lang, useTranslations } from '@i18n/utils'
import { avatar as buildData } from '@manual/team-builder-data'
import { onMount } from 'svelte'

type ListData = { listName: string; list: string[] }

const LocalStorageKey = 'team-builder'

const en = useTranslations('en')
const avatar = buildData
  .map(a => {
    const find = avatarJson.find(e => en(e.id, 'avatar') === a.name)
    const newA = { ...a, avatarId: find?.id, qualityType: find?.qualityType }
    if (newA.elem || !find?.element) return newA
    newA.elem = elemMap[find.element]
    return newA
  })
  .map(a => ({ ...a, id: `${a.name}:${a.elem}` })) // :でnameとelemを合わせる

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)

onMount(() => {
  const lsData = JSON.parse(localStorage.getItem(LocalStorageKey) ?? '{}') as ListData[] | undefined
  // 古いバージョン（連想配列）の時は無視する
  if (Array.isArray(lsData)) listData = lsData
})
</script>

