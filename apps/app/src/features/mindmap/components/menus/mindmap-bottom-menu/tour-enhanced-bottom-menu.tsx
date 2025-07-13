'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, 
  Navigation, 
  Compass, 
  ChevronUp, 
  ChevronDown,
  MapPin,
  Target,
  Play,
  Square,
  BookOpen
} from 'lucide-react'
import { MindMapBottomMenu, type MindMapBottomMenuProps } from './mindmap-bottom-menu'
import { HistoricalTourControls } from '../../tours/historical-tour-controls'
import { HistoricalContextOverlay } from '../../tours/historical-context-overlay'
import { TourModeIntegration } from '../../tours/tour-mode-integration'
import { FamousEventsTourLauncher } from '../../../tours/components/famous-events-tour-launcher'
import { useTour } from '../../../tours/hooks/use-tour'
import { SessionNotesProvider } from '@/contexts/mindmap/session-notes-context'

interface TourEnhancedBottomMenuProps extends MindMapBottomMenuProps {
  showTourControls?: boolean
  showHistoricalContext?: boolean
  tourControlsPosition?: 'top' | 'bottom' | 'left' | 'right'
  contextPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  autoHideContext?: boolean
  enableTourMode?: boolean
}

// Tour quick actions for the bottom menu
const TOUR_QUICK_ACTIONS = [
  {
    id: 'famous-events-tour',
    label: 'Famous Events Tour',
    icon: History,
    description: 'Chronological journey through famous UFO events',
    action: 'start-famous-events-tour'
  },
  {
    id: 'start-tour',
    label: 'Historical Tour',
    icon: BookOpen,
    description: 'Begin guided journey from Roswell to modern disclosure',
    action: 'start-historical-tour'
  },
  {
    id: 'guided-mode',
    label: 'Guided Mode',
    icon: Navigation,
    description: 'Follow structured pathways through events',
    action: 'toggle-guided-mode'
  },
  {
    id: 'free-exploration',
    label: 'Free Exploration',
    icon: Compass,
    description: 'Explore connections organically',
    action: 'toggle-free-mode'
  },
  {
    id: 'tour-progress',
    label: 'Tour Progress',
    icon: Target,
    description: 'View current tour status and next steps',
    action: 'show-tour-progress'
  }
]

