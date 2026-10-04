import { PAPER_TEXTURES } from '../tokens/paper-textures'

import type { GalleryImage, GallerySection } from './types'

const textureEntries = Object.entries( PAPER_TEXTURES ).map( ( [key, src] ) => ( {
  id: `texture-${key}`,
  src,
  alt: `Paper texture — ${key}`,
  register: 'archival-material' as const,
  tags: ['texture', 'paper', key],
} ) )

export const IMAGE_GALLERY = {
  textures: Object.fromEntries(
    textureEntries.map( ( item ) => [item.id.replace( 'texture-', '' ), item] )
  ) as Record<keyof typeof PAPER_TEXTURES, GalleryImage>,
  motifs: {
    filmGrain: {
      id: 'motif-film-grain',
      src: '/disclosure-ui/textures/microfilm-grain.svg',
      alt: 'Microfilm grain overlay',
      register: 'archival-material',
      tags: ['motif', 'grain', 'microfilm'],
    },
    hudGrid: {
      id: 'motif-hud-grid',
      src: '/disclosure-ui/textures/hud-grid.svg',
      alt: 'Techno-analytical HUD grid',
      register: 'techno-analytical',
      tags: ['motif', 'grid', 'hud'],
    },
  } satisfies Record<string, GalleryImage>,
} as const

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: 'paper-textures',
    title: 'Paper textures',
    description: 'Archival-material register backgrounds for dossiers and evidence cards.',
    items: Object.values( IMAGE_GALLERY.textures ),
  },
  {
    id: 'motifs',
    title: 'Motifs',
    description: 'Reusable overlays — film grain, HUD grids, classification chrome.',
    items: Object.values( IMAGE_GALLERY.motifs ),
  },
]

export function listGalleryImages( filter?: {
  register?: GalleryImage['register']
  tag?: string
} ): GalleryImage[] {
  const all = GALLERY_SECTIONS.flatMap( ( section ) => section.items )

  if ( !filter ) return all

  return all.filter( ( item ) => {
    if ( filter.register && item.register !== filter.register ) return false
    if ( filter.tag && !item.tags.includes( filter.tag ) ) return false
    return true
  } )
}
