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
import AvatarPromote from '../../../../src/game/.data/AvatarPromoteExcelConfigData.json' assert { type: 'json' }
import AvatarSkillDepot from '../../../../src/game/.data/AvatarSkillDepotExcelConfigData.json' assert { type: 'json' }
import AvatarSkill from '../../../../src/game/.data/AvatarSkillExcelConfigData.json' assert { type: 'json' }
import AvatarTalent from '../../../../src/game/.data/AvatarTalentExcelConfigData.json' assert { type: 'json' }
import ProudSkill from '../../../../src/game/.data/ProudSkillExcelConfigData.json' assert { type: 'json' }

// material
import Material from '../../../../src/game/.data/MaterialExcelConfigData.json' assert { type: 'json' }

// wiki-id
import WikiId from '../../../../src/game/.wiki/id.json' assert { type: 'json' }

const E = { Avatar, AvatarSkillDepot, AvatarSkill, AvatarTalent, AvatarCostume, AvatarPromote, Material, ProudSkill }

export const dataShrink = () => {
  dumpAvatar()
  dumpMaterial()
  dumpTextMap()
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
        aInfo57.element = avatarElement(depot)
        if (!(depot.id === 501 || depot.id === 701) && aInfo57.element === null) continue
        aInfo57.consts = avatarConsts(depot)
        aInfo57.skills = avatarSkills(depot)
        aInfo57.promoteCosts = avatarPromoteCosts(avatar.avatarPromoteId)
        aInfo57.skillCosts = avatarSkillCosts(aInfo57.skills)
        aInfo57.wikiId = avatarWikiId(`Traveler${aInfo57.element ? ` (${elementText[aInfo57.element]})` : ''}`)
        a.push(aInfo57)
      }
    } else {
      const depot = E.AvatarSkillDepot.find(e => e.id === aInfo.skillDepotId)
      aInfo.element = avatarElement(depot)
      aInfo.consts = avatarConsts(depot)
      aInfo.skills = avatarSkills(depot)
      aInfo.costumes = E.AvatarCostume.filter(e => e.characterId === aInfo.id && e.sideIconName !== '').map(costume => {
        const c = {
          iconName: costume.frontIconName,
          sideIconName: costume.sideIconName,
        }
        c.imageName = `UI_Costume_${c.iconName.split('_').slice(-1)[0]}`
        return c
      })
      aInfo.promoteCosts = avatarPromoteCosts(avatar.avatarPromoteId)
      aInfo.skillCosts = avatarSkillCosts(aInfo.skills)
      aInfo.wikiId = avatarWikiId(TextMap.en[aInfo.nameTextMapHash])
      a.push(aInfo)
    }
  }
  dumpFile('avatar', a)
}

const avatarElement = depot => E.AvatarSkill.find(e => e.id === depot.energySkill)?.costElemType || null

const avatarConsts = depot => depot.talents.map(talentId => E.AvatarTalent.find(e => e.talentId === talentId)?.icon)

const avatarSkills = depot =>
  depot.skills
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

// @yuko1101 https://github.com/yuko1101/enka-network-api/blob/main/example/upgradeCosts.js
const avatarPromoteCosts = avatarPromoteId => {
  const promoteArray = E.AvatarPromote.filter(e => e.avatarPromoteId === avatarPromoteId)
  const coin = promoteArray
    .filter(e => e.scoinCost)
    .map(e => e.scoinCost)
    .reduce((a, b) => a + b)
  const materials = promoteArray
    .filter(e => e.costItems[0])
    .map(e => e.costItems)
    .reduce((materialMap, items) => {
      for (const item of items) {
        if (!item.id) continue
        materialMap[item.id] ??= { id: item.id, count: 0 }
        materialMap[item.id].count += item.count
      }
      return materialMap
    }, {})
  return { coin, materials: Object.values(materials) }
}

const avatarSkillCosts = skills => {
  const ids = skills.map(e => e.proud)
  const skillArray = E.ProudSkill.filter(e => ids.includes(e.proudSkillGroupId))
  const coin = skillArray
    .filter(e => e.coinCost)
    .map(e => e.coinCost)
    .reduce((a, b) => a + b)
  const materials = skillArray
    .filter(e => e.costItems[0]?.id)
    .map(e => e.costItems)
    .reduce((materialMap, items) => {
      for (const item of items) {
        if (!item.id) continue
        materialMap[item.id] ??= { id: item.id, count: 0 }
        materialMap[item.id].count += item.count
      }
      return materialMap
    }, {})
  return { coin, materials: Object.values(materials) }
}

const avatarWikiId = text => Object.values(WikiId).findIndex(e => e === text)

const elementText = {
  Wind: 'Anemo',
  Rock: 'Geo',
  Electric: 'Electro',
  Grass: 'Dendro',
  Water: 'Hydro',
  Fire: 'Pyro',
  Ice: 'Cryo',
}

const dumpMaterial = () => {
  const avatarArray = readFile('avatar')
  const materialIds = []
  for (const avatar of avatarArray) {
    for (const material of avatar.promoteCosts.materials) {
      materialIds.push(material.id)
    }
    for (const material of avatar.skillCosts.materials) {
      materialIds.push(material.id)
    }
  }
  const m = [...new Set(materialIds)].map(id => {
    const material = E.Material.find(e => e.id === id)
    const copyIndex = ['id', 'icon', 'rankLevel', 'nameTextMapHash', 'rank']
    const re = {}
    for (const index of copyIndex) {
      re[index] = material[index]
    }
    return re
  })
  dumpFile('material', m)
}

const dumpTextMap = () => {
  let hashs = readFile('avatar').map(e => e.nameTextMapHash)
  hashs.push(...readFile('material').map(e => e.nameTextMapHash))
  hashs = [...new Set(hashs)]
  const textMap = {}
  for (const lang of Object.keys(TextMap)) {
    textMap[lang] ??= {}
    for (const hash of hashs) {
      textMap[lang][hash] = TextMap[lang][hash]
    }
  }
  dumpFile('text-map', textMap)
}

const readFile = name => JSON.parse(fs.readFileSync(`${folder.dist + name}.json`, 'utf8'))
const dumpFile = (name, data) => {
  fs.writeFileSync(`${folder.dist + name}.json`, JSON.stringify(data, null, 2))
}
