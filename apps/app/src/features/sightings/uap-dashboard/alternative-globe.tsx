'use client'

import {useRef, useMemo, Suspense} from 'react'
import {Canvas, useFrame, extend, useLoader} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import * as THREE from 'three'

// (removed incorrect custom shader registration)

function Earth() {
  const earthRef = useRef<THREE.Mesh | null>(null)
  const atmosphereRef = useRef<THREE.Mesh | null>(null)
  const pointsRef = useRef<THREE.Points | null>(null)

  // Load Earth texture
  const [color] = useLoader(THREE.TextureLoader, [
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world-dark.jpg-zlRzajVm40z4oZIOMOzk66dALAsN2I.jpeg',
  ]) as THREE.Texture[]

  // Create data points
  const points = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      const lat = (Math.random() - 0.5) * 180
      const lng = (Math.random() - 0.5) * 360
      const phi = ((90 - lat) * Math.PI) / 180
      const theta = ((180 - lng) * Math.PI) / 180
      const x = 200 * Math.sin(phi) * Math.cos(theta)
      const y = 200 * Math.cos(phi)
      const z = 200 * Math.sin(phi) * Math.sin(theta)
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])

  // Animation
  useFrame(({clock}) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[200, 40, 30]} />
        <meshStandardMaterial map={color} emissive='#ffffff' emissiveIntensity={0.2} />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[200, 40, 30]} />
        <meshBasicMaterial
          color='#ffffff'
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Data Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={5}
          color='#ffffff'
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

export default function AlternativeGlobe() {
  return (
    <Canvas camera={{position: [0, 0, 600], fov: 30}} gl={{alpha: true}}>
      <color attach='background' args={['#000000']} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[1, 0, 0]} intensity={0.5} />
      <OrbitControls
        enablePan={false}
        minDistance={350}
        maxDistance={1100}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </Canvas>
  )
}
