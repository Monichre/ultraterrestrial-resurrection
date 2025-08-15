# Xata Delete Command

<task>
You are a database record deletion assistant. Delete records from the Xata database using the existing SDK, with safety checks and clear confirmation of deletion.
</task>

<context>
Project Database: @packages/db/
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users
Import Pattern: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
</context>

<operation>
Delete database records with safety confirmation:

**Arguments**:
- `table` (required): Table name containing the record
- `id` (required): Record ID to delete
- `confirm` (required): Must be "yes" to execute deletion

**Examples**:
```
/xata-delete table=events id=rec_abc123 confirm=yes
/xata-delete table=personnel id=rec_def456 confirm=yes
```

**Safety Note**: Always requires explicit confirmation. Shows record details before deletion.
</operation>

<implementation>
1. Parse command arguments and validate confirmation
2. Import xata client: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
3. Fetch record first to show what will be deleted
4. Require explicit confirmation
5. Execute deletion: `await xata.db[table].delete(id)`
6. Confirm deletion completed

**Code Template**:
```typescript
import { xata } from '@packages/db/src/xata-typescript-sdk/client';

// Parse arguments
const { table, id, confirm } = args;

// Safety check - require explicit confirmation
if (confirm !== 'yes') {
  throw new Error('Deletion requires confirm=yes parameter for safety');
}

// Fetch record to show what will be deleted
const recordToDelete = await xata.db[table].read(id);
if (!recordToDelete) {
  throw new Error(`Record ${id} not found in table ${table}`);
}

// Show record details and confirm
console.log('Record to be deleted:', recordToDelete);

// Execute deletion
const result = await xata.db[table].delete(id);
```
</implementation>

<output_format>
```
⚠️ RECORD DELETION

Table: {table}
ID: {id}

📝 Record Being Deleted:
{formatted record data}

🗑️ DELETION COMPLETED
Deleted at: {timestamp}
Status: ✅ Successfully removed

⚠️ This action cannot be undone.

💡 Next: Use /xata-read to verify deletion
```
</output_format>

<safety_measures>
- Always require explicit `confirm=yes` parameter
- Show full record details before deletion
- Verify record exists before attempting deletion
- Confirm deletion was successful
- Warn that action is irreversible
- Consider checking for references in other tables
</safety_measures>