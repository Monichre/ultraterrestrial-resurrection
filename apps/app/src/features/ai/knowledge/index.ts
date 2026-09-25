// Export the main knowledge context and provider
export * from './KnowledgeContext'
export { KnowledgeSources, type KnowledgeItem, type SearchOptions } from './types'

// Export UI components
export * from './components'

// Export the unified knowledge API
export { UnifiedKnowledgeAPI } from './unified-knowledge-api'

// Export utility functions
export {
  extractContent,
  chunkContent,
  htmlToMarkdown,
  markdownToText,
  extractMetadataFromContent,
  detectFileType,
  compareContent,
  validateContent
} from './utilities'