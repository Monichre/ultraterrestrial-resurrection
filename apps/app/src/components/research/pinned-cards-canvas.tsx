'use client'

import React, {useState, useCallback, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {type PinnedCard} from '@/contexts/research/research-context'
import {type ReactFlowNode} from '@/features/mindmap/actions/xata-to-xyflow'
import {cn} from '@/lib/utils'
import {
  Sparkles,
  Zap,
  Link,
  X,
  Camera,
  FileText,
  Calendar,
  MapPin,
  Brain,
  Target,
} from 'lucide-react'
import {useSmartResearchIntegration} from '@/features/mindmap/tours/hooks/use-smart-tour-integration'

interface PinnedCardsCanvasProps {
  pinnedCards: PinnedCard[]
  onUnpinCard: (cardId: string) => void
  onCardAnalyze?: (card: PinnedCard) => void
  onCardConnect?: (sourceCard: PinnedCard, targetCard: PinnedCard) => void
  onCardMove?: (cardId: string, position: {x: number; y: number}) => void
  onNodeDrop?: (node: ReactFlowNode, position: {x: number; y: number}) => void
  className?: string
  enableSmartAnalysis?: boolean
}

export function PinnedCardsCanvas({
  pinnedCards,
  onUnpinCard,
  onCardAnalyze,
  onCardConnect,
  onCardMove,
  onNodeDrop,
  enableSmartAnalysis = true,
  className,
}: PinnedCardsCanvasProps) {
  const [draggedCard, setDraggedCard] = useState<string | null>(null)
  const [connectionMode, setConnectionMode] = useState<{
    sourceCard: PinnedCard | null
    isActive: boolean
  }>({sourceCard: null, isActive: false})
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Smart integration for AI-powered canvas analysis
  const {
    researchSuggestions,
    spatialInsights,
    contextualIntelligence,
    applyResearchSuggestion,
    updateResearchState,
  } = useSmartResearchIntegration()

  // Update smart state when cards change
  React.useEffect(() => {
    if (enableSmartAnalysis) {
      updateResearchState({pinnedCards})
    }
  }, [pinnedCards, enableSmartAnalysis, updateResearchState])

  // Handle drop events from ReactFlow mindmap
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()

      try {
        const nodeData = e.dataTransfer.getData('application/reactflow-node')
        if (nodeData && canvasRef.current) {
          const node: ReactFlowNode = JSON.parse(nodeData)
          const rect = canvasRef.current.getBoundingClientRect()
          const position = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          }
          onNodeDrop?.(node, position)
        }
      } catch (error) {
        console.error('Error handling node drop:', error)
      }
    },
    [onNodeDrop]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleConnectionStart = useCallback((card: PinnedCard) => {
    setConnectionMode({sourceCard: card, isActive: true})
  }, [])

  const handleConnectionComplete = useCallback(
    (targetCard: PinnedCard) => {
      if (connectionMode.sourceCard && connectionMode.sourceCard.id !== targetCard.id) {
        onCardConnect?.(connectionMode.sourceCard, targetCard)
      }
      setConnectionMode({sourceCard: null, isActive: false})
    },
    [connectionMode.sourceCard, onCardConnect]
  )

  const handleConnectionCancel = useCallback(() => {
    setConnectionMode({sourceCard: null, isActive: false})
  }, [])

  return (
    <div
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        'relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        'border border-slate-700/50 rounded-lg overflow-hidden',
        connectionMode.isActive && 'cursor-crosshair',
        className
      )}
      onClick={connectionMode.isActive ? handleConnectionCancel : undefined}>
      {/* Background pattern */}
      <div className='absolute inset-0 opacity-10'>
        <svg width='100%' height='100%' className='h-full w-full'>
          <defs>
            <pattern id='research-grid' width='40' height='40' patternUnits='userSpaceOnUse'>
              <path
                d='M 40 0 L 0 0 0 40'
                fill='none'
                stroke='currentColor'
                strokeWidth='0.5'
                className='text-green-400'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#research-grid)' />
        </svg>
      </div>

      {/* Drop zone indicator when empty */}
      {pinnedCards.length === 0 && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <motion.div
            className='text-center space-y-4 p-8'
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}>
            <motion.div
              className='text-6xl'
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}>
              📌
            </motion.div>
            <div className='space-y-2'>
              <h3 className='text-xl font-semibold text-green-400'>Research Canvas</h3>
              <p className='text-slate-400 max-w-md text-sm'>
                Pin cards from your exploration to begin deep analysis. Connect entities, analyze
                relationships, and uncover patterns.
              </p>
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className='bg-green-500/20 border border-green-400/50 rounded-lg p-3 mt-4'>
                <p className='text-green-300 text-sm'>
                  Drag nodes from the mindmap to pin them here
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pinned cards */}
      <AnimatePresence>
        {pinnedCards.map((card) => (
          <PinnedResearchCard
            key={card.id}
            card={card}
            onRemove={() => onUnpinCard(card.id)}
            onAnalyze={() => onCardAnalyze?.(card)}
            onConnectionStart={() => handleConnectionStart(card)}
            onConnectionComplete={() => handleConnectionComplete(card)}
            onMove={(position) => onCardMove?.(card.id, position)}
            isConnectionSource={connectionMode.sourceCard?.id === card.id}
            isConnectionTarget={
              connectionMode.isActive && connectionMode.sourceCard?.id !== card.id
            }
            canConnect={connectionMode.isActive}
            isHovered={hoveredCard === card.id}
            onHover={(isHovered) => setHoveredCard(isHovered ? card.id : null)}
          />
        ))}
      </AnimatePresence>

      {/* Smart Analysis Overlay */}
      {enableSmartAnalysis && pinnedCards.length > 1 && spatialInsights.length > 0 && (
        <motion.div
          className='absolute top-4 right-4 bg-purple-900/80 backdrop-blur-sm border border-purple-400/50 rounded-lg p-3 shadow-lg max-w-xs'
          initial={{opacity: 0, x: 20}}
          animate={{opacity: 1, x: 0}}>
          <div className='flex items-center space-x-2 mb-2'>
            <Brain className='w-4 h-4 text-purple-400' />
            <span className='text-purple-300 text-sm font-medium'>Smart Analysis</span>
          </div>
          {spatialInsights.slice(0, 1).map((insight) => (
            <div key={insight.id} className='space-y-1'>
              <div className='text-purple-200 text-xs'>{insight.title}</div>
              <div className='text-purple-300/70 text-xs line-clamp-2'>{insight.summary}</div>
              <div className='flex items-center justify-between mt-2'>
                <span className='text-purple-400 text-xs'>
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
                <button
                  className='text-purple-400 hover:text-purple-300 text-xs'
                  onClick={() => console.log('Expand insight:', insight)}>
                  Expand →
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Smart Suggestions Overlay */}
      {enableSmartAnalysis && researchSuggestions.length > 0 && pinnedCards.length > 0 && (
        <motion.div
          className='absolute top-4 left-4 bg-blue-900/80 backdrop-blur-sm border border-blue-400/50 rounded-lg p-3 shadow-lg max-w-sm'
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}>
          <div className='flex items-center space-x-2 mb-2'>
            <Target className='w-4 h-4 text-blue-400' />
            <span className='text-blue-300 text-sm font-medium'>Research Suggestions</span>
          </div>
          <div className='space-y-2'>
            {researchSuggestions.slice(0, 2).map((suggestion) => (
              <div
                key={suggestion.id}
                className='bg-blue-800/50 rounded p-2 cursor-pointer hover:bg-blue-800/70 transition-colors'
                onClick={() => applyResearchSuggestion(suggestion.id)}>
                <div className='text-blue-200 text-xs font-medium'>{suggestion.title}</div>
                <div className='text-blue-300/70 text-xs mt-1 line-clamp-2'>
                  {suggestion.description}
                </div>
                <div className='text-blue-400 text-xs mt-1'>
                  {suggestion.type.replace('-', ' ')} • {Math.round(suggestion.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Canvas info overlay */}
      {pinnedCards.length > 0 && (
        <motion.div
          className='absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-2 shadow-lg'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}>
          <div className='flex items-center space-x-3 text-sm'>
            <div className='flex items-center space-x-1 text-green-400'>
              <span className='font-medium'>{pinnedCards.length}</span>
              <span>entities</span>
            </div>
            {enableSmartAnalysis && contextualIntelligence.entityNetworkStrength > 0 && (
              <>
                <div className='text-slate-400'>•</div>
                <div className='text-blue-400'>
                  {Math.round(contextualIntelligence.entityNetworkStrength * 100)}% connected
                </div>
              </>
            )}
            <div className='text-slate-400'>•</div>
            <div className='text-slate-300'>Research Canvas</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Individual pinned research card component
function PinnedResearchCard({
  card,
  onRemove,
  onAnalyze,
  onConnectionStart,
  onConnectionComplete,
  onMove,
  isConnectionSource,
  isConnectionTarget,
  canConnect,
  isHovered,
  onHover,
}: {
  card: PinnedCard
  onRemove: () => void
  onAnalyze?: () => void
  onConnectionStart: () => void
  onConnectionComplete: () => void
  onMove?: (position: {x: number; y: number}) => void
  isConnectionSource: boolean
  isConnectionTarget: boolean
  canConnect: boolean
  isHovered: boolean
  onHover: (isHovered: boolean) => void
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    await onAnalyze?.()
    setIsAnalyzing(false)
  }

  const isPolaroidStyle = card.type === 'personnel'

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: card.position.x,
        top: card.position.y,
        zIndex: isConnectionSource ? 1000 : isHovered ? 999 : 1,
      }}
      initial={{scale: 0, rotate: -10, opacity: 0}}
      animate={{
        scale: 1,
        rotate: isPolaroidStyle ? (Math.random() - 0.5) * 6 : 0,
        opacity: 1,
      }}
      exit={{scale: 0, rotate: 10, opacity: 0}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        opacity: {duration: 0.2},
      }}
      whileHover={{scale: 1.02, zIndex: 999}}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      className={cn(
        'cursor-pointer select-none',
        isConnectionSource && 'ring-2 ring-blue-400 ring-opacity-60',
        isConnectionTarget && 'ring-2 ring-green-400 ring-opacity-60',
        canConnect && 'hover:ring-2 hover:ring-yellow-400 hover:ring-opacity-60'
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (canConnect && isConnectionTarget) {
          onConnectionComplete()
        }
      }}>
      {isPolaroidStyle ? <PolaroidCard card={card} /> : <StandardCard card={card} />}

      {/* Action buttons overlay */}
      <AnimatePresence>
        {(isHovered || showActions) && (
          <motion.div
            className='absolute -top-2 -right-2 flex space-x-1'
            initial={{opacity: 0, scale: 0}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0}}>
            {onAnalyze && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAnalyze()
                }}
                className='bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg'
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                disabled={isAnalyzing}
                title='AI Analysis'>
                {isAnalyzing ? (
                  <motion.div
                    animate={{rotate: 360}}
                    transition={{duration: 1, repeat: Infinity, ease: 'linear'}}>
                    <Sparkles className='w-3 h-3' />
                  </motion.div>
                ) : (
                  <Zap className='w-3 h-3' />
                )}
              </motion.button>
            )}

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onConnectionStart()
              }}
              className='bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full shadow-lg'
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              title='Connect Entities'>
              <Link className='w-3 h-3' />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className='bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg'
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              title='Remove Card'>
              <X className='w-3 h-3' />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Polaroid-style card for personnel
function PolaroidCard({card}: {card: PinnedCard}) {
  return (
    <div className='bg-white rounded-sm shadow-xl border-8 border-white w-48 overflow-hidden'>
      {/* Photo area */}
      <div className='bg-gray-200 h-32 flex items-center justify-center relative'>
        {card.data?.photo ? (
          <img
            src={card.data.photo}
            alt={card.data?.name || 'Portrait'}
            className='w-full h-full object-cover'
          />
        ) : (
          <Camera className='w-8 h-8 text-gray-400' />
        )}
        {/* Significance indicator */}
        {card.data?.rank && (
          <div className='absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded'>
            #{card.data.rank}
          </div>
        )}
      </div>

      {/* Caption area */}
      <div className='p-3 space-y-1'>
        <h4 className='font-semibold text-gray-900 text-sm truncate'>
          {card.data?.name || card.data?.label || 'Unknown'}
        </h4>
        {card.data?.role && <p className='text-gray-600 text-xs truncate'>{card.data.role}</p>}

        {/* Metadata */}
        <div className='flex items-center justify-between text-xs text-gray-500 pt-1'>
          <span className='flex items-center space-x-1'>
            <Calendar className='w-3 h-3' />
            <span>{card.pinnedAt.toLocaleDateString()}</span>
          </span>
          {card.connectedRecords && card.connectedRecords.length > 0 && (
            <span className='bg-green-100 text-green-700 px-1 rounded'>
              {card.connectedRecords.length} links
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Standard card for other entity types
function StandardCard({card}: {card: PinnedCard}) {
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'events':
        return <Calendar className='w-4 h-4' />
      case 'organizations':
        return <MapPin className='w-4 h-4' />
      case 'documents':
        return <FileText className='w-4 h-4' />
      default:
        return <span className='w-4 h-4 rounded bg-current' />
    }
  }

  return (
    <div className='bg-slate-800 border border-slate-600 rounded-lg shadow-xl w-56 overflow-hidden'>
      {/* Header */}
      <div className='bg-gradient-to-r from-slate-700 to-slate-600 p-3'>
        <div className='flex items-center space-x-2'>
          <div className='text-green-400'>{getEntityIcon(card.type)}</div>
          <h4 className='font-semibold text-white text-sm truncate flex-1'>
            {card.data?.name || card.data?.label || 'Unknown'}
          </h4>
        </div>
      </div>

      {/* Content */}
      <div className='p-3 space-y-2'>
        <div className='text-xs text-slate-400'>
          {card.type} • {card.pinnedAt.toLocaleDateString()}
        </div>

        {card.aiAnalysis?.summary && (
          <p className='text-slate-300 text-xs line-clamp-3'>{card.aiAnalysis.summary}</p>
        )}

        {card.notes && (
          <div className='bg-slate-700/50 border-l-2 border-blue-400 pl-2 py-1'>
            <p className='text-blue-300 text-xs italic'>"{card.notes}"</p>
          </div>
        )}

        {/* Connections indicator */}
        {card.connectedRecords && card.connectedRecords.length > 0 && (
          <div className='flex items-center justify-between'>
            <span className='text-green-400 text-xs'>
              {card.connectedRecords.length} connections
            </span>
            {card.data?.rank && (
              <span className='bg-yellow-500/20 text-yellow-400 text-xs px-1 rounded'>
                Rank #{card.data.rank}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
