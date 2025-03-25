'use client'

// // import React, { memo, useState, useEffect, useRef } from 'react'

// // import DeckGL, {
// //   FirstPersonView,
// //   FlyToInterpolator,
// //   H3HexagonLayer,
// //   MapView,
// //   ScatterplotLayer,
// // } from 'deck.gl'
// // // import { MapboxLayer } from '@deck.gl/mapbox'

// // import { useCallback } from 'react'
// // import { useMemo } from 'react'
// // import Map, { Layer, Popup, Source, useControl } from 'react-map-gl'
// // import { scaleLog } from 'd3-scale'
// // import { cellToLatLng } from 'h3-js'
// // import { load } from '@loaders.gl/core'
// // import 'mapbox-gl/dist/mapbox-gl.css'

// // import type { FillLayer } from 'react-map-gl'

// // import { ArcLayer, GeoJsonLayer, LineLayer } from '@deck.gl/layers'

// // import { MapboxOverlay, type MapboxOverlayProps } from '@deck.gl/mapbox'
// // const AIR_PORTS =
// //   'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson'
// // console.log('AIR_PORTS: ', AIR_PORTS)

// // // function aggregateHexes(data: any) {
// // //   if (!data) {
// // //     return null
// // //   }
// // //   const result = {}
// // //   for (const object of data) {
// // //     if (!result[object.hex]) {
// // //       result[object.hex] = { hex: object.hex, count: 0 }
// // //     }
// // //     result[object.hex].count += object.count
// // //   }
// // //   return Object.values(result)
// // // }
// // const INITIAL_VIEW_STATE = {
// //   latitude: 51.47,
// //   longitude: 0.45,
// //   zoom: 4,
// //   bearing: 0,
// //   pitch: 30,
// // }

// // function getFirstLabelLayerId(style: { layers: any }) {
// //   const layers = style.layers
// //   // Find the index of the first symbol (i.e. label) layer in the map style
// //   for (let i = 0; i < layers.length; i++) {
// //     if (layers[i].type === 'symbol') {
// //       return layers[i].id
// //     }
// //   }
// //   return undefined
// // }

// // function DeckGLOverlay(props: MapboxOverlayProps) {
// //   console.log('props: ', props)
// //   const overlay = useControl(() => new MapboxOverlay(props))
// //   overlay.setProps(props)
// //   return null
// // }

// // export const SightingsGlobe: React.FC<any> = memo(
// //   ({ sightings, militaryBases, ufoPosts }) => {
// //     const defaultCenter: any = useMemo(
// //       () => [-125.148032, 19.613688] as unknown as [number, number],
// //       []
// //     )

// //     const [center, setCenter] = useState({
// //       longitude: defaultCenter[0],
// //       latitude: defaultCenter[1],
// //     })
// //     const pitch: any = [0]
// //     const zoom: any = [2.48]
// //     const [state, setState]: any = useState({ zoom, center, pitch })
// //     // const [data, setData]: any = useState(sightings)
// //     const [selected, setSelected]: any = useState(null)
// //     const [hoverInfo, setHoverInfo] = useState(null)
// //     const [selectedPOI, setSelectedPOI] = useState('8a283082aa17fff')
// //     const [firstLabelLayerId, setFirstLabelLayerId] = useState()
// //     const mapRef: any = useRef()

// //     const onMapLoad = useCallback(() => {
// //       setFirstLabelLayerId(getFirstLabelLayerId(mapRef.current.getStyle()))
// //     }, [])

// //     const selectedPOICentroid = useMemo(() => {
// //       const [lat, lng] = cellToLatLng(selectedPOI)
// //       return [lng, lat]
// //     }, [selectedPOI])

// //     const fetchCurrentUserLocation = useCallback(() => {
// //       if ('geolocation' in navigator) {
// //         navigator.geolocation.getCurrentPosition(
// //           (position) => {
// //             const userLocation: any = [
// //               position.coords.longitude,
// //               position.coords.latitude,
// //             ]
// //             console.log('userLocation: ', userLocation)
// //             setCenter(userLocation) // Update map center with user's location
// //           },
// //           (error) => {
// //             console.error('Error retrieving location:', error)
// //             // Use default location if geolocation fails
// //             // setCenter(defaultCenter)
// //           }
// //         )
// //       } else {
// //         console.error('Geolocation not supported by this browser.')
// //         // Fallback to default center
// //         setCenter(defaultCenter)
// //       }
// //     }, [defaultCenter])

