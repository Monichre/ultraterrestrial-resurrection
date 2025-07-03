'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Brain, MapPin, Clock, Users, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

// Import existing components to extend
import { EntityNode } from './entity-node'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'

/**
 * Enhanced Entity Node with Smart Tour Integration
 * - Uses existing EntityNode as base
 * - Adds contextual intelligence indicators
 * - Tour-specific smart badges
 * - Historical significance indicators
 * - Preserves ALL existing functionality
 */
export const EnhancedEntityNodePOC = memo<NodeProps>((props) => {
  const { getNodes } = useMindMap()
  
  // Get graph context for intelligent analysis
  const graphContext = getGraphContext(getNodes())
  const isContextual = graphContext && graphContext.connectedEntityTypes.has(props.data?.type)
  
  // Tour-specific analysis
  const isTourRelated = props.data?.addedDuringTour || props.data?.waypointId
  const isHistoricallySignificant = props.data?.historicalSignificance || isInHistoricalContext()
  const tourContext = graphContext?.tourContext
  
  function isInHistoricalContext(): boolean {
    if (!graphContext?.timelineBounds.earliest || !graphContext?.timelineBounds.latest) {
      return false
    }
    
    // Check if this node falls within the historical timeline
    const nodeYear = extractYearFromNodeData(props.data)
    if (!nodeYear) return false
    
    const contextStartYear = graphContext.timelineBounds.earliest.getFullYear()
    const contextEndYear = graphContext.timelineBounds.latest.getFullYear()
    
    return nodeYear >= contextStartYear && nodeYear <= contextEndYear
  }
  
  function extractYearFromNodeData(data: any): number | null {
    if (!data) return null
    
    // Try multiple date fields
    const dateFields = ['date', 'occurred_on', 'created_at', 'year']
    for (const field of dateFields) {
      const dateValue = data[field]
      if (dateValue) {
        const date = new Date(dateValue)
        if (!isNaN(date.getTime())) {
          return date.getFullYear()
        }
        // Try parsing as year directly
        const year = parseInt(dateValue.toString(), 10)
        if (year >= 1900 && year <= new Date().getFullYear()) {
          return year
        }
      }
    }
    return null
  }
  
  function getTourBadgeInfo(): { icon: React.ReactNode; text: string; color: string } | null {
    if (!tourContext || !isTourRelated) return null
    
    // Determine badge based on tour mode and historical significance
    if (tourContext.tourMode === 'guided') {
      if (isHistoricallySignificant) {
        return {
          icon: <Clock className="w-3 h-3" />,
          text: 'Historical',
          color: 'bg-amber-500/90'
        }
      } else {
        return {
          icon: <MapPin className="w-3 h-3" />,
          text: 'Tour',
          color: 'bg-blue-500/90'
        }
      }
    } else {
      return {
        icon: <Users className="w-3 h-3" />,
        text: 'Explored',
        color: 'bg-green-500/90'
      }
    }
  }
  
  function getEntityBadgeInfo(): { icon: React.ReactNode; text: string; color: string } | null {
    if (!props.data?.type) return null
    
    // Entity-specific badges based on type
    switch (props.data.type) {
      case 'personnel':
        return {
          icon: <Users className="w-3 h-3" />,
          text: 'Personnel',
          color: 'bg-purple-500/90'
        }
      case 'organizations':
        return {
          icon: <Building2 className="w-3 h-3" />,
          text: 'Org',
          color: 'bg-indigo-500/90'
        }
      case 'events':
        return {
          icon: <Clock className="w-3 h-3" />,
          text: 'Event',
          color: 'bg-red-500/90'
        }
      default:
        return null
    }
  }
  
  const tourBadge = getTourBadgeInfo()
  const entityBadge = getEntityBadgeInfo()

  return (
    <div className="relative">
      {/* Smart Contextual Intelligence Badge */}
      {isContextual && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-teal-500/90 text-white text-xs font-medium shadow-lg"
        >
          <Brain className="w-3 h-3" />
          Smart
        </motion.div>
      )}
      
      {/* Tour-Specific Badge */}
      {tourBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`absolute -top-2 -left-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full ${tourBadge.color} text-white text-xs font-medium shadow-lg`}
        >
          {tourBadge.icon}
          {tourBadge.text}
        </motion.div>
      )}
      
      {/* Entity Type Badge (bottom right) */}
      {entityBadge && !isContextual && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`absolute -bottom-2 -right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full ${entityBadge.color} text-white text-xs font-medium shadow-lg`}
        >
          {entityBadge.icon}
          {entityBadge.text}
        </motion.div>
      )}
      
      {/* Historical Significance Indicator */}
      {isHistoricallySignificant && tourContext && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 z-10 rounded-lg ring-2 ring-amber-400/50 ring-offset-2 ring-offset-gray-900 pointer-events-none"
        />
      )}
      
      {/* Tour Progress Indicator (for guided tours) */}
      {tourContext?.tourMode === 'guided' && props.data?.waypointId && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg"
        />
      )}
      
      {/* Existing EntityNode - unchanged */}
      <EntityNode {...props} />
    </div>
  )
})

EnhancedEntityNodePOC.displayName = 'EnhancedEntityNodePOC'