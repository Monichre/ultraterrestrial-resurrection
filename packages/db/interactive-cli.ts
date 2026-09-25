#!/usr/bin/env bun
/**
 * Interactive Xata CLI
 * User-friendly interface for database operations and AI-powered queries
 */

import * as readline from 'readline';
import { executeXataCommand, getAvailableTables } from './commands/index';
import { askXata, askXataComprehensive, ufoResearch } from './src/xata-typescript-sdk/api/ask';
import { searchXata } from './src/xata-typescript-sdk/api/search';
import { xata } from './src/xata-typescript-sdk/client';

// CLI State
interface CLIState {
  selectedTable?: string;
  lastSessionId?: string;
  history: string[];
  currentOperation?: string;
}

// Available operations
const OPERATIONS = {
  CRUD: ['create', 'read', 'update', 'delete', 'bulk'],
  AI: ['ask', 'ask-comprehensive', 'search', 'aggregate'],
  UTILITY: ['list-tables', 'table-info', 'clear', 'help', 'exit']
};

// UFO Research specific operations
const UFO_OPERATIONS = {
  'credibility-analysis': 'Analyze sighting credibility',
  'government-disclosure': 'Research government disclosure',
  'historical-timeline': 'Historical timeline analysis',
  'geographic-patterns': 'Geographic pattern analysis',
  'multi-table-research': 'Cross-table research'
};

class InteractiveCLI {
  private rl: readline.Interface;
  private state: CLIState;

  constructor() {
    this.state = {
      history: []
    };

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'xata-cli> '
    });

    this.setupEventHandlers();
    this.showWelcome();
  }

  private setupEventHandlers() {
    this.rl.on('line', (input) => {
      this.processCommand(input.trim());
    });

    this.rl.on('close', () => {
      console.log('\n👋 Goodbye! Thanks for using Xata CLI.');
      process.exit(0);
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n👋 Goodbye! Thanks for using Xata CLI.');
      process.exit(0);
    });
  }

  private showWelcome() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                     🛸 Xata CLI v1.0.0                      ║
║              Interactive Database Operations                ║
╚══════════════════════════════════════════════════════════════╝

Welcome to the Xata CLI! Here's what you can do:

📊 DATABASE OPERATIONS:
  • CRUD: create, read, update, delete, bulk operations
  • AI-Powered: ask questions, search, analyze data
  • UFO Research: specialized credibility and disclosure analysis

🚀 QUICK START:
  1. Select a table: 'use <table-name>'
  2. Try AI search: 'ask "Tell me about UFO sightings"'
  3. View help: 'help'

Available tables: ${getAvailableTables().join(', ')}

