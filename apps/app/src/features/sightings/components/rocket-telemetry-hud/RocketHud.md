# RocketHud

Pixel-faithful recreation of a sci-fi rocket telemetry HUD from a single
screenshot reference. Single-screen Next.js App Router page composed of
small, presentational components — no data fetching, no client state.

## Key modules

| File | Role |
|---|---|
| `app/page.tsx` | Mounts `<RocketHud />`. |
| `app/layout.tsx` | Loads Geist + Geist Mono, sets `bg-hud-bg` on `<html>`. |
| `app/globals.css` | Defines `--hud-*` tokens, exposes them via Tailwind v4 `@theme inline` as `bg-hud-*` / `text-hud-*` utilities, paints the 48px background grid, declares all 4 keyframes and gates them under `prefers-reduced-motion`. |
| `components/hud/RocketHud.tsx` | Root grid `508px / 1fr / 388px`, gap 24, padding 32. Composes the three rails. |
| `components/hud/CanvasFrame.tsx` | Outer red L-corner brackets and top/bottom edge dashes. |
| `components/hud/CornerBrackets.tsx` | Reusable 4-corner red L-brackets used by every framed panel. |
| `components/hud/Panel.tsx` | Outlined panel with optional uppercase title + subtitle and corner brackets. |
| `components/hud/IdentityRow.tsx` | `R0CKET-001` badge + 2×2 metric grid (battery / solar / backup / power). |
| `components/hud/RocketBadge.tsx` | 96×96 outlined square, inline rocket SVG, edge ticks. |
| `components/hud/MetricCell.tsx` | Red ▶ triangle bullet + small accent label + 22px value. |
| `components/hud/ThrustersTable.tsx` | 4-row DETAILS/STATUS table. |
| `components/hud/CoolingBars.tsx` | 8-bar D1–D8 chart with staggered jitter animation. |
| `components/hud/EngineTemperatureChart.tsx` | 5-line gridded SVG with 4 polylines (1 bold red + 3 supports), deterministic series so SSR/CSR match. |
| `components/hud/PositionLogTable.tsx` | 10-row monospace position log. Real `<table>` with `sr-only` caption. |
| `components/hud/SolarMap.tsx` | Map region. Wires `OrbitArcs`, `Radar`, all `PlanetMarker`s, `YourPosition`, `SaturnFocus`, `BottomAxis`. `isolation: isolate` so leader lines stack cleanly. |
| `components/hud/Radar.tsx` | 140px concentric-circle radar with linear-gradient cone sweep. |
| `components/hud/OrbitArcs.tsx` | 5 dashed concentric ellipses curving across the map. |
| `components/hud/PlanetMarker.tsx` | 24×24 disc + glyph + uppercase label. Active variant uses red marker color. |
| `components/hud/YourPosition.tsx` | Pulsing red dot, thin white leader line, XYZ readout block. |
| `components/hud/SaturnFocus.tsx` | White-bordered SATURN pill (red disc + Saturn glyph), red corner brackets, leader line, U+1FA90 tag and uppercase paragraph. |
| `components/hud/BottomAxis.tsx` | 8 evenly spaced ticks + numeric labels. |
| `components/hud/PlanetRail.tsx` | 8 outlined rows (`44px` tall) with planet glyph, name, distance. |
| `components/icons/planets/index.tsx` | Inline SVG glyphs (`Sun`, `Mercury`, `Venus`, `Earth`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, `Neptune`, `Rocket`). 24×24 viewBox. **Not** lucide. |

## Process & data flow

The HUD has no runtime data — every value is a literal pulled directly
from the reference (see `V0_PROMPT.md` "Literal Strings"). Components are
pure-presentational React Server Components rendered statically. The map
overlays are positioned with percentage coordinates inside an
`isolation: isolate` container so leader lines and corner brackets stack
above orbit arcs without bleeding under panel chrome.

## Component architecture

