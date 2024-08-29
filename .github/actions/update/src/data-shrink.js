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

// weapon
import Weapon from '../../../../src/game/.data/WeaponExcelConfigData.json' assert { type: 'json' }
import WeaponPromote from '../../../../src/game/.data/WeaponPromoteExcelConfigData.json' assert { type: 'json' }

// material
import Material from '../../../../src/game/.data/MaterialExcelConfigData.json' assert { type: 'json' }

// artifact-substat
import ReliquaryAffix from '../../../../src/game/.data/ReliquaryAffixExcelConfigData.json' assert { type: 'json' }

//
import ProfilePicture from '../../../../src/game/.data/ProfilePictureExcelConfigData.json' assert { type: 'json' }

// wiki-id
import WikiId from '../../../../src/game/.wiki/id.json' assert { type: 'json' }

const E = {
  Avatar,
  AvatarSkillDepot,
  AvatarSkill,
  AvatarTalent,
  AvatarCostume,
  AvatarPromote,
  Weapon,
  WeaponPromote,
  Material,
  ProudSkill,
  ReliquaryAffix,
  ProfilePicture,
}

export const dataShrink = () => {
  dumpAvatar()
  dumpWeapon()
  dumpMaterial()
  dumpProfilePicture()
  dumpTextMap()
  dumpReliquaryAffix()
}

