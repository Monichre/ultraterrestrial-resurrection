'use client'

import React, {useRef, useState, useMemo} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {OrbitControls, Sphere, useTexture, Stars, Html} from '@react-three/drei'
import * as THREE from 'three'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {OrbitalVisualizationSystem} from './OrbitalVisualizationSystem'

interface EnhancedOrbitalGlobeProps {
  sightings: ValidatedUAPSighting[]
  focusedLocation?: {lat: number; lon: number} | null
  onSightingSelect?: (sighting: ValidatedUAPSighting) => void
  showOrbitalLayers?: boolean
  showTethers?: boolean
  showAtmosphere?: boolean
  className?: string
}

// Enhanced Earth component with better materials and atmosphere
function EarthMesh({showAtmosphere = true}: {showAtmosphere?: boolean}) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)

  // Load Earth textures
  const [earthTexture, earthNormal, earthSpecular] = useTexture([
    '/assets/scenes/earth/textures/Material_50_baseColor.jpeg',
    '/assets/scenes/earth/textures/Material_50_normal.png',
    '/assets/scenes/earth/textures/Material_50_metallicRoughness.png',
  ])

  // Gentle rotation animation
  useFrame(({clock}) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.elapsedTime * 0.01
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = clock.elapsedTime * 0.008
    }
  })

  // Atmosphere shader material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: {value: new THREE.Color(0x4db8ff)},
        opacity: {value: 0.15},
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(color, intensity * opacity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    })
  }, [])

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          normalMap={earthNormal}
          specularMap={earthSpecular}
          shininess={100}
          transparent={false}
        />
      </mesh>

      {/* Atmosphere */}
      {showAtmosphere && (
        <mesh ref={atmosphereRef} scale={1.05}>
          <sphereGeometry args={[2.0, 32, 32]} />
          <primitive object={atmosphereMaterial} />
        </mesh>
      )}
    </group>
  )
}

// Camera controller for smooth transitions
function CameraController({
  focusedLocation,
}: {
  focusedLocation?: {lat: number; lon: number} | null
}) {
  const {camera} = useThree()

  // Auto-focus on location (implementation would go here)
  // For now, keeping it simple

  return null
}

// Orbital layer visualization controls
function OrbitalControls({
  orbitalLayers,
  onToggleLayer,
}: {
  orbitalLayers: Record<string, boolean>
  onToggleLayer: (layer: string) => void
}) {
  return (
    <Html position={[-4, 3, 0]} transform={false}>
      <div className='orbital-controls bg-black/70 border border-cyan-500/30 rounded-lg p-3'>
        <div className='text-cyan-400 font-monument-mono text-xs mb-2'>ORBITAL LAYERS</div>
        <div className='space-y-2'>
          {Object.entries(orbitalLayers).map(([layer, enabled]) => (
            <label key={layer} className='flex items-center gap-2 text-xs text-white/80'>
              <input
                type='checkbox'
                checked={enabled}
                onChange={() => onToggleLayer(layer)}
                className='w-3 h-3 accent-cyan-500'
              />
              <span className='capitalize'>{layer.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>
    </Html>
  )
}

// Enhanced orbital data summary
function OrbitalDataSummary({
  sightings,
  selectedSighting,
}: {
  sightings: ValidatedUAPSighting[]
  selectedSighting?: ValidatedUAPSighting | null
}) {
  const stats = useMemo(() => {
    const total = sightings.length
    const withCoords = sightings.filter((s) => s.location?.coordinates).length
    const recent = sightings.filter(
      (s) => Date.now() - new Date(s.timestamp).getTime() < 30 * 24 * 60 * 60 * 1000
    ).length

    return {total, withCoords, recent}
  }, [sightings])

  return (
    <Html position={[4, 3, 0]} transform={false}>
      <div className='orbital-data bg-black/70 border border-cyan-500/30 rounded-lg p-3 min-w-[250px]'>
        <div className='text-cyan-400 font-monument-mono text-xs mb-2'>ORBITAL DATA ANALYSIS</div>

        <div className='space-y-2 text-xs text-white/80'>
          <div className='flex justify-between'>
            <span>Total Sightings:</span>
            <span className='text-cyan-400'>{stats.total}</span>
          </div>
          <div className='flex justify-between'>
            <span>Geo-Located:</span>
            <span className='text-cyan-400'>{stats.withCoords}</span>
          </div>
          <div className='flex justify-between'>
            <span>Recent (30d):</span>
            <span className='text-cyan-400'>{stats.recent}</span>
          </div>
        </div>

        {selectedSighting && (
          <div className='mt-3 pt-3 border-t border-cyan-500/20'>
            <div className='text-cyan-400 font-monument-mono text-xs mb-1'>SELECTED</div>
            <div className='text-white text-sm'>{selectedSighting.title || 'Unknown Event'}</div>
            <div className='text-white/60 text-xs'>{selectedSighting.location?.city}</div>
          </div>
        )}
      </div>
    </Html>
  )
}

// Main enhanced orbital globe component
export function EnhancedOrbitalGlobe({
  sightings = [],
  focusedLocation,
  onSightingSelect,
  showOrbitalLayers = true,
  showTethers = true,
  showAtmosphere = true,
  className = '',
}: EnhancedOrbitalGlobeProps) {
  const [selectedSighting, setSelectedSighting] = useState<ValidatedUAPSighting | null>(null)
  const [orbitalLayers, setOrbitalLayers] = useState({
    surface_markers: true,
    tether_beams: showTethers,
    orbital_cards: showOrbitalLayers,
    data_summary: true,
  })

  const handleSightingSelect = (sighting: ValidatedUAPSighting) => {
    setSelectedSighting(sighting)
    onSightingSelect?.(sighting)
  }

  const toggleOrbitalLayer = (layer: string) => {
    setOrbitalLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  // Filter sightings with valid coordinates
  const validSightings = useMemo(() => {
    return sightings.filter(
      (s) => s.location?.coordinates?.lat != null && s.location?.coordinates?.lng != null
    )
  }, [sightings])

  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas
        camera={{position: [0, 0, 8], fov: 45}}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={(state) => {
          state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}>
        {/* Scene setup */}
        <color attach='background' args={['#000005']} />
        <Stars radius={300} depth={60} count={1000} factor={7} saturation={0} fade={true} />

        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <directionalLight
          position={[5, 3, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color='#4db8ff' />

        {/* Earth */}
        <EarthMesh showAtmosphere={showAtmosphere} />

        {/* Orbital visualization system */}
        {orbitalLayers.surface_markers && (
          <OrbitalVisualizationSystem
            sightings={validSightings}
            onSightingSelect={handleSightingSelect}
            showTethers={orbitalLayers.tether_beams}
            showOrbitalCards={orbitalLayers.orbital_cards}
          />
        )}

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.8}
          panSpeed={0.8}
          rotateSpeed={0.5}
          minDistance={3}
          maxDistance={20}
        />

        {/* Camera controller */}
        <CameraController focusedLocation={focusedLocation} />

        {/* UI overlays */}
        <OrbitalControls orbitalLayers={orbitalLayers} onToggleLayer={toggleOrbitalLayer} />

        {orbitalLayers.data_summary && (
          <OrbitalDataSummary sightings={validSightings} selectedSighting={selectedSighting} />
        )}
      </Canvas>

      {/* Loading state */}
      {validSightings.length === 0 && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
          <div className='text-center text-white'>
            <div className='text-cyan-400 font-monument-mono text-sm mb-2'>
              ORBITAL SYSTEM INITIALIZING
            </div>
            <div className='text-white/60 text-xs'>Processing sighting data...</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedOrbitalGlobe
