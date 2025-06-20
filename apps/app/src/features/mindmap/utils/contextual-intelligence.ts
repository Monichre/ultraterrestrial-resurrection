import type { Node } from '@xyflow/react'

export interface GraphContext {
  seedRecord: Node | null
  connectedEntityTypes: Set<string>
  timelineBounds: {
    earliest?: Date
    latest?: Date
  }
  relatedTopics: string[]
  keyPersonnel: string[]
  organizations: string[]
}

/**
 * Analyzes the current graph to determine contextual relationships
 * for intelligent record filtering
 */
export function getGraphContext(nodes: Node[]): GraphContext | null {
  // Filter out user input nodes to focus on actual data nodes
  const dataNodes = nodes.filter(node => node.type !== 'userInputNode')
  
  // First record scenario - return null for open exploration
  if (dataNodes.length === 0) {
    return null
  }
  
  // Extract context from existing nodes
  const context: GraphContext = {
    seedRecord: dataNodes[0], // First record establishes primary context
    connectedEntityTypes: new Set<string>(),
    timelineBounds: {},
    relatedTopics: [],
    keyPersonnel: [],
    organizations: []
  }
  
  // Analyze all data nodes to build context
  dataNodes.forEach(node => {
    // Extract entity type from node type (e.g., 'eventsNode' -> 'events')
    const entityType = node.type?.replace('Node', '') || ''
    if (entityType) {
      context.connectedEntityTypes.add(entityType)
    }
    
    // Extract temporal context from events
    if (node.data?.date) {
      const nodeDate = new Date(node.data.date as string)
      if (!context.timelineBounds.earliest || nodeDate < context.timelineBounds.earliest) {
        context.timelineBounds.earliest = nodeDate
      }
      if (!context.timelineBounds.latest || nodeDate > context.timelineBounds.latest) {
        context.timelineBounds.latest = nodeDate
      }
    }
    
    // Extract related entities
    if (node.data?.topics && Array.isArray(node.data.topics)) {
      context.relatedTopics.push(...node.data.topics)
    }
    
    if (node.data?.witness?.name) {
      context.keyPersonnel.push(node.data.witness.name as string)
    }
    
    if (node.data?.organization?.name) {
      context.organizations.push(node.data.organization.name as string)
    }
  })
  
  // Remove duplicates
  context.relatedTopics = [...new Set(context.relatedTopics)]
  context.keyPersonnel = [...new Set(context.keyPersonnel)]
  context.organizations = [...new Set(context.organizations)]
  
  return context
}

/**
 * Determines if a new record is contextually related to the existing graph
 */
export function isRecordRelated(record: any, context: GraphContext): boolean {
  // Check temporal relevance for events
  if (record.date && context.timelineBounds.earliest && context.timelineBounds.latest) {
    const recordDate = new Date(record.date)
    const earliestDate = new Date(context.timelineBounds.earliest)
    const latestDate = new Date(context.timelineBounds.latest)
    
    // Allow records within a reasonable time window (e.g., +/- 10 years)
    const timeWindow = 10 * 365 * 24 * 60 * 60 * 1000 // 10 years in milliseconds
    if (recordDate < new Date(earliestDate.getTime() - timeWindow) || 
        recordDate > new Date(latestDate.getTime() + timeWindow)) {
      return false
    }
  }
  
  // Check for direct entity relationships
  if (record.witness?.name && context.keyPersonnel.includes(record.witness.name)) {
    return true
  }
  
  if (record.organization?.name && context.organizations.includes(record.organization.name)) {
    return true
  }
  
  // Check for topic overlap
  if (record.topics && Array.isArray(record.topics)) {
    const hasCommonTopic = record.topics.some((topic: string) => 
      context.relatedTopics.includes(topic)
    )
    if (hasCommonTopic) return true
  }
  
  // Check for location proximity (if both have coordinates)
  if (record.latitude && record.longitude && context.seedRecord?.data?.latitude && context.seedRecord?.data?.longitude) {
    const distance = calculateDistance(
      record.latitude,
      record.longitude,
      context.seedRecord.data.latitude as number,
      context.seedRecord.data.longitude as number
    )
    // Consider related if within 500km
    if (distance < 500) return true
  }
  
  return false
}

/**
 * Calculates distance between two coordinates in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Generates contextual search rules based on current graph
 */
export function generateContextualSearchRules(context: GraphContext): string {
  const rules: string[] = []
  
  // Add temporal constraints
  if (context.timelineBounds.earliest && context.timelineBounds.latest) {
    rules.push(`Focus on events between ${context.timelineBounds.earliest.getFullYear()} and ${context.timelineBounds.latest.getFullYear()}`)
  }
  
  // Add entity relationship constraints
  if (context.keyPersonnel.length > 0) {
    rules.push(`Prioritize records involving: ${context.keyPersonnel.join(', ')}`)
  }
  
  if (context.organizations.length > 0) {
    rules.push(`Include connections to organizations: ${context.organizations.join(', ')}`)
  }
  
  if (context.relatedTopics.length > 0) {
    rules.push(`Focus on topics: ${context.relatedTopics.join(', ')}`)
  }
  
  // Add guided tour context for Roswell-based exploration
  if (context.seedRecord?.data?.title?.toString().includes('Roswell') || 
      context.seedRecord?.data?.name?.toString().includes('Roswell')) {
    rules.push('Follow the chronological disclosure narrative starting from Roswell 1947')
    rules.push('Include key witnesses, military personnel, and government agencies involved')
  }
  
  return rules.join('. ')
}