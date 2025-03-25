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
import {
  Box,
  DragControls,
  Html,
  Plane,
  QuadraticBezierLine,
  Text,
  View,
} from '@react-three/drei'
import { useDrag } from '@use-gesture/react'
import {
  StarsCard,
  StarsCardDescription,
  StarsCardTitle,
} from '@/components/ui/card/stars-card'

const context = createContext( null )

const Circle = forwardRef(
  (
    {
      children,
      opacity = 1,
      radius = 0.05,
      segments = 32,
      color = '#ff1050',
      ...props
    }: any,
    ref: any
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
Circle.displayName = 'Circle'
// const center = d3.forceCenter(width / 2, height / 2);
// const link = d3.forceLink(links).id((d) => d.id);
// const manyBody = d3.forceManyBody().strength(-100);
// const x = d3.forceX(width / 2);

function force( nodes: any, alpha: number ) {
  for ( let i = 0, n = nodes.length, node, k = alpha * 0.1; i < n; ++i ) {
    node = nodes[i]
    node.vx -= node.x * k
    node.vy -= node.y * k
  }
}

export function Nodes( { children }: any ) {
  const group: any = useRef()
  const [nodes, set]: any = useState( [] )
  console.log( 'nodes: ', nodes )
  const lines = useMemo( () => {
    const lines: any[] = []
    for ( let node of nodes ) {
      node.connectedTo
        .map( ( ref: { current: { position: any } } ) => [
          node.position,
          ref.current.position,
        ] )
        .forEach( ( [start, end]: any ) =>
          lines.push( {
            start: start.clone().add( { x: 0.35, y: 0, z: 0 } ),
            end: end.clone().add( { x: -0.35, y: 0, z: 0 } ),
          } )
        )
    }

    return lines
  }, [nodes] )

  useFrame( ( _, delta ) =>
    group.current.children.forEach(
      ( group: {
        children: {
          material: { uniforms: { dashOffset: { value: number } } }
        }[]
      } ) => ( group.children[0].material.uniforms.dashOffset.value -= delta * 10 )
    )
  )
  return (
    <context.Provider value={set}>
      <group ref={group}>
        {lines.map( ( line, index ) => (
          <group key={index}>
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
        ) )}
      </group>
      {children}
      {lines.map( ( { start, end }: any, index: any ) => (
        <group key={index} position-z={1}>
          <Circle position={start} />
          <Circle position={end} />
        </group>
      ) )}
    </context.Provider>
  )
}

const Icon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className='h-4 w-4 text-white stroke-2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3'
      />
    </svg>
  )
}

function GlowingStarsBackgroundCardPreview( { name }: any ) {
  return (
    <StarsCard>
      <StarsCardTitle>{name}</StarsCardTitle>
      <div className='flex justify-between items-end'>
        <StarsCardDescription>
          The power of full-stack to the frontend. Read the release notes.
        </StarsCardDescription>
        <div className='h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center'>
          <Icon />
        </div>
      </div>
    </StarsCard>
  )
}

export const Node = forwardRef(
  (
    {
      color = 'black',
      name,
      connectedTo = [],
      position = [0, 0, 0],
      ...props
    }: any,
    ref: any
  ) => {
    const set: any = useContext( context )
    const { size, camera } = useThree()
    const [pos, setPos] = useState( () => new THREE.Vector3( ...position ) )
    const state = useMemo(
      () => ( { position: pos, connectedTo } ),
      [pos, connectedTo]
    )
    // Register this node on mount, unregister on unmount
    useLayoutEffect( () => {
      set( ( nodes: any ) => [...nodes, state] )
      return () =>
        void set( ( nodes: any[] ) =>
          nodes.filter(
            ( n: { position: THREE.Vector3; connectedTo: any } ) => n !== state
          )
        )
    }, [state, pos, set] )
    // Drag n drop, hover
    const [hovered, setHovered] = useState( false )

    useEffect(
      () => void ( document.body.style.cursor = hovered ? 'grab' : 'auto' ),
      [hovered]
    )
    const bind = useDrag( ( { down, xy: [x, y] } ) => {
      document.body.style.cursor = down ? 'grabbing' : 'grab'
      setPos(
        new THREE.Vector3(
          ( x / size.width ) * 2 - 1,
          -( y / size.height ) * 2 + 1,
          0
        )
          .unproject( camera )
          .multiply( { x: 1, y: 1, z: 0 } )
          .clone()
      )
    } )
    const [isOccluded, setOccluded] = useState()
    const [isInRange, setInRange] = useState()
    const isVisible = isInRange && !isOccluded
    // Hide contents "behind" other meshes

    // Tells us when contents are occluded (or not)
    // onOcclude={setOccluded}
    // We just interpolate the visible state into css opacity and transforms
    // style={{ transition: 'all 0.2s', opacity: isVisible ? 1 : 0, transform: `scale(${isVisible ? 1 : 0.25})` }}

    return (
      <mesh position={pos} {...props} ref={ref}>
        <Html center>
          <div {...bind()}>
            <GlowingStarsBackgroundCardPreview name={name} />
          </div>
        </Html>
      </mesh>

      // <Circle
      //   ref={ref}
      //   {...bind()}
      //   opacity={0.2}
      //   radius={0.5}
      //   color={color}
      //   position={pos}
      //   {...props}
      // >
      //   <Circle
      //     radius={0.25}
      //     position={[0, 0, 0.1]}
      // onPointerOver={() => setHovered(true)}
      // onPointerOut={() => setHovered(false)}
      //     color={hovered ? '#ff1050' : color}
      //   >
      //     <Text position={[0, 0, 1]} fontSize={0.25}>
      //       {name}
      //     </Text>
      //   </Circle>
      // </Circle>
    )
  }
)

Node.displayName = 'DrawingBoardNode'
