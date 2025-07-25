-- PostgreSQL + pgvector Schema for Ultraterrestrial Research Database
-- Based on your existing sophisticated UFO/UAP data model with enhancements

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- CORE ENTITY TABLES (from your existing schema)
-- =====================================================

-- Personnel (key figures in UFO research)
CREATE TABLE personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    role VARCHAR(255),
    rank INTEGER,
    credibility INTEGER CHECK (credibility >= 0 AND credibility <= 100),
    popularity INTEGER CHECK (popularity >= 0 AND popularity <= 100),
    authority INTEGER CHECK (authority >= 0 AND authority <= 100),
    photo TEXT[],
    -- Vector embedding for semantic search
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Organizations (military, government, research)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) UNIQUE,
    specialization VARCHAR(255),
    description TEXT,
    photo TEXT,
    image_url TEXT,
    -- Vector embedding for semantic search
    embedding vector(500),  -- Different dimension as in your schema
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events (UAP incidents, disclosure events)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) UNIQUE NOT NULL,
    name TEXT,
    description TEXT,
    summary TEXT,
    location VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT,
    date TIMESTAMP,
    category TEXT[],
    photos TEXT[],
    metadata JSONB DEFAULT '{}',
    -- Vector embedding for semantic search
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Topics (research areas, phenomena types)
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    summary TEXT,
    photo TEXT,
    photos TEXT[],
    -- Vector embedding for semantic search
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents (research papers, reports, testimonies)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    summary TEXT,
    url TEXT,
    date TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    file_urls TEXT[],
    images TEXT[],
    metadata JSONB DEFAULT '{}',
    author_id UUID REFERENCES personnel(id),
    organization_id UUID REFERENCES organizations(id),
    -- Vector embedding for semantic search
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonies (witness accounts)
CREATE TABLE testimonies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim TEXT,
    summary TEXT,
    context TEXT,
    source TEXT,
    date TIMESTAMP,
    documentation TEXT[],
    media TEXT[],
    witness_id UUID REFERENCES personnel(id),
    event_id UUID REFERENCES events(id),
    organization_id UUID REFERENCES organizations(id),
    -- Vector embedding for semantic search
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sightings (UAP observation reports)
CREATE TABLE sightings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP,
    description TEXT,
    comments TEXT,
    media_link TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    shape VARCHAR(100),
    duration_seconds VARCHAR(50),
    duration_hours_min VARCHAR(50),
    latitude FLOAT,
    longitude FLOAT,
    media TEXT[],
    date_posted TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Locations (places of interest)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    coordinates VARCHAR(255),
    google_maps_location_id TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Artifacts (physical evidence)
CREATE TABLE artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    photos TEXT[],
    date VARCHAR(255),
    source TEXT,
    origin TEXT,
    images TEXT[],
    -- Vector embedding for semantic search
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- RELATIONSHIP TABLES (Many-to-Many)
-- =====================================================

-- Organization membership
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES personnel(id),
    organization_id UUID REFERENCES organizations(id),
    role VARCHAR(255),
    start_date DATE,
    end_date DATE,
    UNIQUE(member_id, organization_id)
);

-- Event subject matter experts
CREATE TABLE event_subject_matter_experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    expert_id UUID REFERENCES personnel(id),
    expertise_area VARCHAR(255),
    UNIQUE(event_id, expert_id)
);

-- Topic subject matter experts
CREATE TABLE topic_subject_matter_experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id),
    expert_id UUID REFERENCES personnel(id),
    expertise_level INTEGER CHECK (expertise_level >= 1 AND expertise_level <= 10),
    UNIQUE(topic_id, expert_id)
);

-- Event-Topic-Expert relationships
CREATE TABLE event_topic_subject_matter_experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    topic_id UUID REFERENCES topics(id),
    expert_id UUID REFERENCES personnel(id),
    UNIQUE(event_id, topic_id, expert_id)
);

-- Topics-Testimonies relationships
CREATE TABLE topics_testimonies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id),
    testimony_id UUID REFERENCES testimonies(id),
    relevance_score FLOAT CHECK (relevance_score >= 0 AND relevance_score <= 1),
    UNIQUE(topic_id, testimony_id)
);

-- =====================================================
-- DOCUMENT PROCESSING TABLES
-- =====================================================

-- Document chunks for RAG
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    chunk_index INTEGER,
    content TEXT NOT NULL,
    token_count INTEGER,
    page_number INTEGER,
    heading TEXT,
    -- Vector embedding for chunk-level search
    embedding vector(1536),  -- Note: Your schema shows dimension 3, but 1536 is more typical
    created_at TIMESTAMP DEFAULT NOW()
);

-- Extracted entities from documents
CREATE TABLE document_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    entity_type VARCHAR(100),  -- 'personnel', 'organization', 'location', 'event', etc.
    entity_data TEXT,
    confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
    start_position INTEGER,
    end_position INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Document processing tasks
