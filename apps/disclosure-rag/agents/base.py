# agents/base.py
import os
from agno import Agent, PromptTemplate
from agno.models import OpenAIChat
from agno.models.anthropic import Claude as AnthropicChat
from agno.storage.sqlite import SqliteStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.web import WebBrowserTools

# Define constants for models
CLAUDE_OPUS = "claude-3-opus-20240229"
CLAUDE_SONNET = "claude-3-sonnet-20240229"
GPT4_TURBO = "gpt-4-turbo"
GPT4O = "gpt-4o"

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