#!/usr/bin/env node

/**
 * This script geocodes location data for all UFO/UAP event files
 * It processes all TypeScript files in the processing/events directory
 * 
 * Usage: node geocode-all-events.js
 */

import { processFile } from './geocode-module.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the events directory
const eventsDir = path.join(__dirname, '../processing/events');

// Configuration for UFO events files
const options = {
  arrayField: 'records',            // Field containing the array of events
  exportName: 'ufosandintelligence1', // Base export name in the TS files
  geocodeOptions: {
    locationField: 'location',  // Field containing location string
    latField: 'latitude',       // Field for latitude
    lngField: 'longitude',      // Field for longitude
    delayMs: 500,               // Delay between requests to avoid rate limiting
    geocoderOptions: {
      provider: 'openstreetmap' // Free geocoding provider
    }
  }
};

// Function to get all TypeScript files in the directory
async function getTypeScriptFiles() {
  try {
    const { stdout } = await execAsync(`find ${eventsDir} -name "*.ts" | grep -v "geocoded"`);
    return stdout.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding TypeScript files:', error);
    return [];
  }
}

// Function to infer the export name from a TypeScript file
async function getExportName(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const match = content.match(/export\s+const\s+(\w+)\s*=/);
    if (match && match[1]) {
      return match[1];
    }
    // If no match found, use a default based on filename
    const baseName = path.basename(filePath, '.ts');
    return baseName.replace(/-/g, '');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    // Return a default export name based on filename
    const baseName = path.basename(filePath, '.ts');
    return baseName.replace(/-/g, '');
  }
}

// Main function to process all files
async function geocodeAllFiles() {
  const files = await getTypeScriptFiles();
  
  if (files.length === 0) {
    console.log('No TypeScript files found to process.');
    return;
  }
  
  console.log(`Found ${files.length} TypeScript files to process.`);
  
  // Process each file
  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const outputName = fileName.replace('.ts', '-geocoded.ts');
    const outputPath = path.join(eventsDir, outputName);
    
    // Get the correct export name for this file
    const exportName = await getExportName(filePath);
    
    console.log(`\n============================================`);
    console.log(`Processing file: ${fileName}`);
    console.log(`Export name: ${exportName}`);
    console.log(`Output: ${outputName}`);
    console.log(`============================================\n`);
    
    try {
      await processFile(
        filePath, 
        outputPath, 
        {
          ...options,
          exportName
        }
      );
      console.log(`Successfully geocoded: ${fileName} -> ${outputName}`);
    } catch (error) {
      console.error(`Error geocoding ${fileName}:`, error);
    }
  }
  
  console.log('\nAll files processed.');
}

// Run the main function
geocodeAllFiles().catch(error => {
  console.error('Error running batch geocoding:', error);
  process.exit(1);
});