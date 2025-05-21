#!/bin/bash

# Navigate to the vector-store-files directory
cd /Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/vector-store-files

# Initialize counters
total_files=0
error_files=0

# Create a file to store the list of files with errors
error_file_list="/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/error_files.txt"
> "$error_file_list"  # Clear the file if it exists

echo "Scanning files for error messages..."

# Iterate through all JSON files
for file in *.json; do
  total_files=$((total_files + 1))
  
  # Check if the file contains the specific error message using grep
  if grep -q "Failed to fetch document contents: Forbidden" "$file"; then
    echo "$file" >> "$error_file_list"
    error_files=$((error_files + 1))
  fi
done

# Print summary
echo "Found $error_files files with errors out of $total_files total files."
echo "Files with errors are listed in $error_file_list"
echo ""
echo "To remove these files, run:"
echo "cd /Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/vector-store-files && xargs rm < $error_file_list"