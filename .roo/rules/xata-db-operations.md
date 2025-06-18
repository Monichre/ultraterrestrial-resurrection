---
description: xata, database, db
globs: 
alwaysApply: false
---
# Xata Database Operations Guide

This guide provides a comprehensive reference for implementing CRUD (Create, Read, Update, Delete) operations on Xata database tables in the Ultraterrestrial Resurrection project.

## Database Schema Overview

Refer to [xata-schema.md](mdc:ultraterrestrial-resurrection/.roo/rules/xata-schema.md)

The Xata database contains the following tables:

### Core Tables
| Table | Description |
|-------|-------------|
| `topics` | Information about UFO/UAP-related topics |
| `personnel` | People involved in UFO/UAP cases (witnesses, experts, officials) |
| `events` | UFO/UAP incidents and historical events |
| `organizations` | Groups, agencies, and organizations |
| `sightings` | UFO/UAP sighting reports |
| `testimonies` | Witness statements and claims |
| `documents` | Documentation, reports, and files |
| `artifacts` | Physical evidence and artifacts |
| `locations` | Physical locations related to UFO/UAP incidents |
| `key-figures` | Key individuals in UFO/UAP research and history |
| `theories` | Explanatory theories about UFO/UAP phenomena |
| `tags` | Tags for categorizing content |
| `users` | System users |
| `user-notes` | User-created notes and theories |
| `mindmaps` | User-created mind maps for connecting information |

### Relationship Tables
| Table | Description |
|-------|-------------|
| `event-subject-matter-experts` | Connects events to subject matter experts |
| `event-topic-subject-matter-experts` | Links events, topics, and subject matter experts |
| `organization-members` | Connects organizations to their members |
| `topic-subject-matter-experts` | Links topics to subject matter experts |
| `topics-testimonies` | Connects topics to testimonies |
| `summary-files` | Links summaries to documents |

### User Relationship Tables
| Table | Description |
|-------|-------------|
| `user-saved-documents` | Documents saved by users |
| `user-saved-events` | Events saved by users |
| `user-saved-key-figure` | Key figures saved by users |
| `user-saved-organizations` | Organizations saved by users |
| `user-saved-sightings` | Sightings saved by users |
| `user-saved-testimonies` | Testimonies saved by users |
| `user-saved-topics` | Topics saved by users |

## Standard CRUD Operation Pattern

When implementing CRUD functionality for any Xata table, follow this standardized pattern:

### 1. Error Handling

```typescript
// Define a standardized error interface
interface TableOperationError extends Error {
  code: string;
  operation: string;
  details?: unknown;
}

// Create helper function for generating consistent errors
function createError(
  message: string,
  code: string,
  operation: string,
  details?: unknown
): TableOperationError {
  const error = new Error(message) as TableOperationError;
  error.code = code;
  error.operation = operation;
  error.details = details;
  return error;
}
```

### 2. Create Operations

```typescript
// Create a single record
export async function createRecord(
  data: Omit<TableRecord, "id" | "xata">
): Promise<TableRecordWithXata> {
  try {
    // Validate required fields
    if (!data.requiredField) {
      throw createError(
        "Required field is missing",
        "MISSING_REQUIRED_FIELD",
        "createRecord"
      );
    }

    return await xata.db.tableName.create(data);
  } catch (error) {
    console.error("Error creating record:", error);
    
    // Re-throw typed errors
    if ((error as TableOperationError).code) {
      throw error;
    }
    
    // Create and throw standardized error
    throw createError(
      `Failed to create record: ${(error as Error).message}`,
      "CREATE_FAILED",
      "createRecord",
      error
    );
  }
}

// Create multiple records
export async function createManyRecords(
  data: Omit<TableRecord, "id" | "xata">[]
): Promise<TableRecordWithXata[]> {
  try {
    // Validate input
    if (!Array.isArray(data) || data.length === 0) {
      throw createError(
        "Data must be a non-empty array",
        "INVALID_INPUT",
        "createManyRecords"
      );
    }
    
    // Validate each record
    for (const [index, item] of data.entries()) {
      if (!item.requiredField) {
        throw createError(
          `Record at index ${index} is missing required field`,
          "MISSING_REQUIRED_FIELD",
          "createManyRecords"
        );
      }
    }
    
    return await xata.db.tableName.create(data);
  } catch (error) {
    console.error("Error creating bulk records:", error);
    
    // Create and throw standardized error
    throw createError(
      `Failed to create multiple records: ${(error as Error).message}`,
      "BULK_CREATE_FAILED",
      "createManyRecords",
      error
    );
  }
}
```

