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

## 🟢 Active decisions (this session)
- [x] **Xata is DEAD DEAD** — service gone. This is a **greenfield rebuild from the Feb-24 CSV export** (the only surviving source of truth), NOT an SDK port. Don't preserve Xata semantics/return-shapes. We own all consumers and refactor them freely. Any Xata-SDK detail = moot.
- [x] **Documents = immutable evidence**, CRUD only on derived data. (confirmed)
- [x] **Vectorization = Option A**: owned ingestion pipeline → own pgvector, vectors live next to relational data. (confirmed)
- [~] **DB platform = REOPENED 2026-05-31** (was Supabase). Graph-engine question raised — see "🕸 Graph-engine fork" below. Supabase still leads IF graph stays relational; but if native openCypher Graph-RAG is near-term, Supabase is OUT (can't run Apache AGE).
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
- **Load strategy:** keep `rec_*` text PKs for initial direct CSV import (clean tables); regenerate embeddings; documents from source not CSV; surrogate keys later if needed.

## 🕸 Graph-engine fork (NEW — 2026-05-31, triggered by Liam's research note)
Question: do we want **native graph (openCypher Graph-RAG)** in the engine, alongside relational + vector?
- **Domain is graph-shaped** (disclosure networks; 5 junction tables already = edges; mindmap = graph view). Graph-RAG (vector-find → traverse) is well-motivated.
- **BUT Postgres+pgvector already does graph traversal** via junction tables + recursive CTEs for the shallow depth the mindmap needs. AGE/openCypher only pays off at deep/variable-length/perf-critical traversal. = a LATER problem, maybe never.
- **LOAD-BEARING FACT: Supabase CANNOT run Apache AGE** (not on its extension allowlist). **Neon can't either** (no custom C-extensions). So "native graph" ⟹ NOT Supabase/Neon. ← this is the real reason to hesitate on Supabase.
- **AGE needs self-host or Azure:** self-host Postgres+AGE+pgvector on **Fly/Railway** (Liam already runs Hermes on Fly.io → within ops comfort) OR **Azure DB for PostgreSQL Flexible Server** (managed AGE + pgvector + pgai). Verify current ext support before committing.
- **SurrealDB** = native multi-model but biggest bet: discards the direct CSV→Postgres import edge, SurrealQL rewrite, younger DB/less-proven vectors. Rank 3rd for this 0-to-1.
- **KEY: this does NOT block sub-project #1.** The relational schema + pgvector DDL are identical & portable across Supabase/Neon/Azure/self-host. AGE just projects a graph over the same tables. Keep #1 vanilla-Postgres-portable; defer the graph-engine/host decision to ~#2.
- **OPEN DECISION (Liam):** is openCypher Graph-RAG **near-term** (→ self-host Fly/Railway Postgres+AGE+pgvector, or Azure) or **later** (→ Supabase/managed now, add AGE if/when)? Resolves the host.

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
