-- PostgreSQL migration script to replicate Xata database structure
-- Generated from schema.json

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create all tables first (without foreign keys)

CREATE TABLE topics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    name VARCHAR(255),
    summary TEXT,
    photo TEXT,
    photos TEXT[],
    title VARCHAR(255),
    embedding vector(1536)
);
CREATE INDEX idx_topics_embedding ON topics USING ivfflat (embedding vector_cosine_ops);
ALTER TABLE topics ADD CONSTRAINT uk_topics_title UNIQUE (title);

CREATE TABLE personnel (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    bio TEXT,
    role VARCHAR(255),
    photo TEXT[],
    rank INTEGER,
    credibility INTEGER,
    popularity INTEGER,
    name VARCHAR(255),
    authority INTEGER,
    embedding vector(1536)
);
CREATE INDEX idx_personnel_embedding ON personnel USING ivfflat (embedding vector_cosine_ops);
ALTER TABLE personnel ADD CONSTRAINT uk_personnel_name UNIQUE (name);

CREATE TABLE events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    name TEXT,
    description TEXT,
    location VARCHAR(255),
    latitude REAL,
    longitude REAL,
    date TIMESTAMP WITH TIME ZONE,
    photos TEXT[],
    metadata JSONB,
    title VARCHAR(255),
    summary TEXT,
    category TEXT[],
    embedding vector(1536)
);
CREATE INDEX idx_events_embedding ON events USING ivfflat (embedding vector_cosine_ops);
ALTER TABLE events ADD CONSTRAINT uk_events_title UNIQUE (title);

CREATE TABLE organizations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    name VARCHAR(255),
    specialization VARCHAR(255),
    description TEXT,
    photo TEXT,
    image TEXT,
    title VARCHAR(255),
    embedding vector(500)
);
CREATE INDEX idx_organizations_embedding ON organizations USING ivfflat (embedding vector_cosine_ops);
ALTER TABLE organizations ADD CONSTRAINT uk_organizations_title UNIQUE (title);

CREATE TABLE sightings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE,
    description VARCHAR(255),
    media_link VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    shape VARCHAR(255),
    duration_seconds VARCHAR(255),
    duration_hours_min VARCHAR(255),
    comments VARCHAR(255),
    date_posted TIMESTAMP WITH TIME ZONE,
    latitude REAL,
    longitude REAL,
    media TEXT[]
);

CREATE TABLE event_subject_matter_experts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    event TEXT,
    subject_matter_expert TEXT
);
CREATE INDEX idx_event_subject_matter_experts_event ON event_subject_matter_experts(event);
CREATE INDEX idx_event_subject_matter_experts_subject_matter_expert ON event_subject_matter_experts(subject_matter_expert);

CREATE TABLE topic_subject_matter_experts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    topic TEXT,
    subject_matter_expert TEXT
);
CREATE INDEX idx_topic_subject_matter_experts_topic ON topic_subject_matter_experts(topic);
CREATE INDEX idx_topic_subject_matter_experts_subject_matter_expert ON topic_subject_matter_experts(subject_matter_expert);

CREATE TABLE organization_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    member TEXT,
    organization TEXT
);
CREATE INDEX idx_organization_members_member ON organization_members(member);
CREATE INDEX idx_organization_members_organization ON organization_members(organization);

CREATE TABLE testimonies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    claim TEXT,
    event TEXT,
    summary TEXT,
    witness TEXT,
    documentation TEXT[],
    date TIMESTAMP WITH TIME ZONE,
    organization TEXT,
    source TEXT,
    media TEXT[],
    context TEXT,
    embedding vector(1536)
);
CREATE INDEX idx_testimonies_event ON testimonies(event);
CREATE INDEX idx_testimonies_witness ON testimonies(witness);
CREATE INDEX idx_testimonies_organization ON testimonies(organization);
CREATE INDEX idx_testimonies_embedding ON testimonies USING ivfflat (embedding vector_cosine_ops);

