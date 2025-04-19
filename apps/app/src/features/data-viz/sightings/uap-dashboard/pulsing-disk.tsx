"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function PulsingDiskModel() {
  const diskRef = useRef<THREE.Group>(null)
  // Create individual refs for each ring instead of an array of refs
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)
  const ringRef3 = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()

    if (diskRef.current) {
      diskRef.current.rotation.y = elapsedTime * 0.05
    }

    // Handle each ring ref individually
    const rings = [ringRef1, ringRef2, ringRef3]
    rings.forEach((ref, i) => {
      if (ref.current) {
        // Pulsing animation
        const scale = 1 + 0.1 * Math.sin(elapsedTime * 0.5 + i * 0.7)
        ref.current.scale.set(scale, scale, 1)

        // Opacity pulsing
        if (ref.current.material instanceof THREE.Material) {
          const material = ref.current.material as THREE.MeshBasicMaterial
          material.opacity = 0.3 + 0.2 * Math.sin(elapsedTime * 0.5 + i * 0.7)
        }
      }
    })
  })

  return (
    <group ref={diskRef}>
      {/* Main disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>

      {/* Concentric rings - use individual refs */}
      <mesh ref={ringRef1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.2 - 0.05, 1.2, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[2 - 0.05, 2, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ringRef3} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[2.8 - 0.05, 2.8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Cross lines */}
      {[0, Math.PI / 2].map((rotation, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, rotation]} position={[0, 0.06, 0]}>
          <planeGeometry args={[6, 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

export function PulsingDisk() {
  return (
    <Canvas camera={{ position: [0, 4, 6], fov: 45 }} alpha={true}>
      <ambientLight intensity={0.5} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        rotateSpeed={0.3}
      />
      <PulsingDiskModel />
    </Canvas>
  )
}

