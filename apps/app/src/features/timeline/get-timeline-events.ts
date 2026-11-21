'use server'

import { getAllEvents, getHistoricEvents } from '@db/postgres'
import type { EventsRecord } from '@db/postgres'
import type { UFOSighting } from '@/features/mindmap/research-canvas/data/ufo-sightings'

/**
 * Adapt an EventsRecord from the Postgres DB to the UFOSighting shape
 * used by the NetworkTimelineExplorer canvas.
 */
/** Clean a possibly-malformed event name (DB rows sometimes carry serialized
 * fragments like `dateText:"July 2`). Strip field-label/quote artifacts and
 * fall back to title/location when the result is unusable. */
function cleanName(raw: string | null | undefined, event: EventsRecord): string {
  let n = (raw ?? '').trim()
  // Drop leading `someText:"` style field-label artifacts and stray quotes.
  n = n.replace(/^[a-zA-Z]+\s*:\s*"?/, '').replace(/^["']+|["']+$/g, '').trim()
  if (n.length < 3) {
    return (event.title ?? event.location ?? 'Unknown Event').trim() || 'Unknown Event'
  }
  return n
}

/** Strip markdown bold markers and bracketed citation markers (`[4, 7]`) so
 * the detail panel renders clean prose. */
function cleanDescription(raw: string | null | undefined): string {
  return (raw ?? '')
    .replace(/\*\*/g, '')
    .replace(/\s*\[[\d,\s]+\]/g, '')
    .trim()
}

function adaptEventToSighting(event: EventsRecord): UFOSighting {
  const categories: string[] = event.category ?? []

  // Derive a rough classification from categories
  const classificationMap: Record<string, UFOSighting['classification']> = {
    military: 'Military',
    radar: 'Radar',
    mass: 'Mass',
    ce1: 'CE1',
    ce2: 'CE2',
    ce3: 'CE3',
    ce4: 'CE4',
    abduction: 'CE4',
    'close encounter': 'CE3',
  }

  let classification: string = 'CE1'
  for (const cat of categories) {
    const lower = cat.toLowerCase()
    for (const [key, val] of Object.entries(classificationMap)) {
      if (lower.includes(key)) {
        classification = val
        break
      }
    }
  }

  return {
    id: event.id,
    name: cleanName(event.name ?? event.title, event),
    date: event.date ?? new Date().toISOString(),
    location: event.location ?? 'Unknown Location',
    description: cleanDescription(event.description ?? event.summary),
    classification,
    credibility: 'High',
    witnesses: 0,
    image: (event.photos && event.photos[0]) ?? '/placeholder.svg',
    tags: categories,
    sources: [],
    relatedIncidents: [],
    coordinates: {
      lat: event.latitude ?? 0,
      lng: event.longitude ?? 0,
    },
  }
}

/**
 * Server action: fetch historic events from Postgres and adapt them to
 * the UFOSighting shape used by the NetworkTimelineExplorer.
 * Returns an empty array on error so the component falls back to static data.
 */
export async function getTimelineEvents(limit = 100): Promise<UFOSighting[]> {
  try {
    const events = await getHistoricEvents(limit)
    if (events.length === 0) {
      // Fallback: try getAllEvents with a small cap
      const all = await getAllEvents()
      return all.slice(0, limit).map(adaptEventToSighting)
    }
    return events.map(adaptEventToSighting)
  } catch (err) {
    console.error('[getTimelineEvents] failed, falling back to static data:', err)
    return []
  }
}