// //     useEffect(() => {
// //       fetchCurrentUserLocation()
// //     }, [fetchCurrentUserLocation])

// //     useEffect(() => {
// //       setState((prevState: any) => ({
// //         ...prevState,
// //         center,
// //       }))
// //     }, [center])

// //     // const sightingsLayer = new GeoJsonLayer({
// //     //   id: 'sightings',
// //     //   data: sightings,
// //     //   // Styles
// //     //   filled: true,
// //     //   pointRadiusMinPixels: 2,
// //     //   pointRadiusScale: 2000,
// //     //   // getPointRadius: (f) => 11 - f.properties.scalerank,
// //     //   // getFillColor: [200, 0, 80, 180],
// //     //   // Interactive props
// //     //   pickable: true,
// //     //   autoHighlight: true,
// //     //   onClick: (info) => setSelected(info.object),
// //     //   // Add hover functionality here
// //     //   onHover: (info) => {
// //     //     console.log('info: ', info)
// //     //     if (info.object) {
// //     //       setHoverInfo(info.object)
// //     //     } else {
// //     //       setHoverInfo(null)
// //     //     }
// //     //   },
// //     // })
// //     // const militaryLayer = new GeoJsonLayer({
// //     //   id: 'military-bases',
// //     //   data: militaryBases,
// //     //   // Styles
// //     //   filled: true,
// //     //   pointRadiusMinPixels: 2,
// //     //   pointRadiusScale: 2000,
// //     //   getPointRadius: (f) => 11 - f.properties.scalerank,
// //     //   getFillColor: [200, 0, 80, 180],
// //     //   // Interactive props
// //     //   pickable: true,
// //     //   autoHighlight: true,
// //     //   // beforeId: firstLabelLayerId,
// //     //   // extruded: true,
// //     //   onClick: (info) => {
// //     //     console.log('info: ', info)
// //     //     setSelected(info.object)
// //     //   },
// //     //   // Add hover functionality here
// //     //   onHover: (info) => {
// //     //     console.log('info: ', info)
// //     //     if (info.object) {
// //     //       setHoverInfo(info.object)
// //     //     } else {
// //     //       setHoverInfo(null)
// //     //     }
// //     //   },
// //     // })
// //     // const ufoPostsLayer: any = new GeoJsonLayer({
// //     //   id: 'ufo-posts',
// //     //   data: ufoPosts,
// //     //   // Styles
// //     //   filled: true,
// //     //   pointRadiusMinPixels: 2,
// //     //   pointRadiusScale: 2000,
// //     //   getPointRadius: (f) => 11 - f.properties.scalerank,
// //     //   getFillColor: [200, 0, 80, 180],
// //     //   // Interactive props
// //     //   pickable: true,
// //     //   autoHighlight: true,
// //     //   onClick: (info) => setSelected(info.object),
// //     //   // beforeId: firstLabelLayerId,
// //     //   // Add hover functionality here
// //     //   onHover: (info) => {
// //     //     console.log('info: ', info)
// //     //     if (info.object) {
// //     //       setHoverInfo(info.object)
// //     //     } else {
// //     //       setHoverInfo(null)
// //     //     }
// //     //   },
// //     // })
// //     // const hexes = useMemo(() => aggregateHexes(data), [data])
// //     // const poiLayer = new H3HexagonLayer({
// //     //   id: 'deckgl-pois',
// //     //   data,
// //     //   opacity: 0.4,
// //     //   pickable: true,
// //     //   autoHighlight: true,
// //     //   onClick: ({ object }) => object && setSelectedPOI(object.hex),
// //     //   getHexagon: (d) => d.hex,
// //     //   getFillColor: (d) => colorScale(d.count),
// //     //   extruded: false,
// //     //   stroked: false,
// //     //   beforeId: firstLabelLayerId,
// //     // })
// //     // Load sightings data (geoJSON format)
// //     //styles/ellisliam/cld51oavf001e01o2eko08rd9
// //     const layers = [
// //       new GeoJsonLayer({
// //         id: 'sightings',
// //         data: sightings,
// //         // Styles
// //         filled: true,
// //         pointRadiusMinPixels: 2,
// //         pointRadiusScale: 2000,
// //         // getPointRadius: (f) => 11 - f.properties.scalerank,
// //         // getFillColor: [200, 0, 80, 180],
// //         // Interactive props
// //         pickable: true,
// //         autoHighlight: true,
// //         onClick: (info) => setSelected(info.object),
// //         // Add hover functionality here
// //         onHover: (info) => {
// //           console.log('info: ', info)
// //           if (info.object) {
// //             setHoverInfo(info.object)
// //           } else {
// //             setHoverInfo(null)
// //           }
// //         },
// //       }),
// //       new GeoJsonLayer({
// //         id: 'ufo-posts',
// //         data: ufoPosts,
// //         // Styles
// //         filled: true,
// //         pointRadiusMinPixels: 2,
// //         pointRadiusScale: 2000,
// //         getPointRadius: (f) => 11 - f.properties.scalerank,
// //         getFillColor: [200, 0, 80, 180],
// //         // Interactive props
// //         pickable: true,
// //         autoHighlight: true,
// //         onClick: (info) => setSelected(info.object),
// //         // beforeId: firstLabelLayerId,
// //         // Add hover functionality here
// //         onHover: (info) => {
// //           console.log('info: ', info)
// //           if (info.object) {
// //             setHoverInfo(info.object)
// //           } else {
// //             setHoverInfo(null)
// //           }
// //         },
// //       }),
// //       new GeoJsonLayer({
// //         id: 'military-bases',
// //         data: militaryBases,
// //         // Styles
// //         filled: true,
// //         pointRadiusMinPixels: 2,
// //         pointRadiusScale: 2000,
// //         getPointRadius: (f) => 11 - f.properties.scalerank,
// //         getFillColor: [200, 0, 80, 180],
// //         // Interactive props
// //         pickable: true,
// //         autoHighlight: true,
// //         // beforeId: firstLabelLayerId,
// //         // extruded: true,
// //         onClick: (info) => {
// //           console.log('info: ', info)
// //           setSelected(info.object)
// //         },
// //         // Add hover functionality here
// //         onHover: (info) => {
// //           console.log('info: ', info)
// //           if (info.object) {
// //             setHoverInfo(info.object)
// //           } else {
// //             setHoverInfo(null)
// //           }
// //         },
// //       }),
// //       new GeoJsonLayer({
// //         id: 'airports',
// //         data: AIR_PORTS,
// //         // Styles
// //         filled: true,
// //         pointRadiusMinPixels: 2,
// //         pointRadiusScale: 2000,
// //         getPointRadius: (f) => 11 - f.properties.scalerank,
// //         getFillColor: [200, 0, 80, 180],
// //         // Interactive props
// //         pickable: true,
// //         autoHighlight: true,
// //         onClick: (info) => setSelected(info.object),
// //         beforeId: 'sightings',
// //       }),
// //       new ArcLayer({
// //         id: 'arcs',
// //         data: AIR_PORTS,
// //         dataTransform: (d) =>
// //           d.features.filter((f) => f.properties.scalerank < 4),
// //         // Styles
// //         getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
// //         getTargetPosition: (f) => f.geometry.coordinates,
// //         getSourceColor: [0, 128, 200],
// //         getTargetColor: [200, 0, 80],
// //         getWidth: 1,
// //       }),

