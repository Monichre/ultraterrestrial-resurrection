"use server"

import OpenAI from "openai"
import { generateContextualSearchRules } from "@/features/mindmap/utils/contextual-intelligence"
import type { Node } from '@xyflow/react'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export interface ConnectionAnalysisRequest {
  nodes: Array<{
    id: string
    data: any
    type?: string
  }>
  graphContext?: any
  analysisDepth?: 'quick' | 'deep' | 'comprehensive'
}

export interface ConnectionAnalysisResult {
  success: boolean
  connections: Array<{
    sourceId: string
    targetId: string
    confidence: number
    reasons: string[]
    connectionType: 'temporal' | 'spatial' | 'contextual' | 'entity-based'
    suggestedRelationship: string
    historicalSignificance?: string
    researchQuestions?: string[]
  }>
  insights: Array<{
    type: 'pattern' | 'anomaly' | 'cluster' | 'timeline' | 'network'
    description: string
    confidence: number
    suggestedActions: string[]
  }>
  error?: string
}

/**
 * Enhanced AI-powered connection analysis using OpenAI and contextual intelligence
 * Builds on existing contextual intelligence to provide sophisticated connection suggestions
 */
export async function analyzeSmartConnections({
  nodes,
  graphContext,
  analysisDepth = 'quick'
}: ConnectionAnalysisRequest): Promise<ConnectionAnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      connections: [],
      insights: [],
      error: "OpenAI API key not configured"
    }
  }

  try {
    // Limit nodes for API performance
    const nodesToAnalyze = nodes.slice(0, analysisDepth === 'comprehensive' ? 20 : analysisDepth === 'deep' ? 12 : 8)
    
    // Generate contextual search rules for additional context
    const contextualRules = graphContext ? generateContextualSearchRules(graphContext) : ''
    
    // Prepare node data for analysis
    const nodeData = nodesToAnalyze.map(node => ({
      id: node.id,
      type: node.data?.type || 'unknown',
      name: node.data?.name || node.data?.title || node.data?.label || 'Unknown',
      date: node.data?.date || node.data?.occurred_on || node.data?.timestamp,
      location: {
        latitude: node.data?.latitude || node.data?.lat,
        longitude: node.data?.longitude || node.data?.lon || node.data?.lng
      },
      personnel: extractPersonnelFromData(node.data),
      organizations: extractOrganizationsFromData(node.data),
      topics: extractTopicsFromData(node.data),
      description: node.data?.description || node.data?.summary || '',
      significance: node.data?.significance || node.data?.importance
    }))

    // Create analysis prompt based on depth
    const systemPrompt = getSystemPrompt(analysisDepth)
    const userPrompt = getUserPrompt(nodeData, contextualRules, analysisDepth)

    const completion = await openai.chat.completions.create({
      model: "gpt-5.5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent analysis
    })

    const result = JSON.parse(completion.choices[0].message.content || "{}")
    
    return {
      success: true,
      connections: result.connections || [],
      insights: result.insights || [],
    }

  } catch (error) {
    console.error("Smart connection analysis failed:", error)
    return {
      success: false,
      connections: [],
      insights: [],
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Get system prompt based on analysis depth
 */
function getSystemPrompt(depth: 'quick' | 'deep' | 'comprehensive'): string {
  const basePrompt = `You are an expert AI researcher specializing in UFO/UAP disclosure analysis and knowledge graph construction. Your role is to analyze entities and identify meaningful connections that advance understanding of the disclosure phenomenon.`

  const depthInstructions = {
    quick: `Focus on the most obvious and strong connections. Prioritize direct relationships and clear patterns.`,
    deep: `Perform thorough analysis including indirect connections, temporal patterns, and organizational relationships. Consider historical context and significance.`,
    comprehensive: `Conduct exhaustive analysis including subtle patterns, network effects, historical progression, and implications for the broader disclosure narrative. Consider multi-dimensional relationships and emerging patterns.`
  }

  return `${basePrompt}

${depthInstructions[depth]}

Key Analysis Areas:
1. Temporal relationships (events in similar timeframes)
2. Geographic proximity (locations within reasonable distance)
3. Personnel connections (shared witnesses, officials, researchers)
4. Organizational ties (same agencies, departments, or institutions)
5. Topical relevance (similar subjects, technologies, or phenomena)
6. Historical significance (events that shaped disclosure timeline)
7. Network patterns (entities that serve as bridges or clusters)

Response Format:
Return a JSON object with:
- connections: Array of potential connections between entities
- insights: Array of broader patterns and observations

For each connection, provide:
- sourceId, targetId: Entity IDs
- confidence: 0.0-1.0 confidence score
- reasons: Array of specific reasons for the connection
- connectionType: Type of relationship
- suggestedRelationship: Human-readable relationship description
- historicalSignificance: Why this connection matters (if applicable)
- researchQuestions: Questions this connection raises (if applicable)

For each insight, provide:
- type: Pattern type (pattern, anomaly, cluster, timeline, network)
- description: What you observed
- confidence: 0.0-1.0 confidence score
- suggestedActions: What researchers should investigate next`
}

/**
 * Get user prompt for analysis
 */
function getUserPrompt(nodeData: any[], contextualRules: string, depth: 'quick' | 'deep' | 'comprehensive'): string {
  return `Analyze the following UFO/UAP disclosure entities and identify meaningful connections:

Entities to analyze:
${JSON.stringify(nodeData, null, 2)}

Current graph context and rules:
${contextualRules}

Analysis depth: ${depth}

Please identify:
1. Direct relationships between entities
2. Patterns that emerge from the data
3. Historically significant connections
4. Research opportunities these connections reveal

Focus particularly on:
- Government/military connections and cover-up patterns
- Witness credibility networks and corroboration
- Technological and craft descriptions across events
- Geographic and temporal clustering of incidents
- Evolution of disclosure efforts over time
- Connections between official programs and civilian research

Return comprehensive analysis as JSON with connections and insights arrays.`
}

/**
 * Extract personnel from node data
 */
function extractPersonnelFromData(data: any): string[] {
  if (!data) return []
  
  const personnel: string[] = []
  const fields = ['witness', 'author', 'person', 'personnel', 'names', 'officials', 'witnesses']
  
  for (const field of fields) {
    const value = data[field]
    if (typeof value === 'string') {
      personnel.push(value)
    } else if (Array.isArray(value)) {
      personnel.push(...value.filter((item: any) => typeof item === 'string'))
    } else if (value && typeof value === 'object' && value.name) {
      personnel.push(value.name)
    }
  }
  
  return [...new Set(personnel)].filter(Boolean)
}

/**
 * Extract organizations from node data
 */
function extractOrganizationsFromData(data: any): string[] {
  if (!data) return []
  
  const organizations: string[] = []
  const fields = ['organization', 'agency', 'department', 'company', 'institution', 'military_branch']
  
  for (const field of fields) {
    const value = data[field]
    if (typeof value === 'string') {
      organizations.push(value)
    } else if (Array.isArray(value)) {
      organizations.push(...value.filter((item: any) => typeof item === 'string'))
    } else if (value && typeof value === 'object' && value.name) {
      organizations.push(value.name)
    }
  }
  
  return [...new Set(organizations)].filter(Boolean)
}

/**
 * Extract topics from node data
 */
function extractTopicsFromData(data: any): string[] {
  if (!data) return []
  
  const topics: string[] = []
  const fields = ['topics', 'tags', 'categories', 'keywords', 'phenomena', 'craft_type']
  
  for (const field of fields) {
    const value = data[field]
    if (typeof value === 'string') {
      topics.push(value)
    } else if (Array.isArray(value)) {
      topics.push(...value.filter((item: any) => typeof item === 'string'))
    }
  }
  
  return [...new Set(topics)].filter(Boolean)
}

/**
 * Lightweight connection analysis for real-time use
 */
export async function quickConnectionAnalysis(nodeIds: string[]): Promise<ConnectionAnalysisResult> {
  // This would be a simpler, faster analysis for real-time suggestions
  // Implementation would use cached data and simpler heuristics
  try {
    // Mock quick analysis - in real implementation, this would use
    // cached embeddings, simple distance calculations, etc.
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate quick processing
    
    return {
      success: true,
      connections: [],
      insights: [{
        type: 'pattern',
        description: 'Quick analysis completed - use deep analysis for detailed results',
        confidence: 0.7,
        suggestedActions: ['Run deep analysis for comprehensive insights']
      }]
    }
  } catch (error) {
    return {
      success: false,
      connections: [],
      insights: [],
      error: error instanceof Error ? error.message : "Quick analysis failed"
    }
  }
}