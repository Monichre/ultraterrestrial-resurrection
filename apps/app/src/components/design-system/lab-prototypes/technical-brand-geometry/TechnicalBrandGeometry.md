# TechnicalBrandGeometry

**Source:** Neuform staff featured — *Technical Brand Geometry* (Meng To / @mengto)  
**Ingested:** 2026-08-06  
**Path:** `apps/app/src/components/design-system/lab-prototypes/technical-brand-geometry/`

## Purpose

Fullscreen technical brand / blueprint geometry background study: skeuomorphic card chrome, SVG dimension callouts, Three.js WebGL field, GSAP ScrollTrigger reveals.

## Architecture

| Module | Role |
|--------|------|
| `TechnicalBrandGeometry.tsx` | Client iframe shell → `/lab-prototypes/technical-brand-geometry-1.html` |
| `source.html` | Donor HTML next to the shell |
| `../html-sources/technical-brand-geometry-1.html` | Canonical components-tree copy |
| `public/lab-prototypes/technical-brand-geometry-1.html` | Served asset for iframe `src` |
| Token contract | `docs/design/neuform-sources/technical-brand-geometry-1-DESIGN.md` |

## Status

- HTML + Storybook iframe shell landed.
- Native React/Three port **not** done (UNVERIFIED visually in this session).
