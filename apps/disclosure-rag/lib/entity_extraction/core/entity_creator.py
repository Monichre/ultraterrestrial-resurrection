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
        self.table_mappings = {
            "topics": "topics",
            "personnel": "personnel", 
            "events": "events",
            "organizations": "organizations",
            "locations": "locations",
            "testimonies": "testimonies",
            "documents": "documents",
            "sightings": "sightings",
            "artifacts": "artifacts"
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
            models_path = os.path.join(parent_dir, "packages", "db", "xata", "models")
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
                
                logger.info(f"Creating {len(entities_to_create)} new {entity_type} entities")
                
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
                            logger.info(f"✅ Created {entity_type}: {entity_data['entity_name']}")
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
                creation_results["statistics"]["total_processed"] += len(entities_to_create)
                creation_results["statistics"]["total_created"] += created_count
                creation_results["statistics"]["total_failed"] += failed_count
                
                logger.info(f"Entity type {entity_type}: {created_count} created, {failed_count} failed")
        
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
            
            # Create record using Xata client
            response = self.xata_client.data().insert(table_name, record_data)
            
            if hasattr(response, 'to_dict'):
                return response.to_dict()
            elif isinstance(response, dict):
                return response
            else:
                logger.warning(f"Unexpected response type: {type(response)}")
                return {"id": str(response)} if response else None
                
        except Exception as e:
            logger.error(f"Failed to create {entity_type} record for {entity_name}: {e}")
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
            logger.warning(f"Entity type {entity_type} not supported - no corresponding database table")
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
            
        return record_data
    
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
            script_path = os.path.join(self.node_scripts_path, f"temp_create_{entity_type}.js")
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
        creation_results = await creator.create_missing_entities(search_results)
        
        # Save creation results back to the same directory
        results_dir = os.path.dirname(entity_results_file)
        creation_file = os.path.join(results_dir, "entity_creation_results.json")
        
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