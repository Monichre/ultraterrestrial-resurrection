// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import ReactMapboxGl from 'react-mapbox-gl'
// import DeckGL, {
//   FirstPersonView,
//   FlyToInterpolator,
//   H3HexagonLayer,
//   MapView,
//   ScatterplotLayer,
// } from 'deck.gl'
// // import { MapboxLayer } from '@deck.gl/mapbox'

// import { useCallback } from 'react'
// import { useMemo } from 'react'
// import { Map, NavigationControl, Popup, useControl, Layer } from 'react-map-gl'
// import { TileLayer } from '@deck.gl/geo-layers'

// import { scaleLog } from 'd3-scale'
// import { cellToLatLng } from 'h3-js'
// import { load } from '@loaders.gl/core'

// import type { FillLayer } from 'react-map-gl'

// import { GeoJsonLayer, LineLayer } from '@deck.gl/layers'

// import type { GeoJsonLayerProps } from '@deck.gl/layers'
// import { format } from 'date-fns'

// import type { MapViewState } from '@deck.gl/core'

// import { MapboxOverlay, type MapboxOverlayProps } from '@deck.gl/mapbox'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import { HeatmapLayer } from 'deck.gl'
// import {
//   useMotionValue,
//   useSpring,
//   useTransform,
//   AnimatePresence,
//   motion,
// } from 'framer-motion'
// const MotionPopUp = motion(Popup)
// const colorScale = scaleLog()
//   .domain([10, 100, 1000, 10000])
//   .range([
//     [255, 255, 178],
//     [254, 204, 92],
//     [253, 141, 60],
//     [227, 26, 28],
//   ])
// function filterArcs(data: any[], selectedPOI: any) {
//   if (!data) {
//     return null
//   }
//   return data.filter((d: { hex: any }) => d.hex === selectedPOI)
// }

// // function aggregateHexes(data: any) {
// //   if (!data) {
// //     return null
// //   }
// //   const result = {}
// //   for (const object of data) {
// //     if (!result[object.hex]) {
// //       result[object.hex] = { hex: object.hex, count: 0 }
// //     }
// //     result[object.hex].count += object.count
// //   }
// //   return Object.values(result)
// // }
// const INITIAL_VIEW_STATE = {
//   latitude: 51.47,
//   longitude: 0.45,
//   zoom: 4,
//   bearing: 0,
//   pitch: 30,
// }

// function getFirstLabelLayerId(style: { layers: any }) {
//   const layers = style.layers
//   // Find the index of the first symbol (i.e. label) layer in the map style
//   for (let i = 0; i < layers.length; i++) {
//     if (layers[i].type === 'symbol') {
//       return layers[i].id
//     }
//   }
//   return undefined
// }

// function DeckGLOverlay(props: MapboxOverlayProps) {
//   const overlay = useControl(() => new MapboxOverlay(props))
//   overlay.setProps(props)
//   return null
// }

// export const SightingsGlobe: React.FC<any> = ({ sightings }) => {
//   const [deckGlLayer, setDeckGlLayer]: any = useState(null)
//   const defaultCenter = useMemo(
//     () => [-125.148032, 19.613688] as unknown as [number, number],
//     []
//   )

//   const [center, setCenter] = useState({
//     longitude: defaultCenter[0],
//     latitude: defaultCenter[1],
//   })
//   const pitch: any = [0]
//   const zoom: any = [2.48]
//   const [state, setState]: any = useState({ zoom, center, pitch })
//   const [data, setData]: any = useState(sightings)
//   const [selected, setSelected]: any = useState(null)
//   const [hoverInfo, setHoverInfo] = useState(null)
//   const [selectedPOI, setSelectedPOI] = useState('8a283082aa17fff')
//   const [firstLabelLayerId, setFirstLabelLayerId] = useState()
//   const mapRef = useRef()

//   const onMapLoad = useCallback(() => {
//     setFirstLabelLayerId(getFirstLabelLayerId(mapRef.current.getStyle()))
//   }, [])

