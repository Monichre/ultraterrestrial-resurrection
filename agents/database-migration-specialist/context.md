# Database Migration Specialist - Context

**Agent ID:** `database-migration-specialist`
**Current Status:** Ready to begin table seeding (migration already complete)

## Technical Context

### Database Architecture
- **Current State:** Postgres Wire Enabled Xata instance already migrated
- **Records:** 230,998+ records across 29 entity models
- **Schema Definition:** `packages/db/xata/xata.ts` (lines 9-410)

### Connection Configuration
```typescript
// packages/db/xata/xata.ts
const defaultOptions = {
  databaseURL: "https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial",
  apiKey: process.env.XATA_API_KEY,
};
```

### Environment Variables
- **Global:** `.env` (lines 47-48) - XATA_DATABASE_URL, XATA_API_KEY  
- **App Local:** `apps/app/.env.local` (lines 1-2) - XATA_API_KEY, XATA_BRANCH

### Database Models (29 total)
Key entities requiring seeding verification:
- `topics` (line 11) - Core UFO/UAP topics
- `personnel` (line 32) - Key figures and witnesses  
- `events` (line 64) - UFO/UAP incidents
- `organizations` (line 87) - Related organizations
- `sightings` (line 105) - Public sighting reports
- `testimonies` (line 158) - Witness testimonies
- `documents` (line 189) - Evidence documents

### Critical Files to Monitor
- `packages/db/xata/client.ts` - Database client
- `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts` - Query integration point
- `apps/app/scripts/xata-exports/` - Existing export/backup scripts

### Coordination Dependencies
- **Agent 3 Dependency:** `xataToXYFlow` debugging depends on database being properly seeded
- **Shared Environment:** All agents must use consistent connection settings

### Available Tools & Scripts
- Export scripts: `apps/app/scripts/xata-exports/backup.sh`
- CSV data available: `apps/app/scripts/xata-exports/exports/*.csv`
- Import utilities: `apps/disclosure-rag/` has various import scripts