'use client'

import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber'
import {useGLTF} from '@react-three/drei'
import {motion} from 'framer-motion-3d'
import type React from 'react'
import {Suspense, memo, useRef, Component} from 'react'
import * as THREE from 'three'
import {TextureLoader} from 'three'
import {damp, sampleStops, type JourneyProgressRef, type JourneyStop} from '@/lib/animations/scroll-journey'

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
      <ambientLight intensity={0.45} />
      <directionalLight ref={lightRef} intensity={2.2} position={[1, 0, -0.25]} />
      {/* Cool fill from camera side so the night side stays legible */}
      <directionalLight intensity={0.55} position={[-2, 1, 4]} color='#9db8ff' />
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

  // DEBUG: verify the GLB scene contents
  if (process.env.NODE_ENV === 'development') {
    console.info('[Earth] GLB scene children:', scene.children.length, scene.children.map(c => c.constructor.name))
  }

  return (
    <>
      <EarthSceneLights lightRef={lightRef} />
      <primitive ref={earthRef} object={scene} scale={2.5} rotation-y={0.5} />
      {/* DEBUG: test mesh to verify the render loop works */}
      <mesh position={[0, 0, 0]} scale={1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='red' />
      </mesh>
    </>
  )
})
EarthGLB.displayName = 'EarthGLB'

/**
 * Scroll-journey camera stops (home Act 2).
 * Push toward the surface during departure, then recede as the Moon takes the frame.
 */
const EARTH_CAM_Z: JourneyStop[] = [
  [0, 5],
  [0.3, 3.4],
  [0.62, 4.6],
  [1, 7.2],
]
const EARTH_CAM_Y: JourneyStop[] = [
  [0, 0],
  [0.3, 0],
  [1, 1.1],
]

/** Damps the default camera along the journey stops each frame. Inert when no ref is passed. */
const EarthJourneyRig: React.FC<{journeyRef: JourneyProgressRef}> = ({journeyRef}) => {
  const {camera} = useThree()
  const frameCount = useRef(0)

  useFrame((_, delta) => {
    if (process.env.NODE_ENV === 'development' && frameCount.current === 0) {
      console.info('[EarthJourneyRig] useFrame is running, camera:', camera.position.x, camera.position.y, camera.position.z)
    }
    frameCount.current = (frameCount.current + 1) % 60

    const t = journeyRef.current
    camera.position.z = damp(camera.position.z, sampleStops(EARTH_CAM_Z, t), 4, delta)
    camera.position.y = damp(camera.position.y, sampleStops(EARTH_CAM_Y, t), 4, delta)
    camera.lookAt(0, 0, 0)
  })

  return null
}

interface EarthProps {
  activeLocation: unknown
  isIdle?: boolean
  reduceMotion?: boolean
  /** Home scroll journey progress (0..1) — enables the camera rig when present */
  journeyRef?: JourneyProgressRef
}

export const Earth: React.FC<EarthProps> = memo(
  ({isIdle = false, reduceMotion = false, journeyRef}) => {
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
            onCreated={({gl, scene, camera, invalidate, frameloop, set}) => {
              gl.setClearColor('#000000', 1)
              if (process.env.NODE_ENV === 'development') {
                window.__earthR3f = {gl, scene, camera, invalidate, frameloop, set}
                console.info('[Earth] Canvas onCreated — renderer:', gl.constructor.name, 'scene children:', scene.children.length, 'camera:', camera.type, 'frameloop:', frameloop)
              }
            }}>
            <color attach='background' args={['#000000']} />
            <EarthGLB isIdle={isIdle} reduceMotion={reduceMotion} />
            {journeyRef ? <EarthJourneyRig journeyRef={journeyRef} /> : null}
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
