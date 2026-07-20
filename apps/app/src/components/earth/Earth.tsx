'use client'

import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber'
import {useGLTF} from '@react-three/drei'
import {motion} from 'framer-motion-3d'
import type React from 'react'
import {Suspense, memo, useRef, Component} from 'react'
import * as THREE from 'three'
import {TextureLoader} from 'three'

const EARTH_GLB_URL = '/assets/earth2/TERRA.glb'
const EARTH_SPIN_RATE = 0.1
const EARTH_FLOAT_FREQ = 0.4
const EARTH_FLOAT_AMP = 0.08
const LIGHT_DRIFT_SPEED = 0.15
const LIGHT_RADIUS = 1.2
const PARALLAX_STRENGTH = 0.12
const PARALLAX_DAMP = 0.06

if (typeof window !== 'undefined') {
  useGLTF.preload(EARTH_GLB_URL)
}

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

type EarthIdleProps = {
  isIdle?: boolean
  reduceMotion?: boolean
}

const useEarthIdleMotion = (
  earthRef: React.RefObject<THREE.Object3D | null>,
  lightRef: React.RefObject<THREE.DirectionalLight | null>,
  isIdle: boolean,
  reduceMotion: boolean
) => {
  const {pointer} = useThree()
  const parallaxTarget = useRef({x: 0, y: 0})

  useFrame((state, delta) => {
    const earth = earthRef.current
    if (!earth) return

    // Gentle spin always — comprehension cue, not a flourish
    earth.rotation.y += delta * (reduceMotion ? EARTH_SPIN_RATE * 0.35 : EARTH_SPIN_RATE)

    if (reduceMotion) {
      earth.position.y = 0
      return
    }

    earth.position.y = Math.sin(state.clock.elapsedTime * EARTH_FLOAT_FREQ) * EARTH_FLOAT_AMP

    if (isIdle) {
      parallaxTarget.current.x +=
        (pointer.x * PARALLAX_STRENGTH - parallaxTarget.current.x) * PARALLAX_DAMP
      parallaxTarget.current.y +=
        (pointer.y * PARALLAX_STRENGTH - parallaxTarget.current.y) * PARALLAX_DAMP
      earth.rotation.x = parallaxTarget.current.y * 0.35
      earth.rotation.z = -parallaxTarget.current.x * 0.2

      const light = lightRef.current
      if (light) {
        const t = state.clock.elapsedTime * LIGHT_DRIFT_SPEED
        light.position.x = Math.cos(t) * LIGHT_RADIUS
        light.position.z = Math.sin(t) * LIGHT_RADIUS * 0.6 - 0.25
        light.position.y = Math.sin(t * 0.7) * 0.35
      }
    }
  })
}

const EarthSceneLights: React.FC<{
  lightRef: React.RefObject<THREE.DirectionalLight | null>
}> = ({lightRef}) => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight ref={lightRef} intensity={1.5} position={[1, 0, -0.25]} />
    </>
  )
}

const EarthGLB: React.FC<EarthIdleProps> = memo(({isIdle = false, reduceMotion = false}) => {
  const earthRef = useRef<THREE.Object3D>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const {scene, animations} = useGLTF(EARTH_GLB_URL)

  // TERRA.glb ships without clips — skip AnimationMixer (threejs-animation)
  if (process.env.NODE_ENV === 'development' && animations.length > 0) {
    console.info('[Earth] GLB reports clips; mixer not wired in this pass', animations.length)
  }

  useEarthIdleMotion(earthRef, lightRef, isIdle, reduceMotion)

  return (
    <>
      <EarthSceneLights lightRef={lightRef} />
      <primitive ref={earthRef} object={scene} scale={2.5} rotation-y={0.5} />
    </>
  )
})
EarthGLB.displayName = 'EarthGLB'

interface EarthProps {
  activeLocation: unknown
  isIdle?: boolean
  reduceMotion?: boolean
}

export const Earth: React.FC<EarthProps> = memo(({isIdle = false, reduceMotion = false}) => {
  return (
    <div
      className='h-[80vh] w-[80vw] m-auto bg-black'
      id='earth-canvas'
      style={{background: '#000'}}>
      <EarthErrorBoundary>
        <Suspense
          fallback={
            <img
              alt='Earth placeholder'
              src='/assets/earth2/placeholder.png'
              width={1000}
              height={1000}
              loading='lazy'
              className='bg-black'
            />
          }>
          <Canvas
            gl={{alpha: false}}
            style={{background: '#000'}}
            onCreated={({gl}) => {
              gl.setClearColor('#000000', 1)
            }}>
            <color attach='background' args={['#000000']} />
            <EarthGLB isIdle={isIdle} reduceMotion={reduceMotion} />
          </Canvas>
        </Suspense>
      </EarthErrorBoundary>
    </div>
  )
})

export const EN: React.FC<{ref?: React.Ref<THREE.Mesh>}> = memo(() => {
  const [color, normal, aoMap] = useLoader(TextureLoader, [
    '/8k_earth_nightmap.jpeg',
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
