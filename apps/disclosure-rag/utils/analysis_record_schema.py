import uuid
import time
from datetime import datetime
from typing import Dict, Any, List, Optional, Union

class AnalysisRecord:
    """
    A standardized record format for UAP/UFO research analysis.
    
    This class provides static methods for creating and formatting analysis records
    that can be shared between agents in the research system.
    """
    
    @staticmethod
    def build(agent_source: str, analysis_type: str, findings: Dict[str, Any], 
             confidence_level: float = 0.0) -> Dict[str, Any]:
        """
        Build a standardized analysis record.
        
        Args:
            agent_source: ID/tag of the agent that produced the analysis
            analysis_type: Type of analysis performed (e.g., 'event_analysis', 'testimony_validation')
            findings: Dictionary containing the detailed findings
            confidence_level: Float between 0-1 representing confidence in the findings
            
        Returns:
            A dictionary representing the analysis record
        """
        timestamp = time.time()
        formatted_time = datetime.fromtimestamp(timestamp).isoformat()
        
        record = {
            "analysis_id": str(uuid.uuid4()),
            "timestamp": timestamp,
            "formatted_time": formatted_time,
            "agent_source": agent_source,
            "analysis_type": analysis_type,
            "findings": findings,
            "confidence_level": max(0.0, min(1.0, confidence_level)),  # Ensure between 0-1
            "references": [],
            "version": "1.0"
        }
        
        return record
    
    @staticmethod
    def message_format(priority: str = "MEDIUM", source_agent: str = "SYSTEM", 
                      target_agents: List[str] = None, message_type: str = "INFO",
                      summary: str = "", action_required: bool = False,
                      related_analysis: List[str] = None) -> str:
        """
        Format a message for agent communication.
        
        Args:
            priority: Message priority (LOW, MEDIUM, HIGH, CRITICAL)
            source_agent: ID/tag of the agent sending the message
            target_agents: List of agent IDs/tags that should receive the message
            message_type: Type of message (INFO, QUERY, TASK, RESPONSE)
            summary: Brief summary of message content
            action_required: Whether the receiving agents need to take action
            related_analysis: List of analysis_ids related to this message
            
        Returns:
            Formatted message string for inter-agent communication
        """
        # Default empty lists if None
        if target_agents is None:
            target_agents = ["ALL"]
        if related_analysis is None:
            related_analysis = []
            
        # Format timestamp
        timestamp = datetime.now().isoformat()
        
        # Format the message header
        header = f"[{priority}] FROM: {source_agent} TO: {','.join(target_agents)} TYPE: {message_type} TIME: {timestamp}"
        
        # Format the message body
        body = f"SUMMARY: {summary}\nACTION_REQUIRED: {str(action_required).upper()}"
        
        # Add related analysis if any
        if related_analysis:
            analysis_refs = f"RELATED_ANALYSIS: {','.join(related_analysis)}"
        else:
            analysis_refs = "RELATED_ANALYSIS: NONE"
            
        # Combine all parts
        message = f"{header}\n{body}\n{analysis_refs}"
        
        return message
    
    @staticmethod
    def parse_message(message: str) -> Dict[str, Any]:
        """
        Parse a formatted message back into a structured object.
        
        Args:
            message: Formatted message string from message_format()
            
        Returns:
            Dictionary with parsed message components
        """
        lines = message.strip().split('\n')
        
        # Parse header
        header = lines[0]
        header_parts = header.split()
        
        priority = header_parts[0].strip('[]')
        
        source_index = header.find('FROM:') + 6
        target_index = header.find('TO:')
        source_agent = header[source_index:target_index].strip()
        
        target_index = target_index + 4
        type_index = header.find('TYPE:')
        target_agents_str = header[target_index:type_index].strip()
        target_agents = [agent.strip() for agent in target_agents_str.split(',')]
        
        type_index = type_index + 6
        time_index = header.find('TIME:')
        message_type = header[type_index:time_index].strip()
        
        timestamp = header[time_index+6:].strip()
        
        # Parse body
        summary_line = lines[1]
        summary = summary_line[summary_line.find(':')+1:].strip()
        
        action_line = lines[2]
        action_required = action_line[action_line.find(':')+1:].strip() == "TRUE"
        
        # Parse related analysis
        analysis_line = lines[3]
        analysis_part = analysis_line[analysis_line.find(':')+1:].strip()
        related_analysis = [] if analysis_part == "NONE" else [a.strip() for a in analysis_part.split(',')]
        
        return {
            "priority": priority,
            "source_agent": source_agent,
            "target_agents": target_agents,
            "message_type": message_type,
            "timestamp": timestamp,
            "summary": summary,
            "action_required": action_required,
            "related_analysis": related_analysis
        } 