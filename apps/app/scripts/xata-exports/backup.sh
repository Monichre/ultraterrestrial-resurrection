#!/bin/bash

XATA_API_KEY="${XATA_API_KEY}"

if [ -z "$XATA_API_KEY" ]; then
  echo "Error: XATA_API_KEY environment variable is not set."
  exit 1
fi

python3 ./xata_tools/xreplay.py \
--from_workspace UltraTerrestrial-kgubvq \
--from_database ultraterrestrial \
--from_branch main \
--from_region us-east-1 \
--from_XATA_API_KEY $XATA_API_KEY \
--output file \
--output_path ./exports/ \
--output_format csv


