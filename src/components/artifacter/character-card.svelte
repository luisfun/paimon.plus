<svelte:options runes={true} />
<script lang="ts">
import type { AvatarInfo, ReliquaryRemap, WeaponRemap } from '@components/api'
import { avatarRemap } from '@components/api'
import {
  type ScoreType,
  bga,
  bga2,
  elementMap,
  equipTypes,
  getScoreSet,
  getTotalScoreSet,
  lightGreen,
  src,
  statusRename,
  sxBga,
  sxMiniPaper,
} from '@components/showcase-utils'
import { useTranslations } from '@i18n/utils'
import type { Lang } from '@i18n/utils'
import { XCanvas, div, img } from '@luisfun/x-canvas'

let {
  lang,
  avatarInfo,
  scoreType,
  canvas = $bindable(),
}: {
  lang: Lang
  avatarInfo: AvatarInfo
  scoreType: ScoreType
  canvas: HTMLCanvasElement
} = $props()
const t = useTranslations(lang)

const a = $derived(avatarRemap(avatarInfo))
let xc: XCanvas

$effect(() => {
  //console.log('effect')
  xc ??= new XCanvas(canvas, '/workers', {
    canvasWidth: 1920,
    canvasHeight: 1080,
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
  const scoreSet = getScoreSet(artifactList, scoreType)
  const totalScore = getTotalScoreSet(scoreSet, scoreType)
  xc.render(
    {
      backgroundColor: elementMap[a.element || ''],
      backgroundImage: src('overlay', 'card-assets', 'jpg'),
      backgroundBlendMode: 'overlay',
      objectFit: 'cover',
      overflow: 'hidden',
      p: '.5rem',
    },
    div(
      { display: 'flex', h: 636 - 12 },
      // キャラ
      div(
        { w: '40%' },
        // アバター画像
        img({ position: 'absolute', mt: -12, ml: -12, overflow: 'hidden' }, src(a.avatarImg, 'ui')),
        // キャラ名
        div(
          { position: 'absolute', m: 16 },
          div(
            { m: 0, mb: 12, h: 24 * 1.75, fontSize: '1.75rem', shadow: { size: 16, for: 4 } },
            t(a.avatarId, 'avatar'),
          ),
          div(
            { display: 'flex', m: 0, h: 24 * 1.2 },
            div({ w: 76 * 1.2, fontSize: '1.2rem', shadow: { size: 12, for: 4 } }, `Lv.${a.level}`),
            img(
              { mr: 2 * 1.2, w: 28 * 1.2, h: 28 * 1.2, shadow: { size: 12, for: 4 } },
              src('Friendship', 'card-assets'),
            ),
            div({ fontSize: '1.2rem', shadow: { size: 12, for: 4 } }, a.fetterInfo.expLevel),
          ),
        ),
        // スキル
        div(
          { position: 'absolute', ml: 16, mb: 16, w: 76, h: 114 * 3 },
          ...(a.skills?.map(skill =>
            div(
              { mt: 0, w: 76, h: 76 },
              img({ position: 'absolute', m: -21, opacity: 0.75 }, src('TalentBack', 'card-assets')),
              img({ w: 76, h: 76 }, src(skill.icon, 'ui')),
              div(
                {
                  ...sxMiniPaper,
                  mt: -8,
                  w: 44,
                  h: 36,
                  fontSize: '1.15rem',
                  color: skill.add !== 0 ? 'cyan' : undefined,
                },
                skill.level + skill.add,
              ),
            ),
          ) || []),
        ),
        // キャラ凸
        div(
          { position: 'absolute', mr: 12, mt: 64, mb: 16, w: 92 },
          ...a.talentIcons.map(cons =>
            div(
              {},
              img(
                {
                  position: 'absolute',
                  ml: 4.5,
                  mt: 1.5,
                  mb: -1.5,
                  opacity: cons.unlock ? 1 : 0.75,
                  shadow: { size: 16 },
                },
                src(`cons${a.element}`, 'card-assets'),
              ),
              div({
                position: 'absolute',
                backgroundColor: '#333c',
                borderRadius: '50%',
                overflow: 'hidden',
                w: 47,
                h: 47,
              }),
              div({
                position: 'absolute',
                borderRadius: '50%',
                overflow: 'hidden',
                w: 51,
                h: 51,
                border: cons.unlock ? { width: 2, color: '#fff6' } : undefined,
              }),
              cons.unlock
                ? img({ m: 20 }, src(cons.icon, 'ui'))
                : img({ opacity: 0.75 }, src('consLock', 'card-assets')),
            ),
          ),
        ),
      ),
      // ステータス
      div(
        { p: 8, w: '30%' },
        div(
          { p: 8, ...sxBga },
          ...a.stats
            .filter(e => e.icon !== '')
            .map(stat =>
              div(
                { ml: 14, mr: 14, h: 24, display: 'flex' },
                // ステータス名
                div(
                  { display: 'flex' },
                  img({ ml: -4, mr: 10, w: 32 * 1.15, h: 32 * 1.15 }, src(stat.icon, 'card-assets')),
                  // @ts-expect-error
                  div({ ml: 0, fontSize: '1.15rem' }, t(stat.type)),
                ),
                // ステータス値 詳細
                stat.display.base &&
                  stat.display.add &&
                  div(
                    { position: 'absolute', display: 'flex', mb: 0, h: '.85rem' },
                    div({ w: '58%', mr: 0, fontSize: '.85rem', textAlign: 'right' }, stat.display.base),
                    div({ w: '42%', ml: 8, fontSize: '.85rem', color: lightGreen }, `+${stat.display.add}`),
                  ),
                // ステータス値
                div({ h: 24, mr: 0, fontSize: '1.15rem' }, stat.display.main),
              ),
            ),
        ),
      ),
      div(
        { w: '30%' },
        // 武器
        div(
          { display: 'flex', m: 8, p: 8, h: '80%', ...sxBga },
          weapon[0].weapon.affixMap &&
            div(
              { ...sxMiniPaper, mt: 8, ml: 4, w: 52, h: 38, fontSize: '1.2rem', backgroundColor: bga },
              `R${Object.values(weapon[0].weapon.affixMap)[0] + 1}`,
            ),
          div(
            { w: '30%' },
            img({ position: 'absolute', mb: 12, w: '96%' }, src(weapon[0].flat.icon, 'ui')),
            img({ mb: 0, w: '96%', h: 46 }, src(`star${weapon[0].flat.rankLevel}`, 'card-assets')),
          ),
          div(
            { w: '70%', p: 8, pl: 16 },
            div({ h: 24 * 1.4, fontSize: '1.1rem' }, t(weapon[0].itemId, 'weapon')),
            div(
              { h: 24 * 1.4, fontSize: '1.1rem', ml: 0, ...sxBga, borderRadius: 8, w: 62 * 1.4, textAlign: 'center' },
              `Lv.${weapon[0].weapon.level}`,
            ),
            ...[0, 1].map(i => {
              const stat = weapon[0].flat.weaponStats[i]
              if (!stat) return div({ h: 24 * 1.4 })
              return div(
                { h: 24 * 1.4, display: 'flex' },
                // ステータス名
                div(
                  { display: 'flex' },
                  img({ ml: -4, mr: 11, w: 32 * 1.1, h: 32 * 1.1 }, src(stat.appendPropId, 'card-assets')),
                  // @ts-expect-error
                  div({ ml: 0, fontSize: '1.1rem' }, t(statusRename(stat.type))),
                ),
                // ステータス値
                div({ fontSize: '1.1rem', textAlign: 'right' }, stat.display),
              )
            }),
          ),
        ),
        // 聖遺物セット
        div(
          { display: 'flex', m: 8, p: 8, pt: 12, pb: 12, h: '45%', ...sxBga },
          div(
            { position: 'absolute', ml: 62 + 8, mr: 42 + 8 },
            ...a.reliquarySets.map(
              set =>
                set &&
                div({ textAlign: 'center', fontSize: '1.1rem', color: lightGreen }, t(Number(set.nameTextMapHash))),
            ),
          ),
          div({ ml: 8, p: 10, w: 62, h: 62, ...sxBga }, img({}, src('EQUIP_DRESS', 'card-assets'))),
          div(
            {},
            ...a.reliquarySets.map(
              set =>
                set &&
                div(
                  { mr: 8, w: 42, h: 36, ...sxBga, borderRadius: 8, textAlign: 'center', fontSize: '1.15rem' },
                  set.count,
                ),
            ),
          ),
        ),
        // スコア
        div(
          { m: 8, h: '100%', ...sxBga, backgroundColor: '#fff2' },
          div(
            {},
            // total grade
            div(
              {
                position: 'absolute',
                mt: -16,
                pt: 16,
                mr: -16,
                pr: 16,
                w: 108,
                h: 80,
                ...sxBga,
                backgroundColor: '#0009',
              },
              img({ m: 6 }, src(totalScore.grade, 'card-assets')),
            ),
            div(
              { mt: 4, ml: 8, h: 24 * 1.35, fontSize: '1.35rem' },
              t(scoreType === 'CRIT' ? 'artifacter.card.tcv' : 'artifacter.card.total'),
            ),
            div({ textAlign: 'center', fontSize: '3rem' }, totalScore.value.toFixed(1)),
            div({ mb: 4, ml: 8, h: 24 * 0.8, fontSize: '.8rem' }, 'powered by Enka.Network'),
          ),
          div(
            { mb: 0, pl: 14, pr: 14, h: 54, display: 'flex', backgroundColor: '#0009' },
            div({ ml: 0, fontSize: '1.25rem' }, 'Artifacter Web'),
            div(
              { mr: 0, fontSize: '1.25rem' },
              scoreType === 'CRIT' ? t('artifacter.crit') : `${t('CRIT')} + ${t(scoreType)}`,
            ),
          ),
        ),
      ),
    ),
    // 聖遺物
    div(
      { display: 'flex' },
      ...equipTypes.map(equipType => {
        const artifact = artifactList.find(e => e.flat.equipType === equipType)
        const score = scoreSet.find(e => e.equipType === equipType)
        return div(
          { p: 8, w: '20%' },
          artifact &&
            score &&
            div(
              { ...sxBga },
              // 聖遺物画像
              img({ position: 'absolute', mt: -28, ml: 2, w: 210, h: 210 }, src(artifact.flat.icon, 'ui')),
              // メインステータス
              div(
                { mt: 8, mr: 14, h: 140 },
                img({ mt: 0, mr: 0, w: 46, h: 46 }, src(artifact.flat.reliquaryMainstat.mainPropId, 'card-assets')),
                div(
                  { mt: 0, textAlign: 'right', fontSize: '1.75rem', h: 24 * 1.75 },
                  artifact.flat.reliquaryMainstat.display,
                ),
                div(
                  { mt: 0, mr: 0, ...sxBga, borderRadius: 8, textAlign: 'center', w: 58, h: 30 },
                  `+${artifact.reliquary.level - 1}`,
                ),
              ),
              // サブステータス
              artifact.flat.reliquarySubstats &&
                div(
                  { mt: 8, mb: 8, pl: 14, pr: 14 },
                  ...artifact.flat.reliquarySubstats.map(sub =>
                    div(
                      { mt: 0, display: 'flex', h: '25%' },
                      img({ mr: 10, w: 32, h: 32 }, src(sub.appendPropId, 'card-assets')),
                      // @ts-expect-error
                      div({}, t(statusRename(sub.type))),
                      div(
                        { mr: 0 },
                        sub.rolls &&
                          div(
                            {
                              position: 'absolute',
                              mb: 0,
                              h: 24 * 1.45,
                              mr: 8,
                              textAlign: 'right',
                              fontSize: '1.45rem',
                              color: '#fff8',
                            },
                            sub.rolls.map(_ => '.').join(''),
                          ),
                        div({ textAlign: 'right' }, sub.display),
                      ),
                    ),
                  ),
                ),
              // フッター
              div(
                { mb: 0, pl: 14, pr: 14, h: 54, display: 'flex', backgroundColor: bga2 },
                img({ w: 32, h: 32 }, src(artifact.flat.equipType, 'card-assets')),
                img({ ml: 10, mr: 10, w: 38, h: 38 }, src(score.grade, 'card-assets')),
                div({ mb: 10, h: 24, textAlign: 'right', color: '#fffa' }, scoreType === 'CRIT' ? 'CV' : 'Score'),
                div({ mr: 0, w: 64 * 1.45, textAlign: 'right', fontSize: '1.45rem' }, score.value.toFixed(1)),
              ),
            ),
        )
      }),
    ),
  )
})
</script>

<canvas width="1920" height="1080" class="w-full" bind:this={canvas}></canvas>
