'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Brain, MapPin, Clock, Users, Building2, Plus, Sparkles, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Import existing components to extend
import { EntityNode } from './entity-node'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { NodeConnectionOverlay } from '@/features/mindmap/components/node-connection-overlay'

// Helper functions moved outside component for better performance
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

function isInHistoricalContext(data: any, graphContext: any): boolean {
  if (!graphContext?.timelineBounds.earliest || !graphContext?.timelineBounds.latest) {
    return false
  }
  
  // Check if this node falls within the historical timeline
  const nodeYear = extractYearFromNodeData(data)
  if (!nodeYear) return false
  
  const contextStartYear = graphContext.timelineBounds.earliest.getFullYear()
  const contextEndYear = graphContext.timelineBounds.latest.getFullYear()
  
  return nodeYear >= contextStartYear && nodeYear <= contextEndYear
}

/**
 * Enhanced Entity Node with Smart Tour Integration
 * - Uses existing EntityNode as base
 * - Adds contextual intelligence indicators
 * - Tour-specific smart badges
 * - Historical significance indicators
 * - Preserves ALL existing functionality
 * - Optimized for performance with memoization
 */
export const EnhancedEntityNodePOC = memo<NodeProps>((props) => {
  const { getNodes } = useMindMap()
  const [showConnectionOverlay, setShowConnectionOverlay] = useState(false)
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 })
  
  // Memoize expensive calculations
  const graphContext = useMemo(() => getGraphContext(getNodes()), [getNodes])
  
  const nodeAnalysis = useMemo(() => ({
    isContextual: graphContext && graphContext.connectedEntityTypes.has(props.data?.type),
    isTourRelated: props.data?.addedDuringTour || props.data?.waypointId,
    isHistoricallySignificant: props.data?.historicalSignificance || extractYearFromNodeData(props.data) !== null && isInHistoricalContext(props.data, graphContext),
    tourContext: graphContext?.tourContext,
    nodeYear: extractYearFromNodeData(props.data)
  }), [props.data, graphContext])
  
  // Memoized badge configurations for better performance
  const tourBadge = useMemo((): { icon: React.ReactNode; text: string; color: string } | null => {
    if (!nodeAnalysis.tourContext || !nodeAnalysis.isTourRelated) return null
    
    // Determine badge based on tour mode and historical significance
    if (nodeAnalysis.tourContext.tourMode === 'guided') {
      if (nodeAnalysis.isHistoricallySignificant) {
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
  }, [nodeAnalysis])

  const entityBadge = useMemo((): { icon: React.ReactNode; text: string; color: string } | null => {
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
      case 'documents':
        return {
          icon: <Target className="w-3 h-3" />,
          text: 'Doc',
          color: 'bg-orange-500/90'
        }
      case 'topics':
        return {
          icon: <Sparkles className="w-3 h-3" />,
          text: 'Topic',
          color: 'bg-pink-500/90'
        }
      default:
        return null
    }
  }, [props.data?.type])
  
  const handleConnectionClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    setOverlayPosition({
      x: rect.right + 10,
      y: rect.top
    })
    setShowConnectionOverlay(true)
  }, [])

  const handleAddConnection = useCallback((suggestionId: string) => {
    // Logic to add suggested connection to graph
    console.log('Adding connection:', suggestionId, 'to node:', props.id)
    setShowConnectionOverlay(false)
  }, [props.id])

  // Enhanced animation variants for better user experience
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.6, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  }

  const ringVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      } 
    }
  }

  return (
    <div className="relative">
      {/* Smart Contextual Intelligence Badge */}
      <AnimatePresence>
        {nodeAnalysis.isContextual && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover="hover"
            className="absolute -top-2 -right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-teal-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg ring-1 ring-white/20"
          >
            <Brain className="w-3 h-3" />
            Smart
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tour-Specific Badge */}
      <AnimatePresence>
        {tourBadge && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover="hover"
            className={`absolute -top-2 -left-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full ${tourBadge.color} backdrop-blur-sm text-white text-xs font-medium shadow-lg ring-1 ring-white/20`}
          >
            {tourBadge.icon}
            {tourBadge.text}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Entity Type Badge (bottom right) */}
      <AnimatePresence>
        {entityBadge && !nodeAnalysis.isContextual && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover="hover"
            className={`absolute -bottom-2 -right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full ${entityBadge.color} backdrop-blur-sm text-white text-xs font-medium shadow-lg ring-1 ring-white/20`}
          >
            {entityBadge.icon}
            {entityBadge.text}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Historical Significance Indicator */}
      <AnimatePresence>
        {nodeAnalysis.isHistoricallySignificant && nodeAnalysis.tourContext && (
          <motion.div
            variants={ringVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 z-10 rounded-lg ring-2 ring-amber-400/60 ring-offset-2 ring-offset-gray-900 pointer-events-none backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>
      
      {/* Tour Progress Indicator (for guided tours) */}
      <AnimatePresence>
        {nodeAnalysis.tourContext?.tourMode === 'guided' && props.data?.waypointId && (
          <motion.div
            initial={{ opacity: 0, x: -15, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -15, scale: 0.8 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut",
              delay: 0.2 
            }}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg ring-1 ring-blue-300/30"
          />
        )}
      </AnimatePresence>
      
      {/* Smart Connection Button */}
      <AnimatePresence>
        {nodeAnalysis.isContextual && (
          <motion.button
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnectionClick}
            className="absolute -bottom-2 -left-2 z-20 w-6 h-6 bg-teal-500 hover:bg-teal-400 rounded-full flex items-center justify-center shadow-lg transition-colors ring-1 ring-teal-300/30 backdrop-blur-sm"
          >
            <Plus className="w-3 h-3 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Existing EntityNode - unchanged */}
      <EntityNode {...props} />

      {/* Connection Overlay */}
      <NodeConnectionOverlay
        nodeId={props.id}
        position={overlayPosition}
        visible={showConnectionOverlay}
        onClose={() => setShowConnectionOverlay(false)}
        onAddConnection={handleAddConnection}
      />
    </div>
  )
})

EnhancedEntityNodePOC.displayName = 'EnhancedEntityNodePOC'