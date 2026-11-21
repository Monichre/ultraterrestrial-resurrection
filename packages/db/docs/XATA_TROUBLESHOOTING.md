# Xata TypeScript SDK Troubleshooting Guide

**Version**: 1.0.0  
**Last Updated**: August 8, 2025  
**Package**: @db - Database abstraction layer for Ultraterrestrial Resurrection

---

## 🚨 **Common Issues & Solutions**

This guide covers the most common issues developers encounter when using the Xata TypeScript SDK and provides step-by-step solutions.

---

## 🔌 **Connection Issues**

### **Issue: "Failed to connect to database"**

**Symptoms:**

- Connection timeout errors
- "Database service unavailable" messages
- Network error responses

**Solutions:**

#### **1. Check Environment Variables**

```bash
# Verify these are set correctly
echo $XATA_API_KEY
echo $XATA_DATABASE_URL
```

**Common Issues:**

- Missing environment variables
- Incorrect API key format
- Wrong database URL format

**Fix:**

```bash
# .env.local
XATA_API_KEY=xau_your_actual_api_key_here
XATA_DATABASE_URL=https://workspace-id.region.xata.sh/db/database_name
```

#### **2. Verify API Key Validity**

```typescript
// Test API key with simple query
import { xata } from '@db/xata';

try {
  const test = await xata.db.topics.getFirst();
  console.log('✅ Connection successful');
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    console.error('❌ Invalid API key');
  } else if (error.code === 'NOT_FOUND') {
    console.error('❌ Database not found');
  } else {
    console.error('❌ Connection error:', error.message);
  }
}
```

#### **3. Check Network Configuration**

```typescript
// Test with explicit timeout
import { XataClient } from '@db/xata/xata';

const client = new XataClient({
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  // Add timeout configuration
  fetch: (url, options) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    return fetch(url, {
      ...options,
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
  }
});
```

---

## 🔑 **Authentication Issues**

### **Issue: "Unauthorized" or "Invalid API Key"**

**Symptoms:**

- 401 Unauthorized responses
- "Invalid API key" error messages
- Permission denied errors

**Solutions:**

#### **1. Verify API Key Format**

```typescript
// API key should start with 'xau_'
const apiKey = process.env.XATA_API_KEY;

if (!apiKey || !apiKey.startsWith('xau_')) {
  throw new Error('Invalid API key format. Must start with "xau_"');
}
```

#### **2. Check API Key Permissions**

```typescript
// Test different operations to identify permission issues
async function testPermissions() {
  try {
    // Test read permission
    await xata.db.topics.getFirst();
    console.log('✅ Read permission: OK');
    
    // Test write permission
    const testRecord = await xata.db.topics.create({
      name: 'Test Topic',
      title: 'test-topic-' + Date.now()
    });
    console.log('✅ Write permission: OK');
    
    // Clean up test record
    await xata.db.topics.delete(testRecord.id);
    console.log('✅ Delete permission: OK');
    
  } catch (error) {
    if (error.code === 'FORBIDDEN') {
      console.error('❌ Insufficient permissions for this operation');
    } else {
      console.error('❌ Permission test failed:', error.message);
    }
  }
}
```

#### **3. Regenerate API Key**

If permissions are insufficient:

1. Go to [Xata Dashboard](https://xata.io/dashboard)
2. Navigate to API Keys section
3. Create new API key with appropriate permissions
4. Update environment variables
5. Test connection

---

## 📊 **Schema & Type Issues**

### **Issue: "Property does not exist on type"**

**Symptoms:**

- TypeScript compilation errors
- "Property 'X' does not exist on type 'Y'" messages
- Autocomplete not working

**Solutions:**

#### **1. Regenerate Schema Types**

```bash
# Navigate to db package
cd packages/db

# Regenerate Xata types
npx xata codegen
```

#### **2. Check Type Imports**

```typescript
// ✅ Good - Import from correct location
import type { EventsRecord } from '@db/types';
import { xata } from '@db/xata';

// ❌ Bad - Direct import from generated file
import type { EventsRecord } from '@db/xata/xata';
```

#### **3. Verify Schema Changes**

```typescript
// Check if schema has been updated
import { xata } from '@db/xata';

// This will show current table structure
console.log('Available tables:', Object.keys(xata.db));

// Check specific table columns
const tableInfo = await xata.db.events.getTableInfo();
console.log('Events table columns:', tableInfo.columns);
```

---

## 🔍 **Query Issues**

### **Issue: "Filter not found" or "Invalid filter"**

**Symptoms:**

- "Column 'X' not found" errors
- Filter syntax errors
- Unexpected query results

**Solutions:**

#### **1. Verify Column Names**

```typescript
// Check available columns
const tableInfo = await xata.db.events.getTableInfo();
const columnNames = tableInfo.columns.map(col => col.name);
console.log('Available columns:', columnNames);

// Use correct column names in filters
const events = await xata.db.events
  .filter('name', 'contains', 'UFO') // ✅ Correct
  .getMany();

// ❌ Wrong - column doesn't exist
const wrongFilter = await xata.db.events
  .filter('event_name', 'contains', 'UFO') // ❌ Wrong column name
  .getMany();
```

#### **2. Check Filter Syntax**

```typescript
// ✅ Good - Simple filters
const events = await xata.db.events
  .filter('date', 'gte', new Date('2024-01-01'))
  .getMany();

// ✅ Good - Complex filters
const complexFilter = await xata.db.events
  .filter({
    $and: [
      { category: 'military' },
      { credibility_score: { $gte: 8 } }
    ]
  })
  .getMany();

// ❌ Bad - Invalid filter syntax
const invalidFilter = await xata.db.events
  .filter('date', '>', '2024-01-01') // ❌ Wrong operator
  .getMany();
```

#### **3. Debug Query Results**

```typescript
// Add logging to debug queries
async function debugQuery() {
  console.log('🔍 Starting query...');
  
  try {
    const events = await xata.db.events
      .filter('category', 'contains', 'military')
      .getMany();
    
    console.log('✅ Query successful');
    console.log('📊 Results count:', events.length);
    console.log('📋 First result:', events[0]);
    
    return events;
  } catch (error) {
    console.error('❌ Query failed:', error);
    throw error;
  }
}
```

---

## 🤖 **Ask Xata AI Issues**

### **Issue: "AI response not relevant" or "Wrong information"**

**Symptoms:**

- AI gives incorrect answers
- Responses don't match data
- Poor search relevance

**Solutions:**

#### **1. Improve Rules Configuration**

```typescript
// ✅ Good - Specific, actionable rules
const result = await askXata('events', 'Find UFO incidents with government involvement', {
  rules: [
    'Only answer based on the data provided',
    'Include specific dates and locations when available',
    'Prioritize cases with official government acknowledgment',
    'If information is not available, say so clearly'
  ]
});

// ❌ Bad - Vague rules
const badResult = await askXata('events', 'Find UFO incidents', {
  rules: [
    'Be helpful', // Too vague
    'Include everything' // Too broad
  ]
});
```

#### **2. Optimize Search Configuration**

```typescript
// ✅ Good - Configure search for relevance
const result = await askXataComprehensive('events', 'Find military UFO sightings', {
  searchType: 'keyword',
  keywordSearch: {
    fuzziness: 1, // Allow minor typos
    prefix: 'phrase', // Enable phrase matching
    target: [
      'name', // High priority
      { column: 'description', weight: 2 }, // Medium priority
      { column: 'category', weight: 3 } // Highest priority
    ],
    boosters: [{
      valueBooster: {
        column: 'military_involvement',
        value: 'confirmed',
        factor: 2.0
      }
    }]
  }
});
```

#### **3. Use Vector Search for Semantic Queries**

```typescript
// ✅ Good - Vector search for semantic similarity
const result = await askXata('testimonies', 'Find similar witness descriptions', {
  searchType: 'vector',
  vectorSearch: {
    column: 'description_embedding',
    contentColumn: 'description',
    filter: { witness_credibility: 'high' }
  }
});
```

---

## ⚡ **Performance Issues**

### **Issue: "Slow queries" or "Timeout errors"**

**Symptoms:**

- Queries take too long
- Timeout errors
- High memory usage

**Solutions:**

#### **1. Optimize Query Selection**

```typescript
// ✅ Good - Select only needed fields
const lightweightTopics = await xata.db.topics
  .select(['id', 'name', 'title'])
  .getMany();

// ❌ Bad - Fetch all fields unnecessarily
const allTopics = await xata.db.topics.getAll();
```

#### **2. Implement Pagination**

```typescript
// ✅ Good - Use pagination for large datasets
const paginatedResults = await xata.db.events
  .getPaginated({
    pagination: { size: 50, offset: 0 }
  });

// ❌ Bad - Fetch all records at once
const allEvents = await xata.db.events.getAll(); // Could be thousands
```

#### **3. Use Indexed Columns**

```typescript
// ✅ Good - Use indexed columns for filtering
const highCredibilityPersonnel = await xata.db.personnel
  .filter('credibility', 'gte', 8)
  .filter('authority', 'gte', 7)
  .getMany();

// ❌ Bad - Complex filters without indexes
const complexFilter = await xata.db.events
  .filter('description', 'contains', 'complex search term')
  .filter('metadata', 'contains', { nested: 'value' })
  .getMany();
```

#### **4. Implement Caching**

```typescript
// ✅ Good - Application-level caching
import { cache } from 'react';

export const getCachedTopics = cache(async () => {
  return await xata.db.topics.getAll();
});

// ✅ Good - Conditional caching
export async function getCachedEvent(id: string) {
  const cacheKey = `event-${id}`;
  
  // Check cache first
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;
  
  // Fetch from database
  const event = await xata.db.events.getFirst({ filter: { id } });
  
  // Store in cache
  await setCache(cacheKey, event, 3600);
  
  return event;
}
```

---

## 🧪 **Testing Issues**

### **Issue: "Tests failing" or "Database conflicts"**

**Symptoms:**

- Tests fail intermittently
- Data conflicts between tests
- Slow test execution

**Solutions:**

#### **1. Use Test Database**

```typescript
// ✅ Good - Separate test database
export function createTestClient() {
  return new XataClient({
    databaseURL: process.env.XATA_TEST_DATABASE_URL,
    apiKey: process.env.XATA_TEST_API_KEY
  });
}

// ❌ Bad - Use production database for testing
const testClient = getXataClient(); // Uses production
```

#### **2. Clean Up Test Data**

```typescript
// ✅ Good - Clean up after tests
describe('Events Integration', () => {
  let testEventId: string;

  beforeAll(async () => {
    const event = await xata.db.events.create(mockEvent);
    testEventId = event.id;
  });

  afterAll(async () => {
    if (testEventId) {
      await xata.db.events.delete(testEventId);
    }
  });
});
```

#### **3. Mock Database Operations**

```typescript
// ✅ Good - Mock database for unit tests
jest.mock('@db/xata', () => ({
  xata: {
    db: {
      events: {
        getAll: jest.fn().mockResolvedValue(mockEvents),
        create: jest.fn().mockResolvedValue(mockEvent)
      }
    }
  }
}));
```

---

## 🔒 **Security Issues**

### **Issue: "API key exposed" or "Unauthorized access"**

**Symptoms:**

- API keys in client-side code
- Unauthorized database access
- Security warnings

**Solutions:**

#### **1. Server-Side Operations Only**

```typescript
// ✅ Good - Server-side database operations
export async function createEvent(data: EventData) {
  'use server';
  return await xata.db.events.create(data);
}

// ❌ Bad - Client-side database operations
'use client';
const createEvent = async (data: EventData) => {
  return await xata.db.events.create(data); // Exposes API key
};
```

#### **2. Environment Variable Security**

```typescript
// ✅ Good - Use environment variables
const config = {
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY
};

// ❌ Bad - Hardcoded credentials
const config = {
  databaseURL: 'https://workspace.xata.sh/db/database',
  apiKey: 'xau_exposed_key_123'
};
```

#### **3. Input Validation**

```typescript
// ✅ Good - Validate input before database operations
import { z } from 'zod';

const EventSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(10).max(10000),
  date: z.date(),
  location: z.string().min(1).max(255)
});

export async function createValidatedEvent(input: unknown) {
  const validatedData = EventSchema.parse(input);
  return await xata.db.events.create(validatedData);
}
```

---

## 🚀 **Deployment Issues**

### **Issue: "Production errors" or "Environment differences"**

**Symptoms:**

- Works locally but fails in production
- Different behavior between environments
- Configuration errors

**Solutions:**

#### **1. Environment-Specific Configuration**

```typescript
// ✅ Good - Environment-specific configuration
export const xataConfig = {
  development: {
    databaseURL: process.env.XATA_DEV_DATABASE_URL,
    apiKey: process.env.XATA_DEV_API_KEY
  },
  staging: {
    databaseURL: process.env.XATA_STAGING_DATABASE_URL,
    apiKey: process.env.XATA_STAGING_API_KEY
  },
  production: {
    databaseURL: process.env.XATA_PRODUCTION_DATABASE_URL,
    apiKey: process.env.XATA_PRODUCTION_API_KEY
  }
};
```

#### **2. Health Checks**

```typescript
// ✅ Good - Database health monitoring
export async function GET() {
  try {
    const startTime = Date.now();
    
    // Test database connection
    await xata.db.topics.getFirst();
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
```

#### **3. Monitoring and Logging**

```typescript
// ✅ Good - Comprehensive operation logging
export async function logDatabaseOperation(
  operation: string,
  table: string,
  duration: number,
  success: boolean,
  error?: string
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    table,
    duration: `${duration}ms`,
    success,
    error: error || null
  };
  
  console.log('[DB]', logEntry);
  
  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    await sendMetrics(logEntry);
  }
}
```

---

## 🔧 **Debugging Tools**

### **1. Enable Debug Logging**

```typescript
// Add debug logging to database operations
import { xata } from '@db/xata';

// Wrap operations with logging
async function debugOperation<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  console.log(`🔍 Starting: ${operation}`);
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    console.log(`✅ Completed: ${operation} (${duration}ms)`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Failed: ${operation} (${duration}ms)`, error);
    throw error;
  }
}

