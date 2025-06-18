-- PostgreSQL + pgvector Setup for UFO Document Library
-- This shows the REAL power: SQL analytics + vector similarity in one database

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Simple documents table with vector column
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    content_hash VARCHAR(64) UNIQUE,
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- The magic: just add a vector column!
    embedding vector(384)  -- 384 dimensions for sentence-transformers
);

-- Entities table for structured analysis  
CREATE TABLE entities (
    id SERIAL PRIMARY KEY,
    doc_id INTEGER REFERENCES documents(id),
    entity_type VARCHAR(50),  -- 'person', 'organization', 'location', etc.
    entity_name TEXT,
    confidence REAL,
    context TEXT
);

-- Tags for classification
CREATE TABLE document_tags (
    doc_id INTEGER REFERENCES documents(id),
    tag VARCHAR(100),
    PRIMARY KEY (doc_id, tag)
);

-- Create the pgvector index for fast similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Regular indexes for SQL queries
CREATE INDEX idx_documents_created ON documents(created_at);
CREATE INDEX idx_documents_source ON documents(source_url);
CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_name ON entities(entity_name);

-- Now the REAL power: combine SQL analytics with vector search!

-- 1. Find similar documents using vector similarity
-- This is what pgvector adds - cosine similarity search
/*
SELECT 
    title,
    content,
    1 - (embedding <=> '[0.1,0.2,0.3,...]'::vector) as similarity
FROM documents 
WHERE 1 - (embedding <=> '[0.1,0.2,0.3,...]'::vector) > 0.7
ORDER BY embedding <=> '[0.1,0.2,0.3,...]'::vector
LIMIT 10;
*/

-- 2. Hybrid search: combine full-text search with vector similarity
/*
WITH semantic_results AS (
    SELECT id, title, 
           1 - (embedding <=> '[query_vector]'::vector) as semantic_score
    FROM documents 
    ORDER BY embedding <=> '[query_vector]'::vector
    LIMIT 50
),
keyword_results AS (
    SELECT id, title,
           ts_rank(to_tsvector('english', content), plainto_tsquery('english', 'query')) as keyword_score
    FROM documents 
    WHERE to_tsvector('english', content) @@ plainto_tsquery('english', 'query')
)
SELECT 
    d.title,
    COALESCE(s.semantic_score, 0) * 0.7 + COALESCE(k.keyword_score, 0) * 0.3 as hybrid_score
FROM documents d
LEFT JOIN semantic_results s ON d.id = s.id
LEFT JOIN keyword_results k ON d.id = k.id
WHERE s.id IS NOT NULL OR k.id IS NOT NULL
ORDER BY hybrid_score DESC;
*/

-- 3. Entity co-occurrence analysis (pure SQL!)
CREATE VIEW entity_cooccurrence AS
SELECT 
    e1.entity_name as entity1,
    e1.entity_type as type1,
    e2.entity_name as entity2, 
    e2.entity_type as type2,
    COUNT(*) as cooccurrence_count,
    COUNT(DISTINCT e1.doc_id) as shared_documents
FROM entities e1
JOIN entities e2 ON e1.doc_id = e2.doc_id
WHERE e1.entity_name < e2.entity_name  -- Avoid duplicates
GROUP BY e1.entity_name, e1.entity_type, e2.entity_name, e2.entity_type
HAVING COUNT(*) > 1
ORDER BY cooccurrence_count DESC;

-- 4. Document clustering using SQL window functions
CREATE VIEW document_clusters AS
WITH similarity_matrix AS (
    SELECT 
        d1.id as doc1_id,
        d1.title as doc1_title,
        d2.id as doc2_id,
        d2.title as doc2_title,
        1 - (d1.embedding <=> d2.embedding) as similarity
    FROM documents d1
    CROSS JOIN documents d2
    WHERE d1.id < d2.id
    AND 1 - (d1.embedding <=> d2.embedding) > 0.8  -- High similarity threshold
)
SELECT 
    doc1_id,
    doc1_title,
    COUNT(*) as similar_docs,
    ARRAY_AGG(doc2_title) as similar_to
FROM similarity_matrix
GROUP BY doc1_id, doc1_title
ORDER BY similar_docs DESC;

-- 5. Temporal analysis with entity emergence
CREATE VIEW entity_trends AS
SELECT 
    DATE_TRUNC('month', d.created_at) as month,
    e.entity_type,
    e.entity_name,
    COUNT(*) as mentions,
    COUNT(DISTINCT d.id) as documents
FROM entities e
JOIN documents d ON e.doc_id = d.id
GROUP BY DATE_TRUNC('month', d.created_at), e.entity_type, e.entity_name
ORDER BY month, mentions DESC;

-- 6. Source credibility analysis
CREATE VIEW source_analysis AS
SELECT 
    CASE 
        WHEN source_url LIKE '%.gov%' THEN 'Government'
        WHEN source_url LIKE '%.mil%' THEN 'Military' 
        WHEN source_url LIKE '%.edu%' THEN 'Academic'
        WHEN source_url LIKE '%.org%' THEN 'Organization'
        ELSE 'Other'
    END as source_type,
    COUNT(*) as document_count,
    AVG(word_count) as avg_length,
    MIN(created_at) as first_document,
    MAX(created_at) as latest_document
