'use client'

import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react'
import { NEONS } from '@/utils'

import { StarDoodle } from '@/components/icons'

type SiblingEdgeProps = {
  data: { sourceType: string; targetType: string }
}

export const RootEdge = ( {
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    stroke: NEONS.blue,
  },
}: EdgeProps & SiblingEdgeProps ) => {
  const [edgePath, labelX, labelY] = getBezierPath( {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  } )

  return (
    <>
      <BaseEdge path={edgePath} style={style} markerEnd={'custom-marker'} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,

            padding: 10,
            borderRadius: 5,
            height: '40px',
            width: '40px',
          }}
          className='nodrag nopan'
        >
          <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
            <StarDoodle stroke={style?.stroke} />
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
