# Kernel — general rules, methodology, best practices

This file is the **universal** graph-skill. It does not belong to UFO research,
design intake, or hypergraph research. Domain types live in `08-domain-overlay.yaml`
and in **Part B** of [`05-graph-schema.md`](05-graph-schema.md).

If a label is not in the kernel table below, it is an overlay. `MediaAsset` and
`Author` from the original bookmark-corpus example are overlays. They are legal
in a domain that actually has them. They are not innate to graphs.

---

## One-liner

A **knowledge-graph construction pipeline** turns unstructured **source items**
into an **entity-linked property graph** plus an optional **vector index**, so an
agent can retrieve by meaning and then **traverse** structure (GraphRAG).

---

## How to read any applied pack

| Layer of this kit | What it is | What it is not |
|-------------------|------------|----------------|
| **Kernel** (this file, Part A of 05) | Rules, stages, four data layers, ID/provenance contracts | A list of your product's nouns |
| **Overlay** (08, Part B of 05, 01 domain section) | Legal entity types, predicates, adapters, store | A new pipeline |

Write messy per-format logic once in **adapters**. Keep the core source-agnostic.
Keep the logical schema stable across storage tiers.

---

## The four-layer data model (non-negotiable)

Do not collapse these. If you cannot answer "was this stated or inferred?", the
object is not trustworthy enough to harden.

| Layer | Holds | Rule |
|-------|-------|------|
| **A Evidence** | Immutable acquired material: Resource, raw bytes, hashes, retrieval time | Nothing an LLM generated |
| **B Observation** | Mentions, claims, events-as-stated, spans, quotes | Every row points at a Chunk/Resource |
| **C Canonical** | Resolved Entity, resolved Claim, legal overlay-typed nodes | Multiple observations may merge here |
| **D Analysis** | Inference, summary, hypothesis, cloneGuidance, quality notes | Never silently copied into A or into embeddable chunk text |

A source statement and your interpretation of that statement are different objects.

---

## Canonical stages

```
ingest → normalize → hydrate → enrich → extract → resolve
       → annotate → classify → assemble → chunk → embed → index
```

Disclosure-rag's structural passes are the same pipeline with gates:

```
classify (proceed|hold|reject)
  → analyze (Layer D only)
  → chunk (Evidence-only bodies)
  → extract (schema-guided NER+RE against the overlay)
  → validate (safe_for_index / safe_for_db)
  → resolve → assemble
```

Each stage: one job, one input contract, one JSON output contract.

---

## Kernel ontology (the only "innate" types)

These labels exist because **every** provenance-preserving graph needs them.
Overlay types are values of `Entity.type` (or extra labels), not replacements
for this table.

**Kernel node labels**

| Label | Key | What it is |
|-------|-----|------------|
| `Resource` | content-hash id | One acquired source item (URL, file, capture, run artifact) |
| `Chunk` | resourceId + locator | Retrieval-sized **Evidence** slice with a locator (char span, page, timestamp, screenshot region) |
| `Entity` | canonical id | One real-world or domain object after resolution. **`type` comes from the overlay.** |
| `Claim` | hash(subject, predicate, object, evidence chunk) | Atomic proposition with an evidence pointer |
| `Mention` | optional; may be an edge instead of a node | One surface form in one chunk |

**Optional kernel labels** (use only if the domain actually has them)

| Label | When it is kernel-optional | When it is overlay |
|-------|----------------------------|--------------------|
| `Tag` | You run semantic annotation | Your tag list is overlay |
| `Category` | You have a taxonomy | The paths are overlay |
| `MediaAsset` | You treat screenshots/video as first-class evidence objects | Bookmark-corpus example; **design-capture yes**, not universal |
| `Author` | You model a creator distinct from `Entity` | Bookmark-corpus example; **usually a PERSON / KeyFigure role**, not a kernel label |

**Kernel edge types** (every edge carries `confidence`, `extractor`, `createdAt`, and a provenance pointer)

```
(Resource)-[:CHUNKED_INTO {ordinal, locator}]->(Chunk)
(Chunk)-[:MENTIONS {surfaceForm, confidence}]->(Entity)
(Claim)-[:SUPPORTED_BY]->(Chunk)
(Claim)-[:ABOUT]->(Entity)
(Resource)-[:EXTRACTED {stage}]->(Claim)
```

**Overlay edges** are everything else: `OCCURS_AT`, `USES_TOKEN`, `WIKILINKS`,
`MEMBER_OF`, `HAS_MEDIA`, `AUTHORED_BY`. Legal only if listed in the overlay.

Generic `RELATED_TO` is a last resort, not a schema.

---

## Best practices (the three rules plus four more)

1. **Entity resolution is the whole game.** Variants collapse to one `Entity` or
   you get orphans, not a graph. False merges are worse than temporary duplicates.
2. **Provenance + confidence on everything.** `source_id`, `extractor`, `model`,
   `confidence`, `created_at`. Low confidence → review queue, not silent drop.
3. **Idempotency via deterministic IDs.** Hash canonical ref + content.
   `MERGE`/upsert, never blind-create.
4. **Schema-guided extraction.** The extractor receives the overlay's allowed
   types and predicates. It may not invent labels.
5. **Evidence-only chunks.** Chunk bodies are source text (or captured pixels
   described by locators). Agent inference stays in Layer D and out of the
   vector index.
6. **Assertion types:** `explicit` | `reported` | `inferred`. Never promote
   inferred to explicit.
7. **Normalize at the edge.** Adapters emit one `NormalizedDocument` IR.
   Downstream does not care about HTML vs transcript vs screenshot.

---

## Identity (models never mint primary keys)

```
resource_id = sha256(canonical_ref + "\n" + content_hash)
chunk_id    = sha256(resource_id + locator + ordinal + text)
entity_id   = sha256(overlay_type + "\n" + normalized_preferred_name)  # mint only
claim_id    = sha256(subject + predicate + object + evidence_chunk)
mention_id  = sha256(chunk_id + surface_form + char_start)
```

After mint, `resolve` reuses ids by alias / context / embedding similarity.

---

## GraphRAG bridge

Vector payload **must** carry `entityIds` (and usually `resourceId`, `chunkId`).
Hit → jump to those entities → traverse overlay edges → pull neighborhood.
Vector = recall. Graph = structure. Break the link and agents cannot walk.

---

## Confidence routing (defaults; overlay may retune)

| Score | Action |
|-------|--------|
| ≥ 0.9 | Harden into Layer C |
| ≥ 0.6 | Write + `needs_review` |
| ≥ 0.3 | Keep as Layer B observation |
| < 0.3 | Sidecar only; do not assemble |

---

## Storage is a decision, not a type

Same kernel + overlay whether you land in:

- **Tier 0** files (JSON-LD / JSONL + manifest)
- **Tier 1** embedded (SQLite, Lance, local Qdrant)
- **Tier 2** server (Postgres+pgvector, Neo4j, Qdrant)

See [`07-storage-decision.md`](07-storage-decision.md) for **this project**.

---

## What "done" looks like (kernel questions)

The system can answer from graph + evidence, not from model memory:

- What resource did this come from?
- What exact span/locator supports it?
- Stated, reported, or inferred?
- Which canonical entity?
- What else corroborates or contradicts it?
- Can I re-run ingest without duplicating nodes?
