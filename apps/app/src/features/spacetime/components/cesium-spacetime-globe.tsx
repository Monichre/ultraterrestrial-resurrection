'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {filterSpacetimeEvents} from '../lib/filter-events'
import {STC_EPISTEMIC_COLOR} from '../lib/spacetime-theme'
import {useSpacetimeStore} from '../state/spacetime-store'
import type {SpacetimeEvent} from '../types/spacetime'

const CESIUM_BASE_URL = '/cesium'
const CESIUM_WIDGET_STYLESHEET_ID = 'spacetime-cesium-widget-styles'
const ESRI_WORLD_IMAGERY_URL =
  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'

interface CesiumEntityProperties {
  spacetimeEventId: {getValue: () => string}
}

/**
 * Client-only Cesium renderer for the Spacetime Canvas.
 *
 * It intentionally carries no donor application code: no feeds, data manager,
 * panels, global DOM bindings, or bundled geographical datasets. The only
 * source is the curated SpacetimeEvent corpus already rendered by Mapbox.
 */
export function CesiumSpacetimeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const creditRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<import('cesium').Viewer | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const events = useSpacetimeStore((state) => state.events)
  const layers = useSpacetimeStore((state) => state.layers)
  const filters = useSpacetimeStore((state) => state.filters)
  const selectedEventId = useSpacetimeStore((state) => state.selectedEventId)
  const selectEvent = useSpacetimeStore((state) => state.selectEvent)
  const setViewport = useSpacetimeStore((state) => state.setViewport)

  const visibleEvents = useMemo(
    () => filterSpacetimeEvents(events, layers, filters),
    [events, layers, filters]
  )
  const selectedEvent = useMemo(
    () => visibleEvents.find((event) => event.id === selectedEventId) ?? null,
    [selectedEventId, visibleEvents]
  )

  useEffect(() => {
    let cancelled = false
    let viewer: import('cesium').Viewer | null = null
    let removeCameraListener: (() => void) | undefined

    const mount = async () => {
      if (!containerRef.current || !creditRef.current) return

      try {
        await ensureCesiumWidgetStyles()
        // Cesium resolves workers, SVGs and other runtime files relative to this
        // global during module initialization. It must be present before import.
        const cesiumWindow = window as typeof window & {CESIUM_BASE_URL?: string}
        cesiumWindow.CESIUM_BASE_URL = CESIUM_BASE_URL
        const Cesium = await import('cesium')
        if (cancelled || !containerRef.current || !creditRef.current) return

        viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          baseLayer: false,
          baseLayerPicker: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          creditContainer: creditRef.current,
        })
        viewerRef.current = viewer
        viewer.targetFrameRate = 60
        viewer.scene.requestRenderMode = true
        viewer.scene.maximumRenderTimeChange = Number.POSITIVE_INFINITY
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#05080b')
        viewer.scene.skyAtmosphere.show = true
        viewer.scene.skyAtmosphere.atmosphereLightIntensity = 8
        viewer.scene.skyAtmosphere.saturationShift = -0.12
        viewer.scene.skyAtmosphere.brightnessShift = -0.08

        const imagery = await Cesium.ArcGisMapServerImageryProvider.fromUrl(ESRI_WORLD_IMAGERY_URL)
        if (cancelled) return
        viewer.imageryLayers.addImageryProvider(imagery)

        const syncViewport = () => {
          const cartographic = viewer?.camera.positionCartographic
          if (!cartographic) return
          setViewport({
            longitude: Cesium.Math.toDegrees(cartographic.longitude),
            latitude: Cesium.Math.toDegrees(cartographic.latitude),
            altitudeMeters: cartographic.height,
            bearing: Cesium.Math.toDegrees(viewer.camera.heading),
            pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
          })
        }

        removeCameraListener = viewer.camera.changed.addEventListener(syncViewport)
        viewer.screenSpaceEventHandler.setInputAction(
          (movement: {position: import('cesium').Cartesian2}) => {
            const picked = viewer?.scene.pick(movement.position)
            const eventId = readPickedEventId(picked)
            if (eventId) selectEvent(eventId)
          },
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        )

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-95.3506, 30.0059, 6143),
          orientation: {
            heading: 0,
            pitch: Cesium.Math.toRadians(-35),
            roll: 0,
          },
        })
        syncViewport()
        viewer.scene.requestRender()
        setReady(true)
      } catch (cause) {
        console.error(cause)
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Cesium could not initialize')
        }
      }
    }

    void mount()

    return () => {
      cancelled = true
      removeCameraListener?.()
      if (viewer && !viewer.isDestroyed()) viewer.destroy()
      viewerRef.current = null
      setReady(false)
    }
  }, [selectEvent, setViewport])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !ready) return

    void renderEvents(viewer, visibleEvents)
  }, [ready, visibleEvents])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !selectedEvent?.coordinates) return

    void import('cesium').then((Cesium) => {
      if (!viewer.isDestroyed()) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            selectedEvent.coordinates!.longitude,
            selectedEvent.coordinates!.latitude,
            selectedEvent.coordinates!.altitudeMeters ?? 150_000
          ),
          orientation: {heading: 0, pitch: Cesium.Math.toRadians(-35), roll: 0},
          duration: 1.8,
        })
      }
    })
  }, [selectedEvent])

  return (
    <>
      <div ref={containerRef} className='absolute inset-0 z-0 h-full w-full' />
      <div className='pointer-events-auto absolute right-3 bottom-2 z-20 flex max-w-[calc(100%-1.5rem)] items-end gap-2 font-mono text-[9px] text-[#a8b8be]'>
        <div
          ref={creditRef}
          className='[&_.cesium-credit-textContainer]:max-w-full [&_.cesium-credit-textContainer]:overflow-hidden [&_.cesium-credit-textContainer]:text-ellipsis [&_.cesium-credit-textContainer]:whitespace-nowrap'
        />
        <a
          className='whitespace-nowrap text-[#c6d0d5] underline decoration-[#5d717a] underline-offset-2 hover:text-white'
          href='https://www.esri.com/en-us/legal/terms/full-master-agreement'
          rel='noreferrer'
          target='_blank'
        >
          Powered by Esri
        </a>
      </div>
      {error ? (
        <div className='pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center'>
          <span className='rounded-full border border-[rgba(232,116,140,0.4)] bg-[rgba(48,12,20,0.9)] px-3 py-1 font-mono text-[9px] tracking-[0.18em] text-[#f4c3cc] uppercase backdrop-blur-md'>
            Cesium unavailable: {error}
          </span>
        </div>
      ) : null}
    </>
  )
}

