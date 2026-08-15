"""
Enhanced CocoIndex Package
Provides unified interface for FAISS and PostgreSQL backends with live updates
"""

from .backends.base import BackendInterface, Document, SearchResult, BackendStats, BackendFactory
from .backends.faiss_backend import FAISSBackend
from .backends.postgresql_backend import PostgreSQLBackend
from .live_updates import LiveUpdater, LiveCocoIndex, create_live_cocoindex

# Register backends with factory
BackendFactory.register_backend('faiss', FAISSBackend)
BackendFactory.register_backend('postgresql', PostgreSQLBackend)

__all__ = [
    'BackendInterface',
    'Document', 
    'SearchResult',
    'BackendStats',
    'BackendFactory',
    'FAISSBackend',
    'PostgreSQLBackend',
    'LiveUpdater',
    'LiveCocoIndex',
    'create_live_cocoindex'
]