'use client'
import { getEdgeParams } from '@/features/mindmap/config/functions'
import { getBezierPath } from '@xyflow/react'

export const FloatingConnectionLine: any = ( {
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
  targetNode,
}: {
  toX: number
  toY: number
  fromPosition: any // Replace 'any' with the appropriate type
  toPosition: any
  fromNode: any // Replace 'any' with the appropriate type
  targetNode: {
    id: string
    measured: {
      width: number
      height: number
    }
    internals: {
      positionAbsolute: { x: number; y: number }
    }
  }
} ) => {
  if ( !fromNode ) {
    return null
  }
  console.log( '🚀 ~ file: FloatingConnectionLine.tsx:34 ~ targetNode:', targetNode )
  const { sx, sy } = getEdgeParams( fromNode, targetNode )

  const [edgePath] = getBezierPath( {
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY,
  } )

  return (
    <g>
      <path fill='none' stroke='#222' strokeWidth={1.5} className='animated' d={edgePath} />
      <circle cx={toX} cy={toY} fill='#fff' r={3} stroke='#222' strokeWidth={1.5} />
    </g>
  )
}
