'use client'

import {SightingsLoader} from './sightings-loader'
import {useState, useEffect, useCallback} from 'react'
import {HudUapInterface} from '@/features/sightings/uap-dashboard/HudUapInterface'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {debugLog} from '@/utils/logger'

interface StatsType {
  totalSightings: number
  byType?: Record<string, number>
  byConfidence?: Record<string, number>
  byYear?: Record<string, number>
  [key: string]: number | Record<string, number> | undefined
}

interface SightingsClientProps {
  sightings: ValidatedUAPSighting[]
  events: any[] // Using any for now, replace with proper type if available
  stats: StatsType
  analysis?: any // The AI analysis result
}

export const SightingsClient = ({sightings, events, stats, analysis}: SightingsClientProps) => {
  debugLog('🚀 ~ SightingsClient ~ sightings:', sightings)
  debugLog('🚀 ~ SightingsClient ~ events:', events)
  debugLog('🚀 ~ SightingsClient ~ stats:', stats)
  debugLog('🚀 ~ SightingsClient ~ analysis:', analysis)

  const [isLoading, setIsLoading] = useState(true)
  const [sightingsData, setSightingsData] = useState<ValidatedUAPSighting[] | null>(null)
  const [eventsData, setEventsData] = useState<any[] | null>(null)

  // Handle loader completion
  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Process sightings data
    if (sightings && sightings.length > 0) {
      setSightingsData(sightings)
    }

    // Process events data
    if (events && events.length > 0) {
      setEventsData(events)
    }
  }, [sightings, events])

  if (isLoading || (!sightingsData && !eventsData)) {
    return <SightingsLoader onLoadComplete={handleLoadComplete} />
  }

  return (
    <>
      <HudUapInterface
        initialSightings={sightingsData || []}
        events={eventsData || []}
        analysisResults={analysis}
      />
    </>
  )
}
