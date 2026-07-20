# Ultraterrestrial — System-Wide Domain

An integrated research narrative engine for anomalous knowledge (UFO/UAP history). Researchers assemble primary records into an Investigation; AI amplifies with clearly-labelled Inference. The product's operating principle: rigor and reverence — hold contradictory evidence, preserve ambiguity, never flatten mystery into cheap certainty or cheap dismissal.

---

## Reserved words (violations are bugs, not style issues)

**Claim**:
A discrete assertion extracted from source material — testimony, official document, or primary record. The word is reserved for this meaning exclusively. AI output is never a Claim; it is an Inference.
_Avoid_: using "claim" for AI-generated content, assertions of any kind, or as a synonym for "statement"

**Inference**:
The analytical layer — what the agent produces. Persisted in `agent_inferences`; visually delineated with dashed borders and `[Inferred]`-family badges. Inferences never feed retrieval, search, or suggestion systems.
_Avoid_: "finding", "insight", "discovery", "result" for agent output; presenting Inference inline with sourced content without delineation

**Evidence**:
Source-derived material only: documents, physical traces, testimony on record. An AI synthesis is never Evidence.
_Avoid_: "evidence" for model output; "AI-generated evidence"

**Proves / confirmed**:
Banned when attached to anomalous conclusions in any output — UI copy, synthesis prose, edge labels, or documentation.
_Avoid_: "proves", "confirms the existence of", "definitively shows" for unexplained phenomena. Use instead: "is consistent with", "was claimed", "remains unexplained"

---

## Core domain vocabulary

### The research object

**Investigation**:
The named, researcher-assembled unit of research: a set of nodes (entity records), edges (asserted or inferred connections), synthesis output, and open questions. The domain object that gets synthesized, saved, and revisited. Not a synonym for the Canvas surface.
_Avoid_: "project", "session", "workspace", "board"

**Constellation**:
The assembled node-network of an Investigation as a whole — the graph as a thing with a shape, used in narrative and marketing register.
_Avoid_: "graph", "network", "map" in brand/narrative contexts; reserve "graph" for technical/code contexts

**Dossier**:
A major panel presenting detailed information about a single record — the "secret-file" treatment with clipped corner. What opens when a researcher inspects one entity in depth.
_Avoid_: "detail panel", "card", "inspector", "info panel"

**Field Note**:
A researcher-authored annotation. Distinct from a Claim (source-extracted) and an Inference (agent-produced).
_Avoid_: "note", "comment", "annotation" in user-facing copy

### The epistemic layers

**Reading**:
A single interpretive frame applied to a body of evidence — e.g. the anomalous reading, the prosaic reading, the institutional reading. Always paired with a Counter-reading. The unit of interpretation.
_Avoid_: "hypothesis" in synthesis output (reserved for the deterministic pre-enrichment floor); "conclusion"; "finding"

**Counter-reading**:
The structural rival to a Reading — the strongest alternative interpretation of the same evidence. Required; absence makes output an echo chamber artifact.
_Avoid_: "alternative", "counterpoint", "rebuttal"

**Evidentiary Weight**:
How strongly the assembled material supports a given Reading. Expressed qualitatively ("well-supported", "under-supported") not as a bare numeric score in user-facing prose.
_Avoid_: "confidence score", "probability", "certainty rating" in UI copy

**What Remains Weird**:
After prosaic explanations are applied, the named residue — what genuinely resists explanation. May be an empty answer ("nothing genuinely remains weird here"), which is also a valid and honest result.
_Avoid_: omitting this; papering over the residue; treating absence as a failure

**Open Questions**:
What remains unresolved at the end of an Investigation or synthesis — the explicitly named unknowns that keep the investigation alive.
_Avoid_: "unknowns", "gaps", "to-do items"

### The eight evidentiary states

Applied to edges, readings, and agent inferences. Exactly this set; no additions without a terminology ruling.

`Observed` — directly reported in primary source material
`Corroborated` — supported by multiple independent sources
`Contested` — contradicted by other evidence
`Inferred` — produced by agent analysis; analytical layer
`Speculative` — possible but under-supported
`Resonant` — symbolic or folkloric echo; labeled as resonance, never as evidence
`Unverified` — source exists but chain of custody is incomplete
`Disconfirmed` — contradicted by stronger evidence

_Wire format_: `[State] rest of text` prefix on reasoning strings. No prefix = no badge; never default-fill a state.
_Rendered format_: `[ CORROBORATED ]` — bracketed mono, uppercase.

### The research record types

**Sighting**:
A reported observation of an aerial or physical phenomenon. Corresponds to the `sightings` table (86,962+ NUFORC/MUFON records). The most granular and numerous record type.
_Avoid_: "report" in user-facing copy for this type (Report is a classification concept, not a table name — see below)

**Event**:
A named historical UAP event of significance (Nimitz, Roswell, etc.). Higher-level than a Sighting; institutional/historical frame.
_Avoid_: "incident" as a synonym in code contexts (the table is `events`)

**Testimony**:
A witness statement or whistleblower claim linked to an Event or Key Figure. Source material; each Testimony may contain Claims.
_Avoid_: "report", "account", "statement" when referring to the record type in code contexts

**Key Figure**:
A named individual — witness, researcher, official, whistleblower — materially connected to UAP history. The Postgres table is `key_figures` (migrated from `personnel`).
_Avoid_: "person", "personnel", "user" in domain contexts; "personnel" in user-facing copy

**Topic**:
A thematic research cluster (e.g. crash retrieval, UAP legislation, propulsion anomalies). Not an Event; not a tag.
_Avoid_: "tag", "category", "subject" in domain contexts

**Organization**:
A government agency, military unit, research group, or contractor involved in UAP history.
_Avoid_: "entity", "group", "institution" in domain contexts

**Document**:
A primary source record — a declassified file, congressional testimony, official report — with provenance metadata (origin, chain of custody, integrity signals).
_Avoid_: "file", "resource", "source" for this record type in code contexts

**Artifact**:
A physical object of claimed anomalous origin or significance.
_Avoid_: "item", "object", "thing"

### Classification concepts (research methodology)

**Report**:
The raw, unverified account at the base of the event-type hierarchy (L0). A classification concept used in the research methodology — not a database table or user-facing record type. A Sighting is a classified Report; a Testimony is a classified Report.
_Avoid_: using "report" as a synonym for Sighting, Testimony, or Document in UI copy or code

**Event Type Hierarchy (L0–L5)**:
The classification ladder from the research methodology: L0 Report → L1 Sighting → L2 Encounter → L3 Contact → L4 Disclosure → L5 Artifact. These are classification levels, not tables — L1 and L5 happen to share names with record types; the level classifies, the record type stores.

**Encounter**:
L2 in the event-type hierarchy — physical proximity with effects (electromagnetic, physiological, trace evidence). A classification level, not a loose synonym for any sighting.
_Avoid_: "encounter" for an ordinary Sighting with no proximity effects

**Contact**:
L3 in the event-type hierarchy — claimed communication or interaction with non-human intelligence. Always "claimed" in prose; the classification records the claim, not its truth.

**Disclosure** (classification level):
L4 in the event-type hierarchy — government, military, or institutional acknowledgment of events. Note the overload: "disclosure" also appears in product/route naming (disclosure mindmap agent, `apps/disclosure-rag`), where it names the broader disclosure-history subject matter. In classification contexts it means only L4.

**Close Encounter Classification (NL, DD, RV, CE1–CE7)**:
Hynek's observational classes plus extensions: Nocturnal Light, Daylight Disc, Radar Visual, and Close Encounters 1–7 (proximity → effects → occupants → abduction → human-initiated → injury/death → hybrid claims). Applied to Sightings and Testimonies as structured metadata.

**Corroboration Score**:
A numeric, internal triage measure (0–7+) of how many independent corroboration lines converge on a Report — assigned at ingestion, used for prioritization. Never user-facing. Not the Corroborated evidentiary state (a badge on edges/readings), and not Evidentiary Weight (qualitative, per-Reading, user-facing). Three distinct concepts; conflating them is a bug.
_Avoid_: surfacing the number in UI copy; "corroboration" unqualified where one of the three specific concepts is meant

