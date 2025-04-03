#!/usr/bin/env ts-node
/**
 * Vector Column Update Script
 * 
 * This script updates or creates vector embeddings in a Xata database table.
 * It reads data from a source column, generates OpenAI embeddings, and stores them in a target vector column.
 * 
 * Usage:
 *   ts-node update-vectors.ts --table documents --source-column summary --target-column embedding --batch-size 50
 */

import { Command } from 'commander';
import { getXataClient, tables } from '../src/db/xata/xata';
import { generateEmbedding } from '../src/services/ai/openai/functions/embeddings';
import ora from 'ora';
import chalk from 'chalk';
import { z } from 'zod';

// Define command-line options schema
const optionsSchema = z.object({
  table: z.string().min(1, 'Table name is required'),
  sourceColumn: z.string().min(1, 'Source column is required'),
  targetColumn: z.string().min(1, 'Target column is required'),
  batchSize: z.number().min(1).default(25),
});

type ValidatedOptions = z.infer<typeof optionsSchema>;

// Constants
const VECTOR_DIMENSION = 1536; // OpenAI embedding dimension
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Initialize command-line parser
const program = new Command();
program
  .name('update-vectors')
  .description('Update or create vector embeddings in a Xata database')
  .requiredOption('--table <table>', 'Table name to update vectors for')
  .requiredOption('--source-column <column>', 'Source column with text data', 'summary')
  .requiredOption('--target-column <column>', 'Target vector column', 'embedding')
  .option('--batch-size <size>', 'Number of records to process in each batch', '25')
  .parse(process.argv);

/**
 * Main function that runs the vector update process
 */
async function main() {
  // Parse and validate options
  const options = program.opts();
  const validatedOptions = validateOptions({
    table: options.table,
    sourceColumn: options.sourceColumn,
    targetColumn: options.targetColumn,
    batchSize: parseInt(options.batchSize, 10),
  });
  
  console.log(chalk.blue('Vector Update Process Starting'));
  console.log(chalk.gray(`Table: ${validatedOptions.table}`));
  console.log(chalk.gray(`Source Column: ${validatedOptions.sourceColumn}`));
  console.log(chalk.gray(`Target Column: ${validatedOptions.targetColumn}`));
  console.log(chalk.gray(`Batch Size: ${validatedOptions.batchSize}`));
  
  // Initialize Xata client
  const xata = getXataClient();

  // Validate table and columns
  await validateTableAndColumns(xata, validatedOptions);
  
  // Process records in batches
  await processRecords(xata, validatedOptions);
}

/**
 * Validates command-line options
 */
function validateOptions(options: any): ValidatedOptions {
  try {
    return optionsSchema.parse(options);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(chalk.red('Validation error:'));
      error.errors.forEach(err => {
        console.error(chalk.red(`- ${err.path.join('.')}: ${err.message}`));
      });
    } else {
      console.error(chalk.red('An unexpected error occurred while validating options:'), error);
    }
    process.exit(1);
  }
}

/**
 * Validates that the table and columns exist and have the correct types
 */
async function validateTableAndColumns(xata: any, options: ValidatedOptions): Promise<void> {
  const spinner = ora('Validating table and columns...').start();
  
  try {
    // Check if table exists in schema
    const tableExists = tables.some(table => table.name === options.table);
    if (!tableExists) {
      spinner.fail(`Table '${options.table}' does not exist in the schema`);
      process.exit(1);
    }

    // Verify that the source column exists
    const table = tables.find(t => t.name === options.table);
    const sourceColumnExists = table?.columns.some(col => col.name === options.sourceColumn);
    if (!sourceColumnExists) {
      spinner.fail(`Source column '${options.sourceColumn}' does not exist in table '${options.table}'`);
      process.exit(1);
    }

    // Check if target column exists with the correct type
    const targetColumnDef = table?.columns.find(col => col.name === options.targetColumn);
    
    if (targetColumnDef) {
      // Verify it's a vector column with the correct dimension
      if (targetColumnDef.type !== 'vector' || targetColumnDef.vector?.dimension !== VECTOR_DIMENSION) {
        spinner.warn(`Target column '${options.targetColumn}' exists but has incorrect type or dimension. Expected: vector with dimension ${VECTOR_DIMENSION}`);
        // Column exists but has wrong type - might need to be updated through Xata web interface
        if (!await confirmContinue("This script cannot modify column types. Do you want to continue anyway?")) {
          process.exit(1);
        }
      }
    } else {
      spinner.warn(`Target column '${options.targetColumn}' does not exist and will need to be created in the Xata web interface`);
      // Explain that column creation must be done through Xata web interface
      if (!await confirmContinue("This script cannot create columns. Please create a vector column in the Xata web interface first. Do you want to continue anyway?")) {
        process.exit(1);
      }
    }
    
    spinner.succeed('Table and columns validated successfully');
  } catch (error) {
    spinner.fail('Error validating table and columns');
    console.error(chalk.red('Error details:'), error);
    process.exit(1);
  }
}

