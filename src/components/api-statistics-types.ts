export type StatisticsAvatar = {
  avatarId: number
  count: number
  // 旅人の元素
  travelerElement?: {
    id: number // skillDepotId
    count: number
  }[]
  // 命ノ星座
  consts: number[]
  // 旅人以外 天賦
  skills?: {
    id: number
    mean: number
    median: number
    mode: number
  }[]
  stats: {
    fightProp: number | undefined
    value: {
      mean: number
      median: number
    }
  }[]
  weapon: {
    id: number
    count: number
  }[]
  reliquarySet: {
    set: {
      id: number
      piece: number
    }[]
    count: number
  }[]
}

export type StatisticsPlayer = {
  count: number
  level: number[]
  finishAchievementNum: number[]
  finishAchievementNum100: number[]
  finishAchievementNumTop: number
  fetterCount: number[]
  towerFloorIndex: number[]
  theaterActIndex: number[]
}

export type Statistics = {
  playerInfo: StatisticsPlayer
  avatarInfoList: StatisticsAvatar[]
  timestamp: number
  ver: string
}
