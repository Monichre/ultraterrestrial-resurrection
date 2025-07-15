#!/usr/bin/env python3
"""
Entity Processor UI - Primary terminal interface for entity extraction and search
Built with Textual for a modern CLI experience
Date: June 25, 2025
"""

import os
import sys
import asyncio
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path

from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, Vertical, ScrollableContainer
from textual.widgets import (
    Header, Footer, Static, DataTable, Button, Log, 
    ProgressBar, Label, Checkbox, TabbedContent, TabPane,
    Tree, LoadingIndicator, Input
)
from textual.binding import Binding
from textual.worker import Worker, get_current_worker
from textual.message import Message
from textual import work
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import our entity processing components
from ...agents.entity_extraction_agent import EntityExtractionAgent
try:
    from ...xata_search import search_record_for_analysis
    XATA_AVAILABLE = True
except Exception:
    XATA_AVAILABLE = False
    def search_record_for_analysis(*args, **kwargs):
        return None

# Import entity creation functionality
try:
    from ..core.entity_creator import EntityCreator
    ENTITY_CREATOR_AVAILABLE = True
except Exception:
    ENTITY_CREATOR_AVAILABLE = False
    EntityCreator = None

# Import entity research queue and manager
try:
    from ...research_queue_manager import ResearchQueueManager, ResearchTask, ResearchPriority, ResearchStatus
    from ...research_manager import ResearchManager
    RESEARCH_QUEUE_AVAILABLE = True
except Exception:
    RESEARCH_QUEUE_AVAILABLE = False
    ResearchQueueManager = None
    ResearchManager = None
    ResearchTask = None
    ResearchPriority = None
    ResearchStatus = None

logger = logging.getLogger(__name__)

