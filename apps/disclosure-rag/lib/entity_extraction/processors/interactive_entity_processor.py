#!/usr/bin/env python3
"""
Interactive Entity Extraction and Xata Search Integration
Post-processing step after saving to @packages/knowledge-base/
Date: February 23, 2025
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path
from datetime import datetime
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.prompt import Confirm, Prompt
from rich import print as rprint

logger = logging.getLogger(__name__)
console = Console()

# Import existing agents with fallback
try:
    from agents.entity_extraction_agent import EntityExtractionAgent
    AGENT_AVAILABLE = True
except ImportError as e:
    logger.warning(f"EntityExtractionAgent not available: {e}")
    AGENT_AVAILABLE = False

# Import Xata search with fallback
try:
    from ...xata_search import search_record_for_analysis
    XATA_AVAILABLE = True
except Exception as e:
    logger.warning(f"Xata search not available: {e}")
    XATA_AVAILABLE = False
    
    def search_record_for_analysis(*args, **kwargs):
        """Fallback function when Xata is not available"""
        return None

# Import entity creation functionality
try:
    from ..core.entity_creator import EntityCreator
    ENTITY_CREATOR_AVAILABLE = True
except Exception as e:
    logger.warning(f"Entity creator not available: {e}")
    ENTITY_CREATOR_AVAILABLE = False
    EntityCreator = None

class InteractiveEntityProcessor:
    """Interactive entity extraction and Xata search after knowledge base save"""
    
    def __init__(self):
        self.entity_extractor = EntityExtractionAgent() if AGENT_AVAILABLE else None
        self.entity_creator = EntityCreator() if ENTITY_CREATOR_AVAILABLE else None
        self.entity_types = {
            'personnel': '👤 Key Figures/Personnel',
            'organizations': '🏢 Organizations', 
            'topics': '📝 Topics/Themes',
            'events': '📅 Events/Incidents',
            'locations': '📍 Locations',
            'artifacts': '🗿 Artifacts', 
            'sightings': '👁️ Sightings'
        }
        
    def process_summary_file(self, summary_file_path: str, video_id: str, interactive: bool = True) -> Dict[str, Any]:
        """
        Main entry point - process summary file with interactive UI
        """
        try:
            # Step 1: Read summary file
            with open(summary_file_path, 'r', encoding='utf-8') as f:
                summary_content = f.read()
            
            console.print(Panel.fit(
                f"🔍 Processing Summary File\n[green]{summary_file_path}[/green]",
                title="Entity Extraction",
                border_style="blue"
            ))
            
            # Step 2: Extract entities
            extracted_entities = self._extract_entities_with_feedback(summary_content)
            
            if not extracted_entities:
                console.print("⚠️ No entities extracted. Skipping Xata search.")
                return {"status": "no_entities", "entities": {}}
            
            # Step 3: Display extracted entities
            self._display_extracted_entities(extracted_entities)
            
            # Step 4: Interactive Xata search by entity type
            if interactive:
                search_results = self._interactive_xata_search(extracted_entities)
            else:
                # Non-interactive mode - search all entity types automatically
                search_results = self._batch_xata_search(extracted_entities)
            
            # Step 5: Create missing entities
            creation_results = {}
            if self.entity_creator and XATA_AVAILABLE:
                creation_results = self._create_missing_entities(search_results, interactive)
            else:
                if not ENTITY_CREATOR_AVAILABLE:
                    console.print("⚠️ [yellow]Entity creation not available[/yellow]")
                if not XATA_AVAILABLE:
                    console.print("⚠️ [yellow]Xata not available - skipping entity creation[/yellow]")
            
            # Step 6: Save results
            results = {
                "status": "completed",
                "video_id": video_id,
                "summary_file": summary_file_path,
                "entities": extracted_entities,
                "xata_search_results": search_results,
                "entity_creation_results": creation_results,
                "total_entities": sum(len(entities) for entities in extracted_entities.values()),
                "total_matches": sum(len(results) for results in search_results.values()),
                "total_created": creation_results.get("statistics", {}).get("total_created", 0)
            }
            
            self._save_entity_results(results, video_id)
            
            # Step 7: Update the ongoing entity index
            self._update_entity_index(results)
            
            return results
            
        except Exception as e:
            logger.error(f"Entity processing failed: {e}")
            console.print(f"❌ [red]Entity processing failed: {e}[/red]")
            return {"status": "error", "error": str(e)}
    
    def _extract_entities_with_feedback(self, summary_content: str) -> Dict[str, List[str]]:
        """Extract entities with user feedback"""
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            
            task = progress.add_task("🧠 Extracting entities with AI...", total=None)
            
            try:
                if self.entity_extractor:
                    entities = self.entity_extractor.extract_entities(summary_content)
                    progress.update(task, description="✅ Entity extraction complete")
                    return entities
                else:
                    progress.update(task, description="⚠️ Entity extractor not available")
                    logger.warning("EntityExtractionAgent not available, returning empty results")
                    return {}
                
            except Exception as e:
                progress.update(task, description="❌ Entity extraction failed")
                logger.error(f"Entity extraction failed: {e}")
                return {}
    
    def _display_extracted_entities(self, entities: Dict[str, List[str]]) -> None:
        """Display extracted entities in rich table format"""
        
        table = Table(title="🔍 Extracted Entities", show_header=True, header_style="bold magenta")
        table.add_column("Entity Type", style="cyan", width=20)
        table.add_column("Count", justify="center", style="green", width=8)
        table.add_column("Entities", style="white")
        
        for entity_type, entity_list in entities.items():
            if entity_list:  # Only show types with entities
                display_name = self.entity_types.get(entity_type, entity_type.title())
                count = len(entity_list)
                entities_text = ", ".join(entity_list[:5])  # Show first 5
                if len(entity_list) > 5:
                    entities_text += f" ... and {len(entity_list) - 5} more"
                
                table.add_row(display_name, str(count), entities_text)
        
        console.print(table)
        console.print()
    
    def _interactive_xata_search(self, entities: Dict[str, List[str]]) -> Dict[str, List[Dict]]:
        """Interactive Xata search by entity type"""
        
        search_results = {}
        
        if XATA_AVAILABLE:
            console.print(Panel.fit(
                "🔍 Interactive Xata Search\nSearch for existing records in the remote Xata database",
                title="Database Search",
                border_style="green"
            ))
        else:
            console.print(Panel.fit(
                "⚠️ Xata Search Unavailable\nXata credentials not configured - skipping database search",
                title="Database Search",
                border_style="yellow"
            ))
            return {}
        
        for entity_type, entity_list in entities.items():
            if not entity_list:
                continue
                
            display_name = self.entity_types.get(entity_type, entity_type.title())
            
            # Ask user if they want to search this entity type
            should_search = Confirm.ask(
                f"\n🔍 Begin search for all listed {display_name.lower()}? ({len(entity_list)} entities)",
                default=True
            )
            
            if should_search:
                search_results[entity_type] = self._search_entity_type(entity_type, entity_list)
            else:
                console.print(f"⏭️ Skipping {display_name.lower()} search")
                search_results[entity_type] = []
        
        return search_results
    
    def _batch_xata_search(self, entities: Dict[str, List[str]]) -> Dict[str, List[Dict]]:
        """Non-interactive batch search of all entity types"""
        search_results = {}
        
        if not XATA_AVAILABLE:
            console.print(Panel.fit(
                "⚠️ Xata Search Unavailable\nXata credentials not configured - skipping database search",
                title="Database Search",
                border_style="yellow"
            ))
            return {}
            
        console.print(Panel.fit(
            "🔍 Batch Xata Search\nSearching all entity types in remote Xata database",
            title="Database Search",
            border_style="green"
        ))
        
        for entity_type, entity_list in entities.items():
            if entity_list:
                console.print(f"\n🔍 Searching {len(entity_list)} {self.entity_types.get(entity_type, entity_type)}")
                search_results[entity_type] = self._search_entity_type(entity_type, entity_list)
            else:
                search_results[entity_type] = []
                
        return search_results
    
    def _search_entity_type(self, entity_type: str, entity_list: List[str]) -> List[Dict]:
        """Search Xata for a specific entity type with progress feedback"""
        
        table_mapping = {
            'personnel': 'personnel',
            'organizations': 'organizations',
            'topics': 'topics',
            'events': 'events', 
            'locations': 'locations',
            'artifacts': 'artifacts',
            'sightings': 'sightings'
        }
        
        xata_table = table_mapping.get(entity_type, entity_type)
        results = []
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            
            for entity_name in entity_list:
                task = progress.add_task(f"🔍 Searching Xata for: {entity_name}", total=None)
                
                try:
                    # Search Xata using existing function
                    match = search_record_for_analysis(
                        analysis_text=entity_name,
                        table_name=xata_table,
                        search_field='name'
                    )
                    
                    if match:
                        progress.update(task, description=f"✅ Found match: {entity_name}")
                        results.append({
                            'entity_name': entity_name,
                            'status': 'found',
                            'xata_record': match,
                            'xata_id': match.get('id'),
                            'table': xata_table
                        })
                    else:
                        progress.update(task, description=f"❌ No match: {entity_name}")
                        results.append({
                            'entity_name': entity_name,
                            'status': 'not_found',
                            'table': xata_table,
                            'action_needed': 'create_new'
                        })
                        
                except Exception as e:
                    progress.update(task, description=f"⚠️ Error searching: {entity_name}")
                    logger.error(f"Search error for {entity_name}: {e}")
                    results.append({
                        'entity_name': entity_name,
                        'status': 'error',
                        'error': str(e),
                        'table': xata_table
                    })
        
        # Display results summary
        found_count = len([r for r in results if r['status'] == 'found'])
        not_found_count = len([r for r in results if r['status'] == 'not_found'])
        
        console.print(f"\n📊 Search Results: ✅ {found_count} found, ❌ {not_found_count} not found")
        
        return results
    
    def _save_entity_results(self, results: Dict[str, Any], video_id: str) -> None:
        """Save entity processing results"""
        
        # Save to knowledge base metadata - get the correct path
        summary_path = Path(results['summary_file'])
        video_folder = summary_path.parent  # This should be the video folder
        results_file = video_folder / "entity_processing_results.json"
        
        try:
            with open(results_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            
            console.print(f"\n💾 [green]Results saved to:[/green] {results_file}")
            
        except Exception as e:
            logger.error(f"Failed to save results: {e}")
            console.print(f"⚠️ [yellow]Could not save results: {e}[/yellow]")
    
    def _create_missing_entities(self, search_results: Dict[str, List[Dict]], interactive: bool = True) -> Dict[str, Any]:
        """Create missing entities with interactive confirmation"""
        
        # Count entities that need creation
        entities_to_create = {}
        total_needed = 0
        
        for entity_type, results in search_results.items():
            entities_needing_creation = [
                result for result in results 
                if result.get('status') == 'not_found' and result.get('action_needed') == 'create_new'
            ]
            if entities_needing_creation:
                entities_to_create[entity_type] = entities_needing_creation
                total_needed += len(entities_needing_creation)
        
        if total_needed == 0:
            console.print("✅ [green]All entities already exist in database[/green]")
            return {"status": "no_creation_needed", "statistics": {"total_created": 0}}
        
        # Display creation summary
        console.print(Panel.fit(
            f"➕ Entity Creation Opportunity\nFound {total_needed} entities that need database creation",
            title="Create New Entities",
            border_style="yellow"
        ))
        
        # Show entities that would be created
        table = Table(title="🆕 Entities Ready for Creation", show_header=True, header_style="bold yellow")
        table.add_column("Entity Type", style="cyan", width=20)
        table.add_column("Count", justify="center", style="green", width=8)
        table.add_column("Entity Names", style="white")
        
        for entity_type, entity_list in entities_to_create.items():
            display_name = self.entity_types.get(entity_type, entity_type.title())
            count = len(entity_list)
            entity_names = ", ".join([e['entity_name'] for e in entity_list[:3]])
            if len(entity_list) > 3:
                entity_names += f" ... and {len(entity_list) - 3} more"
            
            table.add_row(display_name, str(count), entity_names)
        
        console.print(table)
        console.print()
        
        # Interactive confirmation
        if interactive:
            should_create = Confirm.ask(
                f"🔄 Create {total_needed} new database entities?",
                default=True
            )
            
            if not should_create:
                console.print("⏭️ [yellow]Skipping entity creation[/yellow]")
                return {"status": "creation_skipped", "statistics": {"total_created": 0}}
        
        # Perform entity creation
        console.print(Panel.fit(
            "➕ Creating Missing Entities\nInserting new records into Xata database",
            title="Entity Creation",
            border_style="green"
        ))
        
        try:
            # Use asyncio to run the async creation method
            import asyncio
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            
            creation_results = loop.run_until_complete(
                self.entity_creator.create_missing_entities(search_results)
            )
            
            # Display creation results
            self._display_creation_results(creation_results)
            
            return creation_results
            
        except Exception as e:
            error_msg = f"Entity creation failed: {e}"
            logger.error(error_msg)
            console.print(f"❌ [red]{error_msg}[/red]")
            return {"status": "creation_failed", "error": str(e), "statistics": {"total_created": 0}}
    
    def _display_creation_results(self, creation_results: Dict[str, Any]) -> None:
        """Display the results of entity creation"""
        
        stats = creation_results.get("statistics", {})
        created_count = stats.get("total_created", 0)
        failed_count = stats.get("total_failed", 0)
        
        if created_count > 0:
            console.print(f"✅ [green]Successfully created {created_count} new entities[/green]")
            
            # Show created entities by type
            created_entities = creation_results.get("created_entities", {})
            for entity_type, entities in created_entities.items():
                if entities:
                    display_name = self.entity_types.get(entity_type, entity_type.title())
                    console.print(f"  📝 {display_name}: {len(entities)} created")
                    for entity in entities[:3]:  # Show first 3
                        console.print(f"    ✅ {entity['entity_name']} (ID: {entity['xata_id']})")
        
        if failed_count > 0:
            console.print(f"⚠️ [yellow]Failed to create {failed_count} entities[/yellow]")
            
            # Show failed entities by type
            failed_entities = creation_results.get("failed_creations", {})
            for entity_type, entities in failed_entities.items():
                if entities:
                    display_name = self.entity_types.get(entity_type, entity_type.title())
                    console.print(f"  ❌ {display_name}: {len(entities)} failed")
                    for entity in entities[:2]:  # Show first 2 failures
                        console.print(f"    ❌ {entity['entity_name']}: {entity.get('error', 'Unknown error')}")
        
        console.print()
    
    def _update_entity_index(self, results: Dict[str, Any]) -> None:
        """Update the ongoing entity index with new extraction results"""
        
        # Determine index file location
        index_file = Path(__file__).parent.parent / "entity_index.json"
        
        try:
            # Load existing index or create new one
            if index_file.exists():
                with open(index_file, 'r', encoding='utf-8') as f:
                    index_data = json.load(f)
            else:
                index_data = {
                    "version": "1.0",
                    "created": str(datetime.now()),
                    "last_updated": str(datetime.now()),
                    "total_processed_files": 0,
                    "total_extracted_entities": 0,
                    "total_matched_entities": 0,
                    "total_created_entities": 0,
                    "processed_files": [],
                    "entity_summary": {
                        "personnel": {"extracted": 0, "matched": 0, "created": 0},
                        "organizations": {"extracted": 0, "matched": 0, "created": 0},
                        "topics": {"extracted": 0, "matched": 0, "created": 0},
                        "events": {"extracted": 0, "matched": 0, "created": 0},
                        "locations": {"extracted": 0, "matched": 0, "created": 0},
                        "artifacts": {"extracted": 0, "matched": 0, "created": 0},
                        "sightings": {"extracted": 0, "matched": 0, "created": 0}
                    },
                    "recent_entities": {
                        "personnel": [],
                        "organizations": [],
                        "topics": [],
                        "events": [],
                        "locations": [],
                        "artifacts": [],
                        "sightings": []
                    }
                }
            
            # Create file entry
            file_entry = {
                "document_id": results["video_id"],
                "file_path": results["summary_file"],
                "processed_date": str(datetime.now()),
                "status": results["status"],
                "entities": results["entities"],
                "xata_matches": results["xata_search_results"],
                "creation_results": results["entity_creation_results"],
                "statistics": {
                    "total_entities": results["total_entities"],
                    "total_matches": results["total_matches"],
                    "total_created": results["total_created"]
                }
            }
            
            # Update overall statistics
            index_data["total_processed_files"] += 1
            index_data["total_extracted_entities"] += results["total_entities"]
            index_data["total_matched_entities"] += results["total_matches"]
            index_data["total_created_entities"] += results["total_created"]
            index_data["last_updated"] = str(datetime.now())
            
            # Update entity type summaries
            for entity_type, entity_list in results["entities"].items():
                if entity_type in index_data["entity_summary"]:
                    index_data["entity_summary"][entity_type]["extracted"] += len(entity_list)
                    
                    # Count matches for this entity type
                    matches = results["xata_search_results"].get(entity_type, [])
                    matched_count = len([m for m in matches if m.get("status") == "found"])
                    index_data["entity_summary"][entity_type]["matched"] += matched_count
                    
                    # Count created entities for this type
                    created_entities = results["entity_creation_results"].get("created_entities", {})
                    created_count = len(created_entities.get(entity_type, []))
                    index_data["entity_summary"][entity_type]["created"] += created_count
                    
                    # Add recent entities (keep last 10 per type)
                    recent_list = index_data["recent_entities"][entity_type]
                    recent_list.extend(entity_list)
                    index_data["recent_entities"][entity_type] = recent_list[-10:]  # Keep last 10
            
            # Add file to processed files list (keep last 20 files)
            index_data["processed_files"].append(file_entry)
            index_data["processed_files"] = index_data["processed_files"][-20:]  # Keep last 20 files
            
            # Save updated index
            with open(index_file, 'w', encoding='utf-8') as f:
                json.dump(index_data, f, indent=2, ensure_ascii=False)
            
            console.print(f"\\n📊 [green]Entity index updated:[/green] {index_file}")
            console.print(f"   📈 Total processed files: {index_data['total_processed_files']}")
            console.print(f"   🔍 Total extracted entities: {index_data['total_extracted_entities']}")
            console.print(f"   ✅ Total matched entities: {index_data['total_matched_entities']}")
            
        except Exception as e:
            logger.error(f"Failed to update entity index: {e}")
            console.print(f"⚠️ [yellow]Could not update entity index: {e}[/yellow]")


def process_summary_file_interactive(summary_file_path: str, video_id: str, interactive: bool = True) -> Dict[str, Any]:
    """
    Main entry point for entity processing
    Called after saving to @packages/knowledge-base/
    """
    processor = InteractiveEntityProcessor()
    return processor.process_summary_file(summary_file_path, video_id, interactive)


if __name__ == "__main__":
    # Test with an existing summary file
    test_summary = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/transcripts/2025-01-31/WGUb1JKxBDo/exPentagonOfficialConfirmsAlienLanguageExistsLueElizondoDebriefedEp24Summary.txt"
    
    if os.path.exists(test_summary):
        results = process_summary_file_interactive(test_summary, "WGUb1JKxBDo")
        print(f"\nProcessing complete: {results}")
    else:
        print(f"Test file not found: {test_summary}")