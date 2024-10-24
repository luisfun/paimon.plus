<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo, ReliquaryRemap, WeaponRemap } from '@components/api'
import { avatarRemap } from '@components/api'
import { useTranslations } from '@i18n/utils'
import type { Lang } from '@i18n/utils'
import { XCanvas, div, img } from '@luisfun/x-canvas'
import { type defineSub, defineToProps } from './utils'

const {
  lang,
  avatarInfo,
  subMarks,
}: {
  lang: Lang
  avatarInfo: AvatarInfo
  subMarks: (typeof defineSub)[number][]
} = $props()
const t = useTranslations(lang)

const a = $derived(avatarRemap(avatarInfo))
const subMarkProps = $derived(defineToProps(subMarks))
let canvas: HTMLCanvasElement
let xc: XCanvas

const getSubRollMark = (markProps: string[], reliquarySub: ReliquaryRemap['flat']['reliquarySubstats']) => {
  const rollMap = reliquarySub?.map(sub => ({ appendPropId: sub.appendPropId, roll: sub.rolls.length }))
  if (!rollMap) return 0
  return rollMap.filter(e => markProps.includes(e.appendPropId)).reduce((sum, e) => sum + e.roll, 0)
}

const isIOS = () => {
  if (typeof window === 'undefined') return false
  if (navigator.userAgent.match(/iPhone|iPad|iPod.+Mobile/)) return true
  return false
}
const srcUrl = (name: string | null | undefined, folder?: 'ui' | 'element' | 'card-assets', type?: 'jpg') =>
  `/images${folder ? `/${folder}` : ''}/${name ? name : 'Empty'}.${type ? type : 'webp'}`
const u = {
  elementMap: {
    Rock: '#bb9f4b',
    Wind: '#52B0B1',
    Ice: '#46A8BA',
    Water: '#84A1C6',
    Electric: '#9876AD',
    Fire: '#BA8C83',
    Grass: '#57A45C', // #2D8E34
    None: '#94a0a7',
  } as Record<string, string>,
  equipTypes: ['EQUIP_BRACER', 'EQUIP_NECKLACE', 'EQUIP_SHOES', 'EQUIP_RING', 'EQUIP_DRESS'],
  bga: '#0005',
  bga2: '#0007',
  bgas: '#282828dd',
  lightGreen: '#82ff9a',
}
const getConsPos = (i: number) => {
  const r = 186
  const th = 15
  const cy = -22
  const cx = -42 // 調節項目
  const rad = ((2 * Math.PI) / 360) * (th * 2.5 - th * i)
  const base = {
    x: Math.cos(rad) * r,
    y: Math.sin(rad) * r,
  }
  return { mt: -base.y + cy, ml: base.x + cx }
}
const elementColor = (element: string | null | undefined, light?: boolean) => {
  const colorLight: Record<string, string> = {
    Fire: 'rgba(255,102,64,.65)',
    Ice: 'rgba(122,242,242,.65)',
    Water: 'rgba(0,192,255,.65)',
    Electric: 'rgba(204,128,255,.65)',
    Wind: 'rgba(51,215,160,.65)',
    Rock: 'rgba(255,176,13,.65)',
    Grass: 'rgba(51,215,160,.65)',
    None: 'rgba(192,192,192,.65)',
  }
  const colorDark: Record<string, string> = {
    Fire: '#3d1818',
    Ice: '#09375c',
    Water: '#15315c',
    Electric: '#2a1a67',
    Wind: '#153434',
    Rock: '#3d3015',
    Grass: '#183d12',
    None: '#333',
  }
  return light ? colorLight[element || ''] || colorLight.None : colorDark[element || ''] || colorDark.None
}
const sxMiniPaper = {
  position: 'absolute',
  mr: 2,
  mb: 2,
  textAlign: 'center',
  backgroundColor: u.bgas,
  borderRadius: 8,
  overflow: 'hidden',
} as const

