'use client'

/**
 * Shared R3F stage for HomeCelestial design-lab variants.
 * Never DOM-scale the canvas — size via camera + mesh transforms only.
 */

import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {useGLTF, useTexture} from '@react-three/drei'
import {Suspense, useEffect, useMemo, useRef, type ReactNode} from 'react'
import * as THREE from 'three'
import {configureHeroRenderer, hardenGltfObject} from '@/lib/three/harden-gltf-materials'

export const PLANET_URLS = {
  mars: '/assets/planets/mars/scene.gltf',
  neptune: '/assets/planets/neptune/scene.gltf',
  moon2: '/assets/planets/moon-2/scene.gltf',
} as const

export type PrimaryBody = 'earth' | 'mars' | 'neptune'
export type SecondaryBody = 'moon2' | 'none' | 'neptune-ghost'
export type Framing = 'prod-shoulder' | 'cinematic-full' | 'dual-ghost'
export type LightRig = 'crescent' | 'cold' | 'ochre'

export type CelestialStageProps = {
  primary: PrimaryBody
  secondary?: SecondaryBody
  framing?: Framing
  light?: LightRig
  /** Optional 0–1 scrub for Variant D motion preview */
  scrub?: number
  caption?: string
  className?: string
}

const EARTH_TEXTURES = [
  '/assets/earth2/color.jpg',
  '/assets/earth2/normal.png',
  '/assets/earth2/occlusion.jpg',
] as const

const LIGHT_PRESETS: Record<
  LightRig,
  {ambient: number; key: number; keyPos: [number, number, number]; exposure: number}
> = {
  crescent: {ambient: 0.1, key: 1.55, keyPos: [1, 0.05, -0.25], exposure: 1.15},
  cold: {ambient: 0.08, key: 1.35, keyPos: [0.7, 0.35, -0.55], exposure: 1.05},
  ochre: {ambient: 0.12, key: 1.7, keyPos: [1.15, 0.2, -0.1], exposure: 1.2},
}

const normalizeObject = (root: THREE.Object3D, targetRadius = 1.05) => {
  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  root.position.sub(center)
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  root.scale.setScalar((targetRadius * 2) / maxDim)
  return root
}

function useNormalizedGltf(url: string, targetRadius = 1.05) {
  const gltf = useGLTF(url)
  return useMemo(() => {
    const clone = gltf.scene.clone(true)
    hardenGltfObject(clone, 16)
    normalizeObject(clone, targetRadius)
    return clone
  }, [gltf.scene, targetRadius])
}

function EarthBody() {
  const [colorMap, normalMap, aoMap] = useTexture([...EARTH_TEXTURES])
  const ref = useRef<THREE.Mesh>(null)

  useEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace
    for (const t of [colorMap, normalMap, aoMap]) {
      t.anisotropy = 16
      t.needsUpdate = true
    }
  }, [colorMap, normalMap, aoMap])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1
  })

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1.05, 96, 96]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        aoMap={aoMap}
        metalness={0.05}
        roughness={0.85}
      />
    </mesh>
  )
}

function GltfBody({
  url,
  radius,
  spin = 0.08,
  opacity = 1,
}: {
  url: string
  radius: number
  spin?: number
  opacity?: number
}) {
  const scene = useNormalizedGltf(url, radius)
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    if (opacity >= 0.999) return
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const mat of mats) {
        const std = mat as THREE.MeshStandardMaterial
        std.transparent = true
        std.opacity = opacity
        std.depthWrite = opacity > 0.5
        std.needsUpdate = true
      }
    })
  }, [scene, opacity])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * spin
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

