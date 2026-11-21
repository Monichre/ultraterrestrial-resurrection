# EnergyInputHub — Pseudocode

**Source:** `~/Desktop/lab/WEB & UI DESIGN/react-app (4).js`  
**Date:** 2026-08-07

## Goal

Port the Luméa glass synth input + template card cluster into a Storybook-ready client component under `lab-prototypes/energy-input-hub/`.

## Steps

1. Move injected CSS into `energy-input-hub.css`, scoped under `.eih-root` (no global `body`/`html`/`*` rules).
2. Replace `Particle` class with a factory + plain objects.
3. Keep stage states: `idle` → `animating` → `resolved`.
4. Load fonts via `useSymbolonFonts`.
5. Named export `EnergyInputHub` + fullscreen stories (Default, Resolved, WithPresetPrompt).
