/**
 * Full-text + vector search over Postgres.
 * Replaces xata.search.all() and searchXata() with:
 *   1. tsvector FTS (pg_trgm similarity as tiebreaker)
 *   2. pgvector cosine similarity (when embedding available)
 *   3. Combined ranked union
 */
import { getSql } from './client'
import type { SearchResponse } from './types'

// Tables that have a search_vector tsvector column.
// document_chunks is deliberately excluded — it has no search_vector column
// (see migrations/rebuild/0001_init.sql:467-476). It gets a trgm fallback via
// textCols in trgmSingle() instead of FTS.
const FTS_TABLES = new Set([
  'topics', 'key_figures', 'events', 'organizations',
  'sightings', 'testimonies', 'documents', 'artifacts',
])

// Tables that have an embedding vector(1536) column.
// document_chunks added so the 4,946 embedded chunks (previously write-only —
// no reader in this file included the table) become reachable through
// vectorSearch/vectorSearchAll/searchDatabase.
const VECTOR_TABLES = new Set([
  'topics', 'key_figures', 'events', 'organizations',
  'testimonies', 'documents', 'artifacts', 'document_chunks',
])

const TABLE_ALIAS: Record<string, string> = {
  personnel: 'key_figures',
  'key-figures': 'key_figures',
  'key_figures': 'key_figures',
  'document-chunks': 'document_chunks',
}

function resolveTable(name: string): string {
  const lower = name.toLowerCase()
  return TABLE_ALIAS[lower] ?? lower
}

/** FTS search against a single table. Returns rows with a ts_rank score.
 *  `table` is constrained to the FTS_TABLES whitelist, so inlining it as an
 *  identifier is injection-safe; the user query is passed as a bound param. */
async function ftsSingle(
  table: string,
  query: string,
  limit: number,
): Promise<Record<string, unknown>[]> {
  const sql = getSql()
  if (!FTS_TABLES.has(table)) return []
  return sql.query(
    `SELECT *, ts_rank(search_vector, plainto_tsquery('english', $1)) AS _score
     FROM "${table}"
     WHERE search_vector @@ plainto_tsquery('english', $1)
     ORDER BY _score DESC
     LIMIT $2`,
    [query, limit],
  ) as Promise<Record<string, unknown>[]>
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
    // No search_vector on this table (see FTS_TABLES comment above), so trgm
    // is the only keyword-search path in. content is the whole chunk, not a
    // short field like the entity tables' name/title — trgm similarity degrades
    // on long strings, but it's still a reachability win over zero keyword access.
    document_chunks: ['content'],
  }
  const cols = textCols[table]
  if (!cols) return []

  // Build a similarity expression over all text columns. Column names come from
  // the static map above (safe to inline); the query value is bound as $1.
  const simExpr = cols
    .map(c => `similarity(coalesce("${c}"::text,''), $1)`)
    .join(' + ')

  return sql.query(
    `SELECT *, (${simExpr}) AS _score
     FROM "${table}"
     WHERE (${simExpr}) > 0.1
     ORDER BY _score DESC
     LIMIT $2`,
    [query, limit],
  ) as Promise<Record<string, unknown>[]>
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
 * Vector (pgvector cosine) search against a single table.
 * Returns records enriched with the same xata/xataReasoning shape as searchTable.
 */
export async function vectorSearch(
  table: string,
  embedding: number[],
  limit = 10,
): Promise<Record<string, unknown>[]> {
  const pgTable = resolveTable(table)
  if (!VECTOR_TABLES.has(pgTable)) return []

  const sql = getSql()
  const vecLiteral = `[${embedding.join(',')}]`

  let rows: Record<string, unknown>[] = []
  try {
    // document_chunks has no `title` (unlike every other VECTOR_TABLES member)
    // and its useful display context — what document it's from — lives in a
    // parent row. Join it in rather than forcing the chunk into the entity
    // shape, so results are attributable without a second round-trip.
    rows = pgTable === 'document_chunks'
      ? await sql.query(
          `SELECT dc.*, d.title AS document_title, d.url AS document_url,
                  d.source_tier AS document_source_tier,
                  1-(dc.embedding <=> $1::vector) AS _score
           FROM document_chunks dc
           LEFT JOIN documents d ON d.id = dc.document
           WHERE dc.embedding IS NOT NULL
           ORDER BY dc.embedding <=> $1::vector
           LIMIT $2`,
          [vecLiteral, limit],
        ) as Record<string, unknown>[]
      : await sql.query(
          `SELECT *, 1-(embedding <=> $1::vector) AS _score
           FROM "${pgTable}"
           WHERE embedding IS NOT NULL
           ORDER BY embedding <=> $1::vector
           LIMIT $2`,
          [vecLiteral, limit],
        ) as Record<string, unknown>[]
  } catch {
    return []
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
        relevancyLevel: score > 0.8 ? 'high relevance' : score > 0.6 ? 'moderate relevance' : 'low relevance',
        highlightReasons: 'Vector similarity match',
        searchTerms: '',
        explanation: `pgvector cosine similarity (score: ${score.toFixed(4)})`,
      },
    }
  })
}

