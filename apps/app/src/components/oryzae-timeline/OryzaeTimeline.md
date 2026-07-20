# OryzaeTimeline

**Created:** 2026-07-18  
**Source:** [CodePen](https://codepen.io/editor/anelkabag/pen/019dc6a4-8110-7e37-8fae-b5b2ef8ba951)  
**Location:** `apps/app/src/components/oryzae-timeline/`

## Purpose

Dark memory timeline: floating, slightly rotated cards along a vertical teal spine, with range navigation (今日 → 今年), vertical ref sidebar, and scroll chrome.

## Architecture

```
OryzaeTimeline
├── aside (REF.04 / 01 / 02)
├── header (title + NAV_ITEMS)
├── scroll region
│   ├── grid backdrop
│   ├── center spine
│   └── MemoryRow[]
│       ├── FloatCard
│       └── HoverLabel (date / day)
└── footer (scroll-top · progress · count)
```

## Key modules

| File | Role |
|------|------|
| `types.ts` | MemoryNode, CardSpec, nav tokens |
| `fixtures.tsx` | Six sample memories (JP copy) |
| `FloatCard.tsx` | Hover lift + rotate |
| `MemoryRow.tsx` | Left/right spine layout |
| `OryzaeTimeline.tsx` | Full page shell |
| `OryzaeTimeline.stories.tsx` | Storybook catalog |

## Storybook

Title: **Components/OryzaeTimeline**

```bash
cd apps/app && bun run storybook
# → Components / OryzaeTimeline / Default
```

## Props

- `memories` — override sample nodes
- `initialNav` — active range tab
- `showIndexLink` / `indexHref` — fixed Index → control
- `onNavChange` — range tab callback
