'use client'

import { memo, useEffect, useState, useCallback, Suspense } from 'react'
import { Handle, Position, useNodesData, useUpdateNodeInternals } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Star, 
  Eye, 
  Brain, 
  Sparkles,
  Calendar,
  Building,
  UserCheck,
  Shield,
  Globe,
  TrendingUp
} from 'lucide-react'

import {
  EnhancedNodeContainer,
  EnhancedNodeHeader,
  EnhancedNodeContent,
  EnhancedNodeFooter,
  EnhancedNodeStatus,
  QuickActions,
  DataPoint,
  DataGrid,
  ENTITY_COLORS
} from './enhanced-core-node-ui'

import { useEntity } from '@/hooks'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

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

  // Extract and format data based on entity type
  const getEntitySpecificData = useCallback(() => {
    const baseData = {
      title: data.title || data.name || 'Unknown',
      subtitle: '',
      avatar: data.photos?.[0]?.url,
      date: data.date ? format(new Date(data.date), 'MMM dd, yyyy') : undefined,
      location: data.location,
      credibilityScore: data.credibility || data.authority || data.rank,
    }

    switch (data.type) {
      case 'events':
        return {
          ...baseData,
          subtitle: data.description ? `${data.description.slice(0, 60)}...` : 'UFO Event',
          details: (
            <DataGrid>
              <DataPoint 
                label="Date" 
                value={baseData.date || 'Unknown'} 
                icon={<Calendar className="w-3 h-3" />} 
              />
              <DataPoint 
                label="Location" 
                value={data.location || 'Unknown'} 
                icon={<MapPin className="w-3 h-3" />} 
              />
              {data.latitude && data.longitude && (
                <div className="col-span-2">
                  <DataPoint 
                    label="Coordinates" 
                    value={`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`} 
                    icon={<Globe className="w-3 h-3" />} 
                  />
                </div>
              )}
            </DataGrid>
          )
        }

      case 'personnel':
        return {
          ...baseData,
          subtitle: data.role || 'Key Figure',
          details: (
            <DataGrid>
              <DataPoint 
                label="Role" 
                value={data.role || 'Unknown'} 
                icon={<UserCheck className="w-3 h-3" />} 
              />
              {data.organization?.name && (
                <DataPoint 
                  label="Organization" 
                  value={data.organization.name} 
                  icon={<Building className="w-3 h-3" />} 
                />
              )}
              {data.credibility && (
                <div className="col-span-2">
                  <div className="text-xs text-white/60 uppercase tracking-wide mb-1">Credibility</div>
                  <div className="flex items-center gap-2">
                    <Progress value={data.credibility * 10} className="flex-1" />
                    <span className="text-sm text-white">{data.credibility}/10</span>
                  </div>
                </div>
              )}
            </DataGrid>
          )
        }

      case 'organizations':
        return {
          ...baseData,
          subtitle: data.specialization || 'Organization',
          details: (
            <DataGrid>
              <DataPoint 
                label="Type" 
                value={data.specialization || 'Government'} 
                icon={<Building className="w-3 h-3" />} 
              />
              <DataPoint 
                label="Classification" 
                value="Classified" 
                icon={<Shield className="w-3 h-3" />} 
              />
            </DataGrid>
          )
        }

      case 'testimonies':
        return {
          ...baseData,
          subtitle: data.witness?.name ? `Testimony by ${data.witness.name}` : 'Witness Testimony',
          details: (
            <DataGrid>
              {data.witness?.name && (
                <DataPoint 
                  label="Witness" 
                  value={data.witness.name} 
                  icon={<UserCheck className="w-3 h-3" />} 
                />
              )}
              <DataPoint 
                label="Date" 
                value={baseData.date || 'Unknown'} 
                icon={<Calendar className="w-3 h-3" />} 
              />
              {data.organization?.name && (
                <div className="col-span-2">
                  <DataPoint 
                    label="Organization" 
                    value={data.organization.name} 
                    icon={<Building className="w-3 h-3" />} 
                  />
                </div>
              )}
            </DataGrid>
          )
        }

      case 'documents':
        return {
          ...baseData,
          subtitle: data.author ? `Document by ${data.author}` : 'Classified Document',
          details: (
            <DataGrid>
              <DataPoint 
                label="Author" 
                value={data.author || 'Classified'} 
                icon={<UserCheck className="w-3 h-3" />} 
              />
              <DataPoint 
                label="Classification" 
                value="SECRET" 
                icon={<Shield className="w-3 h-3" />} 
              />
            </DataGrid>
          )
        }

      case 'topics':
        return {
          ...baseData,
          subtitle: 'Research Topic',
          details: (
            <DataGrid>
              <DataPoint 
                label="Category" 
                value="UFO Research" 
                icon={<TrendingUp className="w-3 h-3" />} 
              />
              <DataPoint 
                label="Status" 
                value="Active" 
                icon={<Eye className="w-3 h-3" />} 
              />
            </DataGrid>
          )
        }

      default:
        return baseData
    }
  }, [data])

  const entityData = getEntitySpecificData()
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

          {/* Main content */}
          <div className="space-y-3">
            {data.description && (
              <p className="text-sm text-white/80 leading-relaxed">
                {showDetails 
                  ? data.description 
                  : `${data.description.slice(0, 120)}${data.description.length > 120 ? '...' : ''}`
                }
              </p>
            )}

            {/* Entity-specific details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {entityData.details}
                </motion.div>
              )}
            </AnimatePresence>
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