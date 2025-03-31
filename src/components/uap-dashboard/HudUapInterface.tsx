'use client'

import dynamic from 'next/dynamic'
import {useState} from 'react'
import {Card} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {TechSection} from './tech-section'
import {GraphPaperBackground} from './graph-paper-background/graph-paper-background'
import {SpaceHud} from './space-hud/space-hud'
import {Terminal} from './terminal/terminal'

// Import GSAP for animations
import Script from 'next/script'

const Globe = dynamic(() => import('./globe'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-full flex items-center justify-center'>
      <Skeleton className='w-[400px] h-[400px] rounded-full bg-gray-800/30' />
    </div>
  ),
})

const AlternativeGlobe = dynamic(() => import('./alternative-globe'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-full flex items-center justify-center'>
      <Skeleton className='w-[400px] h-[400px] rounded-full bg-gray-800/30' />
    </div>
  ),
})

const CodepenGlobe = dynamic(() => import('./codepen-globe'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-full flex items-center justify-center'>
      <Skeleton className='w-[400px] h-[400px] rounded-full bg-gray-800/30' />
    </div>
  ),
})

const locations = [
  {name: 'NEW YORK', lat: 40.7128, lon: -74.006},
  {name: 'TOKYO', lat: 35.6762, lon: 139.6503},
  {name: 'LONDON', lat: 51.5074, lon: -0.1278},
  {name: 'SYDNEY', lat: -33.8688, lon: 151.2093},
  {name: 'RIO', lat: -22.9068, lon: -43.1729},
  {name: 'JOHANNESBURG', lat: -33.9249, lon: 18.4241},
  {name: 'MOSCOW', lat: 55.7558, lon: 37.6173},
  {name: 'DUBAI', lat: 25.2048, lon: 55.2708},
  {name: 'CAIRO', lat: 30.0444, lon: 31.2357},
  {name: 'MUMBAI', lat: 19.076, lon: 72.8777},
  {name: 'SINGAPORE', lat: 1.3521, lon: 103.8198},
  {name: 'SHANGHAI', lat: 31.2304, lon: 121.4737},
]

'use client'

import { useSightingsData } from '@/hooks/use-sightings-data'
import { type ValidatedUAPSighting } from '@/services/sightings/uap-sighting'
import { FilterPanel } from './filter-panel'
import { TimeRangeSelector } from './time-range-selector'
import { SightingsStatsDisplay } from './sightings-stats-display'

// Set up interface props for optional initial data
interface HudUapInterfaceProps {
  initialSightings?: ValidatedUAPSighting[]
  initialEvents?: any
  initialLocations?: any
}

