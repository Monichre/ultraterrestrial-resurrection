"""Knowledge-base archive package (CRUD, service, root path).

Vector retrieve (`KnowledgeBase`) stays a direct submodule import so ingest
paths do not require FAISS/Agno. Layer map:
apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md
"""

from .kb_root import ENV_VAR, kb_root, relativize, sources_root
from .knowledge_base_crud import Document, KnowledgeBaseCRUD
from .knowledge_base_service import (
    KnowledgeBaseService,
    add_to_knowledge_base,
    kb_service,
    process_web_url_enhanced,
    process_youtube_url_enhanced,
)

__all__ = [
    "ENV_VAR",
    "Document",
    "KnowledgeBaseCRUD",
    "KnowledgeBaseService",
    "add_to_knowledge_base",
    "kb_root",
    "kb_service",
    "process_web_url_enhanced",
    "process_youtube_url_enhanced",
    "relativize",
    "sources_root",
]
