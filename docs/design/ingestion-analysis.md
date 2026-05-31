# Disclosure-RAG Ingestion Pipeline Analysis

**Date:** 2026-05-30  
**Purpose:** Ground-truth audit of `apps/disclosure-rag` ingestion to inform our owned TypeScript pipeline (extract → chunk → embed → pgvector).

---

## 1. Real End-to-End Ingestion Pipeline

### Entry Points (actual code paths)

There are **three distinct ingestion entry scripts**, only partially overlapping:

| Script | Role | Status |
|---|---|---|
| `main.py` | Primary daily-workflow CLI — YouTube, web, local file | Active but imports CocoIndex/Mem0 with graceful fallback |
| `main_unified.py` | Parallel rewrite with explicit multi-backend storage class | Written but likely less battle-tested |
| `index_knowledge_base.py` | File-system indexer, builds `metadata/index.json` — NO embeddings | Active; this is a metadata catalog only |

### Source Types Handled

| Type | Extraction Method | Files |
|---|---|---|
| YouTube video | `youtube-transcript-api` (auto-captions) or `faster-whisper` (local Whisper ASR) | `lib/youtube.py`, `lib/youtube_handler.py` |
| Web article/HTML | `requests` + `BeautifulSoup` → `markdownify` | `processing/web_content_processor.py` |
| PDF | `docling` (`DocumentConverter`) → markdown export | `processing/document_converter.py` |
| Plain text / Markdown | `open()` read | `main.py:process_file()` |
| Images | Downloaded and stored; **no OCR in current code** | `web_content_processor.py` |

**Critical finding:** `index_knowledge_base.py` line 51-53 shows PDF "extraction" is literally:
```python
return f"PDF Document: {file_path.name}"
```
So the metadata indexer does NOT extract PDF text at all — just stores the filename. Real PDF text extraction goes through `docling` only when `document_converter.py` is called directly.

### Chunking

**No dedicated chunking module exists.** The pipeline processes full documents as single units:
- `main_unified.py` passes the entire `transcript_content` or article `content` string to `storage.store_document()` with no chunking step.
- `langchain` and `tiktoken` are in `requirements.txt` but **no LangChain splitter is imported or used** anywhere in the ingestion path.
- The CocoIndex flow in `lib/cocoindex_flows.py` uses `cocoindex.functions.ExtractByLlm` to do document-level analysis but also has no explicit chunk/split step.

**Verdict:** No chunking. Everything is whole-document embedding.

### Embedding Model

Two different embedding models appear in code — this is the core inconsistency:

| Location | Model | Dims |
|---|---|---|
| `main_unified.py` line 70 | `sentence-transformers/all-MiniLM-L6-v2` | **384** |
| `main_unified.py` CocoIndex init | `all-MiniLM-L6-v2` | **384** |
| `agents/entity_extraction_agent.py` line 614 | `text-embedding-3-small` (OpenAI) | **1536** |
| `processing/topic_classifier.py` | `facebook/bart-large-mnli` (zero-shot classification, not embedding) | N/A |

The **primary embedding path** in `main_unified.py`'s `UnifiedVectorStorage` is `all-MiniLM-L6-v2` (384 dims). The OpenAI embedding model only appears in the entity agent's `generate_embeddings()` method which is a side-utility, not the main pipeline.

### Where Vectors Land

| Store | Library | Triggered by | Status |
|---|---|---|---|
| **Upstash Vector** | `upstash-vector` | `main_unified.py` — always | Configured if `UPSTASH_VECTOR_REST_URL` set |
| **PostgreSQL/pgvector via CocoIndex** | `cocoindex` + `psycopg2` | `main_unified.py` — always | Requires `cocoindex` installed + local PG running |
| **OpenAI Vector Store** (`vs_meWOEnUiUxtQWf0W6NBsNpCG`) | `openai` Assistants Files API | Only with `--upload` flag | Already populated (the production store) |
| **Local FAISS** | `faiss-cpu` in requirements | **Not used in any active ingestion path** | Dead — in requirements only |
| **Neo4j** | `neo4j` driver | CocoIndex flow (`lib/cocoindex_flows.py`) | Setup script only; not triggered by main |

---

## 2. "Quinuple RAG" — What It Means in Code vs. Marketing

