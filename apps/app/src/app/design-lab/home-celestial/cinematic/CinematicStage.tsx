'use client'

/**
 * CinematicStage — design-lab preview for the ported cinematic camera.
 *
 * Renders the production Earth globe (same PBR stack + crescent light) and
 * drives the camera with `createOrbitShot` / `applyOrbitState`. Lets you feel
 * each shot before it is wired into the home hero:
 *   - pick a shot (Descent / Dive / Orbit / Flyby / Hyperzoom)
 *   - Play the autorun timing, or scrub it like the Act-2 scroll journey
 *   - tune far/near distance + duration
 *
 * Never DOM-scales the canvas — all motion is camera-driven.
 */

import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {useTexture} from '@react-three/drei'
import {Suspense, useEffect, useMemo, useRef, useState} from 'react'
import * as THREE from 'three'
import {configureHeroRenderer} from '@/lib/three/harden-gltf-materials'
import {applyOrbitState} from '@/lib/animations/apply-orbit-state'
import {
  createOrbitShot,
  SHOT_KEYS,
  SHOT_PRESETS,
  type OrbitShot,
  type ShotState,
} from '@/lib/animations/cinematic-shot'

const EARTH_TEXTURES = [
  '/assets/earth2/color.jpg',
  '/assets/earth2/normal.png',
  '/assets/earth2/occlusion.jpg',
] as const

const EARTH_RADIUS = 2.5

function EarthGlobe() {
  const ref = useRef<THREE.Mesh>(null)
  const {gl} = useThree()
  const [colorMap, normalMap, aoMap] = useTexture([...EARTH_TEXTURES])

  useEffect(() => {
    const maxAniso = Math.min(gl.capabilities.getMaxAnisotropy(), 16)
    for (const tex of [colorMap, normalMap, aoMap]) {
      tex.anisotropy = maxAniso
      tex.needsUpdate = true
    }
    colorMap.colorSpace = THREE.SRGBColorSpace
    normalMap.colorSpace = THREE.NoColorSpace
    aoMap.colorSpace = THREE.NoColorSpace
  }, [gl, colorMap, normalMap, aoMap])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04
  })

  return (
    <mesh
      ref={ref}
      onUpdate={(m) => {
        const geo = m.geometry as THREE.BufferGeometry
        if (!geo.attributes.uv2 && geo.attributes.uv) {
          geo.setAttribute('uv2', geo.attributes.uv.clone())
        }
      }}>
      <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(1.25, 1.25)}
        aoMap={aoMap}
        aoMapIntensity={0.85}
        roughness={0.92}
        metalness={0.04}
      />
    </mesh>
  )
}

function Starfield({count = 1600}: {count?: number}) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // shell far behind the globe so the fall has a parallax reference
      const r = 60 + Math.random() * 40
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.13} sizeAttenuation color='#c8d2e6' transparent opacity={0.75} />
    </points>
  )
}

type RigProps = {
  shot: OrbitShot
  playingRef: React.MutableRefObject<boolean>
  scrubRef: React.MutableRefObject<number>
  onProgress: (p: number) => void
  onEnd: () => void
}

function CinematicRig({shot, playingRef, scrubRef, onProgress, onEnd}: RigProps) {
  const {camera} = useThree()
  const elapsed = useRef(0)
  const state = useRef<ShotState>({} as ShotState)
  const lastReport = useRef(0)

  // Reset the clock whenever a play is (re)armed via the shot identity change.
  useEffect(() => {
    elapsed.current = 0
  }, [shot])

  useFrame((_, delta) => {
    let p: number
    if (playingRef.current) {
      elapsed.current += delta
      p = elapsed.current / shot.duration
      if (p >= 1) {
        p = 1
        playingRef.current = false
        onEnd()
      }
      scrubRef.current = p
      // throttle React updates to ~12fps
      if (performance.now() - lastReport.current > 80) {
        lastReport.current = performance.now()
        onProgress(p)
      }
    } else {
      p = scrubRef.current
    }

    shot.sampleAtProgress(p, state.current)
    applyOrbitState(camera as THREE.PerspectiveCamera, state.current)
  })

  return null
}

