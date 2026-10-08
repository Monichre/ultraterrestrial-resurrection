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
import type {TitanClock} from './TitanBody'
import {TORCH_TIP} from './titan-figure'
import {EMBER_VERTEX, FLAME_VERTEX, SPRITE_FRAGMENT} from './titan-shaders'

type StolenFireProps = {
  clock: RefObject<TitanClock>
  intensity: number
  pixelScale: number
  flameCount: number
}

const FIRE_SEED = 451
const EMBER_COUNT = 520
const FIRE_HOT = '#ffe6a8'
const FIRE_MID = '#ff8040'
const FIRE_COOL = '#8a1606'
const FLAME_POINT_SIZE = 0.028
const EMBER_POINT_SIZE = 0.014

const createRandomGeometry = (count: number, seed: number) => {
  let state = seed
  const random = () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute(
    'aRandom',
    new BufferAttribute(Float32Array.from({length: count * 4}, random), 4)
  )
  return geometry
}

const createFireMaterial = (vertexShader: string, pointSize: number, falloff: number) =>
  new ShaderMaterial({
    vertexShader,
    fragmentShader: SPRITE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uFireTime: {value: 0},
      uIgnition: {value: 0},
      uIntensity: {value: 1},
      uDensity: {value: 0.5},
      uPointSize: {value: pointSize},
      uPixelScale: {value: 1},
      uFalloff: {value: falloff},
      uFirePos: {value: new Vector3(...TORCH_TIP)},
      uHot: {value: new Color(FIRE_HOT)},
      uMid: {value: new Color(FIRE_MID)},
      uCool: {value: new Color(FIRE_COOL)},
    },
  })

export const StolenFire = ({clock, intensity, pixelScale, flameCount}: StolenFireProps) => {
  const flameGeometry = useMemo(() => createRandomGeometry(flameCount, FIRE_SEED), [flameCount])
  const emberGeometry = useMemo(() => createRandomGeometry(EMBER_COUNT, FIRE_SEED * 7), [])
  const flameMaterial = useMemo(() => createFireMaterial(FLAME_VERTEX, FLAME_POINT_SIZE, 2.2), [])
  const emberMaterial = useMemo(() => createFireMaterial(EMBER_VERTEX, EMBER_POINT_SIZE, 1.4), [])

  useEffect(() => () => flameGeometry.dispose(), [flameGeometry])
  useEffect(
    () => () => [emberGeometry, flameMaterial, emberMaterial].forEach((item) => item.dispose()),
    [emberGeometry, flameMaterial, emberMaterial]
  )

  useEffect(() => {
    for (const material of [flameMaterial, emberMaterial]) {
      material.uniforms.uPixelScale.value = pixelScale
      material.uniforms.uIntensity.value = intensity
      material.uniforms.uDensity.value = Math.min(intensity * 0.5, 1)
    }
  }, [flameMaterial, emberMaterial, pixelScale, intensity])

  useFrame(() => {
    const {fireTime, ignition} = clock.current
    flameMaterial.uniforms.uFireTime.value = fireTime
    flameMaterial.uniforms.uIgnition.value = ignition
    emberMaterial.uniforms.uFireTime.value = fireTime
    emberMaterial.uniforms.uIgnition.value = ignition
  })

  return (
    <>
      <points geometry={emberGeometry} material={emberMaterial} frustumCulled={false} />
      <points geometry={flameGeometry} material={flameMaterial} frustumCulled={false} />
    </>
  )
}
