---
version: anydesign-1
name: spacetime-storyboards — temporal compare concept
source: extractions/spacetime-storyboards/spacetime-storyboards.png
captured_at: 2026-08-13
description: |
  The Temporal Observatory as a console: near-black teal field, geography as
  the canvas, instrumentation pushed to the edges. Motion is compositional —
  time slices compared by juxtaposition, not animation chrome.
colors:
  primary: "#2b2e2c"
  surface: "#131718"
  text-primary: "#2b2e2c"
  border: "#2b2e2c"
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — spacetime storyboard (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Temporal-compare console concept: map-as-canvas on near-black teal, HUD
restrained to the edges. Cinematic but instrumented.

## 1. Visual identity

**Personality**: nocturnal, cartographic, speculative.
**Mood**: time as terrain.
**References**: situational-awareness consoles; observatory instruments.
**Confidence**: ✅ palette, ❓ interaction model (storyboard only).

### 1.3 The ONE brand thing

The dark teal-black field (`#131718`) as "deep time" ground — brighter chrome
would break the observatory spell.

## 2. Tokens

Measured: `design-tokens.md`. Chroma gate failed → no `--color-primary` emitted;
accent decisions belong to the live app token set, not this frame.

## 4. Layout & composition

Central geographic mass; edge rails for temporal controls; comparison by
spatial juxtaposition (before/after panes), not page transitions.

## 6. Do's and Don'ts

**Do**: keep instrumentation at the edges; keep the field near-black; let map
detail carry luminescence.
**Don't**: no bright sidebars; no modal chrome over the field; no hue accents.

## 7. Open questions

- Temporal scrubber pattern + breakpoints ❓ (storyboard is a single frame)
