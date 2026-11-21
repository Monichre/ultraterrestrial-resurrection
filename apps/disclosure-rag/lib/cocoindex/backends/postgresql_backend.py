"""
PostgreSQL Backend for Enhanced CocoIndex
Uses pgvector for vector operations and PostgreSQL for document storage
"""

import os
import json
import logging
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import numpy as np
import asyncpg
from sentence_transformers import SentenceTransformer

from .base import BackendInterface, Document, SearchResult, BackendStats


logger = logging.getLogger(__name__)


class PostgreSQLBackend(BackendInterface):
    """PostgreSQL + pgvector backend for database-backed vector operations"""
    
    def __init__(self, 
                 connection_string: str,
                 table_name: str = "enhanced_cocoindex_documents",
                 model_name: str = "all-MiniLM-L6-v2",
                 embedding_dimension: int = 384):
        """
        Initialize PostgreSQL backend
        
        Args:
            connection_string: PostgreSQL connection string
            table_name: Name of the table to store documents
            model_name: Sentence transformer model name
            embedding_dimension: Dimension of embeddings
        """
        self.connection_string = connection_string
        self.table_name = table_name
        self.model = SentenceTransformer(model_name)
        self.embedding_dimension = embedding_dimension
        self.pool: Optional[asyncpg.Pool] = None
        
        # Performance tracking
        self.stats = {
            'searches': 0,
            'additions': 0,
            'updates': 0,
            'deletions': 0,
            'last_operation': None
        }
    
    async def initialize(self) -> bool:
        """Initialize PostgreSQL backend with connection pool and table creation"""
        try:
            # Create connection pool
            self.pool = await asyncpg.create_pool(
                self.connection_string,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            
            # Create table and enable pgvector extension
            await self._create_table()
            
            logger.info(f"PostgreSQL backend initialized with table {self.table_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize PostgreSQL backend: {e}")
            return False
    
    async def _create_table(self):
        """Create the documents table with pgvector support"""
        async with self.pool.acquire() as conn:
            # Enable pgvector extension
            await conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
            
            # Create table
            create_table_sql = f"""
            CREATE TABLE IF NOT EXISTS {self.table_name} (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                metadata JSONB DEFAULT '{{}}',
                embedding vector({self.embedding_dimension}),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
            """
            await conn.execute(create_table_sql)
            
            # Create indexes for better performance
            await conn.execute(f"CREATE INDEX IF NOT EXISTS {self.table_name}_embedding_idx ON {self.table_name} USING ivfflat (embedding vector_l2_ops)")
            await conn.execute(f"CREATE INDEX IF NOT EXISTS {self.table_name}_created_at_idx ON {self.table_name} (created_at)")
            await conn.execute(f"CREATE INDEX IF NOT EXISTS {self.table_name}_metadata_idx ON {self.table_name} USING gin (metadata)")
    
    def _document_from_row(self, row) -> Document:
        """Convert database row to Document object"""
        return Document(
            id=row['id'],
            content=row['content'],
            metadata=row['metadata'] or {},
            embedding=np.array(row['embedding']) if row['embedding'] else None,
            created_at=row['created_at'].isoformat() if row['created_at'] else None,
            updated_at=row['updated_at'].isoformat() if row['updated_at'] else None
        )
    
    async def add_documents(self, documents: List[Document]) -> bool:
        """Add documents to PostgreSQL"""
        try:
            if not documents:
                return True
            
            # Generate embeddings for documents that don't have them
            for doc in documents:
                if doc.embedding is None:
                    doc.embedding = self.model.encode([doc.content], convert_to_numpy=True)[0]
            
            # Prepare data for insertion
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    for doc in documents:
                        await conn.execute(f"""
                            INSERT INTO {self.table_name} (id, content, metadata, embedding, created_at, updated_at)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            ON CONFLICT (id) DO UPDATE SET
                                content = EXCLUDED.content,
                                metadata = EXCLUDED.metadata,
                                embedding = EXCLUDED.embedding,
                                updated_at = EXCLUDED.updated_at
                        """, 
                        doc.id, 
                        doc.content, 
                        json.dumps(doc.metadata),
                        doc.embedding.tolist(),
                        datetime.fromisoformat(doc.created_at) if doc.created_at else datetime.now(),
                        datetime.fromisoformat(doc.updated_at) if doc.updated_at else datetime.now()
                        )
            
            # Update stats
            self.stats['additions'] += len(documents)
            self.stats['last_operation'] = datetime.now().isoformat()
            
            logger.info(f"Added {len(documents)} documents to PostgreSQL")
            return True
            
        except Exception as e:
            logger.error(f"Error adding documents to PostgreSQL: {e}")
            return False
    
    async def search(self, 
                    query: str, 
                    top_k: int = 5,
                    threshold: Optional[float] = None) -> List[SearchResult]:
        """Search for documents using pgvector similarity"""
        try:
            # Generate query embedding
            query_embedding = self.model.encode([query], convert_to_numpy=True)[0]
            
            # Perform vector similarity search
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(f"""
                    SELECT id, content, metadata, embedding, created_at, updated_at,
                           embedding <-> $1 as distance
                    FROM {self.table_name}
                    ORDER BY embedding <-> $1
                    LIMIT $2
                """, query_embedding.tolist(), top_k)
            
            # Convert to SearchResult objects
            results = []
            for rank, row in enumerate(rows):
                distance = float(row['distance'])
                similarity = 1 / (1 + distance)
                
                if threshold and similarity < threshold:
                    continue
                
                document = self._document_from_row(row)
                results.append(SearchResult(
                    document=document,
                    score=similarity,
                    distance=distance,
                    rank=rank + 1
                ))
            
            # Update stats
            self.stats['searches'] += 1
            self.stats['last_operation'] = datetime.now().isoformat()
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching PostgreSQL: {e}")
            return []
    
    async def batch_search(self, 
                          queries: List[str], 
                          top_k: int = 5) -> List[List[SearchResult]]:
        """Perform batch search"""
        # For now, perform sequential searches
        # This could be optimized with parallel execution
        results = []
        for query in queries:
            query_results = await self.search(query, top_k)
            results.append(query_results)
        
        return results
    
    async def update_document(self, doc_id: str, document: Document) -> bool:
        """Update an existing document"""
        try:
            # Generate embedding if not provided
            if document.embedding is None:
                document.embedding = self.model.encode([document.content], convert_to_numpy=True)[0]
            
            async with self.pool.acquire() as conn:
                result = await conn.execute(f"""
                    UPDATE {self.table_name}
                    SET content = $1, metadata = $2, embedding = $3, updated_at = $4
                    WHERE id = $5
                """, 
                document.content,
                json.dumps(document.metadata),
                document.embedding.tolist(),
                datetime.now(),
                doc_id
                )
            
            if result == "UPDATE 0":
                logger.error(f"Document {doc_id} not found for update")
                return False
            
            # Update stats
            self.stats['updates'] += 1
            self.stats['last_operation'] = datetime.now().isoformat()
            
            logger.info(f"Updated document {doc_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating document: {e}")
            return False
    
    async def delete_document(self, doc_id: str) -> bool:
        """Delete a document"""
        try:
            async with self.pool.acquire() as conn:
                result = await conn.execute(f"DELETE FROM {self.table_name} WHERE id = $1", doc_id)
            
            if result == "DELETE 0":
                logger.error(f"Document {doc_id} not found for deletion")
                return False
            
            # Update stats
            self.stats['deletions'] += 1
            self.stats['last_operation'] = datetime.now().isoformat()
            
            logger.info(f"Deleted document {doc_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            return False
    
    async def get_document(self, doc_id: str) -> Optional[Document]:
        """Get a document by ID"""
        try:
            async with self.pool.acquire() as conn:
                row = await conn.fetchrow(f"""
                    SELECT id, content, metadata, embedding, created_at, updated_at
                    FROM {self.table_name}
                    WHERE id = $1
                """, doc_id)
            
            if row:
                return self._document_from_row(row)
            return None
            
        except Exception as e:
            logger.error(f"Error getting document: {e}")
            return None
    
    async def list_documents(self, 
                            offset: int = 0, 
                            limit: int = 100) -> List[Document]:
        """List documents with pagination"""
        try:
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(f"""
                    SELECT id, content, metadata, embedding, created_at, updated_at
                    FROM {self.table_name}
                    ORDER BY created_at DESC
                    LIMIT $1 OFFSET $2
                """, limit, offset)
            
            return [self._document_from_row(row) for row in rows]
            
        except Exception as e:
            logger.error(f"Error listing documents: {e}")
            return []
    
    async def clear_index(self) -> bool:
        """Clear all documents"""
        try:
            async with self.pool.acquire() as conn:
                await conn.execute(f"DELETE FROM {self.table_name}")
            
            # Reset stats
            self.stats = {
                'searches': 0,
                'additions': 0,
                'updates': 0,
                'deletions': 0,
                'last_operation': datetime.now().isoformat()
            }
            
            logger.info("Cleared PostgreSQL index")
            return True
            
        except Exception as e:
            logger.error(f"Error clearing index: {e}")
            return False
    
    async def get_stats(self) -> BackendStats:
        """Get backend statistics"""
        try:
            async with self.pool.acquire() as conn:
                row = await conn.fetchrow(f"SELECT COUNT(*) as total FROM {self.table_name}")
                total_documents = row['total'] if row else 0
            
            return BackendStats(
                total_documents=total_documents,
                index_size=total_documents,  # In PostgreSQL, index size = document count
                embedding_dimension=self.embedding_dimension,
                backend_type="postgresql",
                last_updated=self.stats.get('last_operation', 'Never'),
                additional_stats={
                    'searches': self.stats.get('searches', 0),
                    'additions': self.stats.get('additions', 0),
                    'updates': self.stats.get('updates', 0),
                    'deletions': self.stats.get('deletions', 0),
                    'table_name': self.table_name,
                    'connection_pool_size': len(self.pool._queue) if self.pool else 0
                }
            )
            
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return BackendStats(
                total_documents=0,
                index_size=0,
                embedding_dimension=self.embedding_dimension,
                backend_type="postgresql",
                last_updated="Error"
            )
    
    async def backup(self, path: str) -> bool:
        """Backup PostgreSQL data to JSON file"""
        try:
            # Get all documents
            documents = await self.list_documents(limit=1000000)  # Get all
            
            # Convert to serializable format
            backup_data = {
                'backup_time': datetime.now().isoformat(),
                'backend_type': 'postgresql',
                'table_name': self.table_name,
                'total_documents': len(documents),
                'documents': []
            }
            
            for doc in documents:
                doc_data = {
                    'id': doc.id,
                    'content': doc.content,
                    'metadata': doc.metadata,
                    'created_at': doc.created_at,
                    'updated_at': doc.updated_at
                }
                if doc.embedding is not None:
                    doc_data['embedding'] = doc.embedding.tolist()
                backup_data['documents'].append(doc_data)
            
            # Save to JSON file
            import json
            from pathlib import Path
            backup_file = Path(path) / f"postgresql_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            backup_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(backup_file, 'w') as f:
                json.dump(backup_data, f, indent=2)
            
            logger.info(f"PostgreSQL backup created at {backup_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating backup: {e}")
            return False
    
    async def restore(self, path: str) -> bool:
        """Restore PostgreSQL data from JSON backup"""
        try:
            import json
            from pathlib import Path
            
            backup_file = Path(path)
            if not backup_file.exists():
                logger.error(f"Backup file {backup_file} does not exist")
                return False
            
            with open(backup_file, 'r') as f:
                backup_data = json.load(f)
            
            # Clear existing data
            await self.clear_index()
            
            # Restore documents
            documents = []
            for doc_data in backup_data['documents']:
                doc = Document(
                    id=doc_data['id'],
                    content=doc_data['content'],
                    metadata=doc_data['metadata'],
                    created_at=doc_data.get('created_at'),
                    updated_at=doc_data.get('updated_at')
                )
                if 'embedding' in doc_data:
                    doc.embedding = np.array(doc_data['embedding'])
                documents.append(doc)
            
            # Add documents in batches
            batch_size = 100
            for i in range(0, len(documents), batch_size):
                batch = documents[i:i + batch_size]
                await self.add_documents(batch)
            
            logger.info(f"PostgreSQL restore completed from {backup_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error restoring backup: {e}")
            return False
    
    async def health_check(self) -> Dict[str, Any]:
        """Check PostgreSQL backend health"""
        try:
            status = {
                'status': 'healthy',
                'backend_type': 'postgresql',
                'table_name': self.table_name,
                'pool_connected': self.pool is not None,
                'last_operation': self.stats.get('last_operation', 'Never'),
                'issues': []
            }
            
            # Test database connection
            if self.pool:
                async with self.pool.acquire() as conn:
                    result = await conn.fetchval("SELECT 1")
                    if result != 1:
                        status['issues'].append('Database connection test failed')
                        status['status'] = 'error'
                    
                    # Check if table exists
                    table_exists = await conn.fetchval("""
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE table_name = $1
                        )
                    """, self.table_name)
                    
                    if not table_exists:
                        status['issues'].append(f'Table {self.table_name} does not exist')
                        status['status'] = 'error'
                    
                    # Check pgvector extension
                    pgvector_exists = await conn.fetchval("""
                        SELECT EXISTS (
                            SELECT FROM pg_extension 
                            WHERE extname = 'vector'
                        )
                    """)
                    
                    if not pgvector_exists:
                        status['issues'].append('pgvector extension not installed')
                        status['status'] = 'error'
            else:
                status['issues'].append('No connection pool available')
                status['status'] = 'error'
            
            return status
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'backend_type': 'postgresql'
            }
    
    async def close(self):
        """Close connection pool"""
        if self.pool:
            await self.pool.close()
            self.pool = None