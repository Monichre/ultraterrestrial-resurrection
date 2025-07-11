/**
 * Xata Migration Script
 * Migrates data from PostgreSQL with pgvector to Xata
 */

import { Pool } from 'pg';
import { getXataClient } from '@xata.io/client';
import { XataClient } from '../../packages/db/xata/xata';

// Environment configuration
const config = {
  postgres: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ultraterrestrial'
  },
  xata: {
    apiKey: process.env.XATA_API_KEY,
    databaseURL: process.env.XATA_DATABASE_URL
  },
  batchSize: 100,
  maxRetries: 3
};

// Initialize clients
const pgPool = new Pool({ connectionString: config.postgres.connectionString });
const xata = new XataClient();

// Utility functions
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Embedding conversion utilities
function decodeEmbedding(base64String: string): number[] {
  const buffer = Buffer.from(base64String, 'base64');
  const floatArray = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
  return Array.from(floatArray);
}

function convertEmbeddingDimension(embedding: number[], fromDim: number, toDim: number): number[] {
  if (fromDim === toDim) return embedding;
  
  if (fromDim === 500 && toDim === 1536) {
    // Pad with zeros for organizations table
    return [...embedding, ...new Array(1036).fill(0)];
  }
  
  // For other conversions, truncate or throw error
  if (fromDim > toDim) {
    return embedding.slice(0, toDim);
  }
  
  throw new Error(`Unsupported dimension conversion: ${fromDim} -> ${toDim}`);
}

// Transform functions for each table
const transformers = {
  personnel: (row: any) => ({
    name: row.name,
    bio: row.bio,
    role: row.role,
    rank: row.rank,
    credibility: row.credibility,
    popularity: row.popularity,
    authority: row.authority,
    photo: row.photo ? JSON.parse(row.photo) : undefined,
    embedding: row.embedding_base64 ? decodeEmbedding(row.embedding_base64) : undefined
  }),

  organizations: (row: any) => ({
    name: row.name,
    title: row.title,
    specialization: row.specialization,
    description: row.description,
    photo: row.photo,
    embedding: row.embedding_base64 
      ? convertEmbeddingDimension(decodeEmbedding(row.embedding_base64), 500, 500)
      : undefined
  }),

  events: (row: any) => ({
    title: row.title,
    name: row.name,
    description: row.description,
    summary: row.summary,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    date: row.date,
    category: row.category ? JSON.parse(row.category) : undefined,
    photos: row.photos ? JSON.parse(row.photos) : undefined,
    metadata: row.metadata,
    embedding: row.embedding_base64 ? decodeEmbedding(row.embedding_base64) : undefined
  }),

  topics: (row: any) => ({
    title: row.title,
    name: row.name,
    summary: row.summary,
    photo: row.photo,
    photos: row.photos ? JSON.parse(row.photos) : undefined,
    embedding: row.embedding_base64 ? decodeEmbedding(row.embedding_base64) : undefined
  }),

  documents: (row: any) => ({
    title: row.title,
    summary: row.summary,
    url: row.url,
    date: row.date,
    processed: row.processed,
    file: row.file_urls ? JSON.parse(row.file_urls) : undefined,
    images: row.images ? JSON.parse(row.images) : undefined,
    metadata: row.metadata,
    embedding: row.embedding_base64 ? decodeEmbedding(row.embedding_base64) : undefined
  }),

  testimonies: (row: any) => ({
    claim: row.claim,
    summary: row.summary,
    context: row.context,
    source: row.source,
    date: row.date,
    documentation: row.documentation ? JSON.parse(row.documentation) : undefined,
    media: row.media ? JSON.parse(row.media) : undefined,
    embedding: row.embedding_base64 ? decodeEmbedding(row.embedding_base64) : undefined
  }),

  artifacts: (row: any) => ({
    name: row.name,
    description: row.description,
    photos: row.photos ? JSON.parse(row.photos) : undefined,
    date: row.date,
    source: row.source,
    origin: row.origin,
    images: row.images ? JSON.parse(row.images) : undefined,
    embedding: row.embedding_base64 ? decodeEmbedding(row.embedding_base64) : undefined
  }),

  sightings: (row: any) => ({
    date: row.date,
    description: row.description,
    comments: row.comments,
    media_link: row.media_link,
    city: row.city,
    state: row.state,
    country: row.country,
    shape: row.shape,
    duration_seconds: row.duration_seconds,
    duration_hours_min: row.duration_hours_min,
    latitude: row.latitude,
    longitude: row.longitude,
    media: row.media ? JSON.parse(row.media) : undefined,
    date_posted: row.date_posted
  })
};

