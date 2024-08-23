// MITライセンスでモジュール化したい

type SxSize = string | number // string -> __%, auto のみ認識 その他すべてauto扱い
type MarginSize = number | 'auto'
type SxBorder = { width: number; color: string; offset?: number }
type SxProps = {
  display?: 'block' | 'flex'
  zIndex?: number
  width?: SxSize
  height?: SxSize
  //aspectRatio?: number // 実装が面倒そう
  m?: SxSize // 1パラメータのみ（一旦）
  mt?: MarginSize
  mr?: MarginSize
  mb?: MarginSize
  ml?: MarginSize
  p?: SxSize // 1パラメータのみ（一旦）
  pt?: number
  pr?: number
  pb?: number
  pl?: number
  position?: 'absolute'
  fontSize?: SxSize
  color?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundBlendMode?: GlobalCompositeOperation
  //backgroundRadialGradient?: string[]
  objectFit?: 'contain' | 'cover' // imgタグ と bgImage要素
  overflow?: 'hidden'
  borderRadius?: SxSize // 1パラメータのみ（一旦）
  textAlign?: 'left' | 'right' | 'center'
  border?: SxBorder | SxBorder[]
  shadow?: { size: number; color?: string; for?: number } // img, text only
  clipPathLine?: SxSize[]
  opacity?: number // 0-1 img, text
}
type CanvasFunc = (ctx: CanvasRenderingContext2D, width: number, height: number) => Promise<void>
type Props = {
  sx?: SxProps
  src?: string
  canvasFunc?: CanvasFunc
  canvasId?: string
} | null
export type Child =
  | string
  | number
  | {
      nodeName: string
      props: Props
      children: Child[]
    }
  | null
  | undefined
type Position = {
  x: number
  y: number
  z: number
  w: number
  h: number
}
type Structure = {
  pos: Position
  node: Child
  inner: Structure[] | undefined
}
type Hidden = {
  pos: Position
  radius: SxSize | undefined
}
type ClipPath = {
  pos: Position
  path: SxSize[]
}

