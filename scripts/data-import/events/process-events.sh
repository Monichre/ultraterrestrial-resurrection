#!/bin/bash

# Process script for events data
echo "Processing events data..."

# Determine if AI should be used
use_ai=true
use_titles=true
skip_geocoding=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --with-ai)
      use_ai=true
      shift
      ;;
    --skip-ai)
      use_ai=false
      shift
      ;;
    --with-titles)
      use_titles=true
      shift
      ;;
    --skip-titles)
      use_titles=false
      shift
      ;;
    --with-geocoding)
      skip_geocoding=false
      shift
      ;;
    --skip-geocoding)
      skip_geocoding=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Build the command with appropriate flags
cmd="node events/prepare-ufo-events-enhanced.js"

if [ "$skip_geocoding" = true ]; then
  cmd="$cmd --skip-geocoding"
fi

if [ "$use_ai" = false ]; then
  cmd="$cmd --skip-ai"
fi

if [ "$use_titles" = false ]; then
  cmd="$cmd --skip-titles"
fi

# Print and execute the command
echo "Running command: $cmd"
cd "$(dirname "$0")/.."
$cmd

