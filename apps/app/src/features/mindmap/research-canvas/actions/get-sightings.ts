'use server'

import { getAllSightings } from '@db/postgres'
import type { SightingsRecord } from '@db/postgres'
import {
  UFO_SIGHTINGS,
  type UFOSighting,
} from '@/features/mindmap/research-canvas/data/ufo-sightings'

/**
 * Map a Postgres SightingsRecord to the UFOSighting interface consumed by the UI.
 * Fields with no DB equivalent receive sensible defaults.
 */
function mapRecordToSighting(record: SightingsRecord): UFOSighting {
  const locationParts = [record.city, record.state, record.country].filter(Boolean)
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location'

  const dateStr = record.occurred_at
    ? new Date(record.occurred_at).toISOString().split('T')[0]
    : ''

  const nameLabel = record.city ?? record.state ?? 'Unknown'
  const yearLabel = dateStr ? ` (${dateStr.slice(0, 4)})` : ''
  const name = `${nameLabel} Sighting${yearLabel}`

  const tags: string[] = []
  if (record.shape) tags.push(record.shape.toLowerCase())
  if (record.duration_hours_min) tags.push(`duration:${record.duration_hours_min}`)
  if (record.country && record.country !== 'US') tags.push(record.country.toLowerCase())

  return {
    id: record.id,
    name,
    date: dateStr,
    location,
    description: record.comments ?? '',
    classification: record.shape ?? 'Unknown',
    credibility: 'Medium',
    witnesses: 1,
    image: '',
    tags,
    sources: [],
    relatedIncidents: [],
    coordinates: {
      lat: record.latitude ?? 0,
      lng: record.longitude ?? 0,
    },
  }
}

/**
 * Fetch a paginated set of sightings from Postgres.
 * Falls back to the hardcoded UFO_SIGHTINGS array on error.
 */
export async function getSightings(
  opts?: { limit?: number; offset?: number },
): Promise<UFOSighting[]> {
  const limit = opts?.limit ?? 50
  const offset = opts?.offset ?? 0

  try {
    const { records } = await getAllSightings(limit, offset)
    return records.map(mapRecordToSighting)
  } catch (error) {
    console.error('[getSightings] Postgres query failed, using fallback data:', error)
    return UFO_SIGHTINGS
  }
}
