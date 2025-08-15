# Terminal UI – Pseudocode

Goal: Replace placeholder terminal text with real metrics derived from sightings and events, and render them in the sidebar terminal under the Sightings HUD.

Inputs

- `initialSightings: ValidatedUAPSighting[]`
- `events: Array<{ id: string; title?: string; name?: string; description: string; date: Date; latitude?: number; longitude?: number; category?: string }>`
- `selectedYear: number` (filtering state)

Data Derivation

1. Filter by selected year
   - yearStart = Date(`${selectedYear}-01-01T00:00:00Z`)
   - yearEnd = Date(`${selectedYear}-12-31T23:59:59Z`)
   - filteredSightings = initialSightings.filter(ts within [yearStart, yearEnd])
   - filteredEvents = events.filter(date within [yearStart, yearEnd])

2. Compute metrics
   - totalSightings = filteredSightings.length
   - eventsCount = filteredEvents.length
   - topShape
     - counts = {}
     - for sighting in filteredSightings:
       - for shape in sighting.category (array or string): counts[shape]++
     - topShape = max(counts) key
   - topCity
     - cityCounts = {}
     - for sighting in filteredSightings: if sighting.location.city: cityCounts[city]++
     - topCity = max(cityCounts) key
   - latestSightingISO
     - latest = sort[filteredSightings by timestamp desc](0)
     - latestSightingISO = latest?.timestamp.toISOString()
   - timeRange = { selectedYear }

3. Build terminal lines (strings)
   - Header: `$ system.initialize()`
   - Feeds: `- sightings: <count>`, `- events: <count>`, `- range: Year <selectedYear>`
   - Analysis: `Top shape`, `Hotspot city`, `Latest sighting: <MMMM do yyyy>`
   - Status: `System Status: ACTIVE`, etc.

Rendering

- Component `<Terminal metrics={...} status="ACTIVE" progress={100} />`
- In `Terminal`, memoize `terminalLines` from `metrics` and format dates with `date-fns` (`MMMM do yyyy`).
- Animate lines visibility on mount; set progress bar width to `progress%`.

Globe Data (fix types)

- Map filtered points (sightings + events) to `Position[]` arcs expected by `ThreeJsGlobe`:
  - Accumulate all `{lat, lng}` points
  - For i in 1..N-1 create arc from points[i-1] -> points[i]
  - Use color `#78efff` and `arcAlt = 0.2`.

Outputs

- Real-time terminal panel with counts, top shape/city, latest sighting date.
- Globe receives correctly typed `Position[]`.
