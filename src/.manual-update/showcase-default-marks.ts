import type { defineSub } from '@components/showcase-utils'

const marks = {
  'Kamisato Ayaka': ['ATK', 'CRIT'],
  Aloy: ['ATK', 'CRIT'],
  default: ['CRIT'],
}
export default marks as Record<keyof typeof marks, (typeof defineSub)[number][]>
