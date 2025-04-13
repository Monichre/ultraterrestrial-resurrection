# Function to import testimonies data
import_testimonies() {
  echo "=== UFO Testimonies Data Import ==="
  echo "Processing testimony files from docs/testimonies"

  # Step 1: Check if we should proceed
  read -p "Would you like to process and import testimony files? (y/n): " confirm
  if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "Skipping testimonies import."
    return 0
  fi

  # Step 2: Ask for import options
  echo
  echo "Import options:"
  
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
  
  read -p "Enter minimum quality threshold (default: 50): " quality_score
  if [[ -n "$quality_score" && "$quality_score" =~ ^[0-9]+$ ]]; then
    import_args="$import_args --min-quality $quality_score"
  fi

  # Step 3: Run the import script
  echo
  echo "Running testimonies import with options: $import_args"
  cd "$PROJECT_DIR" && bun run scripts/data-import/import-testimonies-to-xata.ts $import_args
  
  # Check if import was successful
  if [ $? -ne 0 ]; then
    echo "Error: Failed to import testimonies data to Xata."
    return 1
  fi
  
  echo
  echo "=== Testimonies import process complete ==="
  echo "Check the logs above for details on imported, skipped, and failed entries."
  echo
  return 0
}
