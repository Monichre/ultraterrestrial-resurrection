# @db Package Import Guide

This document provides a comprehensive guide to all available imports from the `@db` package in the Ultraterrestrial Resurrection monorepo.

## Table of Contents

- [@db Package Import Guide](#db-package-import-guide)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Main Package Exports](#main-package-exports)
  - [Registry Exports](#registry-exports)
  - [Xata Module Exports](#xata-module-exports)
  - [Client-Only Exports](#client-only-exports)
  - [Models-Only Exports](#models-only-exports)
  - [API-Only Exports](#api-only-exports)
  - [Type-Only Exports](#type-only-exports)
  - [Common Usage Patterns](#common-usage-patterns)
    - [1. Basic Client Usage](#1-basic-client-usage)
    - [2. Using Models](#2-using-models)
    - [3. Using API Functions](#3-using-api-functions)
    - [4. Using Provider Registry](#4-using-provider-registry)
    - [5. Type-Safe Operations](#5-type-safe-operations)
    - [6. Complete Import (Everything)](#6-complete-import-everything)
  - [Best Practices](#best-practices)
  - [TypeScript Support](#typescript-support)

## Overview

The `@db` package provides access to the database layer through multiple export paths, allowing you to import exactly what you need for your use case.

```typescript
// Available import paths
import { ... } from '@db'                    // Main exports (registry + types)
import { ... } from '@db/registry'          // Provider registry only
import { ... } from '@db/xata'              // Complete Xata SDK
import { ... } from '@db/xata/client'       // Xata client only
import { ... } from '@db/types'             // Type definitions only
```

## Main Package Exports

**Import Path:** `@db`

**Available Exports:**

```typescript
import { 
  // Provider Registry
  PROVIDERS,
  ProviderRegistry,
  ProviderKey,
  
  // Direct client access
  xata,
  
  // Common types
  XataClient,
  DatabaseSchema,
  TopicsRecord,
  PersonnelRecord,
  EventsRecord,
  OrganizationsRecord,
  TestimoniesRecord,
  SightingsRecord,
  DocumentsRecord,
  UsersRecord,
  Topics,
  Personnel,
  Events,
  Organizations,
  Testimonies,
  Sightings,
  Documents,
  Users,
  
  // All type definitions
  // ... (all types from ./types)
} from '@db';
```

## Registry Exports

**Import Path:** `@db/registry`

**Available Exports:**

```typescript
import { 
  PROVIDERS,      // Main provider registry object
  ProviderRegistry, // Type for the registry
  ProviderKey     // Union type of available provider keys
} from '@db/registry';

// Usage
const client = PROVIDERS.xata.client;
```

## Xata Module Exports

**Import Path:** `@db/xata`

**Available Exports:**

```typescript
import { 
  // Client & Core
  XataClient,
  getXataClient,
  xata,
  tables,
  DatabaseSchema,
  
  // All generated types
  Topics,
  Personnel,
  Events,
  Organizations,
  Sightings,
  // ... all other entity types
  
  // All record types
  TopicsRecord,
  PersonnelRecord,
  EventsRecord,
  // ... all other record types
  
  // All model functions
  getPersonnelById,
  getAllPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
  searchPersonnel,
  // ... all other model functions
  
  // All API functions
  askXataWithAi,
  askXata,
  searchXata,
  fetchRecords,
  xataToXYFlow,
  // ... all other API functions
} from '@db/xata';
```

## Client-Only Exports

**Import Path:** `@db/xata/client`

**Available Exports:**

```typescript
import { 
  xata  // The Xata client instance
} from '@db/xata/client';

// Usage
const topics = await xata.db.topics.getAll();
```

**Note:** Individual model and API functions are accessed through the complete Xata SDK import (`@db/xata`) rather than separate export paths.

## Type-Only Exports

**Import Path:** `@db/types`

**Available Exports:**

```typescript
import type { 
  // All generated Xata types
  Topics,
  Personnel,
  Events,
  Organizations,
  Sightings,
  // ... all other entity types
  
  // All record types
  TopicsRecord,
  PersonnelRecord,
  EventsRecord,
  // ... all other record types
  
  // Input types
  PersonnelInput,
  OrganizationInput,
  EventInput,
  TopicInput,
  TestimonyInput,
  // ... all other input types
  
  // Update types
  PersonnelUpdateInput,
  OrganizationUpdateInput,
  EventUpdateInput,
  TopicUpdateInput,
  TestimonyUpdateInput,
  // ... all other update types
  
  // Model interfaces
  PersonnelModel,
  OrganizationsModel,
  EventsModel,
  TopicsModel,
  TestimoniesModel,
  
  // API interfaces
  XataApiService,
  XataHelperService,
  
  // Utility types
  QueryOptions,
  PaginatedResponse,
  SearchOptions,
  VectorSearchOptions,
  DatabaseOperationError,
  RecordWithoutMeta,
  RecordUpdate,
  CreateInput,
  
  // Provider types
  ProviderRegistry,
  ProviderKey,
  
  // Complete export interface
  CompleteDbPackageExports,
  RecordTypes,
  InputTypes,
  UpdateTypes,
  AnyRecord,
  AnyInput,
  AnyUpdate,
} from '@db/types';
```

## Common Usage Patterns

### 1. Basic Client Usage

```typescript
import { xata } from '@db/xata/client';

// Direct database operations
const topics = await xata.db.topics.getAll();
const user = await xata.db.users.create({ email: 'test@example.com' });
```

### 2. Using Xata SDK

```typescript
import { xata, models, api } from '@db/xata';

// Using models (if available)
const personnel = await models.getAllPersonnel?.();

// Using API functions  
const answer = await api.askXataWithAi?.({
  table: 'topics',
  question: 'What are the main UFO phenomena?'
});

// Direct client access
const topics = await xata.db.topics.getAll();
```

### 4. Using Provider Registry

```typescript
import { PROVIDERS } from '@db/registry';

const client = PROVIDERS.xata.client;
const data = await client.db.events.getAll();
```

### 5. Type-Safe Operations

```typescript
import type { 
  TopicsRecord, 
  EventsRecord
} from '@db/types';
import { xata } from '@db/xata/client';

// Type-safe queries
const events: EventsRecord[] = await xata.db.events
  .filter({ category: 'UFO Sighting' })
  .getAll();
```

### 6. Complete Import (Everything)

```typescript
import { 
  xata,
  PROVIDERS,
  TopicsRecord,
  EventsRecord
} from '@db';

// All functionality available
const topics = await xata.db.topics.getAll();
const client = PROVIDERS.xata.client;
```

## Best Practices

1. **Import Only What You Need**: Use specific import paths to keep bundle size small
2. **Use Type-Only Imports**: Import types with `import type` when you only need them for TypeScript
3. **Consistent Patterns**: Use the same import style throughout your application
4. **Model Functions**: Prefer model functions over direct client access for business logic
5. **Error Handling**: All database operations can throw errors, so wrap in try-catch blocks

## TypeScript Support

All exports are fully typed with TypeScript. The package provides:

- Complete type definitions for all database entities
- Function overloads for different parameter combinations
- Generic types for custom queries and filters
- Utility types for common patterns
- Full IntelliSense support in IDEs

For the most up-to-date type information, refer to the type definitions in the package or use your IDE's IntelliSense features.
