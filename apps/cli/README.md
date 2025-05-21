# Ultraterrestrial Data Import CLI - Implementation Plan

## Executive Summary

This document outlines the implementation plan for creating a modular, interactive CLI tool to manage the data processing and import workflow for the Ultraterrestrial project. The tool facilitates the movement of data through four distinct phases: Processing, Review, Import, and Insertion, with each phase having its own commands and operations.

## 1. Overall Architecture & Directory Layout

The CLI follows a modular architecture with clear separation of concerns:

```
/cli/
├── bin/
│   └── cli.ts                   # Entry point for your CLI app
├── src/
│   ├── commands/                # All Commander command implementations
│   │   ├── processing.ts        # Processing bucket commands
│   │   ├── review.ts            # Review phase commands
│   │   ├── import.ts            # Import workflow commands
│   │   ├── insertion.ts         # Insertion bucket & Xata integration commands
│   │   └── onboard.ts           # Onboarding and discovery commands
│   ├── lib/
│   │   ├── fileManager.ts       # File operations, directory scanning, file moving
│   │   ├── metadata.ts          # Handling metadata for each insertion file
│   │   ├── xataClient.ts        # Xata client wrapper that abstracts insertion logic
│   │   └── aiAssistant.ts       # Integration with an LLM for data enhancements
│   └── config.ts                # Central config, such as bucket paths, API keys, etc.
├── package.json                 # Dependencies, scripts (commander, inquirer, ora, chalk, etc.)
└── README.md
```

## 2. Command Structure

The CLI implements these specific commands:

### Processing Commands

```
process:list              List all files in the processing bucket
process:transform <file>  Transform a file using predefined transformations
process:enhance <file>    Apply AI-powered data enhancements
```

### Review Commands

```
review:list               Lists files ready for review
review:preview <file>     Displays a preview
review:approve <file>     Moves the file to the insertion bucket along with metadata
review:reject <file>      Option to reject file processing
```

### Import Commands

```
import                    Interactive data import workflow menu
import:prepare-events     Prepare events data by merging and validating
import:test-events        Test events import by validating against database schema
import:events             Import events data to Xata (with --force and --update options)
import:sightings          Import UFO Sightings data
import:table <table>      Import data to any Xata table from a JSON file
```

### Insertion Commands

```
insert:list               View files in the insertion bucket with metadata summary
insert:batch <file>       Perform batch insertion with options
insert:bulk <file>        Perform bulk insertion into the specified Xata table
```

## 3. Getting Started

### Installation

Clone the repository and install dependencies:

```bash
# Navigate to the CLI directory
cd cli

# Install dependencies
npm install

# Build the CLI
npm run build

# Link the CLI globally (optional)
npm link
```

### Usage

Run the CLI with:

```bash
# Using the npm script
npm run start

# Or if globally linked
ut-cli
```

## 4. Workflow

The typical data processing workflow is:

1. **Discover** - Find and import new files into the system
2. **Process** - Transform and prepare files for review
3. **Review** - Validate and approve processed files
4. **Import** - Run specific import workflows for events and sightings
5. **Insert** - Insert approved data into the Xata database

## 5. Development

### Adding a New Command

To add a new command, create a file in the appropriate directory under `src/commands/` and implement the command following the pattern of existing commands.

### Running in Development Mode

To run the CLI in development mode:

```bash
npm run dev
```

## 6. Custom Table Import

The CLI provides a flexible way to import data into any Xata table using the `import:table` command. This is useful for one-off imports or for importing data into tables that don't have specific import workflows.

### Usage

```bash
ut-cli import:table <table-name> -f <file-path> [options]
```

### Options

- `-f, --file <path>`: (Required) Path to the JSON file containing the data to import
- `-d, --dry-run`: Validate the data without performing the actual import
- `--force`: Force import even if duplicates are detected
- `--update`: Update existing records if duplicates are found
- `--batch-size <size>`: Number of records to insert in each batch (default: 50)

### Example

```bash
ut-cli import:table ufo_reports -f ./data/reports.json --update --batch-size 100
```

### JSON Format

The input JSON file should contain an array of objects, where each object represents a record to be inserted into the table:

```json
[
  {
    "field1": "value1",
    "field2": "value2",
    ...
  },
  {
    "field1": "value3",
    "field2": "value4",
    ...
  }
]
```

## 7. Future Enhancements

- Add more data types (testimonies, personnel, organizations, etc.)
- Implement batch processing for large datasets
- Add visualization tools for data quality assessment
