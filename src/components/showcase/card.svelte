<script lang="ts">
import type { AvatarInfo, ReliquaryRemap, WeaponRemap } from '@components/api'
import { avatarRemap } from '@components/api'
import { XCanvas, xCreate } from '@components/x-canvas'
import { useTranslations } from '@i18n/utils'
import type { Lang } from '@i18n/utils'

export let avatarInfo: AvatarInfo
export let lang: Lang
const t = useTranslations(lang)
let a = avatarRemap(avatarInfo)
let canvas: HTMLCanvasElement
// @ts-expect-error
let xc: XCanvas

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

$: {
  a = avatarRemap(avatarInfo)
  const ctx = canvas?.getContext('2d', { willReadFrequently: true })
  if (ctx) {
    xc ??= new XCanvas(ctx, 1920, 480)
    const c = xCreate
    const weapon: WeaponRemap[] = []
    const artifactList: ReliquaryRemap[] = []
    for (const e of a.equipList || []) {
      if ('weapon' in e) weapon.push(e as WeaponRemap)
      if ('reliquary' in e) artifactList.push(e as ReliquaryRemap)
    }
    xc.applyFont(lang === 'en' ? 'Genshin' : 'GenshinJa', 24, '#fff')
    xc.main(
      null,
      c(
        'div',
        {
          sx: {
            backgroundColor: u.elementMap[a.element || ''],
            backgroundImage: srcUrl('overlay', 'card-assets', 'jpg'),
            backgroundBlendMode: 'overlay',
            objectFit: 'cover',
            overflow: 'hidden',
          },
        },
        c(
          'div',
          { sx: { display: 'flex', p: 8 } },
          // キャラ情報
          c(
            'div',
            { sx: { p: 8, width: '23%' } },
            // キャラ名と元素
            c(
              'div',
              { sx: { mt: 2, ml: 2, display: 'flex', height: 36 } },
              c(
                'div',
                {
                  sx: { m: -3, width: 42, height: 42, backgroundColor: u.bga, overflow: 'hidden', borderRadius: '50%' },
                },
                c('img', { sx: { m: 1 }, src: srcUrl(a.element, 'element') }),
              ),
              c('div', { sx: { ml: 12, fontSize: '1.2rem', shadow: { size: 16 } } }, t(a.avatarId, 'avatar')),
            ),
            c(
              'div',
              { sx: { height: '100%' } },
              // スキル
              c(
                'div',
                { sx: { position: 'absolute', ml: 2, mt: 14, mb: 4, width: '27%' } },
                ...(a.skills?.map(skill =>
                  c(
                    'div',
                    { sx: { width: 66, height: 66 } },
                    c('img', {
                      sx: { position: 'absolute', m: -18, opacity: 0.75 },
                      src: srcUrl('TalentBack', 'card-assets'),
                    }),
                    c('img', { sx: { width: 66, height: 66 }, src: srcUrl(skill.icon, 'ui') }),
                    c(
                      'div',
                      {
                        sx: {
                          position: 'absolute',
                          mt: -32,
                          mr: -24,
                          width: 38,
                          height: 32,
                          textAlign: 'center',
                          backgroundColor: '#282828dd',
                          borderRadius: 6,
                          overflow: 'hidden',
                          color: skill.add !== 0 ? 'cyan' : undefined,
                        },
                      },
                      skill.level + skill.add,
                    ),
                  ),
                ) || []),
              ),
              // キャラクターicon
              c(
                'div',
                { sx: { position: 'absolute', ml: 2 } },
                c(
                  'div',
                  { sx: { mt: 0, height: 240 } },
                  c('img', { sx: { height: '100%', mt: -42, shadow: { size: 16 } }, src: srcUrl(a.sideIcon, 'ui') }),
                ),
                c(
                  'div',
                  { sx: { mt: -38, fontSize: '1.2rem', textAlign: 'center', shadow: { size: 16, for: 2 } } },
                  `Lv.${a.level}`,
                ),
              ),
              // キャラ凸
              c(
                'div',
                { sx: { position: 'absolute', width: 1, height: 1 } },
                ...a.talentIcons.map((cons, i) =>
                  c(
                    'div',
                    {
                      sx: {
                        position: 'absolute',
                        ...getConsPos(i),
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        border: cons.unlock ? { width: 3, color: elementColor(a.element, true) } : undefined,
                      },
                    },
                    c('div', {
                      sx: {
                        position: 'absolute',
                        m: 3,
                        backgroundColor: u.bga2,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: { width: 2, color: cons.unlock ? '#fff' : '#888' },
                      },
                    }),
                    cons.unlock
                      ? c('img', { sx: { m: 3 }, src: srcUrl(cons.icon, 'ui') })
                      : c('img', { sx: { m: -9, opacity: 0.8 }, src: srcUrl('consLock', 'card-assets') }),
                  ),
                ),
              ),
            ),
            c(
              'div',
              { sx: { mt: 14, height: '53%', display: 'flex' } },
              // トータルスコア
              c(
                'div',
                { sx: { backgroundColor: u.bga, borderRadius: 16, overflow: 'hidden' } },
                c(
                  'div',
                  { sx: { display: 'flex' } },
                  c('img', { sx: { height: '70%' }, src: srcUrl('') }),
                  c('div', { sx: { width: -16 } }), // 調節用
                  c('img', { sx: { height: '62.5%' }, src: srcUrl('') }),
                ),
                c('div', { sx: { fontSize: '1.65rem', textAlign: 'center', backgroundColor: u.bga2 } }, 200),
              ),
              // weapon
              !weapon[0]
                ? c('div', { sx: { ml: 10, mr: 10 } })
                : c(
                    'div',
                    { sx: { ml: 10, mr: 10 } },
                    c('img', {
                      sx: { position: 'absolute', m: 2, shadow: { size: 16 } },
                      src: srcUrl(weapon[0].flat.icon, 'ui'),
                    }),
                    weapon[0].weapon.affixMap &&
                      c(
                        'div',
                        { sx: { ...sxMiniPaper, width: 48, height: 38, fontSize: '1.2rem' } },
                        `R${Object.values(weapon[0].weapon.affixMap)[0] + 1}`,
                      ),
                  ),
              // artifact set
              c(
                'div',
                { sx: {} },
                // 1つのとき
                a.reliquarySets[0] && !a.reliquarySets[1]
                  ? c(
                      'div',
                      null,
                      c('img', {
                        sx: { position: 'absolute', m: -4, shadow: { size: 16 } },
                        src: srcUrl(a.reliquarySets[0].icon, 'ui'),
                      }),
                      c(
                        'div',
                        { sx: { ...sxMiniPaper, width: 42, height: 38, fontSize: '1.2rem' } },
                        a.reliquarySets[0].count,
                      ),
                    )
                  : // 2つのとき
                    a.reliquarySets[0] && a.reliquarySets[1]
                    ? c(
                        'div',
                        null,
                        c(
                          'div',
                          { sx: { position: 'absolute', clipPathLine: [0, 0, '100%', 0, '100%', '100%'] } },
                          c(
                            'div',
                            { sx: { mt: 0, mr: 0, width: '70%', height: '70%' } },
                            c('img', {
                              sx: { position: 'absolute', m: -4, shadow: { size: 12 } },
                              src: srcUrl(a.reliquarySets[0].icon, 'ui'),
                            }),
                            c('div', { sx: { ...sxMiniPaper, width: 36, height: 32 } }, a.reliquarySets[0].count),
                          ),
                        ),
                        c(
                          'div',
                          { sx: { position: 'absolute', clipPathLine: [0, 0, '100%', '100%', 0, '100%'] } },
                          c(
                            'div',
                            { sx: { mb: 0, ml: 0, width: '70%', height: '70%' } },
                            c('img', {
                              sx: { position: 'absolute', m: -4, shadow: { size: 12 } },
                              src: srcUrl(a.reliquarySets[1].icon, 'ui'),
                            }),
                            c('div', { sx: { ...sxMiniPaper, width: 36, height: 32 } }, a.reliquarySets[1].count),
                          ),
                        ),
                      )
                    : null,
              ),
            ),
          ),
          // ステータス
          c(
            'div',
            { sx: { p: 8, width: '27%' } },
            c(
              'div',
              { sx: { p: 8, backgroundColor: u.bga, overflow: 'hidden', borderRadius: 16 } },
              ...a.stats
                .filter(e => e.icon !== '')
                .map(stat =>
                  c(
                    'div',
                    { sx: { ml: 14, mr: 14, height: 24, display: 'flex' } },
                    // ステータス名
                    c(
                      'div',
                      { sx: { display: 'flex' } },
                      c('img', {
                        sx: { ml: -4, mr: 10, width: 32, height: 32 },
                        src: srcUrl(stat.icon, 'card-assets'),
                      }),
                      // @ts-expect-error
                      c('div', { sx: { ml: 0 } }, t(stat.type === 'CRIT DMG' ? 'CRIT Damage' : stat.type)),
                    ),
                    // ステータス値
                    c(
                      'div',
                      null,
                      stat.display.base &&
                        stat.display.add &&
                        c(
                          'div',
                          { sx: { position: 'absolute', display: 'flex', mr: 150, mb: 0, height: 24 * 0.75 } },
                          c('div', { sx: { mr: 0, fontSize: '.75rem', textAlign: 'right' } }, stat.display.base),
                          c('div', { sx: { ml: 8, fontSize: '.75rem', color: u.lightGreen } }, `+${stat.display.add}`),
                        ),
                      c('div', { sx: { height: 24, textAlign: 'right' } }, stat.display.main),
                    ),
                  ),
                ),
            ),
          ),
          // 聖遺物
          ...u.equipTypes.map(equipType => {
            const artifact = artifactList.find(e => e.flat.equipType === equipType)
            //const score = scoreSet.find(e=>e.equipType===equipType)
            return c(
              'div',
              { sx: { p: 8, width: '10%' } },
              artifact &&
                c(
                  'div',
                  { sx: { backgroundColor: u.bga, overflow: 'hidden', borderRadius: 16 } },
                  // 聖遺物画像
                  c('img', {
                    sx: { position: 'absolute', mt: -15, ml: -5, width: 160, height: 160 },
                    src: srcUrl(artifact.flat.icon, 'ui'),
                  }),
                  // メインステータス
                  c(
                    'div',
                    { sx: { mt: 70, mr: 16, height: 98 } },
                    c('img', {
                      sx: { mr: -6, width: 42, height: 42 },
                      src: srcUrl(artifact.flat.reliquaryMainstat.mainPropId, 'card-assets'),
                    }),
                    c(
                      'div',
                      { sx: { textAlign: 'right', fontSize: '1.45rem', height: 24 * 1.45 } },
                      artifact.flat.reliquaryMainstat.display,
                    ),
                  ),
                  // サブステータス
                  artifact.flat.reliquarySubstats &&
                    c(
                      'div',
                      { sx: { mt: 8, mb: 8 } },
                      ...artifact.flat.reliquarySubstats.map(sub =>
                        c(
                          'div',
                          { sx: { ml: 20, mr: 20, mt: 0, display: 'flex', height: '25%' } },
                          c('img', {
                            sx: { ml: 0, width: 32, height: 32 },
                            src: srcUrl(sub.appendPropId, 'card-assets'),
                          }),
                          c(
                            'div',
                            { sx: { mr: 0 } },
                            sub.rolls &&
                              c(
                                'div',
                                {
                                  sx: {
                                    position: 'absolute',
                                    mb: 0,
                                    mr: 8,
                                    height: 24 * 1.45,
                                    textAlign: 'right',
                                    fontSize: '1.45rem',
                                    color: '#fff8',
                                  },
                                },
                                sub.rolls.map(_ => '.').join(''),
                              ),
                            c('div', { sx: { textAlign: 'right' } }, sub.display),
                          ),
                        ),
                      ),
                    ),
                  // フッター
                  c(
                    'div',
                    { sx: { mb: 0, height: 56, display: 'flex', backgroundColor: u.bga2 } },
                    c('img', { sx: { ml: 14, width: 36, height: 36 }, src: srcUrl('') }),
                    c('div', { sx: { mr: 20, textAlign: 'right', fontSize: '1.45rem' } }, 40),
                  ),
                ),
            )
          }),
        ),
      ),
    )
    xc.render(document, isIOS() ? 50 : false)
  }
}
</script>

<canvas width="1920" height="480" class="w-full" bind:this={canvas} />
