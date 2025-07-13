'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Trail, Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { TextureLoader } from 'three'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface MorphingMeteorProps {
  images: string[]
  onComplete?: () => void
}

function MeteorCore({ images }: { images: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0)
  
  // Load all textures
  const textures = images.map(img => useLoader(TextureLoader, img))
  
  // Rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.rotation.z += delta * 0.2
    }
  })
  
  // Morph between textures
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextureIndex((prev) => (prev + 1) % textures.length)
    }, 2000) // Change texture every 2 seconds
    
    return () => clearInterval(interval)
  }, [textures.length])
  
  // Apply current texture with transition
  useEffect(() => {
    if (materialRef.current && textures[currentTextureIndex]) {
      gsap.to(materialRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          materialRef.current!.map = textures[currentTextureIndex]
          materialRef.current!.needsUpdate = true
          gsap.to(materialRef.current, {
            opacity: 1,
            duration: 0.3
          })
        }
      })
    }
  }, [currentTextureIndex, textures])
  
  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <Trail
        width={5}
        length={10}
        color={new THREE.Color('#adf0dd')}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            ref={materialRef}
            map={textures[0]}
            emissive={new THREE.Color('#ff6b6b')}
            emissiveIntensity={0.5}
            emissiveMap={textures[0]}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Trail>
    </Float>
  )
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  
  // Create particle geometry
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    
    // Alternate between turquoise and coral colors
    if (Math.random() > 0.5) {
      colors[i * 3] = 0.68     // R for #adf0dd
      colors[i * 3 + 1] = 0.94 // G
      colors[i * 3 + 2] = 0.87 // B
    } else {
      colors[i * 3] = 1        // R for #ff6b6b
      colors[i * 3 + 1] = 0.42 // G
      colors[i * 3 + 2] = 0.42 // B
    }
  }
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05
      particlesRef.current.rotation.x += delta * 0.03
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function CosmicEnvironment() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Key light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ff6b6b"
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.5}
        color="#adf0dd"
      />
      
      {/* Rim light */}
      <pointLight
        position={[0, 0, -10]}
        intensity={2}
        color="#ffffff"
      />
      
      {/* Particle field */}
      <ParticleField />
      
      {/* Background */}
      <color attach="background" args={['#000814']} />
      <fog attach="fog" args={['#000814', 10, 50]} />
    </>
  )
}

export function MorphingMeteor3D({ images, onComplete }: MorphingMeteorProps) {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CosmicEnvironment />
        <MeteorCore images={images} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

// Demo component
export default function MorphingMeteor3DDemo() {
  const [showAnimation, setShowAnimation] = useState(true)
  
  // Your actual eclipse images
  const eclipseImages = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg',
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg',
    '/assets/cosmic-portals/eclipse-5.jpg',
    '/assets/cosmic-portals/eclipse-6.jpg',
    '/assets/cosmic-portals/eclipse-7.jpg'
  ]
  
  return (
    <div className="relative w-full h-screen bg-black">
      {showAnimation && (
        <MorphingMeteor3D
          images={eclipseImages}
          onComplete={() => console.log('Animation complete')}
        />
      )}
      
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 text-white">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b] bg-clip-text text-transparent">
          Morphing Eclipse Meteor
        </h1>
        <p className="text-lg opacity-70">
          7 Eclipse Forms • React Three Fiber • GSAP
        </p>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <p>Drag to orbit • Textures morph every 2 seconds</p>
      </div>
    </div>
  )
}
