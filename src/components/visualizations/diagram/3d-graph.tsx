'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  createRef,
  useCallback,
  useRef,
  useState
} from 'react'
import * as THREE from 'three'
import { Node, Nodes } from './basic-nodes'

import { DOMAIN_MODEL_COLORS } from '@/utils/constants/colors'
import { a, useSpring, useTransition } from '@react-spring/three'
import { Physics } from '@react-three/cannon'
import {
  Instance,
  Instances,
  OrbitControls,
  TrackballControls
} from '@react-three/drei'

// import { MotionCanvas, LayoutCamera } from "framer-motion-3d"

function Geometry( { r, position, ...props } ) {
  const ref = useRef()
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
      <a.mesh {...props} />
    </group>
  )
}

function Geometries() {
  const { items, material } = useStore()
  const transition = useTransition( items, {
    from: { scale: [0, 0, 0], rotation: [0, 0, 0] },
    enter: ( { r } ) => ( { scale: [1, 1, 1], rotation: [r * 3, r * 3, r * 3] } ),
    leave: { scale: [0.1, 0.1, 0.1], rotation: [0, 0, 0] },
    config: { mass: 5, tension: 1000, friction: 100 },
    trail: 100,
  } )
  return transition( ( props, { position: [x, y, z], r, geometry } ) => (
    <Geometry
      position={[x * 3, y * 3, z]}
      material={material}
      geometry={geometry}
      r={r}
      {...props}
    />
  ) )
}

function Rig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()
  return useFrame( () =>
    camera.position.lerp(
      vec.set( mouse.x * 2, mouse.y * 1, camera.position.z ),
      0.02
    )
  )
}

