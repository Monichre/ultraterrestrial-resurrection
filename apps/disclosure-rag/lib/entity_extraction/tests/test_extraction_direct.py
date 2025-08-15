#!/usr/bin/env python3
from agents.entity_extraction_agent import extract_entities_from_structured_text
import sys
sys.path.append(
    '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/disclosure-rag')


# Read the summary file
with open('/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/sources/transcripts/2025-06-28/-JBwH6yHEDo/rendleshamForestUfoSightingEyewitnessColonelCharlesHaltSummary.txt', 'r') as f:
    content = f.read()

# Test entity extraction
entities = extract_entities_from_structured_text(content)

print("Extracted Entities:")
print("==================")
for entity_type, entity_list in entities.items():
    if entity_list:
        print(f"\n{entity_type.upper()}:")
        for entity in entity_list:
            print(f"  - {entity}")

print(f"\nTotal entities extracted: {sum(len(e) for e in entities.values())}")
