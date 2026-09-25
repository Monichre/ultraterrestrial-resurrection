#!/usr/bin/env node

/**
 * Fix CSV issues and seed Xata database
 * Handles malformed CSV exports and imports clean data
 */

const { xata } = require('./src/xata-typescript-sdk/client.ts');
const fs = require('fs');
const path = require('path');

const CSV_DATA_PATH = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports';

class DataFixer {
  
  cleanCSVContent(content) {
    const lines = content.split('\n');
    const cleanLines = [];
    let headersSeen = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Skip duplicate headers (except the first one)
      if (trimmedLine.startsWith('id,') && headersSeen) {
        continue;
      }
      
      if (trimmedLine.startsWith('id,')) {
        headersSeen = true;
      }
      
      cleanLines.push(trimmedLine);
    }
    
    return cleanLines.join('\n');
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  parseCSV(content) {
    const cleanContent = this.cleanCSVContent(content);
    const lines = cleanContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    const headers = this.parseCSVLine(lines[0]);
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const record = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (value && value !== '' && value !== 'NULL') {
          // Clean the header name
          const cleanHeader = header.replace(/"/g, '');
          
          // Try to parse JSON for arrays/objects
          if (value.startsWith('[') || value.startsWith('{')) {
            try {
              record[cleanHeader] = JSON.parse(value);
            } catch {
              record[cleanHeader] = value.replace(/"/g, '');
            }
          } else {
            record[cleanHeader] = value.replace(/"/g, '');
          }
        }
      });
      
      // Only add records with meaningful data (more than just an id)
      if (Object.keys(record).length > 1) {
        records.push(record);
      }
    }
    
    return records;
  }

  async seedTable(tableName) {
    const csvPath = path.join(CSV_DATA_PATH, `${tableName}.csv`);
    
    if (!fs.existsSync(csvPath)) {
      console.log(`   ⏭️  Skipping ${tableName} - CSV not found`);
      return 0;
    }

    console.log(`\n📥 Processing ${tableName}...`);
    
    try {
      const content = fs.readFileSync(csvPath, 'utf-8');
      const records = this.parseCSV(content);
      
      console.log(`   📋 Found ${records.length} records to import`);
      
      if (records.length === 0) {
        console.log(`   ⏭️  No valid records in ${tableName}`);
        return 0;
      }

      // Show sample record structure
      if (records[0]) {
        console.log(`   🔍 Sample fields: ${Object.keys(records[0]).join(', ')}`);
      }

      // Import records
      let imported = 0;
      const table = xata.db[tableName];
      
      if (!table) {
        console.log(`   ❌ Table ${tableName} not found in schema`);
        return 0;
      }

      for (const record of records) {
        try {
          // Remove xata metadata and id
          const cleanRecord = { ...record };
          delete cleanRecord.id;
          delete cleanRecord.xata;
          
          await table.create(cleanRecord);
          imported++;
          
          if (imported % 5 === 0) {
            console.log(`   📊 ${imported}/${records.length} imported...`);
          }
          
        } catch (error) {
          console.log(`   ⚠️  Error importing record: ${error.message}`);
          // Continue with next record
        }
      }

      console.log(`   ✅ ${tableName}: ${imported}/${records.length} imported successfully`);
      return imported;
      
    } catch (error) {
      console.log(`   ❌ Failed to process ${tableName}: ${error.message}`);
      return 0;
    }
  }

  async fixAndSeed() {
    console.log("🔧 CSV Fixer and Database Seeder");
    console.log("=" + "=".repeat(50));

    try {
      // Test connection first  
      console.log("\n1. Testing database connection...");
      const testQuery = await xata.db.organizations.getFirst();
      console.log("   ✅ Database connection successful");

      // Core tables to seed first (skip users)
      const coreTables = [
        'organizations',  // Independent
        'topics',         // Independent
        'events',         // Independent
        'personnel',      // May reference organizations
        'testimonies'     // UAP/UFO witness accounts
      ];

      console.log("\n2. Seeding core tables...");
      
      let totalImported = 0;
      const results = {};

      for (const tableName of coreTables) {
        const imported = await this.seedTable(tableName);
        results[tableName] = imported;
        totalImported += imported;
      }

      // Summary
      console.log("\n3. Import Summary:");
      console.log("-".repeat(50));
      
      for (const [tableName, count] of Object.entries(results)) {
        console.log(`${tableName.padEnd(20)} | ${count.toString().padStart(6)} records`);
      }
      
      console.log("-".repeat(50));
      console.log(`TOTAL: ${totalImported} records imported`);

      if (totalImported > 0) {
        console.log("\n🎉 Core data seeding completed!");
        
        // Test the data
        console.log("\n4. Testing imported data...");
        
        for (const tableName of coreTables) {
          if (results[tableName] > 0) {
            try {
              const table = xata.db[tableName];
              const sampleRecord = await table.getFirst();
              
              if (sampleRecord) {
                console.log(`   ✅ ${tableName}: Data accessible - Sample ID: ${sampleRecord.id}`);
              } else {
                console.log(`   ⚠️  ${tableName}: No records found (may have failed)`);
              }
            } catch (error) {
              console.log(`   ❌ ${tableName}: Error accessing data - ${error.message}`);
            }
          }
        }
        
        console.log("\n🔍 Next steps:");
        console.log("1. Run: node database-state-analysis.js");
        console.log("2. Import remaining tables (testimonies, documents, etc.)");
        console.log("3. Test search and AI functionality");
        
      } else {
        console.log("\n⚠️  No data was imported. Check CSV files and parsing.");
      }

    } catch (error) {
      console.error("❌ Fix and seed failed:", error);
    }
  }
}

// Run the fixer/seeder
const fixer = new DataFixer();
fixer.fixAndSeed().catch(console.error);