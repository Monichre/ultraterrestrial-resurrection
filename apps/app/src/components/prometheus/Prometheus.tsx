'use client'

import {cn} from '@/lib/utils'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {Bloom, ChromaticAberration, EffectComposer, Vignette} from '@react-three/postprocessing'
import {useEffect, useRef, useState} from 'react'
import {Vector2} from 'three'
import {StolenFire} from './StolenFire'
import {TitanBody, type TitanClock} from './TitanBody'
import {TORCH_TIP} from './titan-figure'

export type PrometheusQuality = 'low' | 'high'

export type PrometheusProps = {
  /** Applied to the outer container, which fills its positioned parent. */
  className?: string
  /** Body particle budget: about 12k for `low`, 40k for `high`. */
  quality?: PrometheusQuality
  /** 0..2. Scales flame size, brightness and ember rate. */
  fireIntensity?: number
  /** When false, the Titan starts fully assembled with the fire already lit. */
  assemble?: boolean
  /** Freezes all time-based animation. */
  paused?: boolean
}

const QUALITY_BUDGETS = {
  low: {body: 12_000, flame: 1_200},
  high: {body: 40_000, flame: 2_600},
} as const satisfies Record<PrometheusQuality, {body: number; flame: number}>

const ASSEMBLY_SECONDS = 3
const IGNITION_START_SECONDS = 2.6
const IGNITION_SECONDS = 0.9
const PREWARM_FIRE_SECONDS = 30
const REDUCED_MOTION_FIRE_RATE = 0.35
const MAX_FRAME_DELTA = 0.1
const CAMERA_DISTANCE = 7
const CAMERA_FOV = 32
const CAMERA_DRIFT_RADIANS = 0.06
const FIGURE_YAW = -0.42
const FRAME_FILL = 0.86
const FRAME_BOTTOM = -0.03
const FRAME_TOP = TORCH_TIP[1] + 0.34
const FRAME_LEFT = -0.4
const FRAME_RIGHT = 0.5
const CHROMATIC_OFFSET = new Vector2(0.00045, 0.0003)
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const usePrefersReducedMotion = () => {
  const [isReduced, setIsReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const update = () => setIsReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return isReduced
}

const usePageVisible = () => {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const update = () => setIsVisible(document.visibilityState !== 'hidden')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return isVisible
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

type TitanSceneProps = {
  quality: PrometheusQuality
  fireIntensity: number
  isAssembled: boolean
  isPaused: boolean
  isReducedMotion: boolean
}

const TitanScene = ({
  quality,
  fireIntensity,
  isAssembled,
  isPaused,
  isReducedMotion,
}: TitanSceneProps) => {
  const clock = useRef<TitanClock>({time: 0, fireTime: 0, assembly: 0, ignition: 0})
  const viewport = useThree((state) => state.viewport)
  const canvasHeight = useThree((state) => state.size.height)
  const scale = Math.min(
    (viewport.height * FRAME_FILL) / (FRAME_TOP - FRAME_BOTTOM),
    (viewport.width * FRAME_FILL) / (FRAME_RIGHT - FRAME_LEFT)
  )
  const pixelScale = scale * canvasHeight * viewport.dpr * 0.5
  const budget = QUALITY_BUDGETS[quality]

  useFrame(({camera}, delta) => {
    const state = clock.current
    const isLit = isAssembled || state.ignition > 0
    if (!isPaused) {
      const step = Math.min(delta, MAX_FRAME_DELTA)
      state.time += step
      if (isLit) state.fireTime += step * (isReducedMotion ? REDUCED_MOTION_FIRE_RATE : 1)
    }
    if (isAssembled && state.fireTime < PREWARM_FIRE_SECONDS) state.fireTime = PREWARM_FIRE_SECONDS
    state.assembly = isAssembled ? 1 : clamp01(state.time / ASSEMBLY_SECONDS)
    state.ignition = isAssembled
      ? 1
      : clamp01((state.time - IGNITION_START_SECONDS) / IGNITION_SECONDS)

    const drift = isReducedMotion ? 0 : 1
    const angle = Math.sin(state.time * 0.07) * CAMERA_DRIFT_RADIANS * drift
    camera.position.set(
      Math.sin(angle) * CAMERA_DISTANCE,
      Math.sin(state.time * 0.05) * 0.12 * drift,
      Math.cos(angle) * CAMERA_DISTANCE
    )
    camera.lookAt(0, 0, 0)
  })

  return (
    <group
      scale={scale}
      rotation-y={FIGURE_YAW}
      position={[
        (-(FRAME_LEFT + FRAME_RIGHT) / 2) * scale,
        (-(FRAME_BOTTOM + FRAME_TOP) / 2) * scale,
        0,
      ]}
    >
      <TitanBody
        count={budget.body}
        clock={clock}
        fireIntensity={fireIntensity}
        pixelScale={pixelScale}
      />
      <StolenFire
        clock={clock}
        intensity={fireIntensity}
        pixelScale={pixelScale}
        flameCount={budget.flame}
      />
    </group>
  )
}

export const Prometheus = ({
  className,
  quality = 'high',
  fireIntensity = 1,
  assemble = true,
  paused = false,
}: PrometheusProps) => {
  const isReducedMotion = usePrefersReducedMotion()
  const isVisible = usePageVisible()

  return (
    <div className={cn('pointer-events-none absolute inset-0', className)}>
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, 2]}
        gl={{alpha: true, antialias: false, powerPreference: 'high-performance'}}
        camera={{position: [0, 0, CAMERA_DISTANCE], fov: CAMERA_FOV, near: 0.1, far: 50}}
        onCreated={({gl}) => gl.setClearColor(0x000000, 0)}
      >
        <TitanScene
          quality={quality}
          fireIntensity={clamp01(fireIntensity / 2) * 2}
          isAssembled={!assemble || isReducedMotion}
          isPaused={paused}
          isReducedMotion={isReducedMotion}
        />
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            levels={7}
            radius={0.4}
            intensity={0.9}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.25}
          />
          <ChromaticAberration
            offset={CHROMATIC_OFFSET}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette offset={0.32} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default Prometheus
