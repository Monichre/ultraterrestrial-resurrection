'use client'

/**
 * Projects the evidence-graph tour (T-050 subtask 3) onto the mindmap's
 * single ReactFlow. `compileTourGraph` is pure; this hook is the one place
 * its output is written into `useMindMapStore` node/edge state, and the one
 * place it is removed again when the definition unloads.
 *
 * Tour nodes are identified by their registered type, never by id shape, so
 * a corpus record placed beside a waypoint is left alone.
 */
import { useEffect, useMemo } from 'react'
import type { Edge, Node } from '@xyflow/react'

import { useMindMapStore } from '@/features/mindmap/store'
import { compileTourGraph } from '@/features/guided-tours/shared/graph/compile-tour-graph'
import {
  TOUR_NARRATIVE_EDGE_TYPE,
  TOUR_WAYPOINT_NODE_TYPE,
} from '@/features/guided-tours/shared/types/flow-model'
import { useUnifiedTourStore } from '@/features/guided-tours/shared/state/unified-tour-store'

export const isTourWaypointNode = (node: Node): boolean => node.type === TOUR_WAYPOINT_NODE_TYPE
export const isTourNarrativeEdge = (edge: Edge): boolean => edge.type === TOUR_NARRATIVE_EDGE_TYPE

/**
 * Replace the projected tour nodes while keeping ReactFlow's measurements for
 * nodes that already exist — dropping `measured` on every runtime tick would
 * make the choreographer's `setCenter` math jump between frames.
 */
const mergeProjectedNodes = (current: Node[], projected: Node[]): Node[] => {
  const measuredById = new Map(
    current.filter(isTourWaypointNode).map((node) => [node.id, node] as const),
  )
  const others = current.filter((node) => !isTourWaypointNode(node))
  const merged = projected.map((node) => {
    const previous = measuredById.get(node.id)
    return previous
      ? {
          ...node,
          measured: previous.measured,
          width: previous.width,
          height: previous.height,
          selected: previous.selected,
        }
      : node
  })
  return [...others, ...merged]
}

export function useTourGraphProjection(): { isProjecting: boolean } {
  const definition = useUnifiedTourStore((s) => s.definition)
  const runtime = useUnifiedTourStore((s) => s.runtime)
  const resolvedAnchors = useUnifiedTourStore((s) => s.resolvedAnchors)
  const setNodes = useMindMapStore((s) => s.setNodes)
  const setEdges = useMindMapStore((s) => s.setEdges)

  const graph = useMemo(
    () => (definition && runtime ? compileTourGraph(definition, runtime, resolvedAnchors) : null),
    [definition, runtime, resolvedAnchors],
  )

  useEffect(() => {
    const store = useMindMapStore.getState()
    if (!graph) {
      // Definition unloaded: strip anything this hook projected, nothing else.
      const nodes = store.nodes.filter((node) => !isTourWaypointNode(node))
      const edges = store.edges.filter((edge) => !isTourNarrativeEdge(edge))
      if (nodes.length !== store.nodes.length) setNodes(nodes)
      if (edges.length !== store.edges.length) setEdges(edges)
      return
    }

    setNodes(mergeProjectedNodes(store.nodes, graph.nodes as Node[]))
    setEdges([
      ...store.edges.filter((edge) => !isTourNarrativeEdge(edge)),
      ...(graph.edges as Edge[]),
    ])
  }, [graph, setEdges, setNodes])

  return { isProjecting: graph !== null }
}
