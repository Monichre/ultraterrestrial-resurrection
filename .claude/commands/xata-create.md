---
command: "/xata-create"
category: "db, Xata"
purpose: "Create new records in Xata database with validation and batch support"
wave-enabled: false
performance-profile: "optimization"
---

# Xata Create Command

<agent>
🗄️ packages-db-agent (#1e40af)
</agent>

<task>
You are a database record creation assistant. Create new records in the Xata database using the existing SDK, with validation and clear confirmation of successful creation.
</task>

<context>
Docs: @packages/db/docs/XATA_METHODS.md, @packages/db/docs/XATA_EXAMPLES.md
Project Database: @packages/db/
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users
Import Pattern: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
</context>

<operation>
Create new database records with JSON data:

**Arguments**:

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `table` | ✓ | string | Table name for record creation | - |
| `data` | ✓ | JSON | Record data (single object or array) | - |

**Flags**:

- `--validate` - Pre-validate data before creation
- `--batch` - Create multiple records in batch
- `--return-fields` - Specify fields to return after creation
- `--transaction` - Use transaction for atomicity

**Examples**:

```bash
# Basic creation
/xata-create table=events data='{"title":"New UFO Sighting","date":"2024-01-15","location":"Nevada","credible":true}'
/xata-create table=personnel data='{"name":"Jane Doe","role":"Investigator","organization":"MUFON"}'
/xata-create table=topics data='{"title":"Crash Retrievals","description":"Analysis of UFO crash retrieval cases"}'

# With relationships
/xata-create table=sightings data='{"title":"UFO Sighting","location_id":"rec_loc123","witness_ids":["rec_per456","rec_per789"]}'

# With embedded metadata
/xata-create table=documents data='{"title":"Classified Report","content":"...", "metadata":{"classification":"TOP SECRET","date":"2024-01-15"}}'

# Batch creation
/xata-create table=events data='[{"title":"Event 1","date":"2024-01-01"},{"title":"Event 2","date":"2024-01-02"}]' --batch

# With validation
/xata-create table=personnel data='{"name":"John Doe","email":"john@example.com"}' --validate
```

</operation>

<implementation>
1. Parse command arguments
2. Import xata client: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
3. Parse JSON data and validate required fields
4. Handle single vs batch creation
5. Execute creation with optional validation
6. Return created record(s) with confirmation

**Code Template**:

```typescript
import { xata } from '@packages/db/src/xata-typescript-sdk/client';

// Parse arguments
const { table, data, validate, batch, returnFields, transaction } = args;
const recordData = JSON.parse(data);

// Validate if flag is set
if (validate) {
  await validateData(table, recordData);
}

// Create record(s)
let result;
if (Array.isArray(recordData) || batch) {
  // Batch creation
  const records = Array.isArray(recordData) ? recordData : [recordData];
  result = await xata.db[table].createMany(records);
} else {
  // Single record creation
  result = await xata.db[table].create(
    recordData,
    returnFields ? { columns: returnFields.split(',') } : {}
  );
}

return result;
```

</implementation>

<output_format>

```text
✅ RECORD CREATED

Table: {table}
ID: {record.id}
Created: {timestamp}
Version: {xata.version}

📝 Data:
{formatted record data}

🔗 Related Commands:
- View: /xata-read table={table} id={record.id}
- Update: /xata-update table={table} id={record.id} data='{...}'
- Delete: /xata-delete table={table} id={record.id}

💡 Next: Use /xata-read to view or /xata-update to modify
```

</output_format>

<error_handling>

- Validate table exists in schema
- Handle JSON parse errors with examples
- Check for required fields based on table schema
- Handle constraint violations:
  - Duplicate key violations → Show existing record
  - Foreign key failures → List valid references
  - Required field missing → List all required fields
  - Data type mismatches → Show expected types
- Connection timeouts → Suggest retry
- Transaction rollback on batch failures
- Provide suggested fixes for common errors

</error_handling>

<validation>
- Ensure table exists in available tables list
- Validate JSON data format
- Check required fields based on table schema
- Verify foreign key references exist
- Validate data types match schema
- Check field length constraints
- Ensure unique constraints are satisfied
- Confirm successful creation before reporting
</validation>
