### Goal

Align `DraggableStack` visuals with brand/design used in `Polaroid` components by reusing shared UI elements and classes.

### Approach

- Keep drag behavior and z-index bumping exactly as-is.
- Replace `motion.img` card with a `motion.div` wrapper that:
  - Is absolutely positioned and rotated like before
  - Uses `drag` with the same `dragConstraints`
  - Contains brand elements: two `MaskingTape` components and a framed image area
- Reuse Polaroid styling cues:
  - Neutral paper background with padding: `bg-neutral-200 pt-4 px-2 pb-16`
  - Image fills the polaroid area: `object-cover h-full w-full`
  - Use existing `MaskingTape` component from `@/components/design-system/masking-tape`

### Component Diffs (high level)

- Import `MaskingTape`.
- Change `DragCard` return from `motion.img` to `motion.div` with nested `<img>` using Polaroid classes.
- Preserve props (`top`, `left`, `rotate`, `className`) and z-index behavior.

### Edge Cases

- Ensure drag constraints still apply (now on wrapper `motion.div`).
- Maintain `drag-elements` class for z-index computation.

### Out of Scope

- No typography/name caption like `PolaroidBasic` — only frame + tape alignment.
- No refactor of demo data or container layout.
