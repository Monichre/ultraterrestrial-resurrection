# Xata TypeScript SDK Code Examples

**Version**: 1.0.0  
**Last Updated**: August 8, 2025  
**Package**: @db - Database abstraction layer for Ultraterrestrial Resurrection

---

## 🚀 **Quick Start Examples**

### **Basic Client Setup**

```typescript
import { xata } from '@db/xata/client';

// Simple query
const topics = await xata.db.topics.getAll();

// With filters
const highCredibilityPersonnel = await xata.db.personnel
  .filter('credibility', 'gte', 8)
  .getMany();
```

### **Provider Registry Usage**

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

---

## 📊 **CRUD Operations**

### **Create Records**

```typescript
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

### **Read Records**

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

### **Update Records**

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

### **Delete Records**

```typescript
// Delete single record
await xata.db.topics.delete('rec_abc123...');

// Delete with filter
await xata.db.sightings.deleteMany({
  date: { $lt: '2020-01-01' }
});
```

---

## 🔍 **Advanced Queries**

### **Relationship Queries**

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

### **Aggregation Queries**

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

## 🤖 **Ask Xata AI Examples**

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

## 🔍 **Vector Search Examples**

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

## 📱 **Integration Examples**

### **Next.js API Routes**

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

## ⚡ **Performance Examples**

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

## 🛠️ **Error Handling Examples**

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

## 🧪 **Testing Examples**

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

## 🔒 **Security Examples**

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

---

*For more comprehensive examples and advanced usage patterns, refer to the main [Xata TypeScript SDK Guide](./XATA_TYPESCRIPT_SDK_GUIDE.md).*