async function renderEvents(viewer: import('cesium').Viewer, events: SpacetimeEvent[]) {
  const Cesium = await import('cesium')
  if (viewer.isDestroyed()) return

  viewer.entities.removeAll()
  for (const event of events) {
    if (!event.coordinates) continue
    const color = Cesium.Color.fromCssColorString(
      STC_EPISTEMIC_COLOR[event.epistemicStatus ?? 'inferred']
    )
    viewer.entities.add({
      id: `spacetime-event-${event.id}`,
      position: Cesium.Cartesian3.fromDegrees(
        event.coordinates.longitude,
        event.coordinates.latitude,
        event.coordinates.altitudeMeters ?? 0
      ),
      properties: {spacetimeEventId: event.id},
      point: {
        color,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.7),
        outlineWidth: 1,
        pixelSize: 7,
        scaleByDistance: new Cesium.NearFarScalar(100_000, 1.35, 20_000_000, 0.45),
      },
    })
  }
  viewer.scene.requestRender()
}

function readPickedEventId(picked: unknown): string | null {
  if (!picked || typeof picked !== 'object') return null
  const entity = (picked as {id?: {properties?: CesiumEntityProperties}}).id
  const eventId = entity?.properties?.spacetimeEventId?.getValue()
  return typeof eventId === 'string' ? eventId : null
}

function ensureCesiumWidgetStyles(): Promise<void> {
  const existing = document.getElementById(CESIUM_WIDGET_STYLESHEET_ID)
  if (existing) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const stylesheet = document.createElement('link')
    stylesheet.id = CESIUM_WIDGET_STYLESHEET_ID
    stylesheet.rel = 'stylesheet'
    stylesheet.href = `${CESIUM_BASE_URL}/Widgets/widgets.css`
    stylesheet.onload = () => resolve()
    stylesheet.onerror = () => reject(new Error('Cesium widget stylesheet did not load'))
    document.head.appendChild(stylesheet)
  })
}
