#!/usr/bin/env python3
"""
Research Manager - Administrative AI assistant for research queue and disclosure narrative coordination
Handles prioritization, scheduling, analysis, and strategic research coordination
Date: July 13, 2025
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta
from dataclasses import dataclass

from .research_queue_manager import ResearchQueueManager, ResearchTask, ResearchPriority, ResearchStatus
try:
    import openai
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    openai = None

logger = logging.getLogger(__name__)


@dataclass
class ResearchAction:
    """Administrative action recommendation for research tasks"""
    task_id: str
    entity_name: str
    action: str              # "prioritize", "schedule", "assign", "merge", "archive"
    reasoning: str
    confidence: float        # 0.0-1.0
    timeline: str
    notes: str


class ResearchManager:
    """Administrative AI for research queue management and disclosure narrative coordination"""

    def __init__(self, queue_manager: ResearchQueueManager):
        self.queue_manager = queue_manager
        self.ai_available = AI_AVAILABLE and os.getenv("OPENAI_API_KEY")

        if self.ai_available:
            openai.api_key = os.getenv("OPENAI_API_KEY")
            logger.info("✅ Research Manager initialized")
        else:
            logger.warning(
                "⚠️ Research Manager AI not available - missing OpenAI API key")

        # Research Manager persona
        self.system_prompt = """
        You are a Research Manager AI specializing in UFO/UAP disclosure research coordination.
        
        Your role: Administrative oversight and strategic coordination of disclosure research efforts.
        
        Core responsibilities:
        1. Prioritize research tasks based on disclosure narrative importance
        2. Schedule and coordinate research activities
        3. Identify research dependencies and relationships
        4. Manage research resource allocation
        5. Track progress and identify bottlenecks
        6. Provide strategic research direction
        
        Key expertise:
        - UFO/UAP disclosure timeline and key events
        - Government programs and personnel
        - Research methodology and source validation
        - Narrative coherence and information synthesis
        - Strategic planning and resource optimization
        
        Administrative principles:
        - Efficiency: Maximize research impact per effort invested
        - Coherence: Maintain narrative consistency and logical flow
        - Urgency: Prioritize time-sensitive disclosure opportunities
        - Quality: Ensure rigorous research standards
        - Strategy: Align research with long-term disclosure objectives
        """

    async def analyze_research_priorities(self) -> List[ResearchAction]:
        """Analyze current research queue and provide administrative recommendations"""
        if not self.ai_available:
            return []

        try:
            # Get current research state
            all_tasks = list(self.queue_manager.tasks.values())
            stats = self.queue_manager.get_queue_stats()

            # Focus on actionable tasks
            actionable_tasks = []
            for task in all_tasks:
                if task.status in [ResearchStatus.QUEUED, ResearchStatus.SCHEDULED]:
                    actionable_tasks.append({
                        "task_id": task.task_id,
                        "entity_name": task.entity_name,
                        "entity_type": task.entity_type,
                        "priority": task.priority.value,
                        "status": task.status.value,
                        "confidence": task.confidence,
                        "source_context": task.source_context[:100] + "..." if len(task.source_context) > 100 else task.source_context,
                        "disclosure_relevance": task.disclosure_relevance[:100] + "..." if len(task.disclosure_relevance) > 100 else task.disclosure_relevance,
                        "created_at": task.created_at
                    })

            prompt = f"""
            Research queue administrative analysis:
            
            CURRENT STATE:
            - Total tasks: {stats['total_tasks']}
            - Queued/Scheduled: {len(actionable_tasks)}
            - Priority breakdown: {stats['priority_breakdown']}
            - Entity types: {stats['entity_type_breakdown']}
            
            ACTIONABLE TASKS:
            {json.dumps(actionable_tasks[:8], indent=2)}
            
            Provide administrative recommendations in JSON format:
            {{
              "actions": [
                {{
                  "task_id": "task_id",
                  "entity_name": "entity_name",
                  "action": "prioritize|schedule|assign|merge|archive",
                  "reasoning": "administrative rationale",
                  "confidence": 0.85,
                  "timeline": "immediate|this_week|this_month",
                  "notes": "specific administrative notes"
                }}
              ],
              "summary": "overall research queue assessment",
              "next_steps": "top 3 administrative actions to take"
            }}
            
            Focus on:
            1. Research efficiency and resource optimization
            2. Timeline-critical disclosure opportunities
            3. Task dependencies and coordination
            4. Quality assurance and validation needs
            """

            response = await self._call_openai(prompt, max_tokens=1200)

            try:
                ai_response = json.loads(response)
                actions = []

                for action_data in ai_response.get("actions", []):
                    action = ResearchAction(
                        task_id=action_data.get("task_id", ""),
                        entity_name=action_data.get("entity_name", ""),
                        action=action_data.get("action", "prioritize"),
                        reasoning=action_data.get("reasoning", ""),
                        confidence=action_data.get("confidence", 0.5),
                        timeline=action_data.get("timeline", "this_week"),
                        notes=action_data.get("notes", "")
                    )
                    actions.append(action)

                logger.info(f"✅ Generated {len(actions)} research actions")
                return actions

            except json.JSONDecodeError:
                logger.error("Failed to parse Research Manager response")
                return []

        except Exception as e:
            logger.error(f"Error in research priority analysis: {e}")
            return []

    async def generate_research_briefing(self) -> str:
        """Generate administrative briefing for research coordination"""
        if not self.ai_available:
            return "Research Manager AI not available"

        try:
            stats = self.queue_manager.get_queue_stats()
            critical_tasks = self.queue_manager.get_tasks_by_priority(
                ResearchPriority.CRITICAL)
            high_tasks = self.queue_manager.get_tasks_by_priority(
                ResearchPriority.HIGH)
            queued_tasks = self.queue_manager.get_tasks_by_status(
                ResearchStatus.QUEUED)

            prompt = f"""
            Generate a research coordination briefing:
            
            QUEUE STATUS:
            - Total active tasks: {stats['total_tasks']}
            - Critical priority: {len(critical_tasks)}
            - High priority: {len(high_tasks)}
            - Awaiting assignment: {len(queued_tasks)}
            
            CRITICAL TASKS:
            {[f"{t.entity_name} ({t.entity_type})" for t in critical_tasks[:3]]}
            
            HIGH PRIORITY:
            {[f"{t.entity_name} ({t.entity_type})" for t in high_tasks[:5]]}
            
            Create administrative briefing with:
            1. RESEARCH STATUS (current operational state)
            2. IMMEDIATE PRIORITIES (next 3 tasks requiring attention)
            3. COORDINATION NEEDS (dependencies and scheduling)
            4. RESOURCE ALLOCATION (research effort distribution)
            5. QUALITY ASSURANCE (validation and verification needs)
            6. STRATEGIC DIRECTION (alignment with disclosure objectives)
            
            Keep it concise and action-oriented.
            """

            briefing = await self._call_openai(prompt, max_tokens=600)

            return f"""
