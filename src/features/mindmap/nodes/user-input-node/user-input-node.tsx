'use client'

import {
  CoreNodeBottom,
  CoreNodeContainer,
  CoreNodeContent,
  CoreNodeTop,
} from '@/features/mindmap/nodes/core-node-ui'

import {useUser} from '@clerk/nextjs'
import {
  Handle,
  type NodeProps,
  Position,
  useUpdateNodeInternals,
  useNodesData,
  type Node,
} from '@xyflow/react'
import {memo, Suspense, use, useCallback, useEffect, useRef, useState} from 'react'

import {wait} from '@/utils'

import {AnimatedBeam, TextEffect} from '@/components/animated'
import {AiStarIcon} from '@/components/icons'
import {AddNote} from '@/components/note/AddNote'
import {useMindMap} from '@/contexts/mindmap'
import {Markdown} from '@/features/ai/components/prompt-kit/markdown'
import {useTextStream} from '@/features/ai/components/prompt-kit/response-stream'
import {WorldMap} from '@/features/data-viz/components/world-map/world-map'
import {AskAI, AskAIStreaming} from '@/features/mindmap/components/ask-ai'
import {useGroupNode} from '@/features/mindmap/hooks/useGroupNode'
import {useAskXata} from '@/features/mindmap/hooks/useAskXata'
import {Anchor} from '@/features/mindmap/nodes/user-input-node/anchor'
import {useEntity} from '@/hooks'
import type {Events} from '@/db/xata'
import {AnimatePresence, motion} from 'framer-motion'
import {Loader2, RefreshCw, Bug, List, MonitorCheck} from 'lucide-react'
import {useSSE} from '@/hooks/useSSE'
import {AnimatedMarkdown} from '@/features/mindmap/nodes/user-input-node/animated-markdown'

// This component is no longer needed - we're using our improved useSSE hook instead

interface EntityData {
  id?: string
  data?: {
    name?: string
  }
}

interface AskQuestionParams {
  entities: string[]
  input: string
  type: string
}

// Define proper data structure for the node
interface NodeData {
  input?: string
  type?: string
  entities?: EntityData[]
  answer?: string
  isLoading?: boolean
  streamingAnswer?: string
  question?: string
  error?: string
  [key: string]: any // Allow for additional properties
}

interface WorldMapDot {
  start: {lat: number; lng: number; label?: string}
  end: {lat: number; lng: number; label?: string}
}

const EventRecordsContent = memo(({data}: {data: {entities: Events[]}}) => {
  const {entities} = data

  const dots: WorldMapDot[] =
    entities && entities.length > 0
      ? entities.map((entity: Events) => ({
          start: {lat: entity.latitude || 0, lng: entity.longitude || 0},
          end: {lat: entity.latitude || 0, lng: entity.longitude || 0},
        }))
      : []

  return (
    <div className='w-full h-auto'>
      <WorldMap dots={dots} />
    </div>
  )
})

EventRecordsContent.displayName = 'EventRecordsContent'

