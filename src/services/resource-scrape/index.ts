/**
 * Resource scraping service
 * Exports utilities for scraping and processing external resources
 */

// Export all features from firecrawl implementation
export * from './firecrawl'

// Export jina implementation
export * from './jina'

// Re-export types and enums for easier imports
export {
  ResearchDepth,
  ResearchCategory,
  type DeepResearchOptions
} from './firecrawl'