//   const selectedPOICentroid = useMemo(() => {
//     const [lat, lng] = cellToLatLng(selectedPOI)
//     return [lng, lat]
//   }, [selectedPOI])

//   const fetchCurrentUserLocation = useCallback(() => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log('position: ', position)
//           const userLocation: any = [
//             position.coords.longitude,
//             position.coords.latitude,
//           ]
//           console.log('userLocation: ', userLocation)
//           setCenter(userLocation) // Update map center with user's location
//         },
//         (error) => {
//           console.error('Error retrieving location:', error)
//           // Use default location if geolocation fails
//           // setCenter(defaultCenter)
//         }
//       )
//     } else {
//       console.error('Geolocation not supported by this browser.')
//       // Fallback to default center
//       setCenter(defaultCenter)
//     }
//   }, [defaultCenter])

//   useEffect(() => {
//     fetchCurrentUserLocation()
//   }, [fetchCurrentUserLocation])

//   useEffect(() => {
//     setState((prevState: any) => ({
//       ...prevState,
//       center,
//     }))
//   }, [center])

//   // includes military bases, ufo posts and sihgtings
//   const latestMapboxStyle = `mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`
//   // old `mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`
//   // pk.eyJ1IjoiZWxsaXNsaWFtIiwiYSI6ImNsNm10eGhrMDBwZG8zYnEyZ2QzdDA0ZmUifQ.fn0vBNAu8_371GdJ1Py68w

//   const sightingsTileSet = `ellisliam.7qe3u7ln`
//   const fullUFOSightingsDataSetId = `cld7oc5i404tf20mjn8ckiprd`
//   const ufoPostsDataSetId = `cld524b3c07tf28nva1hmk55t`
//   const militaryBasesDataSetId = `cled0ngt51fis2ajzrzvfkjz4`
//   const militaryBasesTileSet = 'ellisliam.81pwhozb'
//   const allUFOPostsTileSet = 'ellisliam.534j42es'

//   const points = data.features.map((feature: any) => ({
//     position: feature.geometry.coordinates,
//     name: feature.properties.name,
//     color: [30, 144, 255],
//     size: 2000, // Adjust size based on visualization needs
//   }))

//   const heatmapLayer = new HeatmapLayer({
//     id: 'sightingsHeatmap',
//     data,

//     aggregation: 'SUM',
//     getPosition: (d) => d.geometry.coordinates,
//     getWeight: (d) => d.properties.state,
//     radiusPixels: 25,
//   })
//   const militaryLayer = new TileLayer({
//     id: 'military-bases',
//     data: `https://studio.mapbox.com/tilesets/ellisliam.81pwhozb`,
//   })
//   const ufoPostsLayer = new TileLayer({
//     id: 'ufoPosts',
//     data: `https://studio.mapbox.com/tilesets/ellisliam.81pwhozb`,
//   })
//   const sightingsLayer = new GeoJsonLayer({
//     id: 'sightings',
//     data,
//     // Styles
//     filled: true,
//     pointRadiusMinPixels: 2,
//     pointRadiusScale: 2000,
//     getPointRadius: (f) => 11 - f.properties.scalerank,
//     // getFillColor: [200, 0, 80, 180],
//     // Interactive props
//     pickable: true,
//     autoHighlight: true,
//     onClick: (info) => setSelected(info.object),
//     // Add hover functionality here
//     onHover: (info) => {
//       console.log('info: ', info)
//       if (info.object) {
//         setHoverInfo(info.object)
//       } else {
//         setHoverInfo(null)
//       }
//     },
//   })
//   // const hexes = useMemo(() => aggregateHexes(data), [data])
//   // const poiLayer = new H3HexagonLayer({
//   //   id: 'deckgl-pois',
//   //   data,
//   //   opacity: 0.4,
//   //   pickable: true,
//   //   autoHighlight: true,
//   //   onClick: ({ object }) => object && setSelectedPOI(object.hex),
//   //   getHexagon: (d) => d.hex,
//   //   getFillColor: (d) => colorScale(d.count),
//   //   extruded: false,
//   //   stroked: false,
//   //   beforeId: firstLabelLayerId,
//   // })
//   // Load sightings data (geoJSON format)
//   const layers = [
//     sightingsLayer,
//     // militaryLayer,
//     // ufoPostsLayer,
//     // heatmapLayer,
//     // poiLayer,
//     // new ArcLayer({
//     //   id: 'arcs',
//     //   data: AIR_PORTS,
//     //   dataTransform: (d) =>
//     //     d.features.filter((f) => f.properties.scalerank < 4),
//     //   // Styles
//     //   getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
//     //   getTargetPosition: (f) => f.geometry.coordinates,
//     //   getSourceColor: [0, 128, 200],
//     //   getTargetColor: [200, 0, 80],
//     //   getWidth: 1,
//     // }),
//   ]