export const UserInputNode = memo((props: NodeProps) => {
  console.log('🚀 ~ UserInputNode ~ props:', props)

  const containerRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  // Create a transformed node with required properties for useGroupNode
  const nodeForGroup = {
    ...props,
    width: props.width || 0,
    height: props.height || 0,
    data: props.data || {},
  }

  const {handles, node} = useGroupNode({node: nodeForGroup})
  const {updateNodeData} = useMindMap()

  const nodeId = props.id
  // We're not using the returned data from this hook directly
  const nodeData = useNodesData(nodeId)

  // Simple state for UI interactions
  const [showAskAI, setShowAskAI] = useState(false)

  const {saveNote, updateNote, userNote, findConnections} = useEntity({
    card: props,
  })

  const [showAnchor, setShowAnchor] = useState(false)

  useEffect(() => {
    wait(0.5).then(() => setShowAnchor(true))
  }, [])

  // Handle the beams with proper typing for AnimatedBeam props
  const getBeamProps = () => {
    return {
      duration: 3,
      className: 'w-full',
      // Use non-null assertion to satisfy the type requirement
      containerRef: containerRef as React.RefObject<HTMLElement>,
      fromRef: anchorRef as React.RefObject<HTMLElement>,
      toRef: nodeRef as React.RefObject<HTMLElement>,
    }
  }

  // Type assertion for data to ensure properties exist
  const data = props.data as NodeData

  // Helper function to check if node has valid entities
  const hasValidEntities = () => {
    return (
      node?.data &&
      'entities' in node.data &&
      Array.isArray(node.data.entities) &&
      node.data.entities.length > 0
    )
  }

  return (
    <motion.div
      ref={containerRef}
      id={props.id}
      className='relative flex flex-col items-center align-center justify-center w-full motion-opacity-in-0'>
      <AnimatePresence>
        {showAnchor && (
          <>
            <motion.div className='mb-[35px] w-full flex justify-center'>
              <Anchor className='' ref={anchorRef} />
            </motion.div>
            <AnimatedBeam
              duration={3}
              containerRef={containerRef}
              fromRef={anchorRef}
              toRef={nodeRef}
            />
          </>
        )}
      </AnimatePresence>

      <CoreNodeContainer
        className='motion-opacity-in-0'
        // @ts-ignore - CoreNodeContainer expects a different ref type, but this works at runtime
        ref={nodeRef}>
        <CoreNodeTop>
          <div className='flex justify-between w-content align-center items-center ml-auto'>
            {/* UI actions removed for clarity */}
          </div>
        </CoreNodeTop>
        <CoreNodeContent className='min-h-[100px] w-full'>
          <AnimatePresence>
            <motion.div className='py-2 max-h-[600px] h-auto'>
              {data?.input && (
                <div className='py-2 text-indigo-200 text-sm font-light'>
                  <p>{data.input}</p>
                </div>
              )}

              {data?.answer ? (
                <AnimatedMarkdown
                  className='text-indigo-200 text-sm font-light'
                  delay={0.2}
                  staggerDelay={0.08}
                  animateExit={true}>
                  {data.answer}
                </AnimatedMarkdown>
              ) : (
                <div className='flex items-center justify-center py-4'>
                  <Loader2 className='h-6 w-6 animate-spin text-indigo-400 mr-2' />
                  <span className='text-indigo-200'>AI is thinking...</span>
                </div>
              )}

              {hasValidEntities() && (
                <div className='entities-list mt-4 border-t border-indigo-700 pt-2'>
                  <h4 className='text-xs uppercase tracking-wider text-indigo-400 mb-2'>
                    Related Records
                  </h4>
                  <div className='grid grid-cols-2 gap-2'>
                    {(node.data.entities as EntityData[]).map((entity: EntityData, i: number) => (
                      <div
                        key={entity.id || i.toString()}
                        className='entity-item text-xs p-1 bg-indigo-900/30 rounded'>
                        {entity.data?.name || 'Unnamed Entity'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CoreNodeContent>
        <CoreNodeBottom>
          <div className='flex items-center gap-1 rounded-full py-1 pl-2 pr-2.5 bg-neutral-800 text-neutral-400'>
            <div className='size-5'>
              <span
                className='relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none'
                data-state='closed'
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  transform: 'translateX(0px)',
                }}>
                <AiStarIcon
                  stroke={'#fff'}
                  className='w-4 h-4 stroke-1'
                  onClick={() => setShowAskAI(!showAskAI)}
                />
              </span>
              {!data?.answer && (
                <div className='flex items-center justify-center py-4'>
                  <Loader2 className='h-6 w-6 animate-spin text-indigo-400 mr-2' />
                  <span className='text-indigo-200'>AI is thinking...</span>
                </div>
              )}
            </div>
            <span className='text-neutral-400' />
          </div>
          <span className='flex items-center gap-1'>
            <AddNote saveNote={saveNote} popover={false} />
          </span>
        </CoreNodeBottom>
      </CoreNodeContainer>

      {handles?.length > 0 &&
        handles.map((id: string) => (
          <Handle key={id} type='source' position={Position.Bottom} id={id} isConnectable={true} />
        ))}
      <Handle type='source' position={Position.Bottom} isConnectable={true} />
    </motion.div>
  )
})

UserInputNode.displayName = 'UserInputNode'
