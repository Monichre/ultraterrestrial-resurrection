/**
 * HeroScene Component
 *
 * Full-screen Three.js scene with GSAP-driven animations
 * Inspired by sci-fi UI, technical readouts, and UAP aesthetics
 */

'use client'

import {useRef, useEffect, Suspense} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  useTexture,
  MeshTransmissionMaterial,
  Grid,
  Float,
} from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import {useGSAPTimeline} from '@/lib/animations/hooks/use-gsap-timeline'

// ============================================================================
// Types
// ============================================================================

export interface HeroSceneProps {
  onSceneReady?: () => void
  autoRotate?: boolean
  enableControls?: boolean
}

// ============================================================================
// Particles System
// ============================================================================

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 2000

  useEffect(() => {
    if (!pointsRef.current) return

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 10 + Math.random() * 5

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Orange/gold particle colors
      colors[i * 3] = 1.0 // R
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4 // G
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.3 // B
    }

    pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pointsRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }, [particleCount])

  useFrame(({clock}) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ============================================================================
// Central Sphere (Main Hero Object)
// ============================================================================

function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const {timeline} = useGSAPTimeline({paused: false})

  useEffect(() => {
    if (!timeline || !meshRef.current) return

    // Intro animation
    timeline
      .from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: 'elastic.out(1, 0.5)',
      })
      .to(
        meshRef.current.rotation,
        {
          y: Math.PI * 2,
          duration: 20,
          repeat: -1,
          ease: 'none',
        },
        0
      )
  }, [timeline])

  useFrame(({clock}) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
      meshRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={1}
          chromaticAberration={0.5}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color='#4080ff' transparent opacity={0.2} />
      </mesh>

      {/* Outer rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color='#40c0ff' />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[3.5, 0.015, 16, 100]} />
        <meshBasicMaterial color='#ff8040' transparent opacity={0.6} />
      </mesh>
    </Float>
  )
}

// ============================================================================
// Technical Grid Overlays
// ============================================================================

function TechnicalGrid() {
  return (
    <>
      <Grid
        position={[0, -5, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor='#40c0ff'
        sectionSize={2}
        sectionThickness={1}
        sectionColor='#4080ff'
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />
    </>
  )
}

// ============================================================================
// Holographic UI Elements
// ============================================================================

function HolographicUI() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({clock}) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Corner brackets */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2
        const x = Math.cos(angle) * 5
        const z = Math.sin(angle) * 5
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[0.02, 0.8, 0.02]} />
              <meshBasicMaterial color='#40c0ff' />
            </mesh>
            <mesh position={[0.4, 2.4, 0]}>
              <boxGeometry args={[0.8, 0.02, 0.02]} />
              <meshBasicMaterial color='#40c0ff' />
            </mesh>
          </group>
        )
      })}

      {/* Scanning lines */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, -4 + i, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4 + i * 0.5, 0.01, 8, 64]} />
          <meshBasicMaterial
            color='#40c0ff'
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================================
// Camera Controller
// ============================================================================

function CameraController() {
  const {camera} = useThree()
  const {timeline} = useGSAPTimeline({paused: false})

  useEffect(() => {
    if (!timeline) return

    const cameraTarget = {x: 0, y: 1.6, z: 8}

    timeline.to(cameraTarget, {
      z: 6,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z)
        camera.lookAt(0, 0, 0)
      },
    })
  }, [timeline, camera])

  return null
}

// ============================================================================
// Scene Composition
// ============================================================================

function Scene({onSceneReady}: {onSceneReady?: () => void}) {
  useEffect(() => {
    // Notify parent that scene is ready
    const timer = setTimeout(() => {
      onSceneReady?.()
    }, 500)

    return () => clearTimeout(timer)
  }, [onSceneReady])

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 1.6, 8]} fov={42} near={0.1} far={200} />

      <CameraController />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color='#ff8040' />

      {/* Environment */}
      <Environment preset='night' />

      {/* Scene Objects */}
      <CentralSphere />
      <ParticleField />
      <TechnicalGrid />
      <HolographicUI />

      {/* Effects */}
      <fog attach='fog' args={['#000000', 10, 50]} />
    </>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function HeroScene({
  onSceneReady,
  autoRotate = false,
  enableControls = true,
}: HeroSceneProps) {
  return (
    <div className='fixed inset-0 -z-10'>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({gl}) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
        }}>
        <Suspense fallback={null}>
          <Scene onSceneReady={onSceneReady} />
          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 4}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
