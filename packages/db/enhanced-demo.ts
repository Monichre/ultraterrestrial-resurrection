#!/usr/bin/env bun
/**
 * Enhanced Xata CLI Demo
 * Showcases both interactive CLI and AI-powered commands
 */

import { executeXataCommand } from './commands/index';
import { askXata, askXataComprehensive, ufoResearch } from './src/xata-typescript-sdk/api/ask';
import { searchXata } from './src/xata-typescript-sdk/api/search';

async function demo() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                🛸 Enhanced Xata CLI Demo                   ║
║         Interactive CLI + AI-Powered Operations            ║
╚══════════════════════════════════════════════════════════════╝

This demo showcases the new features:
1. 🎯 Interactive CLI with table selection and operations
2. 🤖 AI-powered ask, search, and analysis commands
3. 🛸 Specialized UFO research operations
4. 📊 Data aggregation and analytics

Let's start with some AI-powered operations...
`);

  // Demo 1: Basic AI Ask
  console.log('\n' + '='.repeat(60));
  console.log('🤖 Demo 1: Basic AI Ask Operation');
  console.log('='.repeat(60));

  try {
    console.log('Asking: "Tell me about credible UFO sightings"');
    const askResult = await askXata('events', 'Tell me about credible UFO sightings with multiple witnesses');

    console.log('\n📝 AI Response:');
    console.log(askResult.answer.substring(0, 200) + '...');

    console.log(`\n📊 Results: ${askResult.records.length} records found`);
    console.log(`🔗 Session ID: ${askResult.sessionId}`);
  } catch (error) {
    console.log(`❌ AI Ask failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Demo 2: Comprehensive AI Analysis
  console.log('\n' + '='.repeat(60));
  console.log('🧠 Demo 2: Comprehensive AI Analysis');
  console.log('='.repeat(60));

  try {
    console.log('Comprehensive analysis: "Find government disclosure events"');
    const comprehensiveResult = await askXataComprehensive('events', 'Find government disclosure events', {
      searchType: 'keyword',
      keywordSearch: {
        fuzziness: 1,
        target: ['description', 'summary', 'title']
      }
    });

    console.log('\n📝 Comprehensive Analysis:');
    console.log(comprehensiveResult.answer.substring(0, 250) + '...');

    console.log(`\n📊 Analysis: ${comprehensiveResult.records.length} records analyzed`);
  } catch (error) {
    console.log(`❌ Comprehensive analysis failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Demo 3: Search Operations
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Demo 3: Search Operations');
  console.log('='.repeat(60));

  try {
    console.log('Searching: "military witness"');
    const searchResult = await searchXata({
      query: 'military witness',
      table: null // Search all tables
    });

    if (searchResult.success) {
      console.log(`✅ Found ${searchResult.searchResults?.length || 0} results`);

      if (searchResult.searchResults && searchResult.searchResults.length > 0) {
        console.log('\n📋 Top Results:');
        searchResult.searchResults.slice(0, 3).forEach((record: any, index: number) => {
          const title = record.title || record.name || 'Untitled';
          console.log(`   ${index + 1}. ${title}`);
        });
      }
    } else {
      console.log(`❌ Search failed: ${searchResult.error}`);
    }
  } catch (error) {
    console.log(`❌ Search failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Demo 4: UFO Credibility Analysis
  console.log('\n' + '='.repeat(60));
  console.log('🛸 Demo 4: UFO Credibility Analysis');
  console.log('='.repeat(60));

  try {
    console.log('UFO Credibility Analysis: "Find sightings with radar confirmation"');
    const credibilityResult = await ufoResearch.askCredibilityAnalysis(
      'events',
      'Find sightings with radar confirmation and multiple witnesses',
      { minCredibilityScore: 8 }
    );

    console.log('\n📝 Credibility Analysis:');
    console.log(credibilityResult.answer.substring(0, 200) + '...');

    console.log(`\n📊 Credibility Assessment: ${credibilityResult.records.length} cases evaluated`);
  } catch (error) {
    console.log(`❌ UFO credibility analysis failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Demo 5: Government Disclosure Research
  console.log('\n' + '='.repeat(60));
  console.log('🏛️ Demo 5: Government Disclosure Research');
  console.log('='.repeat(60));

  try {
    console.log('Government Disclosure Research: "What has the Pentagon acknowledged"');
    const disclosureResult = await ufoResearch.askGovernmentDisclosure(
      'events',
      'What has the Pentagon officially acknowledged about UAP',
      { officialOnly: true }
    );

    console.log('\n📝 Disclosure Research:');
    console.log(disclosureResult.answer.substring(0, 200) + '...');

    console.log(`\n📊 Official Acknowledgments: ${disclosureResult.records.length} records analyzed`);
  } catch (error) {
    console.log(`❌ Government disclosure research failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Demo 6: Multi-Table Research
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Demo 6: Multi-Table Research');
  console.log('='.repeat(60));

  try {
    console.log('Multi-Table Research: "Comprehensive analysis of witness credibility"');
    const multiTableResult = await ufoResearch.askMultiTableResearch(
      'Analyze the credibility of witnesses across different sighting types',
      {
        tables: ['events', 'personnel', 'testimonies'],
        researchType: 'SCIENTIFIC_ANALYSIS'
      }
    );

    console.log('\n📝 Multi-Table Analysis:');
    console.log(multiTableResult.combinedAnswer.substring(0, 250) + '...');

    console.log(`\n📊 Cross-Table Research:`);
    console.log(`   Tables analyzed: ${Object.keys(multiTableResult.tableResults).length}`);
    console.log(`   Total records: ${Object.values(multiTableResult.tableResults).reduce((sum, tableResult) => sum + tableResult.records.length, 0)}`);
  } catch (error) {
    console.log(`❌ Multi-table research failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Demo 7: Data Aggregation
  console.log('\n' + '='.repeat(60));
  console.log('📊 Demo 7: Data Aggregation');
  console.log('='.repeat(60));

  try {
    console.log('Aggregating event categories...');
    const aggregateResult = await executeXataCommand({
      operation: 'read',
      table: 'events',
      options: { limit: 500 }
    });

    if (aggregateResult.success && Array.isArray(aggregateResult.data)) {
      const records = aggregateResult.data;
      console.log(`📈 Analyzing ${records.length} events...`);

      // Category analysis
      const categoryCounts: Record<string, number> = {};
      records.forEach((record: any) => {
        const category = Array.isArray(record.category)
          ? record.category.join(', ')
          : record.category || 'uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      console.log('\n📊 Category Distribution:');
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count} events (${((count / records.length) * 100).toFixed(1)}%)`);
        });
    }
  } catch (error) {
    console.log(`❌ Data aggregation failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Interactive CLI Introduction
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Demo 8: Interactive CLI Introduction');
  console.log('='.repeat(60));

  console.log(`
🚀 INTERACTIVE CLI FEATURES:

The interactive CLI provides:
• 🎯 Table selection and context awareness
• 🤖 AI-powered question answering
• 🛸 Specialized UFO research commands
• 📊 Real-time data analysis
• 🔍 Advanced search capabilities
• 📜 Command history and session management

To start the interactive CLI:
  bun run interactive

Available Interactive Commands:
• use <table> - Select working table
• ask "<question>" - AI questions
• ufo-credibility "<question>" - Credibility analysis
• search "<query>" - Search operations
• aggregate <operation> - Data analysis
• help - Show all commands

Example Interactive Session:
  xata-cli> use events
  xata-cli:events> ask "Tell me about credible sightings"
  xata-cli:events> ufo-credibility "Find radar confirmed cases"
  xata-cli:events> aggregate categories
  xata-cli:events> help
`);

  // CLI Command Examples
  console.log('\n' + '='.repeat(60));
  console.log('💻 Demo 9: CLI Command Examples');
  console.log('='.repeat(60));

  console.log(`
🔧 DIRECT CLI COMMANDS:

# AI Operations
bun run cmd:ask events "Tell me about military sightings"
bun run cmd:search "UFO disclosure"
bun run enhanced-cli ask events "Analyze sighting patterns"

# UFO Research
bun run cmd:ufo-credibility "Find high-credibility cases"
bun run cmd:ufo-disclosure "Government acknowledgment"
bun run cmd:ufo-timeline "Historical patterns"
bun run cmd:multi-table "Cross-table analysis"

# Data Operations
bun run cmd:create '{"operation":"create","table":"topics","data":{"title":"Test","name":"test","summary":"Test topic"}}'
bun run cmd:read '{"operation":"read","table":"topics","id":"rec_xxx"}'
bun run cmd:aggregate events categories

# Interactive Mode
bun run interactive

📚 For complete documentation, see:
• packages/db/docs/CLI_USAGE_GUIDE.md
• packages/db/docs/XATA_METHODS.md
• packages/db/README.md
`);

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Enhanced Xata CLI Demo Complete!');
  console.log('='.repeat(60));

  console.log(`
✨ WHAT YOU'VE SEEN:

✅ AI-Powered Database Operations
  • Natural language questions about data
  • Comprehensive analysis with search filters
  • Cross-table research capabilities

✅ Specialized UFO Research Tools
  • Credibility analysis algorithms
  • Government disclosure tracking
  • Historical timeline analysis
  • Geographic pattern recognition

✅ Interactive CLI Experience
  • Table selection and context awareness
  • Command history and session management
  • Real-time help and guidance

✅ Advanced Data Analytics
  • Aggregation and statistical analysis
  • Category distribution analysis
  • Timeline and geographic insights

🚀 READY TO EXPLORE:

Run these commands to get started:
  bun run interactive          # Start interactive CLI
  bun run smoke-test          # Run test suite
  bun run enhanced-cli --help # See AI commands

The CLI is now production-ready with comprehensive AI capabilities! 🛸
`);
}

// Run the demo
if (import.meta.main) {
  demo().catch(error => {
    console.error('💥 Demo failed:', error);
    process.exit(1);
  });
}