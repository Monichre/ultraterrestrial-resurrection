'use client'

import {useEffect, useMemo, useRef, useState, useTransition} from 'react'
import {
  loadSpacetimeEvents,
  type LoadSpacetimeEventsResult,
} from '../actions/load-spacetime-events'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {useSpacetimeStore} from '../state/spacetime-store'
import {EventInspector} from './event-inspector'
import {EvidenceLayersPanel} from './evidence-layers-panel'
import {EvidenceLegend} from './evidence-legend'
import {MapControls} from './map-controls'
import {SpacetimeCanvasShell} from './spacetime-canvas-shell'
import {SpacetimeGlobe} from './spacetime-globe'
import {SpacetimeRail} from './spacetime-rail'
import {SpacetimeTopbar} from './spacetime-topbar'
import {TemporalDial} from './temporal-dial'
import {ViewportReadout} from './viewport-readout'
import {WaypointNarrative} from './waypoint-narrative'

function metaFromResult(result: LoadSpacetimeEventsResult) {
  return {
    geolocatedCount: result.geolocatedCount,
    total: result.events.length,
    range: `${result.timeRange.startYear}–${result.timeRange.endYear}`,
  }
}

/**
 * Spacetime Canvas — the Temporal Observatory surface.
 *
 * Layout is the docked observatory from spec §9 and all four storyboards:
 * header · rail · interactive map foreground · adaptive temporal instrument.
 * Chrome docks *into* the map region, so the globe stays the object being
 * operated rather than a backdrop behind a scroll layer.
 *
 * Prefer `initialData` from the server page so first paint isn't empty; falls
 * back to a bounded client fetch if omitted.
 */
export function SpacetimeCanvas({
  initialData,
}: {
  initialData?: LoadSpacetimeEventsResult
}) {
  const setEvents = useSpacetimeStore((s) => s.setEvents)
  const setStations = useSpacetimeStore((s) => s.setStations)
  const events = useSpacetimeStore((s) => s.events)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)

  const [meta, setMeta] = useState(initialData ? metaFromResult(initialData) : null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const hydratedRef = useRef(false)

  /**
   * Hydrate the client store from the server payload.
   *
   * This was previously a bare `useSpacetimeStore.setState()` in the render
   * body — a side effect during render, which React may run twice, discard, or
   * interleave. `useState` with a lazy initializer runs exactly once per mount
   * and is the sanctioned way to seed before first paint, so the narrative and
   * globe still have data on the very first frame without the render-phase
   * write. The effect below stays for Strict Mode remounts and client-side
   * navigations back onto this route.
   */
  useState(() => {
    if (initialData?.events?.length) {
      useSpacetimeStore.setState({
        events: initialData.events,
        stations: initialData.stations,
      })
      hydratedRef.current = true
    }
    return null
  })

  useEffect(() => {
    if (initialData?.events?.length) {
      setEvents(initialData.events)
      setStations(initialData.stations)
      setMeta(metaFromResult(initialData))
      setError(null)
      return
    }
    if (hydratedRef.current) return

    startTransition(async () => {
      try {
        const result = await loadSpacetimeEvents({limit: 400})
        setEvents(result.events)
        setStations(result.stations)
        setMeta(metaFromResult(result))
        setError(null)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Failed to load spacetime events')
      }
    })
  }, [initialData, setEvents, setStations])

  const visibleCount = useMemo(
    () => filterSpacetimeEvents(events, layers, filters).length,
    [events, layers, filters],
  )

  return (
    <SpacetimeCanvasShell
      topbar={<SpacetimeTopbar meta={meta} visibleCount={visibleCount} />}
      rail={<SpacetimeRail />}
      dial={<TemporalDial />}
      map={
        <>
          <SpacetimeGlobe />
          <WaypointNarrative />
          <EvidenceLayersPanel />
          <EvidenceLegend />
          <MapControls />
          <EventInspector />
          <ViewportReadout />

          {pending && !meta ? (
            <div className='pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center'>
              <span className='rounded-full border border-[rgba(125,190,210,0.24)] bg-[rgba(8,13,17,0.9)] px-3 py-1 font-mono text-[9px] tracking-[0.24em] text-[#a8b8be] uppercase backdrop-blur-md'>
                Loading bounded corpus…
              </span>
            </div>
          ) : null}

          {error ? (
            <div className='pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center'>
              <span className='rounded-full border border-[rgba(232,116,140,0.4)] bg-[rgba(48,12,20,0.9)] px-3 py-1 text-[11px] text-[#f4c3cc] backdrop-blur-md'>
                {error}
              </span>
            </div>
          ) : null}
        </>
      }
    />
  )
}
