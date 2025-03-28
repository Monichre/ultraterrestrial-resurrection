/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 ./public/assets/ufo/scene.gltf 
Author: aung (https://sketchfab.com/aung)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/ufo-e9b2edd997284a2aaa0e2bbd2a6a4e85
Title: UFO
*/

import {useGLTF} from '@react-three/drei'

export function UfoScene(props) {
  const {nodes, materials} = useGLTF('/assets/ufo/scene.gltf')
  return (
    <group {...props} dispose={null}>
      <group position={[0.043, 0.661, -2.647]} rotation={[-1.082, -0.008, 0]} scale={0.628}>
        <group position={[0.324, -0.007, 4.12]} scale={5.951}>
          <mesh geometry={nodes.Circle001_0.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_1.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_2.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_3.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_4.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_5.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_6.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_7.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_8.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_9.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_10.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_0_11.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Circle001_1.geometry} material={materials['Material.002']} />
          <mesh geometry={nodes.Circle001_1_1.geometry} material={materials['Material.002']} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/assets/ufo/scene.gltf')
