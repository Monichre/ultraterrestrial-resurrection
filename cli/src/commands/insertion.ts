import { Command } from 'commander';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as fileManager from '../lib/fileManager';
import { readMetadata } from '../lib/metadata';
import { DataTypeConfig } from '../config';
import ora from 'ora';
import { Table } from 'table';
import { xataClient } from '../lib/xataClient';

/**
 * Register insertion commands with Commander
 * @param program The Commander program instance
 */
export default function registerInsertionCommands(program: Command): void {
  // Insert:list command - List files in the insertion bucket
  program
    .command('insert:list')
    .description('List files in the insertion bucket')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-p, --pattern <pattern>', 'File pattern to match (e.g., "*.md", "*.json")')
    .action(async (options) => {
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // Default pattern is all files
        const pattern = options.pattern || '*';
        
        // Show spinner
        const spinner = ora(`Listing files in insertion bucket for ${dataType}...`).start();
        
        // Get files
        const files = await fileManager.listFiles(dataType, 'insertion', pattern);
        spinner.succeed(`Found ${files.length} files in insertion bucket for ${dataType}`);
        
        if (files.length === 0) {
          console.log(chalk.yellow(`No files found in insertion bucket for ${dataType} matching pattern "${pattern}"`));
          return;
        }
        
        // Display files in a table with metadata
        const tableData = [
          ['Name', 'Size', 'Records', 'Target Table', 'Status', 'Ready'],
        ];
        
        // Add file data with metadata
        for (const file of files) {
          try {
            const metadata = await readMetadata(dataType, 'insertion', file.name);
            tableData.push([
              chalk.cyan(file.name),
              formatFileSize(file.size),
              metadata.recordCount.toString(),
              metadata.targetTable,
              metadata.status,
              metadata.status === 'approved' ? chalk.green('✓') : chalk.red('✗')
            ]);
          } catch (error) {
            // If metadata can't be read, just show basic file info
            tableData.push([
              chalk.cyan(file.name),
              formatFileSize(file.size),
              'N/A',
              dataType.toString(),
              'unknown',
              chalk.red('✗')
            ]);
          }
        }
        
        console.log(Table(tableData, {
          border: {
            topBody: '─', topJoin: '┬', topLeft: '┌', topRight: '┐',
            bottomBody: '─', bottomJoin: '┴', bottomLeft: '└', bottomRight: '┘',
            bodyLeft: '│', bodyRight: '│', bodyJoin: '│',
            joinBody: '─', joinLeft: '├', joinRight: '┤', joinJoin: '┼'
          }
        }));
      } catch (error) {
        console.error(chalk.red('Error listing files:'), error);
      }
    });
  
  // Insert:batch command - Batch insert approved files into Xata
  program
    .command('insert:batch')
    .description('Batch insert approved files into Xata')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-f, --file <file>', 'Specific file to insert')
    .option('-i, --interactive', 'Run in interactive mode with file selection')
    .option('-b, --batch-size <size>', 'Batch size for insertion (default: 10)', '10')
    .option('--force', 'Force insert even if duplicates are detected')
    .option('--update', 'Update existing records if duplicates are found')
    .action(async (options) => {
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // Get files to insert
        let filesToInsert: string[] = [];
        
        if (options.file) {
          // Insert specific file
          filesToInsert = [options.file];
        } else if (options.interactive) {
          // Interactive mode - let user select files
          filesToInsert = await promptForFiles(dataType, 'insertion');
          if (filesToInsert.length === 0) {
            console.log(chalk.yellow('No files selected for insertion'));
            return;
          }
        } else {
          // Get all approved files
          const files = await fileManager.listFiles(dataType, 'insertion');
          
          for (const file of files) {
            try {
              const metadata = await readMetadata(dataType, 'insertion', file.name);
              if (metadata.status === 'approved') {
                filesToInsert.push(file.name);
              }
            } catch (error) {
              // Skip files with missing or invalid metadata
              console.warn(chalk.yellow(`Skipping ${file.name} due to missing or invalid metadata`));
            }
          }
        }
        
        if (filesToInsert.length === 0) {
          console.log(chalk.yellow('No approved files found for insertion'));
          return;
        }
        
        // Batch size
        const batchSize = parseInt(options.batchSize, 10) || 10;
        
        console.log(chalk.blue(`Batch inserting ${filesToInsert.length} file(s) for ${dataType} with batch size ${batchSize}...`));
        
        // Confirm insertion
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to insert ${filesToInsert.length} file(s) into Xata?`,
            default: false
          }
        ]);
        
        if (!confirm) {
          console.log(chalk.yellow('Insertion cancelled'));
          return;
        }
        
        // Process each file
        for (const fileName of filesToInsert) {
          await batchInsertFile(dataType, fileName, {
            batchSize,
            force: options.force,
            update: options.update
          });
        }
      } catch (error) {
        console.error(chalk.red('Error batch inserting files:'), error);
      }
    });
  
  // Insert:bulk command - Bulk insert approved files into Xata
  program
    .command('insert:bulk')
    .description('Bulk insert approved files into Xata')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-f, --file <file>', 'Specific file to insert')
    .option('-i, --interactive', 'Run in interactive mode with file selection')
    .option('--force', 'Force insert even if duplicates are detected')
    .option('--update', 'Update existing records if duplicates are found')
    .action(async (options) => {
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // Get files to insert
        let filesToInsert: string[] = [];
        
        if (options.file) {
          // Insert specific file
          filesToInsert = [options.file];
        } else if (options.interactive) {
          // Interactive mode - let user select files
          filesToInsert = await promptForFiles(dataType, 'insertion');
          if (filesToInsert.length === 0) {
            console.log(chalk.yellow('No files selected for insertion'));
            return;
          }
        } else {
          // Get all approved files
          const files = await fileManager.listFiles(dataType, 'insertion');
          
          for (const file of files) {
            try {
              const metadata = await readMetadata(dataType, 'insertion', file.name);
              if (metadata.status === 'approved') {
                filesToInsert.push(file.name);
              }
            } catch (error) {
              // Skip files with missing or invalid metadata
              console.warn(chalk.yellow(`Skipping ${file.name} due to missing or invalid metadata`));
            }
          }
        }
        
        if (filesToInsert.length === 0) {
          console.log(chalk.yellow('No approved files found for insertion'));
          return;
        }
        
        console.log(chalk.blue(`Bulk inserting ${filesToInsert.length} file(s) for ${dataType}...`));
        
        // Confirm insertion
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to insert ${filesToInsert.length} file(s) into Xata?`,
            default: false
          }
        ]);
        
        if (!confirm) {
          console.log(chalk.yellow('Insertion cancelled'));
          return;
        }
        
        // Process each file
        for (const fileName of filesToInsert) {
          await bulkInsertFile(dataType, fileName, {
            force: options.force,
            update: options.update
          });
        }
      } catch (error) {
        console.error(chalk.red('Error bulk inserting files:'), error);
      }
    });
}