The CLAUDE.md in the RAG repo claims "Quinuple RAG (OpenAI + Xata + Upstash + FAISS + CocoIndex)."

Ground truth:

| Claimed RAG Layer | Code Reality |
|---|---|
| **OpenAI Vector Store** | Real — `vs_meWOEnUiUxtQWf0W6NBsNpCG` exists; queried via `beta.threads` in `lib/unified_rag_orchestrator.py` and the Next.js mindmap route |
| **Xata full-text search** | Real — `lib/xata_search.py` does `search_table()` for entity lookup; this is keyword/BM25, NOT vector search |
| **Upstash Vector** | Configured in `main_unified.py`; likely has data if the pipeline was run |
| **FAISS** | `faiss-cpu` in requirements.txt, **zero import of faiss in any active code**. Dead. |
| **CocoIndex → PostgreSQL** | Code exists in `lib/cocoindex_flows.py` and `main_unified.py` but requires a local Postgres with CocoIndex tables set up. Not verifiably operational. |

So: **2 real (OpenAI VS + Xata keyword), 1 probable (Upstash), 1 aspirational (CocoIndex), 1 dead (FAISS).**

The "Quinuple RAG" is marketing fiction. Retrieval in the only live consumer (Next.js mindmap route) uses OpenAI file_search only.

---

## 3. OpenAI Vector Store (`vs_meWOEnUiUxtQWf0W6NBsNpCG`)

### What it is

This is the **primary and only confirmed working vector store** for the project. The Next.js disclosure/mindmap agent uses it via the OpenAI Assistants `file_search` tool.

### What's stored

The vector store was populated manually / via `upload_file_to_openai()` from `lib/openai_client/upload.py`. Based on the orchestrator comments: **1,477 files** in OpenAI vector store. The local knowledge base has ~602 files in `packages/knowledge-base/sources` (31 PDFs + 464 txt transcripts + rest).

### How to enumerate its contents

`vector_storage/check_openai_vectorstore.py` and `vector_store_query.py` provide two scripts for this:

```python
# Method 1: via check_openai_vectorstore.py
python vector_storage/check_openai_vectorstore.py
# - Retrieves store metadata (name, file count, status)
# - Lists all files with pagination (100/page via `client.beta.vector_stores.files.list()`)
# - Gets per-file details via `client.files.retrieve(file_id)`
# - Compares vs local files, saves report to `vector_storage/vector_store_report.json`

# Method 2: via vector_store_query.py
python vector_storage/vector_store_query.py
# - Paginates through `client.beta.vector_stores.files.list(vector_store_id, limit=100)`
# - Saves DataFrame to `vector_store_file_data.csv`
```

**Key hardcoded ID:** `VECTOR_STORE_ID = 'vs_meWOEnUiUxtQWf0W6NBsNpCG'`

The local file at `vector_storage/vector_storage.py` also references `vector-store-files.json` (a cached dump of the store contents). This JSON file does not exist yet — it would be produced by running one of the enumeration scripts.

### Delta audit relevance

The `compare_files()` function in `check_openai_vectorstore.py` does:
- `vector_filenames` = files in OpenAI store
- `local_all_names` = PDFs in `knowledge/files/*.pdf` + transcripts in `knowledge/transcripts/**/*.txt`
- Produces: files only in VS, only local, in both

Note: the local paths in `check_openai_vectorstore.py` are relative to `vector_storage/`, so they scan `../files/*.pdf` and `../transcripts/**/*.txt` — meaning the `apps/disclosure-rag/knowledge/` tree, not `packages/knowledge-base/`. This is a path mismatch from the actual source location.

---

## 4. Entity Extraction (`process_entities.py` → `agents/entity_extraction_agent.py`)

### Approach

**LLM-based structured NER** using OpenAI function calling (GPT-4.1 default) or Anthropic (claude-sonnet-4.5-20250514).

The `AIEntityExtractor.extract_entities()` method:
1. Sends the full document text to the LLM with a detailed domain-specific system prompt
2. Uses OpenAI `functions` / `function_call` with a JSON Schema to force structured output
3. Returns typed `EntityExtractionResult`

### Entity Types Extracted

