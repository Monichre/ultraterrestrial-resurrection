'use client'

import {useSyncExternalStore} from 'react'
import type mapboxgl from 'mapbox-gl'

/**
 * Registry for the single live Mapbox instance.
 *
 * The docked map controls (compass, zoom, recenter) and the coordinate readout
 * sit *outside* the globe component in the boarded layout, so they need a handle
 * on the map. This is a module-level ref rather than Zustand state on purpose:
 * a Mapbox `Map` is a large mutable object with its own event loop, and putting
 * it in the store would make every consumer of the store a subscriber to it.
 *
 * `useSpacetimeMap()` re-renders only on attach/detach, which is all the
 * controls need to flip between disabled and live.
 */

let mapInstance: mapboxgl.Map | null = null
const listeners = new Set<() => void>()

export function registerSpacetimeMap(map: mapboxgl.Map | null): void {
  mapInstance = map
  for (const listener of listeners) listener()
}

export function getSpacetimeMap(): mapboxgl.Map | null {
  return mapInstance
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Server snapshot is always null — the map only exists in the browser. */
const serverSnapshot = () => null

export function useSpacetimeMap(): mapboxgl.Map | null {
  return useSyncExternalStore(subscribe, () => mapInstance, serverSnapshot)
}
