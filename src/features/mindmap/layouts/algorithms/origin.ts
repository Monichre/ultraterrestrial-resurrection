import type { LayoutAlgorithm } from '@/features/mindmap/layouts/config'
import {
  getNodeLayouted,
  getEdgeLayouted,
} from '@/features/mindmap/utils/node.utils'

/**
 * Positions all nodes at the origin (0,0) in the layout.
 */
export const layoutOrigin: LayoutAlgorithm = async ( props ) => {
  const { nodes, edges, direction, visibility } = props
  return {
    nodes: nodes.map( ( node: any ) => {
      return getNodeLayouted( {
        node,
        direction,
        visibility,
        position: { x: 0, y: 0 },
      } )
    } ),
    edges: edges.map( ( edge: any ) => getEdgeLayouted( { edge, visibility } ) ),
  }
}
