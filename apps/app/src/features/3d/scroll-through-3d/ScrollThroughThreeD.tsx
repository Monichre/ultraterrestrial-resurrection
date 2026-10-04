'use client'

import React, {useMemo, useRef, useEffect} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {OrbitControls, Text} from '@react-three/drei'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import * as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'

gsap.registerPlugin(ScrollTrigger)

// Define the path points and curve
const pathPoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(5, -5, 100),
  new THREE.Vector3(20, 0, 200),
  new THREE.Vector3(30, -10, 300),
  new THREE.Vector3(0, 0, 400),
  new THREE.Vector3(5, 5, 500),
  new THREE.Vector3(-5, 5, 600),
  new THREE.Vector3(5, -5, 700),
]

const pathCurve = new THREE.CatmullRomCurve3(pathPoints)

// CameraController moves the camera along the path based on scroll progress
function CameraController({path, colors}: {path: THREE.Curve<THREE.Vector3>; colors: string[]}) {
  const {camera, gl} = useThree()
  const progress = useRef(0)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: '.scrollTarget',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })
  }, [])

  useFrame(() => {
    const p = progress.current
    const newPoint = path.getPointAt(p)
    camera.position.copy(newPoint)
    const lookAtPoint = path.getPointAt((p + 0.01) % 1)
    camera.lookAt(lookAtPoint)

    // Update background color based on scroll progress
    const colorIndex = Math.floor(p * (colors.length - 1))
    const colorProgress = (p * (colors.length - 1)) % 1
    const startColor = new THREE.Color(colors[colorIndex])
    const endColor = new THREE.Color(colors[colorIndex + 1])
    const interpolatedColor = startColor.lerp(endColor, colorProgress)
    gl.setClearColor(interpolatedColor)
  })

  return null
}

// Tube renders the tube geometry along the defined path
function Tube({path}: {path: THREE.Curve<THREE.Vector3>}) {
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(path, 200, 10, 20, false), [path])
  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial
        color='#ffffff'
        emissive='#ffffff'
        roughness={0.5}
        metalness={0.1}
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  )
}

// Particles renders a massive particle system. Warning: 500k particles can be heavy—consider reducing this count if needed.
function Particles() {
  const meshRef = useRef<THREE.Points>(null)
  const particlesCount = 500000
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = Math.random() * 500 - 250
      positions[i * 3 + 1] = Math.random() * 500 - 250
      positions[i * 3 + 2] = Math.random() * 2000 - 1000
    }
    return positions
  }, [particlesCount])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.0008
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color='#ffffff' size={0.1} transparent blending={THREE.AdditiveBlending} />
    </points>
  )
}

// TextOnPath uses the Drei Text component to render text at a given position along the path
function TextOnPath({
  text,
  pathPosition,
  scale = 1,
  color = '#ffffff',
  size = 2,
  posOffset = [0, 0, 0],
}: {
  text: string
  pathPosition: number
  scale?: number
  color?: string
  size?: number
  posOffset?: [number, number, number]
}) {
  const point = pathCurve.getPointAt(pathPosition)
  const position = new THREE.Vector3(
    point.x + posOffset[0],
    point.y + posOffset[1],
    point.z + posOffset[2]
  )

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <Text color={color} fontSize={size} anchorX='center' anchorY='middle'>
        {text}
      </Text>
    </group>
  )
}

// Main component refactored to use react-three/fiber. It sets up the scene, lights, controls, and postprocessing.
export function ScrollThrough3D({years}: {years: number[]}) {
  const colors = ['#000', '#000', '#000', '#000', '#000']

  return (
    <Canvas
      style={{width: '100vw', height: '100vh'}}
      shadows
      camera={{fov: 75, near: 0.1, far: 1000}}>
      <ambientLight intensity={0.5} />
      <pointLight position={[50, 50, 50]} intensity={1} />
      <OrbitControls
        enableDamping={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        enablePan={false}
        enableZoom={false}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minDistance={1}
        maxDistance={70}
      />
      <CameraController path={pathCurve} colors={colors} />
      <Tube path={pathCurve} />
      <Particles />
      {/* Section texts */}
      <TextOnPath text='Section 1' pathPosition={0.01} scale={0.5} size={1} />
      <TextOnPath text='Section 2' pathPosition={0.26} scale={0.5} size={1} />
      <TextOnPath text='Section 3' pathPosition={0.51} scale={0.5} size={1} />
      <TextOnPath text='Section 4' pathPosition={0.76} scale={0.5} size={1} />
      <TextOnPath text='Section 5' pathPosition={0.98} scale={0.5} size={1} />
      {/* Year texts rendered along the path */}
      {years.map((year, index) => (
        <TextOnPath
          key={year}
          text={year.toString()}
          pathPosition={index / years.length}
          scale={0.1}
          size={2}
          posOffset={[-4, 0, 0]}
        />
      ))}
      <EffectComposer>
        <UnrealBloom threshold={0} strength={0.7} radius={0} />
      </EffectComposer>
    </Canvas>
  )
}
