import type { ApiData } from '@components/api'

const uidLogLimit = 9

export type UidLog = { name: string; uid: string; pfp: { id?: number; avatarId?: number } }

const UID_LOG = 'uid-logs'

export const ls = {
  uidLog: {
    set: (uid: string | number | undefined, apiData: ApiData) => {
      const newLog: UidLog = {
        name: apiData.playerInfo.nickname,
        uid: uid?.toString() || '',
        pfp: apiData.playerInfo.profilePicture,
      }
      const oldLogs: UidLog[] = JSON.parse(localStorage.getItem(UID_LOG) || '[]')
      const uidLogs: UidLog[] = [newLog, ...oldLogs.filter(e => e.uid !== newLog.uid)]
      if (uidLogs.length > uidLogLimit) uidLogs.length = uidLogLimit
      localStorage.setItem(UID_LOG, JSON.stringify(uidLogs))
      return uidLogs
    },
    get: () => JSON.parse(localStorage.getItem(UID_LOG) || '[]') as UidLog[],
    delete: (uid: string | number) => {
      const oldLogs: UidLog[] = JSON.parse(localStorage.getItem(UID_LOG) || '[]')
      const uidLogs: UidLog[] = oldLogs.filter(e => e.uid !== uid.toString())
      localStorage.setItem(UID_LOG, JSON.stringify(uidLogs))
      return uidLogs
    },
  },
}
