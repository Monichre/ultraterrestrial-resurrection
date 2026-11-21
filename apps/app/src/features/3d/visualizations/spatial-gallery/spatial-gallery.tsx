'use client'

import * as THREE from 'three'
import { forwardRef, Suspense, useEffect, useRef, useState } from 'react'
import {
  Canvas,
  useFrame,
  extend,
  useLoader,
  useGraph,
} from '@react-three/fiber'
import {
  useCursor,
  MeshReflectorMaterial,
  Text,
  Environment,
  Html,
  useTexture,
  Preload,
} from '@react-three/drei'

import { useRouter, useSearchParams } from 'next/navigation'
import { easing, geometry } from 'maath'
import NextImage from 'next/image'
extend(THREE)
extend(geometry)
extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

const GOLDENRATIO = 1.61803398875

export const SpatialGallery = ({ items }: any) => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
      <Suspense fallback={null}>
        <color attach='background' args={['#191920']} />
        <fog attach='fog' args={['#191920', 0, 15]} />
        <group position={[0, -0.5, 0]}>
          <Frames items={items} />

          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              mirror={0.75}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color='#050505'
              metalness={0.5}
            />
          </mesh>
        </group>
        <Environment preset='city' />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}

function Frames({
  items,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref: any = useRef()
  const clicked: any = useRef()

  const router = useRouter()

  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  useEffect(() => {
    clicked.current = ref?.current?.getObjectByName(id)

    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })

  const handleClick = (e) => {
    e.stopPropagation()
    router.push(
      clicked.current === e.object ? '/history' : '?id=' + e.object.name
    )
  }
  const handleHistory = () => {
    router.push('/history')
  }

  return (
    <group
      ref={ref}
      onClick={handleClick}
      onPointerMissed={handleHistory}
      name={`parent-frames-group`}
    >
      {items?.length
        ? items.map(
            (item: any) => <Frame key={item.id} item={item}  /> /* prettier-ignore */
          )
        : null}
    </group>
  )
}

function Frame({ item, c = new THREE.Color(), ...props }) {
  const { position, rotation, ...rest } = item
  const image: any = useRef()
  const frame: any = useRef()

  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())

  const name = item.name
  const isActive = id === item.id
  const proxyUrl = `/api/image?imageUrl=${item?.photo.url}`
  const texture: any = useTexture(proxyUrl)

  useCursor(hovered)
  useFrame((state, dt) => {
    if (image?.current?.material) {
      image.current.material.zoom =
        2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    }

    easing.damp3(
      image?.current?.scale,
      [
        0.85 * (!isActive && hovered ? 0.85 : 1),
        0.9 * (!isActive && hovered ? 0.905 : 1),
        1,
      ],
      0.1,
      dt
    )

    easing.dampC(
      frame?.current?.material?.color,
      hovered ? 'orange' : 'white',
      0.1,
      dt
    )
  }, 1)

  return (
    <group rotation={rotation} position={position}>
      <mesh
        name={`${item.id}`}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color='#151515'
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Html
          ref={image}
          castShadow
          receiveShadow
          transform
          position={[0, 0, 0.7]}
          raycast={() => null}
          scale={0.1}
          occlude='blending'
        >
          <NextImage
            src={proxyUrl}
            alt='test'
            height={300}
            width={400}
            style={{ objectFit: 'contain' }}
          />
          <p>{name.split('-').join(' ')}</p>
        </Html>
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX='left'
        anchorY='top'
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {name.split('-').join(' ')}
      </Text>
      <Text
        maxWidth={0.1}
        anchorX='left'
        anchorY='top'
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {item.date}
      </Text>
    </group>
  )
}
