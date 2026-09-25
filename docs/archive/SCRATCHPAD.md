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

_Last touched: 2026-06-09 (Claude) — verify swarm complete, spec corrected, id-strategy + host locked_

## 🧭 CURRENT THREAD (resume here)
**✅ COMPREHENSION + VERIFY COMPLETE (2026-06-09).** All 3 user stories traced + synthesized (2026-06-08). Verify swarm (12 agents, 2026-06-09) resolved all 3 open decisions. Spec corrected in `docs/design/data-platform-rebuild-spec.md` (supersedes commit `a0b948b`). **Ready for Sub-project #1 execution** (Azure provision + schema + relational load).

**Three verified decisions (2026-06-09):**
1. **IDs → keep `rec_*` text PKs** (REVERSES `a0b948b` BIGINT crosswalk). Evidence: `packages/db/xata-to-supabase.md:131` "DO NOT use Postgres serial/integer PKs"; `xyflow-integration.ts:427-449` nodeMap already works on rec_*; 25+ live call sites in `apps/app/src` thread rec_* across the API boundary. No id_map table needed.
2. **DB host → Azure Database for PostgreSQL Flexible Server** (REPLACES Supabase/Neon). Only managed host with pgvector GA AND Apache AGE GA (May 2025) on the same instance. Supabase/Neon have no committed AGE path.
3. **Embedding model → `text-embedding-3-small` @ 1536 dims** (CONFIRMED — was already correct in `a0b948b`). Delta audit (`check_openai_vectorstore.py`) runs at START of #2, not before #1.

**Comprehension phase findings (2026-06-08) — summaries below, full docs in `docs/design/canvas/2026-05-31-system-trace/`.**

