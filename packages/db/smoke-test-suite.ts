#!/usr/bin/env bun
/**
 * Xata CLI Commands Smoke Test Suite
 * Comprehensive testing of all CRUD operations and edge cases
 */

import { executeXataCommand, getAvailableTables, CLIError } from './commands/index';

// Test data generators - Updated to match actual Xata schema
function generateTestTopic() {
  return {
    title: `Test Topic ${Date.now()}`,
    name: `test-topic-${Date.now()}`,
    summary: 'This is a test topic created by the smoke test suite for CLI validation'
  };
}

function generateTestEvent() {
  return {
    title: `Test Event ${Date.now()}`,
    name: `Test Event ${Date.now()}`,
    description: 'This is a test event created by the smoke test suite for CLI validation',
    date: new Date().toISOString(),
    location: 'Test Location',
    summary: 'Summary of test event',
    category: ['test', 'automation']
  };
}

function generateTestPersonnel() {
  return {
    name: `Test Person ${Date.now()}`,
    role: 'Researcher',
    bio: 'Test personnel created by smoke test suite for CLI validation',
    credibility: 5,
    authority: 4,
    rank: 3,
    popularity: 2
  };
}

// Test utilities
class TestSuite {
  private results: Array<{
    test: string;
    status: 'PASS' | 'FAIL' | 'SKIP';
    duration: number;
    error?: string;
  }> = [];

  private testData: {
    topicId?: string;
    eventId?: string;
    personnelId?: string;
  } = {};

  async runTest(testName: string, testFn: () => Promise<void>) {
    const startTime = Date.now();

    try {
      console.log(`🧪 Running: ${testName}`);
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ test: testName, status: 'PASS', duration });
      console.log(`✅ PASS: ${testName} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.push({ test: testName, status: 'FAIL', duration, error: errorMessage });
      console.log(`❌ FAIL: ${testName} (${duration}ms) - ${errorMessage}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Xata CLI Smoke Test Suite\n');
    console.log('=' .repeat(50));

    // Basic connectivity tests
    await this.runTest('Database Connection', this.testConnection.bind(this));
    await this.runTest('Available Tables', this.testAvailableTables.bind(this));

    // CRUD operations
    await this.runTest('Create Topic', this.testCreateTopic.bind(this));
    await this.runTest('Create Event', this.testCreateEvent.bind(this));
    await this.runTest('Create Personnel', this.testCreatePersonnel.bind(this));

    await this.runTest('Read Topic', this.testReadTopic.bind(this));
    await this.runTest('Read Event', this.testReadEvent.bind(this));
    await this.runTest('Read Personnel', this.testReadPersonnel.bind(this));

    await this.runTest('Update Topic', this.testUpdateTopic.bind(this));
    await this.runTest('Update Event', this.testUpdateEvent.bind(this));
    await this.runTest('Update Personnel', this.testUpdatePersonnel.bind(this));

    await this.runTest('Search Topics', this.testSearchTopics.bind(this));
    await this.runTest('Filter Events', this.testFilterEvents.bind(this));

    // Bulk operations
    await this.runTest('Bulk Create', this.testBulkCreate.bind(this));

    // Error handling
    await this.runTest('Invalid Table', this.testInvalidTable.bind(this));
    await this.runTest('Missing Data', this.testMissingData.bind(this));
    await this.runTest('Invalid ID', this.testInvalidId.bind(this));

    // Cleanup
    await this.runTest('Delete Topic', this.testDeleteTopic.bind(this));
    await this.runTest('Delete Event', this.testDeleteEvent.bind(this));
    await this.runTest('Delete Personnel', this.testDeletePersonnel.bind(this));

    // Report results
    this.printReport();
  }

  private async testConnection() {
    const result = await executeXataCommand({
      operation: 'read',
      table: 'topics',
      options: { limit: 1 }
    });

    if (!result.success) {
      throw new Error(`Connection failed: ${result.error}`);
    }
  }

  private async testAvailableTables() {
    const tables = getAvailableTables();
    if (!Array.isArray(tables) || tables.length === 0) {
      throw new Error('No tables available');
    }
    console.log(`   Found ${tables.length} tables: ${tables.slice(0, 5).join(', ')}...`);
  }

