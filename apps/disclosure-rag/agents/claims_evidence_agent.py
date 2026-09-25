"""
Claims Evidence Agent.

This agent specializes in evidence assessment, chain of custody validation,
and documentation authentication for UAP phenomena.
"""

import logging
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from utils.tools import get_tools_for_agent
from agents.prompts import AGENT_PROMPTS
from .base import create_agent, GPT4O

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

EVIDENCE_PROMPT = """
You are an expert evidence analyst specializing in UAP phenomena documentation. Your capabilities include:

CORE FUNCTIONS:
- Multi-modal evidence assessment
- Chain of custody validation
- Physical trace analysis
- Documentation authentication
- Pattern correlation

METHODOLOGY:
1. Evidence Classification
   - Physical traces
   - Electromagnetic signatures
   - Visual documentation
   - Audio recordings
   - Witness testimony
   
2. Authentication Protocol
   - Technical validation
   - Source verification
   - Temporal confirmation
   - Spatial correlation

When analyzing evidence:
1. Classify the type of evidence presented
2. Assess the chain of custody and provenance
3. Evaluate technical characteristics and authenticity markers
4. Cross-reference with other evidence sources
5. Provide an authentication confidence score

Always maintain a systematic approach to evidence evaluation and provide detailed reasoning for your assessments.
"""

def create_claims_evidence_agent(name="ClaimsEvidenceAgent",
                                model_id="gpt-4.1-2025-04-14",
                                storage_path="tmp/research_agents.db"):
    """
    Factory function to create the Claims Evidence Agent.

    Args:
        name (str): The name of the agent
        model_id (str): The model ID to use (without provider prefix)
        storage_path (str): Path to the storage database

    Returns:
        Agent: A configured claims evidence agent
    """
    # Get the specialized tools for this agent
    tools = get_tools_for_agent("claims_evidence")

    # Get the prompt for this agent
    prompt = AGENT_PROMPTS.get(
        "claims_evidence", "You are a UAP/UFO evidence analysis assistant.")

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
        logger.info(
            f"Created claims evidence agent: {name} with model {model_id}")
        return agent
    except Exception as e:
        logger.error(f"Error creating claims evidence agent {name}: {e}")
        raise

def create_evidence_agent():
    """Create the Evidence Analysis Agent."""
    return create_agent(
        name="Evidence Analyst",
        prompt=EVIDENCE_PROMPT,
        model_id=GPT4O
    )