import { collide } from '@/features/mindmap/layouts/collide'
import { useMindMap } from '@/contexts'
import { nextTick } from '@/utils'
import {
  type ReactFlowState,
  useEdges,
  useNodes,
  useNodesInitialized,
  useReactFlow,
  useStore,
  useStoreApi,
} from '@xyflow/react'
import {
  type SimulationNodeDatum,
  type SimulationLinkDatum,
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
  forceCenter,
} from 'd3-force'
import { useEffect, useMemo, useRef, useState } from 'react'

type UseForceLayoutOptions = {
  strength: number
  distance: number
}

const strength = 30
const distance = 1

export const useForceLayout = () => {
  const { setNodes, getEdges, getNodes } = useMindMap()
  const edges = getEdges()
  const nodes = getNodes()
  const [layoutedNodes, setLayoutedNodes] = useState( nodes )

  console.log( 'layoutedNodes: ', layoutedNodes )
  const simulationRef: any = useRef()
  // const runIt = () => {
  //   const simulation = runForceSimulation(getNodes(), getEdges(), setNodes)
  //   console.log('simulation: ', simulation)
  //   // simulationRef.current = simulation

  //   nextTick(10).then(() => {
  //     simulation.stop()
  //   })
  //   return simulation
  // }

  const runForceSimulation = useMemo(
    () => ( nodes: any[], edges: any[], setNodes: any ) => {
      const simulation = forceSimulation( nodes )
        .force( 'charge', forceManyBody().strength( 60 ) )
        .force( 'x', forceX().x( 0 ).strength( 0.05 ) )
        .force( 'y', forceY().y( 0 ).strength( 0.05 ) )
        .force(
          'link',
          forceLink( edges )
            .id( ( d: any ) => d.id )
            .strength( 5 )
            .distance( 100 )
        )
        .on( 'tick', () => {
          setNodes(
            nodes.map( ( node ) => ( {
              ...node,
              position: {
                x: node.x ?? node.positionAbsoluteX,
                y: node.y ?? node.positionAbsoluteY,
              },
            } ) )
          )
        } )

      // const simulation = forceSimulation()
      //   .nodes(simulationNodes)
      //   .force('charge', forceManyBody().strength(strength))
      //   .force('x', forceX().x(0).strength(0.05))
      //   .force('y', forceY().y(0).strength(0.05))
      // .on('tick', () => {
      //   setNodes(
      //     simulationNodes.map((node) => ({
      //       ...node,
      //       position: { x: node.x ?? 0, y: node.y ?? 0 },
      //     }))
      //   )
      // })
      // .force(
      //   'link',
      //   forceLink(simulationLinks)
      //     .id((d: any) => d.id)
      //     .strength(0.05)
      //     .distance(distance)
      // )
      //   .force('x', forceX().x(0).strength(0.05))
      //   .force('y', forceY().y(0).strength(0.05))
      simulation.stop()
      return simulation
    },
    []
  )

  useEffect( () => {
    simulationRef.current = runForceSimulation( nodes, edges, setNodes )

    // simulationRef.current = simulation

    // .force('collide', collide())

    // return () => {
    //   simulation.stop()
    // }
  }, [nodes, layoutedNodes, runForceSimulation, edges, setNodes] )

  return simulationRef.current
}

// const simulationRef: any = useRef<d3.Simulation<any, undefined>>(null)

// useEffect(() => {
//   if (!simulationRef.current) {
//     simulationRef.current = d3
//       .forceSimulation(nodes)
//       .force(
//         'link',
//         d3
//           .forceLink(edges)
//           .id((d: any) => d.id) // Cast to Node to access the 'id' property
//           .distance(100)
//       )
//       .force('charge', d3.forceManyBody().strength(-500))
// .force(
//   'center',
//   d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
// )
// .force('collide', d3.forceCollide().radius(ROOT_NODE_WIDTH / 2))
//       .on('tick', () => {
//         setNodes((nodes: any) => [
//           ...nodes.map((node: any) => ({
//             ...node,
//             position: {
//               x: node.x - ROOT_NODE_WIDTH / 2,
//               y: node.y + ROOT_NODE_WIDTH / 2,
//             },
//           })),
//         ])
//       })
//   }

//   // Optional: Update simulation with new nodes/edges if they change
//   simulationRef.current.nodes(nodes)
//   d3.forceLink(simulationRef.current.force('link')).links(edges)

//   simulationRef.current.tick(150) // Pre-runs the simulation

//   // Cleanup function to stop the simulation when the component unmounts
//   return () => simulationRef.current?.stop()
// }, [simulationRef, nodes, edges, setNodes])

// const { layout, layouting } = useAutoLayoutAlternative()
