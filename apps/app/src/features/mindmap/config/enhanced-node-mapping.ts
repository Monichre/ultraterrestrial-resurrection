/**
 * Enhanced Node Type Mapping Configuration
 * 
 * This file allows easy switching between legacy and enhanced node types
 * for testing and gradual rollout of the new beautiful UI components.
 */

// Configuration to enable/disable enhanced nodes
export const ENHANCED_NODES_CONFIG = {
  enabled: true, // Set to false to use legacy nodes
  
  // Individual node type overrides
  entityNode: true,        // Use enhanced entity nodes
  userInputNode: true,     // Use enhanced user input nodes
  testimoniesNode: false,  // Keep using legacy testimony nodes for now
  documentNode: false,     // Keep using legacy document nodes for now
} as const

/**
 * Maps legacy node types to their enhanced counterparts
 */
export const ENHANCED_NODE_TYPE_MAPPING = {
  // Entity nodes
  entityNode: 'enhancedEntityNodePOC',
  eventsNode: 'enhancedEntityNodePOC',
  personnelNode: 'enhancedEntityNodePOC', 
  topicsNode: 'enhancedEntityNodePOC',
  organizationsNode: 'enhancedEntityNodePOC',
  
  // User input - keep as original for now since POC wraps the original
  userInputNode: 'userInputNode',
  
  // Keep these as legacy for now
  testimoniesNode: 'testimoniesNode',
  documentNode: 'documentNode',
} as const

/**
 * Utility function to get the appropriate node type
 * based on configuration and enhanced node availability
 */
export function getNodeType(originalType: string): string {
  // If enhanced nodes are disabled globally, return original
  if (!ENHANCED_NODES_CONFIG.enabled) {
    return originalType
  }
  
  // Check individual node type override
  const configKey = originalType as keyof typeof ENHANCED_NODES_CONFIG
  if (configKey in ENHANCED_NODES_CONFIG && !ENHANCED_NODES_CONFIG[configKey]) {
    return originalType
  }
  
  // Return enhanced version if available, otherwise original
  const enhancedType = ENHANCED_NODE_TYPE_MAPPING[originalType as keyof typeof ENHANCED_NODE_TYPE_MAPPING]
  return enhancedType || originalType
}

/**
 * Configuration for enhanced node features
 */
export const ENHANCED_FEATURES = {
  // Visual enhancements
  contextualIndicators: true,      // Show contextual intelligence status
  entityTypeColors: true,          // Use entity-specific color schemes
  animatedTransitions: true,       // Enable smooth animations
  glowEffects: true,              // Enable glow effects for contextual nodes
  
  // Data visualization
  credibilityScores: true,         // Show credibility/authority scores
  connectionCounts: true,          // Display connection counts
  quickActions: true,              // Show quick action buttons
  expandableDetails: true,         // Allow expanding for more details
  
  // Research integration
  researchCanvasIntegration: true, // Enable research canvas features
  aiInteractions: true,            // Enhanced AI interaction buttons
  
} as const

/**
 * Color scheme configuration for different entity types
 */
export const ENTITY_THEMES = {
  events: {
    name: 'UFO Events',
    description: 'Sightings, encounters, and incidents',
    primaryColor: '#3B82F6',
    accentColor: '#60A5FA',
  },
  personnel: {
    name: 'Key Figures', 
    description: 'Witnesses, officials, and researchers',
    primaryColor: '#10B981',
    accentColor: '#34D399',
  },
  organizations: {
    name: 'Organizations',
    description: 'Government agencies and research groups',
    primaryColor: '#8B5CF6',
    accentColor: '#A78BFA',
  },
  testimonies: {
    name: 'Testimonies',
    description: 'Witness accounts and official statements',
    primaryColor: '#F59E0B',
    accentColor: '#FCD34D',
  },
  documents: {
    name: 'Documents',
    description: 'Classified files and official records',
    primaryColor: '#EF4444',
    accentColor: '#F87171',
  },
  topics: {
    name: 'Research Topics',
    description: 'Areas of UFO research and investigation',
    primaryColor: '#06B6D4',
    accentColor: '#22D3EE',
  },
} as const