CREATE TABLE IF NOT EXISTS "artifacts" (
    "id" text PRIMARY KEY,
    "date" timestamp with time zone,
    "description" text,
    "embedding" vector(1536),
    "images" text,
    "name" text,
    "origin" text,
    "photos" jsonb,
    "source" text
);

CREATE TABLE IF NOT EXISTS "document-chunks" (
    "id" text PRIMARY KEY,
    "chunk_index" text,
    "content" text,
    "document" text,
    "embedding" vector(1536),
    "heading" text,
    "page_number" text,
    "token_count" text
);

CREATE TABLE IF NOT EXISTS "document-entities" (
    "id" text PRIMARY KEY,
    "document" text,
    "entity-data" text,
    "entity-type" text,
    "metadata" jsonb
);

CREATE TABLE IF NOT EXISTS "document-processing-tasks" (
    "id" text PRIMARY KEY,
    "document" text,
    "metadata" jsonb,
    "status" text,
    "task" text
);

CREATE TABLE IF NOT EXISTS "documents" (
    "id" text PRIMARY KEY,
    "author" text,
    "date" timestamp with time zone,
    "embedding" vector(1536),
    "file" text,
    "images" text,
    "metadata" jsonb,
    "organization" text,
    "processed" text,
    "summary" text,
    "title" text,
    "url" text
);

CREATE TABLE IF NOT EXISTS "event-subject-matter-experts" (
    "id" text PRIMARY KEY,
    "event" text,
    "subject-matter-expert" text
);

CREATE TABLE IF NOT EXISTS "event-topic-subject-matter-experts" (
    "id" text PRIMARY KEY,
    "event" text,
    "subject-matter-expert" text,
    "topic" text
);

CREATE TABLE IF NOT EXISTS "events" (
    "id" text PRIMARY KEY,
    "category" text,
    "date" timestamp with time zone,
    "description" text,
    "embedding" vector(1536),
    "latitude" text,
    "location" text,
    "longitude" text,
    "metadata" jsonb,
    "name" text,
    "photos" jsonb,
    "summary" text,
    "title" text
);

CREATE TABLE IF NOT EXISTS "key-figures" (
    "id" text PRIMARY KEY,
    "authority" text,
    "bio" text,
    "credibility" text,
    "embedding" vector(1536),
    "name" text,
    "photo" jsonb,
    "popularity" text,
    "rank" text,
    "role" text,
    "xataversion" text
);

CREATE TABLE IF NOT EXISTS "locations" (
    "id" text PRIMARY KEY,
    "city" text,
    "coordinates" text,
    "google-maps-location-id" text,
    "latitude" text,
    "longitude" text,
    "name" text,
    "state" text
);

CREATE TABLE IF NOT EXISTS "mindmaps" (
    "id" text PRIMARY KEY,
    "embedding" vector(1536),
    "file" text,
    "json" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "organization-members" (
    "id" text PRIMARY KEY,
    "member" text,
    "organization" text
);

CREATE TABLE IF NOT EXISTS "organizations" (
    "id" text PRIMARY KEY,
    "description" text,
    "embedding" vector(1536),
    "image" text,
    "name" text,
    "photo" jsonb,
    "specialization" text,
    "title" text
);

CREATE TABLE IF NOT EXISTS "personnel" (
    "id" text PRIMARY KEY,
    "authority" text,
    "bio" text,
    "credibility" text,
    "embedding" vector(1536),
    "name" text,
    "photo" jsonb,
    "popularity" text,
    "rank" text,
    "role" text
);

CREATE TABLE IF NOT EXISTS "summary-files" (
    "id" text PRIMARY KEY,
    "content" text,
    "document" text,
    "embedding" vector(1536),
    "file" text,
    "images" text,
    "metadata" jsonb,
    "name" text,
    "source" text
);

CREATE TABLE IF NOT EXISTS "tags" (
    "id" text PRIMARY KEY,
    "id" text PRIMARY KEY,
    "" text
);

CREATE TABLE IF NOT EXISTS "testimonies" (
    "id" text PRIMARY KEY,
    "claim" text,
    "context" text,
    "date" timestamp with time zone,
    "documentation" text,
    "embedding" vector(1536),
    "event" text,
    "media" text,
    "organization" text,
    "source" text,
    "summary" text,
    "witness" text
);

CREATE TABLE IF NOT EXISTS "theories" (
    "id" text PRIMARY KEY,
    "id" text PRIMARY KEY,
    "" text
);

CREATE TABLE IF NOT EXISTS "topic-subject-matter-experts" (
    "id" text PRIMARY KEY,
    "subject-matter-expert" text,
    "topic" text
);

CREATE TABLE IF NOT EXISTS "topics-testimonies" (
    "id" text PRIMARY KEY,
    "testimony" text,
    "topic" text
);

CREATE TABLE IF NOT EXISTS "topics" (
    "id" text PRIMARY KEY,
    "embedding" vector(1536),
    "name" text,
    "photo" jsonb,
    "photos" jsonb,
    "summary" text,
    "title" text
);

CREATE TABLE IF NOT EXISTS "user-notes" (
    "id" text PRIMARY KEY,
    "content" text,
    "diagrams" text,
    "name" text,
    "synopsis" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "user-saved-documents" (
    "id" text PRIMARY KEY,
    "document" text,
    "note" text,
    "note-title" text,
    "theory" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "user-saved-events" (
    "id" text PRIMARY KEY,
    "event" text,
    "note" text,
    "note-title" text,
    "theory" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "user-saved-key-figure" (
    "id" text PRIMARY KEY,
    "key-figure" text,
    "note" text,
    "note-title" text,
    "theory" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "user-saved-organizations" (
    "id" text PRIMARY KEY,
    "note" text,
    "note-title" text,
    "organization" text,
    "theory" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "user-saved-sightings" (
    "id" text PRIMARY KEY,
    "note" text,
    "note-title" text,
    "sighting" text,
    "theory" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "user-saved-testimonies" (
    "id" text PRIMARY KEY,
    "note" text,
    "note-title" text,
    "testimony" text,
    "theory" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "user-saved-topics" (
    "id" text PRIMARY KEY,
    "note" text,
    "note-title" text,
    "theory" text,
    "topic" text,
    "user" text
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY,
    "email" text,
    "external_id" text,
    "name" text,
    "photo" jsonb,
    "profile_image_url" text
);