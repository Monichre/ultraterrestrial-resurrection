import type {EventsRecord} from '@db/postgres'
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

// ---------------------------------------------------------------------------
// events table — the curated historical record the canvas renders
// ---------------------------------------------------------------------------

/**
 * `events.name` is stored with hard line breaks from the original scrape
 * ("Ships in the\nsky", "Air ship of\nClonmacnoise"). Collapse to a single
 * line so titles render as titles rather than as three-line paragraphs.
 */
function cleanName(name: string | null): string {
  return (name ?? '').replace(/\s+/g, ' ').trim()
}

/**
 * Many `events.date` values carry a `05:50:36+00` time — a local-mean-time
 * conversion artifact from ingestion, not an observed time of day. Treating it
 * as an hour-level observation would manufacture precision the record does not
 * have, so this never returns 'hour': a January 1st date is a year-only record,
 * anything else is day-level at best.
 */
function inferEventPrecision(timestamp: Date): TimePrecision {
  if (Number.isNaN(timestamp.getTime())) return 'year'
  const isJanFirst = timestamp.getUTCMonth() === 0 && timestamp.getUTCDate() === 1
  return isJanFirst ? 'year' : 'day'
}

/**
 * Normalize an `events` row into the shared SpacetimeEvent shape.
 *
 * `credibilityScore` is deliberately omitted. The table carries no
 * corroboration, provenance, or source-tier column — `category` is the literal
 * string "famous" on all 142 rows — so any number here would be invented.
 * The sightings path derives its score from comment length, which is exactly
 * the fabrication this path declines to repeat. Until Lane A's provenance
 * backfill (H4) lands there is nothing real to score, and an absent score is
 * honest where a manufactured one is not.
 *
 * `epistemicStatus` uses the one genuine signal present: whether the row has a
 * substantive description. 140 of 142 do.
 */
export function eventRecordToSpacetimeEvent(record: EventsRecord): SpacetimeEvent {
  const timestamp = new Date(record.date ?? '')
  const description = record.description?.trim() || record.summary?.trim() || ''
  const location = record.location?.trim()
  const hasCoords = record.latitude != null && record.longitude != null

  return {
    id: `event:${record.id}`,
    type: 'historical_event',
    title: cleanName(record.name) || cleanName(record.title) || 'Historical event',
    timestamp: timestamp.toISOString(),
    timePrecision: inferEventPrecision(timestamp),
    coordinates: hasCoords
      ? {latitude: record.latitude as number, longitude: record.longitude as number}
      : undefined,
    // "Unknown" is a placeholder the source data uses for missing locations;
    // surfacing it as a place name would read as a claim.
    locationDescription:
      location && location.toLowerCase() !== 'unknown' ? location : undefined,
    epistemicStatus: description ? 'documented' : 'inferred',
    summary: description ? truncateAtWordBoundary(description, 280) : undefined,
    sourceRecordId: record.id,
    sourceTable: 'events',
  }
}

export function eventRecordsToSpacetimeEvents(
  records: EventsRecord[],
): SpacetimeEvent[] {
  return records
    .filter((record) => record.date && !Number.isNaN(new Date(record.date).getTime()))
    .map(eventRecordToSpacetimeEvent)
}
