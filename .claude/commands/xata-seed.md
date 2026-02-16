---
command: "/xata-seed"
category: "db, Xata, seeding"
purpose: "Database seeding operations with multiple strategies and data sources"
wave-enabled: false
performance-profile: "optimization"
---

# Xata Database Seeding Command

<agent>
🗄️ packages-db-agent (#1e40af)
</agent>

<task>
You are a database seeding specialist. Execute seeding operations to populate the Xata database with UFO/UAP research data using various strategies and data sources.
</task>

<context>
Docs: @packages/db/docs/XATA_METHODS.md, @packages/db/docs/SEEDING_STATUS_REPORT.md
Project Database: @packages/db/
Seeding Scripts: @packages/db/xata-seeding-script.ts, @packages/db/simple-seed.js, @packages/db/simple-seed.py
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users, user-notes, tags, theories
Data Sources: @packages/knowledge-base/sources/files/
Import Pattern: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
</context>

<operation>
Execute database seeding with multiple strategies and data sources:

**Arguments**:

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `strategy` | - | string | Seeding strategy: simple, comprehensive, custom, research | comprehensive |
| `table` | - | string | Specific table to seed (optional) | all |
| `source` | - | string | Data source: files, api, manual, knowledge-base | knowledge-base |
| `limit` | - | number | Maximum records to seed per table | 1000 |
| `force` | - | boolean | Force reseed (delete existing data) | false |

**Flags**:

- `--simple` - Use simple seeding strategy (basic test data)
- `--research` - Seed with actual UFO research data
- `--test` - Create test data for development
- `--incremental` - Add to existing data (default)
- `--force` - Clear and reseed table(s)
- `--validate` - Validate data before seeding
- `--dry-run` - Show what would be seeded without executing

**Examples**:

```bash
# Basic seeding operations
/xata-seed
/xata-seed strategy=simple --test
/xata-seed strategy=research table=events

# Advanced seeding
/xata-seed source=knowledge-base --research --validate
/xata-seed table=sightings limit=100 --incremental
/xata-seed strategy=custom source=files --force

# Development workflows
/xata-seed --test --dry-run
/xata-seed table=personnel strategy=simple --force
/xata-seed --research --validate limit=50
```

</operation>

<implementation>
1. Parse command arguments and determine seeding strategy
2. Import xata client and seeding utilities
3. Load data source based on source parameter
4. Execute seeding strategy:
   - **Simple**: Basic test data using simple-seed.js
   - **Comprehensive**: Full seeding using xata-seeding-script.ts
   - **Research**: UFO research data from knowledge-base
   - **Custom**: User-defined data with validation
5. Handle incremental vs force seeding
6. Validate data integrity after seeding
7. Report seeding results and statistics

**Code Template**:

```typescript
import { xata } from '@packages/db/src/xata-typescript-sdk/client';

// Parse arguments
const { 
  strategy = 'comprehensive', 
  table, 
  source = 'knowledge-base', 
  limit = 1000, 
  force = false,
  validate = false,
  dryRun = false
} = args;

// Determine tables to seed
const tablesToSeed = table ? [table] : [
  'topics', 'events', 'personnel', 'organizations', 
  'testimonies', 'documents', 'locations', 'sightings'
];

// Execute seeding strategy
let seedingResults = {};

switch (strategy) {
  case 'simple':
    seedingResults = await executeSimpleSeeding(tablesToSeed, { limit, force, dryRun });
    break;
  case 'research':
    seedingResults = await executeResearchSeeding(tablesToSeed, { source, limit, validate, dryRun });
    break;
  case 'custom':
    seedingResults = await executeCustomSeeding(tablesToSeed, { source, limit, validate, dryRun });
    break;
  default:
    seedingResults = await executeComprehensiveSeeding(tablesToSeed, { force, validate, dryRun });
}

// Validate results if requested
if (validate && !dryRun) {
  await validateSeedingResults(seedingResults);
}

return seedingResults;
```

</implementation>

<output_format>

```text
🌱 XATA DATABASE SEEDING REPORT
Started: {start_time}
Completed: {end_time}
Strategy: {strategy}
Duration: {duration}ms

═══════════════════════════════════════════════

📊 SEEDING SUMMARY
Tables Processed: {tables_count}
Records Created: {total_records:,}
Records Updated: {updated_records:,}
Errors: {error_count}

📋 TABLE BREAKDOWN
{table_name}                 {new_records:>6,} created, {updated_records:>6,} updated
{table_name}                 {new_records:>6,} created, {updated_records:>6,} updated
...

🔍 DATA VALIDATION
✅ Integrity Checks: {validation_status}
🔗 Relationships: {relationship_status}
📊 Data Quality: {quality_score}/100

═══════════════════════════════════════════════

💾 SEEDING DETAILS
Strategy: {strategy_description}
Source: {data_source}
Mode: {incremental_or_force}
Validation: {validation_enabled}

{detailed_results}

⚠️  ISSUES FOUND ({issue_count})
{issues_list}

💡 RECOMMENDATIONS
{recommendations_list}

🔗 RELATED COMMANDS
- Analyze: /xata-analyze type=health
- Query: /xata-read table={table} limit=10
- Validate: /xata-analyze type=distribution

📈 Next Steps: Run /xata-analyze to verify seeding results
```

</output_format>

<seeding_strategies>

**Simple Strategy**:
- Basic test data for development
- Fast execution (~50 records per table)
- Uses simple-seed.js script
- Suitable for testing and demos

**Comprehensive Strategy**:
- Full dataset seeding
- Uses xata-seeding-script.ts
- Includes all relationships
- Production-ready data

**Research Strategy**:
- Actual UFO/UAP research data
- Sources from knowledge-base directory
- Validated historical data
- Includes metadata and relationships

**Custom Strategy**:
- User-provided data sources
- Flexible data import
- Custom validation rules
- Supports various file formats

</seeding_strategies>

<data_sources>

**Knowledge Base**:
- Path: @packages/knowledge-base/sources/files/
- Format: JSON, CSV, TXT
- Content: UFO/UAP research documents
- Metadata: Document classifications, dates, sources

**API Sources**:
- External UFO databases
- Government disclosure data
- Research organization feeds
- Real-time sighting reports

**Manual Sources**:
- User-provided JSON files
- CSV data exports
- Structured research data
- Custom datasets

</data_sources>

<error_handling>

- Validate data format before seeding
- Handle constraint violations gracefully
- Provide detailed error messages for failed records
- Support partial seeding if some tables fail
- Transaction rollback for critical failures
- Memory management for large datasets
- Connection timeout handling
- Duplicate record detection and handling
- Suggest fixes for common seeding issues

</error_handling>

<validation>
- Pre-seeding data format validation
- Schema compliance checking
- Relationship integrity verification
- Post-seeding data quality assessment
- Record count validation
- Duplicate detection
- Required field verification
- Data type consistency checks
</validation>