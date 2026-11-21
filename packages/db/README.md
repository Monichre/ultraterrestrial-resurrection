# @db - Database Package
**Last Updated**: July 30, 2025 15:45 EST  
**Status**: ✅ **FULLY OPERATIONAL** - All import issues resolved

Database abstraction layer for Ultraterrestrial Resurrection - UFO/UAP research platform with Xata integration, vector search, and comprehensive type safety.

> 🎉 **IMPORT RESOLUTION SUCCESS**: All import path errors have been resolved! The package is fully functional.  
> See [IMPORT_PATH_RESOLUTION_REPORT.md](./IMPORT_PATH_RESOLUTION_REPORT.md) for technical details.

## Installation

Install dependencies:

```bash
bun install
```

## Import Guide

This package provides multiple import paths for different use cases:

### Main Package (Registry & Types)

```typescript
// Import the provider registry and common types
import { PROVIDERS, xata } from "@db";

// Use the Xata client
const topics = await PROVIDERS.xata.client.db.topics.getAll();
```

### Registry Only

```typescript
// Import just the provider registry
import { PROVIDERS } from "@db/registry";

// Access Xata client
const client = PROVIDERS.xata.client;
```

### Complete Xata SDK

```typescript
// Import full Xata SDK (client, models, API functions)
import { xata, models, api } from "@db/xata";

// Or import specific parts
import { xata } from "@db/xata/client";
```

### Types Only

```typescript
// Import type definitions
import type { 
  TopicsRecord, 
  EventsRecord, 
  PersonnelRecord 
} from "@db/types";
```

## Available Scripts

```bash
# Development
bun run dev              # Watch mode development
bun run type-check       # TypeScript type checking

# Database Operations  
bun run test:db          # Test database connection
bun run seed             # Run main seeding script
bun run seed:simple      # Simple seed script
bun run fix-and-seed     # Fix issues and seed data
bun run analyze          # Database state analysis
bun run query            # Quick database queries

# Testing & Maintenance
bun test                 # Run tests
bun run clean            # Clean cache files
```

## Architecture

- **Provider Registry**: Centralized database connections (`registry.ts`)
- **Xata SDK**: Complete TypeScript SDK for Xata database
- **Models**: 15+ entity models with CRUD operations
- **Types**: Comprehensive TypeScript definitions
- **API Layer**: Search, AI, and XY Flow integrations

## Entity Models

The database includes comprehensive UFO/UAP research entities:

- `topics` - Research topics and categories
- `events` - UAP incidents and sightings  
- `personnel` - Key figures in UAP research
- `organizations` - Government agencies and research groups
- `testimonies` - Witness accounts with credibility scoring
- `documents` - Research documents and files
- `locations` - Geographic data with geospatial search
- And 20+ more specialized entities

## Features

- **Vector Search**: 1536-dimensional embeddings for semantic search
- **Geospatial Queries**: Location-based searches with radius filtering
- **Type Safety**: Comprehensive TypeScript definitions
- **Error Handling**: Robust error handling with context
- **Pagination**: Built-in pagination support
- **Bulk Operations**: Efficient batch processing

## Development

This package uses Bun as the runtime and is designed for TypeScript-first development within the Ultraterrestrial Resurrection monorepo.

## Current Status ✅

**Import Resolution**: All import path issues resolved as of July 30, 2025
- ✅ 63 import statements across 38 files working correctly
- ✅ Mindmap functionality operational and tested
- ✅ TypeScript source file imports working via workspace configuration
- ✅ Next.js transpilation handling .ts files correctly

**Package Health**:
- All export paths properly configured in package.json
- Workspace dependencies correctly linked
- No "Module not found" errors
- Full TypeScript type safety maintained

For technical details on the resolution process, see [IMPORT_PATH_RESOLUTION_REPORT.md](./IMPORT_PATH_RESOLUTION_REPORT.md).

## Troubleshooting

If you encounter import issues:
1. Run `bun install` from the monorepo root to ensure workspace linking
2. Verify Next.js includes `transpilePackages: ["@db"]` configuration  
3. Check that TypeScript path mappings are properly configured
4. See the resolution report for detailed technical analysis
