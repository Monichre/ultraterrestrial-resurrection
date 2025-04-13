#!/bin/bash

# Import script for events data
echo "Importing events data to database..."

# Set script directory and project root for proper path resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
EVENTS_DIR="$SCRIPT_DIR/.."
OUTPUT_DIR="$EVENTS_DIR/output"
INSERTION_DIR="$EVENTS_DIR/insertion/events"

echo "Script directory: $SCRIPT_DIR"
echo "Project root: $PROJECT_ROOT"
echo "Events directory: $EVENTS_DIR"

# Create necessary directories if they don't exist
mkdir -p "$OUTPUT_DIR"
mkdir -p "$INSERTION_DIR"

# Check if events.json exists in expected locations
if [ -f "$INSERTION_DIR/events.json" ]; then
  echo "Found events file at $INSERTION_DIR/events.json"
elif [ -f "$OUTPUT_DIR/events.json" ]; then
  echo "Found events file at $OUTPUT_DIR/events.json"
  # Copy to insertion directory to ensure it's available
  cp "$OUTPUT_DIR/events.json" "$INSERTION_DIR/events.json"
  echo "Copied events.json to insertion directory"
else
  echo "Warning: No events.json file found in expected locations. Import may fail."
fi

# Add the XATA_API_KEY to environment if it exists in .env file
if [ -f "$PROJECT_ROOT/.env" ]; then
  echo "Loading environment variables from $PROJECT_ROOT/.env"
  export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Run the import script with Bun
echo "Running import script..."
cd "$PROJECT_ROOT"
bun run scripts/data-import/events/import-events-to-xata.ts "$@"

