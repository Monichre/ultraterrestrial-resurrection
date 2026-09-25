#!/usr/bin/env bun
/**
 * Xata CLI Smoke Test Runner
 * Simple wrapper to run the comprehensive smoke test suite
 */

import { TestSuite } from './smoke-test-suite';

async function main() {
  console.log('🚀 Xata CLI Smoke Test Suite Runner');
  console.log('=====================================\n');

  // Check environment
  console.log('🔧 Environment Check:');
  console.log(`   Node Version: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Working Directory: ${process.cwd()}\n`);

  // Check for required environment variables
  const requiredEnvVars = ['XATA_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log('⚠️  Missing Environment Variables:');
    missingVars.forEach(varName => {
      console.log(`   ❌ ${varName} is not set`);
    });
    console.log('\n💡 Please set the required environment variables and try again.\n');
    process.exit(1);
  }

  console.log('✅ Environment variables are set\n');

  // Run the test suite
  const testSuite = new TestSuite();

  try {
    await testSuite.runAllTests();
  } catch (error) {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  }
}

// Handle command line execution
if (import.meta.main) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}