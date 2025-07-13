# Events.ts Refactoring Pseudocode

## Overview
Refactor events.ts to follow correct Xata TypeScript SDK patterns and fix compilation errors.

## Key Issues to Fix
1. Import `RecordFilterExpression` from wrong location - not available in current SDK
2. Method call errors: `select().read()` doesn't work
3. `query()` method usage is incorrect - should use filter chains
4. Pagination response structure issues
5. Type mismatches with filter parameters

## Correct Patterns (from working files)
- Import `xata` from "../client"
- Import types from "../xata" 
- Use `Record<string, any>` for filter types
- Use chain methods: `filter().getMany()`, `filter().getPaginated()`
- Use `getFirst()` for single records
- Use `select()` and `sort()` in chains correctly

## Refactoring Plan

### Imports
```typescript
import { xata } from "../client";
import type { EventsRecord, Events } from "../xata";
```

### Error Handling
- Keep comprehensive error handling structure
- Fix any type issues with error interfaces

### CRUD Operations Structure

#### CREATE Operations
- `createEvent(data)` - create single event
- `createManyEvents(data[])` - bulk create events

#### READ Operations  
- `getEventById(id, columns?)` - get by ID with optional column selection
- `getEventByTitle(title, columns?)` - get by unique title
- `getAllEvents(options?)` - get all with filtering/sorting/pagination
- `getEventsWithPagination(page, size, filter?, columns?)` - paginated results
- `searchEvents(query, options?)` - text search
- `semanticSearchEvents(embedding, options?)` - vector search
- `getEventsByLocation(lat, lng, radius)` - geo search

#### UPDATE Operations
- `updateEvent(id, data)` - update single event
- `updateManyEvents(filter, data)` - bulk update

#### DELETE Operations  
- `deleteEvent(id)` - delete single event
- `deleteManyEvents(filter)` - bulk delete

### Method Call Fixes

#### Read Operations
```typescript
// Fix: Don't use select().read()
// Instead: Use read() directly or filter().getFirst()

// For getEventById with columns:
if (columns) {
  return await xata.db.events.select(columns).filter({ id }).getFirst();
} else {
  return await xata.db.events.read(id);
}
```

#### Query Operations
```typescript
// Fix: Don't use query() method
// Instead: Use filter() chains

let query = xata.db.events.filter(filter || {});

if (columns) {
  query = query.select(columns);
}

if (sort) {
  for (const { column, direction } of sort) {
    query = query.sort(column, direction);
  }
}

// For pagination:
const result = await query.getPaginated({
  pagination: { size, offset: (page - 1) * size },
});

// For all results:
const results = await query.getMany();
```

#### Pagination Response
```typescript
// Fix: Use correct pagination response structure
return {
  records: result.records,
  pagination: {
    page,
    size,
    total: result.pagination?.total,
    hasNextPage: result.hasNextPage(), // Function call, not property
  },
};
```

#### Geographic Search
```typescript
// Fix: Use proper filter structure for geo search
const filter = {
  latitude: { $gte: lat - radius, $lte: lat + radius },
  longitude: { $gte: lng - radius, $lte: lng + radius },
};

const results = await xata.db.events.filter(filter).getMany();
```

### Type Updates
- Replace `RecordFilterExpression<EventsRecord>` with `Record<string, any>`
- Fix column selection types
- Update sort parameter types
- Fix pagination response types

## Implementation Notes
- Keep comprehensive error handling and validation
- Maintain all existing functionality
- Use working patterns from documents.ts and organizations.ts
- Test compilation after refactoring
- Ensure all method calls follow current Xata SDK patterns 