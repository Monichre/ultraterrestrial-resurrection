#!/bin/bash

# Extract Testimony Files Script
# This script finds all *Summary.md files in docs/testimonies and copies them to the processing directory

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"
PROJECT_DIR="$(cd "$BASE_DIR/../" && pwd)"

# Define source and destination directories
SOURCE_DIR="$PROJECT_DIR/docs/testimonies"
DEST_DIR="$BASE_DIR/processing/testimonies"

# Create log directory if it doesn't exist
LOG_DIR="$BASE_DIR/logs"
mkdir -p "$LOG_DIR"

# Log file
LOG_FILE="$LOG_DIR/extract_testimonies_$(date +%Y%m%d_%H%M%S).log"

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

# Check if we should preserve directory structure
read -p "Do you want to preserve the original directory structure? (y/n): " preserve_structure
if [[ $preserve_structure == [yY] || $preserve_structure == [yY][eE][sS] ]]; then
  PRESERVE_STRUCTURE=true
  log "Will preserve original directory structure"
else
  PRESERVE_STRUCTURE=false
  log "Will flatten the directory structure"
fi

# Counter for statistics
TOTAL_FILES=0
COPIED_FILES=0
FAILED_FILES=0

# Find all *Summary.md files
log "Finding *Summary.md files in $SOURCE_DIR..."
SUMMARY_FILES=$(find "$SOURCE_DIR" -name "*Summary.md" -type f)

# Count total files
TOTAL_FILES=$(echo "$SUMMARY_FILES" | wc -l)
TOTAL_FILES=$(echo "$TOTAL_FILES" | tr -d '[:space:]')
log "Found $TOTAL_FILES *Summary.md files"

# Process each file
echo "$SUMMARY_FILES" | while read -r file; do
  if [ -z "$file" ]; then
    continue
  fi
  
  log "Processing: $file"
  
  # Extract file name and relative path
  FILE_NAME=$(basename "$file")
  REL_PATH=$(dirname "${file#$SOURCE_DIR/}")
  
  if [ "$PRESERVE_STRUCTURE" = true ]; then
    # Create target directory with preserved structure
    TARGET_DIR="$DEST_DIR/$REL_PATH"
    mkdir -p "$TARGET_DIR"
    TARGET_FILE="$TARGET_DIR/$FILE_NAME"
  else
    # Flatten structure - use a unique name to avoid conflicts
    DIR_NAME=$(basename "$REL_PATH")
    TARGET_FILE="$DEST_DIR/${DIR_NAME}_${FILE_NAME}"
  fi
  
  # Copy the file
  if cp "$file" "$TARGET_FILE"; then
    log "SUCCESS: Copied to $TARGET_FILE"
    COPIED_FILES=$((COPIED_FILES + 1))
  else
    log "ERROR: Failed to copy $file"
    FAILED_FILES=$((FAILED_FILES + 1))
  fi
done

# Print summary
log "=== Extraction Summary ==="
log "Total files found: $TOTAL_FILES"
log "Successfully copied: $COPIED_FILES"
log "Failed to copy: $FAILED_FILES"
log "Log file: $LOG_FILE"

echo
echo "Testimony extraction complete. See $LOG_FILE for details."