//   // useEffect(() => {
//   //   let currentTime = 0
//   //   const updateSightings = () => {
//   //     if (data && deckGlLayer) {
//   //       const points = data.features
//   //         .filter((feature: any) => {
//   //           const eventDate = new Date(feature.properties.date) // Assuming there's a date field
//   //           return eventDate.getTime() <= currentTime
//   //         })
//   //         .map((feature: any) => ({
//   //           position: feature.geometry.coordinates,
//   //           name: feature.properties.name,
//   //           color: [30, 144, 255],
//   //           size: 2000,
//   //         }))

//   //       const updatedScatterplotLayer = new ScatterplotLayer({
//   //         id: 'scatterplot-layer',
//   //         data: points,
//   //         getPosition: (d: any) => d.position,
//   //         getFillColor: (d: any) => d.color,
//   //         getRadius: (d: any) => d.size,
//   //         radiusMinPixels: 3,
//   //         pickable: true,
//   //         opacity: 0.8,
//   //       })

//   //       deckGlLayer.setProps({ layers: [updatedScatterplotLayer] })
//   //     }
//   //     // Update layer dynamically
//   //   }

//   //   const interval = setInterval(() => {
//   //     currentTime += 86400000 // Advance by one day
//   //     updateSightings()
//   //   }, 1000)

//   //   return () => clearInterval(interval)
//   // }, [data, deckGlLayer])
//   const springConfig = { stiffness: 100, damping: 5 }

//   const x = useMotionValue(0) // going to set this value on mouse moves

//   // rotate the tooltip
//   const rotate = useSpring(
//     useTransform(x, [-100, 100], [-45, 45]),
//     springConfig
//   )

//   // translate the tooltip
//   const translateX = useSpring(
//     useTransform(x, [-100, 100], [-50, 50]),
//     springConfig
//   )

//   //  mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9
//   // mapbox://styles/ellisliam/cld52nozy003d01p5ntge3psz

//   return (
//     <div className='h-[100vh] w-[100vw]'>
//       <Map
//         ref={mapRef}
//         antialias={true}
//         onLoad={onMapLoad}
//         initialViewState={{
//           ...state,
//           transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
//           transitionDuration: 'auto',
//         }}
//         mapStyle={'mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9'}
//   const latestMapboxStyle = `mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`
//         mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
//       >
//         {selected && (
//           <Popup
//             key={selected?.properties.name}
//             anchor='bottom'
//             style={{ zIndex: 10 }} /* position above deck.gl canvas */
//             longitude={selected.geometry.coordinates[0]}
//             latitude={selected.geometry.coordinates[1]}
//           >
//             {selected?.properties.name} ({selected.properties.abbrev})
//           </Popup>
//         )}
//         {hoverInfo && (
//           <Popup
//             key={hoverInfo?.properties.name}
//             anchor='left'
//             longitude={hoverInfo.geometry.coordinates[0]}
//             latitude={hoverInfo.geometry.coordinates[1]}
//             style={{
//               zIndex: 10,
//               width: '300px',
//             }}
//           >
//             <div className='absolute rounded-md bg-black z-50 shadow-xl px-4 py-2 top-0 left-0 w-[300px]'>
//               <div className='absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px ' />
//               <div className='absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px ' />

