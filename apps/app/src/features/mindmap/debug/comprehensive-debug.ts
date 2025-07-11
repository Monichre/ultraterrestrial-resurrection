/**
 * Comprehensive Debug Suite for xataToXYFlow Database Issues
 * 
 * Created: July 10, 2025 at 10:15 AM PST
 * Purpose: Isolate and debug every component in the xataToXYFlow data pipeline
 * 
 * This script tests:
 * 1. Environment variables and configuration
 * 2. Xata client connection and authentication
 * 3. Database schema validation
 * 4. Basic table queries
 * 5. askXataWithAi function
 * 6. Data transformation pipeline
 * 7. ReactFlow node/edge generation
 * 8. Layout algorithm
 */

export interface DebugResult {
  step: string
  success: boolean
  data?: any
  error?: any
  duration: number
  details?: Record<string, any>
}

export interface DebugSuite {
  results: DebugResult[]
  summary: {
    total: number
    passed: number
    failed: number
    totalDuration: number
  }
}

/**
 * Main debug suite runner
 */
export async function runComprehensiveDebug(): Promise<DebugSuite> {
  console.log('🚀 Starting Comprehensive xataToXYFlow Debug Suite...')
  console.log('📅 Timestamp:', new Date().toISOString())
  
  const results: DebugResult[] = []
  
  // Step 1: Environment Check
  results.push(await debugStep('Environment Variables', checkEnvironmentVariables))
  
  // Step 2: Import Check
  results.push(await debugStep('Module Imports', checkModuleImports))
  
  // Step 3: Xata Client Check
  results.push(await debugStep('Xata Client Connection', checkXataClient))
  
  // Step 4: Database Schema Check
  results.push(await debugStep('Database Schema', checkDatabaseSchema))
  
  // Step 5: Basic Table Queries
  results.push(await debugStep('Basic Table Query', testBasicTableQuery))
  
  // Step 6: Ask Xata AI Function
  results.push(await debugStep('askXataWithAi Function', testAskXataWithAi))
  
  // Step 7: Data Transformation
  results.push(await debugStep('Data Transformation', testDataTransformation))
  
  // Step 8: Layout Algorithm
  results.push(await debugStep('Layout Algorithm', testLayoutAlgorithm))
  
  // Step 9: Full Integration Test
  results.push(await debugStep('Full xataToXYFlow Integration', testFullIntegration))
  
  // Generate summary
  const summary = {
    total: results.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    totalDuration: results.reduce((sum, r) => sum + r.duration, 0)
  }
  
  console.log('📊 Debug Suite Summary:', summary)
  
  return { results, summary }
}

/**
 * Helper function to run a debug step with timing and error handling
 */
async function debugStep(
  stepName: string, 
  testFunction: () => Promise<any>
): Promise<DebugResult> {
  const startTime = performance.now()
  
  try {
    console.log(`\n🔍 Testing: ${stepName}`)
    const data = await testFunction()
    const duration = performance.now() - startTime
    
    console.log(`✅ ${stepName} - PASSED (${duration.toFixed(2)}ms)`)
    return { step: stepName, success: true, data, duration }
  } catch (error) {
    const duration = performance.now() - startTime
    
    console.error(`❌ ${stepName} - FAILED (${duration.toFixed(2)}ms)`)
    console.error('Error details:', error)
    return { step: stepName, success: false, error, duration }
  }
}

/**
 * Step 1: Check environment variables
 */
async function checkEnvironmentVariables() {
  const requiredVars = ['XATA_API_KEY']
  const envCheck: Record<string, boolean> = {}
  
  for (const varName of requiredVars) {
    envCheck[varName] = !!process.env[varName]
  }
  
  const missingVars = Object.entries(envCheck)
    .filter(([_, exists]) => !exists)
    .map(([name]) => name)
  
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
  }
  
  return {
    allPresent: true,
    variables: envCheck,
    xataApiKeyLength: process.env.XATA_API_KEY?.length || 0
  }
}