const XCanvas = class {
  private ctx: CanvasRenderingContext2D
  private canvasWidth: number
  private canvasHeight: number
  private images: { src: string; image: HTMLImageElement }[]
  private imageLoadList: string[]
  private fontFamily: string
  private fontSize: number
  private fontColor: string
  private structure: Structure | undefined

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.canvasWidth = width
    this.canvasHeight = height
    this.images = []
    this.imageLoadList = []
    this.fontFamily = 'sans-serif'
    this.fontSize = 10
    this.fontColor = '#000000'
    this.structure = undefined
  }

  applyWH(width: number, height: number) {
    this.canvasWidth = width
    this.canvasHeight = height
  }

  applyFont(fontFamily: string, fontSize: number, fontColor: string) {
    this.fontFamily = fontFamily
    this.fontSize = fontSize
    this.fontColor = fontColor
  }

  create(nodeName: string, props: Props, ...children: Child[]) {
    return { nodeName, props, children }
  }

  main(props: Props, ...children: Child[]) {
    // 構造解析
    const pos = { x: 0, y: 0, z: 0, w: this.canvasWidth, h: this.canvasHeight }
    const node = { nodeName: 'div', props, children }
    const inner = recuStructure(pos, node)
    this.structure = { pos, node, inner }
  }

  /**
   * Canvas Rendering
   * @param document Font Check.
   * @param delay Delay Render. Recommend: iOS: 10~100.
   */
  render(document: Document, delay?: boolean | number) {
    const renderFunc = () => {
      document.fonts.ready.then(() => this.draw()) // fontを読み終えたら描写 & pre-render
      setTimeout(() => this.imageLoader(), typeof delay === 'number' ? delay : 0)
    }
    if (!delay) renderFunc()
    else setTimeout(() => renderFunc(), typeof delay === 'number' ? delay : 0)
  }

  /**
   * render func
   */

  private imageLoader(structure?: Structure, recursive?: boolean) {
    // 画像のロードのみ 実際の描写は draw
    const s = recursive ? structure : this.structure
    if (!s) return
    if (typeof s.node !== 'object' || !s.node) return
    if (s.node.nodeName === 'img' && s.node.props?.src) this.imageLoad(s.node.props.src)
    if (s.node.props?.sx?.backgroundImage) this.imageLoad(s.node.props.sx.backgroundImage)
    if (s.node.nodeName === 'canvas' && s.node.props?.canvasFunc)
      this.innerCanvasLoad(s.node.props?.canvasId || 'canvas', s.node.props.canvasFunc, s.pos)
    for (const e of s.inner || []) this.imageLoader(e, true)
  }

  private imageLoad(src: string) {
    if (this.imageLoadList.includes(src)) return // 重複回避
    this.imageLoadList.push(src)
    const image = new Image()
    image.onload = () => {
      this.images.push({ src, image })
      if (this.imageLoadList.length === this.images.length) this.draw() // 画像を読み込み終えたら描写
    }
    image.src = src
  }

  private innerCanvasLoad(id: string, func: CanvasFunc, pos: Position) {
    if (this.imageLoadList.includes(id)) return // 重複回避
    this.imageLoadList.push(id)
    const width = Math.round(pos.w)
    const height = Math.round(pos.h)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return // 実質エラー
    func(ctx, width, height).then(() => {
      // 外部の処理
      canvas.toBlob(blob => {
        // blob生成
        if (!blob) return // 実質エラー
        const image = new Image() // image生成
        const url = URL.createObjectURL(blob)
        image.onload = () => {
          this.images.push({ src: id, image })
          if (this.imageLoadList.length === this.images.length) this.draw() // 画像を読み込み終えたら描写
          URL.revokeObjectURL(url) // blob開放
        }
        image.src = url
      })
    })
  }

  private draw(structure?: Structure, recursive?: boolean) {
    // 実際の描写
    const s = recursive ? structure : this.structure
    if (!s) return
    if (typeof s.node !== 'object' || !s.node) return
    const h = s.node.props?.sx?.overflow === 'hidden' ? { pos: s.pos, radius: s.node.props.sx.borderRadius } : undefined
    if (h) this.ctxClip(h)
    const clipPath = s.node.props?.sx?.clipPathLine ? { pos: s.pos, path: s.node.props.sx.clipPathLine } : undefined
    if (clipPath) this.ctxClipPath(clipPath)
    if (s.node.props?.sx) this.backgroundDraw(s.pos, s.node.props.sx)
    if (s.node.nodeName === 'img') this.imageDraw(s.pos, s.node.props?.src || '', s.node.props?.sx)
    if (s.node.nodeName === 'canvas') this.imageDraw(s.pos, s.node.props?.canvasId || 'canvas', s.node.props?.sx)
    if (s.node.nodeName === 'div') {
      if (typeof s.node.children[0] === 'string' || typeof s.node.children[0] === 'number') {
        this.textDraw(s.pos, s.node.children[0], s.node.props?.sx)
      }
    }
    for (const e of s.inner || []) this.draw(e, true)
    if (clipPath) this.ctx.restore()
    if (h) this.ctx.restore()
  }

  private textDraw(pos: Position, text: string | number, sx?: SxProps) {
    const size = !sx?.fontSize
      ? this.fontSize
      : typeof sx.fontSize === 'number'
        ? sx.fontSize
        : sx.fontSize.slice(-3) === 'rem'
          ? this.fontSize * Number(sx.fontSize.slice(0, -3))
          : this.fontSize // 実質エラー
    const align = sx?.textAlign || 'left'
    const x = align === 'left' ? pos.x : align === 'right' ? pos.x + pos.w : pos.x + pos.w / 2
    this.ctx.fillStyle = sx?.color || this.fontColor
    this.ctx.font = `${size}px ${this.fontFamily}`
    this.ctx.textAlign = align
    this.ctx.textBaseline = 'middle'
    if (sx?.opacity) this.ctx.globalAlpha = sx.opacity
    if (sx?.shadow) {
      this.ctx.shadowBlur = sx.shadow.size
      this.ctx.shadowColor = sx.shadow.color || '#000'
      for (let i = 0; i < (sx.shadow?.for || 1); i++) {
        this.ctx.fillText(text.toString(), x, pos.y + pos.h / 2)
      }
      this.ctx.shadowBlur = 0
    } else {
      this.ctx.fillText(text.toString(), x, pos.y + pos.h / 2)
    }
    if (sx?.opacity) this.ctx.globalAlpha = 1
  }

  private imageDraw(pos: Position, src: string, sx?: SxProps) {
    const image = this.images.find(e => e.src === src)?.image
    if (!image) return // error or 未ロード
    if (sx?.opacity) this.ctx.globalAlpha = sx.opacity
    if (sx?.shadow) {
      this.ctx.shadowBlur = sx.shadow.size
      this.ctx.shadowColor = sx.shadow.color || '#000'
      for (let i = 0; i < (sx.shadow?.for || 1); i++) {
        this.ctx.drawImage(image, ...fixImagePos(image, pos, sx))
      }
      this.ctx.shadowBlur = 0
    } else {
      this.ctx.drawImage(image, ...fixImagePos(image, pos, sx))
    }
    if (sx?.opacity) this.ctx.globalAlpha = 1
  }

  private backgroundDraw(pos: Position, sx: SxProps) {
    if (sx.backgroundColor) {
      this.ctx.fillStyle = sx.backgroundColor
      this.ctx.fillRect(pos.x, pos.y, pos.w, pos.h)
    }
    /*
    if(sx.backgroundRadialGradient) {
      const sxGrad = sx.backgroundRadialGradient
      const sxLen = sxGrad.length - 1
      if(sxLen===0) return
      const cx = pos.x + pos.w/2, cy = pos.y + pos.h/2
      const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, pos.w<pos.h?pos.w:pos.h)
      sxGrad.forEach((color,i)=>{
        grad.addColorStop(i/sxLen/2, color) // 2で割らないとなぜかオーバーシュートする
      })
      this.ctx.fillStyle = grad
      this.ctx.fillRect(pos.x, pos.y, pos.w, pos.h)
    }
    */
    if (sx.backgroundBlendMode) this.ctx.globalCompositeOperation = sx.backgroundBlendMode
    if (sx.backgroundImage) this.imageDraw(pos, sx.backgroundImage, { objectFit: sx.objectFit })
    if (sx.backgroundBlendMode) this.ctx.globalCompositeOperation = 'source-over'
    if (sx.border) this.borderDraw(pos, sx.borderRadius, sx.border)
  }

  private borderDraw(pos: Position, radius: SxSize | undefined, border: SxBorder | SxBorder[]) {
    const borderArr = Array.isArray(border) ? border : [border]
    const rad = num2num(radius) || (per2num(radius) || 0) * (pos.w < pos.h ? pos.w : pos.h)
    for (const b of borderArr) {
      const bo = b.offset || 0
      const bw = b.width / 2
      const p = {
        x: pos.x + bo + bw,
        y: pos.y + bo + bw,
        w: pos.w - bo * 2 - bw * 2,
        h: pos.h - bo * 2 - bw * 2,
        z: pos.z,
      }
      const tmpRad = rad - bo - bw
      const r = 0 < tmpRad ? tmpRad : 0
      this.ctx.lineWidth = b.width
      this.ctx.strokeStyle = b.color
      this.ctxBoxPath(p, r)
      this.ctx.stroke()
    }
  }

  private ctxClip(hidden: Hidden) {
    const rad =
      num2num(hidden.radius) ||
      (per2num(hidden.radius) || 0) * (hidden.pos.w < hidden.pos.h ? hidden.pos.w : hidden.pos.h)
    this.ctx.save()
    this.ctxBoxPath(hidden.pos, rad)
    this.ctx.clip()
  }

  private ctxBoxPath(pos: Position, rad: number) {
    this.ctx.beginPath() // 左上から時計回り
    this.ctx.moveTo(pos.x + rad, pos.y)
    this.ctx.lineTo(pos.x + pos.w - rad, pos.y)
    this.ctx.arcTo(pos.x + pos.w, pos.y, pos.x + pos.w, pos.y + pos.h, rad)
    this.ctx.lineTo(pos.x + pos.w, pos.y + pos.h - rad)
    this.ctx.arcTo(pos.x + pos.w, pos.y + pos.h, pos.x, pos.y + pos.h, rad)
    this.ctx.lineTo(pos.x + rad, pos.y + pos.h)
    this.ctx.arcTo(pos.x, pos.y + pos.h, pos.x, pos.y, rad)
    this.ctx.lineTo(pos.x, pos.y + rad)
    this.ctx.arcTo(pos.x, pos.y, pos.x + pos.w, pos.y, rad)
    this.ctx.closePath()
  }

  private ctxClipPath(clipPath: ClipPath) {
    const fixPer = (p: SxSize, x: number, w: number) => {
      if (typeof p === 'number') return x + p
      const perNum = per2num(p)
      if (perNum) return x + w * perNum
      return x
    }
    const pos = clipPath.pos
    const path = clipPath.path.map((p, i) => (i % 2 === 0 ? fixPer(p, pos.x, pos.w) : fixPer(p, pos.y, pos.h)))
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(path[0], path[1])
    for (let i = 2; i < path.length; i += 2) {
      this.ctx.lineTo(path[i], path[i + 1])
    }
    this.ctx.lineTo(path[0], path[1])
    this.ctx.closePath()
    this.ctx.clip()
  }
}
export default XCanvas