/**
 * Prompt user to select a data type
 * @returns Selected data type
 */
async function promptForDataType(): Promise<keyof DataTypeConfig | null> {
  const { dataType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'dataType',
      message: 'Select data type:',
      choices: [
        { name: 'Testimonies', value: 'testimonies' },
        { name: 'Events', value: 'events' },
        { name: 'Personnel', value: 'personnel' },
        { name: 'Organizations', value: 'organizations' },
        { name: 'Artifacts', value: 'artifacts' }
      ]
    }
  ]);
  
  return dataType;
}

/**
 * Prompt user to select files from a bucket
 * @param dataType Data type
 * @param bucketStage Bucket stage
 * @returns Selected file names
 */
async function promptForFiles(dataType: keyof DataTypeConfig, bucketStage: 'processing' | 'review' | 'insertion'): Promise<string[]> {
  // Get files in the bucket
  const files = await fileManager.listFiles(dataType, bucketStage);
  
  if (files.length === 0) {
    console.log(chalk.yellow(`No files found in ${bucketStage} bucket for ${dataType}`));
    return [];
  }
  
  // Create choices for inquirer
  const choices = files.map(file => ({
    name: `${file.name} (${formatFileSize(file.size)}, ${new Date(file.modifiedAt).toLocaleString()})`,
    value: file.name
  }));
  
  // Add Select All option
  choices.unshift({
    name: 'Select All',
    value: 'ALL'
  });
  
  // Prompt user to select files
  const { selectedFiles } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedFiles',
      message: `Select files from ${bucketStage} bucket for ${dataType}:`,
      choices
    }
  ]);
  
  // Handle Select All option
  if (selectedFiles.includes('ALL')) {
    return files.map(file => file.name);
  }
  
  return selectedFiles;
}

/**
 * Batch insert a file into Xata
 * @param dataType Data type
 * @param fileName File name
 * @param options Insertion options
 * @returns Promise that resolves when insertion is complete
 */
