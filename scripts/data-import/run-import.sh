# #!/bin/bash

# # UFO Data Import System Script
# # This script orchestrates the data processing and import workflow with sub-selection capabilities

# # Set the base directory
# BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# PROJECT_DIR="$(cd "$BASE_DIR/../.." && pwd)"

# # Create required directories if they don't exist
# mkdir -p "$BASE_DIR/processing" "$BASE_DIR/insertion" "$BASE_DIR/logs"
# # Function to list subdirectories in a given path
# # Accepts an optional second parameter to include files (true/false)
# list_subdirs() {
#   local parent_dir="$1"
#   local include_files="${2:-false}"
  
#   # Check if directory exists
#   if [ ! -d "$parent_dir" ]; then
#     echo "Warning: Directory $parent_dir does not exist" >&2
#     return 1
#   fi
  
#   # Debug output (commented out to reduce noise)
#   # echo "Listing contents of $parent_dir (include_files=$include_files)" >&2
#   if [ "$include_files" = "true" ]; then
#     # List both directories and files
#     find "$parent_dir" -mindepth 1 -maxdepth 1 \( -type d -o -type f \) | sort | while read -r path; do
#       local name=$(basename "$path")
#       if [ -d "$path" ]; then
#         echo "[DIR] $name"
#       else
#         echo "[FILE] $name"
#       fi
#     done
#   else
#     # Only list directories (original behavior)
#     find "$parent_dir" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort
#   fi
# }

# # Function to list files within a directory (optionally recursive)
# list_files() {
#   local dir_path="$1"
#   local recursive="${2:-false}"
#   local depth="-maxdepth 1"
  
#   if [ "$recursive" = "true" ]; then
#     depth=""
#   fi
  
#   find "$dir_path" -mindepth 1 $depth -type f -not -path "*/\.*" | sort
# }

# # Function to select one or more items from a list
# # Usage: selected_items=$(select_items "Prompt message" "item1|item2|item3" "is_path_array")
# select_items() {
#     local prompt_message="$1"
#     local items_str="$2" # Items as pipe-delimited string
#     local is_path_array="${3:-false}" # Whether array items are paths with [DIR]/[FILE] prefixes
    
#     # Convert pipe-delimited string to array
#     IFS='|' read -ra items_array <<< "$items_str"
    
#     if [ ${#items_array[@]} -eq 0 ]; then
#         echo "No items available to select."
#         read -p "Press Enter to continue..."
#         echo "" # Return empty string
#         return 1
#     fi
    
#     echo "Available options:"
#     echo "$prompt_message"
#     for i in "${!items_array[@]}"; do
#         local item="${items_array[$i]}"
#         if [ "$is_path_array" = "true" ] && [[ "$item" == \[*\]* ]]; then
#             # Format directory/file display with proper indentation
#             local item_type="${item%%]*}]"
#             local item_name="${item#*] }"
#             if [ "$item_type" = "[DIR" ]; then
#                 echo "$((i + 1)). 📁 $item_name/"
#             else
#                 echo "$((i + 1)).    📄 $item_name"
#             fi
#         else
#             echo "$((i + 1)). ${items_array[$i]}"
#         fi
#     done
#     echo "b. Back"
    
#     read -p "Enter choice(s) (e.g., 1, 3-5, a, b): " choice
    
#     local selected_array=()
    
#     case "$choice" in
#         b|B)
#             echo "" # Return empty string
#             return 1 # Indicate back was chosen
#             ;;
#         a|A)
#             selected_array=("${items_array[@]}") # Select all
#             ;;
#         *)
#             # Parse comma-separated list and ranges
#             IFS=',' read -ra ranges <<< "$choice"
#             for range in "${ranges[@]}"; do
#                 if [[ "$range" =~ ^[0-9]+$ ]]; then # Single number
#                     idx=$((range - 1))
#                     if [ $idx -ge 0 ] && [ $idx -lt ${#items_array[@]} ]; then
#                         selected_array+=("${items_array[$idx]}")
#                     else
#                         echo "Warning: Invalid index '$range'. Skipping."
#                     fi
#                 elif [[ "$range" =~ ^([0-9]+)-([0-9]+)$ ]]; then # Range
#                     start=$(( ${BASH_REMATCH[1]} - 1 ))
#                     end=$(( ${BASH_REMATCH[2]} - 1 ))
#                     if [ $start -ge 0 ] && [ $end -lt ${#items_array[@]} ] && [ $start -le $end ]; then
#                         for (( i=start; i<=end; i++ )); do
#                             selected_array+=("${items_array[$i]}")
#                         done
#                     else
#                          echo "Warning: Invalid range '$range'. Skipping."
#                     fi
#                 else
#                     echo "Warning: Invalid input '$range'. Skipping."
#                 fi
#             done
#             # Remove duplicates (optional, but good practice)
#             selected_array=($(printf "%s\n" "${selected_array[@]}" | sort -u))
#             ;;
#     esac
    
