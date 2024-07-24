import fs from 'node:fs'
import { folder } from './utils.js'

// text-map
import en from '../../../../src/game/.text/TextMapEN.json' assert { type: 'json' }
import ja from '../../../../src/game/.text/TextMapJP.json' assert { type: 'json' }
import ko from '../../../../src/game/.text/TextMapKR.json' assert { type: 'json' }

const TextMap = { en, ja, ko }

// avatar
import AvatarCostume from '../../../../src/game/.data/AvatarCostumeExcelConfigData.json' assert { type: 'json' }
import Avatar from '../../../../src/game/.data/AvatarExcelConfigData.json' assert { type: 'json' }
import AvatarSkillDepot from '../../../../src/game/.data/AvatarSkillDepotExcelConfigData.json' assert { type: 'json' }
import AvatarSkill from '../../../../src/game/.data/AvatarSkillExcelConfigData.json' assert { type: 'json' }
import AvatarTalent from '../../../../src/game/.data/AvatarTalentExcelConfigData.json' assert { type: 'json' }

// wiki-id
import WikiId from '../../../../src/game/.wiki/id.json' assert { type: 'json' }

const E = { Avatar, AvatarSkillDepot, AvatarSkill, AvatarTalent, AvatarCostume }

export const dataShrink = () => {
  dumpAvatar()
}

const dumpAvatar = () => {
  const a = []
  // biome-ignore format: ids
  const blockIds = [10000001, 11000008, 11000009, 11000010, 11000011, 11000013, 11000017, 11000018, 11000019, 11000025, 11000026, 11000027, 11000028, 11000030, 11000031, 11000032, 11000033, 11000034, 11000035, 11000036, 11000037, 11000038, 11000039, 11000040, 11000041, 11000042, 11000043, 11000044, 11000045]
  for (const avatar of E.Avatar.filter(e => !blockIds.includes(e.id))) {
    const aInfo = {}
    // biome-ignore format: index
    const avatarCopyIndex = ["id", "iconName", "sideIconName", "qualityType", "weaponType", "skillDepotId", "nameTextMapHash"]
    for (const index of avatarCopyIndex) {
      aInfo[index] = avatar[index]
    }
    aInfo.imageName = `UI_Gacha_AvatarImg_${aInfo.iconName.split('_').slice(-1)[0]}`
    if (aInfo.id === 10000005 || aInfo.id === 10000007) {
      for (const depot of E.AvatarSkillDepot.filter(e => avatar.candSkillDepotIds.includes(e.id))) {
        const aInfo57 = { ...aInfo }
        aInfo57.skillDepotId = depot.id
        aInfo57.element = E.AvatarSkill.find(e => e.id === depot.energySkill)?.costElemType || null
        if (!(depot.id === 501 || depot.id === 701) && aInfo57.element === null) continue
        aInfo57.consts = depot.talents.map(talentId => E.AvatarTalent.find(e => e.talentId === talentId)?.icon)
        aInfo57.skills = depot.skills
          .slice(0, 2)
          .concat(depot.energySkill)
          .map(id => {
            const skill = E.AvatarSkill.find(e => e.id === id)
            return {
              id: id || null,
              icon: skill?.skillIcon || null,
              proud: skill?.proudSkillGroupId || null,
            }
          })
        aInfo57.wikiId = Object.values(WikiId).findIndex(
          e => e === `Traveler${aInfo57.element ? ` (${elementText[aInfo57.element]})` : ''}`,
        )
        a.push(aInfo57)
      }
    } else {
      const depot = E.AvatarSkillDepot.find(e => e.id === aInfo.skillDepotId)
      aInfo.element = E.AvatarSkill.find(e => e.id === depot.energySkill).costElemType
      aInfo.consts = depot.talents.map(talentId => E.AvatarTalent.find(e => e.talentId === talentId).icon)
      aInfo.skills = depot.skills
        .slice(0, 2)
        .concat(depot.energySkill)
        .map(id => {
          const skill = E.AvatarSkill.find(e => e.id === id)
          return {
            id,
            icon: skill.skillIcon,
            proud: skill.proudSkillGroupId,
          }
        })
      aInfo.costumes = E.AvatarCostume.filter(e => e.characterId === aInfo.id && e.sideIconName !== '').map(costume => {
        const c = {
          iconName: costume.frontIconName,
          sideIconName: costume.sideIconName,
        }
        c.imageName = `UI_Costume_${c.iconName.split('_').slice(-1)[0]}`
        return c
      })
      const enText = TextMap.en[aInfo.nameTextMapHash]
      aInfo.wikiId = Object.values(WikiId).findIndex(e => e === enText)
      a.push(aInfo)
    }
  }
  fs.writeFileSync(`${folder.dist}avatar.json`, JSON.stringify(a, null, 2))
}

const elementText = {
  Wind: 'Anemo',
  Rock: 'Geo',
  Electric: 'Electro',
  Grass: 'Dendro',
  Water: 'Hydro',
  Fire: 'Pyro',
  Ice: 'Cryo',
}
