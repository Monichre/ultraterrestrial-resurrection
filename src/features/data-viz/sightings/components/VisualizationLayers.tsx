'use client'

import {type ReactNode, useRef} from 'react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {getZoomConfig} from '../hooks/useTimeSeriesVisualization'
import * as THREE from 'three'

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
export function PointsLayer({points, maxPoints = 200, onPointHover}: PointsLayerProps) {
  // Limit number of points to render for performance
  const displayPoints = points.slice(0, maxPoints)

  return (
    <>
      {displayPoints.map((point) => {
        if (!point.location.coordinates) return null

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
