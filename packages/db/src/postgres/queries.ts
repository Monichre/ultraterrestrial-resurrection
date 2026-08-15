/**
 * Typed query functions for all entity tables.
 * Replaces Xata ORM calls: .getAll(), .getPaginated(), .read(), .filter().sort()
 */
import { getSql } from './client'
import type {
  TopicsRecord, PersonnelRecord, EventsRecord, OrganizationsRecord,
  SightingsRecord, TestimoniesRecord, DocumentsRecord, ArtifactsRecord,
  LocationsRecord, UsersRecord,
  EventSubjectMatterExpertsRecord, TopicSubjectMatterExpertsRecord,
  OrganizationMembersRecord, TopicsTestimoniesRecord,
  EventTopicSubjectMatterExpertsRecord,
} from './types'

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

const TABLE_MAP: Record<string, string> = {
  personnel: 'key_figures',
  'key-figures': 'key_figures',
  'key_figures': 'key_figures',
  'event-subject-matter-experts': 'event_subject_matter_experts',
  'topic-subject-matter-experts': 'topic_subject_matter_experts',
  'organization-members': 'organization_members',
  'topics-testimonies': 'topics_testimonies',
  'event-topic-subject-matter-experts': 'event_topic_subject_matter_experts',
  'summary-files': 'summary_files',
}

export function resolveTable(name: string): string {
  return TABLE_MAP[name] ?? TABLE_MAP[name.toLowerCase()] ?? name
}

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------

export async function getAllTopics(): Promise<TopicsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM topics ORDER BY name` as Promise<TopicsRecord[]>
}

export async function getTopicById(id: string): Promise<TopicsRecord | null> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM topics WHERE id = ${id} LIMIT 1` as TopicsRecord[]
  return rows[0] ?? null
}

// ---------------------------------------------------------------------------
// Key Figures (was "personnel" in Xata)
// ---------------------------------------------------------------------------

export async function getAllPersonnel(): Promise<PersonnelRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM key_figures ORDER BY name` as Promise<PersonnelRecord[]>
}

export async function getPersonnelById(id: string): Promise<PersonnelRecord | null> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM key_figures WHERE id = ${id} LIMIT 1` as PersonnelRecord[]
  return rows[0] ?? null
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function getAllEvents(): Promise<EventsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM events ORDER BY date DESC NULLS LAST` as Promise<EventsRecord[]>
}

export async function getEventById(id: string): Promise<EventsRecord | null> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM events WHERE id = ${id} LIMIT 1` as EventsRecord[]
  return rows[0] ?? null
}

export async function getEventsByDateRange(
  start: string,
  end: string,
  limit = 200,
): Promise<EventsRecord[]> {
  const sql = getSql()
  return sql`
    SELECT * FROM events
    WHERE date >= ${start}::timestamptz AND date <= ${end}::timestamptz
    ORDER BY date DESC
    LIMIT ${limit}
  ` as Promise<EventsRecord[]>
}

export async function getHistoricEvents(limit = 500): Promise<EventsRecord[]> {
  const sql = getSql()
  return sql`
    SELECT * FROM events
    WHERE ${sql`'historic' = ANY(category)`}
    ORDER BY date DESC NULLS LAST
    LIMIT ${limit}
  ` as Promise<EventsRecord[]>
}

export async function getEventsWithPhotos(limit = 9): Promise<EventsRecord[]> {
  const sql = getSql()
  return sql`
    SELECT * FROM events
    WHERE photos IS NOT NULL AND array_length(photos, 1) > 0
    ORDER BY date DESC NULLS LAST
    LIMIT ${limit}
  ` as Promise<EventsRecord[]>
}

export async function aggregateEventsByYear(
  start: string,
  end: string,
): Promise<{ year: number; count: number }[]> {
  const sql = getSql()
  return sql`
    SELECT EXTRACT(YEAR FROM date)::int AS year, count(*)::int AS count
    FROM events
    WHERE date >= ${start}::timestamptz AND date <= ${end}::timestamptz
    GROUP BY year ORDER BY year
  ` as Promise<{ year: number; count: number }[]>
}

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