```
topics, personnel, events, organizations, locations, artifacts, sightings, relationships
```

Each entity includes: `name`, `confidence` (0–1), `context` (source sentence), `metadata` (role, org, coordinates, etc.)

### Output Shape

```python
@dataclass
class EntityExtractionResult:
    topics: List[ExtractedEntity]
    personnel: List[ExtractedEntity]
    events: List[ExtractedEntity]
    organizations: List[ExtractedEntity]
    locations: List[ExtractedEntity]
    testimonies: List[ExtractedEntity]
    documents: List[ExtractedEntity]
    artifacts: List[ExtractedEntity]
    sightings: List[ExtractedEntity]
    relationships: List[Dict[str, Any]]
    raw_analysis: str
    extraction_metadata: Dict[str, Any]
```

### Downstream Actions

After extraction, `InteractiveEntityProcessor._batch_xata_search()` queries the Xata database for each entity (by name, against the Xata tables: personnel, organizations, topics, events, locations, artifacts, sightings). Entities not found are staged in `out/entity_write_plan.jsonl` (default mode=staging) or written to Xata (mode=auto, confidence ≥ 0.75).

### Zero-shot Classification (topic_classifier.py)

`processing/topic_classifier.py` uses `facebook/bart-large-mnli` for zero-shot topic classification (not entity NER). This is a separate, self-contained module that imports from `src.storage.models` — a path that doesn't exist in the repo. **Likely dead code.**

---

## 5. Reuse Verdict for Owned TS Pipeline

| Module / Logic | Port Worth? | Notes |
|---|---|---|
| **Entity extraction schema** (9 entity types + relationships, confidence scores, context sentences) | **YES — high value** | The JSON schema and entity taxonomy are well-designed for this domain. Port the entity type definitions and the structured-output prompt to TS. |
| **Entity type → Xata table mapping** | **YES** | The `table_mappings` dict (`personnel`, `organizations`, `topics`, `events`, `locations`, `artifacts`, `sightings`, `testimonies`) maps 1:1 to the Xata/pgvector schema we already have. Directly reusable. |
| **OpenAI vector store enumeration** (`check_openai_vectorstore.py`) | **YES — run now** | Provides the delta audit method. Run `check_openai_vectorstore.py` to get `vector_store_report.json` and compare vs local files. |
| **YouTube transcript extraction** (`lib/youtube.py`) | **Partially** | Uses `youtube-transcript-api` (easy to call from Node via child_process or replicate in TS with `youtubei.js`). The logic is straightforward to rewrite. |
| **PDF → Markdown via Docling** (`processing/document_converter.py`) | **YES — the approach** | `docling` is Python-only but the pattern (PDF → structured markdown with layout preservation) is the right approach. In TS pipeline: call Docling via Python subprocess or use `pdf-parse` + GPT-4 for structured extraction. |
| **Web content extraction** (`web_content_processor.py`) | **Partial** | The pattern (fetch → BeautifulSoup → markdownify) is correct. TS equivalent: `cheerio` + `turndown`. The image downloading logic is relevant if we want to store images. |
| **Content analysis multi-model** (`enhanced_content_analysis.py`) | **Skip** | Over-engineered "consensus" that simply picks the best single-model response. The approach isn't wrong but the code is not portable. |
| **Chunking** | **N/A — doesn't exist** | Must be built from scratch. Recommend: heading-aware recursive splitting with 512-token chunks, 64-token overlap (tiktoken in Python or `js-tiktoken` in TS). |
| **CocoIndex flows** (`lib/cocoindex_flows.py`) | **Reference only** | The entity dataclass schemas and relationship taxonomy are well-designed. The CocoIndex-specific code is not portable. |
| **FAISS** | **Skip** | Dead code. Not used. |
| **Upstash Vector sync** | **Skip** | We're building into pgvector; no need for Upstash. |
| **Topic classifier** (bart-large-mnli) | **Skip** | Likely dead code (imports broken path). Zero-shot classification can be done with GPT-4 as part of entity extraction. |
| **`index_knowledge_base.py`** | **Reference only** | Shows file taxonomy (case_file, transcript, article, research) and tag patterns. The actual implementation (PDF reads → filename only) is not useful. |

---

## 6. Embedding Model Reconciliation