CREATE TABLE topics_testimonies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    topic TEXT,
    testimony TEXT
);
CREATE INDEX idx_topics_testimonies_topic ON topics_testimonies(topic);
CREATE INDEX idx_topics_testimonies_testimony ON topics_testimonies(testimony);

CREATE TABLE documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    file TEXT[],
    summary TEXT,
    embedding vector(1536),
    title VARCHAR(255),
    date TIMESTAMP WITH TIME ZONE,
    author TEXT,
    organization TEXT,
    url TEXT,
    metadata JSONB,
    images TEXT[],
    processed TEXT
);
CREATE INDEX idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_documents_author ON documents(author);
CREATE INDEX idx_documents_organization ON documents(organization);

CREATE TABLE locations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    name VARCHAR(255),
    coordinates VARCHAR(255),
    google_maps_location_id TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    latitude REAL,
    longitude REAL
);

CREATE TABLE event_topic_subject_matter_experts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    event TEXT,
    topic TEXT,
    subject_matter_expert TEXT
);
CREATE INDEX idx_event_topic_subject_matter_experts_event ON event_topic_subject_matter_experts(event);
CREATE INDEX idx_event_topic_subject_matter_experts_topic ON event_topic_subject_matter_experts(topic);
CREATE INDEX idx_event_topic_subject_matter_experts_subject_matter_expert ON event_topic_subject_matter_experts(subject_matter_expert);

CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    email TEXT,
    name VARCHAR(255),
    photo TEXT,
    profile_image_url VARCHAR(255),
    external_id VARCHAR(255)
);
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);

CREATE TABLE user_saved_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    event TEXT,
    theory TEXT,
    note TEXT,
    note_title VARCHAR(255)
);
CREATE INDEX idx_user_saved_events_user ON user_saved_events("user");
CREATE INDEX idx_user_saved_events_event ON user_saved_events(event);
CREATE INDEX idx_user_saved_events_theory ON user_saved_events(theory);

CREATE TABLE user_saved_topics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    topic TEXT,
    theory TEXT,
    note TEXT,
    note_title VARCHAR(255)
);
CREATE INDEX idx_user_saved_topics_user ON user_saved_topics("user");
CREATE INDEX idx_user_saved_topics_topic ON user_saved_topics(topic);
CREATE INDEX idx_user_saved_topics_theory ON user_saved_topics(theory);

CREATE TABLE user_saved_key_figure (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    key_figure TEXT,
    theory TEXT,
    note TEXT,
    note_title VARCHAR(255)
);
CREATE INDEX idx_user_saved_key_figure_user ON user_saved_key_figure("user");
CREATE INDEX idx_user_saved_key_figure_key_figure ON user_saved_key_figure(key_figure);
CREATE INDEX idx_user_saved_key_figure_theory ON user_saved_key_figure(theory);

CREATE TABLE user_saved_testimonies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    testimony TEXT,
    theory TEXT,
    note TEXT,
    note_title VARCHAR(255)
);
CREATE INDEX idx_user_saved_testimonies_user ON user_saved_testimonies("user");
CREATE INDEX idx_user_saved_testimonies_testimony ON user_saved_testimonies(testimony);
CREATE INDEX idx_user_saved_testimonies_theory ON user_saved_testimonies(theory);

CREATE TABLE user_saved_documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    document TEXT,
    theory TEXT,
    note TEXT,
    note_title VARCHAR(255)
);
CREATE INDEX idx_user_saved_documents_user ON user_saved_documents("user");
CREATE INDEX idx_user_saved_documents_document ON user_saved_documents(document);
CREATE INDEX idx_user_saved_documents_theory ON user_saved_documents(theory);

CREATE TABLE user_notes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    name VARCHAR(255),
    content TEXT,
    synopsis TEXT,
    diagrams TEXT[]
);
CREATE INDEX idx_user_notes_user ON user_notes("user");

