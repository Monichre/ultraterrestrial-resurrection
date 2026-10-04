# MonolithEngine — Pseudocode

**Source:** `~/Downloads/monolith-engine.html` + `monolith-engine-DESIGN.md`
**Date:** 2026-07-24

## Goal

Port the Meng To / Neuform "Monolith Engine" WebGL landing into a Next.js `'use client'` lab component under `lab-prototypes/monolith-engine/`.

## Structure

```
monolith-engine/
  MonolithEngine.tsx
  monolith-engine.css
  index.ts
  MonolithEngine.stories.tsx
  MonolithEngine.md
  MonolithEngine_PSUEDOCODE.md
```

## Layers (DOM)

1. `.me-root` — full viewport (min-height 100%), overflow-x hidden, Space Grotesk
2. `.me-loader` — fixed overlay, shimmer bar + "Initializing Matrix"
3. `.me-canvas-wrap` — fixed inset-0, hosts `<canvas ref>`
4. `.me-frame` — fixed inset border lines + 4 corner squares
5. `.me-overlay` — relative scrollable min-height 160vh, pointer-events none
   - `.me-header` (nav-item) — logo M + Monolith, Structure/Array/Logic, Link CTA
   - `.me-main` (scroll-trigger-area) — status, masked headline, desc, CTAs
   - `.me-footer` (nav-item) — Vector coords, scroll hint, social icons

## Three.js (useEffect on mount)

```
CONFIG = { bg: 0x050505, primary: 0xdddddd, secondary: 0x555555 }
scene + FogExp2(bg, 0.04)
PerspectiveCamera(75, aspect, 0.1, 100) z=7
WebGLRenderer({ canvas, antialias:false, high-performance, alpha:false })
  setPixelRatio(min(dpr, 2))
  ACESFilmicToneMapping exposure 1

mainGroup:
  vortex Points 9500 — funnel radius by |y|, animate spin+pulse each frame
  spiral Line A (offset 0, secondary) + B (offset π, primary)

scene ambient Points 300 size 0.008

post:
  EffectComposer + RenderPass + UnrealBloomPass(strength 0.6, radius 0.3, threshold 0.2)
  import from three/examples/jsm/postprocessing/...

ResizeObserver on .me-root (or canvas wrap):
  update camera aspect, renderer + composer size, windowHalfX/Y

raf loop:
  lerp mainGroup rot from mouse target
  update vortex positions
  rotate spirals + ambient particles
  composer.render()

cleanup:
  cancelAnimationFrame
  dispose geometries/materials/renderer/composer
  remove listeners
  ScrollTrigger.getAll().forEach(kill)
  gsap.killTweensOf(...)
```

## GSAP

```
registerPlugin(ScrollTrigger)
onload/mount:
  shimmer loop on .me-shimmer-bar
  timeline:
    loader opacity 0 → display none
    mainGroup.scale from 0.6
    .me-nav-item opacity 1 stagger
  ScrollTrigger on .me-scroll-area → .me-mask-word y:0 stagger
```

## Interactions

- mousemove → mouseX/Y parallax targets + coords text
- mouse speed > 2 → glitch gsap on `.me-glitch` (x/y jitter + textShadow)
- optional: scroll velocity also triggers same glitch if |dy|/dt > threshold

## Icons

lucide-react: ArrowRight, Play, FileText, Link2, Maximize2

## Constraints

- No Iconify / Tailwind CDN / Google Fonts CDN
- CSS scoped under `.me-root`
- Single quotes, no semicolons, named exports
- Fonts via `--font-space-grotesk` / `--font-jetbrains-mono` fallbacks
