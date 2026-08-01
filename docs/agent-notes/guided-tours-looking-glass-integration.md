# Guided Tours × The Looking Glass — Curated Spatiotemporal Journeys

> Design plan for baking the [Looking Glass reconstruction feature set](./looking-glass-spatiotemporal-integration.md)
> into the **Guided Tours** feature (roadmap item — `docs/roadmap.md:93`,
> pitch/README "Interactive exhibits and guided tours").
>
> Worked example: **"Roswell — Black Physics to Advanced Propulsion."**

Status: **Design proposal** · Depends on: Looking Glass (Phases 1–3) · Owner: TBD

---

## 1. Why these two features belong together

Guided Tours are already promised as "curated paths through the library." Today
that would mean an ordered list of documents and events. But every stop worth
touring is a **place at a time** — and we now have an engine (§Looking Glass)
that can render any place at any time. Baking the Looking Glass into tours turns
a reading list into a **guided time-travel expedition**: the narrator advances,
the temporal dial spins to the stop's year, the pin flies to its coordinates, the
wormhole opens, and the reconstructed scene resolves while the narration plays.

The substrate already exists:
- `journey` is a first-class `ViewMode` (`src/layouts/historical-events-timeline/types.ts`).
- `features/3d/3d-timeline-journey` and `features/3d/scroll-through-3d/path-journey`
  already move a camera along an ordered path of events with coordinates.
- Tour stops and Looking Glass reconstructions consume the *same* record shape —
  `{ name, date, latitude, longitude, location, description, photos }` (see
  `features/3d/visualizations/spatial-gallery/events.ts`).

So a Guided Tour is, structurally, **an ordered list of Looking Glass
coordinates with narration between them.** The wormhole is the transition; the
dial and pin are the "camera"; the reconstruction is the destination.

---

## 2. Concept: the Tour as a reconstruction playlist

```
Tour "Roswell: Black Physics → Advanced Propulsion"
  Stop 1 ── narration + ReconstructionRequest(Foster Ranch, 1947-07)
     │  wormhole transition (forward, amber→cool by time delta)
  Stop 2 ── narration + ReconstructionRequest(Roswell AAF, 1947-07)
     │
  Stop 3 ── … Wright-Patterson … Area 51/S-4 … USS Nimitz …
```

Each stop declares a `ReconstructionRequest` (from the Looking Glass types). The
tour player pre-warms each stop's reconstruction (cache hit → instant), drives
the dial/pin, plays the wormhole for the true generation/transition duration, and
renders the frame with synchronized narration. Users can pause, free-look, open
the full Looking Glass on the current stop, branch to a linked case file, or
export the whole tour as a film.

---

## 3. Relationship to existing pieces

| Existing / planned | Role in Guided Tours |
| --- | --- |
| `historical-events-timeline` `journey` ViewMode | The tour is the concrete implementation of `journey` mode |
| `features/3d/3d-timeline-journey`, `scroll-through-3d/path-journey` | Camera/path mechanics for the between-stop travel |
| Looking Glass `temporal-dial`, `spatial-pin`, `wormhole`, `viewer` | Reused verbatim as the tour "player" chrome |
| Looking Glass `Reconstructions` / `ReconstructionFrames` tables | Each stop references (and pre-warms) a reconstruction |
| `services/sightings`, `Events`/`Locations`/`Personnel`/`Documents` | Stops link to real records; a stop can surface testimony + docs |
| `features/case-files` + Liveblocks | A stop can open its source case file; tours are shareable/collaborative |
| `services/mastra` + AI | Optional AI **tour-author** that assembles a tour from a topic or a set of records |

No new rendering infrastructure — Guided Tours is an **orchestration layer** over
the Looking Glass plus a thin data model and an authoring surface.

---

## 4. Data model (Xata)

Additive tables; stops reference existing records and Looking Glass
reconstructions.

```
Tours
  id
  slug               string  // "roswell-black-physics-to-advanced-propulsion"
  title              string
  subtitle           string
  synopsis           text
  theme              json    // palette, cover art, audio bed
  status             enum('draft','published','archived')
  authorType         enum('editorial','ai','community')
  createdBy          link -> users
  createdAt          datetime

TourStops
  id
  tourId             link -> Tours
  order              int
  title              string
  narration          text                 // spoken/on-screen narration
  subjectType        enum('event','sighting','personnel','document','freeform')
  subjectId          link -> Events | Sightings | Personnel | Documents  (nullable)
  spatial            json  -> SpatialCoordinate   // { lat, lng, label }
  temporal           json  -> TemporalCoordinate  // { year, hourOfDay }
  reconstructionId   link -> Reconstructions      // pre-warmed; nullable until built
  transitionHint     json  // { direction: 'forward'|'back', durationMs, palette }
  linkedCaseFileId   link -> CaseFiles            // optional "go deeper"
  createdAt          datetime
```

