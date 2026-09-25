CREATE TABLE IF NOT EXISTS "topics" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "name" text,
    "summary" text,
    "photo" jsonb,
    "photos" jsonb,
    "title" text,
    "embedding" vector(1536)
);

CREATE TABLE IF NOT EXISTS "personnel" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "bio" text,
    "role" text,
    "photo" jsonb,
    "rank" integer,
    "credibility" integer,
    "popularity" integer,
    "name" text,
    "authority" integer,
    "embedding" vector(1536)
);

CREATE TABLE IF NOT EXISTS "events" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "name" text,
    "description" text,
    "location" text,
    "latitude" double precision,
    "longitude" double precision,
    "date" timestamp with time zone,
    "photos" jsonb,
    "metadata" jsonb,
    "title" text,
    "summary" text,
    "category" text[],
    "embedding" vector(1536)
);

CREATE TABLE IF NOT EXISTS "organizations" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "name" text,
    "specialization" text,
    "description" text,
    "photo" text,
    "image" jsonb,
    "title" text,
    "embedding" vector(1536)
);

CREATE TABLE IF NOT EXISTS "sightings" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "date" timestamp with time zone,
    "description" text,
    "media_link" text,
    "city" text,
    "state" text,
    "country" text,
    "shape" text,
    "duration_seconds" text,
    "duration_hours_min" text,
    "comments" text,
    "date_posted" timestamp with time zone,
    "latitude" double precision,
    "longitude" double precision,
    "media" jsonb
);

CREATE TABLE IF NOT EXISTS "event-subject-matter-experts" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "event" text,
    "subject-matter-expert" text
);

CREATE TABLE IF NOT EXISTS "topic-subject-matter-experts" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "topic" text,
    "subject-matter-expert" text
);

CREATE TABLE IF NOT EXISTS "organization-members" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "member" text,
    "organization" text
);

CREATE TABLE IF NOT EXISTS "testimonies" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "claim" text,
    "event" text,
    "summary" text,
    "witness" text,
    "documentation" jsonb,
    "date" timestamp with time zone,
    "organization" text,
    "source" text,
    "media" jsonb,
    "context" text,
    "embedding" vector(1536)
);

CREATE TABLE IF NOT EXISTS "topics-testimonies" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "topic" text,
    "testimony" text
);

CREATE TABLE IF NOT EXISTS "documents" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "file" jsonb,
    "summary" text,
    "embedding" vector(1536),
    "title" text,
    "date" timestamp with time zone,
    "author" text,
    "organization" text,
    "url" text,
    "metadata" jsonb,
    "images" jsonb,
    "processed" boolean
);

CREATE TABLE IF NOT EXISTS "locations" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "name" text,
    "coordinates" text,
    "google-maps-location-id" text,
    "city" text,
    "state" text,
    "latitude" double precision,
    "longitude" double precision
);

CREATE TABLE IF NOT EXISTS "event-topic-subject-matter-experts" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "event" text,
    "topic" text,
    "subject-matter-expert" text
);

CREATE TABLE IF NOT EXISTS "users" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "email" text,
    "name" text,
    "photo" jsonb,
    "profile_image_url" text,
    "external_id" text
);

CREATE TABLE IF NOT EXISTS "user-saved-events" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "event" text,
    "theory" text,
    "note" text,
    "note-title" text
);

CREATE TABLE IF NOT EXISTS "user-saved-topics" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "topic" text,
    "theory" text,
    "note" text,
    "note-title" text
);

CREATE TABLE IF NOT EXISTS "user-saved-key-figure" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "key-figure" text,
    "theory" text,
    "note" text,
    "note-title" text
);

CREATE TABLE IF NOT EXISTS "user-saved-testimonies" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "testimony" text,
    "theory" text,
    "note" text,
    "note-title" text
);

CREATE TABLE IF NOT EXISTS "user-saved-documents" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "document" text,
    "theory" text,
    "note" text,
    "note-title" text
);

CREATE TABLE IF NOT EXISTS "user-notes" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "name" text,
    "content" text,
    "synopsis" text,
    "diagrams" jsonb
);

CREATE TABLE IF NOT EXISTS "user-saved-organizations" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "organization" text,
    "theory" text,
    "note" text,
    "note-title" text
);

CREATE TABLE IF NOT EXISTS "user-saved-sightings" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "user" text,
    "sighting" text,
    "theory" text,
    "note" text,
    "note-title" text
);

CREATE TABLE IF NOT EXISTS "tags" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "theories" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "mindmaps" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "json" jsonb,
    "embedding" vector(1536),
    "user" text,
    "file" jsonb
);

CREATE TABLE IF NOT EXISTS "artifacts" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "name" text,
    "description" text,
    "photos" text[],
    "date" text,
    "source" text,
    "origin" text,
    "images" jsonb,
    "embedding" vector(1536)
);

CREATE TABLE IF NOT EXISTS "key-figures" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "name" text,
    "bio" text,
    "photo" text,
    "role" text,
    "rank" integer,
    "credibility" integer,
    "popularity" integer,
    "authority" integer,
    "embedding" text,
    "xataversion" integer
);

CREATE TABLE IF NOT EXISTS "summary-files" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "name" text,
    "file" jsonb,
    "source" text,
    "metadata" jsonb,
    "images" jsonb,
    "content" text,
    "embedding" text[],
    "document" text
);

CREATE TABLE IF NOT EXISTS "document-entities" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "document" text,
    "entity-type" text[],
    "entity-data" text,
    "metadata" jsonb
);

CREATE TABLE IF NOT EXISTS "document-chunks" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "document" text,
    "chunk_index" integer,
    "content" text,
    "token_count" integer,
    "embedding" vector(1536),
    "page_number" integer,
    "heading" text
);

CREATE TABLE IF NOT EXISTS "document-processing-tasks" (
    id text PRIMARY KEY,
    xata_version integer,
    xata_createdat timestamp with time zone,
    xata_updatedat timestamp with time zone,
    "document" text,
    "task" text[],
    "status" text,
    "metadata" jsonb
);