export async function getAllOrganizations(): Promise<OrganizationsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM organizations ORDER BY name` as Promise<OrganizationsRecord[]>
}

// ---------------------------------------------------------------------------
// Sightings
// ---------------------------------------------------------------------------

export async function getAllSightings(
  limit = 50,
  offset = 0,
): Promise<{ records: SightingsRecord[]; hasMore: boolean }> {
  const sql = getSql()
  const records = await sql`
    SELECT * FROM sightings
    ORDER BY occurred_at DESC NULLS LAST
    LIMIT ${limit + 1} OFFSET ${offset}
  ` as SightingsRecord[]
  return { records: records.slice(0, limit), hasMore: records.length > limit }
}

export async function getSightingsByDateRange(
  start: string,
  end: string,
  limit = 200,
): Promise<SightingsRecord[]> {
  const sql = getSql()
  return sql`
    SELECT * FROM sightings
    WHERE occurred_at >= ${start}::timestamptz AND occurred_at <= ${end}::timestamptz
    ORDER BY occurred_at DESC
    LIMIT ${limit}
  ` as Promise<SightingsRecord[]>
}

export async function getSightingsWithCoords(
  start: string,
  end: string,
  limit = 200,
): Promise<SightingsRecord[]> {
  const sql = getSql()
  return sql`
    SELECT * FROM sightings
    WHERE occurred_at >= ${start}::timestamptz AND occurred_at <= ${end}::timestamptz
      AND latitude IS NOT NULL AND longitude IS NOT NULL
      AND latitude BETWEEN -90 AND 90
      AND longitude BETWEEN -180 AND 180
    ORDER BY occurred_at DESC
    LIMIT ${limit}
  ` as Promise<SightingsRecord[]>
}

export async function aggregateSightingsByShape(
  start: string,
  end: string,
  topN = 20,
): Promise<{ shape: string; count: number }[]> {
  const sql = getSql()
  return sql`
    SELECT shape, count(*)::int AS count
    FROM sightings
    WHERE occurred_at >= ${start}::timestamptz AND occurred_at <= ${end}::timestamptz
      AND shape IS NOT NULL
    GROUP BY shape ORDER BY count DESC LIMIT ${topN}
  ` as Promise<{ shape: string; count: number }[]>
}

export async function aggregateSightingsByCity(
  start: string,
  end: string,
  topN = 30,
): Promise<{ city: string; count: number }[]> {
  const sql = getSql()
  return sql`
    SELECT city, count(*)::int AS count
    FROM sightings
    WHERE occurred_at >= ${start}::timestamptz AND occurred_at <= ${end}::timestamptz
      AND city IS NOT NULL
    GROUP BY city ORDER BY count DESC LIMIT ${topN}
  ` as Promise<{ city: string; count: number }[]>
}

export async function sightingsTimeSeries(
  start: string,
  end: string,
): Promise<{ date: string; count: number }[]> {
  const sql = getSql()
  return sql`
    SELECT occurred_at::date::text AS date, count(*)::int AS count
    FROM sightings
    WHERE occurred_at >= ${start}::timestamptz AND occurred_at <= ${end}::timestamptz
    GROUP BY date ORDER BY date
  ` as Promise<{ date: string; count: number }[]>
}

export async function getPaginatedSightings(
  start: string,
  end: string,
  size = 100,
  offset = 0,
): Promise<{ records: SightingsRecord[]; hasMore: boolean }> {
  const sql = getSql()
  const records = await sql`
    SELECT * FROM sightings
    WHERE occurred_at >= ${start}::timestamptz AND occurred_at <= ${end}::timestamptz
    ORDER BY occurred_at ASC
    LIMIT ${size + 1} OFFSET ${offset}
  ` as SightingsRecord[]
  return { records: records.slice(0, size), hasMore: records.length > size }
}

// ---------------------------------------------------------------------------
// Testimonies
// ---------------------------------------------------------------------------

export async function getAllTestimonies(): Promise<TestimoniesRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM testimonies ORDER BY date DESC NULLS LAST` as Promise<TestimoniesRecord[]>
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export async function getAllDocuments(): Promise<DocumentsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM documents ORDER BY xata_createdat DESC` as Promise<DocumentsRecord[]>
}

// ---------------------------------------------------------------------------
// Artifacts
// ---------------------------------------------------------------------------

export async function getAllArtifacts(): Promise<ArtifactsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM artifacts ORDER BY name` as Promise<ArtifactsRecord[]>
}

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------

