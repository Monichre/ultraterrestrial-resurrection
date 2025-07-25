#!/usr/bin/env python3

def extract_entities_from_structured_text(text):
    """
    Extract entities from structured analysis text.
    Handles multiple formats including both research prompt format and actual analysis outputs.
    """
    entities = {
        "topics": [],
        "personnel": [],  
        "events": [],
        "organizations": [],
        "locations": []
    }
    
    lines = text.split('\n')
    current_section = None
    
    # Extended section mappings to handle multiple formats
    section_mappings = {
        # Original format
        "topics covered": "topics",
        "personnel mentioned": "personnel",
        "events referenced": "events", 
        "organizations involved": "organizations",
        "locations mentioned": "locations",
        # New format from actual analysis outputs
        "personnel:": "personnel",
        "event details:": "events",
        "organizational involvement:": "organizations",
        "location:": "locations",
        "topic:": "topics",
        # Additional variations
        "topics:": "topics",
        "events:": "events",
        "organizations:": "organizations",
        "locations:": "locations"
    }
    
    # Also extract from structured fields like "Name:" within sections
    in_personnel_section = False
    in_event_section = False
    in_org_section = False
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        # Check for section headers
        lower_line = line.lower()
        
        # Reset section tracking
        found_section = False
        
        # Check if this line is a section header by looking for uppercase text followed by colon
        if line.isupper() and line.endswith(':'):
            # Map uppercase headers to entity types
            if 'PERSONNEL' in line:
                current_section = 'personnel'
                found_section = True
                in_personnel_section = True
            elif 'EVENT' in line:
                current_section = 'events'
                found_section = True
                in_event_section = True
            elif 'ORGANIZATION' in line:
                current_section = 'organizations'
                found_section = True
                in_org_section = True
            elif 'LOCATION' in line:
                current_section = 'locations'
                found_section = True
            else:
                # Reset section if we find other uppercase headers
                current_section = None
                in_personnel_section = False
                in_event_section = False
                in_org_section = False
        
        if not found_section:
            for section_key, entity_type in section_mappings.items():
                # Be more specific about section headers - they should be at the start or be bolded
                if section_key in lower_line and (":" in line or "**" in line):
                    # Skip if this is a field within a section (like "Location:" within EVENT DETAILS)
                    if line.startswith(("Location:", "Name:", "Date:", "Role:", "Bio:", "Coordinates:", "Adjacent to:")):
                        continue
                    current_section = entity_type
                    found_section = True
                    # Track specific sections for field-based extraction
                    in_personnel_section = (entity_type == "personnel")
                    in_event_section = (entity_type == "events")
                    in_org_section = (entity_type == "organizations")
                    break
        
        # If we didn't find a section, check if we should stop tracking current section
        if not found_section and (line.startswith(('===', '**===')) or line.startswith(('RESEARCH NOTES:', 'EVIDENCE DOCUMENTATION:', 'Key Testimony Details:'))):
            current_section = None
            in_personnel_section = False
            in_event_section = False
            in_org_section = False
            continue
        
        # Extract entities based on context
        if current_section and line and not found_section:
            # Skip lines that are clearly not entity names
            if line.startswith(('Authority Metrics:', 'Key Testimony Details:', 'Physical Evidence:', 
                              'Audio Recording:', 'Direct UFO Observation:', 'Equipment Effects:',
                              'Analysis shows', 'Outstanding Questions:', 'Credibility Factors:',
                              'RESEARCH NOTES:')):
                current_section = None
                continue
            
            # Extract from numbered/bulleted lists (but not from personnel metrics)
            if current_section != "personnel" and (line.startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '-', '•')) or (len(line) > 2 and line[0].isdigit() and line[1:3] == '. ')):
                # Clean up the entity name
                entity = line
                # Remove numbering and bullet points
                entity = entity.lstrip('0123456789.-• ')
                # Remove common prefixes
                if entity.startswith(('Role:', 'Location:', 'Description:')):
                    continue
                # Get first line before any details
                entity = entity.split('\n')[0].split('-')[0].strip()
                if entity and len(entity) > 2 and len(entity) < 100:
                    entities[current_section].append(entity)
            
            # Extract from "Name:" fields in personnel sections
            elif in_personnel_section and line.startswith("Name:"):
                name = line.replace("Name:", "").strip()
                if name and len(name) > 2 and len(name) < 100:
                    entities["personnel"].append(name)
            
            # Extract from "Name:" fields in event sections
            elif in_event_section and line.startswith("Name:"):
                name = line.replace("Name:", "").strip()
                if name and len(name) > 2 and len(name) < 200:
                    entities["events"].append(name)
            
            # Extract organization names
            elif in_org_section:
                # Handle numbered organizations like "1. US Military Response:"
                if len(line) > 2 and line[0].isdigit() and '. ' in line and line.endswith(':'):
                    org_name = line.split('. ', 1)[1].rstrip(':').strip()
                    # Clean up common suffixes
                    for suffix in [' Response', ' Agencies', ' Organizations']:
                        if org_name.endswith(suffix):
                            org_name = org_name[:-len(suffix)].strip()
                    if org_name and len(org_name) > 2 and len(org_name) < 100:
                        entities["organizations"].append(org_name)
                elif line.startswith("Name:"):
                    name = line.replace("Name:", "").strip()
                    if name and len(name) > 2 and len(name) < 100:
                        entities["organizations"].append(name)
                # Skip bullet points under organizations
                elif line.startswith('-'):
                    continue
            
            # Extract locations from Location: and Adjacent to: fields
            elif line.startswith(("Location:", "Adjacent to:")):
                if line.startswith("Location:"):
                    location = line.replace("Location:", "").strip()
                else:
                    location = line.replace("Adjacent to:", "").strip()
                    
                if location and len(location) > 2 and len(location) < 200:
                    # Remove coordinates and parenthetical info
                    location = location.split("(")[0].strip()
                    # For "Adjacent to:", split multiple locations by "/"
                    if "/" in location:
                        for loc in location.split("/"):
                            loc = loc.strip()
                            if loc and len(loc) > 2:
                                entities["locations"].append(loc)
                    # For single locations with multiple place names separated by commas
                    elif "," in location:
                        # Split by comma and take each part
                        parts = [part.strip() for part in location.split(",")]
                        for part in parts:
                            if part and len(part) > 2:
                                entities["locations"].append(part)
                    else:
                        entities["locations"].append(location)
            
            # Also look for standalone names in personnel section
            elif current_section == "personnel" and len(line.split()) <= 4 and line.replace(' ', '').replace('.', '').replace('-', '').isalpha():
                if len(line) > 2 and len(line) < 50 and not line.lower().startswith(('the', 'and', 'but', 'for')):
                    entities[current_section].append(line)
    
    # Remove duplicates and clean up
    for entity_type in entities:
        # Clean up entries
        cleaned = []
        for entity in entities[entity_type]:
            # Remove role descriptions that might have been captured
            entity = entity.split(" - ")[0].strip()
            # Remove trailing colons from organization names
            entity = entity.rstrip(':')
            # Remove any parenthetical info
            entity = entity.split("(")[0].strip()
            
            # Filter out common noise words and duplicates
            if entity and entity not in cleaned and not entity.lower() in [
                'the', 'and', 'or', 'but', 'for', 'with', 'from', 'to', 'by',
                'in', 'on', 'at', 'this', 'that', 'these', 'those', 'there',
                'analysis shows', 'according to', 'based on', 'evidence suggests',
                'multiple', 'various', 'several', 'many', 'some', 'few', 'limited'
            ]:
                cleaned.append(entity)
        
        entities[entity_type] = cleaned
    
    return entities

# Read the summary file
with open('/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/transcripts/2025-06-28/-JBwH6yHEDo/rendleshamForestUfoSightingEyewitnessColonelCharlesHaltSummary.txt', 'r') as f:
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