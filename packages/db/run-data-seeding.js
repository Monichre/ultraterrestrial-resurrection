#!/usr/bin/env node

/**
 * Data Seeding Script for Xata Database
 * 
 * This script will populate the empty Xata tables with data from CSV exports.
 * The CSV files exist but the data was never loaded into the database.
 */

import { xata } from './src/xata-typescript-sdk/client.js';
import fs from 'fs';
import path from 'path';

const CSV_DATA_PATH = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports';

console.log("🌱 Starting Xata Database Seeding Process");
console.log("=" + "=".repeat(50));

async function runSeeding() {
  try {
    // Check if CSV files exist
    console.log("\n1. Checking for CSV data files...");
    
    const csvFiles = [
      'organizations.csv',
      'personnel.csv', 
      'topics.csv',
      'events.csv',
      'testimonies.csv',
      'documents.csv',
      'sightings.csv',
      'artifacts.csv',
      'users.csv'
    ];
    
    const missingFiles = [];
    const existingFiles = [];
    
    for (const file of csvFiles) {
      const filePath = path.join(CSV_DATA_PATH, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        existingFiles.push({ file, size: stats.size });
        console.log(`   ✅ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
      } else {
        missingFiles.push(file);
        console.log(`   ❌ ${file} - NOT FOUND`);
      }
    }
    
    if (missingFiles.length > 0) {
      console.log(`\n⚠️  Missing ${missingFiles.length} CSV files. Cannot proceed with seeding.`);
      console.log("Missing files:", missingFiles.join(', '));
      return;
    }
    
    console.log(`\n✅ All ${existingFiles.length} CSV files found!`);
    
    // Test database connection
    console.log("\n2. Testing database connection...");
    
    try {
      const testRecord = await xata.db.users.getFirst();
      console.log("   ✅ Database connection successful");
      console.log(`   📊 Users table status: ${testRecord ? 'Has data' : 'Empty'}`);
    } catch (error) {
      console.log(`   ❌ Database connection failed: ${error.message}`);
      console.log("\n🔧 DEBUGGING INFO:");
      console.log("   - Check XATA_API_KEY environment variable");
      console.log("   - Verify database URL in xata.ts");
      console.log("   - Confirm network connectivity to Xata servers");
      return;
    }
    
    // Check current table states
    console.log("\n3. Checking current table states...");
    
    const tableChecks = [
      { name: 'organizations', table: xata.db.organizations },
      { name: 'personnel', table: xata.db.personnel },
      { name: 'events', table: xata.db.events },
      { name: 'topics', table: xata.db.topics },
      { name: 'testimonies', table: xata.db.testimonies }
    ];
    
    let totalRecords = 0;
    
    for (const check of tableChecks) {
      try {
        const records = await check.table.getMany({ pagination: { size: 1 } });
        const isEmpty = records.length === 0;
        console.log(`   ${check.name.padEnd(20)} | ${isEmpty ? 'EMPTY' : 'HAS DATA'}`);
        if (!isEmpty) totalRecords++;
      } catch (error) {
        console.log(`   ${check.name.padEnd(20)} | ERROR: ${error.message}`);
      }
    }
    
    if (totalRecords === 0) {
      console.log("\n🎯 CONFIRMED: All tables are empty - seeding is required!");
    } else {
      console.log(`\n⚠️  Some tables already contain data (${totalRecords}/${tableChecks.length})`);
      console.log("   Consider backing up existing data before proceeding");
    }
    
    // Provide next steps
    console.log("\n🚀 NEXT STEPS:");
    console.log("-".repeat(50));
    console.log("1. Ensure XATA_API_KEY environment variable is set");
    console.log("2. Run one of the existing seeding scripts:");
    console.log("   • For core tables only:");
    console.log("     cd ../apps/disclosure-rag && python import-core-tables.py");
    console.log("   • For full import:");
    console.log("     cd ../apps/disclosure-rag && python scripts/final-import.py");
    console.log("   • For bulk import:");
    console.log("     cd ../apps/disclosure-rag && python scripts/bulk-import.py");
    console.log("");
    console.log("3. Monitor the import process for errors");
    console.log("4. Verify data integrity after import");
    console.log("5. Run database analysis script to confirm success");
    
    console.log("\n💡 RECOMMENDATION:");
    console.log("Start with 'import-core-tables.py' for essential data first,");
    console.log("then run full import if needed.");
    
  } catch (error) {
    console.error("❌ Seeding check failed:", error);
    console.error("Stack trace:", error.stack);
  }
}

// Run the seeding check
runSeeding().catch(console.error);