/**
 * One-off migration script (2026-07-08: originally `claims`, renamed same day —
 * "claim" is reserved for source-extracted assertions; agent output is inference) — creates the `agent_inferences` overlay table.
 * Additive only: never touches the 29 existing production tables.
 *
 * Part of Vision Phase 1.2 (docs/PLANS/2026-07-08-memory-first-vision-review.md §P1.2):
 * the first "overlay object" that makes narrative recoverable as structure. The
 * mindmap agent's addGraphEdges tool writes one row per edge `reasoning` string.
 *
 * Run with: bun run packages/db/scripts/create-agent-inferences-table.ts
 */
import { getSql } from '../src/postgres/client'

const sql = getSql()

async function main() {
  console.log('Creating agent_inferences table...')

  await sql`
    CREATE TABLE IF NOT EXISTS agent_inferences (
      id TEXT PRIMARY KEY DEFAULT ('inf_' || substr(md5(random()::text || clock_timestamp()::text), 1, 20)),
      inference_text TEXT NOT NULL,
      evidentiary_state TEXT NOT NULL DEFAULT 'unverified'
        CHECK (evidentiary_state IN ('observed','corroborated','contested','inferred','speculative','resonant','unverified','disconfirmed')),
      source_record_id TEXT,
      source_table TEXT,
      target_record_id TEXT,
      extracted_by TEXT NOT NULL DEFAULT 'mindmap-agent',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  await sql`CREATE INDEX IF NOT EXISTS idx_agent_inferences_source ON agent_inferences (source_record_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_agent_inferences_target ON agent_inferences (target_record_id)`

  console.log('agent_inferences table created (or already existed).')

  const rows = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'agent_inferences'
    ORDER BY ordinal_position
  `
  console.table(rows)

  const count = await sql`SELECT count(*)::int AS count FROM agent_inferences`
  console.log('Row count:', count[0].count)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