CREATE TABLE document_processing_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    task_type VARCHAR(100),  -- 'entity_extraction', 'summarization', 'embedding', etc.
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'processing', 'completed', 'failed'
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Summary files
CREATE TABLE summary_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) UNIQUE,
    name TEXT,
    file_url TEXT,
    source TEXT,
    content TEXT,
    metadata JSONB DEFAULT '{}',
    images TEXT,
    -- Multiple embeddings for different summary types
    embedding JSONB,  -- Store different embedding types
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- USER SYSTEM (from your schema)
-- =====================================================

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    photo TEXT,
    profile_image_url TEXT,
    external_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User notes/theories
CREATE TABLE user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    content TEXT,
    synopsis TEXT,
    diagrams TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User saved items (polymorphic saves)
CREATE TABLE user_saved_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),
    theory_id UUID REFERENCES user_notes(id),
    note TEXT,
    note_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

CREATE TABLE user_saved_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    topic_id UUID REFERENCES topics(id),
    theory_id UUID REFERENCES user_notes(id),
    note TEXT,
    note_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

CREATE TABLE user_saved_personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    personnel_id UUID REFERENCES personnel(id),
    theory_id UUID REFERENCES user_notes(id),
    note TEXT,
    note_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, personnel_id)
);

CREATE TABLE user_saved_testimonies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    testimony_id UUID REFERENCES testimonies(id),
    theory_id UUID REFERENCES user_notes(id),
    note TEXT,
    note_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, testimony_id)
);

CREATE TABLE user_saved_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_id UUID REFERENCES documents(id),
    theory_id UUID REFERENCES user_notes(id),
    note TEXT,
    note_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, document_id)
);

CREATE TABLE user_saved_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    theory_id UUID REFERENCES user_notes(id),
    note TEXT,
    note_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

CREATE TABLE user_saved_sightings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    sighting_id UUID REFERENCES sightings(id),
    theory_id UUID REFERENCES user_notes(id),
    note TEXT,
    note_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, sighting_id)
);

-- Mindmaps
CREATE TABLE mindmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    json_data JSONB DEFAULT '{}',
    file_url TEXT,
    -- Vector embedding for mindmap content
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Vector indexes for pgvector (HNSW for best performance)
CREATE INDEX idx_personnel_embedding ON personnel USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_organizations_embedding ON organizations USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_events_embedding ON events USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_topics_embedding ON topics USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_documents_embedding ON documents USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_testimonies_embedding ON testimonies USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_artifacts_embedding ON artifacts USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_mindmaps_embedding ON mindmaps USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- Regular indexes for common queries
CREATE INDEX idx_personnel_name ON personnel(name);
CREATE INDEX idx_personnel_credibility ON personnel(credibility DESC);
CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_documents_date ON documents(date);
CREATE INDEX idx_documents_processed ON documents(processed);
CREATE INDEX idx_testimonies_date ON testimonies(date);
CREATE INDEX idx_sightings_date ON sightings(date);
CREATE INDEX idx_sightings_location ON sightings(latitude, longitude);
CREATE INDEX idx_document_entities_type ON document_entities(entity_type);
CREATE INDEX idx_document_processing_tasks_status ON document_processing_tasks(status);

-- JSONB indexes for metadata
CREATE INDEX idx_events_metadata ON events USING GIN(metadata);
CREATE INDEX idx_documents_metadata ON documents USING GIN(metadata);
CREATE INDEX idx_document_entities_metadata ON document_entities USING GIN(metadata);
CREATE INDEX idx_document_processing_tasks_metadata ON document_processing_tasks USING GIN(metadata);

-- Full-text search indexes
CREATE INDEX idx_personnel_bio_fts ON personnel USING GIN(to_tsvector('english', bio));
CREATE INDEX idx_events_description_fts ON events USING GIN(to_tsvector('english', description || ' ' || COALESCE(summary, '')));
CREATE INDEX idx_documents_content_fts ON documents USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '')));
CREATE INDEX idx_testimonies_content_fts ON testimonies USING GIN(to_tsvector('english', claim || ' ' || COALESCE(summary, '') || ' ' || COALESCE(context, '')));

-- =====================================================
-- ADVANCED ANALYTICAL VIEWS
-- =====================================================

-- Entity co-occurrence analysis
CREATE VIEW entity_cooccurrence AS
WITH document_entity_pairs AS (
    SELECT 
        de1.entity_type as entity_type1,
        de1.entity_data as entity1,
        de2.entity_type as entity_type2,
        de2.entity_data as entity2,
        de1.document_id,
        LEAST(de1.confidence, de2.confidence) as min_confidence
    FROM document_entities de1
    JOIN document_entities de2 ON de1.document_id = de2.document_id
    WHERE de1.id < de2.id  -- Avoid duplicates
)
SELECT 
    entity_type1,
    entity1,
    entity_type2,
    entity2,
    COUNT(*) as cooccurrence_count,
    COUNT(DISTINCT document_id) as shared_documents,
    AVG(min_confidence) as avg_confidence
