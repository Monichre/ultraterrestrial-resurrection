### GalleryFlow Component

**Location**: `apps/app/src/components/animated/gallery/gallery-flow.tsx`

**Export**: Named export `{ GalleryFlow }` (re-exported from `animated/gallery/index.tsx`).

**Description**
A versatile image gallery with variants: flow (drag), slide, fade, and stack (3D-like). Supports autoplay, arrows, thumbnails, dots, aspect ratios, and cover/contain modes.

**Props**

- `images`: Array<{ src: string; alt?: string; caption?: string }>
- `variant?`: 'flow' | 'fade' | 'slide' | 'stack' (default: 'flow')
- `thumbnailPosition?`: 'bottom' | 'left' | 'right' (default: 'bottom')
- `autoPlay?`: boolean (default: false)
- `interval?`: number ms (default: 3000)
- `showArrows?`: boolean (default: true)
- `showThumbnails?`: boolean (default: true)
- `showDots?`: boolean (default: false)
- `aspectRatio?`: 'square' | 'video' | 'portrait' | 'auto' (default: 'video')
- `fillMode?`: 'cover' | 'contain' (default: 'cover')
- `thumbnailSize?`: 'sm' | 'md' | 'lg' (default: 'md')
- `loop?`: boolean (default: true)
- `[...divProps]`: React.HTMLAttributes<HTMLDivElement>

**Usage**

```tsx
import { GalleryFlow } from '@/components/animated/gallery'

export function Example() {
  return (
    <GalleryFlow
      images={[
        { src: '/images/one.jpg', alt: 'One', caption: 'First image' },
        { src: '/images/two.jpg', alt: 'Two' },
        { src: '/images/three.jpg', alt: 'Three' },
      ]}
      variant="slide"
      autoPlay
      interval={4000}
      showDots
      aspectRatio="video"
      fillMode="cover"
      thumbnailPosition="bottom"
      thumbnailSize="md"
    />
  )
}
```

**Notes**

- Uses `framer-motion` for transitions and `next/image` for optimized images.
- Dragging is enabled only in `flow` variant. Thumbnails and dots update current slide.
- Arrows disable at ends when `loop={false}`.
