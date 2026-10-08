export type ArchiveInterface = 'foundation' | 'trinity' | 'disclosure'

export const referenceImages = {
  foundation: '/interface-studies/nuclear-shadow/visual-foundation.jpg',
  trinity: '/interface-studies/nuclear-shadow/trinity.jpg',
  disclosure: '/interface-studies/nuclear-shadow/controlled-revelation.jpg',
}

export const foundationSections = [
  {
    id: 'thesis',
    title: 'Core visual thesis',
    bounds: [1, 11, 22, 20],
    text: 'A declassified research system: a living archive of anomalous intelligence. Bureaucratic contact with the impossible.',
  },
  {
    id: 'dna',
    title: 'Aesthetic DNA',
    bounds: [23, 11, 35, 20],
    text: 'Declassified dossier, field investigation, forensic photography, weathered procedure. The uncanny arrives through records.',
  },
  {
    id: 'principles',
    title: 'Design principles',
    bounds: [59, 11, 40, 20],
    text: 'Found, not designed. Evidence over decoration. Imperfection as finish. The interface is legible; the world behind it remains mysterious.',
  },
  {
    id: 'anchors',
    title: 'Visual anchor categories',
    bounds: [1, 32, 98, 14],
    text: 'Anomaly plates, crash recovery sheets, instrument scans, apparition reports, forest surveillance, and the research wall.',
  },
  {
    id: 'master',
    title: 'Master style token',
    bounds: [1, 46, 47, 12],
    text: 'Ultraterrestrial archive style: procedural structure, distressed materials, authentic damage, legible information, and unresolved context.',
  },
  {
    id: 'formula',
    title: 'Prompt formula',
    bounds: [48, 46, 51, 12],
    text: 'Subject, evidence format, document system, texture, typography, lighting, palette, and camera medium. This is an asset recipe in the reference board.',
  },
  {
    id: 'color',
    title: 'Color system',
    bounds: [1, 58, 54, 11],
    text: 'Archive bone and oxidized paper; charcoal ink and faded graphite. Amber is a signal. Red marks classification. Cold blue and dark green stay restrained.',
  },
  {
    id: 'type',
    title: 'Typography direction',
    bounds: [55, 58, 44, 14],
    text: 'Condensed display headers establish hierarchy. Monospaced metadata carries file identity. Typewriter prose and handwritten annotations remain distinct.',
  },
  {
    id: 'layout',
    title: 'Layout system',
    bounds: [1, 69, 45, 16],
    text: 'A large header, an evidence window, a metadata rail, annotations, context at the bottom, paper seams, and sparse dense rhythm.',
  },
  {
    id: 'treatment',
    title: 'Image treatment library',
    bounds: [47, 72, 52, 13],
    text: 'Degraded scans, photocopy loss, halftone surveillance, burned archives, wet field files, and microfilm artifacts.',
  },
  {
    id: 'motifs',
    title: 'Visual motif library',
    bounds: [1, 85, 98, 7],
    text: 'Redaction bars, coordinate marks, classification stamps, archive glyphs, clips, handwriting, scanlines, graph paper, and institutional seals.',
  },
] as const

export const studyStages = [
  {id: 'foundation', label: 'Visual Foundation', ordinal: '01', next: 'Enter Trinity'},
  {
    id: 'trinity',
    label: 'Trinity · The Threshold Event',
    ordinal: '02',
    next: 'Follow the disclosure',
  },
  {
    id: 'disclosure',
    label: 'Controlled Revelation',
    ordinal: '03',
    next: 'Return to visual foundation',
  },
] as const

export const documentLayers = [
  {
    id: 'approved',
    label: 'Approved narrative',
    title: 'Released account',
    text: 'A public account can explain an achievement while leaving its technical mechanisms outside the released record.',
  },
  {
    id: 'mechanisms',
    label: 'Withheld mechanisms',
    title: 'Technical boundary',
    text: 'The reference artwork depicts a withheld technical note. Its extraordinary propulsion language is illustrative artwork, not a sourced finding.',
  },
  {
    id: 'context',
    label: 'Operational context',
    title: 'What remains unresolved',
    text: 'An omission identifies a boundary in what was released. It does not establish what lies beyond that boundary.',
  },
] as const
