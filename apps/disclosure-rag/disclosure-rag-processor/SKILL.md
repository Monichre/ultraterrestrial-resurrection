---
name: disclosure-rag-processor
description: >
  Process UFO/UAP research content (URLs, YouTube videos, playlists, local files) through the Disclosure RAG pipeline.
  Use when ingesting web articles, YouTube videos, or local documents into the knowledge base,
  batch-ingesting entire YouTube podcast playlists (episode enumeration, transcript fetch,
  fidelity review, RagPromptPipeline / ADR-0001 Evidence chunks, NER, vectorization),
  running the disclosure-rag CLI (main.py, main.sh / dy, run.sh, cli.py, scripts/playlist_ingestion.py),
  bulk folder ingestion, checking integration status (Upstash, optional CocoIndex/Mem0),
  searching the knowledge base, entity extraction from processed content,
  or any work in apps/disclosure-rag/ involving the processing pipeline.
  Prefer this skill over product Next.js AI paths — Python ingest is Lane A and disconnected from apps/app.
---

# Disclosure RAG Processor

Process UFO/UAP research content through a multi-stage pipeline: content extraction, knowledge base storage, entity extraction, knowledge graph construction, and contextual memory.

## Working Directory

All commands run from `apps/disclosure-rag/`. Prefer `./main.sh` / `dy` (they export `.venv` + `source .env` correctly). If invoking Python directly:

```bash
cd apps/disclosure-rag && set -a && source .env && set +a
.venv/bin/python main.py --status
```

Do **not** rely on `source .venv/bin/activate` alone — `main.py` imports Upstash modules that require env vars already in the process. Required: `OPENAI_API_KEY`, `UFO_DATA_STORE_ID`. Optional: `UPSTASH_SEARCH_URL`/`UPSTASH_SEARCH_TOKEN`, `MEM0_API_KEY`, `MEM0_USER_ID`.

**Canonical skill copy:** this directory (`apps/disclosure-rag/disclosure-rag-processor/`). Keep `~/.claude/skills/disclosure-rag-processor/` in sync with it.

## CLI Entry Points

### main.py -- Primary Processor

```bash
.venv/bin/python main.py <URL_OR_FILE> [--upload] [--no-kb] [--status] [--dry-run]
```

Auto-detects content type (YouTube / web / file). `--upload` sends to OpenAI vector store. `--status` shows all integration backends. `--dry-run` prints the plan without writing.

### main.sh -- Shell Wrapper (preferred; `dy` alias)

```bash
./main.sh process-url <URL> [--upload]    # Single URL
./main.sh process-file <FILE> [--upload]  # Single file
./main.sh process-urls <URL_FILE>         # Batch from file (loops main.py per URL)
./main.sh process-playlist <PL_URL> [...] # YouTube playlist(s) → playlist_ingestion.py
./main.sh search "Phoenix Lights"         # Search KB (heredoc → KnowledgeBaseCRUD)
./main.sh stats                           # KB statistics (heredoc → KnowledgeBaseCRUD)
./main.sh chat                            # disclosure_chat.py
./main.sh setup                           # Install dependencies
```

**Dead branches (do not use):** [`apps/disclosure-rag/main.sh`](apps/disclosure-rag/main.sh) `ui` and [`apps/disclosure-rag/main.sh`](apps/disclosure-rag/main.sh) `sync-rag` call [`apps/disclosure-rag/main.py`](apps/disclosure-rag/main.py) `--ui` / `--sync-rag`, which argparse does not define → exit 2. For Streamlit use `.venv/bin/python -m streamlit run streamlit_app.py` instead. Trace: [`apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md`](apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md). Hop index: [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md).

Auto-creates `.venv` if missing, loads `.env`, validates env vars. The user's global `dy` alias points at this script, so `dy process-playlist <URL>` works anywhere; bare playlist URLs (`dy "https://youtube.com/playlist?list=..."`) auto-route to the playlist pipeline (any URL containing `/playlist` or `list=`, including watch URLs inside a playlist).

### cli.py -- Interactive TUI (use for bulk ingestion & research chat)

```bash
python cli.py
```

Menu: **Search KB** | **Bulk Ingestion** (folder → all PDFs/DOCX/TXT/MD) | **Research Chat** | **Entity Analysis** | **Geospatial Analysis** | **Reports**. Uses Charm tools (gum/glow/glamour); falls back to plain input if not installed.

### run.sh -- Alternative Runner

