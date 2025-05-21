import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'

onmessage = ( event ) => {
  const { nodes, edges } = event.data

  const simulationNodes = nodes.map( ( node ) => ( {
    ...node,
    x: node.position.x,
    y: node.position.y,
  } ) )

  const simulationEdges = edges.map( ( edge ) => ( { ...edge } ) )

  const simulation = forceSimulation( simulationNodes )
    .force(
      'link',
      forceLink( simulationEdges )
        .id( ( d ) => d.id )
        .distance( 200 )
        .strength( 1 )
    )
    .force( 'charge', forceManyBody().strength( -500 ) )
    .force( 'center', forceCenter( 0, 0 ) )
    .force( 'collision', forceCollide().radius( 50 ) )

  // Run the simulation synchronously
  const totalIterations = 300
  for ( let i = 0; i < totalIterations; i++ ) {
    simulation.tick()
  }

  // Post the updated nodes back to the main thread
  postMessage(
    simulationNodes.map( ( node ) => ( {
      id: node.id,
      data: node.data,
      position: { x: node.x, y: node.y },
    } ) )
  )
}