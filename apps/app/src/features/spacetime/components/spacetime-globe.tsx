'use client'

import {useEffect, useMemo, useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {registerSpacetimeMap} from '../lib/map-controller'
import {STC_EPISTEMIC_COLOR} from '../lib/spacetime-theme'
import {useSpacetimeStore} from '../state/spacetime-store'
import type {SpacetimeEvent, TemporalStation, TimePrecision} from '../types/spacetime'

const SOURCE_ID = 'spacetime-events'
const HALO_LAYER_ID = 'spacetime-events-halo'
const CORE_LAYER_ID = 'spacetime-events-core'

/**
 * How blurred a pin's halo is, by how precisely the record is dated.
 *
 * The boards draw every pin as a hard point inside a soft glow. That glow is
 * free real estate for the one uncertainty signal this corpus genuinely
 * carries: `timePrecision`. A record known only to the year renders as a
 * diffuse bloom; one known to the day renders tight. Review §9 item 5 flagged
 * this as "unblocked, value already computed" — it was, and nothing drew it.
 */
const PRECISION_BLUR: Record<TimePrecision, number> = {
  second: 0.35,
  minute: 0.4,
  hour: 0.5,
  day: 0.65,
  season: 0.9,
  month: 1,
  year: 1.4,
}

function eventsToGeoJSON(events: SpacetimeEvent[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: events
      .filter((e) => e.coordinates)
      .map((e) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [e.coordinates!.longitude, e.coordinates!.latitude],
        },
        properties: {
          id: e.id,
          title: e.title,
          timestamp: e.timestamp,
          epistemic: e.epistemicStatus ?? 'inferred',
          blur: PRECISION_BLUR[e.timePrecision] ?? 1,
        },
      })),
  }
}

/**
 * Live Mapbox globe — the *foreground* of the canvas.
 *
 * Data comes from the bounded server action over the curated `events` table.
 * Never static `sightings.geojson`, never the 43k raw `sightings` rows.
 */
