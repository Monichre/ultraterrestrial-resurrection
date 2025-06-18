# Xata SQL Methods Documentation

## Table of Contents
1. [Overview](#overview)
2. [Connection Methods](#connection-methods)
3. [Core SQL Methods](#core-sql-methods)
4. [CRUD Operations](#crud-operations)
5. [Advanced Features](#advanced-features)
6. [Performance & Optimization](#performance--optimization)
7. [Integration Patterns](#integration-patterns)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)
10. [Examples & Use Cases](#examples--use-cases)

## Overview

Xata provides SQL capabilities through two distinct approaches:

### 1. Xata Lite (HTTP API)
- **Protocol**: HTTP/HTTPS REST API
- **SQL Support**: Limited subset of SQL commands
- **Use Case**: Simple queries, built-in search features
- **Limitations**: No complex joins, limited transaction support

### 2. Xata Postgres Wire Protocol
- **Protocol**: PostgreSQL wire protocol
- **SQL Support**: Full PostgreSQL compatibility
- **Use Case**: Complex queries, advanced analytics, migrations
- **Benefits**: Complete SQL feature set, performance monitoring

## Connection Methods

### HTTP API Connection
```typescript
import { XataApiClient } from '@xata.io/client';

const xata = new XataApiClient({
  apiKey: 'xau_your_api_key_here',
  databaseURL: 'https://workspace-database.region.xata.sh',
  branch: 'main'
});

// Execute SQL via HTTP
const result = await xata.sql`SELECT * FROM "users" WHERE email = ${email}`;
```

### Postgres Wire Connection
```typescript
import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://user:password@workspace.region.sql.xata.sh/database:branch?sslmode=require'
});

await client.connect();
const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
```

## Core SQL Methods

### 1. Query Execution

#### HTTP API Method
```typescript
interface XataHttpSqlOptions {
  consistency?: 'strong' | 'eventual';
  timeout?: number;
}

// Template literal syntax (recommended)
const users = await xata.sql<UserRecord>`
  SELECT * FROM "users" 
  WHERE created_at > ${startDate}
  ORDER BY created_at DESC
  LIMIT 10
`;

// Object syntax
const result = await xata.sql({
  statement: 'SELECT * FROM "users" WHERE email = $1',
  params: [email],
  consistency: 'eventual'
});
```

#### Postgres Wire Method
```typescript
// Standard pg client
const result = await client.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// With prepared statements
const statement = {
  name: 'get-user-by-email',
  text: 'SELECT * FROM users WHERE email = $1'
};
const result = await client.query(statement, [email]);
```

### 2. Parameter Binding

#### HTTP API
```typescript
// Safe parameter binding
const searchTerm = "John Doe";
const users = await xata.sql`
  SELECT * FROM "users" 
  WHERE name ILIKE ${`%${searchTerm}%`}
`;

// Multiple parameters
const result = await xata.sql`
  SELECT * FROM "events" 
  WHERE date BETWEEN ${startDate} AND ${endDate}
  AND location = ${location}
`;
```

#### Postgres Wire
```typescript
// Positional parameters
const result = await client.query(
  'SELECT * FROM users WHERE name ILIKE $1 AND age > $2',
  [`%${searchTerm}%`, minAge]
);

// Named parameters (using pg-format)
import format from 'pg-format';
const query = format(
  'SELECT * FROM %I WHERE %I = %L',
  tableName, columnName, value
);
```

## CRUD Operations

### SELECT Operations

#### Basic Queries
```typescript
// HTTP API
const allUsers = await xata.sql`SELECT * FROM "users"`;
const specificUser = await xata.sql`SELECT * FROM "users" WHERE id = ${userId}`;

// Postgres Wire
const allUsers = await client.query('SELECT * FROM users');
const specificUser = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
```

#### Complex Queries with Joins
```typescript
// HTTP API (limited join support)
const userWithProfile = await xata.sql`
  SELECT u.*, p.bio, p.avatar_url
  FROM "users" u
  LEFT JOIN "profiles" p ON u.id = p.user_id
  WHERE u.id = ${userId}
`;

// Postgres Wire (full join support)
const complexQuery = await client.query(`
  SELECT 
    u.id, u.name, u.email,
    p.bio, p.avatar_url,
    COUNT(d.id) as document_count
  FROM users u
  LEFT JOIN profiles p ON u.id = p.user_id
  LEFT JOIN documents d ON u.id = d.author_id
  WHERE u.active = $1
  GROUP BY u.id, p.bio, p.avatar_url
  ORDER BY document_count DESC
  LIMIT $2
`, [true, 10]);
```

### INSERT Operations

#### Single Record
```typescript
// HTTP API
const newUser = await xata.sql`
  INSERT INTO "users" (name, email, created_at)
  VALUES (${name}, ${email}, ${new Date()})
  RETURNING *
`;

// Postgres Wire
const newUser = await client.query(
  'INSERT INTO users (name, email, created_at) VALUES ($1, $2, $3) RETURNING *',
  [name, email, new Date()]
);
```

#### Bulk Insert
```typescript
// HTTP API (limited batch support)
const users = [
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' }
];

for (const user of users) {
  await xata.sql`
    INSERT INTO "users" (name, email)
    VALUES (${user.name}, ${user.email})
  `;
}

// Postgres Wire (efficient bulk insert)
const insertQuery = `
  INSERT INTO users (name, email)
  VALUES ($1, $2), ($3, $4)
  RETURNING *
`;
const result = await client.query(insertQuery, [
  users[0].name, users[0].email,
  users[1].name, users[1].email
]);
```

### UPDATE Operations

#### Single Record Update
```typescript
// HTTP API
const updatedUser = await xata.sql`
  UPDATE "users" 
  SET name = ${newName}, updated_at = ${new Date()}
  WHERE id = ${userId}
  RETURNING *
`;

// Postgres Wire
const updatedUser = await client.query(
  'UPDATE users SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *',
  [newName, new Date(), userId]
);
```

#### Conditional Updates
```typescript
// HTTP API
const result = await xata.sql`
  UPDATE "users"
  SET last_login = ${new Date()}
  WHERE email = ${email} AND active = true
  RETURNING id, name, last_login
`;

// Postgres Wire with transaction
await client.query('BEGIN');
try {
  const result = await client.query(
    'UPDATE users SET last_login = $1 WHERE email = $2 AND active = true RETURNING *',
    [new Date(), email]
  );
  
  if (result.rows.length === 0) {
    throw new Error('User not found or inactive');
  }
  
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
}
```

### DELETE Operations

#### Safe Deletion with Conditions
```typescript
// HTTP API
const deletedUser = await xata.sql`
  DELETE FROM "users"
  WHERE id = ${userId} AND active = false
  RETURNING id, name
`;

// Postgres Wire
const deletedUser = await client.query(
  'DELETE FROM users WHERE id = $1 AND active = false RETURNING id, name',
  [userId]
);
```

## Advanced Features

### Vector Search
```typescript
// HTTP API (if vector search is enabled)
const similarDocuments = await xata.sql`
  SELECT *, vector_similarity(embedding, ${queryEmbedding}) as similarity
  FROM "documents"
  ORDER BY similarity DESC
  LIMIT 10
`;

// Postgres Wire with pgvector
const similarDocuments = await client.query(`
  SELECT *, (embedding <-> $1::vector) as distance
  FROM documents
  ORDER BY distance
  LIMIT 10
`, [queryEmbedding]);
```

### Full-Text Search
```typescript
// HTTP API
const searchResults = await xata.sql`
  SELECT * FROM "documents"
  WHERE to_tsvector('english', content) @@ to_tsquery('english', ${searchTerm})
`;

// Postgres Wire with advanced text search
const searchResults = await client.query(`
  SELECT 
    *,
    ts_rank(to_tsvector('english', content), to_tsquery('english', $1)) as rank
  FROM documents
  WHERE to_tsvector('english', content) @@ to_tsquery('english', $1)
  ORDER BY rank DESC
`, [searchTerm]);
```

### JSON Operations
```typescript
// HTTP API
const jsonResults = await xata.sql`
  SELECT * FROM "events"
  WHERE metadata->>'type' = ${eventType}
  AND (metadata->'location'->>'country')::text = ${country}
`;

// Postgres Wire
const jsonResults = await client.query(`
  SELECT 
    *,
    metadata->'details' as event_details
  FROM events
  WHERE metadata->>'type' = $1
  AND metadata->'location'->>'country' = $2
`, [eventType, country]);
```

## Performance & Optimization

### Query Optimization
```typescript
// Use EXPLAIN to analyze query performance (Postgres Wire only)
const explainResult = await client.query(`
  EXPLAIN (ANALYZE, BUFFERS) 
  SELECT * FROM users u
  JOIN profiles p ON u.id = p.user_id
  WHERE u.created_at > $1
`, [startDate]);

console.log('Query plan:', explainResult.rows);
```

### Pagination Best Practices
```typescript
// Cursor-based pagination (efficient for large datasets)
const pageSize = 20;
const cursor = 'last_record_id';

// HTTP API
const nextPage = await xata.sql`
  SELECT * FROM "users"
  WHERE id > ${cursor}
  ORDER BY id ASC
  LIMIT ${pageSize}
`;

// Postgres Wire
const nextPage = await client.query(
  'SELECT * FROM users WHERE id > $1 ORDER BY id ASC LIMIT $2',
  [cursor, pageSize]
);
```

### Connection Pooling
```typescript
import { Pool } from 'pg';

// Create connection pool for Postgres Wire
const pool = new Pool({
  connectionString: 'postgresql://user:password@host/database',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool for queries
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Pool has ended');
  });
});
```

## Integration Patterns

### Adapter Pattern Usage
```typescript
// Using existing adapters from the project
import { DatabaseAdapterFactory } from './lib/adapters/base';

const xataLiteConfig = {
  type: 'xata_lite_http',
  connectionString: 'https://workspace-database.region.xata.sh/db/database',
  apiKey: 'xau_your_api_key',
  metadata: { branch: 'main' }
};

const xataPostgresConfig = {
  type: 'xata_postgres_wire',
  connectionString: 'postgresql://user:password@host/database',
  apiKey: 'xau_your_api_key'
};

// Create adapters
const liteAdapter = DatabaseAdapterFactory.create(xataLiteConfig);
const postgresAdapter = DatabaseAdapterFactory.create(xataPostgresConfig);

// Use adapters
await liteAdapter.connect();
const result = await liteAdapter.executeQuery('SELECT * FROM users LIMIT 10');
```

### Error Handling Patterns
```typescript
interface SqlError {
  code: string;
  message: string;
  query?: string;
  parameters?: any[];
}

async function executeWithRetry(
  query: string, 
  params: any[], 
  maxRetries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.query(query, params);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

## Best Practices

### 1. Security
```typescript
// Always use parameterized queries
// ❌ Never do this (SQL injection risk)
const badQuery = `SELECT * FROM users WHERE name = '${userName}'`;

// ✅ Always do this
const goodQuery = await xata.sql`SELECT * FROM "users" WHERE name = ${userName}`;
const goodQueryPg = await client.query('SELECT * FROM users WHERE name = $1', [userName]);
```

### 2. Performance
```typescript
// Use appropriate consistency levels
const recentData = await xata.sql({
  statement: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10',
  consistency: 'strong' // For critical data
});

const analyticsData = await xata.sql({
  statement: 'SELECT COUNT(*) FROM page_views',
  consistency: 'eventual' // For analytics/reporting
});
```

### 3. Resource Management
```typescript
// Always clean up connections
class DatabaseService {
  private client: Client;
  
  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
  }
  
  async connect() {
    await this.client.connect();
  }
  
  async disconnect() {
    await this.client.end();
  }
  
  async query(text: string, params?: any[]) {
    try {
      return await this.client.query(text, params);
    } catch (error) {
      console.error('Query failed:', { text, params, error });
      throw error;
    }
  }
}
```

## Migration Guide

### From HTTP API to Postgres Wire
```typescript
// Before (HTTP API)
const users = await xata.sql`SELECT * FROM "users" WHERE active = true`;

// After (Postgres Wire)
const users = await client.query('SELECT * FROM users WHERE active = true');

// Key differences:
// 1. No need to quote table names in Postgres Wire
// 2. Different parameter syntax ($1, $2 vs template literals)
// 3. Full PostgreSQL feature set available
// 4. Better performance monitoring and optimization tools
```

### Adapter Migration
```typescript
// Detect and migrate connections
import { ConnectionDetector } from './lib/adapters/connection-detector';

const detector = new ConnectionDetector();
const detection = detector.detect(connectionString, apiKey);

if (detection.type === 'xata_lite_http') {
  console.log('Migrating from Xata Lite to Postgres Wire...');
  // Migration logic here
}
```

## Troubleshooting

### Common Issues

1. **Connection Timeouts**
```typescript
// Increase timeout for long-running queries
const result = await xata.sql({
  statement: 'SELECT * FROM large_table',
  timeout: 30000 // 30 seconds
});
```

2. **Memory Issues**
```typescript
// Use streaming for large result sets (Postgres Wire)
const query = new QueryStream('SELECT * FROM large_table');
client.query(query)
  .on('row', (row) => {
    // Process row by row
    console.log(row);
  })
  .on('end', () => {
    console.log('Query completed');
  });
```

3. **SSL/TLS Issues**
```typescript
// Configure SSL for Postgres Wire
const client = new Client({
  connectionString: 'postgresql://user:password@host/database',
  ssl: {
    rejectUnauthorized: false // Only for development
  }
});
```

---

## Reference Links
- [Xata SQL HTTP API Documentation](https://xata.io/docs/sdk/sql/overview)
- [PostgreSQL Wire Protocol Documentation](https://www.postgresql.org/docs/current/protocol.html)
- [Project Adapter Implementations](./apps/dbagent/src/lib/adapters/)
- [Database Schema](./data/schema.json)
- [Setup Guide](./SETUP_GUIDE.md) 