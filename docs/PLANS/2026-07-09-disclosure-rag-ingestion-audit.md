# Multi-Agent Audit: disclosure-rag CLI Ingestion

**Date:** 2026-07-09
**Scope:** `apps/disclosure-rag/` — CLI functionality for ingesting new data from "literally almost any source"
**Method:** Four parallel audit agents (canonical path, connector coverage, entry-point sprawl, runtime probe) + synthesis
**Status:** Audit complete; no files modified

---

## TL;DR — The CLI ingestion path is dead

The headline claim — ingest from "literally almost any source" — is **not met**. The primary bulk-ingestion code path cannot even import, let alone run. Every competing entry point also fails at import time due to missing dependencies. The system has real, working loaders for YouTube, web URLs, and PDFs, but none of them are reachable from the interactive CLI (`cli.py`), and the CLI's own ingestion menu silently degrades to an error message.

**One-line root cause:** `scripts/bulk_folder_ingestion.py:40` imports `TripleRAGIntegration` from a module (`integrations.triple_rag_integration`) that does not exist anywhere in the repo — and was never committed.

---

## Severity-ordered findings

### CRITICAL — ingestion is non-functional

| # | Finding | Location | Evidence |
|---|---------|----------|----------|
| C1 | **Bulk ingestion module unimportable.** `from integrations.triple_rag_integration import TripleRAGIntegration` references a module/class that does not exist. The entire `bulk_ingestion_interface` → `_process_bulk_ingestion` → `_process_single_file` → `process_single_document` chain is dead. `cli.py` masks this with a try/except (lines 16–19), so the CLI loads but prints "❌ Bulk ingestion module not available" the moment a user selects bulk ingestion. | `scripts/bulk_folder_ingestion.py:40` | Runtime probe: `ModuleNotFoundError: No module named 'integrations'`. Repo-wide search for `class TripleRAGIntegration` returns zero matches. |
| C2 | **DocumentFile field-name mismatch.** Even if C1 were fixed, `cli.py` constructs `DocumentFile(path=, name=, size=, extension=, mime_type=)` but the dataclass requires `file_path, filename, size_bytes, file_hash, last_modified`. Would raise `TypeError`. | `cli.py:577–585` vs `scripts/bulk_folder_ingestion.py:50–57` | Static audit + runtime probe confirmation. |
| C3 | **All primary entry points broken by missing deps.** `main.py` fails (`qstash`), `main_enhanced.py` and `main_unified.py` fail (`anthropic`). None produce `--help`. The `pyproject.toml`-declared entry point `disclosure-rag = "main:main"` is broken. | `main.py` → `lib/upstash/queue.py:1`; `main_enhanced.py`/`main_unified.py` → `processing/content_analysis.py:5` | Runtime probe: all three `--help` invocations fail with `ModuleNotFoundError`. |

### HIGH — capability gaps and misleading claims

| # | Finding | Location | Evidence |
|---|---------|----------|----------|
| H1 | **"5 backend" summary is a hardcoded string, not reality.** `cli.py:549–554` claims ingestion writes to OpenAI Vector Store, Xata, Upstash, FAISS, and Postgres pgvector. No backend code is actually invoked because the ingestion module never loads. | `cli.py:549–554` | Canonical-path audit: the summary is printed unconditionally after the try/except block, regardless of what actually happened. |
| H2 | **`.doc` listed as supported but has no handler.** `SUPPORTED_EXTENSIONS` includes `.doc` (legacy Word), but `extract_text_content()` has no branch for it — files fall through to "Unsupported file type." | `scripts/bulk_folder_ingestion.py:74` (declaration) vs `:248–263` (handlers) | Static audit. |
| H3 | **Most of the CLI menu is mock data.** Of 10 menu options: Search returns `_mock_search_results()` (hardcoded), Chat returns `_mock_agent_response()` (template), Entity Analysis shows hardcoded stats, and Geospatial/Timeline/Network/Report all fall to "coming soon." Only Bulk Ingestion, Settings (partial), and Exit do real work — and Bulk Ingestion is broken (C1). | `cli.py:202, 236, 268, 621` | Canonical-path audit. |

### MEDIUM — environment and dependency gaps

| # | Finding | Location | Evidence |
|---|---------|----------|----------|
| M1 | **Critical ingestion deps not installed in venv.** PyPDF2, pypdf, langchain, faiss-cpu, psycopg2, xata, upstash/upstash-vector, qstash, anthropic, youtube-transcript-api, pinecone — all absent. Only PyMuPDF, python-docx, beautifulsoup4, openai are present. | `.venv` | Runtime probe: `pip show` for each. |
| M2 | **PyMuPDF and python-docx missing from requirements.txt.** They're imported with try/except guards but not declared as dependencies. | `requirements.txt` | Canonical-path audit. |
| M3 | **Missing env keys.** `UPSTASH_VECTOR_URL` and `PINECONE_API_KEY` absent from `.env` (194 vars present; OPENAI/XATA/DATABASE_URL are set). | `.env` | Runtime probe (booleans only, no values printed). |
| M4 | **`.env` has extensive duplication.** Many keys defined 2–4 times (OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, QSTASH_*, UPSTASH_VECTOR_REST_*, etc.). | `.env` | Canonical-path audit. |

