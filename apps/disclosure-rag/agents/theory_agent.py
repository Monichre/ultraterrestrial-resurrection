"""
Theory Development Agent.

This agent specializes in analyzing and developing theoretical frameworks for UAP phenomena,
evaluating frameworks against evidence, and identifying connections between approaches.
"""

import logging
from agno.agent import Agent
from agno.models.anthropic import Claude as AnthropicChat
from agno.storage.sqlite import SqliteStorage
from utils.tools import get_tools_for_agent
from agents.prompts import AGENT_PROMPTS

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_theory_agent(name="TheoryDevAgent",
                       model_id="claude-3-opus-20240229",
                       storage_path="tmp/research_agents.db"):
    """
    Factory function to create the Theory Development Agent.

    Args:
        name (str): The name of the agent
        model_id (str): The model ID to use (without provider prefix)
        storage_path (str): Path to the storage database

    Returns:
        Agent: A configured theory development agent
    """
    # Get the specialized tools for this agent
    tools = get_tools_for_agent("theory")

    # Get the prompt for this agent
    prompt = AGENT_PROMPTS.get(
        "theory", "You are a UAP/UFO theory development specialist.")

    # Create and configure the model
    model = AnthropicChat(id=model_id)

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
        logger.info(f"Created theory development agent: {name} with model {model_id}")
        return agent
    except Exception as e:
        logger.error(f"Error creating theory development agent {name}: {e}")
        raise