'use client'

import React, { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  MapPin, 
  Clock, 
  Navigation, 
  BookOpen,
  Compass,
  Calendar,
  ChevronDown,
  ChevronUp,
  History,
  Target
} from 'lucide-react'
import { useTour } from '../../tours/hooks/use-tour'
import type { TourDefinition, TourWaypoint } from '../../tours/types/tour'

interface HistoricalTourControlsProps {
  className?: string
  onTourSelect?: (tourId: string) => void
  onWaypointSelect?: (waypointIndex: number) => void
  showTimeline?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const CURRENT_YEAR = new Date().getFullYear()

// Historical periods for the disclosure tour
const HISTORICAL_PERIODS = [
  { name: 'Early Sightings', years: '1947-1952', color: '#ef4444', icon: '🛸' },
  { name: 'Government Investigation', years: '1952-1969', color: '#f97316', icon: '🏛️' },
  { name: 'Civilian Research', years: '1969-1990', color: '#eab308', icon: '🔬' },
  { name: 'Modern Research', years: '1990-2010', color: '#22c55e', icon: '📡' },
  { name: 'Disclosure Era', years: `2010-${CURRENT_YEAR}`, color: '#3b82f6', icon: '📰' },
]

// Sample tour definition for Roswell to Disclosure
const ROSWELL_DISCLOSURE_TOUR: TourDefinition = {
  id: 'roswell-disclosure',
  title: 'Roswell to Disclosure: The Complete Timeline',
  description: 'Journey through 75+ years of UFO/UAP history from the 1947 Roswell incident to modern Pentagon disclosures',
  difficulty: 'beginner',
  estimatedDuration: 45,
  tags: ['historical', 'disclosure', 'timeline', 'government'],
  waypoints: [
    {
      id: 'roswell-1947',
      title: 'Roswell Incident (1947)',
      dbRef: { type: 'events', id: 'roswell-1947' },
      narrative: 'The crash that started it all. Examine the key figures, witness testimonies, and military response.',
      contextRules: {
        temporalWindow: { startYear: 1947, endYear: 1950 },
        entityFilters: { types: ['events', 'personnel', 'testimonies'] }
      },
      visualSettings: { cameraPosition: { zoom: 1.2, center: { x: 0, y: 0 } } },
      userActions: [
        { type: 'explore_connections', prompt: 'Explore the key personnel involved in the incident', required: true }
      ]
    },
    {
      id: 'project-blue-book',
      title: 'Project Blue Book Era (1952-1969)',
      dbRef: { type: 'organizations', id: 'project-blue-book' },
      narrative: 'The Air Force\'s systematic investigation of UFO reports. Discover the cases, scientists, and conclusions.',
      contextRules: {
        temporalWindow: { startYear: 1952, endYear: 1969 },
        entityFilters: { types: ['organizations', 'personnel', 'events'] }
      },
      visualSettings: { cameraPosition: { zoom: 1.0, center: { x: 200, y: 0 } } },
      userActions: [
        { type: 'add_records', prompt: 'Add significant Blue Book cases and investigators', required: true }
      ]
    },
    {
      id: 'modern-disclosure',
      title: 'Pentagon Disclosure (2017-Present)',
      dbRef: { type: 'events', id: 'pentagon-uap-videos' },
      narrative: 'Recent Pentagon acknowledgments and the UAP Task Force. How we got from secrecy to transparency.',
      contextRules: {
        temporalWindow: { startYear: 2017, endYear: CURRENT_YEAR },
        entityFilters: { types: ['events', 'documents', 'personnel'] }
      },
      visualSettings: { cameraPosition: { zoom: 1.1, center: { x: 400, y: 0 } } },
      userActions: [
        { type: 'take_notes', prompt: 'Reflect on the journey from Roswell to modern disclosure', required: true }
      ]
    }
  ]
}

export function HistoricalTourControls({
  className = '',
  onTourSelect,
  onWaypointSelect,
  showTimeline = true,
  position = 'top'
}: HistoricalTourControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPeriodDetails, setShowPeriodDetails] = useState(false)
  
  const {
    currentTour,
    currentWaypoint,
    tourProgress,
    isLoading,
    currentStep,
    totalSteps,
    progressPercentage,
    canGoNext,
    canGoPrevious,
    tourMode,
    loadTour,
    nextWaypoint,
    previousWaypoint,
    navigateToWaypoint,
    toggleTourMode,
    completeTour
  } = useTour()

  // Handle tour initialization
  const handleStartTour = useCallback(async () => {
    if (!currentTour) {
      await loadTour(ROSWELL_DISCLOSURE_TOUR)
      onTourSelect?.('roswell-disclosure')
    }
  }, [currentTour, loadTour, onTourSelect])

