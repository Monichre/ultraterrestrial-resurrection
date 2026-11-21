# Holographic File Stack Pseudocode

**Updated:** 2026-07-23 13:05:31 CDT  
**Scope:** `HolographicFileStack` component and Storybook stories

## Component contract

1. Define an immutable file descriptor with `id`, `title`, and `color`.
2. Accept an optional file list, stack spacing, expansion rotation factor, and wrapper class.
3. Use stable default files when the caller omits the file list.
4. Preserve explicit zero values for spacing and rotation.

## Render flow

1. Render a fixed-height wrapper that owns the accessible label.
2. Mount a React Three Fiber canvas with bounded device-pixel ratio and shadows.
3. Configure ambient, spot, and point lighting.
4. Position the camera once at `[0, 0, 4]`.
5. Map each file with the array index supplied by `map`; never search the array again.
6. Derive each file's resting z-position from `index * spacing`.
7. Render orbit controls with pan and zoom disabled.

## File interaction and motion

1. Store hover and expanded state per file plane.
2. On pointer entry:
   - stop propagation;
   - mark the file hovered;
   - show a pointer cursor.
3. On pointer exit, clear hover state.
4. On click:
   - stop propagation;
   - toggle expansion with a functional state update.
5. During each frame:
   - derive a centered index from `index` and `totalFiles`;
   - when expanded, increase z separation and rotate around x/y using `rotationFactor`;
   - when collapsed, return to the original transform;
   - retain the requested subtle floating motion while collapsed;
   - damp transforms by elapsed frame time so motion is frame-rate independent;
   - damp hover scale toward `1.1`, otherwise toward `1`.
6. Do not attach DOM-only keyboard or focus props to a Three.js mesh.

## Storybook

1. Import Storybook types from the configured Next.js framework package.
2. Register the story under `Sci-Fi/HolographicFileStack`.
3. Render stories inside a deterministic width wrapper.
4. Provide:
   - a representative multi-file stack;
   - default-props coverage;
   - a single-file boundary case;
   - an empty-list boundary case;
   - zero spacing and zero rotation controls to prove zero values are respected.
5. Enable autodocs and dark background rendering.

## Verification

1. Run ESLint against the component and story.
2. Run the workspace TypeScript check and filter for these files.
3. Build Storybook to verify static compilation and story indexing.
4. Confirm IDE diagnostics are clear for all touched source files.
