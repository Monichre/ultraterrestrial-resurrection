/**
 * Drop-to-Canvas (T-060) — map raw `searchDatabase` rows to the `DropMatch[]`
 * the canvas consumes (contract §4).
 *
 * Rows arrive as whole table rows, which includes the 1536-float `embedding`
 * column. Fields are therefore picked explicitly rather than spread — spreading
 * would push ~12 × 1536 floats over the wire for no reader.
 */
import type {DropMatch} from './types'

/** Longest snippet returned per match. document_chunks rows carry a full chunk
 *  (~1–2k chars); the canvas only needs enough for a tooltip and inspector. */
const SNIPPET_CHARS = 320

/** Checked in order — the first non-empty one becomes the snippet. Covers every
 *  VECTOR_TABLES member: content (document_chunks), description (topics,
 *  events, organizations, testimonies, artifacts), summary (documents, topics,
 *  events, testimonies), bio/role (key_figures), specialization
 *  (organizations), origin (artifacts). */
const SNIPPET_FIELDS = [
  'content',
  'description',
  'summary',
  'bio',
  'origin',
  'role',
  'specialization',
  'comments',
] as const

const asText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}…`
}

function snippetFor(row: Record<string, unknown>): string {
  for (const field of SNIPPET_FIELDS) {
    const value = asText(row[field])
    if (value) return truncate(value, SNIPPET_CHARS)
  }
  return ''
}

function titleFor(row: Record<string, unknown>, table: string): string {
  // document_chunks has no title of its own; search.ts LEFT JOINs the parent
  // document and exposes it as document_title (search.ts:224).
  if (table === 'document_chunks') {
    return asText(row.document_title) || 'Untitled document'
  }
  return asText(row.title) || asText(row.name) || 'Untitled record'
}

function urlFor(row: Record<string, unknown>, table: string): string | null {
  if (table === 'document_chunks') return asText(row.document_url) || null
  return asText(row.url) || null
}

/**
 * Convert fused `searchDatabase` rows into contract-shaped matches, dropping
 * rows with no usable id. Order is preserved — searchDatabase already returns
 * RRF-descending — and re-sorted defensively so `matches` is guaranteed
 * score-descending per contract §4.
 */
export function toDropMatches(rows: Record<string, unknown>[]): DropMatch[] {
  return rows
    .map((row) => {
      const table = asText(row._table) || 'unknown'
      const id = asText(row.id) || asText(row.xata_id)
      if (!id) return null
      return {
        table,
        id,
        title: titleFor(row, table),
        snippet: snippetFor(row),
        score: typeof row._rrfScore === 'number' ? row._rrfScore : 0,
        url: urlFor(row, table),
      } satisfies DropMatch
    })
    .filter((match): match is DropMatch => match !== null)
    .sort((a, b) => b.score - a.score)
}

/**
 * Which corpus tables actually returned candidates. Derived from the results,
 * not from the VECTOR_TABLES constant — contract §4 asks what answered, and a
 * hardcoded list would claim tables that returned nothing.
 */
export function tablesSearched(matches: DropMatch[]): string[] {
  return [...new Set(matches.map((match) => match.table))].sort()
}
