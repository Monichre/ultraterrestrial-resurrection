'use client'

import * as React from 'react'

import { getEdgeParams } from '@/features/mindmap/config/index.config'
import { getBezierPath, useInternalNode } from '@xyflow/react'

interface FloatingEdgeProps {
  id: string
  source: string
  target: string
  markerEnd?: string
  style?: React.CSSProperties
}

export function FloatingEdge( { id, source, target, markerEnd, style }: FloatingEdgeProps ) {
  const sourceNode = useInternalNode( source )
  console.log( '🚀 ~ file: FloatingEdge.tsx:18 ~ FloatingEdge ~ sourceNode:', sourceNode )
  const targetNode = useInternalNode( target )
  console.log( '🚀 ~ file: FloatingEdge.tsx:20 ~ FloatingEdge ~ targetNode:', targetNode )

  if ( !sourceNode || !targetNode ) {
    return null
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams( sourceNode, targetNode )

  const [edgePath] = getBezierPath( {
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  } )

  return (
    <path
      id={id}
      className='react-flow__edge-path'
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  )
}
