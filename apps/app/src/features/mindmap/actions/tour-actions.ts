'use server'

/**
 * Guided-tour waypoint resolution — turns each tour stop's search query into
 * a real record from Neon at tour start, so tours are always anchored to
 * live data rather than hardcoded ids.
 */
import { searchTable } from '@db/postgres'
import type {
  GuidedTourWaypoint,
  GuidedTourWaypointDef,
} from '../tours/guided-tour-store'

export async function resolveTourWaypoints(
  defs: GuidedTourWaypointDef[],
): Promise<GuidedTourWaypoint[]> {
  const resolved = await Promise.all(
    defs.map(async (def): Promise<GuidedTourWaypoint> => {
      try {
        const hits = await searchTable(def.table, def.searchQuery, 1)
        const record = (hits[0] as Record<string, unknown> | undefined) ?? null
        return {
          ...def,
          recordId: record?.id ? String(record.id) : null,
          record,
        }
      } catch {
        return { ...def, recordId: null, record: null }
      }
    }),
  )
  return resolved
}
