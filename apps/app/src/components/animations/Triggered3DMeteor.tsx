'use client'

import { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { 
  Trail, 
  Float, 
  MeshDistortMaterial,
  Sparkles,
  Environment,
  PerspectiveCamera,
  useTexture,
  Sphere
} from '@react-three/drei'
import { TextureLoader, Vector3, CatmullRomCurve3 } from 'three'
import * as THREE from 'three'
import { gsap } from 'gsap'

export interface Meteor3DRef {
  trigger: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

interface Triggered3DMeteorProps {
  images?: string[]
  onComplete?: () => void
  duration?: number
  path?: 'diagonal' | 'spiral' | 'arc' | 'orbit' | 'custom'
  customPath?: Vector3[]
  startPosition?: Vector3
  endPosition?: Vector3
}

// Meteor component that lives inside Canvas
function MeteorObject({ 
  images, 
  isActive, 
  onComplete, 
  duration = 8, 
  path = 'diagonal',
  customPath,
  startPosition = new Vector3(-10, 5, 0),
  endPosition = new Vector3(10, -5, 0)
}: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0)
  const progressRef = useRef(0)
  const curveRef = useRef<CatmullRomCurve3>()
  
  // Load textures
  const textures = images.map((img: string) => useTexture(img))
  
  // Create path curve
  useEffect(() => {
    let points: Vector3[] = []
    
    switch (path) {
      case 'spiral':
        points = []
        for (let i = 0; i <= 100; i++) {
          const t = i / 100
          const angle = t * Math.PI * 4
          const radius = 5 * (1 - t)
          points.push(new Vector3(
            Math.cos(angle) * radius,
            10 - t * 20,
            Math.sin(angle) * radius
          ))
        }
        break
        
      case 'arc':
        points = []
        for (let i = 0; i <= 50; i++) {
          const t = i / 50
          const x = startPosition.x + (endPosition.x - startPosition.x) * t
          const y = startPosition.y + Math.sin(t * Math.PI) * 5
          const z = startPosition.z + (endPosition.z - startPosition.z) * t
          points.push(new Vector3(x, y, z))
        }
        break
        
      case 'orbit':
        points = []
        for (let i = 0; i <= 100; i++) {
          const t = i / 100
          const angle = t * Math.PI * 2
          points.push(new Vector3(
            Math.cos(angle) * 8,
            Math.sin(angle * 2) * 2,
            Math.sin(angle) * 8
          ))
        }
        break
        
      case 'custom':
        points = customPath || [startPosition, endPosition]
        break
        
      case 'diagonal':
      default:
        points = [
          startPosition,
          new Vector3(0, 0, 0),
          endPosition
        ]
    }
    
    curveRef.current = new CatmullRomCurve3(points)
  }, [path, startPosition, endPosition, customPath])
  
  // Animation frame
  useFrame((state, delta) => {
    if (!meshRef.current || !isActive || !curveRef.current) return
    
    // Update progress
    progressRef.current += (delta / duration)
    
    if (progressRef.current >= 1) {
      progressRef.current = 0
      if (onComplete) onComplete()
      return
    }
    
    // Update position along curve
    const point = curveRef.current.getPoint(progressRef.current)
    meshRef.current.position.copy(point)
    
    // Look ahead on the curve
    const lookAtPoint = curveRef.current.getPoint(
      Math.min(progressRef.current + 0.01, 1)
    )
    meshRef.current.lookAt(lookAtPoint)
    
    // Rotate for effect
    meshRef.current.rotation.z += delta * 2
    
    // Update texture based on progress
    const textureIndex = Math.floor(progressRef.current * textures.length)
    if (textureIndex !== currentTextureIndex && textureIndex < textures.length) {
      setCurrentTextureIndex(textureIndex)
    }
    
    // Scale based on progress (grow then shrink)
    const scale = Math.sin(progressRef.current * Math.PI) * 1.5 + 0.5
    meshRef.current.scale.setScalar(scale)
  })
  
  if (!isActive) return null
  
  return (
    <group>
      {/* Main meteor with trail */}
      <Trail
        width={3}
        length={10}
        color={new THREE.Color('#adf0dd')}
        attenuation={(width) => width}
      >
        <Trail
          width={2}
          length={8}
          color={new THREE.Color('#ff6b6b')}
          attenuation={(width) => width * width}
        >
          <mesh ref={meshRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              map={textures[currentTextureIndex]}
              emissive={new THREE.Color('#ff6b6b')}
              emissiveIntensity={0.5}
              emissiveMap={textures[currentTextureIndex]}
              roughness={0.3}
              metalness={0.7}
              envMapIntensity={2}
            />
          </mesh>
        </Trail>
      </Trail>
      
      {/* Particle field around meteor */}
      {isActive && meshRef.current && (
        <Sparkles
          count={50}
          scale={5}
          size={2}
          speed={2}
          color="#adf0dd"
          position={meshRef.current.position}
        />
      )}
      
      {/* Energy sphere */}
      <Sphere
        args={[2, 16, 16]}
        position={meshRef.current?.position}
        scale={meshRef.current?.scale}
      >
        <MeshDistortMaterial
          color="#ff6b6b"
          attach="material"
          distort={0.5}
          speed={5}
          transparent
          opacity={0.2}
          roughness={0}
          metalness={1}
        />
      </Sphere>
    </group>
  )
}

// 3D Scene wrapper
const Meteor3DScene = forwardRef<Meteor3DRef, Triggered3DMeteorProps>(({
  images = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg',
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg',
    '/assets/cosmic-portals/eclipse-5.jpg',
    '/assets/cosmic-portals/eclipse-6.jpg',
    '/assets/cosmic-portals/eclipse-7.jpg'
  ],
  onComplete,
  duration = 8,
  path = 'diagonal',
  customPath,
  startPosition,
  endPosition
}, ref) => {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  // Handle completion
  const handleComplete = () => {
    setIsActive(false)
    if (onComplete) onComplete()
  }
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    trigger: () => {
      setIsActive(true)
      setIsPaused(false)
    },
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
    reset: () => {
      setIsActive(false)
      setIsPaused(false)
    }
  }))
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: isActive ? 'none' : 'none',
        zIndex: isActive ? 9999 : -1,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.5s'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#adf0dd" />
        <pointLight position={[10, -10, 5]} intensity={0.5} color="#ff6b6b" />
        
        {/* Environment for reflections */}
        <Environment preset="night" />
        
        {/* Meteor */}
        <MeteorObject
          images={images}
          isActive={isActive && !isPaused}
          onComplete={handleComplete}
          duration={duration}
          path={path}
          customPath={customPath}
          startPosition={startPosition}
          endPosition={endPosition}
        />
        
        {/* Background particles */}
        <Sparkles
          count={200}
          scale={30}
          size={1}
          speed={0.5}
          opacity={0.3}
        />
        
        {/* Camera shake when active */}
        {isActive && (
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 20]}
            fov={60}
          />
        )}
      </Canvas>
    </div>
  )
})

Meteor3DScene.displayName = 'Meteor3DScene'

// Main component with forwardRef
export const Triggered3DMeteor = forwardRef<Meteor3DRef, Triggered3DMeteorProps>((props, ref) => {
  const sceneRef = useRef<Meteor3DRef>(null)
  
  useImperativeHandle(ref, () => ({
    trigger: () => sceneRef.current?.trigger(),
    pause: () => sceneRef.current?.pause(),
    resume: () => sceneRef.current?.resume(),
    reset: () => sceneRef.current?.reset()
  }))
  
  return <Meteor3DScene ref={sceneRef} {...props} />
})

Triggered3DMeteor.displayName = 'Triggered3DMeteor'

// Hook for easy usage
export function useTriggered3DMeteor(props: Triggered3DMeteorProps = {}) {
  const ref = useRef<Meteor3DRef>(null)
  
  const trigger = () => ref.current?.trigger()
  const pause = () => ref.current?.pause()
  const resume = () => ref.current?.resume()
  const reset = () => ref.current?.reset()
  
  return {
    ref,
    trigger,
    pause,
    resume,
    reset,
    Meteor3D: () => <Triggered3DMeteor ref={ref} {...props} />
  }
}
