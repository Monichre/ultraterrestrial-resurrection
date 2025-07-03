"""
Adapters for different RAG backends
"""

from .dual_rag_adapter import (
    QuadRAGAdapter,
    quad_rag_adapter,
    triple_rag_adapter,  # Backward compatibility
    dual_rag_adapter,    # Backward compatibility
    search,
    index_document,
    get_adapter_status
)

# Backward compatibility
TripleRAGAdapter = QuadRAGAdapter
DualRAGAdapter = QuadRAGAdapter

__all__ = [
    'QuadRAGAdapter',
    'TripleRAGAdapter',  # Backward compatibility
    'DualRAGAdapter',    # Backward compatibility
    'quad_rag_adapter',
    'triple_rag_adapter',
    'dual_rag_adapter',
    'search',
    'index_document',
    'get_adapter_status'
]