---
version: anydesign-1
name: globe-hud-process-refs
source: extractions/globe-hud-process-refs/globe-hud-process-refs.png
captured_at: 2026-08-13
description: |
  Aerospace-grade process reference: a wireframe globe carrying bronze
  telemetry on a black field. Warm metal on void — the same chroma story as
  the desk SoT, translated to geodesy.
colors:
  primary: "#5c4c32"
  surface: "#010101"
  text-primary: "#5c4c32"
  border: "#2d2517"
typography:
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — globe HUD process ref (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Wireframe globe + bronze telemetry on black. Geodetic HUD register: precise,
nocturnal, surveillance-calm.

## 1. Visual identity

**Personality**: geodetic, instrumented, technical.
**Mood**: the planet as dataset.
**References**: aerospace telemetry overlays, mission-control HUDs.
**Confidence**: ✅ palette, ✅ composition, ⚠️ fine readout text (below legibility).

### 1.3 The ONE brand thing

Bronze-on-black instrumentation (`#5c4c32` on `#010101`) — the warm-metal
signal discipline shared with the desk SoT.

## 2. Tokens

Measured: `design-tokens.md`. `--color-primary` `#5c4c32` passed the sat/share
gate — bronze is the accent here.

## 4. Layout & composition

Globe mass left-of-center; arcs create diagonal sweep; readout columns pinned
to edges. Motion (MotionViz read): the arcs imply slow orbital drift —
compositional rhythm, not animation garnish.

## 6. Do's and Don'ts

**Do**: keep all instrumentation mono; keep bronze scarce; let the void dominate.
**Don't**: no blue-Earth photorealism; no glow bloom on arcs; no second accent.

## 7. Open questions

- Live-data binding (is this Mapbox/Globe.gl in product?) — likely ❓⚠️
