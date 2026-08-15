# EnergyInputHub

**Updated:** 2026-08-07  
**Source:** `~/Desktop/lab/WEB & UI DESIGN/react-app (4).js`

## Summary

Luméa glass synth input hub with parallax template cards, particle synthesize animation, and resolved skeleton document state.

## Modules

| File | Role |
| --- | --- |
| `EnergyInputHub.tsx` | Client surface + particle synth |
| `energy-input-hub.css` | Scoped `.eih-*` styles |
| `fixtures.ts` | Template cards + copy |
| `EnergyInputHub.stories.tsx` | Fullscreen Storybook |

## Storybook

**Design System / Lab Prototypes / EnergyInputHub**

## Data flow

Story → `EnergyInputHub` → idle glass hub + card cluster → `Synthesize` → particle canvas (`animating`) → skeleton doc (`resolved`).

## Design notes

- Floor measurement grid is an SVG plane (not CSS tiled linear-gradients) to preserve the lab look without the decorative CSS-grid signature.
- Fonts via shared `useSymbolonFonts` (Inter retained as donor face, matching other lab ports).

## Not done

- Dogfood visual audit in running Storybook (**UNVERIFIED**).
- Production route wiring.
