# The Looking Glass — Spatiotemporal Reconstruction Feature Set

> Design plan for integrating [`elder-plinius/GL4SS`](https://github.com/elder-plinius/GL4SS)
> ("The Looking Glass") into the ultraterrestrial platform as a spatiotemporal
> rendering layer for sightings and historical events.

Status: **Design proposal** · Owner: TBD · Target: post personnel-ranking-system

---

## 1. Concept

GL4SS is a browser-only **spatiotemporal image/video engine**. The user picks a
point on Earth (`lat`, `lng`), a moment in time (a year between −252,000,000 and
+3050, plus an hour of day), and the engine renders *what existed at that
space-time intersection* — optionally as a short film with audio. It ships a
temporal dial (284 quantized time-stations), a celestial sun/moon interface, a
"lever" that triggers generation, a fractal-noise **wormhole transition shader**,
55 curated historical "journeys," and an AI pipeline (scene-plan → image → video)
driven through OpenRouter with IndexedDB frame caching.

Our platform already stores exactly the inputs GL4SS needs. Every `Sightings`
record carries `latitude`, `longitude`, `city`, `state`, `country`, `shape`,
`date`, `description`, and `media_link`; every `Events` record `occurs_at` a
`Locations` record. **The Looking Glass turns each of those rows into a place you
can stand in and watch.** Instead of reading that a bright disc was seen over
Lonnie Zamora's Socorro in April 1964, you rotate the dial to 1964, drop the pin
on 34.06 N / 106.90 W, pull the lever, and the wormhole opens onto a reconstructed
scene of that sighting.

This is the missing sensory layer of the disclosure archive: the data becomes
**witnessable**, not just browsable.

---

## 2. How it fits what already exists

| Platform capability (today) | What The Looking Glass adds |
| --- | --- |
| `features/data-viz/sightings` map + `components/globe`, `components/earth` | A "Reconstruct" affordance on any sighting/event marker |
| `components/timelines/*` (3d-timeline, draggable, scroll-through) | The 284-station **temporal dial** as a first-class time control, bound to real event density |
| `features/r3f/*`, `features/3d/*`, `components/shader`, `components/backgrounds/shader-bg` | Reuse of the R3F/WebGL runtime for the wormhole transition + celestial dial |
| `services/mastra`, `services/ai/*` (Claude, OpenAI, OpenRouter-ready) | A new `looking-glass` generation pipeline (scene-plan → image → video) that mirrors our existing agent/workflow pattern |
| `services/sightings/*` (`get-sightings`, `uap-sighting` Zod schema) | Reconstruction requests keyed off the same validated records |
| `features/case-files/*`, Liveblocks collab | Rendered frames become evidence artifacts, sharable in a case file |

Nothing here is greenfield rendering: we already run Three.js, R3F, GLSL shader
templates (`features/r3f/templates/Shader`), a globe, and an AI service layer.
The Looking Glass is mostly **composition + a new generation service**, not new
infrastructure.

---

## 3. Licensing decision (read first)

GL4SS is **AGPL-3.0-or-later**. This is the single most important constraint and
it dictates the integration shape.

- Copying GL4SS source directly into this repo makes the **combined work**
  AGPL, and because we ship a network service (Vercel), the AGPL §13 network
  clause would obligate us to offer complete corresponding source to every user.
  That is very likely incompatible with the rest of this codebase.
- **Recommended path — clean-room reimplementation.** Treat GL4SS as a *design
  reference and prompt-engineering reference*, and rebuild the pieces we want
  (temporal dial UX, celestial control, wormhole shader feel, scene-plan → image
  → video prompt pipeline) as original code inside our own MIT/proprietary tree,
  using our existing R3F + Mastra stack. The *ideas* are not copyrightable; the
  *code* is.
- **Alternative — isolate as an AGPL microfrontend.** Run GL4SS (or a fork) as a
  standalone service/iframe with its own source-offer, and integrate via
  `postMessage`. Keeps license boundaries clean but adds an origin, a second
  build, and a weaker UX seam. Acceptable for a fast prototype; not recommended
  for the product surface.

The rest of this document assumes the **clean-room** path and describes original
modules. Anywhere a GL4SS concept is named, it is named as *inspiration*.

> Action item: confirm the intended license of the ultraterrestrial repo before
> implementation, and record the clean-room decision in an ADR.

---

## 4. Feature set

Five shippable features, ordered by dependency.

### F1 — Temporal Dial (time control)
An original React/R3F control inspired by GL4SS's 284-station dial: non-linear
graduation (deep-time jumps compressing to annual precision near the present),
plus an hour-of-day ring. Unlike GL4SS, our dial is **data-aware** — station
density and marker "heat" are driven by real `Sightings`/`Events` counts per
bucket, so the dial doubles as a histogram of the archive. Emits a
`TemporalCoordinate` and is reusable by the existing timeline pages.

### F2 — Spatial Pin (place control)
Reuse `components/globe` / `components/earth` / `location-visualization`. Add a
"drop pin / snap to record" mode that emits a `SpatialCoordinate`. Snapping to an
existing sighting or event pre-fills both the pin and the dial from the record.

### F3 — Reconstruction Engine (the generation pipeline)
A new `services/looking-glass` service implementing scene-plan → image →
(optional) video, using our Mastra agents + OpenRouter models. Deterministic,
cacheable, and grounded in the record's own metadata (shape, description,
witness account, terrain). See §6.