FROM documents
WHERE source_url IS NOT NULL
GROUP BY 1
ORDER BY document_count DESC;

-- 7. Advanced entity network analysis
CREATE VIEW entity_networks AS
WITH entity_centrality AS (
    SELECT 
        entity_name,
        entity_type,
        COUNT(*) as total_mentions,
        COUNT(DISTINCT doc_id) as document_appearances,
        -- Calculate "centrality" as connections to other entities
        (SELECT COUNT(DISTINCT e2.entity_name) 
         FROM entities e2 
         WHERE e2.doc_id IN (SELECT doc_id FROM entities WHERE entity_name = e.entity_name)
         AND e2.entity_name != e.entity_name) as connected_entities
    FROM entities e
    GROUP BY entity_name, entity_type
)
SELECT 
    entity_name,
    entity_type,
    total_mentions,
    document_appearances,
    connected_entities,
    -- Calculate influence score
    (total_mentions * document_appearances * connected_entities) as influence_score
FROM entity_centrality
ORDER BY influence_score DESC;

-- 8. Document quality scoring
CREATE VIEW document_quality AS
SELECT 
    d.id,
    d.title,
    d.word_count,
    -- Entity richness
    COALESCE(entity_stats.entity_count, 0) as entity_count,
    COALESCE(entity_stats.entity_types, 0) as entity_type_diversity,
    -- Tag richness
    COALESCE(tag_stats.tag_count, 0) as tag_count,
    -- Calculate composite quality score
    (d.word_count::float / 1000 + 
     COALESCE(entity_stats.entity_count, 0) * 2 + 
     COALESCE(entity_stats.entity_types, 0) * 5 +
     COALESCE(tag_stats.tag_count, 0) * 3) as quality_score
FROM documents d
LEFT JOIN (
    SELECT 
        doc_id,
        COUNT(*) as entity_count,
        COUNT(DISTINCT entity_type) as entity_types
    FROM entities 
    GROUP BY doc_id
) entity_stats ON d.id = entity_stats.doc_id
LEFT JOIN (
    SELECT 
        doc_id,
        COUNT(*) as tag_count
    FROM document_tags 
    GROUP BY doc_id
) tag_stats ON d.id = tag_stats.doc_id
ORDER BY quality_score DESC;

-- 9. Anomaly detection using vector distances
CREATE VIEW document_outliers AS
WITH avg_similarities AS (
    SELECT 
        d1.id,
        d1.title,
        AVG(1 - (d1.embedding <=> d2.embedding)) as avg_similarity_to_others
    FROM documents d1
    CROSS JOIN documents d2
    WHERE d1.id != d2.id
    GROUP BY d1.id, d1.title
)
SELECT 
    id,
    title,
    avg_similarity_to_others,
    -- Documents with low average similarity are outliers/unique
    CASE 
        WHEN avg_similarity_to_others < 0.3 THEN 'High Outlier'
        WHEN avg_similarity_to_others < 0.5 THEN 'Moderate Outlier'
        ELSE 'Normal'
    END as outlier_status
FROM avg_similarities
ORDER BY avg_similarity_to_others ASC;

-- 10. Time-based vector drift analysis
CREATE VIEW temporal_semantic_drift AS
WITH monthly_centroids AS (
    SELECT 
        DATE_TRUNC('month', created_at) as month,
        -- Calculate average embedding vector for each month
        -- Note: This is simplified - in practice you'd need custom functions
        COUNT(*) as doc_count
    FROM documents
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month
)
SELECT 
    month,
    doc_count,
    LAG(doc_count) OVER (ORDER BY month) as prev_month_count,
    doc_count - LAG(doc_count) OVER (ORDER BY month) as growth
FROM monthly_centroids;

-- Sample queries you can run:

-- Find documents similar to a specific document
/*
SELECT 
    target.title as target_doc,
    similar.title as similar_doc,
    1 - (target.embedding <=> similar.embedding) as similarity
FROM documents target
CROSS JOIN documents similar
WHERE target.id = 1  -- Replace with actual document ID
AND similar.id != target.id
ORDER BY target.embedding <=> similar.embedding
LIMIT 10;
*/

-- Find all documents mentioning both "Elizondo" and "Pentagon"
/*
SELECT DISTINCT d.title, d.created_at
FROM documents d
JOIN entities e1 ON d.id = e1.doc_id
JOIN entities e2 ON d.id = e2.doc_id  
WHERE e1.entity_name ILIKE '%elizondo%'
AND e2.entity_name ILIKE '%pentagon%'
ORDER BY d.created_at DESC;
*/

-- Get the "most connected" entities (appear with many other entities)
/*
SELECT 
    entity_name,
    entity_type,
    connected_entities,
    influence_score
FROM entity_networks
WHERE entity_type = 'personnel'
ORDER BY influence_score DESC
LIMIT 20;
*/