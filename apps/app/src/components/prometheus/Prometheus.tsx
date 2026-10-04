'use client'

import {Canvas, useFrame} from '@react-three/fiber'
import {PerspectiveCamera} from '@react-three/drei'
import {Suspense, useRef, useMemo, useState, useEffect} from 'react'
import * as THREE from 'three'
import {EffectComposer, Bloom} from '@react-three/postprocessing'

/**
 * Prometheus Character Component
 *
 * Ethereal cosmic guardian figure that watches over Earth and Moon
 * Features:
 * - Silhouette-based humanoid form
 * - Glowing chest core
 * - Scanning grid overlay
 * - Particle emissions
 * - Subtle breathing animation
 */

// ============================================================================
// Prometheus Figure Component
// ============================================================================

function PrometheusScene() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const scanLineRef = useRef<THREE.Mesh>(null)

  // Create procedural humanoid silhouette
  const humanoidGeometry = useMemo(() => {
    const shape = new THREE.Shape()

    // Head
    shape.moveTo(0, 1.8)
    shape.bezierCurveTo(-0.15, 1.8, -0.2, 1.7, -0.2, 1.6)
    shape.lineTo(-0.2, 1.4)
    shape.bezierCurveTo(-0.2, 1.3, -0.15, 1.2, 0, 1.2)
    shape.bezierCurveTo(0.15, 1.2, 0.2, 1.3, 0.2, 1.4)
    shape.lineTo(0.2, 1.6)
    shape.bezierCurveTo(0.2, 1.7, 0.15, 1.8, 0, 1.8)

    return new THREE.ShapeGeometry(shape)
  }, [])

  // Animate breathing and subtle movements
  useFrame(({clock}) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime()

      // Subtle breathing
      groupRef.current.scale.y = 1 + Math.sin(time * 0.5) * 0.02

      // Slight sway
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.02
    }

    if (coreRef.current) {
      const time = clock.getElapsedTime()
      // Pulsing core
      const scale = 1 + Math.sin(time * 2) * 0.1
      coreRef.current.scale.set(scale, scale, scale)
    }

    if (scanLineRef.current) {
      const time = clock.getElapsedTime()
      // Scanning line movement
      scanLineRef.current.position.y = -2 + ((time * 0.5) % 4)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -8]} scale={1.5}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#4080ff'
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.8, 16]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#4080ff'
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Glowing Core (chest) */}
      <mesh ref={coreRef} position={[0, 0.9, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color='#ff8040'
          emissive='#ff8040'
          emissiveIntensity={2.0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Core glow ring */}
      <mesh position={[0, 0.9, 0.05]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.15, 0.01, 16, 32]} />
        <meshBasicMaterial color='#ff8040' transparent opacity={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.4, 0.6, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.06, 0.7, 12]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#4080ff'
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh position={[0.4, 0.6, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.06, 0.7, 12]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#4080ff'
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Hands with glow */}
      <mesh position={[-0.5, 0.2, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#40c0ff'
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh position={[0.5, 0.2, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#40c0ff'
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Lower body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.4, 16]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#4080ff'
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Scanning grid lines (horizontal) */}
      {[...Array(20)].map((_, i) => {
        const y = -2 + i * 0.2
        return (
          <mesh key={i} position={[0, y, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.6 + i * 0.05, 0.002, 8, 32]} />
            <meshBasicMaterial
              color='#40c0ff'
              transparent
              opacity={0.1 + (i % 3) * 0.05}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}

      {/* Active scanning line */}
      <mesh ref={scanLineRef} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.005, 8, 32]} />
        <meshBasicMaterial
          color='#40c0ff'
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Vertical grid lines */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0, 0.15]}>
          <boxGeometry args={[0.002, 3.5, 0.002]} />
          <meshBasicMaterial
            color='#40c0ff'
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Particle field around Prometheus */}
      <ParticleField />
    </group>
  )
}

// ============================================================================
// Particle Field Component
// ============================================================================

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 300

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution around figure
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 1.5 + Math.random() * 1

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 0.5
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Cyan/orange color mix
      const isCyan = Math.random() > 0.3
      colors[i * 3] = isCyan ? 0.25 : 1.0
      colors[i * 3 + 1] = isCyan ? 0.75 : 0.5
      colors[i * 3 + 2] = isCyan ? 1.0 : 0.25
    }

    return {positions, colors}
  }, [particleCount])

  useFrame(({clock}) => {
    if (pointsRef.current) {
      const time = clock.getElapsedTime()
      pointsRef.current.rotation.y = time * 0.05

      // Pulse effect
      const scale = 1 + Math.sin(time * 0.5) * 0.1
      pointsRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-color'
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
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
// Main Prometheus Component
// ============================================================================

export const Prometheus = () => {
  const [isMounted, setIsMounted] = useState(false)

  return (
    <div
      className='prometheus-container bg-black'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#000',
      }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        style={{background: '#000'}}
        dpr={[1, 2]}
        onCreated={({gl}) => {
          // EffectComposer ignores CSS transparency — must clear opaque black
          gl.setClearColor('#000000', 1)
        }}>
        <color attach='background' args={['#000000']} />

        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.5} position={[-5, 5, 5]} color='#4080ff' />
        <directionalLight intensity={0.3} position={[5, -5, -5]} color='#ff8040' />
        <pointLight position={[0, 2, 0]} intensity={1} color='#ff8040' distance={5} />

        <Suspense fallback={null}>
          <PrometheusScene />
        </Suspense>

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom intensity={0.8} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default Prometheus