### F4 — The Viewer (the experience)
The assembled surface: dial + pin + "lever," the **wormhole transition** on
generation, a frame gallery, blink-compare / hold-swipe between two eras, and
fullscreen. Mounted at `/looking-glass` and embeddable as a panel from any
sighting or event.

### F5 — Evidence capture & collaboration
Rendered frames/films are persisted as `Reconstructions` and can be attached to a
`CaseFile` as artifacts, annotated (`features/case-files/canvas`), and shared via
Liveblocks. Clearly labelled **AI reconstruction — not photographic evidence**.

---

## 5. Data model extensions (Xata)

New tables, additive; no changes to existing records required.

```
Reconstructions
  id
  subjectType        enum('sighting','event','freeform')
  subjectId          link -> Sightings | Events   (nullable for freeform)
  latitude           float
  longitude          float
  temporalYear       int        // signed; negative = BCE / deep time
  hourOfDay          int        // 0..23
  scenePlan          json       // structured prompt plan (see §6)
  status             enum('planned','generating','ready','failed')
  createdBy          link -> users
  createdAt          datetime

ReconstructionFrames
  id
  reconstructionId   link -> Reconstructions
  kind               enum('image','video')
  modelId            string     // which OpenRouter model produced it
  mediaUrl           string     // stored asset (Supabase storage / R2)
  thumbnailUrl       string
  seed               int
  meta               json       // aspect, duration, audio flag, cost
  createdAt          datetime
```

`Reconstructions` links back into the ERD via `subjectId` so a case file can pull
`CaseFiles }o--|| Events` → `Events ||--o{ Reconstructions`. Frame binaries live in
object storage (Supabase Storage or Cloudflare R2 — we already have
`services/cloudflare`); the DB stores URLs + metadata only.

### Shared types (`src/types/looking-glass.ts`)

```ts
export interface TemporalCoordinate {
  year: number      // signed
  hourOfDay: number // 0..23
  stationIndex: number
}

export interface SpatialCoordinate {
  lat: number
  lng: number
  label?: string
}

export interface ScenePlan {
  era: string
  setting: string
  subjects: string[]
  lighting: string
  cameraNote: string
  negativePrompt: string
  groundedFacts: string[] // pulled verbatim from the source record
}

export interface ReconstructionRequest {
  subjectType: 'sighting' | 'event' | 'freeform'
  subjectId?: string
  spatial: SpatialCoordinate
  temporal: TemporalCoordinate
}
```

