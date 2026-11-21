'use client'

import React, {useRef, useMemo, useState} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {Html} from '@react-three/drei'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'

// Configuration for orbital layers
const ORBITAL_CONFIG = {
  EARTH_RADIUS: 2.0,
  SURFACE_OFFSET: 0.01, // Very close to surface
  LOW_ORBIT: 2.8, // Recent/priority data
  MID_ORBIT: 3.4, // Clusters & aggregations
  HIGH_ORBIT: 4.2, // Historical patterns
  TETHER_COLOR: '#00ff88',
  ORBITAL_SPEED: 0.001,
} as const

interface OrbitalPoint {
  id: string
  surfacePosition: [number, number, number]
  orbitalPosition: [number, number, number]
  data: ValidatedUAPSighting
  orbitRadius: number
  orbitPhase: number
  dataRichness: number // 0-1 scale affects orbit height
}

interface OrbitalVisualizationProps {
  sightings: ValidatedUAPSighting[]
  onSightingSelect?: (sighting: ValidatedUAPSighting) => void
  showTethers?: boolean
  showOrbitalCards?: boolean
  animationSpeed?: number
}

// Convert lat/lon to 3D surface position
function latLonToSurface(
  lat: number,
  lon: number,
  radius: number = ORBITAL_CONFIG.EARTH_RADIUS
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return [x, y, z]
}

// Convert surface position to orbital position with altitude
function surfaceToOrbital(
  surfacePos: [number, number, number],
  orbitRadius: number,
  phase: number = 0
): [number, number, number] {
  const [x, y, z] = surfacePos
  const surfaceLength = Math.sqrt(x * x + y * y + z * z)
  const scale = orbitRadius / surfaceLength

  // Add slight orbital drift based on phase
  const orbitalOffset = phase * 0.2

  return [
    x * scale + Math.sin(phase) * 0.1,
    y * scale + Math.cos(phase) * 0.1,
    z * scale + orbitalOffset * 0.05,
  ]
}

// Calculate data richness score for orbital positioning
function calculateDataRichness(sighting: ValidatedUAPSighting): number {
  let score = 0

  // Recency factor (newer = higher orbit)
  const ageInDays = (Date.now() - new Date(sighting.timestamp).getTime()) / (1000 * 60 * 60 * 24)
  score += Math.max(0, (365 - ageInDays) / 365) * 0.4

  // Data completeness based on available properties
  if (sighting.content && sighting.content.length > 50) score += 0.2
  if (sighting.confidence && sighting.confidence === 'high') score += 0.2
  if (sighting.sourceUrl) score += 0.1
  if (sighting.mediaUrls && sighting.mediaUrls.length > 0) score += 0.1

  return Math.min(1, score)
}

// Surface marker component
function SurfaceMarker({
  position,
  sighting,
  onClick,
  isSelected = false,
}: {
  position: [number, number, number]
  sighting: ValidatedUAPSighting
  onClick?: () => void
  isSelected?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({clock}) => {
    if (meshRef.current && isSelected) {
      // Gentle pulsing animation for selected markers
      const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.2
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = 'pointer'))}
      onPointerOut={() => (document.body.style.cursor = 'auto')}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color={isSelected ? '#ff6b6b' : '#00ff88'} transparent opacity={0.8} />
    </mesh>
  )
}

// Tether beam connecting surface to orbital element
function TetherBeam({
  start,
  end,
  color = ORBITAL_CONFIG.TETHER_COLOR,
  opacity = 0.3,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  opacity?: number
}) {
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end]
  )

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          array={new Float32Array([...start, ...end])}
          count={2}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

