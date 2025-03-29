'use client'

import {useState, useMemo} from 'react'
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

// Initialize MapGL with access token
const MapGL = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN || '',
})

// Main component for the 3D Sightings Globe visualization
export const SightingsGlobe = ({geoJSONSightings}: SightingsGlobeProps) => {
  // Extract initial sightings data from props
  const {sightings: initialSightings, militaryBases, ufoPosts} = geoJSONSightings

  // State for data handling
  const [isLoadingExternalData, setIsLoadingExternalData] = useState(false)
  const [isExternalDataLoaded, setIsExternalDataLoaded] = useState(false)
  const [useExtData, setUseExtData] = useState(true)

  // Use the time series animation hook
  const {year, month, isAnimating, startAnimation, stopAnimation, timeRange, setTimeRange} =
    useTimeSeriesAnimation()

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

  // Map configuration
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    zoom: [3] as [number],
    center: [-98.5795, 39.8283] as [number, number],
    pitch: [45] as [number],
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

  // Show loading indicator when fetching external data
  if (isLoadingExternalData) {
    return (
      <div className='h-screen w-screen relative flex items-center justify-center bg-gray-900'>
        <div className='text-white font-monumentMono text-xl p-4 bg-black bg-opacity-70 rounded-lg'>
          <div className='mb-2'>Loading sightings data...</div>
          <div className='h-1 w-full bg-gray-700 rounded-full overflow-hidden'>
            <div className='h-full bg-cyan-500 animate-pulse' style={{width: '60%'}} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen w-screen relative'>
      <MapGL
        ref={mapRef}
        style={'mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9'}
        containerStyle={{height: '100vh', width: '100vw'}}
        {...mapConfig}
        renderChildrenInPortal={true}>
        {/* Navigation controls */}
        <ZoomControl position='top-left' />

        {/* Add deck.gl overlay for advanced visualizations */}
        {(visualizationMode === 'heatmap' ||
          visualizationMode === 'hexagon' ||
          visualizationMode === 'scatter' ||
          visualizationMode === 'arcs' ||
          visualizationMode === 'both') &&
          filteredSightings &&
          mapLoaded && <DeckGLOverlay layers={deckLayers} />}

        {/* Fallback for sightings layer if deck.gl isn't used for some reason */}
        {visualizationMode !== 'native' &&
          visualizationMode !== 'tileset' &&
          !['heatmap', 'hexagon', 'scatter', 'arcs', 'both'].includes(visualizationMode) &&
          filteredSightings && (
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
          )}

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
            {militaryBases.features.map((feature: any, index: number) => (
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

        {/* UFO posts layer */}
        {showUFOPosts && ufoPosts && (
          <Layer
            type='circle'
            id='ufo-posts-layer'
            paint={{
              'circle-radius': 5,
              'circle-color': '#8000ff',
              'circle-opacity': 0.7,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff',
            }}>
            {ufoPosts.features.map((feature: any, index: number) => (
              <Feature
                key={`post-${feature.properties.id || index}`}
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
          <Popup
            coordinates={popupInfo.coordinates}
            offset={[0, -15]}
            onClick={() => setPopupInfo(null)}>
            <div className='p-2 max-w-md bg-black bg-opacity-80 text-white rounded-md border border-cyan-500/30 relative'>
              {/* Special highlight for significant events */}
              {currentHighlightedEvent &&
              popupInfo.properties.id === currentHighlightedEvent.properties.id ? (
                <div className='absolute -top-2 -left-2 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded'>
                  Major Event
                </div>
              ) : null}

              <h3 className='text-lg font-bold mb-1 text-cyan-400'>
                {popupInfo.properties.city || popupInfo.properties.location || 'Unknown location'}
              </h3>

              {/* Date and time with shape if available */}
              <div className='flex justify-between items-center mb-2'>
                <p className='text-sm'>
                  {formatDate(popupInfo.properties.date || popupInfo.properties.timestamp)}
                </p>
                {popupInfo.properties.shape && (
                  <span className='text-xs px-2 py-0.5 bg-gray-700 rounded-full'>
                    {popupInfo.properties.shape}
                  </span>
                )}
              </div>

              {/* Duration if available */}
              {popupInfo.properties.duration_hours_min && (
                <p className='text-xs mb-2 text-cyan-300'>
                  Duration: {popupInfo.properties.duration_hours_min}
                </p>
              )}

              {/* Main description */}
              <p className='text-sm'>
                {popupInfo.properties.description ||
                  popupInfo.properties.comments ||
                  'No description available'}
              </p>

              {/* Footer with source and metadata */}
              <div className='mt-2 pt-2 border-t border-gray-700 flex justify-between items-end'>
                {popupInfo.properties.sourceUrl && (
                  <a
                    href={popupInfo.properties.sourceUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-cyan-400 underline inline-block'>
                    Source
                  </a>
                )}

                {/* Reported date if different from event date */}
                {popupInfo.properties.reported_date && (
                  <span className='text-xs text-gray-400'>
                    Reported: {popupInfo.properties.reported_date}
                  </span>
                )}
              </div>

              {/* Media indicators */}
              {(popupInfo.properties.video || popupInfo.properties.image) && (
                <div className='mt-2 flex gap-2'>
                  {popupInfo.properties.image && (
                    <span className='text-xs bg-indigo-800 px-2 py-0.5 rounded'>📷 Photo</span>
                  )}
                  {popupInfo.properties.video && (
                    <span className='text-xs bg-red-800 px-2 py-0.5 rounded'>🎥 Video</span>
                  )}
                </div>
              )}
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Controls panel for visualization options */}
      <div className='absolute bottom-4 left-4 p-4 bg-black bg-opacity-70 text-white rounded-lg z-10 font-monumentMono'>
        <h3 className='text-lg mb-3 font-bold text-cyan-400'>Visualization Options</h3>

        <div className='mb-3'>
          <label htmlFor='displayMode' className='block mb-1'>
            Display Mode
          </label>
          <div id='displayMode' className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('native')
                setUseTileset(false)
                // Clear any popup info when changing visualization mode
                setPopupInfo(null)
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'native' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Mapbox Clusters
            </button>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('tileset')
                setUseTileset(true)
                setPopupInfo(null)
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'tileset' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Mapbox Tileset
            </button>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('heatmap')
                setUseTileset(false)
                setPopupInfo(null)
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'heatmap' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Heatmap
            </button>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('hexagon')
                setUseTileset(false)
                setPopupInfo(null)
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'hexagon' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              3D Clusters
            </button>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('scatter')
                setUseTileset(false)
                setPopupInfo(null)
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'scatter' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Points
            </button>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('arcs')
                setUseTileset(false)
                setPopupInfo(null)
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'arcs' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Connections
            </button>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('both')
                setUseTileset(false)
                setPopupInfo(null)
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'both' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Combined
            </button>
          </div>
        </div>

        {/* Visualization Layers */}
        <div className='mb-3'>
          <label htmlFor='layersControl' className='block mb-1'>
            Layers
          </label>
          <div id='layersControl' className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => setShowMilitaryBases(!showMilitaryBases)}
              className={`px-3 py-1 rounded ${
                showMilitaryBases ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Military Bases
            </button>
            <button
              type='button'
              onClick={() => setShowUFOPosts(!showUFOPosts)}
              className={`px-3 py-1 rounded ${
                showUFOPosts ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              UFO Posts
            </button>

            {isExternalDataLoaded && (
              <button
                type='button'
                onClick={isAnimating ? stopAnimation : startAnimation}
                className={`px-3 py-1 rounded ${
                  isAnimating ? 'bg-red-500 text-black' : 'bg-green-600'
                }`}>
                {isAnimating ? 'Stop Animation' : 'Start Time Animation'}
              </button>
            )}

            {isAnimating && (
              <div className='px-3 py-1 rounded bg-gray-800 text-cyan-300 flex gap-2 items-center'>
                <span>Speed:</span>
                <select
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number.parseInt(e.target.value))}
                  className='bg-gray-900 text-white rounded'>
                  <option value='250'>4x</option>
                  <option value='500'>2x</option>
                  <option value='1000'>1x</option>
                  <option value='2000'>0.5x</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Filtering Controls */}
        <div className='mb-3'>
          <div className='flex justify-between items-center'>
            <label className='block mb-1'>Filters</label>
            <button
              type='button'
              onClick={() =>
                setFilters({
                  shape: '',
                  duration: 0,
                  country: '',
                  state: '',
                  isSignificantEvent: false,
                })
              }
              className='text-xs text-cyan-400 hover:text-cyan-300'>
              Reset
            </button>
          </div>

          <div className='flex flex-wrap gap-2 mb-2'>
            {/* Significant Events Toggle */}
            <button
              type='button'
              onClick={() =>
                setFilters({
                  ...filters,
                  isSignificantEvent: !filters.isSignificantEvent,
                })
              }
              className={`px-3 py-1 rounded ${
                filters.isSignificantEvent ? 'bg-yellow-500 text-black' : 'bg-gray-700'
              }`}>
              {filters.isSignificantEvent ? 'Major Events Only' : 'All Sightings'}
            </button>

            {/* Shape Filter - Common shapes dropdown */}
            <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
              <span className='text-sm'>Shape:</span>
              <select
                value={filters.shape}
                onChange={(e) => setFilters({...filters, shape: e.target.value})}
                className='bg-gray-900 text-white rounded text-sm py-0'>
                <option value=''>Any</option>
                <option value='cylinder'>Cylinder</option>
                <option value='triangle'>Triangle</option>
                <option value='circle'>Circle</option>
                <option value='disc'>Disc</option>
                <option value='oval'>Oval</option>
                <option value='sphere'>Sphere</option>
                <option value='cigar'>Cigar</option>
                <option value='formation'>Formation</option>
                <option value='light'>Light</option>
                <option value='other'>Other</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
              <span className='text-sm'>Min Duration:</span>
              <select
                value={filters.duration}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    duration: Number.parseInt(e.target.value),
                  })
                }
                className='bg-gray-900 text-white rounded text-sm py-0'>
                <option value='0'>Any</option>
                <option value='60'>1+ min</option>
                <option value='300'>5+ mins</option>
                <option value='600'>10+ mins</option>
                <option value='1800'>30+ mins</option>
                <option value='3600'>1+ hour</option>
              </select>
            </div>
          </div>

          {/* Location Filters */}
          <div className='flex flex-wrap gap-2'>
            {/* Country Filter */}
            <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
              <span className='text-sm'>Country:</span>
              <select
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className='bg-gray-900 text-white rounded text-sm py-0'>
                <option value=''>Any</option>
                <option value='us'>United States</option>
                <option value='ca'>Canada</option>
                <option value='gb'>United Kingdom</option>
                <option value='au'>Australia</option>
              </select>
            </div>

            {/* State Filter - show only if US is selected */}
            {filters.country === 'us' && (
              <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
                <span className='text-sm'>State:</span>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({...filters, state: e.target.value})}
                  className='bg-gray-900 text-white rounded text-sm py-0'>
                  <option value=''>Any</option>
                  <option value='ca'>California</option>
                  <option value='tx'>Texas</option>
                  <option value='nv'>Nevada</option>
                  <option value='az'>Arizona</option>
                  <option value='nm'>New Mexico</option>
                  <option value='wa'>Washington</option>
                  <option value='or'>Oregon</option>
                  <option value='fl'>Florida</option>
                  <option value='ny'>New York</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className='mb-3'>
          <label htmlFor='timeRange1' className='block mb-1'>
            Time Period: {formatDate(timeRange[0])} - {formatDate(timeRange[1])}
          </label>
          <input
            id='timeRange1'
            type='range'
            min={new Date('1940-01-01').getTime()}
            max={new Date().getTime()}
            value={timeRange[0]}
            onChange={(e) => setTimeRange([Number.parseInt(e.target.value), timeRange[1]])}
            className='w-full mb-2'
          />
          <input
            id='timeRange2'
            type='range'
            min={new Date('1940-01-01').getTime()}
            max={new Date().getTime()}
            value={timeRange[1]}
            onChange={(e) => setTimeRange([timeRange[0], Number.parseInt(e.target.value)])}
            className='w-full'
          />
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => getUserLocation(mapConfig, setMapConfig)}
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Go to My Location
          </button>

          {/* Example locations for demo purposes */}
          <button
            type='button'
            onClick={() => flyToLocation(-112.074, 33.4484, 8, mapConfig, setMapConfig)}
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Phoenix Lights
          </button>
          <button
            type='button'
            onClick={() => flyToLocation(-104.523, 33.3943, 8, mapConfig, setMapConfig)}
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Roswell
          </button>
          <button
            type='button'
            onClick={() => {
              setVisualizationMode('native')
              setMapConfig({
                center: [-98.5795, 39.8283] as [number, number],
                zoom: [3] as [number],
                pitch: [45] as [number],
              })
            }}
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Reset View
          </button>
        </div>
      </div>

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

        {/* Data source info */}
        {useExtData && (
          <p className='text-sm text-cyan-300 mt-2'>
            Using {sightings?.features?.length || 0} sightings from external data
          </p>
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
    </div>
  )
}
