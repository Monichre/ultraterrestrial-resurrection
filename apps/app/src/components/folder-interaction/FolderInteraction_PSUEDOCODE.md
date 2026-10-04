# FolderInteraction — Pseudocode

1. Client component with `isOpen` toggle on click.
2. Three `motion.div` pages spring from nested stack → fanned open positions.
3. Folder flap SVG rotates on X (`rotateX`) with spring when open.
4. Scoped SVG gradient/clip IDs via `useId()` for multi-instance safety.
5. Perspective on wrapper so flap 3D reads correctly.
6. Storybook: centered dark canvas Default + Open.
