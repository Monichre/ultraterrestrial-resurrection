#!/usr/bin/env node

import { Command } from 'commander';
import * as figlet from 'figlet';
import chalk from 'chalk';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Initialize environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Create program instance
const program = new Command();

// Display welcome banner
console.log(
  chalk.blue(
    figlet.textSync('Ultraterrestrial CLI', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })
  )
);
console.log(chalk.yellow('Data Processing & Xata Import Tool\n'));

// Setup program metadata
program
  .name('ut-cli')
  .description('CLI tool for processing and importing data into Xata database')
  .version('1.0.0')
  .helpOption('-h, --help', 'Display help information');

// Import command modules (we'll create these files next)
// We're importing the default exports (which are functions that register commands)
// Using require() here since the modules are not created yet
try {
  // Note: We'll need to create these modules next
  const registerProcessingCommands = require('../src/commands/processing').default;
  const registerReviewCommands = require('../src/commands/review').default;
  const registerInsertionCommands = require('../src/commands/insertion').default;

  // Register commands with the program
  registerProcessingCommands(program);
  registerReviewCommands(program);
  registerInsertionCommands(program);
  
  // Display help if no arguments provided
  if (process.argv.length === 2) {
    program.help();
  }

  // Parse command line arguments
  program.parse(process.argv);
} catch (error) {
  console.error(chalk.red('Error initializing CLI commands:'), error);
  process.exit(1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

