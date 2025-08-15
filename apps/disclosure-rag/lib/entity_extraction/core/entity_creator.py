#!/usr/bin/env python3
"""
Entity Creator - Creates new database records for entities not found in Xata
Integrates with the entity extraction workflow to complete the creation cycle
Date: July 12, 2025
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import subprocess
import sys

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Try to import xata client
try:
    from ...xata_search import xata_client
    XATA_AVAILABLE = True
except ImportError:
    logger.warning("Xata client not available")
    XATA_AVAILABLE = False
    xata_client = None


class EntityCreator:
    """Creates new database records for entities marked with 'action_needed': 'create_new'"""

    def __init__(self):
        self.xata_client = xata_client if XATA_AVAILABLE else None
        self._search_cache = {}  # Cache for entity search results
        self.table_mappings = {
            "topics": "topics",
            "personnel": "personnel",
            "events": "events",
            "organizations": "organizations",
            "locations": "locations",
            "testimonies": "testimonies",
            "documents": "documents",
            "sightings": "sightings",
            "artifacts": "artifacts",
            "key-figures": "key-figures",
            # files are stored in documents table with doc_type metadata
            "files": "documents"
        }

        # TypeScript model creation functions via Node.js calls
        self.node_scripts_path = self._find_node_scripts_path()

    def _find_node_scripts_path(self) -> Optional[str]:
        """Find the path to the TypeScript database models"""
        # Look for packages/db/xata/models directory
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # Go up to find packages/db
        for _ in range(5):  # Limit search depth
            parent_dir = os.path.dirname(current_dir)
            models_path = os.path.join(
                parent_dir, "packages", "db", "xata", "models")
            if os.path.exists(models_path):
                return models_path
            current_dir = parent_dir

        logger.warning("TypeScript database models not found")
        return None

    async def create_missing_entities(self, search_results: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        Create database records for entities marked with 'action_needed': 'create_new'

        Args:
            search_results: Results from entity processor with entities marked for creation

        Returns:
            Dictionary with creation results and statistics
        """
        creation_results = {
            "created_entities": {},
            "failed_creations": {},
            "statistics": {
                "total_processed": 0,
                "total_created": 0,
                "total_failed": 0
            },
            "errors": []
        }

        if not self.xata_client:
            creation_results["errors"].append("Xata client not available")
            return creation_results

        try:
            for entity_type, results in search_results.items():
                if not results:
                    continue

                # Filter entities that need creation
                entities_to_create = [
                    result for result in results
                    if result.get('status') == 'not_found' and result.get('action_needed') == 'create_new'
                ]

                if not entities_to_create:
                    continue

                logger.info(
                    f"Creating {len(entities_to_create)} new {entity_type} entities")

                created_count = 0
                failed_count = 0
                creation_results["created_entities"][entity_type] = []
                creation_results["failed_creations"][entity_type] = []

                for entity_data in entities_to_create:
                    try:
                        # Create the entity record
                        created_record = await self._create_entity_record(entity_type, entity_data)

                        if created_record:
                            creation_results["created_entities"][entity_type].append({
                                "entity_name": entity_data["entity_name"],
                                "xata_id": created_record.get("id"),
                                "created_at": datetime.now().isoformat()
                            })
                            created_count += 1
                            logger.info(
                                f"✅ Created {entity_type}: {entity_data['entity_name']}")
                        else:
                            creation_results["failed_creations"][entity_type].append({
                                "entity_name": entity_data["entity_name"],
                                "error": "Creation returned None"
                            })
                            failed_count += 1

                    except Exception as e:
                        error_msg = f"Failed to create {entity_data['entity_name']}: {str(e)}"
                        logger.error(error_msg)
                        creation_results["failed_creations"][entity_type].append({
                            "entity_name": entity_data["entity_name"],
                            "error": str(e)
                        })
                        failed_count += 1

                # Update statistics
                creation_results["statistics"]["total_processed"] += len(
                    entities_to_create)
                creation_results["statistics"]["total_created"] += created_count
                creation_results["statistics"]["total_failed"] += failed_count

                logger.info(
                    f"Entity type {entity_type}: {created_count} created, {failed_count} failed")

        except Exception as e:
            error_msg = f"Error in create_missing_entities: {str(e)}"
            logger.error(error_msg)
            creation_results["errors"].append(error_msg)

        return creation_results

    async def _create_entity_record(self, entity_type: str, entity_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create a single entity record in the appropriate Xata table

        Args:
            entity_type: Type of entity (personnel, organizations, etc.)
            entity_data: Entity information including name and metadata

        Returns:
            Created record data or None if failed
        """
        table_name = self.table_mappings.get(entity_type)
        if not table_name:
            logger.error(f"Unknown entity type: {entity_type}")
            return None

        entity_name = entity_data.get("entity_name", "")
        if not entity_name:
            logger.error("Entity name is required")
            return None

        try:
            # Prepare record data based on entity type
            record_data = self._prepare_record_data(entity_type, entity_data)

            # Check if record data preparation failed (unsupported entity type)
            if record_data is None:
                logger.warning(
                    f"Entity type {entity_type} not supported - no corresponding database table")
                return None

            # Create record using Xata client (convert to async)
            response = await self.xata_client.records().insert_async(table_name, record_data)

            if hasattr(response, 'to_dict'):
                return response.to_dict()
            elif isinstance(response, dict):
                return response
            else:
                logger.warning(f"Unexpected response type: {type(response)}")
                return {"id": str(response)} if response else None

        except Exception as e:
            logger.error(
                f"Failed to create {entity_type} record for {entity_name}: {e}")
            return None

    def _prepare_record_data(self, entity_type: str, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare record data for creation based on entity type and extracted metadata

        Args:
            entity_type: Type of entity (personnel, organizations, etc.)
            entity_data: Raw entity information from extraction

        Returns:
            Prepared record data for Xata insertion
        """
        entity_name = entity_data.get("entity_name", "")

        # Base record with common fields
        record_data = {
            "name": entity_name,
            "created_via": "entity_extraction",
            "extraction_metadata": {
                "source": "ai_extraction",
                "confidence": entity_data.get("confidence", 0.0),
                "context": entity_data.get("context", ""),
                "created_at": datetime.now().isoformat()
            }
        }

        # Skip unsupported entity types
        if entity_type in ["technologies", "dates"]:
            logger.warning(
                f"Entity type {entity_type} not supported - no corresponding database table")
            return None

        # Entity-specific field mappings
        if entity_type == "personnel":
            record_data.update({
                "bio": f"Auto-extracted personnel record for {entity_name}",
                "role": entity_data.get("metadata", {}).get("role", ""),
                "rank": entity_data.get("metadata", {}).get("rank", ""),
                "credibility": 50,  # Default neutral credibility
                "popularity": 0,
                "authority": 0
            })

        elif entity_type == "organizations":
            record_data.update({
                "title": entity_name,  # Required unique field
                "specialization": entity_data.get("metadata", {}).get("specialization", ""),
                "description": f"Auto-extracted organization record for {entity_name}",
                "type": entity_data.get("metadata", {}).get("type", "")
            })

        elif entity_type == "events":
            record_data.update({
                "title": entity_name,  # Required unique field
                "description": f"Auto-extracted event record for {entity_name}",
                "location": entity_data.get("metadata", {}).get("location", ""),
                "category": entity_data.get("metadata", {}).get("category", ""),
                "metadata": entity_data.get("metadata", {})
            })

        elif entity_type == "topics":
            record_data.update({
                "title": entity_name,  # Required unique field
                "summary": f"Auto-extracted topic record for {entity_name}"
            })

        elif entity_type == "locations":
            record_data.update({
                "description": f"Auto-extracted location record for {entity_name}",
                "type": entity_data.get("metadata", {}).get("type", ""),
                "coordinates": entity_data.get("metadata", {}).get("coordinates", "")
            })

        elif entity_type == "artifacts":
            record_data.update({
                "description": f"Auto-extracted artifact record for {entity_name}",
                "origin": entity_data.get("metadata", {}).get("origin", ""),
                "source": entity_data.get("metadata", {}).get("source", "")
            })

        elif entity_type == "sightings":
            # Sightings have different required fields
            record_data = {
                "description": entity_data.get("entity_name", "Auto-extracted sighting"),
                "shape": entity_data.get("metadata", {}).get("shape", ""),
                "duration": entity_data.get("metadata", {}).get("duration", ""),
                "city": entity_data.get("metadata", {}).get("city", ""),
                "state": entity_data.get("metadata", {}).get("state", ""),
                "country": entity_data.get("metadata", {}).get("country", ""),
                "comments": f"Auto-extracted sighting record",
                "extraction_metadata": record_data["extraction_metadata"]
            }

        elif entity_type == "key-figures":
            record_data.update({
                "bio": f"Auto-extracted key figure record for {entity_name}",
                "role": entity_data.get("metadata", {}).get("role", ""),
                "rank": entity_data.get("metadata", {}).get("rank", ""),
                "credibility": 50,  # Default neutral credibility
                "popularity": 0,
                "authority": 0
            })

        elif entity_type == "files" or entity_type == "documents":
            record_data.update({
                "title": entity_name,
                "content": entity_data.get("metadata", {}).get("content", f"Auto-extracted document record for {entity_name}"),
                "doc_type": "case_file" if entity_type == "files" else entity_data.get("metadata", {}).get("doc_type", "document"),
                "source": entity_data.get("metadata", {}).get("source", ""),
                "metadata": {
                    "extraction_source": "ai_entity_extraction",
                    "confidence": entity_data.get("confidence", 0.0)
                }
            })

        return record_data

    async def create_entities_batch(self, entities_by_type: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        Create multiple entities in batch operations for better performance
        
        Args:
            entities_by_type: Dictionary mapping entity types to lists of entity data
            
        Returns:
            Batch creation results
        """
        batch_results = {
            "created_entities": {},
            "failed_creations": {},
            "statistics": {
                "total_processed": 0,
                "total_created": 0,
                "total_failed": 0
            },
            "errors": []
        }
        
        if not self.xata_client:
            batch_results["errors"].append("Xata client not available")
            return batch_results
            
        try:
            # Process each entity type in batch
            for entity_type, entities in entities_by_type.items():
                if not entities:
                    continue
                    
                table_name = self.table_mappings.get(entity_type)
                if not table_name:
                    logger.error(f"Unknown entity type: {entity_type}")
                    continue
                    
                # Prepare batch data
                batch_data = []
                for entity_data in entities:
                    record_data = self._prepare_record_data(entity_type, entity_data)
                    if record_data:
                        batch_data.append(record_data)
                        
                if not batch_data:
                    continue
                    
                try:
                    # Execute batch creation
                    batch_response = await self.xata_client.records().create_many_async(
                        table_name, batch_data
                    )
                    
                    # Process batch results
                    created_count = 0
                    failed_count = 0
                    batch_results["created_entities"][entity_type] = []
                    batch_results["failed_creations"][entity_type] = []
                    
                    for i, result in enumerate(batch_response.get("records", [])):
                        if result.get("id"):
                            batch_results["created_entities"][entity_type].append({
                                "entity_name": entities[i]["entity_name"],
                                "xata_id": result["id"],
                                "created_at": datetime.now().isoformat()
                            })
                            created_count += 1
                        else:
                            batch_results["failed_creations"][entity_type].append({
                                "entity_name": entities[i]["entity_name"],
                                "error": "Batch creation failed"
                            })
                            failed_count += 1
                            
                    batch_results["statistics"]["total_processed"] += len(entities)
                    batch_results["statistics"]["total_created"] += created_count
                    batch_results["statistics"]["total_failed"] += failed_count
                    
                    logger.info(
                        f"Batch {entity_type}: {created_count} created, {failed_count} failed"
                    )
                    
                except Exception as e:
                    error_msg = f"Batch creation failed for {entity_type}: {str(e)}"
                    logger.error(error_msg)
                    batch_results["errors"].append(error_msg)
                    
                    # Add all entities as failed
                    batch_results["failed_creations"][entity_type] = [
                        {
                            "entity_name": entity["entity_name"],
                            "error": str(e)
                        } for entity in entities
                    ]
                    batch_results["statistics"]["total_failed"] += len(entities)
                    
        except Exception as e:
            error_msg = f"Error in batch entity creation: {str(e)}"
            logger.error(error_msg)
            batch_results["errors"].append(error_msg)
            
        return batch_results

    def create_entity_via_typescript(self, entity_type: str, record_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create entity using TypeScript models (alternative approach)

        Args:
            entity_type: Type of entity
            record_data: Data for the new record

        Returns:
            Created record or None if failed
        """
        if not self.node_scripts_path:
            logger.warning("TypeScript models path not found")
            return None

        try:
            # Create a temporary Node.js script to call TypeScript functions
            script_content = f"""
const {{ create{entity_type.title()} }} = require('./{entity_type}.ts');

async function createEntity() {{
    try {{
        const result = await create{entity_type.title()}({json.dumps(record_data)});
        console.log(JSON.stringify(result));
    }} catch (error) {{
        console.error('Error:', error.message);
        process.exit(1);
    }}
}}

createEntity();
"""

            # Write temporary script
            script_path = os.path.join(
                self.node_scripts_path, f"temp_create_{entity_type}.js")
            with open(script_path, 'w') as f:
                f.write(script_content)

            # Execute Node.js script
            result = subprocess.run(
                ['node', script_path],
                capture_output=True,
                text=True,
                cwd=self.node_scripts_path
            )

            # Clean up temporary script
            os.remove(script_path)

            if result.returncode == 0:
                return json.loads(result.stdout)
            else:
                logger.error(f"TypeScript creation failed: {result.stderr}")
                return None

        except Exception as e:
            logger.error(f"Error in TypeScript entity creation: {e}")
            return None
    
    async def search_entities_batch(self, entities_by_type: Dict[str, List[str]]) -> Dict[str, List[Dict]]:
        """
        Search for multiple entities in batch operations
        
        Args:
            entities_by_type: Dictionary mapping entity types to lists of entity names
            
        Returns:
            Search results for all entities
        """
        search_results = {}
        
        if not self.xata_client:
            return search_results
            
        try:
            for entity_type, entity_names in entities_by_type.items():
                if not entity_names:
                    continue
                    
                table_name = self.table_mappings.get(entity_type)
                if not table_name:
                    continue
                    
                # Check cache first
                cache_key = f"{entity_type}:{','.join(sorted(entity_names))}"
                if cache_key in self._search_cache:
                    search_results[entity_type] = self._search_cache[cache_key]
                    continue
                    
                # Batch search using vector or keyword search
                search_query = {
                    "filter": {
                        "name": {
                            "$any": entity_names
                        }
                    },
                    "size": len(entity_names) * 2  # Allow for fuzzy matches
                }
                
                try:
                    batch_response = await self.xata_client.data().search_async(
                        table_name, search_query
                    )
                    
                    # Process search results
                    type_results = []
                    found_names = set()
                    
                    for record in batch_response.get("records", []):
                        record_name = record.get("name", "")
                        # Find best match from entity names
                        best_match = self._find_best_name_match(record_name, entity_names)
                        if best_match:
                            type_results.append({
                                'entity_name': best_match,
                                'status': 'found',
                                'xata_record': record,
                                'xata_id': record.get('id'),
                                'table': table_name
                            })
                            found_names.add(best_match)
                            
                    # Add not found entities
                    for entity_name in entity_names:
                        if entity_name not in found_names:
                            type_results.append({
                                'entity_name': entity_name,
                                'status': 'not_found',
                                'table': table_name,
                                'action_needed': 'create_new'
                            })
                            
                    # Cache results
                    self._search_cache[cache_key] = type_results
                    search_results[entity_type] = type_results
                    
                except Exception as e:
                    logger.error(f"Batch search error for {entity_type}: {e}")
                    # Fallback to individual searches
                    search_results[entity_type] = await self._fallback_individual_search(
                        entity_type, entity_names, table_name
                    )
                    
        except Exception as e:
            logger.error(f"Error in batch entity search: {e}")
            
        return search_results
    
    def _find_best_name_match(self, record_name: str, entity_names: List[str]) -> Optional[str]:
        """
        Find the best matching entity name for a database record
        """
        record_name_lower = record_name.lower().strip()
        
        # Exact match
        for entity_name in entity_names:
            if entity_name.lower().strip() == record_name_lower:
                return entity_name
                
        # Fuzzy match (contains)
        for entity_name in entity_names:
            entity_lower = entity_name.lower().strip()
            if entity_lower in record_name_lower or record_name_lower in entity_lower:
                return entity_name
                
        return None
    
    async def _fallback_individual_search(
        self, entity_type: str, entity_names: List[str], table_name: str
    ) -> List[Dict]:
        """
        Fallback to individual entity searches when batch fails
        """
        results = []
        
        for entity_name in entity_names:
            try:
                # Use the existing search pattern from interactive_entity_processor
                search_query = {
                    "filter": {
                        "name": {
                            "$iContains": entity_name
                        }
                    },
                    "size": 1
                }
                
                response = await self.xata_client.data().search_async(table_name, search_query)
                
                if response.get("records"):
                    record = response["records"][0]
                    results.append({
                        'entity_name': entity_name,
                        'status': 'found',
                        'xata_record': record,
                        'xata_id': record.get('id'),
                        'table': table_name
                    })
                else:
                    results.append({
                        'entity_name': entity_name,
                        'status': 'not_found',
                        'table': table_name,
                        'action_needed': 'create_new'
                    })
                    
            except Exception as e:
                logger.error(f"Individual search error for {entity_name}: {e}")
                results.append({
                    'entity_name': entity_name,
                    'status': 'error',
                    'error': str(e),
                    'table': table_name
                })
                
        return results


async def create_entities_from_results(entity_results_file: str) -> Dict[str, Any]:
    """
    Create entities from an entity processing results file

    Args:
        entity_results_file: Path to entity_processing_results.json

    Returns:
        Creation results and statistics
    """
    try:
        with open(entity_results_file, 'r', encoding='utf-8') as f:
            results_data = json.load(f)

        search_results = results_data.get("xata_search_results", {})

        if not search_results:
            return {
                "error": "No search results found in file",
                "file": entity_results_file
            }

        creator = EntityCreator()
        # Extract entities that need creation
        entities_to_create = {}
        for entity_type, results in search_results.items():
            entities_needing_creation = [
                result for result in results
                if result.get('status') == 'not_found' and result.get('action_needed') == 'create_new'
            ]
            if entities_needing_creation:
                entities_to_create[entity_type] = entities_needing_creation
        
        # Use batch creation for better performance
        if entities_to_create:
            creation_results = await creator.create_entities_batch(entities_to_create)
        else:
            creation_results = {"status": "no_creation_needed", "statistics": {"total_created": 0}}

        # Save creation results back to the same directory
        results_dir = os.path.dirname(entity_results_file)
        creation_file = os.path.join(
            results_dir, "entity_creation_results.json")

        with open(creation_file, 'w', encoding='utf-8') as f:
            json.dump(creation_results, f, indent=2, ensure_ascii=False)

        logger.info(f"Creation results saved to: {creation_file}")

        return creation_results

    except Exception as e:
        logger.error(f"Error processing entity results file: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    # Example usage - create entities from a results file
    import sys

    if len(sys.argv) < 2:
        print("Usage: python entity_creator.py <entity_processing_results.json>")
        sys.exit(1)

    results_file = sys.argv[1]

    if not os.path.exists(results_file):
        print(f"Error: File not found: {results_file}")
        sys.exit(1)

    # Run entity creation
    async def main():
        results = await create_entities_from_results(results_file)

        print("=== Entity Creation Results ===")
        print(json.dumps(results.get("statistics", {}), indent=2))

        if results.get("errors"):
            print("\nErrors encountered:")
            for error in results["errors"]:
                print(f"  - {error}")

    asyncio.run(main())
