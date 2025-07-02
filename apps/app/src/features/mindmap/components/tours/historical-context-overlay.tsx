'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactFlow } from '@xyflow/react'
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  Building, 
  FileText, 
  Star,
  ChevronLeft,
  ChevronRight,
  Info,
  Eye,
  EyeOff,
  Lightbulb,
  Award
} from 'lucide-react'
import { useTour } from '../../tours/hooks/use-tour'

interface HistoricalContextOverlayProps {
  className?: string
  showNarrative?: boolean
  showTimePeriod?: boolean
  showSignificance?: boolean
  autoHide?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
}

// Historical significance levels
const SIGNIFICANCE_LEVELS = {
  critical: { label: 'Critical Event', color: '#ef4444', icon: '🔥' },
  major: { label: 'Major Development', color: '#f97316', icon: '⭐' },
  important: { label: 'Important Milestone', color: '#eab308', icon: '📍' },
  notable: { label: 'Notable Event', color: '#22c55e', icon: '💡' },
  contextual: { label: 'Background Context', color: '#6366f1', icon: '📖' }
}

// Entity type icons and colors
const ENTITY_ICONS = {
  events: { icon: Calendar, color: '#3b82f6' },
  personnel: { icon: Users, color: '#10b981' },
  organizations: { icon: Building, color: '#f59e0b' },
  documents: { icon: FileText, color: '#8b5cf6' },
  testimonies: { icon: Users, color: '#06b6d4' },
  topics: { icon: Lightbulb, color: '#f97316' },
  artifacts: { icon: Star, color: '#ec4899' }
}

// Time period context data
const TIME_PERIOD_CONTEXT = {
  '1940s': {
    name: 'Early Era',
    description: 'The dawn of the modern UFO phenomenon',
    keyEvents: ['Roswell Incident', 'Kenneth Arnold Sighting', 'Project Sign'],
    worldContext: 'Post-WWII era, Cold War beginning, aviation boom',
    significance: 'Foundation period that established core UFO mythology'
  },
  '1950s': {
    name: 'Investigation Era',
    description: 'Government takes UFOs seriously',
    keyEvents: ['Project Blue Book', 'Washington D.C. UFO Incident', 'Contactee Movement'],
    worldContext: 'Cold War intensifies, space race begins, nuclear anxiety',
    significance: 'Official scientific study and classification efforts'
  },
  '1960s': {
    name: 'Scientific Period',
    description: 'Academic study and public skepticism',
    keyEvents: ['Condon Committee', 'Blue Book closure', 'Betty & Barney Hill'],
    worldContext: 'Space race peak, counterculture movement, Vietnam War',
    significance: 'Scientific community enters debate, debunking efforts'
  },
  '1970s-1980s': {
    name: 'Underground Research',
    description: 'Civilian groups take over investigation',
    keyEvents: ['MUFON formation', 'Abduction research', 'Cash-Landrum incident'],
    worldContext: 'Post-Vietnam skepticism, environmental movement, personal computers',
    significance: 'Grassroots research, focus shifts to abduction phenomena'
  },
  '1990s-2000s': {
    name: 'Digital Age',
    description: 'Internet enables global information sharing',
    keyEvents: ['Phoenix Lights', 'Disclosure Project', 'UFO videos proliferate'],
    worldContext: 'Internet revolution, 9/11 security focus, digital media boom',
    significance: 'Democratization of UFO research and evidence sharing'
  },
  '2010s-Present': {
    name: 'Disclosure Era',
    description: 'Official acknowledgment and transparency',
    keyEvents: ['Pentagon UFO videos', 'UAP Task Force', 'Congressional hearings'],
    worldContext: 'Social media age, government transparency demands, advanced sensors',
    significance: 'Paradigm shift from secrecy to official investigation'
  }
}

