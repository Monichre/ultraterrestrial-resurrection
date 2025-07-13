'use client'

import React, { useCallback, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, MapPin, Clock, Settings, Maximize2, Minimize2 } from 'lucide-react'
import { EnhancedMindmapWithGrouping } from './grouping/enhanced-mindmap-with-grouping'
import { HistoricalTourNavigation } from '../tours/components/historical-tour-navigation'
import { useEnhancedTourController } from '../tours/hooks/use-enhanced-tour-controller'
import { type SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'
import { type ProximityAnalysisResult } from '@/features/mindmap/hooks/use-proximity-analysis'
import { cn } from '@/lib/utils'

interface EnhancedMindmapWithTourIntegrationProps {
  children: React.ReactNode
  onCreateResearchSession?: (source: SpatialGroup | ProximityAnalysisResult) => void
  onConnectNodes?: (sourceId: string, targetId: string, reason: string) => void
  onGroupAction?: (action: string, group: SpatialGroup) => void
  className?: string
}

type ViewMode = 'default' | 'tour-focused' | 'spatial-focused' | 'fullscreen'

export function EnhancedMindmapWithTourIntegration({
  children,
  onCreateResearchSession,
  onConnectNodes,
  onGroupAction,
  className
}: EnhancedMindmapWithTourIntegrationProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('default')
  const [tourCollapsed, setTourCollapsed] = useState(false)
  const [currentTourMode, setCurrentTourMode] = useState<'guided' | 'free-form' | null>(null)
  const [showSpatialOverlay, setShowSpatialOverlay] = useState(true)
  
  // Enhanced tour controller for layout intelligence
  const { 
    currentLayout, 
    isLayoutUpdating, 
    enhancementLevel,
    applyIntelligentLayout,
    undoLayout,
    redoLayout,
    canUndo,
    canRedo 
  } = useEnhancedTourController({
    spatialConfig: {
      enableAutoGrouping: true,
      enableNarrativeGrouping: true,
      autoSuggestConnections: true,
      spatialProximityThreshold: 200
    },
    layoutConfig: {
      storyflowDirection: 'chronological',
      temporalAlignment: {
        enforceChronology: true,
        timelineAxis: 'horizontal',
        yearSpacing: 150
      }
    },
    autoLayout: {
      enableIntelligentPositioning: true,
      repositionOnWaypointChange: true,
      animateLayoutTransitions: true,
      preserveUserPositions: false
    }
  })
  
  // Handle tour mode changes
  const handleTourModeChange = useCallback((mode: 'guided' | 'free-form' | null) => {
    setCurrentTourMode(mode)
    
    if (mode === 'guided') {
      setViewMode('tour-focused')
      setTourCollapsed(false)
    } else if (mode === 'free-form') {
      setViewMode('spatial-focused')
      setShowSpatialOverlay(true)
    } else {
      setViewMode('default')
    }
  }, [])
  
  // Handle research session creation with tour context
  const handleCreateResearchSession = useCallback((source: SpatialGroup | ProximityAnalysisResult) => {
    console.log('Creating research session with tour context:', {
      source,
      tourMode: currentTourMode,
      viewMode
    })
    
    // Add tour context to research session creation
    onCreateResearchSession?.(source)
  }, [onCreateResearchSession, currentTourMode, viewMode])
  
  // Handle spatial group actions with tour awareness
  const handleGroupAction = useCallback((action: string, group: SpatialGroup) => {
    console.log('Group action with tour context:', {
      action,
      group: group.id,
      tourMode: currentTourMode
    })
    
    onGroupAction?.(action, group)
  }, [onGroupAction, currentTourMode])
  
  // Toggle view modes
  const toggleViewMode = useCallback(() => {
    const modeSequence: ViewMode[] = ['default', 'tour-focused', 'spatial-focused']
    const currentIndex = modeSequence.indexOf(viewMode)
    const nextIndex = (currentIndex + 1) % modeSequence.length
    setViewMode(modeSequence[nextIndex])
  }, [viewMode])
  
  const toggleFullscreen = useCallback(() => {
    setViewMode(viewMode === 'fullscreen' ? 'default' : 'fullscreen')
  }, [viewMode])
  
  // Layout controls
  const handleApplyLayout = useCallback(() => {
    applyIntelligentLayout(true)
  }, [applyIntelligentLayout])
  
  // Enhanced keyboard shortcuts
  useEnhancedKeyboardShortcuts(
    toggleViewMode,
    toggleFullscreen,
    () => setTourCollapsed(!tourCollapsed),
    handleApplyLayout,
    undoLayout,
    redoLayout,
    canUndo,
    canRedo
  )
  
  // Calculate layout classes based on view mode
  const getLayoutClasses = () => {
    switch (viewMode) {
      case 'tour-focused':
        return {
          container: 'grid grid-cols-1 lg:grid-cols-3 gap-4 h-full',
          mindmap: 'lg:col-span-2 h-full',
          sidebar: 'lg:col-span-1 h-full overflow-y-auto',
          tourPosition: 'relative',
          tourSize: 'h-full'
        }
      
      case 'spatial-focused':
        return {
          container: 'relative h-full',
          mindmap: 'h-full',
          sidebar: 'absolute top-4 right-4 z-50 w-80',
          tourPosition: 'absolute bottom-4 right-4 z-50',
          tourSize: 'w-96'
        }
      
      case 'fullscreen':
        return {
          container: 'fixed inset-0 z-50 bg-slate-900',
          mindmap: 'h-full',
          sidebar: 'absolute top-4 right-4 z-50 w-80',
          tourPosition: 'absolute top-4 left-4 z-50',
          tourSize: 'w-96'
        }
      
      default:
        return {
          container: 'relative h-full',
          mindmap: 'h-full',
          sidebar: 'absolute top-4 right-4 z-50 w-80',
          tourPosition: 'absolute bottom-4 left-4 z-50',
          tourSize: 'w-96'
        }
    }
  }
  
  const layout = getLayoutClasses()
  
  return (
    <div className={cn(layout.container, className)}>
      {/* Main Mindmap Area */}
      <div className={layout.mindmap}>
        <ReactFlowProvider>
          <EnhancedMindmapWithGrouping
            onCreateResearchSession={handleCreateResearchSession}
            onConnectNodes={onConnectNodes}
            onGroupAction={handleGroupAction}
            className="relative h-full"
          >
            {children}
            
            {/* View Mode Controls */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
              <motion.div
                className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  {/* Tour Mode Indicator */}
                  {currentTourMode && (
                    <motion.div
                      className="flex items-center space-x-1 px-2 py-1 rounded bg-green-500/20 border border-green-400/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Brain className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-300 font-medium">
                        {currentTourMode === 'guided' ? 'Guided Tour' : 'Free Exploration'}
                      </span>
                    </motion.div>
                  )}
                  
                  {/* View Mode Selector */}
                  <button
                    onClick={toggleViewMode}
                    className="px-2 py-1 text-xs bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white rounded transition-colors"
                    title="Toggle View Mode"
                  >
                    {viewMode === 'tour-focused' && '📚 Tour View'}
                    {viewMode === 'spatial-focused' && '🧠 Spatial View'}
                    {viewMode === 'default' && '⚖️ Balanced View'}
                    {viewMode === 'fullscreen' && '🖥️ Fullscreen'}
                  </button>
                  
                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Toggle Fullscreen"
                  >
                    {viewMode === 'fullscreen' ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Spatial Intelligence Status Indicator */}
            {showSpatialOverlay && viewMode !== 'tour-focused' && (
              <motion.div
                className="absolute bottom-4 right-4 z-40"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-400/30 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-blue-300">Spatial Intelligence Active</span>
                  </div>
                </div>
              </motion.div>
            )}
          </EnhancedMindmapWithGrouping>
        </ReactFlowProvider>
      </div>
      
      {/* Historical Tour Navigation */}
      <div className={layout.tourPosition}>
        <AnimatePresence>
          <HistoricalTourNavigation
            className={layout.tourSize}
            onTourModeChange={handleTourModeChange}
            isCollapsed={tourCollapsed && viewMode !== 'tour-focused'}
            onToggleCollapse={() => setTourCollapsed(!tourCollapsed)}
          />
        </AnimatePresence>
      </div>
      
      {/* Tour Mode Specific Features */}
      <AnimatePresence>
        {currentTourMode === 'guided' && viewMode === 'tour-focused' && (
          <motion.div
            className="absolute top-4 left-4 z-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Tour Guide Mode</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Follow chronological progression</div>
                <div>• Spatial groups auto-created</div>
                <div>• Historical context preserved</div>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentTourMode === 'free-form' && viewMode === 'spatial-focused' && (
          <motion.div
            className="absolute top-4 left-4 z-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-blue-400/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Free Exploration Mode</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Enhanced spatial grouping</div>
                <div>• Intelligent suggestions</div>
                <div>• Contextual connections</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Performance Stats (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="absolute top-4 right-4 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded px-2 py-1">
            <div className="text-xs text-slate-400">
              View: {viewMode} | Tour: {currentTourMode || 'none'}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Keyboard Shortcuts Help */}
      {viewMode !== 'fullscreen' && (
        <motion.div
          className="absolute bottom-4 left-4 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="bg-slate-900/90 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2">
            <div className="text-xs text-slate-400">
              <div className="flex items-center space-x-2 mb-1">
                <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">V</kbd>
                <span>Toggle view mode</span>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">F</kbd>
                <span>Fullscreen</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">T</kbd>
                <span>Toggle tour</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Enhanced keyboard shortcuts hook
function useEnhancedKeyboardShortcuts(
  onToggleViewMode: () => void,
  onToggleFullscreen: () => void,
  onToggleTour: () => void,
  onApplyLayout: () => void,
  onUndoLayout: () => void,
  onRedoLayout: () => void,
  canUndo: boolean,
  canRedo: boolean
) {
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return // Don't trigger shortcuts when typing in inputs
      }
      
      // Handle modifier key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault()
            if (event.shiftKey) {
              if (canRedo) onRedoLayout()
            } else {
              if (canUndo) onUndoLayout()
            }
            break
          case 'l':
            event.preventDefault()
            onApplyLayout()
            break
        }
        return
      }
      
      // Regular shortcuts
      switch (event.key.toLowerCase()) {
        case 'v':
          onToggleViewMode()
          break
        case 'f':
          onToggleFullscreen()
          break
        case 't':
          onToggleTour()
          break
        case 'l':
          onApplyLayout()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onToggleViewMode, onToggleFullscreen, onToggleTour, onApplyLayout, onUndoLayout, onRedoLayout, canUndo, canRedo])
}