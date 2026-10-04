#!/usr/bin/env python3
"""
Ultraterrestrial PostgreSQL + pgvector Database Connector
Complete Python interface for UFO research database operations
"""

import asyncio
import asyncpg
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Tuple, Union
from datetime import datetime
import json
import os
from pathlib import Path
import csv
from dataclasses import dataclass
import uuid

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
class SearchResult:
    """Search result with metadata"""
    id: str
    entity_type: str
    title: str
    content: str
    similarity_score: float
    metadata: Dict[str, Any]

@dataclass
class AnalyticsResult:
    """Analytics query result"""
    query_name: str
    data: List[Dict[str, Any]]
    total_count: int
    generated_at: datetime

class UltraterrestrialDB:
    """
    Complete database interface for Ultraterrestrial UFO research
    
    Features:
    - CSV data import from your exports
    - Semantic vector search across all entities
    - Advanced analytics and relationship queries
    - Entity co-occurrence analysis
    - Temporal trend analysis
    - Geographic hotspot identification
    - Personnel influence ranking
    """
    
    def __init__(self, connection_string: str = None):
        self.connection_string = connection_string or os.getenv(
            'DATABASE_URL', 
            'postgresql://liamellis@localhost:5432/ultraterrestrial'
        )
        
        # Initialize embedding model
        self.embedding_model = None
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
                print("✅ Loaded sentence-transformers embedding model")
            except Exception as e:
                print(f"⚠️  Failed to load sentence-transformers: {e}")
        
        # OpenAI as fallback
        if not self.embedding_model and HAS_OPENAI:
            try:
                openai.api_key = os.getenv('OPENAI_API_KEY')
                if openai.api_key:
                    print("✅ Using OpenAI embeddings as fallback")
            except Exception as e:
                print(f"⚠️  OpenAI embeddings not available: {e}")
        
        self.pool = None
    
    async def connect(self):
        """Initialize database connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                self.connection_string,
                min_size=2,
                max_size=10,
                command_timeout=60
            )
            print("🐘 Connected to Ultraterrestrial database")
            
            # Verify pgvector extension
            async with self.pool.acquire() as conn:
                result = await conn.fetchval(
                    "SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector')"
                )
                if result:
                    print("✅ pgvector extension verified")
                else:
                    print("⚠️  pgvector extension not found - vector operations will fail")
            
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            raise
    
    async def close(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            print("🔌 Database connection closed")
    
    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """Generate embedding vector for text"""
        if not text or not text.strip():
            return None
        
        if self.embedding_model:
            try:
                embedding = self.embedding_model.encode(text)
                return embedding.tolist()
            except Exception as e:
                print(f"❌ Embedding generation failed: {e}")
                return None
        
        # OpenAI fallback
        if HAS_OPENAI and openai.api_key:
            try:
                response = openai.Embedding.create(
                    input=text,
                    model="text-embedding-3-small"
                )
                return response['data'][0]['embedding']
            except Exception as e:
                print(f"❌ OpenAI embedding failed: {e}")
                return None
        
        return None
    
    async def import_csv_data(self, csv_directory: str = "./exports"):
        """Import all CSV data from your exports directory"""
        csv_dir = Path(csv_directory)
        if not csv_dir.exists():
            raise FileNotFoundError(f"CSV directory not found: {csv_directory}")
        
        print(f"📂 Starting CSV import from {csv_directory}")
        
        # Import order matters due to foreign key constraints
        # Note: Skipping events.csv for now due to rich text content issues
        import_order = [
            'users.csv',
            'personnel.csv', 
            'organizations.csv',
            'locations.csv',
            'topics.csv',
            # 'events.csv',  # Skip for now - rich text content breaks CSV parsing
            'artifacts.csv',
            'documents.csv',
            'testimonies.csv',
            'sightings.csv',
            'organization-members.csv',
            'event-subject-matter-experts.csv',
            'topic-subject-matter-experts.csv',
            'event-topic-subject-matter-experts.csv',
            'topics-testimonies.csv',
            'document-entities.csv',
            'document-chunks.csv',
            'document-processing-tasks.csv',
            'summary-files.csv',
            'user-notes.csv',
            'user-saved-events.csv',
            'user-saved-topics.csv',
            'user-saved-personnel.csv',
            'user-saved-testimonies.csv',
            'user-saved-documents.csv',
            'user-saved-organizations.csv',
            'user-saved-sightings.csv',
            'mindmaps.csv'
        ]
        
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                for csv_file in import_order:
                    csv_path = csv_dir / csv_file
                    if csv_path.exists():
                        await self._import_single_csv(conn, csv_path)
                    else:
                        print(f"⚠️  CSV file not found: {csv_file}")
        
        print("✅ CSV import completed")
    
    async def _import_single_csv(self, conn, csv_path: Path):
        """Import a single CSV file"""
        table_name = csv_path.stem.replace('-', '_')
        print(f"📄 Importing {csv_path.name} -> {table_name}")
        
        try:
            # Read CSV
            df = pd.read_csv(csv_path)
            if df.empty:
                print(f"⚠️  Empty CSV: {csv_path.name}")
                return
            
            # Clean column names
            df.columns = df.columns.str.replace('-', '_')
            
            # Handle special transformations based on table
            df = await self._transform_csv_data(df, table_name)
            
            # Insert data
            await self._insert_dataframe(conn, df, table_name)
            print(f"✅ Imported {len(df)} rows into {table_name}")
            
        except Exception as e:
            print(f"❌ Failed to import {csv_path.name}: {e}")
    
    async def _transform_csv_data(self, df: pd.DataFrame, table_name: str) -> pd.DataFrame:
        """Transform CSV data for database insertion"""
        
        # Convert 'id' column to UUID format if it exists
        if 'id' in df.columns:
            # Convert xata IDs to UUIDs
            df['id'] = df['id'].apply(lambda x: str(uuid.uuid4()) if pd.notna(x) else str(uuid.uuid4()))
        
        # Handle embedding columns
        embedding_columns = [col for col in df.columns if 'embedding' in col.lower()]
        for col in embedding_columns:
            if col in df.columns:
                # Parse embedding arrays from string format
                df[col] = df[col].apply(self._parse_embedding)
        
        # Handle array columns
        array_columns = ['photos', 'photo', 'category', 'file_urls', 'images', 'documentation', 'media', 'diagrams']
        for col in array_columns:
            if col in df.columns:
                df[col] = df[col].apply(self._parse_array)
        
        # Handle JSON columns
        json_columns = ['metadata']
        for col in json_columns:
            if col in df.columns:
                df[col] = df[col].apply(self._parse_json)
        
        # Handle date columns
        date_columns = ['date', 'created_at', 'updated_at', 'date_posted', 'start_date', 'end_date']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Handle foreign key references - keep original IDs for now, convert later if needed
        fk_columns = [col for col in df.columns if col.endswith('_id') or col in ['author', 'organization', 'witness', 'event', 'topic', 'member', 'expert_id']]
        for col in fk_columns:
            if col in df.columns:
                # Keep original IDs - they'll be mapped during actual import
                df[col] = df[col].apply(lambda x: str(x) if pd.notna(x) and x != '' else None)
        
        # Generate embeddings for content-heavy tables
        if table_name in ['personnel', 'documents', 'events', 'topics', 'testimonies', 'artifacts']:
            await self._generate_embeddings_for_df(df, table_name)
        
        return df
    
    def _parse_embedding(self, value) -> Optional[List[float]]:
        """Parse embedding from various formats"""
        if pd.isna(value) or value == '':
            return None
        
        if isinstance(value, str):
            try:
                # Parse JSON array
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [float(x) for x in parsed]
            except:
                pass
        
        return None
    
    def _parse_array(self, value) -> Optional[List[str]]:
        """Parse array from various formats"""
        if pd.isna(value) or value == '' or value == '[]':
            return None
        
        if isinstance(value, list):
            return [str(x) for x in value]
        
        if isinstance(value, str):
            try:
                # Try JSON first
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [str(x) for x in parsed]
            except:
                # Try comma-separated
                if ',' in value:
                    return [x.strip() for x in value.split(',') if x.strip()]
                # Single value
                return [value.strip()] if value.strip() else None
        
        return None
    
    def _parse_json(self, value) -> Dict[str, Any]:
        """Parse JSON column"""
        if pd.isna(value) or value == '':
            return {}
        
        if isinstance(value, str):
            try:
                return json.loads(value)
            except:
                return {}
        
        return {}
    
    async def _generate_embeddings_for_df(self, df: pd.DataFrame, table_name: str):
        """Generate embeddings for dataframe content"""
        if 'embedding' not in df.columns:
            df['embedding'] = None
        
        # Determine content column based on table
        content_col_map = {
            'personnel': ['bio', 'name', 'role'],
            'documents': ['summary', 'title'],
            'events': ['description', 'summary', 'title'],
            'topics': ['summary', 'title', 'name'],
            'testimonies': ['claim', 'summary', 'context'],
            'artifacts': ['description', 'name']
        }
        
        content_cols = content_col_map.get(table_name, [])
        available_cols = [col for col in content_cols if col in df.columns]
        
        if not available_cols:
            return
        
        for idx, row in df.iterrows():
            # Skip if embedding already exists and is valid
            existing_embedding = row.get('embedding')
            if pd.notna(existing_embedding) and existing_embedding != '':
                # Check if it's already a valid list
                if isinstance(existing_embedding, list):
                    continue
                # Check if it's a parseable embedding string
                parsed_embedding = self._parse_embedding(existing_embedding)
                if parsed_embedding:
                    df.at[idx, 'embedding'] = parsed_embedding
                    continue
            
            # Combine content from available columns
            content_parts = []
            for col in available_cols:
                if pd.notna(row[col]) and str(row[col]).strip():
                    content_parts.append(str(row[col]).strip())
            
            if content_parts:
                content = ' '.join(content_parts)
                embedding = self.generate_embedding(content)
                if embedding:
                    df.at[idx, 'embedding'] = embedding
    
    async def _insert_dataframe(self, conn, df: pd.DataFrame, table_name: str):
        """Insert dataframe into database table"""
        if df.empty:
            return
        
        # Get table schema
        columns_info = await conn.fetch("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = $1 AND table_schema = 'public'
            ORDER BY ordinal_position
        """, table_name)
        
        if not columns_info:
            print(f"⚠️  Table {table_name} not found in database")
            return
        
        # Map CSV columns to database columns
        db_columns = {col['column_name']: col for col in columns_info}
        csv_columns = list(df.columns)
        
        # Find matching columns
        matching_columns = []
        for csv_col in csv_columns:
            if csv_col in db_columns:
                matching_columns.append(csv_col)
        
        if not matching_columns:
            print(f"⚠️  No matching columns found for {table_name}")
            return
        
        # Prepare data for insertion
        insert_data = []
        for _, row in df.iterrows():
            row_data = []
            for col in matching_columns:
                value = row[col]
                
                # Handle None/NaN values
                if pd.isna(value) or value == '':
                    row_data.append(None)
                # Handle arrays (PostgreSQL array format)
                elif isinstance(value, list):
                    if value:  # Non-empty list
                        row_data.append(value)
                    else:
                        row_data.append(None)
                # Handle JSON
                elif isinstance(value, dict):
                    row_data.append(json.dumps(value))
                # Handle numeric types
                elif col in ['latitude', 'longitude'] and isinstance(value, str):
                    try:
                        row_data.append(float(value))
                    except (ValueError, TypeError):
                        row_data.append(None)
                # Handle timestamps
                elif col in ['date', 'created_at', 'updated_at', 'date_posted'] and pd.notna(value):
                    if hasattr(value, 'tz_localize'):
                        # Convert timezone-aware to UTC then naive
                        if value.tz is not None:
                            value = value.tz_convert('UTC').tz_localize(None)
                        row_data.append(value)
                    else:
                        row_data.append(value)
                else:
                    row_data.append(value)
            
            insert_data.append(tuple(row_data))
        
        # Build INSERT query
        placeholders = ', '.join([f'${i+1}' for i in range(len(matching_columns))])
        query = f"""
            INSERT INTO {table_name} ({', '.join(matching_columns)})
            VALUES ({placeholders})
            ON CONFLICT (id) DO NOTHING
        """
        
        try:
            await conn.executemany(query, insert_data)
        except Exception as e:
            print(f"❌ Insert failed for {table_name}: {e}")
            # Try without ON CONFLICT for tables without id
            query_simple = f"""
                INSERT INTO {table_name} ({', '.join(matching_columns)})
                VALUES ({placeholders})
            """
            try:
                await conn.executemany(query_simple, insert_data)
            except Exception as e2:
                print(f"❌ Simple insert also failed for {table_name}: {e2}")
    
    async def semantic_search(self, 
                             query: str, 
                             table_name: str = 'documents',
                             limit: int = 10,
                             similarity_threshold: float = 0.5) -> List[SearchResult]:
        """Perform semantic search using vector similarity"""
        
        query_embedding = self.generate_embedding(query)
        if not query_embedding:
            raise ValueError("Could not generate query embedding")
        
        async with self.pool.acquire() as conn:
            # Dynamic query based on table
            content_col_map = {
                'documents': 'COALESCE(title, \'\') || \' \' || COALESCE(summary, \'\')',
                'personnel': 'COALESCE(name, \'\') || \' \' || COALESCE(bio, \'\')',
                'events': 'COALESCE(title, \'\') || \' \' || COALESCE(description, \'\')',
                'topics': 'COALESCE(title, \'\') || \' \' || COALESCE(summary, \'\')',
                'testimonies': 'COALESCE(summary, \'\') || \' \' || COALESCE(claim, \'\')',
                'artifacts': 'COALESCE(name, \'\') || \' \' || COALESCE(description, \'\')'
            }
            
            content_expr = content_col_map.get(table_name, 'COALESCE(title, name, \'\')')
            title_expr = 'title' if table_name != 'personnel' else 'name'
            
            query = f"""
                SELECT 
                    id,
                    {title_expr} as title,
                    {content_expr} as content,
                    1 - (embedding <=> $1::vector) as similarity_score
                FROM {table_name}
                WHERE embedding IS NOT NULL
                AND 1 - (embedding <=> $1::vector) > $2
                ORDER BY embedding <=> $1::vector
                LIMIT $3
            """
            
            results = await conn.fetch(query, query_embedding, similarity_threshold, limit)
            
            return [
                SearchResult(
                    id=str(row['id']),
                    entity_type=table_name,
                    title=row['title'] or '',
                    content=row['content'] or '',
                    similarity_score=float(row['similarity_score']),
                    metadata={}
                )
                for row in results
            ]
    
    async def hybrid_search(self, 
                           query: str,
                           table_name: str = 'documents', 
                           limit: int = 10,
                           semantic_weight: float = 0.7,
                           keyword_weight: float = 0.3) -> List[SearchResult]:
        """Hybrid search combining semantic and keyword search"""
        
        query_embedding = self.generate_embedding(query)
        if not query_embedding:
            # Fallback to keyword-only search
            return await self.keyword_search(query, table_name, limit)
        
        async with self.pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT * FROM hybrid_search($1, $2, $3, $4, $5, $6)
            """, query, query_embedding, table_name, limit, semantic_weight, keyword_weight)
            
            return [
                SearchResult(
                    id=str(row['id']),
                    entity_type=table_name,
                    title=row['title'] or '',
                    content=row['content_preview'] or '',
                    similarity_score=float(row['hybrid_score']),
                    metadata={
                        'semantic_score': float(row['semantic_score']),
                        'keyword_score': float(row['keyword_score'])
                    }
                )
                for row in results
            ]
    
    async def keyword_search(self, 
                            query: str,
                            table_name: str = 'documents',
                            limit: int = 10) -> List[SearchResult]:
        """Full-text keyword search"""
        
        async with self.pool.acquire() as conn:
            # Table-specific content columns
            content_columns = {
                'documents': "COALESCE(title, '') || ' ' || COALESCE(summary, '')",
                'personnel': "COALESCE(name, '') || ' ' || COALESCE(bio, '')",
                'events': "COALESCE(title, '') || ' ' || COALESCE(description, '')",
                'topics': "COALESCE(title, '') || ' ' || COALESCE(summary, '')",
                'testimonies': "COALESCE(summary, '') || ' ' || COALESCE(claim, '')"
            }
            
            content_expr = content_columns.get(table_name, "COALESCE(title, name, '')")
            title_expr = 'title' if table_name != 'personnel' else 'name'
            
            query_sql = f"""
                SELECT 
                    id,
                    {title_expr} as title,
                    {content_expr} as content,
                    ts_rank(to_tsvector('english', {content_expr}), plainto_tsquery('english', $1)) as score
                FROM {table_name}
                WHERE to_tsvector('english', {content_expr}) @@ plainto_tsquery('english', $1)
                ORDER BY score DESC
                LIMIT $2
            """
            
            results = await conn.fetch(query_sql, query, limit)
            
            return [
                SearchResult(
                    id=str(row['id']),
                    entity_type=table_name,
                    title=row['title'] or '',
                    content=row['content'] or '',
                    similarity_score=float(row['score']),
                    metadata={'search_type': 'keyword'}
                )
                for row in results
            ]
    
    async def get_entity_cooccurrence(self, 
                                     entity_name: str = None,
                                     limit: int = 20) -> AnalyticsResult:
        """Get entity co-occurrence analysis"""
        
        async with self.pool.acquire() as conn:
            if entity_name:
                query = """
                    SELECT * FROM entity_cooccurrence
                    WHERE entity1 ILIKE $1 OR entity2 ILIKE $1
                    ORDER BY cooccurrence_count DESC
                    LIMIT $2
                """
                results = await conn.fetch(query, f'%{entity_name}%', limit)
            else:
                query = """
                    SELECT * FROM entity_cooccurrence
                    ORDER BY cooccurrence_count DESC
                    LIMIT $1
                """
                results = await conn.fetch(query, limit)
            
            return AnalyticsResult(
                query_name="entity_cooccurrence",
                data=[dict(row) for row in results],
                total_count=len(results),
                generated_at=datetime.now()
            )
    
    async def get_personnel_influence(self, limit: int = 20) -> AnalyticsResult:
        """Get personnel influence ranking"""
        
        async with self.pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT * FROM personnel_influence
                ORDER BY influence_score DESC
                LIMIT $1
            """, limit)
            
            return AnalyticsResult(
                query_name="personnel_influence",
                data=[dict(row) for row in results],
                total_count=len(results),
                generated_at=datetime.now()
            )
    
    async def get_disclosure_timeline(self) -> AnalyticsResult:
        """Get temporal disclosure analysis"""
        
        async with self.pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT * FROM disclosure_timeline
                ORDER BY year
            """)
            
            return AnalyticsResult(
                query_name="disclosure_timeline",
                data=[dict(row) for row in results],
                total_count=len(results),
                generated_at=datetime.now()
            )
    
    async def get_uap_hotspots(self, limit: int = 20) -> AnalyticsResult:
        """Get geographic UAP hotspots"""
        
        async with self.pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT * FROM uap_hotspots
                ORDER BY sighting_count + event_count DESC
                LIMIT $1
            """, limit)
            
            return AnalyticsResult(
                query_name="uap_hotspots", 
                data=[dict(row) for row in results],
                total_count=len(results),
                generated_at=datetime.now()
            )
    
    async def get_document_quality(self, limit: int = 20) -> AnalyticsResult:
        """Get document quality analysis"""
        
        async with self.pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT * FROM document_quality
                WHERE processed = true
                ORDER BY quality_score DESC
                LIMIT $1
            """, limit)
            
            return AnalyticsResult(
                query_name="document_quality",
                data=[dict(row) for row in results],
                total_count=len(results),
                generated_at=datetime.now()
            )
    
    async def find_similar_entities(self, 
                                   entity_id: str, 
                                   entity_type: str = 'documents',
                                   limit: int = 10) -> List[SearchResult]:
        """Find entities similar to a specific entity"""
        
        async with self.pool.acquire() as conn:
            # Get the entity's embedding
            embedding_query = f"SELECT embedding FROM {entity_type} WHERE id = $1"
            embedding_result = await conn.fetchval(embedding_query, entity_id)
            
            if not embedding_result:
                return []
            
            # Find similar entities across all tables
            results = await conn.fetch("""
                SELECT * FROM find_similar_entities($1, 0.6, $2)
            """, embedding_result, limit)
            
            return [
                SearchResult(
                    id=str(row['entity_id']),
                    entity_type=row['entity_type'],
                    title=row['entity_name'],
                    content='',
                    similarity_score=float(row['similarity_score']),
                    metadata={'source_entity': entity_id}
                )
                for row in results
            ]
    
    async def get_database_stats(self) -> Dict[str, Any]:
        """Get comprehensive database statistics"""
        
        async with self.pool.acquire() as conn:
            stats = {}
            
            # Table counts
            tables = ['personnel', 'organizations', 'events', 'topics', 'documents', 
                     'testimonies', 'sightings', 'artifacts']
            
            for table in tables:
                count = await conn.fetchval(f"SELECT COUNT(*) FROM {table}")
                stats[f'{table}_count'] = count
            
            # Embedding coverage
            for table in ['personnel', 'documents', 'events', 'topics', 'testimonies']:
                total = await conn.fetchval(f"SELECT COUNT(*) FROM {table}")
                with_embeddings = await conn.fetchval(f"SELECT COUNT(*) FROM {table} WHERE embedding IS NOT NULL")
                stats[f'{table}_embedding_coverage'] = f"{with_embeddings}/{total}" if total > 0 else "0/0"
            
            # Recent activity
            stats['recent_documents'] = await conn.fetchval("""
                SELECT COUNT(*) FROM documents 
                WHERE created_at > NOW() - INTERVAL '30 days'
            """)
            
            stats['processed_documents'] = await conn.fetchval("""
                SELECT COUNT(*) FROM documents WHERE processed = true
            """)
            
            return stats


# Convenience functions for common operations
async def quick_setup_and_import(csv_directory: str = "./exports", 
                                connection_string: str = None):
    """Quick setup: connect, import CSV data, and return database instance"""
    
    db = UltraterrestrialDB(connection_string)
    await db.connect()
    
    try:
        await db.import_csv_data(csv_directory)
        print("🚀 Database setup and import completed!")
        return db
    except Exception as e:
        await db.close()
        raise e

async def demo_search_and_analytics():
    """Demo the database capabilities"""
    
    db = UltraterrestrialDB()
    await db.connect()
    
    try:
        print("\n🔍 Testing semantic search...")
        results = await db.semantic_search("underwater UAP navy encounters", "documents", 5)
        for result in results:
            print(f"  • {result.title} (similarity: {result.similarity_score:.3f})")
        
        print("\n📊 Getting personnel influence...")
        influence = await db.get_personnel_influence(5)
        for person in influence.data:
            print(f"  • {person['name']}: {person['influence_score']:.1f}")
        
        print("\n🌍 Getting UAP hotspots...")
        hotspots = await db.get_uap_hotspots(5)
        for spot in hotspots.data:
            print(f"  • {spot['location']}: {spot['sighting_count']} sightings")
        
        print("\n📈 Database statistics...")
        stats = await db.get_database_stats()
        for key, value in stats.items():
            print(f"  • {key}: {value}")
        
    finally:
        await db.close()

if __name__ == "__main__":
    # Run demo
    asyncio.run(demo_search_and_analytics())