/** Shared fixture data for GuidedTourCanvasSurface design variants. */

export const TOUR = {
  id: 'modern-ufo-era',
  title: 'The Modern UFO Era',
  step: 2,
  total: 8,
  year: '1947',
  stopTitle: 'The Roswell Incident',
  narrative:
    'Debris recovered near Roswell Army Air Field. Initial press release names a “flying disc”; hours later the story is walked back to a weather balloon. The contradiction becomes the founding scar of the modern era.',
} as const

export const NODES = [
  {
    id: 'arnold',
    title: 'Kenneth Arnold UFO sighting',
    meta: 'North of Mount Rainier · 46.8523° −121.7603° · 06/24/1947',
    x: 18,
    y: 28,
    active: false,
  },
  {
    id: 'craze',
    title: '1947 flying disc craze',
    meta: 'National press cluster · summer 1947',
    x: 52,
    y: 22,
    active: false,
  },
  {
    id: 'roswell',
    title: 'Roswell Army Air Field',
    meta: 'Roswell, NM · 07/1947',
    x: 42,
    y: 48,
    active: true,
  },
  {
    id: 'knapp',
    title: 'George Knapp',
    meta: 'Chief Investigative Reporter',
    x: 72,
    y: 58,
    active: false,
  },
] as const

export const EDGES = [
  { from: 'arnold', to: 'craze', label: 'events', kind: 'solid' as const },
  {
    from: 'arnold',
    to: 'roswell',
    label: 'personnel [ CORROBORATED ]',
    kind: 'solid' as const,
  },
  {
    from: 'craze',
    to: 'roswell',
    label: '64% semantic affinity',
    kind: 'dashed' as const,
  },
  {
    from: 'roswell',
    to: 'knapp',
    label: 'Chronological tour path',
    kind: 'tour' as const,
  },
] as const

export const INTELLIGENCE = {
  hypothesis:
    'Haut’s press release and Marcel’s later testimony form a corroborated personnel bridge into Roswell; the balloon walk-back remains the contested hinge.',
  affinity: '73% affinity — Marcel testimony ↔ RAAF release',
  figures: [
    { name: 'Walter Haut', state: 'CORROBORATED' as const },
    { name: 'Jesse Marcel', state: 'CORROBORATED' as const },
  ],
} as const
