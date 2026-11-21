# RAG Document Processing Protocol

*Ingestion, chunking, and retrieval hygiene for Ultraterrestrial source corpora*

**Document Version**: 2.0  
**Last Updated**: 2026-07-19T00:40:00-05:00  
**Authority**: AI Platform + Research Division  
**Status**: Operational methodology (informs prompts; not a runtime prompt by itself)

---

## Purpose

Define how UFO/UAP/Disclosure documents move from raw source text into a retrieval index without contaminating Evidence with agent Inference. This protocol complements `EVIDENCE_EVALUATION_FRAMEWORK.md` and the Pre-Submission Methodology doctrine.

**Related prompts:** `document_classification`, `rag_ingestion`, `enhanced_ner` / `disclosure.ner`, `validation`, `rag_grounded_answer`.

---

## Core Principle (ADR-0001)

Agent Inferences must never enter retrieval, search, or suggestion pathways as if they were source material. Chunk bodies, embeddings, and citation passages are Evidence only.

If an analytical note is useful, store it separately (e.g. `agent_inferences`) and keep it out of the vector index used for grounding.

---

## Processing Pipeline

### Stage 0 — Provenance capture

Before any model call, record:

| Field | Why |
|-------|-----|
| Origin URL / archive id | Citation & dedupe |
| Acquiring org / collector | Chain of custody |
| Capture datetime | Temporal integrity |
| Classification marks | Sensitivity routing |
| Hash / checksum when available | Integrity |

Missing custody → mark Unverified; do not silently upgrade later.

### Stage 1 — Document classification

Use `document_classification` (or equivalent) to set:

- `content_type` (government, witness, scientific, media, historical, technical, mixed)
- Ingestion recommendation (`proceed` / `proceed_with_caution` / `hold_for_human_review` / `reject`)
- OCR quality and sensitivity

Extraordinary Claims + unknown custody ⇒ human review before embedding.

### Stage 2 — Chunk planning

Use `rag_ingestion` principles:

1. Prefer semantic boundaries (headings, testimony turns, exhibit sections).
2. Target ~400–800 tokens with modest overlap notes — not blindly fixed splits that sever Claims mid-sentence.
3. Keep redaction markers and attribution inside the chunk text.
4. Drop boilerplate, ads, navigation, pure TOCs from the embed set.
5. Attach lightweight hints (`claims_hint`, temporal/spatial anchors) for hybrid search — hints are not Evidence upgrades.

### Stage 3 — NER on chunks (optional but preferred)

Run span-grounded NER (`enhanced_ner` / `disclosure.ner`) per high-value chunk:

- Entity names must appear in the chunk (or clear anaphora resolvable within document context).
- Store `span_quote` for audit and highlighting.
- Map Key Figure → wire `PERSONNEL` for schema compatibility; author new prose with Key Figure.

### Stage 4 — Validation gate

Run `validation` before index/DB write:

- Fail on hallucinated names, dates, coordinates.
- Fail on language that treats Inference as Evidence.
- `safe_for_rag_index` and `safe_for_db_write` may diverge (e.g. store draft entities but do not embed).

### Stage 5 — Embedding & index metadata

Embed chunk text only. Recommended filter metadata:

- `source_id`, `chunk_id`, `content_type`, `evidentiary_density`
- Temporal/spatial anchors when explicit
- `integrity_flags` (ocr_noise, heavy_redaction, secondary_repost)

Embedding model lock for this monorepo: `text-embedding-3-small` @ 1536 dims (do not change in prompt methodology).

### Stage 6 — Grounded answering

At query time:

1. Retrieve Evidence passages only.
2. Answer with `rag_grounded_answer`: citations required; Readings labeled `[Inferred]`; Counter-reading required when a Reading is offered.
3. Insufficient passages → state the gap + one Next Trace. Do not backfill case facts from parametric memory.

---

## Quality Bars

| Gate | Pass condition |
|------|----------------|
| Provenance | Origin recorded or explicitly Unverified |
| Chunk purity | No model-invented bridging facts in `text` |
| Entity grounding | Span quote or explicit support in source |
| Epistemic labels | Claims ≠ Inferences ≠ Evidence |
| Retrieval safety | No Inference rows in vector corpus |

---

## Anti-Patterns

- Summarizing a document into “cleaner” chunks that add dates or actors not in the source.
- Embedding chat/synthesis outputs as documents.
- Using anonymous social amplification volume as corroboration.
- Treating Hynek class or origin hypothesis as extracted Evidence rather than scaffold/Inference.
- Proof-by-analogy (“like Nimitz, therefore…”).

---

## Cross-Links

- `NER_EXTRACTION_PROTOCOL.md` — entity rules
- `EVIDENCE_EVALUATION_FRAMEWORK.md` — reliability scale
- `../DisclosureResearcherPreSubmissionMethodology.md` — submission doctrine
- `../../../docs/adr/0001-agent-inferences-excluded-from-retrieval.md`