/**
 * main func
 */

const recuStructure = (pos: Position, node: Child) => {
  const posArr = calcChildrenPos(pos, node)
  if (typeof node !== 'object' || !node || !posArr) return undefined // end node
  let re: Structure[] = []
  re = node.children.map((child, i) => ({
    pos: posArr[i],
    node: child,
    inner: undefined,
  }))
  for (const e of re) e.inner = recuStructure(e.pos, e.node)
  return re
}

const calcChildrenPos = (pos: Position, node: Child) => {
  if (typeof node !== 'object' || !node) return undefined // end node
  const p = node.props?.sx?.p ? Number(node.props.sx.p) : undefined
  const pt = node.props?.sx?.pt || p || 0
  const pr = node.props?.sx?.pr || p || 0
  const pb = node.props?.sx?.pb || p || 0
  const pl = node.props?.sx?.pl || p || 0
  const sxArr = node.children.map(child => {
    if (typeof child !== 'object' || !child)
      return { z: 0, w: 'auto', h: 'auto', mt: 'auto', mr: 'auto', mb: 'auto', ml: 'auto', pos: undefined } as const
    const m = child.props?.sx?.m != null ? Number(child.props.sx.m) : 'auto'
    return {
      z: child.props?.sx?.zIndex || 0,
      w: child.props?.sx?.width || 'auto',
      h: child.props?.sx?.height || 'auto',
      mt: child.props?.sx?.mt != null ? child.props.sx.mt : m,
      mr: child.props?.sx?.mr != null ? child.props.sx.mr : m,
      mb: child.props?.sx?.mb != null ? child.props.sx.mb : m,
      ml: child.props?.sx?.ml != null ? child.props.sx.ml : m,
      pos: child.props?.sx?.position,
    }
  })
  if (node.props?.sx?.display === 'flex')
    // 横並び
    return calcPos({ ...pos, pt, pr, pb, pl }, sxArr, 'row')
  // 縦並び
  return calcPos({ ...pos, pt, pr, pb, pl }, sxArr)
}

