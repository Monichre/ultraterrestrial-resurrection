-- Migration Script: Standardize all vector embeddings to 384 dimensions
-- Date: July 9, 2025
-- Purpose: Convert mixed-dimension schema to consistent 384-dimension embeddings

-- WARNING: This migration will drop existing vector data and recreate indexes
-- Back up your data before running this migration

BEGIN;

-- Drop existing vector indexes (they'll be recreated with correct dimensions)
DROP INDEX IF EXISTS idx_personnel_embedding;
DROP INDEX IF EXISTS idx_organizations_embedding;
DROP INDEX IF EXISTS idx_events_embedding;
DROP INDEX IF EXISTS idx_topics_embedding;
DROP INDEX IF EXISTS idx_documents_embedding;
DROP INDEX IF EXISTS idx_testimonies_embedding;
DROP INDEX IF EXISTS idx_artifacts_embedding;
DROP INDEX IF EXISTS idx_document_chunks_embedding;
DROP INDEX IF EXISTS idx_mindmaps_embedding;
DROP INDEX IF EXISTS idx_document_embeddings_vector;
DROP INDEX IF EXISTS idx_summary_files_embedding;

-- Update vector column dimensions
-- Note: This will clear existing embedding data

-- Personnel: 1536 -> 384
ALTER TABLE personnel DROP COLUMN IF EXISTS embedding;
ALTER TABLE personnel ADD COLUMN embedding vector(384);

-- Organizations: 500 -> 384
ALTER TABLE organizations DROP COLUMN IF EXISTS embedding;
ALTER TABLE organizations ADD COLUMN embedding vector(384);

-- Events: 1536 -> 384
ALTER TABLE events DROP COLUMN IF EXISTS embedding;
ALTER TABLE events ADD COLUMN embedding vector(384);

-- Topics: 1536 -> 384
ALTER TABLE topics DROP COLUMN IF EXISTS embedding;
ALTER TABLE topics ADD COLUMN embedding vector(384);

-- Documents: 1536 -> 384
ALTER TABLE documents DROP COLUMN IF EXISTS embedding;
ALTER TABLE documents ADD COLUMN embedding vector(384);

-- Testimonies: 1536 -> 384
ALTER TABLE testimonies DROP COLUMN IF EXISTS embedding;
ALTER TABLE testimonies ADD COLUMN embedding vector(384);

-- Artifacts: 1536 -> 384
ALTER TABLE artifacts DROP COLUMN IF EXISTS embedding;
ALTER TABLE artifacts ADD COLUMN embedding vector(384);

-- Document chunks: 1536 -> 384
ALTER TABLE document_chunks DROP COLUMN IF EXISTS embedding;
ALTER TABLE document_chunks ADD COLUMN embedding vector(384);

-- Mindmaps: 1536 -> 384
ALTER TABLE mindmaps DROP COLUMN IF EXISTS embedding;
ALTER TABLE mindmaps ADD COLUMN embedding vector(384);

-- Summary files: Update from JSONB to vector(384)
ALTER TABLE summary_files DROP COLUMN IF EXISTS embedding;
ALTER TABLE summary_files ADD COLUMN embedding vector(384);

-- Ensure document_embeddings table exists and has correct dimension
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(384),
    metadata JSONB DEFAULT '{}',
    source_type TEXT,
    source_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- If document_embeddings already exists with wrong dimension, fix it
DO $$
BEGIN
    -- Check if column exists and has wrong dimension
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_embeddings' 
        AND column_name = 'embedding'
    ) THEN
        -- Drop and recreate with correct dimension
        ALTER TABLE document_embeddings DROP COLUMN embedding;
        ALTER TABLE document_embeddings ADD COLUMN embedding vector(384);
    END IF;
END $$;

-- Recreate vector indexes for 384 dimensions
CREATE INDEX idx_personnel_embedding ON personnel USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_organizations_embedding ON organizations USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_events_embedding ON events USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_topics_embedding ON topics USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_documents_embedding ON documents USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_testimonies_embedding ON testimonies USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_artifacts_embedding ON artifacts USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_summary_files_embedding ON summary_files USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_mindmaps_embedding ON mindmaps USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_document_embeddings_vector ON document_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- Create additional indexes for document_embeddings
CREATE INDEX IF NOT EXISTS idx_document_embeddings_source_type ON document_embeddings(source_type);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_doc_id ON document_embeddings(doc_id);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_metadata ON document_embeddings USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_content_fts ON document_embeddings USING GIN(to_tsvector('english', content));

