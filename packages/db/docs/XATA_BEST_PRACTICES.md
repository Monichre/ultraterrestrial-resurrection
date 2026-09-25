# Xata TypeScript SDK Best Practices

**Version**: 1.0.0  
**Last Updated**: August 8, 2025  
**Package**: @db - Database abstraction layer for Ultraterrestrial Resurrection

---

## 🎯 **Overview**

This guide provides best practices for using the Xata TypeScript SDK in the Ultraterrestrial Resurrection project. Following these practices will ensure optimal performance, maintainability, and developer experience.

---

## 🏗️ **Architecture Best Practices**

### **1. Use Provider Registry Pattern**

```typescript
// ✅ Good - Use centralized provider registry
import { PROVIDERS } from '@db/registry';

const data = await PROVIDERS.xata.db.events.getAll();

// ❌ Bad - Direct client instantiation
import { XataClient } from '@db/xata/xata';
const client = new XataClient({ /* config */ });
```

**Benefits:**

- Centralized configuration management
- Easy provider switching
- Consistent error handling
- Simplified testing and mocking

### **2. Leverage Singleton Pattern**

```typescript
// ✅ Good - Use singleton for production
import { getXataClient } from '@db/xata';

const client = getXataClient();

// ✅ Good - Multiple instances for testing
import { XataClient } from '@db/xata/xata';
const testClient = new XataClient({
  databaseURL: 'test-url',
  apiKey: 'test-key'
});
```

### **3. Implement Proper Error Boundaries**

```typescript
// ✅ Good - Comprehensive error handling
async function safeDatabaseOperation() {
  try {
    const result = await xata.db.events.getAll();
    return { success: true, data: result };
  } catch (error) {
    // Log error for debugging
    console.error('Database operation failed:', error);
    
    // Return structured error response
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
}
```

---

## ⚡ **Performance Best Practices**

### **1. Optimize Query Selection**

```typescript
// ✅ Good - Select only needed fields
const lightweightTopics = await xata.db.topics
  .select(['id', 'name', 'title'])
  .getMany();

// ❌ Bad - Fetch all fields unnecessarily
const allTopics = await xata.db.topics.getAll();
```

### **2. Use Pagination for Large Datasets**

```typescript
// ✅ Good - Implement pagination
const paginatedResults = await xata.db.events
  .getPaginated({
    pagination: { size: 50, offset: 0 }
  });

// ❌ Bad - Fetch all records at once
const allEvents = await xata.db.events.getAll(); // Could be thousands of records
```

### **3. Leverage Database Indexes**

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

### **4. Implement Caching Strategies**

```typescript
// ✅ Good - Application-level caching
import { cache } from 'react';

export const getCachedTopics = cache(async () => {
  return await xata.db.topics.getAll();
});

// ✅ Good - Next.js revalidation
export const revalidate = 3600; // 1 hour

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

## 🔍 **Query Best Practices**

### **1. Use Appropriate Filter Methods**

```typescript
// ✅ Good - Use specific filter methods
const recentEvents = await xata.db.events
  .filter('date', 'gte', new Date('2024-01-01'))
  .getMany();

// ✅ Good - Use complex filters when needed
const specificEvents = await xata.db.events
  .filter({
    $and: [
      { category: 'military' },
      { credibility_score: { $gte: 8 } },
      { date: { $gte: '2024-01-01' } }
    ]
  })
  .getMany();

// ❌ Bad - Multiple separate filters
const events = await xata.db.events
  .filter('category', 'military')
  .filter('credibility_score', 'gte', 8)
  .filter('date', 'gte', '2024-01-01')
  .getMany();
```

### **2. Optimize Relationship Queries**

```typescript
// ✅ Good - Select specific relationship fields
const eventsWithExperts = await xata.db.events
  .select([
    'id', 'name', 'date',
    'event-subject-matter-experts.id',
    'event-subject-matter-experts.subject-matter-expert.name',
    'event-subject-matter-experts.subject-matter-expert.role'
  ])
  .getMany();

// ❌ Bad - Select all fields with wildcard
const eventsWithAllFields = await xata.db.events
  .select(['*', 'event-subject-matter-experts.*'])
  .getMany();
```

### **3. Use Aggregation for Analytics**

```typescript
// ✅ Good - Use aggregation for calculations
const credibilityStats = await xata.db.personnel
  .select(['role'])
  .groupBy(['role'])
  .aggregate({
    avgCredibility: { avg: 'credibility' },
    count: { count: '*' },
    maxCredibility: { max: 'credibility' }
  })
  .getMany();

