# PlanetaryTransit — Pseudocode

**Source:** `~/Desktop/lab/WEB & UI DESIGN/react-app (2).js`  
**Date:** 2026-08-07

## Goal

Port the mobile orbital transit HUD into a Storybook-ready client component under `lab-prototypes/planetary-transit/`.

## Steps

1. Drop `react-router` — render `PlanetaryTransitPage` as the named export surface.
2. Scope styles under `.pt-root` (phone frame 400×867 on dark stage).
3. Load fonts via shared `useSymbolonFonts`.
4. Starfield: WebGL shader when available; 2D star scatter fallback otherwise.
5. Keep planet marker RAF orbit independent of WebGL success.
6. Export fixtures (houses, observatory meta) + fullscreen Storybook stories.
