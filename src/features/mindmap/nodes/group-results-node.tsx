'use client'

import { MyFavoriteStarIllustration } from '@/components/icons'
import {
  CoreNodeBottom,
  CoreNodeContainer,
  CoreNodeContent,
} from '@/features/mindmap/nodes/core-node-ui'


import { useGroupNode } from '@/features/mindmap/hooks/useGroupNode'
import { Handle, Position } from '@xyflow/react'
import { SparklesIcon } from 'lucide-react'
import { useEffect } from 'react'
import type { Node } from '../types'

// **AiButton Component**
export const AiButton: React.FC = () => {
  return (
    <button
      className="group flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-neutral-400/15 active:bg-neutral-400/25"
      type="button"
    >
      <SparklesIcon aria-hidden="true" className="w-4 h-4 text-neutral-400" />
      <span className="w-0 overflow-hidden transition-all duration-500 group-hover:w-20">
        <span className="whitespace-nowrap text-neutral-400 text-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Ask AI
        </span>
      </span>
    </button>
  )
}

// **GroupResultsNodeProps Interface**
interface GroupResultsNodeProps extends Node {
  id: string
  data: {
    type: string
    handles?: string[]
    input: string
    children: Node[]
    label?: string // Assuming label is optional
  }
}

// **GroupResultsNode Component**
export const GroupResultsNode: any = ( props: any ) => {
  const { handles, node, hideChildren, showChildren, getClonePosition } = useGroupNode( { node: props } )

  console.log( "🚀 ~ file: group-results-node.tsx:51 ~ node:", node )

  useEffect( () => {
    console.log( "🚀 ~ file: group-results-node.tsx:53 ~ useEffect ~ getClonePosition:", getClonePosition )
    hideChildren()
  }, [getClonePosition, hideChildren] )

  return (
    <>
      {/* Target Handle at Top */}
      <Handle type="target" position={Position.Top} isConnectable={true} />

      {/* Core Node Container */}
      <CoreNodeContainer
        id={props.id}
        className=" motion-opacity-in-0"
        style={{ width: node.width, height: node.height }}
      >
        <CoreNodeContent>
          {node.data?.children?.length ? node.data?.children?.map( ( child: any ) => (
            <div key={child.id} className="text-white text-sm font-nunito">
              {child.data.label}
            </div>
          ) ) : null}
        </CoreNodeContent>
        <CoreNodeBottom>
          {/* Label and Icon */}
          <div className="flex items-center gap-1 rounded-full bg-neutral-200 py-1 pl-2 pr-2.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            <div className="w-5 h-5 relative">
              <span
                className="absolute inset-0 flex items-center justify-center rounded-full border-2 shadow pointer-events-none transition-transform duration-200"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  transform: 'translateX(0px)',
                }}
                data-state="closed"
              >
                <MyFavoriteStarIllustration className="w-full h-full object-cover transition delay-400 duration-500 ease-spring-bouncier scale-0" />
              </span>
            </div>
            <span className="text-neutral-600 dark:text-neutral-400">{props.label}</span>
          </div>

          {/* AI Button */}
          <div>
            <AiButton />
          </div>
        </CoreNodeBottom>
      </CoreNodeContainer>

      {/* Source Handles at Bottom */}
      {handles.length > 0 &&
        handles.map( ( handleId ) => (
          <Handle
            key={handleId}
            type="source"
            position={Position.Bottom}
            id={handleId}
            isConnectable={true}
          />
        ) )}
    </>
  )
}