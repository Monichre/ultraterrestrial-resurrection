#!/usr/bin/env node

/**
 * Database State Analysis Script
 * 
 * This script queries the Xata database to understand the current state
 * of data across all tables, helping us make informed decisions about
 * SDK integration and migration priorities.
 */

const { xata } = require('./src/xata-typescript-sdk/client.ts');

console.log("🔍 Database State Analysis - Xata Instance\n");
console.log("=" + "=".repeat(50));

async function analyzeDatabase() {
  try {
    // Dynamically retrieve table names from the Xata instance. Fallback to the
    // previous hard-coded list if the SQL call fails (e.g. insufficient
    // permissions or older SDK).
    let tables;

    try {
      const { records } = await xata.sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`;

      if (records && records.length > 0) {
        tables = records.map((r) => r.table_name);
        console.log(`\n🗄️  Retrieved ${tables.length} tables dynamically from Xata`);
      } else {
        throw new Error('No tables returned from information_schema.tables');
      }
    } catch (error) {
      console.warn("⚠️  Could not fetch table list dynamically, falling back to static list:", error.message);
      tables = [
        'topics', 'personnel', 'events', 'organizations', 'sightings',
        'testimonies', 'documents', 'locations', 'artifacts', 'mindmaps',
        'users', 'user-saved-events', 'user-saved-topics', 'user-saved-key-figure',
        'user-saved-testimonies', 'user-saved-documents', 'user-saved-organizations',
        'user-saved-sightings', 'user-notes', 'event-subject-matter-experts',
        'topic-subject-matter-experts', 'organization-members', 'topics-testimonies',
        'event-topic-subject-matter-experts', 'tags', 'theories', 'key-figures',
        'summary-files'
      ];
    }

    console.log("\n📊 TABLE RECORD COUNTS");
    console.log("-".repeat(50));
    
    const tableCounts = {};
    
    for (const tableName of tables) {
      try {
        const count = await xata.db[tableName].aggregate({
          count: "*"
        });
        tableCounts[tableName] = count.aggs.count;
        console.log(`${tableName.padEnd(30)} | ${count.aggs.count.toLocaleString()} records`);
      } catch (error) {
        console.log(`${tableName.padEnd(30)} | ERROR: ${error.message}`);
        tableCounts[tableName] = 0;
      }
    }

    // Calculate totals
    const totalRecords = Object.values(tableCounts).reduce((sum, count) => sum + count, 0);
    console.log("-".repeat(50));
    console.log(`TOTAL RECORDS: ${totalRecords.toLocaleString()}`);

    // Analyze core entities with embeddings
    console.log("\n🧠 VECTOR EMBEDDINGS ANALYSIS");
    console.log("-".repeat(50));
    
    const vectorTables = ['topics', 'personnel', 'events', 'organizations', 'testimonies', 'documents', 'artifacts', 'mindmaps'];
    
    for (const tableName of vectorTables) {
      try {
        const withEmbeddings = await xata.db[tableName].filter({
          embedding: { $exists: true }
        }).getMany();
        
        const withoutEmbeddings = await xata.db[tableName].filter({
          embedding: { $notExists: true }
        }).getMany();
        
        const embeddingPercentage = tableCounts[tableName] > 0 
          ? ((withEmbeddings.length / tableCounts[tableName]) * 100).toFixed(1)
          : 0;
        
        console.log(`${tableName.padEnd(20)} | ${withEmbeddings.length}/${tableCounts[tableName]} (${embeddingPercentage}%) have embeddings`);
      } catch (error) {
        console.log(`${tableName.padEnd(20)} | ERROR: ${error.message}`);
      }
    }

    // Analyze relationship tables
    console.log("\n🔗 RELATIONSHIP ANALYSIS");
    console.log("-".repeat(50));
    
    const relationshipTables = [
      'event-subject-matter-experts',
      'topic-subject-matter-experts', 
      'organization-members',
      'topics-testimonies',
      'event-topic-subject-matter-experts'
    ];
    
    for (const tableName of relationshipTables) {
      const count = tableCounts[tableName];
      console.log(`${tableName.padEnd(35)} | ${count.toLocaleString()} relationships`);
    }

    // Analyze user activity
    console.log("\n👥 USER ACTIVITY ANALYSIS");
    console.log("-".repeat(50));
    
    const userTables = [
      'users',
      'user-saved-events',
      'user-saved-topics', 
      'user-saved-key-figure',
      'user-saved-testimonies',
      'user-saved-documents',
      'user-saved-organizations',
      'user-saved-sightings',
      'user-notes',
      'mindmaps'
    ];
    
    for (const tableName of userTables) {
      const count = tableCounts[tableName];
      console.log(`${tableName.padEnd(25)} | ${count.toLocaleString()} records`);
    }

    // Sample recent data
    console.log("\n📅 RECENT DATA SAMPLES");
    console.log("-".repeat(50));
    
    const sampleTables = ['events', 'testimonies', 'documents', 'sightings'];
    
    for (const tableName of sampleTables) {
      try {
        const recent = await xata.db[tableName]
          .sort("xata.createdAt", "desc")
          .getFirst();
        
        if (recent) {
          const createdAt = new Date(recent.xata.createdAt).toLocaleDateString();
          const title = recent.title || recent.name || recent.description?.substring(0, 50) + "..." || "Untitled";
          console.log(`${tableName.padEnd(20)} | Latest: ${createdAt} - "${title}"`);
        } else {
          console.log(`${tableName.padEnd(20)} | No records found`);
        }
      } catch (error) {
        console.log(`${tableName.padEnd(20)} | ERROR: ${error.message}`);
      }
    }

    // Analyze data quality
    console.log("\n✅ DATA QUALITY ANALYSIS");
    console.log("-".repeat(50));
    
    // Check for required fields
    const qualityChecks = [
      { table: 'events', field: 'title', description: 'Events with titles' },
      { table: 'personnel', field: 'name', description: 'Personnel with names' },
      { table: 'organizations', field: 'name', description: 'Organizations with names' },
      { table: 'testimonies', field: 'claim', description: 'Testimonies with claims' },
      { table: 'documents', field: 'title', description: 'Documents with titles' },
      { table: 'sightings', field: 'description', description: 'Sightings with descriptions' }
    ];
    
    for (const check of qualityChecks) {
      try {
        const withField = await xata.db[check.table].filter({
          [check.field]: { $exists: true, $ne: "" }
        }).getMany();
        
        const percentage = tableCounts[check.table] > 0 
          ? ((withField.length / tableCounts[check.table]) * 100).toFixed(1)
          : 0;
        
        console.log(`${check.description.padEnd(30)} | ${withField.length}/${tableCounts[check.table]} (${percentage}%)`);
      } catch (error) {
        console.log(`${check.description.padEnd(30)} | ERROR: ${error.message}`);
      }
    }

    // Geographic data analysis
    console.log("\n🌍 GEOGRAPHIC DATA ANALYSIS");
    console.log("-".repeat(50));
    
    const geoTables = ['events', 'sightings', 'locations'];
    
    for (const tableName of geoTables) {
      try {
        const withCoordinates = await xata.db[tableName].filter({
          latitude: { $exists: true },
          longitude: { $exists: true }
        }).getMany();
        
        const percentage = tableCounts[tableName] > 0 
          ? ((withCoordinates.length / tableCounts[tableName]) * 100).toFixed(1)
          : 0;
        
        console.log(`${tableName.padEnd(20)} | ${withCoordinates.length}/${tableCounts[tableName]} (${percentage}%) have coordinates`);
      } catch (error) {
        console.log(`${tableName.padEnd(20)} | ERROR: ${error.message}`);
      }
    }

    // Media analysis
    console.log("\n📸 MEDIA ANALYSIS");
    console.log("-".repeat(50));
    
    const mediaTables = [
      { table: 'events', field: 'photos' },
      { table: 'sightings', field: 'media' },
      { table: 'testimonies', field: 'media' },
      { table: 'documents', field: 'images' },
      { table: 'artifacts', field: 'images' }
    ];
    
    for (const check of mediaTables) {
      try {
        const withMedia = await xata.db[check.table].filter({
          [check.field]: { $exists: true }
        }).getMany();
        
        const percentage = tableCounts[check.table] > 0 
          ? ((withMedia.length / tableCounts[check.table]) * 100).toFixed(1)
          : 0;
        
        console.log(`${check.table.padEnd(15)} ${check.field.padEnd(10)} | ${withMedia.length}/${tableCounts[check.table]} (${percentage}%) have media`);
      } catch (error) {
        console.log(`${check.table.padEnd(15)} ${check.field.padEnd(10)} | ERROR: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Database analysis complete!");
    
    // Summary recommendations
    console.log("\n💡 RECOMMENDATIONS BASED ON DATA STATE:");
    console.log("-".repeat(50));
    
    if (totalRecords > 1000) {
      console.log("🔥 HIGH PRIORITY: Significant data volume - SDK migration critical");
    } else if (totalRecords > 100) {
      console.log("🔶 MEDIUM PRIORITY: Moderate data volume - SDK migration recommended");
    } else {
      console.log("🔷 LOW PRIORITY: Light data volume - SDK migration for consistency");
    }
    
    const tablesWithData = Object.entries(tableCounts).filter(([_, count]) => count > 0);
    console.log(`📊 Active tables: ${tablesWithData.length}/${tables.length}`);
    
    const userActivity = tableCounts['users'] + tableCounts['user-notes'] + tableCounts['mindmaps'];
    if (userActivity > 10) {
      console.log("👥 User engagement detected - prioritize user-facing SDK features");
    }
    
    console.log("\n🎯 NEXT STEPS:");
    console.log("1. Focus SDK migration on tables with highest record counts");
    console.log("2. Prioritize vector search capabilities for embedded data");
    console.log("3. Ensure geographic query support for location-based tables");
    console.log("4. Implement media handling for file-rich tables");

  } catch (error) {
    console.error("❌ Database analysis failed:", error);
    console.error("Stack trace:", error.stack);
  }
}

// Run the analysis
analyzeDatabase().catch(console.error);