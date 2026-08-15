'use client'

import {useState, useEffect, useCallback} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Plus, Brain, ArrowRight, Loader, Sparkles} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useMindMapAgent} from '@/features/mindmap/hooks/use-mindmap-agent'

interface ConnectionSuggestion {
  id: string
  title: string
  type: string
  relationshipReason: string
  confidence: number
  record?: Record<string, unknown>
}

type SearchRecord = Record<string, unknown> & {
  id?: string
  xata_table?: string
  type?: string
  title?: string
  name?: string
  subject?: string
}

interface NodeConnectionOverlayProps {
  nodeId: string
  nodeLabel: string
  position: {x: number; y: number}
  visible: boolean
  onClose: () => void
  onAddConnection?: (suggestionId: string) => void
}

export function NodeConnectionOverlay({
  nodeId,
  nodeLabel,
  position,
  visible,
  onClose,
  onAddConnection,
}: NodeConnectionOverlayProps) {
  const {addConnectionNodesFromSearch} = useMindMap()
  const {runAgentQuery} = useMindMapAgent()
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [nodeContext, setNodeContext] = useState('')

  // Fetch AI-powered connections for specific node
  const fetchNodeConnections = useCallback(async (nodeName: string) => {
    setIsLoading(true)
    try {
      const agentResult = await runAgentQuery({
        message: `Find up to 5 documented UAP/UFO records directly connected to "${nodeName}". Prioritize records with explicit historical, organizational, witness, or evidence links and explain each connection briefly.`,
      })

      const aiSuggestions = (agentResult.search?.records || [])
        .slice(0, 5)
        .map((record) => {
          const typedRecord = record as SearchRecord
          const title =
            typedRecord.title || typedRecord.name || typedRecord.subject || 'Untitled Record'

          return {
            id: typedRecord.id || `${typedRecord.xata_table || 'record'}-${title}`,
            title,
            type: inferEntityType(typedRecord),
            relationshipReason:
              extractReasoningForRecord(agentResult.analysis, title) ||
              `Related to ${nodeName} through Prometheus contextual analysis.`,
            confidence: 80,
            record: typedRecord,
          }
        })

      setSuggestions(aiSuggestions)
      setNodeContext(`AI analysis for: ${nodeName}`)
    } catch (error) {
      console.error('Error fetching node connections:', error)
      setSuggestions([
        {
          id: 'error',
          title: 'Analysis Unavailable',
          type: 'system',
          relationshipReason: 'Unable to analyze connections. Please try again.',
          confidence: 0,
        },
      ])
      setNodeContext(`Error analyzing: ${nodeName}`)
    } finally {
      setIsLoading(false)
    }
  }, [runAgentQuery])

  const extractReasoningForRecord = (analysis: string, recordTitle: string): string | null => {
    if (!analysis || !recordTitle) return null

    const normalizedTitle = recordTitle.toLowerCase()
    const matchingLine = analysis
      .split('\n')
      .find((line) => line.toLowerCase().includes(normalizedTitle))

    return matchingLine?.trim() || null
  }

  const inferEntityType = (record: SearchRecord): string => {
    const table = record.xata_table || record.type
    if (table) return table

    const title = `${record.title || record.name || record.subject || ''}`.toLowerCase()
    if (title.includes('report') || title.includes('memo') || title.includes('document')) {
      return 'documents'
    }
    if (title.includes('incident') || title.includes('event') || title.includes('case')) {
      return 'events'
    }
    if (title.includes('project') || title.includes('agency') || title.includes('organization')) {
      return 'organizations'
    }

    return 'personnel'
  }

  const handleAddSuggestion = (suggestion: ConnectionSuggestion) => {
    if (!suggestion.record) return

    const connection = addConnectionNodesFromSearch({
      source: {
        id: nodeId,
      },
      searchResults: [
        {
          ...(suggestion.record as SearchRecord),
          id: (suggestion.record as SearchRecord).id || suggestion.id,
          type: suggestion.type,
          label: suggestion.title,
          title: suggestion.title,
          name: suggestion.title,
        },
      ],
    })

    if (connection) {
      onAddConnection?.(suggestion.id)
      onClose()
    }
  }

  // Trigger AI analysis when overlay becomes visible
  useEffect(() => {
    if (visible && nodeLabel) {
      fetchNodeConnections(nodeLabel)
    }
  }, [fetchNodeConnections, visible, nodeLabel])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40'
            onClick={onClose}
          />

          {/* Overlay Panel */}
          <motion.div
            initial={{opacity: 0, scale: 0.9, y: 10}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.9, y: 10}}
            className='fixed z-50 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-80'
            style={{
              left: Math.min(position.x, window.innerWidth - 320),
              top: Math.min(position.y, window.innerHeight - 300),
            }}>
            {/* Header */}
            <div className='flex items-center gap-2 p-4 border-b border-white/10'>
              {isLoading ? (
                <Loader className='w-4 h-4 text-teal-400 animate-spin' />
              ) : (
                <Brain className='w-4 h-4 text-teal-400' />
              )}
              <div className='flex-1'>
                <h3 className='font-medium text-white text-sm'>
                  {isLoading ? 'Analyzing...' : 'Smart Connections'}
                </h3>
                <p className='text-xs text-white/60'>{nodeContext || 'Prometheus AI analysis'}</p>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='text-white/60 hover:text-white'>
                ×
              </Button>
            </div>

            {/* Suggestions List */}
            <div className='max-h-64 overflow-y-auto'>
              {isLoading ? (
                <div className='p-4 space-y-3'>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className='animate-pulse flex items-start gap-3'>
                      <div className='w-8 h-8 bg-white/10 rounded-lg' />
                      <div className='flex-1'>
                        <div className='h-4 bg-white/10 rounded mb-2' />
                        <div className='h-3 bg-white/5 rounded w-3/4' />
                      </div>
                    </div>
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: index * 0.1}}
                    className='p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer group transition-colors'
                    onClick={() => handleAddSuggestion(suggestion)}>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center group-hover:bg-teal-500/30 transition-colors'>
                        <Plus className='w-4 h-4 text-teal-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <h4 className='font-medium text-white text-sm truncate'>
                            {suggestion.title}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              suggestion.confidence >= 80
                                ? 'bg-green-500/20 text-green-400'
                                : suggestion.confidence >= 60
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}>
                            {suggestion.confidence}%
                          </span>
                        </div>
                        <p className='text-xs text-white/60 leading-relaxed mb-2'>
                          {suggestion.relationshipReason}
                        </p>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs text-white/40 capitalize'>
                            {suggestion.type}
                          </span>
                          <ArrowRight className='w-3 h-3 text-white/40 group-hover:text-teal-400 transition-colors' />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className='p-8 text-center text-white/40'>
                  <Brain className='w-8 h-8 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>No connections found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className='p-3 border-t border-white/10 bg-black/30'>
              {suggestions.length > 0 && !isLoading && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => fetchNodeConnections(nodeLabel)}
                  className='w-full mb-2 text-teal-400 hover:text-white hover:bg-teal-500/20 text-xs'>
                  <Sparkles className='w-3 h-3 mr-1' /> Find More Connections
                </Button>
              )}
              <div className='text-xs text-white/40 text-center'>
                Powered by Prometheus • UAP Research/Intelligence Corpus
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
