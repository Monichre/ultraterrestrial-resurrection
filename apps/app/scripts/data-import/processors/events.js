#!/usr/bin/env node

/**
 * Table-Based Event Processor for the new directory structure
 * 
 * This script processes UFO intelligence markdown files and prepares them for 
 * insertion into the Xata events table.
 * 
 * Usage: node processors/events.js [options]
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory is one level up from processors/
const BASE_DIR = path.join(__dirname, '..');
// Let the legacy processor handle the docs directory path
const PROCESSING_DIR = path.join(BASE_DIR, 'processing/events');
const INSERTION_DIR = path.join(BASE_DIR, 'insertion/events');

// Create directories if they don't exist
for (const dir of [PROCESSING_DIR, INSERTION_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Import the legacy processor to avoid duplication
// This is temporary until a full migration to the new structure
import legacyProcessor from '../events/prepare-ufo-events-enhanced.js';

// Process command line arguments
const args = process.argv.slice(2);

console.log("Table-based Event Processor");
console.log("Using the legacy processor temporarily");
console.log("Output will be saved to insertion/events/events.json");

// Execute the processor with its own paths first
console.log("Running legacy processor to extract events from markdown files...");
legacyProcessor.processAllFiles(args)
  .then(() => {
    // Copy the output to our new insertion directory
    console.log("Processing complete! Copying data to insertion directory...");
    
    // Get the output file path from the legacy processor
    const sourceJsonPath = path.join(legacyProcessor.outputDir, 'events.json');
    const sourceCsvPath = path.join(legacyProcessor.outputDir, 'events.csv');
    
    // Destination paths
    const destJsonPath = path.join(INSERTION_DIR, 'events.json');
    const destCsvPath = path.join(INSERTION_DIR, 'events.csv');
    
    // Copy the files
    if (fs.existsSync(sourceJsonPath)) {
      fs.copyFileSync(sourceJsonPath, destJsonPath);
      console.log(`Copied JSON data to: ${destJsonPath}`);
    }
    
    if (fs.existsSync(sourceCsvPath)) {
      fs.copyFileSync(sourceCsvPath, destCsvPath);
      console.log(`Copied CSV data to: ${destCsvPath}`);
    }
    
    console.log("Data is ready for insertion!");
  })
  .catch(err => {
    console.error("Error processing events:", err);
    process.exit(1);
  });