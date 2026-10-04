-- Seed Local PostgreSQL Database with Latest CSV Exports
-- Date: July 25, 2025
-- Purpose: Import all CSV exports into postgresql://liamellis@localhost:5432/ultraterrestrial

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop tables if they exist (for clean import)
DROP TABLE IF EXISTS "document-processing-tasks" CASCADE;
DROP TABLE IF EXISTS "document-chunks" CASCADE;
DROP TABLE IF EXISTS "document-entities" CASCADE;
DROP TABLE IF EXISTS "summary-files" CASCADE;
DROP TABLE IF EXISTS "user-saved-sightings" CASCADE;
DROP TABLE IF EXISTS "user-saved-organizations" CASCADE;
DROP TABLE IF EXISTS "user-saved-documents" CASCADE;
DROP TABLE IF EXISTS "user-saved-testimonies" CASCADE;
DROP TABLE IF EXISTS "user-saved-key-figure" CASCADE;
DROP TABLE IF EXISTS "user-saved-topics" CASCADE;
DROP TABLE IF EXISTS "user-saved-events" CASCADE;
DROP TABLE IF EXISTS "user-notes" CASCADE;
DROP TABLE IF EXISTS "event-topic-subject-matter-experts" CASCADE;
DROP TABLE IF EXISTS "topics-testimonies" CASCADE;
DROP TABLE IF EXISTS "organization-members" CASCADE;
DROP TABLE IF EXISTS "topic-subject-matter-experts" CASCADE;
DROP TABLE IF EXISTS "event-subject-matter-experts" CASCADE;
DROP TABLE IF EXISTS mindmaps CASCADE;
DROP TABLE IF EXISTS theories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS testimonies CASCADE;
DROP TABLE IF EXISTS sightings CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS artifacts CASCADE;
DROP TABLE IF EXISTS "key-figures" CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS personnel CASCADE;
DROP TABLE IF EXISTS topics CASCADE;

