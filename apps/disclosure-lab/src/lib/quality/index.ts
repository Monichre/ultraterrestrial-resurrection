/**
 * Quality-check runner: evaluates a table's rule catalog and produces a
 * tiered report plus an enrichment queue (worst records first).
 *
 * Optionally appends a one-line run record to .data/quality-runs.jsonl —
 * same pattern as .data/audit.jsonl — so routine runs build a trend log.
 */
import { appendFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { QUALITY_CATALOGS, QualitySeverity } from './rules'
import { LAB_ROOT } from '../paths'

/** Minimal shape shared by the lab's @db/postgres client and a bare neon() call. */
export type SqlClient = {
  query: (query: string, params?: unknown[]) => Promise<unknown[]>
}

const runsPath = path.join(LAB_ROOT, '.data', 'quality-runs.jsonl')

const SEV_WEIGHT: Record<QualitySeverity, number> = { blocker: 25, warn: 8, info: 2 }
const ISSUE_ROWS_CAP = 500 // per-rule id collection cap
const SAMPLE_CAP = 25      // ids returned per rule in the report

export type QualityTier = 'broken' | 'needs_work' | 'thin' | 'ok'

export type QualityIssueRow = {
  id: string
  label: string | null
  issues: string[]
  tier: QualityTier
  score: number
}

export type QualityReport = {
  table: string
  runAt: string
  total: number
  tiers: Record<QualityTier, number>
  rules: {
    id: string
    severity: QualitySeverity
    label: string
    fix: string
    count: number
    sampleIds: string[]
  }[]
  /** Every record with ≥1 issue, sorted worst-first. */
  queue: QualityIssueRow[]
}

type RunEntry = {
  ts: string
  table: string
  total: number
  tiers: Record<QualityTier, number>
  ruleCounts: Record<string, number>
}

export function supportedQualityTables(): string[] {
  return Object.keys(QUALITY_CATALOGS)
}

export async function runQualityCheck(
  table: string,
  opts: { record?: boolean; sql?: SqlClient } = {},
): Promise<QualityReport> {
  const catalog = QUALITY_CATALOGS[table]
  if (!catalog) {
    throw new Error(
      `No quality rules for "${table}". Cataloged: ${supportedQualityTables().join(', ')}`,
    )
  }
  // Lazy so the CLI can inject its own client without pulling @db/postgres.
  const sql = opts.sql ?? (await import('../db')).getSql()

  const totalRows = (await sql.query(
    `SELECT count(*)::int AS count FROM "${catalog.table}"`,
  )) as { count: number }[]
  const total = totalRows[0]?.count ?? 0

  const issuesById = new Map<
    string,
    { id: string; label: string | null; issues: string[]; weight: number; maxSev: QualitySeverity | null }
  >()
  const sevRank: Record<QualitySeverity, number> = { blocker: 3, warn: 2, info: 1 }

  const ruleResults: QualityReport['rules'] = []
  for (const rule of catalog.rules) {
    const where = rule.where.replaceAll('{t}', 'r').replaceAll('{table}', `"${catalog.table}"`)
    const rows = (await sql.query(
      `SELECT r.id, r."${catalog.labelCol}" AS label
       FROM "${catalog.table}" r
       WHERE ${where}
       ORDER BY r.id
       LIMIT ${ISSUE_ROWS_CAP}`,
    )) as { id: string; label: string | null }[]

    ruleResults.push({
      id: rule.id,
      severity: rule.severity,
      label: rule.label,
      fix: rule.fix,
      count: rows.length,
      sampleIds: rows.slice(0, SAMPLE_CAP).map((r) => r.id),
    })

    for (const row of rows) {
      const entry = issuesById.get(row.id) ?? {
        id: row.id,
        label: row.label,
        issues: [],
        weight: 0,
        maxSev: null,
      }
      entry.issues.push(rule.id)
      entry.weight += SEV_WEIGHT[rule.severity]
      if (!entry.maxSev || sevRank[rule.severity] > sevRank[entry.maxSev]) {
        entry.maxSev = rule.severity
      }
      issuesById.set(row.id, entry)
    }
  }

  const tierOf = (maxSev: QualitySeverity | null): QualityTier =>
    maxSev === 'blocker' ? 'broken' : maxSev === 'warn' ? 'needs_work' : 'thin'

  const queue: QualityIssueRow[] = [...issuesById.values()]
    .map((e) => ({
      id: e.id,
      label: e.label,
      issues: e.issues,
      tier: tierOf(e.maxSev),
      score: Math.max(0, 100 - e.weight),
    }))
    .sort((a, b) => a.score - b.score || b.issues.length - a.issues.length)

  const tiers: Record<QualityTier, number> = {
    broken: queue.filter((r) => r.tier === 'broken').length,
    needs_work: queue.filter((r) => r.tier === 'needs_work').length,
    thin: queue.filter((r) => r.tier === 'thin').length,
    ok: total - queue.length,
  }

  const report: QualityReport = {
    table: catalog.table,
    runAt: new Date().toISOString(),
    total,
    tiers,
    rules: ruleResults,
    queue,
  }

  if (opts.record) await appendQualityRun(report)
  return report
}

async function appendQualityRun(report: QualityReport) {
  const entry: RunEntry = {
    ts: report.runAt,
    table: report.table,
    total: report.total,
    tiers: report.tiers,
    ruleCounts: Object.fromEntries(report.rules.map((r) => [r.id, r.count])),
  }
  await mkdir(path.dirname(runsPath), { recursive: true })
  await appendFile(runsPath, `${JSON.stringify(entry)}\n`, 'utf8')
}

export async function listQualityRuns(table: string, limit = 30): Promise<RunEntry[]> {
  try {
    const raw = await readFile(runsPath, 'utf8')
    return raw
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as RunEntry)
      .filter((e) => e.table === table)
      .slice(-limit)
  } catch {
    return []
  }
}
