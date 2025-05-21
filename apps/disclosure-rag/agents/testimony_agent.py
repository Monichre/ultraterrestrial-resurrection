"""
Testimony Validator Agent.

This agent specializes in validating UFO/UAP testimonies and documentation,
analyzing witness credibility, and evaluating documentation authenticity.
"""

import logging
from agno.agent import Agent
from agno.models.anthropic import AnthropicChat
from agno.storage.sqlite import SqliteStorage
from utils.tools import get_tools_for_agent
from agents.orchestration.specialized.prompts import AGENT_PROMPTS

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_testimony_agent(name="TestimonyValidatorAgent",
                          model_id="claude-3-sonnet-20240229",
                          storage_path="tmp/research_agents.db"):
    """
    Factory function to create the Testimony Validator Agent.

    Args:
        name (str): The name of the agent
        model_id (str): The model ID to use (without provider prefix)
        storage_path (str): Path to the storage database

    Returns:
        Agent: A configured testimony validator agent
    """
    # Get the specialized tools for this agent
    tools = get_tools_for_agent("testimony")

    # Get the prompt for this agent
    prompt = AGENT_PROMPTS.get(
        "testimony", "You are a UAP/UFO testimony validation specialist.")

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
        logger.info(f"Created testimony validator agent: {name} with model {model_id}")
        return agent
    except Exception as e:
        logger.error(f"Error creating testimony validator agent {name}: {e}")
        raise