### LOW — non-fatal

| # | Finding | Location |
|---|---------|----------|
| L1 | Charm tools partial: `huh` and `glamour` missing (gum, glow present). cli.py falls back gracefully. | Runtime probe |
| L2 | `index_knowledge_base.py` ignores `--help` and runs immediately — no argparse surface. | Runtime probe |

---

## Source-type coverage matrix

The goal was "literally almost any source." Reality:

| Source type | Handler file | Status | Notes |
|-------------|--------------|--------|-------|
| **PDF** | `processing/document_converter.py` (docling) + `scripts/bulk_folder_ingestion.py` (PyPDF2/PyMuPDF) | WORKING (code) / UNREACHABLE (from CLI) | docling converter is not wired into cli.py; bulk ingestion is broken (C1) |
| **TXT** | `scripts/bulk_folder_ingestion.py` | WORKING (code) / UNREACHABLE | Same — blocked by C1 |
| **DOCX** | `scripts/bulk_folder_ingestion.py` (python-docx) | WORKING (code) / UNREACHABLE | Blocked by C1 |
| **MD** | `scripts/bulk_folder_ingestion.py` + `lib/kb/knowledge_base.py` | WORKING (code) / UNREACHABLE | Blocked by C1 |
| **RTF** | `scripts/bulk_folder_ingestion.py` (basic text extraction) | WORKING (code) / UNREACHABLE | Blocked by C1 |
| **.doc (legacy)** | — | **BROKEN** | Listed in SUPPORTED_EXTENSIONS, no handler (H2) |
| **CSV** | `lib/connectors/ultraterrestrial_db.py`, `scripts/csv_integration.py`, `scripts/bulk-import.py` | WORKING | Migration tools only (CSV → Postgres), not general ingestion |
| **HTML / web URL** | `processing/web_content_processor.py` | WORKING (code) / UNREACHABLE from cli.py | Reachable from `main*.py` entry points, but those are broken (C3) |
| **YouTube** | `lib/youtube_handler.py` (3-tier: yt-dlp → transcript-api → Whisper) | WORKING (code) / UNREACHABLE from cli.py | Reachable from `main*.py`, but those are broken (C3). `youtube-transcript-api` not installed in venv (M1) |
| **JSON** | — | PARTIAL | YouTube metadata only; no general JSON ingestion |
| **Images (OCR)** | — | **NOT IMPLEMENTED** | Web processor downloads images but no OCR/tesseract |
| **Audio (transcription)** | `lib/youtube_handler.py` (Whisper) | PARTIAL | YouTube audio only; no generic audio file handler |
| **RSS / Atom feeds** | — | **NOT IMPLEMENTED** | No feedparser, no handlers |
| **Email** | — | **NOT IMPLEMENTED** | No IMAP/SMTP handlers |
| **API endpoints** | — | **NOT IMPLEMENTED** | No generic API fetcher |
| **Raw SQL** | `scripts/direct-sql-import.py` | PARTIAL | SQL generation from CSV, not direct SQL ingestion |

**Verdict:** 5 source types have working handler code (PDF, TXT, DOCX, MD, RTF) but none are reachable from the CLI. 2 more (web, YouTube) have working handlers but are only reachable from broken entry points. 5 source types are entirely missing.

---

## Entry-point sprawl

`pyproject.toml` declares `disclosure-rag = "main:main"` as the official CLI entry. The reality:

| File | Purpose | Ingests? | Status | Verdict |
|------|---------|----------|--------|---------|
| `main.py` (24KB) | Enhanced processor, Upstash integration | Yes (YouTube, web, files) | **BROKEN** (qstash import) | Declared official entry — but dead |
| `main_enhanced.py` (37KB) | Clean async architecture, Mem0/CocoIndex/Entity | Yes | **BROKEN** (anthropic import) | Most sophisticated; best canonical candidate |
| `main_fixed.py` (29KB) | Sync fixes for main_enhanced | Yes | **BROKEN** (anthropic import) | Duplicate |
| `main_unified.py` (16KB) | Multi-backend vector storage | Yes | **BROKEN** (anthropic import) | Duplicate |
| `cli.py` (21KB) | Charm interactive menu | Bulk only (broken) | Loads, but ingestion dead | Separate interface; 70% mock |
| `index_knowledge_base.py` (14KB) | Indexes existing KB files | No (indexing only) | Runs | Utility |
| `process_entities.py` (8KB) | Entity extraction post-processing | No | Runs | Utility |
| `api_server.py` (21KB) | FastAPI server | `/rag/index` endpoint | Unknown (not probed) | API interface |
| `streamlit_app.py` (40KB) | Streamlit dashboard | Bulk import UI | Unknown | Web UI |
| `knowledge_base_ui.py` (31KB) | Alt Streamlit dashboard | Bulk import UI | Unknown | Web UI — redundant with streamlit_app.py |