CREATE TABLE user_saved_organizations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    organization TEXT,
    theory TEXT,
    note TEXT,
    note_title VARCHAR(255)
);
CREATE INDEX idx_user_saved_organizations_user ON user_saved_organizations("user");
CREATE INDEX idx_user_saved_organizations_organization ON user_saved_organizations(organization);
CREATE INDEX idx_user_saved_organizations_theory ON user_saved_organizations(theory);

CREATE TABLE user_saved_sightings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    "user" TEXT,
    sighting TEXT,
    theory TEXT,
    note TEXT,
    note_title VARCHAR(255)
);
CREATE INDEX idx_user_saved_sightings_user ON user_saved_sightings("user");
CREATE INDEX idx_user_saved_sightings_sighting ON user_saved_sightings(sighting);
CREATE INDEX idx_user_saved_sightings_theory ON user_saved_sightings(theory);

CREATE TABLE tags (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,

);

CREATE TABLE theories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,

);

CREATE TABLE mindmaps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    json JSONB,
    embedding vector(1536),
    "user" TEXT,
    file TEXT
);
CREATE INDEX idx_mindmaps_embedding ON mindmaps USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_mindmaps_user ON mindmaps("user");

CREATE TABLE artifacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    name VARCHAR(255),
    description TEXT,
    photos TEXT[],
    date VARCHAR(255),
    source TEXT,
    origin TEXT,
    images TEXT[],
    embedding vector(1536)
);
CREATE INDEX idx_artifacts_embedding ON artifacts USING ivfflat (embedding vector_cosine_ops);
ALTER TABLE artifacts ADD CONSTRAINT uk_artifacts_name UNIQUE (name);

CREATE TABLE key_figures (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    name TEXT,
    bio TEXT,
    photo TEXT,
    role TEXT,
    rank INTEGER,
    credibility INTEGER,
    popularity INTEGER,
    authority INTEGER,
    embedding TEXT,
    xataversion INTEGER
);

CREATE TABLE summary_files (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    name TEXT,
    file TEXT,
    source TEXT,
    metadata JSONB,
    images TEXT,
    content TEXT,
    embedding TEXT[],
    document TEXT
);
CREATE INDEX idx_summary_files_document ON summary_files(document);

CREATE TABLE document_entities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    document TEXT,
    entity_type TEXT[],
    entity_data TEXT,
    metadata JSONB
);
CREATE INDEX idx_document_entities_document ON document_entities(document);

CREATE TABLE document_chunks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    document TEXT,
    chunk_index INTEGER,
    content TEXT,
    token_count INTEGER,
    embedding vector(3),
    page_number INTEGER,
    heading TEXT
);
CREATE INDEX idx_document_chunks_document ON document_chunks(document);
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

CREATE TABLE document_processing_tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0,
    document TEXT,
    task TEXT[],
    status TEXT,
    metadata JSONB
);
CREATE INDEX idx_document_processing_tasks_document ON document_processing_tasks(document);

