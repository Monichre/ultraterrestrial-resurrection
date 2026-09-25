# PlanetaryTransit

**Updated:** 2026-08-07  
**Source:** `~/Desktop/lab/WEB & UI DESIGN/react-app (2).js`

## Summary

Mobile orbital transit HUD (400×867 phone frame): zodiac house ring, orbiting planet marker, WebGL/2D starfield, zenith nav, observatory data stream.

## Modules

| File | Role |
| --- | --- |
| `PlanetaryTransit.tsx` | Client surface + starfield/planet RAF |
| `planetary-transit.css` | Scoped `.pt-*` styles |
| `fixtures.ts` | Houses + observatory copy |
| `PlanetaryTransit.stories.tsx` | Fullscreen Storybook |

## Storybook

**Design System / Lab Prototypes / PlanetaryTransit**

## Data flow

Story → `PlanetaryTransit` → `useSymbolonFonts` → canvas starfield (WebGL or 2D) + planet orbit RAF → static HUD chrome from fixtures.

## Not done

- Dogfood visual audit in running Storybook (**UNVERIFIED**).
- Production route wiring.
