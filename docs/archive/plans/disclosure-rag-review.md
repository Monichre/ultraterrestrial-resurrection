# `apps/disclosure-rag` — Subsystem Review & Harvest Verdict

> ⚠️ **CORRECTION (2026-05-31, Claude after reading `main.py`/`main.sh` directly; Liam flagged the error):**
> This review's overall "harvest-then-retire / nothing runs" conclusion is **WRONG about the centerpiece.**
> `main.py` + its core `lib/` modules are the **working production ingestion pipeline** Liam used to
> catalogue, collect, and vectorize the ~1,477 records into the OpenAI vector store (`UFO_DATA_STORE_ID`)
> that the live Next.js mindmap agent reads. Flow: extract (YouTube/web/file) → `add_to_knowledge_base`
> → `upload_file_to_openai` (→ OpenAI vector store) → entity extraction → Xata. It is connected to the
> Next.js app *via the corpus it produces*. **Corrected disposition:** the CORE pipeline (`main.py` +
> `lib/knowledge_base_service`, `lib/openai_client/upload`, `lib/knowledge_base_crud`,
> `lib/entity_extraction`, `processing/web_content_processor`) = **the reference blueprint for
> sub-project #2's owned TS pipeline — port/modernize, do not reinvent.** Only the experimental
> bolt-ons (AGNO, CocoIndex KG, FAISS, Streamlit, mem0/Honcho — all `try/except`-optional) are
> retire/optional. The per-subsystem verdicts below for those *bolt-ons* are likely fine; the
> framing that treated the whole app as dead is not. Read with that lens.

**Date:** 2026-05-31  
**Reviewer:** Read-only audit agent  
**Basis:** Ground-truth code reading; ingestion pipeline covered in `ingestion-analysis.md` — not repeated here.  
**Rebuild context:** Supabase Postgres+pgvector, owned TS ingestion pipeline, `text-embedding-3-small` @ 1536 dims.

---

## 0. What It Is & Current Status

`apps/disclosure-rag` is a standalone Python research workbench — **historically disconnected** from the Next.js app. It was actively developed July–September 2025 (last commit touching it: 2025-09-19 `a303da4`; a May 2026 commit only added government PDF data). The Python 3.12 venv has two Python versions installed (3.11 and 3.12), with agno 1.7.9, fastapi 0.115.12, streamlit 1.48.0, honcho-ai 1.4.1, faiss-cpu 1.11, and upstash-vector 0.8.0 all installed.

**Real activity status:** The AGNO agent work stalled in August 2025 (PHASE_1_STATUS_REPORT.md says "hit task limits"). STATUS.md is marketing copy — "Production Ready", "FAISS ✅ Available", "CocoIndex ✅ Enhanced" — none of those claims survive code inspection. The last genuine development session was August–September 2025. The repo has been mostly frozen for ~8 months.

---

## 1. Subsystem Verdict Table

