#!/bin/bash

# Import Testimony Files Script
# This script imports processed testimony files from the insertion directory into Xata

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"
PROJECT_DIR="$(cd "$BASE_DIR/../" && pwd)"

# Define source directory
SOURCE_DIR="$BASE_DIR/insertion/testimonies"
SOURCE_FILE="$SOURCE_DIR/testimonies.json"

# Create log directory if it doesn't exist
LOG_DIR="$BASE_DIR/logs"
mkdir -p "$LOG_DIR"

# Log file
LOG_FILE="$LOG_DIR/import_testimonies_$(date +%Y%m%d_%H%M%S).log"

# Function to log messages
log() {
  local message="$1"
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
  log "ERROR: Source file '$SOURCE_FILE' does not exist! You must process testimonies first."
  exit 1
fi

# Check command line arguments
FORCE_IMPORT=false
UPDATE_EXISTING=false
MIN_QUALITY=50

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --force|-f)
      FORCE_IMPORT=true
      shift
      ;;
    --update|-u)
      UPDATE_EXISTING=true
      shift
      ;;
    --min-quality)
      if [[ $2 =~ ^[0-9]+$ ]]; then
        MIN_QUALITY=$2
        shift 2
      else
        log "ERROR: --min-quality requires a numeric value"
        exit 1
      fi
      ;;
    --help|-h)
      echo "Usage: import-testimonies.sh [options]"
      echo "Options:"
      echo "  --force, -f                 Force import even if duplicates are detected"
      echo "  --min-quality <score>       Set minimum quality threshold (default: 50)"
      echo "  --update, -u                Update existing records if duplicates are found"
      echo "  --help, -h                  Show this help message"
      exit 0
      ;;
    *)
      log "ERROR: Unknown option: $1"
      echo "Run with --help for usage information"
      exit 1
      ;;
  esac
done

# Build import options
IMPORT_ARGS=""
if [ "$FORCE_IMPORT" = true ]; then
  IMPORT_ARGS="$IMPORT_ARGS --force"
  log "Force import enabled"
fi

if [ "$UPDATE_EXISTING" = true ]; then
  IMPORT_ARGS="$IMPORT_ARGS --update"
  log "Update existing records enabled"
fi

IMPORT_ARGS="$IMPORT_ARGS --min-quality $MIN_QUALITY"
log "Minimum quality threshold: $MIN_QUALITY"

# Run the import process using import-testimonies-to-xata.ts
log "Starting import process with arguments: $IMPORT_ARGS"

cd "$PROJECT_DIR" && bun run scripts/data-import/import-testimonies-to-xata.ts $IMPORT_ARGS

if [ $? -eq 0 ]; then
  log "SUCCESS: Import completed successfully"
else
  log "ERROR: Import failed"
  exit 1
fi

# Print summary
log "=== Import Summary ==="
log "Source file: $SOURCE_FILE"
log "Import arguments: $IMPORT_ARGS"
log "Log file: $LOG_FILE"

echo
echo "Testimony import complete. See $LOG_FILE for details."