export function TourEnhancedBottomMenu({
  showTourControls = true,
  showHistoricalContext = true,
  tourControlsPosition = 'top',
  contextPosition = 'top-right',
  autoHideContext = false,
  enableTourMode = true,
  onCommandChange,
  onModelChange,
  ...props
}: TourEnhancedBottomMenuProps) {
  const [tourPanelExpanded, setTourPanelExpanded] = useState(false)
  const [activeTourAction, setActiveTourAction] = useState<string | null>(null)
  const [showTourHint, setShowTourHint] = useState(true)
  const [showFamousEventsTour, setShowFamousEventsTour] = useState(false)
  
  const {
    currentTour,
    currentWaypoint,
    tourMode,
    isLoading: tourLoading,
    loadTour,
    toggleTourMode
  } = useTour()

  // Auto-hide tour hint after interaction
  useEffect(() => {
    if (currentTour || tourMode) {
      setShowTourHint(false)
    }
  }, [currentTour, tourMode])

  // Handle tour action selection
  const handleTourAction = useCallback(async (actionId: string) => {
    setActiveTourAction(actionId)
    
    switch (actionId) {
      case 'start-famous-events-tour':
        setShowFamousEventsTour(true)
        setTourPanelExpanded(false)
        break

      case 'start-historical-tour':
        // This will be handled by the HistoricalTourControls component
        setTourPanelExpanded(true)
        break
        
      case 'toggle-guided-mode':
        if (tourMode !== 'guided') {
          await toggleTourMode()
        }
        break
        
      case 'toggle-free-mode':
        if (tourMode !== 'free-form') {
          await toggleTourMode()
        }
        break
        
      case 'show-tour-progress':
        setTourPanelExpanded(true)
        break
        
      default:
        console.log('Unknown tour action:', actionId)
    }
    
    // Clear active action after a delay
    setTimeout(() => setActiveTourAction(null), 1000)
  }, [tourMode, toggleTourMode])

  // Enhanced command change handler that includes tour commands
  const handleEnhancedCommandChange = useCallback((command: string | null) => {
    // Handle specific tour commands
    if (command?.toLowerCase().includes('famous') || command === '/famous') {
      handleTourAction('start-famous-events-tour')
      return
    }
    
    if (command?.toLowerCase().includes('tour') || command === '/tour') {
      handleTourAction('start-historical-tour')
      return
    }
    
    // Check if it's a tour-related command
    const tourAction = TOUR_QUICK_ACTIONS.find(action => 
      action.label.toLowerCase().includes(command?.toLowerCase() || '') ||
      action.id === command
    )
    
    if (tourAction) {
      handleTourAction(tourAction.action)
    }
    
    // Pass through to original handler
    onCommandChange?.(command)
  }, [onCommandChange, handleTourAction])

  return (
    <SessionNotesProvider>
      <div className="relative">
        {/* Famous Events Tour Modal */}
        {showFamousEventsTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowFamousEventsTour(false)}
            />
            <div className="relative z-10">
              <FamousEventsTourLauncher />
              <button
                onClick={() => setShowFamousEventsTour(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white text-sm"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tour mode integration overlay */}
        {enableTourMode && currentTour && (
          <TourModeIntegration
            showWaypoints={true}
            showConnections={true}
            autoPosition={true}
            onModeChange={(mode) => {
              console.log('Tour mode changed:', mode)
            }}
          />
        )}
        
        {/* Historical context overlay */}
        {showHistoricalContext && currentTour && (
          <HistoricalContextOverlay
            position={contextPosition}
            autoHide={autoHideContext}
            showNarrative={true}
            showTimePeriod={true}
            showSignificance={true}
          />
        )}
        
        {/* Historical tour controls */}
        {showTourControls && (
          <HistoricalTourControls
            position={tourControlsPosition}
            showTimeline={true}
            onTourSelect={(tourId) => {
              console.log('Tour selected:', tourId)
              setShowTourHint(false)
            }}
            onWaypointSelect={(waypointIndex) => {
              console.log('Waypoint selected:', waypointIndex)
            }}
          />
        )}
        
        {/* Main bottom menu with tour enhancements */}
        <div className="relative">
          <MindMapBottomMenu
            onCommandChange={handleEnhancedCommandChange}
            onModelChange={onModelChange}
            {...props}
          />
          
          {/* Tour status indicator */}
          <AnimatePresence>
            {(currentTour || tourMode) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-1.5 flex items-center space-x-2">
                  {tourMode === 'guided' ? (
                    <Navigation className="w-4 h-4 text-blue-400" />
                  ) : tourMode === 'free-form' ? (
                    <Compass className="w-4 h-4 text-green-400" />
                  ) : (
                    <MapPin className="w-4 h-4 text-purple-400" />
                  )}
                  
                  <span className="text-sm text-slate-300">
                    {tourMode === 'guided' ? 'Guided Tour Active' :
                     tourMode === 'free-form' ? 'Free Exploration' :
                     'Tour Ready'}
                  </span>
                  
                  {currentWaypoint && (
                    <span className="text-xs text-slate-400">
                      • {currentWaypoint.title}
                    </span>
                  )}
                  
                  {tourLoading && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tour quick actions panel */}
          <AnimatePresence>
            {tourPanelExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-96"
              >
                <div className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-xl">
                  <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
                    <div className="flex items-center space-x-2">
                      <History className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Tour Actions</span>
                    </div>
                    <button
                      onClick={() => setTourPanelExpanded(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {TOUR_QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleTourAction(action.action)}
                        disabled={tourLoading}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          activeTourAction === action.action
                            ? 'bg-green-600/20 border-green-400/50 text-green-300'
                            : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <action.icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{action.label}</span>
                        </div>
                        <p className="text-xs text-slate-400">{action.description}</p>
                      </button>
                    ))}
                  </div>
                  
                  {/* Current tour status */}
                  {currentTour && (
                    <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">Current Tour</span>
                        <span className="text-xs text-slate-400">{currentTour.title}</span>
                      </div>
                      
                      {currentWaypoint && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-slate-300">{currentWaypoint.title}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tour hint for new users */}
          <AnimatePresence>
            {showTourHint && !currentTour && !tourMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute -top-20 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-2 relative">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-blue-100">
                      Try typing <code className="bg-blue-800/50 px-1 rounded">/famous</code> for the Famous Events Tour
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setShowTourHint(false)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                  
                  {/* Arrow pointing to input */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-900 rotate-45 border-r border-b border-blue-400/30" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tour expansion toggle */}
          {(currentTour || tourMode) && (
            <button
              onClick={() => setTourPanelExpanded(!tourPanelExpanded)}
              className="absolute -top-6 right-4 p-1 bg-slate-800/80 border border-slate-600/50 rounded hover:bg-slate-700/80 transition-colors"
            >
              {tourPanelExpanded ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </SessionNotesProvider>
  )
}