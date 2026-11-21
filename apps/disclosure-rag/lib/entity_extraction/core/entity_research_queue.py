#!/usr/bin/env python3
"""
Entity Research Queue - Maintains a prioritized queue of entities for deep research and ingestion
Tracks entities that need further investigation and contextual data gathering
Date: July 13, 2025
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger(__name__)

class ResearchPriority(Enum):
    """Research priority levels"""
    CRITICAL = "critical"      # Must research immediately
    HIGH = "high"              # Research within 1-3 days  
    MEDIUM = "medium"          # Research within 1-2 weeks
    LOW = "low"                # Research when time permits
    BACKLOG = "backlog"        # Research someday/maybe

class ResearchStatus(Enum):
    """Research status tracking"""
    QUEUED = "queued"          # Added to queue, not started
    SCHEDULED = "scheduled"    # Scheduled for specific date
    IN_PROGRESS = "in_progress" # Currently being researched
    ON_HOLD = "on_hold"        # Paused/waiting for dependencies
    COMPLETED = "completed"    # Research completed, ready for ingestion
    INGESTED = "ingested"      # Fully processed into knowledge base
    ARCHIVED = "archived"      # Completed but archived

@dataclass
class ResearchQueueItem:
    """A single item in the entity research queue"""
    # Core identification
    entity_name: str
    entity_type: str           # personnel, organizations, events, etc.
    
    # Research metadata
    priority: ResearchPriority
    status: ResearchStatus
    confidence: float          # AI extraction confidence (0.0-1.0)
    
    # Scheduling and timing
    created_at: str
    scheduled_date: Optional[str] = None
    target_completion: Optional[str] = None
    last_updated: str = None
    
    # Research context
    source_context: str = ""   # Where this entity was discovered
    research_notes: str = ""   # Researcher notes and findings
    related_entities: List[str] = None  # Related entities to research together
    
    # Deep research planning
    research_objectives: List[str] = None  # What to research about this entity
    data_sources: List[str] = None         # Potential sources to investigate
    contextual_keywords: List[str] = None  # Keywords for broader research
    
    # Narrative importance
    disclosure_relevance: str = ""    # Why this matters for disclosure narrative
    narrative_connections: List[str] = None  # How it connects to main story
    
    # Processing metadata
    extraction_session: str = ""     # Session ID where entity was extracted
    video_id: str = ""               # Source video/document ID
    ingestion_pipeline: str = ""     # Which pipeline to use for processing
    
    def __post_init__(self):
        if self.related_entities is None:
            self.related_entities = []
        if self.research_objectives is None:
            self.research_objectives = []
        if self.data_sources is None:
            self.data_sources = []
        if self.contextual_keywords is None:
            self.contextual_keywords = []
        if self.narrative_connections is None:
            self.narrative_connections = []
        if self.last_updated is None:
            self.last_updated = self.created_at

class EntityResearchQueue:
    """Manages the entity research queue with persistence and scheduling"""
    
    def __init__(self, queue_file: Optional[str] = None):
        self.queue_file = queue_file or self._get_default_queue_file()
        self.queue_items: List[ResearchQueueItem] = []
        self.load_queue()
    
    def _get_default_queue_file(self) -> str:
        """Get default location for queue file"""
        # Store in disclosure-rag directory
        base_dir = Path(__file__).parent.parent.parent
        queue_dir = base_dir / "data" / "research_queue"
        queue_dir.mkdir(parents=True, exist_ok=True)
        return str(queue_dir / "entity_research_queue.json")
    
    def load_queue(self) -> None:
        """Load queue from persistent storage"""
        try:
            if os.path.exists(self.queue_file):
                with open(self.queue_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                self.queue_items = []
                for item_data in data.get("queue_items", []):
                    # Convert string enums back to enum objects
                    item_data["priority"] = ResearchPriority(item_data["priority"])
                    item_data["status"] = ResearchStatus(item_data["status"])
                    
                    item = ResearchQueueItem(**item_data)
                    self.queue_items.append(item)
                
                logger.info(f"Loaded {len(self.queue_items)} items from research queue")
            else:
                logger.info("No existing research queue found, starting fresh")
                self.queue_items = []
                
        except Exception as e:
            logger.error(f"Error loading research queue: {e}")
            self.queue_items = []
    
    def save_queue(self) -> None:
        """Save queue to persistent storage"""
        try:
            # Convert to serializable format
            serializable_items = []
            for item in self.queue_items:
                item_dict = asdict(item)
                # Convert enums to strings
                item_dict["priority"] = item.priority.value
                item_dict["status"] = item.status.value
                serializable_items.append(item_dict)
            
            queue_data = {
                "last_updated": datetime.now().isoformat(),
                "total_items": len(self.queue_items),
                "queue_items": serializable_items
            }
            
            with open(self.queue_file, 'w', encoding='utf-8') as f:
                json.dump(queue_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved {len(self.queue_items)} items to research queue")
            
        except Exception as e:
            logger.error(f"Error saving research queue: {e}")
    
    def add_entity_to_queue(
        self,
        entity_name: str,
        entity_type: str,
        priority: Union[ResearchPriority, str] = ResearchPriority.MEDIUM,
        confidence: float = 0.0,
        source_context: str = "",
        research_notes: str = "",
        disclosure_relevance: str = "",
        scheduled_date: Optional[str] = None,
        **kwargs
    ) -> ResearchQueueItem:
        """Add an entity to the research queue"""
        
        # Convert string priority to enum if needed
        if isinstance(priority, str):
            priority = ResearchPriority(priority.lower())
        
        # Check for duplicates
        existing = self.find_entity(entity_name, entity_type)
        if existing:
            logger.warning(f"Entity {entity_name} ({entity_type}) already in queue")
            return existing
        
        # Create new queue item
        item = ResearchQueueItem(
            entity_name=entity_name,
            entity_type=entity_type,
            priority=priority,
            status=ResearchStatus.QUEUED if not scheduled_date else ResearchStatus.SCHEDULED,
            confidence=confidence,
            created_at=datetime.now().isoformat(),
            scheduled_date=scheduled_date,
            source_context=source_context,
            research_notes=research_notes,
            disclosure_relevance=disclosure_relevance,
            **kwargs
        )
        
        self.queue_items.append(item)
        self.save_queue()
        
        logger.info(f"Added {entity_name} ({entity_type}) to research queue with {priority.value} priority")
        return item
    
    def find_entity(self, entity_name: str, entity_type: str) -> Optional[ResearchQueueItem]:
        """Find an entity in the queue"""
        for item in self.queue_items:
            if (item.entity_name.lower() == entity_name.lower() and 
                item.entity_type.lower() == entity_type.lower()):
                return item
        return None
    
    def update_entity_status(
        self, 
        entity_name: str, 
        entity_type: str, 
        new_status: Union[ResearchStatus, str],
        notes: str = ""
    ) -> bool:
        """Update the status of an entity in the queue"""
        item = self.find_entity(entity_name, entity_type)
        if not item:
            return False
        
        if isinstance(new_status, str):
            new_status = ResearchStatus(new_status.lower())
        
        old_status = item.status
        item.status = new_status
        item.last_updated = datetime.now().isoformat()
        
        if notes:
            item.research_notes = f"{item.research_notes}\n[{datetime.now().strftime('%Y-%m-%d %H:%M')}] {notes}".strip()
        
        self.save_queue()
        logger.info(f"Updated {entity_name} status: {old_status.value} → {new_status.value}")
        return True
    
    def get_queue_by_priority(self, priority: Union[ResearchPriority, str] = None) -> List[ResearchQueueItem]:
        """Get queue items filtered by priority"""
        if priority is None:
            return sorted(self.queue_items, key=lambda x: (x.priority.value, x.created_at))
        
        if isinstance(priority, str):
            priority = ResearchPriority(priority.lower())
        
        return [item for item in self.queue_items if item.priority == priority]
    
    def get_queue_by_status(self, status: Union[ResearchStatus, str]) -> List[ResearchQueueItem]:
        """Get queue items filtered by status"""
        if isinstance(status, str):
            status = ResearchStatus(status.lower())
        
        return [item for item in self.queue_items if item.status == status]
    
    def get_scheduled_items(self, date_range: int = 7) -> List[ResearchQueueItem]:
        """Get items scheduled for the next N days"""
        target_date = datetime.now() + timedelta(days=date_range)
        
        scheduled_items = []
        for item in self.queue_items:
            if item.scheduled_date:
                try:
                    scheduled_dt = datetime.fromisoformat(item.scheduled_date.replace('Z', '+00:00'))
                    if scheduled_dt <= target_date:
                        scheduled_items.append(item)
                except ValueError:
                    continue
        
        return sorted(scheduled_items, key=lambda x: x.scheduled_date or "")
    
    def get_queue_statistics(self) -> Dict[str, Any]:
        """Get comprehensive queue statistics"""
        total_items = len(self.queue_items)
        
        # Count by priority
        priority_counts = {}
        for priority in ResearchPriority:
            priority_counts[priority.value] = len(self.get_queue_by_priority(priority))
        
        # Count by status
        status_counts = {}
        for status in ResearchStatus:
            status_counts[status.value] = len(self.get_queue_by_status(status))
        
        # Count by entity type
        entity_type_counts = {}
        for item in self.queue_items:
            entity_type_counts[item.entity_type] = entity_type_counts.get(item.entity_type, 0) + 1
        
        # Calculate average confidence
        confidences = [item.confidence for item in self.queue_items if item.confidence > 0]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Get upcoming scheduled items
        upcoming = len(self.get_scheduled_items(7))
        
        return {
            "total_items": total_items,
            "priority_breakdown": priority_counts,
            "status_breakdown": status_counts,
            "entity_type_breakdown": entity_type_counts,
            "average_confidence": round(avg_confidence, 2),
            "upcoming_scheduled": upcoming,
            "queue_file": self.queue_file,
            "last_updated": datetime.now().isoformat()
        }
    
    def remove_entity(self, entity_name: str, entity_type: str) -> bool:
        """Remove an entity from the queue"""
        item = self.find_entity(entity_name, entity_type)
        if item:
            self.queue_items.remove(item)
            self.save_queue()
            logger.info(f"Removed {entity_name} ({entity_type}) from research queue")
            return True
        return False
    
    def schedule_entity(
        self, 
        entity_name: str, 
        entity_type: str, 
        scheduled_date: str,
        target_completion: Optional[str] = None
    ) -> bool:
        """Schedule an entity for research on a specific date"""
        item = self.find_entity(entity_name, entity_type)
        if not item:
            return False
        
        item.scheduled_date = scheduled_date
        item.target_completion = target_completion
        item.status = ResearchStatus.SCHEDULED
        item.last_updated = datetime.now().isoformat()
        
        self.save_queue()
        logger.info(f"Scheduled {entity_name} for research on {scheduled_date}")
        return True

# Convenience functions for integration with entity extraction
def add_entities_from_search_results(
    search_results: Dict[str, List[Dict[str, Any]]],
    queue: EntityResearchQueue,
    default_priority: ResearchPriority = ResearchPriority.MEDIUM,
    source_context: str = ""
) -> List[ResearchQueueItem]:
    """Add entities marked as 'not_found' to the research queue"""
    added_items = []
    
    for entity_type, results in search_results.items():
        for result in results:
            if result.get('status') == 'not_found':
                entity_name = result.get('entity_name', '')
                confidence = result.get('confidence', 0.0)
                
                # Determine priority based on confidence and entity type
                if confidence >= 0.8:
                    priority = ResearchPriority.HIGH
                elif confidence >= 0.6:
                    priority = ResearchPriority.MEDIUM
                else:
                    priority = ResearchPriority.LOW
                
                # Add strategic priority boost for key entity types
                if entity_type in ['personnel', 'organizations', 'events']:
                    if priority == ResearchPriority.MEDIUM:
                        priority = ResearchPriority.HIGH
                    elif priority == ResearchPriority.LOW:
                        priority = ResearchPriority.MEDIUM
                
                item = queue.add_entity_to_queue(
                    entity_name=entity_name,
                    entity_type=entity_type,
                    priority=priority,
                    confidence=confidence,
                    source_context=source_context,
                    research_notes=f"Extracted with {confidence:.2f} confidence from entity extraction",
                    disclosure_relevance="To be determined during research phase"
                )
                
                if item:
                    added_items.append(item)
    
    return added_items


if __name__ == "__main__":
    # Example usage and testing
    queue = EntityResearchQueue()
    
    # Add some test entities
    queue.add_entity_to_queue(
        entity_name="David Grusch",
        entity_type="personnel",
        priority=ResearchPriority.CRITICAL,
        confidence=0.95,
        source_context="Congressional hearing testimony",
        disclosure_relevance="Key whistleblower with classified UAP program knowledge",
        research_objectives=["Verify claims about crash retrieval programs", "Document congressional testimony details"],
        data_sources=["Congressional records", "News interviews", "Social media"],
        contextual_keywords=["UAP", "crash retrieval", "whistleblower", "classified programs"]
    )
    
    # Print statistics
    stats = queue.get_queue_statistics()
    print("Research Queue Statistics:")
    print(json.dumps(stats, indent=2))