/**
 * Step 2: Check module imports
 */
async function checkModuleImports() {
  try {
    // Test Xata imports
    const { askXataWithAi } = await import('@db/xata/api')
    const { xata } = await import('@db/xata/client')
    const { getXataClient } = await import('@db/xata/xata')
    
    // Test layout algorithm import
    const { organizeNodeLayout } = await import('../layouts/organizeNodeLayout')
    
    return {
      xataApi: !!askXataWithAi,
      xataClient: !!xata,
      xataClientGetter: !!getXataClient,
      layoutAlgorithm: !!organizeNodeLayout,
      imports: 'All critical modules imported successfully'
    }
  } catch (error) {
    throw new Error(`Module import failed: ${error}`)
  }
}

/**
 * Step 3: Check Xata client connection
 */
async function checkXataClient() {
  const { xata } = await import('@db/xata/client')
  const { getXataClient } = await import('@db/xata/xata')
  
  // Check client instances
  const client1 = xata
  const client2 = getXataClient()
  
  // Check database URL and API key
  const dbUrl = client2.databaseURL
  const hasApiKey = !!client2.fetch?.headers?.Authorization
  
  // Test basic connectivity (this doesn't make a request)
  const tables = client2.db
  const tableNames = Object.keys(tables)
  
  return {
    clientsCreated: !!(client1 && client2),
    databaseUrl: dbUrl,
    hasApiKey,
    availableTables: tableNames,
    tableCount: tableNames.length,
    expectedTables: ['events', 'personnel', 'organizations', 'topics']
  }
}

/**
 * Step 4: Check database schema and basic connectivity
 */
async function checkDatabaseSchema() {
  const { xata } = await import('@db/xata/client')
  
  // Test basic connectivity with a simple query
  try {
    // Try to get schema information or make a simple query
    const eventsTable = xata.db.events
    
    // This should not fail if connection is working
    if (!eventsTable) {
      throw new Error('Events table not accessible')
    }
    
    return {
      tablesAccessible: true,
      eventsTableExists: !!eventsTable,
      clientType: xata.constructor.name,
      dbUrl: xata.databaseURL
    }
  } catch (error) {
    throw new Error(`Database schema check failed: ${error}`)
  }
}

/**
 * Step 5: Test basic table query
 */
async function testBasicTableQuery() {
  const { xata } = await import('@db/xata/client')
  
  try {
    // Try a simple query to get a few records
    const records = await xata.db.events.getMany({
      pagination: { size: 3 }
    })
    
    // Analyze the records
    const recordAnalysis = records.map(record => ({
      id: record.id,
      hasName: !!record.name,
      hasTitle: !!record.title,
      hasDescription: !!record.description,
      fieldsCount: Object.keys(record).length
    }))
    
    return {
      querySuccessful: true,
      recordCount: records.length,
      recordAnalysis,
      sampleRecordFields: records[0] ? Object.keys(records[0]) : [],
      hasRecords: records.length > 0
    }
  } catch (error) {
    throw new Error(`Basic table query failed: ${error}`)
  }
}

/**
 * Step 6: Test askXataWithAi function
 */
async function testAskXataWithAi() {
  const { askXataWithAi } = await import('@db/xata/api')
  
  try {
    const result = await askXataWithAi({
      question: 'Find any UFO events from the 1940s',
      table: 'events',
      rules: ['Find relevant events records']
    })
    
    // Validate the response structure
    const validation = {
      hasAnswer: typeof result.answer === 'string',
      hasSessionId: typeof result.sessionId === 'string',
      hasRecords: Array.isArray(result.records),
      recordCount: result.records?.length || 0,
      answerLength: result.answer?.length || 0
    }
    
    return {
      askSuccessful: true,
      response: validation,
      sampleAnswer: result.answer?.substring(0, 100) + '...',
      recordIds: result.records?.slice(0, 3) || []
    }
  } catch (error) {
    throw new Error(`askXataWithAi failed: ${error}`)
  }
}

