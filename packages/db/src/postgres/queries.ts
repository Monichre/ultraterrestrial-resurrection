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
// Full entity graph load (replaces get-entity-network-graph-data pattern)
// ---------------------------------------------------------------------------

export async function loadEntityGraph(maxPerType = 50) {
  const sql = getSql()
  const [topics, personnel, events, testimonies, organizations, documents, artifacts, joins] =
    await Promise.all([
      sql`SELECT * FROM topics LIMIT ${maxPerType}` as Promise<TopicsRecord[]>,
      sql`SELECT * FROM key_figures LIMIT ${maxPerType}` as Promise<PersonnelRecord[]>,
      sql`SELECT * FROM events ORDER BY date DESC NULLS LAST LIMIT ${maxPerType}` as Promise<EventsRecord[]>,
      sql`SELECT * FROM testimonies LIMIT ${maxPerType}` as Promise<TestimoniesRecord[]>,
      sql`SELECT * FROM organizations LIMIT ${maxPerType}` as Promise<OrganizationsRecord[]>,
      sql`SELECT * FROM documents LIMIT ${maxPerType}` as Promise<DocumentsRecord[]>,
      sql`SELECT * FROM artifacts LIMIT ${maxPerType}` as Promise<ArtifactsRecord[]>,
      getAllJoinTables(),
    ])
  return { topics, personnel, events, testimonies, organizations, documents, artifacts, ...joins }
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
