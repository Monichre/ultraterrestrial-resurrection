# Data Platform Rebuild — Design Spec

_Created 2026-05-30. Supersedes Xata (dead). Anchored to the Feb-24 CSV export + source files._

## Goal

Replace the dead Xata data layer with an owned **Supabase Postgres + pgvector** stack where
one store holds both relational/CRUD data and vectors, fed by an owned ingestion pipeline,
with immutable source documents in a Supabase Storage "Library." Both the frontend and the
AI agent read from this single source of truth.

## Locked decisions (from the 2026-05-30 design session)

- **Xata is dead** — greenfield rebuild from the CSV export, not an SDK port. No preserving Xata semantics.
- **Architecture:** Library (immutable object storage) → owned ingestion pipeline (extract→chunk→embed) → one Postgres+pgvector (relational + vectors) → shared by frontend + agent. (Option A.)
- **Platform:** Supabase (Postgres+pgvector, Storage, Edge Functions/queues/pg_cron).
- **Embeddings:** `text-embedding-3-small` @ 1536 dims, normalized across all vector columns.
- **Live corpus today:** OpenAI Vector Store `vs_meWOEnUiUxtQWf0W6NBsNpCG` (~1,477 files) — what the new pgvector retrieval replaces.
- **Source of truth:** clean CSV tables for relational data; **source files** for the 400 documents (their CSV is corrupted).

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

1. **Supabase project** — Postgres 15+, `vector` (pgvector) extension enabled, a private Storage
   bucket `library` created (used in #2). Connection via pooled connection string in env.
2. **Schema migration** (`supabase/migrations/0001_init.sql`) — the target tables, types, PKs,
   FKs, vector columns (empty for now), and FTS `tsvector` columns + GIN indexes.
3. **CSV loader** — **Python + psycopg**, in `apps/app/scripts/xata-exports/seed/` (matches the
   prior seed attempt; psycopg `COPY` is ideal for bulk). Reads the export CSVs, applies quirk
   transforms, bulk-inserts into Postgres. Idempotent (truncate-and-reload, or upsert on `rec_*` PK).
   Note: the existing `.venv` there is a broken alias — create a fresh venv.
4. **Verification harness** — row-count assertions per table + FK integrity checks.

## Target schema

**Tables to create:** sightings, locations, personnel, testimonies, events, topics,
organizations, artifacts, + junction tables (topic-subject-matter-experts, topics-testimonies,
event-subject-matter-experts, event-topic-subject-matter-experts, organization-members), users,
user-notes, summary-files, tags. Create-but-load-empty (populated in #2 or vestigial): documents,
document-chunks, document-entities, document-processing-tasks, mindmaps. Confirm row counts
against the inventory at load time — load only tables the inventory marks populated.

**Drop / skip:** `key-figures` (exact duplicate of `personnel` — drop). Empty tables
(per inventory: most `user-saved-*`, `theories`, etc.) — create only if a FK or feature needs
them; otherwise defer.

**Conventions:**
- **PKs:** keep Xata `rec_*` strings as `text PRIMARY KEY` (zero remap, direct import). Surrogate
  `bigint` keys deferred to a later migration if needed.
- **FKs:** `link` columns → `text REFERENCES <table>(id)`; empty string → `NULL`. Add FK
  constraints **after** load (load order-independent), then report violations.
- **Vectors:** every embedding column = `vector(1536)`, **nullable, left empty in #1**
  (populated by #2). Normalize anomalies (orgs was 500, document_chunks stub was 3).
- **Arrays:** Xata `multiple` columns → `text[]`.
- **FTS:** add `tsvector` generated columns + GIN indexes on the text-heavy searchable tables
  (sightings.comments, documents, testimonies, topics, personnel.bio) to replace Xata `.search()`.
- **Reserved words:** quote `"user"` etc.

## Data flow

```
export/*.csv ──▶ loader (per-table)
                  │  decode &#44; → ,
                  │  ast/JSON parse ['x'] → text[]
                  │  '' → NULL ; filter rows where id == 'id' (header echoes)
                  │  skip documents.csv (corrupted — handled in #2)
                  │  skip key-figures.csv (dropped)
                  ▼
              Postgres COPY/INSERT (batched) ──▶ add FK constraints ──▶ verify counts + FKs
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

- [ ] pgvector extension present; `library` Storage bucket exists.
- [ ] Migration applies cleanly to a fresh DB.
- [ ] Per-table row counts match the inventory (±0 for clean tables; documents = 0 by design).
- [ ] FK integrity pass: zero dangling `rec_*` references (or a reported, explained list).
- [ ] A handful of spot-check queries return sane data (a sighting with decoded commas; a
      personnel row with `text[]` roles; a junction join).
- [ ] No embedding columns populated (confirmed empty — that's #2's job).

## Explicitly out of scope (later sub-projects)

- Documents re-ingestion + ALL embedding generation → **#2**.
- Replacing `@db/xata` consumers, FTS query rewrites, aggregation rewrites, pgvector retrieval,
  rebuilding the mindmap `.ask()` feature → **#3**.
- ufo-ui components → **#4**.

## Risks / open questions

- **Supabase connection limits** during bulk load — use the pooler or a direct session; batch inserts.
- **Which empty tables to materialize now** vs defer — default: only those referenced by a FK from a populated table.
- **`mindmaps`/`user-*` tables** — confirm whether the new app still needs them as-is or they get redesigned in #3 (flag, don't block #1).

---

## Sub-project 2-4 outlines (for later specs)

**#2 Library + ingestion pipeline:** Supabase Storage bucket holds source files (knowledge-base
sources + FBI/NASA releases). Owned TS pipeline: extract (Docling for PDFs, transcript/web
handlers) → chunk (real chunking, sizes/overlap TBD) → embed (`text-embedding-3-small`) →
write `document_chunks` + entity embeddings to pgvector. Re-ingest the 400 documents from
source. Regenerate ALL entity embeddings (topics/personnel/events/orgs/testimonies/artifacts).
Port disclosure-rag's entity-extraction schema/prompt + entity→table mappings verbatim. Build
the delta-audit (`check_openai_vectorstore.py` method) to reconcile against the OpenAI store.

**#3 App data-layer cutover:** new `@db` client (Drizzle/Kysely TBD) implementing the
capabilities the audit inventoried — CRUD, Postgres FTS (replacing `.search()`), aggregations
(GROUP BY), and a pgvector retrieval module that replaces the OpenAI `file_search` corpus +
rebuilds the mindmap RAG feature (return `{answer, records}` to the existing React Flow
consumers, which we can also refactor freely). Rewire all `@db/xata` import sites.

**#4 ufo-ui cherry-pick:** harvest the good components/screens from `apps/ufo-ui` (v0 export,
Next 16) into `apps/app` (Next 15.3.5); reconcile deps; drop the v0 scaffold + stray
expo/react-native deps.