FROM document_entity_pairs
GROUP BY entity_type1, entity1, entity_type2, entity2
HAVING COUNT(*) > 1
ORDER BY cooccurrence_count DESC;

-- Personnel influence network
CREATE VIEW personnel_influence AS
WITH personnel_connections AS (
    SELECT 
        p.id,
        p.name,
        p.credibility,
        p.authority,
        -- Count document appearances
        (SELECT COUNT(*) FROM documents d WHERE d.author_id = p.id) as authored_documents,
        -- Count testimony appearances
        (SELECT COUNT(*) FROM testimonies t WHERE t.witness_id = p.id) as testimonies_given,
        -- Count organizational memberships
        (SELECT COUNT(*) FROM organization_members om WHERE om.member_id = p.id) as organization_memberships,
        -- Count expert relationships
        (SELECT COUNT(*) FROM topic_subject_matter_experts tsme WHERE tsme.expert_id = p.id) as topic_expertises
    FROM personnel p
)
SELECT 
    *,
    -- Calculate composite influence score
    (credibility * 0.3 + 
     authority * 0.3 + 
     authored_documents * 5 + 
     testimonies_given * 3 + 
     organization_memberships * 2 + 
     topic_expertises * 4) as influence_score
FROM personnel_connections
ORDER BY influence_score DESC;

-- Document quality metrics
CREATE VIEW document_quality AS
WITH doc_metrics AS (
    SELECT 
        d.id,
        d.title,
        d.date,
        d.processed,
        -- Count entities extracted
        (SELECT COUNT(*) FROM document_entities de WHERE de.document_id = d.id) as entity_count,
        -- Count unique entity types
        (SELECT COUNT(DISTINCT entity_type) FROM document_entities de WHERE de.document_id = d.id) as entity_type_diversity,
        -- Average entity confidence
        (SELECT AVG(confidence) FROM document_entities de WHERE de.document_id = d.id) as avg_entity_confidence,
        -- Count chunks
        (SELECT COUNT(*) FROM document_chunks dc WHERE dc.document_id = d.id) as chunk_count,
        -- Total token count
        (SELECT SUM(token_count) FROM document_chunks dc WHERE dc.document_id = d.id) as total_tokens,
        -- Author credibility
        (SELECT credibility FROM personnel p WHERE p.id = d.author_id) as author_credibility
    FROM documents d
)
SELECT 
    *,
    -- Quality score calculation
    (COALESCE(entity_count, 0) * 2 +
     COALESCE(entity_type_diversity, 0) * 5 +
     COALESCE(avg_entity_confidence, 0) * 10 +
     COALESCE(total_tokens, 0) / 100.0 +
     COALESCE(author_credibility, 50) / 10.0) as quality_score
FROM doc_metrics
ORDER BY quality_score DESC;

-- Temporal analysis of UAP disclosure
CREATE VIEW disclosure_timeline AS
SELECT 
    DATE_TRUNC('year', d.date) as year,
    COUNT(d.*) as document_count,
    COUNT(e.*) as event_count,
    COUNT(t.*) as testimony_count,
    COUNT(s.*) as sighting_count,
    -- Average credibility of sources
    AVG(p.credibility) as avg_source_credibility
FROM documents d
FULL OUTER JOIN events e ON DATE_TRUNC('year', e.date) = DATE_TRUNC('year', d.date)
FULL OUTER JOIN testimonies t ON DATE_TRUNC('year', t.date) = DATE_TRUNC('year', d.date)
FULL OUTER JOIN sightings s ON DATE_TRUNC('year', s.date) = DATE_TRUNC('year', d.date)
LEFT JOIN personnel p ON d.author_id = p.id
WHERE COALESCE(d.date, e.date, t.date, s.date) IS NOT NULL
GROUP BY DATE_TRUNC('year', COALESCE(d.date, e.date, t.date, s.date))
ORDER BY year;

-- Geographic UAP hotspots
CREATE VIEW uap_hotspots AS
SELECT 
    COALESCE(s.state, e.location) as location,
    COUNT(s.*) as sighting_count,
    COUNT(e.*) as event_count,
    AVG(s.latitude) as avg_latitude,
    AVG(s.longitude) as avg_longitude,
    -- Most common shapes for sightings
    MODE() WITHIN GROUP (ORDER BY s.shape) as most_common_shape