-- Add foreign key constraints
ALTER TABLE event_subject_matter_experts ADD CONSTRAINT fk_event_subject_matter_experts_event FOREIGN KEY (event) REFERENCES events(id);
ALTER TABLE event_subject_matter_experts ADD CONSTRAINT fk_event_subject_matter_experts_subject_matter_expert FOREIGN KEY (subject_matter_expert) REFERENCES personnel(id);
ALTER TABLE topic_subject_matter_experts ADD CONSTRAINT fk_topic_subject_matter_experts_topic FOREIGN KEY (topic) REFERENCES topics(id);
ALTER TABLE topic_subject_matter_experts ADD CONSTRAINT fk_topic_subject_matter_experts_subject_matter_expert FOREIGN KEY (subject_matter_expert) REFERENCES personnel(id);
ALTER TABLE organization_members ADD CONSTRAINT fk_organization_members_member FOREIGN KEY (member) REFERENCES personnel(id);
ALTER TABLE organization_members ADD CONSTRAINT fk_organization_members_organization FOREIGN KEY (organization) REFERENCES organizations(id);
ALTER TABLE testimonies ADD CONSTRAINT fk_testimonies_event FOREIGN KEY (event) REFERENCES events(id);
ALTER TABLE testimonies ADD CONSTRAINT fk_testimonies_witness FOREIGN KEY (witness) REFERENCES personnel(id);
ALTER TABLE testimonies ADD CONSTRAINT fk_testimonies_organization FOREIGN KEY (organization) REFERENCES organizations(id);
ALTER TABLE topics_testimonies ADD CONSTRAINT fk_topics_testimonies_topic FOREIGN KEY (topic) REFERENCES topics(id);
ALTER TABLE topics_testimonies ADD CONSTRAINT fk_topics_testimonies_testimony FOREIGN KEY (testimony) REFERENCES testimonies(id);
ALTER TABLE documents ADD CONSTRAINT fk_documents_author FOREIGN KEY (author) REFERENCES personnel(id);
ALTER TABLE documents ADD CONSTRAINT fk_documents_organization FOREIGN KEY (organization) REFERENCES organizations(id);
ALTER TABLE event_topic_subject_matter_experts ADD CONSTRAINT fk_event_topic_subject_matter_experts_event FOREIGN KEY (event) REFERENCES events(id);
ALTER TABLE event_topic_subject_matter_experts ADD CONSTRAINT fk_event_topic_subject_matter_experts_topic FOREIGN KEY (topic) REFERENCES topics(id);
ALTER TABLE event_topic_subject_matter_experts ADD CONSTRAINT fk_event_topic_subject_matter_experts_subject_matter_expert FOREIGN KEY (subject_matter_expert) REFERENCES personnel(id);
ALTER TABLE user_saved_events ADD CONSTRAINT fk_user_saved_events_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_events ADD CONSTRAINT fk_user_saved_events_event FOREIGN KEY (event) REFERENCES events(id);
ALTER TABLE user_saved_events ADD CONSTRAINT fk_user_saved_events_theory FOREIGN KEY (theory) REFERENCES user_notes(id);
ALTER TABLE user_saved_topics ADD CONSTRAINT fk_user_saved_topics_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_topics ADD CONSTRAINT fk_user_saved_topics_topic FOREIGN KEY (topic) REFERENCES topics(id);
ALTER TABLE user_saved_topics ADD CONSTRAINT fk_user_saved_topics_theory FOREIGN KEY (theory) REFERENCES user_notes(id);
ALTER TABLE user_saved_key_figure ADD CONSTRAINT fk_user_saved_key_figure_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_key_figure ADD CONSTRAINT fk_user_saved_key_figure_key_figure FOREIGN KEY (key_figure) REFERENCES personnel(id);
ALTER TABLE user_saved_key_figure ADD CONSTRAINT fk_user_saved_key_figure_theory FOREIGN KEY (theory) REFERENCES user_notes(id);
ALTER TABLE user_saved_testimonies ADD CONSTRAINT fk_user_saved_testimonies_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_testimonies ADD CONSTRAINT fk_user_saved_testimonies_testimony FOREIGN KEY (testimony) REFERENCES testimonies(id);
ALTER TABLE user_saved_testimonies ADD CONSTRAINT fk_user_saved_testimonies_theory FOREIGN KEY (theory) REFERENCES user_notes(id);
ALTER TABLE user_saved_documents ADD CONSTRAINT fk_user_saved_documents_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_documents ADD CONSTRAINT fk_user_saved_documents_document FOREIGN KEY (document) REFERENCES documents(id);
ALTER TABLE user_saved_documents ADD CONSTRAINT fk_user_saved_documents_theory FOREIGN KEY (theory) REFERENCES user_notes(id);
ALTER TABLE user_notes ADD CONSTRAINT fk_user_notes_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_organizations ADD CONSTRAINT fk_user_saved_organizations_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_organizations ADD CONSTRAINT fk_user_saved_organizations_organization FOREIGN KEY (organization) REFERENCES organizations(id);
ALTER TABLE user_saved_organizations ADD CONSTRAINT fk_user_saved_organizations_theory FOREIGN KEY (theory) REFERENCES user_notes(id);
ALTER TABLE user_saved_sightings ADD CONSTRAINT fk_user_saved_sightings_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE user_saved_sightings ADD CONSTRAINT fk_user_saved_sightings_sighting FOREIGN KEY (sighting) REFERENCES sightings(id);
ALTER TABLE user_saved_sightings ADD CONSTRAINT fk_user_saved_sightings_theory FOREIGN KEY (theory) REFERENCES user_notes(id);
ALTER TABLE mindmaps ADD CONSTRAINT fk_mindmaps_user FOREIGN KEY ("user") REFERENCES users(id);
ALTER TABLE summary_files ADD CONSTRAINT fk_summary_files_document FOREIGN KEY (document) REFERENCES documents(id);
ALTER TABLE document_entities ADD CONSTRAINT fk_document_entities_document FOREIGN KEY (document) REFERENCES documents(id);
ALTER TABLE document_chunks ADD CONSTRAINT fk_document_chunks_document FOREIGN KEY (document) REFERENCES documents(id);
ALTER TABLE document_processing_tasks ADD CONSTRAINT fk_document_processing_tasks_document FOREIGN KEY (document) REFERENCES documents(id);

