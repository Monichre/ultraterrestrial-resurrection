# Extracted Database Models

This directory contains Xata database models extracted from chat conversations. These files implement CRUD (Create, Read, Update, Delete) operations for the database tables in the Ultraterrestrial Resurrection project.

## Files Extracted

1. `personnel.ts` - CRUD operations for the personnel table
2. `organizations.ts` - CRUD operations for the organizations table
3. `sightings.ts` - CRUD operations for the sightings table
4. `documents.ts` - CRUD operations for the documents table
5. `locations.ts` - CRUD operations for the locations table
6. `artifacts.ts` - CRUD operations for the artifacts table
7. `mindmaps.ts` - CRUD operations for the mindmaps table
8. `summary-files.ts` - CRUD operations for the summary-files table
9. `users.ts` - CRUD operations for the users table
10. `user-saved-items.ts` - CRUD operations for various user-saved-* tables

## Important Note

These files have import paths that need to be adjusted for your actual project structure. The current imports are:

```typescript
import { getXataClient, ... } from "../xata";
```

or in the client.ts file:

```typescript
import { XataClient } from "@/xata";
```

You may need to adjust these paths based on where these files are placed in your project.

## Client.ts

The `client.ts` file was extracted from the history file `2025-05-04_15-52-xata-client-import-vs-instantiation.md`. It provides a singleton pattern for the Xata client that can be used in two ways:

1. Importing and using the `getXataClient()` function to get the client instance
2. Directly importing the `xata` instance which is initialized on module load

According to the history file, directly importing the client instance is slightly better in most cases for cleaner and more concise code.
