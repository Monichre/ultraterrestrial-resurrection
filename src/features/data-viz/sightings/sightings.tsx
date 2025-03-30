'use client'

import type GeoJSON from 'geojson'

import {SightingsLoader} from '@/components/loaders'
import {useState, useEffect, useCallback} from 'react'
import HudUapInterface from '@/components/uap-dashboard/HudUapInterface'

type GeoJSONData = {
  sightings: GeoJSON.FeatureCollection
  militaryBases?: GeoJSON.FeatureCollection
  ufoPosts?: GeoJSON.FeatureCollection
}

export const SightingsClient = ({geoJSONSightings}: {geoJSONSightings: GeoJSONData}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [geoJSONData, setGeoJSONData] = useState<GeoJSONData | null>(null)

  console.log('🚀 ~ SightingsClient ~ geoJSONData:', geoJSONData)

  // Handle loader completion
  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (geoJSONSightings) {
      setGeoJSONData(geoJSONSightings)
    }
  }, [geoJSONSightings])

  if (isLoading || !geoJSONData) {
    return <SightingsLoader onLoadComplete={handleLoadComplete} />
  }

  return (
    <>
      <HudUapInterface sightings={geoJSONSightings.sightings} />
    </>
  )
}
