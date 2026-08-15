import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const auditPath = path.join(appRoot, '.data', 'audit.jsonl')

export type AuditEntry = {
  ts: string
  actor: 'ui' | 'agent'
  tool: string
  table?: string
  summary: string
  rowCount?: number
  meta?: Record<string, unknown>
}

export async function appendAudit(entry: Omit<AuditEntry, 'ts'> & { ts?: string }) {
  const line = JSON.stringify({
    ts: entry.ts ?? new Date().toISOString(),
    actor: entry.actor,
    tool: entry.tool,
    table: entry.table,
    summary: entry.summary,
    rowCount: entry.rowCount,
    meta: entry.meta,
  })
  await mkdir(path.dirname(auditPath), { recursive: true })
  await appendFile(auditPath, `${line}\n`, 'utf8')
}

export async function readAudit(limit = 100): Promise<AuditEntry[]> {
  try {
    const { readFile } = await import('node:fs/promises')
    const raw = await readFile(auditPath, 'utf8')
    const lines = raw.trim().split('\n').filter(Boolean)
    return lines
      .slice(-limit)
      .reverse()
      .map((line) => JSON.parse(line) as AuditEntry)
  } catch {
    return []
  }
}
