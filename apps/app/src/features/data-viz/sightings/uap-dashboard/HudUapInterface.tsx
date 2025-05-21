'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import {useState, useEffect, useCallback} from 'react'
import {Card} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {TechSection} from './tech-section'
import {GraphPaperBackground} from './graph-paper-background/graph-paper-background'
import {SpaceHud} from './space-hud/space-hud'
import {Terminal} from './terminal/terminal'
import {useSightingsData} from '@/hooks/use-sightings-data'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {FilterPanel} from './filter-panel'
import {TimeRangeSelector} from './time-range-selector'
import {YearSelectionMenu} from './year-selection-menu'
import {SightingsStatsDisplay} from './sightings-stats-display'

import type {SightingsAnalysisResult} from '@/services/sightings/actions/sightings-ai-analysis'

// Import GSAP for animations
import Script from 'next/script'

const ThreeJSGlobe = dynamic(
  () => import('@/components/globes/threejs-globe').then((mod) => mod.ThreeJsGlobe),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-full flex items-center justify-center'>
        <Skeleton className='w-[400px] h-[400px] rounded-full bg-gray-800/30' />
      </div>
    ),
  }
)
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

// Set up interface props for optional initial data
interface HudUapInterfaceProps {
  initialSightings: ValidatedUAPSighting[]
  events?: any[] // Replace with proper event type when available
  analysisResults?: SightingsAnalysisResult
  initialLocations?: any
}

