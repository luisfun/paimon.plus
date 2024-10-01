import fs from 'node:fs'
import { folder } from './utils.js'

// https://gitlab.com/Dimbreath/AnimeGameData/-/tree/master/TextMap
const languages = ['EN', 'JP', 'KR']

// @Dimbreath @FZFalzar https://gitlab.com/Dimbreath/AnimeGameData
const gitlabUrl = 'https://gitlab.com/api/v4/projects/53216109/repository/files/'

// @yuko1101 https://github.com/yuko1101/enka-network-api/blob/main/LICENSE
// https://github.com/yuko1101/enka-network-api/blob/main/src/client/CachedAssetsManager.ts
const gitlabFileName = [
  'AvatarExcelConfigData', // Characters
  'FetterInfoExcelConfigData', // Characters Profile Info
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
  'WeaponCodexExcelConfigData', // Weapon Release Information
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
  console.log('Data Download Start')
  await Promise.all(
    gitlabFileName.map(async name => {
      const url = `${gitlabUrl}ExcelBinOutput%2F${name}%2Ejson/raw`
      const response = await fetch(url)
      const json = await response.json()
      fs.writeFileSync(`${folder.data + name}.json`, JSON.stringify(json, null, 2))
    }),
    languages.map(async lang => {
      const name = `TextMap${lang}`
      const url = `${gitlabUrl}TextMap%2F${name}%2Ejson/raw`
      const response = await fetch(url)
      const json = await response.json()
      fs.writeFileSync(`${folder.text + name}.json`, JSON.stringify(json, null, 2))
    }),
  )
  console.log('Data Download End')
}
