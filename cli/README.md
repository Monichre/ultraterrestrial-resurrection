# Ultraterrestrial Data Import CLI - Implementation Plan

## Executive Summary

This document outlines the implementation plan for creating a modular, interactive CLI tool to manage the data processing and import workflow for the Ultraterrestrial project. The tool will facilitate the movement of data through three distinct phases: Processing, Review, and Insertion, with each phase having its own commands and operations.

## 1. Overall Architecture & Directory Layout

The CLI will follow a modular architecture with clear separation of concerns:

```
/cli/
├── bin/
│   └── cli.js                   # Entry point for your CLI app
├── src/
│   ├── commands/                # All Commander command implementations
│   │   ├── processing.js        # Processing bucket commands
│   │   ├── review.js            # Review phase commands
│   │   └── insertion.js         # Insertion bucket & Xata integration commands
│   ├── lib/
│   │   ├── fileManager.js       # File operations, directory scanning, file moving
│   │   ├── metadata.js          # Handling metadata for each insertion file
│   │   ├── xataClient.js        # Xata client wrapper that abstracts insertion logic
│   │   └── aiAssistant.js       # Integration with an LLM for data enhancements
│   └── config.js                # Central config, such as bucket paths, API keys, etc.
├── package.json                 # Dependencies, scripts (commander, inquirer, ora, chalk, etc.)
└── README.md
```

## 2. Implementation Plan

### Phase 1: Project Setup and Infrastructure (2 days)

#### Tasks

1. **Initialize Project Structure**
   - Create directory structure as outlined above
   - Set up package.json with dependencies
   - Configure TypeScript (tsconfig.json)
   - Create initial README.md with usage instructions

2. **Core Configuration Setup**
   - Create config.js to manage:
     - Bucket paths (processing, review, insertion)
     - API keys and environment variables
     - Default options and settings
   - Implement environment variable loading

3. **Basic CLI Structure**
   - Set up Commander.js framework
   - Create entry point (bin/cli.js)
   - Implement basic command structure
   - Set up help menus and documentation

#### Key Dependencies to Install

```json
{
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^9.0.0",
    "dotenv": "^16.0.0",
    "glob": "^8.0.1",
    "inquirer": "^8.2.0",
    "ora": "^6.0.1",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.3"
  }
}
```

### Phase 2: File Management Implementation (3 days)

#### Tasks

1. **File Manager Module**
   - Implement directory scanning functionality
   - Create file moving operations
   - Implement file reading/writing utilities
   - Add error handling and validation

2. **Metadata Module**
   - Create schema for metadata
   - Implement functions to read/write metadata
   - Add validation for metadata integrity
   - Create generators for standard metadata

3. **Integration with Existing File Structure**
   - Map CLI buckets to existing project directories
   - Create utility functions for path resolution
   - Support various data types (testimonies, events, etc.)

#### Integration Points

- Integrate with existing file structure in `scripts/data-import`
- Leverage existing file naming conventions
- Support various data types: testimonies, events, personnel, etc.

### Phase 3: Processing Commands (3 days)

#### Tasks

1. **Implement Processing Commands**
   - Create `process:list` command to show files in processing bucket
   - Implement `process:transform` for file transformation
   - Add `process:enhance` for AI-assisted enhancements

2. **AI Assistant Integration**
   - Create aiAssistant.js module
   - Implement API connection to LLM
   - Build prompt templates for data enhancement
   - Add result processing and application

3. **Transform Existing Scripts**
   - Adapt existing process-testimonies.ts
   - Support multiple data types
   - Add interactive options

#### Sample Implementation for process:list

```javascript
// src/commands/processing.js
module.exports = (program) => {
  program
    .command('process:list')
    .description('List all files in the processing bucket')
    .action(async () => {
      const files = await fileManager.listFiles('processing');
      console.log(chalk.green('Files in Processing Bucket:'));
      files.forEach((file) => console.log(`- ${file}`));
    });
  
  // Additional commands...
}
```

### Phase 4: Review Commands (2 days)

#### Tasks

1. **Implement Review Commands**
   - Create `review:list` to display files ready for review
   - Implement `review:preview` for data preview
   - Add `review:approve` and `review:reject` commands

2. **Interactive Preview Functionality**
   - Build data sampling for preview
   - Create formatted display of data
   - Add options for viewing different aspects of data

3. **Approval Workflow**
   - Implement file movement with metadata
   - Add validation before approval
   - Create logging for audit trail

