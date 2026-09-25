'use client'
// components/GlobeVisualization.js
import React, { useRef, useEffect, useState } from 'react'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Points, Stars } from '@react-three/drei'
import * as THREE from 'three'
// const [SphereInstances, Sphere] = createInstances()

// Sample data: Array of [latitude, longitude] pairs
const geoToCartesian = (lat: number, lon: number, radius: number) => {
  lat = (lat * Math.PI) / 180
  lon = (lon * Math.PI) / 180
  const x = -radius * Math.cos(lat) * Math.cos(lon)
  const y = radius * Math.sin(lat)
  const z = radius * Math.cos(lat) * Math.sin(lon)
  return new THREE.Vector3(x, y, z)
}
const Particles = ({ data, radius }: any) => {
  const meshRef: any = useRef()

  useEffect(() => {
    if (meshRef.current && data.length > 0) {
      console.log('meshRef: ', meshRef)
      data.forEach(({ lat, lng, ...rest }: any, i: any) => {
        // Convert latitude and longitude from degrees to radians
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)

        // Convert spherical coordinates to Cartesian coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)

        // Create a position vector
        // const position = new THREE.Vector3(x, y, z)
        const position = new THREE.Vector3().setFromSpherical(
          new THREE.Spherical(x, y, z)
        )

        // Create a transformation matrix for the instance
        const matrix = new THREE.Matrix4()
        console.log('matrix: ', matrix)
        matrix.setPosition(position)

        // Set the matrix for the current instance
        // meshRef?.current?.setMatrixAt(i, matrix)
        // console.log('meshRef: ', meshRef)
      })

      // Update the instance matrix
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [data, radius, meshRef])

  return (
    <instancedMesh
      ref={meshRef}
      // args={[null, null, data.length]}
      geometry={new THREE.SphereGeometry(0.05, 8, 8)}
    >
      {/* <sphereBufferGeometry={new THREE.SphereGeometry(0.05, 8, 8)} /> */}
      {/* Geometry of each particle */}

      {/* Material of each particle */}
      <meshBasicMaterial color='white' />
    </instancedMesh>
  )
}
// export function EarthAlt({ locations }: any) {

//   const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
//   const particlesRef: any = useRef()
//   const perParticleData: any = useRef({})
//   const [positions, setPositions] = useState<THREE.Vector3[]>([])
//   // Convert geographic coordinates to Cartesian coordinates

//   useEffect(() => {
//     const geom = new THREE.BufferGeometry()
//     const tempPositions: any = []
//     console.log('positions: ', positions)
//     const colors = []

//     // Per-particle data
//     const factors: number[] = []
//     const growths: number[] = []
//     const directions: number[] = []

//     const radius = 500

//     locations.forEach(({ location }: any) => {
//       const lat = location[0]
//       const lon = location[1]
//       const vertex = geoToCartesian(lat, lon, 400)
//       tempPositions.push(vertex.x, vertex.y, vertex.z)

//       // Random factors for animation
//       let factor = 100 + Math.random() * 1000
//       let growth = Math.min(0.9, 0.35 + Math.random())
//       factors.push(factor)
//       growths.push(growth)

//       // Direction vector (normalized)
//       const dir = vertex.clone().normalize()
//       directions.push(dir.x, dir.y, dir.z)
//     })

//     geom.setAttribute(
//       'position',
//       new THREE.Float32BufferAttribute(tempPositions, 3)
//     )
//     setPositions(tempPositions)
//     // Store per-particle data in ref
//     perParticleData.current = {
//       factors,
//       growths,
//       directions,
//       updating: factors.map(() => true),
//       radius,
//     }

//     setGeometry(geom)
//   }, [locations, particlesRef, perParticleData])

//   useFrame(() => {
//     if (particlesRef.current && geometry) {
//       // Rotate the particles
//       particlesRef.current.rotation.y += 0.007

//       // Update material color over time
//       const time = Date.now() * 0.00005
//       const hue = ((360 * (1.0 + time)) % 360) / 360
//       particlesRef.current.material.color.setHSL(hue, 0.5, 0.5)

//       // Update per-particle positions
//       const positions = geometry.attributes.position.array
//       const { factors, growths, directions, updating, radius } =
//         perParticleData.current

//       let needsUpdate = false

//       for (let i = 0; i < positions.length; i += 3) {
//         const idx = i / 3

//         if (updating[idx]) {
//           factors[idx] *= growths[idx]
//           if (factors[idx] <= 1) {
//             updating[idx] = false
//           } else {
//             const dirX = directions[i]
//             const dirY = directions[i + 1]
//             const dirZ = directions[i + 2]
//             const radiusPlusFactor = radius + factors[idx]
//             positions[i] = dirX * radiusPlusFactor
//             positions[i + 1] = dirY * radiusPlusFactor
//             positions[i + 2] = dirZ * radiusPlusFactor
//             needsUpdate = true
//           }
//         }
//       }

//       if (needsUpdate) {
//         geometry.attributes.position.needsUpdate = true
//       }
//     }
//   })

//   console.log('geometry: ', geometry)

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <OrbitControls />
//       <Particles data={locations} radius={500} />
//       {/* <Points
//         // @ts-ignore
//         positions={positions}
//         ref={particlesRef}
//         // geometry={geometry}
//       >
//         <pointsMaterial />
//       </Points> */}
//     </>
//   )
// }
export const CodePenEarthAlt = ({ locations }: any) => {
  console.log('locations: ', locations)
  return (
    <Canvas camera={{ position: [0, 0, 1500], fov: 60 }}>
      {/* <EarthAlt locations={locations} /> */}
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <Particles data={locations} radius={500} />
    </Canvas>
  )
}
