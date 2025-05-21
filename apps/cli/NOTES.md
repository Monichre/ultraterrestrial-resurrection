# Ultraterrestrial CLI - Import Module Enhancement

## Overview

This document outlines a plan to enhance the Ultraterrestrial CLI by incorporating the functionality from the `run-import.sh` script into a dedicated TypeScript module. The goal is to maintain the interactive nature of the original script while integrating it with the modular CLI architecture.

## Implementation Plan

### 1. Create a New Command Module

Create a new file at `src/commands/import.ts` with the following structure:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import ora from 'ora';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default function registerImportCommands(program: Command): void {
  // Command definitions go here
}

// Implementation functions go here
```

### 2. Define Command Structure

The module will provide both an interactive menu-based approach and direct commands:

- **Interactive Command**:
  - `import` - Displays a menu of import options similar to run-import.sh

- **Direct Commands**:
  - `import:prepare-events` - Prepare events data
  - `import:test-events` - Test events import
  - `import:events` - Import events data to Xata (with --force and --update options)
  - `import:sightings` - Import UFO Sightings data

### 3. Core Functions to Implement

1. **prepareEventsData()**
   - Process and merge event JSON files
   - Generate combined output file

2. **testEventsImport()**
   - Validate events data against schema
   - Generate validation report

3. **importEventsData()**
   - Handle interactive prompts for confirmation
   - Support force and update options
   - Execute the import process

4. **importSightingsData()**
   - Verify sightings data exists
   - Provide data preview option
   - Execute the sightings import process

5. **runFullWorkflow()**
   - Orchestrate the full prepare -> test -> import process

### 4. Integration with Main CLI

Update `bin/cli.ts` to include the new import commands:

```typescript
try {
  const registerProcessingCommands = require('../src/commands/processing').default;
  const registerReviewCommands = require('../src/commands/review').default;
  const registerInsertionCommands = require('../src/commands/insertion').default;
  const registerImportCommands = require('../src/commands/import').default; // Add this line

  // Register commands with the program
  registerProcessingCommands(program);
  registerReviewCommands(program);
  registerInsertionCommands(program);
  registerImportCommands(program); // Add this line
  
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
```

## Full Implementation Detail

### import.ts Module

```typescript
// src/commands/import.ts
import { Command } from 'commander';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import ora from 'ora';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Register import commands with Commander
 * @param program The Commander program instance
 */
export default function registerImportCommands(program: Command): void {
  // Main import command with interactive workflow
  program
    .command('import')
    .description('Interactive data import workflow')
    .action(async () => {
      const choices = [
        { name: 'Prepare events data (merge and validate)', value: 'prepare-events' },
        { name: 'Test events import (validate against database schema)', value: 'test-events' },
        { name: 'Import events data to Xata', value: 'import-events' },
        { name: 'Full workflow (prepare -> test -> import)', value: 'full-workflow' },
        { name: 'Import UFO Sightings data', value: 'import-sightings' },
        { name: 'Back', value: 'back' }
      ];

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Select an import operation:',
          choices
        }
      ]);

      switch (action) {
        case 'prepare-events':
          await prepareEventsData();
          break;
        case 'test-events':
          await testEventsImport();
          break;
        case 'import-events':
          await importEventsData();
          break;
        case 'full-workflow':
          await runFullWorkflow();
          break;
        case 'import-sightings':
          await importSightingsData();
          break;
        case 'back':
          console.log(chalk.blue('Returning to main menu'));
          break;
      }
    });

  // Direct command for preparing events data
  program
    .command('import:prepare-events')
    .description('Prepare events data by merging and validating')
    .action(async () => {
      await prepareEventsData();
    });

  // Direct command for testing events import
  program
    .command('import:test-events')
    .description('Test events import by validating against database schema')
    .action(async () => {
      await testEventsImport();
    });

  // Direct command for importing events data
  program
    .command('import:events')
    .description('Import events data to Xata')
    .option('-f, --force', 'Force import even if duplicates are detected')
    .option('-u, --update', 'Update existing records if duplicates are found')
    .action(async (options) => {
      await importEventsData(options.force, options.update);
    });

  // Direct command for importing sightings data
  program
    .command('import:sightings')
    .description('Import UFO Sightings data')
    .action(async () => {
      await importSightingsData();
    });
}

