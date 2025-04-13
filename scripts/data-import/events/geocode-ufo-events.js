#!/usr/bin/env node

/**
 * This script geocodes location data for UFO/UAP events records
 * It leverages the geocode-module.js to add latitude/longitude coordinates
 * 
 * Usage: node geocode-ufo-events.js <inputPath> <outputPath>
 *        node geocode-ufo-events.js ../processing/events/ufo-int-1.ts ../processing/events/ufo-int-1-geocoded.ts --arrayField=records
 */

import { processFile } from './geocode-module.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths
const defaultInputPath = path.join(__dirname, '../processing/events/ufo-int-1.ts');
const defaultOutputPath = path.join(__dirname, '../processing/events/ufo-int-1-geocoded.ts');

// Get command line arguments or use defaults
const inputPath = process.argv[2] || defaultInputPath;
const outputPath = process.argv[3] || defaultOutputPath;

// Configuration for UFO events files
const options = {
  arrayField: 'records',            // Field containing the array of events
  exportName: 'ufosandintelligence1', // Export name in the TS file (matches the original)
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

console.log(`Geocoding UFO events from: ${inputPath}`);
console.log(`Output will be saved to: ${outputPath}`);

// Process the file
processFile(inputPath, outputPath, options)
  .then(() => {
    console.log('Geocoding of UFO events completed successfully!');
  })
  .catch(error => {
    console.error('Error geocoding UFO events:', error);
    process.exit(1);
  });