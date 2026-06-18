## ProductSwapCard – Pseudocode

Goal: Card that swaps between two thumbnails with vertical slide + fade/scale, with controls and details.

Types

- ProductData: { title, excerpt, createdAt, domain, slug, alt[], techStack[], thumbnail[], actionLabel? }

State

- activeIndex: number
- isTransitioning: boolean

Handlers

- handleSwap: guard isTransitioning; set isTransitioning; increment index (mod length); call onSwap(nextIndex===0); clear transition flag after 600ms

Render

- motion.div wrapper (fade-in)
- Top row: Button with ChevronDown (rotates on second image), clicking calls handleSwap
- Image viewport: AnimatePresence mapping thumbnails -> motion.div absolute
  - animate opacity 1/0, scale 1/0.92, y to slide in/out; border-rounded container with img
- Dots control (bottom-right) to select activeIndex; disabled during transition
- Details: title, excerpt, Link to product slug with ↗ suffix
- Horizontal ScrollArea of tech stack badges, ScrollBar
- Footer: createdAt (time), link to domain

Export

- Named export: { ProductSwapCard }
