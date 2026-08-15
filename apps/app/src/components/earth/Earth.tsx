'use client'

/**
 * Earth — home hero celestial.
 *
 * Production reference (ultraterrestrial.app): grayscale PBR sphere using
 * `/assets/earth2/{color,normal,occlusion}` with a hard crescent key light.
 * Local upgrades keep that look while restoring render sharpness (DPR, AA,
 * ACES, anisotropy, higher tessellation) and the scroll-journey camera rig.
 */

import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {useTexture} from '@react-three/drei'
import type React from 'react'
import {Suspense, memo, useEffect, useRef, Component} from 'react'
import * as THREE from 'three'
import {
  damp,
  sampleStops,
  type JourneyProgressRef,
  type JourneyStop,
} from '@/lib/animations/scroll-journey'
import {configureHeroRenderer} from '@/lib/three/harden-gltf-materials'
import {createOrbitShot, type ShotState} from '@/lib/animations/cinematic-shot'
import {applyOrbitState} from '@/lib/animations/apply-orbit-state'

/** Match production spin rate (`delta / 10`) */
const EARTH_SPIN_RATE = 0.1
const EARTH_FLOAT_FREQ = 0.35
const EARTH_FLOAT_AMP = 0.05
const LIGHT_DRIFT_SPEED = 0.1
const LIGHT_RADIUS = 1.25
const PARALLAX_STRENGTH = 0.08
const PARALLAX_DAMP = 0.05

/** Production asset stack — grayscale archival look (not the colorful 8K day/night set) */
const EARTH_TEXTURES = [
  '/assets/earth2/color.jpg',
  '/assets/earth2/normal.png',
  '/assets/earth2/occlusion.jpg',
] as const

const EARTH_NORMAL_SCALE = new THREE.Vector2(1.25, 1.25)

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
      earth.rotation.x = parallaxTarget.current.y * 0.28
      earth.rotation.z = -parallaxTarget.current.x * 0.16

      const light = lightRef.current
      if (light) {
        const t = state.clock.elapsedTime * LIGHT_DRIFT_SPEED
        // Keep the crescent character — drift around the production key position
        light.position.x = 1 + Math.cos(t) * 0.15
        light.position.y = Math.sin(t * 0.7) * 0.2
        light.position.z = -0.25 + Math.sin(t) * 0.12
      }
    }
  })
}

/** Production lighting: near-black ambient + hard side key → archival crescent */
const EarthSceneLights: React.FC<{
  lightRef: React.RefObject<THREE.DirectionalLight | null>
}> = ({lightRef}) => {
  return (
    <>
      {/* Production crescent: near-black ambient + hard side key */}
      <ambientLight intensity={0.1} />
      <directionalLight
        ref={lightRef}
        intensity={2.4}
        position={[1.15, 0.1, -0.2]}
        color='#ffffff'
      />
      <directionalLight intensity={0.18} position={[-2.5, 0.4, 3]} color='#c8d0dc' />
    </>
  )
}

const EarthGlobe: React.FC<EarthIdleProps> = memo(({isIdle = false, reduceMotion = false}) => {
  const earthRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const {gl} = useThree()
  const [colorMap, normalMap, aoMap] = useTexture([...EARTH_TEXTURES])

  useEffect(() => {
    const maxAniso = Math.min(gl.capabilities.getMaxAnisotropy(), 16)
    for (const tex of [colorMap, normalMap, aoMap]) {
      tex.anisotropy = maxAniso
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.needsUpdate = true
    }
    colorMap.colorSpace = THREE.SRGBColorSpace
    normalMap.colorSpace = THREE.NoColorSpace
    aoMap.colorSpace = THREE.NoColorSpace
  }, [gl, colorMap, normalMap, aoMap])

  useEarthIdleMotion(earthRef, lightRef, isIdle, reduceMotion)

  return (
    <>
      <EarthSceneLights lightRef={lightRef} />
      <group ref={earthRef} rotation-y={0.5}>
        <mesh scale={2.5}>
          {/* 96 segs — production used 32; sharper limb without 8K memory cost */}
          <sphereGeometry
            args={[1, 96, 96]}
            onUpdate={(geometry) => {
              // aoMap samples uv2 — sphere ships with uv only
              if (!geometry.attributes.uv2 && geometry.attributes.uv) {
                geometry.setAttribute('uv2', geometry.attributes.uv.clone())
              }
            }}
          />
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            normalScale={EARTH_NORMAL_SCALE}
            aoMap={aoMap}
            aoMapIntensity={0.85}
            roughness={0.92}
            metalness={0.04}
          />
        </mesh>
      </group>
    </>
  )
})
EarthGlobe.displayName = 'EarthGlobe'

/**
 * Scroll-journey camera stops (home Act 2).
 * Visual scale is camera-driven — never DOM-scale the WebGL canvas.
 */
/**
 * Long-lens (telephoto) baseline. The Act-1 Hyperzoom holds this framing as the
 * resting hero, so the Act-2 journey lives on the same 15.5u / 20° baseline —
 * the stops keep the original push/pull ratios, just scaled to the new standoff.
 */