#     # Process selections - if this is a path array, extract the actual paths from the [DIR]/[FILE] prefixed items
#     if [ "$is_path_array" = "true" ]; then
#         local actual_selections=()
#         for item in "${selected_array[@]}"; do
#             # Extract just the name portion after the [DIR] or [FILE] prefix
#             if [[ "$item" == \[*\]* ]]; then
#                 actual_selections+=("${item#*] }")
#             else
#                 actual_selections+=("$item")
#             fi
#         done
#         selected_array=("${actual_selections[@]}")
#     fi
    
#     if [ ${#selected_array[@]} -eq 0 ] && [[ "$choice" != "b" && "$choice" != "B" ]]; then
#         echo "No valid items selected."
#         echo "" # Return empty string
#         return 1
#     fi
    
#     # Convert selected items back to pipe-delimited string
#     local result=""
#     for item in "${selected_array[@]}"; do
#         if [ -n "$result" ]; then
#             result="$result|$item"
#         else
#             result="$item"
#         fi
#     done
    
#     # Debug output (comment out in production)
#     echo "Selected: $result"
#     echo "$result" # Output the pipe-delimited selected items
#     return 0 # Indicate success
# }


# # Main menu
# show_main_menu() {
#   clear
#   echo "=== UFO Data Import System ==="
#   echo "1. Extract data files for processing"
#   echo "2. Process data files"
#   echo "3. Import processed data to database"
#   echo "4. Full workflow (extract → process → import)"
#   echo "q. Quit"
#   echo
# }
# # --- Extraction ---
# handle_extraction() {
#   clear
#   echo "=== Extract Data Files ==="
#   # Define potential source tables/types
#   local source_types=("testimonies" "events" "sightings") # Add more as needed
#   local selected_types
  
#   # Convert array to pipe-delimited string
#   local source_types_str=$(printf "%s|" "${source_types[@]}" | sed 's/|$//')
  
#   # Call select_items and capture output as pipe-delimited string
#   local selected_types_str=$(select_items "Select data type(s) to extract:" "$source_types_str")
#   local select_status=$?
  
#   # Convert pipe-delimited string back to array
#   IFS='|' read -ra selected_types <<< "$selected_types_str"
  
#   if [ $select_status -ne 0 ] || [ ${#selected_types[@]} -eq 0 ]; then return; fi
  
#   echo "Selected types for extraction: ${selected_types[*]}"
#   for type in "${selected_types[@]}"; do
#     local script_path="$BASE_DIR/$type/extract-$type.sh"
#     if [ -f "$script_path" ]; then
#       echo "--- Running extraction for $type ---"
      
#       # Check if there are source files to select
#       local source_dir="$BASE_DIR/$type"
#       if [ -d "$source_dir" ]; then
#         # Check if there are files available to select
#         local available_files=($(find "$source_dir" -maxdepth 1 -type f -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.csv" | sort))
        
#         if [ ${#available_files[@]} -gt 0 ]; then
#           # Format file paths for display
#           local displayable_files=()
#           for file in "${available_files[@]}"; do
#             displayable_files+=("[FILE] $(basename "$file")")
#           done
#           # Convert array to pipe-delimited string
#           local displayable_files_str=$(printf "%s|" "${displayable_files[@]}" | sed 's/|$//')
          
