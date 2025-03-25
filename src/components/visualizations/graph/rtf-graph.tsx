'use client'
import { useEffect, useRef } from 'react'
import {
  GraphCanvas,
  lightTheme,
  useSelection
} from 'reagraph'
import * as THREE from 'three'
import { useModelNodes } from './useModelNodes'

import { TopicPersonnelAndEventGraphDataPayload } from '@/db/xata'
import {
  Image,
  Text
} from '@react-three/drei'

const GOLDENRATIO = 1.61803398875
export const GraphNodeImageCard = ( {
  c = new THREE.Color(),
  node,
  ...props
}: any ) => {
  const { id, data, fill, label } = node
  const url = data?.photos && data.photos?.length ? data.photos[0].url : ''
  console.log( 'url: ', url )

  const ref = useRef()

  const name = label

  // useFrame((state, dt) => {
  //   image.current.material.zoom =
  //     2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
  //   easing.damp3(
  //     image.current.scale,
  //     [
  //       0.85 * (!isActive && hovered ? 0.85 : 1),
  //       0.9 * (!isActive && hovered ? 0.905 : 1),
  //       1,
  //     ],
  //     0.1,
  //     dt
  //   )
  //   easing.dampC(
  //     frame.current.material.color,
  //     hovered ? 'orange' : 'white',
  //     0.1,
  //     dt
  //   )
  // })
  return (
    <group>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial
          color='#151515'
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image url={url} />
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX='left'
        anchorY='top'
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {name.split( '-' ).join( ' ' )}
      </Text>
    </group>
  )
}

export interface GraphProps {
  models: TopicPersonnelAndEventGraphDataPayload
}

export const Graph: React.FC<GraphProps> = ( { models } ) => {
  const { nodes, edges } = useModelNodes( { models } )
  const ref: any = useRef()
  const {
    selections,
    actives,
    addNextEntitiesToMindMap,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut,
  } = useSelection( {
    ref,
    nodes,
    edges,
    pathHoverType: 'all',
  } )

  useEffect( () => {
    if ( ref?.current ) {
      console.log( 'ref?.current: ', ref?.current )
      // ref.current.theme.canvas.background = 'rgba(255,255,255, 0.1)'
    }
  }, [ref.current] )

  if (
    window &&
    window?.document &&
    window.navigator &&
    nodes?.length &&
    edges?.length
  ) {
    return (
      <div id='graph-canvas'>
        {/* <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
    <color attach="background" args={['#191920']} />
    <fog attach="fog" args={['#191920', 0, 15]} />
    <group position={[0, -0.5, 0]}>
      <Frames images={images} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </group>
    <Environment preset="city" /> */}

        <GraphCanvas
          ref={ref}
          theme={{
            ...lightTheme,
            canvas: {
              background: undefined,
              fog: lightTheme?.canvas?.fog,
            },
          }}
          sizingType='centrality'
          selections={selections}
          edgeArrowPosition='none'
          actives={actives}
          onNodePointerOver={onNodePointerOver}
          onNodePointerOut={onNodePointerOut}
          edgeInterpolation='curved'
          defaultNodeSize={10}
          nodes={nodes}
          edges={edges}
          clusterAttribute='type'
          draggable
          layoutType='forceDirected3d'
          renderNode={( { size, color, opacity } ) => {
            return (
              <group>
                <mesh castShadow receiveShadow>
                  <sphereGeometry args={[20, 20, 20]} />
                  <meshStandardMaterial
                    attach='material'
                    color={color}
                    opacity={opacity}
                    transparent
                  />
                </mesh>
              </group>
            )

            // <GraphNodeImageCard {...props} />
          }}
        // clusterAttribute='type'
        >
          <directionalLight position={[0, 5, -4]} intensity={1} />
        </GraphCanvas>
      </div>
      // </Canvas>
    )
  } else {
    return null
  }
}
