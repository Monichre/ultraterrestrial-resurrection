'use client'

import {useCallback} from 'react'
import {GeoJsonLayer, HexagonLayer, HeatmapLayer, ScatterplotLayer} from 'deck.gl'
import {scaleLog} from 'd3-scale'
import type {GeoJSONFeature, FeatureInfo} from '../types'
import AnimatedArcGroupLayer from '../animated-arc-group-layer'
import {AnimatedArcLayer} from '../animated-arc-layer'

type PopupInfoSetter = (info: FeatureInfo | null) => void
type HoverInfoSetter = (info: (FeatureInfo & {x: number; y: number}) | null) => void

interface UseVisualizationLayersProps {
  filteredSightings: GeoJSON.FeatureCollection | null
  visualizationMode: string
  mapLoaded: boolean
  showMilitaryBases: boolean
  showUFOPosts: boolean
  arcAnimationEnabled: boolean
  militaryBases?: GeoJSON.FeatureCollection | null
  ufoPosts?: GeoJSON.FeatureCollection | null
  setPopupInfo: PopupInfoSetter
  setHoverInfo: HoverInfoSetter
}

/**
 * Hook to build deck.gl visualization layers
 */
export function useVisualizationLayers({
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
}: UseVisualizationLayersProps) {
  // Create a color scale for the heatmap
  const colorScale = useCallback(
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

  // Build visualization layers for deck.gl based on current mode
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
    const validFeatures = filteredSightings.features.filter((d: any) => {
      return (
        d?.geometry &&
        Array.isArray(d.geometry.coordinates) &&
        d.geometry.coordinates.length >= 2 &&
        !Number.isNaN(d.geometry.coordinates[0]) &&
        !Number.isNaN(d.geometry.coordinates[1])
      )
    }) as GeoJSONFeature[]

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
            getWeight: () => 1,
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
            getRadius: () => 5000,
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
          const feature1 = features[i]
          const date1 = new Date(feature1.properties?.date || feature1.properties?.timestamp || 0)

          for (let j = i + 1; j < features.length; j++) {
            const feature2 = features[j]
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
          features: militaryBases.features.filter((d: any) => {
            return (
              d?.geometry &&
              Array.isArray(d.geometry.coordinates) &&
              d.geometry.coordinates.length >= 2 &&
              !Number.isNaN(d.geometry.coordinates[0]) &&
              !Number.isNaN(d.geometry.coordinates[1])
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
          features: ufoPosts.features.filter((d: any) => {
            return (
              d?.geometry &&
              Array.isArray(d.geometry.coordinates) &&
              d.geometry.coordinates.length >= 2 &&
              !Number.isNaN(d.geometry.coordinates[0]) &&
              !Number.isNaN(d.geometry.coordinates[1])
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

  return {buildVisualizationLayers}
}
