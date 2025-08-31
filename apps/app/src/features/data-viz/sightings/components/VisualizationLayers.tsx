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

// Component for rendering individual sighting point
export function SightingPoint({
  sighting,
  position,
  size = 0.03,
  color = '#ffffff',
  onHover,
}: SightingPointProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Get color based on sighting type
  const pointColor =
    color ||
    (() => {
      switch (sighting.type) {
        case 'incident':
          return '#ff4141'
        case 'news':
          return '#ffdd41'
        case 'analysis':
          return '#41ff8c'
        case 'sighting':
        default:
          return '#41b6c4'
      }
    })()

  // Adjust size based on sighting confidence
  const pointSize =
    size *
    (() => {
      switch (sighting.confidence) {
        case 'high':
          return 1.3
        case 'low':
          return 0.7
        case 'medium':
        default:
          return 1.0
      }
    })()

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => onHover?.(sighting)}
      onPointerOut={() => onHover?.(null)}>
      <sphereGeometry args={[pointSize, 16, 16]} />
      <meshBasicMaterial color={pointColor} transparent opacity={0.8} />
    </mesh>
  )
}

// Component for rendering cluster of sightings
export function ClusterPoint({
  position,
  count,
  color = '#41b6c4',
  size,
  onClick,
}: ClusterPointProps) {
  // Scale size based on count (logarithmic scale for better visualization)
  const clusterSize = size || Math.log(count + 1) * 0.02 + 0.04

  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[clusterSize, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />

      {/* Ring around cluster */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[clusterSize * 1.2, clusterSize * 1.3, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </mesh>
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
    !isNaN(point.location.coordinates.lng)
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

          // Convert lat/lon to 3D position
          const position: [number, number, number] = [
            ((point.location.coordinates.lng * Math.PI) / 180) * 2.01,
            ((point.location.coordinates.lat * Math.PI) / 180) * 2.01,
            0.03, // Slightly above globe surface
          ]

          return (
            <SightingPoint
              key={point.id}
              sighting={point}
              position={position}
              onHover={onPointHover}
            />
          )
        } catch (error) {
          // eslint-disable-next-line no-console
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
