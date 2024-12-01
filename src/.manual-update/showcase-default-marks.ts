import type { defineSub } from '@components/showcase-utils'

export const marks: Record<string, (typeof defineSub)[number][]> = {
  'Kamisato Ayaka': ['ATK', 'CRIT'],
  Aloy: ['ATK', 'CRIT'],
  default: ['CRIT'],
}
