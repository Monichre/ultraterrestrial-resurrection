/**
 * Ultraterrestrial PostgreSQL + pgvector TypeScript Connector
 * Complete TypeScript interface for UFO research database operations
 */

import { Pool, PoolClient, QueryResult } from 'pg';

export interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
}

export interface SearchResult {
  id: string;
  entityType: string;
  title: string;
  content: string;
  similarityScore: number;
  metadata: Record<string, any>;
}

export interface AnalyticsResult {
  queryName: string;
  data: Record<string, any>[];
  totalCount: number;
  generatedAt: Date;
}

export interface EntityCooccurrence {
  entityType1: string;
  entity1: string;
  entityType2: string;
  entity2: string;
  cooccurrenceCount: number;
  sharedDocuments: number;
  avgConfidence: number;
}

export interface PersonnelInfluence {
  id: string;
  name: string;
  credibility: number;
  authority: number;
  authoredDocuments: number;
  testimoniesGiven: number;
  organizationMemberships: number;
  topicExpertises: number;
  influenceScore: number;
}

export interface UAP_Hotspot {
  location: string;
  sightingCount: number;
  eventCount: number;
  avgLatitude: number;
  avgLongitude: number;
  mostCommonShape: string;
}

export interface DocumentQuality {
  id: string;
  title: string;
  qualityScore: number;
  entityCount: number;
  entityTypeDiversity: number;
  avgEntityConfidence: number;
  authorCredibility: number;
}

export interface DisclosureTimeline {
  year: Date;
  documentCount: number;
  eventCount: number;
  testimonyCount: number;
  sightingCount: number;
  avgSourceCredibility: number;
}