-- Create core entity tables
CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    name TEXT,
    summary TEXT,
    photo TEXT,
    photos TEXT,
    title TEXT UNIQUE,
    embedding vector(1536),
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE personnel (
    id TEXT PRIMARY KEY,
    bio TEXT,
    role TEXT,
    photo TEXT,
    rank INTEGER,
    credibility INTEGER,
    popularity INTEGER,
    name TEXT UNIQUE,
    authority INTEGER,
    embedding vector(1536),
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE events (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    location TEXT,
    latitude FLOAT,
    longitude FLOAT,
    date TIMESTAMPTZ,
    photos TEXT,
    metadata JSONB DEFAULT '{}',
    title TEXT UNIQUE,
    summary TEXT,
    category TEXT,
    embedding vector(1536),
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT,
    specialization TEXT,
    description TEXT,
    photo TEXT,
    image TEXT,
    title TEXT UNIQUE,
    embedding vector(500),
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "key-figures" (
    id TEXT PRIMARY KEY,
    name TEXT,
    bio TEXT,
    photo TEXT,
    role TEXT,
    rank INTEGER,
    credibility INTEGER,
    popularity INTEGER,
    authority INTEGER,
    embedding TEXT,
    xataversion INTEGER,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE artifacts (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE,
    description TEXT,
    photos TEXT,
    date TEXT,
    source TEXT,
    origin TEXT,
    images TEXT,
    embedding vector(1536),
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE locations (
    id TEXT PRIMARY KEY,
    name TEXT,
    coordinates TEXT,
    "google-maps-location-id" TEXT,
    city TEXT,
    state TEXT,
    latitude FLOAT,
    longitude FLOAT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE sightings (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ,
    description TEXT,
    media_link TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    shape TEXT,
    duration_seconds TEXT,
    duration_hours_min TEXT,
    comments TEXT,
    date_posted TIMESTAMPTZ,
    latitude FLOAT,
    longitude FLOAT,
    media TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    file TEXT,
    summary TEXT,
    embedding vector(1536),
    title TEXT,
    date TIMESTAMPTZ,
    author TEXT,
    organization TEXT,
    url TEXT,
    metadata JSONB,
    images TEXT,
    processed BOOLEAN DEFAULT false,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE testimonies (
    id TEXT PRIMARY KEY,
    claim TEXT,
    event TEXT,
    summary TEXT,
    witness TEXT,
    documentation TEXT,
    date TIMESTAMPTZ,
    organization TEXT,
    source TEXT,
    media TEXT,
    context TEXT,
    embedding vector(1536),
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

-- Junction tables
CREATE TABLE "event-subject-matter-experts" (
    id TEXT PRIMARY KEY,
    event TEXT,
    "subject-matter-expert" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "topic-subject-matter-experts" (
    id TEXT PRIMARY KEY,
    topic TEXT,
    "subject-matter-expert" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "organization-members" (
    id TEXT PRIMARY KEY,
    member TEXT,
    organization TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "topics-testimonies" (
    id TEXT PRIMARY KEY,
    topic TEXT,
    testimony TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "event-topic-subject-matter-experts" (
    id TEXT PRIMARY KEY,
    event TEXT,
    topic TEXT,
    "subject-matter-expert" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

-- User tables
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    photo TEXT,
    profile_image_url TEXT,
    external_id TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-saved-events" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    event TEXT,
    theory TEXT,
    note TEXT,
    "note-title" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-saved-topics" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    topic TEXT,
    theory TEXT,
    note TEXT,
    "note-title" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-saved-key-figure" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    "key-figure" TEXT,
    theory TEXT,
    note TEXT,
    "note-title" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-saved-testimonies" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    testimony TEXT,
    theory TEXT,
    note TEXT,
    "note-title" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-saved-documents" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    document TEXT,
    theory TEXT,
    note TEXT,
    "note-title" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-notes" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    name TEXT,
    content TEXT,
    synopsis TEXT,
    diagrams TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-saved-organizations" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    organization TEXT,
    theory TEXT,
    note TEXT,
    "note-title" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "user-saved-sightings" (
    id TEXT PRIMARY KEY,
    "user" TEXT,
    sighting TEXT,
    theory TEXT,
    note TEXT,
    "note-title" TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

-- Additional tables
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE theories (
    id TEXT PRIMARY KEY,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE mindmaps (
    id TEXT PRIMARY KEY,
    json JSONB DEFAULT '{}',
    embedding vector(1536),
    "user" TEXT,
    file TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "summary-files" (
    id TEXT PRIMARY KEY,
    name TEXT,
    file TEXT,
    source TEXT,
    metadata JSONB,
    images TEXT,
    content TEXT,
    embedding TEXT,
    document TEXT UNIQUE,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "document-entities" (
    id TEXT PRIMARY KEY,
    document TEXT,
    "entity-type" TEXT,
    "entity-data" TEXT,
    metadata JSONB,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "document-chunks" (
    id TEXT PRIMARY KEY,
    document TEXT,
    chunk_index INTEGER,
    content TEXT,
    token_count INTEGER,
    embedding vector(3),
    page_number INTEGER,
    heading TEXT,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

CREATE TABLE "document-processing-tasks" (
    id TEXT PRIMARY KEY,
    document TEXT,
    task TEXT,
    status TEXT,
    metadata JSONB,
    xata_createdat TIMESTAMPTZ DEFAULT NOW(),
    xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
    xata_version INTEGER DEFAULT 0
);

-- Import CSV data using COPY command
-- Note: This will only work if CSV files are accessible to PostgreSQL server

\echo 'Importing CSV data...'

-- Import key-figures (highest priority)
\copy "key-figures" (id,authority,bio,credibility,embedding,name,photo,popularity,rank,role,xataversion) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/key-figures.csv' WITH (FORMAT csv, HEADER true);

-- Import personnel
\copy personnel (id,authority,bio,credibility,embedding,name,photo,popularity,rank,role) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/personnel.csv' WITH (FORMAT csv, HEADER true);

-- Import events
\copy events (id,category,date,description,embedding,latitude,location,longitude,metadata,name,photos,summary,title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/events.csv' WITH (FORMAT csv, HEADER true);

-- Import topics
\copy topics (id,embedding,name,photo,photos,summary,title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/topics.csv' WITH (FORMAT csv, HEADER true);

-- Import organizations
\copy organizations (id,description,embedding,image,name,photo,specialization,title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/organizations.csv' WITH (FORMAT csv, HEADER true);

-- Import testimonies
\copy testimonies (id,claim,context,date,documentation,embedding,event,media,organization,source,summary,witness) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/testimonies.csv' WITH (FORMAT csv, HEADER true);

-- Import documents  
\copy documents (id,author,date,embedding,file,images,metadata,organization,processed,summary,title,url) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/documents.csv' WITH (FORMAT csv, HEADER true);

-- Import sightings
\copy sightings (id,city,comments,country,date,date_posted,description,duration_hours_min,duration_seconds,latitude,longitude,media,media_link,shape,state) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/sightings.csv' WITH (FORMAT csv, HEADER true);

-- Import artifacts
\copy artifacts (id,date,description,embedding,images,name,origin,photos,source) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/artifacts.csv' WITH (FORMAT csv, HEADER true);

-- Import locations
\copy locations (id,city,"google-maps-location-id",latitude,longitude,name,state,coordinates) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/locations.csv' WITH (FORMAT csv, HEADER true);

-- Import junction tables
\copy "event-subject-matter-experts" (id,event,"subject-matter-expert") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/event-subject-matter-experts.csv' WITH (FORMAT csv, HEADER true);

\copy "topic-subject-matter-experts" (id,topic,"subject-matter-expert") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/topic-subject-matter-experts.csv' WITH (FORMAT csv, HEADER true);

\copy "organization-members" (id,member,organization) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/organization-members.csv' WITH (FORMAT csv, HEADER true);

\copy "topics-testimonies" (id,topic,testimony) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/topics-testimonies.csv' WITH (FORMAT csv, HEADER true);

\copy "event-topic-subject-matter-experts" (id,event,topic,"subject-matter-expert") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/event-topic-subject-matter-experts.csv' WITH (FORMAT csv, HEADER true);

-- Import user tables
\copy users (id,email,external_id,name,photo,profile_image_url) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/users.csv' WITH (FORMAT csv, HEADER true);

\copy "user-saved-events" (id,"user",event,theory,note,"note-title") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-saved-events.csv' WITH (FORMAT csv, HEADER true);

\copy "user-saved-topics" (id,"user",topic,theory,note,"note-title") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-saved-topics.csv' WITH (FORMAT csv, HEADER true);

\copy "user-saved-key-figure" (id,"user","key-figure",theory,note,"note-title") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-saved-key-figure.csv' WITH (FORMAT csv, HEADER true);

\copy "user-saved-testimonies" (id,"user",testimony,theory,note,"note-title") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-saved-testimonies.csv' WITH (FORMAT csv, HEADER true);

\copy "user-saved-documents" (id,"user",document,theory,note,"note-title") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-saved-documents.csv' WITH (FORMAT csv, HEADER true);

\copy "user-notes" (id,"user",name,content,synopsis,diagrams) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-notes.csv' WITH (FORMAT csv, HEADER true);

\copy "user-saved-organizations" (id,"user",organization,theory,note,"note-title") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-saved-organizations.csv' WITH (FORMAT csv, HEADER true);

\copy "user-saved-sightings" (id,"user",sighting,theory,note,"note-title") FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/user-saved-sightings.csv' WITH (FORMAT csv, HEADER true);

-- Import remaining tables
\copy tags (id) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/tags.csv' WITH (FORMAT csv, HEADER true);

\copy theories (id) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/theories.csv' WITH (FORMAT csv, HEADER true);

\copy mindmaps (id,json,embedding,"user",file) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/mindmaps.csv' WITH (FORMAT csv, HEADER true);

\copy "summary-files" (id,name,file,source,metadata,images,content,embedding,document) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/summary-files.csv' WITH (FORMAT csv, HEADER true);

\copy "document-entities" (id,document,"entity-type","entity-data",metadata) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/document-entities.csv' WITH (FORMAT csv, HEADER true);

\copy "document-chunks" (id,document,chunk_index,content,token_count,embedding,page_number,heading) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/document-chunks.csv' WITH (FORMAT csv, HEADER true);

\copy "document-processing-tasks" (id,document,task,status,metadata) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/document-processing-tasks.csv' WITH (FORMAT csv, HEADER true);

-- Show final counts
\echo 'Database seeding complete! Table statistics:'

SELECT 'key-figures' as table_name, COUNT(*) as record_count FROM "key-figures"
UNION ALL
SELECT 'personnel', COUNT(*) FROM personnel
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'topics', COUNT(*) FROM topics
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'testimonies', COUNT(*) FROM testimonies
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'sightings', COUNT(*) FROM sightings
UNION ALL
SELECT 'artifacts', COUNT(*) FROM artifacts
UNION ALL
SELECT 'locations', COUNT(*) FROM locations
ORDER BY record_count DESC;

\echo '🎉 Local PostgreSQL database seeded successfully!'