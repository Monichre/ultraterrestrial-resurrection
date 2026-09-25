# DiagnosticArchitecture — Pseudocode

**Source:** `~/Downloads/diagnostic-architecture-model-teardown.html`
**Design tokens:** `~/Downloads/diagnostic-architecture-model-teardown-DESIGN.md`
**Date:** 2026-07-24

## Goal

Port the Neuform "Diagnostic Architecture // Model Teardown" HTML prototype into a Next.js client lab component with scoped CSS, GSAP (npm), and Lucide icons.

## Files

```
diagnostic-architecture/
  DiagnosticArchitecture.tsx   # 'use client', named export
  diagnostic-architecture.css  # scoped under .da-root
  fixtures.ts                  # nav modes, nodes, load bars, telemetry, annotations
  index.ts
  DiagnosticArchitecture.stories.tsx
  DiagnosticArchitecture.md
```

## Structure

1. Root `.da-root` — full viewport black shell, overflow hidden, select-none
2. Background layers — halftone dither, 64px technical grid, radial vignette
3. Framing — inset border + four SVG corner reticles
4. Header — kernel label + title; Topology/Wireframe/Metrics nav; system status bars
5. Left aside — Active Nodes + Load Dist meters
6. Right aside — Telemetry Stream log
7. Main SVG — exploded wireframe (4 layers + struts + annotations)
8. Footer — playback controls, scrub timeline, Engage Sys / Isolate actions

## Motion (GSAP, scoped to rootRef)

1. Exploded layers: from y:50, scale:0.95, opacity:0 → settle stagger 0.15
2. Struts: scaleY 0→1 from bottom
3. Annotations group opacity + connector strokeDashoffset draw
4. Annotation markers/text fade + micro x offset
5. Continuous sine drift on base / housing / capacitor layers

## Constraints

- gsap from npm; lucide-react icons (no Iconify CDN)
- Scope SVG pattern id via useId()
- Query selectors relative to rootRef only
- Kill GSAP timelines/tweens on unmount
- Single quotes, no semicolons, named exports