### 3. Read Operations

```typescript
// Get a record by ID
export async function getRecordById(
  id: string,
  columns?: string[]
): Promise<TableRecordWithXata | null> {
  try {
    if (!id) {
      throw createError(
        "Record ID is required",
        "MISSING_ID",
        "getRecordById"
      );
    }

    if (columns && columns.length > 0) {
      // Use filter + getFirst for column selection
      return await xata.db.tableName.select(columns as any).filter({ id }).getFirst();
    }

    return await xata.db.tableName.read(id);
  } catch (error) {
    console.error(`Error getting record with ID ${id}:`, error);
    
    throw createError(
      `Failed to get record with ID ${id}: ${(error as Error).message}`,
      "GET_FAILED",
      "getRecordById",
      error
    );
  }
}

// Get all records with optional filtering, sorting, and pagination
export async function getAllRecords(options?: {
  filter?: Record<string, any>;
  sort?: { column: string; direction: "asc" | "desc" }[];
  page?: number;
  size?: number;
  columns?: string[];
  consistency?: "strong" | "eventual";
}): Promise<TableRecordWithXata[]> {
  try {
    const { filter, sort, page, size, columns, consistency } = options || {};

    let query = xata.db.tableName.filter(filter || {});

    if (columns && columns.length > 0) {
      query = query.select(columns as any);
    }

    if (sort?.length) {
      for (const { column, direction } of sort) {
        query = query.sort(column as any, direction);
      }
    }

    // Add consistency option if provided
    if (consistency === "eventual") {
      // Note: Add consistency option to query if needed
    }

    if (page && size) {
      const result = await query.getPaginated({
        pagination: { size, offset: (page - 1) * size },
      });
      return result.records as TableRecordWithXata[];
    }

    return await query.getMany() as TableRecordWithXata[];
  } catch (error) {
    console.error("Error getting all records:", error);
    
    throw createError(
      `Failed to get records: ${(error as Error).message}`,
      "QUERY_FAILED",
      "getAllRecords",
      error
    );
  }
}

// Get records with pagination
export async function getRecordsWithPagination(
  page = 1,
  size = 20,
  filter?: Record<string, any>,
  columns?: string[]
): Promise<PaginatedResponse<TableRecordWithXata>> {
  try {
    // Validate input
    if (page < 1) {
      throw createError(
        "Page number must be greater than 0",
        "INVALID_PAGE",
        "getRecordsWithPagination"
      );
    }

    if (size < 1 || size > 100) {
      throw createError(
        "Page size must be between 1 and 100",
        "INVALID_SIZE",
        "getRecordsWithPagination"
      );
    }

    let query = xata.db.tableName.filter(filter || {});

    if (columns && columns.length > 0) {
      query = query.select(columns as any);
    }

    const result = await query.getPaginated({
      pagination: { size, offset: (page - 1) * size },
    });

    return {
      records: result.records as TableRecordWithXata[],
      pagination: {
        page,
        size,
        total: undefined, // Xata doesn't provide total in current SDK version
        hasNextPage: typeof result.hasNextPage === 'function' ? result.hasNextPage() : !!result.hasNextPage,
      },
    };
  } catch (error) {
    console.error("Error getting paginated records:", error);
    
    throw createError(
      `Failed to get paginated records: ${(error as Error).message}`,
      "PAGINATION_FAILED",
      "getRecordsWithPagination",
      error
    );
  }
}

// Search records using text search_files
export async function searchRecords(
  searchQuery: string,
  options?: {
    fuzziness?: number;
    prefix?: "phrase" | "disabled";
    pagination?: { size?: number; offset?: number };
    filter?: Record<string, any>;
  }
): Promise<TableRecordWithXata[]> {
  try {
    // Validate input
    if (!searchQuery || searchQuery.trim() === "") {
      throw createError(
        "Search query is required",
        "MISSING_QUERY",
        "searchRecords"
      );
    }

    const searchOptions = {
      fuzziness: options?.fuzziness || 1,
      prefix: options?.prefix || "phrase",
      page: options?.pagination
        ? {
            size: options.pagination.size || 20,
            offset: options.pagination.offset || 0,
          }
        : undefined,
      filter: options?.filter,
    };

    const results = await xata.db.tableName.search_files(searchQuery, searchOptions);
    return results.records as TableRecordWithXata[];
  } catch (error) {
    console.error(`Error searching records with query "${searchQuery}":`, error);
    
    throw createError(
      `Failed to search_files records: ${(error as Error).message}`,
      "SEARCH_FAILED",
      "searchRecords",
      error
    );
  }
}

// Vector search_files for tables with embedding fields
export async function vectorSearchRecords(
  embedding: number[],
  options?: {
    maxResults?: number;
    filter?: Record<string, any>;
  }
): Promise<TableRecordWithXata[]> {
  try {
    const searchOptions = {
      maxResults: options?.maxResults || 10,
      filter: options?.filter,
    };

    const results = await xata.db.tableName.vectorSearch(
      "embedding",
      embedding,
      searchOptions
    );

    return results.records as TableRecordWithXata[];
  } catch (error) {
    console.error("Error in vector search_files:", error);
    
    throw createError(
      `Failed in vector search_files: ${(error as Error).message}`,
      "VECTOR_SEARCH_FAILED",
      "vectorSearchRecords",
      error
    );
  }
}
```

