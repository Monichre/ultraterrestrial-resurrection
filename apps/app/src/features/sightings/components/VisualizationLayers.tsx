'use client'

import {type ReactNode, useRef} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {getZoomConfig} from '../hooks/useTimeSeriesVisualization'
import * as THREE from 'three'
import {debugLog} from '@/utils/logger'

// Type definitions for visualization components
interface ClusterData {
  id: string
  count: number
  position: [number, number, number]
  color?: string
}

interface PointsLayerProps {
  points: ValidatedUAPSighting[]
  maxPoints?: number
  onPointHover?: (point: ValidatedUAPSighting | null) => void
}

interface ClusterLayerProps {
  clusters: ClusterData[]
  minClusterSize?: number
  onClusterClick?: (cluster: ClusterData) => void
}

interface SightingPointProps {
  sighting: ValidatedUAPSighting
  position: [number, number, number]
  size?: number
  color?: string
  onHover?: (sighting: ValidatedUAPSighting | null) => void
}

interface ClusterPointProps {
  position: [number, number, number]
  count: number
  color?: string
  size?: number
  onClick?: () => void
}

// Utility function to convert lat/lon to proper 3D spherical coordinates
function latLonToSpherePosition(lat: number, lon: number, radius: number = 2.01): [number, number, number] {
  // Convert latitude and longitude to spherical coordinates
  const phi = (90 - lat) * (Math.PI / 180)  // Polar angle (from north pole)
  const theta = (lon + 180) * (Math.PI / 180)  // Azimuthal angle (from prime meridian)
  
  // Convert spherical to Cartesian coordinates
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  
  return [x, y, z]
}

// Component for rendering individual sighting point
export function SightingPoint({
  sighting,
  position,
  size = 0.02,
  color = '#ffffff',
  onHover,
}: SightingPointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Get color based on sighting type
  const pointColor =
    color ||
    (() => {
      switch (sighting.type) {
        case 'incident':
          return '#ff6b6b'  // Softer red
        case 'news':
          return '#ffd93d'  // Softer yellow
        case 'analysis':
          return '#6bcf7f'  // Softer green
        case 'sighting':
        default:
          return '#4ecdc4'  // Softer teal
      }
    })()

  // Adjust size based on sighting confidence
  const pointSize =
    size *
    (() => {
      switch (sighting.confidence) {
        case 'high':
          return 1.4
        case 'low':
          return 0.8
        case 'medium':
        default:
          return 1.0
      }
    })()

  return (
    <group>
      {/* Main sighting point */}
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => onHover?.(sighting)}
        onPointerOut={() => onHover?.(null)}>
        <sphereGeometry args={[pointSize, 16, 16]} />
        <meshBasicMaterial color={pointColor} transparent opacity={0.9} />
      </mesh>
      
      {/* Subtle glow effect */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[pointSize * 1.5, 16, 16]} />
        <meshBasicMaterial 
          color={pointColor} 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Pulsing ring for high confidence sightings */}
      {sighting.confidence === 'high' && (
        <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[pointSize * 1.8, pointSize * 2.2, 16]} />
          <meshBasicMaterial 
            color={pointColor} 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

// Component for rendering cluster of sightings
export function ClusterPoint({
  position,
  count,
  color = '#4ecdc4',
  size,
  onClick,
}: ClusterPointProps) {
  // Scale size based on count (logarithmic scale for better visualization)
  const clusterSize = size || Math.log(count + 1) * 0.025 + 0.05

  return (
    <group>
      {/* Main cluster sphere */}
      <mesh position={position} onClick={onClick}>
        <sphereGeometry args={[clusterSize, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} />
      </mesh>

      {/* Outer glow ring */}
      <mesh position={position}>
        <sphereGeometry args={[clusterSize * 1.4, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Animated ring around cluster */}
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[clusterSize * 1.6, clusterSize * 1.8, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.6} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  )
}

// Layer for rendering multiple sighting points
// Added robust validation and error handling for missing coordinates
export function PointsLayer({points, maxPoints = 200, onPointHover}: PointsLayerProps) {
  // Pre-filter points with valid coordinates for better performance
  const validPoints = points.filter(point => 
    point?.location?.coordinates?.lat != null && 
    point?.location?.coordinates?.lng != null &&
    !isNaN(point.location.coordinates.lat) &&
    !isNaN(point.location.coordinates.lng) &&
    point.location.coordinates.lat >= -90 &&
    point.location.coordinates.lat <= 90 &&
    point.location.coordinates.lng >= -180 &&
    point.location.coordinates.lng <= 180
  )

  // Log statistics about valid vs. invalid points for debugging
  if (points.length > 0) {
    debugLog(
      `🗺️ PointsLayer: ${validPoints.length}/${points.length} points have valid coordinates`
    )
  }

  // Limit number of points to render for performance
  const displayPoints = validPoints.slice(0, maxPoints)

  // Render nothing if we have no valid points
  if (displayPoints.length === 0) {
    console.log('⚠️ PointsLayer: No valid points to display')
    return null
  }

  return (
    <>
      {displayPoints.map((point) => {
        try {
          // Validate coordinates one more time to be absolutely sure
          if (
            !point.location?.coordinates?.lat || 
            !point.location?.coordinates?.lng ||
            isNaN(point.location.coordinates.lat) ||
            isNaN(point.location.coordinates.lng)
          ) {
            return null
          }

          // Convert lat/lon to proper 3D spherical position on globe surface
          const position = latLonToSpherePosition(
            point.location.coordinates.lat,
            point.location.coordinates.lng,
            2.02 // Slightly above the globe surface (globe radius is 2.0)
          )

          return (
            <SightingPoint
              key={point.id}
              sighting={point}
              position={position}
              onHover={onPointHover}
            />
          )
        } catch (error) {
           
          console.error(`Error rendering point ${point.id}:`, error)
          return null
        }
      })}
    </>
  )
}

// Layer for rendering sighting clusters
export function ClusterLayer({clusters, minClusterSize = 1, onClusterClick}: ClusterLayerProps) {
  // Filter clusters by minimum size
  const displayClusters = clusters.filter((cluster) => cluster.count >= minClusterSize)

  return (
    <>
      {displayClusters.map((cluster) => (
        <ClusterPoint
          key={cluster.id}
          position={cluster.position}
          count={cluster.count}
          color={cluster.color}
          onClick={() => onClusterClick?.(cluster)}
        />
      ))}
    </>
  )
}

// Component for adaptive rendering based on zoom level
export function AdaptiveRenderingLayers({
  sightings,
  clusters,
  cameraDistance,
  onPointHover,
  onClusterClick,
  children,
}: {
  sightings: ValidatedUAPSighting[]
  clusters: ClusterData[]
  cameraDistance: number
  onPointHover?: (point: ValidatedUAPSighting | null) => void
  onClusterClick?: (cluster: ClusterData) => void
  children?: ReactNode
}) {
  const config = getZoomConfig(cameraDistance)

  return (
    <>
      {/* Render clusters if appropriate for zoom level */}
      {(config.useAggregates || clusters.length > 0) && (
        <ClusterLayer
          clusters={clusters}
          minClusterSize={config.minClusterSize}
          onClusterClick={onClusterClick}
        />
      )}

      {/* Render individual points if appropriate for zoom level */}
      {config.showIndividualPoints && (
        <PointsLayer
          points={sightings}
          maxPoints={config.maxPointsToShow}
          onPointHover={onPointHover}
        />
      )}

      {children}
    </>
  )
}
