'use client'

import { useMemo } from 'react'
import { stratify, tree, hierarchy as d3Hierarchy } from 'd3-hierarchy'

export type UseExpandCollapseOptions = {
  layoutNodes?: boolean
  treeWidth?: number
  treeHeight?: number
}

function isHierarchyPointNode(pointNode: any): any {
  return (
    typeof (pointNode as any).x === 'number' &&
    typeof (pointNode as any).y === 'number'
  )
}

export const useRootNodesHierarchy = (
  nodes: Node[],
  edges: any[],
  childrenLoaded: any,
  {
    layoutNodes = true,
    treeWidth = 220,
    treeHeight = 100,
  }: UseExpandCollapseOptions = {}
): { nodes: Node[]; edges: any[] } => {
  console.log('nodes: ', nodes)
  return useMemo(() => {
    if (!childrenLoaded) {
      return {
        nodes,
        edges,
      }
    }
    const stratifier = stratify()
      .id((d: { id: any }) => d.id)
      .parentId((d: any) => d.data.parentId)(nodes)
    console.log('stratifier: ', stratifier)

    // Create hierarchies for multiple roots
    const hierarchies: any = []
    const rootIds = new Set(nodes.map((node) => node.id))
    edges.forEach((edge) => rootIds.delete(edge.target))

    rootIds.forEach((rootId) => {
      console.log('rootId: ', rootId)
      try {
        const hierarchy = stratifier(
          nodes.filter((node) => {
            return (
              node.id === rootId ||
              edges.some(
                (edge) => edge.source === rootId && edge.target === node.id
              )
            )
          })
        )
        hierarchies.push(hierarchy)
      } catch (err) {
        console.log('err: ', err)
      }
    })

    console.log('hierarchies: ', hierarchies)

    hierarchies.forEach((hierarchy: any) => {
      hierarchy.descendants().forEach((descendant: any) => {
        console.log('descendant: ', descendant)
        descendant.data.expandable = !!descendant.children?.length

        descendant.children = descendant.data.expanded
          ? descendant.children
          : undefined
      })
    })

    const layout = tree()
      .nodeSize([treeWidth, treeHeight])
      .separation(() => 1)

    const roots = layoutNodes ? hierarchies.map(layout) : hierarchies
    console.log('roots: ', roots)

    return {
      nodes: roots.flatMap((root: any) => {
        console.log('root: ', root)
        return root.descendants().map((d: any) => ({
          ...d,
          position: isHierarchyPointNode(d) ? { x: d.x, y: d.y } : d.position,
        }))
      }),
      edges: edges.filter(
        (edge) =>
          roots.some((root: any[]) =>
            root.find((h: { id: any }) => h.id === edge.source)
          ) &&
          roots.some((root: any[]) =>
            root.find((h: { id: any }) => h.id === edge.target)
          )
      ),
    }
  }, [childrenLoaded, nodes, edges, treeWidth, treeHeight, layoutNodes])
}
