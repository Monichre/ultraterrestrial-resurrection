-- CocoIndex Knowledge Graph Tables - Corrected Schema
-- This schema aligns with existing research_base_schema.md and entity extraction patterns

-- Enhanced document storage with knowledge graph metadata
CREATE TABLE IF NOT EXISTS kg_enhanced_documents (
    doc_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    document_type TEXT,
    confidence_score FLOAT,
    source_url TEXT,
    content_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    entities_found JSONB,
    relationships_found INTEGER
);

-- Person entities (aligned with existing personnel schema)
CREATE TABLE IF NOT EXISTS kg_persons (
    entity_id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    aliases TEXT[],
    role TEXT,
    credentials JSONB,
    metrics JSONB,
    verification_status TEXT,
    biography TEXT,
    contact_info JSONB,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event entities (aligned with existing events schema)
CREATE TABLE IF NOT EXISTS kg_events (
    entity_id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    event_type TEXT,
    date_time TIMESTAMP,
    duration TEXT,
    location_ref TEXT,
    witnesses TEXT[],
    classification TEXT,
    environment_conditions JSONB,
    phenomena JSONB,
    verification_status TEXT,
    evidence TEXT[],
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization entities (aligned with existing organizations schema)
CREATE TABLE IF NOT EXISTS kg_organizations (
    entity_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    jurisdiction TEXT[],
    founding_date TIMESTAMP,
    status TEXT,
    security_level TEXT,
    parent_org TEXT,
    subsidiaries TEXT[],
    key_personnel TEXT[],
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location entities (aligned with existing locations schema)
CREATE TABLE IF NOT EXISTS kg_locations (
    entity_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    coordinates JSONB,
    address JSONB,
    geohash TEXT,
    activity_metrics JSONB,
    security_classification TEXT,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artifact entities (aligned with existing artifacts schema)
CREATE TABLE IF NOT EXISTS kg_artifacts (
    entity_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    discovery_date TIMESTAMP,
    discovery_location TEXT,
    chain_of_custody JSONB,
    physical_properties JSONB,
    analysis_status TEXT,
    security_classification TEXT,
    storage_location TEXT,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sighting entities (aligned with existing sightings schema)
CREATE TABLE IF NOT EXISTS kg_sightings (
    entity_id UUID PRIMARY KEY,
    date TIMESTAMP,
    date_posted TIMESTAMP,
    description TEXT,
    media_link TEXT,
    location JSONB,
    coordinates JSONB,
    shape TEXT,
    duration_seconds TEXT,
    duration_hours_min TEXT,
    comments TEXT,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimony entities (aligned with existing testimonies schema)
CREATE TABLE IF NOT EXISTS kg_testimonies (
    entity_id UUID PRIMARY KEY,
    claim TEXT,
    summary TEXT,
    source TEXT,
    context_info TEXT,
    documentation TEXT[],
    date TIMESTAMP,
    event_ref TEXT,
    witness_ref TEXT,
    organization_ref TEXT,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topic entities (aligned with existing topics schema)
CREATE TABLE IF NOT EXISTS kg_topics (
    entity_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    photos TEXT[],
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced relationship storage
CREATE TABLE IF NOT EXISTS kg_relationships (
    relationship_id UUID PRIMARY KEY,
    subject_entity TEXT NOT NULL,
    subject_type TEXT NOT NULL,
    predicate TEXT NOT NULL,
    object_entity TEXT NOT NULL,
    object_type TEXT NOT NULL,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Enhanced entity mentions with proper typing
CREATE TABLE IF NOT EXISTS kg_entity_mentions (
    id UUID PRIMARY KEY,
    entity_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    document_id TEXT,
    confidence FLOAT,
    context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance (aligned with existing schema patterns)
CREATE INDEX IF NOT EXISTS idx_kg_persons_full_name ON kg_persons(full_name);
CREATE INDEX IF NOT EXISTS idx_kg_persons_role ON kg_persons(role);
CREATE INDEX IF NOT EXISTS idx_kg_events_title ON kg_events(title);
CREATE INDEX IF NOT EXISTS idx_kg_events_date_time ON kg_events(date_time);
CREATE INDEX IF NOT EXISTS idx_kg_organizations_name ON kg_organizations(name);
CREATE INDEX IF NOT EXISTS idx_kg_organizations_type ON kg_organizations(type);
CREATE INDEX IF NOT EXISTS idx_kg_locations_name ON kg_locations(name);
CREATE INDEX IF NOT EXISTS idx_kg_locations_geohash ON kg_locations(geohash);
CREATE INDEX IF NOT EXISTS idx_kg_artifacts_name ON kg_artifacts(name);
CREATE INDEX IF NOT EXISTS idx_kg_sightings_date ON kg_sightings(date);
CREATE INDEX IF NOT EXISTS idx_kg_testimonies_event_ref ON kg_testimonies(event_ref);
CREATE INDEX IF NOT EXISTS idx_kg_topics_name ON kg_topics(name);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_subject ON kg_relationships(subject_entity, subject_type);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_object ON kg_relationships(object_entity, object_type);
CREATE INDEX IF NOT EXISTS idx_kg_entity_mentions_entity ON kg_entity_mentions(entity_name, entity_type);
CREATE INDEX IF NOT EXISTS idx_kg_entity_mentions_document ON kg_entity_mentions(document_id);

-- GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_kg_enhanced_documents_metadata ON kg_enhanced_documents USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_kg_enhanced_documents_entities_found ON kg_enhanced_documents USING GIN(entities_found);
CREATE INDEX IF NOT EXISTS idx_kg_persons_credentials ON kg_persons USING GIN(credentials);
CREATE INDEX IF NOT EXISTS idx_kg_persons_metrics ON kg_persons USING GIN(metrics);
CREATE INDEX IF NOT EXISTS idx_kg_events_environment_conditions ON kg_events USING GIN(environment_conditions);
CREATE INDEX IF NOT EXISTS idx_kg_events_phenomena ON kg_events USING GIN(phenomena);
CREATE INDEX IF NOT EXISTS idx_kg_locations_coordinates ON kg_locations USING GIN(coordinates);
CREATE INDEX IF NOT EXISTS idx_kg_locations_activity_metrics ON kg_locations USING GIN(activity_metrics);
CREATE INDEX IF NOT EXISTS idx_kg_artifacts_chain_of_custody ON kg_artifacts USING GIN(chain_of_custody);
CREATE INDEX IF NOT EXISTS idx_kg_artifacts_physical_properties ON kg_artifacts USING GIN(physical_properties);
CREATE INDEX IF NOT EXISTS idx_kg_sightings_location ON kg_sightings USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_kg_sightings_coordinates ON kg_sightings USING GIN(coordinates);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_metadata ON kg_relationships USING GIN(metadata);

-- Comments for documentation
COMMENT ON TABLE kg_enhanced_documents IS 'Enhanced document storage with knowledge graph metadata';
COMMENT ON TABLE kg_persons IS 'Person entities aligned with existing personnel schema';
COMMENT ON TABLE kg_events IS 'Event entities aligned with existing events schema';
COMMENT ON TABLE kg_organizations IS 'Organization entities aligned with existing organizations schema';
COMMENT ON TABLE kg_locations IS 'Location entities aligned with existing locations schema';
COMMENT ON TABLE kg_artifacts IS 'Artifact entities aligned with existing artifacts schema';
COMMENT ON TABLE kg_sightings IS 'Sighting entities aligned with existing sightings schema';
COMMENT ON TABLE kg_testimonies IS 'Testimony entities aligned with existing testimonies schema';
COMMENT ON TABLE kg_topics IS 'Topic entities aligned with existing topics schema';
COMMENT ON TABLE kg_relationships IS 'Relationships between entities with metadata';
COMMENT ON TABLE kg_entity_mentions IS 'Entity mentions in documents with confidence scores';

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kg_enhanced_documents_updated_at BEFORE UPDATE ON kg_enhanced_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();