#### Integration with Existing Validation

Leverage existing data quality validation from import-testimonies-to-xata.ts:

```javascript
function validateDataQuality(data) {
  // Adaptation of existing validation logic
  // See import-testimonies-to-xata.ts for reference
}
```

### Phase 5: Insertion Commands (3 days)

#### Tasks

1. **Implement Insertion Commands**
   - Create `insert:list` to show files in insertion bucket
   - Implement `insert:batch` for batch insertion
   - Add `insert:bulk` for bulk insertion

2. **Xata Client Integration**
   - Create xataClient.js as a wrapper for the existing Xata client
   - Add error handling and retry logic
   - Implement progress tracking

3. **Adapt Existing Import Logic**
   - Integrate with existing import-testimonies-to-xata.ts
   - Support multiple data types
   - Add interactive confirmation

#### Integration with Xata

```javascript
// src/lib/xataClient.js
const { getXataClient } = require('../../src/db/xata/xata');

async function insertRecords(tableName, records, options = {}) {
  const xata = getXataClient();
  
  // Implementation that handles batching, errors, etc.
}

module.exports = {
  insertRecords,
  // Additional functions...
};
```

### Phase 6: Testing and Documentation (2 days)

#### Tasks

1. **Comprehensive Testing**
   - Create test cases for each command
   - Test with various data types
   - Test error handling and edge cases

2. **Documentation**
   - Update README.md with detailed usage instructions
   - Add JSDoc comments to all functions
   - Create example workflows

3. **User Guide**
   - Create step-by-step guides for common workflows
   - Add troubleshooting section
   - Include examples with real data

## 3. Core Concepts & Functionality

### Buckets

- **Processing Bucket**: A folder (e.g., /data/processing) where new/unprocessed data files reside.
- **Insertion Bucket**: A folder (e.g., /data/insertion) where files approved after review are moved. These files are "ready to roll" for insertion into Xata.

### Metadata

Each file that lands in the insertion bucket will be accompanied by a metadata JSON containing:

- **Data schema**: For example, the JSON schema or CSV structure.
- **Record count**: The number of records contained.
- **Target Xata table**: Which table in Xata should receive the data.
- **Processing date/timestamp**: When the file was processed.
- **Quality score**: Based on validation rules (from existing code).
- **Data type**: What kind of data (testimonies, events, etc.).

### Workflow Phases

1. **Processing Phase**:
   - List & Select Files: Interactive command to show files in the processing bucket.
   - Transformation: Run transformations on the selected files.
   - AI Enhancement: Use the AI assistant to suggest improvements.

2. **Review Phase**:
   - Preview Transformed Data: Show sample data and metadata.
   - Quality Assessment: Display validation results and quality score.
   - Approval Process: Move approved files to the insertion bucket.

3. **Insertion Phase**:
   - Metadata Display: Show file metadata before insertion.
   - Insertion Options: Choose batch or bulk insertion.
   - Robust Insertion: Handle errors and ensure data integrity.

## 4. Data Type Support

The CLI will support multiple data types, leveraging existing processing logic:

1. **Testimonies**:
   - Parse testimony summaries from Markdown files
   - Extract structured data (personnel, events, etc.)
   - Connect to related database tables

2. **Events**:
   - Process event data from various sources
   - Handle geocoding and location data
   - Manage related metadata

3. **Personnel**:
   - Process biographical information
   - Handle authority metrics and rankings
   - Manage relationships to other entities

4. **Organizations**:
   - Process organization data
   - Manage relationships to personnel and events

5. **Extensibility**:
   - Design for easy addition of new data types
   - Create consistent interfaces across types

## 5. Implementation Details

### Command Structure

The CLI will implement these specific commands:

#### Processing Commands

