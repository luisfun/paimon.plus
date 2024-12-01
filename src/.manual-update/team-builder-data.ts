import type { Avatar } from '@components/team-builder/types'

export const avatar: Avatar[] = [
  {
    name: 'Kamisato Ayaka',
    score: [4, 3, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
    stat: ['ATK'],
    filter: {
      score: 4,
      roll: 'main',
    },
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },
  {
    name: '',
    score: [0, 0, 0, 0],
  },

  {
    name: 'Ororon',
    score: [0, 1, 0, 0],
    coop: [
      { score: 1, add: [{ elem: ['Hydro'] }] },
      { score: 2, add: [{ roll: ['main'], elem: ['Anemo', 'Cryo', 'Dendro', 'Geo', 'Hydro', 'Pyro'] }] },
    ],
  },
  {
    name: 'Kachina',
    score: [0, 0, 1, 0],
    coop: [{ score: 2, add: [{ roll: ['main'], elem: ['4elem'] }] }],
  },
  {
    name: 'Sethos',
    score: [4, 0, 0, 0],
    burstDep: 2,
    dmg: ['charge'],
  },
  {
    name: 'Gaming',
    score: [4, 0, 0, 0],
    burstDep: 2,
    explor: ['run-speed', 1],
  },
  {
    name: 'Chevreuse',
    score: [0, 0, 0, 1],
    burstDep: 2,
    coop: [
      {
        score: 2,
        add: [
          { elem: ['Electro'] },
          [{ elem: ['Electro'] }, { elem: ['Electro'] }, { elem: ['Electro'] }],
          [{ elem: ['Electro'] }, { elem: ['Electro'] }, { elem: ['Pyro'] }],
          [{ elem: ['Electro'] }, { elem: ['Pyro'] }, { elem: ['Pyro'] }],
        ],
      },
    ],
    filter: { score: 4, roll: 'healer' },
  },
  {
    name: 'Charlotte',
    score: [0, 0, 0, 4],
    burstDep: 3,
  },
  {
    name: 'Freminet',
    score: [3, 0, 0, 0],
    burstDep: 2,
    dmg: ['normal'],
    coop: [{ score: 1, add: [{ elem: ['Electro', 'Hydro'] }] }],
  },
  {
    name: 'Lynette',
    score: [0, 0, 1, 0],
    burstDep: 3,
    coop: [{ score: 1, add: [{ stat: ['ATK'] }] }],
    filter: { score: 2, roll: 'support' },
  },
  {
    name: 'Kirara',
    score: [1, 0, 0, 2],
    burstDep: 1,
    dmg: ['element'],
    coop: [{ score: 3, add: ['Nilou'] }],
  },
  {
    name: 'Kaveh',
    score: [1, 0, 0, 0],
    burstDep: 3,
    dmg: ['element'],
    coop: [
      { score: 3, add: [{ elem: ['Hydro'] }] },
      { score: -2, add: [{ elem: ['Pyro', 'Electro'] }] },
    ],
    filter: { score: 3, roll: 'main' },
  },
  {
    name: 'Mika',
    score: [0, 0, 0, 2],
    burstDep: 3,
    coop: [
      { score: 1, add: [{ roll: ['main'], dmg: ['normal'] }] },
      { score: 3, add: ['Eula', 'Freminet', 'Razor'] },
    ],
    filter: { score: 4, roll: 'healer' },
  },
  {
    name: 'Yaoyao',
    score: [0, 0, 0, 4],
    burstDep: 1,
  },
  {
    name: 'Faruzan',
    score: [0, 0, 1, 0],
    burstDep: 3,
    coop: [{ score: 4, add: [{ roll: ['main'], elem: ['Anemo'] }] }],
    filter: { score: 4, roll: 'support' },
  },
  {
    name: 'Layla',
    score: [0, 4, 0, 2],
    burstDep: 1,
    dmg: ['burst'],
  },
  {
    name: 'Candace',
    score: [0, 0, 1, 0],
    burstDep: 2,
  },
  {
    name: 'Dori',
    score: [0, 0, 0, 3],
    burstDep: 3,
  },
  {
    name: 'Collei',
    score: [0, 3, 0, 0],
    burstDep: 2,
    dmg: ['burst'],
  },
  {
    name: 'Shikanoin Heizou',
    score: [2, 0, 0, 0],
    dmg: ['normal', 'skill'],
    coop: [{ score: 2, add: [{ elem: ['4elem'] }] }],
    filter: { score: 4, roll: 'main' },
  },
  {
    name: 'Kuki Shinobu',
    score: [0, 0, 0, 3],
    coop: [{ score: 2, add: [[{ elem: ['Hydro'] }, { elem: ['Dendro'] }]] }],
    filter: { score: 4, roll: 'healer' },
  },
  {
    name: 'Yun Jin',
    score: [0, 0, 1, 0],
    burstDep: 2,
    coop: [{ score: 3, add: [{ roll: ['main'], dmg: ['normal'] }] }],
    filter: { score: 3, roll: 'support' },
  },
  {
    name: 'Gorou',
    score: [0, 0, 1, 0],
    burstDep: 1,
    coop: [
      { score: 1, add: [[{ elem: ['Geo'] }, { elem: ['Geo'] }]] },
      { score: 3, add: [{ roll: ['main'], elem: ['Geo'], stat: ['DEF'] }] },
    ],
    filter: { score: 3, roll: 'support' },
  },
  {
    name: 'Thoma',
    score: [0, 0, 1, 1],
    burstDep: 3,
    coop: [{ score: 2, add: [[{ elem: ['Hydro'] }, { elem: ['Dendro'] }]] }],
    filter: { score: 2, roll: 'support' },
  },
  {
    name: 'Kujou Sara',
    score: [0, 2, 3, 0],
    burstDep: 2,
    dmg: ['burst'],
    coop: [{ score: 2, add: [{ roll: ['main'], elem: ['Electro'], stat: ['ATK'] }] }],
    filter: { score: 4, roll: 'support' },
  },
  {
    name: 'Sayu',
    score: [0, 0, 0, 3],
    burstDep: 3,
    explor: ['run', 3],
  },
  {
    name: 'Yanfei',
    score: [4, 0, 0, 0],
    burstDep: 2,
    dmg: ['charge'],
  },
  {
    name: 'Rosaria',
    score: [0, 5, 0, 0],
    burstDep: 2,
    explor: ['run-speed', 1],
  },
  {
    name: 'Xinyan',
    score: [1, 1, 0, 0],
    burstDep: 1,
    dmg: ['burst'],
  },
  {
    name: 'Diona',
    score: [0, 0, 0, 5],
    burstDep: 2,
  },
  {
    name: 'Sucrose',
    score: [0, 0, 3, 0],
    burstDep: 2,
    coop: [{ score: 1, add: [{ dmg: ['element'] }] }],
  },
  {
    name: 'Chongyun',
    score: [2, 0, 0, 0],
    dmg: ['normal'],
  },
  {
    name: 'Noelle',
    score: [3, 0, 0, 1],
    burstDep: 3,
    dmg: ['normal'],
  },
  {
    name: 'Bennett',
    score: [0, 0, 1, 3],
    burstDep: 2,
    coop: [
      { score: 1, add: ['Xiangling'] },
      { score: 2, add: [{ roll: ['main'], stat: ['ATK'] }] },
    ],
    filter: { score: 5, roll: 'healer' },
  },
  {
    name: 'Fischl',
    score: [0, 4, 0, 0],
    burstDep: 1,
    dmg: ['skill'],
  },
  {
    name: 'Ningguang',
    score: [3, 0, 1, 0],
    dmg: ['charge'],
  },
  {
    name: 'Xingqiu',
    score: [0, 5, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
  },
  {
    name: 'Beidou',
    score: [0, 5, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
  },
  {
    name: 'Xiangling',
    score: [0, 5, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
  },
  {
    name: 'Razor',
    score: [3, 0, 0, 0],
    burstDep: 3,
    dmg: ['normal'],
    coop: [{ score: 1, add: [{ elem: ['Cryo'] }] }],
  },
  {
    name: 'Barbara',
    score: [0, 0, 0, 2],
    burstDep: 3,
  },
  {
    name: 'Lisa',
    score: [0, 3, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
  },
  {
    name: 'Kaeya',
    score: [0, 4, 0, 0],
    burstDep: 2,
    dmg: ['burst'],
    explor: ['run-stamina', 1],
  },
  {
    name: 'Amber',
    score: [0, 2, 0, 0],
    burstDep: 1,
    dmg: ['burst'],
  },

  {
    name: 'Aloy',
    score: [2, 0, 0, 0],
    dmg: ['normal'],
  },
  {
    name: 'Traveler',
    elem: 'Hydro',
    score: [0, 0, 0, 1],
    burstDep: 0,
  },
  {
    name: 'Traveler',
    elem: 'Dendro',
    score: [0, 3, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
  },
  {
    name: 'Traveler',
    elem: 'Electro',
    score: [0, 3, 0, 0],
    burstDep: 3,
    dmg: ['burst'],
  },
  {
    name: 'Traveler',
    elem: 'Geo',
    score: [0, 0, 1, 0],
    burstDep: 1,
  },
  {
    name: 'Traveler',
    elem: 'Anemo',
    score: [0, 0, 1, 0],
    burstDep: 1,
  },
]
