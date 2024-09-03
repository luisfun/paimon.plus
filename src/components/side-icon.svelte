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
  if (select) style += ' side-select'
  if (active) style += ' side-active'
  const a = avatarJson.find(e => e.id === id)
  if (a) {
    const key = a.costumes?.find(e => e.skinId === skinId)?.key || a.key
    setSrc(`/images/ui/UI_AvatarIcon_Side_${key}.webp`)
    alt = (textMapJson as TextMap).en[a.nameTextMapHash]
  }
}
</script>

<button class="side-wrap{style}" on:click={_ => onSelect(id)}>
  <img loading="lazy" width=128 height=128 {src} {alt} class="side-img" />
</button>

<style>
  .side-wrap {
    position: relative;
    flex: 0 0 4.5rem;
    width: 4.5rem;
    height: 4.5rem;
    padding: calc(.75rem - 3px);
    cursor: pointer;
  }
  .side-wrap::before {
    position: absolute;
    transform: translate(-50%, -50%);
    content: "";
    border: solid 3px;
    border-color: rgba(255, 255, 255, .2);
    background: rgba(0, 0, 0, .2);
    width: calc(3rem + 6px);
    height: calc(3rem + 6px);
    border-radius: 9999px;
    transition: border-color .1s ease, background .1s ease, box-shadow .1s ease;
  }
  .side-active::before {
    border-color: #96db8380;
  }
  .side-select::before {
    border-color: #4fccf099;
    background: #4fccf099;
    box-shadow: 0 0 1.5rem #4fccf080;
  }
  .side-active.side-select::before {
    border-color: #96db83;
  }
  .side-wrap::after {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    display: block;
    border-bottom: solid 3px;
    border-color: transparent;
    transition: border-color .1s ease;
  } 
  .side-select::after {
    border-color: #4fccf0;
  }
  .side-img {
    position: absolute;
    bottom: .75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 4.6rem;
    transition: width .1s ease;
  }
  .side-select .side-img {
    max-width: none;
    width: 5rem;
  }
</style>
