#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = require('glob');
const globPromise = promisify(glob.glob);
const chalk = require('chalk');

// Promisify fs methods
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);

// Convert to kebab-case (for folders)
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// Convert to PascalCase (for component files)
function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

// Check if a folder name follows kebab-case
function isKebabCase(str) {
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(str);
}

// Check if a component file name follows PascalCase
function isPascalCase(str) {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}

// Check if a path is a React component file
function isComponentFile(filePath) {
  const ext = path.extname(filePath);
  return ['.jsx', '.tsx'].includes(ext);
}

// Build a map of files to rename
async function buildRenameMap(directoryPath, dryRun) {
  const renameMap = new Map(); // old path -> new path
  
  // Get all directories and files in the given path
  try {
    // First process directories (depth-first to avoid path conflicts)
    const allPaths = await globPromise(`${directoryPath}/**/*`, { dot: true });
    
    // Sort paths by depth (deepest first) to avoid renaming conflicts
    const sortedPaths = allPaths.sort((a, b) => {
      return b.split(path.sep).length - a.split(path.sep).length;
    });
    
    for (const itemPath of sortedPaths) {
      const stats = await stat(itemPath);
      const dirname = path.dirname(itemPath);
      const basename = path.basename(itemPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules, .git, etc.
        if (basename.startsWith('.') || basename === 'node_modules') {
          continue;
        }
        
        if (!isKebabCase(basename)) {
          const newBasename = toKebabCase(basename);
          const newPath = path.join(dirname, newBasename);
          renameMap.set(itemPath, newPath);
          
          if (dryRun) {
            console.log(chalk.yellow(`Would rename directory: ${itemPath} → ${newPath}`));
          }
        }
      } else if (stats.isFile()) {
        // Process component files (.jsx, .tsx)
        if (isComponentFile(itemPath)) {
          const filename = path.basename(itemPath, path.extname(itemPath));
          
          if (!isPascalCase(filename)) {
            const newFilename = toPascalCase(filename) + path.extname(itemPath);
            const newPath = path.join(dirname, newFilename);
            renameMap.set(itemPath, newPath);
            
            if (dryRun) {
              console.log(chalk.blue(`Would rename component: ${itemPath} → ${newPath}`));
            }
          }
        }
      }
    }
    
    return renameMap;
  } catch (error) {
    console.error(chalk.red(`Error building rename map: ${error.message}`));
    throw error;
  }
}

// Update imports in all JS/TS files
async function updateImports(renameMap, rootDir, dryRun) {
  try {
    // Find all JS/TS files
    const jsFiles = await globPromise(`${rootDir}/**/*.{js,jsx,ts,tsx}`, { dot: true });
    const updatedFiles = new Set();
    
    for (const filePath of jsFiles) {
      // Skip node_modules
      if (filePath.includes('node_modules')) {
        continue;
      }
      
      let content = await readFile(filePath, 'utf8');
      let originalContent = content;
      let fileUpdated = false;
      
      // Process each rename entry
      for (const [oldPath, newPath] of renameMap.entries()) {
        // Calculate relative paths that might be in imports
        const relativeOldPath = path.relative(rootDir, oldPath);
        const relativeNewPath = path.relative(rootDir, newPath);
        
        // Handle different import patterns
        // Absolute imports (from project root)
        const absolutePattern = new RegExp(
          `(['"])${relativeOldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\/g, '/')}(['"])`,
          'g'
        );
        content = content.replace(absolutePattern, `$1${relativeNewPath.replace(/\\/g, '/')}$2`);
        
        // Relative imports
        const fileDir = path.dirname(filePath);
        const relativeToFile = path.relative(fileDir, oldPath).replace(/\\/g, '/');
        const newRelativeToFile = path.relative(fileDir, newPath).replace(/\\/g, '/');
        
        // Handle case when import doesn't have ./ prefix
        const relativePattern = new RegExp(
          `(['"])${relativeToFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`,
          'g'
        );
        content = content.replace(relativePattern, `$1${newRelativeToFile}$2`);
        
        // Handle case when import has ./ prefix
        const dotRelativePattern = new RegExp(
          `(['"])\\./${relativeToFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`,
          'g'
        );
        content = content.replace(dotRelativePattern, `$1./${newRelativeToFile}$2`);
        
        // Handle case when import has ../ prefix
        if (relativeToFile.startsWith('../')) {
          const dotDotRelativePattern = new RegExp(
            `(['"])${relativeToFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`,
            'g'
          );
          content = content.replace(dotDotRelativePattern, `$1${newRelativeToFile}$2`);
        }
      }
      
      if (content !== originalContent) {
        fileUpdated = true;
        updatedFiles.add(filePath);
        
        if (dryRun) {
          console.log(chalk.green(`Would update imports in: ${filePath}`));
        } else {
          await writeFile(filePath, content, 'utf8');
          console.log(chalk.green(`Updated imports in: ${filePath}`));
        }
      }
    }
    
    return updatedFiles.size;
  } catch (error) {
    console.error(chalk.red(`Error updating imports: ${error.message}`));
    throw error;
  }
}