// Migration status tracking
interface MigrationStatus {
  table: string;
  totalRecords: number;
  migratedRecords: number;
  failedRecords: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  errors: any[];
}

const migrationStatus: Record<string, MigrationStatus> = {};

// Main migration function for a single table
async function migrateTable(tableName: string): Promise<void> {
  console.log(`\n📊 Starting migration for table: ${tableName}`);
  
  // Initialize status
  migrationStatus[tableName] = {
    table: tableName,
    totalRecords: 0,
    migratedRecords: 0,
    failedRecords: 0,
    status: 'in-progress',
    errors: []
  };

  try {
    // Get total count
    const countResult = await pgPool.query(`SELECT COUNT(*) FROM ${tableName}`);
    const totalRecords = parseInt(countResult.rows[0].count);
    migrationStatus[tableName].totalRecords = totalRecords;

    console.log(`Found ${totalRecords} records to migrate`);

    // Query with embedding as base64
    const query = `
      SELECT *,
      ${tableName !== 'sightings' && tableName !== 'locations' ? 
        "encode(embedding::bytea, 'base64') as embedding_base64" : 
        "''" as embedding_base64}
      FROM ${tableName}
      ORDER BY created_at ASC
    `;

    const { rows } = await pgPool.query(query);
    const transformer = transformers[tableName as keyof typeof transformers];

    if (!transformer) {
      throw new Error(`No transformer defined for table: ${tableName}`);
    }

    // Process in batches
    const batches = chunk(rows, config.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} records)`);

      try {
        const records = batch.map(transformer);
        
        // Create records in Xata
        await xata.db[tableName as keyof typeof xata.db].create(records as any);
        
        migrationStatus[tableName].migratedRecords += batch.length;
      } catch (error) {
        console.error(`Error in batch ${i + 1}:`, error);
        migrationStatus[tableName].failedRecords += batch.length;
        migrationStatus[tableName].errors.push({
          batch: i + 1,
          error: error instanceof Error ? error.message : String(error)
        });

        // Retry logic
        for (let retry = 1; retry <= config.maxRetries; retry++) {
          console.log(`Retry ${retry}/${config.maxRetries} for batch ${i + 1}`);
          await sleep(1000 * retry); // Exponential backoff
          
          try {
            const records = batch.map(transformer);
            await xata.db[tableName as keyof typeof xata.db].create(records as any);
            
            migrationStatus[tableName].migratedRecords += batch.length;
            migrationStatus[tableName].failedRecords -= batch.length;
            break; // Success, exit retry loop
          } catch (retryError) {
            if (retry === config.maxRetries) {
              console.error(`Failed after ${config.maxRetries} retries`);
            }
          }
        }
      }

      // Progress update
      const progress = ((i + 1) / batches.length * 100).toFixed(2);
      console.log(`Progress: ${progress}% (${migrationStatus[tableName].migratedRecords}/${totalRecords})`);
    }

    migrationStatus[tableName].status = 'completed';
    console.log(`✅ Migration completed for ${tableName}`);

  } catch (error) {
    console.error(`❌ Migration failed for ${tableName}:`, error);
    migrationStatus[tableName].status = 'failed';
    migrationStatus[tableName].errors.push({
      general: error instanceof Error ? error.message : String(error)
    });
  }
}

// Migrate relationship tables (after main tables)
async function migrateRelationshipTables(): Promise<void> {
  console.log('\n🔗 Migrating relationship tables...');

  // Map PostgreSQL IDs to Xata IDs
  const idMappings: Record<string, Record<string, string>> = {};

  // First, build ID mappings for all main tables
  for (const table of ['personnel', 'organizations', 'events', 'topics', 'documents', 'testimonies']) {
    console.log(`Building ID mapping for ${table}...`);
    
    const pgRecords = await pgPool.query(`SELECT id, ${table === 'organizations' ? 'title' : 'name'} as identifier FROM ${table}`);
    const xataRecords = await xata.db[table as keyof typeof xata.db].getAll();
    
    idMappings[table] = {};
    
    for (const pgRecord of pgRecords.rows) {
      const xataRecord = xataRecords.find(
        (r: any) => r[table === 'organizations' ? 'title' : 'name'] === pgRecord.identifier
      );
      
      if (xataRecord) {
        idMappings[table][pgRecord.id] = xataRecord.id;
      }
    }
  }

  // Migrate relationship tables
  const relationshipTables = [
    {
      name: 'organization-members',
      query: 'SELECT * FROM organization_members',
      transform: (row: any) => ({
        member: idMappings.personnel[row.member_id],
        organization: idMappings.organizations[row.organization_id]
      })
    },
    {
      name: 'event-subject-matter-experts',
      query: 'SELECT * FROM event_subject_matter_experts',
      transform: (row: any) => ({
        event: idMappings.events[row.event_id],
        'subject-matter-expert': idMappings.personnel[row.expert_id]
      })
    },
    {
      name: 'topic-subject-matter-experts',
      query: 'SELECT * FROM topic_subject_matter_experts',
      transform: (row: any) => ({
        topic: idMappings.topics[row.topic_id],
        'subject-matter-expert': idMappings.personnel[row.expert_id]
      })
    },
    {
      name: 'topics-testimonies',
      query: 'SELECT * FROM topics_testimonies',
      transform: (row: any) => ({
        topic: idMappings.topics[row.topic_id],
        testimony: idMappings.testimonies[row.testimony_id]
      })
    }
  ];

  for (const relTable of relationshipTables) {
    console.log(`\nMigrating ${relTable.name}...`);
    
    try {
      const { rows } = await pgPool.query(relTable.query);
      const batches = chunk(rows, config.batchSize);
      
      for (const batch of batches) {
        const records = batch
          .map(relTable.transform)
          .filter(r => Object.values(r).every(v => v)); // Filter out records with missing IDs
        
        if (records.length > 0) {
          await xata.db[relTable.name as keyof typeof xata.db].create(records as any);
        }
      }
      
      console.log(`✅ Migrated ${rows.length} relationships for ${relTable.name}`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${relTable.name}:`, error);
    }
  }
}

