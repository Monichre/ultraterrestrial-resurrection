"use client"

import { useRef, useMemo, useEffect, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sphere, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { Color } from "three"

function Earth({ focusedLocation }: { focusedLocation: { lat: number; lon: number } | null }) {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const controlsRef = useRef<any>(null)

  const { camera } = useThree()

  // Load Earth textures
  const [earthMap, earthNormalMap, earthSpecularMap, earthCloudsMap] = useTexture([
    "/assets/3d/texture_earth.jpg",
    "/assets/3d/texture_earth.jpg",
    "/assets/3d/texture_earth.jpg",
    "/assets/3d/texture_earth.jpg",
  ])

  // Create particles for the surrounding field
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 1000; i++) {
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const r = 2.5 + Math.random() * 0.2

      temp.push(r * Math.cos(phi) * Math.sin(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(theta))
    }
    return new Float32Array(temp)
  }, [])

  // Custom shader for atmosphere
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new Color(0xffffff) },
        viewVector: { value: new THREE.Vector3(0, 0, 1) },
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
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.055
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02
    }
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
      const { lat, lon } = focusedLocation
      const point = latLonToVector3(lat, lon, 2)
      const distanceFromSurface = 2
      const cameraPosition = point
        .clone()
        .normalize()
        .multiplyScalar(2 + distanceFromSurface)

      controlsRef.current.enabled = false
      const duration = 1000 // Animation duration in milliseconds
      const startPosition = camera.position.clone()
      const startRotation = camera.quaternion.clone()
      const endRotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        point.clone().normalize(),
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
          controlsRef.current.enabled = true
        }
      }

      requestAnimationFrame(animate)
    }
  }, [focusedLocation, camera, latLonToVector3])

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={4}
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
        <meshPhongMaterial map={earthCloudsMap} transparent={true} opacity={0.4} depthWrite={false} />
      </Sphere>

      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[2.1, 64, 64]} material={atmosphereMaterial} />

      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.01} color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>
    </>
  )
}

export default function Globe({ focusedLocation }: { focusedLocation: { lat: number; lon: number } | null }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} alpha={true}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} castShadow />
      <Earth focusedLocation={focusedLocation} />
    </Canvas>
  )
}