// //       // ufoPostsLayer,
// //       // heatmapLayer,
// //       // poiLayer,
// //       // new ArcLayer({
// //       //   id: 'arcs',
// //       //   data: AIR_PORTS,
// //       //   dataTransform: (d) =>
// //       //     d.features.filter((f) => f.properties.scalerank < 4),
// //       //   // Styles
// //       //   getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
// //       //   getTargetPosition: (f) => f.geometry.coordinates,
// //       //   getSourceColor: [0, 128, 200],
// //       //   getTargetColor: [200, 0, 80],
// //       //   getWidth: 1,
// //       // }),
// //     ]

// //     // useEffect(() => {
// //     //   let currentTime = 0
// //     //   const updateSightings = () => {
// //     //     if (data && deckGlLayer) {
// //     //       const points = data.features
// //     //         .filter((feature: any) => {
// //     //           const eventDate = new Date(feature.properties.date) // Assuming there's a date field
// //     //           return eventDate.getTime() <= currentTime
// //     //         })
// //     //         .map((feature: any) => ({
// //     //           position: feature.geometry.coordinates,
// //     //           name: feature.properties.name,
// //     //           color: [30, 144, 255],
// //     //           size: 2000,
// //     //         }))

// //     //       const updatedScatterplotLayer = new ScatterplotLayer({
// //     //         id: 'scatterplot-layer',
// //     //         data: points,
// //     //         getPosition: (d: any) => d.position,
// //     //         getFillColor: (d: any) => d.color,
// //     //         getRadius: (d: any) => d.size,
// //     //         radiusMinPixels: 3,
// //     //         pickable: true,
// //     //         opacity: 0.8,
// //     //       })

