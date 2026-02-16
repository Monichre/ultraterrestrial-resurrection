'use client'

import {Canvas, useFrame, useLoader} from '@react-three/fiber'
import {useGLTF} from '@react-three/drei'
import {motion} from 'framer-motion-3d'
import type React from 'react'
import {Suspense, memo, useRef, Component, useState, useEffect} from 'react'
import type * as THREE from 'three'
import {TextureLoader} from 'three'

// Error Boundary for texture loading failures
class EarthErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  componentDidCatch(error: Error) {
    console.error('Earth component error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center h-full w-full'>
          <div className='text-white text-center'>
            <p>Earth visualization temporarily unavailable</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Define prop types (replace 'any' with actual types)
type RotatingComponentProps = {}

// GLB-based Earth component (preferred)
const EarthGLB: React.FC = memo(() => {
  const earthRef = useRef<any>(null)
  const {scene} = useGLTF('/assets/earth2/TERRA.glb')

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta / 10
    }
  })

  return <primitive ref={earthRef} object={scene} scale={2.5} rotation-y={0.5} />
})
EarthGLB.displayName = 'EarthGLB'

// Texture-based Earth component (fallback)
const RotatingComponent: React.FC<RotatingComponentProps> = memo(() => {
  const earthRef = useRef<any>(null)
  const [useFallback, setUseFallback] = useState(false)

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta / 10
    }
  })

  let textures: THREE.Texture[] | null = null

  try {
    textures = useLoader(TextureLoader, [
      '/assets/earth2/color.jpg',
      '/assets/earth2/normal.png',
      '/assets/earth2/occlusion.jpg',
    ]) as THREE.Texture[]
  } catch (error) {
    console.error('Failed to load Earth textures:', error)
  }

  if (!textures) {
    // Fallback to simple blue sphere
    return (
      <motion.mesh scale={2.5} ref={earthRef} rotation-y={0.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color='#2255dd' />
      </motion.mesh>
    )
  }

  const [color, normal, aoMap] = textures

  return (
    <motion.mesh scale={2.5} ref={earthRef} rotation-y={0.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap} />
    </motion.mesh>
  )
})
RotatingComponent.displayName = 'RotatingComponent'

interface EarthProps {
  activeLocation: any
}

export const Earth: React.FC<EarthProps> = memo(() => {
  return (
    <div className='h-[80vh] w-[80vw] m-auto' id='earth-canvas'>
      <EarthErrorBoundary>
        <Suspense
          fallback={
            <img
              alt='Earth placeholder'
              src='/assets/earth2/placeholder.png'
              width={1000}
              height={1000}
              loading='lazy'
            />
          }>
          <Canvas>
            <ambientLight intensity={0.1} />
            <directionalLight intensity={1.5} position={[1, 0, -0.25]} />
            {/* Try GLB model first, fallback to texture-based */}
            <EarthGLB />
          </Canvas>
        </Suspense>
      </EarthErrorBoundary>
    </div>
  )
})

export const EN: React.FC<{ref?: React.Ref<THREE.Mesh>}> = memo(() => {
  const [color, normal, aoMap] = useLoader(TextureLoader, [
    '/8k_earth_nightmap.jpeg',
    // Add additional textures as needed
  ]) as THREE.Texture[]

  return (
    <Suspense
      fallback={
        <img
          alt='Earth at night placeholder'
          src='/assets/earth2/placeholder.png'
          width={1000}
          height={1000}
          loading='lazy'
        />
      }>
      <Canvas style={{width: '100%', height: '100%'}}>
        <ambientLight intensity={0.1} />
        <directionalLight intensity={1.5} position={[1, 0, -0.25]} />
        <motion.mesh scale={2.5}>
          <sphereGeometry args={[1, 32, 32]} />

          <meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap} />
        </motion.mesh>
      </Canvas>
    </Suspense>
  )
})
