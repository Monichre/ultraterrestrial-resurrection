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

# Import optimized search utility
try:
    from ..utils.optimized_entity_search import OptimizedEntitySearch
    OPTIMIZED_SEARCH_AVAILABLE = True
except Exception as e:
    logger.warning(f"Optimized search not available: {e}")
    OPTIMIZED_SEARCH_AVAILABLE = False
    OptimizedEntitySearch = None


def _search_results_of(results: Dict[str, Any]) -> Dict[str, Any]:
    """Entity search results under either the current or the legacy key.

    New files use `entity_search_results`; files written before 2026-08-10 use
    `xata_search_results`, named for a backend that is retired (CLAUDE.md — use
    @db/postgres). Read both so the ~97 existing result files stay usable.
    """
    return (results.get("entity_search_results")
            or results.get("xata_search_results")
            or {})


class InteractiveEntityProcessor:
    """Interactive entity extraction and Xata search after knowledge base save"""

    def __init__(self):
        self.entity_extractor = EntityExtractionAgent() if AGENT_AVAILABLE else None
        self.entity_creator = EntityCreator() if ENTITY_CREATOR_AVAILABLE else None
        self.optimized_search = None
        
        # Initialize optimized search if available
        if OPTIMIZED_SEARCH_AVAILABLE and XATA_AVAILABLE:
            try:
                # Use the same xata_client from entity_creator if available
                xata_client = getattr(self.entity_creator, 'xata_client', None) if self.entity_creator else None
                self.optimized_search = OptimizedEntitySearch(xata_client=xata_client)
            except Exception as e:
                logger.warning(f"Failed to initialize optimized search: {e}")
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

            # Step 2: Load entities from the pipeline's NER stage
            extracted_entities = self._extract_entities_with_feedback(
                summary_content, summary_file_path)

            # `extracted_entities` is a dict with seven fixed keys, so it is
            # truthy even when every bucket is empty — which is how a failed
            # extraction was recorded as `"status": "completed"` with
            # `total_entities: 0`. Grade the contents, not the container.
            if extracted_entities is None:
                console.print(
                    "❌ [red]Entity extraction failed — recording as error, "
                    "not as an empty result.[/red]")
                return {
                    "status": "error",
                    "error": "entity extraction produced no usable result",
                    "entities": {},
                    "total_entities": 0,
                }

            if not any(extracted_entities.values()):
                console.print(
                    "⚠️ No entities found in this document. Skipping search.")
                return {
                    "status": "no_entities",
                    "entities": extracted_entities,
                    "total_entities": 0,
                }

            # Step 3: Display extracted entities
            self._display_extracted_entities(extracted_entities)

            # Step 4: Interactive Xata search by entity type
            if interactive:
                search_results = self._interactive_xata_search(
                    extracted_entities)
            else:
                # Non-interactive mode - search all entity types automatically
                search_results = self._batch_xata_search(extracted_entities)

            # Step 5: Create missing entities
            creation_results = {}
            if self.entity_creator and XATA_AVAILABLE:
                creation_results = self._create_missing_entities(
                    search_results, interactive)
            else:
                if not ENTITY_CREATOR_AVAILABLE:
                    console.print(
                        "⚠️ [yellow]Entity creation not available[/yellow]")
                if not XATA_AVAILABLE:
                    console.print(
                        "⚠️ [yellow]Xata not available - skipping entity creation[/yellow]")

            # Step 6: Save results
            results = {
                "status": "completed",
                "video_id": video_id,
                "summary_file": summary_file_path,
                "entities": extracted_entities,
                # Renamed from `xata_search_results`: Xata is retired (CLAUDE.md
                # — use @db/postgres), so the old name stamped a dead backend on
                # every new file. Readers accept both; see
                # entity_creator.read_search_results().
                "entity_search_results": search_results,
                "entity_creation_results": creation_results,
                "entity_source": "rag_pipeline.ner_results",
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

    #: disclosure.ner emits five wire types (entity.schema.json). These are the
    #: buckets this processor searches and creates records against.
    #:
    #: `topics` and `sightings` have no NER wire type and stay empty here — the
    #: pipeline surfaces those through analysis.extracted_data, not NER. An
    #: empty bucket is honest; inventing a sixth wire type to fill it would not
    #: be.
    _NER_TYPE_TO_BUCKET = {
        "PERSONNEL": "personnel",
        "EVENT": "events",
        "ORGANIZATION": "organizations",
        "LOCATION": "locations",
        "EVIDENCE": "artifacts",
    }

    def _load_pipeline_ner(self, summary_file_path: str) -> Optional[Dict[str, List[str]]]:
        """Read entities from the RAG pipeline's NER stage, if it ran.

        NER used to be specified twice: RagPromptPipeline stage 4 runs
        `disclosure.ner` per chunk through the frontier fallback chain, and this
        processor ran a second, whole-document pass through a separate OpenAI
        client with a different schema, different provider, and different
        confidence semantics. Two subsystems disagreeing about what an entity is
        is worse than either alone, so stage 4 is now the single source and this
        reads its output.

        Returns None when no pipeline NER is available, so the caller can tell
        "nothing ran" from "ran and found nothing".
        """
        pipeline_path = None
        summary_dir = Path(summary_file_path).parent
        for candidate in sorted(summary_dir.glob("*_rag_pipeline.json")):
            pipeline_path = candidate
            break

        if pipeline_path is None:
            logger.warning("No *_rag_pipeline.json beside %s — pipeline NER unavailable",
                           summary_file_path)
            return None

        try:
            with open(pipeline_path, 'r', encoding='utf-8') as f:
                pipeline = json.load(f)
        except Exception as e:
            logger.error("Could not read %s: %s", pipeline_path, e)
            return None

        ner_results = pipeline.get("ner_results") or []
        if not ner_results:
            logger.warning(
                "%s has no ner_results (pipeline status=%s) — nothing to converge on",
                pipeline_path.name, pipeline.get("status"))
            return None

        buckets: Dict[str, List[str]] = {key: [] for key in self.entity_types}
        seen: Dict[str, set] = {key: set() for key in self.entity_types}

        for entry in ner_results:
            ner = entry.get("ner") if isinstance(entry, dict) else None
            if not isinstance(ner, dict):
                continue
            # `_raw_list` is what rag_prompt_pipeline.py:314 emits when the
            # model returns a bare JSON array instead of an object with an
            # "entities" key — both shapes are normal and neither is an error.
            # Reading only "entities" silently dropped every array-shaped
            # result: on video _mWPuffi_hc the pipeline extracted entities for
            # 2 of 8 chunks and this loader reported "Loaded 0 entities",
            # because both were `_raw_list`. Accept either shape.
            entities = ner.get("entities")
            if not entities:
                entities = ner.get("_raw_list")
            for entity in entities or []:
                if not isinstance(entity, dict):
                    continue
                bucket = self._NER_TYPE_TO_BUCKET.get(
                    str(entity.get("type") or "").upper())
                name = (entity.get("name") or "").strip()
                if not bucket or not name:
                    continue
                # Chunk-level NER sees the same figure in many chunks; dedupe
                # case-insensitively so a record is searched for once.
                key = name.lower()
                if key in seen[bucket]:
                    continue
                seen[bucket].add(key)
                buckets[bucket].append(name)

        console.print(
            f"📥 Loaded NER from [cyan]{pipeline_path.name}[/cyan] "
            f"({len(ner_results)} chunk results)")
        return buckets

    def _extract_entities_with_feedback(
        self, summary_content: str, summary_file_path: str
    ) -> Optional[Dict[str, List[str]]]:
        """Load this document's entities, reporting failure as failure.

        Returns None when extraction could not be performed at all. The old
        behaviour returned seven empty buckets in that case, which the caller
        could not distinguish from a document that genuinely contained no
        entities — so a 401 wrote `"status": "completed"`.
        """
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:

            task = progress.add_task(
                "🧠 Loading entities from pipeline NER...", total=None)

            try:
                entities = self._load_pipeline_ner(summary_file_path)
                if entities is None:
                    progress.update(
                        task, description="❌ No pipeline NER available")
                    return None
                total = sum(len(v) for v in entities.values())
                progress.update(
                    task, description=f"✅ Loaded {total} entities from pipeline NER")
                return entities

            except Exception as e:
                progress.update(task, description="❌ Entity load failed")
                logger.error(f"Entity load failed: {e}")
                return None

    def _display_extracted_entities(self, entities: Dict[str, List[str]]) -> None:
        """Display extracted entities in rich table format"""

        table = Table(title="🔍 Extracted Entities",
                      show_header=True, header_style="bold magenta")
        table.add_column("Entity Type", style="cyan", width=20)
        table.add_column("Count", justify="center", style="green", width=8)
        table.add_column("Entities", style="white")

        for entity_type, entity_list in entities.items():
            if entity_list:  # Only show types with entities
                display_name = self.entity_types.get(
                    entity_type, entity_type.title())
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

        # Check if user wants to use batch operations for all entity types
        total_entities = sum(len(entity_list) for entity_list in entities.items() if entity_list[1])
        if total_entities > 10:  # Use batch for larger numbers
            use_batch = Confirm.ask(
                f"\n⚡ Use optimized batch search for all {total_entities} entities? (Recommended for large sets)",
                default=True
            )
            
            if use_batch:
                try:
                    # Use batch search for all entities at once
                    if self.entity_creator and hasattr(self.entity_creator, 'search_entities_batch'):
                        import asyncio
                        try:
                            loop = asyncio.get_event_loop()
                        except RuntimeError:
                            loop = asyncio.new_event_loop()
                            asyncio.set_event_loop(loop)
                        
                        search_results = loop.run_until_complete(
                            self.entity_creator.search_entities_batch(entities)
                        )
                        
                        # Display batch results summary
                        for entity_type, results in search_results.items():
                            if results:
                                found_count = len([r for r in results if r.get('status') == 'found'])
                                not_found_count = len([r for r in results if r.get('status') == 'not_found'])
                                display_name = self.entity_types.get(entity_type, entity_type.title())
                                console.print(
                                    f"  📊 {display_name}: ✅ {found_count} found, ❌ {not_found_count} not found"
                                )
                        
                        return search_results
                    
                except Exception as e:
                    console.print(f"⚠️ Batch search failed: {e}")
                    console.print("🔄 Falling back to interactive search")
        
        # Interactive search for individual entity types
        for entity_type, entity_list in entities.items():
            if not entity_list:
                continue

            display_name = self.entity_types.get(
                entity_type, entity_type.title())

            # Ask user if they want to search this entity type
            should_search = Confirm.ask(
                f"\n🔍 Begin search for all listed {display_name.lower()}? ({len(entity_list)} entities)",
                default=True
            )

            if should_search:
                search_results[entity_type] = self._search_entity_type(
                    entity_type, entity_list)
            else:
                console.print(f"⏭️ Skipping {display_name.lower()} search")
                search_results[entity_type] = []

        return search_results

    def _batch_xata_search(self, entities: Dict[str, List[str]]) -> Dict[str, List[Dict]]:
        """Non-interactive batch search of all entity types using optimized batch operations"""
        search_results = {}

        if not XATA_AVAILABLE:
            console.print(Panel.fit(
                "⚠️ Xata Search Unavailable\nXata credentials not configured - skipping database search",
                title="Database Search",
                border_style="yellow"
            ))
            return {}

        console.print(Panel.fit(
            "🔍 Optimized Batch Xata Search\nSearching all entity types using batch operations",
            title="Database Search",
            border_style="green"
        ))

        try:
            # Use optimized search if available
            if self.optimized_search:
                import asyncio
                try:
                    loop = asyncio.get_event_loop()
                except RuntimeError:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                
                # Convert SearchResult objects to dict format expected by the rest of the system
                optimized_results = loop.run_until_complete(
                    self.optimized_search.search_entities_optimized(
                        entities, use_vector_search=True, confidence_threshold=0.7
                    )
                )
                
                # Convert to expected format
                search_results = {}
                for entity_type, results in optimized_results.items():
                    search_results[entity_type] = []
                    for result in results:
                        search_results[entity_type].append({
                            'entity_name': result.entity_name,
                            'status': result.status,
                            'xata_record': result.xata_record,
                            'xata_id': result.xata_id,
                            'table': result.table,
                            'action_needed': result.action_needed,
                            'error': result.error
                        })
                
                # Display performance stats
                stats = self.optimized_search.get_performance_stats()
                total_entities = sum(len(entity_list) for entity_list in entities.values())
                total_found = sum(
                    len([r for r in results if r.get('status') == 'found'])
                    for results in search_results.values()
                )
                total_not_found = total_entities - total_found
                
                console.print(
                    f"\n📊 Optimized Search Results: ✅ {total_found} found, ❌ {total_not_found} not found"
                )
                console.print(
                    f"   ⚡ Cache hit rate: {stats['cache_hit_rate_percent']}% | Operations: {stats['total_operations']}"
                )
                
            # Fallback to entity creator batch search
            elif self.entity_creator and hasattr(self.entity_creator, 'search_entities_batch'):
                import asyncio
                try:
                    loop = asyncio.get_event_loop()
                except RuntimeError:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                
                search_results = loop.run_until_complete(
                    self.entity_creator.search_entities_batch(entities)
                )
                
                # Display batch search summary
                total_entities = sum(len(entity_list) for entity_list in entities.values())
                total_found = sum(
                    len([r for r in results if r.get('status') == 'found'])
                    for results in search_results.values()
                )
                total_not_found = total_entities - total_found
                
                console.print(
                    f"\n📊 Batch Search Results: ✅ {total_found} found, ❌ {total_not_found} not found"
                )
                
            else:
                # Fallback to original individual search method
                console.print("⚠️ Using fallback individual search method")
                for entity_type, entity_list in entities.items():
                    if entity_list:
                        console.print(
                            f"\n🔍 Searching {len(entity_list)} {self.entity_types.get(entity_type, entity_type)}")
                        search_results[entity_type] = self._search_entity_type(
                            entity_type, entity_list)
                    else:
                        search_results[entity_type] = []
                        
        except Exception as e:
            console.print(f"⚠️ Batch search failed: {e}")
            console.print("🔄 Falling back to individual entity searches")
            
            # Fallback to original method
            for entity_type, entity_list in entities.items():
                if entity_list:
                    console.print(
                        f"\n🔍 Searching {len(entity_list)} {self.entity_types.get(entity_type, entity_type)}")
                    search_results[entity_type] = self._search_entity_type(
                        entity_type, entity_list)
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
                task = progress.add_task(
                    f"🔍 Searching Xata for: {entity_name}", total=None)

                try:
                    # Search Xata using existing function
                    match = search_record_for_analysis(
                        analysis_text=entity_name,
                        table_name=xata_table,
                        search_field='name'
                    )

                    if match:
                        progress.update(
                            task, description=f"✅ Found match: {entity_name}")
                        results.append({
                            'entity_name': entity_name,
                            'status': 'found',
                            'xata_record': match,
                            'xata_id': match.get('id'),
                            'table': xata_table
                        })
                    else:
                        progress.update(
                            task, description=f"❌ No match: {entity_name}")
                        results.append({
                            'entity_name': entity_name,
                            'status': 'not_found',
                            'table': xata_table,
                            'action_needed': 'create_new'
                        })

                except Exception as e:
                    progress.update(
                        task, description=f"⚠️ Error searching: {entity_name}")
                    logger.error(f"Search error for {entity_name}: {e}")
                    results.append({
                        'entity_name': entity_name,
                        'status': 'error',
                        'error': str(e),
                        'table': xata_table
                    })

        # Display results summary
        found_count = len([r for r in results if r['status'] == 'found'])
        not_found_count = len(
            [r for r in results if r['status'] == 'not_found'])

        console.print(
            f"\n📊 Search Results: ✅ {found_count} found, ❌ {not_found_count} not found")

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

            console.print(
                f"\n💾 [green]Results saved to:[/green] {results_file}")

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
            console.print(
                "✅ [green]All entities already exist in database[/green]")
            return {"status": "no_creation_needed", "statistics": {"total_created": 0}}

        # Display creation summary
        console.print(Panel.fit(
            f"➕ Entity Creation Opportunity\nFound {total_needed} entities that need database creation",
            title="Create New Entities",
            border_style="yellow"
        ))

        # Show entities that would be created
        table = Table(title="🆕 Entities Ready for Creation",
                      show_header=True, header_style="bold yellow")
        table.add_column("Entity Type", style="cyan", width=20)
        table.add_column("Count", justify="center", style="green", width=8)
        table.add_column("Entity Names", style="white")

        for entity_type, entity_list in entities_to_create.items():
            display_name = self.entity_types.get(
                entity_type, entity_type.title())
            count = len(entity_list)
            entity_names = ", ".join([e['entity_name']
                                     for e in entity_list[:3]])
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
            # Use batch creation for better performance
            entities_to_create = {}
            for entity_type, results in search_results.items():
                entities_needing_creation = [
                    result for result in results
                    if result.get('status') == 'not_found' and result.get('action_needed') == 'create_new'
                ]
                if entities_needing_creation:
                    entities_to_create[entity_type] = entities_needing_creation
            
            # Use asyncio to run the async batch creation method
            import asyncio
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

            if entities_to_create:
                creation_results = loop.run_until_complete(
                    self.entity_creator.create_entities_batch(entities_to_create)
                )
            else:
                creation_results = {"status": "no_creation_needed", "statistics": {"total_created": 0}}

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
            console.print(
                f"✅ [green]Successfully created {created_count} new entities[/green]")

            # Show created entities by type
            created_entities = creation_results.get("created_entities", {})
            for entity_type, entities in created_entities.items():
                if entities:
                    display_name = self.entity_types.get(
                        entity_type, entity_type.title())
                    console.print(
                        f"  📝 {display_name}: {len(entities)} created")
                    for entity in entities[:3]:  # Show first 3
                        console.print(
                            f"    ✅ {entity['entity_name']} (ID: {entity['xata_id']})")

        if failed_count > 0:
            console.print(
                f"⚠️ [yellow]Failed to create {failed_count} entities[/yellow]")

            # Show failed entities by type
            failed_entities = creation_results.get("failed_creations", {})
            for entity_type, entities in failed_entities.items():
                if entities:
                    display_name = self.entity_types.get(
                        entity_type, entity_type.title())
                    console.print(
                        f"  ❌ {display_name}: {len(entities)} failed")
                    for entity in entities[:2]:  # Show first 2 failures
                        console.print(
                            f"    ❌ {entity['entity_name']}: {entity.get('error', 'Unknown error')}")

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
                "entity_matches": _search_results_of(results),
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
                    index_data["entity_summary"][entity_type]["extracted"] += len(
                        entity_list)

                    # Count matches for this entity type
                    matches = _search_results_of(results).get(
                        entity_type, [])
                    matched_count = len(
                        [m for m in matches if m.get("status") == "found"])
                    index_data["entity_summary"][entity_type]["matched"] += matched_count

                    # Count created entities for this type
                    created_entities = results["entity_creation_results"].get(
                        "created_entities", {})
                    created_count = len(created_entities.get(entity_type, []))
                    index_data["entity_summary"][entity_type]["created"] += created_count

                    # Add recent entities (keep last 10 per type)
                    recent_list = index_data["recent_entities"][entity_type]
                    recent_list.extend(entity_list)
                    # Keep last 10
                    index_data["recent_entities"][entity_type] = recent_list[-10:]

            # Add file to processed files list (keep last 20 files)
            index_data["processed_files"].append(file_entry)
            # Keep last 20 files
            index_data["processed_files"] = index_data["processed_files"][-20:]

            # Save updated index
            with open(index_file, 'w', encoding='utf-8') as f:
                json.dump(index_data, f, indent=2, ensure_ascii=False)

            console.print(
                f"\\n📊 [green]Entity index updated:[/green] {index_file}")
            console.print(
                f"   📈 Total processed files: {index_data['total_processed_files']}")
            console.print(
                f"   🔍 Total extracted entities: {index_data['total_extracted_entities']}")
            console.print(
                f"   ✅ Total matched entities: {index_data['total_matched_entities']}")

        except Exception as e:
            logger.error(f"Failed to update entity index: {e}")
            console.print(
                f"⚠️ [yellow]Could not update entity index: {e}[/yellow]")


def process_summary_file_interactive(summary_file_path: str, video_id: str, interactive: bool = True) -> Dict[str, Any]:
    """
    Main entry point for entity processing
    Called after saving to @packages/knowledge-base/
    """
    processor = InteractiveEntityProcessor()
    return processor.process_summary_file(summary_file_path, video_id, interactive)


if __name__ == "__main__":
    # Test with an existing summary file
    test_summary = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/sources/transcripts/2025-01-31/WGUb1JKxBDo/exPentagonOfficialConfirmsAlienLanguageExistsLueElizondoDebriefedEp24Summary.txt"

    if os.path.exists(test_summary):
        results = process_summary_file_interactive(test_summary, "WGUb1JKxBDo")
        print(f"\nProcessing complete: {results}")
    else:
        print(f"Test file not found: {test_summary}")
