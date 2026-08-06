# DevUiEmbeds

**Updated:** 2026-08-05

## Summary

Iframe showcase embeds copied from `lab/Dev UI/_archive/embeds` into the app for Storybook review.

## Components

| File | Story title |
|---|---|
| `background-aura-animation-container.tsx` | Design System/Lab Prototypes/Dev UI Embeds/Background Aura Animation |
| `full-page-aura-background-embed.tsx` | Full-Page Aura Background |
| `futuristic-lab-landing-and-dashboard-layout.tsx` | Futuristic Lab Landing + Dashboard |
| `quantum-node-ui-showcase-section.tsx` | Quantum Node UI Showcase |
| `synthesis-autonomous-ui-showcase-section.tsx` | Synthesis Autonomous UI Showcase |

## Architecture

Each export is a React shell that renders a sandboxed `<iframe srcDoc={...}>` containing a self-contained HTML/CSS/JS demo (CDN Tailwind, Unicorn Studio, Three.js, GSAP as authored in the archive).

## Not done

- Visual dogfood in Storybook browser (UNVERIFIED).
- Native React ports of the iframe contents.
