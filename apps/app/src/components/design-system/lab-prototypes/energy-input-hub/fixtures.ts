export const ENERGY_TEMPLATE_CARDS = [
  {
    id: 'brief',
    meta: 'SYS.DOC // PRJ-X',
    title: 'Project Brief',
    icon: 'doc' as const,
  },
  {
    id: 'matrix',
    meta: 'SYS.TBL // Q3-FIN',
    title: 'Data Matrix',
    icon: 'table' as const,
  },
  {
    id: 'deck',
    meta: 'SYS.PRS // ALL-HND',
    title: 'Pitch Deck',
    icon: 'screen' as const,
  },
] as const

export const ENERGY_HUB_COPY = {
  brand: 'Luméa AGI / V.04',
  awaiting: 'Awaiting Input',
  placeholder:
    'Describe the document structure, purpose, and key data points...',
  synthesize: 'Synthesize',
} as const

export type EnergyStageState = 'idle' | 'animating' | 'resolved'
