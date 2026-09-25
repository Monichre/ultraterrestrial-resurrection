/**
 * TypeScript types for the rebuilt Postgres schema.
 * Mirrors 0001_init.sql. Named to preserve backward compat with Xata consumers:
 *   - PersonnelRecord → key_figures table (renamed in rebuild)
 *   - EventsRecord → events
 *   - TopicsRecord → topics
 *   etc.
 */

export interface TopicsRecord {
  id: string
  name: string | null
  summary: string | null
  photo: string | null
  photos: string[] | null
  title: string | null
  description: string | null
  xata_createdat?: string
  xata_updatedat?: string
}

/** key_figures table — was "personnel" in Xata. */
export interface PersonnelRecord {
  id: string
  name: string | null
  bio: string | null
  role: string | null
  photo: string[] | null
  rank: number | null
  credibility: number | null
  popularity: number | null
  authority: number | null
  xata_createdat?: string
  xata_updatedat?: string
}

/** Alias for new naming */
export type KeyFiguresRecord = PersonnelRecord

export interface EventsRecord {
  id: string
  name: string | null
  title: string | null
  description: string | null
  summary: string | null
  location: string | null
  latitude: number | null
  longitude: number | null
  date: string | null
  photos: string[] | null
  metadata: Record<string, unknown> | null
  category: string[] | null
  xata_createdat?: string
  xata_updatedat?: string
}

export interface OrganizationsRecord {
  id: string
  name: string | null
  title: string | null
  specialization: string | null
  description: string | null
  photo: string | null
  image: string | null
  xata_createdat?: string
  xata_updatedat?: string
}

export interface SightingsRecord {
  id: string
  occurred_at: string | null
  city: string | null
  state: string | null
  country: string | null
  shape: string | null
  duration_seconds: number | null
  duration_hours_min: string | null
  comments: string | null
  date_posted: string | null
  latitude: number | null
  longitude: number | null
  xata_createdat?: string
  xata_updatedat?: string
}

export interface TestimoniesRecord {
  id: string
  title: string | null
  description: string | null
  date: string | null
  summary: string | null
  event: string | null     // FK → events.id
  witness: string | null   // FK → key_figures.id
  organization: string | null // FK → organizations.id
  xata_createdat?: string
  xata_updatedat?: string
}

export interface DocumentsRecord {
  id: string
  title: string | null
  summary: string | null
  url: string | null
  date: string | null
  author: string | null        // FK → key_figures.id
  organization: string | null  // FK → organizations.id
  source_type: string | null
  source_tier: string | null
  metadata: Record<string, unknown> | null
  xata_createdat?: string
  xata_updatedat?: string
}

export interface ArtifactsRecord {
  id: string
  name: string | null
  description: string | null
  origin: string | null
  date: string | null  // freeform text
  images: string[] | null
  metadata: Record<string, unknown> | null
  xata_createdat?: string
  xata_updatedat?: string
}

export interface LocationsRecord {
  id: string
  name: string | null
  city: string | null
  state: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  coordinates: string | null
  google_maps_location_id: string | null
}

export interface UsersRecord {
  id: string
  external_id: string | null
  email: string | null
  name: string | null
  xata_createdat?: string
  xata_updatedat?: string
}

// Junction tables
export interface EventSubjectMatterExpertsRecord {
  id: string
  event: string | null
  subject_matter_expert: string | null
}

export interface TopicSubjectMatterExpertsRecord {
  id: string
  topic: string | null
  subject_matter_expert: string | null
}

export interface OrganizationMembersRecord {
  id: string
  organization: string | null
  member: string | null
}

export interface TopicsTestimoniesRecord {
  id: string
  topic: string | null
  testimony: string | null
}

export interface EventTopicSubjectMatterExpertsRecord {
  id: string
  event: string | null
  topic: string | null
  subject_matter_expert: string | null
}

/** Search result with relevance metadata */
export interface SearchResult<T = Record<string, unknown>> {
  record: T
  table: string
  score: number
  highlights: Partial<Record<keyof T, string>>
}

/** Shape returned by searchDatabase / searchXata replacements */
export interface SearchResponse<T = Record<string, unknown>> {
  success: boolean
  searchResults?: T[]
  error?: string
}

/** Minimal DatabaseSchema compat for mindmap-context.tsx */
export interface DatabaseSchema {
  topics: TopicsRecord
  personnel: PersonnelRecord   // key_figures aliased back to personnel for compat
  'key-figures': PersonnelRecord
  events: EventsRecord
  organizations: OrganizationsRecord
  sightings: SightingsRecord
  testimonies: TestimoniesRecord
  documents: DocumentsRecord
  artifacts: ArtifactsRecord
  locations: LocationsRecord
  users: UsersRecord
  'event-subject-matter-experts': EventSubjectMatterExpertsRecord
  'topic-subject-matter-experts': TopicSubjectMatterExpertsRecord
  'organization-members': OrganizationMembersRecord
  'topics-testimonies': TopicsTestimoniesRecord
  'event-topic-subject-matter-experts': EventTopicSubjectMatterExpertsRecord
}
