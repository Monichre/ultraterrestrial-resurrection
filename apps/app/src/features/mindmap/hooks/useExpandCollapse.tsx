import { useMemo } from 'react'

import { stratify, tree } from 'd3-hierarchy'

export type UseExpandCollapseOptions = {
  layoutNodes?: boolean
  treeWidth?: number
  treeHeight?: number
}

function isHierarchyPointNode(pointNode: any): pointNode is Node {
  return (
    typeof (pointNode as any).x === 'number' &&
    typeof (pointNode as any).y === 'number'
  )
}

export function useExpandCollapse(
  nodes: Node[],
  edges: any[],
  childrenLoaded,
  {
    layoutNodes = true,
    treeWidth = 220,
    treeHeight = 100,
  }: UseExpandCollapseOptions = {}
): { nodes: Node[]; edges: any[] } {
  return useMemo(() => {
    if (!childrenLoaded) {
      return {
        nodes,
        edges,
      }
    }
    const hierarchy = stratify()
      .id((d: { id: any }) => d.id)
      .parentId((d: any) => edges.find((e: any) => e.target === d.id)?.source)(
        nodes
      )
      .catch((err: any) => {
        console.log('err: ', err)
      })
    console.log('hierarchy: ', hierarchy)

    hierarchy
      .descendants()
      .forEach(
        (d: {
          data: { data: { expandable: boolean; expanded: any } }
          children: any
        }) => {
          d.data.data.expandable = !!d.children?.length
          d.children = d.data.data.expanded ? d.children : undefined
        }
      )

    const layout = tree()
      .nodeSize([treeWidth, treeHeight])
      .separation(() => 1)

    console.log('layout: ', layout)
    const root = layoutNodes ? layout(hierarchy) : hierarchy
    console.log('layout: ', layout)

    return {
      nodes: root
        .descendants()
        .map((d: { data: { data: any; position: any }; x: any; y: any }) => ({
          ...d.data,
          // This bit is super important! We *mutated* the object in the `forEach`
          // above so the reference is the same. React needs to see a new reference
          // to trigger a re-render of the node.
          data: { ...d.data.data },
          type: 'custom',
          position: isHierarchyPointNode(d)
            ? { x: d.x, y: d.y }
            : d.data.position,
        })),
      edges: edges.filter(
        (edge) =>
          root.find((h: { id: any }) => h.id === edge.source) &&
          root.find((h: { id: any }) => h.id === edge.target)
      ),
    }
  }, [nodes, edges, layoutNodes, treeWidth, treeHeight, childrenLoaded])
}