// Execute renames from map
async function executeRenames(renameMap, dryRun) {
  if (dryRun) {
    console.log(chalk.yellow(`Would rename ${renameMap.size} files/directories`));
    return;
  }
  
  try {
    // Perform the renames
    for (const [oldPath, newPath] of renameMap.entries()) {
      await rename(oldPath, newPath);
      console.log(chalk.green(`Renamed: ${oldPath} → ${newPath}`));
    }
    
    console.log(chalk.green(`Successfully renamed ${renameMap.size} files/directories`));
  } catch (error) {
    console.error(chalk.red(`Error renaming files/directories: ${error.message}`));
    throw error;
  }
}

// Main function
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const dryRunIndex = args.indexOf('--dry-run');
  const dryRun = dryRunIndex !== -1;
  
  // Remove --dry-run from args if present
  if (dryRunIndex !== -1) {
    args.splice(dryRunIndex, 1);
  }
  
  if (args.length < 1) {
    console.log(chalk.yellow('Usage: node batch-rename.js <directory-path> [--dry-run]'));
    process.exit(1);
  }
  
  const directoryPath = path.resolve(args[0]);
  
  try {
    // Check if directory exists
    const dirStats = await stat(directoryPath);
    if (!dirStats.isDirectory()) {
      console.error(chalk.red(`Error: ${directoryPath} is not a directory`));
      process.exit(1);
    }
    
    console.log(chalk.cyan(`Scanning directory: ${directoryPath}`));
    console.log(chalk.cyan(`Mode: ${dryRun ? 'Dry run (no changes will be made)' : 'Live (changes will be applied)'}`));
    
    // Build map of files/directories to rename
    const renameMap = await buildRenameMap(directoryPath, dryRun);
    
    if (renameMap.size === 0) {
      console.log(chalk.green('All files and directories already follow the naming conventions!'));
      process.exit(0);
    }
    
    console.log(chalk.yellow(`Found ${renameMap.size} files/directories to rename`));
    
    // Get project root (assuming it contains package.json)
    let rootDir = directoryPath;
    while (rootDir !== path.parse(rootDir).root) {
      if (fs.existsSync(path.join(rootDir, 'package.json'))) {
        break;
      }
      rootDir = path.dirname(rootDir);
    }
    
    // First update import statements
    console.log(chalk.cyan('Updating import statements...'));
    const updatedFilesCount = await updateImports(renameMap, rootDir, dryRun);
    console.log(chalk.green(`${dryRun ? 'Would update' : 'Updated'} imports in ${updatedFilesCount} files`));
    
    // Then execute renames
    console.log(chalk.cyan('Renaming files and directories...'));
    await executeRenames(renameMap, dryRun);
    
    console.log(chalk.green('Operation completed successfully!'));
    
    if (dryRun) {
      console.log(chalk.yellow('\nThis was a dry run. Run without --dry-run to apply changes.'));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Run the script
main();