/**
 * Step 7: Test data transformation
 */
async function testDataTransformation() {
  // Create mock data that matches expected format
  const mockXataResult = {
    answer: 'Found some test events',
    sessionId: 'test-session-123',
    records: [
      {
        id: 'test-record-1',
        name: 'Test Event 1',
        description: 'Test description',
        date: '1947-07-08'
      },
      {
        id: 'test-record-2', 
        name: 'Test Event 2',
        description: 'Another test',
        date: '1950-01-01'
      }
    ]
  }
  
  const mockSourceNode = {
    id: 'source-node',
    type: 'enhancedEntityNodePOC',
    position: { x: 0, y: 0 },
    data: { id: 'source-node', name: 'Source Node', type: 'events' }
  }
  
  try {
    // Import transformation function
    const { organizeNodeLayout } = await import('../layouts/organizeNodeLayout')
    
    // Test manual transformation (mimicking what happens in transformForReactflow)
    const nodes = mockXataResult.records.map((record, index) => ({
      id: record.id,
      type: 'enhancedEntityNodePOC',
      position: { x: index * 200, y: 0 },
      data: { ...record, type: 'events' },
      parentId: mockSourceNode.id
    }))
    
    const edges = mockXataResult.records.map(record => ({
      id: `edge-${mockSourceNode.id}-${record.id}`,
      source: mockSourceNode.id,
      target: record.id,
      type: 'smoothstep',
      animated: true
    }))
    
    // Test layout algorithm
    const layoutedNodes = organizeNodeLayout(nodes, edges, {
      direction: 'horizontal',
      parentChildSpacing: 100,
      siblingSpacing: 50,
      nodeWidth: 200,
      nodeHeight: 100,
      centerChildren: true
    })
    
    return {
      transformationSuccessful: true,
      originalRecordCount: mockXataResult.records.length,
      generatedNodeCount: nodes.length,
      generatedEdgeCount: edges.length,
      layoutedNodeCount: layoutedNodes.length,
      sampleNode: layoutedNodes[0],
      sampleEdge: edges[0]
    }
  } catch (error) {
    throw new Error(`Data transformation failed: ${error}`)
  }
}

/**
 * Step 8: Test layout algorithm specifically
 */
async function testLayoutAlgorithm() {
  try {
    const { organizeNodeLayout } = await import('../layouts/organizeNodeLayout')
    
    // Create test nodes and edges
    const testNodes = [
      { id: 'node1', type: 'default', position: { x: 0, y: 0 }, data: {} },
      { id: 'node2', type: 'default', position: { x: 0, y: 0 }, data: {} },
      { id: 'node3', type: 'default', position: { x: 0, y: 0 }, data: {} }
    ]
    
    const testEdges = [
      { id: 'edge1', source: 'node1', target: 'node2' },
      { id: 'edge2', source: 'node1', target: 'node3' }
    ]
    
    // Test different layouts
    const horizontalLayout = organizeNodeLayout(testNodes, testEdges, {
      direction: 'horizontal',
      parentChildSpacing: 100,
      siblingSpacing: 50,
      nodeWidth: 200,
      nodeHeight: 100
    })
    
    const radialLayout = organizeNodeLayout(testNodes, testEdges, {
      direction: 'radial',
      parentChildSpacing: 120,
      siblingSpacing: 30,
      nodeWidth: 200,
      nodeHeight: 100
    })
    
    return {
      layoutAlgorithmWorking: true,
      horizontalLayoutNodes: horizontalLayout.length,
      radialLayoutNodes: radialLayout.length,
      sampleHorizontalPosition: horizontalLayout[0]?.position,
      sampleRadialPosition: radialLayout[0]?.position
    }
  } catch (error) {
    throw new Error(`Layout algorithm failed: ${error}`)
  }
}

