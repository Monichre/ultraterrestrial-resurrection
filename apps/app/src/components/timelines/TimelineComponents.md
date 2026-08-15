# Timeline Components Repair

**Completed:** 2026-07-23 13:43:12 CDT
**Branch:** `dev`
**Scope:** `apps/app/src/components/timelines/**`

## Summary

Removed every TypeScript and ESLint diagnostic from the timeline component subtree.
The repair updates the components for React 19 callback-ref semantics, gives draggable
timeline data an explicit shared contract, aligns stories with the configured Next.js
Storybook renderer, and replaces the scroll-through prototype's retired Xata dependency
and static mock gallery with typed Postgres event records.

## Component architecture

- `3d-timeline/ThreeDTimeline.tsx`
  - Owns GSAP depth/scroll presentation.
  - Accepts typed `ThreeDTimelineSlide` records.
  - Uses void callback refs and accessible Next.js images.
- `draggable-timeline/`
  - `types.ts` owns the shared `DraggableTimelineItem` contract.
  - `draggable-timeline.tsx` renders navigation from typed items.
  - `Section.tsx` renders the corresponding event section and image.
- `scroll-through-timeline/scroll-through-timeline.tsx`
  - Accepts `EventsRecord[]` from `@db/postgres`.
  - Filters records by the optional active year.
  - Renders source-backed event metadata, optional photos, or an honest empty state.
- `timeline/Timeline.tsx`
  - Owns the GSAP horizontal navigation and section transitions.
  - Uses React 19-compatible indexed refs and accessible Next.js images.
- Story files provide typed fixtures through `@storybook/nextjs`.
- Barrel files expose all four timeline variants and their public contracts.

## Data flow

```text
Typed fixture or Postgres EventsRecord[]
  -> timeline props
  -> optional active-year filter
  -> declarative item/section mapping
  -> Next.js image boundary
  -> GSAP or Framer Motion presentation
```

The scroll-through variant no longer translates a legacy Xata photo object. It consumes
the live Postgres `photos: string[] | null` contract directly and selects the first
supported HTTP(S) or root-relative source image. Historical timestamps are formatted in
UTC so a midnight record cannot shift into the previous calendar day in local time.

## Files affected

- `TimelineComponents_PSUEDOCODE.md`
- `TimelineComponents.md`
- `index.tsx`
- `3d-timeline/ThreeDTimeline.tsx`
- `3d-timeline/ThreeDTimeline.stories.tsx`
- `draggable-timeline/types.ts`
- `draggable-timeline/draggable-timeline.tsx`
- `draggable-timeline/draggable-timeline.stories.tsx`
- `draggable-timeline/Section.tsx`
- `draggable-timeline/index.tsx`
- `scroll-through-timeline/scroll-through-timeline.tsx`
- `scroll-through-timeline/index.tsx`
- `timeline/Timeline.tsx`
- `timeline/Timeline.stories.tsx`

## Verification

- `bunx eslint src/components/timelines` — passed with zero errors and zero warnings.
- Full `bunx tsc --noEmit --pretty false`, filtered to `src/components/timelines/`
  — zero timeline diagnostics; unrelated app-wide baseline errors remain.
- `bun run build` — passed and generated all 28 static pages.
- `git diff --check -- apps/app/src/components/timelines` — passed.
- IDE diagnostics for edited timeline sources — clear.

The build still reports pre-existing warnings for re-exported `/api/client-logs` route
configuration, deprecated `fetchConnectionCache`, and a missing `metadataBase`; none
originates in the timeline subtree.
