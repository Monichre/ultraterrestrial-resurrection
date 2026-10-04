#!/usr/bin/env node

/**
 * Xata Database Seeding Script
 * Uses the @db package to seed data from CSV exports
 */

import { xata } from './src/xata-typescript-sdk/client';
import fs from 'fs';
import path from 'path';

const CSV_DATA_PATH = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports';

interface ImportStats {
  tableName: string;
  imported: number;
  errors: number;
  skipped: number;
}

class XataSeeder {
  private stats: ImportStats[] = [];

  async parseCSV(filePath: string): Promise<any[]> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const record: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (value && value !== '' && value !== 'NULL') {
          // Try to parse JSON for arrays/objects
          if (value.startsWith('[') || value.startsWith('{')) {
            try {
              record[header] = JSON.parse(value);
            } catch {
              record[header] = value;
            }
          } else {
            record[header] = value;
          }
        }
      });
      
      if (Object.keys(record).length > 0) {
        records.push(record);
      }
    }
    
    return records;
  }

  async importTable(tableName: string, records: any[]): Promise<ImportStats> {
    const stats: ImportStats = {
      tableName,
      imported: 0,
      errors: 0,
      skipped: 0
    };

    console.log(`📥 Importing ${tableName} (${records.length} records)...`);

    // Import in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      for (const record of batch) {
        try {
          // Remove xata metadata and id if present
          const cleanRecord = { ...record };
          delete cleanRecord.id;
          delete cleanRecord.xata;
          
          // Use the appropriate table from xata client
          const table = (xata.db as any)[tableName];
          if (!table) {
            console.log(`   ⚠️  Table ${tableName} not found in schema`);
            stats.skipped++;
            continue;
          }

          await table.create(cleanRecord);
          stats.imported++;
          
          if (stats.imported % 50 === 0) {
            console.log(`   📊 ${stats.imported}/${records.length} imported...`);
          }
          
        } catch (error) {
          stats.errors++;
          if (stats.errors <= 5) { // Only show first 5 errors
            console.log(`   ❌ Error importing record: ${error.message}`);
          }
        }
      }
    }

    return stats;
  }

  async seedDatabase() {
    console.log("🌱 Starting Xata Database Seeding");
    console.log("=" + "=".repeat(50));
    
    // Core tables in dependency order
    const coreTables = [
      'organizations',
      'personnel', 
      'topics',
      'events',
      'testimonies',
      'users'
    ];

    try {
      // Test connection first
      console.log("\n1. Testing database connection...");
      const testQuery = await xata.db.users.getFirst();
      console.log("   ✅ Database connection successful");

      // Import core tables
      console.log("\n2. Importing core tables...");
      
      for (const tableName of coreTables) {
        const csvPath = path.join(CSV_DATA_PATH, `${tableName}.csv`);
        
        if (!fs.existsSync(csvPath)) {
          console.log(`   ⏭️  Skipping ${tableName} - CSV not found`);
          continue;
        }

        try {
          const records = await this.parseCSV(csvPath);
          if (records.length === 0) {
            console.log(`   ⏭️  Skipping ${tableName} - no records in CSV`);
            continue;
          }

          const stats = await this.importTable(tableName, records);
          this.stats.push(stats);
          
          console.log(`   ✅ ${tableName}: ${stats.imported} imported, ${stats.errors} errors`);
          
        } catch (error) {
          console.log(`   ❌ Failed to import ${tableName}: ${error.message}`);
        }
      }

      // Summary
      console.log("\n3. Import Summary:");
      console.log("-".repeat(50));
      
      let totalImported = 0;
      let totalErrors = 0;
      
      for (const stat of this.stats) {
        console.log(`${stat.tableName.padEnd(20)} | ${stat.imported.toString().padStart(6)} imported | ${stat.errors.toString().padStart(4)} errors`);
        totalImported += stat.imported;
        totalErrors += stat.errors;
      }
      
      console.log("-".repeat(50));
      console.log(`TOTAL: ${totalImported} records imported, ${totalErrors} errors`);
      
      if (totalImported > 0) {
        console.log("\n🎉 Seeding completed successfully!");
        console.log("\n🔍 Next steps:");
        console.log("1. Run: node database-state-analysis.js");
        console.log("2. Test search functionality");
        console.log("3. Verify relationships");
      } else {
        console.log("\n⚠️  No data was imported. Check CSV files and connection.");
      }

    } catch (error) {
      console.error("❌ Seeding failed:", error);
      console.error("Stack trace:", error.stack);
    }
  }
}

// Run the seeder
const seeder = new XataSeeder();
seeder.seedDatabase().catch(console.error);