import json
import logging
import os
from typing import Any, Dict, List, Optional, Union
import asyncio
from dataclasses import dataclass

# Configure logging first
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# AI SDK imports - need to ensure these are available
try:
    from openai import OpenAI
    from anthropic import Anthropic
    OPENAI_AVAILABLE = True
    ANTHROPIC_AVAILABLE = True
except ImportError as e:
    logger.warning(f"AI SDK dependencies not available: {e}")
    OPENAI_AVAILABLE = False
    ANTHROPIC_AVAILABLE = False

# Import the xata search function from local xata_search.py
try:
    from lib.xata_search import search_record_for_analysis, xata_client
    XATA_AVAILABLE = True
except (ImportError, EnvironmentError) as e:
    logger.warning(f"XATA search not available: {e}")
    XATA_AVAILABLE = False

    def search_record_for_analysis(*args, **kwargs):
        return {"error": "XATA search not configured"}
    xata_client = None


@dataclass
class ExtractedEntity:
    """Represents an extracted entity with metadata"""
    name: str
    type: str
    confidence: float
    context: str
    metadata: Dict[str, Any] = None


@dataclass
class EntityExtractionResult:
    """Structured result from entity extraction"""
    topics: List[ExtractedEntity]
    personnel: List[ExtractedEntity]
    events: List[ExtractedEntity]
    organizations: List[ExtractedEntity]
    locations: List[ExtractedEntity]
    testimonies: List[ExtractedEntity]
    documents: List[ExtractedEntity]
    artifacts: List[ExtractedEntity]
    sightings: List[ExtractedEntity]
    relationships: List[Dict[str, Any]]
    raw_analysis: str
    extraction_metadata: Dict[str, Any]


