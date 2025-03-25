'use client'

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import * as THREE from 'three'

import { useSphere } from '@react-three/cannon'
import {
  Billboard,
  QuadraticBezierLine,
  Text
} from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import { useDrag } from '@use-gesture/react'

const context: any = createContext()

export function Sphere({
  position,
  children,
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  accent,
  color = 'white',
  ...props
}) {
  const api = useRef()
  const ref = useRef()
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [])
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
    )
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })
  return (
    <RigidBody
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      position={pos}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[1]} />
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial {...props} />
        {children}
      </mesh>
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) =>
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      )
    )
  )
  return (
    <RigidBody
      position={[0, 0, 0]}
      type='kinematicPosition'
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1]} />
    </RigidBody>
  )
}
const Circle = forwardRef(
  (
    {
      children,
      opacity = 1,
      radius = 0.05,
      segments = 32,
      color,
      id,
      ...props
    },
    ref
  ) => (
    <mesh ref={ref} {...props}>
      <circleGeometry args={[radius, segments]} />
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
      <instancedMesh
        ref={ref}
        castShadow
        receiveShadow
        args={[sphereGeometry, baubleMaterial, 40]}
      >
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

        {children}
        {lines.map(({ start, end }, index) => (
          <group key={`${start.x}-${end.x}`} position-z={1}>
            <Circle position={start} />
            <Circle position={end} />
          </group>
        ))}
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
    }, [state, pos])
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
      <Billboard>
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
      </Billboard>
    )
  }
)

// export const Node = forwardRef(
//   (
//     {
//       color,
//       name,
//       connectedTo = [],
//       position,
//       rootType,
//       executePlatformWideConnectionSearch,
//       id,
//       child,
//       ...rest
//     }: any,
//     ref
//   ) => {
//     const set: any = useContext(context)
//     const { size, camera, viewport } = useThree()
//     const [pos, setPos] = useState(() => new THREE.Vector3(...position))

//     const state = useMemo(
//       () => ({ position: pos, connectedTo }),
//       [pos, connectedTo]
//     )

//     // Register this node on mount, unregister on unmount
//     useLayoutEffect(() => {
//       set((nodes) => [...nodes, state])
//       return () => void set((nodes) => nodes.filter((n) => n !== state))
//     }, [state, pos])

//     const setPosition = useCallback((positionData) => {
//       console.log('positionData: ', positionData)

//       setPos(
//         new THREE.Vector3(...positionData).clone()
//         // .multiply({ x: 1, y: 1, z: 1 })
//       )
//     }, [])

//     return (
//       <Sphere
//         setPosition={setPosition}
//         opacity={0.2}
//         ref={ref}
//         position={pos}
//         radius={1}
//         color={color}
//         // position={pos}
//         {...rest}
//       />
//     )
//   }
// )

// const Circle = forwardRef(
//   (
//     {
//       children,
//       opacity = 1,
//       radius = 0.05,
//       segments = 32,
//       color = `${DOMAIN_MODEL_COLORS.root}`,
//       ...props
//     }: any,
//     ref
//   ) => (
//     <mesh ref={ref} {...props}>
//       <sphereGeometry args={[radius, 10, 10]} />
//       <meshBasicMaterial
//         transparent={opacity < 1}
//         opacity={opacity}
//         color={color}
//       />
//       {children}
//     </mesh>
//   )
// )

// const Sphere = forwardRef(
//   (
//     {
//       children,
//       opacity = 1,
//       radius = 0.05,
//       segments = 32,
//       position,
//       color,
//       name,
//       setPosition,
//       ...rest
//     }: any,
//     ref
//   ) => {
//     const mesh: any = useRef()
//     const [hovered, setHovered] = useState(false)

//     useEffect(
//       () => void (document.body.style.cursor = hovered ? 'grab' : 'auto'),
//       [hovered]
//     )
//     const bind = useDrag(({ down, xy: [x, y], event }: any) => {
//       console.log('event: ', event?.object?.position)
//       document.body.style.cursor = down ? 'grabbing' : 'grab'

//       setPosition(event?.object.position)
//     })

