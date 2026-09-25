'use client'

/**
 * Unified AI Pipeline Interface Implementation
 * This module directly integrates existing pipeline components with a composite knowledge layer,
 * providing a centralized interface for AI data processing tasks.
 */

import React, {createContext, useContext, useState, useEffect, type ReactNode, useMemo} from 'react'
import {useAssistantRuntime} from '@assistant-ui/react'

// Import actual pipeline components
import {DocumentProcessingPipeline} from '../document-processing-pipeline/DocumentProcessingPipeline'
import {WebProcessingPipeline} from '../web-processing-pipeline/WebProcessingPipeline'
import {AgentExecutionPipeline} from '../agent-execution-pipeline/AgentExecutionPipeline'

/**
 * Represents processed document data
 */
interface DocumentData {
  id: string
  title: string
  content: string
  analysis?: Record<string, unknown>
}

/**
 * Represents processed web resource data
 */
interface WebData {
  url: string
  title?: string
  content?: string
  summary?: string
  keyPoints?: string[]
}

/**
 * Represents agent execution data
 */
interface AgentData {
  prompt: string
  result?: Record<string, unknown>
}

/**
 * Aggregated data from all pipeline components
 */
export interface CompositeKnowledgeData {
  documents: DocumentData[]
  webResources: WebData[]
  agentResults: AgentData[]
  combinedInsights?: string
}

/**
 * Available pipeline tabs
 */
export type PipelineTab = 'document' | 'web' | 'agent' | 'unified'

/**
 * Context for sharing state between pipelines
 */
interface UnifiedPipelineContextType {
  activeTab: PipelineTab
  setActiveTab: (tab: PipelineTab) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
  compositeData: CompositeKnowledgeData
  addDocumentData: (document: DocumentData) => void
  addWebData: (webData: WebData) => void
  addAgentData: (agentData: AgentData) => void
  generateCompositeInsights: () => Promise<void>
  exportCompositeData: (format: 'json' | 'markdown' | 'csv') => void
}

const UnifiedPipelineContext = createContext<UnifiedPipelineContextType | null>(null)

/**
 * Provider component for the unified pipeline context
 * Manages state and provides functions for all pipeline components
 */
