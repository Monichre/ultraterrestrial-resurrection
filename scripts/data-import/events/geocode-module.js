#!/usr/bin/env node

/**
 * Modular Geocoding Module
 * 
 * This module provides geocoding functionality for any array of items with location fields.
 * It can be used as a standalone script or imported as a module in other scripts.
 * 
 * Usage as script: node geocode-module.js <inputPath> <outputPath> [--arrayField=recordsFieldName]
 * Usage as module: import { geocodeItems } from './geocode-module.js';
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import NodeGeocoder from 'node-geocoder';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to create a small delay between requests to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main geocoding function that can process any array of items with location fields
 * 
 * @param {Array} items - Array of items to geocode
 * @param {Object} options - Configuration options
 * @param {string} options.locationField - Field name containing location string (default: 'location')
 * @param {string} options.latField - Field name for latitude (default: 'latitude')
 * @param {string} options.lngField - Field name for longitude (default: 'longitude')
 * @param {number} options.delayMs - Milliseconds to delay between requests (default: 500)
 * @param {Object} options.geocoderOptions - Options to pass to NodeGeocoder
 * @returns {Array} - The updated array with geocoded coordinates
 */
export async function geocodeItems(items, options = {}) {
  // Default options
  const config = {
    locationField: 'location',
    latField: 'latitude',
    lngField: 'longitude',
    delayMs: 500,
    geocoderOptions: {
      provider: 'openstreetmap'
    },
    ...options
  };

  // Initialize geocoder with provided or default options
  const geocoder = NodeGeocoder(config.geocoderOptions);
  
  console.log(`Starting geocoding for ${items.length} items...`);
  
  let processed = 0;
  let successful = 0;
  
  // Process each item
  for (const item of items) {
    processed++;
    
    const locationValue = item[config.locationField];
    
    // Skip if no location or if coordinates are already set
    if (!locationValue || 
        (item[config.latField] !== null && item[config.latField] !== undefined &&
         item[config.lngField] !== null && item[config.lngField] !== undefined)) {
      console.log(`Skipping item - No location or already geocoded`);
      continue;
    }
    
    try {
      console.log(`Geocoding: ${locationValue}`);
      
      // Geocode the location
      const results = await geocoder.geocode(locationValue);
      
      // If we got a result, update the latitude and longitude
      if (results && results.length > 0) {
        item[config.latField] = results[0].latitude;
        item[config.lngField] = results[0].longitude;
        successful++;
        console.log(`  Success: (${results[0].latitude}, ${results[0].longitude})`);
      } else {
        console.log(`  No results found for: ${locationValue}`);
      }
      
      // Add a delay to avoid rate limiting
      await delay(config.delayMs);
      
    } catch (error) {
      console.error(`  Error geocoding ${locationValue}: ${error.message}`);
    }
    
    // Log progress every 5 items
    if (processed % 5 === 0 || processed === items.length) {
      console.log(`Progress: ${processed}/${items.length} items processed`);
    }
  }
  
  console.log(`
Geocoding completed:
- Total items: ${items.length}
- Successfully geocoded: ${successful}
- Success rate: ${(successful / items.length * 100).toFixed(2)}%
  `);
  
  return items;
}

/**
 * Process a file containing an array of items (or an object with an array field)
 * 
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to save output file
 * @param {Object} options - Options for processing
 * @param {string} options.arrayField - Field name if items are nested in an object
 * @param {Object} options.geocodeOptions - Options to pass to geocodeItems
 * @returns {Promise<void>}
 */