async function batchInsertFile(
  dataType: keyof DataTypeConfig, 
  fileName: string, 
  options: { 
    batchSize: number,
    force?: boolean,
    update?: boolean
  }
): Promise<void> {
  const spinner = ora(`Batch inserting ${fileName}...`).start();
  
  try {
    // Read file content
    const content = await fileManager.readFile(dataType, 'insertion', fileName);
    
    // Read metadata
    const metadata = await readMetadata(dataType, 'insertion', fileName);
    
    // Parse content based on file type
    let records: any[] = [];
    
    if (fileName.endsWith('.json')) {
      // Parse JSON file
      records = JSON.parse(content);
      if (!Array.isArray(records)) {
        // If the JSON is an object, not an array, convert it to an array
        records = [records];
      }
    } else if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
      // For markdown or text files, we might need more complex parsing
      // For now, just create a single record with the content
      records = [{
        title: fileName.replace(/\.[^/.]+$/, ""),
        content: content,
        summary: metadata.summary || content.substring(0, 200)
      }];
    } else {
      // Unsupported file type
      spinner.fail(`Unsupported file type for ${fileName}`);
      return;
    }
    
    // Update status
    spinner.text = `Batch inserting ${fileName} (${records.length} records)...`;
    
    // Target table from metadata
    const targetTable = metadata.targetTable || dataType;
    
    // Insert records in batches
    const batchSize = options.batchSize || 10;
    let inserted = 0;
    let failed = 0;
    
    // Process in batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      spinner.text = `Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${i} of ${records.length})...`;
      
      try {
        // Insert batch
        const result = await xataClient.insertRecords(targetTable, batch, {
          skipDuplicates: !options.force,
          updateExisting: options.update,
          onProgress: (inserted, total) => {
            spinner.text = `Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${i + inserted} of ${records.length})...`;
          }
        });
        
        // Update counters
        inserted += result.inserted;
        failed += result.failed;
        
        // Log errors
        if (result.errors.length > 0) {
          console.warn(chalk.yellow(`Batch ${Math.floor(i / batchSize) + 1} had ${result.errors.length} errors`));
        }
      } catch (error) {
        console.error(chalk.red(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`), error);
        failed += batch.length;
      }
    }
    
    // Done
    if (failed === 0) {
      spinner.succeed(`Successfully inserted ${inserted} records from ${fileName}`);
    } else {
      spinner.warn(`Inserted ${inserted} records from ${fileName}, with ${failed} failures`);
    }
    
    // If all records were successfully inserted, update metadata
    if (inserted === records.length) {
      try {
        // Move file to a completed/archived directory if necessary
        // For now, just updating metadata status
        const updatedMetadata = { ...metadata, status: 'inserted' };
        await fileManager.writeJsonFile(dataType, 'insertion', `${fileName}.meta.json`, updatedMetadata);
      } catch (error) {
        console.warn(chalk.yellow(`Failed to update metadata for ${fileName}`), error);
      }
    }
  } catch (error) {
    spinner.fail(`Failed to batch insert ${fileName}: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Bulk insert a file into Xata
 * @param dataType Data type
 * @param fileName File name
 * @param options Insertion options
 * @returns Promise that resolves when insertion is complete
 */
async function bulkInsertFile(
  dataType: keyof DataTypeConfig, 
  fileName: string, 
  options: { 
    force?: boolean,
    update?: boolean
  }
): Promise<void> {
  const spinner = ora(`Bulk inserting ${fileName}...`).start();
  
  try {
    // Read file content
    const content = await fileManager.readFile(dataType, 'insertion', fileName);
    
    // Read metadata
    const metadata = await readMetadata(dataType, 'insertion', fileName);
    
    // Parse content based on file type
    let records: any[] = [];
    
    if (fileName.endsWith('.json')) {
      // Parse JSON file
      records = JSON.parse(content);
      if (!Array.isArray(records)) {
        // If the JSON is an object, not an array, convert it to an array
        records = [records];
      }
    } else if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
      // For markdown or text files, we might need more complex parsing
      // For now, just create a single record with the content
      records = [{
        title: fileName.replace(/\.[^/.]+$/, ""),
        content: content,
        summary: metadata.summary || content.substring(0, 200)
      }];
    } else {
      // Unsupported file type
      spinner.fail(`Unsupported file type for ${fileName}`);
      return;
    }
    
    // Update status
    spinner.text = `Bulk inserting ${fileName} (${records.length} records)...`;
    
    // Target table from metadata
    const targetTable = metadata.targetTable || dataType;
    
    // Insert all records at once
    try {
      const result = await xataClient.insertRecords(targetTable, records, {
        skipDuplicates: !options.force,
        updateExisting: options.update,
        onProgress: (inserted, total) => {
          spinner.text = `Inserting records (${inserted} of ${total})...`;
        }
      });
      
      // Done
      if (result.failed === 0) {
        spinner.succeed(`Successfully inserted ${result.inserted} records from ${fileName}`);
      } else {
        spinner.warn(`Inserted ${result.inserted} records from ${fileName}, with ${result.failed} failures`);
      }
      
      // If all records were successfully inserted, update metadata
      if (result.inserted === records.length) {
        try {
          // Move file to a completed/archived directory if necessary
          // For now, just updating metadata status
          const updatedMetadata = { ...metadata, status: 'inserted' };
          await fileManager.writeJsonFile(dataType, 'insertion', `${fileName}.meta.json`, updatedMetadata);
        } catch (error) {
          console.warn(chalk.yellow(`Failed to update metadata for ${fileName}`), error);
        }
      }
    } catch (error) {
      spinner.fail(`Error bulk inserting records: ${(error as Error).message}`);
      throw error;
    }
  } catch (error) {
    spinner.fail(`Failed to bulk insert ${fileName}: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Format file size for display
 * @param bytes Size in bytes
 * @returns Formatted size string
 */
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
