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

import {useMindMap} from '@/contexts/mindmap'
import {Markdown} from '@/features/ai/components/prompt-kit/markdown'
import {useTextStream} from '@/features/ai/components/prompt-kit/response-stream'
import {AskAI, AskAIStreaming} from '@/features/mindmap/components/ask-ai'
import {useGroupNode} from '@/features/mindmap/hooks/useGroupNode'
import {useAskXata} from '@/features/mindmap/hooks/useAskXata'
import {Anchor} from '@/features/mindmap/nodes/user-input-node/anchor'
import {useEntity} from '@/hooks'
import {AnimatePresence, motion} from 'framer-motion'
import {Loader2, RefreshCw, Bug, MonitorCheck} from 'lucide-react'
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

// Enhanced data structure for the node with better typing
interface NodeData {
  input?: string
  type?: string
  entities?: EntityData[]
  answer?: string
  isLoading?: boolean
  streamingAnswer?: string
  question?: string
  error?: string
  hasContent?: boolean
  lastUpdated?: number
  records?: Array<{
    id: string
    type?: string
    name?: string
    title?: string
    [key: string]: any
  }>
  reasoning?: Array<{
    recordId: string
    reasoning: string
    connectionType: string
    analysisContext: string
  }>
  hasChildren?: boolean
  childCount?: number
  [key: string]: any
}

