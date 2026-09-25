-- T-048 — entity resolution: name lookup for ingest.
-- Target: Neon Postgres 17 + pgvector 0.8.0 + pg_trgm 1.6 (unaccent available, not yet installed).
-- Created: 2026-09-13
--
-- WHY
-- Every entity table's only key is `id` (`rec_*` from Xata, or gen_random_uuid()
-- for new rows). Nothing about "Robert Bigelow" lets ingest compute that id, so
-- an NER mention cannot find the row it refers to. This migration adds the two
-- pieces a staged, human-reviewed resolution workflow needs:
--
--   1. `entity_aliases` — every known spelling of an entity, pointing at its id.
--      A decision made once ("Bob Bigelow" is rec_…) is stored, so the same
--      spelling is an exact lookup forever after. Seeded from each row's name.
--   2. `document_entities` — extended into the mention log + review queue. One
--      row per NER extraction, carrying its quote, chunk, status and decision.
--
-- The workflow this serves (commands not built yet; this is only the schema):
--   dy <source>   ingest writes document, chunks and *pending mentions only*
--   dy resolve    exact alias hit -> matched; clear miss -> new; else needs_review
--   dy review     operator decides needs_review mentions in the terminal
--   dy apply      upserts entities/joins for decided mentions, sets applied_at
-- Ingest never writes entity rows directly, so a bad guess cannot reach them.
--
-- DECISIONS (recorded so they are not re-litigated)
--
-- No `canonical_key` column. A computed key only catches exact spellings; the
-- alias table covers that case and every variant besides. `id` stays the only
-- identity, so there is no second key to keep in sync.
--
-- UNIQUE (entity_table, entity_id, alias_normalized) — per entity, NOT per table.
-- Two different people can share a name. A per-table unique would make that
-- impossible to record; per-entity lets both rows carry the alias, and the
-- resolver gets two candidates and routes the mention to review. The live data
-- already needs this: a local dry run of the seed against the real names
-- (2026-09-13) found 5 normalized names claimed by two rows each —
--   key_figures:   "Erich von Däniken" / "Erich Von Däniken"
--                  "Albert M. Chop" / "Albert M Chop"
--                  "Brian O'Leary" / "Brian O’Leary"      (straight vs curly apostrophe)
--                  "Marc D'Antonio" / "Marc D’Antonio"
--   organizations: "New Paradigm Institute" (twice, identical)
-- All five are duplicate rows that already exist in those tables — the seed
-- surfaces them, it does not create them — and none looks like two different
-- people or organizations that happen to share a name. Under a per-table
-- unique the seed would silently drop one of each; here both seed, and the
-- duplicate-candidates query below surfaces them for a merge decision.
--
-- Extend `document_entities`, do not create `entity_mentions`. It already has
-- the mention shape (document, entity_type, entity_name, confidence, context,
-- metadata), has 0 rows and no readers. A near-identical second table beside it
-- is the "abandoned migration, frozen at step one" pattern 002's header warns of.
-- `context` holds the verbatim quote.
--
-- Normalization lives in ONE place: `entity_normalize(text)`, below. The
-- resolver must call it through SQL (`SELECT entity_normalize(%s)`), never
-- reimplement it in Python — a drifting copy silently turns exact hits into
-- misses. It lowercases, strips accents, turns every run of non-alphanumerics
-- into one space, and trims: "Erich Von Däniken" and "erich von daniken" match.
-- `[:alnum:]` (not a-z0-9) so non-Latin names are kept, not erased. That
-- depends on the database ctype: Neon's `neondb` is C.UTF-8 (builtin), where
-- 'Владимир O’Leary' -> 'владимир o leary' (checked read-only 2026-09-13). On a
-- plain `C` ctype database, non-ASCII letters count as punctuation and a
-- Cyrillic-only name normalizes to '' — the not-blank CHECK then rejects it
-- loudly rather than storing an empty alias.
-- The IMMUTABLE label therefore assumes the database ctype and the unaccent
-- rules never change. If either does (a Neon locale/provider change, a new
-- unaccent.rules), stored `alias_normalized` / `entity_name_normalized` values
-- go stale silently. Recompute them and rebuild the indexes:
--   UPDATE entity_aliases SET alias = alias;
--   UPDATE document_entities SET entity_name = entity_name;
--   REINDEX TABLE entity_aliases; REINDEX TABLE document_entities;
-- then re-run the duplicate-candidates query, since uq_entity_alias may now fail.
-- unaccent is STABLE, so it is wrapped with an explicit dictionary to be usable
-- in a generated column; that is the documented pattern for IMMUTABLE unaccent.
--
-- Polymorphic reference, no real FK. (entity_table, entity_id) can point at any
-- of several tables, so Postgres cannot enforce it. The CHECK allowlist bounds
-- the table name; referential integrity is proven by query, the same way the
-- 2026-09-12 scan proved 0 orphans across the 19 real FK columns. Run the
-- orphan query below after the seed and after every `dy apply`.
--
-- Not seeded: locations (13,933 rows, 12,470 distinct names — "Springfield";
-- matched on name + trigram + coordinates instead, per 2026-09-12), sightings
-- (not named entities), testimonies (accounts, not names), documents (resolved
-- by url/content_hash). locations and testimonies are allowed in the CHECK so
-- a human-approved alias can still be recorded for them.
--
-- Small tables, one transaction. document_entities has 0 rows, so the ALTERs
-- rewrite nothing; entity_aliases starts at ~775 seed rows. No CONCURRENTLY.
-- Every statement is IF NOT EXISTS / OR REPLACE / ON CONFLICT DO NOTHING, so
-- the file is safe to re-run.
--
-- OPERATOR QUERIES
--
-- Duplicate candidates (same normalized alias on 2+ rows of one table):
--   SELECT entity_table, alias_normalized, array_agg(entity_id) AS ids
--   FROM entity_aliases GROUP BY 1, 2 HAVING count(DISTINCT entity_id) > 1;
--
-- Orphaned aliases (expect 0):
--   SELECT a.* FROM entity_aliases a WHERE NOT CASE a.entity_table
--     WHEN 'key_figures'   THEN EXISTS (SELECT 1 FROM key_figures   t WHERE t.id = a.entity_id)
--     WHEN 'events'        THEN EXISTS (SELECT 1 FROM events        t WHERE t.id = a.entity_id)
--     WHEN 'organizations' THEN EXISTS (SELECT 1 FROM organizations t WHERE t.id = a.entity_id)
--     WHEN 'topics'        THEN EXISTS (SELECT 1 FROM topics        t WHERE t.id = a.entity_id)
--     WHEN 'artifacts'     THEN EXISTS (SELECT 1 FROM artifacts     t WHERE t.id = a.entity_id)
--     WHEN 'locations'     THEN EXISTS (SELECT 1 FROM locations     t WHERE t.id = a.entity_id)
--     WHEN 'testimonies'   THEN EXISTS (SELECT 1 FROM testimonies   t WHERE t.id = a.entity_id)
--   END;
--
-- Exact lookup the resolver runs first:
--   SELECT entity_id FROM entity_aliases
--   WHERE entity_table = $1 AND alias_normalized = entity_normalize($2);
--
-- Trigram candidates when there is no exact hit:
--   SELECT entity_id, alias, similarity(alias_normalized, entity_normalize($2)) AS sim
--   FROM entity_aliases
--   WHERE entity_table = $1 AND alias_normalized % entity_normalize($2)
--   ORDER BY sim DESC LIMIT 5;
--
-- Apply with:  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f packages/db/migrations/003_entity_resolution.sql
--
-- APPLIED to Neon (neondb) 2026-09-13 23:23:26 UTC (18:23:26 CDT) with the
-- command above, on the lead's go-ahead. psql exit 0; seed inserted 774 aliases.
-- A BEGIN…ROLLBACK dry run on Neon preceded it with identical seed counts.

