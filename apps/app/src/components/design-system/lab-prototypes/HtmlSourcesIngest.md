# Html Sources Ingest

**Date:** 2026-08-06  
**Source:** `~/Downloads` (technical-brand-geometry-1, ui / ui(1), diagnostic-architecture, monolith-engine, Formation.tsx, FormationUI.tsx)

## Verdict

Downloads set landed under `apps/app` components. Adapted Formation / Diagnostic / Monolith React ports were **not** overwritten.

## What landed

| Download | Destination |
| --- | --- |
| `technical-brand-geometry-1.html` | `lab-prototypes/html-sources/` + `technical-brand-geometry/` + `public/lab-prototypes/` |
| `technical-brand-geometry-1-DESIGN.md` | `docs/design/neuform-sources/` |
| `diagnostic-architecture-model-teardown.html` | `html-sources/` + `diagnostic-architecture/source.html` + public mirror |
| `monolith-engine.html` | `html-sources/` + `monolith-engine/source.html` + public mirror |
| `ui.html` (= `ui (1).html`) | `html-sources/formation-ui.html` + `sci-fi/formation/ui.html` + public |
| `Formation.tsx` / `FormationUI.tsx` | **skipped** — adapted ports already at `sci-fi/formation/` |

## New component

`TechnicalBrandGeometry` — iframe shell → `/lab-prototypes/technical-brand-geometry-1.html`  
Storybook: **Design System / Lab Prototypes / TechnicalBrandGeometry**

```tsx
import { TechnicalBrandGeometry } from '@/components/design-system/lab-prototypes'
```

## Already present (unchanged)

```tsx
import { Formation, FormationUI } from '@/components/sci-fi/formation'
import {
  DiagnosticArchitecture,
  MonolithEngine,
} from '@/components/design-system/lab-prototypes'
```

## Not done

- Native React/Three port of Technical Brand Geometry
- Visual dogfood of the iframe shell in Storybook (UNVERIFIED this session)
