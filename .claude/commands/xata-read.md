---
command: "/xata-read"
category: "db, Xata"
purpose: "Query and read records from Xata database with flexible filtering"
wave-enabled: false
performance-profile: "optimization"
---

# Xata Read Command

<agent>
🗄️ packages-db-agent (#1e40af)
</agent>

<task>
You are a database query assistant. Execute read operations against the Xata database using the existing SDK, returning results in a clear, structured format for Claude agents.
</task>

<context>
Docs: @packages/db/docs/XATA_METHODS.md, @packages/db/docs/XATA_EXAMPLES.md
Project Database: @packages/db/
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users
Import Pattern: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
</context>

<operation>
Execute database read queries with parameters:

**Arguments**:

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `table` | ✓ | string | Table name to query | - |
| `id` | - | string | Specific record ID | - |
| `filter` | - | JSON | Filter conditions | - |
| `limit` | - | number | Records to return (max: 100) | 10 |
| `columns` | - | string | Comma-separated columns | * |
| `offset` | - | number | Skip records for pagination | 0 |

**Flags** (optional enhancement):

- `--include-meta` - Include xata metadata fields
- `--sort` - Sort by field(s) with direction
- `--search` - Full-text search across fields

**Examples**:

```bash
# Basic queries
/xata-read table=events limit=5
/xata-read table=events filter='{"credible":true}' columns=title,date,location
/xata-read table=personnel id=rec_abc123

# Advanced queries
/xata-read table=testimonies filter='{"date":{"$gte":"2020-01-01"}}' limit=3
/xata-read table=sightings filter='{"location":"Nevada"}' sort=date:desc
/xata-read table=documents search="UFO crash" limit=20

# With relationships
/xata-read table=events columns=title,date,location.name,witnesses.name
```

</operation>

<implementation>
1. Parse command arguments
2. Import xata client: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
3. Build query based on parameters:
   - If `id` provided: `xata.db[table].read(id)`
   - If `filter` provided: `xata.db[table].filter(filter)`
   - Apply `columns`, `limit`, `offset`, `sort` as needed
   - Handle search queries with full-text search
4. Execute query and format results
5. Return structured response with count and execution info

**Code Template**:

```typescript
import { xata } from '@packages/db/src/xata-typescript-sdk/client';

// Parse arguments
const { table, id, filter, limit = 10, columns, offset = 0, sort, search } = args;

// Execute query
let query;
if (id) {
  query = xata.db[table].read(id, columns ? { columns: columns.split(',') } : {});
} else {
  query = xata.db[table].select(columns ? columns.split(',') : ['*']);
  
  if (filter) query = query.filter(JSON.parse(filter));
  if (search) query = query.search(search);
  if (sort) {
    const [field, direction = 'asc'] = sort.split(':');
    query = query.sort(field, direction);
  }
  
  query = query.getPaginated({ pagination: { size: limit, offset } });
}

const results = await query;
```

</implementation>

<output_format>

```text
🔍 XATA READ RESULTS

Table: {table}
Query: {summary of query parameters}
Found: {count} records
Time: {execution_time}ms

📊 Results:
{formatted results as JSON or table}

🔗 Related Commands:
- Create: /xata-create table={table} data='{...}'
- Update: /xata-update table={table} id={id} data='{...}'
- Delete: /xata-delete table={table} id={id}

💡 Next: Use related commands for data modifications
```

</output_format>

<error_handling>

- Validate table exists in schema
- Handle JSON parse errors in filter with clear examples
- Limit results to prevent overwhelming output
- Provide helpful error messages for common issues:
  - Invalid table name → Show available tables
  - Bad filter syntax → Show correct JSON format
  - Missing required fields → List required fields
  - Connection timeout → Suggest retry
- Suggest corrections for typos in table names
- Handle empty result sets gracefully

</error_handling>

<validation>
- Check table name against available tables list
- Validate JSON structure for filter parameter
- Ensure limit is within acceptable range (1-100)
- Verify column names exist in table schema
- Validate sort field and direction
</validation>
