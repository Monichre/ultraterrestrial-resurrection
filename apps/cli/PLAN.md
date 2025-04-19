# Ultraterrestrial CLI - Schema-Driven Data Processing Plan

## Overview

This document outlines the enhanced approach for the Ultraterrestrial CLI, focusing on a schema-driven architecture that dynamically adapts to the Xata database model while enforcing strict data validation and fidelity. The CLI will implement a flexible bucket-based workflow for data processing, review, and insertion.

## Core Architecture

### 1. Schema-Driven Processing Architecture

The CLI will be designed around the Xata database schema, with the bucket system serving as the workflow mechanism:

```
Backlog → Processing → Review → Insertion → Xata Database
```

- **Backlog**: Raw data files organized by model type (events/, personnel/, etc.)
- **Processing**: Files being transformed and validated against schema
- **Review**: Files that passed basic validation but need human review
- **Insertion**: Files ready for database insertion

### 2. Directory Structure

```
/data/
├── backlog/               # On-deck raw files waiting for processing
│   ├── events/            # Raw event files
│   ├── personnel/         # Raw personnel files
│   └── ...                # Other model types from Xata schema
├── processing/            # Files actively being processed
│   ├── events/            # Events being validated/transformed
│   └── ...
├── review/                # Files that passed validation but need human review
│   ├── events/
│   └── ...
└── insertion/             # Files ready for database insertion
    ├── events/
    └── ...
```

### 3. Key Components

1. **Schema-Aware Model Registry**
   - Loads and parses the Xata schema
   - Extracts table definitions, required fields, and relationships
   - Defines validation rules and transformations for each table

2. **Model-Specific Validation**
   - Implements validators for each Xata table type
   - Validates required fields, data types, and relationships
   - Generates validation reports with specific field-level errors

3. **Dynamic Schema Discovery**
   - Scans the Xata schema to discover available models
   - Uses these models to organize the bucket structure
   - Creates directory paths for each model type

4. **Bucket Manager**
   - Manages file movement between buckets
   - Handles metadata creation and updates
   - Provides consistent interface for operations across all models

5. **Interactive CLI Interface**
   - Dynamically generates commands based on available models
   - Provides model-specific options and validations
   - Implements interactive workflows for data processing

## Implementation Plan

### Phase 1: Schema-Driven Foundation

1. **Create Model Registry Module**

   ```typescript
   // src/lib/modelRegistry.ts
   import { tables } from '../../src/db/xata/xata';
   
   export function getAvailableModels() {
     // Filter out relationship tables to get primary entity tables
     return tables
       .filter(table => !table.name.includes('-'))
       .map(table => ({
         name: table.name,
         columns: table.columns,
         required: table.columns.filter(col => !col.name.includes('?'))
       }));
   }
   
   export function getValidationSchema(modelName: string) {
     const model = tables.find(t => t.name === modelName);
     if (!model) throw new Error(`Model ${modelName} not found in schema`);
     
     return {
       name: model.name,
       rules: model.columns.map(col => ({
         field: col.name,
         type: col.type,
         required: !col.name.includes('?'),
         // Additional validation rules based on column type
       }))
     };
   }
   ```

2. **Implement Bucket Manager**

   ```typescript
   // src/lib/bucketManager.ts
   import * as fs from 'fs';
   import * as path from 'path';
   import { getAvailableModels } from './modelRegistry';
   
   export enum BucketType {
     BACKLOG = 'backlog',
     PROCESSING = 'processing',
     REVIEW = 'review',
     INSERTION = 'insertion'
   }
   
   export async function ensureBucketStructure() {
     const models = getAvailableModels();
     
     // Create bucket directories for each model
     for (const model of models) {
       for (const bucket of Object.values(BucketType)) {
         const dir = path.join(getBaseBucketPath(), bucket, model.name);
         if (!fs.existsSync(dir)) {
           fs.mkdirSync(dir, { recursive: true });
         }
       }
     }
   }
   
   export function getModelBucketPath(model: string, bucket: BucketType) {
     return path.join(getBaseBucketPath(), bucket, model);
   }
   
   export async function moveFile(
     file: string,
     model: string,
     sourceBucket: BucketType,
     targetBucket: BucketType,
     metadata?: any
   ) {
     const sourcePath = path.join(getModelBucketPath(model, sourceBucket), file);
     const targetPath = path.join(getModelBucketPath(model, targetBucket), file);
     
     // Ensure target directory exists
     fs.mkdirSync(path.dirname(targetPath), { recursive: true });
     
     // Copy file to new location
     fs.copyFileSync(sourcePath, targetPath);
     
     // Write metadata if provided
     if (metadata) {
       const metadataPath = `${targetPath}.meta.json`;
       fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
     }
     
     // Remove source file after successful copy
     fs.unlinkSync(sourcePath);
     
     return targetPath;
   }
   
   // Additional bucket management functions...
   ```

