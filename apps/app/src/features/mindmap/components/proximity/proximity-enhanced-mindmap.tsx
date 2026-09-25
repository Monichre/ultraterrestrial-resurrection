'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactFlowProvider } from '@xyflow/react'
import { Brain, X, Minimize2, Maximize2 } from 'lucide-react'
import { ProximityAnalyzer } from './proximity-analyzer'
import { type ProximityAnalysisResult } from '@/features/mindmap/hooks/use-proximity-analysis'
import { cn } from '@/lib/utils'

interface ProximityEnhancedMindmapProps {
  children: React.ReactNode
  onCreateResearchSession?: (analysis: ProximityAnalysisResult) => void
  onConnectNodes?: (sourceId: string, targetId: string, reason: string) => void
  className?: string
}

export function ProximityEnhancedMindmap({
  children,
  onCreateResearchSession,
  onConnectNodes,
  className
}: ProximityEnhancedMindmapProps) {
  const [showAnalyzer, setShowAnalyzer] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  
  const handleCreateResearchSession = useCallback((analysis: ProximityAnalysisResult) => {
    // Create research session with the analyzed nodes
    console.log('Creating research session for analysis:', analysis)
    onCreateResearchSession?.(analysis)
  }, [onCreateResearchSession])
  
  const handleConnectNodes = useCallback((sourceId: string, targetId: string, reason: string) => {
    // Auto-connect nodes based on AI suggestion
    console.log('Auto-connecting nodes:', { sourceId, targetId, reason })
    onConnectNodes?.(sourceId, targetId, reason)
  }, [onConnectNodes])
  
  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Main mindmap content */}
      <ReactFlowProvider>
        {children}
      </ReactFlowProvider>
      
      {/* Proximity Analyzer Panel */}
      <AnimatePresence>
        {showAnalyzer && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: isMinimized ? 0.8 : 1
            }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-4 right-4 z-50"
          >
            <div className="relative">
              {/* Panel Header - Always visible */}
              <div className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-t-lg px-3 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">
                    Proximity AI
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 text-slate-400 hover:text-green-300 transition-colors"
                    title={isMinimized ? "Expand" : "Minimize"}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-3 h-3" />
                    ) : (
                      <Minimize2 className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowAnalyzer(false)}
                    className="p-1 text-slate-400 hover:text-red-300 transition-colors"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Panel Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ProximityAnalyzer
                      onCreateResearchSession={handleCreateResearchSession}
                      onConnectNodes={handleConnectNodes}
                      className="rounded-t-none border-t-0"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Show Analyzer Button (when hidden) */}
      <AnimatePresence>
        {!showAnalyzer && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowAnalyzer(true)}
            className="absolute top-4 right-4 z-50 p-3 bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-xl hover:bg-slate-800/95 transition-colors"
            title="Show Proximity Analysis"
          >
            <Brain className="w-5 h-5 text-green-400" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Proximity Indicators on Canvas */}
      <ProximityIndicators />
    </div>
  )
}

// Component to show visual proximity indicators on the canvas
function ProximityIndicators() {
  // This would connect to the proximity analysis hook to show visual indicators
  // between nodes that are in proximity
  return null // Placeholder for now
}