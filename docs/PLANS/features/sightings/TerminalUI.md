## Terminal UI – Real Data Integration

This document describes the implementation that wires real sightings/events data into the Sightings HUD terminal panel.

### Scope

- Replace hardcoded terminal text with metrics derived from filtered data.
- Keep UI aesthetic; only the textual lines and progress value change.
- Ensure type-safe wiring to `ThreeJsGlobe` by converting data to the expected `Position[]` arcs.

### Key Modules

- `apps/app/src/features/data-viz/sightings/uap-dashboard/HudUapInterface.tsx`
  - Filters data by year, computes metrics, generates `Position[]` for the globe, passes metrics to terminal.
- `apps/app/src/features/data-viz/sightings/uap-dashboard/terminal/terminal.tsx`
  - New props: `metrics`, `status`, `progress`, `logs`.
  - Formats dates with `date-fns` using `MMMM do yyyy` per date-formatting rule.
  - Animates lines and progress bar.
- `apps/app/src/components/globes/threejs-globe.tsx`
  - Reference for `Position` and `WorldProps` types.

### Data Flow

1. Server page `sightings/page.tsx` fetches `sightings` and `events`.
2. Client `SightingsClient` hands them to `HudUapInterface`.
3. `HudUapInterface`:
   - Maintains `selectedYear` filter.
   - Derives `filteredSightings` and `filteredEvents`.
   - Computes metrics: counts, top shape, top city, latest sighting.
   - Builds `globePositions: Position[]` arcs.
   - Renders `<Terminal metrics={...} />`.

### UI Notes

- Colors maintain existing look; progress defaults to 100.
- Dates display as “June 12th 2005”.

### Risks / Assumptions

- If there are no sightings/events, metrics fall back gracefully to N/A/0.
- Events without lat/lon are ignored for globe arcs.

### Next Enhancements

- Add streaming AI analysis logs into `logs` prop.
- Toggle terminal verbosity from UI.