//               <div className='font-bold text-white relative z-30'>
//                 <h3 className='font-bebasNeuePro text-left'>
//                   {hoverInfo?.properties.city}, {hoverInfo.properties.state}
//                 </h3>
//               </div>
//               <div className=''>
//                 <p className='text-white text-xs font-source'>
//                   {format(hoverInfo?.properties.date, 'MMMM d, yyyy')}
//                 </p>
//                 <p className='text-white text-xs font-source lowercase'>
//                   {hoverInfo.properties.comments}
//                 </p>
//               </div>
//             </div>
//           </Popup>
//         )}
//         <DeckGLOverlay interleaved={true} layers={layers} />
//         {/* <Layer {...deckGlLayer} /> */}
//         <NavigationControl position='top-left' />
//       </Map>
//     </div>
//   )
// }
// /*
//   <Map
//       mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
//       // movingMethod='flyTo'
//       pitch={state?.pitch}
//       zoom={state?.zoom}
//       initialViewState={state}
//       mapStyle={`mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`}
//       // containerStyle={{ height: '100vh', width: '100vw' }}
//       // renderChildrenInPortal
//       // onStyleLoad={(map: any) => {
//       //   if (deckGlLayer) {
//       //     map.addLayer(deckGlLayer) // Add DeckGL layer on top of Mapbox base
//       //   }
//       // }}
//     >
//       {selected && (
//         <Popup
//           key={selected?.properties.name}
//           anchor='bottom'

//           longitude={selected.geometry.coordinates[0]}
//           latitude={selected.geometry.coordinates[1]}
//         >
//           {selected?.properties.name} ({selected.properties.abbrev})
//         </Popup>
//       )}
//       <DeckGLOverlay layers={layers}   />
//       <Layer {...deckGlLayer} />
//       <NavigationControl position='top-left' />
//     </Map>
// */

// 'use client'

// import React, { memo, useState, useEffect, useRef } from 'react'

// import DeckGL, {
//   FirstPersonView,
//   FlyToInterpolator,
//   H3HexagonLayer,
//   MapView,
//   ScatterplotLayer,
// } from 'deck.gl'
// // import { MapboxLayer } from '@deck.gl/mapbox'

// import { useCallback } from 'react'
// import { useMemo } from 'react'
// import {
//   Map,
//   NavigationControl,
//   Popup,
//   useControl,
//   Layer,
//   Source,
// } from 'react-map-gl'
// import { scaleLog } from 'd3-scale'
// import { cellToLatLng } from 'h3-js'
// import { load } from '@loaders.gl/core'

// import type { FillLayer } from 'react-map-gl'

// import { GeoJsonLayer, LineLayer } from '@deck.gl/layers'

// import type { GeoJsonLayerProps } from '@deck.gl/layers'
// import { format } from 'date-fns'

// import type { MapViewState } from '@deck.gl/core'

// import { MapboxOverlay, type MapboxOverlayProps } from '@deck.gl/mapbox'
// // import 'mapbox-gl/dist/mapbox-gl.css'
// import { HeatmapLayer } from 'deck.gl'
// import {
//   useMotionValue,
//   useSpring,
//   useTransform,
//   AnimatePresence,
//   motion,
// } from 'framer-motion'
// const MotionPopUp = motion(Popup)
// const colorScale = scaleLog()
//   .domain([10, 100, 1000, 10000])
//   .range([
//     [255, 255, 178],
//     [254, 204, 92],
//     [253, 141, 60],
//     [227, 26, 28],
//   ])
// function filterArcs(data: any[], selectedPOI: any) {
//   if (!data) {
//     return null
//   }
//   return data.filter((d: { hex: any }) => d.hex === selectedPOI)
// }

// // function aggregateHexes(data: any) {
// //   if (!data) {
// //     return null
// //   }
// //   const result = {}
// //   for (const object of data) {
// //     if (!result[object.hex]) {
// //       result[object.hex] = { hex: object.hex, count: 0 }
// //     }
// //     result[object.hex].count += object.count
// //   }
// //   return Object.values(result)
// // }
// const INITIAL_VIEW_STATE = {
//   latitude: 51.47,
//   longitude: 0.45,
//   zoom: 4,
//   bearing: 0,
//   pitch: 30,
// }

