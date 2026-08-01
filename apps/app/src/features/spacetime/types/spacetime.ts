/**
 * Spacetime Canvas — core types
 *
 * Source of truth: docs/vision/TEMPORAL_OBSERVATORY.md §3.3–3.4
 * Build plan: docs/PLANS/2026-08-01-spacetime-canvas-implementation.md
 *
 * Naming: Research Canvas organizes ideas; Spacetime Canvas organizes
 * evidence across space + time. Same verb, orthogonal axis.
 */

export type TimePrecision = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'season'

/**
 * Single source of truth for "where we are in time."
 * Scroll (guided) and dial (free) are inputs to this cursor — never two cursors.
 */
export type TemporalCursor =
  | {mode: 'station'; stationId: string; timestamp: string}
  | {mode: 'exact'; timestamp: string; precision: TimePrecision}
  | {mode: 'range'; start: string; end: string}

export type SpacetimeInteractionMode = 'guided' | 'free'

export type SpacetimeEventType =
  | 'sighting'
  | 'historical_event'
  | 'nuclear'
  | 'military'
  | 'infrastructure'
  | 'testimony'
  | 'document'
  | 'astronomical'
  | 'environmental'
  | 'reconstruction'

export type EpistemicStatus = 'documented' | 'inferred' | 'disputed'

export interface SpacetimeCoordinates {
  latitude: number
  longitude: number
  altitudeMeters?: number
  uncertaintyRadiusKm?: number
}

/**
 * Normalized event across sightings + historical records.
 * Precision is explicit — rendering a medieval chronicle as a second-level
 * pin would be epistemically dishonest.
 */
export interface SpacetimeEvent {
  id: string
  type: SpacetimeEventType
  title: string
  timestamp: string
  timePrecision: TimePrecision
  coordinates?: SpacetimeCoordinates
  locationDescription?: string
  credibilityScore?: number
  epistemicStatus?: EpistemicStatus
  sourceIds?: string[]
  summary?: string
  /** Original record id in the source table (sightings / events / …) */
  sourceRecordId?: string
  sourceTable?: string
}

/**
 * Layer feature with temporal validity — a base must not appear before
 * it existed; a 1947 skyline must not use 2026 geometry.
 */
export interface TemporalLayerFeature {
  id: string
  layerId: string
  validFrom?: string
  validUntil?: string
  observedAt?: string
  publishedAt?: string
  geometry: GeoJSON.Geometry
  properties?: Record<string, unknown>
}

export type TemporalStationKind = 'historical' | 'event' | 'investigation'

export interface TemporalStation {
  id: string
  kind: TemporalStationKind
  label: string
  timestamp: string
  /** Relative event density for dial encoding (0–1) */
  density?: number
  eventIds?: string[]
  hasReconstruction?: boolean
}

export interface SpacetimeViewport {
  longitude: number
  latitude: number
  zoom: number
  bearing?: number
  pitch?: number
}

export interface SpacetimeLayerVisibility {
  sightings: boolean
  historicalEvents: boolean
  nuclear: boolean
  military: boolean
  infrastructure: boolean
  testimony: boolean
  documents: boolean
  reconstructions: boolean
}
