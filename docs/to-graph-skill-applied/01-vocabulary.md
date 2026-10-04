# Vocabulary — kernel + Ultraterrestrial overlay

Kernel terms (taxonomy vs ontology, LPG vs RDF, chunk vs embedding, GraphRAG)
are in [`00-kernel.md`](00-kernel.md). This page is **this app's field language**.

## One-liner for *this* product

> A provenance-preserving ingest pipeline that turns UAP/disclosure sources into
> an **entity-linked property graph** over Neon (Key Figures, Events, Organizations,
> Locations, Testimonies, Topics, Documents, Artifacts, Sightings) plus **pgvector**,
> with Evidence-only chunks (ADR-0001).

---

## Kernel stage names (unchanged)

`ingest → normalize → hydrate → enrich → extract → resolve → annotate → classify → assemble → chunk → embed → index`

How disclosure-rag *structurally* runs them:

| Kernel stage | What runs here |
|--------------|----------------|
| ingest / hydrate | YouTube transcript, web readability, file read |
| classify | `document_classification` → proceed / hold / reject |
| enrich | optional fidelity gate on transcripts → quarantine |
| chunk | `rag_ingestion` — Evidence bodies only |
| extract | `disclosure.ner` per chunk against this overlay |
| validate | `safe_for_rag_index` / `safe_for_db_write` |
| resolve | mention → canonical row (`key_figures`, etc.) |
| assemble | `nodes` / `edges` + junction tables |

---

## Overlay nouns (not kernel)

| Field term in this app | Kernel mapping | Notes |
|------------------------|----------------|-------|
| Key Figure / PERSONNEL | `Entity` type `PERSON` | Wire enum `PERSONNEL` is compatibility, not a second ontology |
| Event | `Entity` type `EVENT` | Named historical frame, not a single observation |
| Sighting | `Entity` type `SIGHTING` | Granular observation; do not collapse into Event |
| Organization | `Entity` type `ORGANIZATION` | |
| Location | `Entity` type `LOCATION` | Coordinates only if explicit; never fabricate lat/lon |
| Testimony | `Entity` type `TESTIMONY` | Claim + witness; Layer B until resolved |
| Topic | `Entity` type `TOPIC` | Thematic cluster |
| Document | `Resource` and/or `Entity` type `DOCUMENT` | A PDF can be the Resource *and* a canonical Document node |
| Artifact | `Entity` type `ARTIFACT` | Physical / out-of-place object |
| `document_chunks` | kernel `Chunk` | Evidence layer |
| `document_entities` | kernel `Mention` | |
| `agent_inferences` | Layer D | Do not embed |
| Author on `documents.author` | **not** kernel `Author` | FK to `key_figures` — a role, not a label |
| photos[] / image | property, or optional overlay `MediaAsset` | Not required to ingest |

---

## Distinctions this domain gets wrong if you skip the kernel

- **Event vs Sighting** — Event is the named frame (Roswell). Sighting is one observation inside or beside it.
- **Claim vs Inference** — Witness said X = Claim (Layer B). Model judges credibility = Inference (Layer D).
- **Document publication date vs event date** — never substitute.
- **Author vs Key Figure** — there is no separate Author node type in the live schema.
