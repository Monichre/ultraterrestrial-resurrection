### DraggableStack – Brand Alignment Update

This component now uses the same visual language as `Polaroid` components.

Key changes:

- Replaced raw `motion.img` with a `motion.div` polaroid wrapper.
- Added `MaskingTape` elements on left/right for brand consistency.
- Preserved drag behavior, constraints, and z-index bumping.
- Kept sizing via existing `className` and absolute positioning props.

No API changes to the exported symbols. `DragCards` now forwards its `ref` for proper `dragConstraints` typing.