**(History) Mode = COMPREHENSION, not deciding.** Liam (rightly) flagged that Claude was hurrying — locking specs on a system not fully understood. Each turn surfaced another unread file that changed the picture. So: **stop deciding, build a trustworthy system map first.**
- **Method (PINNED):** whiteboard 2–3 user stories, trace each down the full stack — `UI/UX → function call → query layer → resource requested → RESOURCE → RESPONSE → (mods) → state → UI/UX → result` — citing real `file:line` per hop, flagging **real vs aspirational** at the RESOURCE hop (where myths live: Quinuple RAG, FAISS, Upstash).
- **Diagram + stories + method are in the collab canvas:** `docs/design/canvas/2026-05-31-system-trace/` (legacy July-2025 flow SVG imported as foil + INDEX.md). 
- **3 candidate stories — ✅ ALL TRACED 2026-06-08** (firsthand, full stack, file:line): (1) "Ask the board a question" = mindmap agent path → `story-1-ask-the-board.md`; (2) "Seed board from known record" = relational/no-AI → `story-2-seed-from-record.md`; (3) Prometheus chat → `story-3-prometheus-chat.md`. **The comprehension phase the method required is DONE — per the pinned rule "decisions wait until all traces done," we can now resume spec decisions.** Next: synthesize consolidated system map + rebuild-seam list (across the 3 traces + ingestion-reality-map), then revisit the suspect locked spec (a0b948b).
- **STORY #3 FINDINGS (firsthand, file:line in trace doc):** Prometheus chat `/api/prometheus/chat/route.ts` — Vercel AI SDK `streamText` + tool-calling → `toDataStreamResponse()` → **chat message state, NOT the board**. (a) ✅ **ZERO Xata / zero @db — fully survives Xata's death** (least-coupled path; don't spend data-rebuild effort here). (b) only corpus grounding = **`searchUAP`** (`:477`) → **same OpenAI vector store on the deprecating Assistants API** as #1 (`beta.threads.*`, ASSISTANT_ID/VECTOR_STORE_ID). ⇒ when pgvector lands, `searchUAP` is the natural insertion point for an owned-store tool (keep `{query,results[],totalResults}` shape). (c) other tools all REAL & non-DB: `searchExternalResources`+`researchExternalTopic` (Exa), document tools (gpt-4-turbo over uploaded files). (d) **Two AI protocols confirmed app-wide:** #1 = Assistants `runs.stream`+custom SSE→graph; #3 = AI SDK `streamText`+dataStream→chat. **Unified only by shared `buildAgentContext`** = the consolidation foothold. (e) **Assistants→Responses migration is CROSS-CUTTING** (both AI paths depend on it), independent of the data rebuild. (f) defects (AI-hardening thread, not data): `searchUAP` blocking 1s poll (`:505`); `researchExternalTopic` polls 300s under `maxDuration=60` (`:676` vs `:434`) → can't complete.
- **STORY #2 FINDINGS (firsthand, file:line in trace doc):** the canonical board-seed is `research-canvas/page.tsx` (server component, `force-dynamic`) → `getBoundedInitialGraphData` → SDK `getEntityNetworkGraphData` → `xata.db.*.getPaginated`. (a) 🔴 **fully DEAD at Xata, but fails GRACEFULLY** → `catch` returns empty `NetworkGraphPayload` (`xyflow-integration.ts:461`) → **board loads empty, no crash** (cleaner failure than #1). (b) 🐛 **live wiring bug:** app passes `{maxNodesPerType:30}` but SDK `getEntityNetworkGraphData()` takes **no args** (`:344`) → the bounded loader the SDK already wrote (`:49`) is never called → page does an **unbounded full-corpus load per request**. Fix as part of rebuild. (c) **Two contracts to rebuild (pure relational, no AI, no vectors — the cleanest target):** `NetworkGraphPayload{records, connections, graphData{nodes,links}}` (`:298`) for the provider, and `{nodes, meta:{cursor,more}}` for `/api/mindmap/records` (cursor pagination, `fetchNextMindmapRecords:206`). (d) ✅ **unified-edges model already implemented:** `formatGraphEdge` + junction-collapse loop (`:427-449`) flatten the 5 junction tables into one uniform edge list — port this. (e) transforms (`formatGraphNode/Edge`, `convertDatabaseRecordToMindMapNode`, `collectAllPaginatedRecords`) are `@db`-internal, Xata-agnostic — swap `xata.db.*` → PG underneath, transforms survive (same lesson as #1's `transformStreamResponse`).
- **STORY #1 FINDINGS (firsthand, file:line in trace doc):** path is **half-live**. (a) ✅ OpenAI agent loop + Exa external search + agent-authored graph writes (addGraphNodes/addGraphEdges, never persisted) work today. (b) 🔴 `searchDatabase` → `xata.search.all` is **DEAD** (Xata gone): both try and catch hit Xata, silently returns empty → **the board lost all relational grounding; it's now drawn from the LLM's own tool calls + Exa, NOT our corpus.** (c) ⚠️ whole route runs on the **deprecating Assistants API** (`openai.beta.threads.*` + `assistant_id`) — a SECOND migration independent of the data rebuild. (d) **Integration contract to preserve = `searchDatabase`'s output shape**: `{records:[…]}` each with `xataReasoning{score, relevancyLevel, explanation}` (`search-database.ts:112`). Keep the shape, swap Xata→pgvector+FTS underneath and the hook + `transformStreamResponse` keep working untouched. (e) The live client transform `transformStreamResponse` is already **Xata-free**; the Xata-coupled exports in the same file (`fetchRecords`/`askAIAction`/`xataToXYFlow`) are dead and off-path. (f) ⚠️ frontend flag (out of scope here): dual-store split — reads from Zustand `useMindMapStore`, writes via `useMindMap` context.
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
- [x] **DB platform = Postgres + pgvector, SINGLE engine, AGE deferred** (soft yes, 2026-05-31). Host = **Azure Database for PostgreSQL Flexible Server** (pgvector GA + AGE GA May 2025, co-resident). All DDL vanilla-Postgres-portable. See "🕸 Graph-engine fork" below.
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

