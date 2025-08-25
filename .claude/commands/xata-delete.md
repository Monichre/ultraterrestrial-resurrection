---
command: "/xata-delete"
category: "db, Xata"
purpose: "Delete records from Xata database with safety checks and confirmation"
wave-enabled: false
performance-profile: "optimization"
---

# Xata Delete Command

<agent>
🗄️ packages-db-agent (#1e40af)
</agent>

<task>
You are a database record deletion assistant. Delete records from the Xata database using the existing SDK, with safety checks and clear confirmation of deletion.
</task>

<context>
Docs: @packages/db/docs/XATA_METHODS.md, @packages/db/docs/XATA_EXAMPLES.md
Project Database: @packages/db/
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users
Import Pattern: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
</context>

<operation>
Delete database records with safety confirmation:

**Arguments**:

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `table` | ✓ | string | Table name containing the record | - |
| `id` | ✓ | string | Record ID to delete | - |
| `confirm` | ✓ | string | Must be "yes" to execute deletion | - |

**Flags** (optional enhancement):

- `--force` - Skip additional safety prompts (still requires confirm=yes)
- `--show-refs` - Display related records that may be affected
- `--cascade` - Delete related records (use with extreme caution)
- `--backup` - Create backup before deletion

**Examples**:

```bash
# Basic deletions
/xata-delete table=events id=rec_abc123 confirm=yes
/xata-delete table=personnel id=rec_def456 confirm=yes
/xata-delete table=topics id=rec_ghi789 confirm=yes

# With safety checks
/xata-delete table=sightings id=rec_jkl012 confirm=yes --show-refs
/xata-delete table=documents id=rec_doc456 confirm=yes --backup

# Force deletion (still requires explicit confirmation)
/xata-delete table=artifacts id=rec_art789 confirm=yes --force
```

**Safety Note**: Always requires explicit confirmation. Shows record details before deletion.

</operation>

<implementation>
1. Parse command arguments and validate confirmation
2. Import xata client: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
3. Fetch record first to show what will be deleted
4. Check for related records if requested
5. Create backup if requested
6. Require explicit confirmation
7. Execute deletion: `await xata.db[table].delete(id)`
8. Confirm deletion completed

**Code Template**:

```typescript
import { xata } from '@packages/db/src/xata-typescript-sdk/client';

// Parse arguments
const { table, id, confirm, force, showRefs, cascade, backup } = args;

// Safety check - require explicit confirmation
if (confirm !== 'yes') {
  throw new Error('Deletion requires confirm=yes parameter for safety');
}

// Fetch record to show what will be deleted
const recordToDelete = await xata.db[table].read(id);
if (!recordToDelete) {
  throw new Error(`Record ${id} not found in table ${table}`);
}

// Show related records if requested
if (showRefs) {
  const relatedRecords = await findRelatedRecords(table, id);
  console.log('Related records that may be affected:', relatedRecords);
}

// Create backup if requested
if (backup) {
  await createRecordBackup(table, id, recordToDelete);
}

// Show record details and confirm
console.log('Record to be deleted:', recordToDelete);

// Additional confirmation for non-force mode
if (!force) {
  console.log('⚠️ This action cannot be undone. Proceeding with deletion...');
}

// Execute deletion
const result = await xata.db[table].delete(id);
```

</implementation>

<output_format>

```text
⚠️ RECORD DELETION INITIATED

Table: {table}
ID: {id}
Operation: DELETE
Timestamp: {timestamp}

📝 Record Being Deleted:
{formatted record data}

🔍 Related Records Check:
{related records summary if --show-refs used}

🗑️ DELETION COMPLETED
Deleted at: {timestamp}
Status: ✅ Successfully removed
Version: {final_version}

⚠️ This action cannot be undone.

🔗 Related Commands:
- Verify: /xata-read table={table} id={id} (should return "not found")
- Create: /xata-create table={table} data='{...}' (to recreate if needed)
- List: /xata-read table={table} limit=10

💡 Next: Use /xata-read to verify deletion or /xata-create to add new records
```

</output_format>

<error_handling>

- Validate table exists in schema
- Handle record not found gracefully with suggestions
- Require explicit confirmation to prevent accidental deletions
- Check for dependent records and warn about potential cascading effects
- Handle foreign key constraint violations:
  - Show dependent records that prevent deletion
  - Suggest cascade options or manual cleanup
  - Provide guidance on proper deletion order
- Connection timeouts → Suggest retry with verification
- Transaction failures → Ensure atomicity, provide rollback information
- Permission errors → Verify database access and table permissions

</error_handling>

<safety_measures>
- Always require explicit `confirm=yes` parameter
- Show full record details before deletion for verification
- Verify record exists before attempting deletion
- Check for related/dependent records that may be affected
- Warn about irreversible nature of the operation
- Provide clear audit trail with timestamps and versions
- Consider implementing soft delete patterns for critical data
- Support backup creation before deletion for recovery options
- Log all deletion operations for audit purposes
</safety_measures>

<validation>
- Ensure table exists in available tables list
- Verify record ID exists before deletion attempt
- Validate confirmation parameter is exactly "yes"
- Check for referential integrity constraints
- Confirm successful deletion before reporting completion
- Validate user permissions for delete operations on the table
- Ensure transaction completes successfully
- Verify deletion through subsequent read attempt
</validation>
