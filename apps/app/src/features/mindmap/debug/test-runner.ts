#!/usr/bin/env bun
/**
 * Test Runner for xataToXYFlow Enhanced Error Handling
 * 
 * Created: July 10, 2025 at 10:50 AM PST
 * Purpose: Quick test runner to verify the enhanced error handling works
 * 
 * Usage:
 * bun run apps/app/src/features/mindmap/debug/test-runner.ts
 */

import { runComprehensiveDebug } from './comprehensive-debug'

async function main() {
  console.log('🚀 Starting xataToXYFlow Debug Test Runner...')
  console.log('📅 Timestamp:', new Date().toISOString())
  console.log('=' * 60)
  
  try {
    const debugSuite = await runComprehensiveDebug()
    
    console.log('\n📊 FINAL RESULTS:')
    console.log('=' * 40)
    console.log(`✅ Passed: ${debugSuite.summary.passed}`)
    console.log(`❌ Failed: ${debugSuite.summary.failed}`)
    console.log(`📈 Total: ${debugSuite.summary.total}`)
    console.log(`⏱️  Duration: ${debugSuite.summary.totalDuration.toFixed(2)}ms`)
    console.log(`🎯 Success Rate: ${((debugSuite.summary.passed / debugSuite.summary.total) * 100).toFixed(1)}%`)
    
    // Show failed tests
    const failedTests = debugSuite.results.filter(r => !r.success)
    if (failedTests.length > 0) {
      console.log('\n❌ FAILED TESTS:')
      console.log('-' * 20)
      failedTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.step}`)
        console.log(`   Error: ${test.error}`)
        console.log(`   Duration: ${test.duration.toFixed(2)}ms`)
      })
    }
    
    // Show successful tests
    const passedTests = debugSuite.results.filter(r => r.success)
    if (passedTests.length > 0) {
      console.log('\n✅ PASSED TESTS:')
      console.log('-' * 20)
      passedTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.step} (${test.duration.toFixed(2)}ms)`)
      })
    }
    
  } catch (error) {
    console.error('\n❌ CRITICAL ERROR: Debug suite execution failed')
    console.error('Error details:', error)
    process.exit(1)
  }
  
  console.log('\n🎯 Test runner completed successfully!')
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})