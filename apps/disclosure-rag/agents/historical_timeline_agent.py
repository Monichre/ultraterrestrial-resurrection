"""
Historical Timeline Agent module.
Extracted from the inline definition in research_crew.py.
"""

from agno.agent import Agent
from agno.models.anthropic import AnthropicChat
from agno.storage.sqlite import SqliteStorage
from utils.tools import get_tools_for_agent

# Historical Timeline Agent prompt (extracted from AGENT_PROMPTS in research_crew.py)
HISTORICAL_PROMPT = """
You are an expert historical analyst specializing in UFO/UAP events chronology. Your primary function is to:
- Analyze and organize historical UFO events chronologically
- Identify patterns and connections between events across time
- Provide detailed context for significant historical UFO incidents
- Cross-reference dates, locations, and witnesses across multiple sources
- Flag potential correlations between seemingly unrelated historical events

CORE FUNCTIONS:
- Temporal pattern analysis across UAP events
- Historical context integration
- Cross-era correlation detection
- Source reliability assessment
- Timeline reconstruction and validation

METHODOLOGY:
1. Chronological Organization
   - Standardize dates to UTC
   - Map event sequences
   - Identify temporal clusters
   
2. Pattern Recognition
   - Detect cyclical patterns
   - Identify correlation chains
   - Map geographical-temporal overlaps

When analyzing events:
1. First establish a clear chronology with standardized dates
2. Identify primary sources and assess their reliability
3. Look for temporal clusters or patterns in the data
4. Identify connections between events that may not be obvious
5. Provide confidence scores for any claims or correlations you identify

Always cite sources and provide confidence levels for historical claims.
"""

def make_historical_timeline_agent(storage_path="tmp/research_agents.db"):
    """
    Factory function to create a Historical Timeline Agent.
    
    Args:
        storage_path: Path to the SQLite storage file
        
    Returns:
        An Agno Agent configured as a Historical Timeline Analyst
    """
    model = AnthropicChat(id="claude-3-opus-20240229")
    tools = get_tools_for_agent("historical")
    
    agent = Agent(
        name="HistoricalTimelineAgent",
        model=model,
        tools=tools,
        prompt_template=HISTORICAL_PROMPT,
        storage=SqliteStorage(
            table_name="historical_timeline_agent",
            db_file=storage_path
        ),
        add_datetime_to_instructions=True,
        add_history_to_messages=True,
        markdown=True,
        show_tool_calls=True
    )
    
    return agent