-- T-048 H1 — identity column on `documents`.
--
-- Adds the archive's content hash to the database side so a row can be joined
-- back to the filesystem record that produced it. Per D2 the filesystem is the
-- system of record and Postgres is a rebuildable derived index, so this column
-- is a *mirror* of `packages/knowledge-base/metadata/index.json`'s
-- `content_hash`, never an independent identity.
--
-- md5, not sha256 (32 hex chars, hence TEXT rather than a VARCHAR(64)).
-- `KnowledgeBaseCRUD._content_hash` computes md5 and `doc_id` is its first 12
-- chars, so md5 is already the archive's identity of record; introducing sha256
-- here would create the second, silently-diverging hash identity the 2026-08-13
-- audit banned. The sha256 `content_hash VARCHAR(64) UNIQUE NOT NULL` in
-- `apps/disclosure-rag/lib/storage/pgvector_library.py:112` is not a precedent:
-- that module has no importers and its `CREATE TABLE IF NOT EXISTS documents`
-- conflicts with the live table defined in `001_create_tables.sql:166`. It is one
-- of the plan's "abandoned migrations, frozen at step one".
--
-- NULLABLE, AND NO UNIQUE CONSTRAINT — deliberately, and this is blocked rather
-- than deferred. H1 calls for `UNIQUE`; the archive cannot satisfy one today.
-- 417 of 581 index records point at a directory that another index record also
-- claims (112 directories claimed by 417 records; 31 `case_file` records all
-- point at the `sources/files` tree root), so those records have no per-record
-- content to hash and were left NULL by
-- `apps/disclosure-rag/scripts/backfill_content_hash.py` rather than filled with
-- a neighbour's digest. A partial unique index would hide that instead of
-- recording it. Add the UNIQUE constraint once the directory collisions are
-- resolved — see the T-048 block in docs/plans/TODO.md.
--
-- Nothing writes this column yet. The disclosure-rag -> Neon write path is
-- T-048 H2 ("the bridge"); this is the schema it will land into.

ALTER TABLE documents ADD COLUMN IF NOT EXISTS content_hash TEXT;

COMMENT ON COLUMN documents.content_hash IS
  'md5 of the source document content; mirrors metadata/index.json content_hash. '
  'Join key to the filesystem archive. Not unique yet — see 002 migration header.';

CREATE INDEX IF NOT EXISTS idx_documents_content_hash ON documents(content_hash);