export function HudUapInterface({
  initialSightings,
  events = [],
  analysisResults,
  initialLocations,
}: HudUapInterfaceProps = {}) {
  const [selectedView, setSelectedView] = useState<'globe' | 'list' | 'analysis'>('globe')
  const [filteredSightings, setFilteredSightings] =
    useState<ValidatedUAPSighting[]>(initialSightings)
  const [filteredEvents, setFilteredEvents] = useState<any[]>(events)

  // Year selection state
  const currentYear = new Date().getFullYear()
  const MIN_YEAR = 1940
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [availableYears, setAvailableYears] = useState<number[]>(
    Array.from({length: currentYear - MIN_YEAR + 1}, (_, i) => currentYear - i)
  )

  // Combine sightings and events for visualization
  const combinedData = React.useMemo(() => {
    // Convert events to a compatible format for visualization
    const formattedEvents = events.map((event) => ({
      id: event.id,
      type: 'event',
      title: event.title || event.name || 'Unknown Event',
      content: event.description || '',
      location: {
        city: event.location || '',
        state: '',
        coordinates:
          event.latitude && event.longitude
            ? {lat: event.latitude, lng: event.longitude}
            : undefined,
      },
      timestamp: event.date || new Date(),
      category: event.category
        ? Array.isArray(event.category)
          ? event.category
          : [event.category]
        : [],
      confidence: 'high',
      sourceUrl: '',
      mediaUrls: [],
    }))

    return [...filteredSightings, ...formattedEvents]
  }, [filteredSightings, events])

  // Initialize filters and data
  useEffect(() => {
    setFilteredSightings(initialSightings)
    setFilteredEvents(events)

    // Extract years from initialSightings for the dropdown menu
    if (initialSightings.length > 0) {
      const years = new Set<number>()
      initialSightings.forEach((sighting) => {
        const year = new Date(sighting.timestamp).getFullYear()
        if (year >= MIN_YEAR && year <= currentYear) {
          years.add(year)
        }
      })

      // If we have specific years from the data, use them
      if (years.size > 0) {
        setAvailableYears(Array.from(years).sort((a, b) => b - a)) // Descending order
      }
    }
  }, [initialSightings, events, MIN_YEAR, currentYear])

  // Function to filter data by selected year
  const filterByYear = useCallback(
    (year: number) => {
      setSelectedYear(year)

      const yearStart = new Date(`${year}-01-01T00:00:00.000Z`)
      const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`)

      // Filter sightings
      const filteredByYear = initialSightings.filter((sighting) => {
        const date = new Date(sighting.timestamp)
        return date >= yearStart && date <= yearEnd
      })

      // Filter events
      const filteredEventsByYear = events.filter((event) => {
        const date = new Date(event.date || event.timestamp)
        return date >= yearStart && date <= yearEnd
      })

      setFilteredSightings(filteredByYear)
      setFilteredEvents(filteredEventsByYear)
    },
    [initialSightings, events]
  )

  // Locations data (either from hook's fetched data or initial props)
  const locationOptions = initialLocations || []
  const [focusedLocation, setFocusedLocation] = useState<{
    lat: number
    lon: number
  } | null>(null)
  const [globeType, setGlobeType] = useState<'default' | 'alternative' | 'codepen'>('default')
  const [graphPaperReady, setGraphPaperReady] = useState(false)

  const renderGlobe = () => {
    switch (globeType) {
      case 'default':
        return (
          <Globe
            focusedLocation={focusedLocation}
            sightings={filteredSightings}
            selectedYear={selectedYear}
          />
        )
      case 'alternative':
        return <AlternativeGlobe />
      case 'codepen':
        return <CodepenGlobe focusedLocation={focusedLocation} locations={locations} />
      default:
        return (
          <Globe
            focusedLocation={focusedLocation}
            sightings={filteredSightings}
            selectedYear={selectedYear}
          />
        )
    }
  }

  const renderContent = () => {
    switch (selectedView) {
      case 'globe':
        return (
          <div className='w-full h-full'>
            <ThreeJSGlobe data={combinedData} showEventMarkers={true} />
          </div>
        )
      case 'list':
        return (
          <div className='p-6 overflow-auto'>
            <h2 className='text-2xl font-bold mb-4'>Data List View</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-xl font-semibold mb-2'>
                  Sightings ({filteredSightings.length})
                </h3>
                <div className='space-y-4'>
                  {filteredSightings.slice(0, 10).map((sighting) => (
                    <div key={sighting.id} className='p-4 bg-card rounded-md'>
                      <h4 className='font-medium'>{sighting.title}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(sighting.timestamp).toLocaleDateString()}
                      </p>
                      <p className='line-clamp-2 mt-1'>{sighting.content.substring(0, 100)}...</p>
                    </div>
                  ))}
                  {filteredSightings.length > 10 && (
                    <div className='text-center text-sm text-muted-foreground'>
                      + {filteredSightings.length - 10} more sightings
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-2'>Events ({filteredEvents.length})</h3>
                <div className='space-y-4'>
                  {filteredEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className='p-4 bg-secondary/20 rounded-md'>
                      <h4 className='font-medium'>{event.title || event.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className='line-clamp-2 mt-1'>{event.description?.substring(0, 100)}...</p>
                    </div>
                  ))}
                  {filteredEvents.length > 10 && (
                    <div className='text-center text-sm text-muted-foreground'>
                      + {filteredEvents.length - 10} more events
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case 'analysis':
        return (
          <div className='p-6 overflow-auto'>
            <h2 className='text-2xl font-bold mb-4'>AI Analysis</h2>
            {analysisResults ? (
              <div className='space-y-8'>
                <div className='prose prose-invert'>
                  <p>{analysisResults.text}</p>
                </div>

                {analysisResults.geographicClusters?.length > 0 && (
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>Geographic Clusters</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {analysisResults.geographicClusters.map((cluster, i) => (
                        <div key={i} className='p-4 bg-card rounded-md'>
                          <h4 className='font-medium'>{cluster.region}</h4>
                          <p className='text-sm'>Sightings: {cluster.sightingCount}</p>
                          <p className='text-sm mt-1'>{cluster.significance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.temporalPatterns?.length > 0 && (
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>Temporal Patterns</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {analysisResults.temporalPatterns.map((pattern, i) => (
                        <div key={i} className='p-4 bg-card rounded-md'>
                          <h4 className='font-medium'>{pattern.pattern}</h4>
                          <p className='text-sm'>Timeframe: {pattern.timeframe}</p>
                          <p className='text-sm mt-1'>{pattern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.anomalies?.length > 0 && (
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>Notable Anomalies</h3>
                    <div className='space-y-4'>
                      {analysisResults.anomalies.map((anomaly, i) => (
                        <div key={i} className='p-4 bg-card rounded-md'>
                          <h4 className='font-medium'>{anomaly.description}</h4>
                          {anomaly.location && (
                            <p className='text-sm'>Location: {anomaly.location}</p>
                          )}
                          {anomaly.date && <p className='text-sm'>Date: {anomaly.date}</p>}
                          <p className='text-sm mt-1'>Significance: {anomaly.significance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center text-muted-foreground'>
                Analysis not available. Enable AI analysis in environment variables.
              </div>
            )}
          </div>
        )
      default:
        return <div>Select a view</div>
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

            <TechSection title='SYSTEM CONTROL' className='flex-1'>
              <div className='p2 relative flex flex-col h-full'>
                <Card className='bg-black border-white/20 p-3 relative'>
                  <div className='space-y-2'>
                    <div className='text-xs font-medium text-white/80 font-monument-mono flex justify-between'>
                      <span>SYSTEM METRICS</span>
                      <span className='text-white/40'>533235</span>
                    </div>
                    <div className='space-y-1'>
                      {[
                        {label: 'GLOBAL TEMPERATURE', value: '23.5°C'},
                        {label: 'ATMOSPHERIC CO₂', value: '417ppm'},
                        {label: 'SEA LEVEL RISE', value: '+3.4mm/yr'},
                      ].map((item, i) => (
                        <div key={i} className='flex justify-between items-center'>
                          <span className='text-white/60 text-xs font-monument-mono'>
                            {item.label}
                          </span>
                          <Badge
                            variant='outline'
                            className='bg-black border-white/30 text-white text-xs font-monument-mono'>
                            {item.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className='bg-black border-white/20 p-3 relative'>
                  <div className='space-y-2'>
                    <div className='text-xs font-medium text-white/80 font-monument-mono flex justify-between'>
                      <span>ACTIVE MONITORING</span>
                      <span className='text-white/40'>387</span>
                    </div>
                    <div className='space-y-1'>
                      {[
                        {label: 'WEATHER STATIONS', value: '12,458', status: 'ACTIVE'},
                        {label: 'SATELLITES', value: '45', status: 'ONLINE'},
                        {label: 'OCEAN BUOYS', value: '3,241', status: 'SYNCING'},
                      ].map((item, i) => (
                        <div key={i} className='flex justify-between text-xs'>
                          <span className='text-white/60 font-monument-mono'>{item.label}</span>
                          <div className='flex items-center space-x-2'>
                            <span className='text-white font-monument-mono'>{item.value}</span>
                            <span className='text-xs text-white/50 font-monument-mono'>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className='bg-black border-white/20 p-3 relative'>
                  <div className='space-y-2'>
                    <div className='text-xs font-medium text-white/80 font-monument-mono flex justify-between'>
                      <span>ENVIRONMENTAL DATA</span>
                      <span className='text-white/40'>9574835251</span>
                    </div>
                    <div className='space-y-2'>
                      {[
                        {label: 'AIR QUALITY', value: 75},
                        {label: 'OCEAN HEALTH', value: 62},
                        {label: 'FOREST COVER', value: 45},
                      ].map((metric, i) => (
                        <div key={i} className='space-y-1'>
                          <div className='flex justify-between text-xs'>
                            <span className='text-white/60 font-monument-mono'>{metric.label}</span>
                            <span className='text-white font-monument-mono'>{metric.value}%</span>
                          </div>
                          <div className='h-1 bg-white/10'>
                            <div
                              className='h-full bg-white/60'
                              style={{width: `${metric.value}%`}}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Terminal added to the sidebar with proper styling */}
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
              subtitle={`SYNC RATE: 97.3% | UPLINK: ACTIVE`}>
              <div className='h-full bg-transparent'>{renderGlobe()}</div>

              {/* Year Selection Menu - top left */}
              <div className='absolute top-12 left-4 z-20 w-48'>
                <YearSelectionMenu
                  availableYears={availableYears}
                  selectedYear={selectedYear}
                  onChange={filterByYear}
                  className='w-full'
                />
              </div>

              {/* Status indicators */}
              <div className='absolute bottom-2 right-2 text-right text-xs'>
                <div className='text-white/60 font-monument-mono'>GLOBAL SCAN COMPLETE</div>
                <div className='text-white/60 font-monument-mono'>CONNECTION: SECURE</div>
                <div className='text-white/60 font-monument-mono'>MONITORING: ACTIVE</div>
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
