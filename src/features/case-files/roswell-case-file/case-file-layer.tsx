'use client'

import {Html} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {useRef, useState} from 'react'
import * as THREE from 'three'
import type {CaseFileLayer} from './data'
import {LayerCard} from './layer-card'
import {closedTransform, openTransform} from './layout'

interface CaseFileLayerMeshProps {
  layer: CaseFileLayer
  index: number
  total: number
  isOpen: boolean
  onSelect: (layer: CaseFileLayer) => void
}

export function CaseFileLayerMesh({layer, index, total, isOpen, onSelect}: CaseFileLayerMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const closed = closedTransform(index)
  const open = openTransform(layer.type, index, total)
  const target = isOpen ? open : closed

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const lambda = isOpen ? 3.2 : 5
    group.position.x = THREE.MathUtils.damp(group.position.x, target.position[0], lambda, delta)
    group.position.y = THREE.MathUtils.damp(group.position.y, target.position[1], lambda, delta)
    group.position.z = THREE.MathUtils.damp(group.position.z, target.position[2], lambda, delta)
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, target.rotation[0], lambda, delta)
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, target.rotation[1], lambda, delta)
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, target.rotation[2], lambda, delta)
  })

  return (
    <group ref={groupRef} position={closed.position} rotation={closed.rotation}>
      <Html transform distanceFactor={6} zIndexRange={[100, 0]} center>
        <LayerCard
          layer={layer}
          hovered={hovered && isOpen}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => isOpen && onSelect(layer)}
        />
      </Html>
    </group>
  )
}
