export const API_VER = '0.3.0'
export const uidTest = (uid: string | number | undefined) => /^(18|[1-35-9])\d{8}$/.test(uid?.toString() || '')

export const fetchUid = async (uid: number | undefined, cache?: 'cache') => {
  if (!uidTest(uid)) return { json: undefined, status: 499 }
  const res = await fetch(
    `/api/uid/${uid}`,
    cache ? { cache: 'force-cache', headers: { 'Cache-Control': 'force-cache' } } : undefined,
  )
  if (200 <= res.status && res.status <= 399) {
    localStorage.setItem('uid', uid?.toString() || '')
    return { json: (await res.json()) as ApiData, status: res.status }
  }
  return { json: undefined, status: res.status }
}

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
    }[]
    showNameCardIdList?: number[]
    profilePicture: {
      avatarId: number
      costumeId?: number
    }
  }
  avatarInfoList?: {
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
  }[]
  ttl: number
  uid: string
  owner?: unknown
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
