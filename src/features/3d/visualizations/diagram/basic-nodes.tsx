'use  client'
import * as THREE from 'three'
import {
  createContext,
  useMemo,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  forwardRef,
  useEffect,
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Instance, QuadraticBezierLine, Text } from '@react-three/drei'
import { useDrag } from '@use-gesture/react'
import { useSphere } from '@react-three/cannon'
import { RigidBody, BallCollider } from '@react-three/rapier'

const context = createContext()

const Circle = forwardRef(
  (
    {
      children,
      opacity = 1,
      radius = 0.05,
      segments = 32,
      color = '#ff1050',
      id,
      ...props
    },
    ref
  ) => (
    <mesh {...props}>
      <sphereGeometry args={[radius, segments]} />
      <meshBasicMaterial
        transparent={opacity < 1}
        opacity={opacity}
        color={color}
      />
      {children}
    </mesh>
  )
)
const rfs = THREE.MathUtils.randFloatSpread
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const baubleMaterial = new THREE.MeshStandardMaterial({
  color: 'white',
  roughness: 0,
  envMapIntensity: 1,
})

export function Nodes({ children }) {
  const group = useRef()
  const [nodes, set] = useState([])
  const [ref, api] = useSphere(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(20), rfs(20), rfs(20)],
  }))

  const lines = useMemo(() => {
    const childLines: any = []
    for (let node of nodes) {
      node.connectedTo
        .map((ref) => [node.position, ref.current.position])
        .forEach(([start, end]) =>
          childLines.push({
            start: start.clone().add({ x: 0.35, y: 0, z: 0 }),
            end: end.clone().add({ x: -0.35, y: 0, z: 0 }),
          })
        )
    }
    return childLines
  }, [nodes])

  useFrame((_, delta) =>
    group.current.children.forEach(
      (group) =>
        (group.children[0].material.uniforms.dashOffset.value -= delta * 10)
    )
  )
  return (
    <context.Provider value={set}>
      <group ref={group}>
        {lines.map((line, index) => (
          <group key={`${line.start.x}-${line.start.y}-${line.end.x}`}>
            <QuadraticBezierLine
              key={index}
              {...line}
              color='white'
              dashed
              dashScale={50}
              gapSize={20}
            />
            <QuadraticBezierLine
              key={index}
              {...line}
              color='white'
              lineWidth={0.5}
              transparent
              opacity={0.1}
            />
          </group>
        ))}
      </group>
      <instancedMesh
        ref={ref}
        castShadow
        receiveShadow
        args={[sphereGeometry, baubleMaterial, 40]}
      >
        {children}
        {/* {lines.map(({ start, end }, index) => (
          <group key={`${start.x}-${end.x}`} position-z={1}>
            <Box position={start} />
            <Box position={end} />
          </group>
        ))} */}
      </instancedMesh>
    </context.Provider>
  )
}

export const Node = forwardRef(
  (
    {
      color = 'black',
      name,
      connectedTo = [],
      position = [0, 0, 0],
      id,
      ...props
    },
    ref
  ) => {
    const set = useContext(context)
    const { size, camera } = useThree()
    const [pos, setPos] = useState(() => new THREE.Vector3(...position))
    const state = useMemo(
      () => ({ position: pos, connectedTo }),
      [pos, connectedTo]
    )
    // Register this node on mount, unregister on unmount
    useLayoutEffect(() => {
      set((nodes) => [...nodes, state])
      return () => void set((nodes) => nodes.filter((n) => n !== state))
    }, [state])
    // Drag n drop, hover
    const [hovered, setHovered] = useState(false)
    useEffect(
      () => void (document.body.style.cursor = hovered ? 'grab' : 'auto'),
      [hovered]
    )
    const bind = useDrag(({ down, xy: [x, y] }) => {
      document.body.style.cursor = down ? 'grabbing' : 'grab'
      setPos(
        new THREE.Vector3(
          (x / size.width) * 2 - 1,
          -(y / size.height) * 2 + 1,
          0
        )
          .unproject(camera)
          .multiply({ x: 1, y: 1, z: 0 })
          .clone()
      )
    })
    return (
      <Circle
        ref={ref}
        {...bind()}
        opacity={0.2}
        radius={0.5}
        color={color}
        position={pos}
        {...props}
      >
        <Circle
          radius={0.25}
          position={[0, 0, 0.1]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          color={hovered ? '#ff1050' : color}
        >
          <Text position={[0, 0, 1]} fontSize={0.25}>
            {name}
          </Text>
        </Circle>
      </Circle>
    )
  }
)
