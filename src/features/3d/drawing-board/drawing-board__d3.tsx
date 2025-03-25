'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { DotGridBackground } from '@/components/backgrounds'
import { Canvas, useFrame } from '@react-three/fiber'
import { a, useTransition, useSpring } from '@react-spring/three'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from 'd3-force'
import {
  OrbitControls,
  Text,
  Html,
  Plane,
  ContactShadows,
  Text3D,
} from '@react-three/drei'
import * as THREE from 'three'
import { Spotlight } from '@/components/animated/spotlight'
import { motion } from 'framer-motion'

import { Flex, Box } from '@react-three/flex'
import type { NetworkGraphPayload } from '@/db/xata'
import {
  StarsCard,
  StarsCardTitle,
  StarsCardDescription,
} from '@/components/ui/card/stars-card'

const BasicNoteCard = ( { data, ...rest }: any ) => {
  return (
    <Html {...rest}>
      <div className='flex h-[400px] w-full items-center justify-center rounded-lg border border-light-border dark:border-dark-border md:h-[640px] md:flex-1'>
        <motion.div
          className='group relative flex w-[500px] cursor-pointer flex-col overflow-hidden rounded-2xl bg-white font-sans shadow-lg transition-shadow ease-out hover:shadow-2xl dark:bg-[#1A1A1A] dark:shadow-inner-shadow-dark-md dark:hover:shadow-inner-shadow-dark-float'
          initial={{
            height: 116,
            width: 200,
          }}
          style={{
            height: '116px',
            width: '200px',
          }}
          transition={{
            damping: 20,
            stiffness: 260,
            type: 'spring',
          }}
          whileHover={{
            scale: 1.05,
          }}
        >
          <div className='flex flex-col items-start w-full gap-4 px-4 py-4'>
            <div className='flex items-start justify-between w-full'>
              <div className='flex flex-col items-start gap-4'>
                <div className='inline-block select-none rounded-full bg-[#FFF2F6] px-3 py-1 text-[12px] font-medium text-[#FF0342] transition-colors duration-200 group-hover:bg-[#FFEDF2]'>
                  In 15 mins
                </div>
                <div>
                  <div className='text-lg font-semibold'>Design Sync</div>
                  <div className='text-sm text-gray-500'>1:30PM → 2:30PM</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Html>
  )
}