#           # Call select_items and capture output
#           local selected_files_str=$(select_items "Select specific file(s) to extract from $type (or select 'All'):" "$displayable_files_str" "true")
#           local select_status=$?
          
#           # Convert pipe-delimited string back to array
#           IFS='|' read -ra selected_files <<< "$selected_files_str"
          
#           if [ $select_status -eq 0 ] && [ ${#selected_files[@]} -gt 0 ]; then
#             # Build full paths for selected files
#             local file_args=""
#             for file in "${selected_files[@]}"; do
#               file_args+=" \"$source_dir/$file\""
#             done
            
#             # Execute with selected files
#             echo "Extracting from selected files: ${selected_files[*]}"
#             eval bash \"$script_path\" $file_args
#           else
#             # No files selected, run with default behavior
#             bash "$script_path"
#           fi
#         else
#           # No files available, run with default behavior
#           bash "$script_path"
#         fi
#       else
#         # No source directory, run with default behavior
#         bash "$script_path"
#       fi
      
#       echo "--- Finished extraction for $type ---"
#     else
#       echo "Warning: Extraction script '$script_path' not found for $type. Skipping."
#     fi
#   done
#   read -p "Extraction process finished. Press Enter to continue..."
# }

# # --- Processing ---
# handle_processing() {
#   clear
#   echo "=== Process Data Files ==="
  
#   # Check if processing directory exists
#   if [ ! -d "$BASE_DIR/processing" ]; then
#     echo "Error: Processing directory does not exist."
#     read -p "Press Enter to continue..."
#     return 1
#   fi
  
#   # Get available data types
#   local available_types=($(list_subdirs "$BASE_DIR/processing"))
  
#   # Check if any data types were found
#   if [ ${#available_types[@]} -eq 0 ]; then
#     echo "No data types found in the processing directory."
#     echo "Please extract data files first (option 1 from main menu)."
#     read -p "Press Enter to continue..."
#     return 1
#   fi
  
#   echo "Available data types for processing: ${available_types[*]}"
#   local selected_types
  
#   # Convert array to pipe-delimited string
#   local available_types_str=$(printf "%s|" "${available_types[@]}" | sed 's/|$//')
  
#   # Call select_items and capture output
#   local selected_types_str=$(select_items "Select data type(s) to process:" "$available_types_str")
#   local select_status=$?
  
#   # Convert pipe-delimited string back to array
#   IFS='|' read -ra selected_types <<< "$selected_types_str"
  
#   if [ $select_status -ne 0 ] || [ ${#selected_types[@]} -eq 0 ]; then return; fi
  
#   echo "Selected types for processing: ${selected_types[*]}"
#   for type in "${selected_types[@]}"; do
#       local script_path="$BASE_DIR/$type/process-$type.sh"
#       if [ -f "$script_path" ]; then
#           echo "--- Running processing for $type ---"
          
#           # Check for files to process
#           local processing_dir="$BASE_DIR/processing/$type"
#           if [ -d "$processing_dir" ]; then
#               # Get list of files in the processing directory
#               local available_files=($(list_subdirs "$processing_dir" "true"))
              
#               if [ ${#available_files[@]} -gt 0 ]; then
#                   # Convert array to pipe-delimited string
#                   local available_files_str=$(printf "%s|" "${available_files[@]}" | sed 's/|$//')
                  
#                   # Call select_items and capture output
#                   local selected_files_str=$(select_items "Select specific file(s) to process from $type (or select 'All'):" "$available_files_str" "true")
#                   local select_status=$?
                  
#                   # Convert pipe-delimited string back to array
#                   IFS='|' read -ra selected_files <<< "$selected_files_str"
                  
#                   if [ $select_status -eq 0 ] && [ ${#selected_files[@]} -gt 0 ]; then
#                       local file_args=""
#                       for file in "${selected_files[@]}"; do
#                           file_args+=" \"$processing_dir/$file\""
#                       done
                      
#                       # Execute with selected files
#                       echo "Processing selected files: ${selected_files[*]}"
#                       eval bash \"$script_path\" $file_args
#                   else
#                       # No files selected, run with default behavior
#                       bash "$script_path"
#                   fi
#               else
#                   # No files available, run with default behavior
#                   bash "$script_path"
#               fi
#           else
#               # No processing directory, run with default behavior
#               bash "$script_path"
#           fi
          
