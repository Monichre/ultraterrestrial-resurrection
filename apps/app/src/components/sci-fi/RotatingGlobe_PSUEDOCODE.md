# Rotating Globe Pseudocode

**Updated:** 2026-07-23 16:35:00 CDT  
**Scope:** `RotatingGlobe` R3F hemisphere + city markers

## Component contract

1. Accept optional cities, idle rotation speed, initial yaw, height, background color, and click-sound toggle.
2. Default cities to `ROTATING_GLOBE_DEFAULT_CITIES` when omitted.
3. City descriptor: `lat`, `lng`, `city`, optional `sublabel`, optional `dots`.
4. Client-only component (`'use client'`).

## Scene composition

1. Mount a full-size pointer surface with grab cursor and `touch-action` that allows vertical pan.
2. Create an R3F `Canvas` with fixed FOV camera aimed at `(0, 0.75, 0)`.
3. Light with two directional whites.
4. Inside a rotating group:
   - outer atmosphere shader (backside, additive)
   - dark base hemisphere
   - equator ray segments
   - inner mask + fresnel glow
   - instanced surface dot grid
   - south-pole rod
   - scattered city dots (seeded hash scatter)
   - HTML city labels with horizon culling

## Interaction

1. Pointer down: capture pointer, seed AudioContext when `clickSound`, mark dragging.
2. Pointer move: convert `dx` to yaw delta (touch vs mouse sensitivity).
3. Pointer up/cancel/lost capture: release and resume idle spin.
4. Each frame: spring velocity toward `idleRotation` when not dragging; apply yaw; optionally fire tick audio on angular steps.

## Storybook

1. Register under `Sci-Fi/RotatingGlobe`.
2. Stories: Default, WithClickSound, CustomCities, CompactHeight.
3. Dark background, fixed viewport height decorator.

## Verification

1. ESLint on component + story.
2. Typecheck filter for rotating-globe paths.