function SecondaryPlacement({
  framing,
  scrub = 0,
  children,
}: {
  framing: Framing
  scrub?: number
  children: ReactNode
}) {
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    const g = group.current
    if (!g) return
    if (framing === 'prod-shoulder') {
      g.position.set(-1.55, 1.05, -1.1)
      g.scale.setScalar(0.34)
    } else if (framing === 'cinematic-full') {
      // scrub 0 → shoulder pocket; scrub 1 → center flyby
      const t = THREE.MathUtils.clamp(scrub, 0, 1)
      g.position.set(
        THREE.MathUtils.lerp(-1.55, 0.15, t),
        THREE.MathUtils.lerp(1.05, 0.2, t),
        THREE.MathUtils.lerp(-1.1, 0.4, t)
      )
      g.scale.setScalar(THREE.MathUtils.lerp(0.34, 0.95, t))
    } else {
      g.position.set(1.35, -0.15, -1.8)
      g.scale.setScalar(0.72)
    }
  })

  return <group ref={group}>{children}</group>
}

function CameraRig({framing, scrub}: {framing: Framing; scrub: number}) {
  const {camera} = useThree()
  useFrame(() => {
    const targetZ = framing === 'cinematic-full' ? THREE.MathUtils.lerp(6.4, 4.2, scrub) : 6.4
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 6, 0.016)
  })
  return null
}

function SceneContent({
  primary,
  secondary = 'moon2',
  framing = 'prod-shoulder',
  light = 'crescent',
  scrub = 0,
}: Omit<CelestialStageProps, 'caption' | 'className'>) {
  const preset = LIGHT_PRESETS[light]

  return (
    <>
      <color attach='background' args={['#000000']} />
      <ambientLight intensity={preset.ambient} />
      <directionalLight position={preset.keyPos} intensity={preset.key} />
      <CameraRig framing={framing} scrub={scrub} />

      <group>
        {primary === 'earth' && <EarthBody />}
        {primary === 'mars' && <GltfBody url={PLANET_URLS.mars} radius={1.05} spin={0.09} />}
        {primary === 'neptune' && <GltfBody url={PLANET_URLS.neptune} radius={1.08} spin={0.06} />}
      </group>

      {secondary === 'moon2' && (
        <SecondaryPlacement framing={framing} scrub={scrub}>
          <GltfBody url={PLANET_URLS.moon2} radius={1} spin={0.04} />
        </SecondaryPlacement>
      )}

      {secondary === 'neptune-ghost' && (
        <SecondaryPlacement framing='dual-ghost'>
          <GltfBody url={PLANET_URLS.neptune} radius={1} spin={0.03} opacity={0.38} />
        </SecondaryPlacement>
      )}
    </>
  )
}

export function CelestialStage({
  primary,
  secondary = 'moon2',
  framing = 'prod-shoulder',
  light = 'crescent',
  scrub = 0,
  caption,
  className = '',
}: CelestialStageProps) {
  const exposure = LIGHT_PRESETS[light].exposure

  return (
    <div
      data-testid={`celestial-${primary}-${secondary}`}
      className={`relative overflow-hidden rounded border border-[var(--ut-line)] bg-black ${className}`}>
      <div className='aspect-[16/10] w-full'>
        <Canvas
          dpr={[1, 2]}
          camera={{position: [0, 0, 6.4], fov: 32, near: 0.1, far: 100}}
          gl={{antialias: true, alpha: false, powerPreference: 'high-performance'}}
          onCreated={({gl}) => configureHeroRenderer(gl, exposure)}>
          <Suspense fallback={null}>
            <SceneContent
              primary={primary}
              secondary={secondary}
              framing={framing}
              light={light}
              scrub={scrub}
            />
          </Suspense>
        </Canvas>
      </div>
      {caption ? (
        <p className='ut-mono absolute bottom-3 left-3 max-w-[70%] text-[9px] tracking-wide text-white/55'>
          {caption}
        </p>
      ) : null}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]' />
    </div>
  )
}

// Preload for snappy lab switching
useGLTF.preload(PLANET_URLS.mars)
useGLTF.preload(PLANET_URLS.neptune)
useGLTF.preload(PLANET_URLS.moon2)
