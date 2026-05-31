# Data Platform Rebuild — Design Spec

_Created 2026-05-30. Supersedes Xata (dead). Anchored to the Feb-24 CSV export + source files._

## Goal

Replace the dead Xata data layer with an owned **single-engine Postgres + pgvector** stack where
one store holds relational/CRUD data, vectors, AND a unified graph (nodes + edges) — fed by an
owned ingestion pipeline, with immutable source documents in an object-storage "Library." Both the
frontend and the AI agent read from this single source of truth. The graph is **GraphRAG**: edges
are *extracted by the pipeline*, not hand-authored, and traversed *by the agent*, not by hand.

## Locked decisions (2026-05-30 / -31 design sessions)

- **Xata is dead** — greenfield rebuild from the CSV export, not an SDK port. No preserving Xata semantics.
- **Architecture:** Library (immutable object storage) → owned ingestion pipeline (extract→chunk→embed→**extract entities + relationships**) → one Postgres holding **relational + pgvector + unified graph** → shared by frontend + agent. (Option A.)
- **Platform:** **Postgres + pgvector, single engine, Apache AGE deferred** (soft yes, 2026-05-31). Host stays managed-friendly (Supabase/Neon); **all DDL vanilla-Postgres-portable** so AGE/self-host (Fly/Azure) remains a fast-follow, never a prerequisite. SurrealDB and Weaviate rejected (see graph-engine note in SCRATCHPAD).
- **Graph = GraphRAG, model-not-engine:** a unified `edges` table (defined in #1) collapses the fragmented junction tables + FK columns into one traversable structure. Edges are **extracted by ingestion** (#2) with confidence + provenance; the **agent** traverses via a fixed `get_connected(entity, depth, rel)` tool (#3). AGE/openCypher is an optional later upgrade for agent-emitted Cypher.
- **IDs normalized via staging + crosswalk:** drop Xata `rec_*` identity in favour of a clean global `BIGINT` id space (`id_map` crosswalk), which doubles as the graph node registry; `legacy_id` preserved for provenance. (See "ID normalization" below — supersedes the old "keep rec_* text PK" note.)
- **Embeddings:** `text-embedding-3-small` @ 1536 dims, normalized across all vector columns.
- **Live corpus today:** OpenAI Vector Store `vs_meWOEnUiUxtQWf0W6NBsNpCG` (~1,477 files) — what the new pgvector retrieval replaces.
- **Source of truth:** clean CSV tables (`packages/db/docs/exports/*.csv`) for relational data; **source files** for the documents (their CSV embeddings are genuinely corrupted).

Supporting reports: `docs/design/data-model-inventory.md` (schema-scout), `docs/design/ingestion-analysis.md` (ingestion-scout), `docs/design/xata-migration-audit.md` (capabilities checklist).

---

## Sub-project roadmap (decomposition)

This initiative is too large for one plan. It splits into four sub-projects, each with its
own spec → plan → implementation cycle:

| # | Sub-project | Depends on | This doc |
|---|-------------|-----------|----------|
| **1** | **Supabase foundation: provision + schema + relational load** | — | **✅ specced below** |
| 2 | Library + ingestion pipeline (re-ingest 400 docs, regenerate all embeddings, entity extraction) | #1 | outline only |
| 3 | App data-layer cutover (`@db` client: CRUD + FTS + aggregations + pgvector retrieval; rewire consumers) | #1, #2 | outline only |
| 4 | ufo-ui component cherry-pick into apps/app | independent | outline only |

---

# Sub-project 1 — Supabase Foundation, Schema & Relational Load

**Scope:** stand up Supabase, define the target Postgres schema, and load the clean relational
data from the CSV export. **Embeddings and documents are explicitly out of scope here** (they
require the ingestion pipeline, sub-project 2). The deliverable is a queryable Postgres DB with
all non-document tables populated and verified.

## Components

1. **Postgres host (TBD — see graph-engine fork)** — Postgres 15+, `vector` (pgvector) extension,
   + object storage for the Library (used in #2). **Keep all DDL vanilla-Postgres-portable** so the
   host can be Supabase, Neon, Azure Flexible Server, or self-hosted Fly/Railway without schema
   changes. The host decision is deferred (it hinges on whether native openCypher Graph-RAG via
   Apache AGE is near-term — Supabase/Neon can't run AGE; self-host/Azure can). #1's relational
   schema + pgvector columns are identical either way. Connection via pooled connection string in env.
2. **Schema migration** (`supabase/migrations/0001_init.sql`) — the target tables, types, PKs,
   FKs, vector columns (empty for now), and FTS `tsvector` columns + GIN indexes.
3. **CSV loader** — **Python + psycopg**, in `apps/app/scripts/xata-exports/seed/` (matches the
   prior seed attempt; psycopg `COPY` is ideal for bulk). Reads the export CSVs, applies quirk
   transforms, bulk-inserts into Postgres. Idempotent (truncate-and-reload, or upsert on `rec_*` PK).
   Note: the existing `.venv` there is a broken alias — create a fresh venv.
4. **Verification harness** — row-count assertions per table + FK integrity checks.

## Target schema

**Infrastructure tables:** `id_map` (crosswalk / node registry), `nodes`, `edges` (unified graph).

**Entity tables to create + load:** sightings, locations, personnel, testimonies, events, topics,
organizations, artifacts, + junction tables (topic-subject-matter-experts, topics-testimonies,
event-subject-matter-experts, event-topic-subject-matter-experts, organization-members), users,
user-notes, summary-files. Create-but-load-empty (populated in #2 or vestigial): documents,
document-chunks, document-entities, document-processing-tasks, mindmaps. Confirm row counts
against the inventory at load time — load only tables the inventory marks populated.

**Drop / skip (confirmed by firsthand CSV review):** `key-figures` (line-for-line duplicate of
`personnel`, 11,893 lines each — drop). `tags` + `theories` (0 rows, garbage `id,id,id,…` headers —
skip). Other empty tables (most `user-saved-*`) — create only if a FK or feature needs them; otherwise defer.

**Conventions:**
- **PKs:** **normalize to a clean global `BIGINT` id space via staging + crosswalk** (supersedes the
  earlier "keep `rec_*`" plan — Liam wants Xata identity gone now). Each table gets
  `id BIGINT PRIMARY KEY` (assigned from the `id_map` crosswalk) + `legacy_id TEXT UNIQUE` (the
  original `rec_*`, kept for provenance + delta-audit against the OpenAI store). See "ID normalization" below.
- **FKs:** remap every `link`/FK column from `rec_*` → the new `BIGINT` via JOIN on `id_map` during
  materialization; empty string → `NULL`. Add FK constraints **after** load (order-independent), then report violations.
- **Vectors:** every embedding column = `vector(1536)`, **nullable, left empty in #1**
  (populated by #2). Normalize anomalies (orgs was 500, document_chunks stub was 3).
- **Arrays:** Xata `multiple` columns → `text[]`.
- **FTS:** add `tsvector` generated columns + GIN indexes on the text-heavy searchable tables
  (sightings.comments, documents, testimonies, topics, personnel.bio) to replace Xata `.search()`.
- **Reserved words:** quote `"user"` etc.
- **`source_tier`:** add `source_tier text` (`primary` | `secondary` | `supporting`) to `documents` —
  evidence-tier classification harvested from disclosure-rag's Friedman framework. Column defined
  here in #1; populated during ingestion in #2.

## ID normalization (staging + crosswalk)

The export keys every row on a Xata `rec_*` id, and every relationship (5 junction tables + ~dozen
FK columns) references those `rec_*` ids. We shed Xata identity now, preserving all relations via a
crosswalk, in four phases:

1. **Stage raw** — load each CSV verbatim with a **quote-aware parser** (`rec_*` intact, no
   constraints) into `staging.<table>`. Isolates parsing from transformation. *(Mandatory: `coordinates`
   holds a quoted `lat,lng`, and `bio`/`description` contain real newlines — naive line/comma
   splitting shreds rows. Use Python `csv` / psycopg `COPY … CSV`.)*
2. **Build the crosswalk / node registry:**
   ```sql
   CREATE TABLE id_map (
     node_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     entity_type TEXT NOT NULL,          -- 'personnel' | 'event' | 'document' | …
     legacy_id   TEXT NOT NULL,          -- the original rec_*
     UNIQUE (entity_type, legacy_id)
   );
   ```
   **One global id space across ALL entities.** This both (a) persists the unique ids across every
   relation and (b) **doubles as the unified graph node registry** — id normalization and the graph's
   node space are the *same artifact*.
3. **Materialize clean tables** — `id BIGINT PRIMARY KEY` (= the row's `node_id` from `id_map`) +
   `legacy_id TEXT UNIQUE`. `INSERT … SELECT` from staging, JOIN `id_map` to translate the row's own
   id **and** every FK column.
4. **Constraints + verify** — add FK constraints referencing the new `BIGINT` ids; report (don't crash on) dangling.

## Unified graph: `nodes` + `edges` (NEW in #1)

The graph already exists on disk — it's just fragmented across 5 junction tables + ~dozen FK columns.
Collapse it into one traversable structure (this is the cure for the "13 tables, varying columns"
nightmare, and the target for the agent's `get_connected` tool):

- **`nodes`** — thin registry over `id_map`: `node_id BIGINT PK, entity_type TEXT, label TEXT` (display
  name pulled from each entity). Attributes stay in their typed tables, keyed by the same `node_id`.
- **`edges`** — `edge_id BIGINT PK, src_id BIGINT REFERENCES nodes, dst_id BIGINT REFERENCES nodes,
  rel_type TEXT, confidence REAL NULL, provenance JSONB NULL` (`provenance` = source doc/chunk + the
  sentence, for extracted edges). **#1 seeds structural edges** from the junction tables + FK columns
  (all `rec_*→rec_*`, remapped via `id_map`). **#2 adds the rich latent edges** extracted from document
  text (disclosure-rag `relationships`), gated by `confidence ≥ 0.75` per the existing write-policy.
- Index `edges(src_id)`, `edges(dst_id)`, `edges(rel_type)` for traversal; bigint joins keep it cheap.

## Data flow

```
export/*.csv ──▶ [1] STAGE (quote-aware COPY, rec_* intact, no constraints) ──▶ staging.<table>
                     skip tags/theories (empty garbage) · skip key-figures (dup of personnel)
                     skip documents.csv body (corrupted — re-ingest in #2)
                  │
                  ▼
              [2] CROSSWALK: id_map(node_id, entity_type, legacy_id) — one global bigint id space
                  │
                  ▼
              [3] MATERIALIZE clean tables (id=node_id, +legacy_id), remap own id + every FK via id_map
                     decode &#44; → ,  ·  parse ['x'] list-literals → text[]  ·  '' → NULL
                  │
                  ▼
              [4] SEED edges from junctions + FK cols (rec_*→rec_* remapped) ──▶ nodes/edges
                  │
                  ▼
              [5] add FK constraints ──▶ verify counts + FK integrity + edge integrity
```

## Quirk handling (confirmed by schema-scout — must implement)

1. `&amp;#44;` in `sightings.comments` (~32,752 rows) → decode to `,`.
2. `multiple` columns serialized as Python list literals (`['famous']`) → parse to `text[]`.
3. FK `link` columns are bare `rec_*`; `''` → SQL `NULL`.
4. Header-echo rows mid-file (`id == 'id'`) in users/summary-files/user-saved-* → filter out.
5. Real newlines inside quoted fields → use a real CSV parser (not line-split).
6. `documents.csv` embedding corruption → **do not load documents here**; flagged for #2.

## Error handling

- Load each table independently; a failure in one doesn't block others.
- Load **without** UK/FK constraints first; apply constraints in a second pass and **report**
  (don't crash on) violations — surfaces data issues without blocking the bulk load.
- Loader is re-runnable (truncate-and-reload per table, or `ON CONFLICT (id) DO UPDATE`).

## Testing / verification (definition of done)

- [ ] pgvector extension present; `library` object-storage bucket exists.
- [ ] Migration applies cleanly to a fresh DB.
- [ ] Per-table row counts match the inventory (±0 for clean tables; documents = 0 by design).
- [ ] `id_map` covers every loaded entity row exactly once; every materialized PK + FK resolves through it (zero orphans).
- [ ] FK integrity pass: zero dangling references (or a reported, explained list).
- [ ] **Graph integrity:** every `edges.src_id`/`dst_id` resolves to a `nodes` row; structural edge
      count ≈ Σ(junction rows + non-null entity FKs); a spot traversal (`get_connected` on a known
      personnel → events/orgs) returns the expected neighbors.
- [ ] A handful of spot-check queries return sane data (a sighting with decoded commas; a
      personnel row with `text[]` roles; a junction join; a `legacy_id`→`rec_*` round-trip).
- [ ] No embedding columns populated (confirmed empty — that's #2's job).

## Explicitly out of scope (later sub-projects)

- Documents re-ingestion + ALL embedding generation + **extracted (latent) edges** → **#2**.
- Replacing `@db/xata` consumers, FTS query rewrites, aggregation rewrites, pgvector retrieval,
  the agent's `get_connected` traversal tool, rebuilding the mindmap `.ask()` feature → **#3**.
- ufo-ui components → **#4**.

## Risks / open questions

- **Connection limits** during bulk load (managed hosts pool aggressively) — use the pooler/direct session; batch inserts; prefer `COPY`.
- **New id type** — `BIGINT` identity chosen for compact, fast traversal joins (the graph is join-heavy). UUID rejected for join/index cost at this scale; revisit only if the store ever distributes.
- **Which empty tables to materialize now** vs defer — default: only those referenced by a FK from a populated table.
- **`mindmaps`/`user-*` tables** — confirm whether the new app still needs them as-is or they get redesigned in #3 (flag, don't block #1).

---

## Sub-project 2-4 outlines (for later specs)

**#2 Library + ingestion pipeline:** **This is a port/modernization of the EXISTING working tool
`apps/disclosure-rag/main.py`** — the production pipeline Liam used to build the ~1,477-file OpenAI
vector store. Use it (and its `lib/` modules: `knowledge_base_service`, `openai_client/upload`,
`knowledge_base_crud`, `entity_extraction`, `web_content_processor`, `upstash/queue`) as the
reference spec; don't reinvent. Key change vs the original: it uploaded whole files to OpenAI's
managed store (server-side chunking); the owned pgvector version must do its OWN chunking. Supabase
Storage bucket holds source files (knowledge-base sources + FBI/NASA releases). Owned TS pipeline:
extract (Docling for PDFs, transcript/web handlers) → chunk (real chunking, sizes/overlap TBD) →
embed (`text-embedding-3-small`) →
write `document_chunks` + entity embeddings to pgvector. Re-ingest the documents from
source. Regenerate ALL entity embeddings (topics/personnel/events/orgs/testimonies/artifacts).
Port disclosure-rag's entity-extraction schema/prompt + entity→table mappings verbatim, plus its
**entity write-policy** (`off/staging/auto`, `min_confidence 0.75`) and **CocoIndex entity
dataclasses → TS interfaces**. **Critically — the pipeline also emits the latent `edges`:** the
extraction's `relationships` output (with confidence + source sentence) writes into the unified
`edges` table from #1 (new nodes registered in `id_map`/`nodes` as they're discovered), gated by
`confidence ≥ 0.75`. This is the GraphRAG payload — the corpus building its own graph. **Ingest the
128 government FOIA PDFs** (`apps/disclosure-rag/data/government/pursue_war_gov/`) as new primary-tier
corpus, and classify each doc's **`source_tier`** (Friedman framework). Build the delta-audit
(`check_openai_vectorstore.py` method) to reconcile against the OpenAI store.

**#3 App data-layer cutover:** new `@db` client (Drizzle/Kysely TBD) implementing the
capabilities the audit inventoried — CRUD, Postgres FTS (replacing `.search()`), aggregations
(GROUP BY), and the **GraphRAG retrieval layer** that replaces the OpenAI `file_search` corpus +
rebuilds the mindmap RAG feature: a pgvector similarity module (**vector-find** entry nodes) + a
fixed **`get_connected(entity, depth, rel_filter)`** traversal tool over `nodes`/`edges`
(**graph-expand**, recursive CTE on managed Postgres; swappable for AGE Cypher later). The agent
composes vector-find → graph-expand and returns `{answer, records, edges}` to the React Flow
consumers (which we can refactor freely). Rewire all `@db/xata` import sites. Harvest disclosure-rag's
`agents/prompts.py` (11 UAP-domain system prompts) for domain-specialized RAG routing; optionally
port the Honcho researcher-session memory pattern (one TS file).

**`apps/disclosure-rag` disposition (CORRECTED 2026-05-31):** `main.py` + its ingestion `lib/` +
entity-extraction are the **working production pipeline that built the OpenAI vector store** — the
reference blueprint for #2's owned TS pipeline (port/modernize, don't reinvent). Only the
experimental bolt-ons (AGNO, CocoIndex KG, FAISS, Streamlit, mem0/Honcho) are retire/optional. See
the correction banner in `docs/design/disclosure-rag-review.md`. Keep the repo until #2 lands.

**#4 ufo-ui cherry-pick:** harvest the good components/screens from `apps/ufo-ui` (v0 export,
Next 16) into `apps/app` (Next 15.3.5); reconcile deps; drop the v0 scaffold + stray
expo/react-native deps.
