# Unified Pipeline Interface Implementation Plan

## Overview

This document outlines the implementation strategy for creating a unified user interface that integrates all existing processing pipelines (agent-execution, document-processing, and web-processing) while maintaining backward compatibility with the existing separate implementations.

## Architecture Goals

1. **Unified Experience**: Create a single, cohesive UI for all AI pipeline operations
2. **Shared Context**: Leverage a common context for state and business logic
3. **Backward Compatibility**: Maintain existing pipeline files and interfaces
4. **Performance Optimization**: Minimize redundant renders and API calls
5. **Extensible Design**: Allow for easy addition of future pipelines

## Implementation Components

### 1. Shared Context Provider

```tsx
// src/features/ai/pipelines/unified/UnifiedPipelineContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAssistantRuntime } from '@assistant-ui/react'
import { 
  // Import utilities, types and logic from existing pipelines
  type DocumentProcessingState,
  type WebProcessingState,
  type AgentExecutionState
} from '../types'

interface UnifiedPipelineContextType {
  // Shared state
  activeTab: 'document' | 'web' | 'agent' | 'unified'
  setActiveTab: (tab: 'document' | 'web' | 'agent' | 'unified') => void
  isProcessing: boolean
  
  // Document processing state & functions
  documentState: DocumentProcessingState
  uploadDocument: (file: File) => Promise<void>
  analyzeDocument: (documentId: string) => Promise<void>
  
  // Web processing state & functions
  webState: WebProcessingState
  processWebUrl: (url: string) => Promise<void>
  summarizeWebContent: (content: string) => Promise<void>
  
  // Agent execution state & functions
  agentState: AgentExecutionState
  executeAgent: (prompt: string, context?: any) => Promise<void>
  
  // Cross-pipeline functions
  combineResults: () => any
  exportResults: (format: string) => void
  
  // AI Assistant context
  addToAIContext: (data: any) => void
}

// Create the context
const UnifiedPipelineContext = createContext<UnifiedPipelineContextType | null>(null)

// Provider component
export function UnifiedPipelineProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'document' | 'web' | 'agent' | 'unified'>('unified')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Document processing state
  const [documentState, setDocumentState] = useState<DocumentProcessingState>({
    // Initial state
  })
  
  // Web processing state
  const [webState, setWebState] = useState<WebProcessingState>({
    // Initial state
  })
  
  // Agent execution state
  const [agentState, setAgentState] = useState<AgentExecutionState>({
    // Initial state
  })
  
  // Get the Assistant UI runtime for AI context
  const assistantRuntime = useAssistantRuntime()
  
  // Implementation of all functions...
  const uploadDocument = async (file: File) => {
    // Implementation that calls existing document pipeline logic
  }
  
  const processWebUrl = async (url: string) => {
    // Implementation that calls existing web pipeline logic
  }
  
  const executeAgent = async (prompt: string, context?: any) => {
    // Implementation that calls existing agent pipeline logic
  }
  
  // Cross-pipeline functions
  const combineResults = () => {
    // Logic to combine results from multiple pipelines
  }
  
  // AI context registration
  useEffect(() => {
    const unregister = assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `
          # Unified Pipeline Context
          
          Active pipeline: ${activeTab}
          
          ## Document Processing
          ${JSON.stringify(documentState, null, 2)}
          
          ## Web Processing
          ${JSON.stringify(webState, null, 2)}
          
          ## Agent Execution
          ${JSON.stringify(agentState, null, 2)}
        `
      })
    })
    
    return unregister
  }, [assistantRuntime, activeTab, documentState, webState, agentState])
  
  // Create context value
  const contextValue: UnifiedPipelineContextType = {
    activeTab,
    setActiveTab,
    isProcessing,
    documentState,
    uploadDocument,
    analyzeDocument: async (documentId: string) => {/* implementation */},
    webState,
    processWebUrl,
    summarizeWebContent: async (content: string) => {/* implementation */},
    agentState,
    executeAgent,
    combineResults,
    exportResults: (format: string) => {/* implementation */},
    addToAIContext: (data: any) => {/* implementation */}
  }
  
  return (
    <UnifiedPipelineContext.Provider value={contextValue}>
      {children}
    </UnifiedPipelineContext.Provider>
  )
}

// Custom hook to use the context
export const useUnifiedPipeline = () => {
  const context = useContext(UnifiedPipelineContext)
  if (!context) {
    throw new Error('useUnifiedPipeline must be used within UnifiedPipelineProvider')
  }
  return context
}
```

### 2. Unified UI Component