class XataSearchTool:
    """Custom tool for intelligent Xata searches"""

    def __init__(self, xata_client=None):
        self.xata_client = xata_client
        self.table_mappings = {
            "topics": "topics",
            "personnel": "personnel",
            "events": "events",
            "organizations": "organizations",
            "locations": "locations",
            "testimonies": "testimonies",
            "documents": "documents",
            "sightings": "sightings",
            "artifacts": "artifacts"  # Added from schema
        }
        self.search_targets = {
            "topics": ["name", "title", "summary"],
            "personnel": ["name", "bio", "role"],
            "events": ["name", "title", "description", "summary"],
            "organizations": ["name", "title", "description", "specialization"],
            "locations": ["name", "description"],
            "testimonies": ["claim", "summary", "context"],
            "documents": ["title", "summary"],
            "sightings": ["description", "comments", "city", "state", "country", "shape"],
            "artifacts": ["name", "description", "origin"]  # Added from schema
        }

    async def search_entity(self, entity: ExtractedEntity, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for a specific entity in Xata"""
        if not self.xata_client:
            logger.warning("Xata client not available")
            return []

        entity_type = entity.type.lower()
        table_name = self.table_mappings.get(entity_type)
        search_fields = self.search_targets.get(entity_type, ["name"])

        if not table_name:
            logger.warning(f"No table mapping for entity type: {entity_type}")
            return []

        try:
            # Use Xata's search functionality
            search_query = {
                "query": entity.name,
                "target": search_fields,
                "fuzziness": 1,
                "prefix": "phrase"
            }

            response = self.xata_client.data().search_table(table_name, search_query)

            results = []
            if hasattr(response, 'records') and response.records:
                for record in response.records[:limit]:
                    result_dict = record.to_dict() if hasattr(record, 'to_dict') else dict(record)
                    # Add search metadata
                    result_dict['search_metadata'] = {
                        'original_entity': entity.name,
                        'entity_type': entity_type,
                        'confidence': entity.confidence,
                        'context': entity.context
                    }
                    results.append(result_dict)
            elif isinstance(response, dict) and "records" in response:
                for record in response["records"][:limit]:
                    record['search_metadata'] = {
                        'original_entity': entity.name,
                        'entity_type': entity_type,
                        'confidence': entity.confidence,
                        'context': entity.context
                    }
                    results.append(record)

            logger.info(
                f"Found {len(results)} matches for {entity.name} in {table_name}")
            return results

        except Exception as e:
            logger.error(f"Error searching for entity {entity.name}: {e}")
            return []

    async def batch_search_entities(self, entities: List[ExtractedEntity]) -> Dict[str, List[Dict[str, Any]]]:
        """Search for multiple entities in parallel"""
        search_tasks = []
        for entity in entities:
            task = self.search_entity(entity)
            search_tasks.append((entity.type, task))

        results_by_type = {}
        for entity_type, task in search_tasks:
            try:
                search_results = await task
                if entity_type not in results_by_type:
                    results_by_type[entity_type] = []
                results_by_type[entity_type].extend(search_results)
            except Exception as e:
                logger.error(f"Error in batch search for {entity_type}: {e}")

        return results_by_type


class AIEntityExtractor:
    """AI-powered entity extraction using structured output"""

    def __init__(self, provider: str = "openai", model: str = None):
        self.provider = provider.lower()
        self.model = model or self._get_default_model()
        self.client = self._initialize_client()

    def _get_default_model(self) -> str:
        """Get default model for provider"""
        defaults = {
            "openai": "gpt-4.1",
            "anthropic": "claude-sonnet-4.5-20250514"
        }
        return defaults.get(self.provider, "gpt-4.1")

    def _initialize_client(self):
        """Initialize AI client based on provider"""
        if self.provider == "anthropic" and ANTHROPIC_AVAILABLE:
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError(
                    "ANTHROPIC_API_KEY environment variable required")
            return Anthropic(api_key=api_key)
        elif self.provider == "openai" and OPENAI_AVAILABLE:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError(
                    "OPENAI_API_KEY environment variable required")
            return OpenAI(api_key=api_key)
        else:
            raise ValueError(
                f"Provider {self.provider} not available or not supported")

    def _create_entity_schema(self) -> Dict[str, Any]:
        """Create the structured schema for entity extraction"""
        return {
            "type": "object",
            "properties": {
                "topics": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Topic name or subject"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where topic was mentioned"},
                            "metadata": {"type": "object", "description": "Additional topic metadata"}
                        },
                        "required": ["name", "confidence", "context"]
                    }
                },
                "personnel": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Person's full name"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where person was mentioned"},
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "role": {"type": "string"},
                                    "organization": {"type": "string"},
                                    "rank": {"type": "string"},
                                    "title": {"type": "string"}
                                }
                            }
                        },
                        "required": ["name", "confidence", "context"]
                    }
                },
                "events": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Event name or description"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where event was mentioned"},
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "date": {"type": "string"},
                                    "location": {"type": "string"},
                                    "category": {"type": "string"},
                                    "description": {"type": "string"}
                                }
                            }
                        },
                        "required": ["name", "confidence", "context"]
                    }
                },
                "organizations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Organization name"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where organization was mentioned"},
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "type": {"type": "string"},
                                    "specialization": {"type": "string"},
                                    "role": {"type": "string"}
                                }
                            }
                        },
                        "required": ["name", "confidence", "context"]
                    }
                },
                "locations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Location name"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where location was mentioned"},
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "type": {"type": "string", "description": "city, state, country, facility, etc."},
                                    "coordinates": {"type": "string"},
                                    "description": {"type": "string"}
                                }
                            }
                        },
                        "required": ["name", "confidence", "context"]
                    }
                },
                "artifacts": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Artifact name or identifier"},
                            "description": {"type": "string", "description": "Description of the physical evidence"},
                            "origin": {"type": "string", "description": "Where the artifact came from"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where artifact was mentioned"},
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "date": {"type": "string", "description": "Date found or created"},
                                    "source": {"type": "string", "description": "Source of the artifact"},
                                    "images": {"type": "array", "items": {"type": "string"}, "description": "References to images"}
                                }
                            }
                        },
                        "required": ["name", "confidence", "context"]
                    }
                },
                "sightings": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "description": {"type": "string", "description": "Description of the UAP sighting"},
                            "shape": {"type": "string", "description": "Shape of the observed object"},
                            "duration": {"type": "string", "description": "Duration of the sighting"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where sighting was mentioned"},
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "date": {"type": "string", "description": "Date of sighting"},
                                    "coordinates": {"type": "string", "description": "Location coordinates"},
                                    "witnesses": {"type": "number", "description": "Number of witnesses"}
                                }
                            }
                        },
                        "required": ["description", "confidence", "context"]
                    }
                },
                "relationships": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "from_entity": {"type": "string", "description": "Source entity name"},
                            "from_type": {"type": "string", "description": "Type of source entity"},
                            "to_entity": {"type": "string", "description": "Target entity name"},
                            "to_type": {"type": "string", "description": "Type of target entity"},
                            "relationship_type": {"type": "string", "description": "Type of relationship (e.g., works_for, witnessed, investigated_by)"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "context": {"type": "string", "description": "Context where relationship was identified"}
                        },
                        "required": ["from_entity", "from_type", "to_entity", "to_type", "relationship_type", "confidence", "context"]
                    }
                },
                "extraction_metadata": {
                    "type": "object",
                    "properties": {
                        "total_entities": {"type": "number"},
                        "processing_time": {"type": "number"},
                        "model_used": {"type": "string"},
                        "confidence_threshold": {"type": "number"}
                    }
                }
            },
            "required": ["topics", "personnel", "events", "organizations", "locations", "artifacts", "sightings", "relationships", "extraction_metadata"]
        }

    async def extract_entities(self, text: str, domain_context: str = "UAP/UFO research") -> EntityExtractionResult:
        """Extract entities using structured AI output"""

        system_prompt = f"""You are an expert entity extraction system specialized in {domain_context}. 
        
Your task is to extract and classify entities from the given text with high precision. Focus on:

1. **Topics**: Main subjects, themes, or areas of discussion
2. **Personnel**: Names of people mentioned (including titles, roles, ranks)
3. **Events**: Specific incidents, meetings, observations, or happenings
4. **Organizations**: Government agencies, military units, companies, institutions
5. **Locations**: Geographic locations, facilities, bases, coordinates
6. **Testimonies**: Witness statements, testimonies, claims
7. **Documents**: Referenced documents, reports, studies
8. **Artifacts**: Physical evidence, materials, objects with photos or documentation
9. **Sightings**: UAP/UFO observations with shape, duration, witness details
10. **Relationships**: Connections between entities (who works for whom, who witnessed what, etc.)

For each entity, provide:
- Exact name/reference as it appears in text
- Confidence score (0-1) based on clarity and context
- Context sentence where the entity was mentioned
- Relevant metadata when available

Be especially attentive to:
- Military/government personnel and their roles/ranks
- Specific incident names and locations
- Organizational hierarchies and relationships
- Physical evidence and artifacts
- UAP sighting characteristics (shape, duration, witnesses)
- Entity relationships (works_for, witnessed, investigated_by, etc.)

Maintain high precision - only extract entities that are clearly identifiable."""

        user_prompt = f"""Extract entities from this {domain_context} content:

{text}

Return a structured JSON object with all identified entities organized by type."""

        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    functions=[{
                        "name": "extract_entities",
                        "description": "Extract structured entities from text",
                        "parameters": self._create_entity_schema()
                    }],
                    function_call={"name": "extract_entities"},
                    temperature=0.1
                )

                function_call = response.choices[0].message.function_call
                if function_call:
                    extracted_data = json.loads(function_call.arguments)
                else:
                    raise ValueError("No function call in response")

            elif self.provider == "anthropic":
                # For Anthropic, we'll use a structured prompt and parse JSON
                full_prompt = f"{system_prompt}\n\n{user_prompt}\n\nRespond with a valid JSON object matching this schema:\n{json.dumps(self._create_entity_schema(), indent=2)}"

                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=4000,
                    temperature=0.1,
                    messages=[{"role": "user", "content": full_prompt}]
                )

                content = response.content[0].text if response.content else ""
                # Extract JSON from response
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    extracted_data = json.loads(json_str)
                else:
                    raise ValueError("No valid JSON found in response")

            # Convert to structured result
            result = self._convert_to_structured_result(extracted_data, text)
            logger.info(
                f"Extracted {len(result.topics)} topics, {len(result.personnel)} personnel, {len(result.events)} events, {len(result.organizations)} organizations")

            return result

        except Exception as e:
            logger.error(f"Error in entity extraction: {e}")
            # Return empty result on error
            return EntityExtractionResult(
                topics=[], personnel=[], events=[], organizations=[],
                locations=[], testimonies=[], documents=[], artifacts=[], 
                sightings=[], relationships=[], raw_analysis=text, 
                extraction_metadata={"error": str(e)}
            )

    def _convert_to_structured_result(self, extracted_data: Dict[str, Any], original_text: str) -> EntityExtractionResult:
        """Convert extracted JSON to structured result objects"""

        def create_entities(entity_list: List[Dict], entity_type: str) -> List[ExtractedEntity]:
            entities = []
            for item in entity_list:
                entity = ExtractedEntity(
                    name=item.get("name", ""),
                    type=entity_type,
                    confidence=item.get("confidence", 0.5),
                    context=item.get("context", ""),
                    metadata=item.get("metadata", {})
                )
                entities.append(entity)
            return entities

        return EntityExtractionResult(
            topics=create_entities(extracted_data.get("topics", []), "topics"),
            personnel=create_entities(
                extracted_data.get("personnel", []), "personnel"),
            events=create_entities(extracted_data.get("events", []), "events"),
            organizations=create_entities(
                extracted_data.get("organizations", []), "organizations"),
            locations=create_entities(
                extracted_data.get("locations", []), "locations"),
            testimonies=create_entities(extracted_data.get("testimonies", []), "testimonies"),
            documents=create_entities(extracted_data.get("documents", []), "documents"),
            artifacts=create_entities(
                extracted_data.get("artifacts", []), "artifacts"),
            sightings=create_entities(
                extracted_data.get("sightings", []), "sightings"),
            # Direct assignment as it's not ExtractedEntity
            relationships=extracted_data.get("relationships", []),
            raw_analysis=original_text,
            extraction_metadata=extracted_data.get("extraction_metadata", {})
        )


class EntityExtractionAgent:
    """
    Advanced AI-powered agent for extracting structured entities from text and performing intelligent Xata lookups.
    """

    def __init__(self, ai_provider: str = "openai", model: str = None):
        """Initialize the entity extraction agent with AI and search capabilities."""
        try:
            self.ai_extractor = AIEntityExtractor(
                provider=ai_provider, model=model)
            self.search_tool = XataSearchTool(
                xata_client if XATA_AVAILABLE else None)
            self.ai_available = True
            logger.info(
                f"EntityExtractionAgent initialized with {ai_provider} AI extraction and Xata search")
        except Exception as e:
            logger.warning(f"AI extractor not available: {e}")
            self.ai_extractor = None
            self.search_tool = XataSearchTool(
                xata_client if XATA_AVAILABLE else None)
            self.ai_available = False
            logger.info(
                "EntityExtractionAgent initialized with Xata search only")

    async def extract_and_search_entities(
        self,
        text: str,
        domain_context: str = "UAP/UFO research",
        search_entities: bool = True,
        confidence_threshold: float = 0.5
    ) -> Dict[str, Any]:
        """
        Extract entities from text using AI and optionally search for them in Xata.

        Args:
            text: The text to analyze for entities
            domain_context: Domain context for specialized extraction
            search_entities: Whether to search for entities in Xata
            confidence_threshold: Minimum confidence for entity inclusion

        Returns:
            Dictionary containing extracted entities and search results
        """
        result = {
            "extraction_result": None,
            "search_results": {},
            "summary": {},
            "errors": []
        }

        try:
            # Step 1: Extract entities using AI
            if self.ai_available:
                extraction_result = await self.ai_extractor.extract_entities(text, domain_context)
                result["extraction_result"] = extraction_result

                # Filter by confidence threshold
                filtered_entities = []
                for entity_list in [extraction_result.topics, extraction_result.personnel,
                                    extraction_result.events, extraction_result.organizations,
                                    extraction_result.locations, extraction_result.artifacts,
                                    extraction_result.sightings]:
                    filtered_entities.extend(
                        [e for e in entity_list if e.confidence >= confidence_threshold])

                # Step 2: Search for entities in Xata if requested
                if search_entities and XATA_AVAILABLE and filtered_entities:
                    search_results = await self.search_tool.batch_search_entities(filtered_entities)
                    result["search_results"] = search_results

                # Step 3: Create summary
                result["summary"] = {
                    "total_entities_extracted": sum([
                        len(extraction_result.topics), len(
                            extraction_result.personnel),
                        len(extraction_result.events), len(
                            extraction_result.organizations),
                        len(extraction_result.locations), len(
                            extraction_result.artifacts),
                        len(extraction_result.sightings)
                    ]),
                    "relationships_extracted": len(extraction_result.relationships),
                    "entities_above_threshold": len(filtered_entities),
                    "entities_found_in_database": sum([len(results) for results in result["search_results"].values()]),
                    "confidence_threshold": confidence_threshold,
                    "domain_context": domain_context
                }

                logger.info(f"Extraction complete: {result['summary']}")

            else:
                result["errors"].append("AI extraction not available")
                logger.warning(
                    "AI extraction not available, returning empty result")

        except Exception as e:
            error_msg = f"Error in extract_and_search_entities: {e}"
            result["errors"].append(error_msg)
            logger.error(error_msg)

        return result

    async def generate_embeddings(self, entities: List[ExtractedEntity], model: str = "text-embedding-3-small") -> List[Dict[str, Any]]:
        """
        Generate vector embeddings for entities using OpenAI's embedding model.

        Args:
            entities: List of extracted entities to generate embeddings for
            model: Embedding model to use (default: text-embedding-3-small)

        Returns:
            List of dictionaries containing entity and its embedding vector
        """
        if not self.ai_available or self.ai_extractor.provider != "openai":
            logger.warning("Embedding generation requires OpenAI provider")
            return []

        try:
            embeddings = []
            for entity in entities:
                # Combine name and context for richer embedding
                text_to_embed = f"{entity.name} - {entity.context}"

                response = self.ai_extractor.client.embeddings.create(
                    input=text_to_embed,
                    model=model
                )

                embedding_data = {
                    "entity": entity,
                    "embedding": response.data[0].embedding,
                    "model": model,
                    "dimension": len(response.data[0].embedding)
                }
                embeddings.append(embedding_data)

            logger.info(f"Generated {len(embeddings)} embeddings for entities")
            return embeddings

        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            return []

    def extract_entities(self, text: str) -> Dict[str, Any]:
        """
        Synchronous wrapper for entity extraction (for backward compatibility).

        Args:
            text: The text to analyze for entities

        Returns:
            Dictionary containing extracted entities
        """
        # Run async method in event loop
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        result = loop.run_until_complete(
            self.extract_and_search_entities(text, search_entities=False)
        )

        # Convert to legacy format for compatibility
        if result.get("extraction_result"):
            extraction = result["extraction_result"]
            return {
                "topics": [e.name for e in extraction.topics],
                "personnel": [e.name for e in extraction.personnel],
                "events": [e.name for e in extraction.events],
                "organizations": [e.name for e in extraction.organizations],
                "locations": [e.name for e in extraction.locations],
                "artifacts": [e.name for e in extraction.artifacts],
                "sightings": [e.name for e in extraction.sightings]
            }
        else:
            return {
                "topics": [], "personnel": [], "events": [], "organizations": [],
                "locations": [], "artifacts": [], "sightings": []
            }

    def search_entities(self, structured_payload: Dict[str, Any], table_mapping: Dict[str, str]) -> Dict[str, Any]:
        """
        Legacy search method for backward compatibility.

        Args:
            structured_payload: The entity data to search with
            table_mapping: Mapping of entity types to database tables

        Returns:
            Search results
        """
        # Convert legacy format to new format and run search
        entities = []
        for entity_type, entity_names in structured_payload.items():
            for name in entity_names:
                entity = ExtractedEntity(
                    name=name,
                    type=entity_type,
                    confidence=0.8,  # Default confidence
                    context="Legacy search"
                )
                entities.append(entity)

        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        search_results = loop.run_until_complete(
            self.search_tool.batch_search_entities(entities)
        )

        return search_results

# Legacy functions for backward compatibility


def get_structured_entities(analysis_text: str) -> Dict[str, Any]:
    """Legacy function - creates agent and extracts entities"""
    agent = EntityExtractionAgent()
    return agent.extract_entities(analysis_text)


def search_entities_with_payload(structured_payload: Dict[str, Any], table_mapping: Dict[str, str]) -> Dict[str, Any]:
    """Legacy function - creates agent and searches entities"""
    agent = EntityExtractionAgent()
    return agent.search_entities(structured_payload, table_mapping)


if __name__ == "__main__":
    # Example usage
    import asyncio

    async def main():
        # Sample analysis text
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
        
        **Sightings Mentioned:**
        
        1. Large black disc underwater
        - Shape: Disc
        - Speed: 450-550 knots
        - Size: Bigger than oil platforms
        - Duration: Multiple minutes tracked on sonar
        
        **Artifacts:**
        
        1. Sonar recordings from Navy vessels
        - Multiple sensor data packages
        - Classified video evidence
        
        **Key Relationships:**
        
        - Lou Elizondo works_for Department of Defense/AATIP
        - David Spergel leads NASA UAP investigation
        - Navy witnessed underwater UAP incidents
        """

        # Initialize agent
        agent = EntityExtractionAgent(ai_provider="openai")

        # Extract entities and search
        result = await agent.extract_and_search_entities(sample_analysis)

        print("=== AI-Powered Entity Extraction Results ===")
        print(json.dumps(result["summary"], indent=2))

        if result.get("extraction_result"):
            extraction = result["extraction_result"]
            print(f"\nExtracted {len(extraction.personnel)} personnel:")
            for person in extraction.personnel:
                print(
                    f"  - {person.name} (confidence: {person.confidence:.2f})")

            print(
                f"\nExtracted {len(extraction.organizations)} organizations:")
            for org in extraction.organizations:
                print(f"  - {org.name} (confidence: {org.confidence:.2f})")

            print(f"\nExtracted {len(extraction.sightings)} sightings:")
            for sighting in extraction.sightings:
                print(
                    f"  - {sighting.description[:50]}... (confidence: {sighting.confidence:.2f})")

            print(f"\nExtracted {len(extraction.artifacts)} artifacts:")
            for artifact in extraction.artifacts:
                print(
                    f"  - {artifact.name} (confidence: {artifact.confidence:.2f})")

            print(
                f"\nExtracted {len(extraction.relationships)} relationships:")
            for rel in extraction.relationships:
                print(
                    f"  - {rel.get('from_entity')} {rel.get('relationship_type')} {rel.get('to_entity')}")

        if result.get("search_results"):
            print(f"\nDatabase search found matches:")
            for entity_type, matches in result["search_results"].items():
                print(f"  {entity_type}: {len(matches)} matches")

        # Demonstrate embedding generation
        if result.get("extraction_result") and agent.ai_available:
            print(f"\nGenerating embeddings for high-confidence entities...")
            high_conf_entities = [e for entity_list in [
                extraction.personnel, extraction.organizations, extraction.events
            ] for e in entity_list if e.confidence >= 0.8]

            embeddings = await agent.generate_embeddings(high_conf_entities[:3])
            print(f"Generated {len(embeddings)} embeddings")
            for emb in embeddings:
                print(
                    f"  - {emb['entity'].name}: {emb['dimension']}-dimensional vector")

    # Run the example
    asyncio.run(main())