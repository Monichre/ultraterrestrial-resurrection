#!/bin/bash

# UFO Data Import System Script
# This script orchestrates the data processing and import workflow

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$BASE_DIR/../.." && pwd)"

# Create required directories if they don't exist
mkdir -p "$BASE_DIR/processing" "$BASE_DIR/insertion" "$BASE_DIR/logs"

# Function to check if directories exist in a parent directory
has_subdirs() {
  local parent_dir="$1"
  local count=$(find "$parent_dir" -mindepth 1 -maxdepth 1 -type d | wc -l)
  
  if [ "$count" -gt 0 ]; then
    return 0  # true in bash
  else
    return 1  # false in bash
  fi
}

# Function to list available data types in processing directory
list_processing_data_types() {
  if has_subdirs "$BASE_DIR/processing"; then
    echo "Available data types for processing:"
    local i=1
    for dir in "$BASE_DIR/processing"/*; do
      if [ -d "$dir" ]; then
        echo "$i. $(basename "$dir")"
        i=$((i + 1))
      fi
    done
  else
    echo "No data types available for processing."
  fi
}

# Function to list available data types in insertion directory
list_insertion_data_types() {
  if has_subdirs "$BASE_DIR/insertion"; then
    echo "Available data types for import:"
    local i=1
    for dir in "$BASE_DIR/insertion"/*; do
      if [ -d "$dir" ]; then
        echo "$i. $(basename "$dir")"
        i=$((i + 1))
      fi
    done
  else
    echo "No data types available for import."
  fi
}

# Main menu
show_main_menu() {
  clear
  echo "=== UFO Data Import System ==="
  echo "1. Extract data files for processing"
  echo "2. Process data files"
  echo "3. Import processed data to database"
  echo "4. Full workflow (extract → process → import)"
  echo "q. Quit"
  echo
  echo "Current Status:"
  echo "--------------"
  echo "Processing directory:"
  if has_subdirs "$BASE_DIR/processing"; then
    for dir in "$BASE_DIR/processing"/*; do
      if [ -d "$dir" ]; then
        local count=$(find "$dir" -type f | wc -l)
        echo "- $(basename "$dir"): $count files"
      fi
    done
  else
    echo "- No data available for processing"
  fi
  
  echo "Insertion directory:"
  if has_subdirs "$BASE_DIR/insertion"; then
    for dir in "$BASE_DIR/insertion"/*; do
      if [ -d "$dir" ]; then
        local count=$(find "$dir" -type f | wc -l)
        echo "- $(basename "$dir"): $count files"
      fi
    done
  else
    echo "- No data ready for insertion"
  fi
  echo
}

# Extract menu
show_extract_menu() {
  clear
  echo "=== Extract Data Files ==="
  echo "Select data type to extract:"
  echo "1. Testimonies (from docs/testimonies/)"
  echo "2. Events (from docs/events/)"
  echo "3. Sightings (from external data)"
  echo "b. Back to main menu"
  echo
}

# Process menu - dynamically built based on available data types
show_process_menu() {
  clear
  echo "=== Process Data Files ==="
  
  if ! has_subdirs "$BASE_DIR/processing"; then
    echo "No data available for processing. Please extract data files first."
    echo
    read -p "Press Enter to continue..."
    return
  fi
  
  echo "Select data type to process:"
  local data_types=()
  local i=1
  
  for dir in "$BASE_DIR/processing"/*; do
    if [ -d "$dir" ]; then
      data_types+=("$(basename "$dir")")
      echo "$i. $(basename "$dir")"
      i=$((i + 1))
    fi
  done
  
  echo "b. Back to main menu"
  echo
  
  read -p "Enter your choice: " process_choice
  
  if [[ $process_choice == "b" || $process_choice == "B" ]]; then
    return
  fi
  
  if [[ $process_choice =~ ^[0-9]+$ && $process_choice -ge 1 && $process_choice -le ${#data_types[@]} ]]; then
    local selected_type="${data_types[$((process_choice-1))]}"
    echo "Processing $selected_type data..."
    
    # Check if processor script exists and run it
    if [ -f "$BASE_DIR/$selected_type/process-$selected_type.sh" ]; then
      bash "$BASE_DIR/$selected_type/process-$selected_type.sh"
    else
      echo "Error: Processor script not found for $selected_type"
    fi
    
    read -p "Press Enter to continue..."
  else
    echo "Invalid choice."
    read -p "Press Enter to continue..."
  fi
}

# Import menu - dynamically built based on available data types
show_import_menu() {
  clear
  echo "=== Import Data to Database ==="
  
  if ! has_subdirs "$BASE_DIR/insertion"; then
    echo "No data available for import. Please process data files first."
    echo
    read -p "Press Enter to continue..."
    return
  fi
  
  echo "Select data type to import:"
  local data_types=()
  local i=1
  
  for dir in "$BASE_DIR/insertion"/*; do
    if [ -d "$dir" ]; then
      data_types+=("$(basename "$dir")")
      echo "$i. $(basename "$dir")"
      i=$((i + 1))
    fi
  done
  
  echo "b. Back to main menu"
  echo
  
  read -p "Enter your choice: " import_choice
  
  if [[ $import_choice == "b" || $import_choice == "B" ]]; then
    return
  fi
  
  if [[ $import_choice =~ ^[0-9]+$ && $import_choice -ge 1 && $import_choice -le ${#data_types[@]} ]]; then
    local selected_type="${data_types[$((import_choice-1))]}"
    echo "Importing $selected_type data..."
    
    # Additional import options
    read -p "Force import even if duplicates are detected? (y/n): " force_option
    if [[ $force_option == [yY] || $force_option == [yY][eE][sS] ]]; then
      import_args="--force"
    else
      import_args=""
    fi
    
    read -p "Update existing records if duplicates are found? (y/n): " update_option
    if [[ $update_option == [yY] || $update_option == [yY][eE][sS] ]]; then
      import_args="$import_args --update"
    fi
    
    # Check if importer script exists and run it
    if [ -f "$BASE_DIR/$selected_type/import-$selected_type.sh" ]; then
      bash "$BASE_DIR/$selected_type/import-$selected_type.sh" $import_args
    else
      echo "Error: Importer script not found for $selected_type"
    fi
    
    read -p "Press Enter to continue..."
  else
    echo "Invalid choice."
    read -p "Press Enter to continue..."
  fi
}

# Function to handle extraction
handle_extraction() {
  show_extract_menu
  read -p "Enter your choice: " extract_choice
  
  case $extract_choice in
    1)
      # Extract testimonies
      echo "Extracting testimonies from docs/testimonies/..."
      if [ -f "$BASE_DIR/testimonies/extract-testimonies.sh" ]; then
        bash "$BASE_DIR/testimonies/extract-testimonies.sh"
      else
        echo "Error: Testimony extraction script not found"
      fi
      read -p "Press Enter to continue..."
      ;;
    2)
      # Extract events
      echo "Extracting events from docs/events/..."
      echo "Not implemented yet."
      read -p "Press Enter to continue..."
      ;;
    3)
      # Extract sightings
      echo "Extracting sightings from external data..."
      echo "Not implemented yet."
      read -p "Press Enter to continue..."
      ;;
    b|B)
      # Return to main menu
      return
      ;;
    *)
      echo "Invalid choice."
      read -p "Press Enter to continue..."
      ;;
  esac
}

# Function to run a full workflow for a selected data type
run_full_workflow() {
  clear
  echo "=== Full Data Processing Workflow ==="
  echo "Select data type for full workflow (extract → process → import):"
  echo "1. Testimonies"
  echo "2. Events"
  echo "3. Sightings"
  echo "b. Back to main menu"
  echo
  
  read -p "Enter your choice: " workflow_choice
  
  case $workflow_choice in
    1)
      # Testimonies workflow
      echo "Running full testimonies workflow..."
      
      echo "Step 1: Extracting testimonies..."
      if [ -f "$BASE_DIR/testimonies/extract-testimonies.sh" ]; then
        bash "$BASE_DIR/testimonies/extract-testimonies.sh"
      else
        echo "Error: Testimony extraction script not found"
        read -p "Press Enter to continue..."
        return
      fi
      
      echo "Step 2: Processing testimonies..."
      if [ -f "$BASE_DIR/testimonies/process-testimonies.sh" ]; then
        bash "$BASE_DIR/testimonies/process-testimonies.sh"
      else
        echo "Error: Testimony processing script not found"
        read -p "Press Enter to continue..."
        return
      fi
      
      echo "Step 3: Importing testimonies to database..."
      if [ -f "$BASE_DIR/testimonies/import-testimonies.sh" ]; then
        read -p "Force import even if duplicates are detected? (y/n): " force_option
        if [[ $force_option == [yY] || $force_option == [yY][eE][sS] ]]; then
          import_args="--force"
        else
          import_args=""
        fi
        
        read -p "Update existing records if duplicates are found? (y/n): " update_option
        if [[ $update_option == [yY] || $update_option == [yY][eE][sS] ]]; then
          import_args="$import_args --update"
        fi
        
        bash "$BASE_DIR/testimonies/import-testimonies.sh" $import_args
      else
        echo "Error: Testimony import script not found"
      fi
      
      echo "Testimony workflow completed."
      read -p "Press Enter to continue..."
      ;;
    2)
      # Events workflow
      echo "Running full events workflow..."
      echo "Not implemented yet."
      read -p "Press Enter to continue..."
      ;;
    3)
      # Sightings workflow
      echo "Running full sightings workflow..."
      echo "Not implemented yet."
      read -p "Press Enter to continue..."
      ;;
    b|B)
      # Return to main menu
      return
      ;;
    *)
      echo "Invalid choice."
      read -p "Press Enter to continue..."
      ;;
  esac
}

# Main loop
while true; do
  show_main_menu
  read -p "Enter your choice (1-4, or q to quit): " choice
  
  case $choice in
    1)
      handle_extraction
      ;;
    2)
      show_process_menu
      ;;
    3)
      show_import_menu
      ;;
    4)
      run_full_workflow
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