3. **Create Validation Module**

   ```typescript
   // src/lib/validators.ts
   import { getValidationSchema } from './modelRegistry';
   
   export function validateAgainstSchema(modelName: string, data: any) {
     const schema = getValidationSchema(modelName);
     const errors = [];
     
     // Check for required fields
     for (const rule of schema.rules.filter(r => r.required)) {
       if (!data[rule.field]) {
         errors.push(`Missing required field: ${rule.field}`);
       }
     }
     
     // Validate data types
     for (const rule of schema.rules) {
       const value = data[rule.field];
       if (value !== undefined) {
         // Type-specific validation
         switch (rule.type) {
           case 'datetime':
             if (!(value instanceof Date) && isNaN(Date.parse(value))) {
               errors.push(`Invalid date format for ${rule.field}: ${value}`);
             }
             break;
           case 'float':
           case 'int':
             if (isNaN(parseFloat(value))) {
               errors.push(`Invalid number for ${rule.field}: ${value}`);
             }
             break;
           // More type validations...
         }
       }
     }
     
     // Relationship validation for link fields
     // ...
     
     return { valid: errors.length === 0, errors };
   }
   
   export function validateFile(filePath: string, modelName: string) {
     // Read file content
     // Parse JSON/CSV/etc.
     // Validate against schema
     // Return validation result
   }
   ```

### Phase 2: Dynamic Commands Implementation

1. **Backlog/Onboarding Command**

   ```typescript
   // src/commands/onboard.ts
   export default function registerOnboardCommands(program: Command): void {
     program
       .command('onboard')
       .description('Discover and onboard new datasets from the backlog')
       .action(async () => {
         // Scan schema for available models
         const models = getAvailableModels();
         
         // Scan backlog directory for available files
         const availableFiles = await scanBacklogDirectory();
         
         // Group files by potential model type
         const filesByModel = groupFilesByPotentialModel(availableFiles, models);
         
         // Present grouped files to user for onboarding
         const selectedFiles = await promptForFilesToOnboard(filesByModel);
         
         // For each selected file
         for (const file of selectedFiles) {
           // Create initial metadata with schema validation rules
           const metadata = createInitialMetadata(file, getValidationSchema(file.modelType));
           
           // Move to processing bucket with metadata
           await moveToProcessingBucket(file, metadata);
         }
       });
   }
   ```

2. **Dynamic Processing Commands**

   ```typescript
   // src/commands/processing.ts
   export default function registerProcessingCommands(program: Command): void {
     // Static commands for all models
     program
       .command('process:list')
       .description('List all files in processing buckets')
       .option('-m, --model <model>', 'Filter by model type')
       .action(async (options) => {
         // Implementation...
       });
       
     // Dynamic commands based on schema
     const models = getAvailableModels();
     
     for (const model of models) {
       program
         .command(`process:${model.name}`)
         .description(`Process ${model.name} files`)
         .option('-i, --interactive', 'Run in interactive mode')
         .action(async (options) => {
           // Model-specific processing logic
           const schema = getValidationSchema(model.name);
           // Processing implementation...
         });
     }
   }
   ```

3. **Review Commands**

   ```typescript
   // src/commands/review.ts
   export default function registerReviewCommands(program: Command): void {
     // Similar dynamic command generation for review
     // ...
   }
   ```

4. **Insertion Commands**

   ```typescript
   // src/commands/insertion.ts
   export default function registerInsertionCommands(program: Command): void {
     // Similar dynamic command generation for insertion
     // ...
     
     // Xata-specific insertion logic
     program
       .command('insert:execute')
       .description('Execute insertion of validated data to Xata')
       .option('-m, --model <model>', 'Model type to insert')
       .option('-f, --file <file>', 'Specific file to insert')
       .option('--all', 'Insert all files for the specified model')
       .option('--force', 'Force insert even if validation fails')
       .action(async (options) => {
         // Implementation...
       });
   }
   ```

