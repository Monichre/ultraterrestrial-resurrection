'use client'

import {useRef, useState, useEffect} from 'react'
import {loadMapboxTileset} from '../utils/map-utils'

interface UseMapInitializationProps {
  useTileset: boolean
  mapLoaded: boolean
  setMapLoaded: (loaded: boolean) => void
  setPopupInfo: (info: any | null) => void
}

/**
 * Hook to handle map initialization and loading
 */
export function useMapInitialization({
  useTileset,
  mapLoaded,
  setMapLoaded,
  setPopupInfo,
}: UseMapInitializationProps) {
  const mapRef = useRef(null)

  // Handle map initialization when the component mounts
  useEffect(() => {
    // Cancel if mapRef is not ready
    if (!mapRef.current) return

    let mounted = true
    let mapInstance = null
    let retryCount = 0
    const MAX_RETRIES = 10 // Prevent infinite retries

    // Function to safely get the map instance
    const getMapInstance = () => {
      try {
        if (!mapRef.current) return null

        // Access map differently depending on react-map-gl version
        return mapRef.current.getMap
          ? mapRef.current.getMap()
          : mapRef.current._map
          ? mapRef.current._map
          : mapRef.current
      } catch (error) {
        console.error('Error getting map instance:', error)
        return null
      }
    }

    // Function to handle map loaded state
    const handleMapLoad = () => {
      if (!mounted) return

      console.log('Map loaded successfully')

      // Double-check that we have a valid map instance with required methods
      const instance = getMapInstance()
      if (instance && typeof instance.getSource === 'function') {
        setMapLoaded(true)

        // If using tileset mode, load the Mapbox tileset
        if (useTileset) {
          setTimeout(() => {
            if (mounted) loadMapboxTileset(mapRef, mapLoaded, setPopupInfo)
          }, 100) // Small delay to ensure map is fully ready
        }
      } else {
        // If the map instance doesn't have getSource yet, try again after a short delay
        // but limit retries to prevent infinite loops
        if (retryCount < MAX_RETRIES) {
          console.warn(
            `Map instance loaded but methods not available yet, retrying... (${
              retryCount + 1
            }/${MAX_RETRIES})`
          )
          retryCount++
          setTimeout(() => {
            if (mounted) handleMapLoad()
          }, 200)
        } else {
          console.error('Max retries reached while waiting for map methods to become available')
          // Force the map to be considered loaded after max retries
          setMapLoaded(true)
        }
      }
    }

    // Get map instance and check its state
    const checkMapInstance = () => {
      if (retryCount >= MAX_RETRIES) {
        console.error('Max retries reached while waiting for map instance')
        // Force the map to be considered loaded after max retries
        setMapLoaded(true)
        return
      }

      mapInstance = getMapInstance()

      if (!mapInstance) {
        // If no instance yet, retry after a delay
        retryCount++
        setTimeout(() => {
          if (mounted) checkMapInstance()
        }, 200)
        return
      }

      // Check if the map is already loaded
      if (typeof mapInstance.loaded === 'function' && mapInstance.loaded()) {
        handleMapLoad()
      } else if (typeof mapInstance.on === 'function') {
        // Listen for load event
        mapInstance.on('load', handleMapLoad)
        // Also set a backup timeout in case the event doesn't fire
        setTimeout(() => {
          if (mounted && !mapLoaded) {
            console.log('Map load event not fired, forcing load check')
            handleMapLoad()
          }
        }, 2000)
      } else {
        // Fallback - retry after a short delay, but only a limited number of times
        retryCount++
        console.warn(
          `Map instance has no loaded method, retrying... (${retryCount}/${MAX_RETRIES})`
        )
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            if (mounted) checkMapInstance()
          }, 200)
        } else {
          console.error('Max retries reached. Assuming map is ready.')
          // Force the map to be considered loaded after max retries
          setMapLoaded(true)
        }
      }
    }

    // Start checking for map instance
    checkMapInstance()

    // Cleanup function
    return () => {
      mounted = false
      // Remove event listener if possible
      if (mapInstance && typeof mapInstance.off === 'function') {
        try {
          mapInstance.off('load', handleMapLoad)
        } catch (error) {
          console.error('Error cleaning up map event listener:', error)
        }
      }
    }
  }, [useTileset, mapLoaded, setMapLoaded, setPopupInfo])

  return {mapRef}
}
