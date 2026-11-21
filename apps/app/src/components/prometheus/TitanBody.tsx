'use client'

import {useFrame} from '@react-three/fiber'
import {type RefObject, useEffect, useMemo} from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  ShaderMaterial,
  Vector3,
} from 'three'
import {sampleTitanSurface, TORCH_TIP} from './titan-figure'
import {BODY_VERTEX, SPRITE_FRAGMENT} from './titan-shaders'

/** Shared animation state, advanced once per frame by the scene and read by every layer. */
export type TitanClock = {
  time: number
  fireTime: number
  assembly: number
  ignition: number
}

type TitanBodyProps = {
  count: number
  clock: RefObject<TitanClock>
  fireIntensity: number
  pixelScale: number
}

const BODY_SEED = 1729
const BODY_CORE = '#d8e8ff'
const BODY_RIM = '#a4d4ff'
const FIRE_LIGHT = '#ff9a4a'
const REFERENCE_COUNT = 40_000
const REFERENCE_POINT_SIZE = 0.0105

const createBodyGeometry = (count: number) => {
  const sample = sampleTitanSurface(count, BODY_SEED)
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(sample.positions, 3))
  geometry.setAttribute('aNormal', new BufferAttribute(sample.normals, 3))
  geometry.setAttribute('aStart', new BufferAttribute(sample.starts, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(sample.seeds, 1))
  return geometry
}

const createBodyMaterial = () =>
  new ShaderMaterial({
    vertexShader: BODY_VERTEX,
    fragmentShader: SPRITE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: {value: 0},
      uAssembly: {value: 0},
      uFireGlow: {value: 0},
      uFireTime: {value: 0},
      uPointSize: {value: REFERENCE_POINT_SIZE},
      uPixelScale: {value: 1},
      uFalloff: {value: 1.6},
      uFirePos: {value: new Vector3(...TORCH_TIP)},
      uCore: {value: new Color(BODY_CORE)},
      uRim: {value: new Color(BODY_RIM)},
      uWarm: {value: new Color(FIRE_LIGHT)},
    },
  })

export const TitanBody = ({count, clock, fireIntensity, pixelScale}: TitanBodyProps) => {
  const geometry = useMemo(() => createBodyGeometry(count), [count])
  const material = useMemo(createBodyMaterial, [])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    material.uniforms.uPointSize.value = REFERENCE_POINT_SIZE * Math.sqrt(REFERENCE_COUNT / count)
    material.uniforms.uPixelScale.value = pixelScale
  }, [material, count, pixelScale])

  useFrame(() => {
    const {time, fireTime, assembly, ignition} = clock.current
    const uniforms = material.uniforms
    uniforms.uTime.value = time
    uniforms.uFireTime.value = fireTime
    uniforms.uAssembly.value = assembly
    uniforms.uFireGlow.value = ignition * fireIntensity
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