const dumpAvatar = () => {
  const a = []
  // biome-ignore format: ids
  const blockIds = [10000001, 11000008, 11000009, 11000010, 11000011, 11000013, 11000017, 11000018, 11000019, 11000025, 11000026, 11000027, 11000028, 11000030, 11000031, 11000032, 11000033, 11000034, 11000035, 11000036, 11000037, 11000038, 11000039, 11000040, 11000041, 11000042, 11000043, 11000044, 11000045, 11000046]
  for (const avatar of E.Avatar.filter(e => !blockIds.includes(e.id))) {
    const aInfo = {}
    aInfo.key = avatar.iconName.split('_').slice(-1)[0]
    // biome-ignore format: index
    for (const index of ["id", "qualityType", "weaponType", "nameTextMapHash", "skillDepotId"]) {
      aInfo[index] = avatar[index]
    }
    if (aInfo.id === 10000005 || aInfo.id === 10000007) {
      for (const depot of E.AvatarSkillDepot.filter(e => avatar.candSkillDepotIds.includes(e.id))) {
        const aInfo57 = { ...aInfo }
        aInfo57.skillDepotId = depot.id
        aInfo57.element = avatarElement(depot)
        if (!(depot.id === 501 || depot.id === 701) && aInfo57.element === null) continue
        aInfo57.consts = avatarConsts(depot)
        aInfo57.skills = avatarSkills(depot)
        aInfo57.allCosts = avatarAllCosts(avatar, aInfo57)
        aInfo57.wikiId = findWikiId(`Traveler${aInfo57.element ? ` (${elementText[aInfo57.element]})` : ''}`)
        a.push(aInfo57)
      }
    } else {
      const depot = E.AvatarSkillDepot.find(e => e.id === aInfo.skillDepotId)
      aInfo.element = avatarElement(depot)
      aInfo.consts = avatarConsts(depot)
      aInfo.skills = avatarSkills(depot)
      aInfo.costumes = E.AvatarCostume.filter(e => e.characterId === aInfo.id && e.sideIconName !== '').map(
        costume => ({ key: costume.frontIconName.split('_').slice(-1)[0] }),
      )
      aInfo.allCosts = avatarAllCosts(avatar, aInfo)
      aInfo.wikiId = findWikiId(TextMap.en[aInfo.nameTextMapHash])
      a.push(aInfo)
    }
  }
  dumpFile(
    'avatar',
    a
      .sort((a, b) => {
        if (a.qualityType === 'QUALITY_ORANGE_SP') return -1
        if (a.qualityType === 'QUALITY_PURPLE' && b.qualityType === 'QUALITY_ORANGE') return -1
        if (a.qualityType === 'QUALITY_ORANGE' && b.qualityType === 'QUALITY_PURPLE') return 1
        return 0
      })
      .reverse(),
  )
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
const avatarAllCosts = (avatar, aInfo) => {
  const promoteArray = E.AvatarPromote.filter(e => e.avatarPromoteId === avatar.avatarPromoteId)
  const promoteMaterials = promoteArray.filter(e => e.costItems[0]?.id).map(e => e.costItems)
  const ids = aInfo.skills.map(e => e.proud)
  const skillArray = E.ProudSkill.filter(e => ids.includes(e.proudSkillGroupId))
  const skillMaterials = skillArray.filter(e => e.costItems[0]?.id).map(e => e.costItems)
  const promoteCoin = promoteArray
    .filter(e => e.scoinCost)
    .map(e => e.scoinCost)
    .reduce((a, b) => a + b)
  const skillCoin = skillArray
    .filter(e => e.coinCost)
    .map(e => e.coinCost)
    .reduce((a, b) => a + b)
  const materials = promoteMaterials.concat(skillMaterials).reduce((materialMap, items) => {
    for (const item of items) {
      if (!item.id) continue
      materialMap[item.id] ??= 0
      materialMap[item.id] += item.count || 0
    }
    return materialMap
  }, {})
  return { promoteCoin, skillCoin, materials }
}

const findWikiId = text => Object.values(WikiId).findIndex(e => e === text)

const elementText = {
  Wind: 'Anemo',
  Rock: 'Geo',
  Electric: 'Electro',
  Grass: 'Dendro',
  Water: 'Hydro',
  Fire: 'Pyro',
  Ice: 'Cryo',
}

const dumpWeapon = () => {
  const w = []
  // biome-ignore format: ids
  const blockIds = [20001, 10002, 10003, 10004, 10005, 10006, 10008, 11411, 11506, 11507, 11508, 12505, 12506, 12508, 12509, 13503, 13506, 14411, 14503, 14508, 15504, 15505, 15506]
  for (const weapon of E.Weapon.filter(e => !blockIds.includes(e.id))) {
    const wInfo = {}
    // biome-ignore format: index
    for (const index of ["id", "icon", "rankLevel", "nameTextMapHash", "weaponType"]) {
      wInfo[index] = weapon[index]
    }
    // costs
    const weaponPromote = E.WeaponPromote.filter(e => e.weaponPromoteId === weapon.weaponPromoteId)
    const promoteCoin = weaponPromote.map(e => e.coinCost || 0).reduce((a, b) => a + b)
    const materials = weaponPromote
      .filter(e => e.costItems[0]?.id)
      .map(e => e.costItems)
      .reduce((materialMap, items) => {
        for (const item of items) {
          if (!item.id) continue
          materialMap[item.id] ??= 0
          materialMap[item.id] += item.count
        }
        return materialMap
      }, {})
    if (Object.keys(materials).length === 0) continue
    wInfo.allCosts = { promoteCoin, materials }
    wInfo.wikiId = findWikiId(TextMap.en[wInfo.nameTextMapHash])
    w.push(wInfo)
  }
  // sort
  const weaponTypeFilter = type =>
    w
      .filter(e => e.weaponType === type)
      .sort((a, b) => a.rankLevel - b.rankLevel)
      .reverse()
  dumpFile('weapon', [
    ...weaponTypeFilter('WEAPON_SWORD_ONE_HAND'),
    ...weaponTypeFilter('WEAPON_CLAYMORE'),
    ...weaponTypeFilter('WEAPON_BOW'),
    ...weaponTypeFilter('WEAPON_CATALYST'),
    ...weaponTypeFilter('WEAPON_POLE'),
  ])
}

const dumpMaterial = () => {
  const avatar = readFile('avatar')
  const weapon = readFile('weapon')
  const avatarMaterials = avatar.flatMap(a => Object.keys(a.allCosts.materials).map(e => Number(e)))
  const weaponMaterials = weapon.flatMap(w => Object.keys(w.allCosts.materials).map(e => Number(e)))
  const m = [...new Set([...avatarMaterials, ...weaponMaterials, 104003, 104013])].sort().map(id => {
    const material = E.Material.find(e => e.id === Number(id))
    const copyIndex = ['id', 'icon', 'rankLevel', 'nameTextMapHash', 'rank']
    const re = {}
    for (const index of copyIndex) {
      re[index] = material[index]
    }
    return re
  })
  dumpFile('material', m)
}

const dumpProfilePicture = () => {
  const pfp = {}
  for (const p of E.ProfilePicture) {
    pfp[p.id.toString()] = p.iconPath
  }
  dumpFile('profile-picture', pfp)
}

const dumpTextMap = () => {
  let hashs = readFile('avatar').map(e => e.nameTextMapHash)
  hashs.push(...readFile('weapon').map(e => e.nameTextMapHash))
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

const dumpReliquaryAffix = () => {
  const re = E.ReliquaryAffix.map(e => ({ id: e.id, propType: e.propType, propValue: e.propValue }))
  dumpFile('reliquary-affix', re)
}

const readFile = name => JSON.parse(fs.readFileSync(`${folder.dist + name}.json`, 'utf8'))
const dumpFile = (name, data) => {
  fs.writeFileSync(`${folder.dist + name}.json`, JSON.stringify(data, null, 2))
}