-- Update search functions to use 384 dimensions
DROP FUNCTION IF EXISTS hybrid_search(TEXT, vector, TEXT, INTEGER, FLOAT, FLOAT);
CREATE OR REPLACE FUNCTION hybrid_search(
    query_text TEXT,
    query_embedding vector(384),
    table_name TEXT DEFAULT 'documents',
    limit_count INTEGER DEFAULT 10,
    semantic_weight FLOAT DEFAULT 0.7,
    keyword_weight FLOAT DEFAULT 0.3
) RETURNS TABLE (
    id UUID,
    title TEXT,
    content_preview TEXT,
    semantic_score FLOAT,
    keyword_score FLOAT,
    hybrid_score FLOAT
) AS $$
BEGIN
    RETURN QUERY EXECUTE format('
        WITH semantic_results AS (
            SELECT 
                id,
                title,
                COALESCE(summary, description, bio)::TEXT as content,
                1 - (embedding <=> $1) as semantic_score
            FROM %I
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> $1
            LIMIT 50
        ),
        keyword_results AS (
            SELECT 
                id,
                title,
                COALESCE(summary, description, bio)::TEXT as content,
                ts_rank(to_tsvector(''english'', COALESCE(title, '''') || '' '' || COALESCE(summary, description, bio, '''')), 
                        plainto_tsquery(''english'', $2)) as keyword_score
            FROM %I
            WHERE to_tsvector(''english'', COALESCE(title, '''') || '' '' || COALESCE(summary, description, bio, '''')) @@ 
                  plainto_tsquery(''english'', $2)
        )
        SELECT 
            COALESCE(s.id, k.id) as id,
            COALESCE(s.title, k.title) as title,
            LEFT(COALESCE(s.content, k.content), 300) as content_preview,
            COALESCE(s.semantic_score, 0)::FLOAT as semantic_score,
            COALESCE(k.keyword_score, 0)::FLOAT as keyword_score,
            (COALESCE(s.semantic_score, 0) * $3 + COALESCE(k.keyword_score, 0) * $4)::FLOAT as hybrid_score
        FROM semantic_results s
        FULL OUTER JOIN keyword_results k ON s.id = k.id
        ORDER BY hybrid_score DESC
        LIMIT $5
    ', table_name, table_name)
    USING query_embedding, query_text, semantic_weight, keyword_weight, limit_count;
END;
$$ LANGUAGE plpgsql;

-- Update find_similar_entities function to use 384 dimensions
DROP FUNCTION IF EXISTS find_similar_entities(vector, FLOAT, INTEGER);
CREATE OR REPLACE FUNCTION find_similar_entities(
    entity_embedding vector(384),
    similarity_threshold FLOAT DEFAULT 0.7,
    limit_count INTEGER DEFAULT 20
) RETURNS TABLE (
    entity_type TEXT,
    entity_id UUID,
    entity_name TEXT,
    similarity_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    -- Personnel
    SELECT 
        'personnel'::TEXT as entity_type,
        p.id as entity_id,
        p.name as entity_name,
        (1 - (p.embedding <=> entity_embedding))::FLOAT as similarity_score
    FROM personnel p
    WHERE p.embedding IS NOT NULL 
    AND (1 - (p.embedding <=> entity_embedding)) > similarity_threshold
    
    UNION ALL
    
    -- Events  
    SELECT 
        'events'::TEXT as entity_type,
        e.id as entity_id,
        e.title as entity_name,
        (1 - (e.embedding <=> entity_embedding))::FLOAT as similarity_score
    FROM events e
    WHERE e.embedding IS NOT NULL
    AND (1 - (e.embedding <=> entity_embedding)) > similarity_threshold
    
    UNION ALL
    
    -- Topics
    SELECT 
        'topics'::TEXT as entity_type,
        t.id as entity_id,
        t.title as entity_name,
        (1 - (t.embedding <=> entity_embedding))::FLOAT as similarity_score
    FROM topics t
    WHERE t.embedding IS NOT NULL
    AND (1 - (t.embedding <=> entity_embedding)) > similarity_threshold
    
    ORDER BY similarity_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Update column comments
COMMENT ON COLUMN personnel.embedding IS 'Vector embedding (384-dim) for semantic similarity search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN organizations.embedding IS 'Vector embedding (384-dim) for semantic similarity search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN events.embedding IS 'Vector embedding (384-dim) for semantic similarity search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN topics.embedding IS 'Vector embedding (384-dim) for semantic similarity search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN documents.embedding IS 'Vector embedding (384-dim) for semantic similarity search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN testimonies.embedding IS 'Vector embedding (384-dim) for semantic similarity search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN artifacts.embedding IS 'Vector embedding (384-dim) for semantic similarity search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN document_chunks.embedding IS 'Vector embedding (384-dim) for chunk-level semantic search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN summary_files.embedding IS 'Vector embedding (384-dim) for summary content search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN mindmaps.embedding IS 'Vector embedding (384-dim) for mindmap content search using sentence-transformers all-MiniLM-L6-v2';
COMMENT ON COLUMN document_embeddings.embedding IS 'Vector embedding (384-dim) generated by sentence-transformers all-MiniLM-L6-v2 for unified ingestion system';

-- Display completion message
SELECT 'Migration to 384-dimensional embeddings completed successfully!' as status;

COMMIT;