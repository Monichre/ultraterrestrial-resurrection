# Xata SQL Examples & Use Cases

## Table of Contents
1. [Basic CRUD Examples](#basic-crud-examples)
2. [Relationship Management](#relationship-management)
3. [Search & Analytics](#search--analytics)
4. [Vector Operations](#vector-operations)
5. [Performance Optimization](#performance-optimization)
6. [Error Handling](#error-handling)
7. [Real-World Scenarios](#real-world-scenarios)

## Basic CRUD Examples

### User Management System

#### Create User with Profile
```typescript
// HTTP API approach
async function createUserWithProfile(userData: UserData, profileData: ProfileData) {
  try {
    // Create user first
    const user = await xata.sql`
      INSERT INTO "users" (name, email, created_at)
      VALUES (${userData.name}, ${userData.email}, ${new Date()})
      RETURNING *
    `;
    
    // Create profile
    const profile = await xata.sql`
      INSERT INTO "profiles" (user_id, bio, avatar_url)
      VALUES (${user.records[0].id}, ${profileData.bio}, ${profileData.avatarUrl})
      RETURNING *
    `;
    
    return { user: user.records[0], profile: profile.records[0] };
  } catch (error) {
    console.error('Failed to create user with profile:', error);
    throw error;
  }
}

// Postgres Wire approach with transaction
async function createUserWithProfileTransaction(userData: UserData, profileData: ProfileData) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userResult = await client.query(
      'INSERT INTO users (name, email, created_at) VALUES ($1, $2, $3) RETURNING *',
      [userData.name, userData.email, new Date()]
    );
    
    const profileResult = await client.query(
      'INSERT INTO profiles (user_id, bio, avatar_url) VALUES ($1, $2, $3) RETURNING *',
      [userResult.rows[0].id, profileData.bio, profileData.avatarUrl]
    );
    
    await client.query('COMMIT');
    
    return {
      user: userResult.rows[0],
      profile: profileResult.rows[0]
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

#### Update User Preferences
```typescript
// HTTP API
async function updateUserPreferences(userId: string, preferences: UserPreferences) {
  const result = await xata.sql`
    UPDATE "users"
    SET 
      preferences = ${JSON.stringify(preferences)},
      updated_at = ${new Date()}
    WHERE id = ${userId}
    RETURNING id, name, preferences
  `;
  
  if (result.records.length === 0) {
    throw new Error('User not found');
  }
  
  return result.records[0];
}

// Postgres Wire with JSON operations
async function updateUserPreferencesAdvanced(userId: string, preferences: Partial<UserPreferences>) {
  const result = await client.query(`
    UPDATE users
    SET 
      preferences = COALESCE(preferences, '{}'::jsonb) || $2::jsonb,
      updated_at = $3
    WHERE id = $1
    RETURNING id, name, preferences
  `, [userId, JSON.stringify(preferences), new Date()]);
  
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  
  return result.rows[0];
}
```

## Relationship Management

### Document-Author Relationships
```typescript
// Get documents with author information
async function getDocumentsWithAuthors(limit = 10) {
  // HTTP API (limited join support)
  const documents = await xata.sql`
    SELECT 
      d.*,
      p.name as author_name,
      p.bio as author_bio
    FROM "documents" d
    LEFT JOIN "personnel" p ON d.author = p.id
    ORDER BY d.date DESC
    LIMIT ${limit}
  `;
  
  return documents.records;
}

// Postgres Wire (full join capabilities)
async function getDocumentsWithAuthorsAdvanced(filters: DocumentFilters) {
  const query = `
    SELECT 
      d.id,
      d.title,
      d.summary,
      d.date,
      d.processed,
      p.name as author_name,
      p.role as author_role,
      p.credibility as author_credibility,
      o.name as organization_name,
      o.specialization as org_specialization,
      COUNT(ud.id) as save_count
    FROM documents d
    LEFT JOIN personnel p ON d.author = p.id
    LEFT JOIN organizations o ON d.organization = o.id
    LEFT JOIN "user-saved-documents" ud ON d.id = ud.document
    WHERE 
      ($1::text IS NULL OR d.title ILIKE $1)
      AND ($2::date IS NULL OR d.date >= $2)
      AND ($3::boolean IS NULL OR d.processed = $3)
    GROUP BY d.id, p.id, o.id
    ORDER BY d.date DESC, save_count DESC
    LIMIT $4
  `;
  
  const result = await client.query(query, [
    filters.titleSearch ? `%${filters.titleSearch}%` : null,
    filters.dateFrom || null,
    filters.processedOnly || null,
    filters.limit || 10
  ]);
  
  return result.rows;
}
```

### Many-to-Many Relationships
```typescript
// Topic-Testimony relationships
async function linkTopicToTestimony(topicId: string, testimonyId: string) {
  // HTTP API
  const link = await xata.sql`
    INSERT INTO "topics-testimonies" (topic, testimony)
    VALUES (${topicId}, ${testimonyId})
    ON CONFLICT (topic, testimony) DO NOTHING
    RETURNING *
  `;
  
  return link.records[0];
}

// Get topics with related testimonies count
async function getTopicsWithTestimonyCounts() {
  // Postgres Wire
  const result = await client.query(`
    SELECT 
      t.id,
      t.title,
      t.summary,
      COUNT(tt.testimony) as testimony_count,
      ARRAY_AGG(
        DISTINCT jsonb_build_object(
          'id', test.id,
          'claim', LEFT(test.claim, 100),
          'witness_name', p.name
        )
      ) FILTER (WHERE test.id IS NOT NULL) as recent_testimonies
    FROM topics t
    LEFT JOIN "topics-testimonies" tt ON t.id = tt.topic
    LEFT JOIN testimonies test ON tt.testimony = test.id
    LEFT JOIN personnel p ON test.witness = p.id
    GROUP BY t.id, t.title, t.summary
    ORDER BY testimony_count DESC
    LIMIT 20
  `);
  
  return result.rows;
}
```

## Search & Analytics

### Full-Text Search Implementation
```typescript
// Search across multiple content fields
async function searchContent(searchTerm: string, options: SearchOptions = {}) {
  const { limit = 20, offset = 0, contentTypes = ['documents', 'testimonies', 'topics'] } = options;
  
  // Postgres Wire with advanced text search
  const searchQuery = `
    WITH search_results AS (
      SELECT 
        'document' as content_type,
        id,
        title,
        summary as content,
        ts_rank(
          to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '')), 
          to_tsquery('english', $1)
        ) as rank,
        date as created_date
      FROM documents
      WHERE to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '')) 
            @@ to_tsquery('english', $1)
      
      UNION ALL
      
      SELECT 
        'testimony' as content_type,
        id,
        LEFT(claim, 100) as title,
        claim as content,
        ts_rank(to_tsvector('english', claim), to_tsquery('english', $1)) as rank,
        date as created_date
      FROM testimonies
      WHERE to_tsvector('english', claim) @@ to_tsquery('english', $1)
      
      UNION ALL
      
      SELECT 
        'topic' as content_type,
        id,
        title,
        summary as content,
        ts_rank(
          to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '')), 
          to_tsquery('english', $1)
        ) as rank,
        NULL as created_date
      FROM topics
      WHERE to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '')) 
            @@ to_tsquery('english', $1)
    )
    SELECT *
    FROM search_results
    WHERE content_type = ANY($2::text[])
    ORDER BY rank DESC, created_date DESC NULLS LAST
    LIMIT $3 OFFSET $4
  `;
  
  const result = await client.query(searchQuery, [
    searchTerm,
    contentTypes,
    limit,
    offset
  ]);
  
  return {
    results: result.rows,
    totalCount: result.rowCount
  };
}
```

### Analytics Queries
```typescript
// User engagement analytics
async function getUserEngagementAnalytics(timeframe: 'week' | 'month' | 'year' = 'month') {
  const timeCondition = {
    week: "created_at >= NOW() - INTERVAL '7 days'",
    month: "created_at >= NOW() - INTERVAL '30 days'",
    year: "created_at >= NOW() - INTERVAL '365 days'"
  }[timeframe];
  
  const query = `
    WITH user_activity AS (
      SELECT 
        u.id as user_id,
        u.name,
        u.email,
        COUNT(DISTINCT use.id) as saved_events,
        COUNT(DISTINCT ust.id) as saved_topics,
        COUNT(DISTINCT usd.id) as saved_documents,
        COUNT(DISTINCT un.id) as created_notes
      FROM users u
      LEFT JOIN "user-saved-events" use ON u.id = use.user
      LEFT JOIN "user-saved-topics" ust ON u.id = ust.user  
      LEFT JOIN "user-saved-documents" usd ON u.id = usd.user
      LEFT JOIN "user-notes" un ON u.id = un.user
      WHERE ${timeCondition}
      GROUP BY u.id, u.name, u.email
    ),
    engagement_scores AS (
      SELECT 
        *,
        (saved_events * 2 + saved_topics + saved_documents + created_notes * 3) as engagement_score
      FROM user_activity
    )
    SELECT 
      *,
      RANK() OVER (ORDER BY engagement_score DESC) as engagement_rank,
      CASE 
        WHEN engagement_score > 50 THEN 'High'
        WHEN engagement_score > 20 THEN 'Medium'
        ELSE 'Low'
      END as engagement_level
    FROM engagement_scores
    ORDER BY engagement_score DESC
  `;
  
  const result = await client.query(query);
  return result.rows;
}
```

## Vector Operations

### Semantic Search
```typescript
// Find similar documents using vector embeddings
async function findSimilarDocuments(documentId: string, limit = 5) {
  // First get the embedding of the source document
  const sourceDoc = await client.query(
    'SELECT embedding FROM documents WHERE id = $1',
    [documentId]
  );
  
  if (sourceDoc.rows.length === 0) {
    throw new Error('Document not found');
  }
  
  const sourceEmbedding = sourceDoc.rows[0].embedding;
  
  // Find similar documents using vector similarity
  const similarDocs = await client.query(`
    SELECT 
      id,
      title,
      summary,
      (embedding <-> $1::vector) as distance,
      1 - (embedding <-> $1::vector) as similarity
    FROM documents
    WHERE id != $2 AND embedding IS NOT NULL
    ORDER BY embedding <-> $1::vector
    LIMIT $3
  `, [sourceEmbedding, documentId, limit]);
  
  return similarDocs.rows;
}

// Hybrid search combining text and vector similarity
async function hybridSearch(query: string, queryEmbedding: number[], options: HybridSearchOptions = {}) {
  const { limit = 10, textWeight = 0.3, vectorWeight = 0.7 } = options;
  
  const searchQuery = `
    WITH text_scores AS (
      SELECT 
        id,
        title,
        summary,
        ts_rank(
          to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '')), 
          to_tsquery('english', $1)
        ) as text_score
      FROM documents
      WHERE to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '')) 
            @@ to_tsquery('english', $1)
    ),
    vector_scores AS (
      SELECT 
        id,
        title,
        summary,
        1 - (embedding <-> $2::vector) as vector_score
      FROM documents
      WHERE embedding IS NOT NULL
    )
    SELECT 
      COALESCE(t.id, v.id) as id,
      COALESCE(t.title, v.title) as title,
      COALESCE(t.summary, v.summary) as summary,
      COALESCE(t.text_score, 0) as text_score,
      COALESCE(v.vector_score, 0) as vector_score,
      (COALESCE(t.text_score, 0) * $3 + COALESCE(v.vector_score, 0) * $4) as combined_score
    FROM text_scores t
    FULL OUTER JOIN vector_scores v ON t.id = v.id
    ORDER BY combined_score DESC
    LIMIT $5
  `;
  
  const result = await client.query(searchQuery, [
    query,
    queryEmbedding,
    textWeight,
    vectorWeight,
    limit
  ]);
  
  return result.rows;
}
```

## Performance Optimization

### Batch Operations
```typescript
// Efficient bulk insert with conflict handling
async function bulkInsertDocuments(documents: DocumentData[]) {
  const batchSize = 100;
  const results = [];
  
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    
    // Create values string for batch insert  
    const values = batch.map((_, index) => {
      const offset = index * 6; // 6 columns per document
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
    }).join(', ');
    
    // Flatten parameters
    const params = batch.flatMap(doc => [
      doc.title,
      doc.summary,
      doc.date,
      doc.author,
      doc.organization,
      doc.processed || false
    ]);
    
    const query = `
      INSERT INTO documents (title, summary, date, author, organization, processed)
      VALUES ${values}
      ON CONFLICT (title) DO UPDATE SET
        summary = EXCLUDED.summary,
        date = EXCLUDED.date,
        processed = EXCLUDED.processed
      RETURNING id, title
    `;
    
    const result = await client.query(query, params);
    results.push(...result.rows);
  }
  
  return results;
}

// Efficient pagination with cursor
async function getPaginatedDocuments(cursor?: string, limit = 20) {
  const query = cursor
    ? `SELECT * FROM documents WHERE id > $1 ORDER BY id LIMIT $2`
    : `SELECT * FROM documents ORDER BY id LIMIT $1`;
  
  const params = cursor ? [cursor, limit] : [limit];
  const result = await client.query(query, params);
  
  return {
    documents: result.rows,
    nextCursor: result.rows.length === limit ? result.rows[limit - 1].id : null,
    hasMore: result.rows.length === limit
  };
}
```

### Query Optimization
```typescript
// Analyze and optimize slow queries
async function analyzeQueryPerformance(query: string, params: any[]) {
  // Get query plan
  const explainResult = await client.query(
    `EXPLAIN (ANALYZE, BUFFERS, COSTS, VERBOSE) ${query}`,
    params
  );
  
  // Parse execution time and identify bottlenecks
  const plan = explainResult.rows.map(row => row['QUERY PLAN']).join('\n');
  
  // Extract execution time
  const executionTimeMatch = plan.match(/Execution Time: ([\d.]+) ms/);
  const executionTime = executionTimeMatch ? parseFloat(executionTimeMatch[1]) : null;
  
  // Check for expensive operations
  const expensiveOperations = [
    'Seq Scan',
    'Sort',
    'Hash Join',
    'Nested Loop'
  ].filter(op => plan.includes(op));
  
  return {
    executionTime,
    plan,
    expensiveOperations,
    recommendations: generateOptimizationRecommendations(plan)
  };
}

function generateOptimizationRecommendations(plan: string): string[] {
  const recommendations = [];
  
  if (plan.includes('Seq Scan')) {
    recommendations.push('Consider adding indexes for sequential scans');
  }
  
  if (plan.includes('Sort')) {
    recommendations.push('Consider adding ORDER BY columns to index');
  }
  
  if (plan.includes('Hash Join') && plan.includes('cost=')) {
    recommendations.push('Review join conditions and consider index optimization');
  }
  
  return recommendations;
}
```

## Error Handling

### Comprehensive Error Management
```typescript
class XataError extends Error {
  constructor(
    message: string,
    public code: string,
    public query?: string,
    public params?: any[],
    public originalError?: Error
  ) {
    super(message);
    this.name = 'XataError';
  }
}

async function executeQueryWithErrorHandling(query: string, params: any[] = []) {
  try {
    return await client.query(query, params);
  } catch (error) {
    const pgError = error as any;
    
    // Map PostgreSQL error codes to user-friendly messages
    const errorMapping: Record<string, string> = {
      '23505': 'Duplicate record found',
      '23503': 'Referenced record does not exist',
      '42P01': 'Table does not exist',
      '42703': 'Column does not exist',
      '08006': 'Connection failure',
      '57014': 'Query timeout'
    };
    
    const userMessage = errorMapping[pgError.code] || 'Database operation failed';
    
    throw new XataError(
      userMessage,
      pgError.code,
      query,
      params,
      error
    );
  }
}

// Retry mechanism for transient failures
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on permanent errors
      if (error instanceof XataError && 
          ['23505', '23503', '42P01', '42703'].includes(error.code)) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
```

## Real-World Scenarios

### Content Management System
```typescript
// Complete content workflow
class ContentManagementService {
  async createArticle(articleData: ArticleData, authorId: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create the article
      const articleResult = await client.query(`
        INSERT INTO documents (title, summary, author, date, processed)
        VALUES ($1, $2, $3, $4, false)
        RETURNING *
      `, [articleData.title, articleData.content, authorId, new Date()]);
      
      const article = articleResult.rows[0];
      
      // Link to topics
      if (articleData.topicIds?.length) {
        const topicLinks = articleData.topicIds.map((_, index) => 
          `($1, $${index + 2})`
        ).join(', ');
        
        await client.query(`
          INSERT INTO "topics-documents" (document, topic)
          VALUES ${topicLinks}
        `, [article.id, ...articleData.topicIds]);
      }
      
      // Generate embedding if content provided
      if (articleData.content) {
        const embedding = await generateEmbedding(articleData.content);
        await client.query(
          'UPDATE documents SET embedding = $1 WHERE id = $2',
          [embedding, article.id]
        );
      }
      
      await client.query('COMMIT');
      return article;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  async getArticleWithMetadata(articleId: string) {
    const result = await client.query(`
      SELECT 
        d.*,
        p.name as author_name,
        p.role as author_role,
        ARRAY_AGG(
          DISTINCT jsonb_build_object(
            'id', t.id,
            'title', t.title
          )
        ) FILTER (WHERE t.id IS NOT NULL) as topics,
        COUNT(DISTINCT usd.id) as save_count,
        AVG(ur.rating) as avg_rating
      FROM documents d
      LEFT JOIN personnel p ON d.author = p.id
      LEFT JOIN "topics-documents" td ON d.id = td.document
      LEFT JOIN topics t ON td.topic = t.id
      LEFT JOIN "user-saved-documents" usd ON d.id = usd.document
      LEFT JOIN user_ratings ur ON d.id = ur.document_id
      WHERE d.id = $1
      GROUP BY d.id, p.id
    `, [articleId]);
    
    return result.rows[0];
  }
}

// Generate embedding placeholder
async function generateEmbedding(text: string): Promise<number[]> {
  // This would integrate with your embedding service
  // For example: OpenAI, Cohere, or local model
  return new Array(1536).fill(0).map(() => Math.random());
}
```

### Analytics Dashboard
```typescript
// Dashboard metrics service
class AnalyticsDashboardService {
  async getDashboardMetrics(timeRange: string) {
    const timeCondition = this.getTimeCondition(timeRange);
    
    const metricsQuery = `
      SELECT 
        'total_documents' as metric, COUNT(*)::text as value
      FROM documents 
      WHERE ${timeCondition}
      
      UNION ALL
      
      SELECT 
        'total_users' as metric, COUNT(*)::text as value
      FROM users 
      WHERE ${timeCondition}
      
      UNION ALL
      
      SELECT 
        'avg_documents_per_user' as metric, 
        ROUND(COUNT(usd.id)::numeric / NULLIF(COUNT(DISTINCT usd.user), 0), 2)::text as value
      FROM "user-saved-documents" usd
      WHERE ${timeCondition}
      
      UNION ALL
      
      SELECT 
        'most_active_topic' as metric,
        t.title as value
      FROM topics t
      JOIN "topics-testimonies" tt ON t.id = tt.topic
      JOIN testimonies test ON tt.testimony = test.id
      WHERE test.date >= NOW() - INTERVAL '30 days'
      GROUP BY t.id, t.title
      ORDER BY COUNT(test.id) DESC
      LIMIT 1
    `;
    
    const result = await client.query(metricsQuery);
    
    // Convert to key-value object
    return result.rows.reduce((acc, row) => {
      acc[row.metric] = row.value;
      return acc;
    }, {} as Record<string, string>);
  }
  
  private getTimeCondition(timeRange: string): string {
    const conditions = {
      '7d': "created_at >= NOW() - INTERVAL '7 days'",
      '30d': "created_at >= NOW() - INTERVAL '30 days'",
      '90d': "created_at >= NOW() - INTERVAL '90 days'",
      '1y': "created_at >= NOW() - INTERVAL '1 year'"
    };
    
    return conditions[timeRange as keyof typeof conditions] || conditions['30d'];
  }
}
```

---

These examples demonstrate practical implementations of Xata SQL operations, showing both HTTP API and Postgres Wire approaches where applicable. Each example includes error handling, performance considerations, and real-world usage patterns. 