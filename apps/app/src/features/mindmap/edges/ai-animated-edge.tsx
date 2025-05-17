'use client'

import type React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from '@xyflow/react'

export interface AIAnimatedEdgeData {
  label?: string
  labelBgColor?: string
  labelTextColor?: string
  animated?: boolean
  style?: React.CSSProperties
  pathType?: 'bezier' | 'smoothstep' | 'step' | 'straight'
  markerEnd?: string
  markerStart?: string
  strokeWidth?: number
  relationType?: string
  insightType?: string
}

export function AIAnimatedEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {
    animated: true,
    pathType: 'bezier',
    strokeWidth: 2,
  },
  markerEnd,
  style,
}: EdgeProps<AIAnimatedEdgeData>) {
  // Determine edge styling based on data
  const animated = data?.animated ?? true
  const pathType = data?.pathType ?? 'bezier'
  const strokeWidth = data?.strokeWidth ?? 2
  const relationType = data?.relationType

  // Get edge color based on insight type or relation type
  const getEdgeColor = () => {
    if (style?.stroke) return style.stroke

    if (data?.insightType) {
      switch (data.insightType) {
        case 'pattern':
          return '#6366f1' // indigo
        case 'connection':
          return '#10b981' // emerald
        case 'suggestion':
          return '#f59e0b' // amber
        case 'insight':
          return '#8b5cf6' // violet
        default:
          return '#64748b' // slate
      }
    }

    if (relationType) {
      switch (relationType) {
        case 'direct':
          return '#10b981' // emerald
        case 'inferred':
          return '#6366f1' // indigo
        case 'weak':
          return '#64748b' // slate
        case 'strong':
          return '#ef4444' // red
        default:
          return '#64748b' // slate
      }
    }

    return '#64748b' // Default: slate
  }

  const edgeColor = getEdgeColor()

  // Get path based on pathType
  const getPath = () => {
    switch (pathType) {
      case 'smoothstep':
        return getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
        })
      case 'step':
        return getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 0,
        })
      case 'straight':
        return getStraightPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
        })
      case 'bezier':
      default:
        return getBezierPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
        })
    }
  }

  const [edgePath, labelX, labelY] = getPath()

  // Construct edge style
  const edgeStyle: React.CSSProperties = {
    strokeWidth,
    stroke: edgeColor,
    ...style,
  }

  // Add animation if specified
  if (animated) {
    edgeStyle.strokeDasharray = '5,5'
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={edgeStyle}
        markerEnd={markerEnd}
        markerStart={data?.markerStart}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              backgroundColor: data.labelBgColor || '#18181b',
              color: data.labelTextColor || 'white',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 500,
              border: `1px solid ${edgeColor}`,
            }}
            className='nodrag nopan'>
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
