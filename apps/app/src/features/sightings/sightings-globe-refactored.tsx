'use client'

import {useState, useMemo, useEffect, useRef} from 'react'
import ReactMapboxGl, {Layer, Feature, Popup, ZoomControl} from 'react-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type {
  SightingsGlobeProps,
  GeoJSONFeature,
  FeatureInfo,
  FilterOptions,
  MapConfig,
} from './types'
import {DeckGLOverlay} from './components/deck-gl-overlay'
import {useMapInitialization} from './hooks/use-map-initialization'
import {useVisualizationLayers} from './hooks/use-visualization-layers'
import {useTimeSeriesAnimation} from './useTimeSeriesAnimation'
import {useFilterWithBatching} from './use-batched-processing'
import {
  isSignificantEvent,
  filterFeature,
  findSignificantEventsInTimeWindow,
} from './utils/sighting-filters'
import {flyToLocation, getUserLocation, formatDate} from './utils/map-utils'
import {SightingsTimeSeries} from '@/features/sightings/components/sightings-timeseries/SightingsTimeSeries'
import {MapPopup} from './components/MapPopup'

// Initialize MapGL with access token
const MapGL = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN || '',
})

// Main component for the 3D Sightings Globe visualization
export const SightingsGlobeRefactored = ({geoJSONSightings}: SightingsGlobeProps) => {
  // Extract initial sightings data from props
  const {sightings: initialSightings, militaryBases, ufoPosts} = geoJSONSightings

  // Use the time series animation hook (pass an empty object as required)
  const {year, month, isAnimating, startAnimation, stopAnimation, timeRange, setTimeRange} =
    useTimeSeriesAnimation({})

  // State to hold potentially updated sightings data from external file
  const [sightings, setSightings] = useState(initialSightings)

  // Animation state
  const [animationSpeed, setAnimationSpeed] = useState(1000) // ms between animation steps
  const animationRef = useRef(null)

  // Filtering state
  const [filters, setFilters] = useState<FilterOptions>({
    shape: '', // Filter by shape (e.g., 'cylinder', 'triangle', 'disc')
    duration: 0, // Minimum duration in seconds
    country: '', // Filter by country
    state: '', // Filter by state/province
    isSignificantEvent: false, // Show only major events
  })

  // Setup batched filtering - optimizes for large datasets
  const batchedFilter = useFilterWithBatching<GeoJSONFeature>(
    (feature) => filterFeature(feature, timeRange, filters, isSignificantEvent),
    1000
  )

  // State to hold filtered results
  const [filteredFeatures, setFilteredFeatures] = useState<GeoJSONFeature[]>([])

  // Keep track of whether filtering is in progress
  const [isFiltering, setIsFiltering] = useState(false)

  // Apply filters whenever the source data or filter criteria change
  useEffect(() => {
    // Skip if no data
    if (!sightings || !sightings.features) {
      setFilteredFeatures([])
      return
    }

    // Set filtering flag for UI feedback
    setIsFiltering(true)

    // Use batched processing to avoid blocking the UI
    batchedFilter(sightings.features as GeoJSONFeature[])
      .then((results) => {
        setFilteredFeatures(results)
        setIsFiltering(false)
      })
      .catch((error) => {
        console.error('Error filtering sightings:', error)
        setIsFiltering(false)
      })
  }, [sightings, batchedFilter])

  // Construct the filtered GeoJSON object
  const filteredSightings = useMemo(() => {
    return {
      type: sightings?.type || 'FeatureCollection',
      features: filteredFeatures,
    }
  }, [sightings, filteredFeatures])

  // Map configuration: provide a default center and correct pitch type
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    zoom: [3],
    center: [0, 0],
    pitch: 45,
  })

  // State for selected feature popup
  const [popupInfo, setPopupInfo] = useState<FeatureInfo | null>(null)

  // State for hover features
  const [hoverInfo, setHoverInfo] = useState<(FeatureInfo & {x: number; y: number}) | null>(null)

  // State for visualization options
  const [visualizationMode, setVisualizationMode] = useState('heatmap') // 'heatmap', 'scatter', 'arcs', 'hexagon', 'native', 'tileset'
  const [showMilitaryBases, setShowMilitaryBases] = useState(true)
  const [showUFOPosts, setShowUFOPosts] = useState(true)
  const [arcAnimationEnabled, setArcAnimationEnabled] = useState(true)
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [useTileset, setUseTileset] = useState(false)

  // Use the map initialization hook
  const {mapRef} = useMapInitialization({
    useTileset,
    mapLoaded,
    setMapLoaded,
    setPopupInfo,
  })

  // Use the visualization layers hook
  const {buildVisualizationLayers} = useVisualizationLayers({
    filteredSightings,
    visualizationMode,
    mapLoaded,
    showMilitaryBases,
    showUFOPosts,
    arcAnimationEnabled,
    militaryBases,
    ufoPosts,
    setPopupInfo,
    setHoverInfo,
  })

  // State for tracking highlighted events
  const [currentHighlightedEvent, setCurrentHighlightedEvent] = useState<GeoJSONFeature | null>(
    null
  )

  // Handle time range change
  const handleTimeRangeChange = (newRange: [number, number]) => {
    setTimeRange(newRange)
  }

  // Build visualization layers for deck.gl
  const deckLayers = useMemo(() => buildVisualizationLayers(), [buildVisualizationLayers])

  return (
    <div className='h-screen w-screen relative'>
      <MapGL
        ref={mapRef}
        style={'mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9'}
        containerStyle={{height: '100vh', width: '100vw'}}
        {...mapConfig}>
        {/* Navigation controls */}

        <DeckGLOverlay layers={deckLayers} />
        <Layer
          type='circle'
          id='sightings-layer'
          paint={{
            'circle-radius': 6,
            'circle-color': '#ff8c00',
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'rgba(255, 255, 255, 0.5)',
          }}>
          {filteredSightings.features.map((feature: GeoJSONFeature, index: number) => (
            <Feature
              key={`sighting-${feature.properties.id || index}`}
              coordinates={feature.geometry.coordinates as [number, number]}
              onClick={() =>
                setPopupInfo({
                  coordinates: feature.geometry.coordinates as [number, number],
                  properties: feature.properties,
                })
              }
            />
          ))}
        </Layer>

        {/* Military bases layer */}
        {showMilitaryBases && militaryBases && (
          <Layer
            type='circle'
            id='military-bases-layer'
            paint={{
              'circle-radius': 8,
              'circle-color': '#0000ff',
              'circle-opacity': 0.7,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff',
            }}>
            {militaryBases.features.map((feature: GeoJSONFeature, index: number) => (
              <Feature
                key={`base-${feature.properties.id || index}`}
                coordinates={feature.geometry.coordinates as [number, number]}
                onClick={() =>
                  setPopupInfo({
                    coordinates: feature.geometry.coordinates as [number, number],
                    properties: feature.properties,
                  })
                }
              />
            ))}
          </Layer>
        )}

        {/* Popup for selected feature */}
        {popupInfo && (
          <MapPopup
            popupInfo={popupInfo}
            currentHighlightedEvent={currentHighlightedEvent}
            onClose={() => setPopupInfo(null)}
          />
        )}
      </MapGL>

      {/* Statistics panel */}
      <div className='absolute top-4 right-4 p-4 bg-black bg-opacity-70 text-white rounded-lg z-10 font-monumentMono'>
        <h3 className='text-lg mb-2 font-bold text-cyan-400'>Current View</h3>

        {/* Sightings count with filter info */}
        <div className='flex justify-between items-center'>
          <p className='text-sm'>
            {isFiltering ? (
              <span className='text-cyan-400 flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-400'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <title>Loading spinner</title>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Filtering...
              </span>
            ) : filters.isSignificantEvent ? (
              <span className='text-yellow-400'>
                Showing {filteredSightings?.features?.length || 0} major events
              </span>
            ) : (
              <span>Showing {filteredSightings?.features?.length || 0} sightings</span>
            )}
          </p>

          {/* Filter indicators */}
          {(filters.shape || filters.duration > 0 || filters.country) && (
            <div className='text-xs text-cyan-300 ml-2'>
              <span>Filtered</span>
            </div>
          )}
        </div>

        {/* Time range */}
        <p className='text-sm'>
          Time range: {formatDate(timeRange[0])} - {formatDate(timeRange[1])}
        </p>

        {/* Active filters summary */}
        {(filters.shape || filters.duration > 0 || filters.country) && (
          <div className='text-xs mt-1 border-t border-gray-700 pt-1'>
            <p className='text-cyan-400'>Active filters:</p>
            <div className='flex flex-wrap gap-1 mt-1'>
              {filters.shape && (
                <span className='px-1 py-0.5 bg-gray-800 rounded text-cyan-300'>
                  Shape: {filters.shape}
                </span>
              )}
              {filters.duration > 0 && (
                <span className='px-1 py-0.5 bg-gray-800 rounded text-cyan-300'>
                  {filters.duration >= 3600
                    ? `${filters.duration / 3600}h+`
                    : `${filters.duration / 60}m+`}
                </span>
              )}
              {filters.country && (
                <span className='px-1 py-0.5 bg-gray-800 rounded text-cyan-300'>
                  {filters.country.toUpperCase()}
                  {filters.state && `: ${filters.state.toUpperCase()}`}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Animation status */}
        {isAnimating && (
          <div className='mt-2 border-t border-cyan-800 pt-2'>
            <p className='text-sm text-yellow-400 font-bold'>Time Animation Active</p>
            <p className='text-xs'>
              Currently showing: {month}/{year}
            </p>
            <div className='w-full h-1 bg-gray-700 rounded-full mt-1 overflow-hidden'>
              <div
                className='h-full bg-yellow-500'
                style={{
                  width: `${
                    (((year - 1940) * 12 + month) / ((new Date().getFullYear() - 1940) * 12)) * 100
                  }%`,
                }}
              />
            </div>

            {/* Count significant events in current period */}
            {filteredSightings?.features && (
              <div className='mt-1 text-xs'>
                <span className='text-yellow-300'>
                  {filteredSightings.features.filter((f) => isSignificantEvent(f))?.length || 0}{' '}
                  significant events
                </span>
                {' / '}
                <span>{filteredSightings.features?.length || 0} total sightings</span>
              </div>
            )}
          </div>
        )}
      </div>
      <SightingsTimeSeries years={{start: 1940, end: 2025}} />
    </div>
  )
}
