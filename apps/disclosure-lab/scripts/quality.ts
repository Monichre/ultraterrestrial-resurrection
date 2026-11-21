/**
 * Headless quality check — routine/CI surface for src/lib/quality.
 *
 *   bun scripts/quality.ts [table] [--record] [--json]
 *
 * --record appends the run to .data/quality-runs.jsonl (the trend log the
 * /quality page history view reads).
 *
 * Self-contained: builds its own neon() client from DATABASE_URL because
 * @db/postgres does not resolve through pnpm's symlinked node_modules under
 * bun/node today.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'
import { listQualityRuns, runQualityCheck, supportedQualityTables } from '../src/lib/quality'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(appRoot, '../..')

function loadDotenv(file: string) {
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m || m[1] in process.env) continue
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

loadDotenv(path.join(repoRoot, '.env'))
loadDotenv(path.join(repoRoot, '.env.local'))
loadDotenv(path.join(repoRoot, 'packages/db/.env'))

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL not set (checked repo .env, .env.local, packages/db/.env)')
  process.exit(1)
}
const sql = neon(url)

const args = process.argv.slice(2)
const table = args.find((a) => !a.startsWith('--')) ?? 'key_figures'
const record = args.includes('--record')
const asJson = args.includes('--json')

const report = await runQualityCheck(table, { record, sql })
const runs = await listQualityRuns(table)
const prev = runs.length > (record ? 1 : 0) ? runs[runs.length - (record ? 2 : 1)] : undefined

if (asJson) {
  console.log(JSON.stringify(report, null, 2))
  process.exit(0)
}

const pad = (s: string | number, n: number) => String(s).padEnd(n)
const padL = (s: string | number, n: number) => String(s).padStart(n)

console.log(`# ${report.table} quality — ${report.total} rows — ${report.runAt}`)
console.log(
  `tiers: broken=${report.tiers.broken} needs_work=${report.tiers.needs_work} thin=${report.tiers.thin} ok=${report.tiers.ok}` +
    (prev ? `  (prev run ${prev.ts}: broken=${prev.tiers.broken} needs_work=${prev.tiers.needs_work})` : ''),
)

console.log(`\n${pad('rule', 20)} ${pad('sev', 8)} ${padL('count', 6)}  fix`)
for (const r of report.rules) {
  console.log(`${pad(r.id, 20)} ${pad(r.severity, 8)} ${padL(r.count, 6)}  ${r.fix}`)
}

console.log(`\nenrichment queue — top ${Math.min(20, report.queue.length)} of ${report.queue.length}:`)
for (const q of report.queue.slice(0, 20)) {
  console.log(`  ${pad(q.tier, 11)} score=${padL(q.score, 3)}  ${(q.label ?? q.id).slice(0, 40).padEnd(40)}  ${q.issues.join(', ')}`)
}
console.log(`\nsupported tables: ${supportedQualityTables().join(', ')}`)
