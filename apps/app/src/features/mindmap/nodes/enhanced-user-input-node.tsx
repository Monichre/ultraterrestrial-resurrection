'use client'

import {memo, useEffect, useState, useCallback} from 'react'
import {Handle, Position, useNodesData, useUpdateNodeInternals} from '@xyflow/react'
import {motion, AnimatePresence} from 'framer-motion'
import {
  Brain,
  Search,
  Sparkles,
  Users,
  Calendar,
  Globe,
  Target,
  Zap,
  MessageSquare,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

import {
  EnhancedNodeContainer,
  EnhancedNodeHeader,
  EnhancedNodeContent,
  EnhancedNodeFooter,
  QuickActions,
  DataPoint,
  ENTITY_COLORS,
} from './enhanced-core-node-ui'

import {useEntity} from '@/hooks'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {getGraphContext} from '@/features/mindmap/utils/contextual-intelligence'
import {Badge} from '@/components/ui/badge'
import {Progress} from '@/components/ui/progress'

interface EnhancedUserInputNodeProps {
  id: string
  data: {
    input?: string
    label?: string
    type?: string
    question?: string
    answer?: string
    isLoading?: boolean
    isContextual?: boolean
    contextInfo?: string
    streamingAnswer?: string
    error?: string
    handles?: string[]
    [key: string]: any
  }
  selected?: boolean
}

const EnhancedUserInputNode = memo<EnhancedUserInputNodeProps>(
  function EnhancedUserInputNode(props) {
    const {id, data, selected = false} = props
    const updateNodeInternals = useUpdateNodeInternals()
    const [handles, setHandles] = useState<string[]>([])
    const [isHovered, setIsHovered] = useState(false)
    const [showFullAnswer, setShowFullAnswer] = useState(false)
    const {getNodes} = useMindMap()

    // Determine contextual status
    const graphContext = getGraphContext(getNodes())
    const isContextual = data.isContextual || data.label?.includes('Contextual')
    const isOpenExploration = !isContextual && !graphContext

    const {entity, saveNote, updateNote, userNote, findConnections} = useEntity({
      card: {
        ...data,
        id,
      },
    })

    useEffect(() => {
      updateNodeInternals(id)
      if (data?.handles?.length) {
        updateNodeInternals(id)
        setHandles(data.handles)
      }
    }, [id, data, updateNodeInternals])

    // Determine node appearance based on state
    const getNodeState = useCallback(() => {
      if (data.error) {
        return {
          status: 'error' as const,
          icon: <AlertCircle className='w-4 h-4' />,
          color: ENTITY_COLORS.documents, // Red for errors
          title: 'Error Occurred',
          subtitle: 'Failed to process request',
        }
      }

      if (data.isLoading) {
        return {
          status: 'loading' as const,
          icon: <Loader2 className='w-4 h-4 animate-spin' />,
          color: ENTITY_COLORS.topics, // Cyan for loading
          title: 'Processing...',
          subtitle: isContextual ? 'Finding related records' : 'Searching database',
        }
      }

      if (data.answer || data.streamingAnswer) {
        return {
          status: 'completed' as const,
          icon: <CheckCircle className='w-4 h-4' />,
          color: isContextual ? ENTITY_COLORS.contextual : ENTITY_COLORS.personnel,
          title: isContextual ? 'Contextual Results' : 'Search Results',
          subtitle: data.input || 'Query completed',
        }
      }

      return {
        status: 'input' as const,
        icon: isContextual ? <Brain className='w-4 h-4' /> : <Search className='w-4 h-4' />,
        color: isContextual ? ENTITY_COLORS.contextual : ENTITY_COLORS.topics,
        title: data.label || 'Your Query',
        subtitle: isContextual ? 'Building connected knowledge' : 'Open exploration',
      }
    }, [data, isContextual])

    const nodeState = getNodeState()

    // Get contextual insights
    const getContextualInsights = useCallback(() => {
      if (!graphContext || !isContextual) return null

      return {
        entityTypes: Array.from(graphContext.connectedEntityTypes),
        keyFigures: graphContext.keyPersonnel.slice(0, 3),
        timeframe:
          graphContext.timelineBounds.earliest && graphContext.timelineBounds.latest
            ? `${graphContext.timelineBounds.earliest.getFullYear()} - ${graphContext.timelineBounds.latest.getFullYear()}`
            : null,
        topics: graphContext.relatedTopics.slice(0, 3),
      }
    }, [graphContext, isContextual])

    const contextualInsights = getContextualInsights()

    const handleToggleAnswer = useCallback(() => {
      setShowFullAnswer(!showFullAnswer)
    }, [showFullAnswer])

    const handleAskAI = useCallback(() => {
      console.log('Enhanced AI interaction for:', data.input)
    }, [data.input])

    const handleAddToResearch = useCallback(() => {
      console.log('Adding query results to research canvas')
    }, [])

    return (
      <>
        <Handle type='target' position={Position.Top} className='opacity-0' />

        <EnhancedNodeContainer
          id={id}
          entityType='topics' // User input nodes use topic styling
          isSelected={selected}
          isContextual={isContextual}
          isHovered={isHovered}
          className='w-96' // Wider for user input
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          <EnhancedNodeHeader
            title={nodeState.title}
            subtitle={nodeState.subtitle}
            entityType='topics'
            isContextual={isContextual}
            avatar={undefined} // No avatar for user input
          />

          <EnhancedNodeContent scrollable={showFullAnswer}>
            {/* Mode indicator */}
            <div className='mb-4'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='flex items-center gap-2 px-2 py-1 rounded-full bg-black/20 border border-white/10'>
                  {nodeState.icon}
                  <span className='text-xs font-medium text-white/80'>
                    {isContextual ? 'Contextual Mode' : 'Open Exploration'}
                  </span>
                </div>

                {nodeState.status === 'loading' && (
                  <motion.div
                    animate={{opacity: [0.5, 1, 0.5]}}
                    transition={{duration: 1.5, repeat: Infinity}}
                    className='flex items-center gap-1 text-xs text-white/60'>
                    <Zap className='w-3 h-3' />
                    AI Processing
                  </motion.div>
                )}
              </div>

              {/* Contextual insights */}
              {isContextual && contextualInsights && (
                <motion.div
                  initial={{opacity: 0, height: 0}}
                  animate={{opacity: 1, height: 'auto'}}
                  className='space-y-2'>
                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    <DataPoint
                      label='Connected Types'
                      value={contextualInsights.entityTypes.length}
                      icon={<Users className='w-3 h-3' />}
                    />
                    {contextualInsights.timeframe && (
                      <DataPoint
                        label='Time Range'
                        value={contextualInsights.timeframe}
                        icon={<Calendar className='w-3 h-3' />}
                      />
                    )}
                  </div>

                  {contextualInsights.keyFigures.length > 0 && (
                    <div>
                      <div className='text-xs text-white/60 uppercase tracking-wide mb-1'>
                        Key Figures
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {contextualInsights.keyFigures.map((figure, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='text-xs border-teal-500/30 bg-teal-500/10 text-teal-300'>
                            {figure}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* User input */}
            {data.input && (
              <div className='mb-4'>
                <div className='text-xs text-white/60 uppercase tracking-wide mb-1'>Query</div>
                <div className='text-sm text-white bg-black/20 rounded-lg p-3 border border-white/10'>
                  <MessageSquare className='w-4 h-4 text-white/60 mb-2' />
                  {data.input}
                </div>
              </div>
            )}

            {/* AI Response */}
            {(data.answer || data.streamingAnswer) && (
              <div className='space-y-2'>
                {/* compact status header row */}
                <div className='flex items-center gap-2 text-[11px] text-white/70'>
                  <span className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5'>
                    <span className='inline-block h-1.5 w-1.5 rounded-full bg-emerald-400' />
                    AI Response
                  </span>
                  {Array.isArray((data as any).records) && (
                    <span className='truncate'>
                      Found {(data as any).records.length} record
                      {((data as any).records.length ?? 0) !== 1 ? 's' : ''}
                    </span>
                  )}
                  {typeof (data as any).contextExpansionCount === 'number' && (
                    <span className='truncate'>
                      · Context expanded +{(data as any).contextExpansionCount}
                    </span>
                  )}
                </div>

                {/* main text with clamp scale */}
                <div
                  className='text-white/90 leading-relaxed'
                  style={{fontSize: 'clamp(0.85rem, 0.6vw + 0.7rem, 1rem)'}}>
                  {showFullAnswer
                    ? data.answer || data.streamingAnswer
                    : `${(data.answer || data.streamingAnswer || '').slice(0, 220)}${(data.answer || data.streamingAnswer || '').length > 220 ? '...' : ''}`}
                </div>

                {(data.answer || data.streamingAnswer || '').length > 220 && (
                  <button
                    onClick={handleToggleAnswer}
                    className='text-xs text-blue-400 hover:text-blue-300 transition-colors'>
                    {showFullAnswer ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}

            {/* Error state */}
            {data.error && (
              <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-3'>
                <div className='flex items-center gap-2 text-red-400 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  {data.error}
                </div>
              </div>
            )}

            {/* Progress indicator for loading */}
            {data.isLoading && (
              <div className='space-y-2'>
                <div className='text-xs text-white/60'>Processing request...</div>
                <Progress value={undefined} className='w-full' />
              </div>
            )}
          </EnhancedNodeContent>

          <EnhancedNodeFooter entityType='topics' isContextual={isContextual}>
            <div className='flex items-center gap-2'>
              <Badge
                variant='outline'
                className='text-xs border-0 text-white/70'
                style={{
                  backgroundColor: `${nodeState.color.primary}20`,
                  color: nodeState.color.accent,
                }}>
                {nodeState.status}
                {isContextual && <Sparkles className='w-3 h-3 ml-1' />}
              </Badge>
            </div>

            <QuickActions
              onAskAI={data.answer ? handleAskAI : undefined}
              onAddToResearch={data.answer ? handleAddToResearch : undefined}
            />
          </EnhancedNodeFooter>

          {/* Handles for connections */}
          {handles?.length > 0 &&
            handles.map((handleId) => (
              <Handle
                key={handleId}
                type='source'
                position={Position.Bottom}
                id={handleId}
                isConnectable={true}
                className='opacity-0'
              />
            ))}
        </EnhancedNodeContainer>
      </>
    )
  }
)

export {EnhancedUserInputNode}
