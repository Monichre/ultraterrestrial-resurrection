'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {GeoJsonLayer, HexagonLayer, HeatmapLayer, ScatterplotLayer} from 'deck.gl'
import {MapboxOverlay} from '@deck.gl/mapbox'
import ReactMapboxGl, {Layer, Feature, Popup, ZoomControl} from 'react-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {format} from 'date-fns'
import {scaleLog} from 'd3-scale'
import AnimatedArcGroupLayer from './animated-arc-group-layer'
import {AnimatedArcLayer} from './animated-arc-layer'
// Initialize MapGL with access token
const MapGL = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN || '',
})

// Define path to external sightings geojson file
const SIGHTINGS_GEOJSON_PATH = '/sightings.geojson'

// Create a DeckGL overlay for Mapbox to integrate deck.gl layers with Mapbox
function DeckGLOverlay({layers}: DeckProps) {
  const overlay = useMemo(() => new MapboxOverlay({layers}), [layers])
  return (
    <div
      id='deck-gl-overlay'
      ref={(el) => {
        if (el) {
          // This is a workaround to attach the overlay to the map
          const mapDiv = el.parentNode
          if (mapDiv && mapDiv.classList.contains('mapboxgl-map')) {
            const map = (mapDiv as any)._map
            if (map && !map.__deck) {
              map.addControl(overlay)
              map.__deck = true
            }
          }
        }
      }}
    />
  )
}

interface DeckProps {
  layers: any[]
  [key: string]: any
}

// Define types for our props
interface SightingsGlobeProps {
  geoJSONSightings: {
    sightings: GeoJSON.FeatureCollection
    militaryBases?: GeoJSON.FeatureCollection
    ufoPosts?: GeoJSON.FeatureCollection
  }
  useExternalData?: boolean
}

// Define types for selected feature and hover info
interface FeatureInfo {
  coordinates: [number, number]
  properties: Record<string, any>
}

// Define feature type
interface GeoJSONFeature {
  geometry: {
    coordinates: [number, number]
    type: string
  }
  properties: {
    date?: string | number
    timestamp?: string | number
    city?: string
    location?: string
    description?: string
    comments?: string
    sourceUrl?: string
    [key: string]: any
  }
  type: string
}