// function getFirstLabelLayerId(style: { layers: any }) {
//   const layers = style.layers
//   // Find the index of the first symbol (i.e. label) layer in the map style
//   for (let i = 0; i < layers.length; i++) {
//     if (layers[i].type === 'symbol') {
//       return layers[i].id
//     }
//   }
//   return undefined
// }

// function DeckGLOverlay(props: MapboxOverlayProps) {
//   console.log('props: ', props)
//   const overlay = useControl(() => new MapboxOverlay(props))
//   overlay.setProps(props)
//   return null
// }

// export const SightingsGlobe: React.FC<any> = memo(
//   ({ sightings, militaryBases, ufoPosts }) => {
//     const defaultCenter: any = useMemo(
//       () => [-125.148032, 19.613688] as unknown as [number, number],
//       []
//     )

//     const [center, setCenter] = useState({
//       longitude: defaultCenter[0],
//       latitude: defaultCenter[1],
//     })
//     const pitch: any = [0]
//     const zoom: any = [2.48]
//     const [state, setState]: any = useState({ zoom, center, pitch })
//     const [data, setData]: any = useState(sightings)
//     const [selected, setSelected]: any = useState(null)
//     const [hoverInfo, setHoverInfo] = useState(null)
//     const [selectedPOI, setSelectedPOI] = useState('8a283082aa17fff')
//     const [firstLabelLayerId, setFirstLabelLayerId] = useState()
//     const mapRef: any = useRef()

//     const onMapLoad = useCallback(() => {
//       setFirstLabelLayerId(getFirstLabelLayerId(mapRef.current.getStyle()))
//     }, [])

//     const selectedPOICentroid = useMemo(() => {
//       const [lat, lng] = cellToLatLng(selectedPOI)
//       return [lng, lat]
//     }, [selectedPOI])

//     const fetchCurrentUserLocation = useCallback(() => {
//       if ('geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const userLocation: any = [
//               position.coords.longitude,
//               position.coords.latitude,
//             ]
//             console.log('userLocation: ', userLocation)
//             setCenter(userLocation) // Update map center with user's location
//           },
//           (error) => {
//             console.error('Error retrieving location:', error)
//             // Use default location if geolocation fails
//             // setCenter(defaultCenter)
//           }
//         )
//       } else {
//         console.error('Geolocation not supported by this browser.')
//         // Fallback to default center
//         setCenter(defaultCenter)
//       }
//     }, [defaultCenter])

//     // useEffect(() => {
//     //   fetchCurrentUserLocation()
//     // }, [fetchCurrentUserLocation])

//     useEffect(() => {
//       setState((prevState: any) => ({
//         ...prevState,
//         center,
//       }))
//     }, [center])

//     const points = data.features.map((feature: any) => ({
//       position: feature.geometry.coordinates,
//       name: feature.properties.name,
//       color: [30, 144, 255],
//       size: 2000, // Adjust size based on visualization needs
//     }))

//     const heatmapLayer = new HeatmapLayer({
//       id: 'sightingsHeatmap',
//       data,

