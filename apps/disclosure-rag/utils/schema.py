import uuid
import datetime
from typing import Dict, List, Any, Optional, Literal

class AnalysisRecord:
    """Standardized format for analysis records shared between agents."""
    
    @staticmethod
    def create(
        agent_id: str,
        analysis_type: str,
        findings: Dict[str, Any],
        confidence_level: float = 0.0,
        related_entities: Optional[List[str]] = None,
        supporting_evidence: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Create a new analysis record with generated ID and timestamp."""
        return {
            "analysis_id": str(uuid.uuid4()),
            "agent_id": agent_id,
            "confidence_level": confidence_level,
            "timestamp": datetime.datetime.now().isoformat(),
            "analysis_type": analysis_type,
            "findings": {
                "summary": findings.get("summary", ""),
                "details": findings.get("details", {}),
                "confidence_metrics": findings.get("confidence_metrics", {}),
                "related_entities": related_entities or [],
                "supporting_evidence": supporting_evidence or []
            },
            "metadata": {
                "analysis_duration": None,
                "methods_used": [],
                "version": "1.0"
            }
        }
    
    @staticmethod
    def create_message(
        priority: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"],
        source_agent: str,
        target_agents: List[str],
        content: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a formatted message for agent communication."""
        # Calculate deadline based on priority
        if priority == "CRITICAL":
            deadline = datetime.datetime.now() + datetime.timedelta(hours=1)
        elif priority == "HIGH":
            deadline = datetime.datetime.now() + datetime.timedelta(hours=4)
        elif priority == "MEDIUM":
            deadline = datetime.datetime.now() + datetime.timedelta(hours=24)
        else:  # LOW
            deadline = datetime.datetime.now() + datetime.timedelta(days=7)
            
        return {
            "priority": priority,
            "source_agent": source_agent,
            "target_agents": target_agents,
            "message_type": content.get("message_type", "GENERAL"),
            "content": {
                "summary": content.get("summary", ""),
                "action_required": content.get("action_required", False),
                "deadline": deadline.isoformat(),
                "related_analysis": content.get("related_analysis", [])
            }
        }
