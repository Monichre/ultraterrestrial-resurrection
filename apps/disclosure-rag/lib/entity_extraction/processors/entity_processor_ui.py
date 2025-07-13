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
        self.log_message("🔄 Display refreshed")
    
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
                "total_entities": sum(len(entities) for entities in self.extracted_entities.values()),
                "total_matches": sum(
                    len([r for r in results if r['status'] == 'found'])
                    for results in self.search_results.values()
                )
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