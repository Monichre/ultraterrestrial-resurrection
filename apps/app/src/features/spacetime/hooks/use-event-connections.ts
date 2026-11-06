'use client'

import {useEffect, useState} from 'react'
import {loadEventConnections, type EventConnection} from '../actions/load-event-connections'
import type {SpacetimeEvent} from '../types/spacetime'

/** Per-record cache so the globe and the inspector share one request. */
const cache = new Map<string, Promise<EventConnection[]>>()

function fetchConnections(recordId: string): Promise<EventConnection[]> {
  let pending = cache.get(recordId)
  if (!pending) {
    pending = loadEventConnections(recordId)
    cache.set(recordId, pending)
  }
  return pending
}

/**
 * Documented connections for the selected curated event, or `[]`.
 * Only `events`-table records carry expert links; anything else returns empty.
 */
export function useEventConnections(event: SpacetimeEvent | null | undefined): EventConnection[] {
  const recordId =
    event?.sourceTable === 'events' && event.sourceRecordId ? event.sourceRecordId : null
  const [state, setState] = useState<{recordId: string | null; connections: EventConnection[]}>({
    recordId: null,
    connections: [],
  })

  useEffect(() => {
    if (!recordId) return
    let cancelled = false
    fetchConnections(recordId).then((connections) => {
      if (!cancelled) setState({recordId, connections})
    })
    return () => {
      cancelled = true
    }
  }, [recordId])

  return recordId && state.recordId === recordId ? state.connections : []
}