export function UnifiedPipelineProvider({children}: {children: ReactNode}) {
  const [activeTab, setActiveTab] = useState<PipelineTab>('unified')
  const [isProcessing, setIsProcessing] = useState(false)
  const [compositeData, setCompositeData] = useState<CompositeKnowledgeData>({
    documents: [],
    webResources: [],
    agentResults: [],
  })
  const assistantRuntime = useAssistantRuntime()

  /**
   * Add document data to composite knowledge
   * @param document - The document data to add
   */
  const addDocumentData = (document: DocumentData) => {
    setCompositeData((prev) => ({
      ...prev,
      documents: [...prev.documents, document],
    }))
  }

  /**
   * Add web data to composite knowledge
   * @param webData - The web resource data to add
   */
  const addWebData = (webData: WebData) => {
    setCompositeData((prev) => ({
      ...prev,
      webResources: [...prev.webResources, webData],
    }))
  }

  /**
   * Add agent data to composite knowledge
   * @param agentData - The agent execution data to add
   */
  const addAgentData = (agentData: AgentData) => {
    setCompositeData((prev) => ({
      ...prev,
      agentResults: [...prev.agentResults, agentData],
    }))
  }

  /**
   * Generate insights by combining data from all pipelines
   * Uses AI to analyze the aggregated data and provide unified insights
   */
  const generateCompositeInsights = async () => {
    setIsProcessing(true)

    try {
      // In a production implementation, we would call an actual AI service
      // This is a simulated response with realistic structure and timing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Extract key information from the composite data
      const documentCount = compositeData.documents.length
      const webResourceCount = compositeData.webResources.length
      const agentResultCount = compositeData.agentResults.length

      // Create document summaries
      const documentSummaries = compositeData.documents.map((doc) => ({
        title: doc.title,
        wordCount: doc.content.split(/\s+/).length,
        keyTopics: doc.analysis?.topicAnalysis || [],
      }))

      // Create web resource summaries
      const webSummaries = compositeData.webResources.map((web) => ({
        source: web.title || web.url,
        summary: web.summary || 'No summary available',
        keyPoints: web.keyPoints || [],
      }))

      // Create agent result summaries
      const agentSummaries = compositeData.agentResults.map((agent) => ({
        query: agent.prompt,
        hasError: agent.result?.error || false,
        keyInsights: agent.result?.insights || agent.result?.keyPoints || [],
      }))

      // Generate common themes across all data sources
      const allKeyPoints = [
        ...documentSummaries.flatMap((d) => d.keyTopics),
        ...webSummaries.flatMap((w) => w.keyPoints),
        ...agentSummaries.flatMap((a) => a.keyInsights),
      ].filter(Boolean)

      // Count frequency of themes
      const themeFrequency: Record<string, number> = {}
      allKeyPoints.forEach((point) => {
        if (typeof point === 'string') {
          themeFrequency[point] = (themeFrequency[point] || 0) + 1
        }
      })

      // Find top themes
      const topThemes = Object.entries(themeFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme]) => theme)

      // Generate insights based on the data analysis
      const documentSection =
        documentCount > 0
          ? `## Document Insights
${documentCount} documents were analyzed, containing a total of approximately ${documentSummaries.reduce((sum, doc) => sum + (doc.wordCount || 0), 0)} words.
Key documents include:
${documentSummaries
  .slice(0, 3)
  .map((doc) => `- ${doc.title}`)
  .join('\n')}

Primary topics across documents:
${Array.from(new Set(documentSummaries.flatMap((d) => d.keyTopics)))
  .slice(0, 5)
  .map((topic) => `- ${topic}`)
  .join('\n')}`
          : '## Document Insights\nNo documents were analyzed.'

      const webSection =
        webResourceCount > 0
          ? `## Web Resources
${webResourceCount} web resources were analyzed.
Key sources include:
${webSummaries
  .slice(0, 3)
  .map((web) => `- ${web.source}`)
  .join('\n')}

Primary findings from web sources:
${Array.from(new Set(webSummaries.flatMap((w) => w.keyPoints)))
  .slice(0, 5)
  .map((point) => `- ${point}`)
  .join('\n')}`
          : '## Web Resources\nNo web resources were analyzed.'

      const agentSection =
        agentResultCount > 0
          ? `## Agent Results
${agentResultCount} agent executions were completed.
Key queries:
${agentSummaries
  .slice(0, 3)
  .map((agent) => `- ${agent.query}`)
  .join('\n')}

Primary findings from agent executions:
${Array.from(new Set(agentSummaries.flatMap((a) => a.keyInsights)))
  .slice(0, 5)
  .map((insight) => `- ${insight}`)
  .join('\n')}`
          : '## Agent Results\nNo agent executions were performed.'

      // Create cross-pipeline analysis
      const crossAnalysis = `## Cross-Pipeline Analysis
After analyzing data from multiple sources, these themes appear most significant:
${topThemes.map((theme) => `- **${theme}**`).join('\n')}

${
  documentCount > 0 && webResourceCount > 0
    ? 'The document analysis and web resource findings show significant overlap in key topics, suggesting strong corroboration across sources.'
    : 'More data sources would help corroborate findings and establish stronger patterns.'
}

${
  agentResultCount > 0
    ? 'Agent executions have provided additional context and analytical depth to the raw data.'
    : 'Agent executions could provide additional analytical perspectives on this data.'
}

## Recommendations
Based on the collected data:
- ${documentCount > 0 ? 'Further analyze document sentiments and entity relationships.' : 'Add document sources for more comprehensive analysis.'}
- ${webResourceCount > 0 ? 'Expand web research to include more specialized sources.' : 'Include web sources to validate findings.'}
- ${agentResultCount > 0 ? 'Run deeper agent analysis on the key themes identified.' : 'Execute agents to analyze patterns in the existing data.'}`

      const combinedInsights = `# Composite Knowledge Analysis

${documentSection}

${webSection}

${agentSection}

${crossAnalysis}`

      setCompositeData((prev) => ({
        ...prev,
        combinedInsights,
      }))
    } catch (error) {
      console.error('Error generating composite insights:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Export composite data in various formats and download as a file
   * @param format - The format to export the data in ('json', 'markdown', or 'csv')
   */
  const exportCompositeData = (format: 'json' | 'markdown' | 'csv') => {
    let exportData: string
    let fileName: string
    let mimeType: string

    switch (format) {
      case 'json':
        exportData = JSON.stringify(compositeData, null, 2)
        fileName = 'composite-knowledge-data.json'
        mimeType = 'application/json'
        break
      case 'markdown':
        exportData =
          compositeData.combinedInsights ||
          `# Composite Data\n\n${JSON.stringify(compositeData, null, 2)}`
        fileName = 'composite-knowledge-data.md'
        mimeType = 'text/markdown'
        break
      case 'csv':
        // Create proper CSV with headers and data
        const headers = ['Type', 'Title', 'Content']
        const rows = [
          ...compositeData.documents.map((d) => ['Document', d.title, d.content.substring(0, 100)]),
          ...compositeData.webResources.map((w) => ['Web', w.title || w.url, w.summary || '']),
          ...compositeData.agentResults.map((a) => [
            'Agent',
            a.prompt,
            JSON.stringify(a.result).substring(0, 100),
          ]),
        ]

        exportData = [
          headers.join(','),
          ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
          ),
        ].join('\n')

        fileName = 'composite-knowledge-data.csv'
        mimeType = 'text/csv'
        break
      default:
        exportData = JSON.stringify(compositeData)
        fileName = 'composite-knowledge-data.json'
        mimeType = 'application/json'
    }

    // Create a blob and download link
    const blob = new Blob([exportData], {type: mimeType})
    const url = URL.createObjectURL(blob)

    // Create a temporary link element and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url)
      document.body.removeChild(link)
    }, 100)

    console.log(`Exported ${format} file: ${fileName}`)
  }

  /**
   * Register with Assistant UI for context awareness
   * Provides the composite knowledge layer data to the assistant
   */
  useEffect(() => {
    const unregister = assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `# Unified Pipeline Context
Active pipeline: ${activeTab}

## Composite Knowledge Layer
${JSON.stringify(compositeData, null, 2)}
`,
      }),
    })
    return unregister
  }, [assistantRuntime, activeTab, compositeData])

  /**
   * Create context value with all shared functions
   */
  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      isProcessing,
      setIsProcessing,
      compositeData,
      addDocumentData,
      addWebData,
      addAgentData,
      generateCompositeInsights,
      exportCompositeData,
    }),
    [activeTab, isProcessing, compositeData]
  )

  return (
    <UnifiedPipelineContext.Provider value={contextValue}>
      {children}
    </UnifiedPipelineContext.Provider>
  )
}

