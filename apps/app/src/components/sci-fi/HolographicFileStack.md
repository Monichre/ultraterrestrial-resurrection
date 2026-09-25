# Holographic File Stack

**Updated:** 2026-07-23 13:15:00 CDT

## Summary

`HolographicFileStack` renders a configurable collection of document planes in a React
Three Fiber canvas. Files float subtly at rest, scale on hover, and separate into a
centered fan when clicked. Storybook covers representative, default, empty, single-file,
and zero-value configurations.

## Modules

- `holographic-file-stack.tsx` — public data contracts, canvas shell, scene mapping, and
  per-file interaction/animation.
- `holographic-file-stack.stories.tsx` — Storybook metadata, controls, layout decorator,
  and visual boundary cases.
- `HolographicFileStack_PSUEDOCODE.md` — implementation sequence and verification plan.

## Component architecture

1. `HolographicFileStack` owns the DOM wrapper, camera, lights, and orbit controls.
2. `Scene` converts each file descriptor into a stable indexed plane and derives its
   resting depth from `spacing`.
3. `File` owns local hover/expanded state and updates Three.js transforms through
   `useFrame`.
4. `THREE.MathUtils.damp` makes transform interpolation independent of frame rate.
5. `rotationFactor` controls the expanded fan angle around the stack center.

## Data flow

`files + spacing + rotationFactor`
→ `HolographicFileStack`
→ `Scene`
→ indexed `File` props
→ local pointer state
→ damped mesh position, rotation, scale, and emissive intensity.

The component is client-only and performs no persistence, network requests, or shared
state mutation.

## Accessibility

The canvas wrapper exposes a file-count summary. Individual Three.js meshes remain
pointer-driven because WebGL scene nodes are not DOM focus targets; DOM controls should
be added if expansion becomes a product-critical action rather than visual inspection.

## Verification

- Targeted ESLint: passed.
- Workspace TypeScript output: no errors for either holographic file-stack source file.
- Storybook static build: passed with Storybook 9.1.6.
- IDE diagnostics: no errors in the component or story.
