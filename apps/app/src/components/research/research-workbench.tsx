'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResearchInterface } from './research-interface'
import { useResearch } from '@/contexts/research/research-context'
import { PinnedCardsCanvas } from './pinned-cards-canvas'
import { cn } from '@/lib/utils'
import { Sparkles, FileText, Users, Calendar, Zap, ArrowRight, RotateCcw } from 'lucide-react'

type WorkbenchMode = 'discovery' | 'research' | 'analysis'

interface ResearchWorkbenchProps {
  className?: string
}

export function ResearchWorkbench({ className }: ResearchWorkbenchProps) {
  const [mode, setMode] = useState<WorkbenchMode>('discovery')
  const [showTransition, setShowTransition] = useState(false)
  
  const { 
    pinnedCards, 
    selectedCard,
    pinCard,
    unpinCard,
    getAIInsights,
    findCardConnections
  } = useResearch()

  // Auto-transition to research mode when first card is pinned
  useEffect(() => {
    if (pinnedCards.length === 1 && mode === 'discovery') {
      setShowTransition(true)
      setTimeout(() => {
        setMode('research')
        setShowTransition(false)
      }, 2000)
    }
  }, [pinnedCards.length, mode])

  const handleCardAnalyze = useCallback(async (card: any) => {
    console.log('Analyzing card:', card)
    
    // Trigger AI analysis
    const insights = await getAIInsights()
    const connections = await findCardConnections(card.id)
    
    console.log('AI Insights:', insights)
    console.log('Connections:', connections)
    
    // You could update the card with analysis results
    // or show them in a sidebar/modal
  }, [getAIInsights, findCardConnections])

  const handleCardConnect = useCallback(async (sourceCard: any, targetCard: any) => {
    console.log('Creating connection:', sourceCard.id, '→', targetCard.id)
    
    // This would create a research connection between cards
    // Could be stored in your research session or database
  }, [])

  const handleModeSwitch = useCallback((newMode: WorkbenchMode) => {
    setMode(newMode)
  }, [])

  const resetToDiscovery = useCallback(() => {
    setMode('discovery')
    // Could also clear pinned cards if desired
  }, [])

  return (
    <div className={cn('h-full flex flex-col bg-black text-green-400', className)}>
      {/* Header with mode indicators */}
      <div className="bg-black border-b border-green-400/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-green-400">RESEARCH WORKBENCH</h1>
            
            {/* Mode indicators */}
            <div className="flex items-center space-x-1">
              <ModeIndicator 
                mode="discovery" 
                isActive={mode === 'discovery'}
                isCompleted={pinnedCards.length > 0}
                icon={<Sparkles className="w-4 h-4" />}
                onClick={() => handleModeSwitch('discovery')}
              />
              <ArrowRight className="w-4 h-4 text-green-400/30" />
              <ModeIndicator 
                mode="research" 
                isActive={mode === 'research'}
                isCompleted={mode === 'analysis'}
                icon={<FileText className="w-4 h-4" />}
                onClick={() => handleModeSwitch('research')}
                disabled={pinnedCards.length === 0}
              />
              <ArrowRight className="w-4 h-4 text-green-400/30" />
              <ModeIndicator 
                mode="analysis" 
                isActive={mode === 'analysis'}
                isCompleted={false}
                icon={<Zap className="w-4 h-4" />}
                onClick={() => handleModeSwitch('analysis')}
                disabled={pinnedCards.length < 2}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-green-400/70">
              {selectedCard && (
                <span className="flex items-center space-x-1">
                  <span>Selected:</span>
                  <span className="text-green-400">{selectedCard.data?.name || selectedCard.id}</span>
                </span>
              )}
              {pinnedCards.length > 0 && (
                <span className="flex items-center space-x-1">
                  <span>Pinned:</span>
                  <span className="text-green-400">{pinnedCards.length}</span>
                </span>
              )}
            </div>
            
            {/* Reset button */}
            {mode !== 'discovery' && (
              <button
                onClick={resetToDiscovery}
                className="flex items-center space-x-1 text-xs text-green-400/70 hover:text-green-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'discovery' && (
            <DiscoveryMode key="discovery" />
          )}
          {mode === 'research' && (
            <ResearchMode 
              key="research"
              onCardAnalyze={handleCardAnalyze}
              onCardConnect={handleCardConnect}
            />
          )}
          {mode === 'analysis' && (
            <AnalysisMode key="analysis" />
          )}
        </AnimatePresence>

        {/* Transition overlay */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center space-y-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  className="text-6xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-green-400">
                  Welcome to your Research Canvas!
                </h2>
                <p className="text-green-400/70">
                  Your pinned entities are ready for deep analysis
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Mode indicator component
function ModeIndicator({ 
  mode, 
  isActive, 
  isCompleted, 
  icon, 
  onClick, 
  disabled = false 
}: {
  mode: string
  isActive: boolean
  isCompleted: boolean
  icon: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all',
        isActive && 'bg-green-400/20 text-green-400 ring-1 ring-green-400/50',
        isCompleted && !isActive && 'bg-green-400/10 text-green-400/80',
        !isActive && !isCompleted && !disabled && 'text-green-400/50 hover:text-green-400/70',
        disabled && 'text-green-400/30 cursor-not-allowed'
      )}
    >
      {icon}
      <span className="text-sm font-medium capitalize">{mode}</span>
      {isCompleted && !isActive && (
        <span className="text-xs">✓</span>
      )}
    </button>
  )
}

// Discovery mode - would integrate with your mindmap
function DiscoveryMode() {
  return (
    <motion.div
      className="h-full p-8 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center space-y-6 max-w-2xl">
        <motion.div
          className="text-8xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🗺️
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-green-400">
            Discovery Mode
          </h2>
          <p className="text-green-400/70 text-lg">
            Explore the knowledge graph, find interesting connections, and pin entities to your research canvas.
          </p>
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 mt-6">
            <p className="text-green-400 text-sm">
              💡 <strong>Tip:</strong> This would integrate with your mindmap visualization. 
              Users would explore entities, see proximity relationships, and drag cards to pin them for research.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Research mode - uses the existing research interface
function ResearchMode({ 
  onCardAnalyze, 
  onCardConnect 
}: { 
  onCardAnalyze: (card: any) => void
  onCardConnect: (source: any, target: any) => void 
}) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <ResearchInterface />
    </motion.div>
  )
}

// Analysis mode - advanced research features
function AnalysisMode() {
  const { pinnedCards, getAIInsights } = useResearch()
  const [insights, setInsights] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true)
    try {
      const aiInsights = await getAIInsights()
      setInsights(aiInsights)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [getAIInsights])

  useEffect(() => {
    if (pinnedCards.length >= 2) {
      runAnalysis()
    }
  }, [pinnedCards.length, runAnalysis])

  return (
    <motion.div
      className="h-full p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Left: Canvas visualization */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-400">Research Canvas</h3>
          <div className="h-96 border border-green-400/20 rounded-lg">
            <PinnedCardsCanvas 
              pinnedCards={pinnedCards}
              onUnpinCard={() => {}} // Disabled in analysis mode
              className="h-full"
            />
          </div>
        </div>

        {/* Right: AI Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-400">AI Analysis</h3>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-3 py-1 bg-green-400/20 text-green-400 rounded-lg hover:bg-green-400/30 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span className="text-sm">Analyze</span>
            </button>
          </div>

          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <motion.div
                  key={index}
                  className="bg-green-400/10 border border-green-400/30 rounded-lg p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-green-400 text-sm">{insight}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-green-400/50">
                {isAnalyzing ? 'Analyzing relationships...' : 'No insights yet'}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}