```bash
./run.sh chat | agno-chat | agno-chat-files
./run.sh process-url --url <URL> --upload
./run.sh process-yt --url <YT_URL> --upload
./run.sh test | lint | format | clean
```

## Processing Pipeline

```
Input (URL/YouTube/File)
  |-> Content Extraction
  |     YouTube: lib/youtube.py / youtube_transcript_enhanced
  |     Web: processing/web_content_processor.py scraping
  |     File: direct read (supports .md, .pdf, .txt — NOT .docx; use bulk ingestion for docx)
  |
  |-> RagPromptPipeline (processing/rag_prompt_pipeline.py via content_analysis.py)
  |     document_classification → content_analysis → rag_ingestion
  |     → disclosure.ner → validation
  |     Writes *_rag_pipeline.json; Evidence-only chunks (ADR-0001)
  |
  |-> Knowledge Base Storage (lib/kb/knowledge_base_crud.py)
  |     Indexes content, assigns doc_id (filesystem + index.json — not Neon yet)
  |
  |-> Upstash Search Sync (lib/sync_to_upstash_search_integrated.py)
  |     Optional; if UPSTASH_SEARCH_* configured
  |
  |-> Entity Extraction (lib/entity_extraction/)
  |     NER + entity matching (platform DB is Neon via @db/postgres — T-048 H2 bridge)
  |
  |-> CocoIndex Knowledge Graph (lib/cocoindex_integration.py)  [OPTIONAL]
  |     Fault-tolerant; skip if cocoindex / Neo4j unavailable
  |
  |-> Mem0 Contextual Memory (lib/mem0_integration.py)  [OPTIONAL]
  |
  |-> Upstash Queue (lib/upstash/queue.py)  [OPTIONAL]
       QStash async processing for downstream consumers
```

Each optional stage is fault-tolerant — failures log warnings but never block the pipeline. Live writes today: **filesystem archive + `metadata/index.json` + optional Upstash Search**. Neon writes are T-048 H2 work, not this skill's default path. This Python pipeline does **not** feed the Next.js mindmap/Prometheus routes.

## Key Modules

**Do not conflate the three KB modules** — layer map: [`apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md`](apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md).