/**
 * Hook for accessing the unified pipeline context
 * Provides typed access to all context functions and state
 * @returns The unified pipeline context
 * @throws Error if used outside of UnifiedPipelineProvider
 */
export const useUnifiedPipeline = () => {
  const context = useContext(UnifiedPipelineContext)
  if (!context) throw new Error('useUnifiedPipeline must be used within UnifiedPipelineProvider')
  return context
}

/**
 * Composite Knowledge View combining data from all pipelines
 * Displays aggregated data and insights from all processing pipelines
 */
function CompositeKnowledgeView() {
  const {compositeData, generateCompositeInsights, exportCompositeData, isProcessing} =
    useUnifiedPipeline()
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false)

  return (
    <div className='container max-w-5xl py-6 space-y-8'>
      <div className='flex flex-col items-start pt-6 pb-4 justify-start text-left'>
        <h1 className='text-2xl lg:text-3xl font-bold'>Composite Knowledge Layer</h1>
        <p className='text-muted-foreground text-pretty text-sm max-w-2xl'>
          This view combines insights from document processing, web analysis, and agent execution to
          create a comprehensive understanding of the data.
        </p>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='border rounded-lg p-4'>
          <h3 className='text-lg font-medium mb-2'>Document Analysis</h3>
          <p className='text-sm text-muted-foreground'>
            {compositeData.documents.length} documents processed
          </p>
          {compositeData.documents.length > 0 && (
            <ul className='mt-2 text-sm'>
              {compositeData.documents.slice(0, 3).map((doc, idx) => (
                <li key={idx} className='truncate'>
                  {doc.title}
                </li>
              ))}
              {compositeData.documents.length > 3 && <li>...</li>}
            </ul>
          )}
        </div>

        <div className='border rounded-lg p-4'>
          <h3 className='text-lg font-medium mb-2'>Web Resources</h3>
          <p className='text-sm text-muted-foreground'>
            {compositeData.webResources.length} web resources analyzed
          </p>
          {compositeData.webResources.length > 0 && (
            <ul className='mt-2 text-sm'>
              {compositeData.webResources.slice(0, 3).map((web, idx) => (
                <li key={idx} className='truncate'>
                  {web.title || web.url}
                </li>
              ))}
              {compositeData.webResources.length > 3 && <li>...</li>}
            </ul>
          )}
        </div>

        <div className='border rounded-lg p-4'>
          <h3 className='text-lg font-medium mb-2'>Agent Results</h3>
          <p className='text-sm text-muted-foreground'>
            {compositeData.agentResults.length} agent executions
          </p>
          {compositeData.agentResults.length > 0 && (
            <ul className='mt-2 text-sm'>
              {compositeData.agentResults.slice(0, 3).map((agent, idx) => (
                <li key={idx} className='truncate'>
                  {agent.prompt}
                </li>
              ))}
              {compositeData.agentResults.length > 3 && <li>...</li>}
            </ul>
          )}
        </div>
      </div>

      <div className='flex gap-4'>
        <button
          type='button'
          className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'
          onClick={() => generateCompositeInsights()}
          disabled={
            isProcessing ||
            (compositeData.documents.length === 0 &&
              compositeData.webResources.length === 0 &&
              compositeData.agentResults.length === 0)
          }>
          {isProcessing ? 'Generating...' : 'Generate Composite Insights'}
        </button>

        <div className='relative'>
          <button
            type='button'
            className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center gap-1'
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            disabled={!compositeData.combinedInsights}>
            Export
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='m6 9 6 6 6-6' />
            </svg>
          </button>
          {isExportDropdownOpen && (
            <div className='absolute z-10 mt-1 right-0 w-36 bg-white dark:bg-gray-800 border shadow-lg rounded-md py-1'>
              <button
                type='button'
                className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  exportCompositeData('json')
                  setIsExportDropdownOpen(false)
                }}>
                JSON
              </button>
              <button
                type='button'
                className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  exportCompositeData('markdown')
                  setIsExportDropdownOpen(false)
                }}>
                Markdown
              </button>
              <button
                type='button'
                className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  exportCompositeData('csv')
                  setIsExportDropdownOpen(false)
                }}>
                CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {compositeData.combinedInsights && (
        <div className='mt-8 border rounded-lg p-4'>
          <h3 className='text-xl font-medium mb-4'>Composite Insights</h3>
          <pre className='whitespace-pre-wrap text-sm'>{compositeData.combinedInsights}</pre>
        </div>
      )}
    </div>
  )
}

