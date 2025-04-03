'use client'

import {SightingsLoader} from './sightings-loader'
import {useState, useEffect, useCallback} from 'react'
import {HudUapInterface} from '@/features/data-viz/sightings/uap-dashboard/HudUapInterface'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'

interface StatsType {
  totalSightings: number
  byType?: Record<string, number>
  byConfidence?: Record<string, number>
  byYear?: Record<string, number>
  [key: string]: number | Record<string, number> | undefined
}

interface SightingsClientProps {
  sightings: ValidatedUAPSighting[]
  stats: StatsType
}

export const SightingsClient = ({sightings, stats}: SightingsClientProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [sightingsData, setSightingsData] = useState<ValidatedUAPSighting[] | null>(null)

  // Handle loader completion
  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (sightings && sightings.length > 0) {
      setSightingsData(sightings)
    }
  }, [sightings])

  if (isLoading || !sightingsData) {
    return <SightingsLoader onLoadComplete={handleLoadComplete} />
  }

  return (
    <>
      <HudUapInterface initialSightings={sightingsData} />
    </>
  )
}
