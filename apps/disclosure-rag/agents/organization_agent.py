"""
Organization Relations Agent.

This agent specializes in analyzing relationships between organizations and key figures
in UFO/UAP research, mapping connections, and tracking organizational evolution.
"""

import logging
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from utils.tools import get_tools_for_agent
from agents.orchestration.specialized.prompts import AGENT_PROMPTS

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_organization_agent(name="OrgRelationAgent",
                             model_id="gpt-4.1-2025-04-14",
                             storage_path="tmp/research_agents.db"):
    """
    Factory function to create the Organization Relations Agent.

    Args:
        name (str): The name of the agent
        model_id (str): The model ID to use (without provider prefix)
        storage_path (str): Path to the storage database

    Returns:
        Agent: A configured organization relations agent
    """
    # Get the specialized tools for this agent
    tools = get_tools_for_agent("organization")

    # Get the prompt for this agent
    prompt = AGENT_PROMPTS.get(
        "organization", "You are a UAP/UFO organizational relationship analyzer.")

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
        logger.info(f"Created organization relations agent: {name} with model {model_id}")
        return agent
    except Exception as e:
        logger.error(f"Error creating organization relations agent {name}: {e}")
        raise