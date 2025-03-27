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
});

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
export const SightingsGlobe = ({geoJSONSightings}: SightingsGlobeProps) => {
  const {sightings, militaryBases, ufoPosts} = geoJSONSightings
  const mapRef = useRef(null)
  
  // Map configuration
  const [mapConfig, setMapConfig] = useState({
    zoom: [3] as [number],
    center: [-98.5795, 39.8283] as [number, number],
    pitch: [45] as [number]
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
        zoom: [zoom] as [number]
      });
    },
    [mapConfig]
  )
  
  // Function to load Mapbox tileset for sightings
  const loadMapboxTileset = useCallback(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    // @ts-ignore - Access map differently depending on react-map-gl version
    const map = mapRef.current.getMap ? mapRef.current.getMap() : 
               (mapRef.current._map ? mapRef.current._map : mapRef.current);
    
    // Remove previous sources/layers if they exist
    if (map.getSource('sightings-tileset')) {
      if (map.getLayer('sightings-points')) map.removeLayer('sightings-points');
      map.removeSource('sightings-tileset');
    }
    
    // Add the tileset source
    map.addSource('sightings-tileset', {
      type: 'vector',
      url: 'mapbox://ellisliam.35z8vcnh'
    });
    
    // Add a layer for the sightings points
    map.addLayer({
      id: 'sightings-points',
      type: 'circle',
      source: 'sightings-tileset',
      'source-layer': 'sightings', // This should match your tileset source layer name
      paint: {
        'circle-radius': 6,
        'circle-color': '#ff8c00',
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.5)'
      }
    });
    
    // Add click handler for the points
    map.on('click', 'sightings-points', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        setPopupInfo({
          coordinates: feature.geometry.coordinates as [number, number],
          properties: feature.properties
        });
      }
    });
    
    // Change cursor on hover
    map.on('mouseenter', 'sightings-points', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'sightings-points', () => {
      map.getCanvas().style.cursor = '';
    });
  }, [mapRef.current, mapLoaded])

  // Apply time filter to native Mapbox layer when time range changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    // @ts-ignore - Access map differently depending on react-map-gl version
    const map = mapRef.current.getMap ? mapRef.current.getMap() : 
               (mapRef.current._map ? mapRef.current._map : mapRef.current);
               
    // Apply time filter for native visualization mode
    if (visualizationMode === 'native' && map.getSource('sightings-source')) {
      // Apply a filter to the layers based on the timeRange
      const timeFilter = ['all',
        ['>=', ['to-number', ['get', 'timestamp']], timeRange[0]],
        ['<=', ['to-number', ['get', 'timestamp']], timeRange[1]]
      ];
      
      map.setFilter('clusters', timeFilter);
      map.setFilter('cluster-count', timeFilter);
      map.setFilter('unclustered-point', timeFilter);
    }
    
    // Apply time filter for tileset visualization mode
    if (useTileset && map.getSource('sightings-tileset') && map.getLayer('sightings-points')) {
      // Apply a filter to the tileset layer based on the timeRange
      const timeFilter = ['all',
        ['>=', ['to-number', ['get', 'timestamp']], timeRange[0]],
        ['<=', ['to-number', ['get', 'timestamp']], timeRange[1]]
      ];
      
      map.setFilter('sightings-points', timeFilter);
    }
  }, [timeRange, mapLoaded, visualizationMode, useTileset]);

  // Add native Mapbox GL layer for sightings when using that mode
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || visualizationMode !== 'native') return;
    
    // Clean up any tileset layers if they exist
    if (useTileset) {
      setUseTileset(false);
      
      // @ts-ignore - Access map differently depending on react-map-gl version
      const map = mapRef.current.getMap ? mapRef.current.getMap() : 
                (mapRef.current._map ? mapRef.current._map : mapRef.current);
                
      // Remove tileset layers if they exist
      if (map.getSource('sightings-tileset')) {
        if (map.getLayer('sightings-points')) map.removeLayer('sightings-points');
        map.removeSource('sightings-tileset');
      }
    }
    
    // @ts-ignore - Access map differently depending on react-map-gl version
    const map = mapRef.current.getMap ? mapRef.current.getMap() : 
               (mapRef.current._map ? mapRef.current._map : mapRef.current);
    
    // Remove previous sources/layers if they exist
    if (map.getSource('sightings-source')) {
      if (map.getLayer('clusters')) map.removeLayer('clusters');
      if (map.getLayer('cluster-count')) map.removeLayer('cluster-count');
      if (map.getLayer('unclustered-point')) map.removeLayer('unclustered-point');
      map.removeSource('sightings-source');
    }
    
    // Add the sightings source with clustering enabled
    map.addSource('sightings-source', {
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
        other_count: ['+', ['case', 
          ['!', ['any', 
            ['==', ['get', 'shape'], 'Disc'], 
            ['==', ['get', 'shape'], 'Triangle'], 
            ['==', ['get', 'shape'], 'Sphere']
          ]], 
          1, 
          0
        ]]
      }
    });
    
    // Add a layer for the clusters
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'sightings-source',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          'rgba(65, 182, 196, 0.8)',
          20, 'rgba(127, 205, 187, 0.8)',
          100, 'rgba(199, 233, 180, 0.8)',
          500, 'rgba(255, 255, 204, 0.8)'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20, 20, 30, 100, 40, 500, 50
        ],
        'circle-blur': 0.3,
        'circle-opacity': 0.8
      }
    });
    
    // Add a layer for cluster counts
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'sightings-source',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 12
      },
      paint: {
        'text-color': '#ffffff'
      }
    });
    
    // Add a layer for individual points
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'sightings-source',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': 'rgba(255, 140, 0, 0.8)',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.5)'
      }
    });
    
    // Handle clicks on clusters
    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      if (!features.length) return;
      
      const clusterId = features[0].properties.cluster_id;
      const pointCount = features[0].properties.point_count;
      const clusterProperties = features[0].properties;
      
      // If it's a small cluster, just zoom to it
      if (pointCount < 20) {
        map.getSource('sightings-source').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            
            // Animate flyTo with some rotation for a more engaging effect
            map.flyTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
              bearing: Math.random() * 40 - 20, // Random slight rotation
              pitch: 50,
              duration: 2000,
              essential: true
            });
          }
        );
      } else {
        // For larger clusters, show a popup with cluster info before zooming
        const discCount = clusterProperties.disc_count || 0;
        const triangleCount = clusterProperties.triangle_count || 0;
        const sphereCount = clusterProperties.sphere_count || 0;
        const otherCount = clusterProperties.other_count || 0;
        
        setPopupInfo({
          coordinates: features[0].geometry.coordinates as [number, number],
          properties: {
            cluster: true,
            pointCount: pointCount,
            discCount, triangleCount, sphereCount, otherCount,
            // Generate a description for the cluster
            description: `Cluster of ${pointCount} sightings including ${discCount} disc-shaped, ${triangleCount} triangular, ${sphereCount} spherical, and ${otherCount} other shaped objects.`,
            // Use the location name from the map
            location: `Sightings Cluster`,
            timestamp: clusterProperties.avg_timestamp / pointCount // Approximate average time
          }
        });
        
        // After 1.5 seconds, zoom in
        setTimeout(() => {
          map.getSource('sightings-source').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return;
              
              map.flyTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
                bearing: Math.random() * 40 - 20,
                pitch: 50,
                duration: 2000
              });
            }
          );
        }, 1500);
      }
    });
    
    // Handle clicks on individual points
    map.on('click', 'unclustered-point', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        setPopupInfo({
          coordinates: feature.geometry.coordinates as [number, number],
          properties: feature.properties
        });
      }
    });
    
    // Change cursor on hover
    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });
    
    map.on('mouseenter', 'unclustered-point', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = '';
    });
    
    // Cleanup function
    return () => {
      if (map.getLayer('clusters')) map.removeLayer('clusters');
      if (map.getLayer('cluster-count')) map.removeLayer('cluster-count');
      if (map.getLayer('unclustered-point')) map.removeLayer('unclustered-point');
      if (map.getSource('sightings-source')) map.removeSource('sightings-source');
    };
  }, [mapRef.current, mapLoaded, filteredSightings, visualizationMode, useTileset]);
  
  // Handle tileset visualization mode
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || visualizationMode !== 'tileset' || !useTileset) return;
    
    // Load the Mapbox tileset
    loadMapboxTileset();
    
    // @ts-ignore - Access map differently depending on react-map-gl version
    const map = mapRef.current.getMap ? mapRef.current.getMap() : 
              (mapRef.current._map ? mapRef.current._map : mapRef.current);
    
    // Remove any native clustering layers if they exist
    if (map.getSource('sightings-source')) {
      if (map.getLayer('clusters')) map.removeLayer('clusters');
      if (map.getLayer('cluster-count')) map.removeLayer('cluster-count');
      if (map.getLayer('unclustered-point')) map.removeLayer('unclustered-point');
      map.removeSource('sightings-source');
    }
    
    // Cleanup function
    return () => {
      if (map.getSource('sightings-tileset')) {
        if (map.getLayer('sightings-points')) map.removeLayer('sightings-points');
        map.removeSource('sightings-tileset');
      }
    };
  }, [mapRef.current, mapLoaded, visualizationMode, useTileset, loadMapboxTileset]);

  // Handle map initialization when the component mounts
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Store the map instance for later use
    const map = mapRef.current;
    
    // Set the map to be loaded
    setMapLoaded(true);
    
    // If using tileset mode, load the Mapbox tileset
    if (useTileset) {
      loadMapboxTileset();
    }
  }, [mapRef.current, useTileset, loadMapboxTileset]);

  // Create the deck.gl layers for the visualization (non-native)
  const buildVisualizationLayers = () => {
    if (!filteredSightings || visualizationMode === 'native' || visualizationMode === 'tileset') return []

    const layers = []

    // Add heatmap layer for density visualization
    if (visualizationMode === 'heatmap') {
      layers.push(
        new HeatmapLayer({
          id: 'heatmap-layer',
          data: filteredSightings.features,
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
        })
      )
    }

    // Add scatterplot layer for individual sightings
    if (visualizationMode === 'scatter' || visualizationMode === 'both') {
      layers.push(
        new ScatterplotLayer({
          id: 'sightings-scatter',
          data: filteredSightings.features,
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
              setSelectedFeature({
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
    }

    // Add arc layers to connect related sightings
    if (visualizationMode === 'arcs' || visualizationMode === 'both') {
      // Generate connections between sightings that happened within a week of each other
      const connections = []
      const features = filteredSightings.features.slice(0, 100) // Limit for performance

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
    }

    // Add hexagon layer for clustering visualization
    if (visualizationMode === 'hexagon') {
      layers.push(
        new HexagonLayer({
          id: 'hexagon-layer',
          data: filteredSightings.features,
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
        })
      )
    }

    // Add military bases if enabled
    if (showMilitaryBases && militaryBases) {
      layers.push(
        new GeoJsonLayer({
          id: 'military-bases',
          data: militaryBases,
          filled: true,
          pointRadiusMinPixels: 3,
          pointRadiusScale: 2000,
          getFillColor: [0, 0, 128, 180],
          pickable: true,
          autoHighlight: true,
          onClick: (info: any) => {
            if (info.object) {
              setSelectedFeature({
                coordinates: info.object.geometry.coordinates,
                properties: info.object.properties,
              })
            }
          },
        })
      )
    }

    // Add UFO posts if enabled
    if (showUFOPosts && ufoPosts) {
      layers.push(
        new GeoJsonLayer({
          id: 'ufo-posts',
          data: ufoPosts,
          filled: true,
          pointRadiusMinPixels: 3,
          pointRadiusScale: 2000,
          getFillColor: [128, 0, 128, 180],
          pickable: true,
          autoHighlight: true,
          onClick: (info: any) => {
            if (info.object) {
              setSelectedFeature({
                coordinates: info.object.geometry.coordinates,
                properties: info.object.properties,
              })
            }
          },
        })
      )
    }

    return layers
  }

  // Get current user's location
  const getUserLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapConfig({
            ...mapConfig,
            center: [position.coords.longitude, position.coords.latitude] as [number, number],
            zoom: [6] as [number]
          });
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

  return (
    <div className='h-screen w-screen relative'>
      <MapGL
        ref={mapRef}
        style="mapbox://styles/mapbox/dark-v11"
        containerStyle={{ height: '100vh', width: '100vw' }}
        {...mapConfig}
        renderChildrenInPortal={true}
      >
        {/* Navigation controls */}
        <ZoomControl position="top-left" />
        
        {/* Add custom layers based on visualization mode - not needed for native clustering or tileset */}
        {visualizationMode !== 'native' && visualizationMode !== 'tileset' && filteredSightings && (
          <Layer
            type="circle"
            id="sightings-layer"
            paint={{
              'circle-radius': 6,
              'circle-color': '#ff8c00',
              'circle-opacity': 0.8,
              'circle-stroke-width': 2,
              'circle-stroke-color': 'rgba(255, 255, 255, 0.5)'
            }}
          >
            {filteredSightings.features.map((feature: GeoJSONFeature, index: number) => (
              <Feature 
                key={`sighting-${index}`}
                coordinates={feature.geometry.coordinates as [number, number]}
                onClick={() => setPopupInfo({
                  coordinates: feature.geometry.coordinates as [number, number],
                  properties: feature.properties
                })}
              />
            ))}
          </Layer>
        )}
        
        {/* Military bases layer */}
        {showMilitaryBases && militaryBases && (
          <Layer
            type="circle"
            id="military-bases-layer"
            paint={{
              'circle-radius': 8,
              'circle-color': '#0000ff',
              'circle-opacity': 0.7,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff'
            }}
          >
            {militaryBases.features.map((feature: GeoJSONFeature, index: number) => (
              <Feature 
                key={`base-${index}`}
                coordinates={feature.geometry.coordinates as [number, number]}
                onClick={() => setPopupInfo({
                  coordinates: feature.geometry.coordinates as [number, number],
                  properties: feature.properties
                })}
              />
            ))}
          </Layer>
        )}
        
        {/* UFO posts layer */}
        {showUFOPosts && ufoPosts && (
          <Layer
            type="circle"
            id="ufo-posts-layer"
            paint={{
              'circle-radius': 5,
              'circle-color': '#8000ff',
              'circle-opacity': 0.7,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff'
            }}
          >
            {ufoPosts.features.map((feature: GeoJSONFeature, index: number) => (
              <Feature 
                key={`post-${index}`}
                coordinates={feature.geometry.coordinates as [number, number]}
                onClick={() => setPopupInfo({
                  coordinates: feature.geometry.coordinates as [number, number],
                  properties: feature.properties
                })}
              />
            ))}
          </Layer>
        )}

        {/* Popup for selected feature */}
        {popupInfo && (
          <Popup
            coordinates={popupInfo.coordinates}
            offset={[0, -15]}
            onClick={() => setPopupInfo(null)}
          >
            <div className='p-2 max-w-md bg-black bg-opacity-80 text-white rounded-md border border-cyan-500/30'>
              <h3 className='text-lg font-bold mb-1 text-cyan-400'>
                {popupInfo.properties.city ||
                  popupInfo.properties.location ||
                  'Unknown location'}
              </h3>
              <p className='text-sm mb-2'>
                {formatDate(
                  popupInfo.properties.date || popupInfo.properties.timestamp
                )}
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
              onClick={() => setVisualizationMode('native')}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'native' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Mapbox Clusters
            </button>
            <button
              type='button'
              onClick={() => {
                setVisualizationMode('tileset');
                setUseTileset(true);
                loadMapboxTileset();
              }}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'tileset' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Mapbox Tileset
            </button>
            <button
              type='button'
              onClick={() => setVisualizationMode('heatmap')}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'heatmap' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Heatmap
            </button>
            <button
              type='button'
              onClick={() => setVisualizationMode('hexagon')}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'hexagon' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              3D Clusters
            </button>
            <button
              type='button'
              onClick={() => setVisualizationMode('scatter')}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'scatter' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Points
            </button>
            <button
              type='button'
              onClick={() => setVisualizationMode('arcs')}
              className={`px-3 py-1 rounded ${
                visualizationMode === 'arcs' ? 'bg-cyan-500 text-black' : 'bg-gray-700'
              }`}>
              Connections
            </button>
            <button
              type='button'
              onClick={() => setVisualizationMode('both')}
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
            onClick={() => flyToLocation(-112.0740, 33.4484, 8)} // Phoenix Lights location
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Phoenix Lights
          </button>
          <button
            type='button'
            onClick={() => flyToLocation(-104.5230, 33.3943, 8)} // Roswell location
            className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
            Roswell
          </button>
          <button
            type='button'
            onClick={() => {
              setVisualizationMode('native');
              setMapConfig({
                center: [-98.5795, 39.8283] as [number, number],
                zoom: [3] as [number],
                pitch: [45] as [number]
              });
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
      </div>
    </div>
  )
}
