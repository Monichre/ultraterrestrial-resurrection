'use client'

// import { useState, createRef, useEffect } from 'react'
// import { Canvas } from '@react-three/fiber'
// import { Nodes, Node } from './nodes'
// import { getConnectionModels } from '@/db/xata/models'
import { ThreeDGraph } from './3d-graph'
import { TrackballControls, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

// export const ConnectionGraphBasic = (records) => {
//   const [[root, topics, events, personnel, testimonies, organizations]]: any =
//     useState(() => [...Array(5)].map(createRef))
//   return (
//     <Canvas orthographic camera={{ zoom: 80 }}>
//       <Nodes>
//         <Node
//           ref={root}
//           name='ultraterrestrial'
//           color='#204090'
//           position={[-2, 2, 0]}
//           connectedTo={[topics, events, personnel, testimonies, organizations]}
//         />
//         <Node
//           ref={topics}
//           name='topics'
//           color='#904020'
//           position={[2, -3, 0]}
//           connectedTo={[d, a]}
//         />
//         <Node
//           ref={events}
//           name='events'
//           color='#209040'
//           position={[-0.25, 0, 0]}
//         />
//         <Node
//           ref={personnel}
//           name='personnel'
//           color='#204090'
//           position={[0.5, -0.75, 0]}
//         />
//         <Node
//           ref={testimonies}
//           name='testimonies'
//           color='#204090'
//           position={[-0.5, -1, 0]}
//         />
//         <Node
//           ref={organizations}
//           name='organizations'
//           color='#204090'
//           position={[-0.5, -1, 0]}
//         />
//       </Nodes>
//     </Canvas>
//   )
// }

export const GraphVisualization = ( { models }: any ) => {
  const { events, topics, organizations, testimonies, personnel } = models
  // const fetchRootRecords = useCallback(async () => {
  //   const data = await fetch(`/api/xata/connections`).then(
  //     async (res) => await res.json()
  //   )
  //   console.log('data: ', data)
  //   setModels(data)

  //   // const newNodes = records.map(createRef)
  //   // console.log('newNodes: ', newNodes)
  // }, [])

  // useEffect(() => {
  //   fetchRootRecords()
  // }, [fetchRootRecords])

  // console.log('models: ', models)
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
      {/* <RootConnectionGraph models={models} /> */}
    </div>
  )
}
