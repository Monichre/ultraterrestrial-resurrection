'use server'

/**
 * Guided-tour waypoint resolution — turns each tour stop's search query into
 * a real record from Neon at tour start, so tours are always anchored to
 * live data rather than hardcoded ids.
 */
import { readById, searchTable } from '@db/postgres'
import type {
  GuidedTourWaypoint,
  GuidedTourWaypointDef,
} from '../tours/guided-tour-store'
import { resolveAnchor } from '@/features/guided-tours/shared/graph/resolve-anchor'
import type {
  ResolvedAnchor,
  TourDefinition,
  WaypointId,
} from '@/features/guided-tours/shared/types/tour-definition'

/**
 * Evidence-graph anchor resolution (T-050 subtask 4). Runs every waypoint's
 * `corpusAnchor` against live Neon and reports which of the three outcomes
 * happened — resolved / unresolved / narrative-only — via the pure
 * `resolveAnchor` rule so the distinction cannot drift between engines.
 */
export async function resolveEvidenceAnchors(
  definition: TourDefinition,
): Promise<Partial<Record<WaypointId, ResolvedAnchor>>> {
  const entries = await Promise.all(
    definition.waypoints.map(async (waypoint): Promise<[WaypointId, ResolvedAnchor]> => {
      const anchor = waypoint.corpusAnchor
      if (anchor.kind === 'none') return [waypoint.id, resolveAnchor(anchor, null)]
      try {
        const record =
          anchor.kind === 'record'
            ? await readById(anchor.table, anchor.recordId)
            : ((await searchTable(anchor.table, anchor.searchQuery, 1))[0] as
                | Record<string, unknown>
                | undefined) ?? null
        return [waypoint.id, resolveAnchor(anchor, record)]
      } catch {
        return [waypoint.id, resolveAnchor(anchor, null)]
      }
    }),
  )
  return Object.fromEntries(entries)
}

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
