export type GalleryImage = {
  id: string
  src: string
  alt: string
  register: 'archival-material' | 'techno-analytical' | 'neutral'
  tags: string[]
  credit?: string
}

export type GallerySection = {
  id: string
  title: string
  description: string
  items: GalleryImage[]
}