type CalcOuter = Position & { pt: number; pr: number; pb: number; pl: number }
type CalcInner = {
  z: number
  w: SxSize
  h: SxSize
  mt: MarginSize
  mr: MarginSize
  mb: MarginSize
  ml: MarginSize
  pos: 'absolute' | undefined
}
const calcPos = (outer: CalcOuter, innerArr: CalcInner[], direction?: `column` | `row`) => {
  const isRow = direction === 'row'
  const x = outer.x + outer.pl
  const y = outer.y + outer.pt
  const w = outer.w - outer.pl - outer.pr
  const h = outer.h - outer.pt - outer.pb
  const xPos = calcPosUni(
    x,
    w,
    innerArr.map(e => ({ len: e.w, ms: e.ml, me: e.mr, pos: isRow ? e.pos : 'absolute' })),
  )
  const yPos = calcPosUni(
    y,
    h,
    innerArr.map(e => ({ len: e.h, ms: e.mt, me: e.mb, pos: isRow ? 'absolute' : e.pos })),
  )
  return innerArr.map((e, i) => ({
    x: xPos[i].start,
    y: yPos[i].start,
    z: e.z,
    w: xPos[i].len,
    h: yPos[i].len,
  }))
}

type CalcUniInner = { len: SxSize; ms: MarginSize; me: MarginSize; pos: 'absolute' | undefined }
const calcPosUni = (x: number, w: number, innerArr: CalcUniInner[]) => {
  let sumNum = 0
  let sumPer = 0
  for (const inner of innerArr) {
    if (inner.pos === 'absolute') continue
    for (const size of [inner.len, inner.ms, inner.me]) {
      const sizeNum = num2num(size) || 0
      const sizePer = per2num(size) || 0
      if (sizeNum) sumNum += sizeNum
      if (sizePer) sumPer += sizePer
    }
  }
  let tmp = x

  // over
  if (w < sumNum || (w === sumNum && 0 < sumPer)) {
    return innerArr.map(inner => {
      if (inner.pos === 'absolute') return calcPosAbsolute(tmp, w, inner) // absolute
      const len = num2num(inner.len) || (per2num(inner.len) || 1) * w
      const ms = num2num(inner.ms) || 0
      const me = num2num(inner.me) || 0
      const start = tmp + ms
      if (inner.pos !== 'absolute') tmp += len + ms + me
      return { start, len }
    })
  }

  // compress
  const remainRate = (w - sumNum) / w
  if (remainRate < sumPer) {
    const compRate = remainRate / sumPer
    return innerArr.map(inner => {
      if (inner.pos === 'absolute') return calcPosAbsolute(tmp, w, inner) // absolute
      const len = num2num(inner.len) || (per2num(inner.len) || 1) * w * (inner.pos !== 'absolute' ? compRate : 1)
      const ms = num2num(inner.ms) || 0
      const me = num2num(inner.me) || 0
      const start = tmp + ms
      if (inner.pos !== 'absolute') tmp += len + ms + me
      return { start, len }
    })
  }

  // keep
  let lenAutoCount = 0
  let mAutoCount = 0
  for (const inner of innerArr) {
    if (inner.pos === 'absolute') continue
    if (inner.len === 'auto') lenAutoCount++
    if (inner.ms === 'auto') mAutoCount++
    if (inner.me === 'auto') mAutoCount++
  }
  return innerArr.map(inner => {
    if (inner.pos === 'absolute') return calcPosAbsolute(tmp, w, inner) // absolute
    if (lenAutoCount > 0) {
      // len auto
      const lenNum = num2num(inner.len)
      const lenPer = per2num(inner.len)
      const len = lenNum != null ? lenNum : lenPer != null ? lenPer * w : (w - sumNum - sumPer * w) / lenAutoCount
      const ms = num2num(inner.ms) || 0
      const me = num2num(inner.me) || 0
      const start = tmp + ms
      if (inner.pos !== 'absolute') tmp += len + ms + me
      return { start, len }
    }
    if (mAutoCount > 0) {
      // m auto
      const len = num2num(inner.len) || (per2num(inner.len) || 1) * w
      const msNum = num2num(inner.ms)
      const meNum = num2num(inner.me)
      const ms = msNum != null ? msNum : (w - sumNum - sumPer * w) / mAutoCount
      const me = meNum != null ? meNum : (w - sumNum - sumPer * w) / mAutoCount
      const start = tmp + ms
      if (inner.pos !== 'absolute') tmp += len + ms + me
      return { start, len }
    }
    // non auto
    const len = num2num(inner.len) || (per2num(inner.len) || 1) * w
    const ms = num2num(inner.ms) || 0
    const me = num2num(inner.me) || 0
    const start = tmp + ms
    if (inner.pos !== 'absolute') tmp += len + ms + me
    return { start, len }
  })
}