export async function getAllLocations(): Promise<LocationsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM locations ORDER BY name` as Promise<LocationsRecord[]>
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUserByExternalId(externalId: string): Promise<UsersRecord | null> {
  const sql = getSql()
  const rows = await sql`
    SELECT * FROM users WHERE external_id = ${externalId} LIMIT 1
  ` as UsersRecord[]
  return rows[0] ?? null
}

// ---------------------------------------------------------------------------
// Generic read by id (replaces xata.db[table].read(id))
// ---------------------------------------------------------------------------

export async function readById(table: string, id: string): Promise<Record<string, unknown> | null> {
  const sql = getSql()
  const pgTable = resolveTable(table)
  // NB: table name is our own resolved string, not user input
  const rows = await sql`SELECT * FROM ${sql(pgTable)} WHERE id = ${id} LIMIT 1`
  return (rows[0] as Record<string, unknown>) ?? null
}

// ---------------------------------------------------------------------------
// Junction tables
// ---------------------------------------------------------------------------

export async function getAllEventSMEs(): Promise<EventSubjectMatterExpertsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM event_subject_matter_experts` as Promise<EventSubjectMatterExpertsRecord[]>
}

export async function getAllTopicSMEs(): Promise<TopicSubjectMatterExpertsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM topic_subject_matter_experts` as Promise<TopicSubjectMatterExpertsRecord[]>
}

export async function getAllOrganizationMembers(): Promise<OrganizationMembersRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM organization_members` as Promise<OrganizationMembersRecord[]>
}

