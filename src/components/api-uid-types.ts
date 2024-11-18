export type ApiData = EnkaApi & { ver: string; timestamp: number; status?: number }

export type EnkaApi = {
  playerInfo: {
    nickname: string
    level: number
    signature?: string
    worldLevel?: number
    nameCardId: number
    finishAchievementNum?: number
    towerFloorIndex?: number
    towerLevelIndex?: number
    showAvatarInfoList?: {
      avatarId: number
      level: number
      costumeId?: number
      energyType?: number
      talentLevel?: number
    }[]
    showNameCardIdList?: number[]
    profilePicture: {
      id?: number
      avatarId?: number
    }
    fetterCount?: number
    isShowAvatarTalent?: boolean
    towerStarIndex?: number
    theaterActIndex?: number
    theaterModeIndex?: number
    theaterStarIndex?: number
  }
  avatarInfoList?: AvatarInfo[]
  ttl: number
  uid: string
  owner?: unknown
}
export type AvatarInfo = {
  avatarId: number
  propMap: {
    [index: string]: {
      type: number
      ival: string
      val?: string
    }
  }
  talentIdList?: number[]
  fightPropMap: {
    [index: string]: number
  }
  skillDepotId: number
  inherentProudSkillList: number[]
  skillLevelMap: {
    [index: string]: number
  }
  proudSkillExtraLevelMap?: {
    [index: string]: number
  }
  equipList?: (Weapon | Reliquary)[]
  fetterInfo: {
    expLevel: number // 好感度
  }
  costumeId?: number
}
export type Weapon = {
  itemId: number
  weapon: {
    level: number
    promoteLevel?: number
    affixMap?: {
      [index: string]: number // 0-4
    }
  }
  flat: {
    nameTextMapHash: string
    rankLevel: number
    weaponStats: {
      appendPropId: string
      statValue: number
    }[]
    itemType: string
    icon: string
  }
}
export type Reliquary = {
  itemId: number
  reliquary: {
    level: number
    mainPropId: number
    appendPropIdList?: number[]
  }
  flat: {
    nameTextMapHash: string
    setNameTextMapHash: string
    rankLevel: number
    reliquaryMainstat: {
      mainPropId: string
      statValue: number
    }
    reliquarySubstats?: {
      appendPropId: string
      statValue: number
    }[]
    itemType: string
    icon: string
    equipType: string
  }
}

export type WeaponRemap = Weapon & {
  weapon: {
    levelLimit: number
  }
  flat: {
    weaponStats: {
      type: string
      display: string
    }[]
  }
}
export type ReliquaryRemap = {
  itemId: number
  reliquary: {
    level: number
    mainPropId: number
    appendPropIdList?: number[]
  }
  flat: {
    nameTextMapHash: string
    setNameTextMapHash: string
    rankLevel: number
    reliquaryMainstat: {
      mainPropId: string
      statValue: number
      type: string
      display: string
    }
    reliquarySubstats?: {
      appendPropId: string
      statValue: number
      type: string
      display: string
      rolls: {
        rank: number
        value: number
        display: string
      }[]
    }[]
    itemType: string
    icon: string
    equipType: string
  }
}
