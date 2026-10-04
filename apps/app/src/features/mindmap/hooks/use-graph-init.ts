import {useEffect} from 'react'
import type {Edge, Node} from '@xyflow/react'
import {createRootNodeChild} from '@/features/mindmap/utils/node-factories'

type GraphModel = {
  nodes?: Array<Record<string, unknown>>
  links?: Record<string, {connectedTo: unknown[]}>
}

type Graph3D = Record<string, Record<string, unknown>>

type GraphState = Record<string, {nodes: Node[]; edges: Edge[]}>

/**
 * useGraphInit
 *
 * Encapsulates the one-time effect that transforms the raw 3D graph data
 * (from use3DGraph) into the XY-flow-compatible graph state used by the
 * mindmap canvas.  Previously this effect lived inside MindMapProvider.
 *
 * @param graph3d   - raw graph data from use3DGraph
 * @param graph     - current graph state (empty object initially)
 * @param setGraph  - setter to store the formatted graph state
 */
export function useGraphInit(
  graph3d: Graph3D,
  graph: GraphState,
  setGraph: (graph: GraphState) => void
) {
  useEffect(() => {
    if (!graph || Object.keys(graph).length === 0) {
      const formattedGraphNodesObject: GraphState = {}

      for (const key in graph3d) {
        const graphModel = graph3d[key] as GraphModel
        const tempNodes = graphModel?.nodes
          ? graphModel.nodes.map((n) => createRootNodeChild(n as any))
          : []
        const tempLinks = graphModel?.links
          ? ([] as unknown[]).concat(
              ...Object.keys(graphModel.links).map((linkKey) => {
                const links = (graphModel.links as NonNullable<GraphModel['links']>)[linkKey]
                  .connectedTo
                return [...links]
              })
            )
          : []

        formattedGraphNodesObject[key] = {
          nodes: tempNodes as Node[],
          edges: tempLinks as Edge[],
        }
      }

      setGraph(formattedGraphNodesObject)
    }
  }, [graph, graph3d, setGraph])
}
