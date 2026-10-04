'use client'

import {Crosshair, Minus, Navigation, Plus} from 'lucide-react'
import {useSpacetimeMap} from '../lib/map-controller'
import {useSpacetimeStore} from '../state/spacetime-store'

/**
 * Compass · zoom · recenter stack — concept-01 frame 1, concept-03 frame 1,
 * concept-04 frame 2 (right edge of the map).
 *
 * Backed by the live Mapbox instance through the registry, so these move the
 * real camera. They render disabled until the map attaches rather than
 * appearing live and swallowing clicks.
 */
export function MapControls() {
  const map = useSpacetimeMap()
  const bearing = useSpacetimeStore((s) => s.viewport.bearing ?? 0)
  const selectEvent = useSpacetimeStore((s) => s.selectEvent)

  const disabled = map == null

  return (
    <div className='pointer-events-auto absolute top-1/2 right-4 z-20 flex -translate-y-1/2 flex-col gap-2'>
      <button
        type='button'
        disabled={disabled}
        onClick={() => map?.easeTo({bearing: 0, pitch: 0, duration: 600})}
        title='Reset bearing to north'
        aria-label='Reset bearing to north'
        className='flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(125,190,210,0.2)] bg-[rgba(8,13,17,0.82)] text-[#a8b8be] backdrop-blur-md transition-colors hover:border-[rgba(79,216,232,0.5)] hover:text-[#4fd8e8] disabled:opacity-30'
      >
        {/* The needle tracks the real bearing — a static N would be a lie the
            moment the user rotates the map. */}
        <Navigation
          size={14}
          strokeWidth={1.6}
          style={{transform: `rotate(${-bearing}deg)`}}
        />
      </button>

      <div className='overflow-hidden rounded-full border border-[rgba(125,190,210,0.2)] bg-[rgba(8,13,17,0.82)] backdrop-blur-md'>
        <button
          type='button'
          disabled={disabled}
          onClick={() => map?.zoomIn({duration: 400})}
          title='Zoom in'
          aria-label='Zoom in'
          className='flex h-9 w-9 items-center justify-center text-[#a8b8be] transition-colors hover:bg-white/[0.06] hover:text-[#4fd8e8] disabled:opacity-30'
        >
          <Plus size={14} strokeWidth={1.8} />
        </button>
        <span aria-hidden className='block h-px bg-[rgba(125,190,210,0.16)]' />
        <button
          type='button'
          disabled={disabled}
          onClick={() => map?.zoomOut({duration: 400})}
          title='Zoom out'
          aria-label='Zoom out'
          className='flex h-9 w-9 items-center justify-center text-[#a8b8be] transition-colors hover:bg-white/[0.06] hover:text-[#4fd8e8] disabled:opacity-30'
        >
          <Minus size={14} strokeWidth={1.8} />
        </button>
      </div>

      <button
        type='button'
        disabled={disabled}
        onClick={() => {
          // Dropping the selection is part of "recenter": otherwise the globe's
          // fly-to-selected effect pulls the camera straight back down.
          selectEvent(null)
          map?.easeTo({center: [-30, 25], zoom: 1.7, pitch: 0, bearing: 0, duration: 900})
        }}
        title='Recenter on the whole globe'
        aria-label='Recenter on the whole globe'
        className='flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(125,190,210,0.2)] bg-[rgba(8,13,17,0.82)] text-[#a8b8be] backdrop-blur-md transition-colors hover:border-[rgba(79,216,232,0.5)] hover:text-[#4fd8e8] disabled:opacity-30'
      >
        <Crosshair size={14} strokeWidth={1.6} />
      </button>
    </div>
  )
}