| # | Subsystem | Key Files | Verdict | Reason |
|---|-----------|-----------|---------|--------|
| 1 | **Overall status / docs** | `STATUS.md`, `README.md`, `SESSION_RESUME_20250831.md`, `CLAUDE.md` | **RETIRE** | Pure marketing copy; every "✅ fully operational" claim contradicts code findings. Read once, discard. |
| 2 | **Agent layer (pre-AGNO)** | `agents/prompts.py`, `agents/entity_extraction_agent.py`, `agents/disclosure_assistant.py`, `agents/historical_timeline_agent.py`, `agents/testimony_agent.py` | **HARVEST** | Domain-specific system prompts (11 specialized UAP roles) and entity extraction logic are the most re-usable text assets in the repo. The non-AGNO agents are pure Python with no framework coupling. |
| 3 | **Agent layer (AGNO)** | `agents/ufo_youtube_agent.py`, `agents/uap_deep_research_agent.py`, `agents/claims_evidence_agent.py`, `activate_agno.py`, `AGNO_ROADMAP.md` | **RETIRE** | `ufo_youtube_agent.py` fails at import (`ModuleNotFoundError: No module named 'agents.base'`). `uap_deep_research_agent.py` imports `from agno import Agent, PromptTemplate` — `PromptTemplate` doesn't exist in agno 1.7.9. Both are broken stubs written toward a spec that was never completed. The `lib/agno/` subtree is the upstream agno cookbook example repo (Sage/Scholar) pasted in verbatim — not domain-adapted. |
| 4 | **Shared entity store** | `lib/shared_entity_store.py` | **HARVEST (schema only)** | `AGNOEntity` dataclass and `EntityType` enum provide a clean cross-agent coordination model with confidence aggregation, temporal markers, and Xata-table mappings. The in-memory store implementation itself is not portable but the pattern is. |
| 5 | **Memory layer (Honcho)** | `lib/honcho_client.py`, `disclosure_chat_with_memory.py`, `test_honcho_integration.py`, `HONCHO_SETUP_COMPLETE.md` | **HARVEST (pattern, not code)** | Honcho import succeeds; the `HonchoMemoryClient` wrapper cleanly shows the peer → session → message → context-retrieval flow. The test harness confirms it was working as of Aug 2025. However: (a) Honcho is a SaaS dependency that costs money per call, (b) the Next.js rebuild has no user authentication yet, (c) this pattern is a one-file TS port. Worth porting the concept (cross-session memory keyed by researcher ID) but not the Python code. |
| 6 | **FastAPI server** | `api_server.py` | **RETIRE** | `fastapi` is not installed in the venv that `main.py` uses (import fails). The server loads `metadata/index.json` which only exists if `index_knowledge_base.py` has been run — it stores filenames, not content. The endpoints expose knowledge-base file metadata but none of the relational DB data the Next.js app actually needs. Supabase Edge Functions replace this entirely. |
| 7 | **Streamlit dashboard** | `streamlit_app.py`, `knowledge_base_ui.py` | **RETIRE** | 900-line Streamlit app importing ~8 internal modules, several of which are themselves broken (imports `lib.research_queue_manager`, `lib.research_manager`, `components.data_sources_navigator`, `scripts.bulk_folder_ingestion` — none confirmed importable). Useful only as a local dev UI pattern. Not portable; replaced by the Next.js frontend. |
| 8 | **CLI** | `cli.py` | **RETIRE** | Wraps Charm CLI tools (gum, huh, glow) which are likely absent. Falls back to stdin input. The CLI itself is a user-experience shell around `main.py`/`BulkFolderIngestion`. If a batch CLI is needed for the TS pipeline, write a fresh one. |
| 9 | **Disclosure chat** | `disclosure_chat.py`, `disclosure_chat_with_memory.py` | **HARVEST (prompts only)** | `disclosure_chat.py` contains the base system prompt for the Disclosure Bot persona ("expert AI assistant with deep knowledge of UFO/UAP research..."). That prompt is directly reusable in the Prometheus chat route. The memory variant adds the Honcho session pattern. Port the system prompts; discard the OpenAI-threads chat loop (already superseded by Prometheus). |
| 10 | **Knowledge graph (CocoIndex)** | `setup_cocoindex_kg.py`, `lib/cocoindex_flows.py`, `lib/cocoindex/` subtree | **HARVEST (schema dataclasses only)** | Confirms ingestion-analysis.md finding: CocoIndex requires a local Postgres + Neo4j with CocoIndex tables pre-created; no evidence it was ever run end-to-end. The Neo4j dependency is uninstalled. However `lib/cocoindex_flows.py` contains excellent entity dataclass definitions: `PersonEntity`, `EventEntity`, `OrganizationEntity`, `LocationEntity`, `ArtifactEntity`, `SightingEntity`, `TestimonyEntity` — all with typed fields matching the Xata schema. Port these as TypeScript interfaces. |
| 11 | **Entity extraction (core)** | `agents/entity_extraction_agent.py`, `lib/entity_extraction/`, `process_entities.py` | **HARVEST** | Already flagged HIGH value by ingestion-analysis.md. Adding: `lib/entity_extraction/core/entity_creator.py` implements a policy-driven staged write (`off|staging|auto`, `ENTITY_WRITE_MIN_CONFIDENCE=0.75`) — this pattern (stage to JSONL, human-review, then write) should be ported to the TS pipeline's entity write path. The three-tier write policy is the right design for an initial re-ingestion where confidence calibration is unknown. |
| 12 | **OpenAI Vector Store tooling** | `vector_storage/check_openai_vectorstore.py`, `vector_storage/vector_store_query.py`, `lib/openai_client/` | **HARVEST** | Scripts exist and work for enumerating `vs_meWOEnUiUxtQWf0W6NBsNpCG`. Run `check_openai_vectorstore.py` now to get the delta report before the rebuild removes the OpenAI VS dependency. |
| 13 | **Config / env** | `.env`, `config/` | **RETIRE (migrate keys)** | The `.env` has 20+ API keys. Keys relevant to the rebuild: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`. Keys to drop: `XATA_*`, `UPSTASH_*`, `COCOINDEX_*`, `MEM0_*`, `PHI_API_KEY`, `MULTIONAI_API_KEY`. `HONCHO_API_KEY` — keep if Honcho memory is adopted in the rebuild. |
| 14 | **FAISS index** | `rag_index/faiss.index`, `rag_index/documents.pkl` | **RETIRE** | `faiss.index` is 7,725 bytes — essentially empty (a tiny index, not the 448-doc corpus). `documents.pkl` fails to load (Python version mismatch or empty). Dead. |
| 15 | **Upstash Vector** | `lib/upstash/`, `lib/sync_to_upstash*.py` | **RETIRE** | Upstash index is configured at 1024 dims (`UPSTASH_VECTOR_DATABASE_DIMENSION_COUNT=1024`). Our target is 1536 dims — incompatible. Even if it has data, it cannot be used in the new pgvector column without re-embedding. Abandon. |
| 16 | **Government release data** | `data/government/pursue_war_gov/` | **HARVEST (as source documents)** | 116 PDFs (Release 1) + 12 PDFs (Release 2) extracted from official FOIA releases. This is **new corpus material** not in `packages/knowledge-base/sources/`. These PDFs should be ingested by the TS pipeline (sub-project #2). |
| 17 | **Domain analysis / research** | `research/domain_analysis/`, `research/prompts/` | **HARVEST** | `friedman_domain_analysis.json` shows a working UAP evidence-classification framework (Stanton Friedman methodology: primary radar/pilot/military/gov docs → secondary civilian accounts → supporting media). This is the basis of the "famous UFO researchers methodology" approach called out in CLAUDE.md. Worth formalizing as a classification schema in the TS pipeline. |
| 18 | **SQL / Postgres schema** | `clean_and_seed.sql`, `migrations/` | **REFERENCE** | `clean_and_seed.sql` (July 25, 2025) is an earlier attempt at a pgvector schema matching Xata — already superseded by the target schema in `data-platform-rebuild-spec.md`. Useful as a cross-check for column names, but do not use it directly. |
| 19 | **`lib/agno/` (cookbook paste)** | `lib/agno/agents/sage.py`, `scholar.py`, `teams/`, `workflows/` | **RETIRE** | These are the upstream agno cookbook examples (Finance team, Blog post generator, Sage, Scholar) copy-pasted verbatim without domain adaptation. They reference `db.session.db_url` which does not exist in this repo. Not used anywhere. |
| 20 | **`lib/shared_entity_store.py`** | (cross-agent entity bus) | **HARVEST (pattern)** | The design — a singleton entity bus with confidence aggregation, temporal markers, and deduplication by name+type — is sound and maps naturally to a TypeScript module for the ingestion pipeline's entity merge step. |

---

## 2. Synthesis

### (a) / (b) / (c) Call

**This is (a): a source of reusable logic for the Next.js rebuild, not a parallel product worth keeping running.**

The Python system is not currently operational as a product. The AGNO agents are broken stubs. The FastAPI server cannot import its own dependencies. The Streamlit dashboard imports broken paths. The last real development was September 2025. There is no user traffic, no connection to the Next.js app, and no deployment. Keeping it "running" would require substantial debugging effort for zero user-facing value — especially since the rebuild replaces every meaningful function (ingestion, vector retrieval, entity extraction, RAG chat).

However, the codebase contains genuine intellectual work in three areas — domain knowledge (prompts, entity taxonomy, researcher methodology frameworks), entity extraction machinery, and the OpenAI VS enumeration tooling — all of which should be harvested before the system is retired.

---

### Concrete Harvest Items (Beyond Ingestion)

The ingestion analysis already called out entity extraction schema, OpenAI VS enumeration, PDF→Markdown via Docling, and YouTube transcript patterns. **New items from this review:**

1. **`agents/prompts.py` — 11 specialized UAP agent system prompts.**  
   Port the text of `historical`, `claims_evidence`, `geospatial`, `network`, `documentation`, `testimony`, `theory`, `organization` prompts into the Prometheus chat route and/or a prompt library in `apps/app/src/features/agents/`. These represent months of domain prompt engineering. They map directly to the existing Xata entity types and can drive entity-specific conversational modes.

2. **`agents/prompts.py:AGENT_CONFIG` — Model assignments per agent type.**  
   The `{"HA": (claude-3-opus, "historical"), "GV": (claude-3-sonnet, "geospatial"), ...}` table encodes prior decisions about which model handles which UAP reasoning task. Carry this into the TS agent routing layer.

3. **Entity write policy pattern (`lib/entity_extraction/core/entity_creator.py`).**  
   The `off|staging|auto` write mode with `ENTITY_WRITE_MIN_CONFIDENCE=0.75` and rate-limiting is the right pattern for a first-pass re-ingestion where false positives are a real risk. Port this as a parameter to the TS entity-write step in sub-project #2.

4. **`lib/shared_entity_store.py` — Cross-agent entity bus pattern.**  
   Port the concept (not the code) to TypeScript for the ingestion pipeline: an in-memory deduplication buffer keyed by `(name, entity_type)` that accumulates confidence scores across document passes before writing to Postgres.

5. **Government release PDFs in `data/government/pursue_war_gov/`.**  
   128 PDFs (FOIA releases from pursue.war.gov) are **new source material** absent from `packages/knowledge-base/sources/`. These should be copied to the Library bucket (Supabase Storage) and ingested in sub-project #2.

6. **Friedman/Pasulka methodology framework (`research/domain_analysis/friedman_domain_analysis.json`).**  
   The evidence-tier classification (primary: radar/pilot/military/gov docs; secondary: civilian accounts; supporting: media) is a formalized version of the "famous UFO researchers methodology" approach in CLAUDE.md. Encode this as a `source_tier` column in the `documents` table and a classification step in the ingestion pipeline. This is the UAP-domain equivalent of citation credibility scoring.

7. **Honcho memory pattern (`lib/honcho_client.py`).**  
   The peer → session → message → `get_context()` loop is a one-file TS port. If the rebuild wants persistent researcher-session memory in the Prometheus chat, port this pattern; the Honcho SaaS key is already provisioned. This is optional but adds real value for repeat researchers.

---

## 3. Roadmap Impact (Sub-projects 1–4)

### Sub-project #2 (Library + Ingestion Pipeline) — Two additions

**Addition A: Government release PDFs as new corpus.**  
The 128 PDFs in `apps/disclosure-rag/data/government/pursue_war_gov/release_01/` and `release_02/` are FOIA-released official documents (FBI, CIA, DoD). These are not in `packages/knowledge-base/sources/`. They should be copied to the `library` Supabase Storage bucket and ingested in the same pipeline pass as the knowledge-base sources. Tag them with `source_tier = "primary"` (Friedman classification).

**Addition B: Evidence-tier classification column.**  
Add `source_tier text` (values: `primary`, `secondary`, `supporting`) to the `documents` table during sub-project #1 schema migration. Populate it in the ingestion pipeline (#2) using the Friedman classification logic: government/military docs = primary; civilian witness accounts = secondary; media/journalism = supporting. This field feeds the retrieval weighting in sub-project #3.

### Sub-project #3 (App data-layer cutover) — One addition

**Addition: Domain-agent routing via prompts.**  
When rebuilding the mindmap RAG response layer, use `agents/prompts.py` as the source of system-prompt text for entity-specific conversational modes (e.g., querying about a personnel record uses the "testimony" or "network" prompt; querying about a sighting cluster uses the "geospatial" prompt). This gives the rebuilt Prometheus route domain-specialization that the current generic prompt lacks.

### Sub-project #1 (Schema) — No changes needed

### Sub-project #4 (ufo-ui cherry-pick) — No changes needed

---

## 4. Key Caveats

- **The FAISS index is empty** (7KB) and incompatible regardless — do not attempt to import it.
- **Upstash Vector is at 1024 dims** — incompatible with 1536-dim target. Abandon entirely.
- **The AGNO agent layer is broken at import** — `ufo_youtube_agent.py` cannot be imported, `uap_deep_research_agent.py` references a non-existent `agno.PromptTemplate`. Harvest the prompts text, not the agent code.
- **CocoIndex was never run** — `setup/cocoindex_tables_corrected.sql` exists but the `lib/cocoindex/` backend requires a local Postgres instance with CocoIndex-specific tables, and there is no evidence this was ever set up successfully. The `neo4j` Python driver is not installed. Retire the CocoIndex flow entirely; harvest only the entity dataclass schema.
- **The `.env` file contains live API keys** — the OpenAI key, Anthropic key, and Honcho key are all active. When `apps/disclosure-rag` is retired, revoke the Upstash, Xata, Tavily, ScrapeGraph, Composio, and MultiOn keys — they are unused in the rebuild. Keep OpenAI and Anthropic keys (shared with the Next.js app).

---

## Appendix: File Paths for Harvest Items

| Item | Source Path |
|------|-------------|
| UAP agent system prompts | `apps/disclosure-rag/agents/prompts.py` |
| Entity extraction schema (Python dataclasses) | `apps/disclosure-rag/agents/entity_extraction_agent.py` lines 37–59 |
| Entity type → table mapping | `apps/disclosure-rag/agents/entity_extraction_agent.py` lines 68–88 |
| CocoIndex entity dataclasses (type-safe field defs) | `apps/disclosure-rag/lib/cocoindex_flows.py` lines 42–160 |
| Entity write policy pattern | `apps/disclosure-rag/lib/entity_extraction/core/entity_creator.py` |
| Cross-agent entity bus pattern | `apps/disclosure-rag/lib/shared_entity_store.py` |
| OpenAI VS enumeration scripts | `apps/disclosure-rag/vector_storage/check_openai_vectorstore.py` |
| Honcho memory pattern | `apps/disclosure-rag/lib/honcho_client.py` |
| Disclosure Bot system prompt | `apps/disclosure-rag/disclosure_chat_with_memory.py` lines 66–78 |
| Friedman evidence-tier framework | `apps/disclosure-rag/research/domain_analysis/friedman_domain_analysis.json` |
| Government PDFs (Release 1) | `apps/disclosure-rag/data/government/pursue_war_gov/release_01/documents/Release_1/` (116 PDFs) |
| Government PDFs (Release 2) | `apps/disclosure-rag/data/government/pursue_war_gov/release_02/` (12 PDFs) |
| Postgres schema (reference only) | `apps/disclosure-rag/clean_and_seed.sql` |
