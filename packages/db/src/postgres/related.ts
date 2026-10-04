/**
 * Related-record suggestion engine for the Research Canvas.
 *
 * Given the entities currently on the canvas ("seeds"), surfaces the most
 * promising unexplored records from three independent signals:
 *
 *   1. `connected` — documented links through the five join tables
 *      (event/topic subject-matter experts, org members, topic testimonies)
 *   2. `similar`   — pgvector cosine neighbors of the seeds' STORED
 *      embeddings (no embedding API call — works even when OpenAI is down)
 *   3. `temporal`  — events within a ±N-year window of seed events
 *
 * Every suggestion carries the seed it attaches to and a human-readable
 * reason, so the canvas can draw a justified edge the moment it is added.
 */
import { getSql } from './client'
import { resolveTable } from './queries'

export type RelatedReason = 'connected' | 'similar' | 'temporal'

export type RelatedSeed = { id: string; table: string }

export type RelatedSuggestion = {
  id: string
  table: string
  title: string
  snippet: string
  /** 0..1 relevance for ordering within its reason group */
  score: number
  reason: RelatedReason
  /** Human-readable justification, rendered on the suggestion card and edge */
  reasonDetail: string
  /** Canvas node this suggestion should connect to */
  seedId: string
  seedTitle: string
  record: Record<string, unknown>
}

const VECTOR_TABLES = [
  'topics', 'key_figures', 'events', 'organizations',
  'testimonies', 'documents', 'artifacts',
] as const

const TITLE_EXPR: Record<string, string> = {
  topics: `coalesce(name, id)`,
  key_figures: `coalesce(name, id)`,
  events: `coalesce(name, title, id)`,
  organizations: `coalesce(name, id)`,
  testimonies: `coalesce(title, id)`,
  documents: `coalesce(title, id)`,
  artifacts: `coalesce(name, id)`,
  sightings: `coalesce(city, id)`,
}

function titleOf(table: string, r: Record<string, unknown>): string {
  // Some legacy event rows carry scraper junk like `dateText:"1946"` in `name`
  // while the real label lives in `title` — skip junk candidates.
  const candidates = [r.name, r.title, r.label]
    .map(v => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : ''))
    .filter(v => v && !v.startsWith('dateText:'))
  return candidates[0] ?? String(r.id ?? 'Untitled')
}

function snippetOf(r: Record<string, unknown>): string {
  const raw = r.summary ?? r.description ?? r.bio ?? r.comments ?? ''
  const s = String(raw ?? '').replace(/\s+/g, ' ').trim()
  return s.length > 220 ? `${s.slice(0, 217)}…` : s
}

async function fetchRecords(
  table: string,
  ids: string[],
): Promise<Map<string, Record<string, unknown>>> {
  if (!ids.length) return new Map()
  const sql = getSql()
  const rows = (await sql.query(
    `SELECT * FROM "${table}" WHERE id = ANY($1)`,
    [ids],
  )) as Record<string, unknown>[]
  return new Map(rows.map(r => [String(r.id), r]))
}

// ---------------------------------------------------------------------------
// Signal 1 — documented join-table connections
// ---------------------------------------------------------------------------

type JoinHit = { targetTable: string; targetId: string; seedId: string; via: string }