export class UltraterrestrialDB {
  private pool: Pool;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig = {}) {
    this.config = {
      connectionString: config.connectionString || process.env.DATABASE_URL,
      host: config.host || process.env.POSTGRES_HOST || 'localhost',
      port: config.port || parseInt(process.env.POSTGRES_PORT || '5432'),
      database: config.database || process.env.POSTGRES_DB || 'ultraterrestrial',
      user: config.user || process.env.POSTGRES_USER || 'postgres',
      password: config.password || process.env.POSTGRES_PASSWORD || 'postgres',
      ssl: config.ssl || process.env.NODE_ENV === 'production',
      ...config
    };

    this.pool = new Pool(this.config.connectionString ? 
      { connectionString: this.config.connectionString } : 
      this.config
    );
  }

  /**
   * Test database connection and verify pgvector extension
   */
  async connect(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      
      // Verify pgvector extension
      const result = await client.query(
        "SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector')"
      );
      
      const hasPgVector = result.rows[0].exists;
      
      client.release();
      
      console.log('🐘 Connected to Ultraterrestrial database');
      if (hasPgVector) {
        console.log('✅ pgvector extension verified');
      } else {
        console.warn('⚠️ pgvector extension not found');
      }
      
      return hasPgVector;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Close database connection pool
   */
  async close(): Promise<void> {
    await this.pool.end();
    console.log('🔌 Database connection closed');
  }

  /**
   * Execute semantic search using vector similarity
   */
  async semanticSearch(
    query: string,
    tableName: string = 'documents',
    queryEmbedding: number[],
    limit: number = 10,
    similarityThreshold: number = 0.5
  ): Promise<SearchResult[]> {
    const contentExpressions: Record<string, string> = {
      documents: "COALESCE(title, '') || ' ' || COALESCE(summary, '')",
      personnel: "COALESCE(name, '') || ' ' || COALESCE(bio, '')",
      events: "COALESCE(title, '') || ' ' || COALESCE(description, '')",
      topics: "COALESCE(title, '') || ' ' || COALESCE(summary, '')",
      testimonies: "COALESCE(summary, '') || ' ' || COALESCE(claim, '')",
      artifacts: "COALESCE(name, '') || ' ' || COALESCE(description, '')"
    };

    const contentExpr = contentExpressions[tableName] || "COALESCE(title, name, '')";
    const titleExpr = tableName === 'personnel' ? 'name' : 'title';

    const sql = `
      SELECT 
        id,
        ${titleExpr} as title,
        ${contentExpr} as content,
        1 - (embedding <=> $1::vector) as similarity_score
      FROM ${tableName}
      WHERE embedding IS NOT NULL
      AND 1 - (embedding <=> $1::vector) > $2
      ORDER BY embedding <=> $1::vector
      LIMIT $3
    `;

    try {
      const result = await this.pool.query(sql, [
        JSON.stringify(queryEmbedding),
        similarityThreshold,
        limit
      ]);

      return result.rows.map(row => ({
        id: row.id,
        entityType: tableName,
        title: row.title || '',
        content: row.content || '',
        similarityScore: parseFloat(row.similarity_score),
        metadata: {}
      }));
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      return [];
    }
  }

  /**
   * Execute hybrid search combining semantic and keyword search
   */
  async hybridSearch(
    query: string,
    queryEmbedding: number[],
    tableName: string = 'documents',
    limit: number = 10,
    semanticWeight: number = 0.7,
    keywordWeight: number = 0.3
  ): Promise<SearchResult[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM hybrid_search($1, $2, $3, $4, $5, $6)',
        [query, JSON.stringify(queryEmbedding), tableName, limit, semanticWeight, keywordWeight]
      );

      return result.rows.map(row => ({
        id: row.id,
        entityType: tableName,
        title: row.title || '',
        content: row.content_preview || '',
        similarityScore: parseFloat(row.hybrid_score),
        metadata: {
          semanticScore: parseFloat(row.semantic_score),
          keywordScore: parseFloat(row.keyword_score)
        }
      }));
    } catch (error) {
      console.error('❌ Hybrid search failed:', error);
      // Fallback to keyword search
      return this.keywordSearch(query, tableName, limit);
    }
  }

  /**
   * Execute full-text keyword search
   */
  async keywordSearch(
    query: string,
    tableName: string = 'documents',
    limit: number = 10
  ): Promise<SearchResult[]> {
    const contentColumns: Record<string, string> = {
      documents: "COALESCE(title, '') || ' ' || COALESCE(summary, '')",
      personnel: "COALESCE(name, '') || ' ' || COALESCE(bio, '')",
      events: "COALESCE(title, '') || ' ' || COALESCE(description, '')",
      topics: "COALESCE(title, '') || ' ' || COALESCE(summary, '')",
      testimonies: "COALESCE(summary, '') || ' ' || COALESCE(claim, '')"
    };

    const contentExpr = contentColumns[tableName] || "COALESCE(title, name, '')";
    const titleExpr = tableName === 'personnel' ? 'name' : 'title';

    const sql = `
      SELECT 
        id,
        ${titleExpr} as title,
        ${contentExpr} as content,
        ts_rank(to_tsvector('english', ${contentExpr}), plainto_tsquery('english', $1)) as score
      FROM ${tableName}
      WHERE to_tsvector('english', ${contentExpr}) @@ plainto_tsquery('english', $1)
      ORDER BY score DESC
      LIMIT $2
    `;

    try {
      const result = await this.pool.query(sql, [query, limit]);

      return result.rows.map(row => ({
        id: row.id,
        entityType: tableName,
        title: row.title || '',
        content: row.content || '',
        similarityScore: parseFloat(row.score),
        metadata: { searchType: 'keyword' }
      }));
    } catch (error) {
      console.error('❌ Keyword search failed:', error);
      return [];
    }
  }

  /**
   * Get entity co-occurrence analysis
   */
  async getEntityCooccurrence(
    entityName?: string,
    limit: number = 20
  ): Promise<AnalyticsResult> {
    let sql: string;
    let params: any[];

    if (entityName) {
      sql = `
        SELECT * FROM entity_cooccurrence
        WHERE entity1 ILIKE $1 OR entity2 ILIKE $1
        ORDER BY cooccurrence_count DESC
        LIMIT $2
      `;
      params = [`%${entityName}%`, limit];
    } else {
      sql = `
        SELECT * FROM entity_cooccurrence
        ORDER BY cooccurrence_count DESC
        LIMIT $1
      `;
      params = [limit];
    }

    try {
      const result = await this.pool.query(sql, params);
      
      return {
        queryName: 'entity_cooccurrence',
        data: result.rows,
        totalCount: result.rows.length,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('❌ Entity co-occurrence query failed:', error);
      return {
        queryName: 'entity_cooccurrence',
        data: [],
        totalCount: 0,
        generatedAt: new Date()
      };
    }
  }

  /**
   * Get personnel influence ranking
   */
  async getPersonnelInfluence(limit: number = 20): Promise<PersonnelInfluence[]> {
    const sql = `
      SELECT * FROM personnel_influence
      ORDER BY influence_score DESC
      LIMIT $1
    `;

    try {
      const result = await this.pool.query(sql, [limit]);
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        credibility: row.credibility || 0,
        authority: row.authority || 0,
        authoredDocuments: row.authored_documents || 0,
        testimoniesGiven: row.testimonies_given || 0,
        organizationMemberships: row.organization_memberships || 0,
        topicExpertises: row.topic_expertises || 0,
        influenceScore: parseFloat(row.influence_score) || 0
      }));
    } catch (error) {
      console.error('❌ Personnel influence query failed:', error);
      return [];
    }
  }

  /**
   * Get temporal disclosure analysis
   */
  async getDisclosureTimeline(): Promise<DisclosureTimeline[]> {
    const sql = 'SELECT * FROM disclosure_timeline ORDER BY year';

    try {
      const result = await this.pool.query(sql);
      return result.rows.map(row => ({
        year: new Date(row.year),
        documentCount: row.document_count || 0,
        eventCount: row.event_count || 0,
        testimonyCount: row.testimony_count || 0,
        sightingCount: row.sighting_count || 0,
        avgSourceCredibility: parseFloat(row.avg_source_credibility) || 0
      }));
    } catch (error) {
      console.error('❌ Disclosure timeline query failed:', error);
      return [];
    }
  }

  /**
   * Get geographic UAP hotspots
   */
  async getUAPHotspots(limit: number = 20): Promise<UAP_Hotspot[]> {
    const sql = `
      SELECT * FROM uap_hotspots
      ORDER BY sighting_count + event_count DESC
      LIMIT $1
    `;

    try {
      const result = await this.pool.query(sql, [limit]);
      return result.rows.map(row => ({
        location: row.location,
        sightingCount: row.sighting_count || 0,
        eventCount: row.event_count || 0,
        avgLatitude: parseFloat(row.avg_latitude) || 0,
        avgLongitude: parseFloat(row.avg_longitude) || 0,
        mostCommonShape: row.most_common_shape || 'unknown'
      }));
    } catch (error) {
      console.error('❌ UAP hotspots query failed:', error);
      return [];
    }
  }

  /**
   * Get document quality analysis
   */
  async getDocumentQuality(limit: number = 20): Promise<DocumentQuality[]> {
    const sql = `
      SELECT * FROM document_quality
      WHERE processed = true
      ORDER BY quality_score DESC
      LIMIT $1
    `;

    try {
      const result = await this.pool.query(sql, [limit]);
      return result.rows.map(row => ({
        id: row.id,
        title: row.title || '',
        qualityScore: parseFloat(row.quality_score) || 0,
        entityCount: row.entity_count || 0,
        entityTypeDiversity: row.entity_type_diversity || 0,
        avgEntityConfidence: parseFloat(row.avg_entity_confidence) || 0,
        authorCredibility: row.author_credibility || 0
      }));
    } catch (error) {
      console.error('❌ Document quality query failed:', error);
      return [];
    }
  }

  /**
   * Find entities similar to a specific entity
   */
  async findSimilarEntities(
    entityId: string,
    entityType: string = 'documents',
    limit: number = 10
  ): Promise<SearchResult[]> {
    try {
      // Get the entity's embedding
      const embeddingResult = await this.pool.query(
        `SELECT embedding FROM ${entityType} WHERE id = $1`,
        [entityId]
      );

      if (embeddingResult.rows.length === 0) {
        return [];
      }

      const embedding = embeddingResult.rows[0].embedding;

      // Find similar entities across all tables
      const result = await this.pool.query(
        'SELECT * FROM find_similar_entities($1, 0.6, $2)',
        [embedding, limit]
      );

      return result.rows.map(row => ({
        id: row.entity_id,
        entityType: row.entity_type,
        title: row.entity_name,
        content: '',
        similarityScore: parseFloat(row.similarity_score),
        metadata: { sourceEntity: entityId }
      }));
    } catch (error) {
      console.error('❌ Similar entities query failed:', error);
      return [];
    }
  }

  /**
   * Get comprehensive database statistics
   */
  async getDatabaseStats(): Promise<Record<string, any>> {
    const tables = ['personnel', 'organizations', 'events', 'topics', 'documents', 
                   'testimonies', 'sightings', 'artifacts'];
    const stats: Record<string, any> = {};

    try {
      // Table counts
      for (const table of tables) {
        const result = await this.pool.query(`SELECT COUNT(*) FROM ${table}`);
        stats[`${table}_count`] = parseInt(result.rows[0].count);
      }

      // Embedding coverage
      const embeddingTables = ['personnel', 'documents', 'events', 'topics', 'testimonies'];
      for (const table of embeddingTables) {
        const totalResult = await this.pool.query(`SELECT COUNT(*) FROM ${table}`);
        const embeddingResult = await this.pool.query(
          `SELECT COUNT(*) FROM ${table} WHERE embedding IS NOT NULL`
        );
        
        const total = parseInt(totalResult.rows[0].count);
        const withEmbeddings = parseInt(embeddingResult.rows[0].count);
        
        stats[`${table}_embedding_coverage`] = total > 0 ? `${withEmbeddings}/${total}` : '0/0';
      }

      // Recent activity
      const recentResult = await this.pool.query(`
        SELECT COUNT(*) FROM documents 
        WHERE created_at > NOW() - INTERVAL '30 days'
      `);
      stats.recent_documents = parseInt(recentResult.rows[0].count);

      const processedResult = await this.pool.query(`
        SELECT COUNT(*) FROM documents WHERE processed = true
      `);
      stats.processed_documents = parseInt(processedResult.rows[0].count);

      return stats;
    } catch (error) {
      console.error('❌ Database stats query failed:', error);
      return {};
    }
  }

  /**
   * Execute custom SQL query with parameters
   */
  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    try {
      return await this.pool.query(sql, params);
    } catch (error) {
      console.error('❌ Custom query failed:', error);
      throw error;
    }
  }

  /**
   * Get a database client for transactions
   */
  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }
}