BEGIN;

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- Normalization — the single definition.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION entity_normalize(input text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE STRICT PARALLEL SAFE
AS $$
  SELECT btrim(
    regexp_replace(
      lower(public.unaccent('public.unaccent'::regdictionary, input)),
      '[^[:alnum:]]+', ' ', 'g'
    )
  )
$$;

COMMENT ON FUNCTION entity_normalize(text) IS
  'Single normalization for entity name matching. Callers must use this via SQL, '
  'never a reimplementation. See 003_entity_resolution.sql header.';

-- ---------------------------------------------------------------------------
-- entity_aliases — every known spelling of an entity.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS entity_aliases (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  entity_table     TEXT NOT NULL CHECK (entity_table IN (
                     'key_figures', 'events', 'organizations', 'topics',
                     'artifacts', 'locations', 'testimonies')),
  entity_id        TEXT NOT NULL,
  alias            TEXT NOT NULL,
  alias_normalized TEXT GENERATED ALWAYS AS (entity_normalize(alias)) STORED,
  -- How this alias became known.
  source           TEXT NOT NULL CHECK (source IN (
                     'seed_name',     -- the row's own name, from this migration
                     'auto_match',    -- dy resolve, above threshold
                     'llm_match',     -- dy resolve, LLM tiebreak on the middle band
                     'human_review')),-- dy review / Disclosure Lab
  -- The mention whose decision produced this alias (NULL for seeds).
  mention_id       TEXT REFERENCES document_entities(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT entity_aliases_not_blank CHECK (entity_normalize(alias) <> ''),
  CONSTRAINT uq_entity_alias UNIQUE (entity_table, entity_id, alias_normalized)
);

COMMENT ON TABLE entity_aliases IS
  'Known spellings of each entity -> its id. Unique per entity, not per table, '
  'so two entities may share an alias and resolve to review. See 003 header.';

-- Exact lookup: (table, normalized alias) -> ids.
CREATE INDEX IF NOT EXISTS idx_entity_aliases_lookup
  ON entity_aliases (entity_table, alias_normalized);
-- Reverse: all aliases of one entity.
CREATE INDEX IF NOT EXISTS idx_entity_aliases_entity
  ON entity_aliases (entity_table, entity_id);
-- Trigram candidate search.
CREATE INDEX IF NOT EXISTS idx_entity_aliases_trgm
  ON entity_aliases USING gin (alias_normalized gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- document_entities — the mention log and review queue.
-- ---------------------------------------------------------------------------

ALTER TABLE document_entities
  -- Which chunk the quote came from; (document, chunk_index) makes it citable.
  ADD COLUMN IF NOT EXISTS chunk_index INTEGER,
  ADD COLUMN IF NOT EXISTS entity_name_normalized TEXT
    GENERATED ALWAYS AS (entity_normalize(entity_name)) STORED,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',       -- written by ingest, not yet resolved
    'needs_review',  -- dy resolve could not decide; waits for the operator
    'matched',       -- resolved to an existing entity (resolved_* set)
    'new',           -- decided to be a new entity (resolved_* set once created)
    'skipped')),     -- not an entity worth keeping (noise, generic term)
  ADD COLUMN IF NOT EXISTS resolved_table TEXT CHECK (resolved_table IN (
    'key_figures', 'events', 'organizations', 'topics',
    'artifacts', 'locations', 'testimonies')),
  ADD COLUMN IF NOT EXISTS resolved_entity_id TEXT,
  ADD COLUMN IF NOT EXISTS match_score REAL,
  ADD COLUMN IF NOT EXISTS decided_by TEXT CHECK (decided_by IN ('auto', 'llm', 'human')),
  ADD COLUMN IF NOT EXISTS decision_note TEXT,
  ADD COLUMN IF NOT EXISTS decided_at TIMESTAMPTZ,
  -- Set by dy apply once entity/join rows are written. NULL = not applied.
  ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS run_id TEXT,
  ADD COLUMN IF NOT EXISTS extractor_model TEXT;

COMMENT ON COLUMN document_entities.context IS
  'Verbatim quote the entity was extracted from.';
COMMENT ON COLUMN document_entities.status IS
  'pending -> matched | new | needs_review | skipped. applied_at marks dy apply. See 003 header.';

-- The review queue: dy review reads needs_review, dy resolve reads pending.
CREATE INDEX IF NOT EXISTS idx_doc_entities_open
  ON document_entities (status, xata_createdat)
  WHERE status IN ('pending', 'needs_review');
-- Decided but not yet applied.
CREATE INDEX IF NOT EXISTS idx_doc_entities_unapplied
  ON document_entities (resolved_table, resolved_entity_id)
  WHERE applied_at IS NULL AND status IN ('matched', 'new');
CREATE INDEX IF NOT EXISTS idx_doc_entities_name_norm
  ON document_entities (entity_type, entity_name_normalized);

-- ---------------------------------------------------------------------------
-- Seed: each row's own name is its first alias.
-- Column map is explicit per table (events.title is NULL on 141 of 142 rows,
-- so events seed from name).
-- ---------------------------------------------------------------------------

INSERT INTO entity_aliases (entity_table, entity_id, alias, source)
SELECT 'key_figures', id, name, 'seed_name' FROM key_figures
  WHERE name IS NOT NULL AND entity_normalize(name) <> ''
UNION ALL
SELECT 'events', id, name, 'seed_name' FROM events
  WHERE name IS NOT NULL AND entity_normalize(name) <> ''
UNION ALL
SELECT 'organizations', id, name, 'seed_name' FROM organizations
  WHERE name IS NOT NULL AND entity_normalize(name) <> ''
UNION ALL
SELECT 'topics', id, name, 'seed_name' FROM topics
  WHERE name IS NOT NULL AND entity_normalize(name) <> ''
UNION ALL
SELECT 'artifacts', id, name, 'seed_name' FROM artifacts
  WHERE name IS NOT NULL AND entity_normalize(name) <> ''
ON CONFLICT ON CONSTRAINT uq_entity_alias DO NOTHING;

COMMIT;
