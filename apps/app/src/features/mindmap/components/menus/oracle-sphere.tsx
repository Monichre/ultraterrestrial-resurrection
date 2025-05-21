'use client'

import React, {useRef, useState, useMemo} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {OrbitControls, Sphere, useTexture} from '@react-three/drei'
import * as THREE from 'three'

// Define the same transition values used in the OracleIcon for consistency
const transition = {
  duration: 4,
  yoyo: Number.POSITIVE_INFINITY,
  ease: 'easeInOut',
}

interface OracleSphereProps {
  color?: string
  className?: string
  size?: number
}

// Interface for particle data
interface Particle {
  position: [number, number, number]
  scale: number
  id: string
}

const OracleCore = ({color = '#1E88E5', size = 1}) => {
  const groupRef = useRef<THREE.Group>(null)

  // Define the concentric spheres with different opacities
  // to match the OracleIcon's radiating paths
  const layers = [
    {radius: size * 1.0, opacity: 0.5},
    {radius: size * 0.95, opacity: 0.45},
    {radius: size * 0.9, opacity: 0.4},
    {radius: size * 0.85, opacity: 0.35},
    {radius: size * 0.8, opacity: 0.3},
    {radius: size * 0.75, opacity: 0.25},
    {radius: size * 0.7, opacity: 0.2},
    {radius: size * 0.65, opacity: 0.15},
    {radius: size * 0.6, opacity: 0.1},
    {radius: size * 0.55, opacity: 0.05},
  ]

  // Animate the sphere rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer shell - base sphere */}
      <Sphere args={[size, 64, 64]}>
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </Sphere>

      {/* Create concentric spheres with decreasing opacity */}
      {layers.map((layer, i) => (
        <Sphere key={`layer-${i}-${layer.opacity}`} args={[layer.radius, 48, 48]}>
          <meshStandardMaterial
            color={color}
            transparent
            opacity={layer.opacity}
            side={THREE.BackSide}
          />
        </Sphere>
      ))}
    </group>
  )
}

// Simpler particles implementation using instancedMesh
const OracleParticleSystem = ({color = '#1E88E5', size = 1}) => {
  const groupRef = useRef<THREE.Group>(null)
  const particleCount = 2000

  // Create particle positions
  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      // Create spherical distribution of particles
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = (0.3 + Math.random() * 0.7) * size

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      temp.push({
        position: [x, y, z],
        scale: 0.02 + Math.random() * 0.03,
        id: `particle-${i}-${x.toFixed(3)}-${y.toFixed(3)}`, // Unique key
      })
    }
    return temp
  }, [size]) // particleCount doesn't need to be a dependency since it's constant

  // Animate rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <sphereGeometry args={[particle.scale, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export const OracleSphere = ({
  color = '#1E88E5',
  className = '',
  size = 1.5,
}: OracleSphereProps) => {
  const [useParticles, setUseParticles] = useState(false)

  return (
    <div className={`relative w-full h-full min-h-[200px] ${className}`}>
      <Canvas camera={{position: [0, 0, 5], fov: 45}}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Scene Controls */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />

        {/* Main Content */}
        {useParticles ? (
          <OracleParticleSystem color={color} size={size} />
        ) : (
          <OracleCore color={color} size={size} />
        )}
      </Canvas>

      {/* Optional UI control for switching modes */}
      <button
        type='button'
        className='absolute bottom-2 right-2 text-xs bg-black/30 text-white px-2 py-1 rounded-md'
        onClick={() => setUseParticles(!useParticles)}>
        Toggle Mode
      </button>
    </div>
  )
}

export default OracleSphere
