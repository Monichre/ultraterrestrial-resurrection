-- =============================================================================
-- 006_drop_graph_projection.sql  —  drop the stale `nodes` / `edges` tables
-- Target: Neon Postgres 17.10 (the live shared database).
-- Created: 2026-09-27
--
-- ⚠️  DESTRUCTIVE. Drops two tables.
--
-- WHY
-- `nodes` (58,819 rows) and `edges` (1,899 rows) were copied once from the
-- join tables by packages/db/scripts/rebuild/db_ops.py and never updated.
-- Verified on the live database 2026-09-27:
--   • No reader. Nothing in apps/ or packages/ queries them; relationship reads
--     go through the join tables (packages/db/src/postgres/related.ts,
--     queries.ts).
--   • Stale. 453 `event` nodes have no row in `events` (junk labels such as
--     'Projects'); edges topic_sme = 853 vs topic_subject_matter_experts = 851.
--   • edges.confidence and edges.provenance: 0 of 1,899 populated.
--   • Lossy. event_topic_subject_matter_experts (60 rows) is a 3-way relation;
--     edges holds only 45 two-ended event_topic pairs.
--   • Their only foreign keys are edges -> nodes. Nothing ties them to the
--     typed tables, so they cannot stay in sync.
-- The join tables remain the source of truth. If a graph-traversal reader is
-- ever built, create a VIEW over the join tables for it.
--
-- The rebuild path no longer creates or seeds them: db_ops.py's nodes/edges
-- block and their DDL in rebuild/0001_init.sql were removed with this file.
--
-- REVERSAL
-- The data is a derived copy of the join tables; a rebuild via db_ops.py
-- regenerates it. For an exact snapshot, dump first:
--     pg_dump "$DATABASE_URL" -t nodes -t edges -Fc -f nodes_edges_2026-09-27.dump
--
-- APPLIED to the live database 2026-09-27. Snapshot taken first:
--     ~/db-backups/ultraterrestrial/nodes_edges_2026-09-27.dump
-- =============================================================================

\set ON_ERROR_STOP on

BEGIN;
DROP TABLE IF EXISTS edges;   -- holds the FKs to nodes, so it goes first
DROP TABLE IF EXISTS nodes;
COMMIT;
