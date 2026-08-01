import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import type {EpistemicStatus, SpacetimeEvent, TimePrecision} from '../types/spacetime'

const CONFIDENCE_TO_SCORE: Record<ValidatedUAPSighting['confidence'], number> = {
  high: 0.85,
  medium: 0.55,
  low: 0.3,
}

const CONFIDENCE_TO_STATUS: Record<ValidatedUAPSighting['confidence'], EpistemicStatus> = {
  high: 'documented',
  medium: 'inferred',
  low: 'disputed',
}

function inferPrecision(timestamp: Date): TimePrecision {
  // Sightings records are typically day-level; keep honest until finer fields exist.
  if (Number.isNaN(timestamp.getTime())) return 'year'
  const hasTime =
    timestamp.getUTCHours() !== 0 ||
    timestamp.getUTCMinutes() !== 0 ||
    timestamp.getUTCSeconds() !== 0
  return hasTime ? 'hour' : 'day'
}

function locationDescription(sighting: ValidatedUAPSighting): string | undefined {
  const parts = [sighting.location.city, sighting.location.state].filter(Boolean)
  return parts.length ? parts.join(', ') : undefined
}

/**
 * Normalize a ValidatedUAPSighting into the shared SpacetimeEvent shape.
 * Precision is explicit — do not invent second-level certainty.
 */
export function sightingToSpacetimeEvent(sighting: ValidatedUAPSighting): SpacetimeEvent {
  const timestamp =
    sighting.timestamp instanceof Date
      ? sighting.timestamp
      : new Date(sighting.timestamp as unknown as string)

  const coords = sighting.location.coordinates

  return {
    id: `sighting:${sighting.id}`,
    type: 'sighting',
    title: sighting.title || sighting.content.slice(0, 80) || 'UAP Sighting',
    timestamp: timestamp.toISOString(),
    timePrecision: inferPrecision(timestamp),
    coordinates: coords
      ? {
          latitude: coords.lat,
          longitude: coords.lng,
        }
      : undefined,
    locationDescription: locationDescription(sighting),
    credibilityScore: CONFIDENCE_TO_SCORE[sighting.confidence],
    epistemicStatus: CONFIDENCE_TO_STATUS[sighting.confidence],
    sourceIds: sighting.sourceUrl ? [sighting.sourceUrl] : undefined,
    summary: sighting.content?.slice(0, 280),
    sourceRecordId: sighting.id,
    sourceTable: 'sightings',
  }
}

export function sightingsToSpacetimeEvents(
  sightings: ValidatedUAPSighting[],
): SpacetimeEvent[] {
  return sightings.map(sightingToSpacetimeEvent)
}
