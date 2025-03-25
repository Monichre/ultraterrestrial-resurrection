// hooks/useSyncChildNodePositions.ts

import { useMindMap } from '@/contexts'
import { debounce } from 'lodash' // Install lodash if not already installed
import { useCallback, useMemo } from 'react'

interface Position {
  x: number
  y: number
}

interface UseSyncChildNodePositionsReturn {
  syncPosition: ( nodeId: string, position: Position ) => void
}

/**
 * Custom hook to synchronize positions of cloned child nodes with original xyflow/react nodes.
 *
 * @param groupNodeId - The ID of the group node whose child nodes are to be synchronized.
 * @returns An object containing the `syncPosition` function.
 */
export const useSyncChildNodePositions = ( groupNodeId: string ): UseSyncChildNodePositionsReturn => {
  const { getNode, updateNode } = useMindMap()



  /**
   * Recursively retrieves all descendant node IDs of a given node.
   *
   * @param nodeId - The ID of the node whose descendants are to be retrieved.
   * @returns An array of descendant node IDs.
   */
  const getAllNestedCloneIds = useCallback(
    ( nodeId: string ): string[] => {
      const node = getNode( nodeId )
      if ( !node || !node.data.children ) return []
      let nested: string[] = []

      node.data.children.forEach( ( child: any ) => {
        nested.push( child.id )
        nested = nested.concat( getAllNestedCloneIds( child.id ) )
      } )

      return nested
    },
    [getNode]
  )

  // Memoize the list of descendant node IDs to avoid unnecessary recalculations
  const nestedCloneIds = useMemo( () => getAllNestedCloneIds( groupNodeId ), [groupNodeId, getAllNestedCloneIds] )

  /**
   * Debounced function to synchronize the position of a child node.
   * Prevents excessive updates by limiting the frequency of calls.
   */
  const debouncedSyncPosition = useMemo(
    () =>
      debounce( ( nodeId: string, position: Position ) => {

        const node = getNode( nodeId )
        if ( node ) {
          // Update the node's position using the xyflow/react API
          updateNode( nodeId, { ...node, position } )
        } else {
          console.warn( `Node ID ${nodeId} not found` )
        }
      }, 100 ), // Adjust the debounce delay as needed
    [getNode, updateNode]
  )

  /**
   * Synchronizes the position of a child node by updating the original xyflow/react node.
   *
   * @param nodeId - The ID of the child node to be synchronized.
   * @param position - The new position to be applied to the child node.
   */
  const syncPosition = useCallback(
    ( nodeId: string, position: Position ) => {
      if ( !nestedCloneIds.includes( nodeId ) ) {
        console.warn( `Node ID ${nodeId} is not a descendant of group node ID ${groupNodeId}` )
        return
      }

      debouncedSyncPosition( nodeId, position )
    },
    [nestedCloneIds, groupNodeId, debouncedSyncPosition]
  )

  return { syncPosition }
}

