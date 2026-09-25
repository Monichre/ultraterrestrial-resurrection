'use client'

/**
 * Enhanced Entity Node - Wrapper for existing entity-specific card components
 * 
 * This component serves as a wrapper that connects to the existing card system
 * and displays entity-specific content using the renderEntity function.
 * 
 * When details are expanded, it shows the full entity-specific card implementation.
 * When collapsed, it shows a basic description.
 */

import { memo, useEffect, useState, useCallback, Suspense } from 'react'
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Brain } from 'lucide-react'

import {
  EnhancedNodeContainer,
  EnhancedNodeHeader,
  EnhancedNodeContent,
  EnhancedNodeFooter,
  EnhancedNodeStatus,
  QuickActions,
  ENTITY_COLORS
} from './enhanced-core-node-ui'

import { renderEntity } from '@/features/mindmap/components/cards/render-entity-card'

import { useEntity } from '@/hooks'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { Badge } from '@/components/ui/badge'

type EntityType = 'events' | 'personnel' | 'organizations' | 'testimonies' | 'documents' | 'topics'

interface EnhancedEntityNodeProps {
  id: string
  data: {
    type: EntityType
    handles?: string[]
    entities?: Array<{ data: { name: string } }>
    input?: string
    title?: string
    name?: string
    description?: string
    date?: string
    location?: string
    latitude?: number
    longitude?: number
    credibility?: number
    authority?: number
    rank?: number
    organization?: { name: string }
    witness?: { name: string }
    photos?: Array<{ url: string }>
    isContextual?: boolean
    contextInfo?: string
    [key: string]: any
  }
  selected?: boolean
}

const EnhancedEntityNode = memo<EnhancedEntityNodeProps>(function EnhancedEntityNode(props) {
  const { id, data, selected = false } = props
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles] = useState<string[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { getNodes } = useMindMap()

  // Determine if this node is part of a contextual graph
  const graphContext = getGraphContext(getNodes())
  const isContextualNode = data.isContextual || (graphContext && graphContext.connectedEntityTypes.has(data.type))

  const {
    entity,
    saveNote,
    updateNote,
    userNote,
    connectionListConnections,
    handleHoverEnter,
    findConnections,
  } = useEntity({
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

  // Prepare entity data for display - let the existing card system handle specifics
  const entityData = {
    title: data.title || data.name || 'Unknown Entity',
    subtitle: data.description ? `${data.description.slice(0, 60)}...` : `${data.type} Record`,
    avatar: data.photos?.[0]?.url,
    date: data.date ? format(new Date(data.date), 'MMM dd, yyyy') : undefined,
    location: data.location,
    credibilityScore: data.credibility || data.authority || data.rank,
  }
  const connectionCount = connectionListConnections?.length || 0

  const handleViewDetails = useCallback(() => {
    setShowDetails(!showDetails)
  }, [showDetails])

  const handleAddToResearch = useCallback(() => {
    // Integration with research canvas
    console.log('Adding to research canvas:', { id, data })
  }, [id, data])

  const handleAskAI = useCallback(() => {
    // Trigger AI analysis
    console.log('Asking AI about:', entityData.title)
  }, [entityData.title])

  const handleConnect = useCallback(() => {
    findConnections()
  }, [findConnections])

  return (
    <>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <EnhancedNodeContainer
        id={id}
        entityType={data.type}
        isSelected={selected}
        isContextual={isContextualNode}
        isHovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <EnhancedNodeHeader
          title={entityData.title}
          subtitle={entityData.subtitle}
          entityType={data.type}
          date={entityData.date}
          location={entityData.location}
          avatar={entityData.avatar}
          isContextual={isContextualNode}
        />

        <EnhancedNodeContent scrollable={showDetails}>
          {/* Contextual info badge */}
          {isContextualNode && data.contextInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3"
            >
              <Badge 
                variant="outline" 
                className="text-xs border-teal-500/30 bg-teal-500/10 text-teal-300"
              >
                <Brain className="w-3 h-3 mr-1" />
                {data.contextInfo}
              </Badge>
            </motion.div>
          )}

          {/* Entity content using existing card system */}
          <div className="space-y-3">
            {showDetails ? (
              // When details are shown, use the existing entity-specific card system
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-60 overflow-y-auto">
                    <Suspense fallback={<div className="text-sm text-white/60">Loading entity details...</div>}>
                      {renderEntity({ 
                        type: data.type as any, 
                        data: { ...data, id } // Pass complete data to existing card system
                      })}
                    </Suspense>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              // When collapsed, show basic description only
              data.description && (
                <p className="text-sm text-white/80 leading-relaxed">
                  {`${data.description.slice(0, 120)}${data.description.length > 120 ? '...' : ''}`}
                </p>
              )
            )}
          </div>
        </EnhancedNodeContent>

        <EnhancedNodeFooter entityType={data.type} isContextual={isContextualNode}>
          <EnhancedNodeStatus
            type={data.type}
            isContextual={isContextualNode}
            connectionCount={connectionCount}
            credibilityScore={entityData.credibilityScore}
          />

          <QuickActions
            onViewDetails={handleViewDetails}
            onAddToResearch={handleAddToResearch}
            onAskAI={handleAskAI}
            onConnect={connectionCount > 0 ? handleConnect : undefined}
          />
        </EnhancedNodeFooter>

        {/* Handles for connections */}
        {handles?.length > 0 &&
          handles.map((handleId) => (
            <Handle
              key={handleId}
              type="source"
              position={Position.Bottom}
              id={handleId}
              isConnectable={true}
              className="opacity-0"
            />
          ))}
      </EnhancedNodeContainer>
    </>
  )
})

export { EnhancedEntityNode }