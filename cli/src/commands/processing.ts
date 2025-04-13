import { Command } from 'commander';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import { DataTypeConfig } from '../config';
import * as fileManager from '../lib/fileManager';
import ora from 'ora';
import { createMetadata, writeMetadata } from '../lib/metadata';
import { Table } from 'table';

/**
 * Register processing commands with Commander
 * @param program The Commander program instance
 */
export default function registerProcessingCommands(program: Command): void {
  // Process:list command - List files in the processing bucket
  program
    .command('process:list')
    .description('List files in the processing bucket')
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
        const spinner = ora(`Listing files in processing bucket for ${dataType}...`).start();
        
        // Get files
        const files = await fileManager.listFiles(dataType, 'processing', pattern);
        spinner.succeed(`Found ${files.length} files in processing bucket for ${dataType}`);
        
        if (files.length === 0) {
          console.log(chalk.yellow(`No files found in processing bucket for ${dataType} matching pattern "${pattern}"`));
          return;
        }
        
        // Display files in a table
        const tableData = [
          ['Name', 'Size', 'Modified', 'Type'],
          ...files.map(file => [
            chalk.cyan(file.name),
            formatFileSize(file.size),
            new Date(file.modifiedAt).toLocaleString(),
            file.isDirectory ? 'Directory' : getFileType(file.extension)
          ])
        ];
        
        console.log(Table(tableData, {
          border: {
            topBody: '─',
            topJoin: '┬',
            topLeft: '┌',
            topRight: '┐',
            bottomBody: '─',
            bottomJoin: '┴',
            bottomLeft: '└',
            bottomRight: '┘',
            bodyLeft: '│',
            bodyRight: '│',
            bodyJoin: '│',
            joinBody: '─',
            joinLeft: '├',
            joinRight: '┤',
            joinJoin: '┼'
          }
        }));
      } catch (error) {
        console.error(chalk.red('Error listing files:'), error);
      }
    });
  
  // Process:transform command - Transform files in the processing bucket
  program
    .command('process:transform')
    .description('Transform files in the processing bucket')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-f, --file <file>', 'Specific file to transform')
    .option('-i, --interactive', 'Run in interactive mode with file selection')
    .action(async (options) => {
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // Get files to process
        let filesToProcess: string[] = [];
        
        if (options.file) {
          // Process specific file
          filesToProcess = [options.file];
        } else if (options.interactive) {
          // Interactive mode - let user select files
          filesToProcess = await promptForFiles(dataType, 'processing');
          if (filesToProcess.length === 0) {
            console.log(chalk.yellow('No files selected for processing'));
            return;
          }
        } else {
          // Get all files
          const files = await fileManager.listFiles(dataType, 'processing');
          filesToProcess = files.map(file => file.name);
        }
        
        console.log(chalk.blue(`Transforming ${filesToProcess.length} files for ${dataType}...`));
        
        // Process each file
        for (const fileName of filesToProcess) {
          const spinner = ora(`Transforming ${fileName}...`).start();
          
          try {
            // Read file content
            const content = await fileManager.readFile(dataType, 'processing', fileName);
            
            // Apply transformation based on file type and data type
            const transformedContent = await transformContent(content, dataType, fileName);
            
            // Write transformed content to review bucket
            await fileManager.writeFile(dataType, 'review', fileName, transformedContent);
            
            // Create metadata
            const metadata = createMetadata(dataType, fileName, {
              originalFileName: fileName,
              recordCount: countRecords(transformedContent, dataType),
              targetTable: dataType.toString(),
              qualityScore: 70, // Default quality score, can be improved with AI
              contentSummary: `Transformed ${fileName} for ${dataType}`
            });
            
            // Write metadata
            await writeMetadata(dataType, 'review', fileName, metadata);
            
            spinner.succeed(`Transformed ${fileName} and moved to review bucket`);
          } catch (error) {
            spinner.fail(`Failed to transform ${fileName}: ${(error as Error).message}`);
          }
        }
      } catch (error) {
        console.error(chalk.red('Error transforming files:'), error);
      }
    });
  
  // Process:enhance command - Enhance files with AI assistance
  program
    .command('process:enhance')
    .description('Enhance files with AI assistance')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-f, --file <file>', 'Specific file to enhance')
    .option('-i, --interactive', 'Run in interactive mode with file selection')
    .action(async (options) => {
      console.log(chalk.yellow('AI enhancement is temporarily disabled due to API setup issues.'));
      console.log(chalk.yellow('Please use process:transform instead.'));
      
      // This would normally use the aiAssistant module, but we're skipping for now
      /*
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // Get files to process
        let filesToProcess: string[] = [];
        
        if (options.file) {
          // Process specific file
          filesToProcess = [options.file];
        } else if (options.interactive) {
          // Interactive mode - let user select files
          filesToProcess = await promptForFiles(dataType, 'processing');
          if (filesToProcess.length === 0) {
            console.log(chalk.yellow('No files selected for enhancement'));
            return;
          }
        } else {
          // Get all files
          const files = await fileManager.listFiles(dataType, 'processing');
          filesToProcess = files.map(file => file.name);
        }
        
        console.log(chalk.blue(`Enhancing ${filesToProcess.length} files for ${dataType} with AI assistance...`));
        
        // Process each file with AI enhancement
        for (const fileName of filesToProcess) {
          const spinner = ora(`Enhancing ${fileName}...`).start();
          
          try {
            // Read file content
            const content = await fileManager.readFile(dataType, 'processing', fileName);
            
            // Apply AI enhancement
            const enhancedContent = await aiAssistant.analyzeContent(content, dataType);
            
            // Write enhanced content to review bucket
            await fileManager.writeFile(dataType, 'review', fileName, enhancedContent);
            
            spinner.succeed(`Enhanced ${fileName} and moved to review bucket`);
          } catch (error) {
            spinner.fail(`Failed to enhance ${fileName}: ${(error as Error).message}`);
          }
        }
      } catch (error) {
        console.error(chalk.red('Error enhancing files:'), error);
      }
      */
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
 * Transform content based on data type and file name
 * @param content File content
 * @param dataType Data type
 * @param fileName File name
 * @returns Transformed content
 */
async function transformContent(content: string, dataType: keyof DataTypeConfig, fileName: string): Promise<string> {
  // Simple transformation for now - in a real implementation, this would do more
  switch (dataType) {
    case 'testimonies':
      // Add metadata header if not present
      if (!content.includes('---')) {
        return `---\ntitle: ${fileName.replace(/\.[^/.]+$/, "")}\ndate: ${new Date().toISOString()}\nstatus: processed\n---\n\n${content}`;
      }
      break;
    case 'events':
      // For JSON, we try to format it nicely
      if (fileName.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          return JSON.stringify(parsed, null, 2);
        } catch (error) {
          // Not valid JSON, return as is
        }
      }
      break;
    // Add more transformations for other data types
  }
  
  // Default - return content as is
  return content;
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

/**
 * Get human-readable file type from extension
 * @param extension File extension
 * @returns File type string
 */
function getFileType(extension: string): string {
  const types: Record<string, string> = {
    '.md': 'Markdown',
    '.json': 'JSON',
    '.txt': 'Text',
    '.csv': 'CSV',
    '.ts': 'TypeScript',
    '.js': 'JavaScript'
  };
  
  return types[extension.toLowerCase()] || extension.slice(1).toUpperCase() || 'Unknown';
}

/**
 * Count records in content based on data type
 * @param content File content
 * @param dataType Data type
 * @returns Record count
 */
function countRecords(content: string, dataType: keyof DataTypeConfig): number {
  // Simple record counting for now
  switch (dataType) {
    case 'testimonies':
      // Count paragraphs as a rough approximation
      return content.split(/\n\s*\n/).length;
    case 'events':
      // For JSON, try to count array items
      if (content.trim().startsWith('[')) {
        try {
          return JSON.parse(content).length;
        } catch (error) {
          return 1;
        }
      }
      return 1;
    default:
      return 1;
  }
}

