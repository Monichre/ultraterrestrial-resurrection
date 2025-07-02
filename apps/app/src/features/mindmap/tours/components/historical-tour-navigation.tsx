'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Clock, 
  MapPin, 
  Eye,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Star
} from 'lucide-react'
import { useTour } from '../hooks/use-tour'
import { useTourContext } from '../contexts/tour-context'
import { type TourWaypoint } from '../types/tour'

interface HistoricalTourNavigationProps {
  className?: string
  onTourModeChange?: (mode: 'guided' | 'free-form' | null) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface HistoricalPeriod {
  id: string
  name: string
  yearRange: string
  color: string
  significance: string
  keyEvents: number
}

const HISTORICAL_PERIODS: HistoricalPeriod[] = [
  {
    id: 'early-sightings',
    name: 'Early Sightings',
    yearRange: '1940-1950',
    color: '#8B5CF6',
    significance: 'First documented cases and Roswell incident',
    keyEvents: 12
  },
  {
    id: 'cold-war-era',
    name: 'Cold War Era',
    yearRange: '1950-1970',
    color: '#3B82F6',
    significance: 'Military investigations and Project Blue Book',
    keyEvents: 24
  },
  {
    id: 'modern-research',
    name: 'Modern Research',
    yearRange: '1970-2000',
    color: '#10B981',
    significance: 'Scientific study and civilian research groups',
    keyEvents: 18
  },
  {
    id: 'disclosure-era',
    name: 'Disclosure Era',
    yearRange: '2000-Present',
    color: '#F59E0B',
    significance: 'Government transparency and UAP acknowledgment',
    keyEvents: 31
  }
]

export function HistoricalTourNavigation({ 
  className, 
  onTourModeChange, 
  isCollapsed = false,
  onToggleCollapse 
}: HistoricalTourNavigationProps) {
  const {
    currentTour,
    currentWaypoint,
    tourProgress,
    currentStep,
    totalSteps,
    progressPercentage,
    canGoNext,
    canGoPrevious,
    canSkip,
    isLoading,
    loadTour,
    navigateToWaypoint,
    nextWaypoint,
    previousWaypoint,
    skipWaypoint,
    completeTour,
    resetTour,
    tourContext,
    tourMode,
    suggestNextHistoricalRecords,
    toggleTourMode
  } = useTour({
    showProgressIndicator: true,
    allowSkipping: true,
    allowBacktracking: true
  })
  
  // Use tour context for global tour state management
  const tourContextData = useTourContext()

  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [showNarrative, setShowNarrative] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const narrativeRef = useRef<HTMLDivElement>(null)

  // GSAP timeline for animations
  const animationRef = useRef<gsap.core.Timeline | null>(null)

  // Initialize GSAP animations
  useEffect(() => {
    if (!containerRef.current) return

    // Create main animation timeline
    const tl = gsap.timeline({ paused: true })
    animationRef.current = tl

    // Set initial states
    gsap.set('.tour-waypoint-marker', { scale: 0, opacity: 0 })
    gsap.set('.tour-progress-bar', { scaleX: 0 })
    gsap.set('.tour-narrative-panel', { y: 20, opacity: 0 })

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [])

  // Animate tour progress changes
  useEffect(() => {
    if (!animationRef.current) return

    // Animate progress bar
    gsap.to('.tour-progress-bar', {
      scaleX: progressPercentage / 100,
      duration: 0.8,
      ease: 'power2.out'
    })

    // Animate current waypoint marker
    gsap.to(`.tour-waypoint-marker[data-step="${currentStep}"]`, {
      scale: 1.2,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })

    // Reset other markers
    gsap.to(`.tour-waypoint-marker:not([data-step="${currentStep}"])`, {
      scale: 1,
      opacity: 0.6,
      duration: 0.3,
      ease: 'power2.out'
    })
  }, [currentStep, progressPercentage])

  // Animate narrative changes with GSAP
  useEffect(() => {
    if (!currentWaypoint || !narrativeRef.current) return

    const narrativeElement = narrativeRef.current

    // Animate out old narrative
    gsap.to(narrativeElement, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        // Update content and animate in
        gsap.set(narrativeElement, { y: 10 })
        gsap.to(narrativeElement, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      }
    })
  }, [currentWaypoint?.id])

  // Auto-progress functionality
  useEffect(() => {
    if (!isPlaying || !canGoNext) return

    const interval = setInterval(() => {
      nextWaypoint()
    }, 8000) // 8 seconds per waypoint

    return () => clearInterval(interval)
  }, [isPlaying, canGoNext, nextWaypoint])

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleTourStart = useCallback(async (mode: 'guided' | 'free-form' = 'guided') => {
    // Load a default historical tour
    const historicalTour = {
      id: 'historical-disclosure-tour',
      title: 'Historical Disclosure Journey',
      description: 'A guided tour through the major events of UFO/UAP disclosure from 1947 to present',
      difficulty: 'beginner' as const,
      estimatedDuration: 45,
      tags: ['historical', 'disclosure', 'timeline'],
      waypoints: HISTORICAL_PERIODS.map((period, index) => ({
        id: `waypoint-${period.id}`,
        title: period.name,
        dbRef: {
          type: 'events' as const,
          id: period.id,
          fallbackQuery: `events from ${period.yearRange}`
        },
        narrative: `Explore the ${period.name} (${period.yearRange}): ${period.significance}`,
        contextRules: {
          temporalWindow: {
            startYear: parseInt(period.yearRange.split('-')[0]),
            endYear: parseInt(period.yearRange.split('-')[1]) || new Date().getFullYear()
          },
          entityFilters: {
            types: ['events', 'personnel', 'documents'],
            requiredTags: [period.id]
          }
        },
        visualSettings: {
          cameraPosition: {
            zoom: 1 + (index * 0.2),
            center: { x: 0, y: 0 }
          },
          layoutPreference: 'horizontal' as const,
          animationDuration: 1000
        }
      }))
    }

    await loadTour(historicalTour)
    onTourModeChange?.(mode)
    
    // Animate tour start
    gsap.to('.tour-waypoint-marker', {
      scale: 1,
      opacity: 0.6,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    })
  }, [loadTour, onTourModeChange])

  const handlePeriodSelect = useCallback((periodId: string) => {
    const periodIndex = HISTORICAL_PERIODS.findIndex(p => p.id === periodId)
    if (periodIndex !== -1) {
      navigateToWaypoint(periodIndex)
      setSelectedPeriod(periodId)
    }
  }, [navigateToWaypoint])

  const getCurrentPeriod = useCallback(() => {
    if (!currentTour || currentStep >= HISTORICAL_PERIODS.length) return null
    return HISTORICAL_PERIODS[currentStep]
  }, [currentTour, currentStep])

  if (isCollapsed) {
    return (
      <motion.div 
        className={`bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-2 ${className || ''}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen size={16} className="text-green-400" />
            <span className="text-sm text-slate-300">
              {currentTour ? `${currentStep + 1}/${totalSteps}` : 'Historical Tour'}
            </span>
          </div>
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-green-400 transition-colors p-1"
          >
            <ChevronUp size={16} />
          </button>
        </div>
        
        {currentTour && (
          <div className="mt-2">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-400 tour-progress-bar"
                initial={{ scaleX: 0 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div 
      ref={containerRef}
      className={`bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg overflow-hidden ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="p-3 border-b border-green-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen size={18} className="text-green-400" />
            <h3 className="text-green-400 font-semibold">Historical Tour</h3>
            {currentTour && (
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                {currentStep + 1}/{totalSteps}
              </span>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-green-400 transition-colors p-1"
          >
            <ChevronDown size={16} />
          </button>
        </div>
        
        {currentTour && (
          <div className="mt-2">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 tour-progress-bar"
                initial={{ scaleX: 0 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Timeline Visualization */}
      <div ref={timelineRef} className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-slate-300">Historical Timeline</h4>
          <div className="flex items-center space-x-1">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400">1947 → Present</span>
          </div>
        </div>
        
        <div className="relative">
          {/* Timeline track */}
          <div className="h-1 bg-slate-700 rounded-full mb-6 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 via-green-400 to-yellow-400 tour-progress-bar"
              initial={{ scaleX: 0 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
          
          {/* Waypoint markers */}
          <div className="absolute top-0 left-0 right-0 flex justify-between -mt-2">
            {HISTORICAL_PERIODS.map((period, index) => (
              <motion.button
                key={period.id}
                className={`tour-waypoint-marker relative group ${
                  currentStep === index ? 'z-10' : 'z-0'
                }`}
                data-step={index}
                onClick={() => handlePeriodSelect(period.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
              >
                <div 
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                    currentStep === index 
                      ? 'bg-white scale-125 shadow-xl' 
                      : 'bg-transparent hover:bg-white/20'
                  }`}
                  style={{ backgroundColor: currentStep === index ? period.color : undefined }}
                />
                
                {/* Period tooltip */}
                <motion.div
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800/95 border border-green-400/30 rounded-lg p-2 min-w-32 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  <div className="text-xs text-center">
                    <div className="font-medium text-green-400">{period.name}</div>
                    <div className="text-slate-400">{period.yearRange}</div>
                    <div className="text-slate-300 mt-1">{period.keyEvents} events</div>
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Period Info */}
      {currentTour && getCurrentPeriod() && (
        <div className="px-4 pb-2">
          <motion.div
            className="bg-slate-800/50 rounded-lg p-3 border border-green-400/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-green-400">{getCurrentPeriod()?.name}</h5>
              <span className="text-xs text-slate-400">{getCurrentPeriod()?.yearRange}</span>
            </div>
            <p className="text-sm text-slate-300 mb-3">{getCurrentPeriod()?.significance}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Star size={12} />
                <span>{getCurrentPeriod()?.keyEvents} key events</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={12} />
                <span>Global significance</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Narrative Panel */}
      <AnimatePresence>
        {showNarrative && currentWaypoint && (
          <motion.div
            ref={narrativeRef}
            className="p-4 bg-slate-800/30 border-t border-green-400/20 tour-narrative-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-start justify-between mb-2">
              <h5 className="font-medium text-green-400">{currentWaypoint.title}</h5>
              <button
                onClick={() => setShowNarrative(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Eye size={14} />
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{currentWaypoint.narrative}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="p-4 border-t border-green-400/20">
        {!currentTour ? (
          <div className="space-y-2">
            <button
              onClick={() => handleTourStart('guided')}
              className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <Play size={16} />
              <span>Start Guided Tour</span>
            </button>
            <button
              onClick={() => handleTourStart('free-form')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <Eye size={16} />
              <span>Free Exploration</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className={`p-2 rounded-lg transition-colors ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <button
                onClick={previousWaypoint}
                disabled={!canGoPrevious}
                className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <SkipBack size={16} />
              </button>
              
              <button
                onClick={nextWaypoint}
                disabled={!canGoNext}
                className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <SkipForward size={16} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={resetTour}
                className="p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-700"
                title="Reset Tour"
              >
                <RotateCcw size={16} />
              </button>
              
              {!showNarrative && (
                <button
                  onClick={() => setShowNarrative(true)}
                  className="p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-700"
                  title="Show Narrative"
                >
                  <Eye size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}