"""
Adapters for different RAG backends
"""

from .dual_rag_adapter import (
    TripleRAGAdapter,
    triple_rag_adapter,
    dual_rag_adapter,    # Backward compatibility
    quad_rag_adapter,    # Backward compatibility
    search,
    index_document,
    get_adapter_status
)

# Backward compatibility
QuadRAGAdapter = TripleRAGAdapter
DualRAGAdapter = TripleRAGAdapter

__all__ = [
    'TripleRAGAdapter',  # Primary class
    'QuadRAGAdapter',    # Backward compatibility
    'DualRAGAdapter',    # Backward compatibility
    'triple_rag_adapter',
    'quad_rag_adapter',
    'dual_rag_adapter',
    'search',
    'index_document',
    'get_adapter_status'
]