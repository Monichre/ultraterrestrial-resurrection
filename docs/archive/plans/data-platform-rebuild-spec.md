# Data Platform Rebuild — Design Spec

_Created 2026-05-30. Last updated 2026-06-09 (CORRECTED — supersedes commit `a0b948b` decisions on id-normalization and host)._
_Grounded on firsthand story traces (2026-06-08) + verify swarm (2026-06-09). Every factual claim cites file:line._

---

## Corrections vs commit `a0b948b`

Two decisions locked in `a0b948b` are **REVERSED** by firsthand evidence:

| Decision | `a0b948b` said | **Corrected** | Evidence |
|---|---|---|---|
| ID strategy | BIGINT id_map crosswalk, drop `rec_*` | **Keep `rec_*` text PKs** | `packages/db/xata-to-supabase.md:131` explicit "DO NOT use Postgres serial/integer PKs"; `xyflow-integration.ts:427-449` nodeMap keyed on rec_* already; 25+ live call sites thread rec_* across API boundary |
| DB host | Supabase/Neon (AGE deferred, host TBD) | **Azure Database for PostgreSQL Flexible Server** | Only managed host with pgvector GA **and** AGE GA (since May 2025); Supabase/Neon have no committed AGE path |

The embedding model (`text-embedding-3-small` @ 1536 dims) and OpenAI vector store (`vs_meWOEnUiUxtQWf0W6NBsNpCG`) decisions from `a0b948b` are **confirmed correct**.

---

## Goal

Replace the dead Xata data layer with an owned **single-engine Postgres + pgvector** stack where one store holds relational/CRUD data, vectors, AND a unified graph (nodes + edges) — fed by an owned ingestion pipeline, with immutable source documents in object storage. Both the frontend and the AI agent read from this single source of truth. The graph is **GraphRAG**: edges are extracted by the pipeline, not hand-authored, and traversed by the agent via a `get_connected` tool.

---

## Locked decisions (as of 2026-06-09)

- **Xata is dead** — greenfield rebuild from the CSV export, not an SDK port.
- **Architecture:** source files → owned ingestion pipeline (extract→chunk→embed→entity+relationship extraction) → one Postgres holding relational + pgvector + unified graph → shared by frontend + agent.
- **Host:** **Azure Database for PostgreSQL Flexible Server** — pgvector GA, Apache AGE GA (May 2025), both co-resident on one instance. All DDL remains vanilla-Postgres-portable (no Azure-isms in schema). Connection via pooled connection string in env.
- **IDs:** **Keep `rec_*` text PKs throughout.** `id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text`; on CSV import, override the default with the original `rec_*` value. All FK columns stay `TEXT` referencing the same `rec_*` values. No `id_map` crosswalk. No BIGINT. Rationale: `xata-to-supabase.md:131` says so; `formatGraphEdge` already works on `rec_*` strings; the blast radius of a crosswalk (25+ live call sites in `apps/app/src`) is large with zero functional benefit at this data scale (largest table: 43,481 sightings).
- **Unified graph:** `nodes` and `edges` tables key on `rec_*` text ids (same as entity tables). `id_map` is NOT needed. `edges` collapses 5 junction tables + embedded FK columns into one traversable structure.
- **Embeddings:** `text-embedding-3-small` @ 1536 dims, normalized across all vector columns. Anomalies reconciled: `organizations` (was 500 dims) → `vector(1536)`; `document_chunks` (was 3-dim placeholder) → `vector(1536)`; `key_figures.embedding` (was TEXT) and `summary_files.embedding` (dim 0) → `vector(1536)` nullable.
- **Live corpus:** OpenAI Vector Store `vs_meWOEnUiUxtQWf0W6NBsNpCG` (~1,292–1,477 files) is what the new pgvector retrieval replaces. Run delta audit (`apps/disclosure-rag/vector_storage/check_openai_vectorstore.py`) at the START of #2, not before #1.
- **AGE:** deferred, same-server upgrade later. All DDL portable; no AGE prerequisites in #1–#3.
- **Source of truth for data:** clean CSV tables (`packages/db/docs/exports/*.csv`) for relational data; source files for documents (their CSV embeddings are corrupted — see CSV reality below).

