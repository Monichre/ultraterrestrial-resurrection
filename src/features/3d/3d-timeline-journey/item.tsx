'use client'
import { useMemo, useRef } from 'react'
import {
  Mesh,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  Color,
  MeshBasicMaterial,
} from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

import frag from './shaders/item.frag'
import vert from './shaders/default.vert'

interface ItemProps {
  timeline: any
  texture: any
  data: { caption: string; link: string }
  month: string
  itemIndex: number
  itemIndexTotal: number
}

export const Item = ({
  timeline,
  texture,
  data,
  month,
  itemIndex,
  itemIndexTotal,
}: ItemProps) => {
  const meshRef = useRef<any>(null)

  const uniforms = useMemo(
    () => ({
      time: { type: 'f', value: 1.0 },
      fogColor: { type: 'c', value: timeline.scene.fog.color },
      fogNear: { type: 'f', value: timeline.scene.fog.near },
      fogFar: { type: 'f', value: timeline.scene.fog.far },
      texture: { type: 't', value: texture },
      opacity: { type: 'f', value: 1.0 },
      progress: { type: 'f', value: 0.0 },
      gradientColor: { type: 'vec3', value: new Color(0x1b42d8) },
    }),
    [timeline, texture]
  )

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value += 0.01
    }
  })

  // Set initial position
  const align = itemIndexTotal % 4
  let pos = new Vector2()
  if (align === 0) pos.set(-350, 350) // bottom left
  if (align === 1) pos.set(350, 350) // bottom right
  if (align === 2) pos.set(350, -350) // top right
  if (align === 3) pos.set(-350, -350) // top left

  return (
    <group position={[pos.x, pos.y, itemIndex * -300 - 200]}>
      <mesh ref={meshRef} scale={[1, 1, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          attach='material'
          uniforms={uniforms}
          vertexShader={vert}
          fragmentShader={frag}
          fog={true}
          transparent={true}
        />
      </mesh>
      {data.caption && (
        <Text
          position={[0, -texture.size.y / 2 - 50, 0]}
          fontSize={18}
          color='black'
          anchorX='center'
          anchorY='middle'
        >
          {data.caption}
        </Text>
      )}
    </group>
  )
}
