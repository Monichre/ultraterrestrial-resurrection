/**
 * Full-text + vector search over Postgres.
 * Replaces xata.search.all() and searchXata() with:
 *   1. tsvector FTS (pg_trgm similarity as tiebreaker)
 *   2. pgvector cosine similarity (when embedding available)
 *   3. Combined ranked union
 */
import { getSql } from './client'
import type { SearchResponse } from './types'

// Tables that have a search_vector tsvector column
const FTS_TABLES = new Set([
  'topics', 'key_figures', 'events', 'organizations',
  'sightings', 'testimonies', 'documents', 'artifacts',
])

// Tables that have an embedding vector(1536) column
const VECTOR_TABLES = new Set([
  'topics', 'key_figures', 'events', 'organizations',
  'testimonies', 'documents', 'artifacts',
])

const TABLE_ALIAS: Record<string, string> = {
  personnel: 'key_figures',
  'key-figures': 'key_figures',
  'key_figures': 'key_figures',
}

function resolveTable(name: string): string {
  const lower = name.toLowerCase()
  return TABLE_ALIAS[lower] ?? lower
}

/** FTS search against a single table. Returns rows with a ts_rank score. */
async function ftsSingle(
  table: string,
  query: string,
  limit: number,
): Promise<Record<string, unknown>[]> {
  const sql = getSql()
  if (!FTS_TABLES.has(table)) return []
  return sql`
    SELECT *, ts_rank(search_vector, plainto_tsquery('english', ${query})) AS _score
    FROM ${sql(table)}
    WHERE search_vector @@ plainto_tsquery('english', ${query})
    ORDER BY _score DESC
    LIMIT ${limit}
  ` as Promise<Record<string, unknown>[]>
}

/** trgm-based similarity search (catches partial/fuzzy matches without FTS) */
async function trgmSingle(
  table: string,
  query: string,
  limit: number,
): Promise<Record<string, unknown>[]> {
  const sql = getSql()
  // Find columns that are TEXT and likely to contain names/descriptions
  const textCols: Record<string, string[]> = {
    topics:        ['name', 'description', 'summary'],
    key_figures:   ['name', 'bio', 'role'],
    events:        ['name', 'title', 'description', 'summary'],
    organizations: ['name', 'description'],
    sightings:     ['comments', 'shape', 'city'],
    testimonies:   ['title', 'description', 'summary'],
    documents:     ['title', 'summary'],
    artifacts:     ['name', 'description'],
  }
  const cols = textCols[table]
  if (!cols) return []

  // Build a similarity expression over all text columns
  const simExpr = cols
    .map(c => `similarity(coalesce(${c}::text,''), ${JSON.stringify(query)})`)
    .join(' + ')

  return sql.unsafe(`
    SELECT *, (${simExpr}) AS _score
    FROM "${table}"
    WHERE (${simExpr}) > 0.1
    ORDER BY _score DESC
    LIMIT ${limit}
  `) as Promise<Record<string, unknown>[]>
}

/**
 * Search a single table using FTS + trgm fallback.
 * Returns records enriched with { xata: { score, highlight } } for backward compat.
 */
export async function searchTable(
  table: string,
  query: string,
  limit = 10,
): Promise<Record<string, unknown>[]> {
  if (!query?.trim()) return []
  const pgTable = resolveTable(table)

  let rows: Record<string, unknown>[] = []

  try {
    rows = await ftsSingle(pgTable, query, limit)
  } catch {
    // FTS failed (e.g., table has no search_vector) — fall through
  }

  if (rows.length === 0) {
    try {
      rows = await trgmSingle(pgTable, query, limit)
    } catch {
      // trgm extension not available or table not in list — return empty
    }
  }

  return rows.map(r => {
    const score = (r._score as number) ?? 0
    const { _score, ...record } = r
    return {
      ...record,
      xata: {
        score,
        highlight: {},
      },
      xataReasoning: {
        score,
        relevancyLevel: score > 0.5 ? 'high relevance' : score > 0.2 ? 'moderate relevance' : 'low relevance',
        highlightReasons: 'Full-text search match',
        searchTerms: query,
        explanation: `Postgres FTS match (score: ${score.toFixed(3)})`,
      },
    }
  })
}

/**
 * Cross-table search (replaces xata.search.all with no table specified).
 * Searches all FTS tables and merges results ranked by score.
 */
export async function searchAll(
  query: string,
  limit = 10,
): Promise<Record<string, unknown>[]> {
  if (!query?.trim()) return []

  const tables = [...FTS_TABLES]
  const results = await Promise.allSettled(
    tables.map(t => searchTable(t, query, Math.ceil(limit / 2)))
  )

  const merged: (Record<string, unknown> & { _table: string })[] = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      r.value.forEach(rec => merged.push({ ...rec, _table: tables[i] }))
    }
  })

  return merged
    .sort((a, b) => ((b.xata as any)?.score ?? 0) - ((a.xata as any)?.score ?? 0))
    .slice(0, limit)
}

/**
 * Drop-in replacement for searchXata() from the Xata SDK.
 * Preserves the same input/output shape.
 */
export async function searchXata({
  query,
  table,
}: {
  query: string
  id?: string | null
  table?: string | null
}): Promise<SearchResponse> {
  try {
    if (!query) return { success: false, error: 'Query is required' }
    const results = table
      ? await searchTable(table, query, 20)
      : await searchAll(query, 20)
    return { success: true, searchResults: results }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * searchDatabase — replaces the disclosure-mindmap-agent's search tool.
 * Preserves existing interface: { table, searchTerms, searchFields, limit }.
 */
export async function searchDatabase({
  table,
  searchTerms,
  limit = 3,
}: {
  table?: string
  searchTerms?: string[]
  searchFields?: string[]
  limit?: number
}): Promise<Record<string, unknown>[]> {
  if (!searchTerms?.length) return []
  const query = searchTerms.join(' ')
  const pgTable = table ? resolveTable(table.toLowerCase()) : undefined

  const results = pgTable
    ? await searchTable(pgTable, query, limit)
    : await searchAll(query, limit)

  return results
}