export async function getAllTopicsTestimonies(): Promise<TopicsTestimoniesRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM topics_testimonies` as Promise<TopicsTestimoniesRecord[]>
}

export async function getAllEventTopicSMEs(): Promise<EventTopicSubjectMatterExpertsRecord[]> {
  const sql = getSql()
  return sql`SELECT * FROM event_topic_subject_matter_experts` as Promise<EventTopicSubjectMatterExpertsRecord[]>
}

export async function getAllJoinTables() {
  const [eventSMEs, topicSMEs, orgMembers, topicsTestimonies, eventTopicSMEs] =
    await Promise.all([
      getAllEventSMEs(),
      getAllTopicSMEs(),
      getAllOrganizationMembers(),
      getAllTopicsTestimonies(),
      getAllEventTopicSMEs(),
    ])
  return { eventSMEs, topicSMEs, orgMembers, topicsTestimonies, eventTopicSMEs }
}

// ---------------------------------------------------------------------------
// Graph node / edge types for the NetworkGraphPayload shape
// ---------------------------------------------------------------------------

export interface GraphNode {
  id: string
  label: string
  data: {
    name: string
    label: string
    type: string
    [key: string]: unknown
  }
}

export interface GraphEdge {
  id: string
  source: string
  target: string
}

export type ConnectionResults<T> = {
  records: T[]
  pagination: { hasNextPage: boolean; total?: number }
}

export interface NetworkGraphPayload {
  records: {
    topics: TopicsRecord[]
    events: EventsRecord[]
    personnel: PersonnelRecord[]
    testimonies: TestimoniesRecord[]
    organizations: OrganizationsRecord[]
    documents: DocumentsRecord[]
    artifacts: ArtifactsRecord[]
  }
  connections: {
    topicsExpertsConnections: ConnectionResults<TopicSubjectMatterExpertsRecord>
    eventsExpertsConnections: ConnectionResults<EventSubjectMatterExpertsRecord>
    eventsTopicsExpertsConnections: ConnectionResults<EventTopicSubjectMatterExpertsRecord>
    topicsTestimoniesConnections: ConnectionResults<TopicsTestimoniesRecord>
    organizationsPersonnelConnections: ConnectionResults<OrganizationMembersRecord>
  }
  graphData: {
    nodes: GraphNode[]
    links: GraphEdge[]
  }
}

// ---------------------------------------------------------------------------
// Internal helper: format a DB record as a GraphNode
// ---------------------------------------------------------------------------

function toGraphNode(record: Record<string, unknown> & { id: string }, type: string): GraphNode {
  const name = record.name as string | null | undefined
  const title = record.title as string | null | undefined
  const label = name ?? title ?? record.id
  return {
    id: record.id,
    label,
    data: { ...record, name: label, label, type },
  }
}

// ---------------------------------------------------------------------------
// Full entity graph load (replaces get-entity-network-graph-data pattern)
// ---------------------------------------------------------------------------

/**
 * Bounded initial graph load.
 *
 * Caps each entity type at `maxPerType` rows (default 50) so first-paint
 * never full-scans 230k+ records. Join/connection tables are capped at
 * `maxJoinRows` (default 2000 — they are small but still bounded).
 *
 * Edge resolution uses Map<id, GraphNode> — O(1) per lookup instead of
 * O(n) Array.find() for each of m edges.
 *
 * Returns the full NetworkGraphPayload shape expected by StateOfDisclosureProvider
 * and all downstream consumers.
 */
export async function loadEntityGraph(
  maxPerType = 50,
  maxJoinRows = 2000,
): Promise<NetworkGraphPayload> {
  const sql = getSql()

  // Fetch bounded entity rows in parallel with per-type LIMIT.
  // Join tables use the existing helper functions (already in baseline typecheck)
  // and are sliced to maxJoinRows after fetching.
  const [
    topics,
    personnel,
    events,
    testimonies,
    organizations,
    documents,
    artifacts,
    joinData,
  ] = await Promise.all([
    sql`SELECT * FROM topics LIMIT ${maxPerType}` as Promise<TopicsRecord[]>,
    sql`SELECT * FROM key_figures LIMIT ${maxPerType}` as Promise<PersonnelRecord[]>,
    sql`SELECT * FROM events ORDER BY date DESC NULLS LAST LIMIT ${maxPerType}` as Promise<EventsRecord[]>,
    sql`SELECT * FROM testimonies LIMIT ${maxPerType}` as Promise<TestimoniesRecord[]>,
    sql`SELECT * FROM organizations LIMIT ${maxPerType}` as Promise<OrganizationsRecord[]>,
    sql`SELECT * FROM documents LIMIT ${maxPerType}` as Promise<DocumentsRecord[]>,
    sql`SELECT * FROM artifacts LIMIT ${maxPerType}` as Promise<ArtifactsRecord[]>,
    getAllJoinTables(),
  ])

  // Slice join rows to maxJoinRows so they are also bounded
  const topicSMERows = joinData.topicSMEs.slice(0, maxJoinRows)
  const eventSMERows = joinData.eventSMEs.slice(0, maxJoinRows)
  const eventTopicSMERows = joinData.eventTopicSMEs.slice(0, maxJoinRows)
  const topicsTestimoniesRows = joinData.topicsTestimonies.slice(0, maxJoinRows)
  const orgMemberRows = joinData.orgMembers.slice(0, maxJoinRows)

  const records = { topics, events, personnel, testimonies, organizations, documents, artifacts }

  // Cast helper: TypeScript interfaces don't implicitly satisfy index signatures,
  // so we widen through unknown to satisfy toGraphNode's parameter contract.
  type LooseRecord = Record<string, unknown> & { id: string }
  const asLoose = (r: { id: string }) => r as unknown as LooseRecord

  // Build all graph nodes
  const nodes: GraphNode[] = [
    ...topics.map(r => toGraphNode(asLoose(r), 'topics')),
    ...events.map(r => toGraphNode(asLoose(r), 'events')),
    ...personnel.map(r => toGraphNode(asLoose(r), 'personnel')),
    ...testimonies.map(r => toGraphNode(asLoose(r), 'testimonies')),
    ...organizations.map(r => toGraphNode(asLoose(r), 'organizations')),
    ...documents.map(r => toGraphNode(asLoose(r), 'documents')),
    ...artifacts.map(r => toGraphNode(asLoose(r), 'artifacts')),
  ]

  // O(1) lookup map: id → GraphNode (built once, used for all edge checks)
  const nodeById = new Map<string, GraphNode>(nodes.map(n => [n.id, n]))

  // Helper: build a GraphEdge only when both endpoints exist in the loaded set
  function makeEdge(id: string, sourceId: string | null | undefined, targetId: string | null | undefined): GraphEdge | null {
    if (!sourceId || !targetId) return null
    if (!nodeById.has(sourceId) || !nodeById.has(targetId)) return null
    return { id, source: sourceId, target: targetId }
  }

  // Resolve edges from each join table using O(1) Map lookups
  const links: GraphEdge[] = []

  for (const r of eventSMERows) {
    const e = makeEdge(`esme-${r.id}`, r.event, r.subject_matter_expert)
    if (e) links.push(e)
  }
  for (const r of topicSMERows) {
    const e = makeEdge(`tsme-${r.id}`, r.topic, r.subject_matter_expert)
    if (e) links.push(e)
  }
  for (const r of eventTopicSMERows) {
    // Three-way join: emit event→topic and event→expert edges
    const e1 = makeEdge(`etsme-et-${r.id}`, r.event, r.topic)
    const e2 = makeEdge(`etsme-ee-${r.id}`, r.event, r.subject_matter_expert)
    if (e1) links.push(e1)
    if (e2) links.push(e2)
  }
  for (const r of topicsTestimoniesRows) {
    const e = makeEdge(`tt-${r.id}`, r.topic, r.testimony)
    if (e) links.push(e)
  }
  for (const r of orgMemberRows) {
    const e = makeEdge(`om-${r.id}`, r.organization, r.member)
    if (e) links.push(e)
  }

  const connections = {
    topicsExpertsConnections: { records: topicSMERows, pagination: { hasNextPage: topicSMERows.length >= maxJoinRows } },
    eventsExpertsConnections: { records: eventSMERows, pagination: { hasNextPage: eventSMERows.length >= maxJoinRows } },
    eventsTopicsExpertsConnections: { records: eventTopicSMERows, pagination: { hasNextPage: eventTopicSMERows.length >= maxJoinRows } },
    topicsTestimoniesConnections: { records: topicsTestimoniesRows, pagination: { hasNextPage: topicsTestimoniesRows.length >= maxJoinRows } },
    organizationsPersonnelConnections: { records: orgMemberRows, pagination: { hasNextPage: orgMemberRows.length >= maxJoinRows } },
  }

  return { records, connections, graphData: { nodes, links } }
}

// ---------------------------------------------------------------------------
// Paginated fetch (replaces fetchNextMindmapRecords pattern)
// ---------------------------------------------------------------------------

export async function getPaginatedRecords(
  table: string,
  size = 50,
  offset = 0,
): Promise<{ records: Record<string, unknown>[]; hasMore: boolean }> {
  const sql = getSql()
  const pgTable = resolveTable(table)
  const rows = await sql`SELECT * FROM ${sql(pgTable)} LIMIT ${size + 1} OFFSET ${offset}`
  const records = rows as Record<string, unknown>[]
  return { records: records.slice(0, size), hasMore: records.length > size }
}
