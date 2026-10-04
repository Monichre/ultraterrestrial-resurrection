import type { ArchiveEntry, ReferenceItem, SymbolonNav } from './types'

export const SYMBOLON_NAV_ITEMS: SymbolonNav[] = ['Idx. Archive', 'Methodology', 'Transmit']

export const ARCHIVE_ENTRIES: ArchiveEntry[] = [
  {
    code: 'VOL-01',
    title: 'The Peircean Triad Framework',
    desc: 'Structural semiotics and the triadic sign model applied to brand identity architecture.',
  },
  {
    code: 'VOL-02',
    title: 'Phenomenological Color Theory',
    desc: 'Reducing chromatic experience to primary felt qualities before semantic assignment.',
  },
  {
    code: 'VOL-03',
    title: 'Typographic Indexicality',
    desc: 'How letterform choice encodes historical, cultural, and experiential references.',
  },
  {
    code: 'VOL-04',
    title: 'Mark Morphology',
    desc: 'The structural analysis of the "S" symbol and its generative spiral logic.',
  },
]

export const REFERENCE_ITEMS: ReferenceItem[] = [
  { code: 'REF.01.A', desc: 'Peirce, C.S. — Collected Papers Vol. II' },
  { code: 'REF.02.B', desc: 'Eco, U. — A Theory of Semiotics' },
  { code: 'REF.03.C', desc: 'Barthes, R. — Mythologies' },
]
