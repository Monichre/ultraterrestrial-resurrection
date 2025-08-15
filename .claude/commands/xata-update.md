# Xata Update Command

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

- `table` (required): Table name containing the record
- `id` (required): Record ID to update
- `data` (required): JSON object with updated fields

**Examples**:

```
/xata-update table=events id=rec_abc123 data='{"credible":true,"verified_by":"Jane Doe"}'
/xata-update table=personnel id=rec_def456 data='{"role":"Senior Investigator","active":true}'
/xata-update table=topics id=rec_ghi789 data='{"description":"Updated analysis of crash retrieval cases"}'
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
const { table, id, data } = args;
const updateData = JSON.parse(data);

// Verify record exists
const existingRecord = await xata.db[table].read(id);
if (!existingRecord) {
  throw new Error(`Record ${id} not found in table ${table}`);
}

// Update record
const updatedRecord = await xata.db[table].update(id, updateData);
```

</implementation>

<output_format>

```
✅ RECORD UPDATED

Table: {table}
ID: {id}
Updated: {timestamp}

🔄 Changes Made:
{list of changed fields: old_value → new_value}

📝 Updated Record:
{formatted updated record}

💡 Next: Use /xata-read to verify changes
```

</output_format>

<validation>
- Ensure record exists before attempting update
- Validate JSON data format
- Check for valid field names for the table
- Show before/after comparison for clarity
- Handle partial updates properly
</validation>
