'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Brain } from 'lucide-react'
import { motion } from 'framer-motion'

// Import existing components to extend
import { EntityNode } from './entity-node'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'

/**
 * Minimal POC: Enhanced Entity Node
 * - Uses existing EntityNode as base
 * - Adds contextual intelligence indicator
 * - Preserves ALL existing functionality
 */
export const EnhancedEntityNodePOC = memo<NodeProps>((props) => {
  const { getNodes } = useMindMap()
  
  // Check if this node is contextual
  const graphContext = getGraphContext(getNodes())
  const isContextual = graphContext && graphContext.connectedEntityTypes.has(props.data?.type)

  return (
    <div className="relative">
      {/* Contextual indicator overlay */}
      {isContextual && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-teal-500/90 text-white text-xs font-medium"
        >
          <Brain className="w-3 h-3" />
          Smart
        </motion.div>
      )}
      
      {/* Existing EntityNode - unchanged */}
      <EntityNode {...props} />
    </div>
  )
})

EnhancedEntityNodePOC.displayName = 'EnhancedEntityNodePOC'