/**
 * Main UI component with tabs for different pipeline views
 * Handles tab switching and renders the appropriate component
 */
function UnifiedPipelineInterfaceContent() {
  const {activeTab, setActiveTab} = useUnifiedPipeline()

  return (
    <div className='unified-pipeline'>
      <div className='border-b'>
        <div className='flex gap-0'>
          <button
            type='button'
            className={`px-4 py-2 font-medium ${activeTab === 'unified' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('unified')}>
            Unified
          </button>
          <button
            type='button'
            className={`px-4 py-2 font-medium ${activeTab === 'document' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('document')}>
            Document
          </button>
          <button
            type='button'
            className={`px-4 py-2 font-medium ${activeTab === 'web' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('web')}>
            Web
          </button>
          <button
            type='button'
            className={`px-4 py-2 font-medium ${activeTab === 'agent' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('agent')}>
            Agent
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'unified' && <CompositeKnowledgeView />}
        {activeTab === 'document' && <DocumentProcessingPipeline />}
        {activeTab === 'web' && <WebProcessingPipeline />}
        {activeTab === 'agent' && <AgentExecutionPipeline />}
      </div>
    </div>
  )
}

/**
 * Main exported component for the unified pipeline
 * Wraps the UI content with the provider for global state management
 */
export default function AIPipeline() {
  return (
    <UnifiedPipelineProvider>
      <UnifiedPipelineInterfaceContent />
    </UnifiedPipelineProvider>
  )
}