// //     //       deckGlLayer.setProps({ layers: [updatedScatterplotLayer] })
// //     //     }
// //     //     // Update layer dynamically
// //     //   }

// //     //   const interval = setInterval(() => {
// //     //     currentTime += 86400000 // Advance by one day
// //     //     updateSightings()
// //     //   }, 1000)

// //     //   return () => clearInterval(interval)
// //     // }, [data, deckGlLayer])

// //     const sightingsTileSet = `ellisliam.7qe3u7ln`
// //     const fullUFOSightingsDataSetId = `cld7oc5i404tf20mjn8ckiprd`
// //     const ufoPostsDataSetId = `cld524b3c07tf28nva1hmk55t`
// //     const militaryBasesDataSetId = `cled0ngt51fis2ajzrzvfkjz4`
// //     const layerRef = useRef()
// //     return (
// //       <div className='h-[100vh] w-[100vw]'>
// //         <Map
// //           ref={mapRef}
// //           antialias={true}
// //           projection={{ name: 'globe' }}
// //           onLoad={onMapLoad}
// //           // mapStyle={`mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`}
// //           mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
// //           initialViewState={{
// //             longitude: -122.4,
// //             latitude: 37.8,
// //             zoom: 0,
// //           }}
// //           mapStyle={'mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9'}
// //         >
// //           <DeckGLOverlay layers={layers} interleaved={true} />
// //           {/* <Source id='sightings' type='geojson' data={sightings}>
// //             <Layer ref={layerRef} />
// //           </Source> */}
// //           .
// //           {selected && (
// //             <Popup
// //               key={selected?.properties.name}
// //               anchor='bottom'
// //               style={{ zIndex: 10 }} /* position above deck.gl canvas */
// //               longitude={
// //                 selected?.geometry.type === 'Point'
// //                   ? selected?.geometry?.coordinates[0]
// //                   : selected.properties?.geo_point_2d?.lon
// //               }
// //               latitude={
// //                 selected?.geometry.type === 'Point'
// //                   ? selected?.geometry?.coordinates[1]
// //                   : selected?.properties?.geo_point_2d?.lat
// //               }
// //             >
// //               {selected?.properties.name} ({selected.properties.abbrev})
// //             </Popup>
// //           )}
// //           {hoverInfo && (
// //             <Popup
// //               key={hoverInfo?.properties.name}
// //               anchor='left'
// //               longitude={
// //                 hoverInfo?.geometry.type === 'Point'
// //                   ? hoverInfo?.geometry?.coordinates[0]
// //                   : hoverInfo.properties?.geo_point_2d?.lon
// //               }
// //               latitude={
// //                 hoverInfo?.geometry.type === 'Point'
// //                   ? hoverInfo?.geometry?.coordinates[1]
// //                   : hoverInfo?.properties?.geo_point_2d?.lat
// //               }
// //               style={{
// //                 zIndex: 10,
// //                 width: '300px',
// //               }}
// //             >
// //               <div className='absolute rounded-md bg-black z-50 shadow-xl px-4 py-2 top-0 left-0 w-[300px]'>
// //                 <div className='absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px ' />
// //                 <div className='absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px ' />

// //                 <div className='font-bold text-white relative z-30'>
// //                   <h3 className='font-bebasNeuePro text-left'>
// //                     {hoverInfo?.properties.city}, {hoverInfo.properties.state}
// //                   </h3>
// //                 </div>
// //                 <div className=''>
// //                   <p className='text-white text-xs font-source'>
// //                     {/* {format(hoverInfo?.properties.date, 'MMMM d, yyyy')} */}
// //                   </p>
// //                   <p className='text-white text-xs font-source lowercase'>
// //                     {hoverInfo.properties.comments}
// //                   </p>
// //                 </div>
// //               </div>
// //             </Popup>
// //           )}
// //         </Map>
// //       </div>
// //     )
// //   }
// // )