```tsx
// src/features/ai/pipelines/unified/UnifiedPipelineInterface.tsx

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { UnifiedPipelineProvider, useUnifiedPipeline } from './UnifiedPipelineContext'

// Import existing components (but don't render them directly)
import { DocumentProcessingPipeline } from '../document-processing-pipeline'
import { WebProcessingPipeline } from '../web-processing-pipeline'
import { AgentExecutionPipeline } from '../agent-execution-pipeline'

// Adapter components that use unified context but match original component props
function DocumentProcessingAdapter(props: any) {
  const { documentState, uploadDocument, analyzeDocument } = useUnifiedPipeline()
  
  // Map unified context to props expected by original component
  const adaptedProps = {
    ...props,
    documents: documentState.documents,
    onUpload: uploadDocument,
    onAnalyze: analyzeDocument
    // Add other props mappings as needed
  }
  
  // Render UI similar to original component but using unified context
  return (
    <div className="document-processing">
      {/* Document UI components using adaptedProps */}
    </div>
  )
}

function WebProcessingAdapter(props: any) {
  const { webState, processWebUrl } = useUnifiedPipeline()
  
  // Map unified context to props expected by original component
  const adaptedProps = {
    ...props,
    url: webState.url,
    content: webState.content,
    onProcess: processWebUrl
    // Add other props mappings as needed
  }
  
  // Render UI similar to original component but using unified context
  return (
    <div className="web-processing">
      {/* Web UI components using adaptedProps */}
    </div>
  )
}

function AgentExecutionAdapter(props: any) {
  const { agentState, executeAgent } = useUnifiedPipeline()
  
  // Map unified context to props expected by original component
  const adaptedProps = {
    ...props,
    agents: agentState.agents,
    onExecute: executeAgent
    // Add other props mappings as needed
  }
  
  // Render UI similar to original component but using unified context
  return (
    <div className="agent-execution">
      {/* Agent UI components using adaptedProps */}
    </div>
  )
}

// Unified view that combines elements from all pipelines
function UnifiedView() {
  const { 
    documentState, 
    webState, 
    agentState,
    uploadDocument,
    processWebUrl,
    executeAgent,
    combineResults,
    exportResults
  } = useUnifiedPipeline()
  
  return (
    <div className="unified-view">
      <div className="grid grid-cols-3 gap-4">
        {/* Quick input sections for each pipeline */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Document Processing</h3>
          {/* Document quick upload/input UI */}
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Web Processing</h3>
          {/* URL input UI */}
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Agent Execution</h3>
          {/* Agent prompt UI */}
        </div>
      </div>
      
      {/* Combined results section */}
      <div className="mt-8 border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Combined Results</h3>
          <button 
            onClick={() => exportResults('json')}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Export
          </button>
        </div>
        
        {/* Results visualization with combined data from all pipelines */}
        <div className="grid grid-cols-1 gap-4">
          {/* Document results summary */}
          {documentState.results && (
            <div className="border-l-4 border-blue-500 pl-2">
              {/* Document results visualization */}
            </div>
          )}
          
          {/* Web results summary */}
          {webState.results && (
            <div className="border-l-4 border-green-500 pl-2">
              {/* Web results visualization */}
            </div>
          )}
          
          {/* Agent results summary */}
          {agentState.results && (
            <div className="border-l-4 border-purple-500 pl-2">
              {/* Agent results visualization */}
            </div>
          )}
        </div>
      </div>
      
      {/* AI Assistant integration */}
      <div className="mt-8 border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">AI Assistant</h3>
        {/* Assistant UI integration */}
      </div>
    </div>
  )
}

// Main component with tab interface
function UnifiedPipelineInterfaceContent() {
  const { activeTab, setActiveTab } = useUnifiedPipeline()
  
  return (
    <div className="unified-pipeline">
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="unified">Unified</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unified">
          <UnifiedView />
        </TabsContent>
        
        <TabsContent value="document">
          <DocumentProcessingAdapter />
        </TabsContent>
        
        <TabsContent value="web">
          <WebProcessingAdapter />
        </TabsContent>
        
        <TabsContent value="agent">
          <AgentExecutionAdapter />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export the wrapped component with provider
export function UnifiedPipelineInterface() {
  return (
    <UnifiedPipelineProvider>
      <UnifiedPipelineInterfaceContent />
    </UnifiedPipelineProvider>
  )
}
```

### 3. Create Adapter Utilities

```tsx
// src/features/ai/pipelines/unified/adapters.ts

// These functions help map between the unified context format
// and the format expected by the original pipelines

export function mapDocumentStateToOriginal(unifiedState: any) {
  // Convert unified state format to the format expected by original document pipeline
  return {
    // Mapping implementation
  }
}

export function mapWebStateToOriginal(unifiedState: any) {
  // Convert unified state format to the format expected by original web pipeline
  return {
    // Mapping implementation
  }
}

export function mapAgentStateToOriginal(unifiedState: any) {
  // Convert unified state format to the format expected by original agent pipeline
  return {
    // Mapping implementation
  }
}

// Inverse mapping functions to convert from original formats to unified

export function mapDocumentStateToUnified(originalState: any) {
  // Implementation
}

export function mapWebStateToUnified(originalState: any) {
  // Implementation
}

export function mapAgentStateToUnified(originalState: any) {
  // Implementation
}
```

