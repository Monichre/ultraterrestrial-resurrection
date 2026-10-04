# Composite Knowledge Layer

A unified knowledge management system that integrates multiple data sources and provides a consistent interface for AI pipelines.

## Overview

The Composite Knowledge Layer provides a unified API for accessing and managing knowledge from various sources:

- **Local Files**: Documents stored in the knowledge base directory
- **OpenAI Vector Storage**: Embeddings and semantic search
- **R2R**: External RAG implementation (Read, Retrieve, Route)
- **Database (Xata)**: Structured data storage

## Key Features

- **Unified API**: Single interface for all knowledge operations
- **Cross-Source Search**: Find information across all sources with deduplication
- **AI Context Awareness**: Integration with Assistant UI for AI capabilities
- **React Components**: Ready-to-use UI components for knowledge discovery
- **Pipeline Integration**: Seamless integration with both unified and standalone pipelines

## Usage

### With Unified Pipeline

```tsx
import { IntegratedAIPipeline } from '@/features/ai/knowledge/integration'

export default function AIProcessingPage() {
  return (
    <div className="container">
      <h1>AI Processing Hub</h1>
      <IntegratedAIPipeline />
    </div>
  )
}
```

### With Standalone Pipelines

```tsx
import { DocumentProcessingPipeline } from '@/features/ai/pipelines/document-processing-pipeline'
import { withKnowledgeForDocumentPipeline } from '@/features/ai/knowledge/pipeline-adapters'

// Enhance the document pipeline with knowledge capabilities
const EnhancedDocumentPipeline = withKnowledgeForDocumentPipeline(DocumentProcessingPipeline)

export default function DocumentProcessingPage() {
  return (
    <div className="container">
      <h1>Document Processing</h1>
      <EnhancedDocumentPipeline />
    </div>
  )
}
```

### Direct API Usage

```tsx
import { UnifiedKnowledgeAPI, KnowledgeSources } from '@/features/ai/knowledge'

async function searchAcrossSources(query: string) {
  const api = new UnifiedKnowledgeAPI()
  
  // Search across all sources
  const results = await api.search(query)
  
  // Or specify particular sources
  const documentResults = await api.search(query, { 
    sources: [KnowledgeSources.LOCAL, KnowledgeSources.DATABASE]
  })
  
  return results
}
```

### With React Context

```tsx
import { useKnowledge, KnowledgeProvider } from '@/features/ai/knowledge'

function KnowledgeSearchComponent() {
  const { search, searchResults, isLoading } = useKnowledge()
  
  const handleSearch = async (query: string) => {
    await search(query)
  }
  
  return (
    <div>
      <input 
        type="text" 
        placeholder="Search knowledge..." 
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {searchResults.map(item => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Wrap with provider at a higher level
export default function KnowledgePage() {
  return (
    <KnowledgeProvider>
      <KnowledgeSearchComponent />
    </KnowledgeProvider>
  )
}
```

## Architecture

The knowledge layer is built with a layered architecture:

1. **Data Source Adapters**: Interface with individual knowledge sources
   - `LocalFilesAdapter`, `OpenAIVectorAdapter`, `R2RAdapter`, `XataAdapter`

2. **Unified Knowledge API**: Common interface for all knowledge operations
   - `UnifiedKnowledgeAPI`

3. **Knowledge Context Provider**: React context for UI components
   - `KnowledgeProvider`, `useKnowledge`

4. **UI Components**: Ready-to-use React components
   - `KnowledgePicker`, `KnowledgeViewer`, `KnowledgeEnabledPipeline`

5. **Integration Components**: Pre-built integrations for pipelines
   - `IntegratedAIPipeline`, `withKnowledgeForDocumentPipeline`, etc.

## Implementation Notes

- The local file adapter uses mock data for demonstration; in production, it would scan the actual knowledge base directory.
- The OpenAI Vector adapter includes mock embeddings; in production, it would use the OpenAI API to generate embeddings.
- The R2R adapter simulates R2R behavior; in production, it would call the actual R2R API.
- The Xata adapter includes mock data; in production, it would query the Xata database.

## Future Enhancements

- **Sync Jobs**: Background jobs to keep sources in sync
- **Version Control**: Track changes to knowledge items
- **Collaborative Editing**: Allow multiple users to edit the same items
- **Knowledge Graphs**: Build relationships between items
- **Advanced Analytics**: Analyze knowledge usage patterns