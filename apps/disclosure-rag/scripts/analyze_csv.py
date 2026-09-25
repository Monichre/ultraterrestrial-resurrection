#!/usr/bin/env python3
"""
Analyze CSV structure for Triple RAG Schema Adapter
"""

import csv
import json
import sys
from pathlib import Path


def analyze_csv():
    csv_path = Path(__file__).parent / "/data/queue/documents.csv"

    print(f"Analyzing CSV: {csv_path}")
    print("-" * 50)

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames

        print(f"Headers ({len(headers)}): {headers}")
        print("-" * 50)

        # Read first few rows
        for i, row in enumerate(reader):
            if i < 3:
                print(f"Row {i+1}:")
                for key in headers:
                    value = row[key]
                    if value:
                        if len(value) > 100:
                            print(f"  {key}: {value[:100]}...")
                        else:
                            print(f"  {key}: {value}")
                    else:
                        print(f"  {key}: [empty]")
                print()
            else:
                break

    print("Analysis complete!")


if __name__ == "__main__":
    analyze_csv()