export function SpacetimeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  /** False until the cursor changes from its mount-time default. */
  const cursorMovedRef = useRef(false)
  const events = useSpacetimeStore((s) => s.events)
  const stations = useSpacetimeStore((s) => s.stations)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)
  const selectedEventId = useSpacetimeStore((s) => s.selectedEventId)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)
  const setViewport = useSpacetimeStore((s) => s.setViewport)

  const visibleEvents = useMemo(
    () => filterSpacetimeEvents(events, layers, filters),
    [events, layers, filters],
  )
  const geojson = useMemo(() => eventsToGeoJSON(visibleEvents), [visibleEvents])
  const selectedEvent = useMemo(
    () => visibleEvents.find((e) => e.id === selectedEventId && e.coordinates) ?? null,
    [visibleEvents, selectedEventId],
  )

  // Boot map once
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN
    if (!token || !containerRef.current || mapRef.current) return

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      // Whole-earth opening view with atmosphere — the boards open on a lit
      // globe, not a pitched regional plate.
      projection: {name: 'globe'},
      center: [-30, 25],
      zoom: 1.7,
      attributionControl: false,
      pitch: 0,
    })

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(8,14,20)',
        'high-color': 'rgb(24,52,66)',
        'horizon-blend': 0.06,
        'space-color': 'rgb(3,5,8)',
        'star-intensity': 0.12,
      })
    })

    map.on('load', () => {
      // Real elevation data, not a pitched-but-flat illusion — so "descend
      // toward an event" actually shows terrain relief at the destination.
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
      map.setTerrain({source: 'mapbox-dem', exaggeration: 1.4})

      map.addSource(SOURCE_ID, {type: 'geojson', data: geojson})

      // Soft halo — carries the precision signal (see PRECISION_BLUR).
      map.addLayer({
        id: HALO_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 7, 6, 14, 12, 22],
          'circle-color': epistemicColorExpression(),
          'circle-blur': ['get', 'blur'],
          'circle-opacity': 0.4,
        },
      })

      // Crisp core.
      map.addLayer({
        id: CORE_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 2.6, 6, 4.5, 12, 6],
          'circle-color': epistemicColorExpression(),
          'circle-opacity': 0.95,
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(255,255,255,0.65)',
        },
      })
    })

    map.on('click', CORE_LAYER_ID, (e) => {
      const id = e.features?.[0]?.properties?.id
      if (typeof id === 'string') selectEvent(id)
    })
    // The halo is much larger than the core; making it clickable too is the
    // difference between "the pins are clickable" and "the pins are clickable
    // if you hit a 3px target on a globe".
    map.on('click', HALO_LAYER_ID, (e) => {
      const id = e.features?.[0]?.properties?.id
      if (typeof id === 'string') selectEvent(id)
    })
    for (const layerId of [CORE_LAYER_ID, HALO_LAYER_ID]) {
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = ''
      })
    }

    // `move`, not `moveend` — the footer readout prints live coordinates, and
    // one that only updates when the drag stops reads as broken.
    const syncViewport = () => {
      const c = map.getCenter()
      setViewport({
        longitude: c.lng,
        latitude: c.lat,
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
        altitudeMeters: map.getFreeCameraOptions().position?.toAltitude(),
      })
    }
    map.on('move', syncViewport)
    syncViewport()

    mapRef.current = map
    registerSpacetimeMap(map)
    return () => {
      registerSpacetimeMap(null)
      map.remove()
      mapRef.current = null
    }
    // geojson intentionally omitted — updated in the next effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectEvent, setViewport])

  // Sync event data into the source
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const apply = () => {
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
      source?.setData(geojson)
    }
    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [geojson])

  /**
   * Selecting an event commits the camera to a pitched, on-terrain view of
   * where it happened.
   *
   * Zoom is capped at 9.5, not the 13.5 this used to fly to. The curated
   * corpus geocodes to place level — "Roswell, New Mexico", "NA, United
   * States" — so a street-level descent renders road names under a pin whose
   * source data never located it to a street. The camera would be asserting a
   * precision the record does not have, which is the same failure the
   * inspector's absent-credibility cells exist to avoid. Terrain relief is
   * fully legible at this range.
   */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedEvent?.coordinates) return

    map.flyTo({
      center: [selectedEvent.coordinates.longitude, selectedEvent.coordinates.latitude],
      zoom: 9.5,
      pitch: 55,
      duration: 2400,
      essential: true,
    })
  }, [selectedEvent])

  // Absent a selection, the cursor (scroll/dial) drives a regional descent
  // toward the timestamp's nearby events — orbit-to-region, not ground level;
  // that precision is reserved for an actual selected event, above.
  useEffect(() => {
    const map = mapRef.current
    if (!map || visibleEvents.length === 0 || selectedEvent) return

    // The first cursor value is a default, not a navigation. Flying on it meant
    // the canvas never showed the globe: it opened already descended onto
    // whichever region happened to sit nearest the initial timestamp. Hold the
    // opening whole-earth view until the user actually moves the cursor.
    if (!cursorMovedRef.current) {
      cursorMovedRef.current = true
      return
    }

    /*
     * A station cursor names specific records — frame *those*, not a
     * time-neighbourhood.
     *
     * The previous behaviour averaged the lat/long of the twelve events nearest
     * in time, which for a globally scattered corpus lands the camera on the
     * mean of unrelated points: selecting the 1983 chapter flew to 30°N 21°W,
     * open ocean, with nothing from that chapter in frame. M0's exit criterion
     * is that the camera matches the card on screen, and a centroid of
     * scattered points does not satisfy it.
     */
    const stationEvents =
      cursor.mode === 'station'
        ? visibleEvents.filter(
            (e) =>
              e.coordinates &&
              stationEventIds(stations, cursor.stationId).has(e.id),
          )
        : []

    if (stationEvents.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      for (const e of stationEvents) {
        bounds.extend([e.coordinates!.longitude, e.coordinates!.latitude])
      }
      map.fitBounds(bounds, {
        padding: {top: 120, bottom: 140, left: 380, right: 340},
        // A single record has zero-area bounds, so cap the descent rather than
        // letting fitBounds zoom to maximum on a point.
        maxZoom: 7.5,
        duration: 1800,
        pitch: 35,
        essential: true,
      })
      return
    }

    // Exact / range cursor: no named records, so fall back to the temporal
    // neighbourhood — but frame its extent rather than its average.
    const ts =
      cursor.mode === 'range'
        ? new Date(cursor.start).getTime()
        : new Date(cursor.timestamp).getTime()
    if (!Number.isFinite(ts)) return

    const nearby = visibleEvents
      .filter((e) => e.coordinates)
      .map((e) => ({
        e,
        dt: Math.abs(new Date(e.timestamp).getTime() - ts),
      }))
      .sort((a, b) => a.dt - b.dt)
      .slice(0, 8)

    if (nearby.length === 0) return

    const bounds = new mapboxgl.LngLatBounds()
    for (const {e} of nearby) {
      bounds.extend([e.coordinates!.longitude, e.coordinates!.latitude])
    }
    map.fitBounds(bounds, {
      padding: {top: 120, bottom: 140, left: 380, right: 340},
      maxZoom: 6,
      duration: 1600,
      pitch: 30,
      essential: true,
    })
  }, [cursor, visibleEvents, selectedEvent, stations])

  if (!process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-[#05080b] font-mono text-[10px] tracking-[0.24em] text-[#4d5c62] uppercase'>
        Set NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN for live globe
      </div>
    )
  }

  // z-0 with everything else at z-20+: the map sits at the bottom of the map
  // region's stacking order but still receives pointer input, because nothing
  // above it spans the full box any more.
  return (
    <>
      {/*
       * Raise Mapbox's own corner controls above the coordinate readout bar.
       * The attribution logo is anchored to the canvas bottom, exactly where
       * the readout sits, and Mapbox's terms require it stay visible — so it is
       * stacked over the bar (which reserves `pl-28` for it) rather than being
       * covered or shoved under the narrative column. Scoped under `stc-globe`
       * because this app's global stylesheet is known to clobber unprefixed
       * class names.
       */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .stc-globe .mapboxgl-ctrl-bottom-left,
            .stc-globe .mapboxgl-ctrl-bottom-right { z-index: 25; }
          `,
        }}
      />
      <div ref={containerRef} className='stc-globe absolute inset-0 z-0 h-full w-full' />
    </>
  )
}

/** The event ids a station names, or an empty set if it names none. */
function stationEventIds(
  stations: TemporalStation[],
  stationId: string,
): Set<string> {
  const station = stations.find((s) => s.id === stationId)
  return new Set(station?.eventIds ?? [])
}

/** Single source for pin colour, so the legend can never drift from the paint. */
function epistemicColorExpression(): mapboxgl.ExpressionSpecification {
  return [
    'match',
    ['get', 'epistemic'],
    'documented',
    STC_EPISTEMIC_COLOR.documented,
    'disputed',
    STC_EPISTEMIC_COLOR.disputed,
    /* inferred */ STC_EPISTEMIC_COLOR.inferred,
  ]
}
