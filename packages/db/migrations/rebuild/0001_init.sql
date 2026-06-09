-- =============================================================================
-- 0001_init.sql  —  Ultraterrestrial data-platform rebuild
-- Target: Azure Database for PostgreSQL Flexible Server (Postgres 16 + pgvector)
-- Created: 2026-06-09
-- Conventions:
--   • id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text  (all tables)
--   • On CSV import the default is overridden with the original rec_* value
--   • vector(1536) NULL on all entity tables (populated in SP#2, empty here)
--   • FK constraints declared at BOTTOM via ALTER TABLE ADD CONSTRAINT
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- 1. topics
-- ---------------------------------------------------------------------------
CREATE TABLE topics (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    name             TEXT,
    summary          TEXT,
    photo            TEXT,
    photos           TEXT[],
    title            TEXT,
    description      TEXT,
    embedding        vector(1536) NULL,
    search_vector    tsvector GENERATED ALWAYS AS (
                         to_tsvector('english',
                             COALESCE(name, '') || ' ' ||
                             COALESCE(summary, '') || ' ' ||
                             COALESCE(description, ''))
                     ) STORED
);
CREATE INDEX idx_topics_embedding    ON topics USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_topics_search       ON topics USING GIN (search_vector);

-- ---------------------------------------------------------------------------
-- 2. personnel
-- ---------------------------------------------------------------------------
CREATE TABLE personnel (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    bio              TEXT,
    role             VARCHAR(255),
    photo            TEXT[],
    rank             INTEGER,
    credibility      INTEGER,
    popularity       INTEGER,
    name             VARCHAR(255),
    authority        INTEGER,
    embedding        vector(1536) NULL,
    search_vector    tsvector GENERATED ALWAYS AS (
                         to_tsvector('english',
                             COALESCE(name, '') || ' ' ||
                             COALESCE(bio, '') || ' ' ||
                             COALESCE(role, ''))
                     ) STORED
);
CREATE INDEX idx_personnel_embedding ON personnel USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_personnel_search    ON personnel USING GIN (search_vector);

-- ---------------------------------------------------------------------------
-- 3. events
-- ---------------------------------------------------------------------------
CREATE TABLE events (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    name             TEXT,
    description      TEXT,
    location         VARCHAR(255),
    latitude         REAL,
    longitude        REAL,
    date             TIMESTAMPTZ,
    photos           TEXT[],
    metadata         JSONB,
    title            VARCHAR(255),
    summary          TEXT,
    category         TEXT[],
    embedding        vector(1536) NULL,
    search_vector    tsvector GENERATED ALWAYS AS (
                         to_tsvector('english',
                             COALESCE(name, '') || ' ' ||
                             COALESCE(description, '') || ' ' ||
                             COALESCE(summary, ''))
                     ) STORED
);
CREATE INDEX idx_events_embedding ON events USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_events_search    ON events USING GIN (search_vector);
CREATE INDEX idx_events_date      ON events (date);

-- ---------------------------------------------------------------------------
-- 4. organizations
-- NOTE: old schema had vector(500) — corrected to vector(1536)
-- ---------------------------------------------------------------------------
CREATE TABLE organizations (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    name             VARCHAR(255),
    specialization   VARCHAR(255),
    description      TEXT,
    photo            TEXT,
    image            TEXT,
    title            VARCHAR(255),
    embedding        vector(1536) NULL
);
CREATE INDEX idx_organizations_embedding ON organizations USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ---------------------------------------------------------------------------
-- 5. sightings
-- ---------------------------------------------------------------------------
CREATE TABLE sightings (
    id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat      TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat      TIMESTAMPTZ DEFAULT NOW(),
    xata_version        INTEGER     DEFAULT 0,
    occurred_at         TIMESTAMPTZ,
    city                VARCHAR(255),
    state               VARCHAR(255),
    country             VARCHAR(255),
    shape               VARCHAR(255),
    duration_seconds    INTEGER,
    duration_hours_min  VARCHAR(255),
    comments            TEXT,
    date_posted         TIMESTAMPTZ,
    latitude            REAL,
    longitude           REAL,
    search_vector       tsvector GENERATED ALWAYS AS (
                            to_tsvector('english', COALESCE(comments, ''))
                        ) STORED
);
CREATE INDEX idx_sightings_search     ON sightings USING GIN (search_vector);
CREATE INDEX idx_sightings_occurred   ON sightings (occurred_at);
CREATE INDEX idx_sightings_country    ON sightings (country);

-- ---------------------------------------------------------------------------
-- 6. testimonies
-- FK columns declared here as TEXT; constraints added at bottom
-- ---------------------------------------------------------------------------
CREATE TABLE testimonies (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    title            TEXT,
    description      TEXT,
    date             TIMESTAMPTZ,
    summary          TEXT,
    event            TEXT,   -- FK → events(id)
    witness          TEXT,   -- FK → personnel(id)
    organization     TEXT,   -- FK → organizations(id)
    embedding        vector(1536) NULL,
    search_vector    tsvector GENERATED ALWAYS AS (
                         to_tsvector('english',
                             COALESCE(description, '') || ' ' ||
                             COALESCE(summary, ''))
                     ) STORED
);
CREATE INDEX idx_testimonies_embedding    ON testimonies USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_testimonies_search       ON testimonies USING GIN (search_vector);
CREATE INDEX idx_testimonies_event        ON testimonies (event);
CREATE INDEX idx_testimonies_witness      ON testimonies (witness);
CREATE INDEX idx_testimonies_organization ON testimonies (organization);

-- ---------------------------------------------------------------------------
-- 7. documents
-- ---------------------------------------------------------------------------
CREATE TABLE documents (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    title            TEXT,
    summary          TEXT,
    url              TEXT,
    date             TIMESTAMPTZ,
    author           TEXT,   -- FK → personnel(id)  ON DELETE SET NULL
    organization     TEXT,   -- FK → organizations(id) ON DELETE SET NULL
    source_type      VARCHAR(255),
    source_tier      TEXT,
    metadata         JSONB,
    embedding        vector(1536) NULL,
    search_vector    tsvector GENERATED ALWAYS AS (
                         to_tsvector('english',
                             COALESCE(title, '') || ' ' ||
                             COALESCE(summary, ''))
                     ) STORED
);
CREATE INDEX idx_documents_embedding    ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_documents_search       ON documents USING GIN (search_vector);
CREATE INDEX idx_documents_author       ON documents (author);
CREATE INDEX idx_documents_organization ON documents (organization);

-- ---------------------------------------------------------------------------
-- 8. artifacts
-- ---------------------------------------------------------------------------
CREATE TABLE artifacts (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    name             TEXT,
    description      TEXT,
    origin           TEXT,
    date             TIMESTAMPTZ,
    images           TEXT[],
    metadata         JSONB,
    embedding        vector(1536) NULL
);
CREATE INDEX idx_artifacts_embedding ON artifacts USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ---------------------------------------------------------------------------
-- 9. locations
-- ---------------------------------------------------------------------------
CREATE TABLE locations (
    id                       TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat           TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat           TIMESTAMPTZ DEFAULT NOW(),
    xata_version             INTEGER     DEFAULT 0,
    name                     VARCHAR(255),
    city                     VARCHAR(255),
    state                    VARCHAR(255),
    country                  VARCHAR(255),
    latitude                 REAL,
    longitude                REAL,
    coordinates              TEXT,
    google_maps_location_id  TEXT
);

-- ---------------------------------------------------------------------------
-- 10. nodes  (graph — unified entity registry)
-- ---------------------------------------------------------------------------
CREATE TABLE nodes (
    id           TEXT PRIMARY KEY,
    entity_type  TEXT NOT NULL,
    label        TEXT
);
CREATE INDEX idx_nodes_entity_type ON nodes (entity_type);

-- ---------------------------------------------------------------------------
-- 11. edges  (graph — relationships extracted by ingestion pipeline)
-- ---------------------------------------------------------------------------
CREATE TABLE edges (
    edge_id     TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    src_id      TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    dst_id      TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    rel_type    TEXT NOT NULL,
    confidence  REAL,
    provenance  JSONB
);
CREATE INDEX idx_edges_src ON edges (src_id);
CREATE INDEX idx_edges_dst ON edges (dst_id);
CREATE INDEX idx_edges_rel ON edges (rel_type);

-- ---------------------------------------------------------------------------
-- 12. event_subject_matter_experts  (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE event_subject_matter_experts (
    id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event                   TEXT,   -- FK → events(id)
    subject_matter_expert   TEXT    -- FK → personnel(id)
);
CREATE INDEX idx_esme_event  ON event_subject_matter_experts (event);
CREATE INDEX idx_esme_expert ON event_subject_matter_experts (subject_matter_expert);

-- ---------------------------------------------------------------------------
-- 13. topic_subject_matter_experts  (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE topic_subject_matter_experts (
    id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    topic                   TEXT,   -- FK → topics(id)
    subject_matter_expert   TEXT    -- FK → personnel(id)
);
CREATE INDEX idx_tsme_topic  ON topic_subject_matter_experts (topic);
CREATE INDEX idx_tsme_expert ON topic_subject_matter_experts (subject_matter_expert);

-- ---------------------------------------------------------------------------
-- 14. organization_members  (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE organization_members (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    member        TEXT,   -- FK → personnel(id)
    organization  TEXT    -- FK → organizations(id)
);
CREATE INDEX idx_org_members_member ON organization_members (member);
CREATE INDEX idx_org_members_org    ON organization_members (organization);

-- ---------------------------------------------------------------------------
-- 15. topics_testimonies  (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE topics_testimonies (
    id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    topic     TEXT,   -- FK → topics(id)
    testimony TEXT    -- FK → testimonies(id)
);
CREATE INDEX idx_tt_topic     ON topics_testimonies (topic);
CREATE INDEX idx_tt_testimony ON topics_testimonies (testimony);

-- ---------------------------------------------------------------------------
-- 16. event_topic_subject_matter_experts  (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE event_topic_subject_matter_experts (
    id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event                   TEXT,   -- FK → events(id)
    topic                   TEXT,   -- FK → topics(id)
    subject_matter_expert   TEXT    -- FK → personnel(id)
);
CREATE INDEX idx_etsme_event  ON event_topic_subject_matter_experts (event);
CREATE INDEX idx_etsme_topic  ON event_topic_subject_matter_experts (topic);
CREATE INDEX idx_etsme_expert ON event_topic_subject_matter_experts (subject_matter_expert);

-- ---------------------------------------------------------------------------
-- 17. users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    auth_id          VARCHAR(255),
    email            VARCHAR(255),
    name             VARCHAR(255)
);
CREATE UNIQUE INDEX idx_users_email   ON users (email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX idx_users_auth_id ON users (auth_id) WHERE auth_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 18. user_notes
-- ---------------------------------------------------------------------------
CREATE TABLE user_notes (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    "user"           TEXT,   -- FK → users(id)
    note_title       TEXT,
    note             TEXT
);
CREATE INDEX idx_user_notes_user ON user_notes ("user");

-- ---------------------------------------------------------------------------
-- 19. mindmaps
-- ---------------------------------------------------------------------------
CREATE TABLE mindmaps (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    "user"           TEXT,   -- FK → users(id)
    title            TEXT,
    description      TEXT,
    graph_data       JSONB,
    embedding        vector(1536) NULL
);
CREATE INDEX idx_mindmaps_embedding ON mindmaps USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_mindmaps_user      ON mindmaps ("user");

-- ---------------------------------------------------------------------------
-- 20. user_saved_events
-- ---------------------------------------------------------------------------
CREATE TABLE user_saved_events (
    id       TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user"   TEXT,   -- FK → users(id)
    event    TEXT,   -- FK → events(id)
    theory   TEXT    -- FK → user_notes(id)
);
CREATE INDEX idx_use_user   ON user_saved_events ("user");
CREATE INDEX idx_use_event  ON user_saved_events (event);
CREATE INDEX idx_use_theory ON user_saved_events (theory);

-- ---------------------------------------------------------------------------
-- 21. user_saved_topics
-- ---------------------------------------------------------------------------
CREATE TABLE user_saved_topics (
    id       TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user"   TEXT,   -- FK → users(id)
    topic    TEXT,   -- FK → topics(id)
    theory   TEXT    -- FK → user_notes(id)
);
CREATE INDEX idx_ust_user   ON user_saved_topics ("user");
CREATE INDEX idx_ust_topic  ON user_saved_topics (topic);
CREATE INDEX idx_ust_theory ON user_saved_topics (theory);

-- ---------------------------------------------------------------------------
-- 22. user_saved_organizations
-- ---------------------------------------------------------------------------
CREATE TABLE user_saved_organizations (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user"        TEXT,   -- FK → users(id)
    organization  TEXT,   -- FK → organizations(id)
    theory        TEXT    -- FK → user_notes(id)
);
CREATE INDEX idx_uso_user   ON user_saved_organizations ("user");
CREATE INDEX idx_uso_org    ON user_saved_organizations (organization);
CREATE INDEX idx_uso_theory ON user_saved_organizations (theory);

-- ---------------------------------------------------------------------------
-- 23. user_saved_sightings
-- ---------------------------------------------------------------------------
CREATE TABLE user_saved_sightings (
    id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user"    TEXT,   -- FK → users(id)
    sighting  TEXT,   -- FK → sightings(id)
    theory    TEXT    -- FK → user_notes(id)
);
CREATE INDEX idx_uss_user    ON user_saved_sightings ("user");
CREATE INDEX idx_uss_sight   ON user_saved_sightings (sighting);
CREATE INDEX idx_uss_theory  ON user_saved_sightings (theory);

-- ---------------------------------------------------------------------------
-- 24. user_saved_testimonies
-- ---------------------------------------------------------------------------
CREATE TABLE user_saved_testimonies (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user"     TEXT,   -- FK → users(id)
    testimony  TEXT,   -- FK → testimonies(id)
    theory     TEXT    -- FK → user_notes(id)
);
CREATE INDEX idx_ustm_user    ON user_saved_testimonies ("user");
CREATE INDEX idx_ustm_test    ON user_saved_testimonies (testimony);
CREATE INDEX idx_ustm_theory  ON user_saved_testimonies (theory);

-- ---------------------------------------------------------------------------
-- 25. user_saved_key_figure
-- ---------------------------------------------------------------------------
CREATE TABLE user_saved_key_figure (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user"      TEXT,   -- FK → users(id)
    key_figure  TEXT,   -- FK → personnel(id)
    theory      TEXT    -- FK → user_notes(id)
);
CREATE INDEX idx_uskf_user   ON user_saved_key_figure ("user");
CREATE INDEX idx_uskf_kf     ON user_saved_key_figure (key_figure);
CREATE INDEX idx_uskf_theory ON user_saved_key_figure (theory);

-- ---------------------------------------------------------------------------
-- 26. summary_files  (pipeline scaffolding — 1:1 with documents)
-- ---------------------------------------------------------------------------
CREATE TABLE summary_files (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    xata_version     INTEGER     DEFAULT 0,
    document         TEXT UNIQUE,   -- FK → documents(id) ON DELETE CASCADE
    content          TEXT,
    embedding        vector(1536) NULL
);
CREATE INDEX idx_summary_files_doc ON summary_files (document);

-- ---------------------------------------------------------------------------
-- 27. document_chunks  (pipeline scaffolding)
-- NOTE: old schema had vector(3) placeholder — corrected to vector(1536)
-- ---------------------------------------------------------------------------
CREATE TABLE document_chunks (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    document         TEXT,       -- FK → documents(id) ON DELETE CASCADE
    chunk_index      INTEGER,
    content          TEXT,
    tokens           INTEGER,
    embedding        vector(1536) NULL
);
CREATE INDEX idx_doc_chunks_doc       ON document_chunks (document);
CREATE INDEX idx_doc_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ---------------------------------------------------------------------------
-- 28. document_entities  (pipeline scaffolding)
-- ---------------------------------------------------------------------------
CREATE TABLE document_entities (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    document         TEXT,   -- FK → documents(id) ON DELETE CASCADE
    entity_type      TEXT,
    entity_name      TEXT,
    confidence       REAL,
    context          TEXT,
    metadata         JSONB
);
CREATE INDEX idx_doc_entities_doc  ON document_entities (document);
CREATE INDEX idx_doc_entities_type ON document_entities (entity_type);

-- ---------------------------------------------------------------------------
-- 29. document_processing_tasks  (pipeline scaffolding)
-- ---------------------------------------------------------------------------
CREATE TABLE document_processing_tasks (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    xata_createdat   TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat   TIMESTAMPTZ DEFAULT NOW(),
    document         TEXT,   -- FK → documents(id) ON DELETE CASCADE
    task_type        TEXT,
    status           TEXT,
    started_at       TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    error            TEXT,
    metadata         JSONB
);
CREATE INDEX idx_doc_tasks_doc    ON document_processing_tasks (document);
CREATE INDEX idx_doc_tasks_status ON document_processing_tasks (status);

-- =============================================================================
-- xata_updatedat trigger function (mirrors Xata auto-update behaviour)
-- =============================================================================
CREATE OR REPLACE FUNCTION update_xata_updatedat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.xata_updatedat = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_topics_updatedat
    BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_personnel_updatedat
    BEFORE UPDATE ON personnel FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_events_updatedat
    BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_organizations_updatedat
    BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_sightings_updatedat
    BEFORE UPDATE ON sightings FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_testimonies_updatedat
    BEFORE UPDATE ON testimonies FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_documents_updatedat
    BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_artifacts_updatedat
    BEFORE UPDATE ON artifacts FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_locations_updatedat
    BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_users_updatedat
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_user_notes_updatedat
    BEFORE UPDATE ON user_notes FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_mindmaps_updatedat
    BEFORE UPDATE ON mindmaps FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_summary_files_updatedat
    BEFORE UPDATE ON summary_files FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_doc_chunks_updatedat
    BEFORE UPDATE ON document_chunks FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_doc_entities_updatedat
    BEFORE UPDATE ON document_entities FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();
CREATE TRIGGER trg_doc_tasks_updatedat
    BEFORE UPDATE ON document_processing_tasks FOR EACH ROW EXECUTE FUNCTION update_xata_updatedat();

-- =============================================================================
-- FOREIGN KEY CONSTRAINTS
-- Declared last so bulk loading can proceed without constraint ordering concerns.
-- =============================================================================

-- testimonies soft refs
ALTER TABLE testimonies
    ADD CONSTRAINT fk_testimonies_event
        FOREIGN KEY (event) REFERENCES events(id) ON DELETE SET NULL;
ALTER TABLE testimonies
    ADD CONSTRAINT fk_testimonies_witness
        FOREIGN KEY (witness) REFERENCES personnel(id) ON DELETE SET NULL;
ALTER TABLE testimonies
    ADD CONSTRAINT fk_testimonies_organization
        FOREIGN KEY (organization) REFERENCES organizations(id) ON DELETE SET NULL;

-- documents soft refs
ALTER TABLE documents
    ADD CONSTRAINT fk_documents_author
        FOREIGN KEY (author) REFERENCES personnel(id) ON DELETE SET NULL;
ALTER TABLE documents
    ADD CONSTRAINT fk_documents_organization
        FOREIGN KEY (organization) REFERENCES organizations(id) ON DELETE SET NULL;

-- pipeline tables → documents (cascade)
ALTER TABLE summary_files
    ADD CONSTRAINT fk_summary_files_document
        FOREIGN KEY (document) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_chunks
    ADD CONSTRAINT fk_document_chunks_document
        FOREIGN KEY (document) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_entities
    ADD CONSTRAINT fk_document_entities_document
        FOREIGN KEY (document) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_processing_tasks
    ADD CONSTRAINT fk_document_processing_tasks_document
        FOREIGN KEY (document) REFERENCES documents(id) ON DELETE CASCADE;

-- junction: event_subject_matter_experts
ALTER TABLE event_subject_matter_experts
    ADD CONSTRAINT fk_esme_event
        FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE event_subject_matter_experts
    ADD CONSTRAINT fk_esme_expert
        FOREIGN KEY (subject_matter_expert) REFERENCES personnel(id) ON DELETE CASCADE;

-- junction: topic_subject_matter_experts
ALTER TABLE topic_subject_matter_experts
    ADD CONSTRAINT fk_tsme_topic
        FOREIGN KEY (topic) REFERENCES topics(id) ON DELETE CASCADE;
ALTER TABLE topic_subject_matter_experts
    ADD CONSTRAINT fk_tsme_expert
        FOREIGN KEY (subject_matter_expert) REFERENCES personnel(id) ON DELETE CASCADE;

-- junction: organization_members
ALTER TABLE organization_members
    ADD CONSTRAINT fk_org_members_member
        FOREIGN KEY (member) REFERENCES personnel(id) ON DELETE CASCADE;
ALTER TABLE organization_members
    ADD CONSTRAINT fk_org_members_organization
        FOREIGN KEY (organization) REFERENCES organizations(id) ON DELETE CASCADE;

-- junction: topics_testimonies
ALTER TABLE topics_testimonies
    ADD CONSTRAINT fk_tt_topic
        FOREIGN KEY (topic) REFERENCES topics(id) ON DELETE CASCADE;
ALTER TABLE topics_testimonies
    ADD CONSTRAINT fk_tt_testimony
        FOREIGN KEY (testimony) REFERENCES testimonies(id) ON DELETE CASCADE;

-- junction: event_topic_subject_matter_experts
ALTER TABLE event_topic_subject_matter_experts
    ADD CONSTRAINT fk_etsme_event
        FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE event_topic_subject_matter_experts
    ADD CONSTRAINT fk_etsme_topic
        FOREIGN KEY (topic) REFERENCES topics(id) ON DELETE CASCADE;
ALTER TABLE event_topic_subject_matter_experts
    ADD CONSTRAINT fk_etsme_expert
        FOREIGN KEY (subject_matter_expert) REFERENCES personnel(id) ON DELETE CASCADE;

-- user_notes
ALTER TABLE user_notes
    ADD CONSTRAINT fk_user_notes_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE CASCADE;

-- mindmaps
ALTER TABLE mindmaps
    ADD CONSTRAINT fk_mindmaps_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE SET NULL;

-- user_saved_events
ALTER TABLE user_saved_events
    ADD CONSTRAINT fk_use_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_saved_events
    ADD CONSTRAINT fk_use_event
        FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE user_saved_events
    ADD CONSTRAINT fk_use_theory
        FOREIGN KEY (theory) REFERENCES user_notes(id) ON DELETE SET NULL;

-- user_saved_topics
ALTER TABLE user_saved_topics
    ADD CONSTRAINT fk_ust_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_saved_topics
    ADD CONSTRAINT fk_ust_topic
        FOREIGN KEY (topic) REFERENCES topics(id) ON DELETE CASCADE;
ALTER TABLE user_saved_topics
    ADD CONSTRAINT fk_ust_theory
        FOREIGN KEY (theory) REFERENCES user_notes(id) ON DELETE SET NULL;

-- user_saved_organizations
ALTER TABLE user_saved_organizations
    ADD CONSTRAINT fk_uso_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_saved_organizations
    ADD CONSTRAINT fk_uso_organization
        FOREIGN KEY (organization) REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE user_saved_organizations
    ADD CONSTRAINT fk_uso_theory
        FOREIGN KEY (theory) REFERENCES user_notes(id) ON DELETE SET NULL;

-- user_saved_sightings
ALTER TABLE user_saved_sightings
    ADD CONSTRAINT fk_uss_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_saved_sightings
    ADD CONSTRAINT fk_uss_sighting
        FOREIGN KEY (sighting) REFERENCES sightings(id) ON DELETE CASCADE;
ALTER TABLE user_saved_sightings
    ADD CONSTRAINT fk_uss_theory
        FOREIGN KEY (theory) REFERENCES user_notes(id) ON DELETE SET NULL;

-- user_saved_testimonies
ALTER TABLE user_saved_testimonies
    ADD CONSTRAINT fk_ustm_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_saved_testimonies
    ADD CONSTRAINT fk_ustm_testimony
        FOREIGN KEY (testimony) REFERENCES testimonies(id) ON DELETE CASCADE;
ALTER TABLE user_saved_testimonies
    ADD CONSTRAINT fk_ustm_theory
        FOREIGN KEY (theory) REFERENCES user_notes(id) ON DELETE SET NULL;

-- user_saved_key_figure
ALTER TABLE user_saved_key_figure
    ADD CONSTRAINT fk_uskf_user
        FOREIGN KEY ("user") REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_saved_key_figure
    ADD CONSTRAINT fk_uskf_key_figure
        FOREIGN KEY (key_figure) REFERENCES personnel(id) ON DELETE CASCADE;
ALTER TABLE user_saved_key_figure
    ADD CONSTRAINT fk_uskf_theory
        FOREIGN KEY (theory) REFERENCES user_notes(id) ON DELETE SET NULL;

-- =============================================================================
-- END 0001_init.sql
-- =============================================================================
