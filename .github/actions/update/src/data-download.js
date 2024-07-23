import fs from 'node:fs'

import { folder } from './utils.js'

// @Dimbreath @FZFalzar https://gitlab.com/Dimbreath/AnimeGameData
const gitlabUrl = 'https://gitlab.com/api/v4/projects/53216109/repository/files/'

// @yuko1101 https://github.com/yuko1101/enka-network-api/blob/main/LICENSE
// https://github.com/yuko1101/enka-network-api/blob/main/src/client/CachedAssetsManager.ts
const gitlabFileName = [
  'AvatarExcelConfigData', // Characters
  'FetterInfoExcelConfigData', // Characters Profile Info
  'FettersExcelConfigData', // Voices in Character Profile
  'AvatarCostumeExcelConfigData', // Costumes
  'AvatarSkillDepotExcelConfigData', // Skill Depot
  'AvatarSkillExcelConfigData', // Skills
  'ProudSkillExcelConfigData', // Passive Talents and Leveled Talents
  'AvatarTalentExcelConfigData', // Constellations
  'AvatarPromoteExcelConfigData', // Character Ascensions
  'AvatarCurveExcelConfigData', // Character Basic Stats Curves
  'AvatarCodexExcelConfigData', // Character Release Information

  'WeaponExcelConfigData', // Weapons
  'WeaponPromoteExcelConfigData', // Weapon Ascensions
  'WeaponCurveExcelConfigData', // Weapon Basic Stats Curves
  'EquipAffixExcelConfigData', // Artifact Set Bonus and Weapon Refinements
  'ReliquaryExcelConfigData', // Artifacts
  'ReliquaryLevelExcelConfigData', // Artifact Main Affix
  'ReliquaryAffixExcelConfigData', // Artifact Sub Affix
  'ReliquarySetExcelConfigData', // Artifact Sets

  'ManualTextMapConfigData', // Fight Props and Other TextMaps
  'AvatarHeroEntityExcelConfigData', // Travelers
  'TrialAvatarFetterDataConfigData', // Archons

  'MaterialExcelConfigData', // Materials (including NameCards)
  'FetterCharacterCardExcelConfigData', // Friendship Rewards
  'RewardExcelConfigData', // Rewards Data for Friendship Cards

  'ProfilePictureExcelConfigData', // User pfp
]

export const dataDownload = async () => {
  await Promise.all(
    gitlabFileName.map(async name => {
      try {
        const url = `${gitlabUrl}ExcelBinOutput%2F${name}%2Ejson/raw?ref=main`
        const response = await fetch(url)
        const json = await response.json()
        fs.writeFileSync(`${folder.data + name}.json`, JSON.stringify(json, null, 2))
      } catch (e) {
        console.log(e)
      }
    }),
  )
}
