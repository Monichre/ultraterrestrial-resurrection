#!/bin/bash

# Process Testimony Files Script
# This script processes testimony files from the processing directory and prepares them for insertion

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"
PROJECT_DIR="$(cd "$BASE_DIR/../" && pwd)"

# Define source and destination directories
SOURCE_DIR="$BASE_DIR/processing/testimonies"
DEST_DIR="$BASE_DIR/insertion/testimonies"

# Create log directory if it doesn't exist
LOG_DIR="$BASE_DIR/logs"
mkdir -p "$LOG_DIR"

# Log file
LOG_FILE="$LOG_DIR/process_testimonies_$(date +%Y%m%d_%H%M%S).log"

# Function to log messages
log() {
  local message="$1"
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  log "ERROR: Source directory '$SOURCE_DIR' does not exist!"
  exit 1
fi

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"
log "Created destination directory: $DEST_DIR"

# Check if typescript runner should be used
if command -v bun &> /dev/null; then
  TS_RUNNER="bun run"
  log "Using bun as TypeScript runner"
elif command -v npx &> /dev/null; then
  TS_RUNNER="npx ts-node"
  log "Using npx ts-node as TypeScript runner"
else
  log "ERROR: No TypeScript runner found. Please install bun or ts-node."
  exit 1
fi

# Counter for statistics
TOTAL_FILES=0
PROCESSED_FILES=0
FAILED_FILES=0

# Find all testimony files in the processing directory
log "Finding testimony files in $SOURCE_DIR..."
TESTIMONY_FILES=$(find "$SOURCE_DIR" -name "*Summary.md" -type f)

# Count total files
TOTAL_FILES=$(echo "$TESTIMONY_FILES" | wc -l)
TOTAL_FILES=$(echo "$TOTAL_FILES" | tr -d '[:space:]')
log "Found $TOTAL_FILES testimony files to process"

# Process each file
OUTPUT_JSON="$DEST_DIR/testimonies.json"
echo "[]" > "$OUTPUT_JSON"  # Initialize with empty array

COUNTER=0

echo "$TESTIMONY_FILES" | while read -r file; do
  if [ -z "$file" ]; then
    continue
  fi
  
  log "Processing: $file"
  COUNTER=$((COUNTER + 1))
  
  # Extract testimony data using TypeScript script
  TEMP_OUTPUT="$DEST_DIR/testimony_$(basename "$file" .md).json"
  
  # Use import-testimonies-to-xata.ts to process a single file in extract-only mode
  cd "$PROJECT_DIR" && $TS_RUNNER "$BASE_DIR/testimonies/extract-single-testimony.ts" "$file" "$TEMP_OUTPUT"
  
  if [ $? -eq 0 ] && [ -f "$TEMP_OUTPUT" ]; then
    log "SUCCESS: Processed to $TEMP_OUTPUT"
    
    # Append to main JSON file (would need better JSON merging in real implementation)
    if [ "$COUNTER" -eq 1 ]; then
      # Remove trailing bracket, will be added back at the end
      sed '$ s/]$//' "$OUTPUT_JSON" > "$OUTPUT_JSON.tmp"
      mv "$OUTPUT_JSON.tmp" "$OUTPUT_JSON"
      # Add the content (without brackets)
      sed -e 's/^\[//' -e 's/\]$//' "$TEMP_OUTPUT" >> "$OUTPUT_JSON"
    else
      # Add comma and content (without brackets)
      echo "," >> "$OUTPUT_JSON"
      sed -e 's/^\[//' -e 's/\]$//' "$TEMP_OUTPUT" >> "$OUTPUT_JSON"
    fi
    
    PROCESSED_FILES=$((PROCESSED_FILES + 1))
  else
    log "ERROR: Failed to process $file"
    FAILED_FILES=$((FAILED_FILES + 1))
  fi
done

# Close the JSON array
echo "]" >> "$OUTPUT_JSON"

# Print summary
log "=== Processing Summary ==="
log "Total files found: $TOTAL_FILES"
log "Successfully processed: $PROCESSED_FILES"
log "Failed to process: $FAILED_FILES"
log "Output file: $OUTPUT_JSON"
log "Log file: $LOG_FILE"

echo
echo "Testimony processing complete. See $LOG_FILE for details."
