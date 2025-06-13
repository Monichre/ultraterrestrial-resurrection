# Model Context Protocol (MCP)

The Model Context Protocol (MCP) is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. It standardizes how applications provide context and tools to Large Language Models (LLMs).

## What is MCP?

MCP functions as a plugin system for AI applications like Cursor, Claude, and Windsurf. It allows you to extend an AI agent's capabilities by connecting it to various data sources and tools through standardized interfaces.

Think of MCP as a bridge between AI assistants and the systems where data lives, including:
- Content repositories
- Business tools
- Development environments
- Local file systems
- APIs and databases

MCP servers can be written in any language that can print to `stdout` or serve an HTTP endpoint, making it flexible and accessible for developers regardless of their preferred technology stack.

## Architecture

MCP uses a client-server architecture:

1. **MCP Servers**: Provide data and functionality to AI tools
2. **MCP Clients**: AI applications (like Cursor) that connect to MCP servers

Cursor supports two transport types for MCP servers:

### 💻 stdio Transport
- Runs on your **local machine**
- Managed automatically by Cursor
- Communicates directly via `stdout`
- Only accessible by you locally

**Input:** Valid shell command that is run by Cursor automatically

### 🌐 SSE Transport
- Can run **locally or remotely**
- Managed and run by you
- Communicates **over the network**
- Can be **shared** across machines

**Input:** URL to the `/sse` endpoint of an MCP server external to Cursor

## Configuring MCP Servers

MCP servers are configured using JSON files. You can place this configuration in two locations:

### Project Configuration
For tools specific to a project, create a `.cursor/mcp.json` file in your project directory. This allows you to define MCP servers that are only available within that specific project.

### Global Configuration
For tools that you want to use across all projects, create a `~/.cursor/mcp.json` file in your home directory. This makes MCP servers available in all your Cursor workspaces.

Example configuration for a Node.js server:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

Example configuration for a Python server:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "python",
      "args": ["-m", "mcp_server_module"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

## Authentication

MCP servers can be provided with environment variables for authentication. This allows you to provide API keys and other authentication tokens to the MCP server without exposing them in your code or storing them within the MCP server itself.

## Popular MCP Servers

Here are some popular MCP servers that you can integrate with Cursor:

1. **GitHub** - Provides integration with GitHub's issue tracking system
2. **Supabase** - Allows LLMs to perform database queries on Postgres databases
3. **Neon** - Interact with the Neon serverless Postgres platform
4. **Upstash** - Provides access to Upstash Developer APIs
5. **Resend** - A simple MCP server that sends emails using Resend's API
6. **OpenMemory** - Stores, organizes, and manages memories with topics, emotions, and timestamps

## Using MCP in Cursor

The Composer Agent in Cursor will automatically use MCP tools that are available if it determines they are relevant. You can enable or disable individual MCP tools from the settings page to control which tools are available to the Agent.

To explicitly use an MCP tool, tell the agent which tool to use, referring to it either by name or by description.

### Tool Approval

By default, when the Agent wants to use an MCP tool, it will display a message asking for your approval. You can use the arrow next to the tool name to expand the message and see what arguments the Agent is calling the tool with.

You can enable auto-run to allow the Agent to automatically run MCP tools without requiring approval.

## Benefits of MCP

- **Extended Capabilities**: Connect Cursor to external systems and data sources
- **Persistence**: Maintain context between sessions and across different AI tools
- **Privacy**: Keep sensitive data local and under your control
- **Flexibility**: Write MCP servers in any language with minimal requirements

## Limitations

- Tool Quantity: Cursor will only send the first 40 tools to the Agent
- Remote Development: MCP servers may not work properly when accessing Cursor over SSH
- Resources: MCP servers offer both tools and resources, but Cursor currently only supports tools

## Creating Your Own MCP Server

To create your own MCP server, you'll need to implement the protocol specification. The simplest way to do this is to use one of the existing server frameworks:

- **Node.js**: Use the `@anthropic-ai/mcp` package
- **Python**: Use the `mcp-server` package

A basic MCP server in Python might look like this:

```python
from mcp.server.fastmcp import FastMCP

# Create the server
mcp = FastMCP('my-server')

# Define a tool
@mcp.tool()
def say_hello(name: str) -> str:
    """Say hello to the given name."""
    return f"Hello, {name}!"

# Run the server
if __name__ == "__main__":
    mcp.run(transport="stdio")
```

Once your server is implemented, you can configure it in Cursor as described above. 