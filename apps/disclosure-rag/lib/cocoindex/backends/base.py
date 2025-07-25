"""
Enhanced CocoIndex Backend Abstraction
Provides unified interface for FAISS and PostgreSQL backends
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
import numpy as np


@dataclass
class Document:
    """Unified document representation across backends"""
    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[np.ndarray] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@dataclass
class SearchResult:
    """Unified search result representation"""
    document: Document
    score: float
    distance: float
    rank: int


@dataclass
class BackendStats:
    """Backend statistics"""
    total_documents: int
    index_size: int
    embedding_dimension: int
    backend_type: str
    last_updated: str
    additional_stats: Dict[str, Any] = None


class BackendInterface(ABC):
    """Abstract base class for all CocoIndex backends"""
    
    @abstractmethod
    async def initialize(self) -> bool:
        """Initialize the backend"""
        pass
    
    @abstractmethod
    async def add_documents(self, documents: List[Document]) -> bool:
        """Add documents to the backend"""
        pass
    
    @abstractmethod
    async def search(self, 
                    query: str, 
                    top_k: int = 5,
                    threshold: Optional[float] = None) -> List[SearchResult]:
        """Search for documents"""
        pass
    
    @abstractmethod
    async def update_document(self, doc_id: str, document: Document) -> bool:
        """Update an existing document"""
        pass
    
    @abstractmethod
    async def delete_document(self, doc_id: str) -> bool:
        """Delete a document"""
        pass
    
    @abstractmethod
    async def get_document(self, doc_id: str) -> Optional[Document]:
        """Get a document by ID"""
        pass
    
    @abstractmethod
    async def list_documents(self, 
                            offset: int = 0, 
                            limit: int = 100) -> List[Document]:
        """List documents with pagination"""
        pass
    
    @abstractmethod
    async def batch_search(self, 
                          queries: List[str], 
                          top_k: int = 5) -> List[List[SearchResult]]:
        """Perform batch search"""
        pass
    
    @abstractmethod
    async def clear_index(self) -> bool:
        """Clear all documents"""
        pass
    
    @abstractmethod
    async def get_stats(self) -> BackendStats:
        """Get backend statistics"""
        pass
    
    @abstractmethod
    async def backup(self, path: str) -> bool:
        """Backup the index"""
        pass
    
    @abstractmethod
    async def restore(self, path: str) -> bool:
        """Restore the index from backup"""
        pass
    
    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """Check backend health"""
        pass


class BackendFactory:
    """Factory for creating backend instances"""
    
    _backends = {}
    
    @classmethod
    def register_backend(cls, name: str, backend_class):
        """Register a backend implementation"""
        cls._backends[name] = backend_class
    
    @classmethod
    def create_backend(cls, backend_type: str, **kwargs) -> BackendInterface:
        """Create a backend instance"""
        if backend_type not in cls._backends:
            raise ValueError(f"Unknown backend type: {backend_type}")
        
        return cls._backends[backend_type](**kwargs)
    
    @classmethod
    def list_backends(cls) -> List[str]:
        """List available backend types"""
        return list(cls._backends.keys())


# Utility functions for backend operations
async def migrate_documents(source_backend: BackendInterface, 
                          target_backend: BackendInterface,
                          batch_size: int = 100) -> bool:
    """Migrate documents from one backend to another"""
    try:
        # Get all documents from source
        offset = 0
        total_migrated = 0
        
        while True:
            documents = await source_backend.list_documents(offset=offset, limit=batch_size)
            
            if not documents:
                break
            
            # Add to target backend
            success = await target_backend.add_documents(documents)
            if not success:
                return False
            
            total_migrated += len(documents)
            offset += batch_size
        
        print(f"Successfully migrated {total_migrated} documents")
        return True
        
    except Exception as e:
        print(f"Migration failed: {e}")
        return False


async def sync_backends(primary: BackendInterface, 
                       secondary: BackendInterface) -> bool:
    """Synchronize two backends"""
    try:
        # Get stats from both backends
        primary_stats = await primary.get_stats()
        secondary_stats = await secondary.get_stats()
        
        # If secondary is empty or outdated, sync from primary
        if (secondary_stats.total_documents == 0 or 
            secondary_stats.last_updated < primary_stats.last_updated):
            
            return await migrate_documents(primary, secondary)
        
        return True
        
    except Exception as e:
        print(f"Sync failed: {e}")
        return False