**Recommendation:** `main_enhanced.py` is the strongest canonical candidate (clean async architecture, proper separation). But it and all its siblings need their import chains fixed first. `main.py`, `main_fixed.py`, and `main_unified.py` should be consolidated into one.

---

## Root-cause analysis

The system has **three disconnected layers**, none of which talk to each other:

1. **Loader layer** (working code, unreachable): `processing/document_converter.py`, `processing/web_content_processor.py`, `lib/youtube_handler.py` — these genuinely extract content from PDFs, web pages, and YouTube.
2. **Ingestion orchestration layer** (broken): `scripts/bulk_folder_ingestion.py` — supposed to tie loaders to storage backends, but imports a phantom `TripleRAGIntegration` class.
3. **Interface layer** (mostly mock): `cli.py` (interactive menu, 70% mock), `main*.py` (4 competing entry points, all broken by missing deps), `streamlit_app.py` / `knowledge_base_ui.py` (2 redundant dashboards).

The `TripleRAGIntegration` class was either never committed or was deleted. `lib/adapters/dual_rag_adapter.py` contains a `TripleRAGAdapter` class (different name, different location) that may have been intended as the replacement — the import was never updated.

---

## Recommended fix plan (ordered)

### Phase 0 — unblock (makes ingestion importable)
1. **Fix C1:** Replace `from integrations.triple_rag_integration import TripleRAGIntegration` with the actual existing adapter. Either:
   - Import `TripleRAGAdapter` from `lib/adapters/dual_rag_adapter.py` and adapt the call site, OR
   - Create a thin `lib/integrations/triple_rag_integration.py` shim that re-exports `TripleRAGAdapter as TripleRAGIntegration` for backward compat.
2. **Fix C2:** Update `cli.py:577–585` `DocumentFile` construction to match the dataclass signature (`file_path`, `filename`, `size_bytes`, `file_hash`, `last_modified`).
3. **Fix C3 (deps):** `pip install qstash anthropic` in the venv; add to `requirements.txt`. Add `PyMuPDF` and `python-docx` to `requirements.txt` (M2).

### Phase 1 — wire loaders to CLI
4. Wire `processing/document_converter.py` (docling PDF) into the bulk ingestion path as the preferred PDF extractor (replacing the PyPDF2/PyMuPDF branch).
5. Wire `processing/web_content_processor.py` into the CLI as a "Ingest from URL" menu option.
6. Wire `lib/youtube_handler.py` into the CLI as a "Ingest from YouTube URL" menu option. Install `youtube-transcript-api`.

### Phase 2 — consolidate entry points
7. Merge `main_enhanced.py` into `main.py` (or vice versa) as the single canonical entry. Update `pyproject.toml`. Archive `main_fixed.py` and `main_unified.py`.
8. Replace mock CLI methods (`_mock_search_results`, `_mock_agent_response`, `_display_entity_analysis`) with real calls or remove the menu options.

### Phase 3 — expand source coverage
9. Add RSS/Atom feed ingestion (`feedparser`).
10. Add OCR for images (`pytesseract` + tesseract system dep).
11. Add generic audio transcription (`faster-whisper` for non-YouTube audio files).
12. Add email ingestion (IMAP via `imaplib`).
13. Add generic API endpoint ingestion (fetch + parse JSON/XML).
14. Remove `.doc` from `SUPPORTED_EXTENSIONS` or implement a handler (H2).

### Phase 4 — cleanup
15. Deduplicate `.env` (M4).
16. Consolidate `streamlit_app.py` and `knowledge_base_ui.py` into one dashboard.
17. Remove the misleading 5-backend summary string from `cli.py` (H1) until backends are actually wired.

---

## What was NOT probed

- `api_server.py` `/rag/index` endpoint (FastAPI server not started)
- `streamlit_app.py` and `knowledge_base_ui.py` bulk import UIs (Streamlit not started)
- `activate_agno.py` (AGNO agent system, separate from ingestion)
- Whether `lib/adapters/dual_rag_adapter.py::TripleRAGAdapter` is a drop-in replacement for the phantom `TripleRAGIntegration` (signature comparison not done)

These are candidates for a follow-up audit if the fix plan proceeds.