## 🔍 disclosure-rag ingestion — FIRSTHAND verification (Claude, 2026-05-31)
Read the actual files (not via subagent), per Liam's steer. Confirms the scout report + adds corrections & a security finding. **What "ingestion" actually is, ranked by reality:**
- ✅ **REAL & runnable — the only live-store path:** `lib/knowledge_base_service.py` (`process_youtube_with_enhanced_workflow` / `process_web_with_enhanced_workflow`, both gated on `upload=True`, default False) → `lib/openai_client/upload.py::upload_file_to_openai()` → `client.files.create(purpose="assistants")` + `client.vector_stores.files.create(...)`. **Top-level `client.vector_stores`** = current SDK (confirms the persistence correction). Store chunks+embeds **server-side**. It's **per-URL, manual, YouTube/web only** — there is NO automated bulk corpus ingest here. So the live 1,292 files were fed historically one-URL-at-a-time (or by hand), driven by the dead `main.py` CLI family.
  - ⚠️ `upload.py::chunk_text` (500/50) and `generate_embeddings` are **vestigial + broken** (`response['data'][0]…` is pre-1.0 dict syntax → would `TypeError`; `process_and_upload_document` refs undefined `file_path` → `NameError`). NOT on the live path; the store ignores them. ⇒ the **1500/200 chunking is OUR design choice, not inherited** — neither code value governs the live store (it uses OpenAI's own server-side default).
- 🟡 **REAL but disconnected:** `index_knowledge_base.py` → writes a local `metadata/index.json` filename catalog; **PDF "content" = literally `"PDF Document: {name}"`** (no extraction). No embeddings, no store, no DB. A catalog, not ingestion.
- 🔴 **GHOST / non-runnable:** `scripts/bulk_folder_ingestion.py` *does* have real PDF/docx/text extraction (PyMuPDF/PyPDF2/python-docx) — but line 40 `from integrations.triple_rag_integration import TripleRAGIntegration` imports a module that **does not exist anywhere** (`lib/integrations/` absent; `class TripleRAGIntegration` defined nowhere). ⇒ **ImportError on run.** The "Triple RAG bulk pipeline for the Greer library" never executed. *(Salvage the extraction methods `_extract_pdf_text` etc. — they're the good part.)*
- 🔴 **MYTH, half-built & partly broken:** `lib/adapters/dual_rag_adapter.py` — docstring says "Quinuple RAG (OpenAI+Xata+Upstash+FAISS+CocoIndex)" but the class only wires **3** (Upstash + LocalRAG/FAISS + CocoIndex/pgvector) — **no OpenAI store, no Xata**. `get_status()` and `index_document(use_system="cocoindex")` reference attrs never set in `__init__` (`self.cocoindex_enabled`, `self.cocoindex_client`, `COCOINDEX_AVAILABLE`, `self.cocoindex_weight`) → **AttributeError**. Half-finished rename from cocoindex→enhanced_cocoindex left it broken. The 0.4/0.3/0.3 weights are real but moot.
- ~~🚨 **SECURITY (new, real):** a **live Upstash REST token is hardcoded as a default fallback** in 3 files~~ **SCRUBBED 2026-06-01** — All 12 leaked credential instances removed across 11 files:
  - **Upstash REST token** (3 files): `lib/sync_to_upstash.py`, `lib/upstash/vector.py`, `lib/adapters/dual_rag_adapter.py` — all now require `UPSTASH_VECTOR_REST_URL` + `UPSTASH_VECTOR_REST_TOKEN` env vars
  - **Xata `xau_*` connection string/API key** (8 files): `scripts/import-data-to-postgres.py`, `scripts/final-import.py`, `scripts/direct-sql-import.py`, `scripts/check-tables.py`, `scripts/import-core-tables.py`, `scripts/quick-verify.py`, `scripts/fix-failed-tables.py`, `scripts/setup-postgres-tables.py`, `tests/test-single-insert.py`, `scripts/migrate-to-postgres-xata.py`, `scripts/export-xata-data.py` — all now require `DATABASE_URL` or `XATA_API_KEY` env vars
  - **Next:** rotate the Upstash token at the provider (old value is in git history).
- **Net for the rebuild:** disclosure-rag gives us (1) the entity-extraction schema/prompt [already noted], (2) salvageable PDF/docx extractors in `bulk_folder_ingestion.py`, (3) the proven thin OpenAI-upload wrapper as a *reference* for our pgvector ingest. Everything labeled "Triple/Quinuple RAG" is dead or never ran — **do not port it.**

## 📊 Data model (schema-scout — full report `docs/design/data-model-inventory.md`)
- **CSV reality (CORRECTED 2026-06-09 — firsthand byte-level audit by verify swarm):** ALL tables have **7× row duplication** (export script ran ~7 times and appended each pass) + 6 interior header-echo rows. True deduplicated counts: sightings 43,481 · locations 13,933 · events 595 · personnel/key-figures 465 · testimonies 178 · documents 200 (but corrupted) · topics 91 · orgs 40 · artifacts 259. Import MUST dedup on `id` (`ON CONFLICT DO NOTHING`). Prior "86,962 sightings" etc. were raw-row counts before dedup.
- **31 tables / ~119,734 rows (raw; ~17,000 after dedup)**; 20 populated, 7 empty, 4 to drop. Core entity tables above + 5 junction tables.
- **Embeddings must be fully regenerated** — only ~1 populated embedding row survived per table in the export. ⇒ our owned pipeline is mandatory, not optional. Volume is moderate (~2.3k entity rows + chunks from 400 re-ingested docs), not 119k.
- **`documents` CSV is unusable** — embeddings corrupted across all 400 rows, metadata spilled/unrecoverable. **Re-ingest documents from source files** (`packages/knowledge-base/sources/` + FBI/NASA releases) via the Library + pipeline.
- ~~`key-figures` = exact dup of `personnel`~~ **CORRECTED 2026-06-01** — `key-figures.csv` has the **photo data** `personnel.csv` lacks (931 rows with photos vs 1). All 7 FK links in `schema.json` point to `personnel`, none to `key-figures`. → **Keep the `personnel` table name, but source its data from `key-figures.csv`** (drop `xataversion` col, dedup 931→~465 rows on `id`). See "🔑 ID normalization" below.
- **Load quirks (confirmed):** `&amp;#44;` in sightings.comments (~32,752) decode · `multiple` cols = Python list literals → `text[]` · FK = bare `rec_*`, `''` → NULL · filter header-echo rows (`id=='id'`) · normalize all embeddings to `vector(1536)` (fix orgs-500, chunks-3 anomalies).
- **Load strategy:** **Keep `rec_*` text PKs** — `id TEXT PRIMARY KEY`, import overrides the default with the original `rec_*` value. BIGINT crosswalk REJECTED by verify swarm 2026-06-09 (see "🔑 ID normalization" below).

## 🔑 ID normalization + crosswalk (firsthand CSV review, Claude, 2026-05-31)
Reviewed `packages/db/docs/exports/*.csv` directly (NOT via subagent). Findings:
- **PK column is already `id`** (export stripped `xata_id`/`xata_createdat`/`xata_updatedat`). Residue = (a) the id *values* are `rec_*` Xata record ids (e.g. `rec_cobdfd4jmvif9dabl0g0`), (b) a stray `key-figures.xataversion` col, (c) `tags.csv`/`theories.csv` = 0 rows w/ garbage `id,id,id,…` headers → **drop both**.
- ~~`key-figures.csv` == `personnel.csv` line-for-line~~ **CORRECTED 2026-06-01** — Same 466 unique IDs, but `key-figures` has `photo` populated (JSON list literals like `["deit.webp"]`) on 931 rows vs 1 in `personnel`. Both files have **doubled rows** (each ID appears twice + 1 header-echo). → **Source `personnel` table from `key-figures.csv`**; drop `personnel.csv`; drop `xataversion`; dedup on `id` (keep row with non-empty `photo`); parse `photo` to `text[]` like other `multiple` columns. Zero FK remapping needed.
- **The graph is already on disk as edge lists:** junctions are clean `rec_*→rec_*` pairs; entity FKs too (`testimonies.event/witness=rec_*`). Edges already exist — they're just fragmented.
- **"Corruption" was mostly my naive-awk artifact:** `coordinates` is a quoted `lat,lng` (comma inside); `bio`/`description` have real newlines. ⇒ **quote-aware parser mandatory** (Python `csv` / psycopg `COPY … CSV`). (documents.csv embedding corruption is the one genuine on-disk loss → re-ingest from source per inventory.)
- **DECISION — keep `rec_*` text PKs (VERIFIED 2026-06-09, REVERSES prior crosswalk plan):**
  - `id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text`; on CSV import, override with original `rec_*` value (`ON CONFLICT (id) DO NOTHING` handles the 7× duplication).
  - All FK columns stay `TEXT` referencing `rec_*` values. No `id_map` table. No BIGINT.
  - `nodes`/`edges` graph tables also key on `rec_*` text ids.
  - **Why the BIGINT crosswalk was rejected:** `xata-to-supabase.md:131` explicitly "DO NOT use Postgres serial/integer PKs"; `formatGraphEdge` already works on rec_* (`xyflow-integration.ts:427-449`); 25+ live call sites in `apps/app/src` thread rec_* across the API boundary; no functional benefit at this data scale (43,481 sightings = largest table).
  - Stage approach still valid for quote-aware parsing; just insert directly with rec_* ids instead of building a crosswalk.

## 🕸 Graph-engine fork — RESOLVED 2026-05-31
The fork dissolved once we separated **graph MODEL** from **graph ENGINE** from **edge CREATION**:
- **Graph is core, not "later"** (Liam pushed back hard — connecting dots across 13 heterogeneous tables IS the project). My earlier "shallow traversal → defer graph" was wrong: it deferred the *model*, not just the *engine*.
- **Graph MODEL → in #1 now.** Collapse the fragmented relationships (5 junction tables + ~dozen FK cols) into ONE uniform `edges(src, src_type, rel, dst, dst_type, conf, provenance)` table. This is the cure for the "13 tables, varying columns" nightmare and is vanilla-Postgres.
- **Edge CREATION is automatic, not manual.** The ingestion pipeline (disclosure-rag `entity_extraction`, which already emits a `relationships` type with confidence + source sentence) writes edges *from the document text*. Junction tables seed structural edges; extraction adds the rich latent ones (Lazar→worked_at→S-4). Governed by the existing write-policy (`off/staging/auto`, `min_confidence 0.75`).
- **Traversal is the AGENT's job, not hand-written queries.** Mindmap agent: user asks in English → vector-find entry nodes → graph-expand via a `get_connected(entity, depth, rel)` tool → answer + draw map. No human types CTE/Cypher.
- **Graph ENGINE (AGE) = deferred upgrade.** Fixed `get_connected` SQL/CTE tool runs on *managed* Postgres (Supabase/Neon) with zero generated-query risk = the v1 default. AGE (→ self-host Fly, where Hermes already runs, or Azure Flexible Server) only if the agent needs to *emit Cypher* for open-ended path-finding. The `edges` table makes adopting AGE a non-migration.
- **Rejected:** **Weaviate** (you have an instance, but it can't hold the relational/analytical bulk → always a 2nd store + sync = the exact thing Option A kills; its scale wins are irrelevant at ~thousands of vectors). **SurrealDB** (native graph, but throws away the CSV→PG import edge + SurrealQL rewrite + bets the analytical bulk on a younger engine; AGE-over-PG dominates it). 
- ✅ **VERIFIED 2026-06-09:** Azure Flexible Server ships pgvector GA + Apache AGE GA (May 2025), co-resident on one instance. Supabase/Neon have no committed AGE path. **Azure is the locked host.**

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
- [ ] **Delta audit**: run `apps/disclosure-rag/vector_storage/check_openai_vectorstore.py` at START of #2 (not before #1). Store `vs_meWOEnUiUxtQWf0W6NBsNpCG` keeps serving the live mindmap agent through #1 untouched. Use top-level `client.vector_stores` (not `client.beta.*`). Sources: `packages/knowledge-base/sources/` + `apps/disclosure-rag/data/government/pursue_war_gov/` + greer queue.
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
