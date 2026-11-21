'use client'

import React, {useState, useCallback} from 'react'
import {Handle, type NodeProps, NodeToolbar, Position} from '@xyflow/react'
import {
  ArrowUpRightIcon,
  BrainCircuitIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LightbulbIcon,
} from 'lucide-react'
import {cn} from '@/utils/cn'

export interface AIAnnotationNodeData {
  label?: string
  text: string
  insightType?: 'pattern' | 'connection' | 'insight' | 'suggestion' | 'custom'
  relatedNodeIds?: string[]
  style?: Record<string, any>
  isAnimated?: boolean
  color?: string
}

export function AIAnnotationNode({id, data, selected}: NodeProps<AIAnnotationNodeData>) {
  const [expanded, setExpanded] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  // Determine icon based on insight type
  const getIcon = useCallback(() => {
    switch (data.insightType) {
      case 'pattern':
        return <BrainCircuitIcon className='w-4 h-4' />
      case 'connection':
        return <ArrowUpRightIcon className='w-4 h-4' />
      case 'suggestion':
        return <BrainCircuitIcon className='w-4 h-4' />
      case 'insight':
      default:
        return <LightbulbIcon className='w-4 h-4' />
    }
  }, [data.insightType])

  // Get color based on insight type or custom color
  const getColor = useCallback(() => {
    if (data.color) return data.color

    switch (data.insightType) {
      case 'pattern':
        return '#6366f1' // indigo
      case 'connection':
        return '#10b981' // emerald
      case 'suggestion':
        return '#f59e0b' // amber
      case 'insight':
      default:
        return '#8b5cf6' // violet
    }
  }, [data.color, data.insightType])

  const color = getColor()

  return (
    <>
      <NodeToolbar
        isVisible={selected || showToolbar}
        position={Position.Top}
        className='bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-1'>
        <button
          className='p-1.5 hover:bg-white/5 rounded-lg'
          onClick={toggleExpanded}
          title={expanded ? 'Collapse' : 'Expand'}>
          {expanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </button>
      </NodeToolbar>

      <div
        className={cn(
          'relative bg-neutral-900/80 backdrop-blur-sm text-white rounded-2xl',
          'border border-neutral-800 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all transform',
          expanded ? 'min-w-[300px] p-4' : 'max-w-[200px] p-3',
          data.isAnimated && 'animate-pulse'
        )}
        style={{borderColor: color}}
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}>
        <div className='flex items-start gap-2'>
          <div
            className='flex justify-center items-center p-1.5 rounded-full'
            style={{backgroundColor: `${color}40` /* 25% opacity */}}>
            {getIcon()}
          </div>

          <div className='flex-1'>
            {data.label && (
              <div className='font-medium text-sm mb-1' style={{color}}>
                {data.label}
              </div>
            )}

            <div className={cn('text-sm text-white/80', !expanded && 'line-clamp-2')}>
              {data.text}
            </div>

            {expanded && data.relatedNodeIds && data.relatedNodeIds.length > 0 && (
              <div className='mt-2 pt-2 border-t border-white/10 text-xs text-white/60'>
                Connected to {data.relatedNodeIds.length} node
                {data.relatedNodeIds.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Handles in all 4 directions */}
        <Handle
          type='source'
          position={Position.Right}
          id='right'
          className='w-3 h-3 border border-neutral-800 bg-neutral-600 hover:bg-blue-400'
          style={{backgroundColor: color}}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id='bottom'
          className='w-3 h-3 border border-neutral-800 bg-neutral-600 hover:bg-blue-400'
          style={{backgroundColor: color}}
        />
        <Handle
          type='target'
          position={Position.Left}
          id='left'
          className='w-3 h-3 border border-neutral-800 bg-neutral-600 hover:bg-blue-400'
          style={{backgroundColor: color}}
        />
        <Handle
          type='target'
          position={Position.Top}
          id='top'
          className='w-3 h-3 border border-neutral-800 bg-neutral-600 hover:bg-blue-400'
          style={{backgroundColor: color}}
        />
      </div>
    </>
  )
}
