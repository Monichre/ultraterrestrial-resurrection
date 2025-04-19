import { useMindMap } from '@/contexts'
import { useNodesInitialized } from '@xyflow/react'
import ELK from 'elkjs/lib/elk.bundled.js'
import { useEffect } from 'react'
// const elk = new ELK()=
// https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html


const elk = new ELK()

const layoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.spacing.edgeNodeBetweenLayers': '40',
  'elk.spacing.nodeNode': '40',
  'elk.layered.nodePlacement.strategy': 'SIMPLE',
}

export const renderElkLayout = async ( nodes: any[], edges: any[] ) => {
  const graph = {
    id: 'root',
    layoutOptions,
    children: nodes.map( ( n ) => {
      const targetPorts = n.data.targetHandles.map( ( t ) => ( {
        id: t.id,

        // ⚠️ it's important to let elk know on which side the port is
        // in this example targets are on the left (WEST) and sources on the right (EAST)
        properties: {
          side: 'WEST',
        },
      } ) )

      const sourcePorts = n.data.sourceHandles.map( ( s ) => ( {
        id: s.id,
        properties: {
          side: 'EAST',
        },
      } ) )

      return {
        id: n.id,
        width: n.width ?? 150,
        height: n.height ?? 50,
        // ⚠️ we need to tell elk that the ports are fixed, in order to reduce edge crossings
        properties: {
          'org.eclipse.elk.portConstraints': 'FIXED_ORDER',
        },
        // we are also passing the id, so we can also handle edges without a sourceHandle or targetHandle option
        ports: [{ id: n.id }, ...targetPorts, ...sourcePorts],
      }
    } ),
    edges: edges.map( ( e ) => ( {
      id: e.id,
      sources: [e.sourceHandle || e.source],
      targets: [e.targetHandle || e.target],
    } ) ),
  }

  const layoutedGraph = await elk.layout( graph )

  const layoutedNodes = nodes.map( ( node ) => {
    const layoutedNode = layoutedGraph.children?.find(
      ( lgNode ) => lgNode.id === node.id,
    )

    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    }
  } )

  return layoutedNodes
}



export function useElkLayout() {
  const nodesInitialized = useNodesInitialized()
  const { getNodes, getEdges, setNodes, fitView } = useMindMap()
  useEffect( () => {
    if ( nodesInitialized ) {
      const layoutNodes = async () => {
        const layoutedNodes = await renderElkLayout(
          getNodes() as any[],
          getEdges(),
        )

        setNodes( layoutedNodes )
        setTimeout( () => fitView(), 0 )
      }

      layoutNodes()
    }
  }, [nodesInitialized, getNodes, getEdges, setNodes, fitView] )

  return null
}
