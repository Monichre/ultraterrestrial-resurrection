#!/usr/bin/env node

/**
 * Test script for the Personnel Ranking System
 * 
 * This script performs a simple test of the ranking system by:
 * 1. Getting the current rankings (GET endpoint)
 * 2. Running a dry-run ranking calculation (POST endpoint)
 * 3. Displaying results and performance metrics
 * 
 * Usage: node test-ranking-system.js [baseUrl]
 * Where baseUrl defaults to http://localhost:3000 if not provided
 */

const fetch = require('node-fetch');

// Get base URL from command line args or use default
const baseUrl = process.argv[2] || 'http://localhost:3000';
const endpoint = '/api/admin/test-ranking-system';

async function runTests() {
  try {
    console.log(`\n🧪 Testing Personnel Ranking System (${baseUrl}${endpoint})\n`);
    
    // Step 1: Get current rankings
    console.log('1️⃣ Fetching current rankings...');
    const currentRankings = await fetch(`${baseUrl}${endpoint}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      });
    
    // Display current ranking stats
    console.log('✅ Current ranking statistics:');
    console.log(`   Total personnel: ${currentRankings.statistics.count || 'N/A'}`);
    console.log(`   Average rank: ${currentRankings.statistics.avgRank?.toFixed(2) || 'N/A'}`);
    console.log(`   Max rank: ${currentRankings.statistics.maxRank || 'N/A'}`);
    console.log(`   Min rank: ${currentRankings.statistics.minRank || 'N/A'}`);
    
    // Step 2: Run a dry-run ranking calculation with modified weights
    console.log('\n2️⃣ Running dry-run calculation with custom weights...');
    const customWeights = {
      EVENT_PARTICIPATION: 1.5,   // Increase weight for events
      TOPIC_EXPERTISE: 1.2,       // Increase weight for topics
      ORGANIZATIONAL_ROLE: 0.8,   // Decrease weight for organizations
      DOCUMENTED_EVIDENCE: 1.3,   // Increase weight for documents
      TESTIMONY_COUNT: 1.0,       // Keep default for testimonies
      QUOTE_COUNT: 1.5            // Keep default for quotes
    };
    
    const dryRunResults = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        dryRun: true,
        weights: customWeights
      })
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    });
    
    // Display dry run stats
    console.log('✅ Dry-run calculation complete:');
    console.log(`   Total personnel processed: ${dryRunResults.stats.recordsProcessed}`);
    console.log(`   Execution time: ${dryRunResults.stats.executionTimeMs}ms`);
    console.log(`   New max score: ${dryRunResults.stats.maxScore.toFixed(2)}`);
    console.log(`   New min score: ${dryRunResults.stats.minScore.toFixed(2)}`);
    console.log(`   New average score: ${dryRunResults.stats.avgScore.toFixed(2)}`);
    
    // Step 3: Display top 5 personnel and their projected changes
    if (dryRunResults.preview?.length > 0) {
      console.log('\n3️⃣ Top 5 personnel with projected rank changes:');
      console.log('   -----------------------------------------------');
      console.log('   Name                Current → New    Change');
      console.log('   -----------------------------------------------');
      
      dryRunResults.preview.slice(0, 5).forEach(person => {
        const currentRank = person.currentRank || 'N/A';
        const newRank = person.newRank;
        const change = person.rankChange !== null ? 
          (person.rankChange > 0 ? `+${person.rankChange}` : person.rankChange) : 
          'N/A';
        
        console.log(`   ${person.name.padEnd(20)} ${String(currentRank).padEnd(5)} → ${String(newRank).padEnd(5)} ${change}`);
      });
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();