/**
 * Helper function to prompt for confirmation
 */
async function confirmContinue(message: string): Promise<boolean> {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise<boolean>((resolve) => {
    readline.question(`${message} (y/n) `, (answer: string) => {
      readline.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Process records in batches
 */
async function processRecords(xata: any, options: ValidatedOptions): Promise<void> {
  let page = 1;
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalErrors = 0;
  let hasMore = true;
  
  const spinner = ora('Starting batch processing...').start();
  
  while (hasMore) {
    spinner.text = `Processing batch ${page}...`;
    
    try {
      // Get a batch of records
      const records = await xata.db[options.table]
        .select(['id', options.sourceColumn])
        .getPaginated({
          pagination: {
            size: options.batchSize,
            offset: (page - 1) * options.batchSize
          }
        });
      
      hasMore = records.hasNextPage();
      
      if (records.records.length === 0) {
        break;
      }
      
      // Process each record in the batch
      const results = await Promise.allSettled(
        records.records.map(record => processRecord(xata, record, options))
      );
      
      // Update counters
      totalProcessed += records.records.length;
      totalSuccess += results.filter(r => r.status === 'fulfilled').length;
      totalErrors += results.filter(r => r.status === 'rejected').length;
      
      spinner.text = `Processed ${totalProcessed} records (${totalSuccess} succeeded, ${totalErrors} failed)`;
      page++;
      
    } catch (error) {
      spinner.fail(`Error processing batch ${page}`);
      console.error(chalk.red('Error details:'), error);
      if (!await confirmContinue('Do you want to continue with the next batch?')) {
        break;
      }
      page++;
    }
  }
  
  if (totalErrors > 0) {
    spinner.warn(`Processing completed with ${totalErrors} errors out of ${totalProcessed} records`);
  } else {
    spinner.succeed(`Successfully processed all ${totalProcessed} records`);
  }
}

/**
 * Process an individual record
 */
async function processRecord(
  xata: any, 
  record: any, 
  options: ValidatedOptions
): Promise<void> {
  const { table, sourceColumn, targetColumn } = options;
  
  // Skip records with empty source data
  const sourceData = record[sourceColumn];
  if (!sourceData) {
    console.log(chalk.yellow(`Skipping record ${record.id}: Empty ${sourceColumn}`));
    return;
  }
  
  // Try to generate embeddings with retries
  let retries = 0;
  let embedding: number[] | null = null;
  
  while (retries < MAX_RETRIES && embedding === null) {
    try {
      embedding = await generateEmbedding(sourceData);
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw new Error(`Failed to generate embedding after ${MAX_RETRIES} retries: ${error}`);
      }
      console.log(chalk.yellow(`Retry ${retries}/${MAX_RETRIES} for record ${record.id}`));
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  if (!embedding) {
    throw new Error(`Failed to generate embedding for record ${record.id}`);
  }
  
  // Update the record in Xata
  try {
    await xata.db[table].update({
      id: record.id,
      [targetColumn]: embedding
    });
  } catch (error) {
    throw new Error(`Failed to update record ${record.id} in Xata: ${error}`);
  }
}

// Run the main function
main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});

