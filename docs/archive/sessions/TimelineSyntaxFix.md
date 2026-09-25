# Timeline Syntax Fix

## Overview
Fixed syntax errors in `apps/app/src/features/timeline/3d-z-axis-timeline.tsx` where multi-line double-quoted strings were causing build failures.

## Changes

### apps/app/src/features/timeline/3d-z-axis-timeline.tsx
- Collapsed multi-line `className` strings to single lines in:
  - `EventCard` component (Link element)
  - `ZAxisTimeline3D` component (Navigation buttons)

## Impact
- Resolves `Module parse failed: Unterminated string constant` error.
- Enables successful compilation of the timeline feature.
