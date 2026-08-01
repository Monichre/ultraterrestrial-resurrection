'use client'

import {useEffect, useMemo, useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {useSpacetimeStore} from '../state/spacetime-store'
import type {SpacetimeEvent} from '../types/spacetime'

const SOURCE_ID = 'spacetime-events'
const LAYER_ID = 'spacetime-events-circle'

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
          credibility: e.credibilityScore ?? 0.5,
          epistemic: e.epistemicStatus ?? 'inferred',
        },
      })),
  }
}

/**
 * Live Mapbox background for the Spacetime Canvas.
 * Data comes from the bounded server action — never static sightings.geojson.
 */
export function SpacetimeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const events = useSpacetimeStore((s) => s.events)
  const layers = useSpacetimeStore((s) => s.layers)
  const filters = useSpacetimeStore((s) => s.filters)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)
  const setViewport = useSpacetimeStore((s) => s.setViewport)

  const visibleEvents = useMemo(
    () => filterSpacetimeEvents(events, layers, filters),
    [events, layers, filters],
  )
  const geojson = useMemo(() => eventsToGeoJSON(visibleEvents), [visibleEvents])

  // Boot map once
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN
    if (!token || !containerRef.current || mapRef.current) return

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5, 39.8],
      zoom: 3.2,
      attributionControl: false,
      pitch: 0,
    })

    map.on('load', () => {
      map.addSource(SOURCE_ID, {type: 'geojson', data: geojson})
      map.addLayer({
        id: LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'credibility'],
            0.3,
            3,
            0.85,
            7,
          ],
          'circle-color': [
            'match',
            ['get', 'epistemic'],
            'documented',
            '#86efac',
            'disputed',
            '#fda4af',
            /* inferred */ '#93c5fd',
          ],
          'circle-opacity': 0.85,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#0a0a0a',
        },
      })
    })

    map.on('click', LAYER_ID, (e) => {
      const id = e.features?.[0]?.properties?.id
      if (typeof id === 'string') selectEvent(id)
    })

    map.on('moveend', () => {
      const c = map.getCenter()
      setViewport({
        longitude: c.lng,
        latitude: c.lat,
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      })
    })

    mapRef.current = map
    return () => {
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

  // Cursor → soft camera nudge toward geolocated events near that time
  useEffect(() => {
    const map = mapRef.current
    if (!map || visibleEvents.length === 0) return

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
      .slice(0, 12)

    if (nearby.length === 0) return

    const avgLng =
      nearby.reduce((s, n) => s + n.e.coordinates!.longitude, 0) / nearby.length
    const avgLat =
      nearby.reduce((s, n) => s + n.e.coordinates!.latitude, 0) / nearby.length

    map.easeTo({
      center: [avgLng, avgLat],
      duration: 900,
      essential: true,
    })
  }, [cursor, visibleEvents])

  if (!process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-neutral-950 text-xs tracking-widest text-neutral-500 uppercase'>
        Set NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN for live globe
      </div>
    )
  }

  return <div ref={containerRef} className='absolute inset-0 h-full w-full' />
}