Validate with Zod alongside the existing `UAPSightingSchema` pattern in
`services/sightings/uap-sighting.ts`.

---

## 6. Reconstruction pipeline (`src/services/looking-glass`)

Mirrors the existing Mastra workflow convention (`services/mastra/workflows`,
`services/ai/workflows/prompt-to-multistep.workflow.ts`).

```
reconstruct(request) →
  1. resolveContext()   // if subjectId: load record via get-sightings/get-events,
                        //   extract shape, description, witness testimony, terrain
  2. planScene()        // agent (Gemini/Claude via OpenRouter) → ScenePlan JSON,
                        //   grounded in groundedFacts so output stays faithful
  3. renderImage()      // OpenRouter image model (FLUX-class) → keyframe(s)
  4. [optional] renderVideo() // image→video model + ambient audio
  5. persistFrames()    // store to R2/Supabase, write ReconstructionFrames
  6. cache()            // IndexedDB client-side + DB server-side; keyed by
                        //   hash(lat,lng,year,hour,modelId,seed)
```

Design rules:
- **Grounding over invention.** The scene plan must incorporate the record's own
  `shape`, `description`, `city/state/country`, and any linked `Testimonies` so
  the render depicts *this* sighting, not a generic UAP. Deep-time/no-record
  points fall back to paleogeographic priors.
- **Model-agnostic.** Route all model calls through one OpenRouter adapter
  (extend `services/ai/openai/config.ts`) so image/video models are swappable and
  cost-capped.