// ❌ Bad - Fetch all records and calculate in JavaScript
const allPersonnel = await xata.db.personnel.getAll();
const stats = allPersonnel.reduce((acc, person) => {
  // Complex calculations in JavaScript
}, {});
```

---

## 🤖 **Ask Xata AI Best Practices**

### **1. Define Clear Rules**

```typescript
// ✅ Good - Specific, actionable rules
const result = await askXata('events', 'Find UFO incidents with government involvement', {
  rules: [
    'Prioritize cases with official government acknowledgment',
    'Include classification status and investigation details',
    'Focus on incidents from the last 20 years',
    'Provide specific dates and locations when available'
  ]
});

// ❌ Bad - Vague or conflicting rules
const result = await askXata('events', 'Find UFO incidents', {
  rules: [
    'Be helpful', // Too vague
    'Don\'t be too specific', // Conflicts with being helpful
    'Include everything' // Too broad
  ]
});
```

### **2. Optimize Search Configuration**

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

### **3. Use Vector Search Appropriately**

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

// ✅ Good - Hybrid approach for complex queries
const result = await askXata('documents', 'Find UFO disclosure documents', {
  searchType: 'keyword',
  keywordSearch: {
    target: ['title', 'summary'],
    filter: { classification: 'declassified' }
  },
  vectorSearch: {
    column: 'embedding',
    contentColumn: 'summary'
  }
});
```

---

## 🔒 **Security Best Practices**

### **1. Environment Variable Management**

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

### **2. Input Validation and Sanitization**

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

// ❌ Bad - No validation
export async function createEvent(input: any) {
  return await xata.db.events.create(input);
}
```

### **3. Server-Side Operations Only**

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

---

## 🧪 **Testing Best Practices**

### **1. Use Test Database**

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

### **2. Mock Database Operations**

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

### **3. Clean Up Test Data**

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

---

## 📱 **Integration Best Practices**

### **1. Next.js API Routes**

```typescript
// ✅ Good - Proper error handling and status codes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }
    
    const events = await xata.db.events
      .filter('category', 'contains', category)
      .getMany();
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **2. React Components**

```typescript
// ✅ Good - Proper loading and error states
export function EventList() {
  const [events, setEvents] = useState<EventsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        
        const result = await xata.db.events
          .sort('date', 'desc')
          .getMany();
        
        setEvents(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <p>{event.summary}</p>
        </div>
      ))}
    </div>
  );
}
```

### **3. Server Actions**

```typescript
// ✅ Good - Proper validation and error handling
export async function createEvent(formData: FormData) {
  try {
    // Validate input
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    if (!name || !description) {
      return { success: false, error: 'Name and description are required' };
    }
    
    // Create event
    const event = await xata.db.events.create({
      name,
      description,
      date: new Date(),
      location: formData.get('location') as string
    });

    // Revalidate cache
    revalidatePath('/events');
    
    return { success: true, event };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

---

## 🚀 **Deployment Best Practices**

### **1. Environment Configuration**

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

### **2. Health Checks**

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

### **3. Monitoring and Logging**

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

## 🔮 **Future-Proofing Best Practices**

### **1. Abstract Database Operations**

```typescript
// ✅ Good - Abstract database operations for easy migration
export interface DatabaseProvider {
  events: {
    getAll(): Promise<Event[]>;
    create(data: CreateEventData): Promise<Event>;
    update(id: string, data: UpdateEventData): Promise<Event>;
    delete(id: string): Promise<void>;
  };
}

// Implementation can be easily swapped
export class XataProvider implements DatabaseProvider {
  // Xata-specific implementation
}

export class SupabaseProvider implements DatabaseProvider {
  // Supabase-specific implementation
}
```

### **2. Use Type-Safe Interfaces**

```typescript
// ✅ Good - Define clear interfaces
export interface Event {
  id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  category: string[];
  embedding?: number[];
}

// ✅ Good - Use generics for flexibility
export interface DatabaseOperation<T> {
  create(data: Omit<T, 'id'>): Promise<T>;
  getById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

---

## 📚 **Additional Resources**

- [Xata Official Documentation](https://xata.io/docs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js Best Practices](https://nextjs.org/docs)
- [React Best Practices](https://react.dev/learn)

---

*For comprehensive examples and implementation details, refer to [Xata Examples](./XATA_EXAMPLES.md) and the main [Xata TypeScript SDK Guide](./XATA_TYPESCRIPT_SDK_GUIDE.md).*
