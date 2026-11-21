'use server'

import {getSql} from '@db/postgres'

/** One documented link from the selected event to another curated event. */
export interface EventConnection {
  /** Spacetime id of the connected event (`event:<record id>`). */
  eventId: string
  /** Names of the subject-matter experts both events list. */
  sharedExperts: string[]
}

/** Upper bound on drawn connections, so a hub expert cannot draw a hairball. */
const MAX_CONNECTIONS = 12

/**
 * Documented event→event links for one curated event.
 *
 * The only event-to-event relation the schema carries is indirect: two events
 * that list the same subject-matter expert in `event_subject_matter_experts`.
 * That is a documented association, not a similarity guess, so it is the only
 * thing drawn as a connection. Neighbours sharing more experts rank first.
 *
 * Takes the source record id (`events.id`), not the `event:`-prefixed
 * Spacetime id. Returns `[]` on any error — a missing arc must never break the
 * canvas.
 */
export async function loadEventConnections(recordId: string): Promise<EventConnection[]> {
  if (!recordId) return []
  try {
    const sql = getSql()
    const rows = (await sql.query(
      `SELECT b.event AS event_id,
              array_agg(DISTINCT coalesce(k.name, k.id) ORDER BY coalesce(k.name, k.id)) AS experts
         FROM event_subject_matter_experts a
         JOIN event_subject_matter_experts b
           ON b.subject_matter_expert = a.subject_matter_expert
          AND b.event <> a.event
         LEFT JOIN key_figures k ON k.id = a.subject_matter_expert
        WHERE a.event = $1
        GROUP BY b.event
        ORDER BY count(DISTINCT a.subject_matter_expert) DESC, b.event
        LIMIT $2`,
      [recordId, MAX_CONNECTIONS],
    )) as Array<{event_id: string; experts: string[] | null}>

    return rows.map((row) => ({
      eventId: `event:${row.event_id}`,
      sharedExperts: (row.experts ?? []).filter(Boolean),
    }))
  } catch (error) {
    console.error('[spacetime] loadEventConnections failed', error)
    return []
  }
}
