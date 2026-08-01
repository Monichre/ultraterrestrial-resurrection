---
status: live
role: product + eng
spine: want
updated: 2026-08-01
---

# Temporal Observatory

**Decision record:** [`../adr/0002-temporal-observatory-gl4ss-integration.md`](../adr/0002-temporal-observatory-gl4ss-integration.md)
**Reference implementation (concepts only):** [gl4ss.ai](https://gl4ss.ai) · [GL4SS repo](https://github.com/elder-plinius/GL4SS) — AGPL-3.0-or-later, see licensing gate in the ADR.
**Design surfaces:** `docs/design/design-lab/UiDesignBrief.md` §3 "Temporal–Geospatial Observatory" · prototype `docs/design/design-lab/prototypes/03-temporal-geospatial-observatory.html`

> **Read the ADR first.** It corrects several factual claims carried over from the originating design
> conversation (framework versions, which libraries are actually installed, and what the sightings API already
> does). The Foundation milestone below is smaller than it looks because bounded querying partly exists.

---

## 1. Product concept

A full-screen research instrument for navigating documented sightings, historical anomalies, military
developments, nuclear events, testimony, places, and generated reconstructions across space and time.

The user is not looking at points on a map. They are moving through a **changing evidence field**:

- Where reports occurred.
- When clusters emerged.
- Which facilities, technologies, governments, witnesses, and historical events surrounded them.
- What the location plausibly looked like at the time.
- Which parts of that reconstruction are documented, inferred, disputed, or synthetic.

### What GL4SS proves

Five interaction ideas worth porting:

1. Time is navigated through a **non-uniform station ladder**, not a naïve linear slider.
2. A user can type an exact year without destroying the station system's usefulness.
3. Scene creation happens in **visible stages** — direction, rendering, completion.
4. Generated frames have **stable identities** and can be revisited without regenerating.
5. Two eras compare through a **registered draggable seam**.

---

## 2. The gap this closes

The ingredients exist and are disconnected. There is no single synchronized space-time state model.

Today: `sightings-globe.tsx:22` loads a static `/sightings.geojson`; military bases and UFO posts load
alongside it; deck.gl renders generic `GeoJsonLayer`s (including an airport demo dataset); selection exposes
essentially raw object properties. Separately there is a scroll-driven spatial timeline, historical-event
records with dates/coordinates/media, and a large visualization stack.

The problem is **not missing technology**. It is the absence of a shared temporal cursor.

---

## 3. Core feature set

### 3.1 The Spacetime Canvas

The map becomes the primary continuous research surface. Every visible object participates in one shared
temporal cursor.

| Layer | Examples |
|---|---|
| Sightings | Individual reports, mass sightings, radar cases, historical anomalies |
| Historical events | Wars, launches, tests, hearings, legislation, scientific discoveries |
| Nuclear | Tests, plants, missile fields, incidents, storage facilities |
| Military | Bases, training areas, naval groups, radar installations |
| Infrastructure | Airports, launch sites, observatories, laboratories |
| Testimony | Witness locations, interview dates, claimed encounter routes |
| Documents | Publication date, event date, declassification date |
| Astronomical | Moon, sun, planets, meteor showers, satellite positions |
| Environmental | Weather, visibility, cloud cover, seismic/geomagnetic activity |
| Reconstructions | Evidence-bounded images, video, diagrams, viewpoints |

Mapbox/deck.gl remains the rendering foundation. GL4SS's Leaflet/Three globe is redundant here.

### 3.2 Adaptive Temporal Dial

Port GL4SS's strongest feature — but with **three station modes**, not one universal year list.

**Historical stations** — coarse intervals for ancient history, finer near the modern period.

**Event stations** — exact dates and times from records: July 8 1947; November 14 2004 at the reported
encounter time; March 13 1997 during the Phoenix Lights sequence; nuclear test, hearing, and release dates.

**Dynamic investigation stations** — generated from the current investigation: three days before an event; the
event; the first press report; the first official response; a later declassification; a related event at the
same location; a later recurrence with similar observables.

The dial visually encodes event density, evidence volume, credibility, geographic relevance, whether the user
already owns a reconstruction, paradigm shifts and disclosure milestones, and flaps.

> A year slider says "pick a number." This dial says **"something happened here."**

### 3.3 Exact-time navigation

A sighting is rarely just a year.

```ts
type TemporalCursor =
  | { mode: 'station'; stationId: string; timestamp: string }
  | { mode: 'exact';   timestamp: string; precision: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' }
  | { mode: 'range';   start: string; end: string }
```

Precision must be explicit. A medieval chronicle may identify only a season; a modern aviation encounter may
have second-level telemetry. Rendering both as equally precise dots would be **epistemically dishonest**.

### 3.4 Evidence Layer Stack

The left control surface becomes an evidence mixer — toggle or weight sightings, historical anomalous events,
nuclear infrastructure, military installations, aircraft routes, radar coverage, astronomical conditions,
weather, documents, testimony, government actions, reconstructions, and hypothesis overlays.

Layers carry temporal validity:

```ts
interface TemporalLayerFeature {
  validFrom?: string
  validUntil?: string
  observedAt?: string
  publishedAt?: string
  geometry: GeoJSON.Geometry
}
```

A military base must not appear before it existed. A runway configuration changes over time. A city skyline
must not render with current geometry during a 1947 reconstruction. **This temporal correctness is where the
system stops being "a map with UFO dots" and becomes a historical instrument.**

### 3.5 Evidence-bounded reconstruction engine

GL4SS builds a scene from place, coordinates, year, style, time of day. Replace that generic input with an
**Event Evidence Packet**.

```ts
interface EventEvidencePacket {
  eventId: string
  title: string
  timestamp: string
  timePrecision: string
  coordinates: {
    latitude: number
    longitude: number
    altitudeMeters?: number
    uncertaintyRadiusKm?: number
  }
  locationDescription: string
  observerPosition?: ObservationGeometry
  reportedObjectPosition?: ObservationGeometry
  environmentalContext: {
    weather?: EvidenceValue
    visibility?: EvidenceValue
    moonPhase?: EvidenceValue
    sunPosition?: EvidenceValue
    terrain?: EvidenceValue
  }
  observedDetails: EvidenceClaim[]
  disputedDetails: EvidenceClaim[]
  inferredDetails: EvidenceClaim[]
  sourceIds: string[]
  credibilityScore: number
  evidenceSnapshotHash: string
}
```

The model is **not** asked "Show Roswell in 1947." It is asked:

> "Using only this evidence packet, reconstruct the observer-visible environment from this specified position.
> Do not introduce a craft, debris, personnel, weather condition or structure unless supported by an attached
> claim. Mark uncertain visual decisions in the reconstruction manifest."

That distinction is foundational.

### 3.6 Reconstruction modes

- **Historical environment** — what was physically present, without depicting the anomaly.
- **Witness viewpoint** — from the reported observer position, direction, and field of view.
- **Object-relative viewpoint** — cautious reconstruction of the claimed object's reported position/movement.
- **Instrument viewpoint** — radar, infrared, telescope, cockpit display, sonar/hydrophone, satellite/aerial.
- **Explanatory reconstruction** — diagrammatic: observer, horizon, bearings, estimated distances, aircraft or
  ship paths, radar installations, celestial objects, alternative hypotheses.
- **Cinematic interpretation** — clearly labeled, for narrative exploration rather than analysis.

**Analytical and cinematic modes must never be visually conflated.**

### 3.7 Epistemic rendering

Every artifact receives a manifest.

```ts
interface ReconstructionManifest {
  documented: VisualElement[]
  corroborated: VisualElement[]
  inferred: VisualElement[]
  disputed: VisualElement[]
  generatedForContinuity: VisualElement[]
  omittedDueToInsufficientEvidence: string[]
}
```

| Status | Rendering treatment |
|---|---|
| Documented | Solid, full opacity |
| Corroborated | Solid with evidence marker |
| Inferred | Slightly desaturated |
| Disputed | Hatched or edge-highlighted |
| Hypothetical | Ghosted or wireframe |
| Unknown | Intentionally absent |

This persists into captions, video metadata, and shareable exports. **No generated image may ever masquerade
as an archival photograph** — that would be fatal to the credibility framework.

### 3.8 Temporal Compare

Port and expand GL4SS's pinned-frame comparison. GL4SS constrains comparison to the same place and style and
only permits an *existing* frame to be pinned — preventing comparison gestures from silently triggering
generation. Preserve that constraint.

Four comparison modes:

- **Same place, different time** — Roswell 1945 vs 1947; Rendlesham 1980 vs today; Groom Lake before/after construction.
- **Same event, different hypothesis** — conventional aircraft, astronomical, sensor artifact, unknown object.
- **Same event, different witness** — registered viewpoints from multiple observer positions.
- **Same pattern, different case** — Malmstrom 1967 vs Minot 1968; Nuremberg 1561 vs Basel 1566; Nimitz 2004 vs Roosevelt.

Beyond the seam: blink compare, onion-skin opacity, difference heatmap, synchronized camera, evidence deltas,
and a machine-generated "what changed?" summary.

### 3.9 Flap Playback

A flap is not a pile of points — it is a moving phenomenon. Playback animates reports appearing over time,
geographic spread, witness count, object descriptions, military response, media coverage, official statements,
sensor confirmations, and confidence changes as new evidence enters the record.

Controls: real-time · one hour/second · one day/second · event-to-event stepping · narrative mode.

Each temporal pulse can alter marker intensity, region heat, arc trajectories, the active evidence drawer,
camera position, ambient sound, and narrative annotation.

*Worked example:* Phoenix Lights begins as isolated reports, forms a trajectory, splits into distinct episodes,
introduces the military flare hypothesis at the appropriate time, and shows which reports do or do not align
with it.

### 3.10 Guided Investigations

GL4SS's curated journeys become **Guided Investigations**: The Nuclear Shadow · Roswell to Disclosure · The
Belgian Wave · Nimitz: Fourteen Days in November · The Washington National Sightings · Ancient Sky Phenomena ·
The Drone Flap · The Invisible College · From Foo Fighters to UAP Task Forces.

```ts
interface InvestigationWaypoint {
  id: string
  title: string
  timestamp: string
  camera: CameraState
  activeLayers: string[]
  selectedEntityIds: string[]
  reconstructionId?: string
  narration: string
  evidenceQuestions: string[]
  transition: 'fly' | 'orbit' | 'temporal-jump' | 'compare'
}
```

A waypoint moves the user through **geography and epistemology** — not simply flying the camera to another marker.

### 3.11 Space-Time Capsules

Any meaningful configuration is shareable: camera, temporal cursor, visible layers, selected event, active
hypothesis, pinned comparison, reconstruction, evidence version, narrative waypoint.

```
/spacetime/nimitz-2004
  ?at=2004-11-14T18:30:00Z
  &view=pilot
  &layers=sightings,ships,radar,weather
  &compare=event:roosevelt-2015
```

A capsule must resolve to the **same evidence snapshot**, not silently substitute whatever is current. That
requires versioning and provenance, not merely URL parameters.

### 3.12 Research-agent integration

The Observatory becomes the visual execution surface for the agent system. Agents generate candidate event
clusters, missing-context recommendations, alternative explanations, geospatial correlations, timeline
discontinuities, source conflicts, suggested comparison cases, and guided-investigation drafts.

> "Show all credible nuclear-facility cases between 1965 and 1975, then compare their proximity, reported
> observables, military response and documentation quality."

Returns: a filtered space-time scene · a ranked case list · suggested temporal stations · relationship arcs ·
a synthesis panel · optional reconstructions.

**The agent does not replace the map. It programs the instrument.**

---

## 4. Integration architecture

### Keep from Ultraterrestrial

Next.js App Router shell · Mapbox globe and map · deck.gl layers · existing entity and event datasets ·
**`@db/postgres`** data access (not Xata — see ADR) · existing credibility framework · documents, testimony and
graph relationships · XYFlow research canvas · existing design system.

### Port or adapt from GL4SS

| GL4SS subsystem | Ultraterrestrial adaptation |
|---|---|
| Temporal station ladder | Adaptive historical / event / investigation stations |
| Exact-year override | Exact timestamp + precision-aware cursor |
| `SceneEngine` | Server-backed reconstruction engine |
| `sceneKey` | Evidence-versioned reconstruction key |
| Scene direction stage | Evidence Packet → Reconstruction Plan |
| Frame archive | Shared reconstruction archive |
| Pin and seam compare | Registered event/time/hypothesis comparison |
| Journeys | Guided Investigations |
| Wormhole transition | Space-time transition language |
| Time-of-day dial | Astronomical and environmental context control |

### Do not port

Vite app shell · browser-owned OpenRouter key · IndexedDB as canonical archive · Leaflet map · separate raw
Three.js globe · GL4SS's complete visual skin · pure place/year scene prompts.

IndexedDB may remain an optional local cache; the canonical artifact lives in object storage with database
metadata.

---

## 5. Reconstruction identity

GL4SS's identity is approximately `latitude | longitude | year | style | phase`. That is insufficient.

```ts
function reconstructionKey(input: ReconstructionRequest): string {
  return hash({
    eventId: input.eventId,
    evidenceSnapshotHash: input.evidenceSnapshotHash,
    timestamp: input.timestamp,
    viewpoint: input.viewpoint,
    hypothesisId: input.hypothesisId,
    mode: input.mode,
    styleProfile: input.styleProfile,
    model: input.model,
    promptVersion: input.promptVersion,
  })
}
```

This prevents an updated event record from silently returning an obsolete reconstruction.

---

## 6. Data model additions

```ts
interface SpacetimeEvent {
  id: string
  entityType: 'sighting' | 'historical-event' | 'testimony' | 'government-action'
  entityId: string
  title: string
  startAt: string
  endAt?: string
  timePrecision: string
  latitude: number
  longitude: number
  altitudeMeters?: number
  uncertaintyRadiusKm?: number
  credibilityScore?: number
  evidenceCount: number
  sourceIds: string[]
}

interface Reconstruction {
  id: string
  eventId: string
  reconstructionKey: string
  evidenceSnapshotHash: string
  mode: string
  viewpoint: string
  hypothesisId?: string
  status: 'queued' | 'planning' | 'rendering' | 'ready' | 'failed'
  plan: unknown
  manifest: ReconstructionManifest
  promptHash: string
  imageUrl?: string
  videoUrl?: string
  thumbnailUrl?: string
  model: string
  modelVersion?: string
  createdAt: string
}
```

**`investigation_waypoints`** — authored and agent-generated guided-tour states.

**`event_relationships`** — visible arcs: near · precedes · similar observable · same witness · same facility ·
same military unit · contradicts · corroborates · media derivative · documented by.

---

## 7. Frontend module layout

`features/spacetime/` is greenfield — verified absent as of 2026-08-01.

```
src/features/spacetime/
├── components/
│   ├── spacetime-workbench.tsx
│   ├── temporal-dial.tsx
│   ├── temporal-readout.tsx
│   ├── temporal-density-track.tsx
│   ├── evidence-layer-panel.tsx
│   ├── event-inspector.tsx
│   ├── reconstruction-lever.tsx
│   ├── reconstruction-viewer.tsx
│   ├── temporal-compare.tsx
│   ├── flap-player.tsx
│   ├── investigation-navigator.tsx
│   └── epistemic-legend.tsx
├── layers/
│   ├── sightings-layer.ts
│   ├── historical-events-layer.ts
│   ├── facilities-layer.ts
│   ├── trajectories-layer.ts
│   ├── evidence-density-layer.ts
│   └── reconstruction-layer.ts
├── lib/
│   ├── temporal-stations.ts
│   ├── event-packet.ts
│   ├── reconstruction-key.ts
│   ├── layer-manifest.ts
│   └── spacetime-query.ts
├── state/
│   └── spacetime-store.ts
└── types/
    └── spacetime.ts
```

**Reusable precedents already in `features/sightings/`:** `useTimeSeriesAnimation.tsx` (→ flap player),
`animated-arc-layer.tsx` / `animated-arc-group-layer.tsx` (→ trajectories layer).

---

## 8. API redesign

```
GET  /api/spacetime/events?west=&south=&east=&north=&from=&to=&types=&minimumCredibility=
GET  /api/spacetime/events/:id/evidence
POST /api/spacetime/reconstructions
GET  /api/spacetime/reconstructions/:id
GET  /api/spacetime/stations?investigationId=&viewport=&from=&to=
GET  /api/spacetime/flaps/:id
```

For larger datasets: query by time window and bounding box · cluster server-side or with H3 · stream detail
only after selection · serve vector tiles or binary deck.gl-friendly data · avoid sending the entire sightings
archive to the browser.

> **Existing foundation:** `/api/disclosure/uap-sightings` already implements year-range querying, `limit`,
> 10-year batching, and optional stats via `getSightingsByTimeChunk`. Generalize it to bounding-box + type +
> credibility rather than writing a new bounded-query layer from scratch. The globe currently bypasses it in
> favor of static `/sightings.geojson` — that bypass is the actual thing to fix.

---

## 9. Primary interaction layout

```
┌─────────────────────────────────────────────────────────────┐
│ Investigation / Search / Mode / Share                       │
├───────────────┬───────────────────────────────┬─────────────┤
│ Evidence      │                               │ Event /     │
│ Layers        │       MAP / GLOBE             │ Evidence    │
│               │                               │ Inspector   │
│ Sightings     │    selected event marker      │             │
│ Nuclear       │    trajectories / clusters    │ Sources     │
│ Military      │    reconstruction overlay     │ Claims      │
│ Weather       │                               │ Confidence  │
│ Documents     │                               │ Reconstruct │
├───────────────┴───────────────────────────────┴─────────────┤
│              ADAPTIVE TEMPORAL INSTRUMENT                   │
│  1945 ─ 1947 ─ ROSWELL ─ 1949 ─ 1952 WASHINGTON ─ 1953      │
└─────────────────────────────────────────────────────────────┘
```

### The lever principle — non-negotiable

**Browsing, filtering and thinking are free. Generation occurs only through an unmistakable deliberate action.**

GL4SS explicitly redesigned around this rule after automatic generation made *pausing on the timeline* a
billable event. That interaction deserves to survive.

---

## 10. Delivery sequence

**Foundation** — shared `SpacetimeEvent` normalization · replace static all-dataset fetching with bounded
temporal/spatial queries (generalize the existing route) · synchronized viewport + temporal cursor +
selected-event state · adaptive temporal dial · connect current sightings and historical events to one cursor.

**Evidence instrument** — layer panel · credibility and provenance filtering · event inspector · relationship
arcs · precision and uncertainty visualization.

**Reconstruction** — Event Evidence Packet · staged scene planning · one deliberate still-image mode · central
artifact + manifest storage · clear synthetic-content labeling.

**Comparative analysis** — pinned temporal comparison · witness and hypothesis comparison · blink/seam/difference
modes · evidence-delta summaries.

**Narrative system** — Guided Investigations · waypoint camera and layer choreography · flap playback ·
space-time capsules.

**Advanced** — multi-sensor reconstruction · agent-programmed investigations · collaborative sessions ·
predictive and counterfactual overlays · 3D altitude and trajectory analysis.

---

## 11. The MVP that actually matters

1. Open a full-screen globe.
2. Display sightings and historical events.
3. Move a temporal dial and watch the visible evidence field change.
4. Select an event and see its sources, credibility and context.
5. Deliberately generate one evidence-bounded reconstruction.
6. Pin another date or hypothesis and compare them.
7. Save and share that complete state.

Do **not** begin with video, sound, elaborate wormholes, or ten reconstruction modes.

> The killer feature: **select a real event, move through its historical context, and generate a transparent
> reconstruction whose relationship to the evidence is visible.** Everything else is theater until that works.

---

## 12. Naming

```
Ultraterrestrial
└── Temporal Observatory
    ├── Spacetime Canvas
    ├── Evidence Layers
    ├── Adaptive Temporal Dial
    ├── Looking Glass Reconstructions
    ├── Temporal Compare
    ├── Flap Playback
    └── Guided Investigations
```

The interactive reconstruction mode is **Looking Glass** (alternate: Chronoscope).

This is not a decorative extension of the sightings globe. It is the feature that unifies the map, timeline,
ontology, evidence framework, research agents, generated media, and guided narrative into one instrument.
