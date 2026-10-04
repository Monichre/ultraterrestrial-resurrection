'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Check, 
  X, 
  Settings, 
  RefreshCw, 
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Link,
  Users,
  Clock,
  MapPin,
  Building2
} from 'lucide-react'
import { useSmartAutoConnection } from '@/features/mindmap/hooks/use-smart-auto-connection'
import { useMindMapStore } from '@/features/mindmap/store'

interface SmartAutoConnectionPanelProps {
  className?: string
}

export function SmartAutoConnectionPanel({ className = '' }: SmartAutoConnectionPanelProps) {
  const { nodes } = useMindMapStore()
  const {
    connectionSuggestions,
    autoConnectionsEnabled,
    isAnalyzing,
    acceptSuggestion,
    dismissSuggestion,
    clearAllSuggestions,
    toggleAutoConnections,
    forceAnalysis,
    config
  } = useSmartAutoConnection()
  
  const [isExpanded, setIsExpanded] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  
  // Get node data for displaying names
  const getNodeName = (nodeId: string): string => {
    const node = nodes.find(n => n.id === nodeId)
    return node?.data?.name || node?.data?.title || node?.data?.label || 'Unknown'
  }
  
  const getNodeType = (nodeId: string): string => {
    const node = nodes.find(n => n.id === nodeId)
    return node?.data?.type || 'unknown'
  }
  
  // Get icon for connection type
  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'spatial':
        return <MapPin className="w-4 h-4" />
      case 'temporal':
        return <Clock className="w-4 h-4" />
      case 'contextual':
        return <Brain className="w-4 h-4" />
      default:
        return <Link className="w-4 h-4" />
    }
  }
  
  // Get color for confidence level
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-400 bg-green-500/20'
    if (confidence >= 0.6) return 'text-blue-400 bg-blue-500/20'
    return 'text-yellow-400 bg-yellow-500/20'
  }
  
  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  if (nodes.length < 2) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 w-96 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl z-50 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="w-5 h-5 text-teal-400" />
            {isAnalyzing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <RefreshCw className="w-5 h-5 text-teal-400" />
              </motion.div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Smart Connections</h3>
            <p className="text-xs text-gray-400">
              {connectionSuggestions.length} suggestions found
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Auto-connection toggle */}
          <button
            onClick={toggleAutoConnections}
            className={`p-1 rounded transition-colors ${
              autoConnectionsEnabled 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-gray-500 hover:text-gray-400'
            }`}
            title={`Auto-connections ${autoConnectionsEnabled ? 'enabled' : 'disabled'}`}
          >
            <Zap className="w-4 h-4" />
          </button>
          
          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {/* Force refresh */}
          <button
            onClick={forceAnalysis}
            disabled={isAnalyzing}
            className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Force analysis"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Expand/collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 border-b border-gray-700 bg-gray-800/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">Auto-connect threshold</span>
                      <span className="text-xs text-gray-400">{Math.round(config.autoConnectThreshold * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">Suggestion threshold</span>
                      <span className="text-xs text-gray-400">{Math.round(config.suggestionThreshold * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">Max distance</span>
                      <span className="text-xs text-gray-400">{config.maxConnectionDistance}px</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestions List */}
            <div className="max-h-80 overflow-y-auto">
              {connectionSuggestions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analyzing connections...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Brain className="w-8 h-8 mx-auto text-gray-600" />
                      <p className="text-sm">No connection suggestions</p>
                      <p className="text-xs text-gray-600">
                        Add more nodes or adjust settings
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {connectionSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Connection visualization */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-300 truncate max-w-20">
                                {getNodeName(suggestion.sourceNodeId)}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({getNodeType(suggestion.sourceNodeId)})
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {getConnectionIcon(suggestion.connectionType)}
                              <motion.div
                                className="w-4 h-0.5 bg-gradient-to-r from-gray-500 to-gray-500"
                                animate={{ 
                                  background: [
                                    'linear-gradient(to right, #6b7280, #6b7280)',
                                    'linear-gradient(to right, #10b981, #3b82f6)',
                                    'linear-gradient(to right, #6b7280, #6b7280)'
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-300 truncate max-w-20">
                                {getNodeName(suggestion.targetNodeId)}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({getNodeType(suggestion.targetNodeId)})
                              </span>
                            </div>
                          </div>
                          
                          {/* Confidence and reason */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(suggestion.confidence)}`}>
                                {getConfidenceLabel(suggestion.confidence)} ({Math.round(suggestion.confidence * 100)}%)
                              </span>
                              <span className="text-xs text-gray-400 capitalize">
                                {suggestion.connectionType}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {suggestion.reason}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => acceptSuggestion(suggestion.id)}
                            className="p-1 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded transition-colors"
                            title="Accept connection"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => dismissSuggestion(suggestion.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                            title="Dismiss suggestion"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer actions */}
            {connectionSuggestions.length > 0 && (
              <div className="p-3 border-t border-gray-700 bg-gray-800/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {connectionSuggestions.length} suggestion{connectionSuggestions.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearAllSuggestions}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Auto-connection status indicator */}
      {autoConnectionsEnabled && (
        <div className="absolute -top-2 -right-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          >
            <Zap className="w-2 h-2 text-white" />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}