/**
 * Fan-out vector search across all VECTOR_TABLES.
 * Merges results, sorts by score desc, returns top `limit` with _table tag.
 */
export async function vectorSearchAll(
  embedding: number[],
  limit = 10,
): Promise<Record<string, unknown>[]> {
  const tables = [...VECTOR_TABLES]
  const results = await Promise.allSettled(
    tables.map(t => vectorSearch(t, embedding, Math.ceil(limit / 2)))
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

const recordId = (rec: Record<string, unknown>): string | undefined =>
  (rec.id ?? rec.xata_id) as string | undefined

/**
 * Reciprocal Rank Fusion — merge N ranked result lists into one ranking that is
 * invariant to each list's score scale. A record's fused score is the sum over
 * every list of 1/(k + rank), where rank is its 0-based position in that list.
 * k dampens the contribution of low-ranked items; 60 is the canonical default
 * from the original RRF paper (Cormack et al., 2009).
 *
 * Why this and not raw-score sort: FTS ts_rank (~0–0.1) and pgvector cosine
 * (~0.6–1.0) are not comparable as numbers. Sorting their union by raw score
 * lets vector hits dominate purely by magnitude. RRF ranks by agreement of
 * position across signals, so a result both searches surface rises to the top.
 */
function fuseRRF(
  lists: Record<string, unknown>[][],
  limit: number,
  k = 60,
): Record<string, unknown>[] {
  const fused = new Map<string, { rec: Record<string, unknown>, score: number }>()

  for (const list of lists) {
    list.forEach((rec, rank) => {
      const id = recordId(rec)
      if (!id) return
      const contribution = 1 / (k + rank)
      const existing = fused.get(id)
      if (existing) {
        existing.score += contribution
        // Prefer the variant carrying the higher native relevance score, so the
        // surfaced record keeps its strongest xata/xataReasoning payload.
        const existingNative = (existing.rec.xata as any)?.score ?? 0
        const recNative = (rec.xata as any)?.score ?? 0
        if (recNative > existingNative) existing.rec = rec
      } else {
        fused.set(id, { rec, score: contribution })
      }
    })
  }

  return [...fused.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ rec, score }) => ({
      ...rec,
      _rrfScore: score,
    }))
}

/**
 * searchDatabase — the disclosure-mindmap-agent + Prometheus chat search tool.
 * Preserves existing interface: { table, searchTerms, searchFields, limit }.
 * When `embedding` is provided, runs FTS and pgvector search in parallel and
 * fuses them with Reciprocal Rank Fusion (scale-invariant), so keyword and
 * semantic matches compete on rank agreement rather than raw score magnitude.
 */
export async function searchDatabase({
  table,
  searchTerms,
  limit = 3,
  embedding,
}: {
  table?: string
  searchTerms?: string[]
  searchFields?: string[]
  limit?: number
  embedding?: number[]
}): Promise<Record<string, unknown>[]> {
  if (!searchTerms?.length && !embedding?.length) return []
  const query = searchTerms?.join(' ') ?? ''
  const pgTable = table ? resolveTable(table.toLowerCase()) : undefined

  if (!embedding?.length) {
    // FTS only
    return pgTable
      ? searchTable(pgTable, query, limit)
      : searchAll(query, limit)
  }

  // Pull a deeper candidate pool from each signal than the final limit so RRF
  // has rank structure to fuse, then trim to `limit` after fusion.
  const pool = Math.max(limit * 3, 10)

  const [ftsResults, vecResults] = await Promise.all([
    query
      ? (pgTable ? searchTable(pgTable, query, pool) : searchAll(query, pool))
      : Promise.resolve([] as Record<string, unknown>[]),
    pgTable
      ? vectorSearch(pgTable, embedding, pool)
      : vectorSearchAll(embedding, pool),
  ])

  return fuseRRF([ftsResults, vecResults], limit)
}