### 4. Update Operations

```typescript
// Update a single record
export async function updateRecord(
  id: string,
  data: Partial<Omit<TableRecord, "id" | "xata">>
): Promise<TableRecordWithXata | null> {
  try {
    // Validate input
    if (!id) {
      throw createError(
        "Record ID is required",
        "MISSING_ID",
        "updateRecord"
      );
    }

    if (!data || Object.keys(data).length === 0) {
      throw createError(
        "Update data is required",
        "MISSING_DATA",
        "updateRecord"
      );
    }

    // Verify the record exists before updating
    const exists = await xata.db.tableName.read(id);
    if (!exists) {
      return null;
    }

    return await xata.db.tableName.update(id, data);
  } catch (error) {
    console.error(`Error updating record with ID ${id}:`, error);
    
    throw createError(
      `Failed to update record with ID ${id}: ${(error as Error).message}`,
      "UPDATE_FAILED",
      "updateRecord",
      error
    );
  }
}

// Update multiple records
export async function updateManyRecords(
  filter: Record<string, any>,
  data: Partial<Omit<TableRecord, "id" | "xata">>
): Promise<{ numberOfRecordsUpdated: number }> {
  try {
    // Validate inputs
    if (!filter || Object.keys(filter).length === 0) {
      throw createError(
        "Filter criteria is required",
        "MISSING_FILTER",
        "updateManyRecords"
      );
    }

    if (!data || Object.keys(data).length === 0) {
      throw createError(
        "Update data is required",
        "MISSING_DATA",
        "updateManyRecords"
      );
    }

    // Get records matching the filter using filter chain
    const records = await xata.db.tableName.filter(filter).getMany() as TableRecordWithXata[];

    if (records.length === 0) {
      return { numberOfRecordsUpdated: 0 };
    }

    const updatePromises = records.map((record) =>
      xata.db.tableName.update(record.id, data)
    );

    const updatedRecords = await Promise.all(updatePromises);
    return { numberOfRecordsUpdated: updatedRecords.filter(Boolean).length };
  } catch (error) {
    console.error("Error updating multiple records:", error);
    
    throw createError(
      `Failed to update multiple records: ${(error as Error).message}`,
      "BULK_UPDATE_FAILED",
      "updateManyRecords",
      error
    );
  }
}
```

