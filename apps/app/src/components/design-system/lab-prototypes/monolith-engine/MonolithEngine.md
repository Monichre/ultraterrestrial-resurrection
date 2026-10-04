# MonolithEngine

**Ported:** 2026-07-24  
**Source:** `~/Downloads/monolith-engine.html` (Meng To / Neuform Featured)  
**Design tokens:** `~/Downloads/monolith-engine-DESIGN.md`

## Purpose

Full-viewport kinetic WebGL landing lab prototype: monochromatic vortex particles, bloom, masked scroll headline, and HUD chrome. Lives under `design-system/lab-prototypes/` for Storybook / gallery review — not wired into research-canvas.

## Files

| File | Role |
|------|------|
| `MonolithEngine.tsx` | Client component — Three scene, GSAP intro + ScrollTrigger, UI chrome |
| `monolith-engine.css` | All styles scoped under `.me-root` |
| `index.ts` | Named barrel export |
| `MonolithEngine.stories.tsx` | Fullscreen Storybook stories |
| `MonolithEngine_PSUEDOCODE.md` | Implementation plan |

## Architecture

```
.me-root
├── .me-loader          shimmer intro overlay
├── .me-stage           sticky 100vh stage
│   ├── .me-canvas-wrap WebGL canvas (ResizeObserver on stage)
│   ├── .me-frame       vertical rules + corner ticks
│   ├── header          brand / nav / Link CTA
│   └── footer          Vector coords / scroll hint / social
└── .me-overlay         scrollable UI (min-height 160vh, pulled over stage)
    └── main            masked status + headline + CTAs
```

### WebGL stack

- `three` Scene + FogExp2 + ACESFilmicToneMapping
- Vortex `Points` (9500) + dual spiral `Line`s + ambient particles (300)
- Post: `EffectComposer` → `RenderPass` → `UnrealBloomPass`  
  (`three/examples/jsm/postprocessing/*`)
- Mouse parallax on `mainGroup` rotation; coords HUD updates on pointer

### Motion

- GSAP shimmer loop on loader bar
- Intro timeline: loader fade → scale-in group → nav opacity
- ScrollTrigger staggered `y: 0` on `.me-mask-word`
- Glitch jitter on fast pointer **and** scroll velocity (source only had mouse)

### Icons

`lucide-react`: ArrowRight, Play, FileText, Link2, Maximize2 (replaces Iconify Solar set)

## Data flow

1. Mount → build Three graph, start RAF, register GSAP context scoped to root
2. ResizeObserver on `.me-root` resizes renderer + composer
3. Unmount → cancel RAF, dispose geometries/materials/composer/renderer, `gsap.context().revert()`, kill related ScrollTriggers

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `className` | string | — | Appended to `.me-root` |
| `style` | CSSProperties | — | Inline on root |
| `showLoader` | boolean | `true` | Skip intro for Storybook/tests |

## Storybook

`Design System/Lab Prototypes/MonolithEngine` — `Default`, `WithoutLoader`

## Fidelity gaps

1. **Engine. word** — source used `bg-clip-text` neutral gradient; port uses solid `#737373` (design-hook / solid-type preference).
2. **Fonts** — no Google Fonts CDN; uses `--font-space-grotesk` / `--font-jetbrains-mono` with system fallbacks. Extrlight (200) may synthesize if next/font only loads 400+.
3. **Fixed chrome** — source used `position: fixed` to the browser viewport. Port uses a sticky `.me-stage` (100vh) so canvas + nav/footer stay locked while the overlay scrolls — works in Storybook embeds without escaping the component.
4. **ScrollTrigger scroller** — assumes document scroll. Nested overflow containers may need a custom `scroller`.
5. **Icons** — Lucide stroke icons vs Iconify Solar linear set (visual weight slightly different).
6. **Glitch** — source: mouse speed only; port also triggers on scroll velocity when feasible.
