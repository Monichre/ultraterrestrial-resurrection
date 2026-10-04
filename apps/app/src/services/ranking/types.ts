/**
 * Types for the personnel ranking system
 */

/**
 * RankingMetrics interface defines the data structure for collecting the connection
 * metrics for each key figure across the database.
 */
export interface RankingMetrics {
  eventParticipation: number;
  topicExpertise: number;
  organizationalAuthority: number;
  documentedContributions: number;
  testimonies: number;
  quotes: number;
}

/**
 * WeightingFactors interface defines the configurable weights used in the
 * ranking calculation formula.
 */
export interface WeightingFactors {
  EVENT_PARTICIPATION: number;
  TOPIC_EXPERTISE: number;
  ORGANIZATIONAL_ROLE: number;
  DOCUMENTED_EVIDENCE: number;
  TESTIMONY_COUNT: number;
  QUOTE_COUNT: number;
}

/**
 * ExecutionLog interface defines the structure for logging ranking calculation executions.
 */
export interface ExecutionLog {
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  maxScore: number;
  minScore: number;
  avgScore: number;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  executionTimeMs?: number;
  weightsUsed?: WeightingFactors;
}

/**
 * Enhanced ranking metrics that include R2R-derived contextual information
 */
export interface EnhancedRankingMetrics extends RankingMetrics {
  // Contextual metrics from deep research
  credibilityScore?: number;
  authorityScore?: number;
  significanceScore?: number;
  
  // Network/relationship metrics
  networkCentrality?: number;
  influenceScore?: number;
  
  // Content-based metrics
  documentRelevance?: number;
  documentImpact?: number;
}

/**
 * Options for R2R-enhanced ranking
 */
export interface R2RRankingOptions {
  // Whether to use deep research for enhanced analysis
  useDeepResearch?: boolean;
  
  // Whether to include relationship analysis
  includeRelationshipAnalysis?: boolean;
  
  // Whether to incorporate contextual factors
  useContextualFactors?: boolean;
  
  // How heavily to weight R2R-derived scores (0-1)
  r2rIntegrationFactor?: number;
}

/**
 * Default weighting factors based on the ranking system design documentation.
 */
export const DEFAULT_WEIGHTS: WeightingFactors = {
  EVENT_PARTICIPATION: 1.0,
  TOPIC_EXPERTISE: 1.0,
  ORGANIZATIONAL_ROLE: 1.0,
  DOCUMENTED_EVIDENCE: 1.0,
  TESTIMONY_COUNT: 1.0,
  QUOTE_COUNT: 1.5,
};