/**
 * Step 9: Test full integration
 */
async function testFullIntegration() {
  try {
    const { xataToXYFlow } = await import('../actions/xata-to-xyflow')
    
    const testParams = {
      question: 'Find UFO events from 1947',
      table: 'events',
      rules: 'Find relevant events records',
      context: 'Full integration test',
      existingNodes: [],
      sourceNode: {
        id: 'integration-test-source',
        type: 'enhancedEntityNodePOC',
        position: { x: 0, y: 0 },
        data: { id: 'integration-test-source', name: 'Integration Test', type: 'events' }
      },
      layoutType: 'horizontal' as const
    }
    
    const result = await xataToXYFlow(testParams)
    
    // Analyze the result
    const analysis = {
      hasNodes: Array.isArray(result.nodes),
      nodeCount: result.nodes?.length || 0,
      hasEdges: Array.isArray(result.edges),
      edgeCount: result.edges?.length || 0,
      hasXataResponse: !!result.xataResponse,
      xataResponseValid: !!(result.xataResponse?.answer && result.xataResponse?.sessionId),
      recordCount: result.xataResponse?.records?.length || 0
    }
    
    return {
      integrationSuccessful: true,
      resultAnalysis: analysis,
      sampleNodeData: result.nodes?.[0]?.data,
      errorInAnswer: result.xataResponse?.answer?.includes('Error:')
    }
  } catch (error) {
    throw new Error(`Full integration test failed: ${error}`)
  }
}

/**
 * Generate a comprehensive debug report
 */
export function generateDebugReport(debugSuite: DebugSuite): string {
  const { results, summary } = debugSuite
  
  let report = `
# xataToXYFlow Debug Report
**Generated:** ${new Date().toISOString()}
**Test Duration:** ${summary.totalDuration.toFixed(2)}ms

## Summary
- **Total Tests:** ${summary.total}
- **Passed:** ${summary.passed} ✅
- **Failed:** ${summary.failed} ❌
- **Success Rate:** ${((summary.passed / summary.total) * 100).toFixed(1)}%

## Test Results

`

  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL'
    const duration = result.duration.toFixed(2)
    
    report += `### ${index + 1}. ${result.step} - ${status} (${duration}ms)\n\n`
    
    if (result.success && result.data) {
      report += '**Data:**\n```json\n'
      report += JSON.stringify(result.data, null, 2)
      report += '\n```\n\n'
    }
    
    if (!result.success && result.error) {
      report += '**Error:**\n```\n'
      report += result.error.toString()
      report += '\n```\n\n'
    }
  })
  
  // Add recommendations
  report += `
## Recommendations

`
  
  const failedTests = results.filter(r => !r.success)
  if (failedTests.length > 0) {
    report += '### Issues Found:\n'
    failedTests.forEach(test => {
      report += `- **${test.step}**: ${test.error}\n`
    })
  } else {
    report += '### All Tests Passed! ✅\n'
    report += 'The xataToXYFlow pipeline appears to be working correctly.\n'
  }
  
  return report
}

/**
 * Quick test runner for client components
 */
export async function quickDebugCheck(): Promise<{
  success: boolean
  criticalIssues: string[]
  summary: string
}> {
  try {
    const suite = await runComprehensiveDebug()
    const failedCriticalTests = suite.results
      .filter(r => !r.success && ['Xata Client Connection', 'Basic Table Query', 'askXataWithAi Function'].includes(r.step))
      .map(r => r.step)
    
    const success = failedCriticalTests.length === 0
    const summary = `${suite.summary.passed}/${suite.summary.total} tests passed`
    
    return {
      success,
      criticalIssues: failedCriticalTests,
      summary
    }
  } catch (error) {
    return {
      success: false,
      criticalIssues: ['Debug suite execution failed'],
      summary: `Error: ${error}`
    }
  }
}