### 4. Business Logic Integration

```tsx
// src/features/ai/pipelines/unified/business-logic.ts

// Import the business logic from the original pipelines
import { 
  analyzeDocument, 
  vectorizeDocument 
} from '../document-processing-pipeline/helpers'

import { 
  scrapeAndSummarize 
} from '../web-processing-pipeline/helpers'

import { 
  executeAgentWorkflow 
} from '../agent-execution-pipeline/helpers'

// Re-export the business logic for use in the unified context
export {
  analyzeDocument,
  vectorizeDocument,
  scrapeAndSummarize,
  executeAgentWorkflow
}

// Add new cross-pipeline functions
export async function combinePipelineResults(documentResults: any, webResults: any, agentResults: any) {
  // Logic to merge results from different pipelines
  return {
    combined: true,
    document: documentResults,
    web: webResults,
    agent: agentResults,
    // Additional derived data or processing
  }
}

export async function createCrossContextualSummary(documentResults: any, webResults: any, agentResults: any) {
  // Generate a summary that takes data from all pipelines into account
  // Could use an LLM call to synthesize information
  return {
    summary: "Contextual summary across pipelines...",
    insights: [
      // Key insights derived from cross-pipeline analysis
    ]
  }
}
```

### 5. Project Integration and Usage

```tsx
// Example usage in a page component
// src/app/(auth)/admin/unified-pipeline/page.tsx

'use client'

import { UnifiedPipelineInterface } from '@/features/ai/pipelines/unified/UnifiedPipelineInterface'
import { AssistantProvider } from '@assistant-ui/react'

export default function UnifiedPipelinePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Unified AI Pipeline</h1>
      
      <AssistantProvider>
        <UnifiedPipelineInterface />
      </AssistantProvider>
    </div>
  )
}
```

## Implementation Strategy

### Phase 1: Context and Structure Setup

1. Create the `unified` directory in the pipelines folder
2. Implement the UnifiedPipelineContext provider
3. Build adapter utilities to map between data formats
4. Set up basic tab structure with placeholder components

### Phase 2: UI Component Implementation

1. Build adapter components for each pipeline
2. Implement the unified view component
3. Create the combined results visualization
4. Add export functionality

### Phase 3: Business Logic Integration

1. Extract and integrate business logic from existing pipelines
2. Implement cross-pipeline functions (combination, analysis)
3. Ensure all original pipeline functionality works through adapters

### Phase 4: AI Assistant Integration

1. Set up context registration with Assistant UI
2. Add function registration for AI operations
3. Implement AI-specific commands and suggestions

### Phase 5: Testing and Optimization

1. Test backward compatibility with existing code
2. Optimize state updates to prevent unnecessary renders
3. Add error handling and recovery mechanisms
4. Document usage patterns and implementation details

## Backward Compatibility Considerations

To maintain backward compatibility:

1. **No Modification of Existing Files**: The unified interface exists alongside original pipelines, not replacing them
2. **Adapter Pattern**: Use adapters to translate between original and unified formats
3. **Gradual Migration**: Allow teams to adopt the unified interface at their own pace
4. **Feature Parity**: Ensure all features from original pipelines are accessible in the unified interface

## Extension Points

The unified interface is designed for extensibility:

1. **Adding New Pipelines**: 
   - Create a new adapter component
   - Add state and functions to the unified context
   - Add a new tab in the UI

2. **Cross-Pipeline Features**: 
   - Add new functions to business-logic.ts
   - Enhance the combined results visualization
   - Add new AI assistant capabilities

## Performance Considerations

1. **Lazy Loading**: Use dynamic imports for pipeline-specific components
2. **Memoization**: Use React.memo and useMemo for expensive components and calculations
3. **Selective Rendering**: Only update components affected by state changes
4. **Background Processing**: Move intensive operations to web workers where possible

## Benefits of This Approach

1. **Single Entry Point**: Users access all AI capabilities through one interface
2. **Consistent UX**: Unified design language and interaction patterns
3. **Cross-Pipeline Insights**: Ability to combine data from multiple pipelines
4. **Reduced Duplication**: Shared UI components and business logic
5. **Future-Proof**: Easy to extend with new pipelines and features

## Next Steps After Implementation

1. **User Testing**: Gather feedback on the unified interface
2. **Documentation**: Create comprehensive usage guides
3. **Analytics**: Add tracking to understand which features are most used
4. **Feature Enhancement**: Develop new capabilities that leverage cross-pipeline data