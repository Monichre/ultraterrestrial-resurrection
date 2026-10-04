# `@db/postgres` Import Guide

**Updated:** 2026-07-12

The Next.js application has one live database layer: `@db/postgres`. It uses Neon
Postgres through `@neondatabase/serverless`. The Xata SDK remains in the repository
only as migration-era code and must not be used for new work.

## Common imports

```typescript
import {
  getAllEvents,
  getAllPersonnel,
  getPaginatedRecords,
  readById,
  searchAll,
  searchDatabase,
  searchTable,
} from '@db/postgres'

import type { EventsRecord, PersonnelRecord } from '@db/postgres'
```

Use `getSql()` for writes and queries that do not have a typed helper:

```typescript
import { getSql } from '@db/postgres'

const sql = getSql()
const rows = await sql`
  SELECT * FROM events
  WHERE date >= ${cutoff}
  ORDER BY date DESC
`
```

## Selection guide

| Need | Use |
|---|---|
| Typed entity reads | Helpers exported from `@db/postgres` |
| Paginated generic reads | `getPaginatedRecords(table, size, offset)` |
| Read by table and ID | `readById(table, id)` |
| One-table text search | `searchTable(table, query, limit)` |
| Cross-table text search | `searchAll(query, limit)` |
| Agent hybrid search | `searchDatabase(options)` |
| Writes or custom SQL | `getSql()` tagged-template queries |
| Record types | `import type { ... } from '@db/postgres'` |

`personnel`, `key-figures`, and `key_figures` resolve to the Postgres
`key_figures` table through the database helpers.

## Rules

- Set `DATABASE_URL`; never commit it. Local database configuration lives in
  `packages/db/.env`.
- Bind values through the tagged template. Do not concatenate user input into SQL.
- Prefer existing typed helpers before adding raw queries.
- Do not import `@db/xata`, `@db/xata/client`, or `@db/registry` in live code.
- Compatibility names such as `searchXata` and response fields such as `xata.score`
  may still appear in the Postgres adapter. They preserve callers' data shapes; they
  do not mean Xata is active.

The authoritative export list is `packages/db/src/postgres/index.ts`.