FROM sightings s
FULL OUTER JOIN events e ON (
    s.state = e.location OR 
    s.city = e.location OR
    (ABS(s.latitude - e.latitude) < 0.5 AND ABS(s.longitude - e.longitude) < 0.5)
)
WHERE COALESCE(s.state, e.location) IS NOT NULL
GROUP BY COALESCE(s.state, e.location)
HAVING COUNT(s.*) + COUNT(e.*) > 1
ORDER BY sighting_count + event_count DESC;

-- =====================================================
-- ADVANCED SEARCH FUNCTIONS
-- =====================================================

-- Hybrid semantic + keyword search function
CREATE OR REPLACE FUNCTION hybrid_search(
    query_text TEXT,
    query_embedding vector(1536),
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

-- Find similar entities across all tables
CREATE OR REPLACE FUNCTION find_similar_entities(
    entity_embedding vector(1536),
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

-- =====================================================
-- EXAMPLE QUERIES FOR YOUR DATA
-- =====================================================

/*
-- 1. Find documents similar to a specific document
SELECT 
    target.title as target_document,
    similar.title as similar_document,
    1 - (target.embedding <=> similar.embedding) as similarity
FROM documents target
CROSS JOIN documents similar
WHERE target.id = 'YOUR_DOCUMENT_ID'
AND similar.id != target.id
AND target.embedding IS NOT NULL
AND similar.embedding IS NOT NULL
ORDER BY target.embedding <=> similar.embedding
LIMIT 10;

-- 2. Hybrid search across all documents
SELECT * FROM hybrid_search(
    'underwater UAP navy encounters',
    '[your_query_embedding_vector]'::vector(1536),
    'documents',
    10
);

-- 3. Find personnel connected to specific events
SELECT DISTINCT
    p.name,
    p.credibility,
    e.title as event_title,
    ete.expertise_area
FROM personnel p
JOIN event_subject_matter_experts ete ON p.id = ete.expert_id
JOIN events e ON ete.event_id = e.id
WHERE e.title ILIKE '%nimitz%' OR e.title ILIKE '%tic tac%'
ORDER BY p.credibility DESC;

-- 4. Geographic clustering of sightings
SELECT 
    state,
    COUNT(*) as sighting_count,
    ROUND(AVG(latitude)::numeric, 4) as avg_lat,
    ROUND(AVG(longitude)::numeric, 4) as avg_lon,
    array_agg(DISTINCT shape) as shapes_observed
FROM sightings
WHERE state IS NOT NULL
GROUP BY state
HAVING COUNT(*) > 5
ORDER BY sighting_count DESC;

-- 5. Entity co-occurrence in documents
SELECT * FROM entity_cooccurrence
WHERE entity1 ILIKE '%elizondo%' OR entity2 ILIKE '%elizondo%'
ORDER BY cooccurrence_count DESC;

-- 6. Most influential personnel
SELECT 
    name,
    credibility,
    authority,
    influence_score,
    authored_documents,
    testimonies_given
FROM personnel_influence
ORDER BY influence_score DESC
LIMIT 20;

-- 7. Document quality analysis
SELECT 
    title,
    quality_score,
    entity_count,
    entity_type_diversity,
    avg_entity_confidence,
    author_credibility
FROM document_quality
WHERE processed = true
ORDER BY quality_score DESC
LIMIT 20;

-- 8. Temporal disclosure patterns
SELECT 
    year,
    document_count,
    event_count,
    testimony_count,
    ROUND(avg_source_credibility::numeric, 2) as avg_credibility
FROM disclosure_timeline
WHERE year >= '2000-01-01'
ORDER BY year;
*/

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to update embeddings when content changes
CREATE OR REPLACE FUNCTION update_embedding_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Mark that embedding needs regeneration
    NEW.updated_at = NOW();
    -- In practice, you'd trigger an async job to regenerate embeddings
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_personnel_timestamp BEFORE UPDATE ON personnel FOR EACH ROW EXECUTE FUNCTION update_embedding_trigger();
CREATE TRIGGER update_documents_timestamp BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_embedding_trigger();
CREATE TRIGGER update_events_timestamp BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_embedding_trigger();

-- Comments for documentation
COMMENT ON TABLE personnel IS 'Key figures in UFO/UAP research and disclosure';
COMMENT ON TABLE organizations IS 'Military, government, and research organizations';
COMMENT ON TABLE events IS 'UAP incidents, disclosure events, and significant occurrences';
COMMENT ON TABLE documents IS 'Research papers, reports, government documents, and testimonies';
COMMENT ON TABLE testimonies IS 'Witness accounts and testimony records';
COMMENT ON TABLE sightings IS 'UFO/UAP sighting reports from various sources';

COMMENT ON COLUMN personnel.embedding IS 'Vector embedding for semantic similarity search of personnel bio and role';
COMMENT ON COLUMN documents.embedding IS 'Vector embedding for semantic search of document content';
COMMENT ON COLUMN events.embedding IS 'Vector embedding for semantic search of event descriptions';

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;