export function HudUapInterface({
  initialSightings,
  initialEvents,
  initialLocations,
}: HudUapInterfaceProps = {}) {
  // Use the hook to fetch and manage data
  const {
    sightings,
    events,
    stats,
    isLoading,
    timeRange,
    filters,
    updateTimeRange,
    updateFilters
  } = useSightingsData({
    initialTimeRange: { startYear: new Date().getFullYear() - 10, endYear: new Date().getFullYear() },
    chunkSize: 5
  })
  
  // Use initialSightings as fallback if provided
  const displaySightings = sightings.length > 0 ? sightings : initialSightings || []
  const displayEvents = events.length > 0 ? events : initialEvents || []
  
  // Locations data (either from hook's fetched data or initial props)
  const locationOptions = initialLocations || []
  const [focusedLocation, setFocusedLocation] = useState<{lat: number; lon: number} | null>(null)
  const [globeType, setGlobeType] = useState<'default' | 'alternative' | 'codepen'>('default')
  const [graphPaperReady, setGraphPaperReady] = useState(false)

  const renderGlobe = () => {
    switch (globeType) {
      case 'default':
        return <Globe focusedLocation={focusedLocation} />
      case 'alternative':
        return <AlternativeGlobe />
      case 'codepen':
        return <CodepenGlobe focusedLocation={focusedLocation} locations={locations} />
      default:
        return <Globe focusedLocation={focusedLocation} />
    }
  }

  return (
    <>
      {/* GSAP Script for animations */}
      <Script
        src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
        strategy='beforeInteractive'
      />

      <main className='min-h-screen text-white font-monument-mono relative z-10 bg-black'>
        {/* GraphPaperBackground will now be behind all content */}
        <GraphPaperBackground onReady={() => setGraphPaperReady(true)} />

        {/* Content that appears after graph paper is ready */}
        <div
          className={`relative h-screen grid grid-cols-12 gap-2 p-2 z-10 transition-opacity duration-1000 ${
            graphPaperReady ? 'opacity-100' : 'opacity-0'
          }`}>
          {/* Left Column - 4/12 width */}
          <div className='col-span-4 flex flex-col gap-2'>
            <div className='border border-white/20 p-2 flex justify-between items-center'>
              <h1 className='text-lg tracking-wider uppercase font-monument-mono'>
                ULTRATERRESTRIAL
              </h1>
              <div className='flex items-center space-x-1'>
                <div className='w-3 h-0.5 bg-white/40'></div>
                <div className='w-3 h-0.5 bg-white/40'></div>
              </div>
            </div>

            <TechSection title='SIGHTINGS CONTROL' className='flex-1'>
              <div className='p2 relative flex flex-col h-full gap-2'>
                {/* Time Range Selector Component */}
                <TimeRangeSelector 
                  timeRange={timeRange} 
                  onChange={updateTimeRange} 
                />
                
                {/* Filter Panel Component */}
                <FilterPanel 
                  filters={filters} 
                  onChange={updateFilters} 
                  className="flex-grow"
                />
                
                {/* Sightings Statistics */}
                <SightingsStatsDisplay 
                  stats={stats} 
                  isLoading={isLoading}
                />
                
                {/* Terminal component for system messages */}
                <Card className='bg-black border-white/20 relative mt-auto'>
                  <div className='border-b border-white/20 p-1'>
                    <div className='text-xs font-medium text-white/80 font-monument-mono'>
                      SYSTEM TERMINAL
                    </div>
                    <div className='flex items-center space-x-1'>
                      <div className='w-2 h-0.5 bg-white/40'></div>
                      <div className='w-2 h-0.5 bg-white/40'></div>
                    </div>
                  </div>
                  <Terminal />
                </Card>
              </div>
            </TechSection>

            <div className='border border-white/20 p-2'>
              <div className='text-xs font-medium text-white/80 font-monument-mono flex justify-between mb-2'>
                <span>GLOBE SELECTION</span>
                <span className='text-white/40'>
                  00{globeType === 'default' ? '1' : globeType === 'alternative' ? '2' : '3'}
                </span>
              </div>
              <div className='grid grid-cols-3 gap-2'>
                <Button
                  variant='outline'
                  className={`bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs h-8 ${
                    globeType === 'default' ? 'bg-white/10' : ''
                  }`}
                  onClick={() => setGlobeType('default')}>
                  GLOBE 1
                </Button>
                <Button
                  variant='outline'
                  className={`bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs h-8 ${
                    globeType === 'alternative' ? 'bg-white/10' : ''
                  }`}
                  onClick={() => setGlobeType('alternative')}>
                  GLOBE 2
                </Button>
                <Button
                  variant='outline'
                  className={`bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs h-8 ${
                    globeType === 'codepen' ? 'bg-white/10' : ''
                  }`}
                  onClick={() => setGlobeType('codepen')}>
                  GLOBE 3
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - 8/12 width */}
          <div className='col-span-8 grid grid-rows-2 gap-2'>
            {/* Upper Half - Space HUD */}
            <TechSection title='MODEL VISUALIZATION' subtitle='ORBITAL MONITORING SYSTEM'>
              <div className='h-full bg-transparent'>
                <SpaceHud />
              </div>
            </TechSection>

            {/* Lower Half - Globe */}
            <TechSection
              title='GLOBAL MONITORING SYSTEM'
              subtitle={`SIGHTINGS: ${displaySightings.length} | UPLINK: ACTIVE`}>
              <div className='h-full bg-transparent'>{renderGlobe()}</div>

              {/* Status indicators */}
              <div className='absolute bottom-2 right-2 text-right text-xs'>
                <div className='text-white/60 font-monument-mono'>
                  {isLoading ? 'LOADING DATA...' : 'DATA LOADED'}
                </div>
                <div className='text-white/60 font-monument-mono'>
                  TIME FILTER: {timeRange.startYear}-{timeRange.endYear}
                </div>
                <div className='text-white/60 font-monument-mono'>
                  {filters.shape || filters.location || filters.isSignificantEvent 
                    ? 'FILTERS ACTIVE' 
                    : 'NO FILTERS'}
                </div>
              </div>
            </TechSection>

            {/* Locations list */}
            <div className='absolute right-4 top-3/4 transform -translate-y-1/2 z-10'>
              <Card className='bg-black border-white/20 p-2 max-h-[300px] overflow-y-auto relative'>
                <div className='text-xs font-medium text-white/80 font-monument-mono flex justify-between mb-2'>
                  <span>LOCATIONS</span>
                  <span className='text-white/40'>{locations.length}</span>
                </div>
                <div className='space-y-1 max-w-[160px]'>
                  {locations.map((location, i) => (
                    <div
                      key={i}
                      className='text-xs text-white/60 hover:text-white cursor-pointer transition-colors font-monument-mono'
                      onMouseEnter={() =>
                        setFocusedLocation({lat: location.lat, lon: location.lon})
                      }
                      onMouseLeave={() => setFocusedLocation(null)}>
                      {location.name}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
