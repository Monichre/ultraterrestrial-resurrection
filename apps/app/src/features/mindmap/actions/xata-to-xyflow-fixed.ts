"use server"

/**
 * Enhanced and Fixed xataToXYFlow Implementation
 * 
 * Created: July 10, 2025 at 10:45 AM PST
 * 
 * Key Fixes Applied:
 * 1. Enhanced error handling and logging throughout the pipeline
 * 2. Better data validation at each transformation step
 * 3. Fallback mechanisms for failed operations
 * 4. More robust data transformation with null checks
 * 5. Improved layout algorithm error handling
 * 6. Better handling of edge cases (empty results, malformed data)
 * 7. Comprehensive logging for debugging
 */

import { askXataWithAi } from "@db/xata/api"
import { organizeNodeLayout } from "../layouts/organizeNodeLayout"
import { xata } from "@db/xata/client"
import type { Node, Edge } from '@xyflow/react'

// Import existing types for compatibility
export type {
  ReactFlowNode,
  ReactFlowEdge,
  XataToXYFlowResult,
  XataToXYFlowParams,
  XataToXYFlowResponse
} from './xata-to-xyflow'

// Enhanced types with better validation
interface ValidatedXataResult {
  answer: string
  sessionId: string
  records: any[]
  isValid: boolean
  validationErrors: string[]
}

interface TransformationContext {
  sourceNode: any
  existingNodes: any[]
  originalType: string
  layoutType: string
  startTime: number
}

interface TransformationResult {
  nodes: any[]
  edges: any[]
  answer: string
  sessionId?: string
  metadata: {
    recordsProcessed: number
    nodesCreated: number
    edgesCreated: number
    transformationTime: number
    layoutTime: number
    errors: string[]
    warnings: string[]
  }
}

/**
 * Enhanced fetch records function with better error handling
 */
