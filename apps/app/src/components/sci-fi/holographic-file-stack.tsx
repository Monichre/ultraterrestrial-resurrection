'use client'

import {OrbitControls, Text, useCursor} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import {useRef, useState} from 'react'
import * as THREE from 'three'

export interface HolographicFileStackItem {
  title: string
  color: string
  id: string
}

export interface HolographicFileStackProps {
  files?: readonly HolographicFileStackItem[]
  spacing?: number
  rotationFactor?: number
  className?: string
}

const DEFAULT_FILES: readonly HolographicFileStackItem[] = [
  {title: 'Document 1', color: '#4f46e5', id: 'doc1'},
  {title: 'Document 2', color: '#8b5cf6', id: 'doc2'},
  {title: 'Document 3', color: '#ec4899', id: 'doc3'},
  {title: 'Document 4', color: '#f43f5e', id: 'doc4'},
]

const EXPANDED_FILE_SPACING = 0.3
const MOTION_DAMPING = 10
const MAX_FRAME_DELTA = 0.1

export function HolographicFileStack({
  files = DEFAULT_FILES,
  spacing = 0.05,
  rotationFactor = 0.2,
  className = '',
}: HolographicFileStackProps) {
  return (
    <div
      aria-label={`${files.length} holographic files`}
      className={`h-80 w-full rounded-xl ${className}`}
      role='group'>
      <Canvas camera={{position: [0, 0, 4], fov: 50}} shadows dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Scene files={files} spacing={spacing} rotationFactor={rotationFactor} />
        <OrbitControls enableDamping enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}

interface SceneProps {
  files: readonly HolographicFileStackItem[]
  spacing: number
  rotationFactor: number
}

function Scene({files, spacing, rotationFactor}: SceneProps) {
  return (
    <group>
      {files.map((file, index) => (
        <File
          key={file.id}
          position={[0, 0, -index * spacing]}
          color={file.color}
          title={file.title}
          index={index}
          rotationFactor={rotationFactor}
          totalFiles={files.length}
        />
      ))}
    </group>
  )
}

interface FileProps {
  position: [number, number, number]
  color: string
  title: string
  index: number
  rotationFactor: number
  totalFiles: number
}

export function File({position, color, title, index, rotationFactor, totalFiles}: FileProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useCursor(hovered)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const mesh = meshRef.current
    const frameDelta = Math.min(delta, MAX_FRAME_DELTA)
    const centeredIndex = index - (totalFiles - 1) / 2
    const targetZ = expanded ? -index * EXPANDED_FILE_SPACING : position[2]
    const targetRotationX = expanded ? rotationFactor / 2 : 0
    const targetRotationY = expanded ? centeredIndex * rotationFactor : 0
    const targetY = expanded ? 0 : Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.02
    const targetRotationZ = expanded ? 0 : Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.01
    const targetScale = hovered ? 1.1 : 1

    mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, MOTION_DAMPING, frameDelta)
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, MOTION_DAMPING, frameDelta)
    mesh.rotation.x = THREE.MathUtils.damp(
      mesh.rotation.x,
      targetRotationX,
      MOTION_DAMPING,
      frameDelta
    )
    mesh.rotation.y = THREE.MathUtils.damp(
      mesh.rotation.y,
      targetRotationY,
      MOTION_DAMPING,
      frameDelta
    )
    mesh.rotation.z = THREE.MathUtils.damp(
      mesh.rotation.z,
      targetRotationZ,
      MOTION_DAMPING,
      frameDelta
    )
    mesh.scale.x = THREE.MathUtils.damp(mesh.scale.x, targetScale, MOTION_DAMPING, frameDelta)
    mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, MOTION_DAMPING, frameDelta)
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation()
        setExpanded((isExpanded) => !isExpanded)
      }}
      onPointerOut={() => setHovered(false)}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      castShadow
      receiveShadow>
      <planeGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.8}
        metalness={0.5}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
      <Text
        position={[0, 0, 0.01]}
        color='#f2efe6'
        fontSize={0.07}
        anchorX='center'
        anchorY='middle'>
        {title}
      </Text>
    </mesh>
  )
}