#           echo "--- Finished processing for $type ---"
#       else
#           echo "Warning: Processing script '$script_path' not found for $type. Skipping."
#       fi
#   done
# }

# # --- Importing ---
# handle_import() {
#   clear
#   echo "=== Import Data to Database ==="
  
#   # Check if insertion directory exists
#   if [ ! -d "$BASE_DIR/insertion" ]; then
#     echo "Error: Insertion directory does not exist."
#     read -p "Press Enter to continue..."
#     return 1
#   fi
  
#   # Get available data types
#   local available_types=($(list_subdirs "$BASE_DIR/insertion"))
  
#   # Check if any data types were found
#   if [ ${#available_types[@]} -eq 0 ]; then
#     echo "No data types found in the insertion directory."
#     echo "Please process data files first (option 2 from main menu)."
#     read -p "Press Enter to continue..."
#     return 1
#   fi
  
#   echo "Available data types for import: ${available_types[*]}"
  
#   # Convert array to pipe-delimited string
#   local available_types_str=$(printf "%s|" "${available_types[@]}" | sed 's/|$//')
  
#   # Call select_items and capture output
#   local selected_types_str=$(select_items "Select data type(s) to import:" "$available_types_str")
#   local select_status=$?
#   # Common import options
#   read -p "Force import even if duplicates are detected? (y/n): " force_option
#   force_arg=""
#   if [[ $force_option == [yY] || $force_option == [yY][eE][sS] ]]; then
#     force_arg="--force"
#   fi
  
#   read -p "Update existing records if duplicates are found? (y/n): " update_option
#   update_arg=""
#   if [[ $update_option == [yY] || $update_option == [yY][eE][sS] ]]; then
#     update_arg="--update"
#   fi
  
#   # Add other common options like --min-quality if applicable
  
#   for type in "${selected_types[@]}"; do
#       local script_path="$BASE_DIR/$type/import-$type.sh"
#       if [ -f "$script_path" ]; then
#           echo "--- Running import for $type ---"
          
#           # Check for files to import
#           local insertion_dir="$BASE_DIR/insertion/$type"
#           if [ -d "$insertion_dir" ]; then
#               # Get list of files in the insertion directory
#               local available_files=($(list_subdirs "$insertion_dir" "true"))
              
#               if [ ${#available_files[@]} -gt 0 ]; then
#                   # Convert array to pipe-delimited string
#                   local available_files_str=$(printf "%s|" "${available_files[@]}" | sed 's/|$//')
                  
#                   # Call select_items and capture output
#                   local selected_files_str=$(select_items "Select specific file(s) to import from $type (or select 'All'):" "$available_files_str" "true")
#                   local select_status=$?
                  
#                   # Convert pipe-delimited string back to array
#                   IFS='|' read -ra selected_files <<< "$selected_files_str"
                  
#                   if [ $select_status -eq 0 ] && [ ${#selected_files[@]} -gt 0 ]; then
#                       local file_args=""
#                       for file in "${selected_files[@]}"; do
#                           file_args+=" \"$insertion_dir/$file\""
#                       done
                      
#                       # Execute with selected files and options
#                       echo "Importing selected files: ${selected_files[*]}"
#                       eval bash \"$script_path\" $force_arg $update_arg $file_args
                      
#                       if [ $? -ne 0 ]; then
#                           echo "Warning: Import process returned an error for $type."
#                       fi
#                   else
#                       # No files selected, run with default behavior
#                       bash "$script_path" $force_arg $update_arg
#                   fi
#               else
#                   # No files available, run with default behavior
#                   bash "$script_path" $force_arg $update_arg
#               fi
#           else
#               # No insertion directory, run with default behavior
#               bash "$script_path" $force_arg $update_arg
#           fi
          
#           echo "--- Finished import for $type ---"
#       else
#           echo "Warning: Import script '$script_path' not found for $type. Skipping."
#       fi
#   done
  
#   read -p "Import process finished. Press Enter to continue..."
# }

