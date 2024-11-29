<script lang="ts">
// client:only="svelte"
import Collapse from '@components/collapse.svelte'
import Dialog from '@components/dialog.svelte'
import ExternalA from '@components/external-a.svelte'
import Svg from '@components/svg.svelte'
import { type Lang, useTranslations } from '@i18n/utils'
import type { data } from './data'

const { lang, toolData }: { lang: Lang; toolData: (typeof data)[number] } = $props()
const t = useTranslations(lang)

let isHint = $state(true)
let subTemplate = $state(toolData.custom?.list[0])
let canvas: HTMLCanvasElement
let dialogs: HTMLDialogElement[] = []

const canvasClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLCanvasElement }) => {
  isHint = false
  // canvas
  const ctx = canvas.getContext('2d')
  const rect = e.currentTarget.getBoundingClientRect()
  const pX = Math.round(((e.clientX - rect.left) * canvas.width) / canvas.clientWidth)
  const pY = Math.round(((e.clientY - rect.top) * canvas.height) / canvas.clientHeight)
  const offset = [0, 0] //this._offset()
  if (toolData.modal && ctx)
    for (let i = 0; i < toolData.modal.length; i++) {
      const m = toolData.modal[i]
      for (let j = 0; j * 4 < m.clickArea.length; j++) {
        const x = m.clickArea[0 + j * 4]
        const y = m.clickArea[1 + j * 4]
        const w = m.clickArea[2 + j * 4] - x
        const h = m.clickArea[3 + j * 4] - y
        //画面外はスキップ
        if (x + offset[0] < 0 || y + offset[0] < 0) continue
        ctx.beginPath()
        ctx.rect(x + offset[0], y + offset[1], w, h)
        if (ctx.isPointInPath(pX, pY)) {
          dialogs[i].showModal()
          break
        }
      }
    }
}
</script>

<div class="text-center text-xl duration-200 overflow-hidden" class:h-7={isHint} class:h-0={!isHint}>{t("player-card.hint")}</div>
<div class="relative mx-auto max-w-full" class:max-w-lg={toolData.vertical}>
  <canvas
    class="w-full"
    width={toolData.canvas?.w}
    height={toolData.canvas?.h}
    onclick={canvasClick}
    bind:this={canvas}
  ></canvas>
  {#each toolData.pasteImage ?? [] as pi, i}
    <div class="absolute"></div>
  {/each}
</div>
{#each toolData.modal ?? [] as mo, i}
  <Dialog bind:dialog={dialogs[i]}>
    aa{i}
  </Dialog>
{/each}
{#each toolData.pasteImage ?? [] as pi, i}
  <Dialog bind:dialog={dialogs[i + (toolData.modal?.length ?? 0)]}>
    aa{i}
  </Dialog>
{/each}

<div class="grid">
  <div>
    {#if toolData.toolId === "fukafukafuka29"}

    {/if}
  </div>
  <div></div>
</div>
