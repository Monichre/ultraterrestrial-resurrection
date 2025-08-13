# agents/base.py
import os
from agno import Agent, PromptTemplate
from agno.models import OpenAIChat
from agno.models.anthropic import Claude as AnthropicChat
from agno.storage.sqlite import SqliteStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.web import WebBrowserTools

# Define constants for models - Updated January 11, 2025
CLAUDE_SONNET_4 = "claude-4-sonnet-20250115"  # Latest Sonnet 4 
CLAUDE_OPUS_4 = "claude-4-opus-20250115"      # Latest Opus 4
CLAUDE_SONNET_35 = "claude-3-5-sonnet-20241022"  # Fallback Sonnet 3.5
GPT_5 = "gpt-5"                               # Latest GPT-5 model  
GPT_O3 = "o3"                                 # Latest O3 model

# Recommended default models for different use cases
DEFAULT_CLAUDE = CLAUDE_SONNET_4   # Primary Claude model
DEFAULT_OPENAI = GPT_5             # Primary OpenAI model

# Create standard tools
search_tool = DuckDuckGoTools()
web_tool = WebBrowserTools()

def create_agent(name, prompt, model_id):
    """Create an agent with standard configuration."""
    
    # Determine model provider and configure model
    if model_id.startswith("gpt"):
        model = OpenAIChat(id=model_id)
    else:  # Claude models
        model = AnthropicChat(id=model_id)
    
    # Create standard tools list
    tools = [search_tool, web_tool]
    
    # Create storage for conversation history
    storage = SqliteStorage(
        table_name=name.lower().replace(" ", "_"),
        db_file="agents.db"
    )
    
    # Create and return agent
    return Agent(
        name=name,
        model=model,
        tools=tools,
        prompt_template=PromptTemplate(prompt),
        storage=storage,
        markdown=True,
        add_datetime_to_instructions=True,
        add_history_to_messages=True,
        show_tool_calls=True
    )