### 5. Delete Operations

```typescript
// Delete a single record
export async function deleteRecord(id: string): Promise<boolean> {
  try {
    // Validate input
    if (!id) {
      throw createError(
        "Record ID is required",
        "MISSING_ID",
        "deleteRecord"
      );
    }

    const deletedRecord = await xata.db.tableName.delete(id);
    return deletedRecord !== null;
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error);
    
    throw createError(
      `Failed to delete record with ID ${id}: ${(error as Error).message}`,
      "DELETE_FAILED",
      "deleteRecord",
      error
    );
  }
}

// Delete multiple records
export async function deleteManyRecords(
  filter: Record<string, any>
): Promise<{ numberOfRecordsDeleted: number }> {
  try {
    // Validate input
    if (!filter || Object.keys(filter).length === 0) {
      throw createError(
        "Filter criteria is required",
        "MISSING_FILTER",
        "deleteManyRecords"
      );
    }

    // Get records matching the filter using filter chain
    const records = await xata.db.tableName.filter(filter).getMany() as TableRecordWithXata[];

    if (records.length === 0) {
      return { numberOfRecordsDeleted: 0 };
    }

    const deletePromises = records.map((record) =>
      xata.db.tableName.delete(record.id)
    );

    const deletedRecords = await Promise.all(deletePromises);
    return { numberOfRecordsDeleted: deletedRecords.filter(Boolean).length };
  } catch (error) {
    console.error("Error deleting multiple records:", error);
    
    throw createError(
      `Failed to delete multiple records: ${(error as Error).message}`,
      "BULK_DELETE_FAILED",
      "deleteManyRecords",
      error
    );
  }
}
```

## Xata Query Methods Reference

