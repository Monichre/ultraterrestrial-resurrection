// CHATGPT VERSION

// 'use client'

// import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
// import {GeoJsonLayer, HexagonLayer, HeatmapLayer, ScatterplotLayer} from 'deck.gl'
// import {MapboxOverlay} from '@deck.gl/mapbox'
// import ReactMapboxGl, {Layer, Feature, Popup, ZoomControl} from 'react-mapbox-gl'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import {format} from 'date-fns'
// import {scaleLog} from 'd3-scale'
// import AnimatedArcGroupLayer from './animated-arc-group-layer'
// import {AnimatedArcLayer} from './animated-arc-layer'

// // Initialize MapGL with access token
// const MapGL = ReactMapboxGl({
//   accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN || '',
// })

// // Path to external sightings geojson file
// const SIGHTINGS_GEOJSON_PATH = '/sightings.geojson'

// /**
//  * Custom hook: useTimeSeriesAnimation
//  *
//  * Manages the time series animation state and logic. It steps through time,
//  * finds significant events, auto-flys the map and updates pop-up information.
//  */
// function useTimeSeriesAnimation({
//   initialYear = 1940,
//   initialMonth = 0,
//   animationSpeed = 1000,
//   findSignificantEvents,
//   flyToLocation,
//   setPopupInfo,
// }: {
//   initialYear?: number
//   initialMonth?: number
//   animationSpeed?: number
//   findSignificantEvents: (start: number, end: number) => any[]
//   flyToLocation: (lng: number, lat: number, zoom?: number) => void
//   setPopupInfo: (info: any) => void
// }) {
//   const [year, setYear] = useState(initialYear)
//   const [month, setMonth] = useState(initialMonth)
//   const [isAnimating, setIsAnimating] = useState(false)
//   const animationRef = useRef<NodeJS.Timeout | null>(null)

//   const startAnimation = useCallback(() => {
//     if (isAnimating) return

//     // Reset the animation
//     setYear(initialYear)
//     setMonth(initialMonth)
//     setIsAnimating(true)

//     const animateTimeline = () => {
//       setMonth((prevMonth) => {
//         let newMonth = prevMonth + 1
//         if (newMonth > 11) {
//           newMonth = 0
//           setYear((prevYear) => {
//             const newYear = prevYear + 1
//             // Stop animation if newYear is beyond current year
//             if (newYear > new Date().getFullYear()) {
//               setIsAnimating(false)
//               return prevYear
//             }
//             return newYear
//           })
//         }
//         return newMonth
//       })

//       // Calculate new time window based on updated year and month
//       const startDate = new Date(year, month, 1)
//       const endDate = new Date(year, month + 3, 0) // 3-month window
//       const startTime = startDate.getTime()
//       const endTime = endDate.getTime()

//       // Find significant events in this time window
//       const significantEvents = findSignificantEvents(startTime, endTime)
//       if (significantEvents.length > 0) {
//         const eventToHighlight = significantEvents[0]
//         const [lng, lat] = eventToHighlight.geometry.coordinates
//         flyToLocation(lng, lat, 5)
//         setPopupInfo({
//           coordinates: [lng, lat],
//           properties: eventToHighlight.properties,
//         })
//       } else {
//         setPopupInfo(null)
//       }

//       if (isAnimating) {
//         animationRef.current = setTimeout(animateTimeline, animationSpeed)
//       }
//     }

//     animationRef.current = setTimeout(animateTimeline, animationSpeed)
//   }, [
//     isAnimating,
//     animationSpeed,
//     initialMonth,
//     initialYear,
//     month,
//     year,
//     findSignificantEvents,
//     flyToLocation,
//     setPopupInfo,
//   ])

//   const stopAnimation = useCallback(() => {
//     setIsAnimating(false)
//     setPopupInfo(null)
//     if (animationRef.current) {
//       clearTimeout(animationRef.current)
//     }
//   }, [setPopupInfo])

//   useEffect(() => {
//     return () => {
//       if (animationRef.current) clearTimeout(animationRef.current)
//     }
//   }, [])

//   return {isAnimating, year, month, startAnimation, stopAnimation}
// }

