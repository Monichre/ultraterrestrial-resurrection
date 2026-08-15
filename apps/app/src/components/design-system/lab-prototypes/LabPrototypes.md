# Lab Prototypes

**Updated:** 2026-08-07

Storybook-ready Neuform / lab HTML + React ports under `design-system/lab-prototypes/`.

## Inventory

| Component | Folder | Source | Notes |
| --- | --- | --- | --- |
| `SymbolonArchive` | `symbolon-archive/` | `react-app.js` | archival shell |
| `PlanetaryTransit` | `planetary-transit/` | `react-app (2).js` | mobile orbital HUD |
| `EnergyInputHub` | `energy-input-hub/` | `react-app (4).js` | glass synth + cards |
| `DiagnosticArchitecture` | `diagnostic-architecture/` | HTML | SVG explode + GSAP |
| `CognitiveRoutingFramework` | `cognitive-routing-framework/` | HTML | Three icosahedron |
| `MonolithEngine` | `monolith-engine/` | HTML | bloom + ScrollTrigger |
| `TechnicalBrandGeometry` | `technical-brand-geometry/` | HTML | iframe shell |

Related (already ported elsewhere): `OryzaeTimeline` from `react-app (3).js` → `@/components/oryzae-timeline` (Storybook: **Components / OryzaeTimeline**).

Raw HTML donors also live in `html-sources/` and are mirrored to `public/lab-prototypes/` for iframe `src`.

## Import

```tsx
import {
  DiagnosticArchitecture,
  CognitiveRoutingFramework,
  EnergyInputHub,
  MonolithEngine,
  PlanetaryTransit,
  SymbolonArchive,
  TechnicalBrandGeometry,
} from '@/components/design-system/lab-prototypes'
```

## Storybook

**Design System / Lab Prototypes /***

## Related

- Token contracts: `docs/design/neuform-sources/`
- Ingest plan: `DesignDownloadsIngest_PSUEDOCODE.md`
- HTML ingest: `HtmlSourcesIngest.md`
- Formation° (separate): `@/components/sci-fi/formation`