/** Query every join table that can touch the given seeds, in parallel. */
async function findJoinConnections(seedsByTable: Map<string, string[]>): Promise<JoinHit[]> {
  const sql = getSql()
  const jobs: Promise<JoinHit[]>[] = []

  const q = (
    text: string,
    ids: string[],
    map: (r: Record<string, unknown>) => JoinHit[],
  ) => {
    if (!ids.length) return
    jobs.push(
      (sql.query(text, [ids]) as Promise<Record<string, unknown>[]>)
        .then(rows => rows.flatMap(map))
        .catch(() => []),
    )
  }

  const events = seedsByTable.get('events') ?? []
  const figures = seedsByTable.get('key_figures') ?? []
  const topics = seedsByTable.get('topics') ?? []
  const orgs = seedsByTable.get('organizations') ?? []
  const testimonies = seedsByTable.get('testimonies') ?? []

  // events → experts / topics
  q(`SELECT event, subject_matter_expert FROM event_subject_matter_experts WHERE event = ANY($1)`,
    events,
    r => [{ targetTable: 'key_figures', targetId: String(r.subject_matter_expert), seedId: String(r.event), via: 'documented subject-matter expert' }])
  q(`SELECT event, topic, subject_matter_expert FROM event_topic_subject_matter_experts WHERE event = ANY($1)`,
    events,
    r => [
      ...(r.topic ? [{ targetTable: 'topics', targetId: String(r.topic), seedId: String(r.event), via: 'topic documented on this event' }] : []),
      ...(r.subject_matter_expert ? [{ targetTable: 'key_figures', targetId: String(r.subject_matter_expert), seedId: String(r.event), via: 'expert documented on this event' }] : []),
    ])

  // key figures → events / topics / organizations
  q(`SELECT event, subject_matter_expert FROM event_subject_matter_experts WHERE subject_matter_expert = ANY($1)`,
    figures,
    r => [{ targetTable: 'events', targetId: String(r.event), seedId: String(r.subject_matter_expert), via: 'event this figure is an expert on' }])
  q(`SELECT topic, subject_matter_expert FROM topic_subject_matter_experts WHERE subject_matter_expert = ANY($1)`,
    figures,
    r => [{ targetTable: 'topics', targetId: String(r.topic), seedId: String(r.subject_matter_expert), via: 'topic this figure is an expert on' }])
  q(`SELECT organization, member FROM organization_members WHERE member = ANY($1)`,
    figures,
    r => [{ targetTable: 'organizations', targetId: String(r.organization), seedId: String(r.member), via: 'organization this figure belongs to' }])
  q(`SELECT event, topic, subject_matter_expert FROM event_topic_subject_matter_experts WHERE subject_matter_expert = ANY($1)`,
    figures,
    r => [
      ...(r.event ? [{ targetTable: 'events', targetId: String(r.event), seedId: String(r.subject_matter_expert), via: 'event linked through expertise' }] : []),
      ...(r.topic ? [{ targetTable: 'topics', targetId: String(r.topic), seedId: String(r.subject_matter_expert), via: 'topic linked through expertise' }] : []),
    ])

  // topics → experts / testimonies / events
  q(`SELECT topic, subject_matter_expert FROM topic_subject_matter_experts WHERE topic = ANY($1)`,
    topics,
    r => [{ targetTable: 'key_figures', targetId: String(r.subject_matter_expert), seedId: String(r.topic), via: 'documented expert on this topic' }])
  q(`SELECT topic, testimony FROM topics_testimonies WHERE topic = ANY($1)`,
    topics,
    r => [{ targetTable: 'testimonies', targetId: String(r.testimony), seedId: String(r.topic), via: 'testimony filed under this topic' }])
  q(`SELECT event, topic, subject_matter_expert FROM event_topic_subject_matter_experts WHERE topic = ANY($1)`,
    topics,
    r => [
      ...(r.event ? [{ targetTable: 'events', targetId: String(r.event), seedId: String(r.topic), via: 'event documented under this topic' }] : []),
    ])

  // organizations → members
  q(`SELECT organization, member FROM organization_members WHERE organization = ANY($1)`,
    orgs,
    r => [{ targetTable: 'key_figures', targetId: String(r.member), seedId: String(r.organization), via: 'documented member of this organization' }])

  // testimonies → topics
  q(`SELECT topic, testimony FROM topics_testimonies WHERE testimony = ANY($1)`,
    testimonies,
    r => [{ targetTable: 'topics', targetId: String(r.topic), seedId: String(r.testimony), via: 'topic this testimony supports' }])

  const settled = await Promise.all(jobs)
  return settled.flat().filter(h => h.targetId && h.targetId !== 'null')
}

// ---------------------------------------------------------------------------
// Signal 2 — pgvector similarity on STORED embeddings
// ---------------------------------------------------------------------------

function parseVector(text: unknown): number[] | null {
  if (typeof text !== 'string' || !text.startsWith('[')) return null
  try {
    const arr = JSON.parse(text) as number[]
    return Array.isArray(arr) && arr.length ? arr : null
  } catch {
    return null
  }
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom ? dot / denom : 0
}

async function fetchSeedEmbeddings(
  seedsByTable: Map<string, string[]>,
): Promise<{ id: string; table: string; vec: number[] }[]> {
  const sql = getSql()
  const jobs: Promise<{ id: string; table: string; vec: number[] }[]>[] = []
  for (const [table, ids] of seedsByTable) {
    if (!(VECTOR_TABLES as readonly string[]).includes(table) || !ids.length) continue
    jobs.push(
      (sql.query(
        `SELECT id, embedding::text AS emb FROM "${table}" WHERE id = ANY($1) AND embedding IS NOT NULL`,
        [ids],
      ) as Promise<Record<string, unknown>[]>)
        .then(rows =>
          rows
            .map(r => ({ id: String(r.id), table, vec: parseVector(r.emb) }))
            .filter((x): x is { id: string; table: string; vec: number[] } => Boolean(x.vec)),
        )
        .catch(() => []),
    )
  }
  return (await Promise.all(jobs)).flat()
}

