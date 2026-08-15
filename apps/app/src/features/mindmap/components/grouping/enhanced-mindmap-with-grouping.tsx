'use client'

import React, { useCallback, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Users, Settings, Eye, EyeOff } from 'lucide-react'
import { SpatialGroupingOverlay } from './spatial-grouping-overlay'
import { ProximityAnalyzer } from '../proximity/proximity-analyzer'
import { type SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'
import { type ProximityAnalysisResult } from '@/features/mindmap/hooks/use-proximity-analysis'
import { cn } from '@/lib/utils'

interface EnhancedMindmapWithGroupingProps {
  children: React.ReactNode
  onCreateResearchSession?: (source: SpatialGroup | ProximityAnalysisResult) => void
  onConnectNodes?: (sourceId: string, targetId: string, reason: string) => void
  onGroupAction?: (action: string, group: SpatialGroup) => void
  className?: string
}

export function EnhancedMindmapWithGrouping({
  children,
  onCreateResearchSession,
  onConnectNodes,
  onGroupAction,
  className
}: EnhancedMindmapWithGroupingProps) {
  const [showProximityAnalyzer, setShowProximityAnalyzer] = useState(true)
  const [showGroupingOverlay, setShowGroupingOverlay] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  
  // Handle research session creation from different sources
  const handleCreateResearchSession = useCallback((source: SpatialGroup | ProximityAnalysisResult) => {
    console.log('Creating research session from:', source)
    onCreateResearchSession?.(source)
  }, [onCreateResearchSession])
  
  // Handle group-specific research session creation
  const handleGroupResearchSession = useCallback((group: SpatialGroup) => {
    handleCreateResearchSession(group)
  }, [handleCreateResearchSession])
  
  // Handle proximity analysis research session creation
  const handleProximityResearchSession = useCallback((analysis: ProximityAnalysisResult) => {
    handleCreateResearchSession(analysis)
  }, [handleCreateResearchSession])
  
  // Handle group analysis
  const handleAnalyzeGroup = useCallback((group: SpatialGroup) => {
    console.log('Analyzing group:', group)
    // Could trigger additional AI analysis on the group
    onGroupAction?.('analyze', group)
  }, [onGroupAction])
  
  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Main mindmap content */}
      <ReactFlowProvider>
        {children}
        
        {/* Spatial Grouping Overlay */}
        {showGroupingOverlay && (
          <SpatialGroupingOverlay
            onCreateResearchSession={handleGroupResearchSession}
            onAnalyzeGroup={handleAnalyzeGroup}
            onGroupAction={onGroupAction}
          />
        )}
      </ReactFlowProvider>
      
      {/* Proximity Analyzer Panel */}
      <AnimatePresence>
        {showProximityAnalyzer && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-4 right-4 z-50"
          >
            <ProximityAnalyzer
              onCreateResearchSession={handleProximityResearchSession}
              onConnectNodes={onConnectNodes}
              className="max-w-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-50 space-y-2">
        {/* Main Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-2 space-y-2"
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Brain className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-green-300">AI Intelligence</span>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 text-slate-400 hover:text-green-300 transition-colors"
              title="Settings"
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setShowProximityAnalyzer(!showProximityAnalyzer)}
              className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors',
                showProximityAnalyzer
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 hover:text-green-300'
              )}
              title="Toggle Proximity Analysis"
            >
              {showProximityAnalyzer ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Proximity</span>
            </button>
            
            <button
              onClick={() => setShowGroupingOverlay(!showGroupingOverlay)}
              className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors',
                showGroupingOverlay
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 hover:text-green-300'
              )}
              title="Toggle Group Visualization"
            >
              {showGroupingOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Groups</span>
            </button>
          </div>
        </motion.div>
        
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-3 overflow-hidden"
            >
              <h4 className="text-sm font-medium text-green-300 mb-3">Intelligence Settings</h4>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Proximity Threshold</label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    defaultValue="150"
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-slate-500 text-xs mt-1">
                    <span>Close</span>
                    <span>Far</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-400 mb-1">Analysis Delay</label>
                  <input
                    type="range"
                    min="1000"
                    max="5000"
                    defaultValue="2000"
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-slate-500 text-xs mt-1">
                    <span>1s</span>
                    <span>5s</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-slate-400">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-3 h-3 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                    />
                    <span>Auto-create persistent groups</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-slate-400">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-3 h-3 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                    />
                    <span>Show connection suggestions</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-slate-400">
                    <input
                      type="checkbox"
                      className="w-3 h-3 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                    />
                    <span>Auto-collapse large groups</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Status Indicators */}
      <div className="absolute bottom-4 right-4 z-40">
        <div className="flex flex-col space-y-2">
          {/* AI Activity Indicator */}
          <motion.div
            className="bg-slate-900/90 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center space-x-2 text-xs">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-green-300">AI Intelligence Active</span>
            </div>
          </motion.div>
          
          {/* Feature Status */}
          <div className="bg-slate-900/90 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Proximity Analysis</span>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  showProximityAnalyzer ? 'bg-green-400' : 'bg-slate-600'
                )} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Spatial Grouping</span>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  showGroupingOverlay ? 'bg-green-400' : 'bg-slate-600'
                )} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 z-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-slate-900/90 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2"
        >
          <div className="text-xs text-slate-400">
            <div className="flex items-center space-x-2 mb-1">
              <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">G</kbd>
              <span>Toggle groups</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">P</kbd>
              <span>Toggle proximity</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Keyboard shortcuts hook
function useKeyboardShortcuts(
  onToggleProximity: () => void,
  onToggleGrouping: () => void
) {
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return // Don't trigger shortcuts when typing in inputs
      }
      
      switch (event.key.toLowerCase()) {
        case 'g':
          onToggleGrouping()
          break
        case 'p':
          onToggleProximity()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onToggleProximity, onToggleGrouping])
}