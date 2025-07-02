"""
Adapters for different RAG backends
"""

from .dual_rag_adapter import (
    DualRAGAdapter,
    dual_rag_adapter,
    search,
    index_document,
    get_adapter_status
)

__all__ = [
    'DualRAGAdapter',
    'dual_rag_adapter',
    'search',
    'index_document',
    'get_adapter_status'
]