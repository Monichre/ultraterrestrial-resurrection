import { Command } from 'commander';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as fileManager from '../lib/fileManager';
import { DataTypeConfig } from '../config';
import ora from 'ora';
import { Table } from 'table';
import { readMetadata, updateMetadata, moveMetadata, FileMetadata } from '../lib/metadata';

/**
 * Register review commands with Commander
 * @param program The Commander program instance
 */
export default function registerReviewCommands(program: Command): void {
  // Review:list command - List files in the review bucket
  program
    .command('review:list')
    .description('List files in the review bucket')
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
        const spinner = ora(`Listing files in review bucket for ${dataType}...`).start();
        
        // Get files
        const files = await fileManager.listFiles(dataType, 'review', pattern);
        spinner.succeed(`Found ${files.length} files in review bucket for ${dataType}`);
        
        if (files.length === 0) {
          console.log(chalk.yellow(`No files found in review bucket for ${dataType} matching pattern "${pattern}"`));
          return;
        }
        
        // Display files in a table with metadata
        const tableData = [
          ['Name', 'Size', 'Quality', 'Records', 'Status', 'Modified'],
        ];
        
        // Add file data with metadata
        for (const file of files) {
          try {
            const metadata = await readMetadata(dataType, 'review', file.name);
            tableData.push([
              chalk.cyan(file.name),
              formatFileSize(file.size),
              formatQualityScore(metadata.qualityScore),
              metadata.recordCount.toString(),
              metadata.status,
              new Date(file.modifiedAt).toLocaleString()
            ]);
          } catch (error) {
            // If metadata can't be read, just show basic file info
            tableData.push([
              chalk.cyan(file.name),
              formatFileSize(file.size),
              'N/A',
              'N/A',
              'unknown',
              new Date(file.modifiedAt).toLocaleString()
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
  
  // Review:preview command - Preview file content from the review bucket
  program
    .command('review:preview')
    .description('Preview file content from the review bucket')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-f, --file <file>', 'Specific file to preview')
    .option('-l, --lines <number>', 'Number of lines to preview (default: 20)', '20')
    .action(async (options) => {
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // If no file is provided, prompt the user
        const fileName = options.file || await promptForSingleFile(dataType, 'review');
        if (!fileName) return;
        
        // Parse lines option
        const lines = parseInt(options.lines, 10) || 20;
        
        // Show spinner
        const spinner = ora(`Loading preview for ${fileName}...`).start();
        
        try {
          // Read file content
          const content = await fileManager.readFile(dataType, 'review', fileName);
          
          // Read metadata
          const metadata = await readMetadata(dataType, 'review', fileName);
          
          spinner.succeed(`Preview for ${fileName}`);
          
          // Display metadata
          console.log(chalk.blue.bold('\nFile Metadata:'));
          console.log(chalk.blue('  Quality Score:    ') + formatQualityScore(metadata.qualityScore));
          console.log(chalk.blue('  Records:          ') + metadata.recordCount);
          console.log(chalk.blue('  Status:           ') + metadata.status);
          console.log(chalk.blue('  Target Table:     ') + metadata.targetTable);
          console.log(chalk.blue('  Processing Date:  ') + new Date(metadata.processingTimestamp).toLocaleString());
          
          if (metadata.qualityIssues && metadata.qualityIssues.length > 0) {
            console.log(chalk.blue.bold('\nQuality Issues:'));
            metadata.qualityIssues.forEach((issue, index) => {
              console.log(chalk.blue(`  ${index + 1}. `) + issue);
            });
          }
          
          // Display content preview
          console.log(chalk.blue.bold('\nContent Preview:'));
          
          const contentLines = content.split('\n');
          const totalLines = contentLines.length;
          const previewLines = Math.min(lines, totalLines);
          
          for (let i = 0; i < previewLines; i++) {
            console.log(chalk.gray(`${i + 1}: `) + contentLines[i]);
          }
          
          if (totalLines > previewLines) {
            console.log(chalk.gray(`... ${totalLines - previewLines} more lines ...`));
          }
          
          // Prompt for action
          const { action } = await inquirer.prompt([
            {
              type: 'list',
              name: 'action',
              message: 'What would you like to do?',
              choices: [
                { name: 'Approve file', value: 'approve' },
                { name: 'Reject file', value: 'reject' },
                { name: 'View more lines', value: 'more' },
                { name: 'Return to menu', value: 'return' }
              ]
            }
          ]);
          
          if (action === 'approve') {
            await approveFile(dataType, fileName);
          } else if (action === 'reject') {
            await rejectFile(dataType, fileName);
          } else if (action === 'more') {
            // View more lines (double the current preview)
            const newOptions = { ...options, lines: (lines * 2).toString() };
            await program.parseAsync(['node', 'script', 'review:preview', 
              '-t', dataType.toString(), 
              '-f', fileName, 
              '-l', newOptions.lines
            ]);
          }
        } catch (error) {
          spinner.fail(`Failed to preview ${fileName}: ${(error as Error).message}`);
        }
      } catch (error) {
        console.error(chalk.red('Error previewing file:'), error);
      }
    });
  
  // Review:approve command - Approve a file and move it to the insertion bucket
  program
    .command('review:approve')
    .description('Approve a file and move it to the insertion bucket')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-f, --file <file>', 'Specific file to approve')
    .option('-i, --interactive', 'Run in interactive mode with file selection')
    .option('-a, --all', 'Approve all files in the review bucket for the specified type')
    .action(async (options) => {
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // Get files to approve
        let filesToApprove: string[] = [];
        
        if (options.file) {
          // Approve specific file
          filesToApprove = [options.file];
        } else if (options.interactive) {
          // Interactive mode - let user select files
          filesToApprove = await promptForFiles(dataType, 'review');
          if (filesToApprove.length === 0) {
            console.log(chalk.yellow('No files selected for approval'));
            return;
          }
        } else if (options.all) {
          // Approve all files
          const files = await fileManager.listFiles(dataType, 'review');
          filesToApprove = files.map(file => file.name);
        } else {
          // If no option is provided, prompt for a single file
          const fileName = await promptForSingleFile(dataType, 'review');
          if (!fileName) return;
          filesToApprove = [fileName];
        }
        
        console.log(chalk.blue(`Approving ${filesToApprove.length} file(s) for ${dataType}...`));
        
        // Process each file
        for (const fileName of filesToApprove) {
          await approveFile(dataType, fileName);
        }
      } catch (error) {
        console.error(chalk.red('Error approving files:'), error);
      }
    });
  
  // Review:reject command - Reject a file and move it back to processing
  program
    .command('review:reject')
    .description('Reject a file and move it back to processing')
    .option('-t, --type <type>', 'Type of data (testimonies, events, personnel, etc.)')
    .option('-f, --file <file>', 'Specific file to reject')
    .option('-i, --interactive', 'Run in interactive mode with file selection')
    .option('-r, --reason <reason>', 'Reason for rejection')
    .action(async (options) => {
      try {
        // If no type is provided, prompt the user
        const dataType = options.type || await promptForDataType();
        if (!dataType) return;
        
        // Get files to reject
        let filesToReject: string[] = [];
        
        if (options.file) {
          // Reject specific file
          filesToReject = [options.file];
        } else if (options.interactive) {
          // Interactive mode - let user select files
          filesToReject = await promptForFiles(dataType, 'review');
          if (filesToReject.length === 0) {
            console.log(chalk.yellow('No files selected for rejection'));
            return;
          }
        } else {
          // If no option is provided, prompt for a single file
          const fileName = await promptForSingleFile(dataType, 'review');
          if (!fileName) return;
          filesToReject = [fileName];
        }
        
        // Get rejection reason if not provided
        let reason = options.reason;
        if (!reason) {
          const response = await inquirer.prompt([
            {
              type: 'input',
              name: 'reason',
              message: 'Enter reason for rejection:',
              default: 'Needs further processing'
            }
          ]);
          reason = response.reason;
        }
        
        console.log(chalk.blue(`Rejecting ${filesToReject.length} file(s) for ${dataType}...`));
        
        // Process each file
        for (const fileName of filesToReject) {
          await rejectFile(dataType, fileName, reason);
        }
      } catch (error) {
        console.error(chalk.red('Error rejecting files:'), error);
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
 * Prompt user to select a single file
 * @param dataType Data type
 * @param bucketStage Bucket stage
 * @returns Selected file name or null
 */
async function promptForSingleFile(dataType: keyof DataTypeConfig, bucketStage: 'processing' | 'review' | 'insertion'): Promise<string | null> {
  // Get files in the bucket
  const files = await fileManager.listFiles(dataType, bucketStage);
  
  if (files.length === 0) {
    console.log(chalk.yellow(`No files found in ${bucketStage} bucket for ${dataType}`));
    return null;
  }
  
  // Create choices for inquirer
  const choices = files.map(file => ({
    name: `${file.name} (${formatFileSize(file.size)}, ${new Date(file.modifiedAt).toLocaleString()})`,
    value: file.name
  }));
  
  // Prompt user to select a file
  const { selectedFile } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedFile',
      message: `Select a file from ${bucketStage} bucket for ${dataType}:`,
      choices
    }
  ]);
  
  return selectedFile;
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
 * Approve a file and move it to the insertion bucket
 * @param dataType Data type
 * @param fileName File name
 * @returns Promise that resolves when the file is approved
 */
async function approveFile(dataType: keyof DataTypeConfig, fileName: string): Promise<void> {
  const spinner = ora(`Approving ${fileName}...`).start();
  
  try {
    // Read metadata
    const metadata = await readMetadata(dataType, 'review', fileName);
    
    // Update metadata
    const updatedMetadata = updateMetadata(metadata, {
      status: 'approved',
      statusMessage: 'Approved for insertion',
    });
    
    // Move file from review to insertion
    await fileManager.moveFile(dataType, 'review', 'insertion', fileName);
    
    // Move metadata with status update
    await moveMetadata(dataType, 'review', 'insertion', fileName, {
      status: 'approved',
      message: 'Approved for insertion',
      notes: `Approved on ${new Date().toISOString()}`
    });
    
    spinner.succeed(`Approved ${fileName} and moved to insertion bucket`);
  } catch (error) {
    spinner.fail(`Failed to approve ${fileName}: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Reject a file and move it back to processing
 * @param dataType Data type
 * @param fileName File name
 * @param reason Reason for rejection
 * @returns Promise that resolves when the file is rejected
 */
async function rejectFile(dataType: keyof DataTypeConfig, fileName: string, reason?: string): Promise<void> {
  const spinner = ora(`Rejecting ${fileName}...`).start();
  
  try {
    // Read metadata
    const metadata = await readMetadata(dataType, 'review', fileName);
    
    // Update metadata
    const updatedMetadata = updateMetadata(metadata, {
      status: 'rejected',
      statusMessage: reason || 'Rejected for further processing',
    });
    
    // Move file from review to processing
    await fileManager.moveFile(dataType, 'review', 'processing', fileName);
    
    // Move metadata with status update
    await moveMetadata(dataType, 'review', 'processing', fileName, {
      status: 'rejected',
      message: reason || 'Rejected for further processing',
      notes: `Rejected on ${new Date().toISOString()}`
    });
    
    spinner.succeed(`Rejected ${fileName} and moved back to processing bucket`);
  } catch (error) {
    spinner.fail(`Failed to reject ${fileName}: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Format quality score for display
 * @param score Quality score (0-100)
 * @returns Formatted score string with color
 */
function formatQualityScore(score: number): string {
  if (score >= 80) {
    return chalk.green(`${score}/100 (High)`);
  } else if (score >= 50) {
    return chalk.yellow(`${score}/100 (Medium)`);
  } else {
    return chalk.red(`${score}/100 (Low)`);
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
