---
status: live
role: eng
spine: how
updated: 2026-08-16
---

# Knowledge base layers — three modules, three jobs

**Audience:** anyone editing ingest, archive storage, agent retrieval, or the files below.  
**Archive root:** [`packages/knowledge-base/`](packages/knowledge-base/) (override with `DISCLOSURE_RAG_KB_PATH`).

Three similarly named modules are **not interchangeable**. They sit at different layers over the same on-disk archive.

| Module | Class / exports | Role | Persistence |
| --- | --- | --- | --- |
| [`apps/disclosure-rag/lib/kb/knowledge_base.py`](apps/disclosure-rag/lib/kb/knowledge_base.py) | `KnowledgeBase`, `create_kb_retrieval_tool` | In-memory **vector retrieval** (agent / tool read path) | FAISS or Agno vector store |
| [`apps/disclosure-rag/lib/kb/knowledge_base_crud.py`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py) | `Document`, `KnowledgeBaseCRUD` | **Filesystem archive** CRUD (source of truth for stored docs) | Files under `sources/` + [`packages/knowledge-base/metadata/index.json`](packages/knowledge-base/metadata/index.json) |
| [`apps/disclosure-rag/lib/kb/knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) | `KnowledgeBaseService`, `add_to_knowledge_base`, `process_*_enhanced` | **Ingest orchestration** (`dy` / `main.py` workflows) | Calls CRUD; optional Upstash Search / queue |

## Mental model

```
URL / file → knowledge_base_service (orchestrate ingest)
                ↓
         knowledge_base_crud (write / read archive)
                ↓
         packages/knowledge-base on disk

knowledge_base (separate read path):
         load same disk → vector store → agent retrieve
```

This Python pipeline does **not** feed the Next.js mindmap or Prometheus routes. Neon writes are a separate bridge (T-048 H2), not the default path here.

## [`knowledge_base.py`](apps/disclosure-rag/lib/kb/knowledge_base.py) — read-side RAG

- Loads markdown / txt / PDF from `sources/files` and `sources/transcripts`.
- Builds a FAISS (LangChain) or Agno vector store in process memory.
- Public API: `save_vector_store`, `load_vector_store`, `retrieve`; helper `create_kb_retrieval_tool`.
- Callers: agent tooling (e.g. [`apps/disclosure-rag/utils/tools.py`](apps/disclosure-rag/utils/tools.py)), Streamlit UI import path — **not** the live `dy` write path.
- No `Document` model, no `index.json` writes.

## [`knowledge_base_crud.py`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py) — disk source of truth

- Owns path layout: `sources/files|transcripts|web`, `research/`, `metadata/`.
- Content-hash document IDs, sidecar metadata, file-locked atomic `index.json`.
- Public API: `create_document`, `get_document`, `list_documents`, `search_documents`, `update_document`, `delete_document`, `bulk_import`, `export_document`, `get_statistics`.
- Direct callers: Streamlit KB UI, FastAPI ([`apps/disclosure-rag/api_server.py`](apps/disclosure-rag/api_server.py)), sync scripts, and **`KnowledgeBaseService`**.

## [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) — pipeline glue

- Constructs `KnowledgeBaseCRUD()`; does not replace it.
- YouTube / web enhanced workflows: process → format → `kb_crud.create_document` (or YouTube-specific index) → optional Upstash sync / queue.
- Convenience exports used by [`apps/disclosure-rag/main.py`](apps/disclosure-rag/main.py): `add_to_knowledge_base`, `process_youtube_url_enhanced`, `process_web_url_enhanced`.
- Hop index: [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md).

## Rule of thumb

| Intent | Use |
| --- | --- |
| Mutate or query the on-disk archive | [`knowledge_base_crud.py`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py) |
| Run / extend `dy` ingest | [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) |
| Semantic Q&A over a loaded local vector store | [`knowledge_base.py`](apps/disclosure-rag/lib/kb/knowledge_base.py) |

Do not add ingest side effects to `KnowledgeBase`, or vector-store logic to `KnowledgeBaseCRUD`. Keep orchestration in the service.

## Related docs

- [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md) — `dy` hop-by-hop
- [`apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md`](apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md) — router / playlist nesting
- [`apps/disclosure-rag/disclosure-rag-processor/SKILL.md`](apps/disclosure-rag/disclosure-rag-processor/SKILL.md) — processor skill
- [`apps/disclosure-rag/disclosure-rag-processor/references/pipeline-architecture.md`](apps/disclosure-rag/disclosure-rag-processor/references/pipeline-architecture.md) — directory map
