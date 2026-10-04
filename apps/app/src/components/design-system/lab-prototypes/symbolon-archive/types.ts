export type SymbolonNav = 'Idx. Archive' | 'Methodology' | 'Transmit'

export interface ArchiveEntry {
  code: string
  title: string
  desc: string
}

export interface ReferenceItem {
  code: string
  desc: string
}
