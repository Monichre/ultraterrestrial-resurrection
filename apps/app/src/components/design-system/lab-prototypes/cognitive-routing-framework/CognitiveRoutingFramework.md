# CognitiveRoutingFramework

**Date:** 2026-07-24  
**Source:** `~/Downloads/cognitive-routing-framework.html` (Neuform / Samnang Aing)  
**Design tokens:** `~/Downloads/cognitive-routing-framework-DESIGN.md`

## Purpose

Lab prototype of the Cognitive Topology poster shell — a full-viewport research HUD with a Three.js icosahedron signal field and three routing stage panels (Ingestion / Consensus / Heuristics).

## Files

| File | Role |
|------|------|
| `CognitiveRoutingFramework.tsx` | Client component — layout, Three.js, GSAP, UTC clock |
| `cognitive-routing-framework.css` | Styles scoped under `.crf-root` |
| `index.ts` | Named barrel exports |
| `CognitiveRoutingFramework.stories.tsx` | Storybook fullscreen story |
| `CognitiveRoutingFramework_PSUEDOCODE.md` | Implementation plan |

## Architecture

```
.crf-root
  guide lines + corner marks
  main.crf-reveal (GSAP opacity)
    .crf-poster-shell (gradient border)
      .crf-surface
        header (Cpu + OP-CORE + UTC clock)
        hero
          .crf-webgl ← Three.js canvas (container-sized)
          targeting marks
          title stack (.crf-text-up)
        panels (.crf-card × 3)
          Ingestion / Consensus / Heuristics
        metadata bar (flicker + secure tether)
```

## Data flow / effects

1. **Three.js** (`useEffect` on `webglRef`): builds scene → icosahedron + wireframe → lights → `requestAnimationFrame` loop. `ResizeObserver` sizes renderer to the **container**, not the window. Cleanup disposes geometries, materials, renderer, cancels RAF, removes canvas.
2. **GSAP** (`gsap.context` on `rootRef`): shell reveal, staggered text-up, staggered panel cards. Cleanup via `ctx.revert()`.
3. **UTC clock** (`setInterval` 1s): writes `SYS.SYNC // HH:MM:SSZ`. Cleanup via `clearInterval`.

## Dependencies

- `three` (npm) — no CDN
- `gsap` (npm) — no CDN
- `lucide-react` — `Cpu`, `ArrowUpFromLine`, `Network`, `ShieldAlert` (replaces Iconify)

## Palette

- Background / surface core: `#1a1a1a`
- Stone text: `#c8c4bc`
- Rust accent: `#8b3a2a`

## Storybook

`Design System/Lab Prototypes/CognitiveRoutingFramework` → **Default** (fullscreen).
