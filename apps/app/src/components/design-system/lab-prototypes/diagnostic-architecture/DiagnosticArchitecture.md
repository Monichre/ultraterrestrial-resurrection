# DiagnosticArchitecture

**Source:** Neuform Featured — *Diagnostic Architecture // Model Teardown* (Aksonvady Phomhome)  
**Ported:** 2026-07-24  
**Path:** `apps/app/src/components/design-system/lab-prototypes/diagnostic-architecture/`

## Purpose

Fullscreen diagnostic HUD lab prototype: exploded SVG architecture teardown with telemetry side panels, playback chrome, and GSAP entrance + ambient drift.

## Architecture

| Module | Role |
|--------|------|
| `DiagnosticArchitecture.tsx` | Client shell — layout, Lucide icons, GSAP timeline scoped to `rootRef` |
| `diagnostic-architecture.css` | All visual language under `.da-root` (halftone, grid, zinc tokens, JetBrains Mono) |
| `fixtures.ts` | Modes, active nodes, load meters, telemetry stream, defaults |
| `index.ts` | Named barrel exports |
| `DiagnosticArchitecture.stories.tsx` | Fullscreen Storybook stories |

## Component tree

```
.da-root
  ├── background (halftone / technical grid / vignette)
  ├── frame + corner reticles
  ├── header (kernel · mode nav · status)
  ├── aside-left (Active Nodes · Load Dist)
  ├── aside-right (Telemetry Stream)
  ├── main → ExplodedWireframe SVG (4 layers + struts + annotations)
  └── footer (playback · timeline · Engage / Isolate)
```

## Data flow

- Local `activeMode` state (`Topology` | `Wireframe` | `Metrics`); optional `onModeChange`
- Fixture-driven node / load / telemetry copy
- Optional `onEngage` / `onIsolate` callbacks on footer actions
- SVG pattern id scoped via `useId()` to avoid multi-instance collisions

## Motion

1. Layers compress-in from `y:50` / `scale:0.95`
2. Struts scaleY from bottom
3. Annotation connectors draw via `strokeDashoffset`
4. Markers / labels fade in
5. Ambient sine drift on base, housing, and resonance layers

GSAP timelines and drift tweens are killed on unmount.

## Constraints honored

- `gsap` from npm (no CDN)
- `lucide-react` icons (no Iconify)
- Scoped CSS under `.da-root` (no Tailwind CDN)
- JetBrains Mono for the diagnostic HUD (DESIGN label token; avoids Inter CDN stack)
- Single quotes, no semicolons, named exports
