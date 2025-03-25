'use client'

import React, { useRef, useEffect, forwardRef, Suspense } from 'react'

import { Canvas, useThree } from '@react-three/fiber'

import {
  PerspectiveCamera,
  OrbitControls,
  Html,
  Billboard,
  Text,
  TrackballControls,
} from '@react-three/drei'
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import * as THREE from 'three'

// const Card = forwardRef(({ position, item, ...rest }: any, ref) => {
//   position
//   return (
//     <mesh position={position} {...rest} ref={ref} className='element'>
//       <planeGeometry />
//       <meshBasicMaterial
//         color={'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')'}
//       />

//       <Text>{item?.name}</Text>
//     </mesh>
//   )
// })
const Card = ({ position, item }: any) => {
  return (
    <mesh position={position}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial />

      <Html position={[0, 0, 1]}>
        <div
          className='element'
          style={{
            backgroundColor:
              'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')',
          }}
        >
          <div className='name'>{item.name}</div>
          {/* <div className='details'>{item.description}</div> */}
        </div>
      </Html>
    </mesh>
  )
}
// const Cards = ({ items }: any) => {
//   const grid = []
//   for (let i = 0; i < items.length; i++) {
//     let position = {
//       x: (i % 5) * 200 - 400,
//       y: -(Math.floor(i / 5) % 5) * 200 + 400,
//       z: Math.floor(i / 25) * 500 - 1000,
//     }

//     grid.push({
//       position,
//       ...items[i],
//     })
//   }
//   return (
//     <group>
//       {grid.map((item: any, i: any) => {
//         const { position, ...rest } = item
//         const ref = useRef()
//         // Note: Custom component needs to handle CSS3DObject
//         return (
//           <Card
//             key={i}
//             item={rest}
//             position={new THREE.Vector3(position.x, position.y, position.z)}
//             ref={ref}
//           />
//         )
//       })}
//     </group>
//   )
// }
const Cards = ({ items }: any) => {
  return (
    <group>
      {items.map((item: any, i: number) => {
        const x = (i % 5) * 400 - 800
        const y = -(Math.floor(i / 5) % 5) * 400 + 800
        const z = Math.floor(i / 25) * 1000 - 2000
        return (
          <Card key={i} item={item} position={new THREE.Vector3(x, y, z)} />
        )
      })}
    </group>
  )
}
export const ThreeDGrid = ({ data }: any) => {
  return (
    <div className='h-[100vh] 3d-grid-graph  overflow-scroll'>
      <Suspense fallback={null}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1000], fov: 40 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <TrackballControls />
          <OrbitControls />

          <Cards items={data} />
        </Canvas>
      </Suspense>
    </div>
  )
}