| Module | Purpose |
| -------- | --------- |
| [`lib/kb/knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) | Orchestrates KB indexing + Upstash sync (ingest glue) |
| [`lib/kb/knowledge_base_crud.py`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py) | Filesystem archive CRUD -- see API section below |
| [`lib/kb/knowledge_base.py`](apps/disclosure-rag/lib/kb/knowledge_base.py) | In-memory FAISS/Agno retrieval for agents — not the `dy` writer |
| `lib/terminal_display.py` | Animated spinners, styled headers, progress output |
| `processing/rag_prompt_pipeline.py` | Registry-backed classify → chunk → NER → validate (ADR-0001) |
| `processing/content_analysis.py` | `ContentAnalysisEngine.process_for_rag()` wraps RagPromptPipeline |
| `lib/entity_extraction/processors/interactive_entity_processor.py` | NER with `process_summary_file_interactive()` |
| `lib/cocoindex_integration.py` | Optional KG; `process_document_knowledge_graph()` |
| `lib/mem0_integration.py` | Optional memory functions -- see API section below |
| `lib/unified_rag_orchestrator.py` | `UnifiedRAGOrchestrator` -- multi-backend search (local/OpenAI) |
| `lib/transcript_fidelity.py` | Playlist fidelity scoring + quarantine gate |
| `processing/web_content_processor.py` | `WebContentProcessor` for web scraping |
| `scripts/bulk_folder_ingestion.py` | `BulkFolderIngestion` -- multi-format batch processing |
| `scripts/playlist_ingestion.py` | Playlist enumerate → fidelity → `main.process_url` |
| `agents/` | Specialized research agents (see Agents section) |
| `api_server.py` | FastAPI REST server with RAG search endpoints |

## RagPromptPipeline (ADR-0001)

Wired into YouTube (`lib/youtube.py`), web (`web_content_processor` / knowledge_base_service), and file (`main.process_file` → `ContentAnalysisEngine.process_for_rag`). Prompts resolve from `packages/ai/prompts` via `lib/prompt_loader.py`.

```
source text
  → document_classification
  → disclosure.content_analysis
  → rag_ingestion                 (Evidence chunks only)
  → disclosure.ner (per chunk)
  → validation
  → embeddable_texts              (safe_for_rag_index only)
```

```python
from processing.rag_prompt_pipeline import process_document_for_rag
from processing.content_analysis import ContentAnalysisEngine

result = process_document_for_rag(text, provenance="https://example.com/doc")
# or
result = ContentAnalysisEngine().process_for_rag(text, provenance="file.pdf")
# result: { status, classification, analysis, chunks, ner_results, embeddable_texts, ... }
# status: ok | hold | rejected | error
```

Artifacts land as `<stem>_rag_pipeline.json` beside the transcript/summary. Chunk bodies must remain Evidence-only — never embed agent Inference (ADR-0001).

**Known gap:** `upload_file_to_openai()` still uploads the raw file in some paths; curated `embeddable_texts` are not always what gets vectorized. Prefer inspecting `*_rag_pipeline.json` after ingest. Smoke (no LLM): `python -m pytest tests/test_rag_prompt_pipeline_wiring.py -q`.

Env: `RAG_PIPELINE_PROVIDER`, `RAG_PIPELINE_MAX_NER_CHUNKS` (8), `RAG_PIPELINE_MAX_SOURCE_CHARS` (24000), `RAG_PIPELINE_CHUNK_TOKENS` (512).

## KnowledgeBaseCRUD Full API

```python
from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD
kb = KnowledgeBaseCRUD()

kb.create_document(title, content, source, doc_type, metadata, tags)  # returns Document
kb.get_document(doc_id)              # returns Optional[Document]
kb.list_documents(doc_type, tags, limit, offset)  # returns List[Document]
kb.search_documents(query, limit)    # returns List[Dict] with score/snippet
kb.update_document(doc_id, title, content, metadata, tags)
kb.delete_document(doc_id)          # returns bool
kb.bulk_import(directory, doc_type)  # returns List[Document]
kb.export_document(doc_id, output_dir)
kb.get_statistics()                  # returns {total_documents, total_tags, documents_by_type, popular_tags, last_updated}
```

`doc_type` values: `'case_file'`, `'transcript'`, `'article'`, `'research'`

Storage paths: transcripts → `sources/transcripts/`, articles → `sources/web/`, files → `sources/files/`, research → `research/`

## Mem0 Full API

```python
from lib.mem0_integration import (
    add_memory(messages, user_id, agent_id, metadata)     # core add
    search_memories(query, user_id, limit)                # semantic search
    add_youtube_summary_memory(title, video_url, video_id, summary, tags)
    add_web_article_memory(title, url, content, summary, tags)
    add_file_content_memory(title, file_path, content, file_type, tags)
    add_entity_extraction_memory(doc_id, entities, total_matches, processing_results)
    add_knowledge_graph_memory(doc_id, entities_processed, relationships_processed, kg_results)
    add_processing_summary_memory(doc_id, title, content_type, processing_steps, final_status)
    contextual_add(user_id, text, metadata)               # direct contextual storage
    search_context(user_id, query, top_k)                 # retrieve context
)
```

Env: `MEM0_API_KEY` or `NEXT_PUBLIC_MEM0_API_KEY`. Disable with `MEM0_ENABLE=false`. Agent ID: `MEM0_AGENT_ID` (default: `disclosure-rag-agent`).

## Entity Extraction -- Entity Types

9 entity types extracted from UAP content:

| Type | Key Fields |
| ------ | ----------- |
| `PERSON` | role, credibility(1-10), authority(1-10), bio |
| `EVENT` | title, datetime, location(coordinates), metadata |
| `ORGANIZATION` | title, specialization, image |
| `LOCATION` | coordinates, google_maps_id, city/state |
| `TESTIMONY` | claim, source, documentation[] |
| `TOPIC` | title, summary, photos |
| `DOCUMENT` | embedding(1536d), url, file[] |
| `ARTIFACT` | name, origin, images |
| `SIGHTING` | shape, duration_seconds, media_link, location |

Confidence levels: High (0.9-1.0) → direct DB insert, Medium (0.6-0.8) → flag for review, Low (0.3-0.5) → archive.

Treat entity→platform DB writes as partial until T-048 H2 lands. Some matcher code still imports retired **Xata** modules, but those paths are dead — the guarded import degrades to a stub and performs no lookups. Do not invent Neo4j/Xata as required for a successful ingest.

```python
from lib.entity_extraction.processors.interactive_entity_processor import process_summary_file_interactive
results = process_summary_file_interactive(
    summary_file_path,   # path to text file
    video_id,            # doc_id to associate
    interactive=False    # True for human review mode
)
# returns: { total_entities, total_matches, entities, status }
```

## Specialized Research Agents (`agents/`)

14 agents in `agents/` directory, built on Agno framework:

| Agent | File | Purpose |
| ------- | ------ | --------- |
| `UFOYouTubeAgent` | `ufo_youtube_agent.py` | Timestamp-based UFO event extraction from video |
| `UAPDeepResearchAgent` | `uap_deep_research_agent.py` | Multi-source cross-referencing |
| `DisclosureAssistant` | `disclosure_assistant.py` | General Q&A over KB |
| `ClaimsEvidenceAgent` | `claims_evidence_agent.py` | Claim verification |
| `EntityExtractionAgent` | `entity_extraction_agent.py` | Standalone entity extraction |
| `HistoricalAgent` | `historical_agent.py` | Timeline and historical context |
| `HistoricalTimelineAgent` | `historical_timeline_agent.py` | Chronological ordering |
| `TestimonyAgent` | `testimony_agent.py` | Witness testimony analysis |
| `TheoryAgent` | `theory_agent.py` | Hypothesis generation |
| `ContentAnalysisAgent` | `content_analysis_agent.py` | Content classification |
| `DeepKnowledgeAgent` | `deep_knowledge.py` | Iterative research synthesis |
| `ResearchCrew` | `research_crew.py` | Multi-agent orchestration |
| `UltraterrestrialNERAgent` | `ultraterrestrial_domain_ner_agent.py` | Domain-specific NER |
| `BaseResearchAgent` | `base_research_agent.py` | Base class |

## FastAPI Server (`api_server.py`)

```bash
python api_server.py  # default port 8000
```

REST endpoints:

| Method | Path | Purpose |
| -------- | ------ | --------- |
| GET | `/` | Root info |
| GET | `/health` | Health check |
| GET | `/stats` | KB statistics |
| GET | `/documents` | List documents (paginated) |
| GET | `/documents/{id}` | Get single document |
| GET | `/search` | Keyword search |
| GET | `/tags` | All tags |
| GET | `/categories` | Document categories |
| POST | `/rag/search` | Vector RAG search |
| GET | `/rag/status` | RAG system status |
| POST | `/rag/index` | Index a document |
| WS | `/ws` | WebSocket connection |

## Unified RAG Search

```python
from lib.unified_rag_orchestrator import UnifiedRAGOrchestrator
import asyncio

rag = UnifiedRAGOrchestrator(openai_api_key, vector_store_id)
results = asyncio.run(rag.search(
    query="Phoenix Lights",
    max_results=10,
    system_preference='auto'  # 'auto', 'openai', 'local'
))
status = rag.get_system_status()   # { openai: RAGSystemStatus, local: RAGSystemStatus }
```

## Bulk Ingestion (`scripts/bulk_folder_ingestion.py`)

Supports PDF, DOCX, TXT, MD files. Extracts text and creates multi-backend documents for local indexing (historically labeled "triple-RAG" in this script — treat as local batch ingest, not a product retrieval architecture).

**CLI entry point — choose one:**

```bash
# Option A: Interactive TUI (recommended for first use)
.venv/bin/python cli.py
# → Select "Bulk Ingestion" from menu → enter folder path when prompted

# Option B: Run script directly (non-interactive)
.venv/bin/python scripts/bulk_folder_ingestion.py
# Note: no built-in CLI flags — configure folder_path in the script or use Option C

# Option C: Python one-liner
.venv/bin/python -c "
from scripts.bulk_folder_ingestion import BulkFolderIngestion
b = BulkFolderIngestion('/path/to/folder')
docs = b.discover_documents()
print(f'Found {len(docs)} files')
for d in docs: b.create_triple_rag_document(d, b.extract_text_content(d))
"
```

**Python API:**

```python
from scripts.bulk_folder_ingestion import BulkFolderIngestion

ingestion = BulkFolderIngestion(folder_path, output_dir="ingestion_results")
docs = ingestion.discover_documents()           # find all supported files
for doc in docs:
    text = ingestion.extract_text_content(doc)  # PDF/DOCX/TXT/MD
    rag_doc = ingestion.create_triple_rag_document(doc, text)
```

## Playlist Ingestion (`scripts/playlist_ingestion.py`)

Batch-ingest one or more YouTube podcast playlists end-to-end. Each episode flows through: enumeration → transcript fetch → parse/clean → **fidelity review** (quality gate) → `main.process_url()` (KB storage, RagPromptPipeline sidecars, NER, optional vectorization / CocoIndex / Mem0).

```bash
# One or more playlist URLs (plain video URLs also accepted)
.venv/bin/python scripts/playlist_ingestion.py "https://www.youtube.com/playlist?list=PL..." [MORE_URLS...]

# From a file (one URL per line, # comments allowed), with vector store upload
.venv/bin/python scripts/playlist_ingestion.py --from-file playlists.txt --upload

# Preview a new playlist's caption quality without ingesting
.venv/bin/python scripts/playlist_ingestion.py <URL> --limit 5 --dry-run

# Stricter gate + LLM coherence pass (FIDELITY_REVIEW_MODEL, default gpt-5.5)
.venv/bin/python scripts/playlist_ingestion.py <URL> --min-fidelity 0.6 --llm-review
```

Flags: `--upload` (OpenAI vector store), `--no-kb`, `--limit N` (per playlist), `--force` (reprocess done episodes), `--dry-run`, `--min-fidelity 0.45`, `--llm-review`, `--delay 2.0` (seconds between episodes), `--state-file PATH`.

**Resume is automatic**: state is checkpointed to `data/playlist_ingestion/state.json` after every episode; re-runs skip `ingested`/`quarantined`/`unavailable` episodes and retry `failed`/`no_transcript`/`blocked` ones. After `YT_BLOCKED_ABORT_THRESHOLD` consecutive IP blocks (default 3), the run aborts.

**Fidelity review** (`lib/transcript_fidelity.py`) scores each transcript 0–1 from coverage, speech density (wpm), caption gaps, artifact ratio, and repetition; verdicts: `pass` ≥ 0.7, `review` ≥ 0.45, `fail` < 0.45. Failing/below-threshold episodes are **quarantined** (transcript + fidelity JSON kept on disk, not ingested). Artifacts: cleaned transcripts in `data/playlist_ingestion/transcripts/`, per-episode fidelity reports and per-run markdown summaries in `data/playlist_ingestion/reports/`.

See [Playlist ingestion details](references/playlist-ingestion.md) for stage internals, state schema, quarantine review workflow, and tuning.

## Content Type Detection

YouTube: URL contains `youtube.com` or `youtu.be`. Web: starts with `http(s)://`. File: everything else (validated with `os.path.exists`).

## Extending the Pipeline

Add stages in `process_url()` or `process_file()` following this pattern:

```python
if result and result.get('doc_id'):
    try:
        processing_steps.append("New stage")
        # ... processing logic ...
    except Exception as e:
        logger.warning(f"New stage skipped: {e}")
```

## File Relocation

Processed files from `data/processing_queue/` auto-move to `packages/knowledge-base/sources/files/`.

## Troubleshooting

- **Module not found**: Use `.venv/bin/python`, run `pip install -r requirements.txt` inside the venv
- **API key / Upstash import errors**: Prefer `./main.sh` / `dy`, or `set -a; source .env; set +a` before bare Python
- **`dy ui` / `dy sync-rag` exit 2**: Dead — `main.py` has no `--ui`/`--sync-rag`. Streamlit: `.venv/bin/python -m streamlit run streamlit_app.py`
- **CocoIndex unavailable**: Optional stage; install only if you need KG. Pipeline continues without it
- **Mem0 disabled**: Set `MEM0_API_KEY` or leave unset (stage skipped)
- **Upstash sync skipped**: Set `UPSTASH_SEARCH_URL` + `UPSTASH_SEARCH_TOKEN`
- **Playlist IP blocks**: State marks `blocked`; run aborts after consecutive threshold — wait / rotate network, then re-run (resume skips terminal statuses)

## References

- [Pipeline architecture details](references/pipeline-architecture.md) -- module relationships, data flow, and integration points
- [Playlist ingestion details](references/playlist-ingestion.md) -- playlist pipeline stages, fidelity scoring, state/resume, quarantine workflow
- [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md) -- `dy` hop index (`file:line`)
- [`apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md`](apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md) -- verified `dy` → [`apps/disclosure-rag/main.sh`](apps/disclosure-rag/main.sh) → [`apps/disclosure-rag/main.py`](apps/disclosure-rag/main.py) / playlist nesting
- [`apps/disclosure-rag/processing/RagPromptPipeline.md`](apps/disclosure-rag/processing/RagPromptPipeline.md) -- ADR-0001 pipeline wiring notes
- Lane A roadmap: [`docs/PLANS/2026-08-01-ingestion-hardening.md`](docs/PLANS/2026-08-01-ingestion-hardening.md) (T-048)