Based on the [Xata TypeScript SDK documentation](mdc:https:/lite.xata.io/docs/sdk/get#paginating-results), the following methods are available:

### Query Methods
- `getFirst()` - Returns the first record or null
- `getFirstOrThrow()` - Returns the first record or throws error
- `getPaginated()` - Returns paginated results with different response structure
- `getMany()` - Returns specified number of records (default 20)
- `getAll()` - Returns all records (dangerous on large tables)

### Method Chaining
Use filter chains instead of query() method:

```typescript
// ✅ Correct pattern
let query = xata.db.tableName.filter(filterObject);
query = query.select(['column1', 'column2']);
query = query.sort('column', 'asc');
const results = await query.getMany();

// ❌ Incorrect - query() method doesn't exist
const results = await xata.db.tableName.query(queryOptions);
```

### Pagination Pattern

```typescript
// ✅ Correct pagination
const page = await xata.db.tableName.getPaginated({
  pagination: { size: 20, offset: 0 }
});

const records = page.records;
const hasNextPage = page.hasNextPage(); // Method call
const nextPage = await page.nextPage();
```

## Table-Specific Implementation

When implementing CRUD for a specific table, replace the generic code above with the appropriate table name and types. For example:

```typescript
import { xata } from "../client";
import type { TopicsRecord, Topics } from "../xata"; // Import specific table types

// Error handling
interface TopicsOperationError extends Error {
  code: string;
  operation: string;
  details?: unknown;
}

// Create helper
function createTopicError(
  message: string,
  code: string,
  operation: string,
  details?: unknown
): TopicsOperationError {
  const error = new Error(message) as TopicsOperationError;
  error.code = code;
  error.operation = operation;
  error.details = details;
  return error;
}

// Create operation
export async function createTopic(
  data: Omit<Topics, "id" | "xata">
): Promise<TopicsRecord> {
  try {
    // Validate required fields for topics table
    if (!data.title) {
      throw createTopicError(
        "Topic title is required",
        "MISSING_REQUIRED_FIELD",
        "createTopic"
      );
    }

    return await xata.db.topics.create(data);
  } catch (error) {
    console.error("Error creating topic:", error);
    
    if ((error as TopicsOperationError).code) {
      throw error;
    }
    
    throw createTopicError(
      `Failed to create topic: ${(error as Error).message}`,
      "CREATE_FAILED",
      "createTopic",
      error
    );
  }
}

// Get topics with proper filter chain
export async function getAllTopics(
  filter?: Record<string, any>,
  columns?: string[]
): Promise<TopicsRecord[]> {
  try {
    let query = xata.db.topics.filter(filter || {});
    
    if (columns && columns.length > 0) {
      query = query.select(columns as any);
    }
    
    return await query.getMany() as TopicsRecord[];
  } catch (error) {
    console.error("Error getting topics:", error);
    throw createTopicError(
      `Failed to get topics: ${(error as Error).message}`,
      "GET_FAILED",
      "getAllTopics",
      error
    );
  }
}
```

## Table Schemas and Required Fields

### Topics Table
- **Required fields**: `title`
- **Special fields**: `embedding` (vector field with 1536 dimensions)
- **Relations**: Referenced by topic-subject-matter-experts, topics-testimonies, event-topic-subject-matter-experts, user-saved-topics

### Personnel Table
- **Required fields**: `name`
- **Special fields**: `embedding` (vector field with 1536 dimensions)
- **Relations**: Referenced by organization-members, event-subject-matter-experts, topic-subject-matter-experts, testimonies, event-topic-subject-matter-experts, user-saved-key-figure, documents

### Events Table
- **Required fields**: `title`
- **Special fields**: `embedding` (vector field with 1536 dimensions), `metadata` (JSON), `latitude`/`longitude` (for geo queries)
- **Relations**: Referenced by event-subject-matter-experts, testimonies, event-topic-subject-matter-experts, user-saved-events

### Organizations Table
- **Required fields**: `title`, `name`
- **Special fields**: `embedding` (vector field with 500 dimensions)
- **Relations**: Referenced by organization-members, testimonies, user-saved-organizations, documents

### Testimonies Table
- **Required fields**: `claim`
- **Special fields**: `embedding` (vector field with 1536 dimensions)
- **Relations**: Links to event, witness (personnel), organization; Referenced by topics-testimonies, user-saved-testimonies

### Documents Table
- **Required fields**: `title`
- **Special fields**: `embedding` (vector field with 1536 dimensions), `metadata` (JSON), `processed` (boolean)
- **Relations**: Links to author (personnel), organization; Referenced by user-saved-documents, summary-files

### Users Table
- **Required fields**: `email` (unique)
- **Relations**: Referenced by user-saved-events, user-saved-topics, user-saved-key-figure, user-saved-testimonies, user-saved-documents, user-notes, user-saved-organizations, user-saved-sightings, mindmaps

### User-Notes Table
- **Required fields**: `name`
- **Relations**: Links to user; Referenced by user-saved-sightings, user-saved-testimonies, user-saved-topics, user-saved-key-figure, user-saved-organizations, user-saved-events, user-saved-documents

## Best Practices

1. **Use Filter Chains**: Always use `filter().getMany()`, `filter().getPaginated()`, `filter().getFirst()` instead of non-existent `query()` method
2. **Type Safety**: Use `Record<string, any>` for filter types
3. **Validation**: Always validate input data before sending to the database
4. **Error Handling**: Use standardized error types and codes for consistent error handling
5. **Pagination**: Use `getPaginated()` for paginated results with proper response handling
6. **Field Selection**: Use `select()` in filter chains for column selection
7. **Consistency**: Use "eventual" consistency for better performance where appropriate
8. **Vector Search**: For tables with embedding fields, implement semantic search_files functionality

## Common Patterns

### Implementing Semantic Search

For tables with embedding fields:

```typescript
export async function semanticSearch(
  embedding: number[],
  options?: {
    maxResults?: number;
    filter?: Record<string, any>;
  }
): Promise<TableRecordWithXata[]> {
  try {
    const searchOptions = {
      maxResults: options?.maxResults || 10,
      filter: options?.filter,
    };
    
    // Perform vector search_files
    const results = await xata.db.tableName.vectorSearch(
      "embedding", 
      embedding, 
      searchOptions
    );
    
    return results.records as TableRecordWithXata[];
  } catch (error) {
    console.error(`Error in semantic search_files:`, error);
    
    throw createError(
      `Failed in semantic search_files: ${(error as Error).message}`,
      "VECTOR_SEARCH_FAILED",
      "semanticSearch",
      error
    );
  }
}
```

### Implementing Geo-Based Queries

For tables with latitude/longitude fields:

```typescript
export async function getRecordsByLocation(
  latitude: number,
  longitude: number,
  radiusKm: number
): Promise<TableRecordWithXata[]> {
  try {
    // Convert radius to degrees (approximately)
    const radiusDegrees = radiusKm / 111.32;
    
    // Calculate bounding box for initial filtering
    const filter = {
      $all: [
        { latitude: { $gte: latitude - radiusDegrees } },
        { latitude: { $lte: latitude + radiusDegrees } },
        { longitude: { $gte: longitude - radiusDegrees } },
        { longitude: { $lte: longitude + radiusDegrees } },
      ],
    };
    
    // Get records in bounding box using filter chain
    const records = await xata.db.tableName.filter(filter).getMany() as TableRecordWithXata[];
    
    // Further filter by exact distance
    return records.filter((record) => {
      if (!record.latitude || !record.longitude) return false;
      
      const distance = calculateDistance(
        latitude,
        longitude,
        record.latitude,
        record.longitude
      );
      
      return distance <= radiusKm;
    });
  } catch (error) {
    console.error("Error getting records by location:", error);
    
    throw createError(
      `Failed to get records by location: ${(error as Error).message}`,
      "GEOSEARCH_FAILED",
      "getRecordsByLocation",
      error
    );
  }
}

// Haversine formula for calculating distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
```

## Working Example Files

The project contains working model implementations following these correct patterns:

- [events.ts](mdc:ultraterrestrial-resurrection/packages/db/xata/models/events.ts) - **Fully refactored and working**
- [topics.ts](mdc:ultraterrestrial-resurrection/packages/db/xata/models/topics.ts)
- [testimonies.ts](mdc:ultraterrestrial-resurrection/packages/db/xata/models/testimonies.ts)
- [key-figures.ts](mdc:ultraterrestrial-resurrection/packages/db/xata/models/key-figures.ts)
- [user-notes.ts](mdc:ultraterrestrial-resurrection/packages/db/xata/models/user-notes.ts)

**Reference the refactored events.ts file for the most up-to-date patterns** when creating new model files.

## Key Changes from Previous Version

1. **Removed `query()` method** - This method doesn't exist in the Xata TypeScript SDK
2. **Replaced `RecordFilterExpression`** - Use `Record<string, any>` for filter types
3. **Fixed pagination patterns** - Use `getPaginated()` with proper response handling
4. **Updated filter chains** - Use `filter().getMany()`, `filter().getFirst()`, etc.
5. **Added consistency options** - Support for "eventual" consistency
6. **Improved type safety** - Proper type assertions and method chaining
7. **Fixed method signatures** - All patterns now match working Xata SDK usage
