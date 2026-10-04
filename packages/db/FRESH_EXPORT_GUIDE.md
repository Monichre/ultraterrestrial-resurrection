# Fresh Data Export Guide

## Why Re-export?

The current CSV exports have formatting issues:
- **users.csv**: Duplicate headers/rows (corrupted export)
- **events.csv**: Multi-line descriptions breaking CSV parsing
- **Inconsistent quoting**: Some files have malformed quote handling

## Option 1: Fresh Xata Export (Recommended)

### Via Xata CLI:
```bash
# Install Xata CLI if not already installed
npm install -g @xata.io/cli

# Login to Xata
xata auth login

# Export all tables with proper CSV formatting
xata table export users --output users.csv --format csv
xata table export organizations --output organizations.csv --format csv
xata table export personnel --output personnel.csv --format csv
xata table export events --output events.csv --format csv
xata table export topics --output topics.csv --format csv
xata table export testimonies --output testimonies.csv --format csv
xata table export documents --output documents.csv --format csv
xata table export sightings --output sightings.csv --format csv
```

### Via Xata Web UI:
1. Go to https://app.xata.io
2. Navigate to your database
3. For each table: 
   - Click "Export"
   - Choose "CSV" format
   - Download clean export

## Option 2: Use Existing Data with Fixes

If the current exports represent the actual data state and you want to keep them:

```bash
# Run the CSV fixer script
node fix-and-seed.ts
```

This will:
- Clean duplicate headers
- Handle multi-line values
- Parse malformed quotes
- Import clean records

## Option 3: Check Source Database

The CSV exports might be from an **old/different Xata instance**. Check:

1. **Current database URL**: `https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial`
2. **Export source**: Where did these CSVs come from originally?
3. **Data freshness**: Are these exports current or historical?

## Recommended Action:

1. **First**: Try fresh export from current Xata instance
2. **If empty**: The current database really is empty and these CSVs are from elsewhere
3. **If has data**: Use fresh exports (they'll be clean)
4. **If still need CSVs**: Use the fix-and-seed script as fallback

## Quick Test:

Let's check if the current Xata database has any data:

```typescript
// Run this to see current state
import { xata } from './src/xata-typescript-sdk/client';

// Check if database already has data
const users = await xata.db.users.getMany();
const events = await xata.db.events.getMany();
console.log(`Users: ${users.length}, Events: ${events.length}`);
```

## Bottom Line:

**If the current Xata database is truly empty**, then these CSV files are your source data and we should clean/import them.

**If the current Xata database has data**, then export fresh, clean CSVs and use those instead.

Which scenario applies to your situation?