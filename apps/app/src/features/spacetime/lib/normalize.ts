import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {truncateAtWordBoundary} from '@/lib/utils'
import type {EpistemicStatus, SpacetimeEvent, TimePrecision} from '../types/spacetime'

/**
 * `sightings` rows carry no verification/corroboration signal — every
 * record here is a single, uncorroborated report by construction. These
 * scores stay deliberately low and narrow-banded so the UI never implies
 * evidentiary weight the source data doesn't support. `high` is reserved
 * for a future ingestion path that actually carries corroboration signal
 * (independent witnesses, media, official record) — nothing here emits it.
 */
const CONFIDENCE_TO_SCORE: Record<ValidatedUAPSighting['confidence'], number> = {
  high: 0.7,
  medium: 0.4,
  low: 0.2,
}

/**
 * `medium` = the record captured a real, substantive witness account — a
 * documented report, in the sense the platform already uses ("documented
 * sightings", TEMPORAL_OBSERVATORY.md §1). `low` = the row is a thin or
 * placeholder record with no real narrative — closer to inferred-at-best
 * than to a genuine documented account. Never `disputed`: nothing in this
 * data path carries a contradiction signal, so we don't claim one.
 */
const CONFIDENCE_TO_STATUS: Record<ValidatedUAPSighting['confidence'], EpistemicStatus> = {
  high: 'documented',
  medium: 'documented',
  low: 'inferred',
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
    title:
      sighting.title || truncateAtWordBoundary(sighting.content, 70) || 'UAP Sighting',
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
