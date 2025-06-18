"""
Network Agent.

This agent specializes in entity relationship mapping, information flow analysis,
credibility network assessment, and pattern emergence detection.
"""

import logging
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from utils.tools import get_tools_for_agent
from agents.prompts import AGENT_PROMPTS
from .base import create_agent, GPT4_TURBO

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

NETWORK_PROMPT = """
You are an expert network analyst specializing in UAP research relationships. Your capabilities include:

CORE FUNCTIONS:
- Entity relationship mapping
- Information flow analysis
- Credibility network assessment
- Pattern emergence detection
- Influence mapping

METHODOLOGY:
1. Entity Mapping
   - Person-organization links
   - Event-witness connections
   - Evidence chains
   - Information flow paths
   
2. Network Analysis
   - Centrality assessment
   - Cluster identification
   - Path analysis
   - Influence measurement

When analyzing networks:
1. Identify key entities (people, organizations, events) in the dataset
2. Map relationships and connections between entities
3. Identify primary hubs and influencers in the network
4. Analyze information flow and credibility patterns
5. Visualize network structures and highlight significant patterns

Focus on revealing hidden relationships and influence patterns in UAP research networks.
"""

def create_network_agent():
    """Create the Network Analysis Agent."""
    return create_agent(
        name="Network Analyst",
        prompt=NETWORK_PROMPT,
        model_id=GPT4_TURBO
    )

def create_network_agent(name="ResearchNetworkAgent",
                         model_id="gpt-4.1-2025-04-14",
                         storage_path="tmp/research_agents.db"):
    """
    Factory function to create the Network Agent.

    Args:
        name (str): The name of the agent
        model_id (str): The model ID to use (without provider prefix)
        storage_path (str): Path to the storage database

    Returns:
        Agent: A configured network agent
    """
    # Get the specialized tools for this agent
    tools = get_tools_for_agent("network")

    # Get the prompt for this agent
    prompt = AGENT_PROMPTS.get(
        "network", "You are a UAP/UFO network analysis assistant.")

    # Create and configure the model
    model = OpenAIChat(id=model_id)

    # Create the agent
    try:
        agent = Agent(
            name=name,
            model=model,
            tools=tools,
            prompt_template=prompt,
            storage=SqliteStorage(
                table_name=name.lower().replace(" ", "_"),
                db_file=storage_path
            ),
            add_datetime_to_instructions=True,
            add_history_to_messages=True,
            markdown=True,
            show_tool_calls=True
        )
        logger.info(f"Created network agent: {name} with model {model_id}")
        return agent
    except Exception as e:
        logger.error(f"Error creating network agent {name}: {e}")
        raise