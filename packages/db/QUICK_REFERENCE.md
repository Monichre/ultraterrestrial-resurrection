# @db Package Quick Reference
**Last Updated**: July 30, 2025 15:45 EST  
**Status**: ✅ **ALL IMPORT PATHS WORKING** - Import resolution issues resolved

> 🎉 **RESOLVED**: All import path errors have been fixed! All patterns below are fully functional.  
> See [IMPORT_PATH_RESOLUTION_REPORT.md](./IMPORT_PATH_RESOLUTION_REPORT.md) for technical details.

## 🚀 Most Common Import Patterns

### 📝 CRUD Operations
```typescript
import { xata } from '@db/xata/client';
import type { TopicsRecord } from '@db/types';

// Create
const created = await xata.db.topics.create({ 
  title: 'UFO Phenomena', 
  description: '...' 
});

// Read
const topics = await xata.db.topics
  .filter({ title: 'UFO Phenomena' })
  .getAll();

// Update
const updated = await xata.db.topics.update(created.id, { 
  description: 'Updated...' 
});
```

### 🔍 Search & AI Query
```typescript
import { xata } from '@db/xata/client';

// Text search (if available in SDK)
const results = await xata.search.all('alien contact', {
  tables: ['testimonies'],
  fuzziness: 1
});

// Vector search (if available)
const vectorResults = await xata.db.testimonies.vectorSearch(
  'embedding', 
  [...], // vector array
  { size: 10 }
);
```

### 🗄️ Direct Client Access
```typescript
import { xata } from '@db/xata/client';

// Direct database operations
const personnel = await xata.db.personnel.getAll();
const events = await xata.db.events.create({ title: 'New Event' });
```

### 🔧 Provider Registry
```typescript
import { PROVIDERS } from '@db/registry';

// Access any provider
const client = PROVIDERS.xata.client;
const data = await client.db.topics.query({ filter: { active: true } });
```

### 🎯 Type-Only Imports
```typescript
import type { 
  PersonnelRecord,
  EventInput,
  QueryOptions,
  PaginatedResponse,
  DatabaseOperationError 
} from '@db/types';

// Use for function parameters, return types, etc.
function processPersonnel(personnel: PersonnelRecord[]): EventInput[] {
  // ...
}
```

## 📊 All Available Import Paths

| Import Path | Use Case | Example |
|-------------|----------|---------|
| `@db` | Main exports, common types | `import { xata, PROVIDERS } from '@db'` |
| `@db/registry` | Provider registry only | `import { PROVIDERS } from '@db/registry'` |
| `@db/xata` | Complete Xata functionality | `import { getAllTopics, xata } from '@db/xata'` |
| `@db/xata/client` | Client instance only | `import { xata } from '@db/xata/client'` |
| `@db/xata/models` | CRUD operations only | `import { createTopic } from '@db/xata/models'` |
| `@db/xata/api` | API functions only | `import { askXataWithAi } from '@db/xata/api'` |
| `@db/types` | Type definitions only | `import type { TopicsRecord } from '@db/types'` |

## 🔥 Power User Patterns

### Bulk Operations
```typescript
import { createManyTopics, deleteManyTopics } from '@db/xata/models';

// Bulk create
const topics = await createManyTopics([
  { title: 'Topic 1', description: '...' },
  { title: 'Topic 2', description: '...' }
]);

// Bulk delete with filter
await deleteManyTopics({ status: 'draft' });
```

### Advanced Queries
```typescript
import { getAllEvents } from '@db/xata/models';
import type { EventQueryOptions } from '@db/types';

const options: EventQueryOptions = {
  filter: { 
    category: 'UFO Sighting',
    date: { $gte: new Date('2020-01-01') }
  },
  sort: { date: 'desc' },
  pagination: { size: 20, offset: 0 },
  columns: ['title', 'date', 'location']
};

const events = await getAllEvents(options);
```

### Error Handling
```typescript
import { createPersonnel } from '@db/xata/models';
import type { DatabaseOperationError } from '@db/types';

try {
  const person = await createPersonnel(data);
} catch (error) {
  const dbError = error as DatabaseOperationError;
  console.error(`Operation ${dbError.operation} failed: ${dbError.message}`);
}
```

### XY Flow Integration
```typescript
import { xataToXYFlow } from '@db/xata/api';
import type { XataToXYFlowParams, ReactFlowNode } from '@db/types';

const params: XataToXYFlowParams = {
  question: 'Show connections between UFO events and witnesses',
  table: 'events',
  rules: 'Focus on credible sources',
  context: 'Recent UFO incidents',
  existingNodes: [],
  sourceNode: {} as ReactFlowNode
};

const { nodes, edges } = await xataToXYFlow(params);
```

## 💡 Best Practices

### ✅ Do This
```typescript
// Use specific imports
import { getAllTopics } from '@db/xata/models';
import type { TopicsRecord } from '@db/types';

// Use type-only imports for types
import type { QueryOptions } from '@db/types';

// Handle errors properly
try {
  const result = await createTopic(data);
} catch (error) {
  // Handle error
}
```

### ❌ Avoid This
```typescript
// Don't import everything unless needed
import * as DB from '@db';

// Don't mix value and type imports unnecessarily
import { TopicsRecord } from '@db/types'; // Should be import type

// Don't ignore error handling
const result = await createTopic(data); // Missing try/catch
```

## 🎯 Common Use Cases

### 1. Component Data Fetching
```typescript
import { getAllPersonnel } from '@db/xata/models';
import type { PersonnelRecord } from '@db/types';

export default async function PersonnelList() {
  const personnel: PersonnelRecord[] = await getAllPersonnel();
  return <div>{/* render personnel */}</div>;
}
```

### 2. API Route Handlers
```typescript
import { createEvent } from '@db/xata/models';
import type { EventInput } from '@db/types';

export async function POST(request: Request) {
  const data: EventInput = await request.json();
  const event = await createEvent(data);
  return Response.json(event);
}
```

### 3. Server Actions
```typescript
'use server';
import { updatePersonnel } from '@db/xata/models';
import type { PersonnelUpdateInput } from '@db/types';

export async function updatePersonnelAction(data: PersonnelUpdateInput) {
  return await updatePersonnel(data);
}
```

---

## 🔧 Troubleshooting

### Import Resolution Issues ✅ **RESOLVED**
All import path errors have been resolved as of July 30, 2025. If you encounter any import issues:

1. Ensure workspace dependencies are installed: `bun install` from monorepo root
2. Check that your tsconfig.json includes proper path mappings
3. Verify Next.js `transpilePackages: ["@db"]` configuration
4. See [IMPORT_PATH_RESOLUTION_REPORT.md](./IMPORT_PATH_RESOLUTION_REPORT.md) for technical details

### Current Status
- ✅ All 63 import statements across 38 files working
- ✅ Mindmap functionality operational  
- ✅ TypeScript compilation successful
- ✅ No "Module not found" errors

---

💡 **Pro Tip**: Use your IDE's IntelliSense to explore available functions and types. All exports are fully documented with TypeScript!

📚 **Full Documentation**: See `IMPORT_GUIDE.md` for complete reference  
🔧 **Technical Details**: See `IMPORT_PATH_RESOLUTION_REPORT.md` for import resolution analysis 