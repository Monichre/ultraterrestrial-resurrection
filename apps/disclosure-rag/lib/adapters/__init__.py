"""
Adapters for different RAG backends
"""

from .dual_rag_adapter import (
    TripleRAGAdapter,
    triple_rag_adapter,
    dual_rag_adapter,  # Backward compatibility
    search,
    index_document,
    get_adapter_status
)

# Backward compatibility
DualRAGAdapter = TripleRAGAdapter

__all__ = [
    'TripleRAGAdapter',
    'DualRAGAdapter',  # Backward compatibility
    'triple_rag_adapter',
    'dual_rag_adapter',
    'search',
    'index_document',
    'get_adapter_status'
]