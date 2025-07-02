'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactFlow } from '@xyflow/react'
import { 
  Navigation, 
  Compass, 
  Target, 
  MapPin, 
  Route,
  Lightbulb,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Settings,
  HelpCircle,
  CheckCircle2,
  Circle,
  ArrowRight
} from 'lucide-react'
import { useTour } from '../../tours/hooks/use-tour'
import { useSpatialGrouping } from '../../hooks/use-spatial-grouping'

interface TourModeIntegrationProps {
  className?: string
  showWaypoints?: boolean
  showConnections?: boolean
  autoPosition?: boolean
  onModeChange?: (mode: 'guided' | 'free-form' | null) => void
}

// Visual styles for different tour modes
const TOUR_MODE_STYLES = {
  guided: {
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.3)',
    icon: Navigation,
    label: 'Guided Tour',
    description: 'Follow structured pathways through historical events'
  },
  'free-form': {
    primary: '#10b981',
    secondary: '#047857',
    accent: '#34d399',
    glow: 'rgba(16, 185, 129, 0.3)',
    icon: Compass,
    label: 'Free Exploration',
    description: 'Explore connections and discover insights organically'
  }
}

// Waypoint visual indicators
const WAYPOINT_STATES = {
  completed: { icon: CheckCircle2, color: '#22c55e' },
  current: { icon: Target, color: '#3b82f6' },
  upcoming: { icon: Circle, color: '#6b7280' },
  locked: { icon: Circle, color: '#374151' }
}

