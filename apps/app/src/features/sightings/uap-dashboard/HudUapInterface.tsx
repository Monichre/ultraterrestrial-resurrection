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
import {Terminal} from './terminal/terminal'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {FilterPanel} from './filter-panel'
import {TimeRangeSelector} from './time-range-selector'
import {YearSelectionMenu} from './year-selection-menu'
import {SightingsStatsDisplay} from './sightings-stats-display'
import {EnhancedTimeSelector, type TimeRangeState} from './enhanced-time-selector'
import {useAnimationTimeline} from './animation-timeline-manager'
import {AnimatePresence, motion} from 'framer-motion'
import {X} from 'lucide-react'
import {calculateTopSightingLocations} from '@/features/sightings/utils/location-analysis'
import {RocketHud} from '@/features/sightings/components/rocket-telemetry-hud'
import {
  buildHudHotspots,
  buildHudMetrics,
  buildHudPositionLog,
} from '@/features/sightings/components/rocket-telemetry-hud/map-sightings-to-hud'

// Import GSAP for animations
import Script from 'next/script'
import {debugLog} from '@/utils/logger'

const ThreeJSGlobe = dynamic(
  () =>
    import('@/features/sightings/components/globes/threejs-globe').then((mod) => mod.ThreeJsGlobe),
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

// Set up interface props for optional initial data
interface HudUapInterfaceProps {
  initialSightings: ValidatedUAPSighting[]
  events?: any[] // Replace with proper event type when available
  analysisResults?: any // AI analysis result
  initialLocations?: any
}

export function HudUapInterface({
  initialSightings,
  events = [],
  analysisResults,
  initialLocations,
}: HudUapInterfaceProps) {
  debugLog('🔍 HudUapInterface - Initial Data:', {
    sightingsCount: initialSightings?.length,
    eventsCount: events?.length,
    sightingsWithCoords: initialSightings?.filter(
      (s) => s.location?.coordinates?.lat && s.location?.coordinates?.lng
    )?.length,
    sampleSighting: initialSightings?.[0],
    dateRange: {
      earliest: initialSightings?.reduce(
        (earliest, sighting) => {
          const sightingDate = new Date(sighting.timestamp)
          return !earliest || sightingDate < earliest ? sightingDate : earliest
        },
        null as Date | null
      ),
      latest: initialSightings?.reduce(
        (latest, sighting) => {
          const sightingDate = new Date(sighting.timestamp)
          return !latest || sightingDate > latest ? sightingDate : latest
        },
        null as Date | null
      ),
    },
  })

  const [selectedView, setSelectedView] = useState<'globe' | 'list' | 'analysis'>('globe')
  const [filteredSightings, setFilteredSightings] =
    useState<ValidatedUAPSighting[]>(initialSightings)
  const [filteredEvents, setFilteredEvents] = useState<any[]>(events)

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Enhanced time range state - fix date range calculation
  const currentYear = new Date().getFullYear()
  const MIN_YEAR = 1947 // Start from Roswell incident for historical context

  // Calculate actual date range from data
  const actualDateRange = React.useMemo(() => {
    if (!initialSightings || initialSightings.length === 0) {
      return {minYear: MIN_YEAR, maxYear: currentYear}
    }

    const years = initialSightings.map((s) => new Date(s.timestamp).getFullYear())
    const minYear = Math.max(Math.min(...years), MIN_YEAR)
    const maxYear = Math.min(Math.max(...years), currentYear)

    debugLog('🗓️ Calculated date range from sightings:', {
      minYear,
      maxYear,
      totalSightings: initialSightings.length,
    })

    return {minYear, maxYear}
  }, [initialSightings, MIN_YEAR, currentYear])

  const [selectedYear, setSelectedYear] = useState<number>(actualDateRange.maxYear)
  const [availableYears, setAvailableYears] = useState<number[]>(
    Array.from(
      {length: actualDateRange.maxYear - actualDateRange.minYear + 1},
      (_, i) => actualDateRange.maxYear - i
    )
  )

  // Dynamic locations based on actual sightings data
  const locations = React.useMemo(() => {
    const topLocations = calculateTopSightingLocations(filteredSightings, 12)

    debugLog('🗺️ Dynamic locations calculated:', {
      totalSightings: filteredSightings.length,
      topLocations: topLocations.map((loc) => ({name: loc.name, count: loc.count})),
    })

    // Convert to format expected by existing components
    return topLocations.map((loc) => ({
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
    }))
  }, [filteredSightings])

  // Enhanced time selector state - use broader historical range by default
  const [enhancedTimeRange, setEnhancedTimeRange] = useState<TimeRangeState>({
    startDate: new Date(1947, 0, 1), // Start from Roswell era to show more historical data
    endDate: new Date(actualDateRange.maxYear, 11, 31),
    selectedYear: actualDateRange.maxYear,
    isAnimating: false,
    animationSpeed: 1.0,
  })

  // Toggle between basic and enhanced time controls
  const [useEnhancedTimeControls, setUseEnhancedTimeControls] = useState(false)

  // Animation timeline integration
  const {
    currentAnimationDate,
    animationProgress,
    visibleData: animatedVisibleData,
    handleTimeSliceChange,
    handleAnimationProgress,
    AnimationTimelineManager,
  } = useAnimationTimeline(enhancedTimeRange, initialSightings, events)

  // Use animated data when animation is active, otherwise use filtered data
  const currentSightings = enhancedTimeRange.isAnimating
    ? animatedVisibleData.sightings
    : filteredSightings
  const currentEvents = enhancedTimeRange.isAnimating ? animatedVisibleData.events : filteredEvents

  // Combine sightings and events for visualization
  const combinedData = React.useMemo(() => {
    // Convert events to a compatible format for visualization
    const formattedEvents = currentEvents.map((event) => ({
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

    return [...currentSightings, ...formattedEvents]
  }, [currentSightings, currentEvents])

  // Initialize filters and data
  useEffect(() => {
    setFilteredSightings(initialSightings)
    setFilteredEvents(events)

    // Extract years from initialSightings for the dropdown menu
    if (initialSightings.length > 0) {
      const years = new Set<number>()
      initialSightings.forEach((sighting) => {
        const year = new Date(sighting.timestamp).getFullYear()
        if (year >= actualDateRange.minYear && year <= actualDateRange.maxYear) {
          years.add(year)
        }
      })

      // If we have specific years from the data, use them
      if (years.size > 0) {
        const sortedYears = Array.from(years).sort((a, b) => b - a) // Descending order
        setAvailableYears(sortedYears)
        debugLog('📅 Available years from data:', sortedYears)
      }
    }
  }, [initialSightings, events, actualDateRange.minYear, actualDateRange.maxYear])

  // Enhanced filter function using date ranges
  const filterByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      // Filter sightings
      const filteredByRange = initialSightings.filter((sighting) => {
        const date = new Date(sighting.timestamp)
        return date >= startDate && date <= endDate
      })

      // Filter events
      const filteredEventsByRange = events.filter((event) => {
        const date = new Date(event.date || event.timestamp)
        return date >= startDate && date <= endDate
      })

      setFilteredSightings(filteredByRange)
      setFilteredEvents(filteredEventsByRange)

      // Update legacy year selection for backward compatibility
      setSelectedYear(endDate.getFullYear())
    },
    [initialSightings, events]
  )

  // Handle enhanced time range changes
  const handleEnhancedTimeRangeChange = useCallback(
    (newTimeRange: TimeRangeState) => {
      setEnhancedTimeRange(newTimeRange)
      filterByDateRange(newTimeRange.startDate, newTimeRange.endDate)
    },
    [filterByDateRange]
  )

  // Function to filter data by selected year (legacy support)
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

      // Update enhanced time range for consistency
      setEnhancedTimeRange((prev) => ({
        ...prev,
        startDate: yearStart,
        endDate: yearEnd,
        selectedYear: year,
      }))
    },
    [initialSightings, events]
  )

  // Locations data (either from hook's fetched data or initial props)
  const locationOptions = initialLocations || []
  const [focusedLocation, setFocusedLocation] = useState<{
    lat: number
    lon: number
  } | null>(null)
  const [globeType, setGlobeType] = useState<'telemetry' | 'default' | 'alternative' | 'codepen'>(
    'telemetry'
  )
  const [graphPaperReady, setGraphPaperReady] = useState(false)

  const renderGlobeInner = () => {
    switch (globeType) {
      case 'telemetry':
      case 'default':
        return (
          <Globe
            focusedLocation={focusedLocation}
            sightings={currentSightings}
            selectedYear={
              enhancedTimeRange.isAnimating ? currentAnimationDate.getFullYear() : selectedYear
            }
          />
        )
      case 'alternative':
        return <AlternativeGlobe />
      case 'codepen':
        return <CodepenGlobe focusedLocation={focusedLocation} locations={locations} />
      default: {
        const _exhaustive: never = globeType
        return _exhaustive
      }
    }
  }

  const renderGlobe = () => {
    const globe = renderGlobeInner()
    if (globeType !== 'telemetry') return globe

    const activeYear = enhancedTimeRange.isAnimating
      ? currentAnimationDate.getFullYear()
      : selectedYear
    const topLocations = calculateTopSightingLocations(currentSightings, 8)
    const activeHotspotName =
      focusedLocation == null
        ? null
        : (topLocations
            .find((loc) => loc.lat === focusedLocation.lat && loc.lon === focusedLocation.lon)
            ?.name.toUpperCase() ?? null)

    return (
      <RocketHud
        fill='parent'
        identityLabel='UAP-SCAN-01'
        metrics={buildHudMetrics(currentSightings, activeYear)}
        hotspots={buildHudHotspots(topLocations)}
        positionLog={buildHudPositionLog(currentSightings)}
        activeHotspotName={activeHotspotName}
        onHotspotFocus={(hotspot) => {
          if (!hotspot) {
            setFocusedLocation(null)
            return
          }
          setFocusedLocation({lat: hotspot.lat, lon: hotspot.lon})
        }}
        showSaturnFocus={false}
        showBottomAxis
        center={<div className='h-full w-full min-h-0'>{globe}</div>}
        centerOverlay={
          <div className='absolute left-3 top-3 z-20 w-48'>
            {useEnhancedTimeControls ? (
              <EnhancedTimeSelector
                timeRange={enhancedTimeRange}
                onChange={handleEnhancedTimeRangeChange}
                onDateRangeChange={filterByDateRange}
                className='w-full max-w-sm'
                sightingsData={filteredSightings.map((s) => ({
                  timestamp: new Date(s.timestamp),
                }))}
                showAnimation={true}
              />
            ) : (
              <YearSelectionMenu
                availableYears={availableYears}
                selectedYear={selectedYear}
                onChange={filterByYear}
                className='w-full'
              />
            )}
            <Button
              variant='outline'
              size='sm'
              className='mt-2 h-7 w-full border-hud-border bg-black/80 font-mono text-[10px] uppercase tracking-[0.12em] text-hud-text-primary hover:border-hud-accent hover:bg-black'
              onClick={() => setUseEnhancedTimeControls(!useEnhancedTimeControls)}>
              {useEnhancedTimeControls ? 'Basic year' : 'Enhanced time'}
            </Button>
          </div>
        }
      />
    )
  }

  // Build individual sighting points for globe visualization - CRITICAL FIX
  const globePositions = React.useMemo(() => {
    debugLog('🌍 Building globe positions from:', {
      currentSightingsCount: currentSightings.length,
      currentEventsCount: currentEvents.length,
    })

    // Create individual point data for sightings and events
    const sightingPoints = currentSightings
      .filter((s) => {
        const coords = s.location?.coordinates
        const hasValidCoords =
          coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
        if (!hasValidCoords) {
          debugLog('⚠️ Sighting missing valid coordinates:', s.id, coords)
        }
        return hasValidCoords
      })
      .map((sighting, index) => ({
        order: index + 1,
        startLat: sighting.location!.coordinates!.lat,
        startLng: sighting.location!.coordinates!.lng,
        endLat: sighting.location!.coordinates!.lat, // Same as start for individual points
        endLng: sighting.location!.coordinates!.lng, // Same as start for individual points
        arcAlt: 0.0, // No arc altitude for points - this is key for point rendering
        color: '#00ff88', // Bright green for sightings
        id: sighting.id,
        title: sighting.title || 'UAP Sighting',
        type: 'sighting',
        timestamp: sighting.timestamp,
      }))

    // Add event points with different color
    const eventPoints = currentEvents
      .filter((e) => {
        const hasValidCoords = typeof e.latitude === 'number' && typeof e.longitude === 'number'
        if (!hasValidCoords) {
          debugLog('⚠️ Event missing valid coordinates:', e.id, {
            lat: e.latitude,
            lng: e.longitude,
          })
        }
        return hasValidCoords
      })
      .map((event, index) => ({
        order: sightingPoints.length + index + 1,
        startLat: event.latitude,
        startLng: event.longitude,
        endLat: event.latitude, // Same as start for individual points
        endLng: event.longitude, // Same as start for individual points
        arcAlt: 0.0, // No arc altitude for points
        color: '#ff6b35', // Orange for events
        id: event.id,
        title: event.title || event.name || 'Event',
        type: 'event',
        timestamp: event.date || event.timestamp,
      }))

    // Combine all points
    const allPoints = [...sightingPoints, ...eventPoints]
    debugLog('🎯 Globe positions created:', {
      sightingPoints: sightingPoints.length,
      eventPoints: eventPoints.length,
      totalPoints: allPoints.length,
      samplePoint: allPoints[0],
    })

    return allPoints
  }, [currentSightings, currentEvents])

  const renderContent = () => {
    switch (selectedView) {
      case 'globe':
        return (
          <div className='w-full h-full'>
            <ThreeJSGlobe
              globeConfig={{
                globeColor: '#090a10',
                atmosphereColor: '#ffffff',
                polygonColor: 'rgba(255,255,255,0.1)',
                ambientLight: '#ffffff',
                directionalLeftLight: '#ffffff',
                directionalTopLight: '#bbbbbb',
                pointLight: '#ffffff',
                pointSize: 4, // Make points more visible
                showAtmosphere: true,
                atmosphereAltitude: 0.15,
              }}
              data={globePositions}
            />
          </div>
        )
      case 'list':
        return (
          <div className='p-6 overflow-auto'>
            <h2 className='text-2xl font-bold mb-4'>Data List View</h2>
            {/* Animation status indicator */}
            {enhancedTimeRange.isAnimating && (
              <div className='mb-4 p-2 bg-cyan-900/20 border border-cyan-500/30 rounded'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-cyan-400 font-monument-mono'>
                    🎬 ANIMATING: {currentAnimationDate.toDateString()}
                  </span>
                  <span className='text-white/60'>
                    Progress: {Math.round(animationProgress * 100)}%
                  </span>
                </div>
              </div>
            )}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-xl font-semibold mb-2'>
                  Sightings ({currentSightings.length})
                </h3>
                <div className='space-y-4'>
                  {currentSightings.slice(0, 10).map((sighting) => (
                    <div key={sighting.id} className='p-4 bg-card rounded-md'>
                      <h4 className='font-medium'>{sighting.title}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(sighting.timestamp).toLocaleDateString()}
                      </p>
                      <p className='line-clamp-2 mt-1'>{sighting.content.substring(0, 100)}...</p>
                    </div>
                  ))}
                  {currentSightings.length > 10 && (
                    <div className='text-center text-sm text-muted-foreground'>
                      + {currentSightings.length - 10} more sightings
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-2'>Events ({currentEvents.length})</h3>
                <div className='space-y-4'>
                  {currentEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className='p-4 bg-secondary/20 rounded-md'>
                      <h4 className='font-medium'>{event.title || event.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className='line-clamp-2 mt-1'>{event.description?.substring(0, 100)}...</p>
                    </div>
                  ))}
                  {currentEvents.length > 10 && (
                    <div className='text-center text-sm text-muted-foreground'>
                      + {currentEvents.length - 10} more events
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
      <main className='min-h-screen text-white font-monument-mono relative z-10 bg-black'>
        {/* GraphPaperBackground will now be behind all content */}
        <GraphPaperBackground onReady={() => setGraphPaperReady(true)} />

        {/* Animation Timeline Manager - handles temporal data animation */}
        <AnimationTimelineManager />

        {/* Content that appears after graph paper is ready */}
        <div
          className={`relative h-screen w-full z-10 transition-opacity duration-1000 ${
            graphPaperReady ? 'opacity-100' : 'opacity-0'
          }`}>
          {/* Floating Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='fixed top-4 left-4 z-50 p-3 bg-black/80 backdrop-blur border border-white/20 rounded-lg hover:bg-black/90 transition-all'
            style={{backdropFilter: 'blur(8px)'}}>
            <div className='flex flex-col items-center gap-1'>
              <div className='text-xs font-monument-mono text-white/90'>CTRL</div>
              <div
                className={`w-4 h-0.5 bg-white/60 transition-transform ${sidebarOpen ? 'rotate-45' : ''}`}></div>
              <div
                className={`w-4 h-0.5 bg-white/60 transition-transform ${sidebarOpen ? '-rotate-45 -mt-0.5' : ''}`}></div>
            </div>
          </button>

          {/* Floating Sidebar Panel */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{x: -100, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                exit={{x: -100, opacity: 0}}
                transition={{type: 'spring', stiffness: 300, damping: 30}}
                className='fixed top-0 left-0 w-80 h-full z-40 bg-black/90 backdrop-blur-xl border-r border-white/20'
                style={{backdropFilter: 'blur(16px)'}}>
                {/* Header */}
                <div className='border border-white/20 p-3 flex justify-between items-center'>
                  <h1 className='text-lg tracking-wider uppercase font-monument-mono'>
                    ULTRATERRESTRIAL
                  </h1>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className='text-white/60 hover:text-white/90 transition-colors'>
                    <X className='w-4 h-4' />
                  </button>
                </div>

                {/* Sidebar Content */}
                <div className='p-3 h-[calc(100%-4rem)] overflow-y-auto'>
                  <TechSection title='SYSTEM CONTROL' className='mb-4'>
                    <div className='space-y-3'>
                      <Card className='bg-black/50 border-white/20 p-3'>
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

                      <Card className='bg-black/50 border-white/20 p-3'>
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
                                <span className='text-white/60 font-monument-mono'>
                                  {item.label}
                                </span>
                                <div className='flex items-center space-x-2'>
                                  <span className='text-white font-monument-mono'>
                                    {item.value}
                                  </span>
                                  <span className='text-xs text-white/50 font-monument-mono'>
                                    {item.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>

                      <Card className='bg-black/50 border-white/20 p-3'>
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
                                  <span className='text-white/60 font-monument-mono'>
                                    {metric.label}
                                  </span>
                                  <span className='text-white font-monument-mono'>
                                    {metric.value}%
                                  </span>
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

                      {/* Terminal in sidebar */}
                      <Card className='bg-black/50 border-white/20 p-3'>
                        <div className='border-b border-white/20 p-1 mb-2'>
                          <div className='text-xs font-medium text-white/80 font-monument-mono'>
                            SYSTEM TERMINAL
                          </div>
                        </div>
                        <Terminal
                          metrics={{
                            totalSightings: currentSightings.length,
                            eventsCount: currentEvents.length,
                            topShape: (() => {
                              const counts: Record<string, number> = {}
                              currentSightings.forEach((s) => {
                                const shapes = Array.isArray(s.category)
                                  ? s.category
                                  : s.category
                                    ? [s.category]
                                    : []
                                shapes.forEach((sh) => {
                                  counts[sh] = (counts[sh] || 0) + 1
                                })
                              })
                              const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
                              return top?.[0]
                            })(),
                            topCity: (() => {
                              const counts: Record<string, number> = {}
                              currentSightings.forEach((s) => {
                                const city = s.location?.city
                                if (city) counts[city] = (counts[city] || 0) + 1
                              })
                              const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
                              return top?.[0]
                            })(),
                            latestSightingISO: (() => {
                              const latest = [...currentSightings]
                                .filter(
                                  (s) =>
                                    s &&
                                    s.timestamp &&
                                    !isNaN(new Date(s.timestamp as any).getTime())
                                )
                                .sort(
                                  (a, b) =>
                                    new Date(b.timestamp as any).getTime() -
                                    new Date(a.timestamp as any).getTime()
                                )[0]
                              return latest
                                ? new Date(latest.timestamp as any).toISOString()
                                : undefined
                            })(),
                            timeRange: enhancedTimeRange.isAnimating
                              ? {
                                  selectedYear: currentAnimationDate.getFullYear(),
                                }
                              : {selectedYear},
                          }}
                          status={enhancedTimeRange.isAnimating ? 'ACTIVE' : 'ACTIVE'}
                          progress={enhancedTimeRange.isAnimating ? animationProgress * 100 : 100}
                        />
                      </Card>

                      {/* Globe Selection in sidebar */}
                      <div className='border border-white/20 p-3 rounded'>
                        <div className='text-xs font-medium text-white/80 font-monument-mono flex justify-between mb-2'>
                          <span>GLOBE SELECTION</span>
                          <span className='text-white/40'>
                            00
                            {globeType === 'telemetry'
                              ? '0'
                              : globeType === 'default'
                                ? '1'
                                : globeType === 'alternative'
                                  ? '2'
                                  : '3'}
                          </span>
                        </div>
                        <div className='grid grid-cols-1 gap-2'>
                          <Button
                            variant='outline'
                            className={`bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs h-8 ${
                              globeType === 'telemetry' ? 'bg-white/10' : ''
                            }`}
                            onClick={() => setGlobeType('telemetry')}>
                            TELEMETRY HUD
                          </Button>
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
                  </TechSection>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area - Full Screen with minimal top HUD */}
          <div className='w-full h-full flex flex-col'>
            {/* Minimized Space HUD - Top strip */}
            {/* <div className='h-16 w-full border-b border-white/20 bg-black/40 backdrop-blur'>
              <TechSection title='ORBITAL MONITORING' className='h-full p-2'>
                <div className='h-full flex items-center justify-center'>
                  <div className='text-xs text-white/60 font-monument-mono'>
                    SYNC RATE: 97.3% | UPLINK: ACTIVE | STATUS: MONITORING
                  </div>
                </div>
              </TechSection>
            </div> */}

            {/* Globe Section - Takes remaining space */}
            <div className='flex-1 relative min-h-0'>
              {globeType === 'telemetry' ? (
                <div className='h-full min-h-0 bg-black'>{renderGlobe()}</div>
              ) : (
                <TechSection
                  title='GLOBAL MONITORING SYSTEM'
                  subtitle={`SYNC RATE: 97.3% | UPLINK: ACTIVE`}
                  className='h-full'>
                  <div className='h-full bg-transparent'>{renderGlobe()}</div>

                  {/* Year Selection Menu - top left */}
                  <div className='absolute top-12 left-4 z-20 w-48'>
                    {useEnhancedTimeControls ? (
                      <EnhancedTimeSelector
                        timeRange={enhancedTimeRange}
                        onChange={handleEnhancedTimeRangeChange}
                        onDateRangeChange={filterByDateRange}
                        className='w-full max-w-sm'
                        sightingsData={filteredSightings.map((s) => ({
                          timestamp: new Date(s.timestamp),
                        }))}
                        showAnimation={true}
                      />
                    ) : (
                      <YearSelectionMenu
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        onChange={filterByYear}
                        className='w-full'
                      />
                    )}
                  </div>

                  {/* Time Control Toggle - top right */}
                  <div className='absolute top-12 right-4 z-20'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 bg-black/80 backdrop-blur border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs'
                      onClick={() => setUseEnhancedTimeControls(!useEnhancedTimeControls)}>
                      {useEnhancedTimeControls ? 'Enhanced' : 'Basic'}
                    </Button>
                  </div>

                  {/* Locations list - right side, smaller */}
                  <div className='absolute right-4 top-1/2 transform -translate-y-1/2 z-10'>
                    <Card className='bg-black/80 backdrop-blur border-white/20 p-2 max-h-[200px] overflow-y-auto w-40'>
                      <div className='text-xs font-medium text-white/80 font-monument-mono flex justify-between mb-2'>
                        <span>TOP HOTSPOTS</span>
                        <span className='text-white/40'>{locations.length}</span>
                      </div>
                      <div className='space-y-1'>
                        {calculateTopSightingLocations(filteredSightings, 8).map((location, i) => (
                          <div
                            key={i}
                            className='text-xs text-white/60 hover:text-white cursor-pointer transition-colors font-monument-mono'
                            onMouseEnter={() =>
                              setFocusedLocation({lat: location.lat, lon: location.lon})
                            }
                            onMouseLeave={() => setFocusedLocation(null)}
                            title={`${location.name} - ${location.count > 0 ? location.count + ' sightings' : 'No data-based sightings'}`}>
                            <div className='flex justify-between items-center w-full'>
                              <span className='truncate flex-1 mr-2'>{location.name}</span>
                              <span
                                className={`font-medium text-xs ${
                                  location.count > 0 ? 'text-cyan-400' : 'text-white/30'
                                }`}>
                                {location.count > 0 ? location.count : '—'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Status indicators - bottom right */}
                  <div className='absolute bottom-4 right-4 text-right text-xs bg-black/60 backdrop-blur p-2 rounded border border-white/20'>
                    <div className='text-white/60 font-monument-mono'>GLOBAL SCAN COMPLETE</div>
                    <div className='text-white/60 font-monument-mono'>CONNECTION: SECURE</div>
                    <div className='text-white/60 font-monument-mono'>MONITORING: ACTIVE</div>
                  </div>
                </TechSection>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