// // =====================================
// // New
// 'use client'

// import { DataCard } from '@/components/ui/card/data-card/data-card'
// import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox'
// import { scaleLog } from 'd3-scale'
// import { GeoJsonLayer } from 'deck.gl'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import React, {
//   FC,
//   memo,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react'
// import { Map, NavigationControl, Popup, useControl } from 'react-map-gl'

// // Constants
// const AIR_PORTS_URL =
//   'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson'

// // Type Definitions
// interface SightingsGlobeProps {
//   geoJSONSightings: GeoJSON.FeatureCollection
//   realtimeSightings?: any
// }

// interface PopupInfo {
//   longitude: number
//   latitude: number
//   content: React.ReactNode
// }

// // Helper Functions
// const getFirstLabelLayerId = ( style: any ): string | undefined => {
//   const layers = style.layers
//   for ( let layer of layers ) {
//     if ( layer.type === 'symbol' ) {
//       return layer.id
//     }
//   }
//   return undefined
// }

// // DeckGL Overlay Component
// const DeckGLOverlay: FC<MapboxOverlayProps> = ( props ) => {
//   useControl( () => new MapboxOverlay( props ), { position: 'top-right' } )
//   return null
// }

// // Main Component
// export const SightingsGlobe: FC<SightingsGlobeProps> = memo(
//   ( { geoJSONSightings, realtimeSightings } ) => {
//     const { sightings, militaryBases, ufoPosts }: any = geoJSONSightings
//     // References
//     console.log( "🚀 ~ file: sightings-globe.tsx:795 ~ sightings:", sightings )
//     console.log( "🚀 ~ file: sightings-globe.tsx:795 ~ militaryBases:", militaryBases )
//     console.log( "🚀 ~ file: sightings-globe.tsx:795 ~ ufoPosts:", ufoPosts )
//     const mapRef = useRef<any>( null )
//     // MapboxGlobe
//     // State
//     const [viewState, setViewState] = useState( {
//       longitude: -125.148032,
//       latitude: 19.613688,
//       zoom: 2.48,
//       bearing: 0,
//       pitch: 0,
//     } )
//     const [selected, setSelected] = useState<any | null>( null )
//     const [hoverInfo, setHoverInfo] = useState<PopupInfo | null>( null )
//     const [selectedPOI, setSelectedPOI] = useState<string>( '8a283082aa17fff' )
//     const [firstLabelLayerId, setFirstLabelLayerId] = useState<
//       string | undefined
//     >()

//     // Color Scale
//     const colorScale = useMemo(
//       () =>
//         scaleLog<number, number[]>()
//           .domain( [10, 100, 1000, 10000] )
//           .range( [
//             [255, 255, 178],
//             [254, 204, 92],
//             [253, 141, 60],
//             [227, 26, 28],
//           ] ),
//       []
//     )

//     // Handlers
//     const onMapLoad = useCallback( () => {
//       if ( mapRef.current ) {
//         const layerId = getFirstLabelLayerId( mapRef.current.getStyle() )
//         setFirstLabelLayerId( layerId )
//       }
//     }, [] )

//     const fetchCurrentUserLocation = useCallback( () => {
//       if ( 'geolocation' in navigator ) {
//         navigator.geolocation.getCurrentPosition(
//           ( position ) => {
//             const userLocation: [number, number] = [
//               position.coords.longitude,
//               position.coords.latitude,
//             ]
//             setViewState( ( prev ) => ( {
//               ...prev,
//               longitude: userLocation[0],
//               latitude: userLocation[1],
//             } ) )
//           },
//           ( error ) => {
//             console.error( 'Error retrieving location:', error )
//             // Optionally handle fallback
//           }
//         )
//       } else {
//         console.error( 'Geolocation not supported by this browser.' )
//         // Optionally handle fallback
//       }
//     }, [] )

//     useEffect( () => {
//       fetchCurrentUserLocation()
//     }, [fetchCurrentUserLocation] )