---

## Two independent migrations — do not conflate

- **Migration A (this spec):** Xata → owned Postgres+pgvector. Touches `searchDatabase` (#1 board AI tool), all of #2 (board seed). Restores the data-grounded board.
- **Migration B (separate):** OpenAI Assistants API (`beta.threads.*`) → Responses API. Cross-cutting, touches `api/disclosure/mindmap/route.ts` and `api/prometheus/chat/route.ts` `searchUAP`. Independent of the data rebuild; the vector store `vs_meWOEnUiUxtQWf0W6NBsNpCG` persists through Migration B. Track separately.

---

## Sub-project roadmap

| # | Sub-project | Depends on | Status |
|---|-------------|------------|--------|
| **1** | **Azure provision + schema + relational load** | — | **specced below** |
| 2 | Library + ingestion pipeline (re-ingest ~960 source files, regenerate embeddings, entity extraction → pgvector) | #1 | outline only |
| 3 | App data-layer cutover (`@db` adapter: CRUD + FTS + aggregations + pgvector retrieval; rewire ~25 consumer sites) | #1, #2 | outline only |
| 4 | ufo-ui component cherry-pick | independent | outline only |

---

# Sub-project 1 — Azure Foundation, Schema & Relational Load

**Scope:** provision Azure Flexible Server, define the target Postgres schema, and load the clean relational data from the CSV export. Embeddings and documents are explicitly out of scope (#2). Deliverable: a queryable Postgres DB with all non-document tables populated and verified.

## Components

1. **Azure Database for PostgreSQL Flexible Server** — Postgres 16 (longest AGE GA track record), `vector` extension (pgvector), object storage bucket for the Library (#2). Keep all DDL vanilla-Postgres-portable.
2. **Schema migration** (`supabase/migrations/0001_init.sql` or equivalent) — target tables, types, PKs, FKs, vector columns (nullable, empty in #1), FTS `tsvector` columns + GIN indexes.
3. **CSV loader** — Python + psycopg in `apps/app/scripts/xata-exports/seed/`. Reads export CSVs with a **quote-aware parser** (`csv` module or psycopg `COPY … CSV`), applies quirk transforms, bulk-inserts. Idempotent (`INSERT … ON CONFLICT (id) DO UPDATE` or truncate-and-reload).
4. **Verification harness** — row-count assertions per table + FK integrity checks.

## CSV reality (firsthand audit — must implement)

The CSV export has several structural issues discovered by the verify swarm:

| Issue | Tables | Fix |
|---|---|---|
| **7× row duplication** | ALL populated tables | `INSERT … ON CONFLICT (id) DO NOTHING` — dedup on `id`; true counts = total_rows / 7 (sightings: 43,481 true; locations: 13,933; events: 595; personnel/key-figures: 465; testimonies: 178; documents: 200; topics: 91; orgs: 40) |
| **6 interior header rows** | ALL populated tables | Filter rows where `row[0] == 'id'` before insert |
| **events.csv mixed multiplicity** | events | Mixed 7× and 4× patterns — dedup by `id` is still safe |
| **documents.csv embedding corruption** | documents | `embedding` col is an unquoted `[f, f, f, …]` vector — every row misfires into 1547 fields. **Do not load documents here.** Re-ingest from source files in #2 |
| **tags.csv / theories.csv garbage headers** | tags, theories | Headers are `id,id,id,id,id,id,id,` — zero data. DROP these tables entirely |
| **document-chunks / document-entities / document-processing-tasks** | pipeline tables | Header-only stubs, 0 real rows. Create schema only; leave empty for #2 |
| **Python-repr single-quote arrays** | artifacts.images, photos | `['https://...']` — not valid JSON; normalize single→double quotes before `json_agg` / `text[]` cast |
| **key-figures vs personnel** | both | Same 465 `rec_*` ids, same people. **Source personnel from key-figures.csv** (it has photo data; personnel.csv photo is 100% empty). Drop `xataversion` col from key-figures; parse `photo` JSON array → `text[]`. Discard personnel.csv |
| **Seed script stale path** | seeding scripts | `packages/db/xata-seeding-script.ts` has a hardcoded path missing `ACTIVE/` segment — update before use |

## Target schema

### Tables to create + load

**Core entity tables (load from CSV):**
- `sightings` — 43,481 rows (largest table; `comments` col has `&#44;` HTML entities → decode to `,`)
- `locations` — 13,933 rows (orphaned: no FK in/out; has `coordinates` text "lat, lng" + numeric `latitude`/`longitude` cols; load as-is, wire to events/sightings in #3)
- `personnel` — 465 rows (sourced from `key-figures.csv`; `photo text[]`)
- `events` — 595 rows
- `testimonies` — 178 rows (FKs: `event`→events, `witness`→personnel, `organization`→organizations)
- `topics` — 91 rows
- `organizations` — 40 rows
- `artifacts` — 259 rows (standalone, no FK; `embedding vector(1536) NULL`)
- `documents` — create table, **load 0 rows in #1** (re-ingest from source in #2)

**Junction tables (load from CSV):**
- `event_subject_matter_experts` (~119 rows) — event→events, sme→personnel
- `topic_subject_matter_experts` (~858 rows) — topic→topics, sme→personnel
- `organization_members` (~13 rows) — member→personnel, organization→organizations
- `topics_testimonies` (~743 rows) — topic→topics, testimony→testimonies
- `event_topic_subject_matter_experts` (~61 rows) — 3-way junction

**User/app tables (create, load if populated):**
- `users` (~13 rows)
- `user_notes` (~6 rows — "theory" FK target)
- `user_saved_events/topics/organizations/sightings/testimonies/key_figure` (~6 rows each)
- `mindmaps` (~6 rows)
- `summary_files` (~14 rows; `document` FK is UNIQUE — 1:1)

**Pipeline scaffolding (create, load empty — populated in #2):**
- `document_chunks` (vector(1536))
- `document_entities`
- `document_processing_tasks`

**DROP entirely:** `tags`, `theories` (zero columns + zero rows; `theories` concept lives as FK column on `user_saved_*` → `user_notes`)

**Unified graph tables (create in #1, seed structural edges):**
- `nodes` — thin registry: `id TEXT PK, entity_type TEXT NOT NULL, label TEXT`; one row per entity across ALL tables. Seeded in step 4 (see data flow below).
- `edges` — `edge_id TEXT PK DEFAULT gen_random_uuid()::text, src_id TEXT REFERENCES nodes(id), dst_id TEXT REFERENCES nodes(id), rel_type TEXT NOT NULL, confidence REAL NULL, provenance JSONB NULL`. Indexed on `(src_id)`, `(dst_id)`, `(rel_type)`. #1 seeds structural edges; #2 adds extracted latent edges (confidence ≥ 0.75).

### Conventions

- **PKs:** `id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text`. On CSV import, override default with original `rec_*` value. `legacy_id` column is NOT needed — `id` IS the `rec_*` value.
- **FKs:** FK columns stay `TEXT` referencing `id` on the target table. Empty string → `NULL`. Add FK constraints AFTER bulk load; report (don't crash on) dangling references.
- **Vectors:** every embedding column = `vector(1536) NULL` (left empty in #1; populated by #2). All tables: topics, personnel, events, testimonies, documents, mindmaps, artifacts, organizations. `key_figures.embedding` (was TEXT) and `summary_files.embedding` (dim 0) → `vector(1536) NULL`.
- **Arrays:** Xata `multiple` columns → `text[]`. Parse `['x','y']` Python reprs: normalize single→double quotes, then `json_agg`.
- **FTS:** add `tsvector` generated columns + GIN indexes on searchable text: `sightings.comments`, `testimonies` (description/summary), `topics` (name/description), `personnel.bio`, `documents` (title/summary). Replaces Xata `.search()`.
- **Naming:** use underscores in SQL (junction tables: `event_subject_matter_experts` etc.), hyphenated names only in the TS `@db` adapter layer to match existing call sites.
- **Reserved words:** quote `"user"`, `"order"`, etc.
- **`source_tier`:** add `source_tier TEXT` (`primary` | `secondary` | `supporting`) to `documents` — populated in #2 by Friedman framework classification.
- **ON DELETE rules:** set CASCADE on junction/child rows, SET NULL on soft references.

## Data flow

```
packages/db/docs/exports/*.csv
  │
  ▼
[1] STAGE with quote-aware parser (csv.reader / psycopg COPY CSV)
    - filter header-echo rows (row[0] == 'id')
    - dedup on id (ON CONFLICT DO NOTHING — covers 7× duplication)
    - decode &#44; → , in sightings.comments
    - skip documents.csv body (corrupted embedding column)
    - skip tags.csv, theories.csv (garbage / empty)
    - personnel sourced from key-figures.csv (has photo); discard personnel.csv
    - parse photo/images/photos text-repr arrays → text[]
    - '' → NULL for FK/link columns
  │
  ▼
[2] BULK INSERT entity + junction tables (no FK constraints yet)
    - id = original rec_* value (override the default)
    - all FK columns stay as rec_* text references
  │
  ▼
[3] SEED nodes table (one row per entity row across all entity tables)
    INSERT INTO nodes(id, entity_type, label)
    SELECT id, 'event', name FROM events
    UNION ALL SELECT id, 'personnel', name FROM personnel
    ... (all 9 entity types)
  │
  ▼
[4] SEED edges from structural sources:
    - 5 junction tables → edges (rel_type = junction table name)
    - embedded FK columns: testimonies.{event,witness,organization},
      documents.{author,organization} → edges
    - 3-way junction decomposes into 3 pairwise edges (event-topic, event-sme, topic-sme)
    confidence = NULL, provenance = NULL (structural, not extracted)
  │
  ▼
[5] ADD FK constraints; report dangling references (don't crash)
  │
  ▼
[6] VERIFY: row counts, FK integrity, edge integrity, spot-check queries
```

## Key contracts to preserve (integration boundary)

The rebuild must produce byte-identical return shapes for these interfaces — the app consumers do not move:

1. **`searchDatabase` tool** (`search-database.ts:112`) → `{records:[…], xataReasoning:{score, relevancyLevel, explanation}}`. Rebuild = Postgres FTS + pgvector, same output shape.
2. **`NetworkGraphPayload`** (`xyflow-integration.ts:298`) → `{records:{topics,events,personnel,testimonies,organizations,documents,artifacts}, connections:{5 junction sets}, graphData:{nodes:GraphNode[], links:GraphEdge[]}}`. Error path returns identically-shaped empty payload (never throws).
3. **`/api/mindmap/records`** contract → `{nodes, meta:{cursor,more}}`. Rebuild = PG paginated reader keyed by table name.
4. **`searchUAP`** contract → `{query, results[], totalResults}`. Natural insertion point for pgvector retrieval tool in #3.
5. **Unified edges already implemented** — `formatGraphEdge` + junction-collapse loop (`xyflow-integration.ts:427-449`) already works on `rec_*` text ids. Port this logic exactly; do not change the edge id format (`${src_id}->${dst_id}`).
6. **`buildAgentContext`** (`services/ai/context/build-agent-context.ts`) — shared by both AI paths; the one seam for any future protocol consolidation.

## Verification / definition of done

- [ ] Azure Flexible Server provisioned, pgvector extension active.
- [ ] Schema migration applies cleanly to a fresh DB.
- [ ] Per-table row counts match true deduplicated counts (sightings 43,481; locations 13,933; events 595; testimonies 178; documents 0; personnel 465; topics 91; organizations 40; artifacts 259).
- [ ] `nodes` table covers every loaded entity row exactly once.
- [ ] `edges` table has structural edges from all 5 junction tables + embedded FK columns (testimonies + documents).
- [ ] FK integrity pass: zero dangling references (or an explained list).
- [ ] Graph spot-check: `get_connected` on a known personnel → returns expected events + organizations via edges.
- [ ] Spot queries: sighting with decoded commas; personnel row with `text[]` photo; `id` round-trips to original `rec_*` value.
- [ ] No embedding columns populated (confirmed empty — that is #2's job).

## Risks

- Azure Flexible Server AGE has one operational constraint: it cannot be retained through an in-place major-version upgrade (must be dropped and re-created). Not a blocker for #1.
- `locations` (~97k rows) is currently orphaned (no FK). Treat as a standalone gazetteer in #1; link to `events`/`sightings` in #3 if needed.
- `artifacts` (~259 rows) has `embedding vector(1536)` but no FKs. Load it; leave unlinked in the graph until #2 extracts relationships from document text.
- Explicitly out of scope: documents re-ingestion, ALL embedding generation, extracted latent edges → **#2**. Replacing `@db/xata` consumers, FTS/aggregation rewrites, pgvector retrieval, mindmap `.ask()` → **#3**. ufo-ui components → **#4**.

---

# Sub-project 2 — Library + Ingestion Pipeline (outline)

**Goal:** re-ingest ~960 source-document files into the owned pgvector store, regenerate all entity embeddings, extract entity relationships → `edges`.

**Source corpus (firsthand audit):**
- Government PDFs: 244 files / 1.2G (`apps/disclosure-rag/data/government/pursue_war_gov/`)
- Knowledge-base sources/files: 31 PDFs / 197M (`packages/knowledge-base/sources/files/`)
- Greer library: 121 PDFs / 72M (`apps/disclosure-rag/data/queue/greer-document-library/`)
- Transcripts: 443 .txt / 14M (`packages/knowledge-base/sources/transcripts/`)
- Web: 18 txt + 17 md + 26 json / 1.1M (`packages/knowledge-base/sources/web/`)
- Queue structured: 120 json / ~10M (`apps/disclosure-rag/data/queue/`)
- Total ingestible: ~960 files / ~1.5G (not 16G — 6.5G is mp4 video, 7.7G is archive bundles)

**Reference implementation:** `apps/disclosure-rag/main.py` — the production pipeline that built the live OpenAI vector store. Port/modernize, don't reinvent. Key change: the original shipped whole files to OpenAI (server-side chunking); the owned pipeline must chunk client-side.

**Chunking:** recursive_text_splitter, chunk_size=1500, overlap=200 (from `migration/openai-assistant/prometheus_agent_config.yaml:192-196`). Build real chunking; do not use the `chunk_text()` stub in `openai_client/upload.py` (it's dead code with a broken caller).

**Embedding model:** `text-embedding-3-small` @ 1536 dims (locked). Embed string: `{entity.name} - {entity.context}` (from `entity_extraction_agent.py:633`).

**Entity extraction schema:** port `_create_entity_schema()` from `entity_extraction_agent.py:200-371`. Note the schema omits `testimonies` and `documents` from `required` — fix this in the TS port to get all 9 entity types. Use AI SDK `generateObject` with Zod schema.

**Entity write policy:** replicate `ENTITY_WRITE_MODE` (`off`/`staging`/`auto`), `ENTITY_WRITE_MIN_CONFIDENCE=0.75`, rate-limit 20/min (`entity_creator.py:45-59`).

**Latent edges:** the extraction's `relationships` output (confidence + source sentence) writes into `edges` from #1. Gate by `confidence ≥ 0.75`. New entities register in `nodes` on insert.

**Delta audit:** run `check_openai_vectorstore.py` at the START of #2 to discover which local files are already in `vs_meWOEnUiUxtQWf0W6NBsNpCG` vs new, and use the result to drive re-ingest prioritization. Use top-level `client.vector_stores` (not `client.beta.vector_stores` — the beta path throws `AttributeError` with current SDK).

**Key salvageable Python code:**
- `scripts/bulk_folder_ingestion.py:118-395` — document discovery + SHA-256 dedup + PDF/TXT/DOCX extractors (PyPDF2; PyMuPDF is not installed in .venv)
- `index_knowledge_base.py:62-94, 283-346` — tagging heuristics + index.json builder
- **Do NOT salvage:** `dual_rag_adapter.py` (crashes on import), `chunk_text()` (dead), `process_and_upload_document()` (broken var reference + pre-v1 SDK)

---

# Sub-project 3 — App Data-Layer Cutover (outline)

**Goal:** new `@db` adapter implementing all capabilities the blast-radius audit inventoried, rewiring ~25 consumer call sites in `apps/app/src`.

**Highest-leverage targets first** (everything else hangs off them):
1. `xyflow-integration.ts` — `getBoundedInitialGraphData`, `fetchNextMindmapRecords` (canvas render path)
2. `search.ts` — `searchXata` (AI agent + chat route)
3. `ask.ts` — `askXataWithAi` (historical-query + mindmap actions)

**Import specifier collapse:** current app imports from 8+ variants (`@db`, `@db/xata`, `@db/xata/api`, `@db/xata/client`, `@db/src/xata-typescript-sdk/api`, etc.). Collapse to a single `@db` barrel during Migration A. Keep all current import specifiers resolvable until the barrel is in place.

**Dynamic table access:** `xata.db[table]` pattern appears in SSE ask route, xata-to-xyflow, tour-validation, Prometheus chat. The adapter needs a runtime table registry keyed by lowercase + hyphenated names (not a static typed map).

**Ask → RAG replacement:** `xata.db.*.ask()` returns `{answer, sessionId, records:string[]}`. Rebuild = pgvector similarity retrieval + LLM answer + session persistence keyed by `sessionId`. App only uses the KEYWORD path (not vector ask); start with FTS, add pgvector in a second pass.

**Aggregations:** `sightings.summarize`, `events.aggregate`, ranking-service `.aggregate` → explicit SQL `GROUP BY` translations. Identify each before coding.

**GraphRAG retrieval layer:** pgvector `vector-find` (entry nodes) + `get_connected(entity, depth, rel_filter)` traversal tool over `nodes`/`edges` (recursive CTE; swappable for AGE Cypher later). Agent composes vector-find → graph-expand → returns `{answer, records, edges}`.

**Dead code to skip (do not port):**
- `features/user/api/save-event.ts` — entire xata block commented out
- `services/ai/prometheus/lib/analyze.ts` — entire xata block commented out
- `ask-example*.ts`, `useXataAsk.ts`, `debug/` harnesses — no production consumers

---

# Sub-project 4 — ufo-ui Cherry-Pick (outline)

**Status:** largely already done. The full research-canvas chat suite, FullScreenMenu/MenuTrigger, 14 hover-panels, and dot-pattern have already been copied into `apps/app/src/features/mindmap/`. See `EmptyCanvas.stories.tsx` for active integration confirmation.

**Still un-lifted (highest value first):**
1. `NetworkTimelineExplorer` (`apps/ufo-ui/components/pages/NetworkTimelineExplorer.tsx`, 490 lines) — 2D SVG spiral/force network graph with date-sorted node layout, zoom/pan, detail panel. **No apps/app equivalent.** Unique.
2. Curated datasets (`data/ufo-timeline-events.ts` 498 lines, `data/ufo-sightings.ts` 281 lines) — hand-authored canonical UFO cases (Roswell, Nimitz, Phoenix Lights, etc.) with coordinates, classifications, witnesses. Use as seed/demo fixtures and Storybook states.

**Evaluate before lifting (may be redundant):**
- `UFOGlobe` — apps/app already has 3+ competing globe implementations; diff against them first.
- `ZAxisTimeline` — apps/app has `features/timeline/3d-z-axis-timeline.tsx`; diff before adding a 4th.

**Skip:** stock shadcn/ui primitives (apps/app has its own layer); `components/hover-panel/` singular dir (zero importers, superseded by `hover-panels/` plural); v0 app scaffold, AuthContext, FloatingHeader.

---

## Supporting documents

- `docs/design/canvas/2026-05-31-system-trace/SYNTHESIS-system-map.md` — full firsthand system map, 3 resource pillars, 6 rebuild-seam contracts, two-migration framing
- `docs/design/canvas/2026-05-31-system-trace/story-1-ask-the-board.md` — Story #1 trace (mindmap agent)
- `docs/design/canvas/2026-05-31-system-trace/story-2-seed-from-record.md` — Story #2 trace (board seed)
- `docs/design/canvas/2026-05-31-system-trace/story-3-prometheus-chat.md` — Story #3 trace (Prometheus chat)
- `packages/db/xata-to-supabase.md` — original migration notes (id-strategy decision lives here)