### Phase 3: Integration with Xata Client

1. **Xata Client Wrapper**

   ```typescript
   // src/lib/xataClient.ts
   import { getXataClient } from '../../src/db/xata/xata';
   
   export async function insertRecords(tableName: string, records: any[], options = {}) {
     const xata = getXataClient();
     
     try {
       // Handle batching for large datasets
       const batchSize = options.batchSize || 100;
       
       // Process in batches
       for (let i = 0; i < records.length; i += batchSize) {
         const batch = records.slice(i, i + batchSize);
         
         // Use transaction for batch operations
         await xata.db[tableName].create(batch);
       }
       
       return { success: true, count: records.length };
     } catch (error) {
       return { success: false, error: error.message, failedAt: records.indexOf(error.record) };
     }
   }
   
   export async function checkDuplicates(tableName: string, records: any[], options = {}) {
     // Implementation...
   }
   
   // Additional Xata operations...
   ```

2. **Import Integration**

   ```typescript
   // src/commands/import.ts
   // Adaptation of run-import.sh functionality as a command module
   export default function registerImportCommands(program: Command): void {
     // Implementation...
   }
   ```

## Command Structure Overview

The CLI will provide these primary command categories:

1. **Discovery & Onboarding**
   - `onboard` - Discover and move new datasets to the processing bucket
   - `status` - Show the status of all buckets and files

2. **Processing Commands**
   - `process:list` - List all files in processing buckets
   - `process:<model>` - Process files for a specific model
   - `process:transform <file>` - Transform a specific file
   - `process:validate <file>` - Validate a file against its schema

3. **Review Commands**
   - `review:list` - List files ready for review
   - `review:preview <file>` - Preview a file's content and validation results
   - `review:approve <file>` - Approve a file and move to insertion bucket
   - `review:reject <file>` - Reject a file and move back to processing

4. **Insertion Commands**
   - `insert:list` - List files ready for insertion
   - `insert:preview <file>` - Preview insertion data
   - `insert:execute` - Execute insertion to Xata database

5. **Import Integration**
   - `import` - Interactive import workflow (similar to run-import.sh)
   - `import:<type>` - Direct import commands

## Implementation Sequence

1. Create the foundation modules:
   - modelRegistry.ts
   - bucketManager.ts
   - validators.ts
   - xataClient.ts

2. Implement the basic command structure for each bucket phase

3. Add the dynamic command generation based on schema models

4. Implement the file processing and validation logic

5. Create the Xata insertion integration

6. Add the interactive workflows and UI enhancements

7. Integrate with existing run-import.sh functionality

8. Add comprehensive testing and documentation

## Data Flow Diagram

```
┌───────────┐    ┌──────────────┐    ┌───────────┐    ┌───────────────┐    ┌───────────────┐
│           │    │              │    │           │    │               │    │               │
│  Backlog  │───▶│  Processing  │───▶│  Review   │───▶│  Insertion    │───▶│  Xata Database│
│           │    │              │    │           │    │               │    │               │
└───────────┘    └──────────────┘    └───────────┘    └───────────────┘    └───────────────┘
      │                 ▲                 │                   │
      │                 │                 │                   │
      │                 └─────────────────┘                   │
      │                  Reject for rework                    │
      │                                                       │
      └───────────────────────────────────────────────────────┘
                       Skip to insertion
```

## Metadata Structure

Each file will be accompanied by metadata in JSON format:

```json
{
  "model": "events",
  "fileName": "event-123.json",
  "originalFileName": "ufo-sighting-123.csv",
  "recordCount": 1,
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T14:30:00Z",
  "status": "validated",
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": []
  },
  "targetTable": "events",
  "transformations": [
    {
      "type": "dateFormat",
      "field": "date",
      "applied": true
    }
  ],
  "processingHistory": [
    {
      "stage": "onboarded",
      "timestamp": "2023-06-01T12:00:00Z"
    },
    {
      "stage": "processed",
      "timestamp": "2023-06-01T12:15:00Z"
    },
    {
      "stage": "reviewed",
      "timestamp": "2023-06-01T14:30:00Z"
    }
  ]
}
```

## Next Steps

1. Review this plan and make any necessary adjustments
2. Begin implementation with the core modules
3. Develop the command structure incrementally
4. Test with sample data across different models
5. Integrate with the existing import scripts
6. Document the CLI usage and workflows
