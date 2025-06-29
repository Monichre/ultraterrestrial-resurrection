"use client"

import { useRef, useMemo, useState, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function GlobeObject() {
  const globeRef = useRef<THREE.Group>(null)
  const dotsRef = useRef<THREE.Points>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)

  // Create the globe geometry
  const globeGeometry = useMemo(() => new THREE.SphereGeometry(2, 64, 64), [])

  // Create the atmosphere geometry
  const atmosphereGeometry = useMemo(() => new THREE.SphereGeometry(2.1, 64, 64), [])

  // Create the glow geometry
  const glowGeometry = useMemo(() => new THREE.SphereGeometry(2.15, 32, 32), [])

  // Create the dots for the globe
  const { positions, sizes } = useMemo(() => {
    const positions = []
    const sizes = []

    // Create random dots on the surface of the sphere
    for (let i = 0; i < 2500; i++) {
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const r = 2 + Math.random() * 0.02

      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)

      positions.push(x, y, z)
      sizes.push(Math.random() * 0.5 + 0.1)
    }

    return {
      positions: new Float32Array(positions),
      sizes: new Float32Array(sizes),
    }
  }, [])

  // Create the rings
  const rings = useMemo(() => {
    const rings = []
    const ringCount = 3

    for (let i = 0; i < ringCount; i++) {
      const radius = 2.3 + i * 0.2
      const segments = 128
      const ringGeometry = new THREE.RingGeometry(radius, radius + 0.03, segments)
      rings.push(ringGeometry)
    }

    return rings
  }, [])

  // Custom shader for the globe
  const globeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#ffffff") },
        gridColor: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 gridColor;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          // Grid pattern
          float latitude = acos(vNormal.y);
          float longitude = atan(vNormal.z, vNormal.x);
          
          float latGrid = smoothstep(0.03, 0.02, abs(mod(latitude * 10.0, 1.0) - 0.5));
          float lonGrid = smoothstep(0.03, 0.02, abs(mod(longitude * 20.0, 1.0) - 0.5));
          
          float grid = max(latGrid, lonGrid) * 0.5;
          
          // Base color with grid overlay
          vec3 baseColor = color * 0.3;
          vec3 finalColor = mix(baseColor, gridColor, grid);
          
          // Fresnel effect for edge glow
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          finalColor += color * fresnel * 0.5;
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
      transparent: true,
    })
  }, [])

  // Custom shader for the atmosphere
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: `
        varying vec3 vNormal;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vNormal;
        
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(color, intensity * 0.3);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
  }, [])

  // Custom shader for the glow
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: `
        varying vec3 vNormal;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vNormal;
        
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
          gl_FragColor = vec4(color, intensity * 0.5);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
  }, [])

  // Animation
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.1
    }

    if (dotsRef.current) {
      dotsRef.current.rotation.y = time * 0.08
    }

    if (atmosphereRef.current && atmosphereRef.current.material instanceof THREE.ShaderMaterial) {
      atmosphereRef.current.material.uniforms.time.value = time
    }

    if (glowRef.current && glowRef.current.material instanceof THREE.ShaderMaterial) {
      glowRef.current.material.uniforms.time.value = time
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.PI / 2
      ringsRef.current.rotation.y = time * 0.05
    }
  })

  return (
    <>
      {/* Globe */}
      <group ref={globeRef}>
        <mesh geometry={globeGeometry} material={globeMaterial} />
      </group>

      {/* Dots */}
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef} geometry={atmosphereGeometry} material={atmosphereMaterial} />

      {/* Glow */}
      <mesh ref={glowRef} geometry={glowGeometry} material={glowMaterial} scale={[1.2, 1.2, 1.2]} />

      {/* Rings */}
      <group ref={ringsRef}>
        {rings.map((ringGeometry, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={ringGeometry} attach="geometry" />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3 - i * 0.05} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Equatorial ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.35, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

// Interactive markers for locations
function LocationMarkers({
  locations = [],
  onHover,
}: {
  locations: Array<{ name: string; lat: number; lon: number }>
  onHover: (location: { lat: number; lon: number } | null) => void
}) {
  const markersRef = useRef<THREE.Group>(null)

  // Convert lat/lon to 3D coordinates
  const markers = useMemo(() => {
    if (!locations || locations.length === 0) return []

    return locations.map((location) => {
      const { lat, lon } = location
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      const x = -(2.1 * Math.sin(phi) * Math.cos(theta))
      const z = 2.1 * Math.sin(phi) * Math.sin(theta)
      const y = 2.1 * Math.cos(phi)

      return {
        ...location,
        position: [x, y, z],
      }
    })
  }, [locations])

  // Animation
  useFrame(({ clock }) => {
    if (markersRef.current) {
      markersRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={markersRef}>
      {markers.map((marker, i) => (
        <mesh
          key={i}
          position={marker.position as [number, number, number]}
          onPointerOver={() => onHover({ lat: marker.lat, lon: marker.lon })}
          onPointerOut={() => onHover(null)}
        >
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Handle camera movement for focused locations
function CameraController({
  focusedLocation,
}: {
  focusedLocation: { lat: number; lon: number } | null
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const animationRef = useRef<number | null>(null)

  // Effect to handle focused location changes
  useFrame(() => {
    if (focusedLocation && controlsRef.current) {
      const { lat, lon } = focusedLocation
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      const x = -(6 * Math.sin(phi) * Math.cos(theta))
      const z = 6 * Math.sin(phi) * Math.sin(theta)
      const y = 6 * Math.cos(phi)

      // Move camera to focus on location
      camera.position.set(x, y, z)
      camera.lookAt(0, 0, 0)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={5}
      maxDistance={12}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
    />
  )
}

export default function CodepenGlobe({
  focusedLocation,
  locations = [],
}: {
  focusedLocation: { lat: number; lon: number } | null
  locations: Array<{ name: string; lat: number; lon: number }>
}) {
  const [hoveredLocation, setHoveredLocation] = useState<{ lat: number; lon: number } | null>(null)

  const handleLocationHover = useCallback((location: { lat: number; lon: number } | null) => {
    setHoveredLocation(location)
  }, [])

  // Use either the focused location from props or the hovered location
  const activeLocation = focusedLocation || hoveredLocation

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} alpha={true}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <CameraController focusedLocation={activeLocation} />
      <GlobeObject />
      <LocationMarkers locations={locations} onHover={handleLocationHover} />
    </Canvas>
  )
}