/**
 * Prepare events data
 */
async function prepareEventsData(): Promise<boolean> {
  console.log(chalk.blue('=== Preparing Events Data ==='));
  
  const spinner = ora('Processing JSON event files...').start();
  
  try {
    const projectDir = path.resolve(__dirname, '../../..');
    const dataImportDir = path.join(projectDir, 'scripts/data-import');
    
    // Execute the preparation script
    await execAsync(`cd ${projectDir} && bun run ${path.join(dataImportDir, 'events/prepare-events.ts')}`);
    
    spinner.succeed('Events preparation complete');
    console.log(chalk.green(`Combined events file saved to: ${path.join(dataImportDir, 'output/events.json')}`));
    
    return true;
  } catch (error) {
    spinner.fail(`Error: Failed to prepare events data: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Test events import
 */
async function testEventsImport(): Promise<boolean> {
  console.log(chalk.blue('=== Testing Events Import ==='));
  
  const spinner = ora('Running validation and test import...').start();
  
  try {
    const projectDir = path.resolve(__dirname, '../../..');
    const dataImportDir = path.join(projectDir, 'scripts/data-import');
    
    // Run the test import script
    await execAsync(`cd ${projectDir} && bun run ${path.join(dataImportDir, 'events/test-events-import.ts')}`);
    
    // Check if validation report exists
    const validationReportPath = path.join(dataImportDir, 'output/validation-report.json');
    if (fs.existsSync(validationReportPath)) {
      spinner.succeed('Test import validation complete');
      console.log(chalk.green(`Please review the validation report at: ${validationReportPath}`));
    } else {
      spinner.warn('Validation completed, but validation report not found');
    }
    
    return true;
  } catch (error) {
    spinner.fail(`Error: Test import failed: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Import events data to Xata
 */
async function importEventsData(force: boolean = false, update: boolean = false): Promise<boolean> {
  console.log(chalk.blue('=== UFO Intelligence Data Import ==='));
  
  // Check if events.json exists
  const projectDir = path.resolve(__dirname, '../../..');
  const dataImportDir = path.join(projectDir, 'scripts/data-import');
  const eventsJsonPath = path.join(dataImportDir, 'output/events.json');
  
  if (!fs.existsSync(eventsJsonPath)) {
    console.log(chalk.red('Error: events.json not found. Please prepare the data first.'));
    return false;
  }
  
  console.log(chalk.blue('Step 1: Validating events data...'));
  
  // Run validation/test first
  const validationResult = await testEventsImport();
  
  if (!validationResult) {
    console.log(chalk.red('Validation failed. Fix issues before proceeding.'));
    return false;
  }
  
  // If force and update are not set via flags, prompt for them
  if (!force || !update) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmImport',
        message: 'Would you like to proceed with the import?',
        default: true
      }
    ]);
    
    if (!answers.confirmImport) {
      console.log(chalk.yellow('Import cancelled.'));
      return false;
    }
    
    if (!force) {
      const { forceOption } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'forceOption',
          message: 'Force import even if duplicates are detected?',
          default: false
        }
      ]);
      force = forceOption;
    }
    
    if (!update) {
      const { updateOption } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'updateOption',
          message: 'Update existing records if duplicates are found?',
          default: false
        }
      ]);
      update = updateOption;
    }
  }
  
  // Build command arguments
  const args = [];
  if (force) args.push('--force');
  if (update) args.push('--update');
  
  console.log(chalk.blue('Step 3: Importing events data to Xata database...'));
  
  const spinner = ora('Running TypeScript import script...').start();
  
  try {
    // Run TypeScript import script with Bun
    await execAsync(`cd ${projectDir} && bun run ${path.join(dataImportDir, 'events/import-events-to-xata.ts')} ${args.join(' ')}`);
    
    spinner.succeed('Events import process complete');
    
    // Check if skipped events report exists
    const skippedEventsReportPath = path.join(dataImportDir, 'events/skipped-events-report.json');
    if (fs.existsSync(skippedEventsReportPath)) {
      console.log(chalk.yellow(`Skipped events report available at: ${skippedEventsReportPath}`));
    }
    
    return true;
  } catch (error) {
    spinner.fail(`Error: Failed to import events data to Xata: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Import sightings data
 */
async function importSightingsData(): Promise<boolean> {
  console.log(chalk.blue('=== UFO Sightings Data Import ==='));
  
  // Check if sightings data exists
  const projectDir = path.resolve(__dirname, '../../..');
  const sightingsFile = path.join(projectDir, 'output/transformed-sightings.json');
  
  if (!fs.existsSync(sightingsFile)) {
    console.log(chalk.red(`Error: Sightings data file not found at ${sightingsFile}`));
    return false;
  }
  
  console.log(chalk.blue('Step 1: Sightings data found.'));
  console.log(chalk.blue(`  - JSON data: ${sightingsFile}`));
  
  const { reviewData } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'reviewData',
      message: 'Would you like to review the sightings data before importing to Xata?',
      default: false
    }
  ]);
  
  if (reviewData) {
    // Show a sample of the data
    const spinner = ora('Loading data sample...').start();
    try {
      const { stdout } = await execAsync(`head -n 30 "${sightingsFile}"`);
      spinner.stop();
      
      console.log(chalk.blue('\nSample of sightings data (first 3 sightings):'));
      console.log(stdout);
      
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue with import or Ctrl+C to abort...'
        }
      ]);
    } catch (error) {
      spinner.fail(`Error reading data sample: ${(error as Error).message}`);
    }
  }
  
  console.log(chalk.blue('\nStep 2: Importing sightings data to Xata database...'));
  
  const spinner = ora('Running import script...').start();
  
  try {
    // Use npm script to run TypeScript import script
    await execAsync(`cd ${projectDir} && npm run import:sightings`);
    
    spinner.succeed('Sightings import process complete');
    console.log(chalk.green('Check the logs above for details on imported, skipped, and failed entries.'));
    
    return true;
  } catch (error) {
    spinner.fail(`Error: Failed to import sightings data to Xata: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Run full workflow: prepare -> test -> import
 */
async function runFullWorkflow(): Promise<boolean> {
  console.log(chalk.blue('=== Running Full Events Import Workflow ==='));
  
  // Step 1: Prepare events data
  const prepareResult = await prepareEventsData();
  if (!prepareResult) {
    console.log(chalk.red('Preparation step failed. Workflow aborted.'));
    return false;
  }
  
  // Step 2: Test events import
  const testResult = await testEventsImport();
  if (!testResult) {
    console.log(chalk.red('Testing step failed. Workflow aborted.'));
    return false;
  }
  
  // Step 3: Import events data
  return await importEventsData();
}
```

## Benefits of This Approach

1. **Modular Design**: Adds import functionality while maintaining consistency with the existing CLI architecture

2. **Interactive & Direct Access**: Supports both menu-based workflows and direct command execution

3. **Maintained Functionality**: Preserves all the functionality of the original bash script

4. **Type Safety**: Leverages TypeScript for improved code quality and maintainability

5. **Enhanced UX**: Uses ora spinners, chalk colors, and inquirer prompts for a better user experience

## Next Steps

1. Implement the `src/commands/import.ts` file as outlined
2. Update `bin/cli.ts` to register the new import commands
3. Test the integration with existing scripts in the data-import directory
4. Write unit tests for the import commands
5. Consider future enhancements (e.g., adding progress tracking for long-running operations)
