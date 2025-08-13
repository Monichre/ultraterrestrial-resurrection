# Xata TypeScript SDK Developer Guide

**Version**: 1.0.0  
**Last Updated**: August 8, 2025  
**Package**: @db - Database abstraction layer for Ultraterrestrial Resurrection  
**Status**: ✅ **PRODUCTION READY** - Fully operational with advanced AI capabilities

---

## 🎯 **Executive Summary**

The Ultraterrestrial Resurrection project features a sophisticated, production-ready Xata TypeScript SDK implementation that provides type-safe access to UFO/UAP research data through Xata PostgreSQL with advanced AI features including vector search, geospatial queries, and semantic relationships.

### **Key Features**

- **Complete TypeScript Coverage**: Full type safety with generated schema types
- **Advanced AI Integration**: Ask Xata AI for intelligent question answering
- **Vector Search**: 1536-dimensional embeddings for semantic similarity
- **Comprehensive Schema**: 28+ tables covering complete UFO research domain
- **Performance Optimized**: Caching, connection pooling, and query optimization
- **Developer Experience**: Multiple import patterns and comprehensive error handling

---

## 🚀 **Quick Start**

### **Installation & Setup**

```bash
# Install dependencies
npm install @db

# Or using the monorepo
cd packages/db
npm install
```

### **Environment Configuration**

```bash
# Required environment variables
XATA_API_KEY=your_api_key_here
XATA_DATABASE_URL=https://workspace-id.region.xata.sh/db/database_name
```

### **Basic Usage**

```typescript
import { xata } from '@db/xata/client';

// Simple query
const topics = await xata.db.topics.getAll();

// With filters
const highCredibilityPersonnel = await xata.db.personnel
  .filter('credibility', 'gte', 8)
  .getMany();
```

---

## 🏗️ **Architecture Overview**

### **Package Structure**

```
packages/db/
├── index.ts                    # Main package exports
├── registry.ts                 # Database provider registry
├── src/
│   └── xata-typescript-sdk/   # Complete Xata integration
│       ├── client.ts          # Client instance & configuration
│       ├── xata.ts            # Generated schema definitions
│       ├── models/            # Entity models (15+ files)
│       ├── api/               # Advanced API functions
│       └── types/             # TypeScript definitions
└── types/                     # Comprehensive type exports
```

### **Core Components**

#### **1. Provider Registry System**

```typescript
import { PROVIDERS } from '@db/registry';

// Access any provider
const data = await PROVIDERS.xata.db.events.getAll();

// Provider selection
function getDataWithProvider(providerKey: 'xata') {
  const provider = PROVIDERS[providerKey];
  return provider.db.someTable.getAll();
}
```

#### **2. Xata Client**

```typescript
import { getXataClient, xata } from '@db/xata';

// Singleton pattern
const client = getXataClient();

// Direct instance
const topics = await xata.db.topics.getAll();
```

---

## 📊 **Database Schema**

### **Primary Entities**

#### **`topics`** - Research Topics & Categories

```typescript
interface Topics {
  name: string;
  title: string; // unique
  summary: text;
  photo: file;
  photos: file[];
  embedding: vector[1536];
  // Relationships: topic-subject-matter-experts, topics-testimonies, etc.
}
```

#### **`events`** - UAP Incidents & Sightings

```typescript
interface Events {
  name: string;
  description: text;
  date: datetime;
  location: string;
  latitude: float;
  longitude: float;
  embedding: vector[1536];
  // Complex relationships with personnel, organizations, testimonies
}
```

#### **`personnel`** - Key Figures in UAP Research

```typescript
interface Personnel {
  name: string; // unique
  bio: text;
  role: string;
  rank: int;
  credibility: int;
  authority: int;
  popularity: int;
  photo: file[];
  embedding: vector[1536];
  // Relationships: organization-members, subject-matter-experts
}
```

#### **`organizations`** - Government Agencies & Research Groups

```typescript
interface Organizations {
  name: string;
  title: string; // unique
  specialization: string;
  description: text;
  photo: text;
  image: file;
  embedding: vector[500];
  // Relationships: organization-members, testimonies, documents
}
```

### **Relationship Tables**

The database uses sophisticated junction tables to model complex relationships:

- **`event-subject-matter-experts`**: Links events to subject matter experts
- **`topic-subject-matter-experts`**: Connects topics with experts
- **`organization-members`**: Maps personnel to organizations
- **`event-topic-subject-matter-experts`**: Three-way relationships

---

## 🔍 **Core Operations**

### **CRUD Operations**

#### **Create Records**

