#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories to check
const DIRECTORIES_TO_CHECK = [
  'src/components',
  'src/features'
];

// File extensions to check for component files
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx'];

// Patterns
const isKebabCase = (str) => /^[a-z]+([-][a-z]+)*$/.test(str);
const isPascalCase = (str) => /^[A-Z][a-zA-Z0-9]*$/.test(str);

// Arrays to store issues
const nonKebabCaseFolders = [];
const nonPascalCaseComponents = [];

/**
 * Checks if a folder name follows kebab-case convention
 * @param {string} folderPath - Path to the folder
 */
function checkFolderName(folderPath) {
  const folderName = path.basename(folderPath);
  
  // Skip node_modules and hidden folders
  if (folderName.startsWith('.') || folderName === 'node_modules') {
    return;
  }
  
  if (!isKebabCase(folderName)) {
    nonKebabCaseFolders.push(folderPath);
  }
}

/**
 * Checks if a component file follows PascalCase convention
 * @param {string} filePath - Path to the file
 */
function checkComponentFileName(filePath) {
  const ext = path.extname(filePath);
  
  // Only check component files
  if (!COMPONENT_EXTENSIONS.includes(ext)) {
    return;
  }
  
  const fileName = path.basename(filePath, ext);
  
  // Skip index files
  if (fileName === 'index') {
    return;
  }
  
  if (!isPascalCase(fileName)) {
    nonPascalCaseComponents.push(filePath);
  }
}

/**
 * Recursively traverses directories to check naming conventions
 * @param {string} dirPath - Directory path to traverse
 */
function traverseDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory does not exist: ${dirPath}`);
      return;
    }
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Check folder name
        checkFolderName(itemPath);
        
        // Recursively check subdirectories
        traverseDirectory(itemPath);
      } else if (stats.isFile()) {
        // Check component file name
        checkComponentFileName(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error traversing directory ${dirPath}: ${error.message}`);
  }
}

// Main execution
console.log('🔍 Starting naming convention audit...\n');

// Check each directory
for (const dir of DIRECTORIES_TO_CHECK) {
  if (fs.existsSync(dir)) {
    console.log(`Checking ${dir}...`);
    traverseDirectory(dir);
  } else {
    console.warn(`⚠️  Directory not found: ${dir}`);
  }
}

// Output results
console.log('\n📋 Audit Results:');

if (nonKebabCaseFolders.length === 0 && nonPascalCaseComponents.length === 0) {
  console.log('✅ All files and folders follow the naming conventions!');
} else {
  // Report non-kebab-case folders
  if (nonKebabCaseFolders.length > 0) {
    console.log('\n❌ Folders not in kebab-case:');
    nonKebabCaseFolders.forEach(folder => {
      console.log(`  - ${folder}`);
    });
  } else {
    console.log('\n✅ All folders follow kebab-case convention.');
  }
  
  // Report non-PascalCase components
  if (nonPascalCaseComponents.length > 0) {
    console.log('\n❌ Component files not in PascalCase:');
    nonPascalCaseComponents.forEach(file => {
      console.log(`  - ${file}`);
    });
  } else {
    console.log('\n✅ All component files follow PascalCase convention.');
  }
  
  // Summary
  console.log(`\n📊 Summary: Found ${nonKebabCaseFolders.length} folder(s) and ${nonPascalCaseComponents.length} file(s) with naming issues.`);
}

console.log('\n🏁 Naming convention audit completed!');

