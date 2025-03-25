'use client'
import { Canvas } from '@react-three/fiber'
import {
  createRef,
  useCallback,
  useState
} from 'react'
import * as THREE from 'three'
import { Node, Nodes } from './nodes'

import { DOMAIN_MODEL_COLORS } from '@/utils/constants/colors'
import {
  OrbitControls,
  TrackballControls
} from '@react-three/drei'
// import { MotionCanvas, LayoutCamera } from "framer-motion-3d"

export const RootConnectionGraph = ( { models }: any ) => {
  // {topics, testimonies, organizations, personnel}
  const [[root, topics, events, personnel, testimonies, organizations]]: any =
    useState( () =>
      [
        'root',
        'topics',
        'events',
        'personnel',
        'testimonies',
        'organizations',
        'testimonies',
      ].map( createRef )
    )

  const eventNodeRefs = models.events.map( createRef )
  const topicNodeRefs = models?.topics?.map( createRef )
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

  // console.log('childNodes: ', childNodes)
  const [rootRecords, setRootRecords]: any = useState( null )

  const calculatePosition = ( index: any, length: any ) => {
    const radius = 20
    const phi = Math.acos( -1 + ( 2 * index ) / length )
    const theta = Math.sqrt( length * Math.PI ) * phi
    return new THREE.Vector3().setFromSpherical(
      new THREE.Spherical( radius, phi, theta )
    )
  }

  const fetchRootRecords = useCallback( async ( rootType: any ) => {
    const { records } = await fetch( `/api/xata?type=${rootType}` ).then( ( res ) =>
      res.json()
    )
    console.log( 'fetchRootRecords records: ', records )
    // const newNodes = records.map(createRef)
    // console.log('newNodes: ', newNodes)
    return records
  }, [] )

  // const populateRootRecords = useCallback(
  //   async (rootType: any) => {
  //     const  records  = await fetchRootRecords(rootType)
  //     // const newNodes = records.map(createRef)
  //     // console.log('newNodes: ', newNodes)

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
  //     // console.log('newNodes: ', newNodes)

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

  return (
    <div className='h-[100vh] connection-graph overflow-scroll'>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 35], fov: 90 }}
        className='h-[100vh] wordcloud'
      >
        <fog attach='fog' args={['#202025', 0, 80]} />
        <TrackballControls />
        <OrbitControls />
        {/* <DragControls autoTransform> */}
        {/* <group rotation={[10, 10.5, 10]}> */}
        <Nodes>
          <Node
            ref={root}
            name='ultraterrestrial'
            color={DOMAIN_MODEL_COLORS.root}
            position={[0, 0, 0]}
            connectedTo={[
              topics,
              events,
              // personnel,
              // testimonies,
              // organizations,
            ]}
          />
          <Node
            ref={events}
            name='events'
            // // executePlatformWideConnectionSearch={executePlatformWideConnectionSearch}
            rootType='events'
            id='root_events'
            color={DOMAIN_MODEL_COLORS.events}
            position={[-4, -3, 0]}
            connectedTo={[...eventNodeRefs]}
          // eventNodeRefs
          />

          <Node
            ref={topics}
            name='topics'
            // executePlatformWideConnectionSearch={executePlatformWideConnectionSearch}
            rootType='topics'
            id='root_topics'
            color={DOMAIN_MODEL_COLORS.topics}
            position={[2, -3, 0]}
            connectedTo={[...topicNodeRefs]}
          />

          {eventNodeRefs.map( ( ref: any, index: any ) => {
            const node = models.events[index]
            return (
              <Node
                key={node?.id}
                ref={ref}
                name={node.name}
                color={DOMAIN_MODEL_COLORS.events}
                child
                position={calculatePosition( index, models.events.length )}
              />
            )
          } )}

          {topicNodeRefs.map( ( ref: any, index: any ) => {
            const node = models.topics[index]
            return (
              <Node
                key={node?.id}
                ref={ref}
                name={node.name}
                color={DOMAIN_MODEL_COLORS.topics}
                child
                position={calculatePosition( index, models.topics.length )}
              />
            )
          } )}
          {/* <Node
              ref={topics}
              name='topics'
              // executePlatformWideConnectionSearch={executePlatformWideConnectionSearch}
              rootType='topics'
              id='root_topics'
              color={DOMAIN_MODEL_COLORS.topics}
              position={[2, -3, 0]}
              connectedTo={childNodes.topics}
              // connectedTo={[d, a]}
            />

*/}
          {/* <Node
              ref={personnel}
              name='personnel'
              // // executePlatformWideConnectionSearch={executePlatformWideConnectionSearch}
              rootType='personnel'
              id='root_personnel'
              color={DOMAIN_MODEL_COLORS.personnel}
              position={[0.5, -0.75, 0]}
              connectedTo={[
                ...new Set(childNodes.personnel.map((node) => node?.ref)),
              ]}
            />
            <Node
              ref={testimonies}
              name='testimonies'
              // // executePlatformWideConnectionSearch={executePlatformWideConnectionSearch}
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
        {/* </group> */}
        {/* </DragControls> */}
      </Canvas>
    </div>
  )
}
