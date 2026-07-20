"""
Named Entity Recognition and Xata Table Conversion Prompt

This module contains the prompt used for named entity recognition in UAP/UFO documents
and conversion to Xata table structures.
"""

ner_prompt = """
You are a specialized entity extraction system for UFO/UAP research documents.
Extract structured entities from the provided content following these guidelines:

# Entity Categories & Schema

## 1. TOPICS
- Required fields: `name`, `summary`
- Extract all significant UFO/UAP topics mentioned
- Include technical capabilities, phenomena types, and classifications
- Rate each topic's significance from 1-100

## 2. PERSONNEL
- Required fields: `name`, `role`, `rank`, `credibility`, `authority`
- Extract all named individuals relevant to UFO/UAP research
- Identify their roles (Witness, Researcher, Official, etc.)
- Rate their rank/importance (1-100)
- Rate their credibility (1-100)
- Rate their scientific/official authority (1-100)

## 3. EVENTS
- Required fields: `name`, `date`, `location`, `description`
- Extract all UFO/UAP incidents or events
- Include as precise details as available (date/location)
- If exact date unavailable, use approximate (e.g., "mid-1990s")
- Rate significance from 1-100

## 4. ORGANIZATIONS
- Required fields: `name`, `type`, `description`
- Extract all organizations involved with UFO/UAP research
- Specify type (Government, Military, Research, etc.)
- Include relationship to the topic
- Rate significance from 1-100

# Output Format

Return the extracted entities as a JSON object with these keys:
- `topics`: Array of topic objects
- `personnel`: Array of personnel objects
- `events`: Array of event objects
- `organizations`: Array of organization objects

Example format:
```json
{
  "topics": [
    {
      "name": "Tic-Tac UAP",
      "summary": "White oblong craft observed by Navy pilots in 2004",
      "significance": 95
    }
  ],
  "personnel": [
    {
      "name": "Commander David Fravor",
      "role": "Navy Pilot Witness",
      "rank": 85,
      "credibility": 90,
      "authority": 88
    }
  ],
  "events": [
    {
      "name": "USS Nimitz Encounter",
      "date": "November 14, 2004",
      "location": "Pacific Ocean, off San Diego",
      "description": "Navy pilots encountered tic-tac shaped UAP showing advanced capabilities",
      "significance": 98
    }
  ],
  "organizations": [
    {
      "name": "AATIP",
      "type": "Government Program",
      "description": "Advanced Aerospace Threat Identification Program, Pentagon UAP study",
      "significance": 95
    }
  ]
}
```

# Guidelines

- Extract entities ONLY if they appear in the text
- Do not invent or assume entities not explicitly mentioned
- Use the exact names/terms as they appear in the text
- If exact values for required fields aren't available, use "Unknown"
- For numeric ratings, use your judgment based on context
- Focus on extracting ALL relevant entities, even briefly mentioned ones
- Maintain objectivity and avoid speculation
"""

# Named entity extraction from research analysis function
def extract_entities_from_analysis(analysis_text):
    """
    Function to help extract named entities from analysis text
    
    Args:
        analysis_text: The text containing the analyzed content
        
    Returns:
        Dictionary containing structured entities by category
    """
    # This function would typically call an AI service with the prompt above
    # Implementation would depend on your specific AI service integration
    
    # Placeholder implementation
    return {
        "topics": [],
        "personnel": [],
        "events": [],
        "organizations": []
    }

# Xata table conversion function
def convert_to_xata_tables(extracted_entities):
    """
    Convert extracted entities to Xata table format
    
    Args:
        extracted_entities: Dictionary with structured entities
        
    Returns:
        Dictionary mapping entity type to Xata table records
    """
    # Implementation would depend on your specific Xata schema
    # This would format the data for insertion into Xata tables
    
    # Placeholder implementation
    xata_records = {
        "transcript_topics": [],
        "transcript_personnel": [],
        "transcript_events": [],
        "transcript_organizations": []
    }
    
    # Convert each entity to appropriate Xata table format
    # ...
    
    return xata_records 