A `TourStop` is deliberately a superset of a `ReconstructionRequest`: `{ subjectType,
subjectId, spatial, temporal }` maps 1:1 onto the Looking Glass request, so
building a stop's reconstruction is `reconstruct(stopToRequest(stop))`.

### Types (`src/types/guided-tours.ts`)

```ts
import type { ReconstructionRequest, SpatialCoordinate, TemporalCoordinate } from './looking-glass'

export interface TourStop {
  id: string
  order: number
  title: string
  narration: string
  subjectType: 'event' | 'sighting' | 'personnel' | 'document' | 'freeform'
  subjectId?: string
  spatial: SpatialCoordinate
  temporal: TemporalCoordinate
  reconstructionId?: string
  transitionHint?: { direction: 'forward' | 'back'; durationMs: number; palette?: string }
  linkedCaseFileId?: string
}

export interface Tour {
  id: string
  slug: string
  title: string
  subtitle?: string
  synopsis: string
  stops: TourStop[]
  theme?: Record<string, unknown>
  status: 'draft' | 'published' | 'archived'
  authorType: 'editorial' | 'ai' | 'community'
}

export const stopToRequest = (stop: TourStop): ReconstructionRequest => ({
  subjectType: stop.subjectType === 'freeform' ? 'freeform'
    : stop.subjectType === 'sighting' ? 'sighting' : 'event',
  subjectId: stop.subjectId,
  spatial: stop.spatial,
  temporal: stop.temporal,
})
```

---

## 5. Feature structure (`src/features/guided-tours`)

```
features/guided-tours/
  tour-player/
    tour-player.tsx          // orchestrator (client): drives dial/pin/wormhole/viewer
    tour-hud.tsx             // stop index, progress rail, play/pause, captions
    narration-track.tsx      // synced narration (text + optional TTS audio)
    stop-transition.ts       // computes transitionHint from temporal delta between stops
  tour-map/
    tour-route.tsx           // the path drawn across globe/earth between stop pins
  tour-authoring/
    tour-composer.tsx        // editorial drag-order stop builder
    ai-tour-suggest.ts       // Mastra agent: topic/records -> proposed Tour
  tour-catalog/
    tour-catalog.tsx         // browse/feature published tours
  data/
    tours/                   // seeded editorial tours (see §7 example)
```

Player = Looking Glass viewer + a HUD and a narration track. The signature
between-stop **wormhole** already exists in `features/looking-glass/wormhole`;
`stop-transition.ts` just chooses direction/palette/duration from the year delta
(large forward jump → long cool tunnel; short back-step → short amber tunnel).

### Routes
- `/tours` — catalog (`app/(site)/tours/page.tsx`, RSC).
- `/tours/[slug]` — the player (RSC shell fetches `Tour` + pre-warms
  reconstructions; hydrates the client `tour-player`).
- `journey` ViewMode on existing timeline/history pages can launch the matching
  tour inline.
- Deep link `/tours/[slug]?stop=3` resumes at a stop and is embeddable in a case
  file.

### Playback loop
1. RSC loads the `Tour`; server pre-warms each stop's reconstruction via
   `reconstruct(stopToRequest(stop))` (cache-first).
2. Player sets dial → `stop.temporal`, pin → `stop.spatial`.
3. On advance: `stop-transition` fires the wormhole for `transitionHint.durationMs`
   (or until the next reconstruction is `ready` over SSE).
4. Tunnel resolves onto the reconstructed frame; `narration-track` plays.
5. HUD exposes: pause, free-look, "open in Looking Glass," "open case file,"
   "export tour as film."

---

## 6. Authoring

- **Editorial** — `tour-composer`: pick records (events/sightings/personnel/docs),
  drag to order, write narration; spatial/temporal auto-fill from each record and
  are tweakable. Save as draft → publish.
- **AI-assisted** — `ai-tour-suggest` (Mastra agent): given a topic or a set of
  selected mind-map nodes, propose an ordered stop list with draft narration and
  scene-plan seeds, grounded in the linked records. Human edits before publish.
- **Community** — `authorType:'community'` tours behind the same review gate as
  reconstructions attaching to public case files (epistemic-integrity policy from
  the Looking Glass doc §9).

---

## 7. Worked example — *Roswell: Black Physics to Advanced Propulsion*

