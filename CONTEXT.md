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
The named, researcher-assembled research session: a set of nodes (entity records), edges (asserted or inferred connections), synthesis output, and open questions. The domain object that gets synthesized, saved, and revisited. Not a synonym for the Canvas surface.
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
The raw, unverified account at the base of the Hynek taxonomy (L0). A classification concept used in the research methodology — not a database table or user-facing record type. A Sighting is a classified Report; a Testimony is a classified Report.
_Avoid_: using "report" as a synonym for Sighting, Testimony, or Document in UI copy or code

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
A recurrent symbolic or morphological pattern tracked across Investigations. Not yet built. Reserved.