-- Create function to update xata_updatedat
CREATE OR REPLACE FUNCTION update_xata_updatedat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.xata_updatedat = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all tables
CREATE TRIGGER trg_update_topics_updatedat BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_personnel_updatedat BEFORE UPDATE ON personnel FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_events_updatedat BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_organizations_updatedat BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_sightings_updatedat BEFORE UPDATE ON sightings FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_event_subject_matter_experts_updatedat BEFORE UPDATE ON event_subject_matter_experts FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_topic_subject_matter_experts_updatedat BEFORE UPDATE ON topic_subject_matter_experts FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_organization_members_updatedat BEFORE UPDATE ON organization_members FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_testimonies_updatedat BEFORE UPDATE ON testimonies FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_topics_testimonies_updatedat BEFORE UPDATE ON topics_testimonies FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_documents_updatedat BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_locations_updatedat BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_event_topic_subject_matter_experts_updatedat BEFORE UPDATE ON event_topic_subject_matter_experts FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_users_updatedat BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_saved_events_updatedat BEFORE UPDATE ON user_saved_events FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_saved_topics_updatedat BEFORE UPDATE ON user_saved_topics FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_saved_key_figure_updatedat BEFORE UPDATE ON user_saved_key_figure FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_saved_testimonies_updatedat BEFORE UPDATE ON user_saved_testimonies FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_saved_documents_updatedat BEFORE UPDATE ON user_saved_documents FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_notes_updatedat BEFORE UPDATE ON user_notes FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_saved_organizations_updatedat BEFORE UPDATE ON user_saved_organizations FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_user_saved_sightings_updatedat BEFORE UPDATE ON user_saved_sightings FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_tags_updatedat BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_theories_updatedat BEFORE UPDATE ON theories FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_mindmaps_updatedat BEFORE UPDATE ON mindmaps FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_artifacts_updatedat BEFORE UPDATE ON artifacts FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_key_figures_updatedat BEFORE UPDATE ON key_figures FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_summary_files_updatedat BEFORE UPDATE ON summary_files FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_document_entities_updatedat BEFORE UPDATE ON document_entities FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_document_chunks_updatedat BEFORE UPDATE ON document_chunks FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_update_document_processing_tasks_updatedat BEFORE UPDATE ON document_processing_tasks FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
