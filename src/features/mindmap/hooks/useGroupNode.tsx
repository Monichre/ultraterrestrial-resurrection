// hooks/useGroupNode.ts

import { useMindMap } from '@/contexts'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Node, NodeProps } from '@xyflow/react'

// **Types for Hook Inputs and Outputs**
interface UseGroupNodeProps {
  node: NodeProps & {
    width: number
    height: number
    id: string
    data: {
      children?: Node[]
      [key: string]: unknown
    }
  }
}

interface PositionedNode extends Node {
  position: {
    x: number
    y: number
  }
}

interface UseGroupNodeReturn {
  handles: string[]
  childNodeIds: string[]
  updateGroupHeight?: () => void
  hideChildren: () => void
  showChildren: () => void
  positionChildNodes?: () => PositionedNode[]
  getClonePosition?: ( selector?: string, ref?: React.RefObject<HTMLElement> ) => { x: number; y: number } | null
  node: Node & {
    width: number
    height: number

    id: string
    data: {
      children?: any[]
      handles?: any[]
      input?: string
      source?: Record<string, any>
      [key: string]: unknown
    }
  }
}

export const useGroupNode = ( { node }: UseGroupNodeProps ): UseGroupNodeReturn => {
  const { useUpdateNodeInternals, getNode, updateNode, useNodesData, getNodesBounds } = useMindMap()
  const updateNodeInternals = useUpdateNodeInternals()
  const nodeData: { id: string; type: string; data: { handles: any[]; children: any[] } } = useNodesData( node.id )


  const [childrenHidden, setChildrenHidden] = useState( false )
  let childRefs = node?.data?.children?.length ? node?.data?.children.map( ( child: any ) => useRef( child.id ) ) : []

  const hideChildDomNodes = useCallback( () => {
    const childNodes = document.querySelectorAll( `.${node?.data?.childrenClassName}` )
    childNodes.forEach( ( childNode ) => {
      childNode.classList.add( 'hide' )
    } )

  }, [node?.data?.childrenClassName] )

  const showChildDomNodes = useCallback( () => {
    const childNodes = document.querySelectorAll( `.${node?.data?.childrenClassName}` )
    childNodes.forEach( ( childNode ) => {
      childNode.classList.remove( 'hide' )
    } )
  }, [node?.data?.childrenClassName] )




  const hideChildren = () => {
    setChildrenHidden( true )
    hideChildDomNodes()
  }

  const showChildren = () => {
    setChildrenHidden( false )
    showChildDomNodes()
  }
  // **State Variables**
  const [handles, setHandles] = useState<string[]>( [] )
  const [childNodeIds, setChildNodeIds] = useState<string[]>( [] )

  // **Spacing Constants**
  const HORIZONTAL_SPACING = 20
  const VERTICAL_SPACING = 20

  // **Effect to Initialize Handles and Child Nodes**
  useEffect( () => {
    if ( nodeData.data.handles && nodeData.data.handles.length > 0 ) {
      setHandles( nodeData.data.handles )
      updateNodeInternals( node.id )
    }

    if ( nodeData.data.children && nodeData.data.children.length > 0 ) {
      const tempIds = nodeData.data.children.map( ( child: any ) => child.id )
      setChildNodeIds( tempIds )
    }
  }, [nodeData, node, updateNodeInternals] )

  /**
   * Retrieves the DOM position of an element using a CSS selector or a React ref.
   *
   * @param selector - The CSS selector string to identify the element.
   * @param ref - The React ref object pointing to the element.
   * @returns The position of the element as { x: number, y: number } or null if not found.
   */
  const getClonePosition = useCallback(
    (
      selector?: string,
      ref?: React.RefObject<HTMLElement>
    ): { x: number; y: number } | null => {
      let element: HTMLElement | null = null

      if ( selector ) {
        element = document.querySelector<HTMLElement>( selector )
      } else if ( ref && ref.current ) {
        element = ref.current
      }

      if ( element ) {
        const rect = element.getBoundingClientRect()
        return { x: rect.left + window.scrollX, y: rect.top + window.scrollY }
      }

      console.warn( 'Element not found for the provided selector or ref.' )
      return null
    },
    []
  )



  // // **Function to Calculate Group Node Height**
  // // const calculateGroupNodeHeight = (): number => {
  // //   const childNodes = childNodeIds.map( ( childId ) => getNode( childId ) )
  // //   const childNodeHeights = childNodes.map( ( child ) => child?.height || 0 )
  // //   const maxHeight = Math.max( ...childNodeHeights, 0 )
  // //   return maxHeight + VERTICAL_SPACING * 2 // Adding padding
  // // }

  // // // **Function to Calculate Child Node Positions**
  // // const calculateChildNodePositions = (): PositionedNode[] => {
  // //   const childNodes = childNodeIds.map( ( childId ) => getNode( childId ) )
  // //   const childNodeBounds = getNodesBounds( childNodes )

  // //   console.log( "🚀 ~ file: useGroupNode.tsx:73 ~ calculateChildNodePositions ~ childNodeBounds:", childNodeBounds )



  // //   // Assuming uniform child node dimensions; adjust if necessary
  // //   const childNodeWidth = childNodes[0]?.width || 100 // Default width
  // //   const childNodeHeight = childNodes[0]?.height || 50 // Default height

  // //   const totalWidth = childNodeWidth * childNodes.length + HORIZONTAL_SPACING * ( childNodes.length - 1 )
  // //   const groupWidth = node?.width || 300 // Default group width if not defined
  // //   const startX = ( groupWidth - totalWidth ) / 2
  // //   const centerY = ( node?.height || 200 - childNodeHeight ) / 2 // Default group height if not defined

  // //   return childNodes.map( ( childNode, index ) => ( {
  // //     ...childNode,
  // //     position: {
  // //       x: startX + index * ( childNodeWidth + HORIZONTAL_SPACING ),
  // //       y: centerY,
  // //     },
  // //   } ) )
  // // }

  // // // **Function to Update Group Node Height**
  // // const updateGroupHeight = () => {
  // //   const newHeight = calculateGroupNodeHeight()
  // //   updateNode( node.id, { ...node, height: newHeight } )
  // // }

  // // // **Function to Position Child Nodes**
  // // const positionChildNodes = (): PositionedNode[] => {
  // //   const positionedChildNodes = calculateChildNodePositions()
  // //   positionedChildNodes.forEach( ( childNode ) => {
  // //     updateNode( childNode.id, { ...childNode } )
  // //     updateNodeInternalsHook( childNode.id )
  // //   } )
  // //   return positionedChildNodes
  // // }

  // // // **Effect to Update Group Node Height Based on Children**
  // // useEffect( () => {
  // //   if ( childNodeIds.length > 0 ) {
  // //     updateGroupHeight()
  // //   }
  // //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // // }, [childNodeIds] )

  // // // **Effect to Position Child Nodes Within the Group**
  // // useEffect( () => {
  // //   if ( childNodeIds.length > 0 && node.width && node.height ) {
  // //     positionChildNodes()
  // //   }
  // //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // // }, [childNodeIds, node.width, node.height] )

  //  const { useUpdateNodeInternals, useNodesData, getNodesBounds, getNode, updateNode } = useMindMap()
  // const updateNodeInternalsHook = useUpdateNodeInternals()
  // const nodeData = useNodesData( id )
  // const groupBounds = getNodesBounds( [{ id, ...rest }] )

  // console.log( "🚀 ~ file: group-results-node.tsx:53 ~ groupBounds:", groupBounds )


  // // **State Variables**
  // const [handles, setHandles] = useState<string[]>( [] )
  // const [childNodeIds, setChildNodeIds] = useState<string[]>( [] )

  // // **Spacing Constants**
  // const HORIZONTAL_SPACING = 20
  // const VERTICAL_SPACING = 20

  // // **Effect to Initialize Handles and Child Nodes**
  // useEffect( () => {
  //   if ( data.handles && data.handles.length > 0 ) {
  //     setHandles( data.handles )
  //     updateNodeInternalsHook( id )
  //   }

  //   if ( data.children && data.children.length > 0 ) {
  //     const tempIds = data.children.map( ( child ) => child.id )
  //     setChildNodeIds( tempIds )
  //   }
  // }, [data.handles, data.children, id, updateNodeInternalsHook] )

  // // **Function to Calculate Group Node Height**
  // const calculateGroupNodeHeight = ( childIds: string[] ): number => {
  //   const childNodes = childIds.map( ( childId ) => getNode( childId ) )
  //   const childNodeHeights = childNodes.map( ( child ) => child?.height || 0 )
  //   const maxHeight = Math.max( ...childNodeHeights, 0 )
  //   return maxHeight + VERTICAL_SPACING * 2 // Adding padding
  // }

  // // **Function to Calculate Child Node Positions**
  // const calculateChildNodePositions = (
  //   childIds: string[],
  //   groupWidth: number,
  //   groupHeight: number
  // ) => {
  //   const childNodes = childIds.map( ( childId ) => getNode( childId ) )

  //   // Assuming uniform child node dimensions; adjust if necessary
  //   const childNodeWidth = childNodes[0]?.width || 100 // Default width
  //   const childNodeHeight = childNodes[0]?.height || 50 // Default height

  //   const totalWidth = childNodeWidth * childNodes.length + HORIZONTAL_SPACING * ( childNodes.length - 1 )
  //   const startX = ( groupWidth - totalWidth ) / 2
  //   const centerY = ( groupHeight - childNodeHeight ) / 2

  //   return childNodes.map( ( childNode, index ) => ( {
  //     ...childNode,
  //     position: {
  //       x: startX + index * ( childNodeWidth + HORIZONTAL_SPACING ),
  //       y: centerY,
  //     },
  //   } ) )
  // }

  // // **Effect to Update Group Node Height Based on Children**
  // useEffect( () => {
  //   if ( childNodeIds.length > 0 ) {
  //     const newHeight = calculateGroupNodeHeight( childNodeIds )
  //     updateNode( id, { ...rest, height: newHeight } )
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [childNodeIds] )

  // // **Effect to Position Child Nodes Within the Group**
  // useEffect( () => {
  //   if ( childNodeIds.length > 0 && rest.width && rest.height ) {
  //     const positionedChildNodes = calculateChildNodePositions( childNodeIds, rest.width, rest.height )
  //     positionedChildNodes.forEach( ( childNode ) => {
  //       updateNode( childNode.id, { ...childNode } )
  //       updateNodeInternalsHook( childNode.id )
  //     } )
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [childNodeIds, rest.width, rest.height] )

  return {
    getClonePosition,
    handles,
    childNodeIds,
    hideChildren,
    showChildren,
    node: node

    // updateGroupHeight,
    // positionChildNodes,
  }
}