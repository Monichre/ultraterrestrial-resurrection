# CognitiveRoutingFramework — Pseudocode

**Date:** 2026-07-24  
**Source:** `~/Downloads/cognitive-routing-framework.html` + DESIGN.md  
**Target:** `lab-prototypes/cognitive-routing-framework/`

## Goal

Port the Neuform poster-shell "Cognitive Topology" lab into a Next.js `'use client'` component with npm `three` + `gsap`, Lucide icons, container-sized WebGL, and Storybook fullscreen.

## Files

```
cognitive-routing-framework/
  CognitiveRoutingFramework.tsx
  cognitive-routing-framework.css
  index.ts
  CognitiveRoutingFramework.stories.tsx
  CognitiveRoutingFramework.md
  CognitiveRoutingFramework_PSUEDOCODE.md
```

## Steps

1. CREATE directory under `lab-prototypes/cognitive-routing-framework/`.
2. WRITE scoped CSS under `.crf-root`:
   - Palette: bg `#1a1a1a`, stone `#c8c4bc`, rust `#8b3a2a`
   - Poster-shell gradient border, flicker keyframes, mono/sans stacks
   - Layout: guide lines, corner marks, header, hero viewport, 3-panel footer, metadata bar
3. WRITE `CognitiveRoutingFramework.tsx`:
   - `'use client'`, named export
   - Lucide: `Cpu`, `ArrowUpFromLine`, `Network`, `ShieldAlert` (replace Iconify)
   - Refs: `rootRef`, `webglRef`
   - EFFECT A — Three.js:
     - Mount WebGLRenderer to `webglRef`
     - IcosahedronGeometry(3, 2) + MeshPhysicalMaterial + WireframeGeometry overlay
     - Ambient + two DirectionalLights (rust / stone)
     - Animate rotation + float via THREE.Clock
     - ResizeObserver / window resize → size to **container**, not window
     - Cleanup: cancelAnimationFrame, dispose geo/mats/renderer, remove canvas, disconnect observer
   - EFFECT B — GSAP:
     - `gsap.context(() => { reveal; text-up stagger; card stagger }, rootRef)`
     - Cleanup: `ctx.revert()`
   - EFFECT C — UTC clock:
     - `setInterval` → `SYS.SYNC // HH:MM:SSZ`
     - Cleanup: `clearInterval`
4. WRITE Storybook story: `layout: 'fullscreen'`.
5. WRITE `index.ts` barrel + `CognitiveRoutingFramework.md` architecture notes.

## Non-goals

- No CDN Tailwind / Iconify / three / gsap
- No R3F — plain three npm
- Do not invent new panels or alter Ingestion / Consensus / Heuristics copy
