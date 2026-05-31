# Scratchpad — shared working doc

**Co-owned by Liam + Claude.** Both of us read and write this freely, async. Liam edits
it in his editor whenever; Claude reads those edits and acts on them, and writes here too.
Neither of us has to *ask* the other to add something — we just write, and the other
consumes it. A whiteboard we both hold markers for, not a request queue.

Keeps clutter off the live conversation/terminal. Not the formal three-tier system
(FEATURES → TODO → DAILY_WORK_PLAN) — this is the napkin. Promote items to
`docs/plans/TODO.md` when they're ready to execute.

_Optional: prefix `[L]` for Liam's lines, `[C]` for Claude's, only when attribution
matters. Otherwise just write._

_Last touched: 2026-05-30 (Claude)_

## 🧭 CURRENT THREAD (2026-05-31, post-compaction resume here)
**Mode = COMPREHENSION, not deciding.** Liam (rightly) flagged that Claude was hurrying — locking specs on a system not fully understood. Each turn surfaced another unread file that changed the picture. So: **stop deciding, build a trustworthy system map first.**
- **Method (PINNED):** whiteboard 2–3 user stories, trace each down the full stack — `UI/UX → function call → query layer → resource requested → RESOURCE → RESPONSE → (mods) → state → UI/UX → result` — citing real `file:line` per hop, flagging **real vs aspirational** at the RESOURCE hop (where myths live: Quinuple RAG, FAISS, Upstash).
- **Diagram + stories + method are in the collab canvas:** `docs/design/canvas/2026-05-31-system-trace/` (legacy July-2025 flow SVG imported as foil + INDEX.md). 
- **3 candidate stories (pending Liam's pick — start #1):** (1) "Ask the board a question" = mindmap agent path; (2) "Seed board from known record" = relational/no-AI; (3) Prometheus chat. See canvas INDEX.
- **CORRECTIONS to earlier-locked claims (the spec a0b948b is now SUSPECT until traces verify):**
  - ⚠️ **Assistants API ≠ Vector Stores API.** Assistants API deprecating does NOT kill the vector store `vs_meWOEnUiUxtQWf0W6NBsNpCG` — it persists via Responses API `file_search`. NO corpus fire-drill. (Old delta error `'Beta' has no attribute 'vector_stores'` = stale SDK calling `client.beta.vector_stores`; now top-level.)
  - **`packages/db/migrations/001_create_tables.sql`** = authoritative full Postgres schema (gen'd from `packages/db/docs/exports/schema.json`); its FK block (L464–507) = the canonical structural-edge map. **Build ON it**, don't write from scratch.
  - **`packages/db/xata-to-supabase.md`** explicitly says KEEP `rec_*` text PKs, never auto-generate — the OPPOSITE of the bigint+crosswalk I locked. ⇒ id-strategy is an OPEN decision again (Liam leans normalize; prior guidance says keep). Don't treat crosswalk as settled.
  - **Chunking already decided** (`migration/openai-assistant/prometheus_agent_config.yaml`): recursive splitter, **1500 / 200 overlap**, `text-embedding-3-small`/1536. Removes "TBD".
  - **Corpus counts:** OpenAI store = **1,292 files** (not 1,477); local knowledge-base = **448 files** (31 pdf/407 transcript/10 md per delta-report); `documents` table = 400 rows. The 1,292 store bytes are NOT on disk (`migration/openai-assistant/files/` empty; only manifests survive).
  - Agent config also yields the real **system prompt + 10-section NER output format + tool map** (searchDatabase, transformXYFlow, file_search, code_interpreter) → for #3.
- **Layer-ignorance map (what Claude still hasn't read firsthand):** `apps/app` consumers + AI routes (assumed only); most of `packages/db` (src SDKs, types, api/ search fns, `xata-to-xyflow.ts`, seed scripts); disclosure-rag `lib/`+`adapters/dual_rag_adapter.py`+`agents/prompts.py`; knowledge-base `sources/`; `apps/ufo-ui`; what retrieval backends actually run vs myth.

## 🟢 Active decisions (this session)
- [x] **Xata is DEAD DEAD** — service gone. This is a **greenfield rebuild from the Feb-24 CSV export** (the only surviving source of truth), NOT an SDK port. Don't preserve Xata semantics/return-shapes. We own all consumers and refactor them freely. Any Xata-SDK detail = moot.
- [x] **Documents = immutable evidence**, CRUD only on derived data. (confirmed)
- [x] **Vectorization = Option A**: owned ingestion pipeline → own pgvector, vectors live next to relational data. (confirmed)
- [x] **DB platform = Postgres + pgvector, SINGLE engine, AGE deferred** (soft yes, 2026-05-31). Relational spine + vectors colocated (free joins). Host stays managed-friendly (Supabase/Neon) — edge model is vanilla-Postgres-portable, so AGE/self-host remains a fast-follow, not a prerequisite. See "🕸 Graph-engine fork — RESOLVED" below.
- [x] **Graph = GraphRAG, not a graph engine.** Edges are *extracted by the ingestion pipeline* (disclosure-rag `relationships` taxonomy: conf + source sentence), not hand-authored. Traversal is the *agent's* job (vector-find → graph-expand tool), not hand-written CTE/Cypher. Unified `edges` model lives in #1; AGE only if the agent ever needs to emit Cypher for open-ended path-finding.
- [x] **ufo-ui role** = component/design source (cherry-pick into apps/app, drop the v0 scaffold).

## 🔬 Xata migration audit — distilled (branch `claude/database-z-jet-audit-XHnL6`)
Use it ONLY as a **capabilities inventory** (what the app does with data). Xata-SDK
specifics below are moot now that Xata's dead — kept just to enumerate features to rebuild.
- **Capabilities to provide (not port):** plain CRUD (read/list/create/update/delete/filter/sort) · aggregations (counts/sums/time-series) · full-text search w/ ranking · the RAG feature that feeds the mindmap (answer + matched records → React Flow nodes/edges).
- ~~Adapter seam / preserve `{answer,records}` shape / reuse `targetsPerTable`~~ **MOOT** — no live system to stay compatible with. Rebuild consumers to fit the new layer.
- ⚠️ Audit file:line coordinates are stale (pre-monorepo) AND now largely irrelevant — treat the doc as a feature checklist, not a code map.

## ✅ Ground truth (resolved by ingestion-scout, 2026-05-30)
- **Live AI corpus = OpenAI Vector Store `vs_meWOEnUiUxtQWf0W6NBsNpCG`** (~1,477 files), feeds the Next.js mindmap agent via `file_search`. Xata `.ask()` is dead. This is what our owned pgvector pipeline absorbs/replaces.
- Real spec question now: **what capabilities must the rebuilt layer provide**, mapped against the **CSV export schema** (source of truth). ← schema-scout reporting on this.
- 🔴 Leaked `xau_` key is inert (service dead); scrub from history if still present — hygiene, not urgency.

## ♻️ Reuse from disclosure-rag (ingestion-scout — full report `docs/design/ingestion-analysis.md`)
- **Port verbatim:** entity-extraction schema + prompt (9-type taxonomy: personnel/orgs/events/topics/locations/artifacts/sightings/testimonies/relationships, GPT-4 function-calling w/ confidence + context sentences); entity→table mappings (1:1 with our schema).
- **Reuse as the delta-audit tool:** `vector_storage/check_openai_vectorstore.py` (paginates the OpenAI VS files, diffs vs local). Store ID `vs_meWOEnUiUxtQWf0W6NBsNpCG`.
- **Pattern to adopt:** Docling for layout-aware PDF→markdown.
- **Embedding:** our `text-embedding-3-small`/1536 confirmed; do NOT reuse Python's `all-MiniLM-L6-v2`/384d vectors (incompatible). Python pipeline does NO chunking — we add real chunking.
- **Ignore (dead/aspirational):** CocoIndex ETL (refs non-existent gpt-5, Neo4j dep), `topic_classifier.py` (broken), FAISS (dead), multi-model consensus in `enhanced_content_analysis.py` (over-engineered), `index_knowledge_base.py` PDF "extraction" (returns filename).

## 📊 Data model (schema-scout — full report `docs/design/data-model-inventory.md`)
- **31 tables / ~119,734 rows**; 20 populated, 7 empty, 4 to drop. Core: sightings 86,962 · locations 27,866 · personnel 930 · documents 400 · testimonies 356 · events 282 · topics 182 · organizations 80 · artifacts 72 · + 5 junction tables.
- **Embeddings must be fully regenerated** — only ~1 populated embedding row survived per table in the export. ⇒ our owned pipeline is mandatory, not optional. Volume is moderate (~2.3k entity rows + chunks from 400 re-ingested docs), not 119k.
- **`documents` CSV is unusable** — embeddings corrupted across all 400 rows, metadata spilled/unrecoverable. **Re-ingest documents from source files** (`packages/knowledge-base/sources/` + FBI/NASA releases) via the Library + pipeline.
- **`key-figures` = exact dup of `personnel`** (930 rows, broken embedding) → drop/merge.
- **Load quirks (confirmed):** `&amp;#44;` in sightings.comments (~32,752) decode · `multiple` cols = Python list literals → `text[]` · FK = bare `rec_*`, `''` → NULL · filter header-echo rows (`id=='id'`) · normalize all embeddings to `vector(1536)` (fix orgs-500, chunks-3 anomalies).
- **Load strategy:** ~~keep `rec_*` text PKs~~ **SUPERSEDED 2026-05-31** — see "🔑 ID normalization" below (Liam wants Xata identity gone now, via crosswalk).

## 🔑 ID normalization + crosswalk (firsthand CSV review, Claude, 2026-05-31)
Reviewed `packages/db/docs/exports/*.csv` directly (NOT via subagent). Findings:
- **PK column is already `id`** (export stripped `xata_id`/`xata_createdat`/`xata_updatedat`). Residue = (a) the id *values* are `rec_*` Xata record ids (e.g. `rec_cobdfd4jmvif9dabl0g0`), (b) a stray `key-figures.xataversion` col, (c) `tags.csv`/`theories.csv` = 0 rows w/ garbage `id,id,id,…` headers → **drop both**.
- **`key-figures.csv` == `personnel.csv` line-for-line** (both 11,893 lines) → confirmed dup → **drop key-figures**.
- **The graph is already on disk as edge lists:** junctions are clean `rec_*→rec_*` pairs; entity FKs too (`testimonies.event/witness=rec_*`). Edges already exist — they're just fragmented.
- **"Corruption" was mostly my naive-awk artifact:** `coordinates` is a quoted `lat,lng` (comma inside); `bio`/`description` have real newlines. ⇒ **quote-aware parser mandatory** (Python `csv` / psycopg `COPY … CSV`). (documents.csv embedding corruption is the one genuine on-disk loss → re-ingest from source per inventory.)
- **DECISION — normalize ids via staging + crosswalk (the user's "temp table"):**
  1. **Stage raw**: load each CSV verbatim (quote-aware), `rec_*` intact, no constraints → `staging.<table>`.
  2. **Crosswalk = `id_map(node_id BIGINT GENERATED ALWAYS AS IDENTITY, entity_type text, legacy_id text, UNIQUE(entity_type, legacy_id))`** — ONE global id space across ALL entities. This persists/preserves the unique ids across relations AND **doubles as the graph node registry** (id normalization and the unified node space are the same artifact).
  3. **Materialize clean tables**: new `id BIGINT PK` (from crosswalk) + keep `legacy_id text` (provenance / delta-audit vs OpenAI store keyed on rec_*). Remap the row's own id AND every FK col via JOIN on `id_map`.
  4. **Edges** (junctions + FKs + extracted) reference `node_id` (compact bigint joins — ideal for traversal).
  5. Add FK constraints last; report dangling.
  - Tradeoff acknowledged: crosswalk = more work/risk than carrying `rec_*`, bought for clean non-Xata ids + a ready-made global node space. `legacy_id` keeps the bridge to the past.

## 🕸 Graph-engine fork — RESOLVED 2026-05-31
The fork dissolved once we separated **graph MODEL** from **graph ENGINE** from **edge CREATION**:
- **Graph is core, not "later"** (Liam pushed back hard — connecting dots across 13 heterogeneous tables IS the project). My earlier "shallow traversal → defer graph" was wrong: it deferred the *model*, not just the *engine*.
- **Graph MODEL → in #1 now.** Collapse the fragmented relationships (5 junction tables + ~dozen FK cols) into ONE uniform `edges(src, src_type, rel, dst, dst_type, conf, provenance)` table. This is the cure for the "13 tables, varying columns" nightmare and is vanilla-Postgres.
- **Edge CREATION is automatic, not manual.** The ingestion pipeline (disclosure-rag `entity_extraction`, which already emits a `relationships` type with confidence + source sentence) writes edges *from the document text*. Junction tables seed structural edges; extraction adds the rich latent ones (Lazar→worked_at→S-4). Governed by the existing write-policy (`off/staging/auto`, `min_confidence 0.75`).
- **Traversal is the AGENT's job, not hand-written queries.** Mindmap agent: user asks in English → vector-find entry nodes → graph-expand via a `get_connected(entity, depth, rel)` tool → answer + draw map. No human types CTE/Cypher.
- **Graph ENGINE (AGE) = deferred upgrade.** Fixed `get_connected` SQL/CTE tool runs on *managed* Postgres (Supabase/Neon) with zero generated-query risk = the v1 default. AGE (→ self-host Fly, where Hermes already runs, or Azure Flexible Server) only if the agent needs to *emit Cypher* for open-ended path-finding. The `edges` table makes adopting AGE a non-migration.
- **Rejected:** **Weaviate** (you have an instance, but it can't hold the relational/analytical bulk → always a 2nd store + sync = the exact thing Option A kills; its scale wins are irrelevant at ~thousands of vectors). **SurrealDB** (native graph, but throws away the CSV→PG import edge + SurrealQL rewrite + bets the analytical bulk on a younger engine; AGE-over-PG dominates it). 
- ⚠️ Verify before spending: Azure Flexible Server *currently* ships AGE; Supabase/Neon *still* exclude it. (ctx7 was down — couldn't doc-check live.)

## 🗂 disclosure-rag verdict — CORRECTED 2026-05-31 (subagent review was wrong about the centerpiece; Liam flagged it)
⚠️ The subagent review (`docs/design/disclosure-rag-review.md`) concluded "harvest-then-retire / nothing runs." **Wrong about the core.** Claude read `main.py`/`main.sh` directly:
- **`main.py` IS the working production ingestion pipeline** — the tool Liam used to catalogue/collect/vectorize the ~1,477 records into the **OpenAI vector store** (`UFO_DATA_STORE_ID`) that the live Next.js mindmap agent reads. Connected via the corpus it produced, NOT disconnected junk.
- **Real flow:** `main.py <url|file> [--upload]` → extract (YouTube transcript / web scrape / file read) → `add_to_knowledge_base` → **`upload_file_to_openai` → OpenAI vector store** → entity extraction (→ Xata search) → [try/except optional: CocoIndex KG, mem0]. Core lib/: `knowledge_base_service`, `openai_client/upload`, `knowledge_base_crud`, `entity_extraction`, `web_content_processor`, `upstash/queue`.
- **No pre-chunking is INTENTIONAL** (OpenAI file_search chunks server-side). Our owned pgvector pipeline DOES need its own chunking — we're not using OpenAI's managed store.
- **Corrected disposition:** CORE (`main.py` + ingestion lib/ + entity extraction) = **the reference blueprint for sub-project #2's owned TS pipeline — port/modernize, don't reinvent.** Only experimental bolt-ons (AGNO, CocoIndex KG, FAISS, Streamlit, mem0/Honcho) = retire/optional.
- **NEXT (proper, grounded): Claude reads the core lib/ modules directly** (`lib/knowledge_base_service.py`, `lib/openai_client/upload.py`, `lib/entity_extraction/`, `processing/web_content_processor.py`) to spec #2 against the real tool — not via subagent.
- Still-valid harvest items: 128 FOIA PDFs (→#2 corpus), Friedman `source_tier` (→#1), entity write-policy, `agents/prompts.py`. `check_openai_vectorstore.py` = delta audit.
- **Lesson:** don't outsource review of load-bearing code to a subagent + relay as fact. Read centerpieces firsthand.

## 📌 Parked tasks (do later, don't derail)
- [ ] **Delta audit**: recompute local knowledge-base sources vs what's actually in the OpenAI Vector Store. Done before; redo. Sources at `packages/knowledge-base/sources/` (+ `apps/disclosure-rag/data/...` new FBI/NASA releases).
- [ ] **`packages/db` adapter rewrite**: Xata → Postgres without changing the ~10 `@db/xata` import sites in `apps/app/src`. (events, contexts, routes, features).
- [ ] **Seed local pgvector**: finish `utf-pg` container seed from Feb-24 CSV export (OrbStack currently OFF). `schema_clean.sql` + `load_clean.sql` at repo root.
- [ ] **Embedding model**: `text-embedding-3-small` (1536) — confirmed matches existing `vector(1536)` schema. Lock it in spec.
- [ ] **Ingestion pipeline compute**: where the chunk+embed worker runs (folds into platform choice).
- [ ] **Retrieval rewrite**: agent retrieval = pgvector similarity + full-text + entity filters in SQL; retire/optionally-keep OpenAI file_search.

## 🛠 Canvas/tooling enhancements (nice-to-have)
- [ ] Make archived canvas screens **standalone-renderable** (inline the frame template + theme CSS so they open without the companion server).
- [ ] settings.local.json has a **forest of duplicate git-commit PostToolUse hooks** + a noisy `*`-matcher osascript notification on every tool. Worth de-duping someday.

## 💡 Ideas / open questions
- Vallée/Pasulka-style methodology framework for evidence ingestion & analysis (from CLAUDE.md note).
- Should the Library be content-addressed (hash-keyed) for dedupe across overlapping releases?
