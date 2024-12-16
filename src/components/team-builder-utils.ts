import avatarJson from '@game/avatar.json'
import { useTranslations } from '@i18n/utils'
import { avatar as buildData } from '@manual/team-builder-data'
import type { Elem } from './team-builder/types'

const en = useTranslations('en')
const elemMap: Record<string, Elem> = {
  Fire: 'Pyro',
  Water: 'Hydro',
  Ice: 'Cryo',
  Electric: 'Electro',
  Grass: 'Dendro',
  Wind: 'Anemo',
  Rock: 'Geo',
}
export const avatar = buildData
  .map(a => {
    const find = avatarJson.find(e => en(e.id, 'avatar') === a.name)
    const newA = { ...a, avatarId: find?.id, qualityType: find?.qualityType }
    if (newA.elem || !find?.element) return newA
    newA.elem = elemMap[find.element]
    return newA
  })
  .map(a => ({ ...a, id: `${a.name}:${a.elem}` })) // :でnameとelemを合わせる