class EntityProcessorApp(App):
    """Beautiful TUI for Entity Processing with Xata Search"""
    
    CSS = """
    .title {
        dock: top;
        height: 3;
        background: $boost;
        color: $text;
        content-align: center middle;
    }
    
    .sidebar {
        dock: left;
        width: 30;
        background: $surface;
    }
    
    .main-content {
        background: $background;
    }
    
    .entity-table {
        height: 1fr;
        border: round $primary;
    }
    
    .search-progress {
        height: 3;
        dock: bottom;
    }
    
    .controls {
        dock: bottom;
        height: 5;
        background: $surface;
    }
    
    .status-bar {
        dock: bottom;
        height: 3;
        background: $boost;
    }
    
    Button {
        margin: 1;
    }
    
    Button.-primary {
        background: $primary;
    }
    
    Button.-success {
        background: $success;
    }
    
    Button.-warning {
        background: $warning;
    }
    
    Checkbox {
        margin: 1;
    }
    """
    
    BINDINGS = [
        Binding("q", "quit", "Quit"),
        Binding("r", "refresh", "Refresh"),
        Binding("s", "search_all", "Search All"),
        Binding("e", "extract", "Extract Entities"),
        Binding("ctrl+c", "quit", "Quit", show=False),
    ]
    
    def __init__(self, summary_file: str, video_id: str):
        super().__init__()
        self.summary_file = summary_file
        self.video_id = video_id
        self.entity_extractor = EntityExtractionAgent()
        self.entity_creator = EntityCreator() if ENTITY_CREATOR_AVAILABLE else None
        self.research_queue = ResearchQueueManager() if RESEARCH_QUEUE_AVAILABLE else None
        self.research_manager = ResearchManager(self.research_queue) if RESEARCH_QUEUE_AVAILABLE and self.research_queue else None
        self.extracted_entities = {}
        self.search_results = {}
        self.creation_results = {}
        self.entity_types = {
            'personnel': '👤 Key Figures/Personnel',
            'organizations': '🏢 Organizations', 
            'topics': '📝 Topics/Themes',
            'events': '📅 Events/Incidents',
            'locations': '📍 Locations'
        }
        
    def compose(self) -> ComposeResult:
        """Create the app layout"""
        
        # Title bar
        yield Static(
            f"🧠 Entity Processor - {Path(self.summary_file).name}",
            classes="title"
        )
        
        # Main layout
        with Horizontal():
            # Sidebar
            with Vertical(classes="sidebar"):
                yield Static("📁 File Info", markup=True)
                yield Static(f"📄 Video ID: {self.video_id}")
                yield Static(f"📝 Summary: {Path(self.summary_file).name}")
                yield Static("", id="file-status")
                
                yield Static("\n🔧 Controls", markup=True)
                yield Button("🧠 Extract Entities", id="extract-btn", classes="-primary")
                yield Button("🔍 Search All Types", id="search-all-btn", classes="-success")
                yield Button("💾 Save Results", id="save-btn", classes="-warning")
                
                yield Static("\n🆕 Entity Creation", markup=True)
                yield Button("🚀 Create Missing Entities", id="create-entities-btn", classes="-primary")
                yield Button("📊 View Creation Results", id="view-creation-btn", classes="-success")
                
                yield Static("\n📋 Research Queue", markup=True)
                yield Button("➕ Add to Research Queue", id="add-to-queue-btn", classes="-warning")
                yield Button("🧠 AI Research Analysis", id="ai-analysis-btn", classes="-success")
                yield Button("📈 Queue Statistics", id="queue-stats-btn", classes="-primary")
                
                yield Static("\n🎛️ Entity Types", markup=True)
                for entity_type, display_name in self.entity_types.items():
                    yield Checkbox(display_name, value=True, id=f"check-{entity_type}")
            
            # Main content area
            with Vertical(classes="main-content"):
                with TabbedContent():
                    # Entities tab
                    with TabPane("🔍 Extracted Entities", id="entities-tab"):
                        yield DataTable(id="entities-table", classes="entity-table")
                    
                    # Search Results tab  
                    with TabPane("🎯 Search Results", id="results-tab"):
                        yield DataTable(id="results-table", classes="entity-table")
                    
                    # Creation Results tab
                    with TabPane("🚀 Creation Results", id="creation-tab"):
                        yield DataTable(id="creation-table", classes="entity-table")
                    
                    # Research Queue tab
                    with TabPane("📋 Research Queue", id="queue-tab"):
                        yield DataTable(id="queue-table", classes="entity-table")
                    
                    # Log tab
                    with TabPane("📋 Processing Log", id="log-tab"):
                        yield Log(id="processing-log")
        
        # Status and progress
        with Container(classes="status-bar"):
            yield Label("Ready to process entities", id="status-label")
            yield ProgressBar(id="progress-bar", show_eta=False)
        
        # Footer
        yield Footer()
    
    def on_mount(self) -> None:
        """Initialize the app when mounted"""
        self.setup_tables()
        self.log_message("🚀 Entity Processor initialized")
        self.log_message(f"📁 Loading file: {self.summary_file}")
        
        # Check if Xata is available
        if XATA_AVAILABLE:
            self.log_message("✅ Xata search is available")
        else:
            self.log_message("⚠️ Xata search not available - check credentials")
    
    def setup_tables(self) -> None:
        """Setup the data tables"""
        # Entities table
        entities_table = self.query_one("#entities-table", DataTable)
        entities_table.add_columns("Entity Type", "Count", "Sample Entities")
        
        # Results table
        results_table = self.query_one("#results-table", DataTable)
        results_table.add_columns("Entity", "Status", "Xata Match", "Match Details")
        
        # Creation results table
        creation_table = self.query_one("#creation-table", DataTable)
        creation_table.add_columns("Entity Name", "Type", "Status", "Xata ID", "Created At")
        
        # Research queue table
        queue_table = self.query_one("#queue-table", DataTable)
        queue_table.add_columns("Entity Name", "Type", "Priority", "Status", "Created", "Notes")
    
    def log_message(self, message: str) -> None:
        """Add a message to the processing log"""
        log = self.query_one("#processing-log", Log)
        log.write_line(message)
    
    def update_status(self, message: str) -> None:
        """Update the status label"""
        status_label = self.query_one("#status-label", Label)
        status_label.update(message)
    
    @work(exclusive=True)
    async def extract_entities_worker(self) -> None:
        """Worker to extract entities from the summary file"""
        try:
            self.update_status("🧠 Extracting entities...")
            progress = self.query_one("#progress-bar", ProgressBar)
            progress.update(progress=0)
            
            # Read the summary file
            with open(self.summary_file, 'r', encoding='utf-8') as f:
                summary_content = f.read()
            
            self.log_message(f"📖 Read {len(summary_content)} characters from summary")
            progress.update(progress=25)
            
            # Extract entities
            self.log_message("🔍 Extracting entities with AI...")
            self.extracted_entities = self.entity_extractor.extract_entities(summary_content)
            progress.update(progress=100)
            
            # Update the entities table
            self.update_entities_table()
            
            total_entities = sum(len(entities) for entities in self.extracted_entities.values())
            self.log_message(f"✅ Extracted {total_entities} total entities")
            self.update_status(f"✅ Extracted {total_entities} entities")
            
        except Exception as e:
            self.log_message(f"❌ Entity extraction failed: {e}")
            self.update_status("❌ Entity extraction failed")
    
    def update_entities_table(self) -> None:
        """Update the entities table with extracted data"""
        entities_table = self.query_one("#entities-table", DataTable)
        entities_table.clear()
        
        for entity_type, entities in self.extracted_entities.items():
            if entities:
                display_name = self.entity_types.get(entity_type, entity_type.title())
                count = len(entities)
                sample = ", ".join(entities[:3])
                if len(entities) > 3:
                    sample += f" ... (+{len(entities) - 3} more)"
                
                entities_table.add_row(display_name, str(count), sample)
    
    @work(exclusive=True)
    async def search_entities_worker(self) -> None:
        """Worker to search entities in Xata database"""
        if not XATA_AVAILABLE:
            self.log_message("❌ Xata search not available")
            return
        
        if not self.extracted_entities:
            self.log_message("❌ No entities to search - extract entities first")
            return
        
        try:
            self.update_status("🔍 Searching Xata database...")
            progress = self.query_one("#progress-bar", ProgressBar)
            
            # Count total entities to search
            total_entities = sum(len(entities) for entities in self.extracted_entities.values())
            processed = 0
            
            self.search_results = {}
            
            for entity_type, entities in self.extracted_entities.items():
                if not entities:
                    continue
                
                # Check if this entity type is selected
                checkbox = self.query_one(f"#check-{entity_type}", Checkbox)
                if not checkbox.value:
                    self.log_message(f"⏭️ Skipping {entity_type} (unchecked)")
                    processed += len(entities)
                    continue
                
                self.log_message(f"🔍 Searching {len(entities)} {entity_type}...")
                self.search_results[entity_type] = []
                
                # Map entity types to Xata tables
                table_mapping = {
                    'personnel': 'personnel',
                    'organizations': 'organizations',
                    'topics': 'topics',
                    'events': 'events',
                    'locations': 'locations'
                }
                
                xata_table = table_mapping.get(entity_type, entity_type)
                
                for entity_name in entities:
                    # Search in Xata
                    match = search_record_for_analysis(
                        analysis_text=entity_name,
                        table_name=xata_table,
                        search_field='name'
                    )
                    
                    if match:
                        self.search_results[entity_type].append({
                            'entity_name': entity_name,
                            'status': 'found',
                            'xata_record': match,
                            'xata_id': match.get('id'),
                            'table': xata_table
                        })
                        self.log_message(f"  ✅ {entity_name} -> {match.get('name', 'Unknown')}")
                    else:
                        self.search_results[entity_type].append({
                            'entity_name': entity_name,
                            'status': 'not_found',
                            'table': xata_table,
                            'action_needed': 'create_new'
                        })
                        self.log_message(f"  ❌ {entity_name} (not found)")
                    
                    processed += 1
                    progress.update(progress=(processed / total_entities) * 100)
            
            # Update results table
            self.update_results_table()
            
            total_matches = sum(
                len([r for r in results if r['status'] == 'found'])
                for results in self.search_results.values()
            )
            
            self.log_message(f"✅ Search complete: {total_matches} matches found")
            self.update_status(f"✅ Found {total_matches} matches")
            
        except Exception as e:
            self.log_message(f"❌ Search failed: {e}")
            self.update_status("❌ Search failed")
    
    def update_results_table(self) -> None:
        """Update the results table with search data"""
        results_table = self.query_one("#results-table", DataTable)
        results_table.clear()
        
        for entity_type, results in self.search_results.items():
            for result in results:
                entity_name = result['entity_name']
                status = "✅ Found" if result['status'] == 'found' else "❌ Not Found"
                
                if result['status'] == 'found':
                    xata_record = result.get('xata_record', {})
                    match_name = xata_record.get('name', 'Unknown')
                    match_details = f"ID: {result.get('xata_id', 'Unknown')}"
                else:
                    match_name = "—"
                    match_details = "Not in database"
                
                results_table.add_row(entity_name, status, match_name, match_details)
    
    # Event handlers
    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle button presses"""
        if event.button.id == "extract-btn":
            self.extract_entities_worker()
        elif event.button.id == "search-all-btn":
            self.search_entities_worker()
        elif event.button.id == "save-btn":
            self.save_results()
        elif event.button.id == "create-entities-btn":
            self.create_entities_worker()
        elif event.button.id == "view-creation-btn":
            self.view_creation_results()
        elif event.button.id == "add-to-queue-btn":
            self.add_to_research_queue_worker()
        elif event.button.id == "ai-analysis-btn":
            self.ai_research_analysis_worker()
        elif event.button.id == "queue-stats-btn":
            self.show_queue_statistics()
    
    def action_extract(self) -> None:
        """Extract entities action"""
        self.extract_entities_worker()
    
    def action_search_all(self) -> None:
        """Search all entities action"""
        self.search_entities_worker()
    
    def action_refresh(self) -> None:
        """Refresh the display"""
        self.update_entities_table()
        self.update_results_table()
        self.update_creation_table()
        self.update_queue_table()
        self.log_message("🔄 Display refreshed")
    
    @work(exclusive=True)
    async def create_entities_worker(self) -> None:
        """Worker to create missing entities using EntityCreator"""
        if not ENTITY_CREATOR_AVAILABLE:
            self.log_message("❌ EntityCreator not available")
            return
        
        if not self.entity_creator:
            self.log_message("❌ EntityCreator not initialized")
            return
        
        if not self.search_results:
            self.log_message("❌ No search results to process - search entities first")
            return
        
        try:
            self.update_status("🚀 Creating missing entities...")
            progress = self.query_one("#progress-bar", ProgressBar)
            progress.update(progress=0)
            
            # Count entities that need creation
            entities_to_create = 0
            for entity_type, results in self.search_results.items():
                entities_to_create += len([
                    r for r in results 
                    if r.get('status') == 'not_found' and r.get('action_needed') == 'create_new'
                ])
            
            if entities_to_create == 0:
                self.log_message("ℹ️ No entities marked for creation")
                self.update_status("No entities to create")
                return
            
            self.log_message(f"🔍 Found {entities_to_create} entities marked for creation")
            progress.update(progress=25)
            
            # Create entities using EntityCreator
            self.log_message("🚀 Starting entity creation process...")
            self.creation_results = await self.entity_creator.create_missing_entities(self.search_results)
            progress.update(progress=75)
            
            # Update creation results table
            self.update_creation_table()
            progress.update(progress=100)
            
            # Show summary
            stats = self.creation_results.get("statistics", {})
            total_created = stats.get("total_created", 0)
            total_failed = stats.get("total_failed", 0)
            
            self.log_message(f"✅ Entity creation complete!")
            self.log_message(f"   - Created: {total_created} entities")
            self.log_message(f"   - Failed: {total_failed} entities")
            
            if self.creation_results.get("errors"):
                self.log_message("⚠️ Errors encountered during creation:")
                for error in self.creation_results["errors"]:
                    self.log_message(f"   - {error}")
            
            self.update_status(f"✅ Created {total_created} entities")
            
        except Exception as e:
            self.log_message(f"❌ Entity creation failed: {e}")
            self.update_status("❌ Entity creation failed")
    
    def update_creation_table(self) -> None:
        """Update the creation results table with creation data"""
        creation_table = self.query_one("#creation-table", DataTable)
        creation_table.clear()
        
        if not self.creation_results:
            return
        
        # Add successful creations
        for entity_type, created_entities in self.creation_results.get("created_entities", {}).items():
            for entity in created_entities:
                creation_table.add_row(
                    entity["entity_name"],
                    entity_type.title(),
                    "✅ Created",
                    entity.get("xata_id", "Unknown"),
                    entity.get("created_at", "Unknown")
                )
        
        # Add failed creations
        for entity_type, failed_entities in self.creation_results.get("failed_creations", {}).items():
            for entity in failed_entities:
                creation_table.add_row(
                    entity["entity_name"],
                    entity_type.title(),
                    "❌ Failed",
                    "—",
                    entity.get("error", "Unknown error")
                )
    
    def view_creation_results(self) -> None:
        """Switch to creation results tab and show summary"""
        if not self.creation_results:
            self.log_message("ℹ️ No creation results available - create entities first")
            return
        
        # Switch to creation tab
        tabbed_content = self.query_one(TabbedContent)
        tabbed_content.active = "creation-tab"
        
        # Log summary
        stats = self.creation_results.get("statistics", {})
        self.log_message("📊 Creation Results Summary:")
        self.log_message(f"   - Total processed: {stats.get('total_processed', 0)}")
        self.log_message(f"   - Total created: {stats.get('total_created', 0)}")
        self.log_message(f"   - Total failed: {stats.get('total_failed', 0)}")
        
        # Show breakdown by entity type
        for entity_type, created in self.creation_results.get("created_entities", {}).items():
            if created:
                self.log_message(f"   - {entity_type}: {len(created)} created")
        
        for entity_type, failed in self.creation_results.get("failed_creations", {}).items():
            if failed:
                self.log_message(f"   - {entity_type}: {len(failed)} failed")
    
    @work(exclusive=True)
    async def add_to_research_queue_worker(self) -> None:
        """Worker to add not_found entities to research queue"""
        if not RESEARCH_QUEUE_AVAILABLE or not self.research_queue:
            self.log_message("❌ Research Queue not available")
            return
        
        if not self.search_results:
            self.log_message("❌ No search results to process - search entities first")
            return
        
        try:
            self.update_status("📋 Adding entities to research queue...")
            progress = self.query_one("#progress-bar", ProgressBar)
            progress.update(progress=0)
            
            # Count entities that need research
            entities_to_queue = 0
            for entity_type, results in self.search_results.items():
                entities_to_queue += len([
                    r for r in results 
                    if r.get('status') == 'not_found'
                ])
            
            if entities_to_queue == 0:
                self.log_message("ℹ️ No entities marked for research queue")
                self.update_status("No entities to queue")
                return
            
            self.log_message(f"📋 Found {entities_to_queue} entities to add to research queue")
            progress.update(progress=25)
            
            # Add entities to research queue
            added_count = 0
            for entity_type, results in self.search_results.items():
                for result in results:
                    if result.get('status') == 'not_found':
                        entity_name = result.get('entity_name', '')
                        
                        # Determine priority based on entity type and confidence
                        if entity_type in ['personnel', 'organizations', 'events']:
                            priority = ResearchPriority.HIGH
                        elif entity_type in ['topics']:
                            priority = ResearchPriority.MEDIUM
                        else:
                            priority = ResearchPriority.LOW
                        
                        # Add to research queue
                        task = await self.research_queue.add_research_task(
                            entity_name=entity_name,
                            entity_type=entity_type,
                            priority=priority,
                            source_context=f"Extracted from video {self.video_id}",
                            disclosure_relevance="Entity identified but not found in database - requires research",
                            video_id=self.video_id,
                            extraction_session=f"extraction_{self.video_id}"
                        )
                        
                        if task:
                            added_count += 1
                            self.log_message(f"  ✅ Added {entity_name} ({entity_type}) to research queue")
            
            progress.update(progress=75)
            
            # Update queue table
            self.update_queue_table()
            progress.update(progress=100)
            
            self.log_message(f"✅ Research queue update complete!")
            self.log_message(f"   - Added: {added_count} entities")
            self.update_status(f"✅ Added {added_count} entities to research queue")
            
        except Exception as e:
            self.log_message(f"❌ Research queue update failed: {e}")
            self.update_status("❌ Research queue update failed")
    
    @work(exclusive=True)
    async def ai_research_analysis_worker(self) -> None:
        """Worker to get AI analysis of research priorities"""
        if not RESEARCH_QUEUE_AVAILABLE or not self.research_manager:
            self.log_message("❌ Research Manager not available")
            return
        
        try:
            self.update_status("🧠 Running AI research analysis...")
            progress = self.query_one("#progress-bar", ProgressBar)
            progress.update(progress=0)
            
            # Generate research briefing
            self.log_message("🧠 Generating research briefing...")
            progress.update(progress=25)
            
            briefing = await self.research_manager.generate_research_briefing()
            progress.update(progress=50)
            
            # Get priority actions
            self.log_message("📋 Analyzing research priorities...")
            actions = await self.research_manager.analyze_research_priorities()
            progress.update(progress=75)
            
            # Display results
            self.log_message("📄 Research Briefing:")
            for line in briefing.split('\n'):
                if line.strip():
                    self.log_message(f"   {line}")
            
            if actions:
                self.log_message(f"\n📋 Priority Actions ({len(actions)}):")
                for i, action in enumerate(actions[:5], 1):
                    self.log_message(f"   {i}. {action.entity_name}: {action.action}")
                    self.log_message(f"      {action.reasoning}")
                    self.log_message(f"      Timeline: {action.timeline}")
            
            progress.update(progress=100)
            self.update_status("✅ AI research analysis complete")
            
        except Exception as e:
            self.log_message(f"❌ AI research analysis failed: {e}")
            self.update_status("❌ AI research analysis failed")
    
    def update_queue_table(self) -> None:
        """Update the research queue table with current queue data"""
        queue_table = self.query_one("#queue-table", DataTable)
        queue_table.clear()
        
        if not RESEARCH_QUEUE_AVAILABLE or not self.research_queue:
            return
        
        # Get current tasks
        for task in self.research_queue.tasks.values():
            created_date = task.created_at[:10] if task.created_at else "Unknown"
            notes = task.research_notes[:50] + "..." if len(task.research_notes) > 50 else task.research_notes
            
            queue_table.add_row(
                task.entity_name,
                task.entity_type.title(),
                task.priority.value.title(),
                task.status.value.title(),
                created_date,
                notes or "—"
            )
    
    def show_queue_statistics(self) -> None:
        """Show research queue statistics"""
        if not RESEARCH_QUEUE_AVAILABLE or not self.research_queue:
            self.log_message("❌ Research Queue not available")
            return
        
        # Switch to queue tab
        tabbed_content = self.query_one(TabbedContent)
        tabbed_content.active = "queue-tab"
        
        # Get and display statistics
        stats = self.research_queue.get_queue_stats()
        
        self.log_message("📊 Research Queue Statistics:")
        self.log_message(f"   - Total tasks: {stats['total_tasks']}")
        self.log_message(f"   - Upstash enabled: {stats['upstash_enabled']}")
        self.log_message(f"   - AI enabled: {stats['ai_enabled']}")
        
        self.log_message("   Priority breakdown:")
        for priority, count in stats['priority_breakdown'].items():
            if count > 0:
                self.log_message(f"     - {priority.title()}: {count}")
        
        self.log_message("   Status breakdown:")
        for status, count in stats['status_breakdown'].items():
            if count > 0:
                self.log_message(f"     - {status.title()}: {count}")
        
        self.log_message("   Entity type breakdown:")
        for entity_type, count in stats['entity_type_breakdown'].items():
            if count > 0:
                self.log_message(f"     - {entity_type.title()}: {count}")
        
        # Update the queue table
        self.update_queue_table()
    
    def save_results(self) -> None:
        """Save the processing results"""
        try:
            # Create results structure
            results = {
                "status": "completed",
                "video_id": self.video_id,
                "summary_file": self.summary_file,
                "entities": self.extracted_entities,
                "xata_search_results": self.search_results,
                "entity_creation_results": self.creation_results,
                "research_queue_stats": self.research_queue.get_queue_stats() if self.research_queue else {},
                "total_entities": sum(len(entities) for entities in self.extracted_entities.values()),
                "total_matches": sum(
                    len([r for r in results if r['status'] == 'found'])
                    for results in self.search_results.values()
                ),
                "total_created": self.creation_results.get("statistics", {}).get("total_created", 0) if self.creation_results else 0
            }
            
            # Save to video folder
            summary_path = Path(self.summary_file)
            results_file = summary_path.parent / "entity_processing_results.json"
            
            import json
            with open(results_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            
            self.log_message(f"💾 Results saved to: {results_file}")
            self.update_status(f"💾 Results saved")
            
        except Exception as e:
            self.log_message(f"❌ Save failed: {e}")
            self.update_status("❌ Save failed")


def run_textual_entity_processor(summary_file: str, video_id: str) -> Dict[str, Any]:
    """
    Run the Textual-based entity processor
    Returns the processing results
    """
    app = EntityProcessorApp(summary_file, video_id)
    app.run()
    
    # Return results (would need to be stored in app state)
    return {
        "status": "completed",
        "entities": app.extracted_entities,
        "search_results": app.search_results
    }


if __name__ == "__main__":
    # Test with existing file
    test_summary = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/transcripts/2025-01-31/WGUb1JKxBDo/exPentagonOfficialConfirmsAlienLanguageExistsLueElizondoDebriefedEp24Summary.txt"
    
    if os.path.exists(test_summary):
        run_textual_entity_processor(test_summary, "WGUb1JKxBDo")
    else:
        print(f"Test file not found: {test_summary}")