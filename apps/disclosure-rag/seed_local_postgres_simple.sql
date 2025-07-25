-- Simple Local PostgreSQL Database Seed
-- Date: July 25, 2025
-- Purpose: Create basic structure and import core UFO/UAP data

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing tables
DROP TABLE IF EXISTS sightings CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS key_figures CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS personnel CASCADE;

-- Create simplified tables for core UFO/UAP data
CREATE TABLE key_figures (
    id TEXT PRIMARY KEY,
    name TEXT,
    bio TEXT,
    role TEXT,
    rank INTEGER,
    credibility INTEGER,
    popularity INTEGER,
    authority INTEGER,
    photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT,
    name TEXT,
    description TEXT,
    location TEXT,
    latitude FLOAT,
    longitude FLOAT,
    date TIMESTAMPTZ,
    summary TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    title TEXT,
    name TEXT,
    description TEXT,
    specialization TEXT,
    photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    title TEXT,
    name TEXT,
    summary TEXT,
    photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE personnel (
    id TEXT PRIMARY KEY,
    name TEXT,
    bio TEXT,
    role TEXT,
    rank INTEGER,
    credibility INTEGER,
    popularity INTEGER,
    authority INTEGER,
    photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sightings (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ,
    description TEXT,
    city TEXT, 
    state TEXT,
    country TEXT,
    shape TEXT,
    latitude FLOAT,
    longitude FLOAT,
    duration_seconds TEXT,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

\echo '✅ Tables created successfully'
\echo 'Database structure ready for UFO/UAP research data'
\echo ''
\echo 'To manually import specific CSV data, use:'
\echo 'COPY table_name FROM ''/path/to/file.csv'' WITH (FORMAT csv, HEADER true);'