  // Handle waypoint navigation
  const handleWaypointNavigation = useCallback(async (waypointIndex: number) => {
    await navigateToWaypoint(waypointIndex)
    onWaypointSelect?.(waypointIndex)
  }, [navigateToWaypoint, onWaypointSelect])

  // Get current historical period based on waypoint
  const getCurrentPeriod = useCallback(() => {
    if (!currentWaypoint) return null
    
    const periodIndex = Math.floor((currentStep / (totalSteps - 1)) * (HISTORICAL_PERIODS.length - 1))
    return HISTORICAL_PERIODS[periodIndex] || HISTORICAL_PERIODS[0]
  }, [currentWaypoint, currentStep, totalSteps])

  const currentPeriod = getCurrentPeriod()

  // Position-based styling
  const getPositionClasses = () => {
    switch (position) {
      case 'top': return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'bottom': return 'bottom-4 left-1/2 transform -translate-x-1/2'
      case 'left': return 'left-4 top-1/2 transform -translate-y-1/2'
      case 'right': return 'right-4 top-1/2 transform -translate-y-1/2'
      default: return 'top-4 left-1/2 transform -translate-x-1/2'
    }
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-xl min-w-96"
      >
        {/* Main control header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Historical Tour</span>
            </div>
            
            {currentPeriod && (
              <div className="flex items-center space-x-2 text-sm">
                <span>{currentPeriod.icon}</span>
                <span className="text-slate-300">{currentPeriod.name}</span>
                <span className="text-slate-500">({currentPeriod.years})</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-green-400 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Progress bar */}
        {currentTour && (
          <div className="px-4 pb-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span>{currentStep + 1} of {totalSteps}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Expanded controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700/50"
            >
              <div className="p-4 space-y-4">
                {/* Tour controls */}
                <div className="flex items-center justify-center space-x-2">
                  {!currentTour ? (
                    <button
                      onClick={handleStartTour}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Historical Tour</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={previousWaypoint}
                        disabled={!canGoPrevious || isLoading}
                        className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={toggleTourMode}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          tourMode === 'guided' 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        }`}
                      >
                        {tourMode === 'guided' ? <Navigation className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                        <span>{tourMode === 'guided' ? 'Guided' : 'Free'}</span>
                      </button>
                      
                      <button
                        onClick={nextWaypoint}
                        disabled={!canGoNext || isLoading}
                        className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Current waypoint info */}
                {currentWaypoint && (
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-white">{currentWaypoint.title}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {currentWaypoint.narrative}
                    </p>
                    
                    {/* User actions for current waypoint */}
                    {currentWaypoint.userActions && currentWaypoint.userActions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-slate-300">Your Tasks:</span>
                        </div>
                        <ul className="space-y-1">
                          {currentWaypoint.userActions.map((action, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span className="text-slate-300">{action.prompt}</span>
                              {action.required && (
                                <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">Required</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Historical timeline */}
                {showTimeline && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Historical Timeline</span>
                      </div>
                      <button
                        onClick={() => setShowPeriodDetails(!showPeriodDetails)}
                        className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPeriodDetails ? 'Hide' : 'Show'} Details
                      </button>
                    </div>
                    
                    <div className="flex space-x-1">
                      {HISTORICAL_PERIODS.map((period, index) => (
                        <motion.div
                          key={period.name}
                          className={`flex-1 h-3 rounded cursor-pointer transition-all ${
                            currentPeriod?.name === period.name 
                              ? 'ring-2 ring-white ring-opacity-50' 
                              : 'opacity-70 hover:opacity-90'
                          }`}
                          style={{ backgroundColor: period.color }}
                          whileHover={{ scale: 1.05 }}
                          title={`${period.name} (${period.years})`}
                          onClick={() => {
                            // Navigate to the waypoint corresponding to this period
                            const waypointIndex = Math.floor((index / (HISTORICAL_PERIODS.length - 1)) * (totalSteps - 1))
                            handleWaypointNavigation(waypointIndex)
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Period details */}
                    <AnimatePresence>
                      {showPeriodDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="grid grid-cols-1 gap-2"
                        >
                          {HISTORICAL_PERIODS.map((period, index) => (
                            <div
                              key={period.name}
                              className={`flex items-center space-x-3 p-2 rounded transition-colors ${
                                currentPeriod?.name === period.name 
                                  ? 'bg-slate-700/50 border border-slate-600' 
                                  : 'bg-slate-800/30 hover:bg-slate-700/30'
                              }`}
                            >
                              <span className="text-lg">{period.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-white truncate">{period.name}</span>
                                  <span className="text-xs text-slate-400">{period.years}</span>
                                </div>
                              </div>
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: period.color }}
                              />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
