'use client'

import {useRef, useMemo, useEffect, useCallback, useState} from 'react'
import {Canvas, useThree, useFrame} from '@react-three/fiber'
import {OrbitControls, Sphere, useTexture, Html} from '@react-three/drei'
import type {OrbitControls as OrbitControlsType} from 'three-stdlib'
import * as THREE from 'three'
import {Color} from 'three'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {AdaptiveRenderingLayers} from '../components/VisualizationLayers'

// Interface for location point data
interface GlobePoint {
  id: string
  lat: number
  lon: number
  color?: string
  size?: number
  label?: string
}

interface ClusterData {
  id: string
  count: number
  position: [number, number, number]
  color?: string
}

interface EarthProps {
  focusedLocation: {lat: number; lon: number} | null
  sightings?: ValidatedUAPSighting[]
  children?: React.ReactNode
}

// Helper function to check if coordinates are valid
function hasValidCoordinates(sighting: ValidatedUAPSighting | undefined): boolean {
  if (!sighting?.location?.coordinates) return false

  const {lat, lng} = sighting.location.coordinates
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

function Earth({focusedLocation, sightings = [], children}: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const controlsRef = useRef<OrbitControlsType>(null)
  const [hoveredPoint, setHoveredPoint] = useState<ValidatedUAPSighting | null>(null)
  const [cameraDistance, setCameraDistance] = useState(6)

  const {camera} = useThree()

  // Load Earth textures
  const [earthMap, earthNormalMap, earthSpecularMap, earthCloudsMap] = useTexture([
    '/assets/scenes/earth/textures/textures/Material_50_baseColor.jpeg',
    '/assets/scenes/earth/textures/textures/Material_50_normal.jpeg',
    '/assets/scenes/earth/textures/textures/Material_50_Roughness.jpeg',
    '/assets/scenes/earth/textures/textures/Material_50_Metallic.jpeg',
  ])

  // Create particles for the surrounding field
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 1000; i++) {
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const r = 2.5 + Math.random() * 0.2

      temp.push(
        r * Math.cos(phi) * Math.sin(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(theta)
      )
    }
    return new Float32Array(temp)
  }, [])

  // Custom shader for atmosphere
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: {value: new Color(0xffffff)},
        viewVector: {value: new THREE.Vector3(0, 0, 1)},
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 viewVector;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(color, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
  }, [])

  // Animation
  useFrame(({clock}) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.055
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02
    }

    // Update camera distance for adaptive rendering
    setCameraDistance(camera.position.length())
  })

  // Function to convert lat/lon to 3D coordinates
  const latLonToVector3 = useCallback((lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const z = radius * Math.sin(phi) * Math.sin(theta)
    const y = radius * Math.cos(phi)
    return new THREE.Vector3(x, y, z)
  }, [])

  // Effect to handle focused location changes
  useEffect(() => {
    if (focusedLocation && controlsRef.current) {
      const {lat, lon} = focusedLocation
      const point = latLonToVector3(lat, lon, 2)
      const distanceFromSurface = 2
      const cameraPosition = point
        .clone()
        .normalize()
        .multiplyScalar(2 + distanceFromSurface)

      // The controls are properly typed now
      const controls = controlsRef.current
      controls.enabled = false

      const duration = 1000 // Animation duration in milliseconds
      const startPosition = camera.position.clone()
      const startRotation = camera.quaternion.clone()
      const endRotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        point.clone().normalize()
      )

      let startTime: number | null = null
      const animate = (time: number) => {
        if (!startTime) startTime = time
        const progress = Math.min((time - startTime) / duration, 1)
        const easeProgress = progress * (2 - progress) // Ease out quadratic

        camera.position.lerpVectors(startPosition, cameraPosition, easeProgress)
        camera.quaternion.slerpQuaternions(startRotation, endRotation, easeProgress)
        camera.updateProjectionMatrix()

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Re-enable controls after animation
          if (controlsRef.current) {
            controlsRef.current.enabled = true
          }
        }
      }

      requestAnimationFrame(animate)
    }
  }, [focusedLocation, camera, latLonToVector3])

  // Generate clusters from sightings
  const clusters: ClusterData[] = useMemo(() => {
    if (!sightings?.length) return []

    // Simple clustering by city
    const cityMap = new Map<
      string,
      {
        count: number
        lat: number
        lon: number
        id: string
      }
    >()

    // Track stats for debugging
    let totalSightings = 0
    let sightingsWithCoordinates = 0
    let sightingsWithoutCoordinates = 0

    // Use for...of instead of forEach
    for (const sighting of sightings) {
      totalSightings++

      // Robust validation of coordinates
      const hasValidCoordinates =
        sighting?.location?.coordinates &&
        typeof sighting.location.coordinates.lat === 'number' &&
        typeof sighting.location.coordinates.lng === 'number' &&
        !isNaN(sighting.location.coordinates.lat) &&
        !isNaN(sighting.location.coordinates.lng)

      if (!hasValidCoordinates) {
        sightingsWithoutCoordinates++
        continue
      }

      sightingsWithCoordinates++

      // Safe access with null checks and defaults
      const coordinates = sighting.location.coordinates
      const lat = coordinates.lat
      const lng = coordinates.lng

      // Create a unique key for this location
      const cityKey = sighting.location.city
        ? sighting.location.city
        : `${lat.toFixed(2)},${lng.toFixed(2)}`

      if (cityMap.has(cityKey)) {
        const existing = cityMap.get(cityKey)
        if (existing) {
          existing.count++
        }
      } else {
        cityMap.set(cityKey, {
          count: 1,
          lat: lat,
          lon: lng,
          id: `cluster-${cityKey}`,
        })
      }
    }

    // Log statistics for debugging
    console.log(
      `🌎 Globe clustering: ${sightingsWithCoordinates}/${totalSightings} sightings have valid coordinates`
    )
    console.log(`🌎 Created ${cityMap.size} clusters from sightings data`)

    return Array.from(cityMap.values())
      .filter((cluster) => cluster.count > 1)
      .map((cluster) => ({
        id: cluster.id,
        count: cluster.count,
        position: [
          ((cluster.lon * Math.PI) / 180) * 2.01,
          ((cluster.lat * Math.PI) / 180) * 2.01,
          0.02,
        ] as [number, number, number],
        color: getClusterColor(cluster.count),
      }))
  }, [sightings])

  function getClusterColor(count: number): string {
    if (count > 10) return '#ff416c' // Red for large clusters
    if (count > 5) return '#ff9e40' // Orange for medium clusters
    return '#41b6c4' // Blue for small clusters
  }

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />

      {/* Earth */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          map={earthMap}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          shininess={5}
          specular={new Color(0xffffff)}
        />
      </Sphere>

      {/* Clouds */}
      <Sphere ref={cloudsRef} args={[2.005, 64, 64]}>
        <meshPhongMaterial
          map={earthCloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[2.1, 64, 64]} material={atmosphereMaterial} />

      {/* Adaptive rendering of sightings and clusters */}
      <AdaptiveRenderingLayers
        sightings={sightings}
        clusters={clusters}
        cameraDistance={cameraDistance}
        onPointHover={setHoveredPoint}
      />

      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={particles.length / 3}
            array={particles}
            itemSize={3}
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          color='#ffffff'
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {children}
    </>
  )
}

