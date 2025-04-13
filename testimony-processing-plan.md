# Testimony Data Processing Implementation Plan

## 1. File Discovery & Reading
- Create utility to find all Summary.md files in docs/testimonies
- Read file content and metadata
- Group related files (summary, transcript, metadata)

## 2. Data Extraction Layer
```typescript
interface TestimonyData {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: {
    url: string;
    platform: string;
    id: string;
  };
  personnel: Array<{
    name: string;
    role: string;
    rank?: string;
    organization?: string;
  }>;
  events: Array<{
    title: string;
    date?: string;
    location?: string;
    description: string;
  }>;
  organizations: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
}
```

## 3. Processing Pipeline
1. Create /api/processing/testimony route
2. Implement markdown parser with sections:
   - Summary
   - Key Personnel
   - Events
   - Organizations
3. Add validation layer for required fields
4. Queue processor:
   ```typescript
   interface QueueItem {
     type: 'testimony' | 'personnel' | 'event' | 'organization';
     action: 'create' | 'update';
     data: any;
     relationships: Array<{
       table: string;
       id: string;
     }>;
   }
   ```

## 4. Database Operations
1. Check existence in Xata tables
2. Create/update records
3. Handle relationships
4. Log operations

## 5. Implementation Steps
1. Create file discovery utility
2. Build markdown parser
3. Setup queue processor
4. Implement database operations
5. Add logging and monitoring
6. Create CLI interface

## 6. Error Handling
- File read errors
- Parse failures
- Queue errors
- Database conflicts
- Relationship errors

## 7. Monitoring
- Processing status
- Queue health
- Error rates
- Completion status

## 8. CLI Interface
```bash
process-testimonies [options]
  --force        Force reprocess all
  --dry-run      Test without saving
  --verbose      Detailed logging
```