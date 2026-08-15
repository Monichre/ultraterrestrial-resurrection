# Ubiquitous Language

Domain glossary for Ultraterrestrial research knowledge — grounded in `packages/knowledge-base/CORPUS.md`, reconciled against `apps/disclosure-rag`, `packages/knowledge-base` (on disk), and `apps/app/src/services/ai/prompts` / `packages/ai`.

**Canon source:** CORPUS.md. When code or docs disagree, CORPUS wins until explicitly revised.

---

## Research hierarchy

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Pin** | The smallest meaningful research object; a projection of a canonical domain entity or claim atom. | Card, node (UI-only), record (when meaning the visual/research object) |
| **Thread** | A typed, provenance-bearing relationship between Pins. | Edge, link, connection (when meaning the analytical object) |
| **Hunch** | A provisional interpretation or possible pattern that must never be rendered as established fact. | Insight, pattern (unqualified), theory (premature) |
| **Canvas** | A bounded investigation workspace organized around a question, incident, theme, person, institution, or hypothesis. | Board, workspace, “research canvas” when meaning the product shell only |
| **Quilt** | A higher-order synthesis connecting multiple Canvases for communication or long-form investigation. | Story, narrative, guided tour (when meaning the synthesis object) |

---

## Knowledge layers

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Raw Source** | An immutable original research material (PDF, transcript, FOIA, capture, media). | Document (when meaning the file archive), case file (legacy bucket name) |
| **Evidence Ledger** | The provenance layer that records origin, hash, anchors, custody, and extraction lineage for every source-derived statement. | Metadata, index.json, registry (partial stubs today) |
| **Domain Graph** | Canonical entities, claims, and relationships with epistemic status. | Knowledge graph (vague), Xata tables (retired) |
| **Compiled Page** | An agent-maintained, human-readable derived research artifact (profile, matrix, chronology). | Wiki page, summary (unqualified) |
| **Research Schema** | The operating constitution: entity types, relationship types, epistemic statuses, ingestion and promotion rules. | Ontology (informal), AGENTS.md alone |

---

## Canonical entity types

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Topic** | A conceptual subject or research theme. | Tag, category |
| **Personnel** | A person relevant to the domain (witness, official, researcher, etc.). | Key figure (Postgres alias OK at storage boundary only), person |
| **Event** | A temporally bounded occurrence. | Incident (prefer Event unless phenomenology-specific) |
| **Organization** | An institution, agency, unit, company, network, or similar body. | Agency (too narrow) |
| **Sighting** | A structured observation report. | UFO report (colloquial) |
| **Testimony** | A first-person or attributed account; not equivalent to physical or sensor evidence. | Witness statement (narrower) |
| **Document** | A primary or secondary textual source as a graph entity (distinct from the Raw Source file bytes). | Case file, PDF |
| **Location** | A geographic place associated with research. | Place, site |
| **Artifact** | A physical, visual, technical, or digital object offered as evidence. | Evidence (overloaded), exhibit |
| **Claim** | A discrete proposition asserted by a source; first-class and distinct from the source that asserts it. | Fact, finding (premature), “extracted claims” (informal) |
| **Hypothesis** | A structured explanatory model with support, contradiction, assumptions, and falsification criteria. | Theory (legacy app prompts), explanation (unqualified) |

---

## Epistemic status

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Verified** | Directly established by strong primary evidence. | Confirmed, true |
| **Corroborated** | Supported independently by multiple credible sources. | Confirmed (ambiguous) |
| **Plausible** | Consistent with available evidence but not established. | Likely |
| **Contested** | Credible sources materially disagree. | Disputed |
| **Unverified** | Asserted without sufficient confirmation. | Unconfirmed |
| **Discredited** | Substantially undermined or demonstrated false. | Debunked (colloquial OK in prose, not as status enum) |
| **Unknown** | Evidence is insufficient for classification. | N/A, null |

**Confidence** is a scored, explained assessment — never a naked percentage treated as objective certainty. Confidence ≠ epistemic status.

### Status dialects to retire or map

| Dialect | Source | Mapping |
| ------- | ------ | ------- |
| Observed / Corroborated / Contested / Inferred / Speculative / Resonant / Unverified | Live mindmap route brackets | Map to CORPUS statuses; treat Resonant as interpretive resonance, not evidence status |
| Liturgy / Reading / Counter-reading / Next Trace | `packages/ai/prompts/CONTEXT.md`, live Prometheus voice | UX language, not epistemic status enum |
| verified/unverified + 1–100 scores | Legacy `apps/app/.../prompts` | Collapse into Epistemic Status + Confidence |

---

## Core operations

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Ingest** | Add a Raw Source to the archive and run extraction/update into ledger, graph, and compiled layers. | Index, upload, process (when meaning the full pipeline) |
| **Query** | Ask a question against the compiled research model with provenance-aware retrieval. | Chat, search (when meaning full research Q&A) |
| **Compare** | Evaluate multiple sources, claims, witnesses, incidents, or hypotheses together. | Diff |
| **Synthesize** | Convert accumulated research into a higher-order interpretation (Hunch, Canvas, Quilt, Hypothesis). | Summarize (weaker) |
| **Promote** | Move an ephemeral result into the persistent research model under human governance. | Save, accept, commit |
| **Revise** | Alter existing conclusions when new evidence arrives, preserving version history. | Update, overwrite |
| **Lint** | Run a health check over the research environment for epistemic and structural defects. | Audit, validate |