export default function Globe({
  focusedLocation,
  sightings,
  selectedYear,
}: {
  focusedLocation: {lat: number; lon: number} | null
  sightings?: ValidatedUAPSighting[]
  selectedYear?: number
}) {
  const [hoveredSighting, setHoveredSighting] = useState<ValidatedUAPSighting | null>(null)
  // Validate and filter sightings with coordinates for improved performance
  const validSightings = React.useMemo(() => {
    if (!sightings || sightings.length === 0) return []

    const valid = sightings.filter(
      (s) =>
        s?.location?.coordinates?.lat != null &&
        s?.location?.coordinates?.lng != null &&
        !isNaN(s.location.coordinates.lat) &&
        !isNaN(s.location.coordinates.lng)
    )

    console.log(`🌎 Globe: ${valid.length}/${sightings.length} sightings have valid coordinates`)
    return valid
  }, [sightings])

  // Provide fallback content when there are no valid sightings
  const renderFallbackMessage = !validSightings.length && sightings?.length > 0

  return (
    <div className="w-full h-full relative">
      {selectedYear && (
        <div className="absolute top-4 right-4 z-10 bg-black/70 border border-cyan-500/30 px-3 py-1 rounded-sm">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/80 animate-pulse" />
            <span className="text-white/80 font-monument-mono text-xs">
              YEAR: {selectedYear}
            </span>
          </div>
        </div>
      )}
      
      <Canvas
        camera={{position: [0, 0, 6], fov: 45}}
        gl={{alpha: true}}
        onCreated={(state) => {
          // Optimize rendering performance
          state.gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
        }}>
        <color attach='background' args={['#000000']} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} castShadow />

        <Earth focusedLocation={focusedLocation} sightings={validSightings} />

      {/* Optional: Add a tooltip for hovered sightings */}
      {hoveredSighting && (
        <Html position={[0, 0, 0]} style={{pointerEvents: 'none'}}>
          <div className='bg-black/80 text-white p-2 rounded-md text-xs'>
            <div className='font-bold'>{hoveredSighting.title || 'Sighting'}</div>
            <div>{hoveredSighting.location?.city || 'Unknown location'}</div>
            <div>{new Date(hoveredSighting.timestamp).toLocaleDateString()}</div>
          </div>
        </Html>
      )}

      {/* Fallback message when we have sightings but none with valid coordinates */}
      {renderFallbackMessage && (
        <Html center position={[0, 0, 0]}>
          <div className='bg-black/70 text-white p-4 rounded-md text-center max-w-md'>
            <h3 className='text-lg font-bold mb-2'>No mappable sightings</h3>
            <p>
              There are {sightings.length} sightings in this time range, but none have valid
              geographic coordinates.
            </p>
          </div>
        </Html>
      )}
    </Canvas>
    </div>
  )
}