const num2num = (num: unknown) => (typeof num === 'number' ? num : undefined)
const per2num = (per: unknown) =>
  typeof per === 'string' && per.slice(-1)[0] === '%' ? Number(per.slice(0, -1)) / 100 : undefined
/*
const rem2num = <T>(value: T, fontSize: number) => {
  if(typeof value===`string` && value.slice(-3)===`rem`) return fontSize * Number(value.slice(0,-3))
  else return value
}
*/

const calcPosAbsolute = (x: number, w: number, inner: CalcUniInner) => {
  if (inner.len === 'auto') {
    const ms = num2num(inner.ms) || 0
    const me = num2num(inner.me) || 0
    const start = x + ms
    const len = w - ms - me
    return { start, len }
  }
  const len = num2num(inner.len) || (per2num(inner.len) || 1) * w
  const mAutoCount = (inner.ms === 'auto' ? 1 : 0) + (inner.me === 'auto' ? 1 : 0) // 0,1,2
  const me = num2num(inner.me) || 0
  const msNum = num2num(inner.ms)
  const ms = msNum != null ? msNum : (w - len - me) / mAutoCount
  const start = x + ms
  return { start, len }
}

/**
 * render func
 */

const fixImagePos = (image: HTMLImageElement, pos: Position, sx?: SxProps) => {
  const w = image.width
  const h = image.height
  const posRatio = pos.w / pos.h
  const imgRatio = w / h
  let fit: 'x' | 'y' | undefined = undefined
  if (sx?.objectFit === 'cover') {
    // 領域いっぱい（アスペクト比を維持）
    if (posRatio < imgRatio) fit = 'y'
    if (imgRatio < posRatio) fit = 'x'
  } else {
    // 領域内（アスペクト比を維持）
    if (posRatio < imgRatio) fit = 'x'
    if (imgRatio < posRatio) fit = 'y'
  }
  if (fit === 'x') {
    const img = { w: pos.w, h: (h * pos.w) / w }
    const posY = pos.y + pos.h / 2 - img.h / 2
    return [0, 0, w, h, pos.x, posY, img.w, img.h] as const
  }
  const img = { w: (w * pos.h) / h, h: pos.h }
  const posX = pos.x + pos.w / 2 - img.w / 2
  return [0, 0, w, h, posX, pos.y, img.w, img.h] as const
}

/**
 * Same as XCanvas.create()
 */

export const xCreate = (nodeName: string, props: Props, ...children: Child[]) => {
  return { nodeName, props, children }
}

/**
 * 画像の保存 or 新しいタブで開く
 * @param canvas HTMLCanvasElement
 * @param fileName 画像ファイル名．未定義：新しいタブで開く
 */

export const imageDownload = async (canvas: HTMLCanvasElement | undefined, fileName?: string) => {
  const a = document.createElement('a')
  const blob: Blob | null = await new Promise(resolve => canvas?.toBlob(resolve, 'image/jpeg', 0.99))
  if (blob) a.href = URL.createObjectURL(blob)
  else a.href = '' // error
  if (fileName)
    a.download = `${fileName}.jpg` // download
  else a.target = '_blank' // new tab
  a.click()
}

export const imageOnload: (src: string) => Promise<HTMLImageElement> = src => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = e => reject(e)
    image.src = src
  })
}

/**
 * 書き味
 * React.useEffect(()=>{
 *  const ctx = ...
 *  const xc = new XCanvas(ctx, w, h)
 *  const c = xc.create
 *  xc.main(null,
 *    c("box",{},child),
 *    c("box",{},child),
 *  )
 *  xc.render()
 * })
 */
