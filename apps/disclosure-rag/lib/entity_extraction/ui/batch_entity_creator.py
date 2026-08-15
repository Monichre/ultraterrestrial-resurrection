#!/usr/bin/env python3
"""
Batch Entity Creator UI - Review and approval system for bulk entity creation
Provides detailed review interface with confidence filtering and manual approval
Date: July 13, 2025
"""

import os
import sys
import asyncio
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path
from datetime import datetime

from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, Vertical, ScrollableContainer
from textual.widgets import (
    Header, Footer, Static, DataTable, Button, Log, 
    ProgressBar, Label, Checkbox, TabbedContent, TabPane,
    Tree, LoadingIndicator, Input, Select, TextArea
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
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Import our entity processing components
try:
    from ..core.entity_creator import EntityCreator
    from ...research_queue_manager import ResearchQueueManager, ResearchPriority
    from ...research_manager import ResearchManager
    COMPONENTS_AVAILABLE = True
except Exception as e:
    COMPONENTS_AVAILABLE = False
    print(f"Components not available: {e}")

logger = logging.getLogger(__name__)

class BatchEntityCreatorApp(App):
    """Interactive batch entity creation with review and approval system"""
    
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
        width: 35;
        background: $surface;
    }
    
    .main-content {
        background: $background;
    }
    
    .entity-table {
        height: 1fr;
        border: round $primary;
    }
    
    .controls {
        dock: bottom;
        height: 8;
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
    
    Button.-danger {
        background: $error;
    }
    
    Checkbox {
        margin: 1;
    }
    
    Select {
        margin: 1;
    }
    """
    
    BINDINGS = [
        Binding("q", "quit", "Quit"),
        Binding("r", "refresh", "Refresh"),
        Binding("a", "approve_all", "Approve All"),
        Binding("c", "create_approved", "Create Approved"),
        Binding("ctrl+c", "quit", "Quit", show=False),
    ]
    
    def __init__(self, search_results: Dict[str, List[Dict[str, Any]]], source_context: str = ""):
        super().__init__()
        self.search_results = search_results
        self.source_context = source_context
        self.entity_creator = EntityCreator() if COMPONENTS_AVAILABLE else None
        self.research_queue = ResearchQueueManager() if COMPONENTS_AVAILABLE else None
        self.research_manager = ResearchManager(self.research_queue) if COMPONENTS_AVAILABLE and self.research_queue else None
        
        # Processing state
        self.entity_review_data = {}  # Track review decisions
        self.creation_results = {}
        self.approval_stats = {"total": 0, "approved": 0, "rejected": 0, "pending": 0}
        
        # Initialize review data
        self._initialize_review_data()
    
    def _initialize_review_data(self):
        """Initialize entity review data structure"""
        for entity_type, results in self.search_results.items():
            self.entity_review_data[entity_type] = []
            for result in results:
                if result.get('status') == 'not_found' and result.get('action_needed') == 'create_new':
                    review_item = {
                        'entity_name': result.get('entity_name', ''),
                        'entity_type': entity_type,
                        'confidence': result.get('confidence', 0.0),
                        'source_context': self.source_context,
                        'approval_status': 'pending',  # pending, approved, rejected
                        'review_notes': '',
                        'priority': self._determine_priority(entity_type, result.get('confidence', 0.0)),
                        'auto_approved': False,
                        'manual_review_required': result.get('confidence', 0.0) < 0.7
                    }
                    self.entity_review_data[entity_type].append(review_item)
                    self.approval_stats["total"] += 1
                    self.approval_stats["pending"] += 1
    
    def _determine_priority(self, entity_type: str, confidence: float) -> str:
        """Determine priority based on entity type and confidence"""
        if confidence >= 0.9 and entity_type in ['personnel', 'organizations', 'events']:
            return 'high'
        elif confidence >= 0.7 and entity_type in ['personnel', 'organizations']:
            return 'high'
        elif confidence >= 0.6:
            return 'medium'
        else:
            return 'low'
    
    def compose(self) -> ComposeResult:
        """Create the app layout"""
        
        # Title bar
        yield Static(
            f"🔍 Batch Entity Creator - Review & Approval",
            classes="title"
        )
        
        # Main layout
        with Horizontal():
            # Sidebar
            with Vertical(classes="sidebar"):
                yield Static("📊 Approval Statistics", markup=True)
                yield Static("", id="stats-display")
                
                yield Static("\n⚙️ Batch Controls", markup=True)
                yield Button("✅ Auto-Approve High Confidence", id="auto-approve-btn", classes="-success")
                yield Button("👀 Review Required Only", id="review-filter-btn", classes="-warning")
                yield Button("🔄 Reset All Approvals", id="reset-btn", classes="-danger")
                
                yield Static("\n🎛️ Filters", markup=True)
                yield Static("Confidence Threshold:")
                yield Select([
                    ("All Entities", "all"),
                    ("High Confidence (>0.8)", "high"),
                    ("Medium Confidence (0.6-0.8)", "medium"),
                    ("Low Confidence (<0.6)", "low"),
                    ("Manual Review Required", "manual")
                ], value="all", id="confidence-filter")
                
                yield Static("Entity Type:")
                yield Select([
                    ("All Types", "all"),
                    ("Personnel", "personnel"),
                    ("Organizations", "organizations"),
                    ("Events", "events"),
                    ("Topics", "topics"),
                    ("Locations", "locations")
                ], value="all", id="type-filter")
                
                yield Static("\n🚀 Actions", markup=True)
                yield Button("📋 Create Approved Entities", id="create-btn", classes="-primary")
                yield Button("🧠 AI Review Analysis", id="ai-review-btn", classes="-success")
                yield Button("💾 Save Review Session", id="save-btn", classes="-warning")
            
            # Main content area
            with Vertical(classes="main-content"):
                with TabbedContent():
                    # Review Queue tab
                    with TabPane("📝 Review Queue", id="review-tab"):
                        yield DataTable(id="review-table", classes="entity-table")
                    
                    # Creation Results tab
                    with TabPane("🚀 Creation Results", id="results-tab"):
                        yield DataTable(id="results-table", classes="entity-table")
                    
                    # AI Analysis tab
                    with TabPane("🧠 AI Analysis", id="analysis-tab"):
                        yield ScrollableContainer(
                            Static("", id="ai-analysis-content"),
                            classes="entity-table"
                        )
                    
                    # Log tab
                    with TabPane("📋 Processing Log", id="log-tab"):
                        yield Log(id="processing-log")
        
        # Controls area
        with Container(classes="controls"):
            yield Static("Entity Review Controls", markup=True)
            with Horizontal():
                yield Button("✅ Approve Selected", id="approve-selected-btn", classes="-success")
                yield Button("❌ Reject Selected", id="reject-selected-btn", classes="-danger")
                yield Button("📝 Add Review Notes", id="add-notes-btn", classes="-warning")
                yield Static("Notes:", classes="notes-label")
                yield Input(placeholder="Review notes...", id="review-notes-input")
        
        # Status and progress
        with Container(classes="status-bar"):
            yield Label("Ready to review entities for creation", id="status-label")
            yield ProgressBar(id="progress-bar", show_eta=False)
        
        # Footer
        yield Footer()
    
    def on_mount(self) -> None:
        """Initialize the app when mounted"""
        self.setup_tables()
        self.update_review_table()
        self.update_stats_display()
        self.log_message("🔍 Batch Entity Creator initialized")
        self.log_message(f"📊 Found {self.approval_stats['total']} entities requiring review")
        
        if not COMPONENTS_AVAILABLE:
            self.log_message("⚠️ Entity creation components not available")
    
    def setup_tables(self) -> None:
        """Setup the data tables"""
        # Review table
        review_table = self.query_one("#review-table", DataTable)
        review_table.add_columns("☑", "Entity Name", "Type", "Confidence", "Priority", "Status", "Notes")
        
        # Results table
        results_table = self.query_one("#results-table", DataTable)
        results_table.add_columns("Entity Name", "Type", "Status", "Xata ID", "Created At", "Error")
    
    def log_message(self, message: str) -> None:
        """Add a message to the processing log"""
        log = self.query_one("#processing-log", Log)
        log.write_line(message)
    
    def update_status(self, message: str) -> None:
        """Update the status label"""
        status_label = self.query_one("#status-label", Label)
        status_label.update(message)
    
    def update_stats_display(self) -> None:
        """Update the statistics display"""
        stats_display = self.query_one("#stats-display", Static)
        stats_text = f"""
Total: {self.approval_stats['total']}
✅ Approved: {self.approval_stats['approved']}
❌ Rejected: {self.approval_stats['rejected']}
⏳ Pending: {self.approval_stats['pending']}

Approval Rate: {(self.approval_stats['approved'] / max(1, self.approval_stats['total'])) * 100:.1f}%
        """
        stats_display.update(stats_text.strip())
    
    def update_review_table(self) -> None:
        """Update the review table with entity data"""
        review_table = self.query_one("#review-table", DataTable)
        review_table.clear()
        
        # Get filter values
        confidence_filter = self.query_one("#confidence-filter", Select).value
        type_filter = self.query_one("#type-filter", Select).value
        
        for entity_type, items in self.entity_review_data.items():
            # Apply type filter
            if type_filter != "all" and entity_type != type_filter:
                continue
            
            for item in items:
                # Apply confidence filter
                confidence = item['confidence']
                if confidence_filter == "high" and confidence <= 0.8:
                    continue
                elif confidence_filter == "medium" and (confidence <= 0.6 or confidence > 0.8):
                    continue
                elif confidence_filter == "low" and confidence >= 0.6:
                    continue
                elif confidence_filter == "manual" and not item['manual_review_required']:
                    continue
                
                # Status icons
                status_icon = {
                    'pending': '⏳',
                    'approved': '✅',
                    'rejected': '❌'
                }.get(item['approval_status'], '⏳')
                
                # Priority colors
                priority_display = {
                    'high': '🔴 High',
                    'medium': '🟡 Medium',
                    'low': '🟢 Low'
                }.get(item['priority'], '🟢 Low')
                
                review_table.add_row(
                    "☐",  # Checkbox placeholder
                    item['entity_name'],
                    item['entity_type'].title(),
                    f"{confidence:.2f}",
                    priority_display,
                    f"{status_icon} {item['approval_status'].title()}",
                    item['review_notes'][:30] + "..." if len(item['review_notes']) > 30 else item['review_notes']
                )
    
    def update_results_table(self) -> None:
        """Update the results table with creation results"""
        results_table = self.query_one("#results-table", DataTable)
        results_table.clear()
        
        if not self.creation_results:
            return
        
        # Add successful creations
        for entity_type, created_entities in self.creation_results.get("created_entities", {}).items():
            for entity in created_entities:
                results_table.add_row(
                    entity["entity_name"],
                    entity_type.title(),
                    "✅ Created",
                    entity.get("xata_id", "Unknown"),
                    entity.get("created_at", "Unknown"),
                    "—"
                )
        
        # Add failed creations
        for entity_type, failed_entities in self.creation_results.get("failed_creations", {}).items():
            for entity in failed_entities:
                results_table.add_row(
                    entity["entity_name"],
                    entity_type.title(),
                    "❌ Failed",
                    "—",
                    "—",
                    entity.get("error", "Unknown error")
                )
    
    # Event handlers
    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle button presses"""
        if event.button.id == "auto-approve-btn":
            self.auto_approve_high_confidence()
        elif event.button.id == "review-filter-btn":
            self.filter_manual_review_required()
        elif event.button.id == "reset-btn":
            self.reset_all_approvals()
        elif event.button.id == "create-btn":
            self.create_approved_entities_worker()
        elif event.button.id == "ai-review-btn":
            self.ai_review_analysis_worker()
        elif event.button.id == "save-btn":
            self.save_review_session()
        elif event.button.id == "approve-selected-btn":
            self.approve_selected_entities()
        elif event.button.id == "reject-selected-btn":
            self.reject_selected_entities()
        elif event.button.id == "add-notes-btn":
            self.add_review_notes()
    
    def on_select_changed(self, event: Select.Changed) -> None:
        """Handle select changes"""
        self.update_review_table()
    
    def auto_approve_high_confidence(self) -> None:
        """Auto-approve entities with high confidence scores"""
        approved_count = 0
        
        for entity_type, items in self.entity_review_data.items():
            for item in items:
                if item['confidence'] >= 0.8 and item['approval_status'] == 'pending':
                    item['approval_status'] = 'approved'
                    item['auto_approved'] = True
                    item['review_notes'] = "Auto-approved (high confidence)"
                    approved_count += 1
                    
                    # Update stats
                    self.approval_stats['approved'] += 1
                    self.approval_stats['pending'] -= 1
        
        self.update_review_table()
        self.update_stats_display()
        self.log_message(f"✅ Auto-approved {approved_count} high-confidence entities")
    
    def filter_manual_review_required(self) -> None:
        """Filter to show only entities requiring manual review"""
        confidence_filter = self.query_one("#confidence-filter", Select)
        confidence_filter.value = "manual"
        self.update_review_table()
        self.log_message("🔍 Filtered to show manual review required only")
    
    def reset_all_approvals(self) -> None:
        """Reset all approval statuses to pending"""
        for entity_type, items in self.entity_review_data.items():
            for item in items:
                if item['approval_status'] != 'pending':
                    old_status = item['approval_status']
                    item['approval_status'] = 'pending'
                    item['auto_approved'] = False
                    item['review_notes'] = ''
                    
                    # Update stats
                    if old_status == 'approved':
                        self.approval_stats['approved'] -= 1
                    elif old_status == 'rejected':
                        self.approval_stats['rejected'] -= 1
                    self.approval_stats['pending'] += 1
        
        self.update_review_table()
        self.update_stats_display()
        self.log_message("🔄 Reset all approvals to pending")
    
    def approve_selected_entities(self) -> None:
        """Approve selected entities (placeholder - would need table selection)"""
        # This would require implementing table row selection
        self.log_message("ℹ️ Selected entity approval not yet implemented")
    
    def reject_selected_entities(self) -> None:
        """Reject selected entities (placeholder - would need table selection)"""
        # This would require implementing table row selection
        self.log_message("ℹ️ Selected entity rejection not yet implemented")
    
    def add_review_notes(self) -> None:
        """Add review notes to selected entities"""
        notes_input = self.query_one("#review-notes-input", Input)
        notes = notes_input.value.strip()
        
        if notes:
            # This would add notes to selected entities
            self.log_message(f"📝 Review notes added: {notes}")
            notes_input.value = ""
        else:
            self.log_message("⚠️ Please enter review notes")
    
    @work(exclusive=True)
    async def create_approved_entities_worker(self) -> None:
        """Worker to create approved entities"""
        if not COMPONENTS_AVAILABLE or not self.entity_creator:
            self.log_message("❌ Entity creator not available")
            return
        
        try:
            self.update_status("🚀 Creating approved entities...")
            progress = self.query_one("#progress-bar", ProgressBar)
            progress.update(progress=0)
            
            # Prepare approved entities for creation
            approved_entities = {}
            total_approved = 0
            
            for entity_type, items in self.entity_review_data.items():
                approved_entities[entity_type] = []
                for item in items:
                    if item['approval_status'] == 'approved':
                        approved_entities[entity_type].append({
                            'entity_name': item['entity_name'],
                            'status': 'not_found',
                            'action_needed': 'create_new',
                            'confidence': item['confidence'],
                            'review_notes': item['review_notes']
                        })
                        total_approved += 1
            
            if total_approved == 0:
                self.log_message("ℹ️ No approved entities to create")
                self.update_status("No entities to create")
                return
            
            self.log_message(f"🚀 Creating {total_approved} approved entities...")
            progress.update(progress=25)
            
            # Create entities using EntityCreator
            self.creation_results = await self.entity_creator.create_missing_entities(approved_entities)
            progress.update(progress=75)
            
            # Update results table
            self.update_results_table()
            progress.update(progress=100)
            
            # Show summary
            stats = self.creation_results.get("statistics", {})
            total_created = stats.get("total_created", 0)
            total_failed = stats.get("total_failed", 0)
            
            self.log_message(f"✅ Entity creation complete!")
            self.log_message(f"   - Created: {total_created} entities")
            self.log_message(f"   - Failed: {total_failed} entities")
            
            # Switch to results tab
            tabbed_content = self.query_one(TabbedContent)
            tabbed_content.active = "results-tab"
            
            self.update_status(f"✅ Created {total_created} entities")
            
        except Exception as e:
            self.log_message(f"❌ Entity creation failed: {e}")
            self.update_status("❌ Entity creation failed")
    
    @work(exclusive=True)
    async def ai_review_analysis_worker(self) -> None:
        """Worker to get AI analysis of review queue"""
        if not COMPONENTS_AVAILABLE or not self.research_manager:
            self.log_message("❌ AI research manager not available")
            return
        
        try:
            self.update_status("🧠 Running AI review analysis...")
            progress = self.query_one("#progress-bar", ProgressBar)
            progress.update(progress=0)
            
            # Prepare analysis data
            analysis_data = {
                'total_entities': self.approval_stats['total'],
                'approved': self.approval_stats['approved'],
                'rejected': self.approval_stats['rejected'],
                'pending': self.approval_stats['pending'],
                'high_confidence_count': 0,
                'manual_review_count': 0,
                'entity_breakdown': {}
            }
            
            # Calculate detailed stats
            for entity_type, items in self.entity_review_data.items():
                analysis_data['entity_breakdown'][entity_type] = {
                    'total': len(items),
                    'high_confidence': len([i for i in items if i['confidence'] >= 0.8]),
                    'manual_review': len([i for i in items if i['manual_review_required']]),
                    'approved': len([i for i in items if i['approval_status'] == 'approved'])
                }
                
                analysis_data['high_confidence_count'] += analysis_data['entity_breakdown'][entity_type]['high_confidence']
                analysis_data['manual_review_count'] += analysis_data['entity_breakdown'][entity_type]['manual_review']
            
            progress.update(progress=50)
            
            # Generate AI analysis (simplified - would use actual research manager)
            analysis_content = f"""
# AI Review Analysis - Batch Entity Creation

## Summary Statistics
- **Total Entities**: {analysis_data['total_entities']}
- **Approved**: {analysis_data['approved']} ({(analysis_data['approved']/max(1,analysis_data['total_entities']))*100:.1f}%)
- **Rejected**: {analysis_data['rejected']} ({(analysis_data['rejected']/max(1,analysis_data['total_entities']))*100:.1f}%)
- **Pending**: {analysis_data['pending']} ({(analysis_data['pending']/max(1,analysis_data['total_entities']))*100:.1f}%)

## Confidence Analysis
- **High Confidence (≥0.8)**: {analysis_data['high_confidence_count']} entities
- **Manual Review Required**: {analysis_data['manual_review_count']} entities

## Entity Type Breakdown
"""
            
            for entity_type, breakdown in analysis_data['entity_breakdown'].items():
                analysis_content += f"""
### {entity_type.title()}
- Total: {breakdown['total']}
- High Confidence: {breakdown['high_confidence']}
- Manual Review: {breakdown['manual_review']}
- Currently Approved: {breakdown['approved']}
"""
            
            analysis_content += """

## Recommendations
1. **Auto-approve high-confidence entities** (≥0.8) to streamline the process
2. **Focus manual review** on entities with confidence 0.6-0.8
3. **Consider rejecting** entities with confidence <0.5 unless contextually important
4. **Prioritize personnel and organizations** for immediate creation

## Quality Assurance
- Verify entity names for proper formatting
- Check for potential duplicates before creation
- Ensure disclosure relevance is documented
"""
            
            progress.update(progress=100)
            
            # Display analysis
            analysis_display = self.query_one("#ai-analysis-content", Static)
            analysis_display.update(analysis_content)
            
            # Switch to analysis tab
            tabbed_content = self.query_one(TabbedContent)
            tabbed_content.active = "analysis-tab"
            
            self.log_message("✅ AI review analysis complete")
            self.update_status("✅ AI analysis ready")
            
        except Exception as e:
            self.log_message(f"❌ AI analysis failed: {e}")
            self.update_status("❌ AI analysis failed")
    
    def save_review_session(self) -> None:
        """Save the current review session"""
        try:
            import json
            
            # Prepare session data
            session_data = {
                'timestamp': datetime.now().isoformat(),
                'source_context': self.source_context,
                'approval_stats': self.approval_stats,
                'entity_review_data': self.entity_review_data,
                'creation_results': self.creation_results
            }
            
            # Save to file
            session_file = Path(f"entity_review_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session_data, f, indent=2, ensure_ascii=False)
            
            self.log_message(f"💾 Review session saved to: {session_file}")
            self.update_status("💾 Session saved")
            
        except Exception as e:
            self.log_message(f"❌ Save failed: {e}")
            self.update_status("❌ Save failed")
    
    def action_refresh(self) -> None:
        """Refresh the display"""
        self.update_review_table()
        self.update_results_table()
        self.update_stats_display()
        self.log_message("🔄 Display refreshed")
    
    def action_approve_all(self) -> None:
        """Approve all pending entities"""
        self.auto_approve_high_confidence()
    
    def action_create_approved(self) -> None:
        """Create approved entities"""
        self.create_approved_entities_worker()


def run_batch_entity_creator(search_results: Dict[str, List[Dict[str, Any]]], source_context: str = "") -> Dict[str, Any]:
    """
    Run the batch entity creator interface
    Returns the creation results
    """
    app = BatchEntityCreatorApp(search_results, source_context)
    app.run()
    
    # Return results
    return {
        "approval_stats": app.approval_stats,
        "creation_results": app.creation_results,
        "review_data": app.entity_review_data
    }


if __name__ == "__main__":
    # Test with sample data
    sample_search_results = {
        "personnel": [
            {"entity_name": "Dr. John Smith", "status": "not_found", "action_needed": "create_new", "confidence": 0.85},
            {"entity_name": "Jane Doe", "status": "not_found", "action_needed": "create_new", "confidence": 0.92},
            {"entity_name": "Bob Wilson", "status": "not_found", "action_needed": "create_new", "confidence": 0.55}
        ],
        "organizations": [
            {"entity_name": "AATIP", "status": "not_found", "action_needed": "create_new", "confidence": 0.95},
            {"entity_name": "Unidentified Research Corp", "status": "not_found", "action_needed": "create_new", "confidence": 0.45}
        ],
        "events": [
            {"entity_name": "Phoenix Lights Incident", "status": "not_found", "action_needed": "create_new", "confidence": 0.88}
        ]
    }
    
    run_batch_entity_creator(sample_search_results, "Test extraction session")