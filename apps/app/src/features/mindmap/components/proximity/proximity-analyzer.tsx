'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Link,
  MessageSquare,
  X
} from 'lucide-react'
import { useProximityAnalysis, type ProximityAnalysisResult } from '@/features/mindmap/hooks/use-proximity-analysis'
import { cn } from '@/lib/utils'

interface ProximityAnalyzerProps {
  className?: string
  onCreateResearchSession?: (analysis: ProximityAnalysisResult) => void
  onConnectNodes?: (sourceId: string, targetId: string, reason: string) => void
}

export function ProximityAnalyzer({ 
  className, 
  onCreateResearchSession,
  onConnectNodes 
}: ProximityAnalyzerProps) {
  const {
    proximityEvents,
    proximityGroups,
    analysisResults,
    isAnalyzing,
    forceAnalysis,
    clearAnalysis,
    getAnalysis,
    config
  } = useProximityAnalysis()
  
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null)
  const [showEvents, setShowEvents] = useState(false)
  
  const recentEvents = proximityEvents.slice(-5).reverse()
  const activeGroups = proximityGroups.filter(group => group.nodes.length >= 2)
  
  return (
    <div className={cn(
      'bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-xl',
      'max-w-sm w-full max-h-[600px] overflow-hidden flex flex-col',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-green-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="w-5 h-5 text-green-400" />
              {isAnalyzing && (
                <motion.div
                  className="absolute -inset-1 border-2 border-green-400/50 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
            <h3 className="text-green-400 font-semibold">Proximity Analysis</h3>
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Target className="w-3 h-3" />
            <span>{config.proximityThreshold}px</span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
          <span>{activeGroups.length} active groups</span>
          <span>{analysisResults.length} analyses</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Active Proximity Groups */}
        {activeGroups.length > 0 && (
          <div className="p-4 space-y-3">
            <h4 className="text-sm font-medium text-green-300 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Active Proximity Groups</span>
            </h4>
            
            {activeGroups.map((group) => {
              const analysis = getAnalysis(group.id)
              const isExpanded = expandedAnalysis === group.id
              
              return (
                <motion.div
                  key={group.id}
                  className="bg-slate-800/50 border border-slate-600/50 rounded-lg overflow-hidden"
                  layout
                >
                  <div 
                    className="p-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                    onClick={() => setExpandedAnalysis(isExpanded ? null : group.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white text-sm font-medium">
                          Group {group.id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {analysis && (
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {group.nodes.map((node) => (
                        <span
                          key={node.id}
                          className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-400/30"
                        >
                          {node.data?.name || node.data?.label || node.id.slice(0, 8)}
                        </span>
                      ))}
                    </div>
                    
                    {!analysis && !isAnalyzing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          forceAnalysis(group.nodes.map(n => n.id))
                        }}
                        className="mt-2 text-xs px-3 py-1 bg-green-500/20 text-green-300 rounded border border-green-400/30 hover:bg-green-500/30 transition-colors"
                      >
                        Analyze Now
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && analysis && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-600/50"
                      >
                        <div className="p-3 space-y-3">
                          {/* Relationships */}
                          <div>
                            <h5 className="text-xs font-medium text-green-300 mb-1 flex items-center space-x-1">
                              <Link className="w-3 h-3" />
                              <span>Relationships</span>
                            </h5>
                            <div className="space-y-1">
                              {analysis.analysis.relationships.map((rel, idx) => (
                                <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                                  • {rel}
                                </p>
                              ))}
                            </div>
                          </div>
                          
                          {/* Common Themes */}
                          <div>
                            <h5 className="text-xs font-medium text-green-300 mb-1">Common Themes</h5>
                            <div className="flex flex-wrap gap-1">
                              {analysis.analysis.commonThemes.map((theme, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-1 py-0.5 bg-purple-500/20 text-purple-300 rounded"
                                >
                                  {theme}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Research Questions */}
                          <div>
                            <h5 className="text-xs font-medium text-green-300 mb-1 flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>Research Questions</span>
                            </h5>
                            <div className="space-y-1">
                              {analysis.analysis.researchQuestions.slice(0, 2).map((question, idx) => (
                                <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                                  • {question}
                                </p>
                              ))}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={() => onCreateResearchSession?.(analysis)}
                              className="flex-1 text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                            >
                              Research Session
                            </button>
                            {analysis.analysis.suggestedConnections.length > 0 && (
                              <button
                                onClick={() => {
                                  const connection = analysis.analysis.suggestedConnections[0]
                                  onConnectNodes?.(connection.sourceId, connection.targetId, connection.reason)
                                }}
                                className="flex-1 text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded border border-green-400/30 hover:bg-green-500/30 transition-colors"
                              >
                                Auto Connect
                              </button>
                            )}
                            <button
                              onClick={() => clearAnalysis(group.id)}
                              className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded border border-red-400/30 hover:bg-red-500/30 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
        
        {/* Recent Events */}
        <div className="border-t border-slate-700/50">
          <button
            onClick={() => setShowEvents(!showEvents)}
            className="w-full p-3 text-left hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Recent Events ({recentEvents.length})</span>
              </span>
              {showEvents ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>
          
          <AnimatePresence>
            {showEvents && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 space-y-2">
                  {recentEvents.map((event, idx) => (
                    <motion.div
                      key={`${event.id}-${event.timestamp.getTime()}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        'text-xs p-2 rounded border',
                        event.type === 'enter' && 'bg-green-500/10 border-green-500/30 text-green-300',
                        event.type === 'exit' && 'bg-red-500/10 border-red-500/30 text-red-300',
                        event.type === 'sustained' && 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">
                          {event.type === 'enter' && '→ Proximity Detected'}
                          {event.type === 'exit' && '← Proximity Ended'}
                          {event.type === 'sustained' && '⚡ Analysis Complete'}
                        </span>
                        <span className="opacity-70">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="opacity-80">
                        {event.nodes.map(n => n.data?.name || n.data?.label || n.id.slice(0, 8)).join(' ↔ ')}
                        {event.type !== 'exit' && (
                          <span className="ml-2">({Math.round(event.distance)}px)</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Empty State */}
      {activeGroups.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Target className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">No proximity detected</p>
            <p className="text-xs text-slate-500">
              Drag nodes close together to trigger analysis
            </p>
          </div>
        </div>
      )}
      
      {/* Loading Indicator */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
              </motion.div>
              <p className="text-sm text-green-300">Analyzing relationships...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}