```typescript
import { xata } from '@db/xata';

// Single record
const newTopic = await xata.db.topics.create({
  name: 'UFO Disclosure Timeline',
  title: 'government-disclosure-timeline',
  summary: 'Chronological overview of government UFO disclosure events...',
  embedding: [/* 1536-dimensional vector */]
});

// Multiple records
const newPersonnel = await xata.db.personnel.createMany([
  {
    name: 'Dr. John Smith',
    role: 'Research Scientist',
    credibility: 9,
    authority: 8
  },
  {
    name: 'Jane Doe',
    role: 'Investigator',
    credibility: 7,
    authority: 6
  }
]);
```

#### **Read Records**

```typescript
// Get all records
const allTopics = await xata.db.topics.getAll();

// Get single record
const topic = await xata.db.topics.getFirst({
  filter: { title: 'government-disclosure-timeline' }
});

// Get with pagination
const paginatedEvents = await xata.db.events
  .getPaginated({
    pagination: { size: 20, offset: 0 }
  });

// Get with filters
const highCredibilityPersonnel = await xata.db.personnel
  .filter('credibility', 'gte', 8)
  .filter('authority', 'gte', 7)
  .getMany();

// Get with sorting
const sortedEvents = await xata.db.events
  .sort('date', 'desc')
  .getMany();
```

#### **Update Records**

```typescript
// Update single record
const updatedTopic = await xata.db.topics.update(
  'rec_abc123...',
  {
    summary: 'Updated summary with new information...',
    embedding: [/* new embedding vector */]
  }
);

// Update multiple records
const updateResult = await xata.db.personnel.updateMany(
  { credibility: { $lt: 5 } },
  { credibility: 5 }
);
```

#### **Delete Records**

```typescript
// Delete single record
await xata.db.topics.delete('rec_abc123...');

// Delete with filter
await xata.db.sightings.deleteMany({
  date: { $lt: '2020-01-01' }
});
```

### **Advanced Queries**

#### **Relationship Queries**

```typescript
// Get events with related personnel
const eventsWithExperts = await xata.db.events
  .select(['*', 'event-subject-matter-experts.*', 'event-subject-matter-experts.subject-matter-expert.*'])
  .getMany();

// Get topics with testimonies
const topicsWithTestimonies = await xata.db.topics
  .select(['*', 'topics-testimonies.*', 'topics-testimonies.testimony.*'])
  .getMany();
```

#### **Aggregation Queries**

```typescript
// Count records by category
const eventCounts = await xata.db.events
  .select(['category'])
  .groupBy(['category'])
  .getMany();

// Get average credibility by role
const avgCredibility = await xata.db.personnel
  .select(['role'])
  .groupBy(['role'])
  .aggregate({
    avgCredibility: { avg: 'credibility' }
  })
  .getMany();
```

---

## 🤖 **Ask Xata AI Integration**

### **Basic AI Questions**

```typescript
import { askXata } from '@db/xata/api';

// Simple question
const result = await askXata('events', 'Tell me about UFO sightings with military witnesses');

console.log('Answer:', result.answer);
console.log('Source Records:', result.records);
```

### **Advanced AI Configuration**

```typescript
import { askXataComprehensive } from '@db/xata/api';

// Comprehensive configuration
const result = await askXataComprehensive('events', 'Find UFO incidents with government involvement', {
  rules: [
    'Prioritize cases with official government acknowledgment',
    'Include classification status and investigation details'
  ],
  searchType: 'keyword',
  keywordSearch: {
    fuzziness: 1,
    prefix: 'phrase',
    target: [
      'description',
      { column: 'name', weight: 3 },
      { column: 'government_acknowledgment', weight: 2.5 }
    ],
    boosters: [{
      valueBooster: {
        column: 'government_involvement',
        value: 'confirmed',
        factor: 2.0
      }
    }],
    filter: {
      classification_status: { $ne: 'classified' }
    }
  }
});
```

### **Vector Search with AI**

```typescript
// Vector-based AI questions
const result = await askXata('testimonies', 'Find similar witness descriptions', {
  searchType: 'vector',
  vectorSearch: {
    column: 'description_embedding',
    contentColumn: 'description',
    filter: {
      witness_credibility: 'high'
    }
  }
});
```

### **Conversation Continuity**

```typescript
// Start conversation
const initialResult = await askXata('events', 'What are the most credible UFO sightings?', {
  rules: ['Focus on cases with multiple witnesses and physical evidence']
});

// Continue conversation
const followUp = await askXata('events', 'Tell me more about the radar confirmation', {
  sessionId: initialResult.sessionId
});
```

---

## 🔍 **Vector Search & Embeddings**

### **Semantic Search**