| System | Model | Dims |
|---|---|---|
| **Our decision (Option A)** | `text-embedding-3-small` | **1536** |
| `main_unified.py` primary path | `all-MiniLM-L6-v2` | **384** |
| Entity agent `generate_embeddings()` | `text-embedding-3-small` | **1536** |
| OpenAI Vector Store (existing) | OpenAI proprietary (Assistants API) | Unknown (OpenAI managed) |

**Mismatch confirmed:** The Python pipeline's main embedding path uses 384-dim sentence-transformers. Our TS pipeline decision is 1536-dim `text-embedding-3-small`. These are **incompatible** — vectors from the Python pipeline cannot be queried against vectors from our TS pipeline in the same pgvector column.

**Recommendation:** Our decision to use `text-embedding-3-small` / 1536 is superior:
- Higher quality than `all-MiniLM-L6-v2` on semantic tasks
- Matches what the entity agent already uses for entity embeddings
- More consistent with the OpenAI ecosystem we're already in

Do NOT attempt to reuse Python-generated Upstash or CocoIndex vectors in our new pgvector table — they will be 384-dim and incompatible.

---

## 7. Knowledge Base File Inventory

| Location | File Count | Types |
|---|---|---|
| `packages/knowledge-base/sources/files/` | ~602 total | 31 PDFs, 464 TXT transcripts, MDs |
| `packages/knowledge-base/sources/transcripts/` | Nested by date | TXT (YouTube summaries + raw transcripts) |
| `apps/disclosure-rag/knowledge/` | 22 files | 7 PDFs (small local subset) |
| OpenAI Vector Store | ~1,477 files (per orchestrator comments) | Mix (the production upload) |

The main corpus to ingest for our pipeline is in `packages/knowledge-base/sources/`.

---

## 8. Actual Pipeline Flow Diagram

```
Input: URL or file path
         |
         v
[Type Detection] ──────────────────────────────────
    |          |          |              |
YouTube     Web URL    Local File     PDF
    |          |          |              |
[Transcript] [BS4+md]  [open()]    [docling→md]
    |          |          |              |
    └──────────┴──────────┴──────────────┘
                          |
                    [Full text blob]
                          |
              ┌───────────┴───────────┐
              |                       |
    [Content Analysis]          [Entity Extraction]
    Claude/GPT (summary,        GPT-4.1 function call
     research notes)            → 9 typed entities
              |                       |
              v                       v
    [KB CRUD: save to          [Xata search + match]
     local metadata/             [Stage to JSONL]
     index.json]                 [Create if auto]
              |
              v
    [Embedding: all-MiniLM-L6-v2 / 384 dims]
              |
         ┌────┴────────────────┐
         |                     |
   [Upstash Vector]   [CocoIndex → PostgreSQL]
         |                     |
         └──── (if --upload) ──┘
                     |
           [OpenAI Assistants
            Files API upload
            → vs_meWOEnUiUxtQWf0W6NBsNpCG]
```

---

## Key Findings Summary

1. **No chunking exists** — the pipeline embeds whole documents. Our pipeline must build this.
2. **Embedding model mismatch** — Python uses 384-dim all-MiniLM-L6-v2; we should use 1536-dim text-embedding-3-small as decided.
3. **OpenAI Vector Store `vs_meWOEnUiUxtQWf0W6NBsNpCG`** is the only confirmed production store with ~1,477 files. The delta audit script works via `client.beta.vector_stores.files.list()`.
4. **FAISS is dead.** CocoIndex is aspirational (code exists, connectivity unverified). Upstash is configured but secondary.
5. **Entity extraction is the most valuable piece**: GPT-4 function calling → 9 entity types with confidence scores, context, relationships → Xata table mapping. Port this schema and prompt to TS.
6. **PDF extraction is real but narrow**: `docling` provides layout-aware PDF→markdown. Only 7 PDFs in the local `disclosure-rag/knowledge/` tree; the main corpus (31 PDFs) is in `packages/knowledge-base/sources/files/`.
7. **CocoIndex flows** (`lib/cocoindex_flows.py`) contain excellent entity schema dataclasses but the CocoIndex ETL itself is aspirational (references `gpt-5` model which doesn't exist, has Neo4j dependency).