export const fetchRecordsEnhanced = async (recordIds: string[], table: string) => {
  const startTime = performance.now()
  const errors: string[] = []
  const warnings: string[] = []
  
  try {
    console.log(`🔍 fetchRecordsEnhanced: Starting fetch for ${recordIds.length} records from ${table}`)
    
    if (!recordIds || recordIds.length === 0) {
      console.warn('fetchRecordsEnhanced: No record IDs provided')
      return { records: [], errors: ['No record IDs provided'], warnings: [], duration: 0 }
    }

    if (!table || typeof table !== 'string') {
      throw new Error('fetchRecordsEnhanced: Invalid table parameter')
    }

    // Validate table exists
    if (!xata.db[table]) {
      throw new Error(`fetchRecordsEnhanced: Table '${table}' does not exist`)
    }

    // Filter valid record IDs
    const validRecordIds = recordIds.filter(id => {
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        warnings.push(`Invalid record ID: ${id}`)
        return false
      }
      return true
    })

    if (validRecordIds.length === 0) {
      warnings.push('No valid record IDs after filtering')
      return { records: [], errors, warnings, duration: performance.now() - startTime }
    }

    console.log(`📋 fetchRecordsEnhanced: Fetching ${validRecordIds.length} valid records`)

    // Fetch records with better error handling
    const recordPromises = validRecordIds.map(async (recordId, index) => {
      try {
        console.log(`📄 Fetching record ${index + 1}/${validRecordIds.length}: ${recordId}`)
        
        const result = await xata.db[table].read(recordId)
        
        if (!result) {
          warnings.push(`Record not found: ${recordId}`)
          return null
        }

        // Validate the record has required fields
        const serialized = result.toSerializable()
        if (!serialized || !serialized.id) {
          warnings.push(`Record missing required fields: ${recordId}`)
          return null
        }

        console.log(`✅ Successfully fetched record: ${recordId}`)
        return serialized
      } catch (error) {
        const errorMsg = `Error fetching record ${recordId}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`❌ ${errorMsg}`)
        errors.push(errorMsg)
        return null
      }
    })

    const records = await Promise.all(recordPromises)
    const validRecords = records.filter(Boolean)
    
    const duration = performance.now() - startTime
    
    console.log(`✅ fetchRecordsEnhanced completed: ${validRecords.length}/${recordIds.length} records fetched in ${duration.toFixed(2)}ms`)
    
    return {
      records: validRecords,
      errors,
      warnings,
      duration,
      stats: {
        requested: recordIds.length,
        valid: validRecordIds.length,
        fetched: validRecords.length,
        failed: recordIds.length - validRecords.length
      }
    }
  } catch (error) {
    const duration = performance.now() - startTime
    const errorMsg = `fetchRecordsEnhanced failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error(`❌ ${errorMsg}`)
    
    return {
      records: [],
      errors: [errorMsg],
      warnings,
      duration,
      stats: { requested: recordIds.length, valid: 0, fetched: 0, failed: recordIds.length }
    }
  }
}

/**
 * Validate Xata AI response structure
 */
function validateXataResult(xataResult: any): ValidatedXataResult {
  const validationErrors: string[] = []
  
  // Check basic structure
  if (!xataResult) {
    validationErrors.push('Xata result is null or undefined')
    return { answer: '', sessionId: '', records: [], isValid: false, validationErrors }
  }

  // Validate answer
  if (!xataResult.answer || typeof xataResult.answer !== 'string') {
    validationErrors.push('Missing or invalid answer field')
  }

  // Validate sessionId
  if (!xataResult.sessionId || typeof xataResult.sessionId !== 'string') {
    validationErrors.push('Missing or invalid sessionId field')
  }

  // Validate records
  if (!Array.isArray(xataResult.records)) {
    validationErrors.push('Records field is not an array')
  } else {
    // Check if records are valid
    const invalidRecords = xataResult.records.filter((record, index) => {
      if (!record || typeof record !== 'object') {
        validationErrors.push(`Record ${index} is not a valid object`)
        return true
      }
      if (!record.id) {
        validationErrors.push(`Record ${index} missing required 'id' field`)
        return true
      }
      return false
    })

    if (invalidRecords.length > 0) {
      validationErrors.push(`${invalidRecords.length} records have validation issues`)
    }
  }

  return {
    answer: xataResult.answer || '',
    sessionId: xataResult.sessionId || '',
    records: Array.isArray(xataResult.records) ? xataResult.records : [],
    isValid: validationErrors.length === 0,
    validationErrors
  }
}

/**
 * Enhanced transformation function with comprehensive error handling
 */
async function transformForReactflowEnhanced(
  xataResult: any,
  sourceNode: any,
  existingNodes: any[],
  originalType: string,
  layoutType: "horizontal" | "vertical" | "radial" | "grid" = "horizontal",
): Promise<TransformationResult> {
  const startTime = performance.now()
  const errors: string[] = []
  const warnings: string[] = []
  
  try {
    console.log('🔄 transformForReactflowEnhanced: Starting transformation')
    
    // Validate inputs
    const validation = validateXataResult(xataResult)
    if (!validation.isValid) {
      errors.push(...validation.validationErrors)
      console.error('❌ Xata result validation failed:', validation.validationErrors)
    }

    if (!sourceNode || !sourceNode.id) {
      const error = 'Invalid or missing sourceNode'
      errors.push(error)
      console.error(`❌ ${error}`)
    }

    if (!Array.isArray(existingNodes)) {
      warnings.push('existingNodes is not an array, using empty array')
      existingNodes = []
    }

    // Use validated data
    const { answer, records } = validation
    
    console.log(`📊 Processing ${records.length} records for transformation`)

    const nodes: any[] = []
    const edges: any[] = []
    const centralNodeId = sourceNode?.id || 'unknown-source'

    // Process each record with enhanced error handling
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      
      try {
        console.log(`🔄 Processing record ${i + 1}/${records.length}: ${record.id}`)
        
        if (!record || !record.id) {
          warnings.push(`Skipping invalid record at index ${i}`)
          continue
        }

        // Create enhanced node with validation
        const nodeData = {
          ...record,
          type: originalType,
          // Add metadata for debugging
          _metadata: {
            sourceIndex: i,
            transformedAt: new Date().toISOString(),
            sourceTable: originalType
          }
        }

        const node = {
          id: record.id,
          type: "enhancedEntityNodePOC",
          position: { x: 0, y: 0 }, // Will be set by layout algorithm
          data: nodeData,
          parentId: centralNodeId,
        }

        nodes.push(node)

        // Create edge with validation
        const edge = {
          id: `edge-${centralNodeId}-${record.id}`,
          source: centralNodeId,
          target: record.id,
          type: "smoothstep",
          animated: true,
        }

        edges.push(edge)
        
        console.log(`✅ Created node and edge for record: ${record.id}`)
      } catch (error) {
        const errorMsg = `Error processing record ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`❌ ${errorMsg}`)
        errors.push(errorMsg)
      }
    }

    console.log(`📈 Created ${nodes.length} nodes and ${edges.length} edges`)

    // Apply layout with enhanced error handling
    let layoutedNodes = nodes
    const layoutStartTime = performance.now()
    
    try {
      // Validate layout parameters
      const validLayoutTypes = ["horizontal", "vertical", "radial", "grid"]
      if (!validLayoutTypes.includes(layoutType)) {
        warnings.push(`Invalid layoutType '${layoutType}', using 'horizontal'`)
        layoutType = "horizontal"
      }

      // Calculate layout parameters based on node count
      let spacing = 50
      let parentChildSpacing = 100
      
      if (layoutType === "radial" && nodes.length > 5) {
        parentChildSpacing = 120 + nodes.length * 5
      }
      
      if (layoutType === "grid") {
        spacing = 30
      }

      console.log(`🎨 Applying ${layoutType} layout with ${nodes.length} nodes`)

      layoutedNodes = organizeNodeLayout(nodes, edges, {
        direction: layoutType,
        parentChildSpacing,
        siblingSpacing: spacing,
        nodeWidth: 200,
        nodeHeight: 100,
        centerChildren: true,
      })

      console.log(`✅ Layout applied successfully in ${(performance.now() - layoutStartTime).toFixed(2)}ms`)
    } catch (layoutError) {
      const errorMsg = `Layout algorithm failed: ${layoutError instanceof Error ? layoutError.message : 'Unknown error'}`
      console.error(`❌ ${errorMsg}`)
      errors.push(errorMsg)
      
      // Fallback to simple positioning
      console.log('🔄 Applying fallback positioning')
      layoutedNodes = nodes.map((node, index) => ({
        ...node,
        position: { x: index * 220, y: 0 }
      }))
      
      warnings.push('Using fallback positioning due to layout algorithm failure')
    }

    const transformationTime = performance.now() - startTime
    const layoutTime = performance.now() - layoutStartTime

    console.log(`✅ transformForReactflowEnhanced completed in ${transformationTime.toFixed(2)}ms`)

    return {
      nodes: layoutedNodes,
      edges,
      answer,
      sessionId: validation.sessionId,
      metadata: {
        recordsProcessed: records.length,
        nodesCreated: nodes.length,
        edgesCreated: edges.length,
        transformationTime,
        layoutTime,
        errors,
        warnings
      }
    }
  } catch (error) {
    const transformationTime = performance.now() - startTime
    const errorMsg = `Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error(`❌ ${errorMsg}`)
    
    return {
      nodes: [],
      edges: [],
      answer: `Error: ${errorMsg}`,
      metadata: {
        recordsProcessed: 0,
        nodesCreated: 0,
        edgesCreated: 0,
        transformationTime,
        layoutTime: 0,
        errors: [errorMsg],
        warnings
      }
    }
  }
}

/**
 * Enhanced main xataToXYFlow function with comprehensive improvements
 */
export const xataToXYFlowEnhanced = async (params: any) => {
  const startTime = performance.now()
  
  try {
    console.log('🚀 xataToXYFlowEnhanced: Starting enhanced flow')
    console.log('📋 Parameters:', {
      question: params.question,
      table: params.table,
      rulesCount: Array.isArray(params.rules) ? params.rules.length : 1,
      existingNodesCount: params.existingNodes?.length || 0,
      sourceNodeId: params.sourceNode?.id,
      layoutType: params.layoutType
    })

    // Enhanced input validation
    if (!params.question || typeof params.question !== 'string' || params.question.trim().length === 0) {
      throw new Error('Invalid or empty question parameter')
    }

    if (!params.table || typeof params.table !== 'string') {
      throw new Error('Invalid table parameter')
    }

    if (!params.sourceNode || !params.sourceNode.id) {
      throw new Error('Invalid sourceNode parameter')
    }

    // Validate table exists
    if (!xata.db[params.table]) {
      throw new Error(`Table '${params.table}' does not exist`)
    }

    if (!Array.isArray(params.existingNodes)) {
      console.warn('existingNodes is not an array, using empty array')
      params.existingNodes = []
    }

    // Process rules
    const rulesArray = Array.isArray(params.rules) ? params.rules : [params.rules]
    const validRules = rulesArray.filter(rule =>
      rule && typeof rule === 'string' && rule.trim().length > 0
    )

    if (validRules.length === 0) {
      console.warn('No valid rules provided, using default')
      validRules.push(`Find relevant ${params.table} records`)
    }

    // Add enhanced rules for better results
    validRules.push('Prioritize records with complete data and clear relationships')
    validRules.push('Include records that would create meaningful connections in a visual graph')

    console.log(`📝 Using ${validRules.length} rules for query`)

    // Call Xata AI with enhanced error handling
    let xataResponse
    try {
      console.log('🤖 Calling askXataWithAi...')
      xataResponse = await askXataWithAi({
        question: params.question,
        table: params.table,
        rules: validRules,
        sessionId: params.sessionId
      })
      console.log('✅ askXataWithAi completed successfully')
    } catch (aiError) {
      console.error('❌ askXataWithAi failed:', aiError)
      throw new Error(`AI query failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`)
    }

    if (!xataResponse) {
      throw new Error('No response from askXataWithAi')
    }

    console.log('📊 Xata response analysis:', {
      hasAnswer: !!xataResponse.answer,
      answerLength: xataResponse.answer?.length || 0,
      hasRecords: Array.isArray(xataResponse.records),
      recordCount: xataResponse.records?.length || 0,
      hasSessionId: !!xataResponse.sessionId
    })

    // Transform data with enhanced handling
    const transformationResult = await transformForReactflowEnhanced(
      xataResponse,
      params.sourceNode,
      params.existingNodes,
      params.table,
      params.layoutType || "horizontal"
    )

    const totalDuration = performance.now() - startTime

    console.log('📈 Final results:', {
      nodes: transformationResult.nodes.length,
      edges: transformationResult.edges.length,
      errors: transformationResult.metadata.errors.length,
      warnings: transformationResult.metadata.warnings.length,
      totalDuration: totalDuration.toFixed(2) + 'ms'
    })

    // Return enhanced response
    return {
      nodes: transformationResult.nodes,
      edges: transformationResult.edges,
      xataResponse: {
        answer: transformationResult.answer,
        records: xataResponse.records || [],
        sessionId: transformationResult.sessionId || xataResponse.sessionId,
      },
      metadata: {
        ...transformationResult.metadata,
        totalDuration,
        success: transformationResult.metadata.errors.length === 0
      }
    }
  } catch (error) {
    const totalDuration = performance.now() - startTime
    const errorMsg = `xataToXYFlowEnhanced failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    
    console.error('❌ xataToXYFlowEnhanced final error:', errorMsg)
    console.error('⏱️  Failed after:', totalDuration.toFixed(2) + 'ms')

    // Return safe error response
    return {
      nodes: [],
      edges: [],
      xataResponse: {
        answer: `Error: ${errorMsg}`,
        records: [],
        sessionId: params.sessionId || '',
      },
      metadata: {
        recordsProcessed: 0,
        nodesCreated: 0,
        edgesCreated: 0,
        transformationTime: 0,
        layoutTime: 0,
        totalDuration,
        errors: [errorMsg],
        warnings: [],
        success: false
      }
    }
  }
}

/**
 * Compatibility wrapper that maintains the original API
 */
export const xataToXYFlow = xataToXYFlowEnhanced

// Re-export other functions for compatibility
export { askAIAction, fetchRecords, initiateStreamingQuery, transformStreamResponse } from './xata-to-xyflow'