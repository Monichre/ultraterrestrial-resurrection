-- Clean and Seed Local PostgreSQL Database
-- Date: July 25, 2025  
-- Purpose: Clean existing tables and create proper schema matching Xata exports

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop ALL existing tables to start fresh
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO liamellis;
GRANT ALL ON SCHEMA public TO public;

-- Recreate vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create tables matching Xata schema exactly
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

\echo '🎉 Database schema created successfully!'
\echo 'Tables created:'
\echo '  - topics, personnel, events, organizations'  
\echo '  - key-figures, artifacts, locations'
\echo '  - sightings, documents, testimonies'
\echo ''
\echo 'Ready for CSV import. Database is clean and matches Xata schema.'