# Html Sources Ingest — Pseudocode

**Date:** 2026-08-06  
**Source:** `~/Downloads` (technical-brand-geometry-1, ui/ui(1), diagnostic-architecture, monolith-engine, Formation.tsx, FormationUI.tsx)  
**Goal:** Land the Downloads set into `apps/app/src/components` without clobbering already-adapted React ports.

## Layout

```
lab-prototypes/
  html-sources/                          # provenance HTML (viewable via public mirror)
    technical-brand-geometry-1.html
    diagnostic-architecture-model-teardown.html
    monolith-engine.html
    formation-ui.html                    # from ui.html (== ui (1).html)
  technical-brand-geometry/              # NEW React iframe shell + stories
    TechnicalBrandGeometry.tsx
    TechnicalBrandGeometry.stories.tsx
    index.ts
    TechnicalBrandGeometry.md
    TechnicalBrandGeometry_PSUEDOCODE.md

sci-fi/formation/                        # ALREADY PORTED — do not overwrite TSX
  ui.html                                # vanilla Formation° donor HTML only

public/lab-prototypes/                   # served for iframe src=
  *.html                                 # mirrors of html-sources/
```

## Steps

1. CONFIRM cwd is repo root `ultraterrestrial-resurrection`.
2. MKDIR `lab-prototypes/html-sources` + `public/lab-prototypes` + `technical-brand-geometry/`.
3. COPY four unique HTML files (dedupe `ui.html` / `ui (1).html` → `formation-ui.html`).
4. MIRROR HTML into `public/lab-prototypes/` so Storybook iframes can `src=` them.
5. SKIP overwrite of `sci-fi/formation/Formation.tsx` + `FormationUI.tsx` (adapted named exports + `'use client'` already ship).
6. COPY `ui.html` → `sci-fi/formation/ui.html` as donor provenance.
7. COPY `technical-brand-geometry-1-DESIGN.md` → `docs/design/neuform-sources/`.
8. ADD `TechnicalBrandGeometry` iframe shell + fullscreen Storybook story.
9. EXPORT from `lab-prototypes/index.ts`; update inventory markdown.
10. VERIFY files exist via `ls`; do not claim visual dogfood without Storybook run.