// Use in operations
const events = await debugOperation('fetch events', () =>
  xata.db.events.getAll()
);
```

### **2. Query Performance Monitoring**

```typescript
// Monitor query performance
export async function monitorQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await queryFn();
    const duration = performance.now() - startTime;
    
    // Log performance metrics
    console.log(`📊 Query: ${queryName} - ${duration.toFixed(2)}ms`);
    
    // Send to monitoring service if slow
    if (duration > 1000) {
      console.warn(`⚠️ Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`❌ Query failed: ${queryName} after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}
```

---

## 📞 **Getting Help**

### **1. Check Documentation**

- [Xata Official Documentation](https://xata.io/docs)
- [TypeScript Client Guide](https://xata.io/docs/typescript-client)
- [Ask AI Documentation](https://xata.io/docs/ai/ask)

### **2. Community Support**

- [Xata Discord](https://discord.gg/xata)
- [GitHub Issues](https://github.com/xataio/xata-js/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/xata)

### **3. Internal Resources**

- [Xata TypeScript SDK Guide](./XATA_TYPESCRIPT_SDK_GUIDE.md)
- [Xata Examples](./XATA_EXAMPLES.md)
- [Xata Best Practices](./XATA_BEST_PRACTICES.md)

### **4. Error Reporting Template**

When reporting issues, include:

```typescript
// Error details
{
  error: "Error message",
  code: "ERROR_CODE",
  timestamp: "2025-08-08T12:00:00Z",
  operation: "Operation being performed",
  environment: "development/staging/production",
  xataVersion: "0.30.1",
  nodeVersion: "18.0.0"
}
```

---

*For more comprehensive troubleshooting and advanced debugging techniques, refer to the main [Xata TypeScript SDK Guide](./XATA_TYPESCRIPT_SDK_GUIDE.md).*
