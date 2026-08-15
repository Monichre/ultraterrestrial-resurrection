-- =============================================================================
-- 0002_ann_indexes.sql  —  Vector ANN indexes + document_chunks integrity
-- Target: any managed Postgres 16+ with pgvector (Neon, current host). Host-portable.
-- Created: 2026-08-01
-- Why deferred from 0001: 0001_init.sql:22-26 explicitly reserved ANN index
-- creation for this migration, to run AFTER the embedding backfill (SP#2).
-- That backfill is now done — all 10 vector(1536) columns are either fully
-- populated or empty — so the indexes below can be created safely.
--
-- Conventions:
--   • HNSW, not IVFFlat — matches 0001's own stated reasoning: HNSW needs no
--     build-time data (unlike IVFFlat, whose list centroids are computed from
--     whatever rows exist at CREATE INDEX time) and handles incremental
--     inserts without a rebuild. Both properties matter here: mindmaps (0
--     rows) and summary_files (1 row, NULL embedding) are effectively empty
--     today but will grow.
--   • vector_cosine_ops — every cosine-similarity query in this codebase
--     (search.ts, related.ts) uses the <=> operator; the opclass must match.
--   • CREATE INDEX CONCURRENTLY IF NOT EXISTS — safe to re-run, and does not
--     hold a lock that blocks reads/writes on tables that already carry
--     production traffic (topics, key_figures, events, ..., document_chunks).
--
-- ⚠️  CRITICAL — DO NOT WRAP THIS FILE IN A TRANSACTION.
-- CREATE INDEX CONCURRENTLY cannot run inside a transaction block (Postgres
-- will reject it with "CREATE INDEX CONCURRENTLY cannot run inside a
-- transaction block"). Unlike 0001_init.sql, this file deliberately has NO
-- BEGIN/COMMIT wrapper. Apply it with a plain psql invocation, e.g.:
--     psql "$DATABASE_URL" -f migrations/rebuild/0002_ann_indexes.sql
-- \set ON_ERROR_STOP on below makes psql abort the whole file on the first
-- failing statement instead of printing an error and silently continuing —
-- without it, a failed ALTER TABLE (e.g. from the 0/4,946-nulls assumption
-- below going stale) would not stop the rest of the file from "succeeding".
-- Each CREATE INDEX CONCURRENTLY statement commits its own catalog change as
-- it goes; if one is ever interrupted mid-build, check for an INVALID index
-- (`\d <table>` shows "INVALID") and DROP INDEX CONCURRENTLY it before
-- re-running this file — re-running while it's INVALID will not repair it
-- because IF NOT EXISTS sees it as already there.
--
-- THIS MIGRATION HAS NOT BEEN APPLIED. It is authored for review; the lead
-- decides when/how it runs against the live database.
-- =============================================================================

\set ON_ERROR_STOP on

-- ---------------------------------------------------------------------------
-- HNSW ANN indexes — one per vector(1536) column
-- ---------------------------------------------------------------------------
-- Run first (before the document_chunks integrity fix below) because these
-- are the expensive, long-running part and carry no data risk — if the
-- integrity fix at the bottom ever needs to abort, the indexes should still
-- be left in place rather than lost to a whole-file failure.
--
-- All 10 are created, including the two effectively-empty tables (mindmaps,
-- summary_files). An HNSW build over 0 rows or all-NULL embeddings is
-- trivial and harmless — the index just starts empty and grows as rows are
-- inserted/backfilled, so there's no reason to special-case or skip them;
-- doing so would only mean remembering to add the index later.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topics_embedding
    ON topics USING hnsw (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_key_figures_embedding
    ON key_figures USING hnsw (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_embedding
    ON events USING hnsw (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_organizations_embedding
    ON organizations USING hnsw (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testimonies_embedding
    ON testimonies USING hnsw (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_embedding
    ON documents USING hnsw (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_artifacts_embedding
    ON artifacts USING hnsw (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_chunks_embedding
    ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- Empty today (0 rows) — see comment above on why it's still created now.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mindmaps_embedding
    ON mindmaps USING hnsw (embedding vector_cosine_ops);

-- Empty today (1 row, NULL embedding) — see comment above on why it's still
-- created now.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_summary_files_embedding
    ON summary_files USING hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------------------------
-- document_chunks: prevent partial-retry duplicates
-- ---------------------------------------------------------------------------
-- document_chunks currently has only a random-UUID PK (0001_init.sql:467-476)
-- and nothing stopping a partial ingest retry from re-inserting the same
-- (document, chunk_index) pair as a new row. scripts/rebuild/ingest.py always
-- supplies both values together on every INSERT (never NULL), so making them
-- NOT NULL matches how the table is actually written.
--
-- Verified 2026-08-01 against live data (read-only, before this file was
-- authored — re-run before applying if more ingestion has happened since):
--   SELECT document, chunk_index, COUNT(*) AS n
--   FROM document_chunks
--   WHERE document IS NOT NULL AND chunk_index IS NOT NULL
--   GROUP BY document, chunk_index HAVING COUNT(*) > 1;
-- Result: 4,946/4,946 rows had non-NULL (document, chunk_index); 0 duplicate
-- groups; 0 rows with either column NULL.
--
-- Why NOT NULL first: a plain UNIQUE constraint in Postgres treats NULLs as
-- distinct from each other (NULLS DISTINCT is the default), so
-- UNIQUE(document, chunk_index) alone would NOT catch a retry that inserted
-- rows with a NULL in either column — it would silently let duplicates
-- through in exactly the failure mode this constraint exists to prevent.
-- Since live data already satisfies NOT NULL on both columns, enforcing it
-- closes that gap instead of leaving a documented loophole.
ALTER TABLE document_chunks ALTER COLUMN document SET NOT NULL;
ALTER TABLE document_chunks ALTER COLUMN chunk_index SET NOT NULL;

-- Wrapped in a DO block per 0001_init.sql's own convention (see its
-- "FOREIGN KEY CONSTRAINTS" / "UNIQUE CONSTRAINTS" sections) so re-running
-- this file after a successful apply doesn't fail on duplicate_object.
DO $$ BEGIN
  ALTER TABLE document_chunks
    ADD CONSTRAINT uq_document_chunks_doc_index UNIQUE (document, chunk_index);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- END 0002_ann_indexes.sql
-- =============================================================================
