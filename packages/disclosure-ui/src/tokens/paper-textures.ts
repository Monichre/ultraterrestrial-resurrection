/** Paper texture paths — served from `/disclosure-ui` (package assets). */
export const PAPER_TEXTURES = {
  groove: '/disclosure-ui/textures/paper/groove-paper.png',
  fabric: '/disclosure-ui/textures/paper/fabric-of-squares.png',
  grid: '/disclosure-ui/textures/paper/grid-noise.png',
  twill: '/disclosure-ui/textures/paper/debut-twill.png',
  inflicted: '/disclosure-ui/textures/paper/inflicted-grid.png',
} as const

export type PaperTextureKey = keyof typeof PAPER_TEXTURES
