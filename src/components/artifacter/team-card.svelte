<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo, ReliquaryRemap, WeaponRemap } from '@components/api'
import { avatarRemap } from '@components/api'
import {
  type ScoreType,
  bga,
  bga2,
  elementColor,
  elementMap,
  equipTypes,
  getConsPos,
  getScoreSet,
  getTotalScoreSet,
  lightGreen,
  scoreIcon,
  src,
  sxMiniPaper,
} from '@components/showcase-utils'
import { useTranslations } from '@i18n/utils'
import type { Lang } from '@i18n/utils'
import { XCanvas, div, img } from '@luisfun/x-canvas'

let {
  lang,
  avatarInfoList,
  selectTeam,
  canvas = $bindable(),
}: {
  lang: Lang
  avatarInfoList: AvatarInfo[]
  selectTeam: [number, ScoreType][]
  canvas: HTMLCanvasElement
} = $props()
const t = useTranslations(lang)

const avatarList = $derived(
  selectTeam
    .filter(e => e[0] !== -1)
    .map(e => {
      const i = avatarInfoList.findIndex(a => a.avatarId === e[0])
      return { ...avatarRemap(avatarInfoList[i]), scoreType: e[1] }
    }),
)
let xc: XCanvas
let memberNum = 0

$effect(() => {
  //console.log('effect')
  xc ??= new XCanvas(canvas, '/workers')
  if (memberNum !== avatarList.length) {
    xc.options({
      canvasWidth: 1920,
      canvasHeight: 480 * avatarList.length,
      fontFace: lang === 'en' ? ['Genshin', '/fonts/genshin.woff2'] : ['GenshinJa', '/fonts/genshin-ja.woff2'],
      fontSize: 24,
      fontColor: '#fff',
      //debugMode: true,
    })
    memberNum = avatarList.length
  }
  xc.render(
    {},
    ...avatarList.map(a => {
      const weapon: WeaponRemap[] = []
      const artifactList: ReliquaryRemap[] = []
      for (const e of a.equipList || []) {
        if ('weapon' in e) weapon.push(e as WeaponRemap)
        if ('reliquary' in e) artifactList.push(e as ReliquaryRemap)
      }
      const scoreSet = getScoreSet(artifactList, a.scoreType)
      const totalScore = getTotalScoreSet(scoreSet, a.scoreType)
      return div(
        {
          backgroundColor: elementMap[a.element || ''],
          backgroundImage: src('overlay', 'card-assets', 'jpg'),
          backgroundBlendMode: 'overlay',
          objectFit: 'cover',
          overflow: 'hidden',
        },
        div(
          { display: 'flex', mt: 0, p: 8 },
          // キャラ情報
          div(
            { w: '23%', p: 8 },
            // キャラ名と元素
            div(
              { display: 'flex', h: 36, mt: 2, ml: 2 },
              div(
                { w: 42, h: 42, m: -3, backgroundColor: bga, overflow: 'hidden', borderRadius: '50%' },
                img({ m: 1 }, src(a.element, 'element')),
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
                    img({ position: 'absolute', m: -18, opacity: 0.75 }, src('TalentBack', 'card-assets')),
                    img({ w: 66, h: 66 }, src(skill.icon, 'ui')),
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
                div(
                  { h: 240, mt: 0 },
                  img({ h: '100%', mt: -42, shadow: { size: 16 }, unsharpMask: [4, 2, 0] }, src(a.sideIcon, 'ui')),
                ),
                div(
                  { mt: -38, fontSize: '1.2rem', textAlign: 'center', shadow: { size: 16, for: 2 } },
                  `Lv.${a.level}`,
                ),
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
                        backgroundColor: bga2,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: { width: 2, color: cons.unlock ? '#fff' : '#888' },
                      },
                      cons.unlock
                        ? img({}, src(cons.icon, 'ui'))
                        : img({ m: -12, opacity: 0.8 }, src('consLock', 'card-assets')),
                    ),
                  ),
                ),
              ),
            ),
            div(
              { display: 'flex', h: '53%', mt: 14 },
              // total score
              div(
                { w: '35%', backgroundColor: bga, borderRadius: 16, overflow: 'hidden' },
                div(
                  { display: 'flex' },
                  img({ h: '70%', ml: '.5rem' }, src(scoreIcon(a.scoreType), 'card-assets')),
                  img({ h: '62.5%', mr: '.5rem' }, src(totalScore.grade, 'card-assets')),
                ),
                div(
                  { backgroundColor: bga2 },
                  div({ fontSize: '1.65rem', textAlign: 'center' }, totalScore.value.toFixed(1)),
                ),
              ),
              // weapon
              !weapon[0]
                ? div({ w: '35%', ml: 10, mr: 10 })
                : div(
                    { w: '35%', ml: 10, mr: 10 },
                    img({ position: 'absolute', m: 2, shadow: { size: 16 } }, src(weapon[0].flat.icon, 'ui')),
                    weapon[0].weapon.affixMap &&
                      div(
                        { ...sxMiniPaper, w: '2.25rem', h: 38, fontSize: '1.2rem' },
                        `R${Object.values(weapon[0].weapon.affixMap)[0] + 1}`,
                      ),
                  ),
              // artifact set
              div(
                { w: '35%' },
                // 1つのとき
                a.reliquarySets[0] && !a.reliquarySets[1]
                  ? div(
                      {},
                      img({ position: 'absolute', m: -4, shadow: { size: 16 } }, src(a.reliquarySets[0].icon, 'ui')),
                      div({ ...sxMiniPaper, w: '1.75rem', h: 38, fontSize: '1.2rem' }, a.reliquarySets[0].count),
                    )
                  : // 2つのとき
                    a.reliquarySets[0] && a.reliquarySets[1]
                    ? div(
                        {},
                        div(
                          { position: 'absolute', clipPathLine: [0, 0, '100%', 0, '100%', '100%'] },
                          div(
                            { mt: 0, mr: 0, w: '70%', h: '70%' },
                            img(
                              { position: 'absolute', m: -4, shadow: { size: 12 } },
                              src(a.reliquarySets[0].icon, 'ui'),
                            ),
                            div({ ...sxMiniPaper, w: '1.5rem', h: 32 }, a.reliquarySets[0].count),
                          ),
                        ),
                        div(
                          { position: 'absolute', clipPathLine: [0, 0, '100%', '100%', 0, '100%'] },
                          div(
                            { mb: 0, ml: 0, w: '70%', h: '70%' },
                            img(
                              { position: 'absolute', m: -4, shadow: { size: 12 } },
                              src(a.reliquarySets[1].icon, 'ui'),
                            ),
                            div({ ...sxMiniPaper, w: '1.5rem', h: 32 }, a.reliquarySets[1].count),
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
              { p: 8, backgroundColor: bga, overflow: 'hidden', borderRadius: 16 },
              ...a.stats
                .filter(e => e.icon !== '')
                .map(stat =>
                  div(
                    { ml: 14, mr: 14, h: 24, display: 'flex' },
                    // ステータス名
                    div(
                      { display: 'flex' },
                      img({ ml: -4, mr: 10, w: 32, h: 32 }, src(stat.icon, 'card-assets')),
                      // @ts-expect-error
                      div({ ml: 0 }, t(stat.type)),
                    ),
                    // ステータス値 詳細
                    stat.display.base &&
                      stat.display.add &&
                      div(
                        { position: 'absolute', display: 'flex', mb: 0, h: '.75rem' },
                        div({ w: '58%', mr: 0, fontSize: '.75rem', textAlign: 'right' }, stat.display.base),
                        div({ w: '42%', ml: 8, fontSize: '.75rem', color: lightGreen }, `+${stat.display.add}`),
                      ),
                    // ステータス値
                    div({ h: 24, mr: 0 }, stat.display.main),
                  ),
                ),
            ),
          ),
          // 聖遺物
          ...equipTypes.map(equipType => {
            const artifact = artifactList.find(e => e.flat.equipType === equipType)
            const score = scoreSet.find(e => e.equipType === equipType)
            return div(
              { p: 8, w: '10%' },
              artifact &&
                score &&
                div(
                  { backgroundColor: bga, overflow: 'hidden', borderRadius: 16 },
                  // 聖遺物画像
                  img({ position: 'absolute', mt: '-0.5rem', ml: -5, w: 160, h: 160 }, src(artifact.flat.icon, 'ui')),
                  // メインステータス
                  div(
                    { mt: '3rem', mr: 16, h: 98 },
                    img({ mr: -6, w: 42, h: 42 }, src(artifact.flat.reliquaryMainstat.mainPropId, 'card-assets')),
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
                          img({ ml: 0, w: 32, h: 32 }, src(sub.appendPropId, 'card-assets')),
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
                                  color: '#fff8',
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
                    { mb: 0, h: '2.125rem', display: 'flex', backgroundColor: bga2 },
                    img({ ml: 20, w: 34, h: 34 }, src(score.grade, 'card-assets')),
                    div({ mr: 20, fontSize: '1.375rem' }, score.value.toFixed(1)),
                  ),
                ),
            )
          }),
        ),
      )
    }),
    div(
      { position: 'absolute', display: 'flex', mb: 0 },
      div({ mr: '.375rem', fontSize: '.75rem', h: '.75rem', mb: 0 }, 'Artifacter Web'),
      div({ ml: 0, mr: 0, fontSize: '.625rem', h: '.625rem', mb: 0 }, 'powered by'),
      div({ ml: '.25rem', fontSize: '.75rem', h: '.75rem', mb: 0 }, 'Enka.Network'),
    ),
  )
})
</script>

<canvas width="1920" height="480" class="w-full" bind:this={canvas}></canvas>
