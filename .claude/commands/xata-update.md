---
command: "/xata-update"
category: "db, Xata"
purpose: "Update existing records in Xata database with validation and change tracking"
wave-enabled: false
performance-profile: "optimization"
---

# Xata Update Command

<agent>
🗄️ packages-db-agent (#1e40af)
</agent>

<task>
You are a database record update assistant. Update existing records in the Xata database using the existing SDK, with validation and clear confirmation of changes made.
</task>

<context>
Docs: @packages/db/docs/XATA_METHODS.md, @packages/db/docs/XATA_EXAMPLES.md
Project Database: @packages/db/
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users
Import Pattern: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
</context>

<operation>
Update existing database records:

**Arguments**:

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `table` | ✓ | string | Table name containing the record | - |
| `id` | ✓ | string | Record ID to update | - |
| `data` | ✓ | JSON | Updated field values as JSON object | - |

**Flags** (optional enhancement):

- `--validate` - Pre-validate data before update
- `--show-diff` - Display before/after comparison
- `--return-fields` - Specify fields to return after update
- `--if-version` - Conditional update based on version

**Examples**:

```bash
# Basic updates
/xata-update table=events id=rec_abc123 data='{"credible":true,"verified_by":"Jane Doe"}'
/xata-update table=personnel id=rec_def456 data='{"role":"Senior Investigator","active":true}'
/xata-update table=topics id=rec_ghi789 data='{"description":"Updated analysis of crash retrieval cases"}'

# With relationships
/xata-update table=sightings id=rec_jkl012 data='{"witness_ids":["rec_per456","rec_per789"]}'

# Partial updates
/xata-update table=events id=rec_abc123 data='{"credible":true}' --show-diff
/xata-update table=documents id=rec_doc456 data='{"metadata.classification":"DECLASSIFIED"}'

# With validation
/xata-update table=personnel id=rec_def456 data='{"email":"updated@example.com"}' --validate
```

</operation>

<implementation>
1. Parse command arguments
2. Import xata client: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
3. Verify record exists first
4. Parse JSON data for updates
5. Execute update: `await xata.db[table].update(id, data)`
6. Return updated record with changes highlighted

**Code Template**:

```typescript
import { xata } from '@packages/db/src/xata-typescript-sdk/client';

// Parse arguments
const { table, id, data, validate, showDiff, returnFields, ifVersion } = args;
const updateData = JSON.parse(data);

// Verify record exists and get current version
const existingRecord = await xata.db[table].read(id);
if (!existingRecord) {
  throw new Error(`Record ${id} not found in table ${table}`);
}

// Show diff if requested
if (showDiff) {
  console.log('Before:', existingRecord);
  console.log('Changes:', updateData);
}

// Validate if flag is set
if (validate) {
  await validateUpdateData(table, updateData);
}

// Update record with version check if specified
const updateOptions = {
  ifVersion: ifVersion || existingRecord.xata.version,
  columns: returnFields ? returnFields.split(',') : undefined
};

const updatedRecord = await xata.db[table].update(id, updateData, updateOptions);
```

</implementation>

<output_format>

```text
🔄 RECORD UPDATED

Table: {table}
ID: {id}
Updated: {timestamp}
Version: {new_version}

📊 Changes Made:
{field_name}: {old_value} → {new_value}
{field_name}: {old_value} → {new_value}

📝 Updated Record:
{formatted updated record}

🔗 Related Commands:
- View: /xata-read table={table} id={id}
- Delete: /xata-delete table={table} id={id} confirm=yes
- Create: /xata-create table={table} data='{...}'

💡 Next: Use /xata-read to verify changes or continue with related operations
```

</output_format>

<error_handling>

- Validate table exists in schema
- Handle JSON parse errors with clear examples
- Check for record existence before update attempts
- Handle version conflicts gracefully:
  - Optimistic concurrency → Show current record and suggest retry
  - Missing record → Confirm ID and suggest using /xata-read to verify
  - Invalid field names → List valid fields for the table
  - Data type mismatches → Show expected types with examples
- Connection timeouts → Suggest retry with exponential backoff
- Foreign key violations → List valid reference options
- Provide suggested corrections for common update scenarios

</error_handling>

<validation>
- Ensure record exists before attempting update
- Validate JSON data format with helpful error messages
- Check for valid field names for the table schema
- Verify data types match expected schema types
- Show before/after comparison for clarity and audit trail
- Handle partial updates properly without overwriting unspecified fields
- Confirm successful update before reporting completion
- Validate foreign key references exist if updating relationship fields
</validation>
