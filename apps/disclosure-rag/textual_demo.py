#!/usr/bin/env python3
"""
Textual Demo - Beautiful Entity Processing TUI
A demo of what the full interface would look like
Date: June 25, 2025
"""

from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, Vertical
from textual.widgets import (
    Header, Footer, Static, DataTable, Button, Log, 
    ProgressBar, Label, Checkbox, TabbedContent, TabPane
)
from textual.binding import Binding
from textual import work
from rich.text import Text


class EntityProcessorDemo(App):
    """Demo of Beautiful TUI for Entity Processing"""
    
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
        border: round $primary;
    }
    
    .main-content {
        background: $background;
    }
    
    .entity-table {
        height: 1fr;
        border: round $primary;
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
        Binding("e", "extract", "Extract"),
        Binding("s", "search", "Search"),
        Binding("ctrl+c", "quit", "Quit", show=False),
    ]
    
    def __init__(self):
        super().__init__()
        self.sample_entities = {
            'personnel': ['Lou Elizondo', 'David Spergel', 'Chris Mellon'],
            'organizations': ['NASA', 'Department of Defense', 'AATIP'],
            'topics': ['Underwater UAP Activity', 'Project Interloper', 'Government/Military Response'],
            'events': ['Navy Helicopter Incident', 'Congressional Hearing'],
            'locations': ['Caribbean', 'Puerto Rico', 'Pentagon']
        }
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
            Text("🧠 Entity Processor - WSJ UFO Analysis Demo", style="bold cyan"),
            classes="title"
        )
        
        # Main layout
        with Horizontal():
            # Sidebar
            with Vertical(classes="sidebar"):
                yield Static("📁 File Info", markup=True)
                yield Static("📄 Video ID: h0hAit-KH9A")
                yield Static("📝 Summary: theWallStreetJournalIsLyingAboutUfosSummary.txt")
                yield Static("✅ Xata: Connected", id="xata-status")
                
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
            yield Label("Demo Mode - Entity Processor Ready", id="status-label")
            yield ProgressBar(id="progress-bar", show_eta=False)
        
        # Footer
        yield Footer()
    
    def on_mount(self) -> None:
        """Initialize the app when mounted"""
        self.setup_tables()
        self.load_sample_data()
        self.log_message("🚀 Entity Processor Demo initialized")
        self.log_message("📁 Sample file: theWallStreetJournalIsLyingAboutUfosSummary.txt")
        self.log_message("✅ Xata search is available")
        self.log_message("🎯 Demo shows real entity extraction and search results")
    
    def setup_tables(self) -> None:
        """Setup the data tables"""
        # Entities table
        entities_table = self.query_one("#entities-table", DataTable)
        entities_table.add_columns("Entity Type", "Count", "Sample Entities")
        
        # Results table
        results_table = self.query_one("#results-table", DataTable)
        results_table.add_columns("Entity", "Status", "Xata Match", "Match Score")
    
    def load_sample_data(self) -> None:
        """Load sample data to show the interface"""
        # Populate entities table
        entities_table = self.query_one("#entities-table", DataTable)
        for entity_type, entities in self.sample_entities.items():
            display_name = self.entity_types.get(entity_type, entity_type.title())
            count = len(entities)
            sample = ", ".join(entities[:2])
            if len(entities) > 2:
                sample += f" ... (+{len(entities) - 2} more)"
            
            entities_table.add_row(display_name, str(count), sample)
        
        # Populate results table with sample search results
        results_table = self.query_one("#results-table", DataTable)
        sample_results = [
            ("Lou Elizondo", "✅ Found", "Luis Elizondo", "6.04"),
            ("NASA", "✅ Found", "NASA (National Aeronautics...)", "8.91"),
            ("Project Interloper", "✅ Found", "Project Interloper", "9.12"),
            ("David Spergel", "✅ Found", "David Fravor", "4.23"),
            ("Government secrets", "❌ Not Found", "—", "—"),
            ("Underwater UAP Activity", "✅ Found", "USO Sightings", "5.67")
        ]
        
        for entity, status, match, score in sample_results:
            results_table.add_row(entity, status, match, score)
    
    def log_message(self, message: str) -> None:
        """Add a message to the processing log"""
        log = self.query_one("#processing-log", Log)
        log.write_line(message)
    
    def update_status(self, message: str) -> None:
        """Update the status label"""
        status_label = self.query_one("#status-label", Label)
        status_label.update(message)
    
    @work(exclusive=True)
    async def demo_extract(self) -> None:
        """Demo entity extraction"""
        self.update_status("🧠 Extracting entities...")
        progress = self.query_one("#progress-bar", ProgressBar)
        
        import asyncio
        
        # Simulate processing steps
        steps = [
            (25, "📖 Reading summary file..."),
            (50, "🔍 Analyzing content with AI..."),
            (75, "🧠 Extracting named entities..."),
            (100, "✅ Entity extraction complete!")
        ]
        
        for progress_val, msg in steps:
            self.log_message(msg)
            progress.update(progress=progress_val)
            await asyncio.sleep(0.5)
        
        total_entities = sum(len(entities) for entities in self.sample_entities.values())
        self.update_status(f"✅ Extracted {total_entities} entities")
    
    @work(exclusive=True) 
    async def demo_search(self) -> None:
        """Demo Xata search"""
        self.update_status("🔍 Searching Xata database...")
        progress = self.query_one("#progress-bar", ProgressBar)
        
        import asyncio
        
        # Simulate searching each entity type
        for i, (entity_type, entities) in enumerate(self.sample_entities.items()):
            display_name = self.entity_types.get(entity_type, entity_type)
            self.log_message(f"🔍 Searching {len(entities)} {display_name}...")
            
            for j, entity in enumerate(entities):
                if j < 2:  # Simulate finding first 2
                    self.log_message(f"  ✅ {entity} -> Found match")
                else:  # Others not found
                    self.log_message(f"  ❌ {entity} -> No match")
                await asyncio.sleep(0.2)
            
            progress.update(progress=((i + 1) / len(self.sample_entities)) * 100)
        
        self.log_message("✅ Search complete: 8/16 matches found")
        self.update_status("✅ Found 8 matches")
    
    # Event handlers
    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle button presses"""
        if event.button.id == "extract-btn":
            self.demo_extract()
        elif event.button.id == "search-all-btn":
            self.demo_search()
        elif event.button.id == "save-btn":
            self.log_message("💾 Results saved to entity_processing_results.json")
            self.update_status("💾 Results saved")
    
    def action_extract(self) -> None:
        """Extract entities action (E key)"""
        self.demo_extract()
    
    def action_search(self) -> None:
        """Search entities action (S key)"""
        self.demo_search()


if __name__ == "__main__":
    app = EntityProcessorDemo()
    app.run()