A five-stop narrative arc that walks the popular disclosure throughline from the
1947 Roswell debris field to the reverse-engineering / advanced-propulsion lore
and its modern echo in the Nimitz encounter. Every stop is a real, publicly
documented location in UFO history; the reconstructions are **explicitly labelled
AI dramatizations of the *claims and testimony*, not photographic record** — this
tour is the ideal stress test of that labelling because its later stops are
contested. Coordinates are approximate, for the dial/pin.

```ts
// src/features/guided-tours/data/tours/roswell-black-physics.ts
import type { Tour } from '@/types/guided-tours'

export const roswellBlackPhysicsTour: Tour = {
  id: 'tour_roswell_black_physics',
  slug: 'roswell-black-physics-to-advanced-propulsion',
  title: 'Roswell: Black Physics to Advanced Propulsion',
  subtitle: 'From a July 1947 debris field to the propulsion questions it left behind',
  synopsis:
    'Trace the disclosure throughline that begins on a New Mexico ranch in ' +
    '1947 and runs through the institutions, claims, and encounters that turned ' +
    '"what fell at Roswell" into a decades-long question about how such craft ' +
    'could move. Each stop reconstructs the scene as described by the record and ' +
    'its testimony — a dramatization of the account, not a photograph of it.',
  status: 'published',
  authorType: 'editorial',
  theme: { palette: 'declassified-amber', audioBed: 'desert-wind-lowdrone' },
  stops: [
    {
      id: 'stop_1_foster_ranch',
      order: 1,
      title: 'The Debris Field — Foster Ranch, July 1947',
      narration:
        'Northwest of Roswell, ranch foreman Mack Brazel finds a scatter of ' +
        'foil-like, unusually light material after a night of thunderstorms. ' +
        'The Looking Glass reconstructs the field at dawn from Brazel’s ' +
        'account — the debris line, the ranch, the storm clearing to the east.',
      subjectType: 'event',
      spatial: { lat: 33.94, lng: -105.52, label: 'Foster (Brazel) Ranch, near Corona, NM' },
      temporal: { year: 1947, hourOfDay: 6, stationIndex: 0 },
      transitionHint: { direction: 'forward', durationMs: 2600, palette: 'amber' },
    },
    {
      id: 'stop_2_raaf',
      order: 2,
      title: 'The Retraction — Roswell Army Air Field',
      narration:
        'Days later the 509th Bomb Group’s base issues a press release ' +
        'announcing a "flying disc" — then walks it back to a weather ' +
        'balloon. Reconstruct the flight line and press room on the day the ' +
        'story changed shape.',
      subjectType: 'event',
      spatial: { lat: 33.30, lng: -104.53, label: 'Roswell Army Air Field, NM' },
      temporal: { year: 1947, hourOfDay: 11, stationIndex: 0 },
      transitionHint: { direction: 'forward', durationMs: 1800, palette: 'amber' },
    },
    {
      id: 'stop_3_wright_patterson',
      order: 3,
      title: 'The Institution — Wright-Patterson AFB',
      narration:
        'Recovered material is said to route to Wright Field’s Foreign ' +
        'Technology Division — the "Hangar 18" of legend. Here the ' +
        'narrative turns from an incident into a program: materials analysis, ' +
        'secrecy, and the first question of "black physics" — how do you ' +
        'study something you cannot explain?',
      subjectType: 'event',
      spatial: { lat: 39.81, lng: -84.05, label: 'Wright-Patterson AFB, Dayton, OH' },
      temporal: { year: 1951, hourOfDay: 14, stationIndex: 0 },
      transitionHint: { direction: 'forward', durationMs: 3200, palette: 'cool' },
    },
    {
      id: 'stop_4_s4_papoose',
      order: 4,
      title: 'The Claim — S-4, Papoose Lake',
      narration:
        'In 1989 Bob Lazar publicly claims he was hired to reverse-engineer ' +
        'craft propulsion at S-4, south of Groom Lake, describing a gravity-wave ' +
        'drive fuelled by "Element 115." Reconstruct the hangar bays as ' +
        'described — clearly flagged as a contested account, presented so ' +
        'viewers can weigh it, not accept it.',
      subjectType: 'personnel',
      spatial: { lat: 37.13, lng: -115.79, label: 'S-4 / Papoose Lake, NV (claimed)' },
      temporal: { year: 1989, hourOfDay: 21, stationIndex: 0 },
      transitionHint: { direction: 'forward', durationMs: 3000, palette: 'cool' },
    },
    {
      id: 'stop_5_nimitz',
      order: 5,
      title: 'The Echo — USS Nimitz, 2004',
      narration:
        'Fifty-seven years later, Navy F/A-18 crews off Baja track a "Tic-Tac" ' +
        'object performing accelerations with no visible propulsion — the ' +
        'modern, radar-and-FLIR-documented version of the same question Roswell ' +
        'first posed. The tour ends on the open problem, not an answer.',
      subjectType: 'sighting',
      spatial: { lat: 31.80, lng: -117.40, label: 'Off Baja California (Nimitz CSG op area)' },
      temporal: { year: 2004, hourOfDay: 12, stationIndex: 0 },
      transitionHint: { direction: 'forward', durationMs: 2400, palette: 'cool' },
      linkedCaseFileId: undefined, // link to the Nimitz case file when seeded
    },
  ],
}
```