// /**
//  * Marker Component
//  *
//  * Renders an interactive map marker using Mapbox’s Feature component.
//  * When clicked, it triggers the provided onClick callback.
//  */
// const Marker = ({feature, onClick}: {feature: any; onClick: (f: any) => void}) => {
//   return (
//     <Feature
//       key={feature.properties.id || feature.properties.timestamp}
//       coordinates={feature.geometry.coordinates as [number, number]}
//       onClick={() => onClick(feature)}
//     />
//   )
// }

// /**
//  * FiltersPanel Component
//  *
//  * Renders a UI panel that lets the user adjust filters for the sightings data.
//  */
// const FiltersPanel = ({
//   filters,
//   setFilters,
// }: {
//   filters: {
//     shape: string
//     duration: number
//     country: string
//     state: string
//     isSignificantEvent: boolean
//   }
//   setFilters: (f: any) => void
// }) => {
//   const handleReset = () => {
//     setFilters({
//       shape: '',
//       duration: 0,
//       country: '',
//       state: '',
//       isSignificantEvent: false,
//     })
//   }

//   return (
//     <div className='filters-panel bg-gray-800 p-2 rounded text-white text-sm'>
//       <div className='mb-2'>
//         <button onClick={handleReset} className='underline'>
//           Reset Filters
//         </button>
//       </div>
//       <div className='flex flex-wrap gap-2'>
//         <div>
//           <label>Shape:</label>
//           <select
//             value={filters.shape}
//             onChange={(e) => setFilters({...filters, shape: e.target.value})}
//             className='bg-black text-white'>
//             <option value=''>Any</option>
//             <option value='cylinder'>Cylinder</option>
//             <option value='triangle'>Triangle</option>
//             <option value='circle'>Circle</option>
//             <option value='disc'>Disc</option>
//             <option value='oval'>Oval</option>
//             <option value='sphere'>Sphere</option>
//             <option value='cigar'>Cigar</option>
//             <option value='formation'>Formation</option>
//             <option value='light'>Light</option>
//             <option value='other'>Other</option>
//           </select>
//         </div>
//         <div>
//           <label>Min Duration:</label>
//           <select
//             value={filters.duration}
//             onChange={(e) => setFilters({...filters, duration: Number(e.target.value)})}
//             className='bg-black text-white'>
//             <option value='0'>Any</option>
//             <option value='60'>1+ min</option>
//             <option value='300'>5+ mins</option>
//             <option value='600'>10+ mins</option>
//             <option value='1800'>30+ mins</option>
//             <option value='3600'>1+ hour</option>
//           </select>
//         </div>
//         <div>
//           <label>Country:</label>
//           <select
//             value={filters.country}
//             onChange={(e) => setFilters({...filters, country: e.target.value})}
//             className='bg-black text-white'>
//             <option value=''>Any</option>
//             <option value='us'>United States</option>
//             <option value='ca'>Canada</option>
//             <option value='gb'>United Kingdom</option>
//             <option value='au'>Australia</option>
//           </select>
//         </div>
//         {filters.country === 'us' && (
//           <div>
//             <label>State:</label>
//             <select
//               value={filters.state}
//               onChange={(e) => setFilters({...filters, state: e.target.value})}
//               className='bg-black text-white'>
//               <option value=''>Any</option>
//               <option value='ca'>California</option>
//               <option value='tx'>Texas</option>
//               <option value='nv'>Nevada</option>
//               <option value='az'>Arizona</option>
//               <option value='nm'>New Mexico</option>
//               <option value='wa'>Washington</option>
//               <option value='or'>Oregon</option>
//               <option value='fl'>Florida</option>
//               <option value='ny'>New York</option>
//             </select>
//           </div>
//         )}
//         <div>
//           <button
//             onClick={() =>
//               setFilters({...filters, isSignificantEvent: !filters.isSignificantEvent})
//             }
//             className='px-2 py-1 bg-yellow-500 text-black rounded'>
//             {filters.isSignificantEvent ? 'Major Events Only' : 'All Sightings'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// /**
//  * DeckGLOverlay Component
//  *
//  * Bridges deck.gl layers into the Mapbox instance.
//  */
// function DeckGLOverlay({layers}: {layers: any[]}) {
//   const overlay = useMemo(() => new MapboxOverlay({layers}), [layers])
//   return (
//     <div
//       id='deck-gl-overlay'
//       ref={(el) => {
//         if (el) {
//           const mapDiv = el.parentNode
//           if (mapDiv && mapDiv.classList.contains('mapboxgl-map')) {
//             // @ts-ignore
//             const map = mapDiv._map
//             if (map && !map.__deck) {
//               map.addControl(overlay)
//               map.__deck = true
//             }
//           }
//         }
//       }}
//     />
//   )
// }