async function findEmbeddingNeighbors(
  seedVectors: { id: string; table: string; vec: number[] }[],
  excludeIds: string[],
  perTable: number,
): Promise<{ row: Record<string, unknown>; table: string; score: number; seedId: string }[]> {
  if (!seedVectors.length) return []
  const sql = getSql()

  // The centroid of everything on the canvas IS the research direction —
  // neighbors of the centroid are records aligned with the inquiry as a whole.
  const dims = seedVectors[0].vec.length
  const centroid = new Array<number>(dims).fill(0)
  for (const s of seedVectors) for (let i = 0; i < dims; i++) centroid[i] += s.vec[i] / seedVectors.length
  const centroidLiteral = `[${centroid.join(',')}]`

  const jobs = VECTOR_TABLES.map(table =>
    (sql.query(
      `SELECT *, embedding::text AS _emb, 1 - (embedding <=> $1::vector) AS _score
       FROM "${table}"
       WHERE embedding IS NOT NULL AND NOT (id = ANY($2))
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      [centroidLiteral, excludeIds, perTable],
    ) as Promise<Record<string, unknown>[]>)
      .then(rows =>
        rows.map(row => {
          // Attribute the neighbor to its closest individual seed so the
          // canvas can draw the edge to the right node.
          const vec = parseVector(row._emb)
          let best = seedVectors[0], bestSim = -1
          if (vec) {
            for (const s of seedVectors) {
              const sim = cosine(vec, s.vec)
              if (sim > bestSim) { bestSim = sim; best = s }
            }
          }
          const { _emb, embedding, _score, ...clean } = row
          return { row: clean, table, score: Number(_score ?? 0), seedId: best.id }
        }),
      )
      .catch(() => []),
  )

  return (await Promise.all(jobs)).flat()
}

// ---------------------------------------------------------------------------
// Signal 3 — temporal proximity between events
// ---------------------------------------------------------------------------

async function findTemporalNeighbors(
  eventSeedIds: string[],
  excludeIds: string[],
  windowYears: number,
  limit: number,
): Promise<{ row: Record<string, unknown>; seedId: string; deltaYears: number }[]> {
  if (!eventSeedIds.length) return []
  const sql = getSql()
  try {
    const seeds = (await sql.query(
      `SELECT id, date FROM events WHERE id = ANY($1) AND date IS NOT NULL`,
      [eventSeedIds],
    )) as { id: string; date: string }[]
    if (!seeds.length) return []

    const times = seeds.map(s => new Date(s.date).getTime())
    const windowMs = windowYears * 365.25 * 24 * 3600 * 1000
    const start = new Date(Math.min(...times) - windowMs).toISOString()
    const end = new Date(Math.max(...times) + windowMs).toISOString()

    const rows = (await sql.query(
      `SELECT * FROM events
       WHERE date >= $1::timestamptz AND date <= $2::timestamptz AND NOT (id = ANY($3))
       ORDER BY date ASC
       LIMIT $4`,
      [start, end, excludeIds, limit],
    )) as Record<string, unknown>[]

    return rows.map(row => {
      const t = new Date(String(row.date)).getTime()
      let best = seeds[0], bestDelta = Infinity
      for (let i = 0; i < seeds.length; i++) {
        const d = Math.abs(times[i] - t)
        if (d < bestDelta) { bestDelta = d; best = seeds[i] }
      }
      return { row, seedId: best.id, deltaYears: bestDelta / (365.25 * 24 * 3600 * 1000) }
    })
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getRelatedRecords({
  seeds,
  excludeIds = [],
  limit = 9,
  temporalWindowYears = 4,
}: {
  seeds: RelatedSeed[]
  /** every record id already on the canvas (suggestions must be NEW) */
  excludeIds?: string[]
  limit?: number
  temporalWindowYears?: number
}): Promise<RelatedSuggestion[]> {
  if (!seeds.length) return []

  // Most-recent seeds carry the research direction; cap the fan-out.
  const activeSeeds = seeds.slice(-8)
  const seedsByTable = new Map<string, string[]>()
  for (const s of activeSeeds) {
    const t = resolveTable(s.table)
    seedsByTable.set(t, [...(seedsByTable.get(t) ?? []), s.id])
  }
  const allSeedIds = activeSeeds.map(s => s.id)
  const exclude = [...new Set([...excludeIds, ...seeds.map(s => s.id)])]

  const [joinHits, seedVectors] = await Promise.all([
    findJoinConnections(seedsByTable),
    fetchSeedEmbeddings(seedsByTable),
  ])

  const [neighbors, temporal] = await Promise.all([
    findEmbeddingNeighbors(seedVectors, exclude, 3),
    findTemporalNeighbors(seedsByTable.get('events') ?? [], exclude, temporalWindowYears, 6),
  ])

  // Hydrate join-hit targets (batched per table) and seed titles.
  const joinIdsByTable = new Map<string, string[]>()
  for (const h of joinHits) {
    if (exclude.includes(h.targetId)) continue
    joinIdsByTable.set(h.targetTable, [...(joinIdsByTable.get(h.targetTable) ?? []), h.targetId])
  }
  const [joinRecordMaps, seedRecordMaps] = await Promise.all([
    Promise.all([...joinIdsByTable].map(async ([t, ids]) => [t, await fetchRecords(t, [...new Set(ids)])] as const)),
    Promise.all([...seedsByTable].map(async ([t, ids]) => [t, await fetchRecords(t, ids)] as const)),
  ])
  const joinRecords = new Map(joinRecordMaps)
  const seedTitles = new Map<string, string>()
  for (const [t, m] of seedRecordMaps) for (const [id, r] of m) seedTitles.set(id, titleOf(t, r))

  const out: RelatedSuggestion[] = []
  const taken = new Set<string>(exclude)

  // 1) documented connections — strongest signal, always first
  for (const h of joinHits) {
    if (taken.has(h.targetId)) continue
    const rec = joinRecords.get(h.targetTable)?.get(h.targetId)
    if (!rec) continue
    taken.add(h.targetId)
    out.push({
      id: h.targetId,
      table: h.targetTable,
      title: titleOf(h.targetTable, rec),
      snippet: snippetOf(rec),
      score: 0.95,
      reason: 'connected',
      reasonDetail: `${h.via} — “${seedTitles.get(h.seedId) ?? h.seedId}”`,
      seedId: h.seedId,
      seedTitle: seedTitles.get(h.seedId) ?? h.seedId,
      record: rec,
    })
  }

  // 2) semantic neighbors of the canvas centroid
  for (const n of neighbors.sort((a, b) => b.score - a.score)) {
    const id = String(n.row.id)
    if (taken.has(id)) continue
    taken.add(id)
    out.push({
      id,
      table: n.table,
      title: titleOf(n.table, n.row),
      snippet: snippetOf(n.row),
      score: n.score,
      reason: 'similar',
      reasonDetail: `${Math.round(n.score * 100)}% semantic affinity with “${seedTitles.get(n.seedId) ?? n.seedId}”`,
      seedId: n.seedId,
      seedTitle: seedTitles.get(n.seedId) ?? n.seedId,
      record: n.row,
    })
  }

  // 3) temporal cluster around seed events
  for (const t of temporal) {
    const id = String(t.row.id)
    if (taken.has(id)) continue
    taken.add(id)
    const years = t.deltaYears < 1
      ? 'within a year'
      : `${t.deltaYears.toFixed(0)} year${t.deltaYears >= 1.5 ? 's' : ''} apart`
    out.push({
      id,
      table: 'events',
      title: titleOf('events', t.row),
      snippet: snippetOf(t.row),
      score: Math.max(0.2, 1 - t.deltaYears / 10),
      reason: 'temporal',
      reasonDetail: `occurred ${years} from “${seedTitles.get(t.seedId) ?? t.seedId}”`,
      seedId: t.seedId,
      seedTitle: seedTitles.get(t.seedId) ?? t.seedId,
      record: t.row,
    })
  }

  // Dedupe by display title too — the events table contains near-duplicate
  // rows (same incident ingested twice with different ids).
  const seenTitles = new Set<string>()
  const unique = out.filter(s => {
    const key = `${s.table}:${s.title.toLowerCase()}`
    if (seenTitles.has(key)) return false
    seenTitles.add(key)
    return true
  })

  // Reason diversity: raw scores are not comparable across signals (cosine
  // ~0.4–0.7 vs temporal ~0.7–0.9), so allocate slots per reason instead of
  // sorting the union — half documented connections, a quarter each for
  // semantic and temporal, then backfill whatever is left.
  const byReason = (r: RelatedReason) =>
    unique.filter(s => s.reason === r).sort((a, b) => b.score - a.score)
  const picked = [
    ...byReason('connected').slice(0, Math.max(3, Math.floor(limit / 2))),
    ...byReason('similar').slice(0, Math.max(2, Math.floor(limit / 4))),
    ...byReason('temporal').slice(0, Math.max(2, Math.floor(limit / 4))),
  ]
  if (picked.length < limit) {
    const pickedIds = new Set(picked.map(s => s.id))
    picked.push(...unique.filter(s => !pickedIds.has(s.id)).slice(0, limit - picked.length))
  }
  return picked.slice(0, limit)
}