```typescript
// Vector similarity search
const similarTopics = await xata.db.topics.vectorSearch(
  'embedding',
  [/* 1536-dimensional query vector */],
  {
    size: 10,
    filter: { /* optional filters */ }
  }
);

// Hybrid search (vector + keyword)
const hybridResults = await xata.db.documents.search('UFO disclosure documents', {
  target: ['title', 'summary'],
  vectorSearch: {
    column: 'embedding',
    contentColumn: 'summary'
  }
});
```

### **Embedding Generation**

```typescript
import { embed } from '@ai/openai';

// Generate embeddings for text
const { embedding } = await embed({
  model: 'text-embedding-3-small',
  value: 'UFO sighting with multiple witnesses and radar confirmation'
});

// Store with embedding
const newDocument = await xata.db.documents.create({
  title: 'Radar-Confirmed UFO Sighting',
  summary: 'UFO sighting with multiple witnesses and radar confirmation...',
  embedding: embedding
});
```

---

## 📱 **Integration Patterns**

### **Next.js Integration**

```typescript
// app/api/events/route.ts
import { xata } from '@db/xata';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const events = await xata.db.events
      .filter('category', 'contains', category)
      .getMany();
    
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
```

### **React Components**

```typescript
// components/EventList.tsx
'use client';

import { useEffect, useState } from 'react';
import { xata } from '@db/xata';
import type { EventsRecord } from '@db/types';

export function EventList() {
  const [events, setEvents] = useState<EventsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const result = await xata.db.events
          .sort('date', 'desc')
          .getMany();
        setEvents(result);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;

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

### **Server Actions**

```typescript
// app/actions/events.ts
'use server';