**Wave**:
A period of statistically anomalous incident density in time (Vallée's temporal clustering). An analytical finding over Sightings, not a record type.

**Hot Zone**:
A recurring geographic incident cluster (Hessdalen, nuclear-facility perimeters). An analytical designation, not a record type.
_Avoid_: "hotspot" in domain prose

**Morphological Tags**:
Structured observational attributes of a single Sighting — shape, size, luminosity, motion, effects, duration. Per-record classification data. Distinct from Motif (reserved, Phase 2): a Motif is a recurrent symbolic or morphological _pattern tracked across_ records and Investigations; a morphological tag describes _one_ observation.
_Avoid_: naming the field or concept "motifs"

**Strangeness (S1–S5)**:
How far a reported observation deviates from known phenomena (Hynek). S1 = consistent with misidentification; S5 = reported as physically impossible by current models. A rating applied to Sightings and Events.

**Credibility (C1–C5)**:
How reliable the source chain is for a Report. C1 = single anonymous witness; C5 = verified official record + independent corroboration + physical evidence.

**Source Tier (T1–T6)**:
Provenance grade for a Document or the source of a Testimony. T1 = primary official (FOIA-provenance established); T6 = anonymous, undated, no corroboration path.

### The surface

**Canvas**:
The ReactFlow viewport — the UI surface on which a researcher assembles an Investigation. A technical/product term, not a domain term. Distinct from Investigation (the data object).
_Avoid_: using "canvas" as a synonym for Investigation; using "investigation" as a synonym for the surface itself

**Trace** (verb + noun):
The recommended next research action generated by synthesis or the suggestion dock. "Next trace" = what to follow. As a verb: to follow a connection or provenance chain.
_Avoid_: "follow-up", "action item", "task", "suggestion" in synthesis output

### Technical terms (not user-facing)

**Entity**:
The collective technical/db term for all primary record types (sightings, events, key_figures, etc.). Used in code, agents, and developer documentation. Never surfaces in user-facing copy.
_Avoid_: in UI copy; use the specific record type name instead

**Agent Inference** (technical):
A row in `agent_inferences` — the persisted form of an Inference. The `insertAgentInference` function is the only write path for agent output into the database. By contract: never feeds retrieval, search, or suggestions.

---

## Terms reserved for Phase 2 (name-reserved; do not use for other concepts)

**Theory**:
A user-owned research hypothesis with attached supporting inferences. Not yet built. The name is reserved — do not create a table, type, or UI surface with a different meaning for "theory".

**Motif**:
A recurrent symbolic or morphological pattern tracked across Investigations. Not yet built. Reserved. Not a synonym for Morphological Tags (per-record observational attributes — see classification concepts).

# OpenMemory Guide — Ultraterrestrial Resurrection

## Overview

UAP research platform monorepo: Next.js app (`apps/app`), disconnected Python RAG (`apps/disclosure-rag`), Neon Postgres via `@db/postgres` (`packages/db`).

## Architecture

- Research canvas → MindMap shell → ViewSwitcher → Graph / Timeline / Sightings / Search / Detail
- Live AI: disclosure mindmap agent + Prometheus chat
- Design: Microfilm Dark (`DESIGN.md`), vision docs in `docs/vision/`

## User Defined Namespaces

- frontend
- design

## Components

### OraclePanel

- **Path:** `apps/app/src/components/oracle-panel/`
- **Purpose:** Oracle Recipe panel — view/edit multi-step workflow, confirm & run, duplicate & re-run
- **Stories:** `Components/OraclePanel` (incl. InteractiveDemo)
- **Deps:** framer-motion, @dnd-kit, lucide-react, sonner

### OryzaeTimeline

- **Path:** `apps/app/src/components/oryzae-timeline/`
- **Purpose:** Dark floating-card memory timeline (CodePen port) — spine, range nav, dimmed memories
- **Stories:** `Components/OryzaeTimeline`
- **Fonts:** Inter + Noto Serif JP (injected via `useOryzaeFonts`)

### LittleBook

- **Path:** `apps/app/src/components/little-book/`
- **Purpose:** Scroll-driven 3D book (jh3y ExPVzBY) — GSAP ScrollTrigger page flips
- **Stories:** `Components/LittleBook`
- **Deps:** gsap + ScrollTrigger

### Cursor Research Subagents

- **Path:** `.cursor/agents/`
- **Purpose:** 18 project-scoped, readonly research specialists for Cursor Task delegation
- **Source:** `ultraterrestrial-agent-definitions-v2/` (canonical suite)
- **Scope:** Development-time Cursor subagents only; they do not add runtime product agents
- **Frontmatter:** flat quoted `description`, `model: inherit`, `readonly: true` (avoid YAML `>-` — breaks Task routing)
- **Generator:** `.cursor/generate-research-agents.mjs` (slim prompts + validation)
- **Docs:** `.cursor/Agents.md`, `.cursor/agents/README.md`
- **Excluded:** Restricted `DOTY_PATTERN` adversarial profile

### RocketTelemetryHud

- **Path:** `apps/app/src/features/sightings/components/rocket-telemetry-hud/`
- **Purpose:** Sci-fi rocket telemetry HUD chrome around sightings 3D globe (v0 port)
- **Entry:** `RocketHud` — default mode in `HudUapInterface` (`globeType: 'telemetry'`)
- **Source:** v0 chat `tzMkXRdlZmx` (digital-mischief-group)
- **Stories:** `Features/Sightings/RocketTelemetryHud`

### ClassifiedDocument

- **Path:** `apps/app/src/components/design-system/research-ui/documents/ClassifiedDocument.tsx`
- **Purpose:** Aged classified dossier UI (UCASEWEIL + Mercury 9) with taped polaroids
- **Related:** `PhotoCaption.tsx` (plate label + handwritten note)
- **Stories:** `Documents/ClassifiedDocument`
- **Source:** Dropover classified-document prototype (2026-07-18)

## Patterns

- Feature/component folders: kebab-case dir, PascalCase components, co-located `.stories.tsx`
- Storybook demos that need state live as `*Demo.tsx` harnesses next to the component
- Design ports keep inline styles when matching source fidelity; extract tokens to `types` / constants
- Cursor research agents are generated from canonical source definitions to prevent prompt drift; logical tools remain capability boundaries rather than claims of available runtime tools
- Cursor subagent `description` must be a single-line quoted string — folded YAML (`>-`) can surface as bare `>-` in the Task tool catalog