- **Idempotent + cached.** Same coordinate hash → same cached frame; generation
  only bills on a genuine cache miss (GL4SS's model).
- **Cost & safety guardrails.** Per-user rate limit, a confirm-before-spend step
  on the lever, and a persistent "AI reconstruction" watermark + metadata flag on
  every frame.
- **Streaming status** over the existing `app/api/sse` channel so the wormhole
  transition can run for the true generation duration.

API surface: `src/app/api/looking-glass/route.ts` (POST reconstruct, GET status),
server actions under `services/looking-glass/actions/` following the
`services/sightings/actions` layout.

---

## 7. UX / component structure (`src/features/looking-glass`)

```
features/looking-glass/
  looking-glass.tsx              // orchestrator (client); composes the surface
  temporal-dial/
    temporal-dial.tsx            // F1 — R3F/SVG dial, data-aware stations
    dial-stations.ts             // non-linear graduation model
    temporal-dial.stories.tsx
  celestial-control/
    celestial-control.tsx        // sun/moon ring; drives hourOfDay + lighting
  spatial-pin/
    spatial-pin.tsx              // F2 — wraps globe/earth, snap-to-record
  lever/
    lever.tsx                    // trigger; confirm-to-spend
  wormhole/
    wormhole-transition.tsx      // R3F; reuse features/r3f/templates/Shader
    glsl/wormhole.frag           // original fractal-noise tunnel shader
  viewer/
    frame-gallery.tsx            // rendered frames, fullscreen
    blink-compare.tsx            // hold-swipe / blink between two eras
  journeys/
    curated-journeys.ts          // our own set: Socorro '64, Roswell '47,
                                 //   Phoenix Lights '97, Nimitz '04, …
```

Follows CLAUDE.md conventions: functional components, named exports,
kebab-case dirs, `use client` only where interaction demands it (dial, pin,
wormhole, viewer are client; data fetch stays in RSC page). Mobile-first,
Radix/Tailwind, `aria-label`s and keyboard nav on the dial and compare controls.

### Routes / entry points
- **`/looking-glass`** — full standalone experience (`app/(site)/looking-glass/page.tsx`),
  RSC shell fetches record context + hydrates the client orchestrator.
- **Embedded panel** — a "Reconstruct this moment" button on:
  - sighting markers in `features/data-viz/sightings`
  - `app/(site)/history/events/[id]/page.tsx`
  - the timeline pages, so scrubbing the dial can preview reconstructions inline.
- **Deep link** — `/looking-glass?lat=..&lng=..&year=..&hour=..&subject=..` so a
  reconstruction is shareable and embeddable in a case file.

### The signature moment
Pull the lever → the **wormhole transition** fires (directional palette: cool/blue
travelling forward in time, warm/amber travelling back — as in GL4SS), the SSE
stream reports scene-plan → image → video progress, and the tunnel resolves onto
the rendered scene. This transition *is* the product's emotional hook and should
get real polish (see the `threejs-animation` / `frontend-design` skills).

---

## 8. Phased roadmap

**Phase 0 — Decision & spike (0.5 wk).** Confirm license path (§3), write the
ADR, stand up the OpenRouter adapter, prove one hardcoded scene-plan → image call
end to end.

**Phase 1 — Static reconstruction (1–2 wk).** F1 dial + F2 pin + F3 image-only
pipeline + minimal viewer. Ship `/looking-glass` freeform. Persist
`Reconstructions`/`ReconstructionFrames`. No video, no wormhole yet.

**Phase 2 — Grounded in the archive (1 wk).** Snap-to-record; scene-plan grounded
in real sighting/event/testimony data; "Reconstruct" buttons on markers and the
event detail page; deep-link sharing.

**Phase 3 — The experience (1–2 wk).** Wormhole transition, celestial control,
blink-compare, curated journeys, SSE-driven progress, fullscreen. This is the
"wow" phase.

**Phase 4 — Video & evidence (1–2 wk).** Optional image→video + audio; attach
reconstructions to case files as labelled artifacts; Liveblocks sharing;
cost dashboard in `features/admin`.

**Phase 5 — Polish & guardrails.** Rate limits, cost caps, watermarking audit,
a11y pass, mobile pass, Storybook coverage, Vitest (incl. `--browser`) on the
dial graduation + coordinate hashing.

---

## 9. Risks & open questions

- **License (highest).** Clean-room vs. AGPL microfrontend must be decided before
  any code lands. See §3.
- **Generation cost.** Image/video models are expensive; caching + confirm-to-spend
  + rate limits are mandatory, not optional.
- **Epistemic integrity.** This platform is about evidence and credibility. AI
  reconstructions must be *unmistakably* labelled and never presented as
  photographic record — coordinate with the Claims & Evidence Evaluator role and
  keep reconstructions in their own artifact class.
- **Faithfulness.** Guardrails needed so the scene-plan stays anchored to the
  record rather than hallucinating a more dramatic scene.
- **Deep time accuracy.** Paleogeographic/astronomical priors for BCE and
  deep-time stations need a data source; scope for later.
- **Performance.** WebGL dial + wormhole + globe on one page — budget draw calls,
  lazy-load the viewer, respect `prefers-reduced-motion`.

**Open questions for product:**
1. Is the repo's own license compatible with vendoring, or is clean-room required? (assume required)
2. Who funds generation — platform-subsidised, user API key (GL4SS model), or credits?
3. Do reconstructions need human review before they can attach to a public case file?

---

## 10. First implementation slice (when approved)

1. ADR: license path + reconstruction-as-labelled-artifact policy.
2. `src/types/looking-glass.ts` + Zod schemas.
3. Xata migration: `Reconstructions`, `ReconstructionFrames`.
4. `services/looking-glass` with `planScene` + `renderImage` over an OpenRouter
   adapter; `app/api/looking-glass/route.ts`.
5. `features/looking-glass/temporal-dial` + `spatial-pin` + minimal `viewer`,
   wired at `app/(site)/looking-glass/page.tsx`.
6. Storybook + Vitest for the dial graduation and coordinate hashing.

Everything above reuses existing R3F, shader, globe, AI-service, and case-file
infrastructure — the new surface area is one service, two tables, and one feature
folder.
