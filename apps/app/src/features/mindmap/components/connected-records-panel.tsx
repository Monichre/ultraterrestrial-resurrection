'use client'

import {useState, useEffect, useCallback} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {
  Brain,
  Users,
  Building2,
  Clock,
  MapPin,
  ChevronRight,
  Loader,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useMindMapAgent} from '@/features/mindmap/hooks/use-mindmap-agent'
import {
  getGraphContext,
  isRecordRelated,
  generateContextualSearchRules,
} from '@/features/mindmap/utils/contextual-intelligence'
import {Button} from '@/components/ui/button'

interface ConnectedRecord {
  id: string
  type: 'personnel' | 'organizations' | 'events' | 'documents' | 'testimonies'
  title: string
  snippet: string
  relationshipScore: number
  relationshipType: 'personnel' | 'temporal' | 'organizational' | 'topic' | 'location'
  confidence: number
}

export function ConnectedRecordsPanel() {
  const {getNodes} = useMindMap()
  const {runAgentQuery} = useMindMapAgent()
  const [suggestions, setSuggestions] = useState<ConnectedRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)

  // Fetch connections using comprehensive disclosure API with Prometheus AI + agentic tools
  const fetchContextualConnections = useCallback(async () => {
    const nodes = getNodes()
    setLoading(true)

    try {
      // Filter to get actual data nodes (not user input nodes)
      const dataNodes = nodes.filter(
        (node) =>
          node &&
          node.type &&
          node.type !== 'userInputNode' &&
          node.data &&
          (node.data.name || node.data.title || node.data.label)
      )

      console.log(
        'ConnectedRecordsPanel: Total nodes:',
        nodes.length,
        'Data nodes:',
        dataNodes.length
      )

      if (dataNodes.length === 0) {
        // No data nodes yet - show message about adding first record
        setSuggestions([
          {
            id: 'no-context',
            type: 'personnel',
            title: 'Add Your First Record',
            snippet:
              'Click "Add Personnel", "Add Events", or "Add Organizations" to establish context and see intelligent suggestions.',
            relationshipScore: 0,
            relationshipType: 'topic',
            confidence: 100,
          },
        ])
        setLoading(false)
        return
      }

      // Use existing contextual intelligence to analyze current graph
      const graphContext = getGraphContext(dataNodes)

      if (!graphContext) {
        // Fallback if contextual intelligence fails
        setSuggestions([
          {
            id: 'context-error',
            type: 'personnel',
            title: 'Context Analysis Failed',
            snippet:
              'Unable to analyze current graph context. Try refreshing or adding more records.',
            relationshipScore: 0,
            relationshipType: 'topic',
            confidence: 0,
          },
        ])
        setLoading(false)
        return
      }

      // Generate contextual search rules for the disclosure API
      const searchRules = generateContextualSearchRules(graphContext)

      // Create intelligent query for Prometheus AI assistant using data nodes
      const nodeNames = dataNodes
        .map((node) => node.data?.name || node.data?.title || node.data?.label || 'Unknown')
        .filter((name) => name !== 'Unknown')

      const intelligentQuery = `Find related UAP/UFO records connected to: ${nodeNames.join(', ')}. ${searchRules} Focus on documented connections and related incidents, organizations, and evidence.`

      const agentResult = await runAgentQuery({message: intelligentQuery})
      const aiAnalysis = agentResult.analysis ?? ''
      const searchResults = agentResult.search ?? null

      // Process the comprehensive results from Prometheus AI + agentic tools
      const contextualRecords: ConnectedRecord[] = []

      // Use search results if available, otherwise parse from AI analysis
      const recordsToProcess = searchResults?.records || []

      for (const record of recordsToProcess.slice(0, 8)) {
        if (isRecordRelated(record, graphContext)) {
          const relationshipScore = calculateRelationshipScore(record, graphContext)
          const relationshipType = determineRelationshipType(record, graphContext)

          // Extract reasoning from AI analysis for this specific record
          const aiReasoning = extractReasoningForRecord(aiAnalysis, record.title || record.name)

          contextualRecords.push({
            id: record.id || `record-${Date.now()}-${Math.random()}`,
            type: inferEntityType(record),
            title: record.title || record.name || record.subject || 'Untitled Record',
            snippet:
              aiReasoning ||
              generateRelationshipExplanation(record, graphContext, relationshipType),
            relationshipScore: relationshipScore,
            relationshipType: relationshipType,
            confidence: Math.min(95, Math.max(60, Math.round(relationshipScore * 100))),
          })
        }
      }

      // If no database results but we have AI analysis, create suggestions from analysis
      if (contextualRecords.length === 0 && aiAnalysis) {
        const analysisConnections = parseAIAnalysisForConnections(aiAnalysis, graphContext)
        contextualRecords.push(...analysisConnections)
      }

      // Sort by relationship score and confidence
      contextualRecords.sort((a, b) => {
        const scoreA = a.relationshipScore * 0.7 + (a.confidence / 100) * 0.3
        const scoreB = b.relationshipScore * 0.7 + (b.confidence / 100) * 0.3
        return scoreB - scoreA
      })

      setSuggestions(contextualRecords.slice(0, 6))
    } catch (error) {
      console.error('Error fetching contextual connections:', error)
      setSuggestions([
        {
          id: 'error',
          type: 'documents',
          title: 'Connection Analysis Error',
          snippet: 'Unable to connect to disclosure analysis system. Please try again.',
          relationshipScore: 0,
          relationshipType: 'topic',
          confidence: 0,
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [getNodes, runAgentQuery])

  // Helper functions for contextual intelligence integration
  const calculateRelationshipScore = (record: any, context: any): number => {
    let score = 0

    // Personnel connections (highest weight)
    if (context.keyPersonnel?.length > 0) {
      const recordPersonnel = extractPersonnelFromRecord(record)
      if (recordPersonnel.some((person) => context.keyPersonnel.includes(person))) {
        score += 0.4
      }
    }

    // Organizational connections
    if (context.organizations?.length > 0) {
      const recordOrgs = extractOrganizationsFromRecord(record)
      if (recordOrgs.some((org) => context.organizations.includes(org))) {
        score += 0.3
      }
    }

    // Temporal relevance
    if (record.date && context.timelineBounds?.earliest && context.timelineBounds?.latest) {
      const recordDate = new Date(record.date)
      const earliest = new Date(context.timelineBounds.earliest)
      const latest = new Date(context.timelineBounds.latest)

      if (recordDate >= earliest && recordDate <= latest) {
        score += 0.2
      }
    }

    // Topic relevance
    if (context.relatedTopics?.length > 0) {
      const recordTopics = extractTopicsFromRecord(record)
      if (recordTopics.some((topic) => context.relatedTopics.includes(topic))) {
        score += 0.1
      }
    }

    return Math.min(1.0, score)
  }

  const determineRelationshipType = (
    record: any,
    context: any
  ): ConnectedRecord['relationshipType'] => {
    // Check for personnel connections first
    if (context.keyPersonnel?.length > 0) {
      const recordPersonnel = extractPersonnelFromRecord(record)
      if (recordPersonnel.some((person) => context.keyPersonnel.includes(person))) {
        return 'personnel'
      }
    }

    // Check for organizational connections
    if (context.organizations?.length > 0) {
      const recordOrgs = extractOrganizationsFromRecord(record)
      if (recordOrgs.some((org) => context.organizations.includes(org))) {
        return 'organizational'
      }
    }

    // Check for temporal connections
    if (record.date && context.timelineBounds?.earliest) {
      return 'temporal'
    }

    // Check for location connections
    if (record.latitude || record.longitude) {
      return 'location'
    }

    return 'topic'
  }

  // Extract AI reasoning for specific records from the comprehensive analysis
  const extractReasoningForRecord = (aiAnalysis: string, recordTitle: string): string | null => {
    if (!aiAnalysis || !recordTitle) return null

    // Look for patterns where the AI explains why a specific record was selected
    const lines = aiAnalysis.split('\n')
    const recordTitleLower = recordTitle.toLowerCase()

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase()
      if (
        line.includes(recordTitleLower) &&
        (line.includes('selected') || line.includes('relevant') || line.includes('connected'))
      ) {
        // Found reasoning for this record, extract the full explanation
        let reasoning = lines[i].trim()

        // Look ahead for continuation
        let j = i + 1
        while (j < lines.length && lines[j].trim() && !lines[j].toLowerCase().includes('record')) {
          reasoning += ' ' + lines[j].trim()
          j++
        }

        return reasoning.length > 50 ? reasoning : null
      }
    }

    return null
  }

  // Parse AI analysis to create connection suggestions when database results are limited
  const parseAIAnalysisForConnections = (aiAnalysis: string, context: any): ConnectedRecord[] => {
    const connections: ConnectedRecord[] = []
    const lines = aiAnalysis.split('\n').filter((line) => line.trim())

    let currentRecord: Partial<ConnectedRecord> = {}
    let idCounter = 1

    for (const line of lines) {
      // Look for entity mentions and explanations
      if (line.includes(':') && line.length > 20 && line.length < 200) {
        // Save previous record if complete
        if (currentRecord.title && currentRecord.snippet) {
          connections.push({
            id: `analysis-${idCounter++}`,
            type: inferEntityTypeFromTitle(currentRecord.title),
            relationshipScore: 0.7, // Default score for AI-analyzed connections
            confidence: 80,
            relationshipType: 'topic',
            ...currentRecord,
          } as ConnectedRecord)
        }

        // Extract new record
        const parts = line.split(':')
        if (parts.length >= 2) {
          const title = parts[0].replace(/^[\d\-\*\s\.]+/, '').trim()
          const snippet = parts.slice(1).join(':').trim()

          if (title.length > 3 && snippet.length > 10) {
            currentRecord = {title, snippet}
          }
        }
      }
    }

    // Add final record
    if (currentRecord.title && currentRecord.snippet) {
      connections.push({
        id: `analysis-${idCounter++}`,
        type: inferEntityTypeFromTitle(currentRecord.title),
        relationshipScore: 0.7,
        confidence: 80,
        relationshipType: 'topic',
        ...currentRecord,
      } as ConnectedRecord)
    }

    return connections.slice(0, 4) // Limit AI-parsed connections
  }

  const generateRelationshipExplanation = (
    record: any,
    context: any,
    relationshipType: string
  ): string => {
    const explanations = []

    // Personnel connections
    if (context.keyPersonnel?.length > 0) {
      const recordPersonnel = extractPersonnelFromRecord(record)
      const connections = recordPersonnel.filter((person) => context.keyPersonnel.includes(person))
      if (connections.length > 0) {
        explanations.push(`Connected through personnel: ${connections.slice(0, 2).join(', ')}`)
      }
    }

    // Organizational connections
    if (context.organizations?.length > 0) {
      const recordOrgs = extractOrganizationsFromRecord(record)
      const connections = recordOrgs.filter((org) => context.organizations.includes(org))
      if (connections.length > 0) {
        explanations.push(`Shares organizational context: ${connections.slice(0, 2).join(', ')}`)
      }
    }

    // Temporal connections
    if (record.date && context.timelineBounds?.earliest) {
      const recordYear = new Date(record.date).getFullYear()
      explanations.push(`From ${recordYear}, within your timeline context`)
    }

    // Topic connections
    if (context.relatedTopics?.length > 0) {
      const recordTopics = extractTopicsFromRecord(record)
      const connections = recordTopics.filter((topic) => context.relatedTopics.includes(topic))
      if (connections.length > 0) {
        explanations.push(`Related topics: ${connections.slice(0, 2).join(', ')}`)
      }
    }

    if (explanations.length === 0) {
      return 'Contextually relevant based on AI analysis'
    }

    return explanations.join('. ')
  }

  const extractPersonnelFromRecord = (record: any): string[] => {
    const personnel = []
    const fields = ['witness', 'author', 'person', 'personnel', 'names']

    for (const field of fields) {
      const value = record[field]
      if (value) {
        if (typeof value === 'string') {
          personnel.push(value)
        } else if (value.name) {
          personnel.push(value.name)
        } else if (Array.isArray(value)) {
          personnel.push(...value.filter((item) => typeof item === 'string'))
        }
      }
    }

    return personnel
  }

  const extractOrganizationsFromRecord = (record: any): string[] => {
    const organizations = []
    const fields = ['organization', 'agency', 'department', 'company', 'institution']

    for (const field of fields) {
      const value = record[field]
      if (value) {
        if (typeof value === 'string') {
          organizations.push(value)
        } else if (value.name) {
          organizations.push(value.name)
        } else if (Array.isArray(value)) {
          organizations.push(...value.filter((item) => typeof item === 'string'))
        }
      }
    }

    return organizations
  }

  const extractTopicsFromRecord = (record: any): string[] => {
    const topics = []
    const fields = ['topics', 'tags', 'categories', 'keywords']

    for (const field of fields) {
      const value = record[field]
      if (value) {
        if (typeof value === 'string') {
          topics.push(value)
        } else if (Array.isArray(value)) {
          topics.push(...value.filter((item) => typeof item === 'string'))
        }
      }
    }

    return topics
  }

  const inferEntityType = (record: any): ConnectedRecord['type'] => {
    // Use record type if available
    if (record.xata_table) {
      switch (record.xata_table) {
        case 'personnel':
          return 'personnel'
        case 'events':
          return 'events'
        case 'organizations':
          return 'organizations'
        case 'documents':
          return 'documents'
        case 'testimonies':
          return 'testimonies'
      }
    }

    return inferEntityTypeFromTitle(record.title || record.name || '')
  }

  const inferEntityTypeFromTitle = (title: string): ConnectedRecord['type'] => {
    const titleLower = title.toLowerCase()

    if (
      titleLower.includes('dr.') ||
      titleLower.includes('colonel') ||
      titleLower.includes('researcher') ||
      titleLower.includes('investigator') ||
      titleLower.includes('journalist') ||
      titleLower.includes('witness')
    ) {
      return 'personnel'
    }
    if (
      titleLower.includes('incident') ||
      titleLower.includes('sighting') ||
      titleLower.includes('event') ||
      titleLower.includes('case') ||
      titleLower.includes('encounter')
    ) {
      return 'events'
    }
    if (
      titleLower.includes('project') ||
      titleLower.includes('organization') ||
      titleLower.includes('agency') ||
      titleLower.includes('program') ||
      titleLower.includes('network') ||
      titleLower.includes('ministry')
    ) {
      return 'organizations'
    }
    if (
      titleLower.includes('report') ||
      titleLower.includes('document') ||
      titleLower.includes('file') ||
      titleLower.includes('memo') ||
      titleLower.includes('briefing')
    ) {
      return 'documents'
    }

    return 'testimonies'
  }

  useEffect(() => {
    // Add a small delay to ensure nodes are properly loaded
    const timeout = setTimeout(() => {
      fetchContextualConnections()
    }, 500)

    return () => clearTimeout(timeout)
  }, [fetchContextualConnections])

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'personnel':
        return <Users className='w-4 h-4 text-purple-400' />
      case 'temporal':
        return <Clock className='w-4 h-4 text-amber-400' />
      case 'organizational':
        return <Building2 className='w-4 h-4 text-indigo-400' />
      case 'location':
        return <MapPin className='w-4 h-4 text-green-400' />
      default:
        return <Brain className='w-4 h-4 text-teal-400' />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{opacity: 0, x: 300}}
      animate={{opacity: 1, x: 0}}
      className='fixed right-4 top-40 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-white/10'>
        <div className='flex items-center gap-2'>
          {loading ? (
            <Loader className='w-5 h-5 text-teal-400 animate-spin' />
          ) : (
            <Brain className='w-5 h-5 text-teal-400' />
          )}
          <div>
            <h3 className='font-semibold text-white text-sm'>
              {loading ? 'Analyzing Connections...' : 'Smart Connections'}
            </h3>
            <p className='text-xs text-white/60'>
              {loading
                ? 'AI + agentic tools analyzing graph'
                : 'Intelligent relationship discovery'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={fetchContextualConnections}
            disabled={loading}
            className='text-white/60 hover:text-white p-1'
            title='Refresh Contextual Analysis'>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setExpanded(!expanded)}
            className='text-white/60 hover:text-white p-1'>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{height: 0}}
            animate={{height: 'auto'}}
            exit={{height: 0}}
            className='overflow-hidden'>
            {loading ? (
              <div className='p-4 space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='animate-pulse'>
                    <div className='h-4 bg-white/10 rounded mb-2' />
                    <div className='h-3 bg-white/5 rounded w-3/4' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='max-h-96 overflow-y-auto'>
                {suggestions.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.1}}
                    className='p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors'
                    onClick={() => {
                      // Add to graph logic here
                      console.log('Adding record to graph:', record)
                    }}>
                    <div className='flex items-start gap-3'>
                      {getRelationshipIcon(record.relationshipType)}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <h4 className='font-medium text-white text-sm truncate'>
                            {record.title}
                          </h4>
                          <span
                            className={`text-xs font-medium ${getConfidenceColor(record.confidence)}`}>
                            {record.confidence}%
                          </span>
                        </div>
                        <p className='text-xs text-white/60 leading-relaxed mb-2'>
                          {record.snippet}
                        </p>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs text-white/40 capitalize'>{record.type}</span>
                          <div className='flex items-center gap-1'>
                            <div className='w-12 bg-white/10 rounded-full h-1'>
                              <div
                                className='bg-teal-400 h-1 rounded-full transition-all'
                                style={{width: `${record.relationshipScore * 100}%`}}
                              />
                            </div>
                            <span className='text-xs text-white/40'>
                              {Math.round(record.relationshipScore * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {suggestions.length === 0 && !loading && (
                  <div className='p-8 text-center text-white/40'>
                    <Brain className='w-8 h-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>No connected records found</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className='p-3 border-t border-white/10 bg-black/50'>
              <div className='flex gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={fetchContextualConnections}
                  disabled={loading}
                  className='flex-1 text-teal-400 hover:text-white hover:bg-teal-500/20'>
                  {loading ? (
                    <>
                      <Loader className='w-3 h-3 mr-1 animate-spin' /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className='w-3 h-3 mr-1' /> Refresh Analysis
                    </>
                  )}
                </Button>
              </div>
              <div className='text-center mt-2'>
                <p className='text-xs text-white/40'>
                  Powered by Prometheus • UAP Research/Intelligence Corpus
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
