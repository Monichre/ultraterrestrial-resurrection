# RocketHud — Pseudocode

## Tokens (globals.css :root)

- bg #000, surface #0A0A0A, grid #141414
- border-faint #1F1F1F, border #2A2A2A
- text-primary #E5E5E5, text-secondary #7A7A7A, text-muted #4D4D4D
- accent #E11D2A, accent-dim #7A1218, marker #FF1F2D
- background-image: 48px grid using --grid color

## Tailwind v4 @theme inline

- expose --color-hud-* tokens so we can use `bg-hud-bg`, `text-hud-accent`, etc.
- font-mono → Geist Mono fallback chain.

## File tree

app/
  layout.tsx          → Geist + Geist Mono, html bg-hud-bg
  globals.css         → tokens + grid + animations + reduced-motion
  page.tsx            → <RocketHud />
components/hud/
  RocketHud.tsx       → root grid 508px / 1fr / 388px
  CanvasFrame.tsx     → outer L-corners + edge dashes
  CornerBrackets.tsx  → reusable 4 red L-corners (absolute)
  EdgeTickBar.tsx     → 2x12px accent-dim edge ticks
  Panel.tsx           → outlined wrapper with title + brackets
  RocketBadge.tsx     → 96x96 with inline rocket SVG
  MetricCell.tsx      → ▶ label + value
  IdentityRow.tsx     → badge + 2x2 metric grid
  ThrustersTable.tsx
  CoolingBars.tsx     → 8 bars D1..D8, jitter animation
  EngineTemperatureChart.tsx → 4 polylines on 5-line grid
  PositionLogTable.tsx       → 10 rows
  SolarMap.tsx        → composes Radar, OrbitArcs, planets, YourPosition, SaturnFocus, BottomAxis
  Radar.tsx
  OrbitArcs.tsx
  PlanetMarker.tsx
  YourPosition.tsx
  SaturnFocus.tsx
  BottomAxis.tsx
  PlanetRail.tsx      → 8 rows
components/icons/planets/
  Sun.tsx Mercury.tsx Venus.tsx Earth.tsx Mars.tsx Jupiter.tsx Saturn.tsx Uranus.tsx Neptune.tsx Rocket.tsx

## Loops (CSS, gated by prefers-reduced-motion)

- @keyframes hud-radar-sweep    → rotate(360deg), 4s linear
- @keyframes hud-pulse          → opacity 1 ↔ 0.5, 1.2s
- @keyframes hud-bracket-pulse  → opacity 0.85 ↔ 1, 2.4s
- @keyframes hud-bar-jitter-{i} → scaleY ±4%, 1.8s, staggered

## Data

- METRICS: 4 cells (literal)
- THRUSTERS: 4 rows
- COOLING_BARS_HEIGHTS: [65,80,55,90,50,95,70,35]
- POSITION_LOG: 10 rows literal
- PLANETS_DIAMETER: 8 rows literal
- MAP_PLANETS: 9 entries with x%/y% + active flag (Saturn)
- BOTTOM_AXIS_VALUES: 8 numbers literal

## Layout

- Grid 508 / 1fr / 388, gap 24, padding 32
- isolation: isolate on map for leader stacking

## Ultraterrestrial integration (2026-07-18)

```
HudUapInterface
  globeType === 'telemetry' (default)
    → RocketHud(fill=parent, center=<Globe />, metrics/hotspots/positionLog from sightings)
  else
    → legacy TechSection + globe overlays

Storybook
  Features/Sightings/RocketTelemetryHud → ReferenceHud | SightingsChrome
```