/**
 * Utility function to create database instance with environment variables
 */
export function createUltraterrestrialDB(config?: DatabaseConfig): UltraterrestrialDB {
  return new UltraterrestrialDB(config);
}

/**
 * Generate embedding using OpenAI (client-side)
 * Note: This requires OpenAI API key and should typically be done server-side
 */
export async function generateEmbedding(
  text: string,
  apiKey: string,
  model: string = 'text-embedding-3-small'
): Promise<number[] | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: model
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('❌ Embedding generation failed:', error);
    return null;
  }
}

/**
 * Example usage and demo
 */
export async function demoUltraterrestrialDB(): Promise<void> {
  const db = createUltraterrestrialDB();
  
  try {
    console.log('🔌 Connecting to database...');
    await db.connect();

    console.log('\n📊 Getting database statistics...');
    const stats = await db.getDatabaseStats();
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`  • ${key}: ${value}`);
    });

    console.log('\n🔍 Testing keyword search...');
    const searchResults = await db.keywordSearch('underwater UAP navy', 'documents', 5);
    searchResults.forEach(result => {
      console.log(`  • ${result.title} (score: ${result.similarityScore.toFixed(3)})`);
    });

    console.log('\n👥 Getting personnel influence...');
    const influence = await db.getPersonnelInfluence(5);
    influence.forEach(person => {
      console.log(`  • ${person.name}: ${person.influenceScore.toFixed(1)}`);
    });

    console.log('\n🌍 Getting UAP hotspots...');
    const hotspots = await db.getUAPHotspots(5);
    hotspots.forEach(spot => {
      console.log(`  • ${spot.location}: ${spot.sightingCount} sightings`);
    });

  } catch (error) {
    console.error('Demo failed:', error);
  } finally {
    await db.close();
  }
}

// Export types for external use
export type {
  DatabaseConfig,
  SearchResult,
  AnalyticsResult,
  EntityCooccurrence,
  PersonnelInfluence,
  UAP_Hotspot,
  DocumentQuality,
  DisclosureTimeline
};