// const AnalyticPanel = ({
//   sightings,
//   filters,
//   isAnimating,
//   animationYear,
//   animationMonth,
//   filteredSightings,
//   isSignificantEvent,
//   formatDate,
//   timeRange,
//   useExtData,
// }: {
//   sightings: any
//   filters: any
//   isAnimating: any
//   animationYear: any
//   animationMonth: any
//   filteredSightings: any
//   isSignificantEvent: any
//   formatDate: any
//   timeRange: any
//   useExtData: any
// }) => {
//   return (
//     <div className='absolute top-4 right-4 p-4 bg-black bg-opacity-70 text-white rounded-lg z-10 font-monumentMono'>
//       <h3 className='text-lg mb-2 font-bold text-cyan-400'>Current View</h3>

//       {/* Sightings count with filter info */}
//       <div className='flex justify-between items-center'>
//         <p className='text-sm'>
//           {filters.isSignificantEvent ? (
//             <span className='text-yellow-400'>
//               Showing {sightings?.features.length || 0} major events
//             </span>
//           ) : (
//             <span>Showing {sightings?.features.length || 0} sightings</span>
//           )}
//         </p>

//         {/* Filter indicators */}
//         {(filters.shape || filters.duration > 0 || filters.country) && (
//           <div className='text-xs text-cyan-300 ml-2'>
//             <span>Filtered</span>
//           </div>
//         )}
//       </div>

//       {/* Time range */}
//       <p className='text-sm'>
//         Time range: {formatDate(timeRange[0])} - {formatDate(timeRange[1])}
//       </p>