export const UserInputNode = memo((props: NodeProps) => {
  console.log('🚀 ~ UserInputNode ~ props:', props)

  const containerRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const updateNodeInternals = useUpdateNodeInternals()
  const [nodeHeight, setNodeHeight] = useState<number>(0)
  const [isContentReady, setIsContentReady] = useState(false)

  // Create a transformed node with required properties for useGroupNode
  const nodeForGroup = {
    ...props,
    width: props.width || 0,
    height: props.height || 0,
    data: props.data || {},
  }

  const {handles, node} = useGroupNode({node: nodeForGroup})
  const {updateNodeData, organizeLayout, addNodes, addEdges} = useMindMap()

  const nodeId = props.id
  const nodeData = useNodesData(nodeId)

  // Enhanced state management
  const [showAskAI, setShowAskAI] = useState(false)
  const [contentState, setContentState] = useState<'loading' | 'ready' | 'error'>('loading')

  const {saveNote, updateNote, userNote, findConnections} = useEntity({
    card: props,
  })

  const [showAnchor, setShowAnchor] = useState(false)

  // Type assertion for data with better defaults
  const data = (props.data as NodeData) || {}

  // Enhanced helper functions
  const hasAnswer = useCallback(() => {
    return Boolean(data.answer && data.answer.trim().length > 0)
  }, [data.answer])

  const hasRecords = useCallback(() => {
    return Boolean(data.records && Array.isArray(data.records) && data.records.length > 0)
  }, [data.records])

  const isLoading = useCallback(() => {
    return Boolean(data.isLoading) || (!hasAnswer() && !hasRecords() && !data.error)
  }, [data.isLoading, hasAnswer, hasRecords, data.error])

  // Create child nodes from database records
  const createChildNodesFromRecords = useCallback(async () => {
    if (!hasRecords() || !data.records) return

    console.log('🔄 Creating child nodes from records:', data.records)

    const childNodes = []
    const childEdges = []

    // Calculate positions around the user input node
    const baseRadius = 200
    const angleStep = (2 * Math.PI) / data.records.length

    for (let i = 0; i < data.records.length; i++) {
      const record = data.records[i]

      if (!record || !record.id) continue

      // Calculate position around the user input node
      const angle = i * angleStep
      const parentX = node?.position?.x || props.position?.x || 0
      const parentY = node?.position?.y || props.position?.y || 0
      const x = parentX + Math.cos(angle) * baseRadius
      const y = parentY + Math.sin(angle) * baseRadius

      // Create child node
      const childNode = {
        id: `child-${nodeId}-${record.id}`,
        type: 'enhancedEntityNode',
        position: {x, y},
        data: {
          ...record,
          type: data.type || 'events', // Use the query type
          isContextual: true,
          contextInfo: `Found via: ${data.input || 'User Query'}`,
        },
        parentId: nodeId,
      }

      // Find the reasoning for this specific record
      const recordReasoning = data.reasoning?.find((r) => r.recordId === record.id)

      // Create edge connecting to user input node with Prometheus reasoning
      const childEdge = {
        id: `edge-${nodeId}-${record.id}`,
        source: nodeId,
        target: `child-${nodeId}-${record.id}`,
        type: 'siblingEdge', // Use our enhanced smart edge
        animated: true,
        label: `Query::Result`, // Will be enhanced by SiblingEdge component
        data: {
          prometheusReasoning:
            recordReasoning?.reasoning ||
            `Selected as relevant ${data.type || 'record'} for the query`,
          connectionType: recordReasoning?.connectionType || 'query-result',
          analysisContext: recordReasoning?.analysisContext || data.answer,
          recordIndex: i + 1,
          totalRecords: data.records.length,
        },
      }

      childNodes.push(childNode)
      childEdges.push(childEdge)
    }

    // Add the child nodes and edges to the graph
    addNodes(childNodes)
    addEdges(childEdges)

    // Update the parent node to show it has children
    updateNodeData(nodeId, {
      ...data,
      hasChildren: true,
      childCount: childNodes.length,
    })

    console.log(`✅ Created ${childNodes.length} child nodes and ${childEdges.length} edges`)
  }, [hasRecords, data, nodeId, node, props.position, updateNodeData, addNodes, addEdges])

  // Enhanced content state management
  useEffect(() => {
    if (data.error) {
      setContentState('error')
    } else if (hasAnswer() || hasRecords()) {
      setContentState('ready')
      setIsContentReady(true)
    } else {
      setContentState('loading')
    }
  }, [data.error, hasAnswer, hasRecords])

  // Create child nodes when records are available (with small delay for layout)
  useEffect(() => {
    if (hasRecords() && contentState === 'ready' && !data.hasChildren) {
      // Small delay to ensure the user input node is positioned
      setTimeout(() => {
        createChildNodesFromRecords()
      }, 500)
    }
  }, [hasRecords, contentState, createChildNodesFromRecords, data.hasChildren])

  // Enhanced anchor animation with content readiness
  useEffect(() => {
    wait(0.3).then(() => setShowAnchor(true))
  }, [])

  // Update node dimensions when content changes
  useEffect(() => {
    if (nodeRef.current && isContentReady) {
      const updateDimensions = () => {
        if (nodeRef.current) {
          const rect = nodeRef.current.getBoundingClientRect()
          const newHeight = rect.height

          if (newHeight !== nodeHeight && newHeight > 0) {
            setNodeHeight(newHeight)
            // Update node internals to recalculate handles and connections
            updateNodeInternals(nodeId)

            // Trigger a layout update with a small delay to ensure DOM is updated
            setTimeout(() => {
              if (organizeLayout) {
                organizeLayout({
                  preserveExistingLayout: true,
                  focusOnNewNodes: false,
                })
              }
            }, 100)
          }
        }
      }

      // Use ResizeObserver for more accurate dimension tracking
      const resizeObserver = new ResizeObserver(updateDimensions)
      resizeObserver.observe(nodeRef.current)

      // Initial measurement
      updateDimensions()

      return () => resizeObserver.disconnect()
    }
  }, [isContentReady, nodeHeight, updateNodeInternals, nodeId, organizeLayout])

  // Render different content states
  const renderContent = () => {
    if (contentState === 'error') {
      return (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          className='flex items-center justify-center py-4 text-red-400'>
          <Bug className='h-5 w-5 mr-2' />
          <span>Error loading content</span>
        </motion.div>
      )
    }

    if (contentState === 'loading') {
      return (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          className='flex items-center justify-center py-4'>
          <Loader2 className='h-6 w-6 animate-spin text-indigo-400 mr-2' />
          <span className='text-indigo-200'>AI is thinking...</span>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        className='py-2'>
        {data.input && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.1}}
            className='py-2 text-indigo-200 text-sm font-light mb-3 p-2 bg-indigo-900/20 rounded'>
            <span className='text-xs uppercase tracking-wider text-indigo-400 block mb-1'>
              Query
            </span>
            <p>{data.input}</p>
          </motion.div>
        )}

        {hasRecords() && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
            <div className='text-indigo-200 text-sm font-light space-y-2'>
              <p className='text-xs uppercase tracking-wider text-indigo-400'>Results Generated</p>
              <p>
                Found {data.records.length} record{data.records.length !== 1 ? 's' : ''} from{' '}
                {data.type || 'database'}.
                {data.hasChildren && ' Child nodes created and positioned around this query.'}
              </p>

              {data.answer && (
                <details className='mt-2'>
                  <summary className='text-xs text-indigo-400 cursor-pointer hover:text-indigo-300'>
                    View AI Summary
                  </summary>
                  <div className='mt-2 p-2 bg-indigo-900/20 rounded text-xs'>
                    <AnimatedMarkdown
                      className='text-indigo-200 text-xs font-light'
                      delay={0.1}
                      staggerDelay={0.05}
                      animateExit={true}>
                      {data.answer}
                    </AnimatedMarkdown>
                  </div>
                </details>
              )}
            </div>
          </motion.div>
        )}

        {hasAnswer() && !hasRecords() && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
            <AnimatedMarkdown
              className='text-indigo-200 text-sm font-light'
              delay={0.2}
              staggerDelay={0.08}
              animateExit={true}>
              {data.answer}
            </AnimatedMarkdown>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      id={props.id}
      className='relative flex flex-col items-center align-center justify-center w-full'
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.3}}>
      <AnimatePresence>
        {showAnchor && (
          <>
            <motion.div
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              className='mb-[35px] w-full flex justify-center'>
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

      <CoreNodeContainer className='motion-opacity-in-0 min-w-[300px] max-w-[500px]' ref={nodeRef}>
        <CoreNodeTop>
          <div className='flex justify-between w-full align-center items-center'>
            <span className='text-xs uppercase tracking-wider text-indigo-400 flex items-center'>
              <MonitorCheck className='h-3 w-3 mr-1' />
              AI Response
            </span>
            <div className='flex items-center gap-2'>
              {contentState === 'ready' && (
                <motion.div
                  initial={{opacity: 0, scale: 0}}
                  animate={{opacity: 1, scale: 1}}
                  className='h-2 w-2 bg-green-400 rounded-full'
                />
              )}
            </div>
          </div>
        </CoreNodeTop>

        <CoreNodeContent className='min-h-[120px] max-h-[400px] overflow-y-auto w-full'>
          <AnimatePresence mode='wait'>{renderContent()}</AnimatePresence>
        </CoreNodeContent>

        <CoreNodeBottom>
          <div className='flex items-center gap-1 rounded-full py-1 pl-2 pr-2.5 bg-neutral-800 text-neutral-400'>
            <div className='size-5'>
              <span
                className='relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200'
                data-state='closed'
                style={{
                  borderColor:
                    contentState === 'ready'
                      ? 'rgba(34, 197, 94, 0.5)'
                      : 'rgba(255, 255, 255, 0.5)',
                  transform: 'translateX(0px)',
                }}>
                <AiStarIcon
                  stroke={contentState === 'ready' ? '#22c55e' : '#fff'}
                  className='w-4 h-4 stroke-1'
                  onClick={() => setShowAskAI(!showAskAI)}
                />
              </span>
            </div>
          </div>
          <span className='flex items-center gap-1'>
            {/* TODO: Add note functionality */}
            {/* <AddNote saveNote={saveNote} popover={false} /> */}
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
