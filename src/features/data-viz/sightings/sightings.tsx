'use client'

import {SightingsGlobe} from '@/features/data-viz/sightings/sightings-globe'
import {SightingsLoader} from '@/features/data-viz/sightings/sightings-loader'
import {Suspense, useState, useEffect} from 'react'
import type GeoJSON from 'geojson'

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
  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    if (geoJSONSightings) {
      setGeoJSONData(geoJSONSightings)
      setIsLoading(false)
    }
  }, [geoJSONSightings])

  if (isLoading || !geoJSONData) {
    return <SightingsLoader onLoadComplete={handleLoadComplete} />
  }

  // Set useExternalData to true to ensure the component always loads real data
  return (
    <Suspense fallback={<SightingsLoader onLoadComplete={handleLoadComplete} />}>
      <SightingsGlobe geoJSONSightings={geoJSONData} useExternalData={true} />
    </Suspense>
  )
}
