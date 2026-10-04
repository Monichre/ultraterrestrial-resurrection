/** Tileable paper / document textures under `public/textures/paper/`. */

export const PAPER_TEXTURE = {
  fabricOfSquares: '/textures/paper/fabric-of-squares.png',
  debutTwill: '/textures/paper/debut-twill.png',
  inflictedGrid: '/textures/paper/inflicted-grid.png',
  groovePaper: '/textures/paper/groove-paper.png',
  gridNoise: '/textures/paper/grid-noise.png',
} as const

export type PaperTextureId = keyof typeof PAPER_TEXTURE

export type PaperSurfaceVariant =
  | 'desk'
  | 'drafting'
  | 'research'
  | 'sheet'
  | 'tooth'

export const PAPER_SURFACE_CLASS: Record<PaperSurfaceVariant, string> = {
  desk: 'wd-paper-desk',
  drafting: 'wd-paper-drafting',
  research: 'wd-paper-research',
  sheet: 'wd-paper-sheet',
  tooth: 'wd-paper-tooth',
}

export const PAPER_TEXTURE_META: Array<{
  id: PaperTextureId
  label: string
  use: string
  src: string
}> = [
    {
      id: 'fabricOfSquares',
      label: 'Fabric of Squares',
      use: 'Dense micro-schematic grain for dark desk backings',
      src: PAPER_TEXTURE.fabricOfSquares,
    },
    {
      id: 'debutTwill',
      label: 'Debut Twill',
      use: 'Fine diagonal weave — matte cardstock tooth',
      src: PAPER_TEXTURE.debutTwill,
    },
    {
      id: 'inflictedGrid',
      label: 'Inflicted Grid',
      use: 'Dark graph-paper drafting sheet',
      src: PAPER_TEXTURE.inflictedGrid,
    },
    {
      id: 'groovePaper',
      label: 'Groove Paper',
      use: 'High-contrast hatch for letter sheet tooth',
      src: PAPER_TEXTURE.groovePaper,
    },
    {
      id: 'gridNoise',
      label: 'Grid Noise',
      use: 'Diamond technical grid for research surfaces',
      src: PAPER_TEXTURE.gridNoise,
    },
  ]
