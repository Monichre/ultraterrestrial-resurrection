#!/bin/bash

# UFO Intelligence and Sightings Data Import Script
# This script processes UFO intelligence markdown files and sightings data and imports them to Xata

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$BASE_DIR/../.." && pwd)"

# Create output directory if it doesn't exist
mkdir -p "$BASE_DIR/output"
mkdir -p "$PROJECT_DIR/output"

# Function to prepare events data
prepare_events() {
  echo "=== Preparing Events Data ==="
  
  # Run the preparation script
  echo "Step 1: Processing JSON event files..."
  cd "$PROJECT_DIR" && bun run "$BASE_DIR/events/prepare-events.ts"
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to prepare events data."
    return 1
  fi
  
  echo "Events preparation complete."
  echo "Combined events file saved to: $BASE_DIR/output/events.json"
  echo
  return 0
}

# Function to test events import
test_events_import() {
  echo "=== Testing Events Import ==="
  
  # Run the test import script
  echo "Running validation and test import..."
  cd "$PROJECT_DIR" && bun run "$BASE_DIR/events/test-events-import.ts"
  
  if [ $? -ne 0 ]; then
    echo "Error: Test import failed."
    return 1
  fi
  
  # Display test results summary
  if [ -f "$BASE_DIR/output/validation-report.json" ]; then
    echo "Test import validation complete."
    echo "Please review the validation report at: $BASE_DIR/output/validation-report.json"
  else
    echo "Warning: Validation report not found."
  fi
  
  echo
  return 0
}

# Function to import events data
import_events() {
  echo "=== UFO Intelligence Data Import ==="
  
  # Check if events.json exists
  if [ ! -f "$BASE_DIR/output/events.json" ]; then
    echo "Error: events.json not found. Please prepare the data first."
    return 1
  fi
  
  echo "Step 1: Validating events data..."
  # Run validation/test first
  test_events_import
  
  if [ $? -ne 0 ]; then
    echo "Validation failed. Fix issues before proceeding."
    return 1
  fi
  
  # Prompt for import options
  echo 
  echo "Step 2: Import Configuration"
  read -p "Would you like to proceed with the import? (y/n): " confirm
  if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "Import cancelled."
    return 0
  fi
  
  read -p "Force import even if duplicates are detected? (y/n): " force_option
  force_arg=""
  if [[ $force_option == [yY] || $force_option == [yY][eE][sS] ]]; then
    force_arg="--force"
  fi

  read -p "Update existing records if duplicates are found? (y/n): " update_option
  update_arg=""
  if [[ $update_option == [yY] || $update_option == [yY][eE][sS] ]]; then
    update_arg="--update"
  fi
  
  # Step 3: Import to Xata
  echo
  echo "Step 3: Importing events data to Xata database..."
  
  # Run TypeScript import script with Bun
  echo "Running TypeScript import script..."
  cd "$PROJECT_DIR" && bun run "$BASE_DIR/events/import-events-to-xata.ts" $force_arg $update_arg

  # Check if import was successful
  events_result=$?
  if [ $events_result -ne 0 ]; then
    echo "Error: Failed to import events data to Xata."
    return 1
  fi

  echo
  echo "=== Events import process complete ==="
  echo "Check the logs above for details on imported, skipped, and failed entries."
  
  # Show skipped events report if it exists
  if [ -f "$BASE_DIR/events/skipped-events-report.json" ]; then
    echo "Skipped events report available at: $BASE_DIR/events/skipped-events-report.json"
  fi
  
  echo
  return 0
}

# Function to import sightings data
import_sightings() {
  echo "=== UFO Sightings Data Import ==="

  # Check if sightings data exists
  SIGHTINGS_FILE="$PROJECT_DIR/output/transformed-sightings.json"
  if [ ! -f "$SIGHTINGS_FILE" ]; then
      echo "Error: Sightings data file not found at $SIGHTINGS_FILE"
      return 1
  fi

  # Step 1: Review step
  echo 
  echo "Step 1: Sightings data found."
  echo "  - JSON data: $SIGHTINGS_FILE"
  echo 
  read -p "Would you like to review the sightings data before importing to Xata? (y/n): " confirm
  if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
      # Show a sample of the data
      echo
      echo "Sample of sightings data (first 3 sightings):"
      head -n 30 "$SIGHTINGS_FILE"
      echo
      read -p "Press Enter to continue with import or Ctrl+C to abort..."
  fi

  # Step 2: Import to Xata
  echo
  echo "Step 2: Importing sightings data to Xata database..."
  
  # Use npm script to run TypeScript import script
  cd "$PROJECT_DIR" && npm run import:sightings

  # Check if import was successful
  if [ $? -ne 0 ]; then
      echo "Error: Failed to import sightings data to Xata."
      return 1
  fi

  echo
  echo "=== Sightings import process complete ==="
  echo "Check the logs above for details on imported, skipped, and failed entries."
  echo
  return 0
}

# Display the main menu
show_menu() {
  clear
  echo "=== UFO Data Import Tool ==="
  echo "Select an option:"
  echo "1. Prepare events data (merge and validate)"
  echo "2. Test events import (validate against database schema)"
  echo "3. Import events data to Xata"
  echo "4. Full workflow (prepare -> test -> import)"
  echo "5. Import UFO Sightings data"
  echo "q. Quit"
  echo
}

# Main loop
while true; do
  show_menu
  read -p "Enter your choice (1-5, or q): " choice

  case $choice in
    1)
      prepare_events
      read -p "Press Enter to continue..."
      ;;
    2)
      test_events_import
      read -p "Press Enter to continue..."
      ;;
    3)
      import_events
      read -p "Press Enter to continue..."
      ;;
    4)
      # Full workflow
      prepare_events && test_events_import && import_events
      read -p "Press Enter to continue..."
      ;;
    5)
      # Original sightings import function
      import_sightings
      read -p "Press Enter to continue..."
      ;;
    q|Q)
      echo "Exiting."
      exit 0
      ;;
    *)
      echo "Invalid option. Please try again."
      read -p "Press Enter to continue..."
      ;;
  esac
done
