import { RESEARCH_DESK_TOKENS } from './research-desk'

export type EntityCategory =
  | 'documents'
  | 'people'
  | 'events'
  | 'sightings'
  | 'locations'
  | 'artifacts'
  | 'hypotheses'
  | 'organizations'

export const ENTITY_CATEGORY_COLORS: Record<EntityCategory, string> = {
  documents: RESEARCH_DESK_TOKENS.amber,
  people: 'oklch(0.72 0.12 35)',
  events: RESEARCH_DESK_TOKENS.amber,
  sightings: RESEARCH_DESK_TOKENS.teal,
  locations: RESEARCH_DESK_TOKENS.teal,
  artifacts: 'oklch(0.7 0.1 50)',
  hypotheses: RESEARCH_DESK_TOKENS.purple,
  organizations: 'oklch(0.7 0.08 250)',
}

export const ENTITY_CATEGORY_LABELS: Record<EntityCategory, string> = {
  documents: 'Documents',
  people: 'People',
  events: 'Events',
  sightings: 'Sightings',
  locations: 'Locations',
  artifacts: 'Artifacts',
  hypotheses: 'Hypotheses',
  organizations: 'Organizations',
}
