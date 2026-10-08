---
version: anydesign-element-1
name: wireframe globe HUD plate
source: extractions/globe-hud-process-refs/globe-hud-process-refs.png
captured_at: 2026-08-13
kind: hybrid
palette:
  - "#010101"
  - "#2d2517"
  - "#5c4c32"
---

# Image-to-prompt — `globe-hud-process-refs`

Kind: **hybrid** — readout chrome is code; the wireframe globe is an asset (or
WebGL in product).

### Canonical prompt (structured)

SUBJECT: a wireframe globe with orbital annotation arcs and monospaced
coordinate readouts, instrument bronze on a black field
STYLE / MEDIUM: aerospace HUD plate, crisp vector lines, flat
COMPOSITION & CAMERA: ultra-wide banner 2.5:1, globe left-of-center, arcs
sweeping diagonally, readouts pinned to edges
LIGHTING: self-lit lines on void; no scene light
PALETTE: #010101 field, #2d2517 secondary, #5c4c32 bronze instrumentation
MOOD: geodetic, nocturnal, surveillance-calm
BACKGROUND / INTEGRATION: scene — black void baked in
AVOID: no photoreal Earth, no blue glow, no bloom, no 3D bevels, no extra hues

### Natural-language version

An ultra-wide aerospace HUD plate: a wireframe globe left-of-center with
sweeping orbital annotation arcs and small mono coordinate readouts, all in
warm bronze (#5c4c32) on a pure black field, crisp flat vector lines, no glow,
no photorealism — the planet as a queryable dataset.

### Model adaptation notes

- **Midjourney**: `--ar 5:2 --style raw`. **SD/Flux**: AVOID → negative.
- Product note: globe renders WebGL; this plate is the composition contract.