//     // useFrame((state, delta) => {
//     //   console.log('delta: ', delta)
//     //   console.log('state: ', state)
//     //   // Example: Rotate the sphere based on time
//     //   if (mesh.current) {
//     //     mesh.current.rotation.x += delta
//     //     mesh.current.rotation.y += delta
//     //   }
//     // })
//     const theColor = hovered ? DOMAIN_MODEL_COLORS.root : color
//     return (
//       <mesh
//         ref={mergeRefs([mesh, ref])}
//         {...bind()}
//         {...rest}
//         position={position}
//         opacity={0.5}
//         radius={1}
//         onPointerOver={() => setHovered(true)}
//         onPointerOut={() => setHovered(false)}
//       >
//         <sphereGeometry args={[radius, 20, 20]} />

//         <meshBasicMaterial opacity={1} color={color} />

//         <Billboard>
//           <Circle
//             radius={0.5}
//             color={paletteAlt.gray}
//             position={[0.3, 0.1, 0.2]}
//           >
//             <Text position={[0, 0, 1]} fontSize={0.35}>
//               {name}
//             </Text>
//           </Circle>
//         </Billboard>
//       </mesh>
//     )
//   }
// )

// export const RootNode = forwardRef(
//   (
//     {
//       color,
//       name,
//       connectedTo = [],
//       position,
//       rootType,
//       executePlatformWideConnectionSearch,
//       id,
//       child,
//       ...props
//     }: any,
//     ref
//   ) => {
//     const childRef = useRef()

//     const [connectNodes, setConnectedNodes] = useState(connectedTo)
//     const set: any = useContext(context)
//     const { size, camera, viewport } = useThree()

//     const [pos, setPos] = useState(() => new THREE.Vector3(...position))

//     // const state = useMemo(() => ({ connectNodes }), [connectNodes])
//     // console.log('state: ', state)
//     // Register this node on mount, unregister on unmount
//     // useLayoutEffect(() => {
//     //   set((nodes: any) => [...nodes, ...connectNodes])
//     //   // return () =>
//     //   // void set((nodes: any) => nodes.filter((n) => n !== state.connectNodes))
//     // }, [connectNodes])

//     useEffect(set((nodes) => [...nodes, ...connectNodes]))

//     const [hovered, setHovered] = useState(false)
//     useEffect(
//       () => void (document.body.style.cursor = hovered ? 'grab' : 'auto'),
//       [hovered]
//     )
//     const bind = useDrag(({ down, xy: [x, y], event }: any) => {
//       console.log('event: ', event?.object?.position)
//       document.body.style.cursor = down ? 'grabbing' : 'grab'

//       setPos(
//         new THREE.Vector3(x, -y, 0)
//           .unproject(camera)
//           .multiply({ x: 1, y: 1, z: 0 })
//           .clone()
//       )
//     })

//     return (
//       <>
//         <Billboard>
//           <Circle
//             {...bind()}
//             opacity={0.2}
//             ref={ref}
//             position={pos}
//             radius={child ? 0.5 : 1}
//             color={color}
//             // position={pos}
//             {...props}
//           >
//             <Circle
//               radius={child ? 0.25 : 0.5}
//               position={[0, 0, 0.1]}
//               onPointerOver={() => setHovered(true)}
//               onPointerOut={() => setHovered(false)}
//               color={hovered ? '#ff1050' : color}
//             >
//               <Text position={[0, 0, 1]} fontSize={child ? 0.2 : 0.35}>
//                 {name}
//               </Text>
//             </Circle>
//           </Circle>
//         </Billboard>

//         {connectedTo && connectedTo.length
//           ? connectedTo.map((node: any) => {
//               const { id, ...rest } = node
//               return (
//                 <Billboard>
//                   <Circle
//                     key={id}
//                     parent={{ parentRef: ref, position: { ...position } }}
//                     opacity={0.2}
//                     position={node.position}
//                     radius={0.5}
//                     color={node?.color}
//                     {...rest}
//                   >
//                     <Circle
//                       radius={0.25}
//                       position={[0, 0, 0.1]}
//                       onPointerOver={() => setHovered(true)}
//                       onPointerOut={() => setHovered(false)}
//                       color={hovered ? '#ff1050' : color}
//                     >
//                       <Text position={[0, 0, 1]} fontSize={0.2}>
//                         {node?.name}
//                       </Text>
//                     </Circle>
//                   </Circle>
//                 </Billboard>
//               )
//             })
//           : null}
//       </>
//     )
//   }
// )
// 'use client'

