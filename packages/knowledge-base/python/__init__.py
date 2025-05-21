"""
Knowledge Base package for Ultraterrestrial project.
Provides access to shared knowledge resources.
"""

import json
import os

# Get the directory path
PACKAGE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(PACKAGE_DIR)

# Load external resources
def load_external_resources():
    """Load external resources from JSON file."""
    resources_path = os.path.join(PARENT_DIR, "external_resources.json")
    with open(resources_path, "r", encoding="utf-8") as f:
        return json.load(f)

# Export resources
external_resources = load_external_resources()
