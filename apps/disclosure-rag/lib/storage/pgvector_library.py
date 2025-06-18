#!/usr/bin/env python3
"""
PostgreSQL + pgvector Document Library
Robust document storage with advanced analytical capabilities
"""

import json
import hashlib
import numpy as np
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import os
from pathlib import Path
import logging

# For embeddings
try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

@dataclass
class DocumentRecord:
    """Complete document record for PostgreSQL storage"""
    doc_id: str
    title: str
    content: str
    source_url: Optional[str]
    content_hash: str
    content_type: str
    word_count: int
    char_count: int
    extraction_date: datetime
    tags: List[str]
    entities: Dict[str, Any]
    summary: str
    confidence_score: float
    processing_notes: str
    embedding: Optional[List[float]]

class PGVectorLibrary:
    """
    PostgreSQL + pgvector Document Library
    
    Features:
    - Full PostgreSQL analytical power
    - Vector similarity search with pgvector
    - Advanced querying with SQL + vectors
    - Document clustering and relationship analysis
    - Comprehensive metadata and entity tracking
    - Local embeddings generation
    """
    
    def __init__(self, 
                 db_config: Dict[str, str] = None,
                 embedding_model: str = "all-MiniLM-L6-v2"):
        
        # Database configuration
        self.db_config = db_config or {
            'host': os.getenv('POSTGRES_HOST', 'localhost'),
            'port': os.getenv('POSTGRES_PORT', '5432'),
            'database': os.getenv('POSTGRES_DB', 'ufo_library'),
            'user': os.getenv('POSTGRES_USER', 'postgres'),
            'password': os.getenv('POSTGRES_PASSWORD', 'postgres')
        }
        
        # Initialize embedding model
        self.embedding_model = None
        self.embedding_dim = 384  # Default for all-MiniLM-L6-v2
        
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                self.embedding_model = SentenceTransformer(embedding_model)
                self.embedding_dim = self.embedding_model.get_sentence_embedding_dimension()
                print(f"✅ Loaded embedding model: {embedding_model} (dim: {self.embedding_dim})")
            except Exception as e:
                print(f"⚠️  Failed to load embedding model: {e}")
        
        # Initialize database
        self._init_database()
        
        print(f"📊 PostgreSQL + pgvector library initialized")
        print(f"🔗 Database: {self.db_config['host']}:{self.db_config['port']}/{self.db_config['database']}")
    
    def _get_connection(self):
        """Get database connection"""
        return psycopg2.connect(**self.db_config)
    
    def _init_database(self):
        """Initialize PostgreSQL database with pgvector extension"""
        
        init_sql = f"""
        -- Enable pgvector extension
        CREATE EXTENSION IF NOT EXISTS vector;
        
        -- Main documents table
        CREATE TABLE IF NOT EXISTS documents (
            doc_id VARCHAR(255) PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            source_url TEXT,
            content_hash VARCHAR(64) UNIQUE NOT NULL,
            content_type VARCHAR(50) NOT NULL,
            word_count INTEGER,
            char_count INTEGER,
            extraction_date TIMESTAMP,
            tags TEXT[], -- PostgreSQL array
            entities JSONB, -- Rich JSON queries
            summary TEXT,
            confidence_score REAL,
            processing_notes TEXT,
            embedding vector({self.embedding_dim}), -- pgvector column
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Entities table for structured analysis
        CREATE TABLE IF NOT EXISTS extracted_entities (
            id SERIAL PRIMARY KEY,
            doc_id VARCHAR(255) REFERENCES documents(doc_id),
            entity_type VARCHAR(100),
            entity_name TEXT,
            entity_value TEXT,
            confidence REAL,
            start_position INTEGER,
            end_position INTEGER,
            context TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Tags table with usage tracking
        CREATE TABLE IF NOT EXISTS tags (
            tag_name VARCHAR(255) PRIMARY KEY,
            doc_count INTEGER DEFAULT 0,
            first_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Document relationships
        CREATE TABLE IF NOT EXISTS document_relationships (
            id SERIAL PRIMARY KEY,
            doc_id1 VARCHAR(255) REFERENCES documents(doc_id),
            doc_id2 VARCHAR(255) REFERENCES documents(doc_id),
            relationship_type VARCHAR(100),
            similarity_score REAL,
            shared_entities INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Search analytics
        CREATE TABLE IF NOT EXISTS search_analytics (
            id SERIAL PRIMARY KEY,
            query_text TEXT,
            query_type VARCHAR(50), -- 'semantic', 'keyword', 'hybrid'
            results_count INTEGER,
            response_time_ms INTEGER,
            user_session VARCHAR(255),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Document clusters
        CREATE TABLE IF NOT EXISTS document_clusters (
            id SERIAL PRIMARY KEY,
            cluster_name VARCHAR(255),
            doc_id VARCHAR(255) REFERENCES documents(doc_id),
            cluster_center vector({self.embedding_dim}),
            distance_to_center REAL,
            cluster_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Indexes for performance
        CREATE INDEX IF NOT EXISTS idx_documents_content_hash ON documents(content_hash);
        CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);
        CREATE INDEX IF NOT EXISTS idx_documents_entities ON documents USING GIN(entities);
        CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
        CREATE INDEX IF NOT EXISTS idx_entities_type ON extracted_entities(entity_type);
        CREATE INDEX IF NOT EXISTS idx_entities_name ON extracted_entities(entity_name);
        CREATE INDEX IF NOT EXISTS idx_search_analytics_timestamp ON search_analytics(timestamp);
        
        -- Views for analysis
        CREATE OR REPLACE VIEW document_stats AS
        SELECT 
            content_type,
            COUNT(*) as doc_count,
            AVG(word_count) as avg_words,
            AVG(confidence_score) as avg_confidence,
            MIN(created_at) as first_added,
            MAX(created_at) as last_added
        FROM documents 
        GROUP BY content_type;
        
        CREATE OR REPLACE VIEW entity_frequency AS
        SELECT 
            entity_type,
            entity_name,
            COUNT(*) as frequency,
            AVG(confidence) as avg_confidence,
            COUNT(DISTINCT doc_id) as doc_count
        FROM extracted_entities 
        GROUP BY entity_type, entity_name
        ORDER BY frequency DESC;
        
        CREATE OR REPLACE VIEW tag_analytics AS
        SELECT 
            unnest(tags) as tag,
            COUNT(*) as usage_count,
            AVG(word_count) as avg_doc_length,
            AVG(confidence_score) as avg_confidence
        FROM documents 
        GROUP BY unnest(tags)
        ORDER BY usage_count DESC;
        """
        
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(init_sql)
                    conn.commit()
            print("✅ Database schema initialized")
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            raise
    
    def add_document(self, 
                    content: str,
                    title: str,
                    source_url: Optional[str] = None,
                    content_type: str = "text",
                    tags: List[str] = None,
                    auto_extract: bool = True) -> DocumentRecord:
        """Add document with full PostgreSQL analytics"""
        
        # Generate document metadata
        content_hash = hashlib.sha256(content.encode()).hexdigest()
        doc_id = f"doc_{int(datetime.now().timestamp())}_{content_hash[:8]}"
        
        # Check for duplicates
        existing = self._get_document_by_hash(content_hash)
        if existing:
            print(f"📄 Document already exists: {existing.title}")
            return existing
        
        # Generate embedding
        embedding = None
        if self.embedding_model:
            try:
                embedding_vector = self.embedding_model.encode(content)
                embedding = embedding_vector.tolist()
            except Exception as e:
                print(f"⚠️  Embedding generation failed: {e}")
        
        # Extract entities
        entities = {}
        processing_notes = ""
        if auto_extract:
            try:
                entities = self._extract_entities(content)
                processing_notes = f"Extracted {sum(len(v) if isinstance(v, list) else 0 for v in entities.values())} entities"
            except Exception as e:
                processing_notes = f"Entity extraction failed: {e}"
        
        # Generate summary
        summary = self._generate_summary(content)
        
        # Create document record
        document = DocumentRecord(
            doc_id=doc_id,
            title=title,
            content=content,
            source_url=source_url,
            content_hash=content_hash,
            content_type=content_type,
            word_count=len(content.split()),
            char_count=len(content),
            extraction_date=datetime.now(),
            tags=tags or [],
            entities=entities,
            summary=summary,
            confidence_score=0.85,
            processing_notes=processing_notes,
            embedding=embedding
        )
        
        # Store in database
        self._store_document(document)
        
        # Store individual entities for structured analysis
        if entities:
            self._store_entities(doc_id, entities, content)
        
        # Update tag counts
        if tags:
            self._update_tag_usage(tags)
        
        print(f"✅ Added: {title} ({document.word_count} words, {len(entities)} entity types)")
        return document
    
    def semantic_search(self, 
                       query: str, 
                       limit: int = 10,
                       similarity_threshold: float = 0.7) -> List[Tuple[DocumentRecord, float]]:
        """Semantic search using pgvector similarity"""
        
        if not self.embedding_model:
            raise ValueError("Embedding model not available for semantic search")
        
        start_time = datetime.now()
        
        # Generate query embedding
        query_embedding = self.embedding_model.encode(query).tolist()
        
        # pgvector similarity search
        search_sql = """
        SELECT 
            doc_id, title, content, source_url, content_hash, content_type,
            word_count, char_count, extraction_date, tags, entities, summary,
            confidence_score, processing_notes, embedding,
            1 - (embedding <=> %s::vector) as similarity
        FROM documents 
        WHERE 1 - (embedding <=> %s::vector) > %s
        ORDER BY embedding <=> %s::vector
        LIMIT %s
        """
        
        results = []
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(search_sql, (query_embedding, query_embedding, similarity_threshold, query_embedding, limit))
                    rows = cur.fetchall()
                    
                    for row in rows:
                        doc = DocumentRecord(
                            doc_id=row['doc_id'],
                            title=row['title'],
                            content=row['content'],
                            source_url=row['source_url'],
                            content_hash=row['content_hash'],
                            content_type=row['content_type'],
                            word_count=row['word_count'],
                            char_count=row['char_count'],
                            extraction_date=row['extraction_date'],
                            tags=row['tags'] or [],
                            entities=row['entities'] or {},
                            summary=row['summary'],
                            confidence_score=row['confidence_score'],
                            processing_notes=row['processing_notes'],
                            embedding=None  # Don't return embedding in results
                        )
                        results.append((doc, row['similarity']))
            
            # Log search analytics
            response_time = int((datetime.now() - start_time).total_seconds() * 1000)
            self._log_search("semantic", query, len(results), response_time)
            
        except Exception as e:
            print(f"❌ Semantic search failed: {e}")
        
        return results
    
    def hybrid_search(self,
                     query: str,
                     limit: int = 10,
                     semantic_weight: float = 0.7,
                     keyword_weight: float = 0.3) -> List[Tuple[DocumentRecord, float]]:
        """Hybrid search combining semantic similarity and keyword matching"""
        
        start_time = datetime.now()
        
        # Get semantic results
        semantic_results = self.semantic_search(query, limit * 2)
        
        # Get keyword results using PostgreSQL full-text search
        keyword_sql = """
        SELECT 
            doc_id, title, content, source_url, content_hash, content_type,
            word_count, char_count, extraction_date, tags, entities, summary,
            confidence_score, processing_notes,
            ts_rank(to_tsvector('english', content || ' ' || title), plainto_tsquery('english', %s)) as keyword_score
        FROM documents 
        WHERE to_tsvector('english', content || ' ' || title) @@ plainto_tsquery('english', %s)
        ORDER BY keyword_score DESC
        LIMIT %s
        """
        
        keyword_results = {}
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(keyword_sql, (query, query, limit * 2))
                    rows = cur.fetchall()
                    
                    for row in rows:
                        keyword_results[row['doc_id']] = row['keyword_score']
        except Exception as e:
            print(f"⚠️  Keyword search failed: {e}")
        
        # Combine and rank results
        combined_scores = {}
        
        # Add semantic scores
        for doc, semantic_score in semantic_results:
            combined_scores[doc.doc_id] = {
                'doc': doc,
                'semantic': semantic_score,
                'keyword': keyword_results.get(doc.doc_id, 0.0)
            }
        
        # Add keyword-only results
        for doc_id, keyword_score in keyword_results.items():
            if doc_id not in combined_scores:
                doc = self.get_document(doc_id)
                if doc:
                    combined_scores[doc_id] = {
                        'doc': doc,
                        'semantic': 0.0,
                        'keyword': keyword_score
                    }
        
        # Calculate hybrid scores
        hybrid_results = []
        for doc_id, scores in combined_scores.items():
            hybrid_score = (scores['semantic'] * semantic_weight + 
                          scores['keyword'] * keyword_weight)
            hybrid_results.append((scores['doc'], hybrid_score))
        
        # Sort by hybrid score and limit
        hybrid_results.sort(key=lambda x: x[1], reverse=True)
        final_results = hybrid_results[:limit]
        
        # Log search analytics
        response_time = int((datetime.now() - start_time).total_seconds() * 1000)
        self._log_search("hybrid", query, len(final_results), response_time)
        
        return final_results
    
    def analyze_document_clusters(self, n_clusters: int = 5) -> Dict[str, Any]:
        """Perform document clustering analysis"""
        
        if not self.embedding_model:
            return {"error": "Embedding model required for clustering"}
        
        try:
            from sklearn.cluster import KMeans
            import numpy as np
        except ImportError:
            return {"error": "scikit-learn required for clustering"}
        
        # Get all document embeddings
        embeddings_sql = "SELECT doc_id, title, embedding FROM documents WHERE embedding IS NOT NULL"
        
        docs_data = []
        embeddings = []
        
        with self._get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(embeddings_sql)
                rows = cur.fetchall()
                
                for row in rows:
                    docs_data.append({
                        'doc_id': row['doc_id'],
                        'title': row['title']
                    })
                    embeddings.append(row['embedding'])
        
        if len(embeddings) < n_clusters:
            return {"error": f"Need at least {n_clusters} documents for clustering"}
        
        # Perform clustering
        X = np.array(embeddings)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(X)
        
        # Store cluster results
        self._store_clusters(docs_data, cluster_labels, kmeans.cluster_centers_)
        
        # Analyze clusters
        cluster_analysis = {}
        for i in range(n_clusters):
            cluster_docs = [docs_data[j] for j in range(len(docs_data)) if cluster_labels[j] == i]
            cluster_analysis[f"cluster_{i}"] = {
                "doc_count": len(cluster_docs),
                "documents": cluster_docs[:5],  # Show first 5
                "center": kmeans.cluster_centers_[i].tolist()
            }
        
        return {
            "total_documents": len(docs_data),
            "n_clusters": n_clusters,
            "clusters": cluster_analysis
        }
    
    def get_analytics_dashboard(self) -> Dict[str, Any]:
        """Comprehensive analytics dashboard"""
        
        analytics = {}
        
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    
                    # Document statistics
                    cur.execute("SELECT * FROM document_stats")
                    analytics['document_stats'] = cur.fetchall()
                    
                    # Entity frequency
                    cur.execute("SELECT * FROM entity_frequency LIMIT 20")
                    analytics['top_entities'] = cur.fetchall()
                    
                    # Tag analytics
                    cur.execute("SELECT * FROM tag_analytics LIMIT 15")
                    analytics['tag_usage'] = cur.fetchall()
                    
                    # Search patterns
                    cur.execute("""
                        SELECT 
                            query_type,
                            COUNT(*) as search_count,
                            AVG(results_count) as avg_results,
                            AVG(response_time_ms) as avg_response_time
                        FROM search_analytics 
                        WHERE timestamp > NOW() - INTERVAL '30 days'
                        GROUP BY query_type
                    """)
                    analytics['search_patterns'] = cur.fetchall()
                    
                    # Document relationships
                    cur.execute("""
                        SELECT 
                            relationship_type,
                            COUNT(*) as relationship_count,
                            AVG(similarity_score) as avg_similarity
                        FROM document_relationships 
                        GROUP BY relationship_type
                    """)
                    analytics['relationships'] = cur.fetchall()
                    
                    # Recent activity
                    cur.execute("""
                        SELECT 
                            DATE(created_at) as date,
                            COUNT(*) as docs_added
                        FROM documents 
                        WHERE created_at > NOW() - INTERVAL '30 days'
                        GROUP BY DATE(created_at)
                        ORDER BY date DESC
                    """)
                    analytics['recent_activity'] = cur.fetchall()
                    
        except Exception as e:
            analytics['error'] = str(e)
        
        return analytics
    
    def find_similar_documents(self, doc_id: str, limit: int = 5) -> List[Tuple[DocumentRecord, float]]:
        """Find documents similar to a specific document"""
        
        # Get the document's embedding
        get_embedding_sql = "SELECT embedding FROM documents WHERE doc_id = %s"
        
        with self._get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(get_embedding_sql, (doc_id,))
                result = cur.fetchone()
                
                if not result or not result[0]:
                    return []
                
                doc_embedding = result[0]
        
        # Find similar documents
        similarity_sql = """
        SELECT 
            doc_id, title, content, source_url, content_hash, content_type,
            word_count, char_count, extraction_date, tags, entities, summary,
            confidence_score, processing_notes,
            1 - (embedding <=> %s::vector) as similarity
        FROM documents 
        WHERE doc_id != %s AND embedding IS NOT NULL
        ORDER BY embedding <=> %s::vector
        LIMIT %s
        """
        
        results = []
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(similarity_sql, (doc_embedding, doc_id, doc_embedding, limit))
                    rows = cur.fetchall()
                    
                    for row in rows:
                        doc = DocumentRecord(
                            doc_id=row['doc_id'],
                            title=row['title'],
                            content=row['content'],
                            source_url=row['source_url'],
                            content_hash=row['content_hash'],
                            content_type=row['content_type'],
                            word_count=row['word_count'],
                            char_count=row['char_count'],
                            extraction_date=row['extraction_date'],
                            tags=row['tags'] or [],
                            entities=row['entities'] or {},
                            summary=row['summary'],
                            confidence_score=row['confidence_score'],
                            processing_notes=row['processing_notes'],
                            embedding=None
                        )
                        results.append((doc, row['similarity']))
        except Exception as e:
            print(f"❌ Similar documents search failed: {e}")
        
        return results
    
    def get_document(self, doc_id: str) -> Optional[DocumentRecord]:
        """Get document by ID"""
        
        get_doc_sql = """
        SELECT doc_id, title, content, source_url, content_hash, content_type,
               word_count, char_count, extraction_date, tags, entities, summary,
               confidence_score, processing_notes
        FROM documents WHERE doc_id = %s
        """
        
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(get_doc_sql, (doc_id,))
                    row = cur.fetchone()
                    
                    if row:
                        return DocumentRecord(
                            doc_id=row['doc_id'],
                            title=row['title'],
                            content=row['content'],
                            source_url=row['source_url'],
                            content_hash=row['content_hash'],
                            content_type=row['content_type'],
                            word_count=row['word_count'],
                            char_count=row['char_count'],
                            extraction_date=row['extraction_date'],
                            tags=row['tags'] or [],
                            entities=row['entities'] or {},
                            summary=row['summary'],
                            confidence_score=row['confidence_score'],
                            processing_notes=row['processing_notes'],
                            embedding=None
                        )
        except Exception as e:
            print(f"❌ Error getting document {doc_id}: {e}")
        
        return None
    
    def _store_document(self, document: DocumentRecord):
        """Store document in PostgreSQL"""
        
        insert_sql = """
        INSERT INTO documents (
            doc_id, title, content, source_url, content_hash, content_type,
            word_count, char_count, extraction_date, tags, entities, summary,
            confidence_score, processing_notes, embedding
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        with self._get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(insert_sql, (
                    document.doc_id,
                    document.title,
                    document.content,
                    document.source_url,
                    document.content_hash,
                    document.content_type,
                    document.word_count,
                    document.char_count,
                    document.extraction_date,
                    document.tags,
                    Json(document.entities),
                    document.summary,
                    document.confidence_score,
                    document.processing_notes,
                    document.embedding
                ))
                conn.commit()
    
    def _store_entities(self, doc_id: str, entities: Dict[str, Any], content: str):
        """Store individual entities for structured analysis"""
        
        insert_entity_sql = """
        INSERT INTO extracted_entities (
            doc_id, entity_type, entity_name, entity_value, confidence, context
        ) VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        entity_records = []
        for entity_type, entity_list in entities.items():
            if isinstance(entity_list, list):
                for entity in entity_list:
                    if isinstance(entity, dict):
                        entity_name = entity.get('name', entity.get('title', ''))
                        entity_value = entity.get('value', entity_name)
                        confidence = entity.get('confidence', 0.8)
                        
                        # Find context (surrounding text)
                        context = self._extract_context(content, entity_name)
                        
                        entity_records.append((
                            doc_id, entity_type, entity_name, entity_value, confidence, context
                        ))
        
        if entity_records:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.executemany(insert_entity_sql, entity_records)
                    conn.commit()
    
    def _extract_context(self, content: str, entity_name: str, context_length: int = 100) -> str:
        """Extract context around entity mention"""
        if entity_name in content:
            pos = content.find(entity_name)
            start = max(0, pos - context_length)
            end = min(len(content), pos + len(entity_name) + context_length)
            return content[start:end]
        return ""
    
    def _extract_entities(self, content: str) -> Dict[str, Any]:
        """Extract entities (simplified for demo - use your existing NER)"""
        # This would use your existing entity extraction agent
        ufo_keywords = {
            "personnel": ["elizondo", "mellon", "davis", "puthoff", "bigelow", "greer"],
            "organizations": ["pentagon", "nasa", "navy", "air force", "dod", "aatip"],
            "locations": ["area 51", "nellis", "pentagon", "wright-patterson"],
            "phenomena": ["uap", "ufo", "tic tac", "triangle", "orb", "craft"]
        }
        
        entities = {}
        content_lower = content.lower()
        
        for category, keywords in ufo_keywords.items():
            found = []
            for keyword in keywords:
                if keyword in content_lower:
                    found.append({
                        "name": keyword.title(),
                        "confidence": 0.8,
                        "value": keyword
                    })
            if found:
                entities[category] = found
        
        return entities
    
    def _generate_summary(self, content: str) -> str:
        """Generate document summary"""
        sentences = content.split('. ')
        if len(sentences) <= 2:
            return content[:300] + "..." if len(content) > 300 else content
        
        summary = sentences[0]
        if len(sentences) > 2:
            summary += ". " + sentences[len(sentences)//2]
        
        return summary[:400] + "..." if len(summary) > 400 else summary
    
    def _get_document_by_hash(self, content_hash: str) -> Optional[DocumentRecord]:
        """Check for duplicate documents"""
        check_sql = "SELECT doc_id FROM documents WHERE content_hash = %s"
        
        with self._get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(check_sql, (content_hash,))
                result = cur.fetchone()
                if result:
                    return self.get_document(result[0])
        return None
    
    def _update_tag_usage(self, tags: List[str]):
        """Update tag usage statistics"""
        
        update_sql = """
        INSERT INTO tags (tag_name, doc_count, last_used) 
        VALUES (%s, 1, CURRENT_TIMESTAMP)
        ON CONFLICT (tag_name) 
        DO UPDATE SET 
            doc_count = tags.doc_count + 1,
            last_used = CURRENT_TIMESTAMP
        """
        
        with self._get_connection() as conn:
            with conn.cursor() as cur:
                for tag in tags:
                    cur.execute(update_sql, (tag,))
                conn.commit()
    
    def _log_search(self, query_type: str, query: str, results_count: int, response_time: int):
        """Log search analytics"""
        
        log_sql = """
        INSERT INTO search_analytics (query_text, query_type, results_count, response_time_ms)
        VALUES (%s, %s, %s, %s)
        """
        
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(log_sql, (query, query_type, results_count, response_time))
                    conn.commit()
        except Exception as e:
            print(f"⚠️  Failed to log search: {e}")
    
    def _store_clusters(self, docs_data: List[Dict], cluster_labels: List[int], cluster_centers: np.ndarray):
        """Store clustering results"""
        
        # Clear existing clusters
        with self._get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM document_clusters")
                
                # Store new clusters
                insert_cluster_sql = """
                INSERT INTO document_clusters (cluster_name, doc_id, cluster_center, distance_to_center)
                VALUES (%s, %s, %s, %s)
                """
                
                for i, (doc_data, cluster_label) in enumerate(zip(docs_data, cluster_labels)):
                    cluster_name = f"cluster_{cluster_label}"
                    doc_id = doc_data['doc_id']
                    center = cluster_centers[cluster_label].tolist()
                    distance = 0.0  # Would calculate actual distance
                    
                    cur.execute(insert_cluster_sql, (cluster_name, doc_id, center, distance))
                
                conn.commit()


def setup_pgvector_library():
    """Setup and demo the PGVector library"""
    
    print("🐘 Setting up PostgreSQL + pgvector library...")
    
    # Initialize library
    library = PGVectorLibrary()
    
    # Add sample document
    sample_content = """
    Pentagon Official Confirms Alien Language Exists - In a groundbreaking disclosure, 
    Lue Elizondo discusses underwater UAP activity with large black disc-shaped craft 
    observed moving 450-550 knots underwater near military vessels. The Department of 
    Defense investigation continues with unprecedented transparency. NASA officials 
    including David Spergel provide scientific analysis of the phenomena.
    """
    
    doc = library.add_document(
        content=sample_content,
        title="Pentagon UAP Underwater Activity Disclosure",
        source_url="https://example.com/pentagon-disclosure",
        content_type="web",
        tags=["pentagon", "elizondo", "underwater", "disclosure", "nasa"]
    )
    
    # Test semantic search
    results = library.semantic_search("underwater UAP activity")
    print(f"\n🔍 Semantic search results: {len(results)}")
    
    # Test hybrid search
    hybrid_results = library.hybrid_search("Elizondo Pentagon disclosure")
    print(f"🔍 Hybrid search results: {len(hybrid_results)}")
    
    # Get analytics
    analytics = library.get_analytics_dashboard()
    print(f"\n📊 Analytics: {len(analytics)} categories")
    
    return library


if __name__ == "__main__":
    library = setup_pgvector_library()