export function HistoricalContextOverlay({
  className = '',
  showNarrative = true,
  showTimePeriod = true,
  showSignificance = true,
  autoHide = false,
  position = 'top-right'
}: HistoricalContextOverlayProps) {
  const [isVisible, setIsVisible] = useState(!autoHide)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const { getViewport } = useReactFlow()
  const viewport = getViewport()
  
  const {
    currentTour,
    currentWaypoint,
    tourProgress,
    currentStep,
    totalSteps,
    tourContext
  } = useTour()

  // Auto-hide functionality
  useEffect(() => {
    if (!autoHide) return

    const hideTimeout = setTimeout(() => {
      if (Date.now() - lastInteraction > 5000) { // 5 seconds of inactivity
        setIsVisible(false)
      }
    }, 5000)

    return () => clearTimeout(hideTimeout)
  }, [lastInteraction, autoHide])

  // Handle user interaction to reset auto-hide timer
  const handleInteraction = useCallback(() => {
    setLastInteraction(Date.now())
    if (!isVisible) setIsVisible(true)
  }, [isVisible])

  // Get current time period based on waypoint
  const getCurrentTimePeriod = useCallback(() => {
    if (!currentWaypoint?.contextRules?.temporalWindow) return null
    
    const { startYear, endYear } = currentWaypoint.contextRules.temporalWindow
    if (!startYear) return null
    
    // Determine decade/period
    if (startYear >= 2010) return TIME_PERIOD_CONTEXT['2010s-Present']
    if (startYear >= 1990) return TIME_PERIOD_CONTEXT['1990s-2000s']
    if (startYear >= 1970) return TIME_PERIOD_CONTEXT['1970s-1980s']
    if (startYear >= 1960) return TIME_PERIOD_CONTEXT['1960s']
    if (startYear >= 1950) return TIME_PERIOD_CONTEXT['1950s']
    if (startYear >= 1940) return TIME_PERIOD_CONTEXT['1940s']
    
    return null
  }, [currentWaypoint])

  // Get significance level for current waypoint
  const getSignificanceLevel = useCallback(() => {
    if (!currentWaypoint) return null
    
    // Determine significance based on waypoint title and context
    const title = currentWaypoint.title.toLowerCase()
    if (title.includes('roswell') || title.includes('disclosure')) return SIGNIFICANCE_LEVELS.critical
    if (title.includes('blue book') || title.includes('pentagon')) return SIGNIFICANCE_LEVELS.major
    if (title.includes('project') || title.includes('task force')) return SIGNIFICANCE_LEVELS.important
    
    return SIGNIFICANCE_LEVELS.notable
  }, [currentWaypoint])

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4'
      case 'top-right': return 'top-4 right-4'
      case 'bottom-left': return 'bottom-4 left-4'
      case 'bottom-right': return 'bottom-4 right-4'
      case 'center': return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      default: return 'top-4 right-4'
    }
  }

  const currentTimePeriod = getCurrentTimePeriod()
  const significanceLevel = getSignificanceLevel()

  if (!currentTour || !currentWaypoint) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`fixed ${getPositionClasses()} z-40 max-w-sm ${className}`}
          onMouseEnter={handleInteraction}
          onMouseMove={handleInteraction}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-xl">
            {/* Header with visibility toggle */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold text-sm">Historical Context</span>
              </div>
              <div className="flex items-center space-x-1">
                {autoHide && (
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                    title="Hide context overlay"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 space-y-3">
              {/* Current waypoint narrative */}
              {showNarrative && currentWaypoint.narrative && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium text-sm">{currentWaypoint.title}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {currentWaypoint.narrative}
                  </p>
                </motion.div>
              )}

              {/* Time period context */}
              {showTimePeriod && currentTimePeriod && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'period' ? null : 'period')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium text-sm">{currentTimePeriod.name}</span>
                    </div>
                    {expandedSection === 'period' ? 
                      <ChevronLeft className="w-4 h-4 text-slate-400" /> : 
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    }
                  </button>
                  
                  <p className="text-slate-400 text-xs">
                    {currentTimePeriod.description}
                  </p>

                  <AnimatePresence>
                    {expandedSection === 'period' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 text-xs"
                      >
                        <div>
                          <span className="text-slate-400 font-medium">Key Events:</span>
                          <ul className="mt-1 space-y-1">
                            {currentTimePeriod.keyEvents.map((event, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-purple-400 mt-0.5">•</span>
                                <span className="text-slate-300">{event}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <span className="text-slate-400 font-medium">World Context:</span>
                          <p className="mt-1 text-slate-300">{currentTimePeriod.worldContext}</p>
                        </div>
                        
                        <div>
                          <span className="text-slate-400 font-medium">Significance:</span>
                          <p className="mt-1 text-slate-300">{currentTimePeriod.significance}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Historical significance */}
              {showSignificance && significanceLevel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-medium text-sm">Significance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{significanceLevel.icon}</span>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: significanceLevel.color }}
                    >
                      {significanceLevel.label}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Entity types in current waypoint */}
              {currentWaypoint.dbRef && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'entities' ? null : 'entities')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 font-medium text-sm">Focus Areas</span>
                    </div>
                    {expandedSection === 'entities' ? 
                      <ChevronLeft className="w-4 h-4 text-slate-400" /> : 
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    }
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'entities' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1"
                      >
                        {/* Primary entity type */}
                        <div className="flex items-center space-x-2">
                          {React.createElement(
                            ENTITY_ICONS[currentWaypoint.dbRef.type as keyof typeof ENTITY_ICONS]?.icon || FileText,
                            { 
                              className: "w-4 h-4",
                              style: { color: ENTITY_ICONS[currentWaypoint.dbRef.type as keyof typeof ENTITY_ICONS]?.color || '#6b7280' }
                            }
                          )}
                          <span className="text-slate-300 text-sm capitalize">
                            Primary: {currentWaypoint.dbRef.type}
                          </span>
                        </div>

                        {/* Related entity types from context rules */}
                        {currentWaypoint.contextRules?.entityFilters?.types && (
                          <div className="mt-2">
                            <span className="text-slate-400 text-xs font-medium">Related Types:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {currentWaypoint.contextRules.entityFilters.types.map((type) => (
                                <div key={type} className="flex items-center space-x-1">
                                  {React.createElement(
                                    ENTITY_ICONS[type as keyof typeof ENTITY_ICONS]?.icon || FileText,
                                    { 
                                      className: "w-3 h-3",
                                      style: { color: ENTITY_ICONS[type as keyof typeof ENTITY_ICONS]?.color || '#6b7280' }
                                    }
                                  )}
                                  <span className="text-xs text-slate-400 capitalize">{type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Tour progress indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-2 border-t border-slate-700/50"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Tour Progress</span>
                  <span>{currentStep + 1} / {totalSteps}</span>
                </div>
                <div className="flex space-x-1">
                  {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-1 rounded ${
                        index <= currentStep 
                          ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Show button when hidden */}
      {!isVisible && autoHide && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsVisible(true)}
          className={`fixed ${getPositionClasses()} z-40 p-2 bg-slate-900/90 border border-green-400/30 rounded-lg hover:bg-slate-800/90 transition-colors`}
          title="Show historical context"
        >
          <Eye className="w-4 h-4 text-green-400" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}