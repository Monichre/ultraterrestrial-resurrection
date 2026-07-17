# `@db/postgres` Quick Reference

**Updated:** 2026-07-12

```typescript
import { getAllEvents, getAllPersonnel, readById } from '@db/postgres'
import { getPaginatedRecords } from '@db/postgres'
import { searchTable, searchAll, searchDatabase } from '@db/postgres'
import { getSql } from '@db/postgres'
import type { EventsRecord, PersonnelRecord } from '@db/postgres'
```

```typescript
const page = await getPaginatedRecords('events', 50, 0)
const event = await readById('events', eventId)
const matches = await searchTable('events', 'Roswell', 10)

const sql = getSql()
await sql`UPDATE events SET summary = ${summary} WHERE id = ${eventId}`
```

Live application code must use `@db/postgres`. The `@db/xata` exports are retired
migration artifacts, not an alternative provider. See [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)
for selection rules and compatibility-name details.
