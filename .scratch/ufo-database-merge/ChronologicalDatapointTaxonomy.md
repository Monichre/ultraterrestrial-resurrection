# Chronological Datapoint Taxonomy

**Status:** scratch recommendation (2026-08-09) — language design only; no schema migration.  
**Grounded in:** root `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, `docs/vision/UX_LANGUAGE_GUIDE.md`, `.scratch/ufo-database-merge/ThreeWayEventsComparison.md`.  
**Intent:** give an intuitive split between narrative-forming UAP chronology and lesser institutional/contextual ticks — without inventing a colliding ontology religion.

---

## Verdict (one line)

Keep **Event** for named UAP occurrences (Roswell lives here); put institutional/disclosure chronology in **Milestone**; put non-UAP era-framing ticks in **Backdrop**. Treat fame as **prominence**, not as a kind. Never call a storage row a **Waypoint**.

---

## 1. Recommended primary distinction (3 kinds)

| Kind | What it is | Fits existing voice? | Examples |
| --- | --- | --- | --- |
| **Event** | A named, temporally bounded **UAP occurrence** (or named flap treated as one historical unit) that researchers investigate as a case-spine node. | Already defined in `CONTEXT.md` — sharpen away from “institutional frame.” | Roswell, Kenneth Arnold, Nimitz, Phoenix Lights, Belgian Wave, O’Hare 2006 |
| **Milestone** | A chronological beat in the **disclosure / institutional apparatus** — program stand-ups, hearings, assessments, org founding, legislation, official releases. | Uses discourse sense of Disclosure without minting a fourth meaning of the word as a record type. | MUFON founded, Blue Book established, AATIP, ODNI assessment, NASA UAP study, 2022 hearings |
| **Backdrop** | A **non-UAP** historical tick that frames interpretation (Cold War / tech / media context) but is not itself a UAP case or disclosure apparatus beat. | Deliberately generic (UX guide: adopt ~6–8 native terms; leave the rest plain). | Sputnik, Moon landing, War of the Worlds broadcast, first atomic bombs |

**Do not adopt as kinds:** Case, Incident, Episode, Case File, Record, Waypoint, Beat, Sequence.

| Rejected noun | Why |
| --- | --- |
| **Case** | Colloquial shorthand for Event; “case file” is legacy Document/Raw Source language. |
| **Incident** | `CONTEXT.md` already: prefer Event; table is `events`. |
| **Episode** | TV/serial metaphor; not in vision vocab. |
| **Case file / Record** | Storage / Document territory — not chronological ontology. |
| **Waypoint** | Temporal Observatory / Guided Investigation **UI choreography** — a stop that *points at* an Event or Milestone. |
| **Beat / Sequence** | UX guide explicitly did **not** adopt Sequence-for-timeline. |

**Sighting** stays the granular observation table (NUFORC/MUFON-scale). It is chronological but not the narrative timeline spine. A famous Event may aggregate many Sightings; a Sighting does not become an Event just because it has a date.

**Wave** / **Hot Zone** stay analytical designations over Sightings — not ingestable timeline kinds.

---

## 2. Where “Roswell” sits

**Canonical noun: Event.**

- Storage / Domain Graph: one **Event** row (collapse semantic dups; keep aliases).
- Popular shorthand (“Roswell”) = **alias / display name**, not a second ontology.
- A **Dossier** opens *on* that Event (UI treatment), not as the kind.
- A Guided Investigation **Waypoint** may *land on* Roswell; the waypoint is authored tour state, not the entity.
- Related **Documents**, **Testimonies**, **Organizations**, **Key Figures** hang off the Event — they are not substitutes for it.

**Argue against “Case” as the canonical noun:** everyone says “the Roswell case,” but product language already reserved Event for exactly this spine, and “case file” poisons Document migration. Let users say “case” in prose; the system says **Event**.

---

## 3. Where MUFON founded / AATIP sit

**Canonical noun: Milestone.**

| Example | Kind | Notes |
| --- | --- | --- |
| MUFON founded (1969) | Milestone | Prefer linking to an **Organization** birth/activation date when the org row exists; Milestone is the chronological pin, Organization is the actor. |
| AATIP established | Milestone | Program stand-up in disclosure discourse — not a phenomenological Event. |
| Project Blue Book established | Milestone | Same. |
| ODNI Preliminary Assessment / NASA UAP study / NDAA UAP provisions / hearings | Milestone | Institutional acknowledgment / process beats (related to Disclosure sense 2 — discourse process — not L4 classification of one Event). |
| Pentagon videos released (2017) | Milestone | Disclosure apparatus release; may *reference* Events (Nimitz etc.) without becoming those Events. |

**Ingest implication (from ThreeWay comparison):** catalog-only institutional rows should not land in `events` as peer “famous cases.” Prefer a Milestone lane (table, typed subtype, or clearly separated chronology channel — implementation later). Join the ~31 famous-case overlaps by alias onto existing Events.

---

## 4. Orthogonality (do not conflate)

Three axes. Fame is not ontology. Ontology is not evidence.

```
kind            ∈ { Event | Milestone | Backdrop }     // what sort of chronological node
prominence      ∈ { Canonical | Peripheral }           // narrative gravity / default visibility
evidentiary     ∈ eight-state grammar (edges/readings) // Observed…Disconfirmed — NOT on the kind
```

| Axis | Owns | Does not own |
| --- | --- | --- |
| **Kind** | Phenomenology vs apparatus vs ambient history | How famous it is; how true it is |
| **Prominence** | Default layer weight (spine vs tick); tour eligibility defaults | Whether it is an Event |
| **Evidentiary state** | How strongly material supports a Reading / edge | Whether something is a Milestone |

**Examples of orthogonality:**

- Roswell → Event + Canonical (usually Contested / Corroborated *edges*, not a kind tag).
- Trans-en-Provence → Event + Canonical (or Peripheral depending on product curation) — still Event.
- Aaron Rodgers sighting (catalog) → likely **Sighting** or Peripheral Event if forced up — fame of the witness ≠ Event kind.
- MUFON founded → Milestone + often Peripheral on a globe, Canonical on a disclosure-timeline rail.
- MJ-12 “Eisenhower briefing” → still an Event *claim-object* or Milestone depending on framing; evidentiary Contested/Speculative — **do not** invent a “famous conspiracy” category.

**Rename pressure on `CONTEXT.md` Event gloss:** today’s “Higher-level than a Sighting; **institutional/historical frame**” is the muddy phrase that invited stuffing AATIP into `events`. Sharpen to: *named historical UAP occurrence of research significance; higher-level than a Sighting.* Institutional chronology → Milestone.

---

## 5. UI / product implications (one sentence each)

- **Spacetime (Temporal Observatory):** Events are primary space-time markers (geo + time); Milestones ride a secondary institutional rail / layer; Backdrops are dim era ticks that rarely demand camera focus.
- **Mindmap / Research Canvas:** Events are heavy Pins with constellation gravity and Dossier depth; Milestones are lighter Pins often edge-linked to Organizations/Topics; Backdrops stay off-graph unless an Investigation explicitly assembles them.
- **Guided tours (Guided Investigations):** Waypoints may target either Event or Milestone (claim → basis → counterpoint → unresolved → next); unused Milestone chrome stays hidden; never model Waypoint as the persisted datapoint kind.

---

## 6. Anti-patterns

1. **Stuffing everything into `events` with `category: ['famous']` / `['timeline']`.** Category arrays are metadata soup; they do not create a kind boundary and will re-create O’Hare×3 naming chaos with a fame tag on top.
2. **Calling institutional rows Events** because “they happened on a date.” Date ≠ Event.
3. **Minting Case / Incident / Episode** as parallel record types — collides with reserved/avoid lists and Document legacy.
4. **Using Waypoint as a DB entity type** — breaks Temporal Observatory language (waypoint = authored tour state).
5. **Equating Canonical with Corroborated.** Roswell can be Canonical *and* Contested.
6. **Promoting every Sighting to Event** because a catalog listed it under “incidents.”
7. **One timeline layer for all kinds** with identical visual weight — the product intuition fails immediately (Roswell vs “Eisenhower sworn in”).
8. **Inventing “disclosure-timeline” as a user-facing noun** while also saying Event/Milestone — fine as an *ingest lane / layer id*; prefer **Milestone** in ubiquitous language.

---

## Minimal decision rule

> **If** the node’s primary subject is a reported/claimed UAP occurrence or named flap → **Event**.  
> **Else if** the node’s primary subject is an institution, program, hearing, law, assessment, release, or org founding in the disclosure apparatus → **Milestone**.  
> **Else if** the node is non-UAP world history used only to frame the era → **Backdrop**.  
> **Else if** it is a single observation report without case-level identity → **Sighting** (not timeline-spine).  
> **Prominence** and **evidentiary state** are set separately — never encoded as the kind.

Tie-breakers:

- “Did something anomalous allegedly *happen* here/then?” → Event.  
- “Did the *bureaucracy / research network / legislature* change?” → Milestone.  
- “Would this belong on a general 20th-century history timeline with no UFO lens?” → Backdrop.

---

## Illustrative type sketch (not a migration)

```ts
/** Chronological spine kinds — orthogonal to prominence + evidentiary state */
type ChronologyKind = 'event' | 'milestone' | 'backdrop'

