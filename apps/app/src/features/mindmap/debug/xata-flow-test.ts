/**
 * Minimal test environment for debugging xataToXYFlow database query issues
 * 
 * Created: July 10, 2025 at 09:45 AM PST
 * Purpose: Isolate and reproduce the database query problem in xataToXYFlow
 * 
 * Usage:
 * 1. Import this file in a test component or run directly
 * 2. Call testXataToXYFlow() to debug the issue
 * 3. Check console logs for detailed debugging information
 */

import { xataToXYFlow, type XataToXYFlowParams, type ReactFlowNode } from '../actions/xata-to-xyflow'

// Mock source node for testing
const mockSourceNode: ReactFlowNode = {
  id: 'test-source-node',
  type: 'enhancedEntityNodePOC',
  position: { x: 0, y: 0 },
  data: {
    id: 'test-source-node',
    name: 'Test Source Node',
    type: 'events'
  }
}

// Mock existing nodes array
const mockExistingNodes: ReactFlowNode[] = []

/**
 * Test the xataToXYFlow function with minimal parameters
 * This will help identify where the data flow breaks
 */
export async function testXataToXYFlow() {
  console.log('🔍 Starting xataToXYFlow debug test...')
  
  const testParams: XataToXYFlowParams = {
    question: 'Find related events about Roswell incident',
    table: 'events',
    rules: 'Find relevant events records',
    context: 'Testing database query flow',
    existingNodes: mockExistingNodes,
    sourceNode: mockSourceNode,
    layoutType: 'horizontal'
  }
  
  try {
    console.log('📋 Test Parameters:', testParams)
    
    // Step 1: Test the main function
    console.log('🚀 Calling xataToXYFlow...')
    const result = await xataToXYFlow(testParams)
    
    console.log('✅ xataToXYFlow completed successfully')
    console.log('📊 Result structure:', {
      hasNodes: Array.isArray(result.nodes),
      nodeCount: result.nodes?.length || 0,
      hasEdges: Array.isArray(result.edges),
      edgeCount: result.edges?.length || 0,
      hasXataResponse: !!result.xataResponse,
      hasRecords: Array.isArray(result.xataResponse?.records),
      recordCount: result.xataResponse?.records?.length || 0
    })
    
    // Check for common issues
    if (result.nodes.length === 0) {
      console.warn('⚠️  No nodes returned - potential database query issue')
    }
    
    if (result.edges.length === 0) {
      console.warn('⚠️  No edges returned - potential transformation issue')
    }
    
    if (!result.xataResponse?.records || result.xataResponse.records.length === 0) {
      console.warn('⚠️  No records in xataResponse - potential Xata API issue')
    }
    
    return result
    
  } catch (error) {
    console.error('❌ xataToXYFlow test failed:', error)
    
    // Detailed error analysis
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5) // First 5 lines of stack
      })
    }
    
    throw error
  }
}

/**
 * Test individual components of the data flow
 */
export async function testComponentsIndividually() {
  console.log('🔧 Testing components individually...')
  
  try {
    // Test 1: Import validation
    console.log('1️⃣ Testing imports...')
    const { askXataWithAi } = await import('@db/xata/api')
    const { xata } = await import('@db/xata/client')
    console.log('✅ Imports successful')
    
    // Test 2: Direct Xata connection
    console.log('2️⃣ Testing direct Xata connection...')
    
    // Test basic table access
    const tables = xata.db
    console.log('Available tables:', Object.keys(tables))
    
    // Test 3: Try a simple query
    console.log('3️⃣ Testing simple Xata query...')
    try {
      const records = await xata.db.events.getMany({
        pagination: { size: 5 }
      })
      console.log('✅ Simple query successful, found', records.length, 'records')
      console.log('Sample record structure:', records[0] ? Object.keys(records[0]) : 'No records')
    } catch (queryError) {
      console.error('❌ Simple query failed:', queryError)
    }
    
    // Test 4: Test askXataWithAi function
    console.log('4️⃣ Testing askXataWithAi function...')
    try {
      const aiResponse = await askXataWithAi({
        question: 'Find events about UFO sightings',
        table: 'events',
        rules: ['Find relevant events']
      })
      console.log('✅ askXataWithAi successful')
      console.log('AI Response structure:', {
        hasAnswer: !!aiResponse.answer,
        hasRecords: Array.isArray(aiResponse.records),
        recordCount: aiResponse.records?.length || 0,
        hasSessionId: !!aiResponse.sessionId
      })
    } catch (aiError) {
      console.error('❌ askXataWithAi failed:', aiError)
    }
    
  } catch (error) {
    console.error('❌ Component test failed:', error)
    throw error
  }
}

/**
 * Validate data schemas and transformations
 */
export function validateDataSchemas(xataResponse: any) {
  console.log('🔍 Validating data schemas...')
  
  const validation = {
    hasAnswer: typeof xataResponse?.answer === 'string',
    hasSessionId: typeof xataResponse?.sessionId === 'string',
    hasRecords: Array.isArray(xataResponse?.records),
    recordsValid: true,
    recordSample: null as any
  }
  
  if (validation.hasRecords && xataResponse.records.length > 0) {
    const sampleRecord = xataResponse.records[0]
    validation.recordSample = {
      hasId: !!sampleRecord?.id,
      fields: Object.keys(sampleRecord || {}),
      type: typeof sampleRecord
    }
    
    // Check if records have required fields for node creation
    validation.recordsValid = xataResponse.records.every((record: any) => 
      record && typeof record === 'object' && record.id
    )
  }
  
  console.log('📋 Schema validation:', validation)
  return validation
}

/**
 * Quick test function for client components
 */
export async function quickDebugTest() {
  console.log('⚡ Running quick debug test...')
  
  try {
    const result = await testXataToXYFlow()
    console.log('✅ Quick test completed')
    return { success: true, result }
  } catch (error) {
    console.log('❌ Quick test failed')
    return { success: false, error }
  }
}