  private async testCreateTopic() {
    const topicData = generateTestTopic();
    const result = await executeXataCommand({
      operation: 'create',
      table: 'topics',
      data: topicData
    });

    if (!result.success || !result.data?.id) {
      throw new Error(`Create failed: ${result.error}`);
    }

    this.testData.topicId = result.data.id;
    console.log(`   Created topic: ${result.data.id}`);
  }

  private async testCreateEvent() {
    const eventData = generateTestEvent();
    const result = await executeXataCommand({
      operation: 'create',
      table: 'events',
      data: eventData
    });

    if (!result.success || !result.data?.id) {
      throw new Error(`Create failed: ${result.error}`);
    }

    this.testData.eventId = result.data.id;
    console.log(`   Created event: ${result.data.id}`);
  }

  private async testCreatePersonnel() {
    const personnelData = generateTestPersonnel();
    const result = await executeXataCommand({
      operation: 'create',
      table: 'personnel',
      data: personnelData
    });

    if (!result.success || !result.data?.id) {
      throw new Error(`Create failed: ${result.error}`);
    }

    this.testData.personnelId = result.data.id;
    console.log(`   Created personnel: ${result.data.id}`);
  }

  private async testReadTopic() {
    if (!this.testData.topicId) throw new Error('No topic ID available');

    const result = await executeXataCommand({
      operation: 'read',
      table: 'topics',
      id: this.testData.topicId
    });

    if (!result.success || !result.data) {
      throw new Error(`Read failed: ${result.error}`);
    }

    console.log(`   Read topic: ${result.data.title}`);
  }

  private async testReadEvent() {
    if (!this.testData.eventId) throw new Error('No event ID available');

    const result = await executeXataCommand({
      operation: 'read',
      table: 'events',
      id: this.testData.eventId
    });

    if (!result.success || !result.data) {
      throw new Error(`Read failed: ${result.error}`);
    }

    console.log(`   Read event: ${result.data.title}`);
  }

  private async testReadPersonnel() {
    if (!this.testData.personnelId) throw new Error('No personnel ID available');

    const result = await executeXataCommand({
      operation: 'read',
      table: 'personnel',
      id: this.testData.personnelId
    });

    if (!result.success || !result.data) {
      throw new Error(`Read failed: ${result.error}`);
    }

    console.log(`   Read personnel: ${result.data.name}`);
  }

  private async testUpdateTopic() {
    if (!this.testData.topicId) throw new Error('No topic ID available');

    const result = await executeXataCommand({
      operation: 'update',
      table: 'topics',
      id: this.testData.topicId,
      data: {
        summary: 'Updated summary by smoke test suite - CLI validation successful'
      }
    });

    if (!result.success) {
      throw new Error(`Update failed: ${result.error}`);
    }

    console.log(`   Updated topic: ${this.testData.topicId}`);
  }

  private async testUpdateEvent() {
    if (!this.testData.eventId) throw new Error('No event ID available');

    const result = await executeXataCommand({
      operation: 'update',
      table: 'events',
      id: this.testData.eventId,
      data: {
        description: 'Updated description by smoke test suite - CLI validation successful'
      }
    });

    if (!result.success) {
      throw new Error(`Update failed: ${result.error}`);
    }

    console.log(`   Updated event: ${this.testData.eventId}`);
  }

  private async testUpdatePersonnel() {
    if (!this.testData.personnelId) throw new Error('No personnel ID available');

    const result = await executeXataCommand({
      operation: 'update',
      table: 'personnel',
      id: this.testData.personnelId,
      data: {
        role: 'Senior Researcher',
        credibility: 7
      }
    });

    if (!result.success) {
      throw new Error(`Update failed: ${result.error}`);
    }

    console.log(`   Updated personnel: ${this.testData.personnelId}`);
  }

  private async testSearchTopics() {
    const result = await executeXataCommand({
      operation: 'search',
      table: 'topics',
      options: {
        searchQuery: 'test topic'
      }
    });

    if (!result.success) {
      throw new Error(`Search failed: ${result.error}`);
    }

    console.log(`   Found ${result.data?.records?.length || 0} topics`);
  }

