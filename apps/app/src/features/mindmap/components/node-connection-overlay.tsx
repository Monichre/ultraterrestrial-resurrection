'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Brain, ArrowRight, Loader, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConnectionSuggestion {
  id: string
  title: string
  type: string
  relationshipReason: string
  confidence: number
}

interface AIConnectionSuggestion {
  entity: string
  relationship: string
  evidence: string
  confidence: number
  type: 'personnel' | 'events' | 'organizations' | 'documents'
}

interface NodeConnectionOverlayProps {
  nodeId: string
  position: { x: number; y: number }
  visible: boolean
  onClose: () => void
  onAddConnection: (suggestionId: string) => void
}

export function NodeConnectionOverlay({ 
  nodeId, 
  position, 
  visible, 
  onClose, 
  onAddConnection 
}: NodeConnectionOverlayProps) {
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [nodeContext, setNodeContext] = useState('')
  
  // Fetch AI-powered connections for specific node
  const fetchNodeConnections = async (nodeName: string) => {
    setIsLoading(true)
    try {
      // Create targeted connection prompt for this specific node
      const connectPrompt = `/connect Find specific documented connections and relationships for "${nodeName}" in UAP/UFO research. Focus on real documented connections with key researchers like James Fox, Robert Dean, Nick Pope, incidents, organizations, and evidence. Provide specific reasoning based on documented evidence.`
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: connectPrompt
          }],
          system: `You are Prometheus, an expert UAP researcher analyzing connections for: "${nodeName}"

Provide 3-5 specific documented connections in this format:
- Entity Name: Specific documented relationship or connection (Confidence: XX%)

Focus on:
1. Direct documented relationships with UAP researchers/investigators
2. Connections to specific UAP incidents or cases
3. Organizational affiliations or collaborations
4. Documented evidence or testimony connections

Be specific about documented relationships, not speculative connections.`
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body reader available')
      }
      
      const decoder = new TextDecoder()
      let fullResponse = ''
      
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(line => line.trim())
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullResponse += parsed.content
                }
              } catch (e) {
                console.debug('Skipped chunk:', data)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
      
      // Parse AI response into connection suggestions
      const aiSuggestions = parseNodeConnectionResponse(fullResponse)
      setSuggestions(aiSuggestions)
      setNodeContext(`AI analysis for: ${nodeName}`)
      
    } catch (error) {
      console.error('Error fetching node connections:', error)
      setSuggestions([{
        id: 'error',
        title: 'Analysis Unavailable',
        type: 'system',
        relationshipReason: 'Unable to analyze connections. Please try again.',
        confidence: 0
      }])
      setNodeContext(`Error analyzing: ${nodeName}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Parse AI response into structured suggestions
  const parseNodeConnectionResponse = (aiText: string): ConnectionSuggestion[] => {
    const suggestions: ConnectionSuggestion[] = []
    const lines = aiText.split('\n').filter(line => line.trim())
    
    let idCounter = 1
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Look for connection patterns: "Entity Name: Description (Confidence: XX%)"
      if (trimmed.includes(':') && trimmed.length > 20 && trimmed.length < 200) {
        const parts = trimmed.split(':')
        if (parts.length >= 2) {
          const entityName = parts[0].replace(/^[\-\*\s\d\.]+/, '').trim()
          const description = parts.slice(1).join(':').trim()
          
          // Skip if entity name is too generic or empty
          if (entityName.length < 3 || entityName.toLowerCase().includes('entity')) {
            continue
          }
          
          // Extract confidence if present
          const confidenceMatch = description.match(/confidence[:\s]*(\d{1,3})%/i) || 
                                  description.match(/\((\d{1,3})%\)/)
          let confidence = 75 // default
          if (confidenceMatch) {
            confidence = parseInt(confidenceMatch[1])
          } else {
            // Infer confidence from language
            const descLower = description.toLowerCase()
            if (descLower.includes('documented') || descLower.includes('confirmed')) {
              confidence = 85
            } else if (descLower.includes('reported') || descLower.includes('stated')) {
              confidence = 70
            } else if (descLower.includes('possible') || descLower.includes('suggested')) {
              confidence = 55
            }
          }
          
          // Determine entity type
          const type = inferEntityTypeFromName(entityName)
          
          suggestions.push({
            id: (idCounter++).toString(),
            title: entityName,
            type,
            relationshipReason: description.replace(/\(\d{1,3}%\)/, '').trim(),
            confidence
          })
        }
      }
    }
    
    return suggestions.slice(0, 5) // Limit to top 5 suggestions
  }
  
  // Helper function to infer entity type from name
  const inferEntityTypeFromName = (name: string): string => {
    const nameLower = name.toLowerCase()
    if (nameLower.includes('dr.') || nameLower.includes('colonel') || nameLower.includes('sergeant') ||
        nameLower.includes('investigator') || nameLower.includes('researcher') || nameLower.includes('journalist') ||
        nameLower.includes('dean') || nameLower.includes('fox') || nameLower.includes('pope')) {
      return 'personnel'
    }
    if (nameLower.includes('incident') || nameLower.includes('sighting') || nameLower.includes('case') ||
        nameLower.includes('event') || nameLower.includes('investigation') || nameLower.includes('lights')) {
      return 'events'
    }
    if (nameLower.includes('project') || nameLower.includes('program') || nameLower.includes('organization') ||
        nameLower.includes('agency') || nameLower.includes('network') || nameLower.includes('ministry') ||
        nameLower.includes('nato') || nameLower.includes('mufon')) {
      return 'organizations'
    }
    if (nameLower.includes('report') || nameLower.includes('document') || nameLower.includes('file') ||
        nameLower.includes('testimony') || nameLower.includes('photos') || nameLower.includes('evidence')) {
      return 'documents'
    }
    return 'personnel' // default
  }
  
  // Trigger AI analysis when overlay becomes visible
  useEffect(() => {
    if (visible && nodeId) {
      // Extract node name from nodeId or use a placeholder
      const nodeName = nodeId.replace(/^node-/, '').replace(/-/g, ' ')
      fetchNodeConnections(nodeName)
    }
  }, [visible, nodeId])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Overlay Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-50 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-80"
            style={{
              left: Math.min(position.x, window.innerWidth - 320),
              top: Math.min(position.y, window.innerHeight - 300)
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-white/10">
              {isLoading ? (
                <Loader className="w-4 h-4 text-teal-400 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 text-teal-400" />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-white text-sm">
                  {isLoading ? 'Analyzing...' : 'Smart Connections'}
                </h3>
                <p className="text-xs text-white/60">
                  {nodeContext || 'Prometheus AI analysis'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white/60 hover:text-white">
                ×
              </Button>
            </div>

            {/* Suggestions List */}
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded mb-2" />
                        <div className="h-3 bg-white/5 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer group transition-colors"
                    onClick={() => onAddConnection(suggestion.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                        <Plus className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white text-sm truncate">
                            {suggestion.title}
                          </h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            suggestion.confidence >= 80 ? 'bg-green-500/20 text-green-400' :
                            suggestion.confidence >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {suggestion.confidence}%
                          </span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed mb-2">
                          {suggestion.relationshipReason}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/40 capitalize">
                            {suggestion.type}
                          </span>
                          <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-teal-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-white/40">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No connections found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-black/30">
              {suggestions.length > 0 && !isLoading && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fetchNodeConnections(nodeId.replace(/^node-/, '').replace(/-/g, ' '))}
                  className="w-full mb-2 text-teal-400 hover:text-white hover:bg-teal-500/20 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> Find More Connections
                </Button>
              )}
              <div className="text-xs text-white/40 text-center">
                Powered by Prometheus AI • UAP Knowledge Base
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}