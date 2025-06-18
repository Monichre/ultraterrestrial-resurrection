import json
import logging
import os
from typing import Any, Dict

# Configure logging first
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Import the ContentAnalysisEngine and NER prompt from local modules.
from processing.content_analysis import ContentAnalysisEngine
from research.named_entity_recognition_prompt import ner_prompt

# Import the xata search function from local xata_search.py (optional).
try:
    from lib.xata_search import search_record_for_analysis
    XATA_AVAILABLE = True
except (ImportError, EnvironmentError) as e:
    logger.warning(f"XATA search not available: {e}")
    XATA_AVAILABLE = False
    def search_record_for_analysis(*args, **kwargs):
        return {"error": "XATA search not configured"}

class EntityExtractionAgent:
    """
    Agent for extracting structured entities from text using NER and content analysis.
    """
    
    def __init__(self):
        """Initialize the entity extraction agent."""
        try:
            self.content_engine = ContentAnalysisEngine()
            self.content_engine_available = True
            logger.info("EntityExtractionAgent initialized with ContentAnalysisEngine")
        except Exception as e:
            logger.warning(f"ContentAnalysisEngine not available: {e}")
            self.content_engine = None
            self.content_engine_available = False
            logger.info("EntityExtractionAgent initialized without ContentAnalysisEngine")
    
    def extract_entities(self, text: str) -> Dict[str, Any]:
        """
        Extract structured entities from the given text.
        
        Args:
            text: The text to analyze for entities
            
        Returns:
            Dictionary containing extracted entities organized by type
        """
        return get_structured_entities(text)
    
    def search_entities(self, structured_payload: Dict[str, Any], table_mapping: Dict[str, str]) -> Dict[str, Any]:
        """
        Search for entities using the provided payload.
        
        Args:
            structured_payload: The entity data to search with
            table_mapping: Mapping of entity types to database tables
            
        Returns:
            Search results
        """
        return search_entities_with_payload(structured_payload, table_mapping)


def get_structured_entities(analysis_text: str) -> Dict[str, Any]:
    """
    Uses the AI agent (configured via ContentAnalysisEngine) and the NER prompt to return
    a structured JSON payload containing recognized entities. Expected keys are:
      - topics
      - personnel
      - events
      - organizations

    Returns an empty dict if extraction fails.
    """
    engine = ContentAnalysisEngine()
    try:
        # Send the transcript analysis along with the ner_prompt.
        # This call uses the Anthropic client in ContentAnalysisEngine.
        message = engine.anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            system=ner_prompt,
            messages=[
                {
                    "role": "user",
                    "content": analysis_text
                }
            ]
        )
        # Expecting the agent to return a JSON string.
        structured_json = message.content[0].text
        logger.info("Raw structured payload received from AI agent:")
        logger.info(structured_json)
        structured_payload = json.loads(structured_json)
        return structured_payload
    except Exception as e:
        logger.error(f"Error extracting structured entities: {e}")
        return {}

def search_entities_with_payload(structured_payload: Dict[str, Any], table_mapping: Dict[str, str]) -> Dict[str, Any]:
    """
    Given a structured payload (with keys like topics, personnel, events, organizations)
    and a mapping from those keys to Xata table names, perform searches for each entity.
    
    Returns a dict with each category and a list of search results.
    """
    search_results = {}
    for category, table in table_mapping.items():
        results = []
        # Expecting structured_payload[category] to be a list of entities.
        entities = structured_payload.get(category, [])
        for entity in entities:
            # Assuming each entity is a string representing the identifier.
            result = search_record_for_analysis(entity, table)
            if result:
                results.append(result)
        search_results[category] = results
    return search_results

if __name__ == "__main__":
    # Sample analysis text (could be the output from ContentAnalysisEngine.analyze_content)
    sample_analysis = """
Ex- Pentagon Official Confirms Alien Language Exists - Lue Elizondo - DEBRIEFED ep. 24 Summary

https://www.youtube.com/watch?v=WGUb1JKxBDo

=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===

Research Agent Analysis:
Let me analyze and organize the key information from this interview according to our research methodology:

**Topics Covered:**

1. Underwater UAP Activity
- Large black disc-shaped craft observed moving 450-550 knots underwater
- Bigger than offshore oil platforms
- Multiple sensor data collected beyond just visual evidence
- Significant Navy/military interest in underwater cases
- Connection to nuclear-powered vessels and facilities

2. UAP Technology & Capabilities 
- Can operate in multiple mediums (air, water, space)
- Show advanced propulsion capabilities
- Interest in nuclear facilities and mining operations
- Display possible intelligent control/behavior

**Personnel Mentioned:**

Lou Elizondo
- Role: Former AATIP Director
- Rank: 90/100

David Spergel
- Role: NASA UAP Chief
- Rank: 95/100

**Events Referenced:**

1. Navy Helicopter/Missile Incident
- Location: Caribbean/Puerto Rico

**Organizations Involved:**

1. Department of Defense
- Role: Primary investigation/oversight

2. NASA
- Role: New public-facing research
"""
    # First, obtain structured entity payload from the analysis.
    structured_entities = get_structured_entities(sample_analysis)
    print("Structured Entity Payload:")
    print(json.dumps(structured_entities, indent=2))
    
    # Define a mapping from entity category to the respective Xata table.
    table_mapping = {
        "topics": "transcript_topics",
        "personnel": "transcript_personnel",
        "events": "transcript_events",
        "organizations": "transcript_organizations"
    }
    
    # Search for each entity in Xata.
    results = search_entities_with_payload(structured_entities, table_mapping)
    print("\nXata Search Results:")
    for category, recs in results.items():
        print(f"Category: {category}")
        if recs:
            for rec in recs:
                print("  Found record:", rec)
        else:
            print("  No records found.") 