export function TourModeIntegration({
  className = '',
  showWaypoints = true,
  showConnections = true,
  autoPosition = true,
  onModeChange
}: TourModeIntegrationProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const { getViewport, getNodes, getEdges } = useReactFlow()
  const { spatialGroups } = useSpatialGrouping()
  const viewport = getViewport()
  
  const {
    currentTour,
    currentWaypoint,
    tourProgress,
    currentStep,
    totalSteps,
    tourMode,
    tourContext,
    canGoNext,
    canGoPrevious,
    toggleTourMode,
    resetTour,
    validateTourCompletion
  } = useTour()

  // Handle mode change notifications
  useEffect(() => {
    onModeChange?.(tourMode)
  }, [tourMode, onModeChange])

  // Get current mode styles
  const getModeStyles = () => {
    if (!tourMode || !(tourMode in TOUR_MODE_STYLES)) {
      return TOUR_MODE_STYLES['free-form'] // Default to free-form
    }
    return TOUR_MODE_STYLES[tourMode as keyof typeof TOUR_MODE_STYLES]
  }

  // Handle tour mode toggle
  const handleModeToggle = useCallback(async () => {
    await toggleTourMode()
  }, [toggleTourMode])

  // Get waypoint positions for visual indicators
  const getWaypointPositions = useCallback(() => {
    if (!currentTour || !showWaypoints) return []
    
    const nodes = getNodes()
    const positions = []
    
    currentTour.waypoints.forEach((waypoint, index) => {
      // Try to find a node that corresponds to this waypoint
      const relatedNode = nodes.find(node => 
        node.data?.id === waypoint.dbRef.id ||
        node.data?.title?.toLowerCase().includes(waypoint.title.toLowerCase()) ||
        node.id.includes(waypoint.id)
      )
      
      if (relatedNode) {
        positions.push({
          waypoint,
          index,
          position: relatedNode.position,
          nodeId: relatedNode.id,
          state: index < currentStep ? 'completed' : 
                 index === currentStep ? 'current' : 
                 'upcoming'
        })
      } else if (autoPosition) {
        // Auto-position waypoints in a circular layout if no related node found
        const angle = (index / currentTour.waypoints.length) * 2 * Math.PI
        const radius = 400
        const centerX = 0
        const centerY = 0
        
        positions.push({
          waypoint,
          index,
          position: {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          },
          nodeId: null,
          state: index < currentStep ? 'completed' : 
                 index === currentStep ? 'current' : 
                 'upcoming'
        })
      }
    })
    
    return positions
  }, [currentTour, currentStep, showWaypoints, autoPosition, getNodes])

  const modeStyles = getModeStyles()
  const waypointPositions = getWaypointPositions()
  const completion = currentTour ? validateTourCompletion() : { ready: false, issues: [] }

  if (!currentTour) return null

  return (
    <div className={`relative ${className}`}>
      {/* Waypoint indicators overlay */}
      {showWaypoints && waypointPositions.length > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
            style={{
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
              transformOrigin: '0 0'
            }}
          >
            <defs>
              {/* Glow filter for current waypoint */}
              <filter id="waypoint-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Pulse animation */}
              <animateTransform
                id="pulse"
                attributeName="transform"
                type="scale"
                values="1;1.2;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </defs>
            
            {/* Connection lines between waypoints */}
            {showConnections && waypointPositions.length > 1 && (
              <g className="waypoint-connections">
                {waypointPositions.slice(0, -1).map((pos, index) => {
                  const nextPos = waypointPositions[index + 1]
                  const isActive = index < currentStep
                  const isCurrent = index === currentStep - 1
                  
                  return (
                    <motion.line
                      key={`connection-${index}`}
                      x1={pos.position.x}
                      y1={pos.position.y}
                      x2={nextPos.position.x}
                      y2={nextPos.position.y}
                      stroke={isActive ? modeStyles.primary : '#374151'}
                      strokeWidth={isCurrent ? 3 : 2}
                      strokeDasharray={isActive ? 'none' : '5,5'}
                      opacity={isActive ? 0.8 : 0.4}
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isActive ? 1 : 0.3 }}
                      transition={{ 
                        duration: animationEnabled ? 1 : 0, 
                        delay: index * 0.2 
                      }}
                    />
                  )
                })}
                
                {/* Arrow marker */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill={modeStyles.primary}
                    />
                  </marker>
                </defs>
              </g>
            )}
            
            {/* Waypoint indicators */}
            {waypointPositions.map((pos, index) => {
              const stateInfo = WAYPOINT_STATES[pos.state as keyof typeof WAYPOINT_STATES]
              const isCurrent = pos.state === 'current'
              
              return (
                <g key={`waypoint-${index}`}>
                  {/* Waypoint circle */}
                  <motion.circle
                    cx={pos.position.x}
                    cy={pos.position.y}
                    r={isCurrent ? 12 : 8}
                    fill={stateInfo.color}
                    stroke={isCurrent ? modeStyles.accent : 'transparent'}
                    strokeWidth={isCurrent ? 2 : 0}
                    filter={isCurrent ? 'url(#waypoint-glow)' : 'none'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: animationEnabled ? 0.5 : 0, 
                      delay: index * 0.1 
                    }}
                    className="pointer-events-auto cursor-pointer"
                    style={{
                      filter: isCurrent ? `drop-shadow(0 0 8px ${modeStyles.glow})` : 'none'
                    }}
                  >
                    {isCurrent && animationEnabled && (
                      <animateTransform
                        attributeName="transform"
                        type="scale"
                        values="1;1.1;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </motion.circle>
                  
                  {/* Waypoint number */}
                  <text
                    x={pos.position.x}
                    y={pos.position.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize={isCurrent ? 10 : 8}
                    fill="white"
                    fontWeight="bold"
                  >
                    {index + 1}
                  </text>
                  
                  {/* Waypoint label (only for current) */}
                  {isCurrent && (
                    <text
                      x={pos.position.x}
                      y={pos.position.y - 20}
                      textAnchor="middle"
                      fontSize="10"
                      fill={modeStyles.primary}
                      fontWeight="500"
                    >
                      {pos.waypoint.title}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      )}
      
      {/* Tour mode indicator panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-20 left-4 z-50"
      >
        <div 
          className="bg-slate-900/95 backdrop-blur-sm border rounded-lg shadow-xl"
          style={{ borderColor: `${modeStyles.primary}50` }}
        >
          <div className="p-3">
            {/* Mode indicator header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {React.createElement(modeStyles.icon, {
                  className: "w-4 h-4",
                  style: { color: modeStyles.primary }
                })}
                <span 
                  className="font-medium text-sm"
                  style={{ color: modeStyles.primary }}
                >
                  {modeStyles.label}
                </span>
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            {/* Mode description */}
            <p className="text-xs text-slate-400 mb-3">
              {modeStyles.description}
            </p>
            
            {/* Quick actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleModeToggle}
                className="flex items-center space-x-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white transition-colors"
              >
                {tourMode === 'guided' ? <Compass className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                <span>Switch Mode</span>
              </button>
              
              {tourMode === 'guided' && (
                <button
                  onClick={resetTour}
                  className="flex items-center space-x-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
            
            {/* Tour completion indicator */}
            {completion.ready && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 bg-green-900/30 border border-green-500/50 rounded flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-medium">Tour Ready to Complete!</span>
              </motion.div>
            )}
            
            {/* Tour issues */}
            {!completion.ready && completion.issues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 bg-orange-900/30 border border-orange-500/50 rounded"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 text-xs font-medium">Remaining Tasks:</span>
                </div>
                <ul className="space-y-1">
                  {completion.issues.map((issue, index) => (
                    <li key={index} className="text-xs text-orange-300 flex items-start space-x-1">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
          
          {/* Expanded settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-700/50 p-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Show Waypoints</span>
                    <button
                      onClick={() => {/* Toggle waypoints */}}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showWaypoints ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        showWaypoints ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Show Connections</span>
                    <button
                      onClick={() => {/* Toggle connections */}}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showConnections ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        showConnections ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Animations</span>
                    <button
                      onClick={() => setAnimationEnabled(!animationEnabled)}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        animationEnabled ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        animationEnabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Spatial group integration indicators */}
      {spatialGroups.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/95 backdrop-blur-sm border border-cyan-400/30 rounded-lg shadow-xl p-3"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-medium text-sm">Smart Grouping</span>
            </div>
            <div className="text-xs text-slate-400">
              {spatialGroups.length} groups detected
            </div>
            <div className="text-xs text-cyan-300 mt-1">
              Groups enhance tour progression
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}