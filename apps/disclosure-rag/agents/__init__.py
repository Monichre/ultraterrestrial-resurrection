# Analysis agents module
from .content_analysis_agent import ContentAnalysisAgent
from .disclosure_assistant import DisclosureAssistant, analyze_disclosure_content, cross_reference_disclosure_analysis


# Import factory functions for each specialized agent
try:
    from .historical_timeline_agent import make_historical_timeline_agent as create_historical_timeline_agent
    from .claims_evidence_agent import create_claims_evidence_agent
    from .geospatial_agent import create_geospatial_agent
    from .network_agent import create_network_agent
    from .documentation_agent import create_documentation_agent
    from .dataviz_agent import create_dataviz_agent
    from .theory_agent import create_theory_agent
    from .organization_agent import create_organization_agent
    from .testimony_agent import create_testimony_agent
    from .api_integration_agent import create_api_integration_agent
except ImportError as e:
    print(f"Warning: Could not import some agent factories: {e}")

# Import KnowledgeGraphAssistant separately to avoid circular imports
try:
    from .knowledge_graph_assistant import KnowledgeGraphAssistant
except ImportError:
    pass

__all__ = [
    "ContentAnalysisAgent",
    "DisclosureAssistant",
    "analyze_disclosure_content",
    "cross_reference_disclosure_analysis",
    "LocalRAGAssistant",
    "OracleAssistant",
    "KnowledgeGraphAssistant",
]

"""
Specialized agent registry.

This module provides a registry of specialized agent factory functions,
allowing for dynamic agent creation based on agent type.
"""


# Agent registry mapping agent types to factory functions
AGENT_FACTORIES = {}

# Safely register agent factories
try:
    AGENT_FACTORIES.update({
        "historical": create_historical_timeline_agent,
        "claims_evidence": create_claims_evidence_agent,
        "geospatial": create_geospatial_agent,
        "network": create_network_agent,
        "documentation": create_documentation_agent,
        "dataviz": create_dataviz_agent,
        "theory": create_theory_agent,
        "organization": create_organization_agent,
        "testimony": create_testimony_agent,
        "api_integration": create_api_integration_agent
    })
except NameError as e:
    print(f"Warning: Some agent factories not available: {e}")


def get_agent_factory(agent_type):
    """
    Get the factory function for a specific agent type.

    Args:
        agent_type (str): The type of agent to create

    Returns:
        callable: A factory function that creates an agent of the specified type,
                 or None if the agent type is not registered
    """
    return AGENT_FACTORIES.get(agent_type, None)