type Prominence = 'canonical' | 'peripheral'

type ChronologyNode = {
  id: string
  kind: ChronologyKind
  prominence: Prominence
  /** Popular shorthand + catalog titles; do not create duplicate rows */
  aliases: string[]
  occurredOn: string // ISO date or bounded range elsewhere
  /** Event → may link sightings[]; Milestone → may link organizationId */
  links?: {
    organizationId?: string
    relatedEventIds?: string[]
    topicIds?: string[]
  }
}

/** Tour UI only — not a chronology kind */
type InvestigationWaypoint = {
  id: string
  target: { kind: ChronologyKind; id: string }
  narration: string
  // camera, layers, evidenceQuestions, …
}
```

Existing `EventsRecord.category: string[]` should **not** become the home of this taxonomy. If/when implemented: either a dedicated Milestone channel or an explicit `kind` discriminant — not `category.includes('famous')`.

---

## Promotion path (later, not this scratch)

When blessed, update root `CONTEXT.md` Language:

1. Sharpen **Event** (drop “institutional/historical frame”).
2. Add **Milestone** and **Backdrop** under research record / chronology concepts.
3. Explicit note: **Waypoint** remains Guided Investigation / Observatory UI — not a record type.
4. Optional ADR only if choosing table-split vs single chronology table with `kind` (hard to reverse + surprising + real trade-off).

---

## Sources consulted

- `CONTEXT.md` — Event, Sighting, Organization, Disclosure senses, Wave/Hot Zone, evidentiary grammar  
- `UBIQUITOUS_LANGUAGE.md` — Event as temporally bounded occurrence; case_file → Document  
- `docs/vision/UX_LANGUAGE_GUIDE.md` — reserved words; adopt ~6–8 terms; no Sequence-for-timeline  
- `docs/vision/TEMPORAL_OBSERVATORY.md` — InvestigationWaypoint as camera/epistemology stop  
- `.scratch/ufo-database-merge/ThreeWayEventsComparison.md` — Neon case spine vs catalog institutional gaps; semantic dup clusters  
- `packages/db/src/postgres/types.ts` — `EventsRecord.category: string[]` (anti-pattern magnet)