//       {/* Active filters summary */}
//       {(filters.shape || filters.duration > 0 || filters.country) && (
//         <div className='text-xs mt-1 border-t border-gray-700 pt-1'>
//           <p className='text-cyan-400'>Active filters:</p>
//           <div className='flex flex-wrap gap-1 mt-1'>
//             {filters.shape && (
//               <span className='px-1 py-0.5 bg-gray-800 rounded text-cyan-300'>
//                 Shape: {filters.shape}
//               </span>
//             )}
//             {filters.duration > 0 && (
//               <span className='px-1 py-0.5 bg-gray-800 rounded text-cyan-300'>
//                 {filters.duration >= 3600
//                   ? `${filters.duration / 3600}h+`
//                   : `${filters.duration / 60}m+`}
//               </span>
//             )}
//             {filters.country && (
//               <span className='px-1 py-0.5 bg-gray-800 rounded text-cyan-300'>
//                 {filters.country.toUpperCase()}
//                 {filters.state && `: ${filters.state.toUpperCase()}`}
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       {isAnimating && (
//         <div className='mt-2 border-t border-cyan-800 pt-2'>
//           <p className='text-sm text-yellow-400 font-bold'>Time Animation Active</p>
//           <p className='text-xs'>
//             Currently showing: {format(new Date(animationYear, animationMonth), 'MMMM yyyy')}
//           </p>
//           <div className='w-full h-1 bg-gray-700 rounded-full mt-1 overflow-hidden'>
//             <div
//               className='h-full bg-yellow-500'
//               style={{
//                 width: `${
//                   (((animationYear - 1940) * 12 + animationMonth) /
//                     ((new Date().getFullYear() - 1940) * 12)) *
//                   100
//                 }%`,
//               }}
//             />
//           </div>

//           {/* Count significant events in current period */}
//           {filteredSightings && (
//             <div className='mt-1 text-xs'>
//               <span className='text-yellow-300'>
//                 {sightings.features.filter((f) => isSignificantEvent(f)).length} significant events
//               </span>
//               {' / '}
//               <span>{sightings.features.length} total sightings</span>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// /**
//  * Main Component: SightingsGlobe
//  *
//  * Combines interactive map markers/pop-ups, time series animation,
//  * and custom filtering/data analysis views into a cohesive 3D visualization.
//  */
// export const SightingsGlobe = ({
//   geoJSONSightings,
// }: {
//   geoJSONSightings: {
//     sightings: GeoJSON.FeatureCollection
//     militaryBases?: GeoJSON.FeatureCollection
//     ufoPosts?: GeoJSON.FeatureCollection
//   }
// }) => {
//   // Extract initial data from props
//   const {sightings: initialSightings, militaryBases, ufoPosts} = geoJSONSightings
//   const mapRef = useRef<any>(null)

//   // Data state – external data, loading, etc.
//   const [sightings, setSightings] = useState(initialSightings)
//   const [isLoadingExternalData, setIsLoadingExternalData] = useState(false)
//   const [useExtData, setUseExtData] = useState(true)

//   // Map and popup state
//   const [popupInfo, setPopupInfo] = useState<{
//     coordinates: [number, number]
//     properties: Record<string, any>
//   } | null>(null)
//   const [mapConfig, setMapConfig] = useState({
//     zoom: [3] as [number],
//     center: [-98.5795, 39.8283] as [number, number],
//     pitch: [45] as [number],
//   })

//   // Timeline (time filter) state
//   const [timeRange, setTimeRange] = useState<[number, number]>([
//     new Date('1940-01-01').getTime(),
//     new Date().getTime(),
//   ])

//   // Filtering state
//   const [filters, setFilters] = useState({
//     shape: '',
//     duration: 0,
//     country: '',
//     state: '',
//     isSignificantEvent: false,
//   })

//   // Animation speed state
//   const [animationSpeed, setAnimationSpeed] = useState(1000)

//   // Determine if a sighting is significant based on its properties
//   const isSignificantEvent = useCallback((feature: any): boolean => {
//     const durationSeconds = Number.parseInt(feature.properties.duration_seconds || '0', 10)
//     if (durationSeconds > 600) return true
//     const description = (feature.properties.description || '').toLowerCase()
//     if (
//       description.includes('multiple witness') ||
//       description.includes('military') ||
//       description.includes('pilot') ||
//       description.includes('police') ||
//       description.includes('radar') ||
//       description.includes('official')
//     )
//       return true
//     if (feature.properties.video || feature.properties.image) return true
//     // Check for famous cases
//     const location = (feature.properties.location || '').toLowerCase()
//     if (
//       description.includes('roswell') ||
//       description.includes('phoenix lights') ||
//       location.includes('roswell') ||
//       location.includes('phoenix')
//     )
//       return true
//     return false
//   }, [])

//   // Filter the sightings based on time range and custom filters
//   const filteredSightings = useMemo(() => {
//     if (!sightings) return {features: []}
//     return {
//       ...sightings,
//       features: sightings.features.filter((feature: any) => {
//         // Time filter
//         const date = new Date(feature.properties.date || feature.properties.timestamp || 0)
//         const timestamp = date.getTime()
//         if (timestamp < timeRange[0] || timestamp > timeRange[1]) return false

//         // Shape filter
//         if (
//           filters.shape &&
//           feature.properties.shape &&
//           feature.properties.shape.toLowerCase() !== filters.shape.toLowerCase()
//         )
//           return false

//         // Duration filter
//         if (filters.duration > 0) {
//           const durationSeconds = Number.parseInt(feature.properties.duration_seconds || '0', 10)
//           if (durationSeconds < filters.duration) return false
//         }

//         // Country filter
//         if (
//           filters.country &&
//           feature.properties.country &&
//           feature.properties.country.toLowerCase() !== filters.country.toLowerCase()
//         )
//           return false

//         // State filter
//         if (
//           filters.state &&
//           feature.properties.state &&
//           feature.properties.state.toLowerCase() !== filters.state.toLowerCase()
//         )
//           return false

//         // Significant event filter
//         if (filters.isSignificantEvent && !isSignificantEvent(feature)) return false

//         return true
//       }),
//     }
//   }, [sightings, timeRange, filters, isSignificantEvent])

//   // Build deck.gl layers for visualization (e.g. heatmap and scatter layers)
//   const buildVisualizationLayers = useCallback(() => {
//     if (
//       !filteredSightings ||
//       !filteredSightings.features ||
//       filteredSightings.features.length === 0
//     )
//       return []
//     const layers: any[] = []
//     // Validate features (ensure coordinates are valid)
//     const validFeatures = filteredSightings.features.filter((d: any) => {
//       return (
//         d &&
//         d.geometry &&
//         Array.isArray(d.geometry.coordinates) &&
//         d.geometry.coordinates.length >= 2 &&
//         !isNaN(d.geometry.coordinates[0]) &&
//         !isNaN(d.geometry.coordinates[1])
//       )
//     })
//     if (validFeatures.length === 0) return []

//     // Example: Heatmap layer for density visualization
//     try {
//       layers.push(
//         new HeatmapLayer({
//           id: 'heatmap-layer',
//           data: validFeatures,
//           getPosition: (d: any) => d.geometry.coordinates,
//           getWeight: (d: any) => 1,
//           radiusPixels: 40,
//           intensity: 1,
//           threshold: 0.05,
//           colorRange: [
//             [65, 182, 196, 25],
//             [127, 205, 187, 85],
//             [199, 233, 180, 127],
//             [237, 248, 177, 170],
//             [255, 255, 204, 255],
//           ],
//           pickable: true,
//           autoHighlight: true,
//           onClick: (info: any) => {
//             if (info.object) {
//               setPopupInfo({
//                 coordinates: info.object.geometry.coordinates,
//                 properties: info.object.properties,
//               })
//             }
//           },
//         })
//       )
//     } catch (error) {
//       console.error('Error creating heatmap layer:', error)
//     }

//     // Example: Scatterplot layer for individual sightings
//     try {
//       layers.push(
//         new ScatterplotLayer({
//           id: 'sightings-scatter',
//           data: validFeatures,
//           getPosition: (d: any) => d.geometry.coordinates,
//           getFillColor: [255, 140, 0, 180],
//           getRadius: (d: any) => 5000,
//           radiusScale: 1,
//           radiusMinPixels: 3,
//           radiusMaxPixels: 15,
//           pickable: true,
//           autoHighlight: true,
//           onClick: (info: any) => {
//             if (info.object) {
//               setPopupInfo({
//                 coordinates: info.object.geometry.coordinates,
//                 properties: info.object.properties,
//               })
//             }
//           },
//         })
//       )
//     } catch (error) {
//       console.error('Error creating scatterplot layer:', error)
//     }
//     // (Additional layers such as arcs, hexagon clusters, etc. can be added here)
//     return layers
//   }, [filteredSightings])

//   const deckLayers = useMemo(() => buildVisualizationLayers(), [buildVisualizationLayers])

//   // Function to fly the map to a specified location
//   const flyToLocation = useCallback(
//     (lng: number, lat: number, zoom = 5) => {
//       setMapConfig({
//         ...mapConfig,
//         center: [lng, lat],
//         zoom: [zoom],
//       })
//     },
//     [mapConfig]
//   )

//   // Custom hook for time series animation:
//   const {isAnimating, startAnimation, animationYear, animationMonth, stopAnimation} =
//     useTimeSeriesAnimation({
//       initialYear: 1940,
//       initialMonth: 0,
//       animationSpeed,
//       findSignificantEvents: (start, end) => {
//         if (!sightings || !sightings.features) return []
//         return sightings.features.filter((feature: any) => {
//           const date = new Date(feature.properties.date || feature.properties.timestamp || 0)
//           const timestamp = date.getTime()
//           if (timestamp < start || timestamp > end) return false
//           return isSignificantEvent(feature)
//         })
//       },
//       flyToLocation,
//       setPopupInfo,
//     })

//   // Get current user's location
//   const getUserLocation = useCallback(() => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setMapConfig({
//             ...mapConfig,
//             center: [position.coords.longitude, position.coords.latitude],
//             zoom: [6],
//           })
//         },
//         (error) => {
//           console.error('Error getting user location:', error)
//         }
//       )
//     }
//   }, [mapConfig])

//   // Render interactive markers as a fallback when deck.gl layers are not used
//   const renderMarkers = () => {
//     if (!filteredSightings || !filteredSightings.features) return null
//     return filteredSightings.features.map((feature: any, index: number) => (
//       <Marker
//         key={`marker-${index}`}
//         feature={feature}
//         onClick={(f) =>
//           setPopupInfo({
//             coordinates: f.geometry.coordinates,
//             properties: f.properties,
//           })
//         }
//       />
//     ))
//   }

//   // (Optional: Code to load external data could go here)

//   return (
//     <div className='h-screen w-screen relative'>
//       <MapGL
//         ref={mapRef}
//         style={`mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`}
//         containerStyle={{height: '100vh', width: '100vw'}}
//         {...mapConfig}
//         renderChildrenInPortal={true}
//         onStyleLoad={(map) => {
//           console.log('Map style loaded')
//         }}>
//         <ZoomControl position='top-left' />
//         {/* Render deck.gl overlay if available */}
//         {deckLayers && deckLayers.length > 0 ? (
//           <DeckGLOverlay layers={deckLayers} />
//         ) : (
//           renderMarkers()
//         )}
//         {popupInfo && (
//           <Popup
//             coordinates={popupInfo.coordinates}
//             offset={[0, -15]}
//             onClick={() => setPopupInfo(null)}>
//             <div className='p-2 max-w-md bg-black bg-opacity-80 text-white rounded-md border border-cyan-500/30 relative'>
//               <h3 className='text-lg font-bold mb-1 text-cyan-400'>
//                 {popupInfo.properties.city || popupInfo.properties.location || 'Unknown location'}
//               </h3>
//               <div className='flex justify-between items-center mb-2'>
//                 <p className='text-sm'>
//                   {format(
//                     new Date(popupInfo.properties.date || popupInfo.properties.timestamp || 0),
//                     'MMMM d, yyyy'
//                   )}
//                 </p>
//                 {popupInfo.properties.shape && (
//                   <span className='text-xs px-2 py-0.5 bg-gray-700 rounded-full'>
//                     {popupInfo.properties.shape}
//                   </span>
//                 )}
//               </div>
//               <p className='text-sm'>
//                 {popupInfo.properties.description ||
//                   popupInfo.properties.comments ||
//                   'No description available'}
//               </p>
//               <div className='mt-2 pt-2 border-t border-gray-700 flex justify-between items-end'>
//                 {popupInfo.properties.sourceUrl && (
//                   <a
//                     href={popupInfo.properties.sourceUrl}
//                     target='_blank'
//                     rel='noopener noreferrer'
//                     className='text-xs text-cyan-400 underline inline-block'>
//                     Source
//                   </a>
//                 )}
//               </div>
//             </div>
//           </Popup>
//         )}
//       </MapGL>
//       {/* Controls Panel */}
//       <div className='absolute bottom-4 left-4 p-4 bg-black bg-opacity-70 text-white rounded-lg z-10'>
//         <h3 className='text-lg mb-3'>Visualization Options</h3>
//         <div className='mb-3 flex flex-wrap gap-2'>
//           <button
//             className='px-3 py-1 rounded bg-cyan-600'
//             onClick={() => flyToLocation(-112.074, 33.4484, 8)}>
//             Phoenix Lights
//           </button>
//           <button
//             className='px-3 py-1 rounded bg-cyan-600'
//             onClick={() => flyToLocation(-104.523, 33.3943, 8)}>
//             Roswell
//           </button>
//           <button
//             className='px-3 py-1 rounded bg-cyan-600'
//             onClick={() =>
//               setMapConfig({
//                 center: [-98.5795, 39.8283],
//                 zoom: [3],
//                 pitch: [45],
//               })
//             }>
//             Reset View
//           </button>
//           <button className='px-3 py-1 rounded bg-cyan-600' onClick={getUserLocation}>
//             Go to My Location
//           </button>
//         </div>
//         <div className='mb-3 flex flex-wrap gap-2'>
//           <button
//             className={`px-3 py-1 rounded ${
//               isAnimating ? 'bg-red-500 text-black' : 'bg-green-600'
//             }`}
//             onClick={isAnimating ? stopAnimation : startAnimation}>
//             {isAnimating ? 'Stop Animation' : 'Start Time Animation'}
//           </button>
//           <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
//             <span>Speed:</span>
//             <select
//               value={animationSpeed}
//               onChange={(e) => setAnimationSpeed(Number(e.target.value))}
//               className='bg-gray-900 text-white rounded'>
//               <option value='250'>4x</option>
//               <option value='500'>2x</option>
//               <option value='1000'>1x</option>
//               <option value='2000'>0.5x</option>
//             </select>
//           </div>
//         </div>
//         <FiltersPanel filters={filters} setFilters={setFilters} />
//         <AnalyticPanel
//           sightings={sightings}
//           filters={filters}
//           isAnimating={isAnimating}
//           animationYear={animationYear}
//           animationMonth={animationMonth}
//         />
//       </div>
//     </div>
//   )
// }
