'use client'

import * as THREE from 'three'
import { useState, createRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Nodes, Node } from './nodes'
import type { DrawingBoardProps } from '@/features/3d/drawing-board/drawing-board'
import { Spotlight } from '@/components/animated/spotlight'
import { DotGridBackground } from '@/components/backgrounds'
import { ArrowIcon } from '@/components/ui/icons/arrow'
import { FloatingEntityMenu } from '@/features/3d/drawing-board/entity-menu'
import { SmartCommandMenu } from '@/features/3d/drawing-board/command-menu'
import {
  CycleRaycast,
  DragControls,
  OrbitControls,
  Preload,
  ScrollControls,
  TrackballControls,
} from '@react-three/drei'
import dynamic from 'next/dynamic'
import { View } from '@/features/3d/canvas/View'
import { r3f } from '@/features/3d/helpers/global'
import { use3DGraph } from '@/hooks/use3dGraph'
// const Scene = dynamic(() => import('@/features/3d/canvas/Scene'), { ssr: false })

export const DrawingBoardReactThreeFiberGraph: React.FC<DrawingBoardProps> = ( {
  allEntityGraphData,
}: DrawingBoardProps ) => {
  const { graph3d } = use3DGraph( { allEntityGraphData } )

  const { root, events, ...rest } = graph3d

  const [rootNodes, setRootNodes] = useState( () =>
    [...root.nodes].map( ( node: any ) => ( {
      ...node,
      ref: createRef(),
    } ) )
  )

  useEffect( () => {
    if ( root?.nodes.length ) {
      const tempRootNodes = root.nodes?.map( ( node: any ) => ( {
        ...node,
        ref: createRef(),
      } ) )

      setRootNodes( tempRootNodes )
    }
  }, [root?.nodes] )

  return (
    <div className='h-[100vh] w-[100vw] relative'>
      <DotGridBackground>
        <SmartCommandMenu />

        <Spotlight
          className='-top-40 left-0 md:left-60 md:-top-20'
          fill='white'
        />
        <Canvas orthographic camera={{ zoom: 80 }}>
          <Suspense fallback={null}>
            <Nodes>
              <DragControls>
                {rootNodes.map( ( rootNode, index ) => {
                  return (
                    <Node
                      key={rootNode.id}
                      ref={rootNode.ref}
                      name={rootNode.name}
                      color={rootNode.fill}
                      position={[index * 4, 0, 0]}
                      connectedTo={rootNode.connectedTo}
                    />
                  )
                } )}
                {/* <Node
                ref={a}
                name='a'
                color='#204090'
                position={[-2, 2, 0]}
                connectedTo={[b, c, e]}
              />
              <Node
                ref={b}
                name='b'
                color='#904020'
                position={[2, -3, 0]}
                connectedTo={[d, a]}
              />
              <Node ref={c} name='c' color='#209040' position={[-0.25, 0, 0]} />
              <Node
                ref={d}
                name='d'
                color='#204090'
                position={[0.5, -0.75, 0]}
              />
              <Node ref={e} name='e' color='#204090' position={[-0.5, -1, 0]} /> */}
              </DragControls>
            </Nodes>
          </Suspense>

          {/* <TrackballControls /> */}

          <Preload all />
        </Canvas>
      </DotGridBackground>
    </div>
  )
}
