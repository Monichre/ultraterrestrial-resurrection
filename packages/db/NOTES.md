# Database Provider Registry Documentation

## Overview

The `registry.ts` file creates a provider registry for database connections in the application. This implementation follows a centralized registry pattern which provides a clean abstraction layer for accessing different database providers.

## Key Components

1. **PROVIDERS Object**:
   - A centralized registry that currently only includes Xata as a data provider
   - Designed to be extendable with additional providers (Supabase, Convex, etc.)
   - Exported as a constant with readonly typing

2. **Type Definitions**:
   - `ProviderRegistry`: Type representing the shape of the PROVIDERS object
   - `ProviderKey`: Type representing the valid keys for accessing providers (currently just "xata")

## Usage Examples

### Centralized Access

```typescript
import { PROVIDERS } from "@/packages/db/registry";

// Access any provider
const data = await PROVIDERS.xata.db.events.getAll();
```

### Provider Selection

```typescript
import { PROVIDERS, type ProviderKey } from "@/packages/db/registry";

function getDataWithProvider(providerKey: ProviderKey) {
  const provider = PROVIDERS[providerKey];
  return provider.db.someTable.getAll();
}
```

## Implementation Details

The registry is implemented as a simple object that imports and aggregates initialized database clients:

```typescript
import { xata } from "./xata/client";

export const PROVIDERS = {
  xata,
  // Future additions:
  // supabase: supabaseClient,
  // convex: convexClient,
} as const;

export type ProviderRegistry = typeof PROVIDERS;
export type ProviderKey = keyof ProviderRegistry;
```

## Benefits

1. **Abstraction**: Provides a clean interface for database access
2. **Extensibility**: Makes it easy to add new providers
3. **Consistency**: Ensures consistent access to different data sources
4. **Discoverability**: Makes available providers easy to discover and use

## Monorepo Architecture Integration

In a proper Turbo monorepo setup, this registry should:

1. Live in a shared package (e.g., `packages/db`)
2. Be imported by apps using a package name (e.g., `@ultraterrestrial/db`)
3. Abstract implementation details behind a consistent interface

Current usage in the codebase doesn't fully adhere to monorepo best practices, as some files are directly importing from app-local paths instead of using the shared package. 