function CardNode( { node, r, position, ...props }: any ) {
  const ref: any = useRef()
  useFrame( ( state ) => {
    ref.current.rotation.x =
      ref.current.rotation.y =
      ref.current.rotation.z +=
      0.004 * r
    ref.current.position.y =
      position[1] +
      Math[r > 0.5 ? 'cos' : 'sin']( state.clock.getElapsedTime() * r ) * r
  } )
  return (
    <group position={position} ref={ref}>
      <mesh scale={2}>
        <planeGeometry />
        <meshStandardMaterial color={node?.color || node?.fill} />
        <Html occlude distanceFactor={1.5} position={[0, 0, 0.51]} transform>
          <BasicNoteCard />
        </Html>
      </mesh>
    </group>
  )
}
function GlowingStarsBackgroundCardPreview() {
  return (
    <div className='flex py-20 items-center justify-center antialiased'>
      <StarsCard>
        <StarsCardTitle>Next.js 14</StarsCardTitle>
        <div className='flex justify-between items-end'>
          <StarsCardDescription>
            The power of full-stack to the frontend. Read the release notes.
          </StarsCardDescription>
          <div className='h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center'>
            <Icon />
          </div>
        </div>
      </StarsCard>
    </div>
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

function Nodes( { nodes }: any ) {
  const transition = useTransition( nodes, {
    from: { scale: [0, 0, 0], rotation: [0, 0, 0] },
    enter: ( { r } ) => ( { scale: [1, 1, 1], rotation: [r * 3, r * 3, r * 3] } ),
    leave: { scale: [0.1, 0.1, 0.1], rotation: [0, 0, 0] },
    config: { mass: 5, tension: 1000, friction: 100 },
    trail: 100,
  } )
  return transition( ( props, { position: [x, y, z], r, geometry } ) => (
    <CardNode
      position={[x * 3, y * 3, z]}
      material={new THREE.MeshStandardMaterial()}
      geometry={geometry}
      r={r}
      {...props}
    />
  ) )
}

const D3Graph = ( { allEntityGraphData, graph }: any ) => {
  console.log( 'allEntityGraphData: ', allEntityGraphData )
  console.log( 'graph: ', graph )
  const nodeRef: any = useRef()
  const linkRef: any = useRef()
  const [currentNodes, setCurrentNodes] = useState( graph.events.nodes )
  const [currentLinks, setCurrentLinks] = useState( graph.events.links )
  const [positions, setPositions] = useState( {
    nodes: currentNodes,
    links: currentLinks,
  } )

  // let simulation = forceSimulation(nodes)
  //   .force('charge', forceManyBody().strength(MANY_BODY_STRENGTH))
  //   .force(
  //     'link',
  //     forceLink(links)
  //       .id(function (d) {
  //         return d.id
  //       })
  //       .distance((link) => link.distance)
  //   )
  //   .force('center', forceCenter(centerX, centerY))
  // useEffect(() => {
  //   // Create force-directed layout
  //   const simulation = forceSimulation(currentNodes)
  //     .force(
  //       'link',
  //       forceLink(currentLinks)
  //         .id((d: { id: any }) => d.id)
  //         .distance(30)
  //     )
  //     .force('charge', forceManyBody().strength(-200))
  //     .force('center', forceCenter(0, 0))

  //   simulation.on('tick', () => {
  //     setPositions({
  //       nodes: currentNodes,
  //       links: currentLinks
  //       // links.map((link: { source: any; target: any }) => ({
  //       //   source:
  //       //     typeof link.source === 'object'
  //       //       ? link.source
  //       //       : nodes.find((n: { id: any }) => n.id === link.source),
  //       //   target:
  //       //     typeof link.target === 'object'
  //       //       ? link.target
  //       //       : nodes.find((n: { id: any }) => n.id === link.target),
  //       // })),
  //     })
  //   })

  //   return () => simulation.stop()
  // }, [currentNodes, currentLinks])

  // useFrame(() => {
  //   // Rotate the graph for better visualization
  //   if (nodeRef.current && linkRef.current) {
  //     nodeRef.current.rotation.y += 0.01;
  //     linkRef.current.rotation.y += 0.01;
  //   }
  // });

  const linkGeometry: any = new THREE.BufferGeometry()
  const linkMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } )

  return (
    <>
      <group ref={nodeRef}>
        <Flex justifyContent='center' alignItems='center'>
          {positions.nodes.map( ( node: any, index: number ) => (
            <Box key={node.id}>
              <Plane
                position={[0, 0, 0]}
                material={
                  new THREE.MeshBasicMaterial( {
                    color: node?.color || node?.fill,
                  } )
                }
              >
                <Html occlude>
                  <p>WEiner</p>
                </Html>
                {/* <Text
              position={[0, 0.5, 0]}
              fontSize={0.5}
              color='white'
              anchorX='center'
              anchorY='middle'
            >
              {node.name || node?.label}
            </Text> */}
                {/* <BasicNoteCard /> */}
              </Plane>
            </Box>
          ) )}
        </Flex>
      </group>

      {/* <group ref={linkRef}>
        {positions.links.map((link: any, index: any) => {
          console.log('link: ', link)
          const points = [0, 0, 0]
          linkGeometry.setFromPoints(points)
          return (
            // @ts-ignore
            <line key={index} geometry={linkGeometry} material={linkMaterial} />
          )
        })}
      
      </group>  */}
    </>
  )
}

export interface D3DrawingBoardProps {
  allEntityGraphData: NetworkGraphPayload['graphData']
}

export const D3DrawingBoard: React.FC<D3DrawingBoardProps> = ( {
  allEntityGraphData,
}: D3DrawingBoardProps ) => {
  const [graph, setGraph] = useState( {
    events: {
      nodes: [],
      links: [],
    },
    testimonies: {
      nodes: [],
      links: [],
    },
    personnel: {
      nodes: [],
      links: [],
    },
    topics: {
      nodes: [],
      links: [],
    },
  } )

  useEffect( () => {
    const data: any = {
      events: {
        nodes: [],
        links: [],
      },
      testimonies: {
        nodes: [],
        links: [],
      },
      personnel: {
        nodes: [],
        links: [],
      },
      topics: {
        nodes: [],
        links: [],
      },
    }
    if ( allEntityGraphData.nodes?.length ) {
      allEntityGraphData.nodes.forEach( ( node: any ) => {
        if ( node.data.type === 'events' ) {
          data.events.nodes.push( node )
        }
        if ( node.data.type === 'testimonies' ) {
          data.testimonies.nodes.push( node )
        }
        if ( node.data.type === 'personnel' ) {
          data.personnel.nodes.push( node )
        }
        if ( node.data.type === 'topics' ) {
          data.topics.nodes.push( node )
        }
      } )

      setGraph( data )
    }
  }, [allEntityGraphData.nodes] )

  return (
    <div className='h-[100vh] w-[100vw] relative'>
      <DotGridBackground>
        <Spotlight
          className='-top-40 left-0 md:left-60 md:-top-20'
          fill='white'
        />
        <Canvas>
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <D3Graph graph={graph} allEntityGraphData={allEntityGraphData} />
            <ContactShadows
              position={[0, -7, 0]}
              opacity={0.75}
              scale={40}
              blur={1}
              far={9}
            />
          </Suspense>
        </Canvas>
      </DotGridBackground>
    </div>
  )
}
