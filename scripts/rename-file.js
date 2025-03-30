#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to convert to kebab-case
function toKebabCase(str) {
  return str
    // Replace special characters with spaces
    .replace(/[^a-zA-Z0-9]/g, ' ')
    // Convert camelCase to spaces between words
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace spaces with hyphens and convert to lowercase
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// Function to convert to PascalCase
function toPascalCase(str) {
  return str
    // Replace special characters with spaces
    .replace(/[^a-zA-Z0-9]/g, ' ')
    // Convert to title case (capitalize first letter of each word)
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    // Remove spaces
    .replace(/\s+/g, '');
}

// Function to check if a path is for a component file
function isComponentFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.tsx' || ext === '.jsx';
}

// Function to get the new name based on the convention
function getNewName(itemPath) {
  const isDirectory = fs.statSync(itemPath).isDirectory();
  const basename = path.basename(itemPath);
  const ext = path.extname(basename);
  const nameWithoutExt = basename.replace(ext, '');
  
  if (isDirectory) {
    // Apply kebab-case for directories
    return toKebabCase(nameWithoutExt);
  } else if (isComponentFile(itemPath)) {
    // Apply PascalCase for component files
    return toPascalCase(nameWithoutExt) + ext;
  } else {
    // For other files, return the original name
    return basename;
  }
}

// Main function
function main() {
  // Check if path argument is provided
  if (process.argv.length < 3) {
    console.error('Usage: node rename-file.js <path-to-file-or-folder>');
    process.exit(1);
  }

  const itemPath = process.argv[2];
  
  // Check if path exists
  if (!fs.existsSync(itemPath)) {
    console.error(`Error: Path '${itemPath}' does not exist.`);
    process.exit(1);
  }

  const dirPath = path.dirname(itemPath);
  const oldName = path.basename(itemPath);
  const newName = getNewName(itemPath);
  
  // If the name doesn't need to change, notify the user
  if (oldName === newName) {
    console.log(`No renaming needed. '${oldName}' already follows the naming convention.`);
    return;
  }
  
  const newPath = path.join(dirPath, newName);
  
  // Output the command to rename the file/folder
  console.log('Rename command:');
  console.log(`mv "${itemPath}" "${newPath}"`);
  
  // Add a note about potential import updates
  if (oldName !== newName) {
    console.log('\nNote: After renaming, you may need to update import statements in your code.');
  }
}

// Run the main function
main();

