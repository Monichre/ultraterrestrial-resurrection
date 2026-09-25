# Design Downloads Ingest — Pseudocode

**Date:** 2026-07-24  
**Source:** `~/Downloads` (Formation°, Neuform HTML + DESIGN.md, classified-document)  
**Goal:** Ingest all four tracks into `apps/app` without overwriting production document components.

## Track A — Formation°

```
apps/app/src/components/sci-fi/formation/
  perlin.ts              # Gustavson perlin3
  surfaces.ts            # 7 SurfaceConfig presets
  Formation.tsx          # R3F canvas (named + default export)
  FormationUI.tsx        # chrome around canvas
  formation-ui.css
  formation.stories.tsx
  index.ts
  Formation.md
```

1. CONFIRM surfaces.ts / perlin.ts exist (extracted from ui.html).
2. COPY Formation.tsx + FormationUI.tsx + formation-ui.css; rewrite relative imports; use named exports; `'use client'`.
3. ADD Storybook stories (canvas-only + full UI).
4. EXPORT from `sci-fi/index.ts`.
5. LEAVE donor README / ui.html as provenance note in Formation.md (do not copy HTML demo into app).

## Track B — Lab HTML prototypes

```
lab-prototypes/
  diagnostic-architecture/   # SVG + GSAP (planned)
  cognitive-routing-framework/  # simple Three + GSAP
  monolith-engine/           # Three bloom + ScrollTrigger
  index.ts                   # barrel
  LabPrototypes.md           # update inventory
```

Per component: `'use client'`, scoped CSS root, Lucide (no Iconify), npm three/gsap (no CDN), Storybook fullscreen story.

## Track C — DESIGN.md tokens

```
docs/design/neuform-sources/
  {slug}-DESIGN.md   # copy token contracts as-is
  README.md          # index linking HTML companions / lab components
```

Copy unique DESIGN.md files (dedupe `(1)` / `(2)`). No component code.

## Track D — Classified document variant

```
reference-prototype/classified-documents/HardcodedClassifiedStack.tsx
  + story entry OR classified-documents/hardcoded-classified-stack.stories.tsx
```

1. COPY Downloads/classified-document.tsx → HardcodedClassifiedStack (named export).
2. REWRITE PhotoCaption / Card imports to app paths.
3. DO NOT overwrite ClassifiedDocument.tsx / research-ui production docs.

## Non-goals

- No gallery route unless already present (optional follow-up).
- No overwrite of `@/components/paper-document` letter/memo.
- No CDN Tailwind / Iconify / Google Fonts in shipped components.