// import * as THREE from 'three'
// import {
//   createContext,
//   useMemo,
//   useRef,
//   useState,
//   useContext,
//   useLayoutEffect,
//   forwardRef,
//   useEffect,
//   useCallback,
// } from 'react'
// import { useFrame, useThree, useGraph } from '@react-three/fiber'
// import {
//   QuadraticBezierLine,
//   Text,
//   Circle as DreiCircle,
//   Billboard,
// } from '@react-three/drei'
// import { useDrag } from '@use-gesture/react'

// const context = createContext(null)

// const Circle = forwardRef(
//   (
//     { children, opacity = 1, radius = 0.05, segments = 32, color, ...props },
//     ref
//   ) => (
//     <mesh ref={ref} {...props}>
//       <circleGeometry args={[radius, segments]} />
//       <meshBasicMaterial
//         transparent={opacity < 1}
//         opacity={opacity}
//         color={color}
//       />
//       {children}
//     </mesh>
//   )
// )

// export function Nodes({ children }) {
//   const group = useRef()

//   const [nodes, setNodes] = useState([])

//   const lines = useMemo(
//     () =>
//       nodes.flatMap((node) =>
//         node.connectedTo.map((ref) => ({
//           start: node.position.clone().add(new THREE.Vector3(0.35, 0, 0)),
//           end: ref?.current?.position
//             .clone()
//             .add(new THREE.Vector3(-0.35, 0, 0)),
//           color: node.color,
//         }))
//       ),
//     [nodes]
//   )

//   useFrame((_, delta) =>
//     group.current.children.forEach(
//       (subGroup) =>
//         (subGroup.children[0].material.uniforms.dashOffset.value -= delta * 10)
//     )
//   )

//   return (
//     <context.Provider value={{ nodes, setNodes }}>
//       <group ref={group}>
//         {lines.map((line, index) => (
//           <QuadraticBezierLine
//             key={index}
//             {...line}
//             dashed
//             dashScale={50}
//             gapSize={20}
//           />
//         ))}
//       </group>
//       {children}
//       {lines.map(({ start, end }, index) => (
//         <DreiCircle key={index} position={start} /> // Example simplification, adjust as needed
//       ))}
//     </context.Provider>
//   )
// }

// export const Node = forwardRef(
//   (
//     {
//       color,
//       name,
//       connectedTo = [],
//       position,
//       rootType,
//       executePlatformWideConnectionSearch,
//       id,
//       child,
//       ...props
//     },
//     ref
//   ) => {
//     const { setNodes } = useContext(context)
//     const { size, camera, get } = useThree()
//     const nodes = get('nodes')
//     console.log('nodes: ', nodes)
//     console.log('nodes: ', nodes)
//     const [pos, setPos] = useState(() => new THREE.Vector3(...position))
//     const state = useMemo(
//       () => ({ position: pos, connectedTo, color }),
//       [pos, connectedTo, color]
//     )

//     useLayoutEffect(() => {
//       // setNodes((nodes) => [...nodes, state])
//       // return () => setNodes((nodes) => nodes.filter((n) => n !== state))
//     }, [])

//     const bind = useDrag(({ down, xy: [x, y], event }: any) => {
//       const z = event.eventObject.position.z
//       setPos(new THREE.Vector3(x, y, z).unproject(camera))
//       document.body.style.cursor = down ? 'grabbing' : 'grab'
//     })

//     return (
//       <Billboard>
//         <Circle
//           {...bind()}
//           ref={ref}
//           opacity={0.2}
//           radius={child ? 0.5 : 1}
//           color={color}
//           {...props}
//         >
//           <Text position={[0, 0, 1]} fontSize={child ? 0.2 : 0.35}>
//             {name}
//           </Text>
//         </Circle>
//       </Billboard>
//     )
//   }
// )
