#!/usr/bin/env python3
"""
Research Queue Manager - Hybrid local/cloud research task management
Integrates with Upstash for remote access and includes AI assistant for agentic management
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

# Upstash integration
try:
    from upstash_redis import Redis
    UPSTASH_AVAILABLE = True
except ImportError:
    UPSTASH_AVAILABLE = False
    Redis = None

# AI integration
try:
    import openai
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    openai = None

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
    ASSIGNED = "assigned"      # Assigned to AI assistant
    IN_PROGRESS = "in_progress" # Currently being researched
    ON_HOLD = "on_hold"        # Paused/waiting for dependencies
    COMPLETED = "completed"    # Research completed, ready for ingestion
    INGESTED = "ingested"      # Fully processed into knowledge base
    ARCHIVED = "archived"      # Completed but archived

@dataclass
class ResearchTask:
    """A research task in the disclosure narrative pipeline"""
    # Core identification
    entity_name: str
    entity_type: str           # personnel, organizations, events, etc.
    task_id: str              # Unique identifier
    
    # Research metadata
    priority: ResearchPriority
    status: ResearchStatus
    confidence: float          # AI extraction confidence (0.0-1.0)
    
    # Scheduling and timing
    created_at: str
    scheduled_date: Optional[str] = None
    target_completion: Optional[str] = None
    completed_at: Optional[str] = None
    last_updated: str = None
    
    # Research context
    source_context: str = ""   # Where this entity was discovered
    research_notes: str = ""   # Researcher notes and findings
    ai_analysis: str = ""      # AI assistant analysis and recommendations
    
    # Disclosure narrative context
    disclosure_relevance: str = ""    # Why this matters for disclosure narrative
    narrative_connections: List[str] = None  # How it connects to main story
    research_objectives: List[str] = None    # What to research about this entity
    
    # Processing metadata
    extraction_session: str = ""     # Session ID where entity was extracted
    video_id: str = ""               # Source video/document ID
    assigned_to: str = ""            # AI assistant or researcher assigned
    
    def __post_init__(self):
        if self.narrative_connections is None:
            self.narrative_connections = []
        if self.research_objectives is None:
            self.research_objectives = []
        if self.last_updated is None:
            self.last_updated = self.created_at
        if not self.task_id:
            # Generate unique task ID
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            entity_short = self.entity_name[:10].replace(" ", "_")
            self.task_id = f"{entity_short}_{timestamp}"

class ResearchQueueManager:
    """Hybrid local/cloud research queue manager with AI assistant"""
    
    def __init__(self, use_upstash: bool = True):
        self.use_upstash = use_upstash and UPSTASH_AVAILABLE
        self.local_file = self._get_local_file()
        self.tasks: Dict[str, ResearchTask] = {}
        
        # Initialize Upstash connection
        if self.use_upstash:
            try:
                self.redis = Redis(
                    url=os.getenv("UPSTASH_REDIS_REST_URL"),
                    token=os.getenv("UPSTASH_REDIS_REST_TOKEN")
                )
                logger.info("✅ Upstash Redis connection initialized")
            except Exception as e:
                logger.warning(f"Upstash connection failed: {e}")
                self.use_upstash = False
                self.redis = None
        else:
            self.redis = None
        
        # Initialize AI assistant
        if AI_AVAILABLE and os.getenv("OPENAI_API_KEY"):
            openai.api_key = os.getenv("OPENAI_API_KEY")
            self.ai_available = True
            logger.info("✅ AI assistant available")
        else:
            self.ai_available = False
            logger.warning("⚠️ AI assistant not available - missing OpenAI API key")
        
        # Load existing tasks
        self.load_tasks()
    
    def _get_local_file(self) -> str:
        """Get local file path for research queue"""
        base_dir = Path(__file__).parent.parent
        queue_dir = base_dir / "data" / "research_queue"
        queue_dir.mkdir(parents=True, exist_ok=True)
        return str(queue_dir / "research_tasks.json")
    
    async def load_tasks(self) -> None:
        """Load tasks from both local and cloud storage"""
        # Load from local file
        local_tasks = self._load_local_tasks()
        
        # Load from Upstash if available
        if self.use_upstash:
            cloud_tasks = await self._load_cloud_tasks()
            
            # Merge tasks (cloud takes precedence for conflicts)
            all_tasks = {**local_tasks, **cloud_tasks}
        else:
            all_tasks = local_tasks
        
        # Convert to ResearchTask objects
        self.tasks = {}
        for task_id, task_data in all_tasks.items():
            try:
                # Convert string enums back to enum objects
                if isinstance(task_data.get("priority"), str):
                    task_data["priority"] = ResearchPriority(task_data["priority"])
                if isinstance(task_data.get("status"), str):
                    task_data["status"] = ResearchStatus(task_data["status"])
                
                task = ResearchTask(**task_data)
                self.tasks[task_id] = task
            except Exception as e:
                logger.error(f"Error loading task {task_id}: {e}")
        
        logger.info(f"Loaded {len(self.tasks)} research tasks")
    
    def _load_local_tasks(self) -> Dict[str, Dict]:
        """Load tasks from local JSON file"""
        try:
            if os.path.exists(self.local_file):
                with open(self.local_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                return data.get("tasks", {})
        except Exception as e:
            logger.error(f"Error loading local tasks: {e}")
        return {}
    
    async def _load_cloud_tasks(self) -> Dict[str, Dict]:
        """Load tasks from Upstash"""
        try:
            task_keys = self.redis.keys("research_task:*")
            cloud_tasks = {}
            
            for key in task_keys:
                task_data = self.redis.get(key)
                if task_data:
                    task_id = key.replace("research_task:", "")
                    cloud_tasks[task_id] = json.loads(task_data)
            
            return cloud_tasks
        except Exception as e:
            logger.error(f"Error loading cloud tasks: {e}")
            return {}
    
    async def save_tasks(self) -> None:
        """Save tasks to both local and cloud storage"""
        # Prepare serializable data
        serializable_tasks = {}
        for task_id, task in self.tasks.items():
            task_dict = asdict(task)
            task_dict["priority"] = task.priority.value
            task_dict["status"] = task.status.value
            serializable_tasks[task_id] = task_dict
        
        # Save locally
        local_data = {
            "last_updated": datetime.now().isoformat(),
            "total_tasks": len(self.tasks),
            "tasks": serializable_tasks
        }
        
        try:
            with open(self.local_file, 'w', encoding='utf-8') as f:
                json.dump(local_data, f, indent=2, ensure_ascii=False)
            logger.info(f"✅ Saved {len(self.tasks)} tasks locally")
        except Exception as e:
            logger.error(f"Error saving local tasks: {e}")
        
        # Save to Upstash
        if self.use_upstash:
            try:
                for task_id, task_data in serializable_tasks.items():
                    self.redis.set(
                        f"research_task:{task_id}",
                        json.dumps(task_data),
                        ex=86400 * 365  # 1 year expiration
                    )
                logger.info(f"✅ Saved {len(self.tasks)} tasks to Upstash")
            except Exception as e:
                logger.error(f"Error saving to Upstash: {e}")
    
    async def add_research_task(
        self,
        entity_name: str,
        entity_type: str,
        priority: Union[ResearchPriority, str] = ResearchPriority.MEDIUM,
        disclosure_relevance: str = "",
        research_objectives: List[str] = None,
        source_context: str = "",
        **kwargs
    ) -> ResearchTask:
        """Add a new research task"""
        
        # Convert string priority to enum if needed
        if isinstance(priority, str):
            priority = ResearchPriority(priority.lower())
        
        # Create task
        task = ResearchTask(
            entity_name=entity_name,
            entity_type=entity_type,
            task_id="",  # Will be generated in __post_init__
            priority=priority,
            status=ResearchStatus.QUEUED,
            confidence=kwargs.get("confidence", 0.0),
            created_at=datetime.now().isoformat(),
            source_context=source_context,
            disclosure_relevance=disclosure_relevance,
            research_objectives=research_objectives or [],
            **kwargs
        )
        
        # Check for duplicates
        existing = self.find_task_by_entity(entity_name, entity_type)
        if existing:
            logger.warning(f"Task for {entity_name} ({entity_type}) already exists")
            return existing
        
        # Add to queue
        self.tasks[task.task_id] = task
        await self.save_tasks()
        
        # Get AI analysis if available
        if self.ai_available:
            await self._get_ai_analysis(task)
        
        logger.info(f"✅ Added research task: {entity_name} ({entity_type}) - {priority.value} priority")
        return task
    
    async def _get_ai_analysis(self, task: ResearchTask) -> None:
        """Get AI assistant analysis for a research task"""
        try:
            prompt = f"""
            Analyze this research task for the UFO/UAP disclosure narrative:
            
            Entity: {task.entity_name} ({task.entity_type})
            Context: {task.source_context}
            Relevance: {task.disclosure_relevance}
            
            Provide:
            1. Research priority assessment (justify current priority: {task.priority.value})
            2. Key research objectives (3-5 specific goals)
            3. Potential data sources to investigate
            4. Narrative connections to broader disclosure story
            5. Recommended timeline for completion
            
            Be concise but thorough. Focus on disclosure narrative importance.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an AI research assistant specializing in UFO/UAP disclosure narrative analysis. Provide strategic research guidance."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            task.ai_analysis = response.choices[0].message.content
            task.last_updated = datetime.now().isoformat()
            
            logger.info(f"✅ AI analysis completed for {task.entity_name}")
            
        except Exception as e:
            logger.error(f"AI analysis failed for {task.entity_name}: {e}")
    
    def find_task_by_entity(self, entity_name: str, entity_type: str) -> Optional[ResearchTask]:
        """Find a task by entity name and type"""
        for task in self.tasks.values():
            if (task.entity_name.lower() == entity_name.lower() and 
                task.entity_type.lower() == entity_type.lower()):
                return task
        return None
    
    def get_tasks_by_priority(self, priority: Union[ResearchPriority, str] = None) -> List[ResearchTask]:
        """Get tasks filtered by priority"""
        if priority is None:
            return sorted(self.tasks.values(), key=lambda x: (x.priority.value, x.created_at))
        
        if isinstance(priority, str):
            priority = ResearchPriority(priority.lower())
        
        return [task for task in self.tasks.values() if task.priority == priority]
    
    def get_tasks_by_status(self, status: Union[ResearchStatus, str]) -> List[ResearchTask]:
        """Get tasks filtered by status"""
        if isinstance(status, str):
            status = ResearchStatus(status.lower())
        
        return [task for task in self.tasks.values() if task.status == status]
    
    async def update_task_status(
        self,
        task_id: str,
        new_status: Union[ResearchStatus, str],
        notes: str = ""
    ) -> bool:
        """Update task status"""
        if task_id not in self.tasks:
            return False
        
        if isinstance(new_status, str):
            new_status = ResearchStatus(new_status.lower())
        
        task = self.tasks[task_id]
        old_status = task.status
        task.status = new_status
        task.last_updated = datetime.now().isoformat()
        
        if notes:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
            task.research_notes = f"{task.research_notes}\n[{timestamp}] {notes}".strip()
        
        if new_status == ResearchStatus.COMPLETED:
            task.completed_at = datetime.now().isoformat()
        
        await self.save_tasks()
        logger.info(f"✅ Updated {task.entity_name} status: {old_status.value} → {new_status.value}")
        return True
    
    def get_queue_stats(self) -> Dict[str, Any]:
        """Get comprehensive queue statistics"""
        total_tasks = len(self.tasks)
        
        # Count by priority
        priority_counts = {}
        for priority in ResearchPriority:
            priority_counts[priority.value] = len(self.get_tasks_by_priority(priority))
        
        # Count by status
        status_counts = {}
        for status in ResearchStatus:
            status_counts[status.value] = len(self.get_tasks_by_status(status))
        
        # Count by entity type
        entity_type_counts = {}
        for task in self.tasks.values():
            entity_type_counts[task.entity_type] = entity_type_counts.get(task.entity_type, 0) + 1
        
        return {
            "total_tasks": total_tasks,
            "priority_breakdown": priority_counts,
            "status_breakdown": status_counts,
            "entity_type_breakdown": entity_type_counts,
            "upstash_enabled": self.use_upstash,
            "ai_enabled": self.ai_available,
            "last_updated": datetime.now().isoformat()
        }
    
    async def get_ai_recommendations(self) -> str:
        """Get AI recommendations for research priorities"""
        if not self.ai_available:
            return "AI assistant not available"
        
        try:
            # Get current queue summary
            stats = self.get_queue_stats()
            high_priority = self.get_tasks_by_priority(ResearchPriority.HIGH)
            critical_priority = self.get_tasks_by_priority(ResearchPriority.CRITICAL)
            
            prompt = f"""
            Current research queue status:
            - Total tasks: {stats['total_tasks']}
            - Critical priority: {len(critical_priority)}
            - High priority: {len(high_priority)}
            - By status: {stats['status_breakdown']}
            
            Critical tasks: {[t.entity_name for t in critical_priority[:5]]}
            High priority tasks: {[t.entity_name for t in high_priority[:5]]}
            
            As my UFO/UAP disclosure research assistant, provide:
            1. Priority recommendations for next 3 tasks to work on
            2. Suggested research strategy for the week
            3. Any entities that should be elevated in priority
            4. Timeline recommendations
            
            Keep it concise and actionable.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an AI research assistant specializing in UFO/UAP disclosure narrative research. Provide strategic guidance for research prioritization."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.3
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"AI recommendations failed: {e}")
            return f"Error getting AI recommendations: {e}"


# Integration functions for entity extraction
async def add_entities_to_research_queue(
    search_results: Dict[str, List[Dict[str, Any]]],
    queue_manager: ResearchQueueManager,
    source_context: str = "",
    video_id: str = ""
) -> List[ResearchTask]:
    """Add entities marked as 'not_found' to research queue"""
    added_tasks = []
    
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
                
                # Strategic priority boost for key entity types
                if entity_type in ['personnel', 'organizations', 'events']:
                    if priority == ResearchPriority.MEDIUM:
                        priority = ResearchPriority.HIGH
                    elif priority == ResearchPriority.LOW:
                        priority = ResearchPriority.MEDIUM
                
                task = await queue_manager.add_research_task(
                    entity_name=entity_name,
                    entity_type=entity_type,
                    priority=priority,
                    confidence=confidence,
                    source_context=source_context,
                    disclosure_relevance="Identified in entity extraction - requires research to determine narrative significance",
                    video_id=video_id
                )
                
                if task:
                    added_tasks.append(task)
    
    return added_tasks


if __name__ == "__main__":
    # Example usage
    async def test_queue():
        queue = ResearchQueueManager()
        
        task = await queue.add_research_task(
            entity_name="David Grusch",
            entity_type="personnel",
            priority=ResearchPriority.CRITICAL,
            disclosure_relevance="Key whistleblower with classified UAP program knowledge",
            research_objectives=["Verify crash retrieval claims", "Document congressional testimony"]
        )
        
        print("Research Queue Statistics:")
        stats = queue.get_queue_stats()
        print(json.dumps(stats, indent=2))
        
        if queue.ai_available:
            recommendations = await queue.get_ai_recommendations()
            print(f"\nAI Recommendations:\n{recommendations}")
    
    asyncio.run(test_queue())