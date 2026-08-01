# Spatiotemporal Feature Set — Plan of Record

> Single reconciled plan merging three design docs into one authority. Where the
> three disagree, **this document wins.**
>
> Reconciles:
> 1. [`looking-glass-spatiotemporal-integration.md`](./looking-glass-spatiotemporal-integration.md) — the reconstruction engine
> 2. [`guided-tours-looking-glass-integration.md`](./guided-tours-looking-glass-integration.md) — curated journeys
> 3. ChatGPT's "Temporal Observatory" proposal — codebase-grounded architecture + epistemic model

Status: **Plan of record** · Supersedes conflicting sections of docs 1–3 · Owner: TBD

---

## 0. What changed and why

Doc 3 did deeper reconnaissance on the *rendering* and *data-fetch* layers than
docs 1–2 and produced a stronger *epistemic* model. Docs 1–2 were tighter on
*scope*, *naming*, and *cost*. This plan takes the best of each and settles the
three things the team must not leave ambiguous: **names**, **the `Reconstructions`
schema**, and **the data-enrichment prerequisite**.

Verified facts driving the decisions below (checked against the repo):
- Host stack is **Next 15 / React 19**, **Mapbox GL + `@deck.gl/mapbox`**, plus
  `three` / `three-globe` / R3F. (Doc 3's "Next 14 / React 18" was wrong; both
  apps are React 19, so cross-version friction is minimal.)
- The sightings surface fetches `{sightings, militaryBases, ufoPosts}` and the
  backing endpoint `api/disclosure/data-layer/sightings/route.ts` reads whole
  `public/*.geojson` files from disk and returns them together. This must change.
- `Sightings` records today are essentially **free-text `description` + `shape` +
  coordinates** — they do *not* carry the structured evidence fields the
  epistemic engine assumes. That gap is now a tracked prerequisite (§5).

---

## 1. Decisions (binding)

### D1 — Naming
- **Looking Glass** = the reconstruction engine + viewer. (Already in two committed
  docs; keep it.)
- **Guided Tours** = curated journeys. (Roadmap term; keep it.)
- **Temporal Observatory** = the name of the *full-screen host page/mode* only
  (`/observatory`) — the surface that composes the map, dial, layers, Looking
  Glass, compare, and tours. It is **not** a new umbrella that renames the others.
- "Chronoscope," "Spacetime Canvas" — dropped as product names; usable as internal
  component names at most.

### D2 — One renderer
Do **not** add a second globe. The Temporal Observatory renders on the existing
**Mapbox + deck.gl** surface. GL4SS's Leaflet/raw-Three globe is not ported. The
Looking Glass **wormhole** stays an R3F/Three overlay (a transition effect, not a
globe) — that is not "a second renderer," it's a post-effect layer.

### D3 — One `Reconstructions` schema
Adopt Doc 3's **evidence-versioned** schema (it prevents stale reconstructions),
superseding the simpler schema in docs 1–2. Canonical definition in §4.

### D4 — Integration posture
GL4SS is a **clean-room design/prompt reference**, not vendored code (AGPL-3.0;
see §7). This is unchanged from doc 1 and reinforced by doc 3.

### D5 — Scope discipline
Build Doc 3's **§11 MVP**, not its §3 feature catalogue. Flap playback,
multi-sensor viewpoints, agent-programmed investigations, predictive overlays, and
collaborative sessions are **explicitly out of the first two milestones.**

---

## 2. Architecture (reconciled)

```
Temporal Observatory  (/observatory — full-screen host)
├── Spacetime state       synchronized { viewport, TemporalCursor, selection }
├── Map surface           existing Mapbox + deck.gl (D2)
├── Evidence layers       toggle/weight; each layer temporally valid (§3)
├── Adaptive Temporal Dial  station ladder + exact-time + range (§3)
├── Looking Glass         evidence-bounded reconstruction + viewer + wormhole
├── Temporal Compare      same place / event / hypothesis / witness
└── Guided Tours          ordered playlists of Looking Glass stops + narration
```

Everything shares **one** space-time state model — the core problem doc 3
correctly identified is that today's map, timeline, and ontology are
*desynchronized*. Fixing that (one cursor, one viewport, one selection) is
Milestone 0 and unblocks all three feature docs.

---

## 3. Adopted from Doc 3 (folded into docs 1–2)

These supersede or extend the corresponding sections of docs 1–2:

- **Bounded data API.** Replace the read-all-from-disk endpoint with
  `GET /api/spacetime/events?west&south&east&north&from&to&types&minCredibility`,
  server-side clustering, detail-on-select. (Docs 1–2 didn't address fetch.)
- **Precision-aware `TemporalCursor`** (`station | exact | range`, explicit
  `precision`), replacing doc 1's flat `{year, hourOfDay}`. Medieval-season vs.
  second-level-telemetry must not render as equally precise.
- **Temporal layer validity** (`validFrom/validUntil/observedAt/publishedAt`): a
  base doesn't appear before it existed; 1947 reconstructions don't use current
  city geometry.
- **`EventEvidencePacket` + `ReconstructionManifest`** replace doc 1's `ScenePlan`
  + "watermark it." The model reconstructs *from the packet* and introduces
  nothing unsupported; every rendered element carries a
  documented/inferred/disputed status that persists into captions and exports.
- **Versioned `reconstructionKey`** (§4) replaces doc 1's
  `(lat,lng,year,hour,model,seed)` cache key.

## 3b. Kept from Docs 1–2 (where they were stronger)

- **Cost model:** confirm-to-spend "lever," per-user rate limits, and — for
  **published** editorial tours — pre-render and pin canonical frames so viewing
  never bills. (Doc 3 kept the lever but left cost/pre-warm unanswered.)
- **Guided Tours as a Looking Glass playlist:** `TourStop` is a superset of a
  reconstruction request; `stopToRequest()` maps 1:1. (Doc 2.)
- **Tight phasing and a single "wow" moment** rather than a subsystem catalogue.

---

## 4. Canonical data model

```
Reconstructions        (supersedes the schemas in docs 1 and 2)
  id
  eventId              link -> spacetime_events
  reconstructionKey    string  // versioned identity, see below
  evidenceSnapshotHash string  // hash of the EventEvidencePacket used
  mode                 enum('environment','witness','object-relative','instrument','explanatory','cinematic')
  viewpoint            string
  hypothesisId         string?  // nullable
  status               enum('queued','planning','rendering','ready','failed')
  plan                 json     // reconstruction plan
  manifest             json  -> ReconstructionManifest
  promptHash           string
  imageUrl             string?
  videoUrl             string?
  thumbnailUrl         string?
  model                string
  modelVersion         string?
  promptVersion        string
  createdAt            datetime

spacetime_events       (normalization layer over Sightings/Events/Testimony/…)
  id, entityType, entityId, title,
  startAt, endAt?, timePrecision,
  latitude, longitude, altitudeMeters?, uncertaintyRadiusKm?,
  credibilityScore?, evidenceCount, sourceIds[]

Tours / TourStops      (unchanged from doc 2, but TourStop.reconstructionId -> Reconstructions above)
investigation_waypoints, event_relationships   (from doc 3; later milestones)
```

```ts
function reconstructionKey(i: ReconstructionRequest): string {
  return hash({
    eventId: i.eventId,
    evidenceSnapshotHash: i.evidenceSnapshotHash,
    timestamp: i.timestamp,
    viewpoint: i.viewpoint,
    hypothesisId: i.hypothesisId,
    mode: i.mode,
    styleProfile: i.styleProfile,
    model: i.model,
    promptVersion: i.promptVersion,
  })
}
```

`cinematic` mode is the *only* mode allowed to be atmospheric/interpretive, and it
must be visually segregated from the analytical modes — never conflated, never
captioned as archival.

---

## 5. The prerequisite Doc 3 hid (now tracked)

The `EventEvidencePacket` assumes structured fields —
`observerPosition`, `reportedObjectPosition`, per-factor `environmentalContext`,
and separated `observed / disputed / inferred` claims — that **the current data
model does not have.** Today a sighting is free-text `description` + `shape` +
coords.

**Therefore:** the epistemic engine is only as good as an evidence-extraction
project that does not yet exist. Two honest options:

- **Milestone-gated enrichment (recommended).** Stand up an extraction pipeline
  (reuse `services/ai` NER + `services/mastra` agents) that promotes free-text
  records into structured `EventEvidencePacket`s, human-reviewed. The Looking
  Glass consumes only enriched records.
- **Graceful degradation.** For un-enriched records, the packet collapses to
  `{ description, coords, timePrecision }` and the manifest marks almost
  everything `inferred`. Usable, but visibly low-confidence — which is honest.

Both ship; enrichment raises the confidence ceiling over time. This must be a
line item, not an assumption.

---

## 6. Delivery sequence (authoritative)

**M0 — Unified space-time state (foundation).** One synchronized
`{ viewport, TemporalCursor, selection }` store; connect the *existing* sightings
+ historical events to it; adaptive temporal dial; bounded events API replacing
the read-all endpoint. No reconstruction yet. *This unblocks everything.*

**M1 — Evidence instrument.** Layer panel with temporal validity; credibility /
provenance filtering; event inspector; precision + uncertainty visualization.

**M2 — Looking Glass MVP (the killer feature).** `EventEvidencePacket` (degrading
gracefully per §5) → staged plan → **one** deliberate still-image `environment`
reconstruction → central storage + `ReconstructionManifest` → unmistakable
synthetic-content labelling. The "lever" cost gate ships here.

**M3 — Temporal Compare.** Pinned same-place/other-time, plus hypothesis and
witness comparison; blink / seam / difference; evidence-delta summary.

**M4 — Guided Tours.** `Tours`/`TourStops`, `tour-player` over the Looking Glass
viewer, wormhole between stops, the seeded *Roswell: Black Physics to Advanced
Propulsion* tour; pre-render + pin canonical frames for published tours.

**Later (explicitly deferred):** flap playback, multi-sensor instrument
viewpoints, agent-programmed investigations, predictive/counterfactual overlays,
collaborative sessions, tour-as-film export.

---

## 7. Open gates (unchanged, still blocking)

1. **AGPL-3.0** — clean-room vs. isolated microfrontend must be decided (with an
   ADR) before any GL4SS-derived code lands. Assumed clean-room.
2. **Generation funding** — platform-subsidised vs. user key vs. credits; plus the
   pre-render-and-pin policy for published tours.
3. **Review gate** — do community tours and public-case-file reconstructions
   require human sign-off? (Recommended: yes.)
4. **Enrichment ownership** — who builds/owns the §5 extraction pipeline, and is
   M2 gated on it or shipping degraded first? (Recommended: ship degraded, enrich
   in parallel.)

---

## 8. First implementation slice (when approved)

1. `src/types/spacetime.ts` — `TemporalCursor`, `EventEvidencePacket`,
   `ReconstructionManifest`, `ReconstructionRequest`, `reconstructionKey` (+ Zod).
2. `spacetime_events` normalization + `GET /api/spacetime/events` bounded query;
   retire the read-all endpoint.
3. Unified `spacetime-store` and the adaptive temporal dial wired to the existing
   deck.gl sightings/events layers (M0).
4. Only then: `Reconstructions` table + Looking Glass M2.

Net: one host page, one shared state model, one bounded API, one reconstruction
schema — with docs 1–3 folded into a single buildable sequence.