export function CinematicStage() {
  const [presetKey, setPresetKey] = useState<string>('descent')
  const [startDistance, setStartDistance] = useState(42)
  const [endDistance, setEndDistance] = useState(3.6)
  const [duration, setDuration] = useState(SHOT_PRESETS.descent.duration)
  const [scrub, setScrub] = useState(0)
  const [playing, setPlaying] = useState(false)

  const playingRef = useRef(false)
  const scrubRef = useRef(0)

  const shot = useMemo(
    () => createOrbitShot({preset: presetKey, startDistance, endDistance, duration}),
    [presetKey, startDistance, endDistance, duration]
  )

  const selectPreset = (key: string) => {
    setPresetKey(key)
    setDuration(SHOT_PRESETS[key].duration)
    playingRef.current = false
    setPlaying(false)
    scrubRef.current = 0
    setScrub(0)
  }

  const play = () => {
    scrubRef.current = 0
    setScrub(0)
    playingRef.current = true
    setPlaying(true)
  }

  const onScrub = (p: number) => {
    playingRef.current = false
    setPlaying(false)
    scrubRef.current = p
    setScrub(p)
  }

  const preset = SHOT_PRESETS[presetKey]

  return (
    <div
      data-testid={`cinematic-${presetKey}`}
      className='relative overflow-hidden rounded border border-[var(--ut-line)] bg-black'>
      <div className='aspect-[16/9] w-full'>
        <Canvas
          dpr={[1, 2]}
          camera={{position: [0, 0, 42], fov: 40, near: 0.1, far: 400}}
          gl={{antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false}}
          onCreated={({gl}) => configureHeroRenderer(gl, 1.25)}>
          <color attach='background' args={['#000000']} />
          <ambientLight intensity={0.1} />
          <directionalLight intensity={2.4} position={[1.15, 0.1, -0.2]} color='#ffffff' />
          <directionalLight intensity={0.18} position={[-2.5, 0.4, 3]} color='#c8d0dc' />
          <Suspense fallback={null}>
            <EarthGlobe />
          </Suspense>
          <Starfield />
          <CinematicRig
            shot={shot}
            playingRef={playingRef}
            scrubRef={scrubRef}
            onProgress={setScrub}
            onEnd={() => setPlaying(false)}
          />
        </Canvas>
      </div>

      {/* Shot readout */}
      <div className='pointer-events-none absolute left-3 top-3 max-w-[60%]'>
        <p className='ut-mono text-[10px] uppercase tracking-[0.35em] text-white/80'>
          {preset.name}
        </p>
        <p className='ut-mono mt-1 text-[9px] leading-relaxed text-white/45'>{preset.tagline}</p>
      </div>

      {/* Controls */}
      <div
        data-feedback-ui
        className='space-y-3 border-t border-[var(--ut-line)] bg-[var(--ut-surface)] px-4 py-3'>
        <div className='flex flex-wrap gap-1.5'>
          {SHOT_KEYS.map((key) => (
            <button
              key={key}
              type='button'
              onClick={() => selectPreset(key)}
              className={`ut-mono rounded border px-2.5 py-1 text-[9px] uppercase tracking-wide ${
                key === presetKey
                  ? 'border-emerald-400/50 bg-emerald-400/15 text-emerald-300'
                  : 'border-[var(--ut-line)] text-[var(--ut-ink-dim)] hover:text-[var(--ut-paper)]'
              }`}>
              {SHOT_PRESETS[key].name}
            </button>
          ))}
          <button
            type='button'
            onClick={play}
            className='ut-mono ml-auto rounded border border-white/40 bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wide text-white/90'>
            {playing ? 'Playing…' : 'Play'}
          </button>
        </div>

        <label className='block'>
          <span className='ut-mono text-[8px] uppercase tracking-wide text-[var(--ut-ink-faint)]'>
            Scrub (Act-2 scroll feel) · {(scrub * 100).toFixed(0)}%
          </span>
          <input
            type='range'
            min={0}
            max={1}
            step={0.005}
            value={scrub}
            onChange={(e) => onScrub(Number(e.target.value))}
            className='mt-1 w-full accent-emerald-400'
          />
        </label>

        <div className='grid grid-cols-3 gap-3'>
          <label className='block'>
            <span className='ut-mono text-[8px] uppercase tracking-wide text-[var(--ut-ink-faint)]'>
              Far · {startDistance.toFixed(0)}
            </span>
            <input
              type='range'
              min={18}
              max={90}
              step={1}
              value={startDistance}
              onChange={(e) => setStartDistance(Number(e.target.value))}
              className='mt-1 w-full accent-emerald-400'
            />
          </label>
          <label className='block'>
            <span className='ut-mono text-[8px] uppercase tracking-wide text-[var(--ut-ink-faint)]'>
              Near · {endDistance.toFixed(1)}
            </span>
            <input
              type='range'
              min={3}
              max={9}
              step={0.1}
              value={endDistance}
              onChange={(e) => setEndDistance(Number(e.target.value))}
              className='mt-1 w-full accent-emerald-400'
            />
          </label>
          <label className='block'>
            <span className='ut-mono text-[8px] uppercase tracking-wide text-[var(--ut-ink-faint)]'>
              Duration · {duration.toFixed(0)}s
            </span>
            <input
              type='range'
              min={3}
              max={16}
              step={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className='mt-1 w-full accent-emerald-400'
            />
          </label>
        </div>
      </div>
    </div>
  )
}
