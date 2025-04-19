/**
 * R2R Services Index
 * Exports all R2R-related services for easy importing
 */

// R2R Client
export { r2rClient, ResearchDepth } from '@/lib/r2r/client'

// Enhanced Personnel Ranking
export { 
  calculateEnhancedPersonnelRanking,
  integrateRankingMetrics 
} from './enhanced-personnel-ranking'

// Enhanced Knowledge Layer
export {
  processResourceEnhanced,
  extractEntitiesAndRelationships
} from './enhanced-knowledge-layer'

// Deep Research
export {
  performDeepResearch,
  analyzeRelationships
} from './deep-research'

// Integration Utilities
export {
  enhanceAIContext,
  hybridSearch,
  checkR2RConfiguration
} from './integration'