<script lang="ts">
import avatarJson from '@game/avatar.json'
import textMapJson from '@game/text-map.json'
type TextMap = { en: Record<number, string> }

export let id: number
export let skinId: number | undefined
export let active = false
export let select = false
export let onSelect: (id: number) => void

const dummySrc = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7'
let src = dummySrc
let alt = 'None'
let style = ''

const setSrc = (newSrc: string) => {
  if (typeof window === 'undefined') {
    src = newSrc
  } else {
    const img = new Image()
    img.onload = () => {
      src = newSrc
    }
    src = dummySrc
    img.src = newSrc
  }
}
$: {
  style = ''
  if (select) style += ' side-bg-select'
  if (active) style += ' side-bg-active'
  const a = avatarJson.find(e => e.id === id)
  if (a) {
    const key = a.costumes?.find(e => e.skinId === skinId)?.key || a.key
    setSrc(`/images/ui/UI_AvatarIcon_Side_${key}.webp`)
    alt = (textMapJson as TextMap).en[a.nameTextMapHash]
  }
}
</script>

<button class="relative flex-none w-[4.5rem] h-[4.5rem] p-[calc(.75rem-3px)] pointer" on:click={() => onSelect(id)}>
  <div class="side-bg absolute top-1/2 left-1/2 -transform-1/2 outline outline-[3px] w-12 h-12 rounded-full transition-all{style}" />
  <div class="absolute bottom-0 left-1/2 -transform-x-1/2 border border-b-2 transition-all {select ? "w-full side-bottom-color": "w-0 border-transparent"}" />
  <img loading="lazy" width=128 height=128 {src} {alt} class="absolute bottom-3 left-1/2 -transform-x-1/2 max-w-none transition-all {select ? "w-20" : "w-[4.6rem]"}" />
</button>

<style>
  .side-bg {
    outline-color: rgba(255, 255, 255, .2);
    background: rgba(0, 0, 0, .2);
  }
  .side-bg-active {
    outline-color: #96db8380;
  }
  .side-bg-select {
    outline-color: #4fccf099;
    background: #4fccf099;
    box-shadow: 0 0 1.5rem #4fccf080;
  }
  .side-bg-active.side-bg-select {
    outline-color: #96db83;
  }
  .side-bottom-color {
    border-color: #4fccf0;
  }
</style>
