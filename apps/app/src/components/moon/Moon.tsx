'use client'

import {PerspectiveCamera, useGLTF} from '@react-three/drei'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {Suspense, useEffect, useRef, type FC} from 'react'
import * as THREE from 'three'
import {
  damp,
  sampleStops,
  type JourneyProgressRef,
  type JourneyStop,
} from '@/lib/animations/scroll-journey'
import {configureHeroRenderer, hardenMaterialMaps} from '@/lib/three/harden-gltf-materials'

const MOON_GLB_URL = '/assets/moon/moon.glb'
const MOON_SPIN_RATE = 0.055
const MOON_MESH_NAME = 'Sphere001_Material_#39_0'
const MOON_BASE_SCALE = 0.04
const MOON_NORMAL_SCALE = new THREE.Vector2(1.4, 1.4)

useGLTF.preload(MOON_GLB_URL)

type MoonGltf = {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.MeshStandardMaterial>
}

/**
 * Visual size stops (replaces the old DOM `scale` scrub that crushed WebGL resolution).
 * Rest ≈ prior 0.6 DOM scale · flyby ≈ 2.35 · arrival ≈ 1.55
 */
const MOON_VISUAL_SCALE: JourneyStop[] = [
  [0, 1],
  [0.22, 1],
  [0.62, 2.85],
  [1, 1.9],
]

export const MoonScene = ({journeyRef}: {journeyRef?: JourneyProgressRef}) => {
  const {nodes, materials} = useGLTF(MOON_GLB_URL) as unknown as MoonGltf
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const {gl} = useThree()

  useEffect(() => {
    const material = materials.Material_39
    if (!material) return
    hardenMaterialMaps(material, Math.min(gl.capabilities.getMaxAnisotropy(), 16))
    material.roughness = 0.9
    material.metalness = 0.02
    material.normalScale = MOON_NORMAL_SCALE
    material.needsUpdate = true
  }, [gl, materials])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * MOON_SPIN_RATE
    }
    if (groupRef.current && journeyRef) {
      const target = sampleStops(MOON_VISUAL_SCALE, journeyRef.current)
      const next = damp(groupRef.current.scale.x, target, 5, delta)
      groupRef.current.scale.setScalar(next)
    }
  })

  const geometry = nodes[MOON_MESH_NAME]?.geometry
  const material = materials.Material_39

  if (!geometry || !material) return null

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry} material={material} scale={MOON_BASE_SCALE} />
      <spotLight
        position={[10, 2, -8]}
        intensity={2.6}
        angle={0.3}
        penumbra={0.85}
        color='#f2f0ea'
        decay={0}
      />
      <directionalLight position={[-4, 2, 6]} intensity={0.45} color='#9db8ff' />
      <ambientLight intensity={0.05} />
    </group>
  )
}

const MOON_CAM_Z: JourneyStop[] = [
  [0, 5],
  [0.22, 5],
  [0.62, 3.35],
  [1, 4.4],
]
const MOON_CAM_Y: JourneyStop[] = [
  [0, -0.5],
  [0.62, -0.12],
  [1, 0.08],
]

const MoonJourneyRig: FC<{journeyRef: JourneyProgressRef}> = ({journeyRef}) => {
  const {camera} = useThree()

  useFrame((_, delta) => {
    const t = journeyRef.current
    camera.position.z = damp(camera.position.z, sampleStops(MOON_CAM_Z, t), 5, delta)
    camera.position.y = damp(camera.position.y, sampleStops(MOON_CAM_Y, t), 5, delta)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export const Moon = ({journeyRef}: {journeyRef?: JourneyProgressRef}) => {
  return (
    <div className='absolute inset-0 h-full w-full' id='moon-canvas'>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          premultipliedAlpha: true,
        }}
        style={{width: '100%', height: '100%', background: 'transparent'}}
        onCreated={({gl}) => {
          // Transparent clear so Earth shows through — no EffectComposer (it forces opaque)
          gl.setClearColor('#000000', 0)
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.18
        }}>
        <PerspectiveCamera makeDefault position={[0, -0.5, 5]} fov={42} near={0.1} far={100} />
        <Suspense fallback={null}>
          <MoonScene journeyRef={journeyRef} />
        </Suspense>
        {journeyRef ? <MoonJourneyRig journeyRef={journeyRef} /> : null}
      </Canvas>
    </div>
  )
}
