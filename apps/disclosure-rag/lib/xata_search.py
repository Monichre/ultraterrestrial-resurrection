import logging
import os
from typing import Any, Dict, Optional

# Import the Xata client from the xata SDK.
# Depending on your SDK version, you might do:
from xata.client import XataClient

# Initialize logging (optional)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Setup: Retrieve Xata credentials from environment variables.
XATA_API_KEY = os.environ.get("XATA_API_KEY")
XATA_DATABASE = os.environ.get("XATA_DATABASE")

if not XATA_API_KEY or not XATA_DATABASE:
    logger.error("Missing XATA_API_KEY or XATA_DATABASE environment variable.")
    raise EnvironmentError("XATA API credentials must be set.")

# Initialize the Xata client.
# Adjust the initialization below if your SDK version requires different parameters.
xata_client = XataClient(api_key=XATA_API_KEY, database=XATA_DATABASE)

def search_record_for_analysis(
    analysis_text: str,
    table_name: str,
    search_field: str = "summary"
) -> Optional[Dict[str, Any]]:
    """
    Searches for a record in the given table using a fragment of the analysis text.
    
    Parameters:
      analysis_text: The output from the AI analysis (e.g., transcript summary)
      table_name: The target table to search records in.
      search_field: The field on which to match the analysis text. Default is 'summary'.
      
    Returns:
      The first matching record as a dictionary if found; otherwise, None.
      
    Note: The current implementation uses a simple substring query.
    You can enhance the search query for full-text search as needed.
    """
    # Create a query using a substring from the analysis text.
    # For example, we can use the first 50 characters to form a query.
    query_fragment = analysis_text.strip()[:50]
    logger.info(f"Searching for records in '{table_name}' with {search_field} matching: {query_fragment}")
    
    try:
        # The SDK might expose a `records.search` method.
        # Adjust the call as needed based on SDK documentation.
        response = xata_client.records.search(
            table=table_name,
            query={
                "query": f"{search_field}:*{query_fragment}*"
            }
        )
        logger.debug(f"Search response: {response}")

        # Assume the response contains a list of records in the key "records".
        records = response.get("records", [])
        if records:
            logger.info(f"Found {len(records)} record(s).")
            return records[0]  # return the first matched record
        else:
            logger.info("No matching records found.")
            return None

    except Exception as err:
        logger.error(f"Error while searching records: {err}")
        return None

def extract_entities_from_analysis(analysis_text: str) -> dict:
    """
    Parses the transcript summary output and extracts entities from the following sections:
      - Topics Covered
      - Personnel Mentioned
      - Events Referenced
      - Organizations Involved

    Returns a dictionary with keys "topics", "personnel", "events", "organizations".
    The extraction logic is basic and depends on the section headers in the analysis.
    """
    entities = {"topics": [], "personnel": [], "events": [], "organizations": []}
    lines = analysis_text.splitlines()
    current_section = None
    section_headers = {
        "Topics Covered:": "topics",
        "Personnel Mentioned:": "personnel",
        "Events Referenced:": "events",
        "Organizations Involved:": "organizations"
    }

    for line in lines:
        stripped = line.strip()
        # Check for section header markers
        for header, key in section_headers.items():
            if stripped.startswith(header):
                current_section = key
                # Move to next line after header
                continue

        # If a current section is active, add lines that look like bullet points or numbered items.
        if current_section and stripped:
            # We assume bullet points start with '-' or a digit indicator.
            if stripped[0] in "-0123456789":
                # Remove common bullet formatting and whitespace.
                entity = stripped.lstrip("-0123456789. ").strip()
                if entity:
                    entities[current_section].append(entity)

    return entities

def search_entities_from_analysis(analysis_text: str, table_mapping: dict) -> dict:
    """
    Given the analysis text and a mapping of entity category to Xata table name,
    search for each extracted entity in its respective table.

    Parameters:
      analysis_text: The transcript summary with AI analysis.
      table_mapping: A dict mapping entity category (e.g., "topics") to table name.

    Returns:
      A dict with the same keys as table_mapping. For each category, the value is a list of search results.
    """
    search_results = {}
    extracted = extract_entities_from_analysis(analysis_text)

    for category, table in table_mapping.items():
        results = []
        # For each entity under the category, perform a search.
        for entity in extracted.get(category, []):
            result = search_record_for_analysis(entity, table)
            if result:
                results.append(result)
        search_results[category] = results

    return search_results

if __name__ == "__main__":
    # Sample analysis text from your attached transcript summary file.
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

    # Define a mapping from entity category to the respective Xata table.
    table_mapping = {
        "topics": "transcript_topics",
        "personnel": "transcript_personnel",
        "events": "transcript_events",
        "organizations": "transcript_organizations"
    }

    # Perform the search for all entities.
    results = search_entities_from_analysis(sample_analysis, table_mapping)
    for category, recs in results.items():
        print(f"Category: {category}")
        if recs:
            for rec in recs:
                print("  Found record:", rec)
        else:
            print("  No records found.") 