//       aggregation: 'SUM',
//       getPosition: (d) => d.geometry.coordinates,
//       getWeight: (d) => d.properties.state,
//       radiusPixels: 25,
//     })
//     const sightingsLayer = new GeoJsonLayer({
//       id: 'sightings',
//       data: sightings,
//       // Styles
//       filled: true,
//       pointRadiusMinPixels: 2,
//       pointRadiusScale: 2000,
//       // getPointRadius: (f) => 11 - f.properties.scalerank,
//       // getFillColor: [200, 0, 80, 180],
//       // Interactive props
//       pickable: true,
//       autoHighlight: true,
//       onClick: (info) => setSelected(info.object),
//       // Add hover functionality here
//       onHover: (info) => {
//         console.log('info: ', info)
//         if (info.object) {
//           setHoverInfo(info.object)
//         } else {
//           setHoverInfo(null)
//         }
//       },
//     })
//     // const militaryLayer = new GeoJsonLayer({
//     //   id: 'military-bases',
//     //   data: militaryBases,
//     //   // Styles
//     //   filled: true,
//     //   pointRadiusMinPixels: 2,
//     //   pointRadiusScale: 2000,
//     //   getPointRadius: (f) => 11 - f.properties.scalerank,
//     //   getFillColor: [200, 0, 80, 180],
//     //   // Interactive props
//     //   pickable: true,
//     //   autoHighlight: true,
//     //   // beforeId: firstLabelLayerId,
//     //   // extruded: true,
//     //   onClick: (info) => {
//     //     console.log('info: ', info)
//     //     setSelected(info.object)
//     //   },
//     //   // Add hover functionality here
//     //   onHover: (info) => {
//     //     console.log('info: ', info)
//     //     if (info.object) {
//     //       setHoverInfo(info.object)
//     //     } else {
//     //       setHoverInfo(null)
//     //     }
//     //   },
//     // })
//     // const ufoPostsLayer: any = new GeoJsonLayer({
//     //   id: 'ufo-posts',
//     //   data: ufoPosts,
//     //   // Styles
//     //   filled: true,
//     //   pointRadiusMinPixels: 2,
//     //   pointRadiusScale: 2000,
//     //   getPointRadius: (f) => 11 - f.properties.scalerank,
//     //   getFillColor: [200, 0, 80, 180],
//     //   // Interactive props
//     //   pickable: true,
//     //   autoHighlight: true,
//     //   onClick: (info) => setSelected(info.object),
//     //   // beforeId: firstLabelLayerId,
//     //   // Add hover functionality here
//     //   onHover: (info) => {
//     //     console.log('info: ', info)
//     //     if (info.object) {
//     //       setHoverInfo(info.object)
//     //     } else {
//     //       setHoverInfo(null)
//     //     }
//     //   },
//     // })
//     // const hexes = useMemo(() => aggregateHexes(data), [data])
//     // const poiLayer = new H3HexagonLayer({
//     //   id: 'deckgl-pois',
//     //   data,
//     //   opacity: 0.4,
//     //   pickable: true,
//     //   autoHighlight: true,
//     //   onClick: ({ object }) => object && setSelectedPOI(object.hex),
//     //   getHexagon: (d) => d.hex,
//     //   getFillColor: (d) => colorScale(d.count),
//     //   extruded: false,
//     //   stroked: false,
//     //   beforeId: firstLabelLayerId,
//     // })
//     // Load sightings data (geoJSON format)
//     //styles/ellisliam/cld51oavf001e01o2eko08rd9
//     const layers = [
//       sightingsLayer,
//       // militaryLayer,
//       // ufoPostsLayer,
//       // heatmapLayer,
//       // poiLayer,
//       // new ArcLayer({
//       //   id: 'arcs',
//       //   data: AIR_PORTS,
//       //   dataTransform: (d) =>
//       //     d.features.filter((f) => f.properties.scalerank < 4),
//       //   // Styles
//       //   getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
//       //   getTargetPosition: (f) => f.geometry.coordinates,
//       //   getSourceColor: [0, 128, 200],
//       //   getTargetColor: [200, 0, 80],
//       //   getWidth: 1,
//       // }),
//     ]

//     // useEffect(() => {
//     //   let currentTime = 0
//     //   const updateSightings = () => {
//     //     if (data && deckGlLayer) {
//     //       const points = data.features
//     //         .filter((feature: any) => {
//     //           const eventDate = new Date(feature.properties.date) // Assuming there's a date field
//     //           return eventDate.getTime() <= currentTime
//     //         })
//     //         .map((feature: any) => ({
//     //           position: feature.geometry.coordinates,
//     //           name: feature.properties.name,
//     //           color: [30, 144, 255],
//     //           size: 2000,
//     //         }))