# # --- Full Workflow ---
# handle_full_workflow() {
#   clear
#   echo "=== Full Data Processing Workflow ==="
#   # Define potential source tables/types for full workflow
#   local source_types=("testimonies" "events" "sightings") # Add more as needed
#   local selected_types
  
#   # Convert array to pipe-delimited string
#   local source_types_str=$(printf "%s|" "${source_types[@]}" | sed 's/|$//')
  
#   # Call select_items and capture output
#   local selected_types_str=$(select_items "Select data type(s) for full workflow (extract -> process -> import):" "$source_types_str")
#   local select_status=$?
  
#   # Convert pipe-delimited string back to array
#   IFS='|' read -ra selected_types <<< "$selected_types_str"
  
#   if [ $select_status -ne 0 ] || [ ${#selected_types[@]} -eq 0 ]; then return; fi
  
#   echo "Selected types for full workflow: ${selected_types[*]}"
#   # Common import options for the import step
#   read -p "Force import even if duplicates are detected? (y/n): " force_option
#   force_arg=""
#   if [[ $force_option == [yY] || $force_option == [yY][eE][sS] ]]; then
#     force_arg="--force"
#   fi

#   read -p "Update existing records if duplicates are found? (y/n): " update_option
#   update_arg=""
#   if [[ $update_option == [yY] || $update_option == [yY][eE][sS] ]]; then
#     update_arg="--update"
#   fi

#   for type in "${selected_types[@]}"; do
#     echo "===== Starting Full Workflow for $type ====="

#     # Step 1: Extraction
#     local extract_script="$BASE_DIR/$type/extract-$type.sh"
#     if [ -f "$extract_script" ]; then
#       echo "--- Running extraction for $type ---"
#       bash "$extract_script"
#       if [ $? -ne 0 ]; then echo "Extraction failed for $type. Aborting workflow for this type."; continue; fi
#       echo "--- Finished extraction for $type ---"
#     else
#       echo "Warning: Extraction script not found for $type. Skipping extraction."
#     fi

#     # Step 2: Processing
#     local process_script="$BASE_DIR/$type/process-$type.sh"
#     if [ -f "$process_script" ]; then
#       echo "--- Running processing for $type ---"
#       bash "$process_script"
#        if [ $? -ne 0 ]; then echo "Processing failed for $type. Aborting workflow for this type."; continue; fi
#       echo "--- Finished processing for $type ---"
#     else
#       echo "Warning: Processing script not found for $type. Skipping processing."
#     fi

#     # Step 3: Importing
#     local import_script="$BASE_DIR/$type/import-$type.sh"
#     if [ -f "$import_script" ]; then
#       echo "--- Running import for $type ---"
#       bash "$import_script" $force_arg $update_arg
#        if [ $? -ne 0 ]; then echo "Import failed for $type."; fi
#       echo "--- Finished import for $type ---"
#     else
#       echo "Warning: Import script not found for $type. Skipping import."
#     fi

#     echo "===== Finished Full Workflow for $type ====="
#     echo
#   done
#   read -p "Full workflow execution finished. Press Enter to continue..."
# }


# # Main loop
# while true; do
#   show_main_menu
#   read -p "Enter your choice (1-4, or q to quit): " choice

#   case $choice in
#     1)
#       handle_extraction
#       ;;
#     2)
#       handle_processing
#       ;;
#     3)
#       handle_import
#       ;;
#     4)
#       handle_full_workflow
#       ;;
#     q|Q)
#       echo "Exiting."
#       exit 0
#       ;;
#     *)
#       echo "Invalid option. Please try again."
#       read -p "Press Enter to continue..."
#       ;;
#   esac
# done


#!/bin/bash

# UFO Intelligence and Sightings Data Import Script
# This script processes UFO intelligence markdown files and sightings data and imports them to Xata

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$BASE_DIR/../.." && pwd)"

# Create output directory if it doesn't exist
mkdir -p "$BASE_DIR/output"
mkdir -p "$PROJECT_DIR/output"

# Display the main menu
echo "=== UFO Data Import Tool ==="
echo "Select an import option:"
echo "1. Import UFO Intelligence/Events data"
echo "2. Import UFO Sightings data"
echo "3. Import both Events and Sightings data"
echo "q. Quit"
echo
read -p "Enter your choice (1, 2, 3, or q): " choice