```
<RocketHud>
├── hud-grid-bg (decorative div)
├── <CanvasFrame />
└── grid 508 / 1fr / 388
    ├── Left rail (flex-col gap-4)
    │   ├── Identity panel
    │   │   └── <IdentityRow />
    │   │       ├── <RocketBadge />
    │   │       └── 2×2 <MetricCell />
    │   ├── Thrusters/Cooling panel (split 50/50)
    │   │   ├── <ThrustersTable />
    │   │   └── <CoolingBars />
    │   ├── <Panel title="ENGINE TEMPERATURE">
    │   │   └── <EngineTemperatureChart />
    │   └── <Panel title="ROCKET POSITION LOG">
    │       └── <PositionLogTable />
    ├── <SolarMap>
    │   ├── <OrbitArcs />
    │   ├── <Radar />
    │   ├── <PlanetMarker /> × 9
    │   ├── <YourPosition />
    │   ├── <SaturnFocus />
    │   └── <BottomAxis />
    └── <PlanetRail /> (× 8 rows)
```

## Tokens (CSS variables)

Defined on `:root` in `app/globals.css` and re-exposed to Tailwind v4 via
`@theme inline` so utilities like `bg-hud-accent`, `text-hud-text-secondary`,
`border-hud-border-faint` are available everywhere.

| Token | Value |
|---|---|
| `--hud-bg` | `#000000` |
| `--hud-grid` | `#141414` |
| `--hud-border-faint` | `#1F1F1F` |
| `--hud-border` | `#2A2A2A` |
| `--hud-text-primary` | `#E5E5E5` |
| `--hud-text-secondary` | `#7A7A7A` |
| `--hud-text-muted` | `#4D4D4D` |
| `--hud-accent` | `#E11D2A` |
| `--hud-accent-dim` | `#7A1218` |
| `--hud-marker` | `#FF1F2D` |

## Motion

All four loops are pure CSS keyframes in `globals.css` and are disabled
under `@media (prefers-reduced-motion: reduce)`:

| Class | Behavior |
|---|---|
| `hud-anim-sweep` | Radar cone, `rotate 0→360deg`, 4s linear infinite. |
| `hud-anim-pulse` | Position dot, opacity `1↔0.5`, 1.2s. |
| `hud-anim-bracket` | Saturn focus brackets, opacity `0.85↔1`, 2.4s. |
| `hud-anim-bar` | Cooling bars, scaleY ±4%, 1.8s, staggered per bar. |

## Accessibility

- Landmarks: `<header>`, `<main>`, `<aside aria-label="Planet distances">`,
  `<section aria-label="…">` on each panel.
- `<table>` with `sr-only` caption on the position log.
- SVG charts include `<title>`/`<desc>`; decorative SVG is `aria-hidden`.
- Focus ring: `2px solid var(--hud-accent)` with 2px offset.
- `--hud-text-muted` is decorative-only; critical info repeats in primary
  color in the right rail.
- Right-rail rows are 44px tall (≥ 40px touch target).

## Integration (Ultraterrestrial)

Ported from [v0 Rocket telemetry HUD](https://v0.app/digital-mischief-group/chat/rocket-telemetry-hud-tzMkXRdlZmx) into
`apps/app/src/features/sightings/components/rocket-telemetry-hud/`.

- `RocketHud` accepts optional `center` (Three.js globe), `metrics`, `hotspots`, `positionLog`.
- Hotspot rail supports `onHotspotFocus` / `activeHotspotName` (focuses globe via `focusedLocation`).
- `centerOverlay` hosts year/time controls in telemetry mode.
- Responsive grid: 3-col desktop → 2-col ≤1280 → stacked ≤900.
- Default globe mode in `HudUapInterface` is **TELEMETRY HUD** (`globeType: 'telemetry'`).
- Tokens live in `rocket-telemetry-hud.css` (scoped) + `@theme` colors in `apps/app/src/app/globals.css`.
- Storybook: `Features/Sightings/RocketTelemetryHud`.
