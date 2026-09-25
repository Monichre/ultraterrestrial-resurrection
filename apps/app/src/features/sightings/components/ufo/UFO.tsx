'use client'


import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
export function UFOScene( { offset = 0, ...props }: any ) {
  const meshRef = useRef<THREE.Mesh>()
  const lightRef = useRef<THREE.SpotLight>()

  // Preload the model
  useGLTF.preload( '/assets/ufo/ufo.glb' )

  const { nodes, materials } = useGLTF( '/assets/ufo/scene.gltf' )

  console.log( "🚀 ~ file: UFO.tsx:17 ~ UFOScene ~ nodes:", nodes )


  // Add hovering animation
  useFrame( ( state, delta ) => {
    if ( meshRef.current ) {
      // Rotate slowly
      meshRef.current.rotation.y += delta * 0.2
      // Add subtle hovering effect
      meshRef.current.position.y = Math.sin( state.clock.elapsedTime ) * 0.1
    }
  } )

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        // geometry={nodes.UFO.geometry}
        material={materials.UFO_material}
        scale={0.5}
      >
        {/* Add glowing effect with point lights */}
        <pointLight
          position={[0, 0.2, 0]}
          intensity={2}
          color="#4af2d6"
          distance={3}
        />
      </mesh>

      {/* Add atmospheric lighting */}
      <group ref={lightRef}>
        <spotLight
          position={[5, 5, 0]}
          intensity={1}
          angle={0.2}
          penumbra={1}
          color="#ffffff"
        />
      </group>
    </group>
  )
}

// // Create a wrapper component for Canvas if needed
// export function UFO() {
//   return (
//     <div className="h-full w-full">
//       <Canvas gl={{ antialias: false }} >
//         <PerspectiveCamera makeDefault position={[0, -0.5, 5]} fov={50} />
//         <ambientLight intensity={0.01} />
//         <directionalLight intensity={5} position={[1, 5, -2]} />
//         <Suspense fallback={null}>

//           <UFOScene />
//         </Suspense>
//       </Canvas>
//     </div>
//   )
// } 

// 'use client'

// import { OrbitControls, useGLTF } from '@react-three/drei'
// import { Canvas } from '@react-three/fiber'
// import { Suspense } from 'react'
// import * as THREE from 'three'

// interface UFOSceneProps {
//   offset?: number
//   scale?: number
// }

// interface UFOModel {
//   nodes: Record<string, THREE.Mesh>
//   materials: Record<string, THREE.Material>
// }

// export function UFOModel( props ) {
//   // Load the GLTF; returns { scene, nodes, materials, animations, ... }
//   const { scene } = useGLTF( '/assets/ufo-alt/scene.gltf' )

//   // The glTF's root scene is returned as a Three.js `Object3D`
//   // We can wrap it in a <primitive> to place it in the scene.
//   return <primitive object={scene} {...props} />
// }

// // Preload model at module level
// useGLTF.preload( '/assets/ufo/scene.gltf' )

// export function UFO() {
//   return (
//     <div className="h-full w-full">
//       <Canvas gl={{ antialias: false }}>
//         <Suspense fallback={null}>

//           {/* <ambientLight intensity={0.01} /> */}
//           {/* <directionalLight intensity={5} position={[1, 5, -2]} /> */}
//           <UFOModel />
//           <OrbitControls />
//         </Suspense>
//       </Canvas>
//     </div>
//   )
// }