// Main migration orchestrator
async function migrate(): Promise<void> {
  console.log('🚀 Starting Xata migration...\n');
  console.log('Configuration:', {
    postgresDB: config.postgres.connectionString.split('@')[1]?.split('/')[1] || 'unknown',
    xataDB: config.xata.databaseURL?.split('/').pop() || 'unknown',
    batchSize: config.batchSize
  });

  try {
    // Test connections
    console.log('\n🔌 Testing connections...');
    await pgPool.query('SELECT 1');
    console.log('✅ PostgreSQL connection successful');
    
    await xata.db.personnel.getFirst();
    console.log('✅ Xata connection successful');

    // Migration order (respecting foreign key dependencies)
    const migrationOrder = [
      'personnel',
      'organizations', 
      'events',
      'topics',
      'documents',
      'testimonies',
      'artifacts',
      'locations',
      'sightings'
    ];

    // Migrate main tables
    for (const table of migrationOrder) {
      await migrateTable(table);
    }

    // Migrate relationship tables
    await migrateRelationshipTables();

    // Print final summary
    console.log('\n📋 Migration Summary:');
    console.log('====================');
    
    for (const [table, status] of Object.entries(migrationStatus)) {
      console.log(`\n${table}:`);
      console.log(`  Status: ${status.status}`);
      console.log(`  Total: ${status.totalRecords}`);
      console.log(`  Migrated: ${status.migratedRecords}`);
      console.log(`  Failed: ${status.failedRecords}`);
      
      if (status.errors.length > 0) {
        console.log(`  Errors: ${JSON.stringify(status.errors, null, 2)}`);
      }
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await pgPool.end();
    console.log('\n🏁 Migration process completed');
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate().catch(console.error);
}

export { migrate, migrateTable, migrationStatus };