const EARTH_CAM_Z: JourneyStop[] = [
  [0, 15.5],
  [0.3, 9.6],
  [0.62, 12.8],
  [1, 18.7],
]
const EARTH_CAM_Y: JourneyStop[] = [
  [0, 0],
  [0.3, 0],
  [1, 1.15],
]

/** Rest framing the Act-1 fall lands on and the Act-2 journey begins from. */
const EARTH_REST_DISTANCE = 15.5
const EARTH_REST_FOV = 20

const EarthJourneyRig: React.FC<{journeyRef: JourneyProgressRef}> = ({journeyRef}) => {
  const {camera} = useThree()

  useFrame((_, delta) => {
    const t = journeyRef.current
    camera.position.z = damp(camera.position.z, sampleStops(EARTH_CAM_Z, t), 5, delta)
    camera.position.y = damp(camera.position.y, sampleStops(EARTH_CAM_Y, t), 5, delta)
    // Normalise FOV back to rest after the cinematic fall hands off (Descent
    // lands ~46°); harmless once already at rest.
    // Hold the telephoto rest FOV the Hyperzoom lands on; harmless once at rest.
    const perspective = camera as THREE.PerspectiveCamera
    const nextFov = damp(perspective.fov, EARTH_REST_FOV, 5, delta)
    if (Math.abs(nextFov - perspective.fov) > 1e-3) {
      perspective.fov = nextFov
      perspective.updateProjectionMatrix()
    }
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * Act-1 cinematic fall-from-orbit. Samples the Hyperzoom-derived `homeIntro`
 * shot by `introRef` (0..1, driven by the intro timeline) and resolves it onto
 * the camera. It opens wide at 62° from far out, compresses to a long-lens 20°
 * and dollies in to land exactly on the rest framing (distance 15.5, azimuth 0,
 * pitch 0, fov 20) so the hand-off to {@link EarthJourneyRig} is seamless — the
 * azimuth sweep is back-solved (`startAzimuthDeg = -sweep`) to finish
 * origin-facing, and EarthJourneyRig then *holds* this telephoto framing.
 */
const EarthIntroRig: React.FC<{introRef: JourneyProgressRef}> = ({introRef}) => {
  const {camera} = useThree()
  const shot = useRef(
    createOrbitShot({
      preset: 'homeIntro',
      startDistance: 155,
      endDistance: EARTH_REST_DISTANCE,
      startAzimuthDeg: -10,
    })
  )
  const state = useRef<ShotState>({} as ShotState)

  useFrame(() => {
    shot.current.sampleAtProgress(introRef.current, state.current)
    applyOrbitState(camera as THREE.PerspectiveCamera, state.current)
  })

  return null
}

interface EarthProps {
  activeLocation: unknown
  isIdle?: boolean
  reduceMotion?: boolean
  /** Home scroll journey progress (0..1) — enables the camera rig when present */
  journeyRef?: JourneyProgressRef
  /** Act-1 intro fall progress (0..1) — drives the cinematic Descent */
  introRef?: JourneyProgressRef
  /** True while the Act-1 fall owns the camera (before the intro completes) */
  introActive?: boolean
}

export const Earth: React.FC<EarthProps> = memo(
  ({isIdle = false, reduceMotion = false, journeyRef, introRef, introActive = false}) => {
    return (
      <div className='absolute inset-0 h-full w-full' id='earth-canvas'>
        <EarthErrorBoundary>
          <Suspense
            fallback={
              <img
                alt='Earth placeholder'
                src='/assets/earth2/placeholder.png'
                width={1000}
                height={1000}
                loading='lazy'
                className='h-full w-full object-contain bg-black opacity-40'
              />
            }>
            <Canvas
              dpr={[1, 2]}
              camera={{position: [0, 0, 15.5], fov: 20, near: 0.1, far: 500}}
              gl={{
                antialias: true,
                alpha: true,
                premultipliedAlpha: true,
                powerPreference: 'high-performance',
                stencil: false,
              }}
              style={{width: '100%', height: '100%', background: 'transparent'}}
              onCreated={({gl}) => {
                // Transparent clear (alpha 0) so the Earth composites over the
                // stars / orbs / Moon / Prometheus layers beneath it instead of
                // painting an opaque black plate. Exposure slightly above 1 —
                // ACES otherwise crushes the production crescent.
                configureHeroRenderer(gl, 1.25, 0)
              }}>
              <EarthGlobe isIdle={isIdle} reduceMotion={reduceMotion} />
              {/* One rig owns the camera at a time: the fall during Act 1, the
                  scroll journey after. */}
              {introActive && introRef ? (
                <EarthIntroRig introRef={introRef} />
              ) : journeyRef ? (
                <EarthJourneyRig journeyRef={journeyRef} />
              ) : null}
            </Canvas>
          </Suspense>
        </EarthErrorBoundary>
      </div>
    )
  }
)

/** Legacy night-map export */
export const EN: React.FC = memo(() => (
  <Canvas style={{width: '100%', height: '100%'}} dpr={[1, 2]}>
    <ambientLight intensity={0.1} />
    <directionalLight intensity={1.5} position={[1, 0, -0.25]} />
    <Suspense fallback={null}>
      <mesh scale={2.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color='#1a1a1a' roughness={0.95} />
      </mesh>
    </Suspense>
  </Canvas>
))