export const ThreeDGraph = ( { models }: any ) => {
  console.log( 'models: ', models )
  const { topics: tData, personnel: pData } = models
  console.log( 'tData: ', tData )
  console.log( 'pData: ', pData )
  // {topics, testimonies, organizations, personnel}

  const rfs = THREE.MathUtils.randFloatSpread

  const [[root, topics, events, personnel]]: any = useState( () =>
    [
      'root',
      'topics',
      'events',
      'personnel',
      // 'testimonies',
      // 'organizations',
      // 'testimonies',
    ].map( createRef )
  )

  const eventNodeRefs = models.events.map( createRef )
  const topicNodeRefs = models?.topics?.map( createRef )
  const personnelNodeRefs = models?.personnel?.map( createRef )
  // const [childNodes, setChildNodes]: any = useState(
  //   Object.keys(models).reduce((acc: any, key: any) => {
  //     const rootModels = models[key]

  //     acc[key] = {
  //       nodeRefs: rootModels.map(createRef),
  //       nodes: rootModels,
  //     }
  //     return acc
  //   }, {})
  // )

  //
  const [rootRecords, setRootRecords]: any = useState( null )

  const calculateSphericalPosition = ( index: any, length: any ) => {
    const radius = 5
    const phi = Math.acos( -1 + ( 2 * index ) / length )
    const theta = Math.sqrt( length * Math.PI ) * phi
    return new THREE.Vector3().setFromSpherical(
      new THREE.Spherical( radius, phi, theta )
    )
  }

  const calculatePosition = ( parentX, index, totalNodes, level ) => {
    const spacing = 2 // Adjust this value to change the distance between nodes
    const x =
      parentX +
      Math.floor( level / spacing ) +
      Math.floor( ( totalNodes - index ) / 2 ) // Adjust the y position based on the level
    console.log( 'x: ', x )
    const y = Math.floor( level / spacing ) + Math.floor( ( totalNodes - index ) / 2 ) // Adjust the y position based on the level
    console.log( 'y: ', y )
    return new THREE.Vector3( parentX, -y, 0 )
  }

  const calculateGridPositionAlt = (
    parent,
    index,
    gridSize = 20,
    baseYDistance = 0.5
  ) => {
    // Calculate the row and column of the current node
    const totalNodes = eventNodeRefs.length + topicNodeRefs.length
    const row = Math.floor( index / gridSize )
    const col = index % gridSize

    // Define the spacing between nodes
    const spacing = 2 // Adjust this value to change the distance between nodes

    // Calculate the x and y positions
    const x = parent[0] + ( col - ( gridSize - 1 ) / 2 ) * spacing
    // Calculate the y-distance increment based on the total number of nodes
    const yIncrement = ( baseYDistance * 2 ) / ( totalNodes - 1 )
    // Increment the y position for each node sequentially
    const y =
      parent[1] +
      ( row - ( gridSize - 1 ) / 2 ) * spacing +
      baseYDistance +
      index * yIncrement

    // Return the new position as a THREE.Vector3
    return new THREE.Vector3( x, y, 0 )
  }

  const calculateGridPosition = ( parent, index, gridSize ) => {
    // Calculate the row and column of the current node
    const baseYDistance = 4
    let newParentYPosition = parent[1] + -baseYDistance

    const row = Math.floor( index / gridSize )
    const col = index % gridSize

    // Define the spacing between nodes
    const spacing = 2 // Adjust this value to change the distance between nodes

    // Calculate the x and y positions
    // const x = parent[0] + (col - (gridSize - 1) / 2) * spacing
    // const y =
    //   Math.abs(newParentYPosition) + (row - (gridSize - 1) / 2) * spacing
    const x = parent[0] + ( col - ( gridSize - 1 ) / 2 ) * spacing
    const y = parent[1] + ( row - ( gridSize - 1 ) / 2 ) * spacing + baseYDistance

    // Return the new position as a THREE.Vector3
    return new THREE.Vector3( x, -y, 0 )
  }

  const calculateRadialPosition = ( parent, index ) => {
    // Calculate the angle between each node
    const angle = ( 2 * Math.PI ) / eventNodeRefs?.length
    // Calculate the radius of the circle

    const radius = 5 // Adjust this value to change the distance from the parent node
    const spacing = 2
    // Calculate the x and y positions
    const x = parent[0] + radius * Math.cos( angle * index )
    const y = parent[1] + radius * Math.sin( angle * index )

    // Return the new position as a THREE.Vector3
    return [x, -y, 0] //new THREE.Vector3(x, -y, 0)
  }

  const fetchRootRecords = useCallback( async ( rootType: any ) => {
    const { records } = await fetch( `/api/xata?type=${rootType}` ).then( ( res ) =>
      res.json()
    )

    // const newNodes = records.map(createRef)
    //
    return records
  }, [] )

  // const populateRootRecords = useCallback(
  //   async (rootType: any) => {
  //     const  records  = await fetchRootRecords(rootType)
  //     // const newNodes = records.map(createRef)
  //     //

  //     setChildNodes((childNodes: any) => ({
  //       ...childNodes,
  //       [rootType]: records.map((record, index) => ({
  //         ...record,
  //         position: calculatePosition(index, records.length),
  //         ref: createRef(),
  //       })),
  //     }))
  //   },
  //   [childNodes]
  // )

  // const populateRootRecords = useCallback(
  //   async (rootType: any, records) => {
  //     // const  records  = await fetchRootRecords(rootType)
  //     // const newNodes = records.map(createRef)
  //     //

  //     setChildNodes((childNodes: any) => ({
  //       ...childNodes,
  //       [rootType]: records.map((record, index) => ({
  //         ...record,
  //         position: calculatePosition(index, records.length),
  //         ref: createRef(),
  //       })),
  //     }))
  //   },
  //   [childNodes]
  // )

  // useEffect(() => {
  //   const getAllConnections = async () => {
  //     const events = await fetchRootRecords('events')
  //     const topics = await fetchRootRecords('topics')
  //     const personnel = await fetchRootRecords('personnel')
  //     const testimonies = await fetchRootRecords('testimonies')
  //     const organizations = await fetchRootRecords('organizations')
  //     const totalRecords = [
  //       ...events,
  //       ...topics,
  //       ...personnel,
  //       ...organizations,
  //       ...testimonies,
  //     ]
  //     setRootRecords(totalRecords)

  //     setChildNodes((childNodes: any) => ({
  //       ...childNodes,
  //       events: events.map((record, index) => ({
  //         ...record,
  //         position: calculatePosition(index, events.length),
  //         ref: createRef(),
  //       })),
  //       topics: topics.map((record, index) => ({
  //         ...record,
  //         position: calculatePosition(index, topics.length),
  //         ref: createRef(),
  //       })),
  //       organizations: organizations.map((record, index) => ({
  //         ...record,
  //         position: calculatePosition(index, organizations.length),
  //         ref: createRef(),
  //       })),
  //       personnel: personnel.map((record, index) => ({
  //         ...record,
  //         position: calculatePosition(index, personnel.length),
  //         ref: createRef(),
  //       })),
  //       testimonies: testimonies.map((record, index) => ({
  //         ...record,
  //         position: calculatePosition(index, testimonies.length),
  //         ref: createRef(),
  //       })),
  //     }))
  //   }
  //   getAllConnections()
  // }, [])

  const gridSize = Math.ceil(
    Math.sqrt( eventNodeRefs.length + topicNodeRefs.length )
  )
  const { color } = useSpring( {
    color: 0,
    from: { color: 1 },
    config: { friction: 50 },
    loop: true,
  } )

  return (
    // <div className='h-[100vh] connection-graph overflow-scroll'>
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 35], fov: 90 }}
      className='h-[100vh] wordcloud'
      orthographic
    >
      <TrackballControls />
      <OrbitControls />
      {/* <fog attach='fog' args={['#202025', 0, 80]} />
     

      {/* <color attach='background' args={['white']} /> */}
      {/* <a.fog
        attach='fog'
        args={['white', 10, 40]}
        color={color.to(
          [0, 0.2, 0.4, 0.7, 1],
          ['white', 'red', 'white', 'red', 'white']
        )}
      /> */}
      <ambientLight intensity={0.8} />
      <directionalLight castShadow position={[2.5, 12, 12]} intensity={4} />
      <pointLight position={[20, 20, 20]} />
      <pointLight position={[-20, -20, -20]} intensity={5} />

      {/* <DragControls autoTransform> */}
      {/* <group > */}
      <Physics gravity={[0, 2, 0]} iterations={200}>
        <Nodes>
          <group>
            <Node
              ref={root}
              name='ultraterrestrial'
              color={DOMAIN_MODEL_COLORS.root}
              position={[0, 0, 0]}
              connectedTo={[
                topics,
                events,
                personnel,
                // testimonies,
                // organizations,
              ]}
            />
            <Node
              ref={topics}
              name='topics'
              rootType='topics'
              id='root_topics'
              color={DOMAIN_MODEL_COLORS.topics}
              position={[8, -1, 0]}
              connectedTo={[...topicNodeRefs]}
            />
            <Node
              ref={events}
              name='events'
              rootType='events'
              id='root_events'
              color={DOMAIN_MODEL_COLORS.events}
              position={[-4, -1, 0]}
              connectedTo={[...eventNodeRefs]}
            // eventNodeRefs
            />

            <Node
              ref={personnel}
              name='personnel'
              rootType='personnel'
              id='root_personnel'
              color={DOMAIN_MODEL_COLORS.personnel}
              position={[4, -1, 0]}
              connectedTo={[...personnelNodeRefs]}
            />
          </group>

          {eventNodeRefs.map( ( ref: any, index: any ) => {
            const node = models.events[index]

            return (
              <Node
                key={node?.id}
                ref={ref}
                name={node.name}
                color={DOMAIN_MODEL_COLORS.events}
                child
                position={calculateSphericalPosition(
                  // -4, // [-4, -1, 0],
                  index,
                  eventNodeRefs.length
                )}
              />
            )
          } )}

          <Instances>
            <sphereGeometry />
            <meshStandardMaterial />
            <group position={[8, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              {topicNodeRefs.map( ( ref: any, index: any ) => {
                const node = models.topics[index]

                return (
                  <Instance key={node?.id + '-instance'}>
                    <Node
                      key={node?.id}
                      ref={ref}
                      name={node.name}
                      color={DOMAIN_MODEL_COLORS.topics}
                      child
                      position={calculateSphericalPosition(
                        // 8, // [8, -1, 0],
                        index,
                        topicNodeRefs.length
                      )}
                    />
                  </Instance>
                )
              } )}
            </group>
          </Instances>

          {personnelNodeRefs.map( ( ref: any, index: any ) => {
            const node = models.personnel[index]

            return (
              <Node
                key={node?.id}
                ref={ref}
                name={node.name}
                color={DOMAIN_MODEL_COLORS.personnel}
                child
                position={calculateSphericalPosition(
                  // 4, // [4, -1, 0],
                  index,
                  personnelNodeRefs.length
                )}
              />
            )
          } )}

          {/* 
            <Node
              ref={testimonies}
              name='testimonies'
              
              rootType='testimonies'
              id='root_testimonies'
              color={DOMAIN_MODEL_COLORS.testimonies}
              position={[-0.5, -5, 0]}
              connectedTo={[
                ...new Set(childNodes.testimonies.map((node) => node?.ref)),
              ]}
            />
            <Node
              ref={organizations}
              name='organizations'
              // // executePlatformWideConnectionSearch={executePlatformWideConnectionSearch}
              rootType='organizations'
              id='root_organizations'
              color={DOMAIN_MODEL_COLORS.organizations}
              position={[1, -4, 0]}
              connectedTo={[
                ...new Set(childNodes.organizations.map((node) => node?.ref)),
              ]}
            />

            {childNodes['events'].length &&
              childNodes['events'].map((node, idx) => {
                return (
                  <Node
                    key={node?.id}
                    ref={node.ref}
                    name={node.name}
                    color={DOMAIN_MODEL_COLORS.events}
                    child
                    position={node.position}
                  />
                )
              })}

            {childNodes['topics'].length &&
              childNodes['topics'].map((node, idx) => {
                return (
                  <Node
                    key={node?.id}
                    ref={node.ref}
                    name={node.name}
                    color={DOMAIN_MODEL_COLORS.topics}
                    child
                    position={node.position}
                  />
                )
              })}

            {childNodes['testimonies'].length &&
              childNodes['testimonies'].map((node, idx) => {
                return (
                  <Node
                    key={node?.id}
                    ref={node.ref}
                    name={node.name}
                    color={DOMAIN_MODEL_COLORS.testimonies}
                    child
                    position={node.position}
                  />
                )
              })}
            {childNodes['personnel'].length &&
              childNodes['personnel'].map((node, idx) => {
                return (
                  <Node
                    key={node?.id}
                    ref={node.ref}
                    name={node.name}
                    color={DOMAIN_MODEL_COLORS.personnel}
                    child
                    position={node.position}
                  />
                )
              })} */}

          {/* {childNodes['organizations'].length &&
              childNodes['organizations'].map((node, idx) => {
                return (
                  <Node
                    key={node?.id}
                    ref={node.ref}
                    name={node.name}
                    color={DOMAIN_MODEL_COLORS.organizations}
                    child
                    position={node.position}
                  />
                )
              })}
              connectedTo */}
        </Nodes>
      </Physics>
    </Canvas>
  )
}