//     // Memoized Layers
//     const layers = useMemo( () => {
//       const baseGeoJsonLayerProps = {
//         filled: true,
//         pointRadiusMinPixels: 2,
//         pointRadiusScale: 2000,
//         pickable: true,
//         autoHighlight: true,
//         onClick: ( info: any ) => {
//           if ( info.object ) {
//             const coords =
//               info.object.geometry.type === 'Point'
//                 ? info.object.geometry.coordinates
//                 : info.object.properties?.geo_point_2d
//                   ? [
//                     info.object.properties.geo_point_2d.lon,
//                     info.object.properties.geo_point_2d.lat,
//                   ]
//                   : [0, 0]
//             setSelected( {
//               longitude: coords[0],
//               latitude: coords[1],
//               ...info.object.properties,
//               content: (
//                 <div className='font-bold'>
//                   {Object.entries( info.object.properties ).map(
//                     ( [key, value] ) => (
//                       <p key={key}>{info.object.properties[key]}</p>
//                     )
//                   )}
//                 </div>
//               ),
//             } )
//           }
//         },
//         onHover: ( info: any ) => {
//           console.log( 'info: ', info )
//           if ( info.object ) {
//             const coords =
//               info.object.geometry.type === 'Point'
//                 ? info.object.geometry.coordinates
//                 : info.object.properties?.geo_point_2d
//                   ? [
//                     info.object.properties.geo_point_2d.lon,
//                     info.object.properties.geo_point_2d.lat,
//                   ]
//                   : [0, 0]
//             setHoverInfo( {
//               longitude: coords[0],
//               latitude: coords[1],
//               ...info.object.properties,
//               content: (
//                 <div className='font-bold'>
//                   {Object.entries( info.object.properties ).map( ( [key, value] ) =>
//                     key === 'geo_point_2d' ? null : <p key={key}>{value}</p>
//                   )}
//                 </div>
//               ),
//             } )
//           } else {
//             setHoverInfo( null )
//           }
//         },
//       }

//       const sightingsLayer = new GeoJsonLayer( {
//         id: 'sightings',
//         data: sightings,
//         ...baseGeoJsonLayerProps,
//         // beforeId: firstLabelLayerId,
//       } )
//       const militaryLayer = new GeoJsonLayer( {
//         id: 'military-bases',
//         data: militaryBases,
//         ...baseGeoJsonLayerProps,
//       } )

//       const ufoPostsLayer = new GeoJsonLayer( {
//         id: 'ufo-posts',
//         data: ufoPosts,
//         ...baseGeoJsonLayerProps,
//         getPointRadius: ( f: any ) => 11 - f.properties.scalerank,
//         getFillColor: [200, 0, 80, 180],
//         // beforeId: firstLabelLayerId,
//       } )

//       // const airportsLayer = new GeoJsonLayer( {
//       //   id: 'airports',
//       //   data: AIR_PORTS_URL,
//       //   ...baseGeoJsonLayerProps,
//       //   getPointRadius: ( f: any ) => 11 - f.properties.scalerank,
//       //   getFillColor: [200, 0, 80, 180],
//       //   beforeId: firstLabelLayerId,
//       // } )

//       // const arcsLayer = new ArcLayer({
//       //   id: 'arcs',
//       //   data: AIR_PORTS_URL,
//       //   dataTransform: (d: any) =>
//       //     d.features.filter((f: any) => f.properties.scalerank < 4),
//       //   getSourcePosition: () => [-0.4531566, 51.4709959], // London
//       //   getTargetPosition: (f: any) => f.geometry.coordinates,
//       //   getSourceColor: [0, 128, 200],
//       //   getTargetColor: [200, 0, 80],
//       //   getWidth: 1,
//       //   pickable: true,
//       //   autoHighlight: true,
//       // })

//       return [
//         sightingsLayer,
//         ufoPostsLayer,
//         militaryLayer,
//         // airportsLayer,
//         // arcsLayer,
//       ]
//     }, [sightings, militaryBases, ufoPosts, firstLabelLayerId] )
//     console.log( 'selected: ', selected )
//     return (
//       <div className='h-screen w-screen'>
//         <Map
//           ref={mapRef}
//           initialViewState={viewState}
//           onMove={( evt ) => setViewState( evt.viewState )}
//           mapStyle='mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9'
//           mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
//           onLoad={onMapLoad}
//           projection={{ name: 'globe' }}
//           style={{ width: '100%', height: '100%' }}
//         >
//           {/* DeckGL Layers Overlay */}
//           <DeckGLOverlay layers={layers} interleaved />

