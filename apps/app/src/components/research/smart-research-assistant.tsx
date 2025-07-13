'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSmartResearchIntegration } from '@/features/mindmap/smart-integration/use-smart-tour-integration'
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Search, 
  Target, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Clock,
  MapPin,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SmartResearchAssistantProps {
  className?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function SmartResearchAssistant({ 
  className, 
  isMinimized = false,
  onToggleMinimize 
}: SmartResearchAssistantProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'insights' | 'context'>('suggestions')
  
  const {
    researchSuggestions,
    spatialInsights,
    patternInsights,
    contextualIntelligence,
    applyResearchSuggestion,
    getResearchSearchRules,
    generateResearchQuery
  } = useSmartResearchIntegration()

  const handleApplySuggestion = useCallback((suggestionId: string) => {
    applyResearchSuggestion(suggestionId)
  }, [applyResearchSuggestion])

  const handleGenerateQuery = useCallback((intent: string) => {
    const query = generateResearchQuery(intent)
    console.log('Generated contextual query:', query)
    // This could be used to auto-populate search fields or trigger searches
  }, [generateResearchQuery])

  if (isMinimized) {
    return (
      <motion.div 
        className={cn(
          "bg-slate-900/95 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-xl",
          "p-3 cursor-pointer",
          className
        )}
        onClick={onToggleMinimize}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Smart Assistant</span>
          {researchSuggestions.length > 0 && (
            <span className="bg-blue-500/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">
              {researchSuggestions.length}
            </span>
          )}
          <ChevronUp className="w-4 h-4 text-slate-400" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={cn(
        "bg-slate-900/95 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-xl",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-600/30">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300 font-semibold">Smart Research Assistant</h3>
        </div>
        <button 
          onClick={onToggleMinimize}
          className="text-slate-400 hover:text-slate-300 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-600/30">
        {[
          { id: 'suggestions', label: 'Suggestions', icon: Target, count: researchSuggestions.length },
          { id: 'insights', label: 'Insights', icon: Lightbulb, count: [...spatialInsights, ...patternInsights].length },
          { id: 'context', label: 'Context', icon: TrendingUp, count: contextualIntelligence.dominantThemes.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm transition-colors",
              activeTab === tab.id 
                ? "text-blue-300 bg-blue-900/30 border-b-2 border-blue-400" 
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="bg-slate-600 text-slate-300 text-xs px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Research Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {researchSuggestions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No research suggestions available</p>
                  <p className="text-xs mt-1">Add entities to your research canvas to get AI-powered suggestions</p>
                </div>
              ) : (
                researchSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 hover:bg-slate-800/70 transition-colors cursor-pointer"
                    onClick={() => handleApplySuggestion(suggestion.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-400 mt-0.5">
                        {suggestion.type === 'related-entity' && <Search className="w-4 h-4" />}
                        {suggestion.type === 'spatial-connection' && <MapPin className="w-4 h-4" />}
                        {suggestion.type === 'temporal-context' && <Clock className="w-4 h-4" />}
                        {suggestion.type === 'narrative-bridge' && <TrendingUp className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-200 text-sm font-medium mb-1">
                          {suggestion.title}
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                              {suggestion.type.replace('-', ' ')}
                            </span>
                            <span className="text-xs text-slate-500">
                              {Math.round(suggestion.confidence * 100)}% confidence
                            </span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {[...spatialInsights, ...patternInsights].length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No insights discovered yet</p>
                  <p className="text-xs mt-1">Pin more entities to discover patterns and connections</p>
                </div>
              ) : (
                [...spatialInsights, ...patternInsights].map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-purple-300 text-sm font-medium">
                        {insight.title}
                      </h4>
                      <span className="text-purple-400 text-xs">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed mb-2">
                      {insight.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                        {insight.type.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-purple-400">
                        {insight.impactPotential} impact
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Context Tab */}
          {activeTab === 'context' && (
            <motion.div
              key="context"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Dominant Themes */}
              <div>
                <h4 className="text-slate-300 text-sm font-medium mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Dominant Themes</span>
                </h4>
                {contextualIntelligence.dominantThemes.length === 0 ? (
                  <p className="text-slate-400 text-xs">No themes identified yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {contextualIntelligence.dominantThemes.map(theme => (
                      <span 
                        key={theme} 
                        className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Temporal Focus */}
              <div>
                <h4 className="text-slate-300 text-sm font-medium mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Temporal Focus</span>
                </h4>
                <div className="bg-slate-800/50 border border-slate-600/30 rounded p-3">
                  <div className="text-slate-200 text-sm font-medium">
                    {contextualIntelligence.temporalFocus.era}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {contextualIntelligence.temporalFocus.yearRange[0]} - {contextualIntelligence.temporalFocus.yearRange[1]}
                  </div>
                  <div className="text-slate-400 text-xs mt-2">
                    {contextualIntelligence.temporalFocus.significance}
                  </div>
                </div>
              </div>

              {/* Spatial Context */}
              <div>
                <h4 className="text-slate-300 text-sm font-medium mb-2 flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Geographic Scope</span>
                </h4>
                <div className="bg-slate-800/50 border border-slate-600/30 rounded p-3">
                  <div className="text-slate-200 text-sm">
                    {contextualIntelligence.spatialRelevance.geographicScope}
                  </div>
                  {contextualIntelligence.spatialRelevance.locations.length > 0 && (
                    <div className="text-slate-400 text-xs mt-1">
                      Key locations: {contextualIntelligence.spatialRelevance.locations.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Network Strength */}
              <div>
                <h4 className="text-slate-300 text-sm font-medium mb-2 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Entity Network Strength</span>
                </h4>
                <div className="bg-slate-800/50 border border-slate-600/30 rounded p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${contextualIntelligence.entityNetworkStrength * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <span className="text-slate-200 text-sm">
                      {Math.round(contextualIntelligence.entityNetworkStrength * 100)}%
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-2">
                    Connection strength between research entities
                  </div>
                </div>
              </div>

              {/* Smart Search Rules */}
              <div>
                <h4 className="text-slate-300 text-sm font-medium mb-2">
                  Current Search Context
                </h4>
                <div className="bg-slate-800/50 border border-slate-600/30 rounded p-3">
                  <div className="text-slate-400 text-xs leading-relaxed">
                    {getResearchSearchRules()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}