// Main component for the 3D Sightings Globe visualization
export const SightingsGlobe = ({geoJSONSightings, useExternalData = false}: SightingsGlobeProps) => {
  // Extract initial sightings data from props
  const {sightings: initialSightings, militaryBases, ufoPosts} = geoJSONSightings
  const mapRef = useRef(null)
  
  // State for external data handling
  const [useExtData, setUseExtData] = useState(useExternalData)
  const [isLoadingExternalData, setIsLoadingExternalData] = useState(false)
  
  // State to hold potentially updated sightings data from external file
  const [sightings, setSightings] = useState(initialSightings)
  
  // Load external sightings data if enabled
  useEffect(() => {
    if (useExtData) {
      setIsLoadingExternalData(true)
      
      fetch(SIGHTINGS_GEOJSON_PATH)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load sightings data: ${response.status} ${response.statusText}`)
          }
          return response.json()
        })
        .then(data => {
          console.log(`Loaded ${data.features?.length || 0} sightings from external file`)
          setSightings(data)
          setIsLoadingExternalData(false)
        })
        .catch(error => {
          console.error('Error loading external sightings data:', error)
          setIsLoadingExternalData(false)
          // Fallback to the initial data in case of error
          setSightings(initialSightings)
        })
    } else {
      // Switch back to mock data
      setSightings(initialSightings)
    }
  }, [useExtData, initialSightings])

  // Map configuration
  const [mapConfig, setMapConfig] = useState({
    zoom: [3] as [number],
    center: [-98.5795, 39.8283] as [number, number],
    pitch: [45] as [number],
  })

  // State for selected feature popup
  const [popupInfo, setPopupInfo] = useState<FeatureInfo | null>(null)

  // State for timeline control
  const [timeRange, setTimeRange] = useState<[number, number]>([
    new Date('1940-01-01').getTime(),
    new Date().getTime(),
  ])

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

  // Create a color scale for the heatmap
  const colorScale = useMemo(
    () =>
      scaleLog()
        .domain([1, 10, 100, 1000])
        // @ts-ignore - d3 types mismatch
        .range([
          [65, 182, 196],
          [127, 205, 187],
          [199, 233, 180],
          [255, 255, 204],
        ]),
    []
  )

  // Filter sightings based on time range
  const filteredSightings = useMemo(() => {
    if (!sightings) return null

    // Clone the sightings to avoid mutating the original
    const filtered = {
      ...sightings,
      features: sightings.features.filter((feature: GeoJSONFeature) => {
        const date = new Date(feature.properties.date || feature.properties.timestamp || 0)
        const timestamp = date.getTime()
        return timestamp >= timeRange[0] && timestamp <= timeRange[1]
      }),
    }

    return filtered
  }, [sightings, timeRange])

  // Handle time range change
  const handleTimeRangeChange = (newRange: [number, number]) => {
    setTimeRange(newRange)
  }

  // Function to fly to a specific location on the globe
  const flyToLocation = useCallback(
    (longitude: number, latitude: number, zoom = 5) => {
      setMapConfig({
        ...mapConfig,
        center: [longitude, latitude] as [number, number],
        zoom: [zoom] as [number],
      })
    },
    [mapConfig]
  )

  // Function to load Mapbox tileset for sightings
  const loadMapboxTileset = useCallback(() => {
    if (!mapRef.current || !mapLoaded) return

    // @ts-ignore - Access map differently depending on react-map-gl version
    const mapInstance = mapRef.current.getMap
      ? mapRef.current.getMap()
      : mapRef.current._map
      ? mapRef.current._map
      : mapRef.current

    // Ensure the map is fully initialized and has required methods
    if (!mapInstance) {
      console.error('Map instance is not available yet')
      return
    }

    if (typeof mapInstance.getSource !== 'function') {
      console.error('Map instance does not have getSource method, map might not be fully loaded')
      return
    }

    try {
      // Remove previous sources/layers if they exist
      if (mapInstance.getSource('sightings-tileset')) {
        if (mapInstance.getLayer('sightings-points')) mapInstance.removeLayer('sightings-points')
        mapInstance.removeSource('sightings-tileset')
      }

      // Add the tileset source
      mapInstance.addSource('sightings-tileset', {
        type: 'vector',
        url: 'mapbox://ellisliam.35z8vcnh',
      })

      // Add a layer for the sightings points
      mapInstance.addLayer({
        id: 'sightings-points',
        type: 'circle',
        source: 'sightings-tileset',
        'source-layer': 'sightings', // This should match your tileset source layer name
        paint: {
          'circle-radius': 6,
          'circle-color': '#ff8c00',
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255, 255, 255, 0.5)',
        },
      })

      // Add click handler for the points
      mapInstance.on('click', 'sightings-points', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0]
          setPopupInfo({
            coordinates: feature.geometry.coordinates as [number, number],
            properties: feature.properties,
          })
        }
      })

      // Change cursor on hover
      mapInstance.on('mouseenter', 'sightings-points', () => {
        mapInstance.getCanvas().style.cursor = 'pointer'
      })

      mapInstance.on('mouseleave', 'sightings-points', () => {
        mapInstance.getCanvas().style.cursor = ''
      })
    } catch (error) {
      console.error('Error loading Mapbox tileset:', error)
    }
  }, [mapLoaded, setPopupInfo])

  // Apply time filter to native Mapbox layer when time range changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    try {
      // @ts-ignore - Access map differently depending on react-map-gl version
      const mapInstance = mapRef.current.getMap
        ? mapRef.current.getMap()
        : mapRef.current._map
        ? mapRef.current._map
        : mapRef.current

      // Ensure the map is fully initialized and has required methods
      if (!mapInstance) {
        console.error('Map instance is not available yet')
        return
      }

      if (typeof mapInstance.getSource !== 'function') {
        console.error('Map instance does not have getSource method, map might not be fully loaded')
        return
      }

      // Apply time filter for native visualization mode
      if (visualizationMode === 'native' && mapInstance.getSource('sightings-source')) {
        // Apply a filter to the layers based on the timeRange
        const timeFilter = [
          'all',
          ['>=', ['to-number', ['get', 'timestamp']], timeRange[0]],
          ['<=', ['to-number', ['get', 'timestamp']], timeRange[1]],
        ]

        if (mapInstance.getLayer('clusters')) mapInstance.setFilter('clusters', timeFilter)
        if (mapInstance.getLayer('cluster-count'))
          mapInstance.setFilter('cluster-count', timeFilter)
        if (mapInstance.getLayer('unclustered-point'))
          mapInstance.setFilter('unclustered-point', timeFilter)
      }

      // Apply time filter for tileset visualization mode
      if (
        useTileset &&
        mapInstance.getSource('sightings-tileset') &&
        mapInstance.getLayer('sightings-points')
      ) {
        // Apply a filter to the tileset layer based on the timeRange
        const timeFilter = [
          'all',
          ['>=', ['to-number', ['get', 'timestamp']], timeRange[0]],
          ['<=', ['to-number', ['get', 'timestamp']], timeRange[1]],
        ]

        mapInstance.setFilter('sightings-points', timeFilter)
      }
    } catch (error) {
      console.error('Error applying time filters:', error)
    }
  }, [timeRange, mapLoaded, visualizationMode, useTileset])

  // Add native Mapbox GL layer for sightings when using that mode
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || visualizationMode !== 'native') return

    try {
      // Clean up any tileset layers if they exist
      if (useTileset) {
        setUseTileset(false)

        // @ts-ignore - Access map differently depending on react-map-gl version
        const map = mapRef.current.getMap
          ? mapRef.current.getMap()
          : mapRef.current._map
          ? mapRef.current._map
          : mapRef.current

        // Check if map object is valid and has methods
        if (!map || typeof map.getSource !== 'function') {
          console.error('Invalid map object or map.getSource is not a function in cleanup', map)
          return
        }

        // Remove tileset layers if they exist
        if (map.getSource('sightings-tileset')) {
          if (map.getLayer('sightings-points')) map.removeLayer('sightings-points')
          map.removeSource('sightings-tileset')
        }
      }

      // @ts-ignore - Access map differently depending on react-map-gl version
      const mapInstance = mapRef.current.getMap
        ? mapRef.current.getMap()
        : mapRef.current._map
        ? mapRef.current._map
        : mapRef.current

      // Ensure the map is fully initialized and has required methods
      if (!mapInstance) {
        console.error('Map instance is not available yet')
        return
      }

      if (typeof mapInstance.getSource !== 'function') {
        console.error('Map instance does not have getSource method, map might not be fully loaded')
        return
      }

      // Remove previous sources/layers if they exist
      if (mapInstance.getSource('sightings-source')) {
        if (mapInstance.getLayer('clusters')) mapInstance.removeLayer('clusters')
        if (mapInstance.getLayer('cluster-count')) mapInstance.removeLayer('cluster-count')
        if (mapInstance.getLayer('unclustered-point')) mapInstance.removeLayer('unclustered-point')
        mapInstance.removeSource('sightings-source')
      }

      // Add the sightings source with clustering enabled
      mapInstance.addSource('sightings-source', {
        type: 'geojson',
        data: filteredSightings,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
        clusterProperties: {
          // Calculate average date for clusters
          avg_timestamp: ['+', ['get', 'timestamp']],
          // Store counts by shape/type if available
          disc_count: ['+', ['case', ['==', ['get', 'shape'], 'Disc'], 1, 0]],
          triangle_count: ['+', ['case', ['==', ['get', 'shape'], 'Triangle'], 1, 0]],
          sphere_count: ['+', ['case', ['==', ['get', 'shape'], 'Sphere'], 1, 0]],
          other_count: [
            '+',
            [
              'case',
              [
                '!',
                [
                  'any',
                  ['==', ['get', 'shape'], 'Disc'],
                  ['==', ['get', 'shape'], 'Triangle'],
                  ['==', ['get', 'shape'], 'Sphere'],
                ],
              ],
              1,
              0,
            ],
          ],
        },
      })

      // Add a layer for the clusters
      mapInstance.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'sightings-source',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            'rgba(65, 182, 196, 0.8)',
            20,
            'rgba(127, 205, 187, 0.8)',
            100,
            'rgba(199, 233, 180, 0.8)',
            500,
            'rgba(255, 255, 204, 0.8)',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 20, 20, 30, 100, 40, 500, 50],
          'circle-blur': 0.3,
          'circle-opacity': 0.8,
        },
      })

      // Add a layer for cluster counts
      mapInstance.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'sightings-source',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      })

      // Add a layer for individual points
      mapInstance.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'sightings-source',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': 'rgba(255, 140, 0, 0.8)',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255, 255, 255, 0.5)',
        },
      })

      // Handle clicks on clusters
      mapInstance.on('click', 'clusters', (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {layers: ['clusters']})
        if (!features || !features.length) return

        const clusterId = features[0].properties.cluster_id
        const pointCount = features[0].properties.point_count
        const clusterProperties = features[0].properties

        // If it's a small cluster, just zoom to it
        if (pointCount < 20) {
          const sightingsSource = mapInstance.getSource('sightings-source')
          if (!sightingsSource || typeof sightingsSource.getClusterExpansionZoom !== 'function') {
            console.error('Invalid sightings source or getClusterExpansionZoom is not a function')
            return
          }

          sightingsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return

            // Animate flyTo with some rotation for a more engaging effect
            mapInstance.flyTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
              bearing: Math.random() * 40 - 20, // Random slight rotation
              pitch: 50,
              duration: 2000,
              essential: true,
            })
          })
        } else {
          // For larger clusters, show a popup with cluster info before zooming
          const discCount = clusterProperties.disc_count || 0
          const triangleCount = clusterProperties.triangle_count || 0
          const sphereCount = clusterProperties.sphere_count || 0
          const otherCount = clusterProperties.other_count || 0

          setPopupInfo({
            coordinates: features[0].geometry.coordinates as [number, number],
            properties: {
              cluster: true,
              pointCount: pointCount,
              discCount,
              triangleCount,
              sphereCount,
              otherCount,
              // Generate a description for the cluster
              description: `Cluster of ${pointCount} sightings including ${discCount} disc-shaped, ${triangleCount} triangular, ${sphereCount} spherical, and ${otherCount} other shaped objects.`,
              // Use the location name from the map
              location: `Sightings Cluster`,
              timestamp: clusterProperties.avg_timestamp / pointCount, // Approximate average time
            },
          })

          // After 1.5 seconds, zoom in
          setTimeout(() => {
            const sightingsSource = mapInstance.getSource('sightings-source')
            if (!sightingsSource || typeof sightingsSource.getClusterExpansionZoom !== 'function') {
              console.error(
                'Invalid sightings source or getClusterExpansionZoom is not a function in timeout'
              )
              return
            }

            sightingsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return

              mapInstance.flyTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
                bearing: Math.random() * 40 - 20,
                pitch: 50,
                duration: 2000,
              })
            })
          }, 1500)
        }
      })

      // Handle clicks on individual points
      mapInstance.on('click', 'unclustered-point', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0]
          setPopupInfo({
            coordinates: feature.geometry.coordinates as [number, number],
            properties: feature.properties,
          })
        }
      })

      // Change cursor on hover
      mapInstance.on('mouseenter', 'clusters', () => {
        mapInstance.getCanvas().style.cursor = 'pointer'
      })

      mapInstance.on('mouseleave', 'clusters', () => {
        mapInstance.getCanvas().style.cursor = ''
      })

      mapInstance.on('mouseenter', 'unclustered-point', () => {
        mapInstance.getCanvas().style.cursor = 'pointer'
      })

      mapInstance.on('mouseleave', 'unclustered-point', () => {
        mapInstance.getCanvas().style.cursor = ''
      })

      // Cleanup function
      return () => {
        try {
          if (mapInstance.getLayer('clusters')) mapInstance.removeLayer('clusters')
          if (mapInstance.getLayer('cluster-count')) mapInstance.removeLayer('cluster-count')
          if (mapInstance.getLayer('unclustered-point'))
            mapInstance.removeLayer('unclustered-point')
          if (mapInstance.getSource('sightings-source'))
            mapInstance.removeSource('sightings-source')
        } catch (error) {
          console.error('Error in cleanup function:', error)
        }
      }
    } catch (error) {
      console.error('Error in native mode initialization:', error)
    }
  }, [mapLoaded, filteredSightings, visualizationMode, useTileset])

  // Handle tileset visualization mode
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || visualizationMode !== 'tileset' || !useTileset) return

    try {
      // Load the Mapbox tileset
      loadMapboxTileset()

      // @ts-ignore - Access map differently depending on react-map-gl version
      const mapInstance = mapRef.current.getMap
        ? mapRef.current.getMap()
        : mapRef.current._map
        ? mapRef.current._map
        : mapRef.current

      // Ensure the map is fully initialized and has required methods
      if (!mapInstance) {
        console.error('Map instance is not available yet')
        return
      }

      if (typeof mapInstance.getSource !== 'function') {
        console.error('Map instance does not have getSource method, map might not be fully loaded')
        return
      }

      // Remove any native clustering layers if they exist
      if (mapInstance.getSource('sightings-source')) {
        if (mapInstance.getLayer('clusters')) mapInstance.removeLayer('clusters')
        if (mapInstance.getLayer('cluster-count')) mapInstance.removeLayer('cluster-count')
        if (mapInstance.getLayer('unclustered-point')) mapInstance.removeLayer('unclustered-point')
        mapInstance.removeSource('sightings-source')
      }

      // Cleanup function
      return () => {
        try {
          if (mapInstance.getSource('sightings-tileset')) {
            if (mapInstance.getLayer('sightings-points'))
              mapInstance.removeLayer('sightings-points')
            mapInstance.removeSource('sightings-tileset')
          }
        } catch (error) {
          console.error('Error in tileset cleanup function:', error)
        }
      }
    } catch (error) {
      console.error('Error in tileset mode initialization:', error)
    }
  }, [mapLoaded, visualizationMode, useTileset, loadMapboxTileset])

  // Handle map initialization when the component mounts
  useEffect(() => {
    // Cancel if mapRef is not ready
    if (!mapRef.current) return

    let mounted = true
    let mapInstance = null

    // Function to safely get the map instance
    const getMapInstance = () => {
      try {
        if (!mapRef.current) return null

        // @ts-ignore - Access map differently depending on react-map-gl version
        return mapRef.current.getMap
          ? mapRef.current.getMap()
          : mapRef.current._map
          ? mapRef.current._map
          : mapRef.current
      } catch (error) {
        console.error('Error getting map instance:', error)
        return null
      }
    }

    // Function to handle map loaded state
    const handleMapLoad = () => {
      if (!mounted) return

      console.log('Map loaded successfully')

      // Double-check that we have a valid map instance with required methods
      const instance = getMapInstance()
      if (instance && typeof instance.getSource === 'function') {
        setMapLoaded(true)

        // If using tileset mode, load the Mapbox tileset
        if (useTileset) {
          setTimeout(() => {
            if (mounted) loadMapboxTileset()
          }, 100) // Small delay to ensure map is fully ready
        }
      } else {
        // If the map instance doesn't have getSource yet, try again after a short delay
        console.warn('Map instance loaded but methods not available yet, retrying...')
        setTimeout(() => {
          if (mounted) handleMapLoad()
        }, 100)
      }
    }

    // Get map instance and check its state
    const checkMapInstance = () => {
      mapInstance = getMapInstance()

      if (!mapInstance) {
        // If no instance yet, retry after a delay
        setTimeout(() => {
          if (mounted) checkMapInstance()
        }, 100)
        return
      }

      // Check if the map is already loaded
      if (typeof mapInstance.loaded === 'function' && mapInstance.loaded()) {
        handleMapLoad()
      } else if (typeof mapInstance.on === 'function') {
        // Listen for load event
        mapInstance.on('load', handleMapLoad)
      } else {
        // Fallback - retry after a short delay
        console.warn('Map instance has no loaded method, retrying...')
        setTimeout(() => {
          if (mounted) checkMapInstance()
        }, 100)
      }
    }

    // Start checking for map instance
    checkMapInstance()

    // Cleanup function
    return () => {
      mounted = false
      // Remove event listener if possible
      if (mapInstance && typeof mapInstance.off === 'function') {
        try {
          mapInstance.off('load', handleMapLoad)
        } catch (error) {
          console.error('Error cleaning up map event listener:', error)
        }
      }
    }
  }, [useTileset, loadMapboxTileset])

  // Create the deck.gl layers for the visualization (non-native)
  const buildVisualizationLayers = useCallback(() => {
    // Skip if we're not using deck.gl visualizations or if data is not ready
    if (
      !filteredSightings ||
      !filteredSightings.features ||
      visualizationMode === 'native' ||
      visualizationMode === 'tileset' ||
      !mapLoaded
    ) {
      return []
    }

    const layers = []

    // Make sure we have valid features
    if (!Array.isArray(filteredSightings.features) || filteredSightings.features.length === 0) {
      console.warn('No features found in filteredSightings')
      return []
    }

    // Validate data to ensure all features have proper coordinates
    const validFeatures = filteredSightings.features.filter((d: GeoJSONFeature) => {
      return (
        d &&
        d.geometry &&
        Array.isArray(d.geometry.coordinates) &&
        d.geometry.coordinates.length >= 2 &&
        !isNaN(d.geometry.coordinates[0]) &&
        !isNaN(d.geometry.coordinates[1])
      )
    })

    if (validFeatures.length === 0) {
      console.warn('No valid features with coordinates found')
      return []
    }

    // Add heatmap layer for density visualization
    if (visualizationMode === 'heatmap' || visualizationMode === 'both') {
      try {
        layers.push(
          new HeatmapLayer({
            id: 'heatmap-layer',
            data: validFeatures,
            getPosition: (d: GeoJSONFeature) => d.geometry.coordinates,
            getWeight: (d: GeoJSONFeature) => 1,
            radiusPixels: 40,
            intensity: 1,
            threshold: 0.05,
            colorRange: [
              [65, 182, 196, 25],
              [127, 205, 187, 85],
              [199, 233, 180, 127],
              [237, 248, 177, 170],
              [255, 255, 204, 255],
            ],
            pickable: true,
            autoHighlight: true,
            onClick: (info: any) => {
              if (info.object) {
                setPopupInfo({
                  coordinates: info.object.geometry.coordinates,
                  properties: info.object.properties,
                })
              }
            },
          })
        )
      } catch (error) {
        console.error('Error creating heatmap layer:', error)
      }
    }

    // Add scatterplot layer for individual sightings
    if (visualizationMode === 'scatter' || visualizationMode === 'both') {
      try {
        layers.push(
          new ScatterplotLayer({
            id: 'sightings-scatter',
            data: validFeatures,
            getPosition: (d: GeoJSONFeature) => d.geometry.coordinates,
            getFillColor: [255, 140, 0, 180],
            getRadius: (d: GeoJSONFeature) => 5000,
            radiusScale: 1,
            radiusMinPixels: 3,
            radiusMaxPixels: 15,
            pickable: true,
            autoHighlight: true,
            onClick: (info: any) => {
              if (info.object) {
                setPopupInfo({
                  coordinates: info.object.geometry.coordinates,
                  properties: info.object.properties,
                })
              }
            },
            onHover: (info: any) => {
              if (info.object) {
                setHoverInfo({
                  x: info.x,
                  y: info.y,
                  coordinates: info.object.geometry.coordinates,
                  properties: info.object.properties,
                })
              } else {
                setHoverInfo(null)
              }
            },
          })
        )
      } catch (error) {
        console.error('Error creating scatterplot layer:', error)
      }
    }

    // Add arc layers to connect related sightings
    if (visualizationMode === 'arcs' || visualizationMode === 'both') {
      try {
        // Generate connections between sightings that happened within a week of each other
        const connections = []
        // Limit for performance and avoid browser hanging
        const features = validFeatures.slice(0, Math.min(validFeatures.length, 100))

        for (let i = 0; i < features.length; i++) {
          const feature1 = features[i] as GeoJSONFeature
          const date1 = new Date(feature1.properties?.date || feature1.properties?.timestamp || 0)

          for (let j = i + 1; j < features.length; j++) {
            const feature2 = features[j] as GeoJSONFeature
            const date2 = new Date(feature2.properties?.date || feature2.properties?.timestamp || 0)

            // Only connect if within 7 days
            const timeDiff = Math.abs(date1.getTime() - date2.getTime())
            if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
              connections.push({
                source: feature1.geometry.coordinates,
                target: feature2.geometry.coordinates,
                sourceName: feature1.properties?.city || feature1.properties?.location,
                targetName: feature2.properties?.city || feature2.properties?.location,
                value: 1 + Math.random() * 2, // Randomize width slightly
                id: `arc-${i}-${j}`,
              })
            }
          }
        }

        if (connections.length > 0) {
          // Use animated arc layer if animation is enabled
          if (arcAnimationEnabled) {
            layers.push(
              new AnimatedArcGroupLayer({
                id: 'animated-arc-group',
                data: connections,
                getSourceColor: [0, 190, 255, 200],
                getTargetColor: [255, 100, 255, 200],
                getWidth: (d: any) => d.value || 2,
                getHeight: 1.5,
                fadeIn: true,
                fadeSpeed: 0.1,
                pickable: true,
                onClickArc: (info: any) => {
                  if (info.object) {
                    console.log('Arc clicked:', info.object)
                  }
                },
              })
            )
          } else {
            // Use the standalone animated arc layer
            layers.push(
              AnimatedArcLayer({
                id: 'animated-arcs',
                data: connections,
                getSourceColor: [0, 190, 255, 200],
                getTargetColor: [255, 100, 255, 200],
                getWidth: (d: any) => d.value || 2,
                visible: true,
                fadeIn: false,
              })
            )
          }
        } else {
          console.warn('No connections found for arc visualization')
        }
      } catch (error) {
        console.error('Error creating arc layer:', error)
      }
    }

    // Add hexagon layer for clustering visualization
    if (visualizationMode === 'hexagon') {
      try {
        layers.push(
          new HexagonLayer({
            id: 'hexagon-layer',
            data: validFeatures,
            getPosition: (d: GeoJSONFeature) => d.geometry.coordinates,
            radius: 50000, // in meters
            elevationScale: 100,
            extruded: true,
            coverage: 0.8,
            colorRange: [
              [65, 182, 196],
              [127, 205, 187],
              [199, 233, 180],
              [237, 248, 177],
              [255, 255, 204],
              [255, 237, 160],
            ],
            upperPercentile: 90,
            material: {
              ambient: 0.64,
              diffuse: 0.6,
              shininess: 32,
              specularColor: [51, 51, 51],
            },
            pickable: true,
            opacity: 0.8,
            autoHighlight: true,
            onClick: (info: any) => {
              if (info.object) {
                // For hexagons, we need to generate a descriptive popup
                const count = info.object.points.length
                // Calculate the center of the hexagon
                const center = info.coordinate

                setPopupInfo({
                  coordinates: center as [number, number],
                  properties: {
                    location: `Cluster of ${count} sightings`,
                    description: `This area contains ${count} UFO sightings within a 50km radius`,
                    timestamp: new Date().getTime(), // Current time as default
                  },
                })
              }
            },
          })
        )
      } catch (error) {
        console.error('Error creating hexagon layer:', error)
      }
    }

    // Add military bases if enabled
    if (showMilitaryBases && militaryBases && militaryBases.features) {
      try {
        // Validate military base data
        const validMilitaryBases = {
          ...militaryBases,
          features: militaryBases.features.filter((d: GeoJSONFeature) => {
            return (
              d &&
              d.geometry &&
              Array.isArray(d.geometry.coordinates) &&
              d.geometry.coordinates.length >= 2 &&
              !isNaN(d.geometry.coordinates[0]) &&
              !isNaN(d.geometry.coordinates[1])
            )
          }),
        }

        if (validMilitaryBases.features.length > 0) {
          layers.push(
            new GeoJsonLayer({
              id: 'military-bases',
              data: validMilitaryBases,
              filled: true,
              pointRadiusMinPixels: 3,
              pointRadiusScale: 2000,
              getFillColor: [0, 0, 128, 180],
              pickable: true,
              autoHighlight: true,
              onClick: (info: any) => {
                if (info.object) {
                  setPopupInfo({
                    coordinates: info.object.geometry.coordinates,
                    properties: info.object.properties,
                  })
                }
              },
            })
          )
        }
      } catch (error) {
        console.error('Error creating military bases layer:', error)
      }
    }

    // Add UFO posts if enabled
    if (showUFOPosts && ufoPosts && ufoPosts.features) {
      try {
        // Validate UFO posts data
        const validUFOPosts = {
          ...ufoPosts,
          features: ufoPosts.features.filter((d: GeoJSONFeature) => {
            return (
              d &&
              d.geometry &&
              Array.isArray(d.geometry.coordinates) &&
              d.geometry.coordinates.length >= 2 &&
              !isNaN(d.geometry.coordinates[0]) &&
              !isNaN(d.geometry.coordinates[1])
            )
          }),
        }

        if (validUFOPosts.features.length > 0) {
          layers.push(
            new GeoJsonLayer({
              id: 'ufo-posts',
              data: validUFOPosts,
              filled: true,
              pointRadiusMinPixels: 3,
              pointRadiusScale: 2000,
              getFillColor: [128, 0, 128, 180],
              pickable: true,
              autoHighlight: true,
              onClick: (info: any) => {
                if (info.object) {
                  setPopupInfo({
                    coordinates: info.object.geometry.coordinates,
                    properties: info.object.properties,
                  })
                }
              },
            })
          )
        }
      } catch (error) {
        console.error('Error creating UFO posts layer:', error)
      }
    }

    // Return the completed set of layers
    console.log(`Created ${layers.length} visualization layers for mode: ${visualizationMode}`)
    return layers
  }, [
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
  ])

  // Get current user's location
  const getUserLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapConfig({
            ...mapConfig,
            center: [position.coords.longitude, position.coords.latitude] as [number, number],
            zoom: [6] as [number],
          })
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    }
  }, [mapConfig])

  // Convert timestamp to readable date
  const formatDate = (timestamp: number | string | undefined) => {
    if (!timestamp) return 'Unknown date'
    const date = new Date(timestamp)
    return format(date, 'MMMM d, yyyy')
  }

  // Build visualization layers for deck.gl
  const deckLayers = useMemo(() => buildVisualizationLayers(), [buildVisualizationLayers])
  
  // Show loading indicator when fetching external data
  if (isLoadingExternalData) {
    return (
      <div className='h-screen w-screen relative flex items-center justify-center bg-gray-900'>
        <div className='text-white font-monumentMono text-xl p-4 bg-black bg-opacity-70 rounded-lg'>
          <div className='mb-2'>Loading sightings data from {SIGHTINGS_GEOJSON_PATH}...</div>
          <div className='h-1 w-full bg-gray-700 rounded-full overflow-hidden'>
            <div className='h-full bg-cyan-500 animate-pulse' style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen w-screen relative'>
      <MapGL
        ref={mapRef}
        style={`mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`}
        containerStyle={{height: '100vh', width: '100vw'}}
        {...mapConfig}
        renderChildrenInPortal={true}
        onStyleLoad={(map) => {
          // This is a hook that fires when the map style is loaded
          console.log('Map style loaded')
          // We don't set mapLoaded here because we need to wait for the map to be fully loaded
          // which is handled in the useEffect
        }}>
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
                  key={`sighting-${index}`}
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
            {militaryBases.features.map((feature: GeoJSONFeature, index: number) => (
              <Feature
                key={`base-${index}`}
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
            {ufoPosts.features.map((feature: GeoJSONFeature, index: number) => (
              <Feature
                key={`post-${index}`}
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
            <div className='p-2 max-w-md bg-black bg-opacity-80 text-white rounded-md border border-cyan-500/30'>
              <h3 className='text-lg font-bold mb-1 text-cyan-400'>
                {popupInfo.properties.city || popupInfo.properties.location || 'Unknown location'}
              </h3>
              <p className='text-sm mb-2'>
                {formatDate(popupInfo.properties.date || popupInfo.properties.timestamp)}
              </p>
              <p className='text-sm'>
                {popupInfo.properties.description ||
                  popupInfo.properties.comments ||
                  'No description available'}
              </p>
              {popupInfo.properties.sourceUrl && (
                <a
                  href={popupInfo.properties.sourceUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-cyan-400 underline mt-2 inline-block'>
                  Source
                </a>
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
                // Only load tileset if map is fully loaded
                if (mapLoaded) {
                  setTimeout(() => loadMapboxTileset(), 100)
                }
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
            <button
              type='button'
              onClick={() => setArcAnimationEnabled(!arcAnimationEnabled)}
              className={`px-3 py-1 rounded ${
                arcAnimationEnabled ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Arc Animation
            </button>
            <button
              type='button'
              onClick={() => setUseExtData(!useExtData)}
              className={`px-3 py-1 rounded ${
                useExtData ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              {isLoadingExternalData ? 'Loading...' : useExtData ? 'Full Dataset' : 'Mock Data'}
            </button>
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
            onClick={getUserLocation}
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Go to My Location
          </button>

          {/* Example locations for demo purposes */}
          <button
            type='button'
            onClick={() => flyToLocation(-112.074, 33.4484, 8)} // Phoenix Lights location
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Phoenix Lights
          </button>
          <button
            type='button'
            onClick={() => flyToLocation(-104.523, 33.3943, 8)} // Roswell location
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
        <p className='text-sm'>Showing {filteredSightings?.features.length || 0} sightings</p>
        <p className='text-sm'>
          Time range: {formatDate(timeRange[0])} - {formatDate(timeRange[1])}
        </p>
        {useExtData && (
          <p className='text-sm text-cyan-300 mt-2'>
            Using {sightings?.features.length || 0} sightings from external data
          </p>
        )}
      </div>
    </div>
  )
}