**How it plays:** open `/tours/roswell-black-physics-to-advanced-propulsion`. The
dial spins to 1947 and the pin drops on the New Mexico high desert; the wormhole
resolves onto a dawn debris field. Amber short-hops carry you to the airfield,
then a long cool tunnel jumps years and half a continent to Wright-Patterson.
Stop 4 wears a persistent **"Contested account"** banner over the reconstruction.
The final tunnel lands in 2004 over the Pacific, and the narration closes on the
unresolved propulsion question — with a "go deeper" link into the Nimitz case
file and an "export as film" button.

This example is deliberately chosen to exercise the hard cases: a **claim-based**
stop (S-4) next to **documented** ones (Nimitz), proving the labelling model, and
big space + time jumps between stops, proving the transition engine.

---

## 8. Phased roadmap

**Phase 0 — Model & seed (0.5 wk).** `Tours`/`TourStops` tables, `guided-tours`
types + `stopToRequest`, seed the Roswell tour as data.

**Phase 1 — Player MVP (1–2 wk).** `tour-player` over the Looking Glass viewer:
ordered stops, dial/pin drive, narration track, HUD. Static images only, reusing
existing wormhole. Ship `/tours` + `/tours/[slug]`.

**Phase 2 — Transitions & route (1 wk).** `stop-transition` (palette/duration from
year delta), `tour-route` path across the globe, deep-link resume, `journey`
ViewMode launch.

**Phase 3 — Authoring (1–2 wk).** `tour-composer` editorial builder; publish flow;
"open in Looking Glass" / "open case file" from a stop.

**Phase 4 — AI author & export (1–2 wk).** `ai-tour-suggest` Mastra agent
(topic/records → draft tour); export-tour-as-film; community submission + review
gate.

**Phase 5 — Polish.** TTS narration option, `prefers-reduced-motion` (skip
wormhole → cross-fade), a11y (captions, keyboard stepping), mobile, Storybook +
Vitest for `stop-transition` and `stopToRequest`.

---

## 9. Risks & open questions

- **Inherits every Looking Glass risk** (§9 of that doc): generation cost,
  epistemic integrity, faithfulness. Tours *amplify* the integrity risk because a
  curated sequence implies an authored argument — contested stops (e.g. S-4) MUST
  carry standing "claim" labelling and cite the record.
- **Editorial responsibility.** A published tour is an editorial position. Keep
  `authorType` visible, require sourced narration, and route community tours
  through the same review gate as public case-file reconstructions.
- **Pre-warm cost.** Pre-warming every stop of every browsed tour is expensive —
  pre-warm lazily (current + next stop), lean on the reconstruction cache, and
  pre-render/pin canonical frames for *published* editorial tours so they are
  effectively free to view.
- **Narration source.** Editorial-written vs. AI-drafted vs. TTS — decide voice
  and whether AI narration needs human sign-off (recommend: yes, for published).

**Open questions for product:**
1. Are published editorial tours' canonical frames pre-rendered and pinned (so
   viewing never bills), with live generation reserved for free-form exploration?
2. Do community-authored tours need review before publish? (recommend: yes)
3. Does "export tour as film" stitch stop videos server-side, or record the live
   player session?

---

## 10. First implementation slice (when approved)

1. `src/types/guided-tours.ts` (+ Zod) and `stopToRequest`.
2. Xata migration: `Tours`, `TourStops`.
3. Seed `data/tours/roswell-black-physics.ts` as the reference tour.
4. `features/guided-tours/tour-player` over the Looking Glass viewer; routes
   `/tours` and `/tours/[slug]`.
5. `stop-transition.ts` + Storybook/Vitest for it and `stopToRequest`.

Everything reuses the Looking Glass runtime and the existing journey/path
mechanics — the net-new surface is two tables, one types file, and the
`guided-tours` feature folder.