# Research Coordination Briefing - {datetime.now().strftime('%Y-%m-%d')}

{briefing}

---
*Research Manager Administrative Report - {datetime.now().strftime('%H:%M')} UTC*
"""

        except Exception as e:
            logger.error(f"Error generating research briefing: {e}")
            return f"Error generating briefing: {e}"

    async def optimize_research_schedule(self) -> Dict[str, Any]:
        """Analyze and optimize research task scheduling"""
        if not self.ai_available:
            return {"error": "Research Manager AI not available"}

        try:
            # Get tasks that need scheduling
            unscheduled = self.queue_manager.get_tasks_by_status(
                ResearchStatus.QUEUED)
            scheduled = self.queue_manager.get_tasks_by_status(
                ResearchStatus.SCHEDULED)

            prompt = f"""
            Optimize research scheduling for maximum efficiency:
            
            UNSCHEDULED TASKS: {len(unscheduled)}
            {[f"{t.entity_name} ({t.priority.value})" for t in unscheduled[:5]]}
            
            SCHEDULED TASKS: {len(scheduled)}
            {[f"{t.entity_name} - {t.scheduled_date}" for t in scheduled[:5]]}
            
            Provide scheduling recommendations:
            1. Daily/weekly research allocation
            2. Task grouping for efficiency
            3. Priority-based timeline
            4. Resource optimization suggestions
            
            Focus on practical scheduling that maximizes research output.
            """

            recommendations = await self._call_openai(prompt, max_tokens=500)

            return {
                "scheduling_analysis": recommendations,
                "unscheduled_count": len(unscheduled),
                "scheduled_count": len(scheduled),
                "optimization_suggestions": "Generated by Research Manager AI"
            }

        except Exception as e:
            logger.error(f"Error optimizing schedule: {e}")
            return {"error": str(e)}

    async def coordinate_research_dependencies(self) -> Dict[str, List[str]]:
        """Identify and coordinate research task dependencies"""
        if not self.ai_available:
            return {}

        try:
            # Get task relationships for dependency analysis
            task_data = []
            for task in self.queue_manager.tasks.values():
                task_data.append({
                    "task_id": task.task_id,
                    "entity_name": task.entity_name,
                    "entity_type": task.entity_type,
                    "source_context": task.source_context[:50] + "..." if len(task.source_context) > 50 else task.source_context,
                    "disclosure_relevance": task.disclosure_relevance[:50] + "..." if len(task.disclosure_relevance) > 50 else task.disclosure_relevance
                })

            prompt = f"""
            Analyze research task dependencies and coordination needs:
            
            TASKS:
            {json.dumps(task_data[:10], indent=2)}
            
            Identify:
            1. Research dependencies (tasks that inform others)
            2. Coordination clusters (related research areas)
            3. Sequential priorities (research order requirements)
            4. Resource sharing opportunities
            
            Return JSON format:
            {{
              "dependencies": {{
                "task_id": ["depends_on_task_id1", "depends_on_task_id2"]
              }},
              "clusters": {{
                "cluster_name": ["task_id1", "task_id2", "task_id3"]
              }},
              "coordination_notes": "administrative guidance for research coordination"
            }}
            """

            response = await self._call_openai(prompt, max_tokens=800)

            try:
                dependency_data = json.loads(response)
                logger.info("✅ Research dependencies analyzed")
                return dependency_data
            except json.JSONDecodeError:
                logger.error("Failed to parse dependency analysis")
                return {}

        except Exception as e:
            logger.error(f"Error analyzing dependencies: {e}")
            return {}

    async def _call_openai(self, prompt: str, max_tokens: int = 500) -> str:
        """Call OpenAI API with Research Manager context"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.2  # Lower temperature for administrative precision
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise

# Quick CLI functions


async def run_research_admin(queue_manager: ResearchQueueManager) -> None:
    """Run Research Manager administrative analysis"""
    manager = ResearchManager(queue_manager)

    if not manager.ai_available:
        print("❌ Research Manager AI not available")
        return

    print("🔧 Running Research Manager analysis...")

    # Generate briefing
    briefing = await manager.generate_research_briefing()
    print(briefing)

    # Get priority actions
    actions = await manager.analyze_research_priorities()
    if actions:
        print(f"\n📋 Priority Actions ({len(actions)}):")
        for i, action in enumerate(actions[:3], 1):
            print(f"{i}. {action.entity_name}: {action.action}")
            print(f"   {action.reasoning}")
            print(f"   Timeline: {action.timeline}")

if __name__ == "__main__":
    async def test_manager():
        queue_manager = ResearchQueueManager()
        manager = ResearchManager(queue_manager)

        if manager.ai_available:
            briefing = await manager.generate_research_briefing()
            print(briefing)
        else:
            print("Research Manager not available for testing")

    asyncio.run(test_manager())
