import Seiyu_1216 from '@assets/webp/player-card-sample/Seiyu_1216.webp'
import asphere_lag from '@assets/webp/player-card-sample/asphere_lag.webp'
import catudon_1276 from '@assets/webp/player-card-sample/catudon_1276.webp'
import fukafukafuka29 from '@assets/webp/player-card-sample/fukafukafuka29.webp'
import ge_mpie from '@assets/webp/player-card-sample/ge_mpie.webp'
import genshin_wazooo from '@assets/webp/player-card-sample/genshin_wazooo.webp'
import genshin_wazooo_2 from '@assets/webp/player-card-sample/genshin_wazooo_2.webp'
import genshin_wazooo_y from '@assets/webp/player-card-sample/genshin_wazooo_y.webp'
import genshinlev from '@assets/webp/player-card-sample/genshinlev.webp'
import mechan_genshin from '@assets/webp/player-card-sample/mechan_genshin.webp'
import naga_ken from '@assets/webp/player-card-sample/naga_ken.webp'
import naga_ken_y from '@assets/webp/player-card-sample/naga_ken_y.webp'
import o_kami_games from '@assets/webp/player-card-sample/o_kami_games.webp'

export const data: {
  toolId?: 'fukafukafuka29' | 'catudon_1276' | 'genshinlev' | 'genshin_wazooo' | 'genshin_wazooo_2' | 'genshin_wazooo_y'
  vertical?: boolean
  sample: ImageMetadata
  link: string
  self?: boolean
  x: string
  canvas?: { w: number; h: number }
  modal?: {
    clickArea: number[]
    baseSize?: number
    settingType?: 'frame' | 'checkbox'
    field: {
      type: 'text' | 'textarea' | 'number' | 'frame' | 'checkbox'
      area?: [number, number, number, number]
      label: string
      row?: number[]
      items?: {
        pos: [number, number]
        label: string
      }[][]
    }[]
  }[]
  pasteImage?: {
    editArea: [number, number, number, number]
    drawArea: [number, number, number, number]
    preDraw?: boolean
  }[]
  custom?: {
    list: string[]
  }
}[] = [
  {
    toolId: 'fukafukafuka29',
    sample: fukafukafuka29,
    link: '/player-card-fukafukafuka29/',
    self: true,
    x: 'fukafukafuka29',
    canvas: { w: 1600, h: 900 },
    modal: [
      {
        clickArea: [70, 130, 640, 510],
        baseSize: 4,
        field: [
          { type: 'text', area: [275, 135, 595, 180], label: 'Name' },
          { type: 'text', area: [275, 212, 595, 257], label: 'ID' },
          { type: 'text', area: [275, 292, 595, 337], label: 'Platform' },
          { type: 'text', area: [275, 371, 595, 416], label: 'Voice Chat' },
          { type: 'text', area: [275, 452, 595, 497], label: 'Active Time' },
        ],
      },
      {
        clickArea: [70, 540, 640, 810],
        field: [{ type: 'textarea', area: [100, 580, 607, 800], label: 'Free Space', row: [90, 160, 190, 210, 220] }],
      },
    ],
    custom: {
      //values: [890, 0],
      list: [
        'Shenhe',
        'Arataki Itto',
        'Sangonomiya Kokomi',
        'Raiden Shogun',
        'Kamisato Ayaka',
        'Hu Tao',
        'Xiao',
        'Tartaglia',
        'Layla',
        'Collei',
        'Shikanoin Heizou',
        'Yun Jin',
        'Gorou',
        'Thoma',
        'Kujou Sara',
        'Yanfei',
        'Xinyan',
        'Chongyun',
        'Noelle',
        'Xingqiu',
        'Barbara',
        'Kaeya',
        'Aloy',
        'Lumine',
        'Paimon',
        'Dainsleif',
      ],
    },
  },
  {
    toolId: 'catudon_1276',
    sample: catudon_1276,
    link: 'https://catudon1276.booth.pm',
    x: 'catudon_1276',
    canvas: { w: 1883, h: 1188 },
    modal: [
      {
        clickArea: [99, 82, 871, 335],
        baseSize: 2.5,
        field: [
          { type: 'textarea', area: [106, 100, 293, 269], label: 'Rank', row: [100, 150] },
          { type: 'textarea', area: [382, 165, 802, 288], label: 'Name', row: [100, 130] },
          { type: 'text', area: [363, 295, 629, 318], label: 'UID' },
        ],
      },
      {
        clickArea: [51, 442, 626, 943],
        field: [
          { type: 'textarea', area: [78, 500, 581, 600], label: 'プラットフォーム', row: [80, 120] },
          { type: 'textarea', area: [78, 631, 581, 757], label: '会話手段', row: [80, 120] },
          { type: 'textarea', area: [78, 783, 581, 924], label: '時間帯', row: [80, 120] },
        ],
      },
      {
        clickArea: [642, 442, 1100, 943],
        field: [
          { type: 'textarea', area: [667, 500, 1069, 653], label: '他に遊んでいるゲーム', row: [80, 140, 180] },
          { type: 'textarea', area: [667, 757, 1069, 908], label: '一言', row: [80, 140, 180] },
        ],
      },
    ],
    pasteImage: [
      {
        editArea: [1234, 0, 1883, 1188],
        drawArea: [1097, 0, 1883, 1188],
        preDraw: true,
      },
    ],
    custom: {
      list: ['Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine'],
    },
  },
  {
    toolId: 'genshin_wazooo',
    sample: genshin_wazooo,
    link: 'https://x.com/genshin_wazooo/status/1511649659147948039',
    x: 'genshin_wazooo',
    canvas: { w: 1500, h: 1000 },
    modal: [
      {
        clickArea: [651, 135, 1387, 262],
        baseSize: 6.5,
        field: [
          { type: 'text', area: [714, 135, 1114, 262], label: 'なまえ' },
          { type: 'number', area: [1204, 135, 1368, 262], label: 'せからん' },
        ],
      },
      {
        clickArea: [655, 281, 1380, 487],
        baseSize: 4.5,
        field: [
          { type: 'text', area: [687, 315, 989, 373], label: 'ID' },
          { type: 'text', area: [687, 418, 989, 483], label: 'VC' },
          { type: 'textarea', area: [1053, 341, 1367, 487], label: 'Play Style', row: [70, 120, 140] },
        ],
      },
      {
        clickArea: [656, 509, 1079, 890],
        field: [{ type: 'textarea', area: [672, 538, 1062, 889], label: 'ふりー', row: [90, 160, 230, 300, 350] }],
      },
      {
        clickArea: [1092, 501, 1384, 885],
        baseSize: 4,
        field: [
          { type: 'text', area: [1106, 537, 1376, 632], label: 'Platform' },
          { type: 'text', area: [1106, 678, 1376, 756], label: 'じかん' },
          { type: 'text', area: [1111, 795, 1361, 885], label: 'Other Game' },
        ],
      },
    ],
  },
  {
    toolId: 'genshin_wazooo_2',
    sample: genshin_wazooo_2,
    link: 'https://x.com/genshin_wazooo/status/1511649659147948039',
    x: 'genshin_wazooo',
    canvas: { w: 1172, h: 522 },
    modal: [
      {
        clickArea: [536, 23, 1139, 118],
        baseSize: 4.5,
        field: [
          { type: 'text', area: [560, 52, 956, 110], label: 'なまえ' },
          { type: 'number', area: [1006, 44, 1117, 113], label: 'セカラン' },
        ],
      },
      {
        clickArea: [533, 124, 815, 494],
        baseSize: 3.2,
        field: [
          { type: 'text', area: [557, 152, 789, 198], label: 'ID' },
          { type: 'text', area: [557, 229, 789, 278], label: 'VC' },
          { type: 'text', area: [552, 323, 786, 393], label: 'Platform' },
          { type: 'text', area: [552, 422, 786, 486], label: 'Activity Time' },
        ],
      },
      {
        clickArea: [819, 124, 1144, 484],
        baseSize: 3.2,
        field: [
          { type: 'text', area: [842, 159, 1119, 216], label: 'Play Style' },
          { type: 'textarea', area: [842, 267, 1119, 476], label: '推しは...', row: [70, 130, 160, 180, 200] },
        ],
      },
    ],
  },
  {
    sample: naga_ken,
    link: 'https://naga-ken.info/genshin-self-introduction-card/',
    x: 'Luke_nagaken',
  },
  {
    sample: ge_mpie,
    link: 'https://x.com/ge_mpie/status/1424681851021451268',
    x: 'ge_mpie',
  },
  {
    sample: Seiyu_1216,
    link: 'https://x.com/Seiyu_1216/status/1330707237149368320',
    x: 'Seiyu_1216',
  },
  {
    sample: asphere_lag,
    link: 'https://x.com/asphere_lag/status/1425807531163545611',
    x: 'asphere_lag',
  },
  {
    toolId: 'genshinlev',
    vertical: true,
    sample: genshinlev,
    link: 'https://x.com/genshinlev/status/1546715277802754048',
    x: 'genshinlev',
    canvas: { w: 900, h: 1200 },
    modal: [
      {
        clickArea: [531, 60, 742, 314],
        baseSize: 8,
        field: [{ type: 'number', area: [586, 183, 694, 287], label: '世界ランク' }],
      },
      {
        clickArea: [42, 216, 494, 444],
        baseSize: 4,
        field: [
          { type: 'text', area: [89, 260, 447, 326], label: '旅人名' },
          { type: 'text', area: [127, 392, 409, 444], label: '活動日数' },
        ],
      },
      {
        clickArea: [495, 587, 796, 787],
        baseSize: 3.5,
        field: [
          { type: 'text', area: [522, 655, 729, 704], label: 'Active Time (Start)' },
          { type: 'text', area: [545, 736, 748, 782], label: 'Active Time (End)' },
        ],
      },
      {
        clickArea: [505, 360, 794, 557, 42, 457, 456, 757],
        baseSize: 10,
        settingType: 'frame',
        field: [
          {
            type: 'frame',
            label: '性別',
            items: [
              [
                { pos: [559, 500], label: '♂' },
                { pos: [652, 449], label: '？' },
                { pos: [744, 500], label: '♀' },
              ],
            ],
          },
          {
            type: 'frame',
            label: 'Voice Chat',
            items: [
              [
                { pos: [97, 545], label: 'パラレル' },
                { pos: [176, 545], label: 'LINE' },
              ],
              [
                { pos: [256, 545], label: 'Discord' },
                { pos: [335, 545], label: 'PS' },
                { pos: [410, 545], label: '✗' },
              ],
            ],
          },
          {
            type: 'frame',
            label: 'Platform',
            items: [
              [
                { pos: [124, 711], label: 'PC' },
                { pos: [255, 711], label: 'スマホ' },
                { pos: [388, 711], label: 'PS' },
              ],
            ],
          },
        ],
      },
      {
        clickArea: [43, 814, 794, 944],
        baseSize: 3.5,
        settingType: 'checkbox',
        field: [
          {
            type: 'checkbox',
            label: 'Check',
            items: [
              [
                { pos: [85, 847], label: 'フレンド募集' },
                { pos: [436, 847], label: 'マルチのお友達募集' },
              ],
              [
                { pos: [85, 919], label: 'お手伝いします' },
                { pos: [456, 919], label: '実はコミュ障です' },
              ],
            ],
          },
        ],
      },
      {
        clickArea: [43, 992, 794, 1148],
        field: [{ type: 'textarea', area: [183, 1027, 673, 1139], label: 'Free', row: [60, 105, 122] }],
      },
    ],
    custom: {
      list: ['greenyellow', 'lightpink', 'dodgerblue'],
    },
  },
  {
    toolId: 'genshin_wazooo_y',
    vertical: true,
    sample: genshin_wazooo_y,
    link: 'https://x.com/genshin_wazooo/status/1563848391750488064',
    x: 'genshin_wazooo',
    canvas: { w: 1400, h: 1800 },
    modal: [
      {
        clickArea: [128, 154, 1264, 344],
        baseSize: 8,
        field: [
          { type: 'text', area: [233, 187, 773, 316], label: 'なまえ' },
          { type: 'number', area: [1049, 193, 1215, 343], label: 'RANK' },
        ],
      },
      {
        clickArea: [123, 377, 542, 858],
        field: [{ type: 'textarea', area: [147, 494, 510, 829], label: 'Play Style', row: [100, 200, 280, 340] }],
      },
      {
        clickArea: [585, 413, 1267, 852],
        baseSize: 7,
        field: [
          { type: 'text', area: [627, 505, 1247, 610], label: 'ID' },
          { type: 'text', area: [627, 715, 1247, 820], label: 'VC' },
        ],
      },
      {
        clickArea: [99, 898, 689, 1424],
        baseSize: 7,
        field: [
          { type: 'text', area: [130, 1010, 661, 1157], label: 'Platform' },
          { type: 'text', area: [130, 1241, 661, 1388], label: 'じかん' },
        ],
      },
      {
        clickArea: [747, 888, 1282, 1678],
        field: [
          { type: 'textarea', area: [792, 997, 1237, 1642], label: 'ふりー', row: [100, 200, 300, 400, 500, 600, 650] },
        ],
      },
    ],
  },
  {
    vertical: true,
    sample: naga_ken_y,
    link: 'https://naga-ken.info/genshin-self-introduction-card_ver3/',
    x: 'Luke_nagaken',
  },
  {
    vertical: true,
    sample: mechan_genshin,
    link: 'https://x.com/mechan_genshin/status/1354264608979132422',
    x: 'mechan_genshin',
  },
  {
    vertical: true,
    sample: o_kami_games,
    link: 'https://o-kami-games.com/generator/genshin/',
    x: 'o_kami_games',
  },
]
