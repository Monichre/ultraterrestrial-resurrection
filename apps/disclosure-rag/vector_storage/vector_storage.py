"""
Vector storage utilities for knowledge base.
"""

import csv
import json
import os

# Get the directory path
PACKAGE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(PACKAGE_DIR)
VECTOR_STORAGE_DIR = os.path.join(PARENT_DIR, "vector_storage")

def load_vector_store_files():
    """Load vector store files data from CSV."""
    csv_path = os.path.join(VECTOR_STORAGE_DIR, "vector_store_files.csv")
    data = []
    
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    
    return data

def load_vector_store_files_json():
    """Load vector store files data from JSON."""
    json_path = os.path.join(VECTOR_STORAGE_DIR, "vector-store-files.json")
    
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)
