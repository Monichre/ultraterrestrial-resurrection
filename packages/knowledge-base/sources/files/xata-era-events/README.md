# UFO Data Import Scripts

This directory contains scripts for:
1. Transforming and importing UFO sighting data from the National UFO Reporting Center (NUFORC) into the Xata database
2. Extracting and processing historical UFO events from markdown documents in the "ufo-intelligence-docs" directory

## Available Scripts

### 1. `transform-nuforc-data.ts`

This script transforms NUFORC JSON data into the format required by the Xata sightings table, without performing any database operations. It's useful for testing the transformation logic and examining the output before import.

**Usage:**

```bash
# Process a specific file
bun transform-nuforc-data.ts e202309.json 

# Process all JSON files in the data/nuforc directory
bun transform-nuforc-data.ts --all
```

The script outputs the transformed data to `output/transformed-sightings.json`.

### 2. `import-nuforc-sightings.ts`

This script transforms NUFORC data and imports it directly into the Xata database. It processes all JSON files in the `data/nuforc` directory, deduplicates the data, and inserts it into the sightings table.

**Usage:**

```bash
# Generate the transformed data without importing
bun import-nuforc-sightings.ts

# Generate and import into Xata
bun import-nuforc-sightings.ts --import
```

## Data Transformation

The scripts convert NUFORC data to match the Xata sightings table schema as follows:

| NUFORC Field | Xata Field | Notes |
|--------------|------------|-------|
| occurred | date | Parsed from MM/DD/YYYY HH:MM format |
| summary | description | Full sighting description |
| media + link.url | media_link | Only populated if media field is 'Y' |
| city | city | As-is |
| state | state | As-is |
| country | country | As-is |
| shape | shape | As-is |
| summary (partial) | duration_seconds | Extracted if present in summary |
| reported | date_posted | Parsed from MM/DD/YYYY format |
| explanation | comments | Prefixed with "Explanation: " if present |

## Geocoding

The current scripts do not perform geocoding for latitude and longitude coordinates, as this information is not directly provided in the NUFORC data. For geocoding functionality, you would need to:

1. Implement a geocoding service integration (e.g., Google Maps, OpenStreetMap)
2. Use the city, state, and country fields to retrieve coordinates
3. Update the records with the retrieved latitude and longitude values

## Working with Media

The `media` field in the Xata sightings table is a `file[]` type, which would require uploading actual files. The current scripts only populate the `media_link` field with a URL to the NUFORC report when media is available.

To fully populate the media field, you would need to:
1. Download media from the NUFORC links
2. Upload the files to Xata storage
3. Associate them with the appropriate sighting records

## Historical UFO Events Processing

### 1. `prepare-ufo-events-enhanced.js`

This script processes markdown files from the `docs/ufo-intelligence-docs` directory, extracts historical UFO events, and prepares them for import into the Xata events table.

**Features:**
- Extracts event title, description, date, and other metadata
- Advanced date parsing for historical dates (including seasons, month ranges)
- Intelligent location extraction from text descriptions
- Automatic categorization of events (military, sighting, document, etc.)
- Geocoding of locations to get latitude/longitude coordinates
- Batch processing with checkpoints to handle large datasets
- Progress tracking and reporting

**Usage:**

```bash
# Basic usage (process all files)
node prepare-ufo-events-enhanced.js

# Process with a file limit (first N files only)
node prepare-ufo-events-enhanced.js --limit 2

# Resume processing from a saved checkpoint
node prepare-ufo-events-enhanced.js --resume

# Skip the geocoding step
node prepare-ufo-events-enhanced.js --skip-geocoding

# Set custom batch size for geocoding operations
node prepare-ufo-events-enhanced.js --batch-size 50

# Combined options
node prepare-ufo-events-enhanced.js --limit 3 --batch-size 10 --resume
```

### 2. `import-events-to-xata.ts`

This script imports the processed UFO events into the Xata database.

**Features:**
- Enhanced duplicate detection using multiple strategies:
  - Exact title matching
  - Date and location matching
  - Fuzzy title similarity
- Proper handling of long text fields
- Detailed reporting of import results
- Error handling and data validation

**Usage:**

```bash
# Normal import (skips duplicates)
bun run import-events-to-xata.ts

# Force import (imports even if duplicates are detected)
bun run import-events-to-xata.ts --force

# Import without skipping duplicates
bun run import-events-to-xata.ts --no-skip-duplicates
```

### 3. `run-import.sh`

This interactive shell script provides a menu for running the entire import process for both NUFORC sightings and historical UFO events.

**Usage:**

```bash
# Run the script and follow the interactive prompts
./run-import.sh
```

**Features:**
- Interactive menu for import options
- Support for processing options like file limits, resuming, and batch sizes
- Preview of data before importing
- Error handling and progress reporting

## Batch Processing and Performance

The enhanced event processing scripts include several performance optimizations:

1. **Batch Processing**: Geocoding operations are performed in configurable batches 
2. **Checkpointing**: Progress is saved after each batch to allow resuming if interrupted
3. **Selective Processing**: Options to skip geocoding or limit the number of files processed
4. **Parallel Processing**: File extraction uses Promise.all for parallel processing