// Orbital data card component
function OrbitalDataCard({
  position,
  sighting,
  orbitRadius,
  phase,
}: {
  position: [number, number, number]
  sighting: ValidatedUAPSighting
  orbitRadius: number
  phase: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({clock}) => {
    if (groupRef.current) {
      // Gentle orbital motion
      const newPhase = phase + clock.elapsedTime * ORBITAL_CONFIG.ORBITAL_SPEED
      const newPos = surfaceToOrbital(
        latLonToSurface(sighting.location!.coordinates!.lat, sighting.location!.coordinates!.lng),
        orbitRadius,
        newPhase
      )
      groupRef.current.position.set(...newPos)

      // Always face camera (billboard effect)
      groupRef.current.lookAt(0, 0, 0)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Html
        transform
        occlude
        style={{
          transition: 'all 0.2s',
          opacity: 0.9,
          transform: 'translate3d(-50%, -50%, 0)',
        }}>
        <div className='orbital-card bg-black/80 border border-cyan-500/30 rounded-lg p-3 min-w-[200px] max-w-[250px]'>
          <div className='text-cyan-400 font-monument-mono text-xs mb-1'>
            {sighting.type?.toUpperCase() || 'UAP SIGHTING'}
          </div>
          <div className='text-white text-sm font-medium mb-2'>
            {sighting.title || 'Unknown Event'}
          </div>
          <div className='space-y-1 text-xs text-white/70'>
            <div>📍 {sighting.location?.city || 'Unknown Location'}</div>
            <div>📅 {new Date(sighting.timestamp).toLocaleDateString()}</div>
            {sighting.confidence && <div>🎯 Confidence: {sighting.confidence}</div>}
            {sighting.source && <div>📡 Source: {sighting.source}</div>}
          </div>

          {/* Data richness indicator */}
          <div className='mt-2 flex items-center gap-1'>
            <div className='text-xs text-white/50'>Data:</div>
            <div className='flex gap-1'>
              {Array.from({length: 5}).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    i < calculateDataRichness(sighting) * 5 ? 'bg-cyan-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Main orbital visualization system
export function OrbitalVisualizationSystem({
  sightings,
  onSightingSelect,
  showTethers = true,
  showOrbitalCards = true,
  animationSpeed = 1,
}: OrbitalVisualizationProps) {
  const [selectedSighting, setSelectedSighting] = useState<ValidatedUAPSighting | null>(null)

  // Process sightings into orbital points
  const orbitalPoints = useMemo<OrbitalPoint[]>(() => {
    return sightings
      .filter((s) => s.location?.coordinates?.lat && s.location?.coordinates?.lng)
      .map((sighting, index) => {
        const dataRichness = calculateDataRichness(sighting)

        // Determine orbit radius based on data richness
        const orbitRadius =
          ORBITAL_CONFIG.LOW_ORBIT +
          dataRichness * (ORBITAL_CONFIG.HIGH_ORBIT - ORBITAL_CONFIG.LOW_ORBIT)

        const surfacePosition = latLonToSurface(
          sighting.location!.coordinates!.lat,
          sighting.location!.coordinates!.lng,
          ORBITAL_CONFIG.EARTH_RADIUS + ORBITAL_CONFIG.SURFACE_OFFSET
        )

        const orbitalPosition = surfaceToOrbital(
          surfacePosition,
          orbitRadius,
          index * 0.1 // Stagger orbital phases
        )

        return {
          id: sighting.id,
          surfacePosition,
          orbitalPosition,
          data: sighting,
          orbitRadius,
          orbitPhase: index * 0.1,
          dataRichness,
        }
      })
  }, [sightings])

  const handleSightingClick = (sighting: ValidatedUAPSighting) => {
    setSelectedSighting(sighting)
    onSightingSelect?.(sighting)
  }

  return (
    <group>
      {/* Surface markers */}
      {orbitalPoints.map((point) => (
        <SurfaceMarker
          key={`surface-${point.id}`}
          position={point.surfacePosition}
          sighting={point.data}
          onClick={() => handleSightingClick(point.data)}
          isSelected={selectedSighting?.id === point.id}
        />
      ))}

      {/* Tether beams */}
      {showTethers &&
        orbitalPoints.map((point) => (
          <TetherBeam
            key={`tether-${point.id}`}
            start={point.surfacePosition}
            end={point.orbitalPosition}
            opacity={selectedSighting?.id === point.id ? 0.8 : 0.3}
          />
        ))}

      {/* Orbital data cards */}
      {showOrbitalCards &&
        orbitalPoints.map((point) => (
          <OrbitalDataCard
            key={`orbital-${point.id}`}
            position={point.orbitalPosition}
            sighting={point.data}
            orbitRadius={point.orbitRadius}
            phase={point.orbitPhase}
          />
        ))}
    </group>
  )
}

export default OrbitalVisualizationSystem