//           {/* Selected Feature Popup */}
//           {selected && (
//             <Popup
//               anchor='left'
//               longitude={selected.longitude}
//               latitude={selected.latitude}
//               // longitude={
//               //   selected.geometry.type === 'Point'
//               //     ? selected.geometry.coordinates[0]
//               //     : selected.properties?.geo_point_2d?.lon || 0
//               // }
//               // latitude={
//               //   selected.geometry.type === 'Point'
//               //     ? selected.geometry.coordinates[1]
//               //     : selected.properties?.geo_point_2d?.lat || 0
//               // }
//               onClose={() => setSelected( null )}
//               style={{ zIndex: 10 }}
//             >
//               <div>{selected.content}</div>
//             </Popup>
//           )}

//           {/* Hover Popup */}
//           {hoverInfo && (
//             <Popup
//               anchor='left'
//               longitude={hoverInfo.longitude}
//               latitude={hoverInfo.latitude}
//               onClose={() => setHoverInfo( null )}
//               style={{
//                 zIndex: 10,

//                 maxWidth: '430px',
//                 minWidth: '380px',
//               }}
//             >
//               <div className='absolute top-0 left-0'>
//                 <DataCard {...hoverInfo} />
//               </div>
//               {/* <div className='relative rounded-md bg-black shadow-xl px-4 py-2 w-full'>
//                 <div className='absolute inset-x-10 z-30 w-1/5 -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px' />
//                 <div className='absolute left-10 w-2/5 z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px' />
//                 <div className='font-bold text-white mb-1'>
//                   {hoverInfo?.content}
//                 </div>

//               </div> */}
//             </Popup>
//           )}

//           {/* Navigation Controls */}
//           <NavigationControl position='top-left' />
//         </Map>
//       </div>
//     )
//   }
// )

import { MapboxOverlay } from '@deck.gl/mapbox'
import { GeoJsonLayer } from 'deck.gl'
import { FC, memo, useMemo, useRef, useState } from 'react'
import Map, { NavigationControl, Popup } from 'react-map-gl'

// Define your overlay component
const DeckGLOverlay: FC<{ layers: any[] }> = ( { layers } ) => {
  // The overlay integrates deck.gl layers with Mapbox
  return <MapboxOverlay layers={layers} interleaved />
}

interface SightingsGlobeProps {
  geoJSONSightings: GeoJSON.FeatureCollection
}

export const SightingsGlobe: FC<SightingsGlobeProps> = memo( ( { geoJSONSightings } ) => {

  console.log( "🚀 ~ constSightingsGlobe:FC<SightingsGlobeProps>=memo ~ geoJSONData:", geoJSONSightings )

  const { sightings, militaryBases, ufoPosts }: any = geoJSONSightings
  const mapRef = useRef<any>( null )
  const [viewState, setViewState] = useState( {
    longitude: -125.148032,
    latitude: 19.613688,
    zoom: 2.48,
    bearing: 0,
    pitch: 0,
  } )
  const [selected, setSelected] = useState<any | null>( null )

  // Memoize the GeoJsonLayer
  const layers = useMemo( () => {
    return [
      new GeoJsonLayer( {
        id: 'sightings-layer',
        data: sightings,
        filled: true,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 2000,
        pickable: true,
        autoHighlight: true,
        // Handle feature clicks to show a popup
        onClick: ( info ) => {
          if ( info.object ) {
            const coords = info.object.geometry.type === 'Point'
              ? info.object.geometry.coordinates
              : [0, 0]
            setSelected( {
              longitude: coords[0],
              latitude: coords[1],
              details: info.object.properties,
            } )
          }
        },
        onHover: ( info ) => {
          // Optionally, update hover state or show a tooltip
          console.log( 'Hovered feature:', info.object )
        },
      } ),
    ]
  }, [sightings] )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        ref={mapRef}
        initialViewState={viewState}
        onMove={( evt ) => setViewState( evt.viewState )}
        mapStyle="mapbox://styles/your-mapbox-style"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
      >
        {/* Render the deck.gl overlay */}
        <DeckGLOverlay layers={layers} />

        {/* Display a Popup for selected features */}
        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            anchor="left"
            onClose={() => setSelected( null )}
          >
            <div>
              {Object.entries( selected.details ).map( ( [key, value] ) => (
                <p key={key}>
                  <strong>{key}:</strong> {value as string}
                </p>
              ) )}
            </div>
          </Popup>
        )}

        {/* Optional: Add Navigation Controls */}
        <NavigationControl position="top-left" />
      </Map>
    </div>
  )
} )