  private async testFilterEvents() {
    const result = await executeXataCommand({
      operation: 'read',
      table: 'events',
      filter: { category: 'test' },
      options: { limit: 5 }
    });

    if (!result.success) {
      throw new Error(`Filter failed: ${result.error}`);
    }

    console.log(`   Found ${Array.isArray(result.data) ? result.data.length : 0} test events`);
  }

  private async testBulkCreate() {
    const bulkData = [
      generateTestTopic(),
      generateTestTopic(),
      generateTestTopic()
    ];

    const result = await executeXataCommand({
      operation: 'bulk',
      table: 'topics',
      data: bulkData
    });

    if (!result.success) {
      throw new Error(`Bulk create failed: ${result.error}`);
    }

    console.log(`   Created ${result.data?.length || 0} topics in bulk`);
  }

  private async testInvalidTable() {
    const result = await executeXataCommand({
      operation: 'read',
      table: 'nonexistent_table'
    });

    if (result.success) {
      throw new Error('Should have failed with invalid table');
    }

    console.log(`   Correctly rejected invalid table: ${result.error}`);
  }

  private async testMissingData() {
    const result = await executeXataCommand({
      operation: 'create',
      table: 'topics'
      // Missing data
    });

    if (result.success) {
      throw new Error('Should have failed with missing data');
    }

    console.log(`   Correctly rejected missing data: ${result.error}`);
  }

  private async testInvalidId() {
    const result = await executeXataCommand({
      operation: 'read',
      table: 'topics',
      id: 'invalid-id-12345'
    });

    if (result.success) {
      throw new Error('Should have failed with invalid ID');
    }

    console.log(`   Correctly handled invalid ID: ${result.error}`);
  }

  private async testDeleteTopic() {
    if (!this.testData.topicId) return; // Skip if no topic was created

    const result = await executeXataCommand({
      operation: 'delete',
      table: 'topics',
      id: this.testData.topicId
    });

    if (!result.success) {
      throw new Error(`Delete failed: ${result.error}`);
    }

    console.log(`   Deleted topic: ${this.testData.topicId}`);
  }

  private async testDeleteEvent() {
    if (!this.testData.eventId) return; // Skip if no event was created

    const result = await executeXataCommand({
      operation: 'delete',
      table: 'events',
      id: this.testData.eventId
    });

    if (!result.success) {
      throw new Error(`Delete failed: ${result.error}`);
    }

    console.log(`   Deleted event: ${this.testData.eventId}`);
  }

  private async testDeletePersonnel() {
    if (!this.testData.personnelId) return; // Skip if no personnel was created

    const result = await executeXataCommand({
      operation: 'delete',
      table: 'personnel',
      id: this.testData.personnelId
    });

    if (!result.success) {
      throw new Error(`Delete failed: ${result.error}`);
    }

    console.log(`   Deleted personnel: ${this.testData.personnelId}`);
  }

  private printReport() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 SMOKE TEST RESULTS');
    console.log('='.repeat(50));

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;
    const total = this.results.length;

    console.log(`\n📈 SUMMARY:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log(`\n❌ FAILED TESTS:`);
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`   • ${result.test}: ${result.error}`);
        });
    }

    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    console.log(`\n⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`   Average per test: ${(totalDuration / total).toFixed(1)}ms`);

    console.log('\n' + '='.repeat(50));

    if (passed === total) {
      console.log('🎉 ALL TESTS PASSED! CLI is ready for production.');
    } else if (passed / total >= 0.8) {
      console.log('⚠️  MOST TESTS PASSED. Review failed tests before production.');
    } else {
      console.log('🚨 CRITICAL ISSUES. CLI requires fixes before use.');
    }

    console.log('='.repeat(50));
  }
}

// Run the test suite
async function main() {
  const testSuite = new TestSuite();
  await testSuite.runAllTests();
}

// Handle command line execution
if (import.meta.main) {
  main().catch(error => {
    console.error('❌ Smoke test suite failed:', error);
    process.exit(1);
  });
}

export { TestSuite };