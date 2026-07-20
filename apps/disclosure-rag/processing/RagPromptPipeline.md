# RagPromptPipeline

**Last Updated:** 2026-07-19T00:55:00-05:00  
**Status:** Wired into disclosure-rag processing  
**Location:** `apps/disclosure-rag/processing/rag_prompt_pipeline.py`

---

## Purpose

Connect the `packages/ai/prompts` registry (RAG / NER / document-processing templates) to live disclosure-rag ingestion paths so documents are classified, chunked as Evidence, entity-extracted, and validated before indexing.

---

## Architecture

```
source text
  → document_classification
  → disclosure.content_analysis
  → rag_ingestion                 (Evidence chunks)
  → disclosure.ner (per chunk)
  → validation
  → embeddable_texts              (safe_for_rag_index only)
```

Prompt resolution: `lib/prompt_loader.py` → `packages/ai/prompts` (not the removed `packages/prompts` path).

---

## Key Modules

| Module | Role |
|--------|------|
| `rag_prompt_pipeline.py` | Orchestrator + LLM JSON calls |
| `content_analysis.py` | `process_for_rag()` / `analyze_content_with_rag_pipeline()` |
| `web_content_processor.py` | Attaches `rag_pipeline` + `embeddable_texts` on URL process |
| `lib/knowledge_base_service.py` | Writes `*_rag_pipeline.json` for web ingest |
| `lib/youtube.py` | Writes YouTube `*_rag_pipeline.json` |
| `main.py` | File ingest runs pipeline before KB/upload |
| `enhanced_content_analysis.py` | Includes pipeline in comprehensive results |

---

## Data Flow

**Inputs:** `source_text`, `provenance`, optional `filename_hint` / `content_type_override`  
**Outputs (`RagPipelineResult.to_dict()`):**

- `status`: `ok` | `hold` | `rejected` | `error`
- `classification`, `analysis`, `ingestion`, `chunks`, `ner_results`
- `embeddable_texts`: Evidence-only strings for vector upload
- `metadata.prompts_used`, integrity / recommendation fields

**Env knobs:**

| Variable | Default |
|----------|---------|
| `PROMPTS_DIR` | auto → `packages/ai/prompts` |
| `RAG_PIPELINE_PROVIDER` | anthropic-then-openai |
| `RAG_PIPELINE_MAX_NER_CHUNKS` | `8` |
| `RAG_PIPELINE_MAX_SOURCE_CHARS` | `24000` |
| `RAG_PIPELINE_CHUNK_TOKENS` | `512` |
| `RAG_PIPELINE_ANTHROPIC_MODEL` | `claude-3-5-sonnet-20241022` |
| `RAG_PIPELINE_OPENAI_MODEL` | `gpt-4o-mini` |

---

## Usage

```python
from processing.rag_prompt_pipeline import process_document_for_rag
from processing.content_analysis import ContentAnalysisEngine

result = process_document_for_rag(text, provenance="https://example.com/doc")
# or
result = ContentAnalysisEngine().process_for_rag(text, provenance="file.pdf")
```

Smoke (no API keys):

```bash
cd apps/disclosure-rag
python -m pytest tests/test_rag_prompt_pipeline_wiring.py -q
```

---

## Constraints

- Never embed agent Inference (ADR-0001). Chunk bodies are source Evidence only.
- Pipeline failures are non-fatal in web/YouTube/file paths where wrapped — legacy analysis still runs.
- Wire enum `PERSONNEL` remains; prompts map KeyFigure → PERSONNEL.