//     //       const updatedScatterplotLayer = new ScatterplotLayer({
//     //         id: 'scatterplot-layer',
//     //         data: points,
//     //         getPosition: (d: any) => d.position,
//     //         getFillColor: (d: any) => d.color,
//     //         getRadius: (d: any) => d.size,
//     //         radiusMinPixels: 3,
//     //         pickable: true,
//     //         opacity: 0.8,
//     //       })

//     //       deckGlLayer.setProps({ layers: [updatedScatterplotLayer] })
//     //     }
//     //     // Update layer dynamically
//     //   }

//     //   const interval = setInterval(() => {
//     //     currentTime += 86400000 // Advance by one day
//     //     updateSightings()
//     //   }, 1000)

//     //   return () => clearInterval(interval)
//     // }, [data, deckGlLayer])

//     const sightingsTileSet = `ellisliam.7qe3u7ln`
//     const fullUFOSightingsDataSetId = `cld7oc5i404tf20mjn8ckiprd`
//     const ufoPostsDataSetId = `cld524b3c07tf28nva1hmk55t`
//     const militaryBasesDataSetId = `cled0ngt51fis2ajzrzvfkjz4`

//     return (
//       <div className='h-[100vh] w-[100vw]'>
//         <Map
//           ref={mapRef}
//           // antialias={true}
//           onLoad={onMapLoad}
//           // mapStyle={`mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`}
//           mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
//           //         antialias={true}
//           //         onLoad={onMapLoad}
//           initialViewState={{
//             ...state,
//             transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
//             transitionDuration: 'auto',
//           }}
//           mapStyle={'mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9'}
//         >
//           .
//           {selected && (
//             <Popup
//               key={selected?.properties.name}
//               anchor='bottom'
//               style={{ zIndex: 10 }} /* position above deck.gl canvas */
//               longitude={
//                 hoverInfo?.geometry.type === 'Point'
//                   ? hoverInfo?.geometry?.coordinates[0]
//                   : hoverInfo.properties?.geo_point_2d?.lon
//               }
//               latitude={
//                 hoverInfo?.geometry.type === 'Point'
//                   ? hoverInfo?.geometry?.coordinates[1]
//                   : hoverInfo?.properties?.geo_point_2d?.lat
//               }
//             >
//               {selected?.properties.name} ({selected.properties.abbrev})
//             </Popup>
//           )}
//           {hoverInfo && (
//             <Popup
//               key={hoverInfo?.properties.name}
//               anchor='left'
//               longitude={
//                 hoverInfo?.geometry.type === 'Point'
//                   ? hoverInfo?.geometry?.coordinates[0]
//                   : hoverInfo.properties?.geo_point_2d?.lon
//               }
//               latitude={
//                 hoverInfo?.geometry.type === 'Point'
//                   ? hoverInfo?.geometry?.coordinates[1]
//                   : hoverInfo?.properties?.geo_point_2d?.lat
//               }
//               style={{
//                 zIndex: 10,
//                 width: '300px',
//               }}
//             >
//               <div className='absolute rounded-md bg-black z-50 shadow-xl px-4 py-2 top-0 left-0 w-[300px]'>
//                 <div className='absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px ' />
//                 <div className='absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px ' />

//                 <div className='font-bold text-white relative z-30'>
//                   <h3 className='font-bebasNeuePro text-left'>
//                     {hoverInfo?.properties.city}, {hoverInfo.properties.state}
//                   </h3>
//                 </div>
//                 <div className=''>
//                   <p className='text-white text-xs font-source'>
//                     {/* {format(hoverInfo?.properties.date, 'MMMM d, yyyy')} */}
//                   </p>
//                   <p className='text-white text-xs font-source lowercase'>
//                     {hoverInfo.properties.comments}
//                   </p>
//                 </div>
//               </div>
//             </Popup>
//           )}
//           <DeckGLOverlay layers={layers} interleaved={false} />
//           <NavigationControl position='top-left' />
//         </Map>
//       </div>
//     )
//   }
// )
