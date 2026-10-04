'use client'

import {useMemo} from 'react'
import {MapboxOverlay} from '@deck.gl/mapbox'
import type {DeckProps} from '../types'

// Create a DeckGL overlay for Mapbox to integrate deck.gl layers with Mapbox
export function DeckGLOverlay({layers}: DeckProps) {
  const overlay = useMemo(() => new MapboxOverlay({layers}), [layers])

  return (
    <div
      id='deck-gl-overlay'
      ref={(el) => {
        if (el) {
          // This is a workaround to attach the overlay to the map
          const mapDiv = el.parentNode
          if (mapDiv && mapDiv.classList.contains('mapboxgl-map')) {
            const map = (mapDiv as any)._map
            if (map && !map.__deck) {
              map.addControl(overlay)
              map.__deck = true
            }
          }
        }
      }}
    />
  )
}