$effect(() => {
  //console.log('effect')
  xc ??= new XCanvas(canvas, '/workers', {
    canvasWidth: 1920,
    canvasHeight: 480,
    fontFace: lang === 'en' ? ['Genshin', '/fonts/genshin.woff2'] : ['GenshinJa', '/fonts/genshin-ja.woff2'],
    fontSize: 24,
    fontColor: '#fff',
    //debugMode: true,
  })
  const weapon: WeaponRemap[] = []
  const artifactList: ReliquaryRemap[] = []
  for (const e of a.equipList || []) {
    if ('weapon' in e) weapon.push(e as WeaponRemap)
    if ('reliquary' in e) artifactList.push(e as ReliquaryRemap)
  }
  xc.render(
    {
      backgroundColor: u.elementMap[a.element || ''],
      backgroundImage: srcUrl('overlay', 'card-assets', 'jpg'),
      backgroundBlendMode: 'overlay',
      // @ts-expect-error
      objectFit: 'cover',
      overflow: 'hidden',
    },
    div(
      { display: 'flex', p: 8 },
      // キャラ情報
      div(
        { w: '23%', p: 8 },
        // キャラ名と元素
        div(
          { display: 'flex', h: 36, mt: 2, ml: 2 },
          div(
            { w: 42, h: 42, m: -3, backgroundColor: u.bga, overflow: 'hidden', borderRadius: '50%' },
            img({ m: 1, src: srcUrl(a.element, 'element') }),
          ),
          div({ ml: 12, fontSize: '1.2rem', shadow: { size: 16 } }, t(a.avatarId, 'avatar')),
        ),
        div(
          { h: '100%' },
          // スキル
          div(
            { position: 'absolute', w: '27%', ml: 2, mt: 14, mb: 4 },
            ...(a.skills?.map(skill =>
              div(
                { w: 66, h: 66 },
                img({ position: 'absolute', m: -18, opacity: 0.75, src: srcUrl('TalentBack', 'card-assets') }),
                img({ w: 66, h: 66, src: srcUrl(skill.icon, 'ui') }),
                div(
                  {
                    position: 'absolute',
                    w: 38,
                    h: 32,
                    mb: 0,
                    mr: -24,
                    textAlign: 'center',
                    backgroundColor: '#282828dd',
                    borderRadius: 6,
                    overflow: 'hidden',
                    color: skill.add !== 0 ? 'cyan' : undefined,
                  },
                  skill.level + skill.add,
                ),
              ),
            ) || []),
          ),
          // キャラクターicon
          div(
            { position: 'absolute', ml: 2 },
            div({ h: 240, mt: 0 }, img({ h: '100%', mt: -42, shadow: { size: 16 }, src: srcUrl(a.sideIcon, 'ui') })),
            div({ mt: -38, fontSize: '1.2rem', textAlign: 'center', shadow: { size: 16, for: 2 } }, `Lv.${a.level}`),
          ),
          // キャラ凸
          div(
            { position: 'absolute', w: 1, h: 1 },
            ...a.talentIcons.map((cons, i) =>
              div(
                {
                  position: 'absolute',
                  ...getConsPos(i),
                  w: 52,
                  h: 52,
                  borderRadius: '50%',
                  border: cons.unlock ? { width: 3, color: elementColor(a.element, true) } : undefined,
                },
                div(
                  {
                    position: 'absolute',
                    m: 3,
                    backgroundColor: u.bga2,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: { width: 2, color: cons.unlock ? '#fff' : '#888' },
                  },
                  cons.unlock
                    ? img({ src: srcUrl(cons.icon, 'ui') })
                    : img({ m: -12, opacity: 0.8, src: srcUrl('consLock', 'card-assets') }),
                ),
              ),
            ),
          ),
        ),
        div(
          { display: 'flex', h: '53%', mt: 14 },
          // weapon
          !weapon[0]
            ? div({ ml: 10, mr: 10 })
            : div(
                { ml: 10, mr: 10 },
                img({ position: 'absolute', m: 2, shadow: { size: 16 }, src: srcUrl(weapon[0].flat.icon, 'ui') }),
                weapon[0].weapon.affixMap &&
                  div(
                    { ...sxMiniPaper, w: 48, h: 38, fontSize: '1.2rem' },
                    `R${Object.values(weapon[0].weapon.affixMap)[0] + 1}`,
                  ),
              ),
          // artifact set
          div(
            {},
            // 1つのとき
            a.reliquarySets[0] && !a.reliquarySets[1]
              ? div(
                  {},
                  img({
                    position: 'absolute',
                    m: -4,
                    shadow: { size: 16 },
                    src: srcUrl(a.reliquarySets[0].icon, 'ui'),
                  }),
                  div({ ...sxMiniPaper, w: 42, h: 38, fontSize: '1.2rem' }, a.reliquarySets[0].count),
                )
              : // 2つのとき
                a.reliquarySets[0] && a.reliquarySets[1]
                ? div(
                    {},
                    div(
                      { position: 'absolute', clipPathLine: [0, 0, '100%', 0, '100%', '100%'] },
                      div(
                        { mt: 0, mr: 0, w: '70%', h: '70%' },
                        img({
                          position: 'absolute',
                          m: -4,
                          shadow: { size: 12 },
                          src: srcUrl(a.reliquarySets[0].icon, 'ui'),
                        }),
                        div({ ...sxMiniPaper, w: 36, h: 32 }, a.reliquarySets[0].count),
                      ),
                    ),
                    div(
                      { position: 'absolute', clipPathLine: [0, 0, '100%', '100%', 0, '100%'] },
                      div(
                        { mb: 0, ml: 0, w: '70%', h: '70%' },
                        img({
                          position: 'absolute',
                          m: -4,
                          shadow: { size: 12 },
                          src: srcUrl(a.reliquarySets[1].icon, 'ui'),
                        }),
                        div({ ...sxMiniPaper, w: 36, h: 32 }, a.reliquarySets[1].count),
                      ),
                    ),
                  )
                : undefined,
          ),
        ),
      ),
      // ステータス
      div(
        { p: 8, w: '27%' },
        div(
          { p: 8, backgroundColor: u.bga, overflow: 'hidden', borderRadius: 16 },
          ...a.stats
            .filter(e => e.icon !== '')
            .map(stat =>
              div(
                { ml: 14, mr: 14, h: 24, display: 'flex' },
                // ステータス名
                div(
                  { display: 'flex' },
                  img({ ml: -4, mr: 10, w: 32, h: 32, src: srcUrl(stat.icon, 'card-assets') }),
                  // @ts-expect-error
                  div({ ml: 0 }, t(stat.type === 'CRIT DMG' ? 'CRIT Damage' : stat.type)),
                ),
                // ステータス値 詳細
                stat.display.base &&
                  stat.display.add &&
                  div(
                    { position: 'absolute', display: 'flex', mb: 0, h: '.75rem' },
                    div({ w: '58%', mr: 0, fontSize: '.75rem', textAlign: 'right' }, stat.display.base),
                    div({ w: '42%', ml: 8, fontSize: '.75rem', color: u.lightGreen }, `+${stat.display.add}`),
                  ),
                // ステータス値
                div({ h: 24, mr: 0 }, stat.display.main),
              ),
            ),
        ),
      ),
      // 聖遺物
      ...u.equipTypes.map(equipType => {
        const artifact = artifactList.find(e => e.flat.equipType === equipType)
        return div(
          { p: 8, w: '10%' },
          artifact &&
            div(
              { backgroundColor: u.bga, overflow: 'hidden', borderRadius: 16 },
              // 聖遺物画像
              img({ position: 'absolute', mt: -15, ml: -5, w: 160, h: 160, src: srcUrl(artifact.flat.icon, 'ui') }),
              // メインステータス
              div(
                { mt: 70, mr: 16, h: 98 },
                img({ mr: -6, w: 42, h: 42, src: srcUrl(artifact.flat.reliquaryMainstat.mainPropId, 'card-assets') }),
                div(
                  { w: '100%', textAlign: 'right', fontSize: '1.45rem', h: 24 * 1.45 },
                  artifact.flat.reliquaryMainstat.display,
                ),
              ),
              // サブステータス
              artifact.flat.reliquarySubstats &&
                div(
                  { mt: 8, mb: 8 },
                  ...artifact.flat.reliquarySubstats.map(sub =>
                    div(
                      { ml: 20, mr: 20, mt: 0, display: 'flex', h: '25%' },
                      img({ ml: 0, w: 32, h: 32, src: srcUrl(sub.appendPropId, 'card-assets') }),
                      div(
                        { mr: 0 },
                        sub.rolls &&
                          div(
                            {
                              position: 'absolute',
                              mb: 0,
                              mr: 8,
                              h: 24 * 1.45,
                              textAlign: 'right',
                              fontSize: '1.45rem',
                              color: subMarkProps.includes(sub.appendPropId) ? u.lightGreen : '#fff8',
                            },
                            sub.rolls.map(() => '.').join(''),
                          ),
                        div({ mr: 0 }, sub.display),
                      ),
                    ),
                  ),
                ),
              // フッター
              div(
                { mb: 0, h: 56, display: 'flex', backgroundColor: u.bga2 },
                img({ ml: 20, w: 28, h: 28, src: srcUrl(artifact.flat.equipType, 'card-assets') }),
                div({ mb: 1, mr: '.5rem', fontSize: '2.5rem', color: u.lightGreen }, '.'),
                div(
                  { mr: 20, textAlign: 'right', fontSize: '1.25rem' },
                  `× ${getSubRollMark(subMarkProps, artifact.flat.reliquarySubstats)}`,
                ),
              ),
            ),
        )
      }),
    ),
  )
})
</script>

<canvas width="1920" height="480" class="w-full" bind:this={canvas}></canvas>
