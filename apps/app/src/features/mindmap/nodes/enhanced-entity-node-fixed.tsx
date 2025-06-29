'use client'

import { memo, useEffect, useState, useCallback } from 'react'
import { Handle, Position, useNodesData, useUpdateNodeInternals, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Brain, Clock, MapPin, Users, Star, Building, UserCheck } from 'lucide-react'

// Import existing core components to extend them
import {
  CoreNodeBottom,
  CoreNodeContainer,  
  CoreNodeContent,
  CoreNodeTop,
} from '@/features/mindmap/nodes/core-node-ui'

import { useEntity } from '@/hooks'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { AddNote } from '@/components/note/AddNote'
import { AiStarIcon } from '@/components/icons'
import { cn } from '@/utils'

// Extend the existing EntityNode data interface
interface EnhancedEntityData {
  type: string
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

// Simple enhancement to existing styling
const EntityTypeColors = {
  events: 'border-blue-500/30 bg-blue-500/5',
  personnel: 'border-green-500/30 bg-green-500/5', 
  organizations: 'border-purple-500/30 bg-purple-500/5',
  testimonies: 'border-amber-500/30 bg-amber-500/5',
  documents: 'border-red-500/30 bg-red-500/5',
  topics: 'border-cyan-500/30 bg-cyan-500/5',
}

const ContextualIndicator = ({ isContextual, contextInfo }: { isContextual?: boolean, contextInfo?: string }) => {
  if (!isContextual) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1 px-2 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 mb-2"
    >
      <Brain className="w-3 h-3 text-teal-400" />
      <span className="text-xs text-teal-300">Contextual</span>
    </motion.div>
  )
}

const EntityMetadata = ({ data }: { data: EnhancedEntityData }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy')
    } catch {
      return dateStr
    }
  }

  const credibilityScore = data.credibility || data.authority || data.rank

  return (
    <div className="space-y-2 text-xs text-white/70">
      {data.date && (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(data.date)}</span>
        </div>
      )}
      
      {data.location && (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{data.location}</span>
        </div>
      )}
      
      {data.organization?.name && (
        <div className="flex items-center gap-1">
          <Building className="w-3 h-3" />
          <span className="truncate">{data.organization.name}</span>
        </div>
      )}
      
      {data.witness?.name && (
        <div className="flex items-center gap-1">
          <UserCheck className="w-3 h-3" />
          <span className="truncate">{data.witness.name}</span>
        </div>
      )}
      
      {credibilityScore && (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400" />
          <span>{credibilityScore}/10</span>
        </div>
      )}
    </div>
  )
}

// Fixed Enhanced Entity Node that properly extends existing node
export const EnhancedEntityNodeFixed = memo<NodeProps>((props) => {
  const { id, data: rawData } = props
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles] = useState<string[]>([])
  const { getNodes } = useMindMap()

  // Type the data properly
  const data = rawData as EnhancedEntityData

  // Determine contextual status
  const graphContext = getGraphContext(getNodes())
  const isContextual = data.isContextual || (graphContext && graphContext.connectedEntityTypes.has(data.type))

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

  // Get entity type specific styling
  const entityTypeClass = EntityTypeColors[data.type as keyof typeof EntityTypeColors] || EntityTypeColors.events

  return (
    <>
      <Handle type="target" position={Position.Top} />
      
      <CoreNodeContainer
        className={cn(
          'motion-opacity-in-0 min-w-[280px] w-content core-node-container overflow-visible',
          entityTypeClass,
          isContextual && 'ring-1 ring-teal-500/30'
        )}
        id={id}
      >
        <CoreNodeTop>
          <div className="flex justify-between w-full items-center">
            <div className="flex-1">
              <ContextualIndicator isContextual={isContextual} contextInfo={data.contextInfo} />
              
              <h3 className="text-sm font-semibold text-white mb-1 truncate">
                {data.title || data.name || 'Unknown'}
              </h3>
              
              {data.description && (
                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {data.description.slice(0, 100)}
                  {data.description.length > 100 && '...'}
                </p>
              )}
            </div>
            
            {data.photos?.[0]?.url && (
              <div className="ml-3 w-12 h-12 rounded-lg overflow-hidden border border-white/20">
                <img 
                  src={data.photos[0].url} 
                  alt={data.title || data.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </CoreNodeTop>

        <CoreNodeContent className="min-h-[60px]">
          <EntityMetadata data={data} />
          
          {isContextual && data.contextInfo && (
            <div className="mt-2 text-xs text-teal-300/80 italic">
              {data.contextInfo}
            </div>
          )}
        </CoreNodeContent>

        <CoreNodeBottom>
          <div className="flex items-center gap-1 rounded-full py-1 pl-2 pr-2.5 bg-neutral-800 text-neutral-400">
            <div className="size-5">
              <span className="relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  transform: 'translateX(0px)',
                }}
              >
                <AiStarIcon stroke={'#fff'} className="w-4 h-4 stroke-1" />
              </span>
            </div>
            <span className="text-neutral-400" />
          </div>

          <span className="flex items-center gap-1">
            <AddNote saveNote={saveNote} popover={false} />
            {connectionListConnections && connectionListConnections.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/60">
                <Users className="w-3 h-3" />
                <span>{connectionListConnections.length}</span>
              </div>
            )}
          </span>
        </CoreNodeBottom>

        {/* Preserve existing handles functionality */}
        {handles?.length > 0 &&
          handles.map((handleId) => (
            <Handle
              key={handleId}
              type="source"
              position={Position.Bottom}
              id={handleId}
              isConnectable={true}
            />
          ))}
      </CoreNodeContainer>
    </>
  )
})

EnhancedEntityNodeFixed.displayName = 'EnhancedEntityNodeFixed'