<script lang="ts">
import type { ApiData } from '@components/api'
import XCanvas, { xCreate } from '@components/x-canvas'
import avatarJson from '@game/avatar.json'
import { useTranslations } from '@i18n/utils'
import type { Lang } from '@i18n/utils'
import { onMount } from 'svelte'

export let avatar: Exclude<ApiData['avatarInfoList'], undefined>[number]
export let lang: Lang
const t = useTranslations(lang)

let canvas: HTMLCanvasElement
onMount(() => {
  const avatarData = avatarJson.find(e => e.id === avatar.avatarId)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (avatarData && ctx) {
    const xc = new XCanvas(ctx, 1920, 1920 / 4)
    const c = xCreate
    xc.applyFont('GenshinJa', 24, '#fff')
    /*
    xc.main(null, c(`div`,
        {sx: {
          backgroundColor: u.elementMap[avatarData.element || ""],
          backgroundImage: srcUrl("overlay", "card-assets", "jpg"),
          backgroundBlendMode: `overlay`,
          objectFit: `cover`,
          overflow: `hidden`,
        }},
        c(`div`, {sx: {display: `flex`, p: 8,}},
          // キャラ情報
          c(`div`, {sx: {p: 8, width: `23%`,}},
            // キャラ名と元素
            c(`div`, {sx: {mt: 2, ml: 2, display: `flex`, height: 36,}},
              c(`div`, {sx: {m: -3, width: 42, height: 42, backgroundColor: u.bga, overflow: `hidden`, borderRadius: `50%`,}},
                c(`img`, {sx: {m: 1,}, src: srcUrl(avatarData.element || "", "element")}),
              ),
              c(`div`, {sx: {ml: 12, fontSize: `1.2rem`, shadow: {size: 16,},}}, t(avatarData.id, "avatar")),
            ),
            c(`div`, {sx: {height: `100%`,}},
              // スキル
              c(`div`, {sx: {position: `absolute`, ml: 2, mt: 14, mb: 4, width: `27%`,},},
                ...avatarData.skills.map(skill=>(
                  c(`div`, {sx: {width: 66, height: 66,}},
                    c(`img`, {sx: {position: `absolute`, m: -18, opacity: .75,}, src: srcUrl(`TalentBack`)}),
                    c(`img`, {sx: {width: 66, height: 66,}, src: srcUrl(skill.icon || "", "ui")},),
                    c(`div`, {sx: {
                      position: `absolute`,
                      mt: -32, mr: -24,
                      width: 38, height: 32, textAlign: `center`,
                      backgroundColor: `#282828dd`,
                      borderRadius: 6, overflow: `hidden`,
                      //color: skill.add!==0 ? `cyan` : undefined //********************************* 一旦
                    }}, 1),//skill.level + skill.add), //********************************* 一旦
                  )
                )),
              ),
              // キャラクターicon
              c(`div`, {sx: {position: `absolute`, ml: 2,}},
                c(`div`, {sx: {mt: 0, height: 240,}},
                  c(`img`, {sx: {height: `100%`, mt: -42, shadow: {size: 16,},}, src: srcUrl(`UI_AvatarIcon_Side_${avatarData.key}`, "ui")}),
                ),
                c(`div`, {sx: {mt: -38, fontSize: `1.2rem`, textAlign: `center`, shadow: {size: 16, for: 2}}}, `Lv.${avatar.}`+ info.level),
              ),
              // キャラ凸
              c(`div`, {sx: {position: `absolute`, width: 1, height: 1}},
                ...info.talentIcons.map((cons,i)=>
                  c(`div`, {sx: {
                    position: `absolute`,
                    ...getConsPos(i),
                    width: 52, height: 52,
                    borderRadius: `50%`,
                    border: cons.unlock ? {width: 3, color: elementColor(info.element, true)} : undefined,
                  }},
                    c(`div`, {sx: {
                      position: `absolute`,
                      m: 3,
                      backgroundColor: u.bga2,
                      borderRadius: `50%`, overflow: `hidden`,
                      border: {width: 2, color: cons.unlock ? `#fff` : `#888`},
                    }}),
                    cons.unlock
                      ? c(`img`, {sx: {m: 3,}, src: srcUrl(cons.icon, `enka`)})
                      : c(`img`, {sx: {m: -9, opacity: .8,}, src: srcUrl(`consLock`)})
                  )
                ),
              ),
            ),
            c(`div`, {sx: {mt: 14, height: `53%`, display: `flex`,}},
              // トータルスコア
              c(`div`, {sx: {backgroundColor: u.bga, borderRadius: 16, overflow: `hidden`,}},
                c(`div`, {sx: {display: `flex`,}},
                  c(`img`, {sx: {height: `70%`,}, src: srcUrl("")}),
                  c(`div`, {sx: {width: -16,}}), // 調節用
                  c(`img`, {sx: {height: `62.5%`,}, src: srcUrl(totalScore.grade)}),
                ),
                c(`div`, {sx: {fontSize: `1.65rem`, textAlign: `center`, backgroundColor: u.bga2,}}, totalScore.value.toFixed(1)),
              ),
              // weapon
              !weapon[0] ? c(`div`,{sx:{ml: 10, mr: 10,}}) : c(`div`, {sx: {ml: 10, mr: 10,}},
                c(`img`, {sx: {position: `absolute`, m: 2, shadow: {size: 16,},}, src: srcUrl(weapon[0].flat.icon || ``, `enka`)}),
                weapon[0].weapon.affixMap && c(`div`, {sx: {...sxMiniPaper, width: 48, height: 38, fontSize: `1.2rem`,}},
                  `R`+ (Object.values(weapon[0].weapon.affixMap)[0]+1)
                ),
              ),
              // artifact set
              c(`div`, {sx: {}},
                // 1つのとき
                info.reliquarySets[0] && !info.reliquarySets[1] ? c(`div`, null,
                  c(`img`, {sx: {position: `absolute`, m: -4, shadow: {size: 16}}, src: srcUrl(info.reliquarySets[0].icon, `enka`)}),
                  c(`div`, {sx: {...sxMiniPaper, width: 42, height: 38, fontSize: `1.2rem`,}}, info.reliquarySets[0].count),
                ) :
                // 2つのとき
                info.reliquarySets[0] && info.reliquarySets[1] ? c(`div`, null,
                  c(`div`, {sx: {position: `absolute`, clipPathLine: [0,0, `100%`,0, `100%`,`100%`]}},
                    c(`div`, {sx: {mt: 0, mr: 0, width: `70%`, height: `70%`,}},
                      c(`img`, {sx: {position: `absolute`, m: -4, shadow: {size: 12}}, src: srcUrl(info.reliquarySets[0]?.icon || ``, `enka`)}),
                      c(`div`, {sx: {...sxMiniPaper, width: 36, height: 32,}}, info.reliquarySets[0].count),
                    ),
                  ),
                  c(`div`, {sx: {position: `absolute`, clipPathLine: [0,0, `100%`,`100%`, 0,`100%`]}},
                    c(`div`, {sx: {mb: 0, ml: 0, width: `70%`, height: `70%`,}},
                      c(`img`, {sx: {position: `absolute`, m: -4, shadow: {size: 12}}, src: srcUrl(info.reliquarySets[1]?.icon || ``, `enka`)}),
                      c(`div`, {sx: {...sxMiniPaper, width: 36, height: 32,}}, info.reliquarySets[1].count),
                    ),
                  ),
                ) : null
              ),
            ),
          ),
          // ステータス
          c(`div`, {sx: {p: 8, width: `27%`,}},
            c(`div`, {sx: {p: 8, backgroundColor: u.bga, overflow: `hidden`, borderRadius: 16,}},
              ...info.stats.filter(e=>e.icon!==``).map(stat =>
                c(`div`, {sx: {ml: 14, mr: 14, height: 24, display: `flex`,}},
                  // ステータス名
                  c(`div`, {sx: {display: `flex`,}},
                    c(`img`, {sx: {ml: -4, mr: 10, width: 32, height: 32,}, src: srcUrl(stat.icon)}),
                    c(`div`, {sx: {ml: 0,}}, t(stat.type==="CRIT DMG"?"CRIT Damage":stat.type)),
                  ),
                  // ステータス値
                  c(`div`, null,
                    (stat.display.base && stat.display.add) && c(`div`, {sx: {position: `absolute`, display: `flex`, mr: 150, mb: 0, height: 24*.75,}},
                      c(`div`, {sx: {mr: 0, fontSize: `.75rem`, textAlign: `right`,}}, stat.display.base),
                      c(`div`, {sx: {ml: 8, fontSize: `.75rem`, color: u.lightGreen,}}, `+`+ stat.display.add),
                    ),
                    c(`div`, {sx: {height: 24, textAlign: `right`,}}, stat.display.main),
                  ),
                )
              ),
            ),
          ),
          // 聖遺物
          ...u.equipTypes.map(equipType => {
            const artifact = artifactList.find(e=>e.flat.equipType===equipType)
            const score = scoreSet.find(e=>e.equipType===equipType)
            return c(`div`, {sx: {p: 8, width: `10%`,}},
              (artifact && score) && c(`div`, {sx: {backgroundColor: u.bga, overflow: `hidden`, borderRadius: 16,}},
                // 聖遺物画像
                c(`img`, {sx: {position: `absolute`, mt: -15, ml: -5, width: 160, height: 160,}, src: srcUrl(artifact.flat.icon, `enka`)},),
                // メインステータス
                c(`div`, {sx: {mt: 70, mr: 16, height: 98,}},
                  c(`img`, {sx: {mr: -6, width: 42, height: 42,}, src: srcUrl(artifact.flat.reliquaryMainstat.mainPropId)},),
                  c(`div`, {sx: {textAlign: `right`, fontSize: `1.45rem`, height: 24*1.45,}}, artifact.flat.reliquaryMainstat.display),
                ),
                // サブステータス
                artifact.flat.reliquarySubstats && c(`div`, {sx: {mt: 8, mb: 8,}},
                  ...artifact.flat.reliquarySubstats.map(sub=>
                    c(`div`, {sx: {ml: 20, mr: 20, mt: 0, display: `flex`, height: `25%`,}},
                      c(`img`, {sx: {ml: 0, width: 32, height: 32,}, src: srcUrl(sub.appendPropId)},),
                      c(`div`, {sx: {mr: 0,}},
                        sub.rolls && c(`div`, {sx: {
                          position: `absolute`,
                          mb: 0, mr: 8,
                          height: 24*1.45, textAlign: `right`,
                          fontSize: `1.45rem`, color: `#fff8`,
                        }}, sub.rolls.map(_=>`.`).join(``)),
                        c(`div`, {sx: {textAlign: `right`,}}, sub.display),
                      ),
                    ),
                  ),
                ),
                // フッター
                c(`div`, {sx: {mb: 0, height: 56, display: `flex`, backgroundColor: u.bga2}},
                  c(`img`, {sx: {ml: 14, width: 36, height: 36,}, src: srcUrl(score.grade)}),
                  c(`div`, {sx: {mr: 20, textAlign: `right`, fontSize: `1.45rem`,}}, score.value.toFixed(1)),
                ),
              ),
            )
          }),
        ),
      ))
        */
    xc.render(document, isIOS() ? 50 : false)
  }
})

const isIOS = () => {
  if (typeof window === 'undefined') return false
  if (navigator.userAgent.match(/iPhone|iPad|iPod.+Mobile/)) return true
  return false
}
const srcUrl = (name: string, folder?: 'ui' | 'element' | 'card-assets', type?: 'jpg') =>
  `/images${folder ? `/${folder}` : ''}/${name}.${type ? type : 'webp'}`
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
  lightGreen: '#82ff9a',
}
</script>

<canvas bind:this={canvas} />

<style>
  @font-face {
    font-family: 'GenshinJa';
    src: url('/fonts/genshin-ja.woff2') format('woff2');
    font-display: swap;
  }
</style>
