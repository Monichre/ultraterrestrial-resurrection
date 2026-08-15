#!/usr/bin/env bun
/**
 * Xata CLI Commands Demo
 * Interactive demonstration of CLI operations
 */

import { executeXataCommand, getAvailableTables } from './commands/index';

async function demo() {
  console.log('🎯 Xata CLI Commands Demo');
  console.log('=========================\n');

  // Show available tables
  console.log('📋 Available Tables:');
  const tables = getAvailableTables();
  tables.forEach(table => console.log(`   • ${table}`));
  console.log();

  // Demo 1: Create a topic
  console.log('🆕 Demo 1: Creating a Topic');
  console.log('-'.repeat(30));

  const createResult = await executeXataCommand({
    operation: 'create',
    table: 'topics',
    data: {
      title: 'CLI Demo Topic',
      name: 'cli-demo-topic',
      summary: 'This topic was created via CLI demo to demonstrate CRUD operations'
    }
  });

  if (createResult.success) {
    console.log('✅ Topic created successfully!');
    console.log(`   ID: ${createResult.data.id}`);
    console.log(`   Title: ${createResult.data.title}`);
    console.log(`   Execution time: ${createResult.metadata?.executionTime}ms\n`);

    const topicId = createResult.data.id;

    // Demo 2: Read the topic
    console.log('📖 Demo 2: Reading the Topic');
    console.log('-'.repeat(30));

    const readResult = await executeXataCommand({
      operation: 'read',
      table: 'topics',
      id: topicId
    });

    if (readResult.success) {
      console.log('✅ Topic read successfully!');
      console.log(`   Title: ${readResult.data.title}`);
      console.log(`   Summary: ${readResult.data.summary}`);
      console.log(`   Tags: ${readResult.data.tags?.join(', ')}\n`);
    }

    // Demo 3: Update the topic
    console.log('✏️  Demo 3: Updating the Topic');
    console.log('-'.repeat(30));

    const updateResult = await executeXataCommand({
      operation: 'update',
      table: 'topics',
      id: topicId,
      data: {
        summary: 'Updated via CLI demo - this topic demonstrates update operations successfully'
      }
    });

    if (updateResult.success) {
      console.log('✅ Topic updated successfully!');
      console.log(`   New credibility score: ${updateResult.data.credibility_score}`);
      console.log(`   New importance level: ${updateResult.data.importance_level}\n`);
    }

    // Demo 4: Search for topics
    console.log('🔍 Demo 4: Searching Topics');
    console.log('-'.repeat(30));

    const searchResult = await executeXataCommand({
      operation: 'search',
      table: 'topics',
      options: {
        searchQuery: 'CLI demo'
      }
    });

    if (searchResult.success) {
      console.log('✅ Search completed successfully!');
      console.log(`   Found ${searchResult.data.records?.length || 0} topics`);
      if (searchResult.data.records?.length > 0) {
        console.log(`   First result: ${searchResult.data.records[0].title}`);
      }
      console.log();
    }

    // Demo 5: Filter topics
    console.log('🎯 Demo 5: Filtering Topics');
    console.log('-'.repeat(30));

    const filterResult = await executeXataCommand({
      operation: 'read',
      table: 'topics',
      filter: { category: 'demo' },
      options: { limit: 5 }
    });

    if (filterResult.success) {
      console.log('✅ Filter completed successfully!');
      console.log(`   Found ${Array.isArray(filterResult.data) ? filterResult.data.length : 0} demo topics`);
      console.log();
    }

    // Demo 6: Bulk create
    console.log('📦 Demo 6: Bulk Creating Topics');
    console.log('-'.repeat(30));

    const bulkData = [
      {
        title: 'Bulk Topic 1',
        name: 'bulk-topic-1',
        summary: 'First bulk created topic',
        category: 'bulk-demo',
        credibility_score: 4
      },
      {
        title: 'Bulk Topic 2',
        name: 'bulk-topic-2',
        summary: 'Second bulk created topic',
        category: 'bulk-demo',
        credibility_score: 4
      }
    ];

    const bulkResult = await executeXataCommand({
      operation: 'bulk',
      table: 'topics',
      data: bulkData
    });

    if (bulkResult.success) {
      console.log('✅ Bulk create completed successfully!');
      console.log(`   Created ${bulkResult.data?.length || 0} topics`);
      console.log();
    }

    // Demo 7: Error handling
    console.log('🚨 Demo 7: Error Handling');
    console.log('-'.repeat(30));

    const errorResult = await executeXataCommand({
      operation: 'read',
      table: 'nonexistent_table',
      id: 'fake-id'
    });

    if (!errorResult.success) {
      console.log('✅ Error handling working correctly!');
      console.log(`   Error: ${errorResult.error}`);
      console.log();
    }

    // Cleanup: Delete the demo topic
    console.log('🧹 Cleanup: Deleting Demo Topic');
    console.log('-'.repeat(30));

    const deleteResult = await executeXataCommand({
      operation: 'delete',
      table: 'topics',
      id: topicId
    });

    if (deleteResult.success) {
      console.log('✅ Demo topic deleted successfully!');
      console.log();
    }

    // Cleanup: Delete bulk topics
    console.log('🧹 Cleanup: Deleting Bulk Topics');
    console.log('-'.repeat(30));

    const cleanupResult = await executeXataCommand({
      operation: 'delete',
      table: 'topics',
      filter: { category: 'bulk-demo' }
    });

    if (cleanupResult.success) {
      console.log('✅ Bulk demo topics deleted successfully!');
      console.log();
    }

  } else {
    console.log('❌ Failed to create topic:', createResult.error);
  }

  console.log('🎉 CLI Demo completed!');
  console.log('\n💡 Usage Examples:');
  console.log('   bun run cmd:create \'{"operation":"create","table":"topics","data":{"title":"My Topic","name":"my-topic","summary":"Description"}}\'');
  console.log('   bun run cmd:read \'{"operation":"read","table":"topics","filter":{"category":"demo"},"options":{"limit":5}}\'');
  console.log('   bun run cmd:update \'{"operation":"update","table":"topics","id":"topic-id","data":{"credibility_score":8}}\'');
  console.log('   bun run cmd:delete \'{"operation":"delete","table":"topics","id":"topic-id"}\'');
}

// Run the demo
if (import.meta.main) {
  demo().catch(error => {
    console.error('💥 Demo failed:', error);
    process.exit(1);
  });
}