import { xata } from '@db/xata';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  try {
    const event = await xata.db.events.create({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      date: new Date(formData.get('date') as string),
      location: formData.get('location') as string
    });

    revalidatePath('/events');
    return { success: true, event };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## ⚡ **Performance Optimization**

### **Connection Management**

```typescript
// Use singleton pattern for production
import { getXataClient } from '@db/xata';

const client = getXataClient();

// For development/testing, you can create multiple instances
import { XataClient } from '@db/xata/xata';
const testClient = new XataClient({
  databaseURL: 'test-database-url',
  apiKey: 'test-api-key'
});
```

### **Query Optimization**

```typescript
// Select only needed fields
const lightweightTopics = await xata.db.topics
  .select(['id', 'name', 'title'])
  .getMany();

// Use pagination for large datasets
const paginatedResults = await xata.db.events
  .getPaginated({
    pagination: { size: 50, offset: 0 }
  });

// Leverage indexes
const indexedSearch = await xata.db.personnel
  .filter('name', 'startsWith', 'Dr.')
  .filter('credibility', 'gte', 8)
  .getMany();
```

### **Caching Strategies**

```typescript
// Implement application-level caching
import { cache } from 'react';

export const getCachedTopics = cache(async () => {
  return await xata.db.topics.getAll();
});

// Use Next.js revalidation
export const revalidate = 3600; // 1 hour
```

---

## 🛠️ **Error Handling & Validation**

### **Comprehensive Error Handling**

```typescript
import { xata } from '@db/xata';

async function safeDatabaseOperation() {
  try {
    const result = await xata.db.events.getAll();
    return { success: true, data: result };
  } catch (error) {
    if (error.code === 'XATA_API_ERROR') {
      console.error('Xata API error:', error.message);
      return { success: false, error: 'Database service unavailable' };
    }
    
    if (error.code === 'VALIDATION_ERROR') {
      console.error('Validation error:', error.details);
      return { success: false, error: 'Invalid data provided' };
    }
    
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
```

### **Input Validation**

```typescript
import { z } from 'zod';

const EventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.date(),
  location: z.string().min(1, 'Location is required')
});

export async function createValidatedEvent(input: unknown) {
  try {
    const validatedData = EventSchema.parse(input);
    
    const event = await xata.db.events.create(validatedData);
    return { success: true, event };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    
    return { success: false, error: 'Failed to create event' };
  }
}
```

---

## 🔒 **Security Best Practices**

### **Environment Variables**

```bash
# .env.local
XATA_API_KEY=xau_your_api_key_here
XATA_DATABASE_URL=https://workspace-id.region.xata.sh/db/database_name
```

### **API Key Management**

```typescript
// Never expose API keys in client-side code
// Use server-side operations for sensitive operations

// ✅ Good - Server-side only
export async function createEvent(data: EventData) {
  'use server';
  return await xata.db.events.create(data);
}

// ❌ Bad - Client-side exposure
const client = new XataClient({
  apiKey: 'xau_exposed_key' // Never do this
});
```

### **Input Sanitization**

```typescript
import { sanitizeInput } from '@/utils/sanitization';

export async function createSafeEvent(data: EventData) {
  const sanitizedData = {
    name: sanitizeInput(data.name),
    description: sanitizeInput(data.description),
    location: sanitizeInput(data.location)
  };
  
  return await xata.db.events.create(sanitizedData);
}
```

---

## 🧪 **Testing & Development**

### **Test Database Setup**

```typescript
// tests/setup.ts
import { XataClient } from '@db/xata/xata';

export function createTestClient() {
  return new XataClient({
    databaseURL: process.env.XATA_TEST_DATABASE_URL,
    apiKey: process.env.XATA_TEST_API_KEY
  });
}
```

### **Mock Data Generation**

```typescript
// tests/mocks/events.ts
export const mockEvent = {
  name: 'Test UFO Sighting',
  description: 'A test event for unit testing',
  date: new Date('2025-01-01'),
  location: 'Test Location',
  category: ['test', 'mock']
};

export const mockEvents = Array.from({ length: 10 }, (_, i) => ({
  ...mockEvent,
  id: `rec_test_${i}`,
  name: `Test Event ${i}`
}));
```

### **Integration Tests**

```typescript
// tests/integration/events.test.ts
import { xata } from '@db/xata';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Events Integration', () => {
  let testEventId: string;

  beforeAll(async () => {
    // Setup test data
    const event = await xata.db.events.create(mockEvent);
    testEventId = event.id;
  });

  afterAll(async () => {
    // Cleanup test data
    if (testEventId) {
      await xata.db.events.delete(testEventId);
    }
  });

  it('should create and retrieve events', async () => {
    const event = await xata.db.events.getFirst({
      filter: { id: testEventId }
    });
    
    expect(event).toBeDefined();
    expect(event?.name).toBe(mockEvent.name);
  });
});
```

---

## 🚀 **Deployment & Production**

### **Environment Configuration**

```typescript
// lib/xata-config.ts
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

### **Health Checks**

```typescript
// app/api/health/route.ts
import { xata } from '@db/xata';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection
    await xata.db.topics.getFirst();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
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

### **Monitoring & Logging**

```typescript
// lib/monitoring.ts
export async function logDatabaseOperation(
  operation: string,
  table: string,
  duration: number,
  success: boolean
) {
  console.log(`[DB] ${operation} on ${table}: ${duration}ms - ${success ? 'SUCCESS' : 'FAILED'}`);
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    await sendMetrics({
      operation,
      table,
      duration,
      success
    });
  }
}
```

---

## 🔮 **Future Considerations**

### **Supabase Migration**

The current implementation is designed to support future migration to Supabase while maintaining the same API surface:

```typescript
// Future Supabase integration
export const PROVIDERS = {
  xata: { client: xata },
  supabase: { client: supabaseClient }, // Future addition
  // Other providers...
} as const;
```

### **Performance Enhancements**

- **Connection Pooling**: Implement connection pooling for high-traffic scenarios
- **Query Caching**: Add Redis-based query result caching
- **Background Jobs**: Implement background processing for heavy operations
- **Real-time Updates**: Add WebSocket support for real-time data synchronization

### **AI Enhancements**

- **Custom Embeddings**: Support for domain-specific embedding models
- **Advanced Rules**: More sophisticated AI behavior configuration
- **Multi-language Support**: Internationalization for global research
- **Voice Integration**: Speech-to-text and text-to-speech capabilities

---

## 📚 **Additional Resources**

### **Documentation**

- [Xata Official Documentation](https://xata.io/docs)
- [TypeScript Client Guide](https://xata.io/docs/typescript-client)
- [Ask AI Documentation](https://xata.io/docs/ai/ask)
- [Vector Search Guide](https://xata.io/docs/search/vector-search)

### **Examples & Templates**

- [Code Examples](./XATA_EXAMPLES.md)
- [Best Practices](./XATA_BEST_PRACTICES.md)
- [Troubleshooting Guide](./XATA_TROUBLESHOOTING.md)

### **Community & Support**

- [Xata Community](https://xata.io/community)
- [GitHub Issues](https://github.com/xataio/xata-js/issues)
- [Discord Server](https://discord.gg/xata)

---

## 🎯 **Getting Help**

### **Common Issues**

1. **Connection Errors**: Check API key and database URL
2. **Type Errors**: Ensure TypeScript types are up to date
3. **Performance Issues**: Review query optimization and indexing
4. **AI Integration**: Verify Ask Xata configuration and rules

### **Support Channels**

- **Internal**: Check project documentation and examples
- **Community**: Xata Discord and GitHub discussions
- **Official**: Xata support for enterprise customers

---

*This documentation is maintained by the Ultraterrestrial Resurrection development team. For updates and contributions, please refer to the project repository.*
