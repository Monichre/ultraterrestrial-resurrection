# Design Downloads Ingest

**Date:** 2026-07-24  
**Source:** `~/Downloads` (Formation°, Neuform HTML + DESIGN.md, classified-document)

## Verdict

All four tracks ingested into `apps/app` / `docs/design` without overwriting production document components.

## Track A — Formation°

`apps/app/src/components/sci-fi/formation/`

- `Formation` + `FormationUI` + surfaces/perlin
- Storybook: **Sci-Fi/Formation**
- Exported from `@/components/sci-fi`

## Track B — Lab HTML prototypes

`apps/app/src/components/design-system/lab-prototypes/`

| Component | Storybook |
| --- | --- |
| `DiagnosticArchitecture` | Design System / Lab Prototypes / DiagnosticArchitecture |
| `CognitiveRoutingFramework` | …/CognitiveRoutingFramework |
| `MonolithEngine` | …/MonolithEngine |

Barrel: `@/components/design-system/lab-prototypes`

## Track C — DESIGN.md tokens

`docs/design/neuform-sources/` — 9 unique DESIGN.md files + README index. Token-only (AeroNet, aether-node, roadmap, futuristic, zenith, system-interface) parked for later HTML/ports.

## Track D — Classified stack

`reference-prototype/classified-documents/HardcodedClassifiedStack.tsx` — donor hardcoded Card stack; production `ClassifiedDocument` untouched.

## Import cheatsheet

```tsx
import { Formation, FormationUI } from '@/components/sci-fi/formation'
import {
  DiagnosticArchitecture,
  CognitiveRoutingFramework,
  MonolithEngine,
} from '@/components/design-system/lab-prototypes'
import { HardcodedClassifiedStack } from '@/components/design-system/research-ui/documents/reference-prototype'
```
