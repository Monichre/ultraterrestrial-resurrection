#!/usr/bin/env bun
/**
 * Enhanced Xata CLI Commands
 * AI-powered database operations and advanced queries
 */

import { askXata, askXataComprehensive, ufoResearch } from './src/xata-typescript-sdk/api/ask';
import { searchXata } from './src/xata-typescript-sdk/api/search';
import { executeXataCommand } from './commands/index';

// Command line argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const params = args.slice(1);

  return { command, params };
}

// AI Ask Commands
async function handleAskCommand(table: string, question: string, options: any = {}) {
  console.log(`🤖 Asking Xata AI: "${question}"`);
  console.log(`📊 Table: ${table}`);

  try {
    const result = await askXata(table, question, options);

    console.log('\n📝 Answer:');
    console.log(result.answer);

    console.log(`\n📊 Metadata:`);
    console.log(`   Records found: ${result.records.length}`);
    console.log(`   Session ID: ${result.sessionId}`);

    if (result.records.length > 0) {
      console.log(`\n🔍 Top Records:`);
      result.records.slice(0, 3).forEach((record: any, index: number) => {
        console.log(`   ${index + 1}. ${record.title || record.name || 'Untitled'}`);
      });
    }

    return result;
  } catch (error) {
    console.error(`❌ Ask failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function handleAskComprehensiveCommand(table: string, question: string) {
  console.log(`🧠 Comprehensive AI Analysis: "${question}"`);
  console.log(`📊 Table: ${table}`);

  try {
    const result = await askXataComprehensive(table, question, {
      searchType: 'keyword',
      keywordSearch: {
        fuzziness: 1,
        target: ['description', 'summary', 'title', 'name']
      }
    });

    console.log('\n📝 Comprehensive Answer:');
    console.log(result.answer);

    console.log(`\n📊 Analysis Results:`);
    console.log(`   Records analyzed: ${result.records.length}`);
    console.log(`   Session ID: ${result.sessionId}`);

    return result;
  } catch (error) {
    console.error(`❌ Comprehensive ask failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Search Commands
async function handleSearchCommand(query: string, table?: string) {
  console.log(`🔍 Searching: "${query}"`);
  if (table) console.log(`📊 Table: ${table}`);

  try {
    const result = await searchXata({
      query,
      table,
      id: null
    });

    if (result.success) {
      console.log(`✅ Found ${result.searchResults?.length || 0} results`);

      if (result.searchResults && result.searchResults.length > 0) {
        console.log('\n📋 Search Results:');
        result.searchResults.slice(0, 10).forEach((record: any, index: number) => {
          const title = record.title || record.name || record.description || 'Untitled';
          const truncated = title.length > 60 ? title.substring(0, 60) + '...' : title;
          console.log(`   ${index + 1}. ${truncated}`);
        });

        if (result.searchResults.length > 10) {
          console.log(`   ... and ${result.searchResults.length - 10} more results`);
        }
      }
    } else {
      console.log(`❌ Search failed: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error(`❌ Search error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// UFO Research Commands
async function handleUFOCredibilityCommand(question: string, table: string = 'events') {
  console.log(`🛸 UFO Credibility Analysis`);
  console.log(`❓ Question: "${question}"`);
  console.log(`📊 Table: ${table}`);

  try {
    const result = await ufoResearch.askCredibilityAnalysis(table, question, {
      minCredibilityScore: 7,
      includeDebunked: false
    });

    console.log('\n📝 Credibility Analysis:');
    console.log(result.answer);

    console.log(`\n📊 Analysis Summary:`);
    console.log(`   Records evaluated: ${result.records.length}`);
    console.log(`   Session ID: ${result.sessionId}`);

    // Show credibility breakdown
    const credibilityCounts: Record<string, number> = {};
    result.records.forEach((record: any) => {
      const score = record.credibility || record.credibility_score || 'unknown';
      credibilityCounts[score] = (credibilityCounts[score] || 0) + 1;
    });

    console.log(`\n🎯 Credibility Distribution:`);
    Object.entries(credibilityCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([score, count]) => {
        console.log(`   Score ${score}: ${count} cases`);
      });

    return result;
  } catch (error) {
    console.error(`❌ UFO credibility analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function handleUFODisclosureCommand(question: string, table: string = 'events') {
  console.log(`🏛️ Government Disclosure Research`);
  console.log(`❓ Question: "${question}"`);
  console.log(`📊 Table: ${table}`);

  try {
    const result = await ufoResearch.askGovernmentDisclosure(table, question, {
      includeClassified: false,
      officialOnly: true
    });

    console.log('\n📝 Disclosure Research:');
    console.log(result.answer);

    console.log(`\n📊 Research Summary:`);
    console.log(`   Records analyzed: ${result.records.length}`);
    console.log(`   Session ID: ${result.sessionId}`);

    return result;
  } catch (error) {
    console.error(`❌ Government disclosure research failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function handleUFOTimelineCommand(question: string, table: string = 'events') {
  console.log(`📅 Historical Timeline Analysis`);
  console.log(`❓ Question: "${question}"`);
  console.log(`📊 Table: ${table}`);

  try {
    const result = await ufoResearch.askHistoricalTimeline(table, question, {
      startYear: 1900,
      includeAncient: false
    });

    console.log('\n📝 Timeline Analysis:');
    console.log(result.answer);

    console.log(`\n📊 Timeline Summary:`);
    console.log(`   Historical records: ${result.records.length}`);
    console.log(`   Session ID: ${result.sessionId}`);

    return result;
  } catch (error) {
    console.error(`❌ Historical timeline analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function handleUFOGeographicCommand(question: string, table: string = 'events') {
  console.log(`🗺️ Geographic Pattern Analysis`);
  console.log(`❓ Question: "${question}"`);
  console.log(`📊 Table: ${table}`);

  try {
    const result = await ufoResearch.askGeographicPatterns(table, question);

    console.log('\n📝 Geographic Analysis:');
    console.log(result.answer);

    console.log(`\n📊 Geographic Summary:`);
    console.log(`   Locations analyzed: ${result.records.length}`);
    console.log(`   Session ID: ${result.sessionId}`);

    return result;
  } catch (error) {
    console.error(`❌ Geographic analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function handleMultiTableCommand(question: string) {
  console.log(`🔍 Multi-Table Research Analysis`);
  console.log(`❓ Question: "${question}"`);

  try {
    const result = await ufoResearch.askMultiTableResearch(question, {
      tables: ['events', 'personnel', 'testimonies', 'organizations'],
      researchType: 'SCIENTIFIC_ANALYSIS'
    });

    console.log('\n📝 Multi-Table Research Results:');
    console.log(result.combinedAnswer);

    console.log(`\n📊 Research Summary:`);
    console.log(`   Tables queried: ${Object.keys(result.tableResults).length}`);
    console.log(`   Total records analyzed: ${Object.values(result.tableResults).reduce((sum, tableResult) => sum + tableResult.records.length, 0)}`);
    console.log(`   Session ID: ${result.sessionId}`);

    // Show per-table breakdown
    console.log(`\n📋 Per-Table Results:`);
    Object.entries(result.tableResults).forEach(([table, tableResult]) => {
      console.log(`   ${table}: ${tableResult.records.length} records`);
    });

    return result;
  } catch (error) {
    console.error(`❌ Multi-table research failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Aggregate Commands
async function handleAggregateCommand(table: string, operation: string) {
  console.log(`📊 Data Aggregation: ${operation}`);
  console.log(`📋 Table: ${table}`);

  try {
    const result = await executeXataCommand({
      operation: 'read',
      table,
      options: { limit: 1000 }
    });

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(`Failed to fetch data: ${result.error}`);
    }

    const records = result.data;
    console.log(`📈 Analyzing ${records.length} records...`);

    switch (operation) {
      case 'count':
        console.log(`\n📊 Total Count: ${records.length}`);
        break;

      case 'categories':
        if (records.length > 0 && records[0].category) {
          const categoryCounts: Record<string, number> = {};
          records.forEach((record: any) => {
            const category = Array.isArray(record.category)
              ? record.category.join(', ')
              : record.category || 'uncategorized';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });

          console.log(`\n📊 Category Distribution:`);
          Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .forEach(([category, count]) => {
              console.log(`   ${category}: ${count} (${((count / records.length) * 100).toFixed(1)}%)`);
            });
        } else {
          console.log(`❌ No category field found in ${table} table`);
        }
        break;

      case 'timeline':
        if (records.length > 0 && records[0].date) {
          const dates = records
            .map((r: any) => r.date)
            .filter(Boolean)
            .sort();

          if (dates.length > 0) {
            console.log(`\n📅 Date Range Analysis:`);
            console.log(`   Total dated records: ${dates.length}`);
            console.log(`   Earliest: ${new Date(dates[0]).toLocaleDateString()}`);
            console.log(`   Latest: ${new Date(dates[dates.length - 1]).toLocaleDateString()}`);

            // Group by year
            const yearCounts: Record<string, number> = {};
            dates.forEach(date => {
              const year = new Date(date).getFullYear().toString();
              yearCounts[year] = (yearCounts[year] || 0) + 1;
            });

            console.log(`\n📊 Records by Year:`);
            Object.entries(yearCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 10)
              .forEach(([year, count]) => {
                console.log(`   ${year}: ${count} records`);
              });
          } else {
            console.log(`❌ No valid dates found in ${table} table`);
          }
        } else {
          console.log(`❌ No date field found in ${table} table`);
        }
        break;

      case 'locations':
        if (records.length > 0 && (records[0].location || records[0].latitude)) {
          const locationCounts: Record<string, number> = {};
          records.forEach((record: any) => {
            const location = record.location || record.city || record.state ||
                           (record.latitude && record.longitude ? `${record.latitude},${record.longitude}` : 'unknown');
            locationCounts[location] = (locationCounts[location] || 0) + 1;
          });

          console.log(`\n📍 Location Distribution:`);
          Object.entries(locationCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15)
            .forEach(([location, count]) => {
              console.log(`   ${location}: ${count} records`);
            });
        } else {
          console.log(`❌ No location fields found in ${table} table`);
        }
        break;

      default:
        console.log(`❌ Unknown aggregation operation: ${operation}`);
        console.log(`Available operations: count, categories, timeline, locations`);
    }

    return result;
  } catch (error) {
    console.error(`❌ Aggregation failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Main command handler
async function main() {
  const { command, params } = parseArgs();

  if (!command) {
    showUsage();
    return;
  }

  try {
    switch (command) {
      case 'ask':
        if (params.length < 2) {
          console.log('❌ Usage: ask <table> <question>');
          return;
        }
        await handleAskCommand(params[0], params.slice(1).join(' '));
        break;

      case 'ask-comprehensive':
        if (params.length < 2) {
          console.log('❌ Usage: ask-comprehensive <table> <question>');
          return;
        }
        await handleAskComprehensiveCommand(params[0], params.slice(1).join(' '));
        break;

      case 'search':
        if (params.length < 1) {
          console.log('❌ Usage: search <query> [table]');
          return;
        }
        await handleSearchCommand(params[0], params[1]);
        break;

      case 'ufo-credibility':
        if (params.length < 1) {
          console.log('❌ Usage: ufo-credibility <question> [table]');
          return;
        }
        await handleUFOCredibilityCommand(params[0], params[1] || 'events');
        break;

      case 'ufo-disclosure':
        if (params.length < 1) {
          console.log('❌ Usage: ufo-disclosure <question> [table]');
          return;
        }
        await handleUFODisclosureCommand(params[0], params[1] || 'events');
        break;

      case 'ufo-timeline':
        if (params.length < 1) {
          console.log('❌ Usage: ufo-timeline <question> [table]');
          return;
        }
        await handleUFOTimelineCommand(params[0], params[1] || 'events');
        break;

      case 'ufo-geographic':
        if (params.length < 1) {
          console.log('❌ Usage: ufo-geographic <question> [table]');
          return;
        }
        await handleUFOGeographicCommand(params[0], params[1] || 'events');
        break;

      case 'multi-table':
        if (params.length < 1) {
          console.log('❌ Usage: multi-table <question>');
          return;
        }
        await handleMultiTableCommand(params.join(' '));
        break;

      case 'aggregate':
        if (params.length < 2) {
          console.log('❌ Usage: aggregate <table> <operation>');
          console.log('Operations: count, categories, timeline, locations');
          return;
        }
        await handleAggregateCommand(params[0], params[1]);
        break;

      default:
        console.log(`❌ Unknown command: ${command}`);
        showUsage();
    }
  } catch (error) {
    console.error(`💥 Command failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function showUsage() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              Enhanced Xata CLI Commands v1.0.0             ║
╚══════════════════════════════════════════════════════════════╝

🤖 AI-POWERED COMMANDS:
  ask <table> <question>           Ask AI questions about table data
  ask-comprehensive <table> <q>    Advanced AI analysis with search filters
  search <query> [table]           Search across tables or specific table

🛸 UFO RESEARCH COMMANDS:
  ufo-credibility <question>       Credibility analysis of sightings
  ufo-disclosure <question>        Government disclosure research
  ufo-timeline <question>          Historical timeline analysis
  ufo-geographic <question>        Geographic pattern analysis
  multi-table <question>           Cross-table comprehensive research

📊 DATA ANALYSIS COMMANDS:
  aggregate <table> <operation>    Data aggregation and statistics
    Operations: count, categories, timeline, locations

📝 EXAMPLES:

  # AI Questions
  ask events "Tell me about credible UFO sightings"
  ask-comprehensive personnel "Find experts with military background"

  # Search
  search "UFO disclosure" events
  search "military witness"

  # UFO Research
  ufo-credibility "Find sightings with radar confirmation"
  ufo-disclosure "What has the government officially acknowledged"
  ufo-timeline "Show historical patterns of sightings"
  ufo-geographic "Analyze sighting hotspots"
  multi-table "Comprehensive analysis of government involvement"

  # Data Analysis
  aggregate events categories
  aggregate events timeline
  aggregate events locations

💡 TIPS:
  • Use quotes around questions with spaces
  • Table parameter is optional for search (searches all tables)
  • UFO commands default to 'events' table
  • Session IDs are maintained for conversation continuity
`);
}

// Run the CLI
if (import.meta.main) {
  main().catch(error => {
    console.error('💥 CLI failed:', error);
    process.exit(1);
  });
}