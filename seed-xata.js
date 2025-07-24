#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: './packages/db/.env' });

// Since the package uses ES modules, we need to use dynamic import
let xataClient;

async function initializeXataClient() {
  try {
    // Try to initialize Xata client using environment variables directly
    const { XataClient } = await import('@xata.io/client');
    
    if (!process.env.XATA_API_KEY) {
      throw new Error('XATA_API_KEY environment variable is required');
    }
    
    // Initialize client with environment variables
    xataClient = new XataClient({
      apiKey: process.env.XATA_API_KEY,
      branch: process.env.XATA_BRANCH || 'main'
    });
    
    console.log('✅ Xata client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Xata client:', error.message);
    console.error('Make sure XATA_API_KEY is set in packages/db/.env');
    process.exit(1);
  }
}

// Simple CSV parser
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"/, '').replace(/"$/, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing - handles basic cases
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index];
        // Remove quotes and handle empty values
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        row[header] = value === '' ? null : value;
      });
      rows.push(row);
    }
  }
  
  return rows;
}

// Load and parse CSV file
function loadCSV(filePath) {
  try {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    return parseCSV(csvContent);
  } catch (error) {
    console.error(`❌ Failed to load CSV file ${filePath}:`, error.message);
    return [];
  }
}

// Clean data for Xata insertion
function cleanRowForXata(row) {
  const cleaned = {};
  
  for (const [key, value] = Object.entries(row)) {
    // Skip id field if it exists (Xata will generate its own)
    if (key === 'id') continue;
    
    // Handle different data types
    if (value === null || value === '') {
      cleaned[key] = null;
    } else if (key.includes('embedding')) {
      // Skip embedding fields for now as they require special handling
      continue;
    } else if (key.includes('photo') || key.includes('image')) {
      // Skip file fields for now
      continue;
    } else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

// Insert data with error handling and progress
async function insertData(tableName, data, batchSize = 10) {
  if (!data || data.length === 0) {
    console.log(`⚠️  No data to insert for ${tableName}`);
    return;
  }
  
  console.log(`📊 Processing ${data.length} records for ${tableName}...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process in smaller batches or individually
  for (let i = 0; i < data.length; i++) {
    const record = cleanRowForXata(data[i]);
    
    if (Object.keys(record).length === 0) {
      console.log(`⚠️  Skipping empty record for ${tableName}`);
      continue;
    }
    
    try {
      // Insert records individually for better error handling
      const result = await xataClient.request({
        method: 'POST',
        url: `/db/main:main/tables/${tableName}/data`,
        body: record
      });
      
      successCount++;
      
      if (successCount % 10 === 0) {
        console.log(`✅ Inserted ${successCount}/${data.length} records into ${tableName}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to insert record ${i + 1} into ${tableName}:`, error.message);
      console.error('Problematic record:', JSON.stringify(record, null, 2));
    }
    
    // Small delay between records to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log(`📈 ${tableName}: ${successCount} successful, ${errorCount} failed\n`);
}

// Main seeding function
async function seedDatabase() {
  const exportsDir = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports';
  
  console.log('🚀 Starting Xata database seeding...\n');
  
  // Define order of tables to seed (dependencies first)
  const seedOrder = [
    { file: 'users.csv', table: 'users' },
    { file: 'organizations.csv', table: 'organizations' },
    { file: 'topics.csv', table: 'topics' },
    { file: 'events.csv', table: 'events' },
    { file: 'personnel.csv', table: 'personnel' },
    { file: 'locations.csv', table: 'locations' },
    { file: 'key-figures.csv', table: 'key-figures' },
    { file: 'sightings.csv', table: 'sightings' },
    { file: 'testimonies.csv', table: 'testimonies' },
    { file: 'documents.csv', table: 'documents' },
    { file: 'theories.csv', table: 'theories' },
    { file: 'mindmaps.csv', table: 'mindmaps' },
    { file: 'tags.csv', table: 'tags' }
  ];
  
  let totalSuccess = 0;
  let totalErrors = 0;
  
  for (const { file, table } of seedOrder) {
    const filePath = path.join(exportsDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}, skipping ${table}`);
      continue;
    }
    
    console.log(`📂 Loading ${file}...`);
    const data = loadCSV(filePath);
    
    if (data.length > 0) {
      await insertData(table, data);
      totalSuccess += data.length;
    } else {
      console.log(`⚠️  No valid data found in ${file}\n`);
    }
  }
  
  console.log('🎉 Database seeding completed!');
  console.log(`📊 Total records processed: ${totalSuccess}`);
  console.log(`❌ Total errors: ${totalErrors}`);
}

// Handle errors and run the script
async function main() {
  try {
    await initializeXataClient();
    await seedDatabase();
  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { seedDatabase, loadCSV, parseCSV };