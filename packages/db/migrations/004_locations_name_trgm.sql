-- =============================================================================
-- 004_locations_embedding.sql  —  give `locations` a vector column + the two
--                                 indexes the entity resolver needs
-- Target: Neon Postgres 17.10 + pgvector 0.8.0 (the live shared database).
-- Created: 2026-09-27
--
-- WHY
-- `locations` is the only entity table without an `embedding` column. Measured
-- on the live database 2026-09-27:
--
--     artifacts        36/36        key_figures     465/465
--     document_chunks  4946/4946    organizations    40/40
--     documents        189/189      testimonies     178/178
--     events           142/142      topics           91/91
--     locations        NO COLUMN    (13,933 rows)
--
-- So agentic/semantic search reaches every entity type except places. This
-- migration adds the column; the backfill is a separate, resumable step
-- (scripts/backfill_location_embeddings.py) because it costs API calls.
--
-- It also adds a trigram index on locations.name. 003_entity_resolution.sql
-- matches locations against their own rows:
--     similarity(entity_normalize(name), entity_normalize($1)) >= 0.3
-- With no index that is a sequential scan plus 13,933 normalize() calls per
-- candidate lookup. key_figures already has idx_key_figures_name_trgm;
-- locations had only its primary key.
--
-- EMBEDDING TEXT
-- locations carries no description/summary — the columns are name, city,
-- state, country, latitude, longitude, coordinates, google_maps_location_id.
-- The backfill therefore embeds the place-identity string:
--     "<name>, <city>, <state>, <country>"   (empty parts dropped)
-- Same model as every other vector here: text-embedding-3-small @ 1536 dims.
-- Cosine distance (<=>), so the opclass below must stay vector_cosine_ops.
--
-- CONVENTIONS (inherited from migrations/rebuild/0002_ann_indexes.sql)
--   • HNSW, not IVFFlat — needs no build-time data, so it can be created
--     before the backfill and handles incremental inserts without a rebuild.
--   • vector_cosine_ops — matches every <=> query in this codebase.
--   • CREATE INDEX CONCURRENTLY IF NOT EXISTS — re-runnable, and does not
--     block reads/writes on a 13,933-row table.
--
-- ⚠️  DO NOT WRAP THIS FILE IN A TRANSACTION.
-- CREATE INDEX CONCURRENTLY is rejected inside a transaction block. Like
-- 0002, this file has NO BEGIN/COMMIT. Apply it with plain psql:
--     psql "$DATABASE_URL" -f packages/db/migrations/004_locations_embedding.sql
-- If a CONCURRENTLY build is interrupted, `\d locations` will show the index
-- as INVALID; DROP INDEX CONCURRENTLY it before re-running, because
-- IF NOT EXISTS sees an INVALID index as already present and will not repair
-- it.
--
-- REVERSAL
--     DROP INDEX CONCURRENTLY IF EXISTS idx_locations_embedding_hnsw;
--     DROP INDEX CONCURRENTLY IF EXISTS idx_locations_name_trgm;
--     ALTER TABLE locations DROP COLUMN IF EXISTS embedding;
-- Dropping the column discards the backfill; re-running it costs the API
-- calls again (13,933 rows, text-embedding-3-small — cents, not dollars).
--
-- THIS MIGRATION HAS NOT BEEN APPLIED. It is authored for review; the lead
-- decides when and how it runs against the live database.
-- =============================================================================

\set ON_ERROR_STOP on

-- Both extensions are already present on Neon; these are no-ops that make the
-- file self-contained if it is ever replayed onto a fresh host.
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. the vector column ---------------------------------------------------
ALTER TABLE locations ADD COLUMN IF NOT EXISTS embedding vector(1536);

COMMENT ON COLUMN locations.embedding IS
  'text-embedding-3-small @ 1536 dims over "name, city, state, country". '
  'Written by apps/disclosure-rag/scripts/backfill_location_embeddings.py. '
  'Cosine distance (<=>); see 004_locations_embedding.sql.';

-- 2. ANN index — safe to create before the backfill (HNSW, see header) ----
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_locations_embedding_hnsw
  ON locations USING hnsw (embedding vector_cosine_ops);

-- 3. trigram index — what the resolver's candidate lookup actually needs --
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_locations_name_trgm
  ON locations USING gin (name gin_trgm_ops);

-- Verification (run by hand after applying):
--   SELECT count(*) AS total, count(embedding) AS embedded FROM locations;
--   SELECT indexdef FROM pg_indexes WHERE tablename = 'locations';
--   -- neither index should report INVALID:
--   SELECT c.relname, i.indisvalid FROM pg_class c
--     JOIN pg_index i ON i.indexrelid = c.oid
--    WHERE c.relname IN ('idx_locations_embedding_hnsw','idx_locations_name_trgm');