case $choice in
  1)
    # Import events only
    import_events=true
    import_sightings=false
    ;;
  2)
    # Import sightings only
    import_events=false
    import_sightings=true
    ;;
  3)
    # Import both
    import_events=true
    import_sightings=true
    ;;
  q|Q)
    echo "Exiting."
    exit 0
    ;;
  *)
    echo "Invalid option. Exiting."
    exit 1
    ;;
esac

# Function to import events data
import_events() {
  echo "=== UFO Intelligence Data Import ==="
  echo "Processing markdown files from docs/ufo-intelligence-docs"

  # Step 1: Process the markdown files
  echo "Step 1: Processing markdown files and preparing data..."
  
  # Skip processing if events.json already exists
  if [ -f "$BASE_DIR/output/events.json" ]; then
    echo "JSON file events.json already exists. Skipping processing."
  else
    # Prompt for processing options
    echo "Processing options:"
    read -p "Process all files (a) or limit to N files (l)? (a/l): " files_choice
    if [[ $files_choice == [lL] ]]; then
      read -p "Enter number of files to process: " file_limit
      process_args="--limit $file_limit"
    else
      process_args=""
    fi
    
    read -p "Resume from checkpoint if available? (y/n): " resume_choice
    if [[ $resume_choice == [yY] || $resume_choice == [yY][eE][sS] ]]; then
      process_args="$process_args --resume"
    fi
    
    read -p "Skip geocoding? (y/n): " geocode_choice
    if [[ $geocode_choice == [yY] || $geocode_choice == [yY][eE][sS] ]]; then
      process_args="$process_args --skip-geocoding"
    fi
    
    read -p "Enter batch size for geocoding (default: 25): " batch_size
    if [[ -n "$batch_size" && "$batch_size" =~ ^[0-9]+$ ]]; then
      process_args="$process_args --batch-size $batch_size"
    fi
    
    echo "Running with options: $process_args"
    node "$BASE_DIR/prepare-ufo-events-enhanced.js" $process_args
  fi

  # Check if processing was successful
  if [ $? -ne 0 ]; then
      echo "Error: Failed to process markdown files."
      return 1
  fi

  # Step 2: Review step
  echo 
  echo "Step 2: Data preparation complete."
  echo "  - JSON data: $BASE_DIR/output/events.json"
  echo "  - CSV data: $BASE_DIR/output/events.csv"
  echo 
  read -p "Would you like to review the events data before importing to Xata? (y/n): " confirm
  if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
      # Show a sample of the data
      echo
      echo "Sample of prepared events data (first 3 events):"
      head -n 30 "$BASE_DIR/output/events.json"
      echo
      read -p "Press Enter to continue with import or Ctrl+C to abort..."
  fi

  # Step 3: Import to Xata
  echo
  echo "Step 3: Importing events data to Xata database..."
  
  # Check if we should use TypeScript or JavaScript
  if [ -f "$BASE_DIR/import-events-to-xata.ts" ]; then
    # Use npm script to run TypeScript file
    echo "Running TypeScript import script..."
    cd "$PROJECT_DIR" && npm run import:events
  else
    # Fallback to JavaScript
    echo "Running JavaScript import script..."
    node "$BASE_DIR/import-events-to-xata.js"
  fi

  # Check if import was successful
  if [ $? -ne 0 ]; then
      echo "Error: Failed to import events data to Xata."
      return 1
  fi

  echo
  echo "=== Events import process complete ==="
  echo "Check the logs above for details on imported, skipped, and failed entries."
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

# Main script execution

# Import events if selected
if [ "$import_events" = true ]; then
  import_events
  events_result=$?
else
  events_result=0
fi

# Import sightings if selected
if [ "$import_sightings" = true ]; then
  import_sightings
  sightings_result=$?
else
  sightings_result=0
fi

# Final status
if [ $events_result -eq 0 ] && [ $sightings_result -eq 0 ]; then
  echo "All requested import operations completed successfully."
  exit 0
else
  echo "One or more import operations failed. Check the logs above for details."
  exit 1
fi