---

## Retrieval (implementation boundary)

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Hybrid Retrieval** | Parallel full-text + vector similarity (and optionally graph/metadata filters), fused and ranked. | Triple RAG, Quinuple RAG, Dual/Quad RAG |
| **Compiled-first retrieval** | Prefer Compiled Pages for orientation; Raw Sources for verification and citation. | Chunk-only RAG |
| **Chunk** | An Evidence-only text span used for embedding/indexing; must not embed agent Inference. | Passage, snippet |
| **Vector Store** | A store of embeddings for similarity search (Neon pgvector is the platform store for the Next.js app). | FAISS, Upstash, OpenAI vector store (secondary/optional paths) |

---

## Actors and governance

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Researcher** | The human who selects sources, directs inquiry, interprets, and grants canonical approval. | User (when meaning domain role), operator |
| **Knowledge Engineer (Agent)** | The agent that maintains filing, linking, extraction, linting, and suggestions under the Research Schema. | RAG bot, assistant (vague) |
| **Suggested / Under review / Accepted / Modified / Rejected / Superseded / Archived** | Explicit workflow states for AI contributions. | Done, approved (unqualified) |

---

## Storage naming (boundary terms)

These are implementation names allowed at system boundaries; prefer domain terms in product language.

| Storage term | Maps to |
| ------------ | ------- |
| `packages/knowledge-base/sources/` | **Raw Source** archive (current on-disk shape) |
| `case_file` (metadata `doc_type`) | **Document** / PDF Raw Source (legacy label) |
| `key_figures` (Postgres) | **Personnel** |
| `documents` / `document_chunks` (Neon) | **Document** entity + Evidence **Chunks** |
| OpenAI `file_search` | Optional secondary retrieval over uploaded files — not the Evidence Ledger |

---

## Relationships

- A **Raw Source** is immutable; every material statement needs an **Evidence Ledger** entry.
- A **Claim** is not a **Document**; a Document asserts zero or more Claims.
- A **Testimony** is not physical evidence; it may support or contradict Claims.
- A **Pin** projects a Domain Graph entity or Claim; a **Thread** relates Pins.
- A **Hunch** may mature into a **Hypothesis** via **Promote**, never silently.
- A **Canvas** contains Pins, Threads, and Hunches; a **Quilt** synthesizes multiple Canvases.
- **Ingest** may update many Compiled Pages and graph records from one Raw Source.
- **Query** should be compiled-first; cite Raw Sources for verification.
- **Hybrid Retrieval** serves Query; it is not the research model.

---

## Example dialogue

> **Dev:** "When we Ingest a FOIA PDF, does that create Claims in the Domain Graph automatically?"
> **Domain expert:** "Ingest preserves the Raw Source, writes Evidence Ledger provenance, and may *suggest* Claims and Threads. Nothing Contested or high-impact becomes canonical until a Researcher Promotes it."
> **Dev:** "So Hybrid Retrieval over document_chunks is enough for a Quilt?"
> **Domain expert:** "No. Hybrid Retrieval finds Evidence. A Quilt is Synthesize-then-Promote work over Canvases — it must keep Verified, Contested, and Unverified distinct."
> **Dev:** "The mindmap tags say Speculative and Resonant. Are those Epistemic Status values?"
> **Domain expert:** "Not in the canon. Map Speculative toward Plausible or Unverified; treat Resonant as interpretive UX language, never as evidence status."
> **Dev:** "And disclosure-rag’s Quinuple RAG?"
> **Domain expert:** "Retired vocabulary. Platform retrieval is Hybrid Retrieval against Neon pgvector plus optional file_search. disclosure-rag is an Ingest helper into the Raw Source shelf, not a second research model."

---

## Flagged ambiguities

- **Canvas** — product shell (`/research-canvas`) vs CORPUS investigation object. Prefer **Research Canvas** for the UI shell and **Canvas** for the domain workspace; never conflate in schema.
- **Document** — file bytes (Raw Source) vs graph entity. Say **Raw Source** for the file; **Document** for the entity.
- **Claim** — wire-format field on Testimony vs first-class Claim object. Prefer first-class **Claim**.
- **Theory** (legacy prompts) vs **Hypothesis** / **Hunch**. Use Hunch for provisional; Hypothesis for structured models.
- **case_file / case_files** — legacy bucket and `doc_type`. Migrate language to Raw Source / Document.
- **Triple / Dual / Quad / Quinuple RAG** — marketing debt for fragmented adapters. Canonical: **Hybrid Retrieval**.
- **Xata** — retired platform-wide. Neither the Next.js app nor disclosure-rag uses it; remaining `xata_*` modules are dead code behind guarded imports. Say **Neon** / **Domain Graph** storage.
- **Epistemic Status** — three live dialects (CORPUS enum, mindmap brackets, liturgy UX). CORPUS enum is canon; others must map or retire.
- **Knowledge base** — package name vs compiled research model. Prefer **Raw Source archive** for `packages/knowledge-base` and **research model** for ledger+graph+compiled layers.
- **Pin vs Node** — React Flow nodes are UI; Pins are domain. A node may *render* a Pin.
)