export async function processFile(inputPath, outputPath, options = {}) {
  try {
    console.log(`Processing file: ${inputPath}`);
    
    // Read the input file
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    
    // Handle different file types
    let data;
    
    if (inputPath.endsWith('.json')) {
      // For JSON files, just parse
      data = JSON.parse(fileContent);
    } else if (inputPath.endsWith('.ts') || inputPath.endsWith('.js')) {
      // For TS/JS files that export objects, we need to extract the data
      // For safety, create a proper module to import
      
      // Extract object structure for TypeScript files
      const extractObjectFromTs = (content) => {
        // This is a simple approach - in a production environment you might
        // want to use a proper TS parser for more complex files
        const exportMatch = content.match(/export\s+const\s+(\w+)\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
        
        if (exportMatch) {
          const exportName = exportMatch[1];
          const objectStr = exportMatch[2];
          
          // Create a wrapper that returns the object
          return {
            objectStr,
            exportName
          };
        }
        
        throw new Error('Could not extract exported object from TypeScript file');
      };
      
      // Create a temporary JavaScript module we can import
      const tempFilePath = path.join(path.dirname(inputPath), '_temp_geocode_import.js');
      
      try {
        if (inputPath.endsWith('.ts')) {
          // Extract the object structure
          const { exportName, objectStr } = extractObjectFromTs(fileContent);
          
          // Save a temporary JS module that exports the object
          const tempContent = `export default ${objectStr};`;
          fs.writeFileSync(tempFilePath, tempContent, 'utf8');
          
          // Import the module
          const importedModule = await import(`file://${tempFilePath}`);
          data = importedModule.default;
        } else {
          // For JS files, similar approach but simpler
          const tempContent = `${fileContent.replace(/export\s+const\s+/, 'const ')}
export default ${options.exportName || fileContent.match(/export\s+const\s+(\w+)/)[1]};`;
          
          fs.writeFileSync(tempFilePath, tempContent, 'utf8');
          const importedModule = await import(`file://${tempFilePath}`);
          data = importedModule.default;
        }
      } catch (err) {
        console.error('Error processing file:', err);
        throw err;
      } finally {
        // Clean up the temporary file
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    } else {
      throw new Error('Unsupported file format. Please use .json, .js, or .ts files.');
    }
    
    // Determine the array to process
    let itemsToProcess;
    let isNestedArray = false;
    
    if (Array.isArray(data)) {
      itemsToProcess = data;
    } else if (options.arrayField && data[options.arrayField] && Array.isArray(data[options.arrayField])) {
      itemsToProcess = data[options.arrayField];
      isNestedArray = true;
    } else {
      throw new Error('Could not find an array to process. Please specify the array field if nested.');
    }
    
    // Process the items
    const updatedItems = await geocodeItems(itemsToProcess, options.geocodeOptions || {});
    
    // Update the data structure
    if (isNestedArray) {
      data[options.arrayField] = updatedItems;
    } else {
      data = updatedItems;
    }
    
    // Save the updated data
    let outputContent;
    if (outputPath.endsWith('.json')) {
      outputContent = JSON.stringify(data, null, 2);
    } else if (outputPath.endsWith('.ts')) {
      outputContent = `export const ${options.exportName || 'geocodedData'} = ${JSON.stringify(data, null, 2)};`;
    } else if (outputPath.endsWith('.js')) {
      outputContent = `module.exports = ${JSON.stringify(data, null, 2)};`;
    }
    
    fs.writeFileSync(outputPath, outputContent, 'utf8');
    console.log(`Updated data saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
}

// Run as script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, inputPath, outputPath, ...args] = process.argv;
  
  if (!inputPath || !outputPath) {
    console.error('Usage: node geocode-module.js <inputPath> <outputPath> [--arrayField=fieldName] [--exportName=exportName]');
    process.exit(1);
  }
  
  // Parse arguments
  const options = {};
  args.forEach(arg => {
    if (arg.startsWith('--arrayField=')) {
      options.arrayField = arg.split('=')[1];
    }
    if (arg.startsWith('--exportName=')) {
      options.exportName = arg.split('=')[1];
    }
    if (arg.startsWith('--provider=')) {
      options.geocodeOptions = {
        ...options.geocodeOptions,
        geocoderOptions: {
          provider: arg.split('=')[1]
        }
      };
    }
    if (arg.startsWith('--delay=')) {
      options.geocodeOptions = {
        ...options.geocodeOptions,
        delayMs: parseInt(arg.split('=')[1], 10)
      };
    }
  });
  
  processFile(inputPath, outputPath, options)
    .catch(error => {
      console.error('Error running geocoding module:', error);
      process.exit(1);
    });
}