'use client'

import { CardStackUI } from '@/features/mindmap/components/cards/card-stack/cards'

export const formatNodesForCardDisplay = ( nodes: any ) => {
  console.log( 'nodes: ', nodes )
  if ( !nodes ) return []
  return nodes.map( ( node ) => {
    const { id, ...rest } = node
    const nodeData = node?.data || rest

    const data = {
      id,
      ...nodeData,
    }
    console.log( 'data: ', data )

    return data
  } )
}

export const CardStack = ( {
  mindmapCards,
  stacked,
  toggleStack,
  removeChildCardClone,
}: {
  mindmapCards: any
  stacked: any
  toggleStack: any
  removeChildCardClone: any
} ) => {
  return (
    <CardStackUI
      mindmapCards={mindmapCards}
      stacked={stacked}
      toggleStack={toggleStack}
      removeChildCardClone={removeChildCardClone}
    />
  )
}