```
process:list              List all files in the processing bucket
process:transform <file>  Transform a file using predefined transformations
process:enhance <file>    Apply AI-powered data enhancements

AI Assistant Integration

Integrate a module (e.g., aiAssistant.js) that:
 • Accepts a file or data preview.
 • Suggests data quality improvements or extraction tweaks.
 • Can optionally run corrections if the user approves.
Think of it as having an AI sidekick that points out “Hey, you missed that column!” with flair.

⸻

3. CLI Application Command Design using Commander

Overall CLI App Structure

Your main entry point (e.g., bin/cli.js) sets up Commander with subcommands or a hierarchical command structure like:

# !/usr/bin/env node

const { program } = require('commander');

// Import commands modules
const processingCmd = require('../src/commands/processing');
const reviewCmd = require('../src/commands/review');
const insertionCmd = require('../src/commands/insertion');

program
  .name('data-processing-cli')
  .description('CLI tool for processing and inserting UFO data into Xata')
  .version('1.0.0');

// Register subcommands
processingCmd(program);
reviewCmd(program);
insertionCmd(program);

program.parse(process.argv);

Subcommand Examples

 1. Processing Commands
 • process:list – Lists all files in the processing bucket.
 • process:transform <file> – Runs a transformation on the selected file.
 • process:enhance <file> – Optionally run the AI assistant to analyze/enhance the file.
 2. Review Commands
 • review:list – Lists files ready for review.
 • review:preview <file> – Displays a preview.
 • review:approve <file> – Moves the file to the insertion bucket along with creating/updating the metadata.
 • review:reject <file> – Option to reject file processing.
 3. Insertion Commands
 • insert:list – View files in the insertion bucket with metadata summary.
 • insert:batch <file> [options] – Perform batch insertion with options for batch interval, preview step, etc.
 • insert:bulk <file> – Perform bulk insertion into the specified Xata table.

Note: Use inquirer to provide interactive menus. For instance, when listing files, present checkboxes or lists for file selection.

⸻

4. Component-Level Detail

4.1. File Management (fileManager.js)
 • Responsibility:
 • Scanning directories (processing vs. insertion).
 • Moving files (after review, move from processing to insertion).
 • Reading and writing metadata alongside each file.
 • Implementation Ideas:
 • Use Node’s fs module along with path for robust file operations.
 • Implement helper methods like listFiles(directory), moveFile(src, dest), and readMetadata(file).

4.2. Metadata Module (metadata.js)
 • Responsibility:
 • Create metadata based on file content (e.g., record count via stream parsing).
 • Store metadata in either a sidecar JSON file or as part of the file header.
 • Implementation Ideas:
 • Define a metadata schema using JSON Schema or even with zod for runtime validation.
 • For example, metadata might include fields like: schema: {...}, recordCount: 123, targetTable: "ufo_events".

4.3. Xata Insertion Client (xataClient.js)
 • Responsibility:
 • Abstract the logic to connect to the Xata API.
 • Handle both batch and bulk insertions.
 • Implementation Ideas:
 • Use a generic function such as insertRecords(tableName, records, options) that wraps error handling, retries, and logging.
 • Validate the target table and ensure the column structure is as expected.

4.4. AI Integration Module (aiAssistant.js)
 • Responsibility:
 • Integrate with an LLM (for example, using the OpenAI API or similar) to provide data quality insights.
 • Implementation Ideas:
 • Expose functions like suggestEnhancements(fileData) that return suggestions.
 • Optionally allow a “fix” command that automatically applies some transformations.

⸻

5. Interactive Workflow & User Experience

Step-by-Step User Flow

 1. User runs CLI entry point:
The Commander framework boots up, showing the main menu with options like “Processing,” “Review,” and “Insertion.”
 2. Processing Phase:
 • List Files: User runs process:list to see available files.
 • Transform/Enhance: User selects a file and runs process:transform or process:enhance (invoking AI assistance if desired).
 • File moves to temporary “pending review” state.
 3. Review Phase:
 • Preview Data: With review:preview <file>, the CLI shows a data sample and metadata.
A quick note: “This file just came in hotter than a UFO sighting on a summer night!”
 • Approve/Reject: Use review:approve to move the file to the insertion bucket (which also writes metadata) or reject it for further manual adjustments.
 4. Insertion Phase:
 • Metadata Summary: insert:list shows all files with metadata such as schema, record count, and target table.
 • Choose Insertion Option: User decides whether to perform batch insertion (with a guided interactive menu that periodically reviews the data on completion of each batch) or a bulk insert.
 • Insertion Execution: The CLI then executes the insertion logic via the xataClient integration, handling errors with options for retry or skipping.

⸻

6. Example Pseudocode Snippets

A. Commander Command Registration (processing.js)

// src/commands/processing.js
const inquirer = require('inquirer');
const fileManager = require('../lib/fileManager');
const chalk = require('chalk');

module.exports = (program) => {
  program
    .command('process:list')
    .description('List all files in the processing bucket')
    .action(async () => {
      const files = await fileManager.listFiles('processing');
      console.log(chalk.green('Files in Processing Bucket:'));
      files.forEach((file) => console.log(`- ${file}`));
    });

  program
    .command('process:transform <file>')
    .description('Transform a file in the processing bucket')
    .action(async (file) => {
      // Add your transformation logic here
      console.log(chalk.blue(`Processing transformation for file: ${file}`));
      // After transformation...
    });

  program
    .command('process:enhance <file>')
    .description('Enhance file using the AI assistant')
    .action(async (file) => {
      const data = await fileManager.readFile(file);
      // Call AI assistant to enhance/validate data quality
      const suggestions = await require('../lib/aiAssistant').suggestEnhancements(data);
      console.log(chalk.yellow('AI Suggestions:'), suggestions);
      // Optionally apply suggestions based on further interactive prompt...
    });
};

B. Insertion Command with Batch Option (insertion.js)

// src/commands/insertion.js
const inquirer = require('inquirer');
const fileManager = require('../lib/fileManager');
const metadata = require('../lib/metadata');
const xataClient = require('../lib/xataClient');
const chalk = require('chalk');

module.exports = (program) => {
  program
    .command('insert:bulk <file>')
    .description('Bulk insert a file from the insertion bucket into Xata')
    .action(async (file) => {
      const meta = await metadata.readMetadata(file);
      console.log(chalk.blue('Insertion Metadata:'), meta);
      // Confirm bulk insertion
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmInsert',
          message: 'Proceed with bulk insertion?',
          default: true,
        },
      ]);
      if (answers.confirmInsert) {
        // Read file data and insert into target Xata table
        const dataRecords = await fileManager.readData(file);
        try {
          await xataClient.bulkInsert(meta.targetTable, dataRecords);
          console.log(chalk.green('Bulk insert successful!'));
        } catch (err) {
          console.error(chalk.red('Bulk insert failed:'), err);
        }
      }
    });

  // Similarly add a batch insert option with periodic reviews (using interactive inquirer prompts)
};

C. Sample AI Assistant Integration (aiAssistant.js)

// src/lib/aiAssistant.js
const axios = require('axios');

async function suggestEnhancements(fileData) {
  // This is a stub showing a call to an LLM service (e.g., OpenAI)
  // In a production environment, securely load API keys and handle errors appropriately
  try {
    const response = await axios.post('<https://api.example-llm.com/suggest>', {
      data: fileData,
    });
    return response.data.suggestions;
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    return 'No suggestions available due to an error.';
  }
}

module.exports = {
  suggestEnhancements,
};

⸻

7. Wrapping Up and Scalability Considerations
 • Error Handling & Logging:
Use packages like ora for spinner-based status updates and chalk for clear terminal outputs. Ensure each command catches errors and provides user options to retry or skip.
 • Plugin Architecture (Future-proofing):
Consider structuring your CLI so that future functionalities (like new AI models or additional data sources) can be plugged in with minimal changes.
 • Testing & Validation:
Integrate automated tests (e.g., with Mocha or Jest) for your file operations, metadata validations, and API interactions with Xata to ensure robustness as data scales.
 • User Experience:
A clean, intuitive interactive menu (via inquirer) alongside clear documentation will be critical. Since you’re developing an internal tool, lean into your inside jokes (about aliens and UFOs) to keep the mood light—even if the data is out of this world.

⸻

This design gives you a modular, scalable, and interactive CLI application built with Commander. It mirrors the functionality intended by your run-import.sh script while extending it with robust interactive capabilities and AI-powered enhancements. Happy coding—and may your data always be as reliable as a well-timed UFO sighting!

/cli/
├── bin/
│   └── cli.js                   # Entry point for your CLI app
├── src/
│   ├── commands/                # All Commander command implementations
│   │   ├── processing.js        # Processing bucket commands
│   │   ├── review.js            # Review phase commands
│   │   └── insertion.js         # Insertion bucket & Xata integration commands
│   ├── lib/
│   │   ├── fileManager.js       # File operations, directory scanning, file moving
│   │   ├── metadata.js          # Handling metadata for each insertion file
│   │   ├── xataClient.js        # Xata client wrapper that abstracts insertion logic
│   │   └── aiAssistant.js       # Integration with an LLM for data enhancements
│   └── config.js                # Central config, such as bucket paths, API keys, etc.
├── package.json                 # Dependencies, scripts (commander, inquirer, ora, chalk, etc.)
└── README.md