Type 'help' for detailed commands or 'exit' to quit.
`);
    this.rl.prompt();
  }

  private async processCommand(input: string) {
    if (!input) {
      this.rl.prompt();
      return;
    }

    this.state.history.push(input);

    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    try {
      switch (command) {
        case 'help':
          this.showHelp();
          break;

        case 'use':
          await this.selectTable(args[0]);
          break;

        case 'list-tables':
          this.listTables();
          break;

        case 'table-info':
          await this.showTableInfo(args[0]);
          break;

        case 'create':
          await this.handleCreate(args);
          break;

        case 'read':
          await this.handleRead(args);
          break;

        case 'update':
          await this.handleUpdate(args);
          break;

        case 'delete':
          await this.handleDelete(args);
          break;

        case 'bulk':
          await this.handleBulk(args);
          break;

        case 'ask':
          await this.handleAsk(args);
          break;

        case 'ask-comprehensive':
          await this.handleAskComprehensive(args);
          break;

        case 'search':
          await this.handleSearch(args);
          break;

        case 'aggregate':
          await this.handleAggregate(args);
          break;

        case 'ufo-credibility':
          await this.handleUFOCredibility(args);
          break;

        case 'ufo-disclosure':
          await this.handleUFODisclosure(args);
          break;

        case 'ufo-timeline':
          await this.handleUFOTimeline(args);
          break;

        case 'ufo-geographic':
          await this.handleUFOGeographic(args);
          break;

        case 'multi-table':
          await this.handleMultiTable(args);
          break;

        case 'clear':
          console.clear();
          this.showWelcome();
          break;

        case 'history':
          this.showHistory();
          break;

        case 'exit':
        case 'quit':
          this.rl.close();
          return;

        default:
          console.log(`❌ Unknown command: ${command}`);
          console.log(`Type 'help' for available commands.`);
      }
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    this.rl.prompt();
  }

  private showHelp() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                           HELP MENU                          ║
╚══════════════════════════════════════════════════════════════╝

📋 BASIC COMMANDS:
  help                    Show this help menu
  use <table>            Select a table for operations
  list-tables            List all available tables
  table-info <table>     Show table schema information
  clear                  Clear screen
  history                Show command history
  exit/quit              Exit the CLI

📊 CRUD OPERATIONS:
  create <json>          Create a new record
  read <id>              Read a record by ID
  update <id> <json>     Update a record
  delete <id>            Delete a record
  bulk <json-array>      Bulk create multiple records

🤖 AI OPERATIONS:
  ask "<question>"       Ask AI questions about data
  ask-comprehensive      Advanced AI search with filters
  search "<query>"       Search across tables
  aggregate <config>     Aggregate data analysis

🛸 UFO RESEARCH:
  ufo-credibility        Credibility analysis
  ufo-disclosure         Government disclosure research
  ufo-timeline           Historical timeline analysis
  ufo-geographic         Geographic pattern analysis
  multi-table            Cross-table research

📝 EXAMPLES:

  # Select a table
  use events

  # Create a record
  create '{"title":"Test Event","description":"Test","date":"2024-01-01T00:00:00Z"}'

  # Ask AI questions
  ask "Tell me about credible UFO sightings"

  # Search with filters
  ask-comprehensive

  # UFO research
  ufo-credibility "Find high-credibility sightings"

💡 TIPS:
  • Use JSON for complex data structures
  • Quotes around strings with spaces
  • Tab completion available for table names
  • Session IDs maintained for conversation continuity
`);
  }

  private async selectTable(tableName?: string) {
    if (!tableName) {
      console.log('❌ Please specify a table name: use <table-name>');
      return;
    }

    const availableTables = getAvailableTables();
    if (!availableTables.includes(tableName)) {
      console.log(`❌ Table '${tableName}' not found. Available: ${availableTables.join(', ')}`);
      return;
    }

    this.state.selectedTable = tableName;
    console.log(`✅ Selected table: ${tableName}`);
    this.rl.setPrompt(`xata-cli:${tableName}> `);
  }

  private listTables() {
    const tables = getAvailableTables();
    console.log('\n📋 Available Tables:');
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table}`);
    });
    console.log(`\nTotal: ${tables.length} tables`);
  }

  private async showTableInfo(tableName?: string) {
    const table = tableName || this.state.selectedTable;
    if (!table) {
      console.log('❌ No table selected. Use "use <table>" or specify table name.');
      return;
    }

    try {
      // Get a sample record to show structure
      const result = await executeXataCommand({
        operation: 'read',
        table,
        options: { limit: 1 }
      });

      if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
        const sample = result.data[0];
        console.log(`\n📊 Table: ${table}`);
        console.log(`Sample Record Structure:`);
        console.log(JSON.stringify(sample, null, 2));
      } else {
        console.log(`📊 Table: ${table} (empty or no sample available)`);
      }
    } catch (error) {
      console.log(`❌ Could not get info for table: ${table}`);
    }
  }

  private async handleCreate(args: string[]) {
    const table = this.state.selectedTable;
    if (!table) {
      console.log('❌ No table selected. Use "use <table>" first.');
      return;
    }

    try {
      const data = JSON.parse(args.join(' '));
      const result = await executeXataCommand({
        operation: 'create',
        table,
        data
      });

      if (result.success) {
        console.log('✅ Record created successfully!');
        console.log(`   ID: ${result.data.id}`);
        console.log(`   Execution time: ${result.metadata?.executionTime}ms`);
      } else {
        console.log(`❌ Create failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleRead(args: string[]) {
    const table = this.state.selectedTable;
    if (!table) {
      console.log('❌ No table selected. Use "use <table>" first.');
      return;
    }

    const id = args[0];
    if (!id) {
      console.log('❌ Please specify a record ID: read <id>');
      return;
    }

    const result = await executeXataCommand({
      operation: 'read',
      table,
      id
    });

    if (result.success) {
      console.log('✅ Record retrieved:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log(`❌ Read failed: ${result.error}`);
    }
  }

  private async handleUpdate(args: string[]) {
    const table = this.state.selectedTable;
    if (!table) {
      console.log('❌ No table selected. Use "use <table>" first.');
      return;
    }

    const id = args[0];
    const dataStr = args.slice(1).join(' ');

    if (!id || !dataStr) {
      console.log('❌ Usage: update <id> <json-data>');
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      const result = await executeXataCommand({
        operation: 'update',
        table,
        id,
        data
      });

      if (result.success) {
        console.log('✅ Record updated successfully!');
        console.log(`   Execution time: ${result.metadata?.executionTime}ms`);
      } else {
        console.log(`❌ Update failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleDelete(args: string[]) {
    const table = this.state.selectedTable;
    if (!table) {
      console.log('❌ No table selected. Use "use <table>" first.');
      return;
    }

    const id = args[0];
    if (!id) {
      console.log('❌ Please specify a record ID: delete <id>');
      return;
    }

    const result = await executeXataCommand({
      operation: 'delete',
      table,
      id
    });

    if (result.success) {
      console.log('✅ Record deleted successfully!');
    } else {
      console.log(`❌ Delete failed: ${result.error}`);
    }
  }

  private async handleBulk(args: string[]) {
    const table = this.state.selectedTable;
    if (!table) {
      console.log('❌ No table selected. Use "use <table>" first.');
      return;
    }

    try {
      const data = JSON.parse(args.join(' '));
      const result = await executeXataCommand({
        operation: 'bulk',
        table,
        data
      });

      if (result.success) {
        console.log('✅ Bulk operation completed!');
        console.log(`   Records affected: ${result.data?.length || 0}`);
      } else {
        console.log(`❌ Bulk operation failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleAsk(args: string[]) {
    const table = this.state.selectedTable || 'events';
    const question = args.join(' ');

    if (!question) {
      console.log('❌ Please provide a question: ask "<question>"');
      return;
    }

    console.log(`🤖 Asking: "${question}"`);
    console.log('Searching table:', table);

    try {
      const result = await askXata(table, question, {
        sessionId: this.state.lastSessionId
      });

      console.log('\n📝 Answer:');
      console.log(result.answer);
      console.log(`\n📊 Records found: ${result.records.length}`);
      console.log(`🔗 Session ID: ${result.sessionId}`);

      this.state.lastSessionId = result.sessionId;
    } catch (error) {
      console.log(`❌ Ask failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleAskComprehensive(args: string[]) {
    const table = this.state.selectedTable || 'events';
    const question = args.join(' ');

    if (!question) {
      console.log('❌ Please provide a question: ask-comprehensive "<question>"');
      return;
    }

    console.log(`🤖 Comprehensive AI Search: "${question}"`);
    console.log('Table:', table);

    try {
      const result = await askXataComprehensive(table, question, {
        searchType: 'keyword',
        keywordSearch: {
          fuzziness: 1,
          target: ['description', 'summary', 'title']
        },
        sessionId: this.state.lastSessionId
      });

      console.log('\n📝 Answer:');
      console.log(result.answer);
      console.log(`\n📊 Records found: ${result.records.length}`);
      console.log(`🔗 Session ID: ${result.sessionId}`);

      this.state.lastSessionId = result.sessionId;
    } catch (error) {
      console.log(`❌ Comprehensive ask failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleSearch(args: string[]) {
    const query = args.join(' ');
    const table = this.state.selectedTable;

    if (!query) {
      console.log('❌ Please provide a search query: search "<query>"');
      return;
    }

    console.log(`🔍 Searching: "${query}"`);
    if (table) console.log(`Table: ${table}`);

    try {
      const result = await searchXata({
        query,
        table,
        id: null
      });

      if (result.success) {
        console.log(`✅ Found ${result.searchResults?.length || 0} results`);
        if (result.searchResults && result.searchResults.length > 0) {
          console.log('\n📋 Results:');
          result.searchResults.slice(0, 5).forEach((record: any, index: number) => {
            console.log(`${index + 1}. ${record.title || record.name || 'Untitled'}`);
          });
        }
      } else {
        console.log(`❌ Search failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Search error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleAggregate(args: string[]) {
    const table = this.state.selectedTable;
    if (!table) {
      console.log('❌ No table selected. Use "use <table>" first.');
      return;
    }

    console.log(`📊 Aggregating data from: ${table}`);

    try {
      // Get basic stats
      const result = await executeXataCommand({
        operation: 'read',
        table,
        options: { limit: 1000 }
      });

      if (result.success && Array.isArray(result.data)) {
        const records = result.data;
        console.log(`\n📈 Basic Statistics:`);
        console.log(`   Total records: ${records.length}`);

        // Simple aggregation examples
        if (records.length > 0) {
          const sample = records[0];

          // Count by categories if available
          if (sample.category) {
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
              .slice(0, 10)
              .forEach(([category, count]) => {
                console.log(`   ${category}: ${count}`);
              });
          }

          // Date range if available
          if (sample.date) {
            const dates = records
              .map((r: any) => r.date)
              .filter(Boolean)
              .sort();

            if (dates.length > 0) {
              console.log(`\n📅 Date Range:`);
              console.log(`   Earliest: ${new Date(dates[0]).toLocaleDateString()}`);
              console.log(`   Latest: ${new Date(dates[dates.length - 1]).toLocaleDateString()}`);
            }
          }
        }
      } else {
        console.log(`❌ Could not aggregate data: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Aggregation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleUFOCredibility(args: string[]) {
    const question = args.join(' ') || 'Find credible UFO sightings with multiple witnesses';
    const table = this.state.selectedTable || 'events';

    console.log(`🛸 UFO Credibility Analysis: "${question}"`);
    console.log(`Table: ${table}`);

    try {
      const result = await ufoResearch.askCredibilityAnalysis(table, question, {
        sessionId: this.state.lastSessionId,
        minCredibilityScore: 7
      });

      console.log('\n📝 Analysis:');
      console.log(result.answer);
      console.log(`\n📊 Records analyzed: ${result.records.length}`);
      console.log(`🔗 Session ID: ${result.sessionId}`);

      this.state.lastSessionId = result.sessionId;
    } catch (error) {
      console.log(`❌ UFO credibility analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleUFODisclosure(args: string[]) {
    const question = args.join(' ') || 'Find government UFO disclosure events';
    const table = this.state.selectedTable || 'events';

    console.log(`🏛️ Government Disclosure Research: "${question}"`);
    console.log(`Table: ${table}`);

    try {
      const result = await ufoResearch.askGovernmentDisclosure(table, question, {
        sessionId: this.state.lastSessionId,
        includeClassified: false
      });

      console.log('\n📝 Research Results:');
      console.log(result.answer);
      console.log(`\n📊 Records found: ${result.records.length}`);
      console.log(`🔗 Session ID: ${result.sessionId}`);

      this.state.lastSessionId = result.sessionId;
    } catch (error) {
      console.log(`❌ Government disclosure research failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleUFOTimeline(args: string[]) {
    const question = args.join(' ') || 'Show historical timeline of UFO sightings';
    const table = this.state.selectedTable || 'events';

    console.log(`📅 Historical Timeline Analysis: "${question}"`);
    console.log(`Table: ${table}`);

    try {
      const result = await ufoResearch.askHistoricalTimeline(table, question, {
        sessionId: this.state.lastSessionId,
        startYear: 1900
      });

      console.log('\n📝 Timeline Analysis:');
      console.log(result.answer);
      console.log(`\n📊 Historical records: ${result.records.length}`);
      console.log(`🔗 Session ID: ${result.sessionId}`);

      this.state.lastSessionId = result.sessionId;
    } catch (error) {
      console.log(`❌ Historical timeline analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleUFOGeographic(args: string[]) {
    const question = args.join(' ') || 'Analyze geographic patterns in UFO sightings';
    const table = this.state.selectedTable || 'events';

    console.log(`🗺️ Geographic Pattern Analysis: "${question}"`);
    console.log(`Table: ${table}`);

    try {
      const result = await ufoResearch.askGeographicPatterns(table, question, {
        sessionId: this.state.lastSessionId,
        region: 'United States'
      });

      console.log('\n📝 Geographic Analysis:');
      console.log(result.answer);
      console.log(`\n📊 Locations analyzed: ${result.records.length}`);
      console.log(`🔗 Session ID: ${result.sessionId}`);

      this.state.lastSessionId = result.sessionId;
    } catch (error) {
      console.log(`❌ Geographic analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleMultiTable(args: string[]) {
    const question = args.join(' ') || 'Comprehensive UFO research across all data';

    console.log(`🔍 Multi-Table Research: "${question}"`);

    try {
      const result = await ufoResearch.askMultiTableResearch(question, {
        sessionId: this.state.lastSessionId,
        researchType: 'SCIENTIFIC_ANALYSIS'
      });

      console.log('\n📝 Combined Research Results:');
      console.log(result.combinedAnswer);
      console.log(`\n📊 Tables queried: ${Object.keys(result.tableResults).length}`);
      console.log(`🔗 Session ID: ${result.sessionId}`);

      this.state.lastSessionId = result.sessionId;
    } catch (error) {
      console.log(`❌ Multi-table research failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private showHistory() {
    console.log('\n📜 Command History:');
    this.state.history.slice(-10).forEach((cmd, index) => {
      console.log(`  ${this.state.history.length - 10 + index + 1}. ${cmd}`);
    });
  }

  public start() {
    this.rl.prompt();
  }
}

// Main execution
async function main() {
  // Check environment
  if (!process.env.XATA_API_KEY) {
    console.error('❌ XATA_API_KEY environment variable is required');
    console.log('💡 Set it with: export XATA_API_KEY="your-api-key"');
    process.exit(1);
  }

  const cli = new InteractiveCLI();
  cli.start();
}

// Handle execution
if (import.meta.main) {
  main().catch(error => {
    console.error('💥 CLI failed to start:', error);
    process.exit(1);
  });
}

export { InteractiveCLI };