## GalleryFlow – Pseudocode

Goal: Interactive image gallery with multiple animation variants, autoplay, thumbnails, arrows, and dots.

State

- currentIndex: number
- isHovered: boolean
- isDragging: boolean
- slideDirection: 1 | -1
- dragX spring, opacity transform (for flow variant)

Props

- images[{ src, alt?, caption? }]
- variant: 'flow' | 'fade' | 'slide' | 'stack' (default: flow)
- thumbnailPosition: 'bottom' | 'left' | 'right' (default: bottom)
- autoPlay: boolean (default: false)
- interval: number ms (default: 3000)
- showArrows, showThumbnails, showDots: boolean
- aspectRatio: 'square' | 'video' | 'portrait' | 'auto' (default: video)
- fillMode: 'cover' | 'contain' (default: cover)
- thumbnailSize: 'sm' | 'md' | 'lg' (default: md)
- loop: boolean (default: true)

Derived CSS classes

- aspectRatioClass map
- thumbnailSizeClass map
- thumbnailContainerClass map

Autoplay effect

- if autoPlay && !isHovered && !isDragging
  - setInterval: advance index; stop if last and !loop
  - clearInterval on cleanup

Handlers

- handleNext: if last && !loop -> return; else increment index (wrap with %)
- handlePrev: if first && !loop -> return; else decrement index (wrap with %)
- handleThumbnailClick(i): set direction based on i vs currentIndex; set index
- handleDragStart: isDragging = true
- handleDragEnd: isDragging = false; if dragX > threshold -> prev; if < -threshold -> next; reset dragX

Render

- Root <div> with hover handlers
- Viewport with aspect ratio class
- AnimatePresence around a motion div keyed by currentIndex
  - initial/animate/exit/transition switch on variant
  - drag only when variant === 'flow' (x-axis)
  - inner motion.div wraps Next <Image />
  - optional caption overlay
- Optional arrow buttons (prev/next) with disabled logic when !loop
- Optional dots: map images -> button; active styling
- Optional thumbnails container (position variants)
  - map images -> motion.button with hover/tap scale; inner Image fill

Exports

- Named export: { GalleryFlow }
