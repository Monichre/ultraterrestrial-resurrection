# Creating MCP Servers

This guide will walk you through the process of creating your own Model Context Protocol (MCP) server for use with Cursor, Claude, and other MCP clients.

## Prerequisites

Before you begin, make sure you have:

- Node.js (v14+) or Python (3.8+) installed
- Basic understanding of asynchronous programming
- Familiarity with the MCP protocol (see [Model Context Protocol](model-context-protocol.md))

## Getting Started

You can create an MCP server in several programming languages. The most common are JavaScript/TypeScript (Node.js) and Python. We'll cover both approaches.

### Using Node.js/TypeScript

1. **Set up your project**:

```bash
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @anthropic-ai/mcp
```

2. **Create a basic server file** (index.js):

```javascript
const { MCPServer } = require('@anthropic-ai/mcp');

// Create your MCP server
const server = new MCPServer({
  name: 'my-mcp-server',
});

// Define your first tool
server.tool("hello_world", async (params) => {
  const { name = "World" } = params;
  return `Hello, ${name}!`;
});

// Start the server
server.start();
```

3. **Run your server**:

```bash
node index.js
```

### Using Python

1. **Set up your project**:

```bash
mkdir my-mcp-server
cd my-mcp-server
pip install mcp-server
```

2. **Create a basic server file** (server.py):

```python
from mcp.server.fastmcp import FastMCP

# Create your MCP server
mcp = FastMCP('my-mcp-server')

# Define your first tool
@mcp.tool()
def hello_world(name: str = "World") -> str:
    """Say hello to the given name."""
    return f"Hello, {name}!"

# Run the server
if __name__ == "__main__":
    mcp.run(transport="stdio")
```

3. **Run your server**:

```bash
python server.py
```

## Advanced Server Development

### Tool Parameters

Tools can accept parameters to customize their behavior. Parameter types should be documented using type hints in Python or JSDoc in JavaScript.

#### Python Example:

```python
@mcp.tool()
def calculate_area(width: float, height: float) -> float:
    """Calculate the area of a rectangle."""
    return width * height
```

#### JavaScript Example:

```javascript
server.tool("calculate_area", async (params) => {
  const { width, height } = params;
  return width * height;
});
```

### Error Handling

Your tools should handle errors gracefully and return informative error messages.

#### Python Example:

```python
@mcp.tool()
def divide_numbers(dividend: float, divisor: float) -> float:
    """Divide the first number by the second number."""
    try:
        return dividend / divisor
    except ZeroDivisionError:
        return "Error: Division by zero is not allowed."
```

#### JavaScript Example:

```javascript
server.tool("divide_numbers", async (params) => {
  const { dividend, divisor } = params;
  
  if (divisor === 0) {
    return "Error: Division by zero is not allowed.";
  }
  
  return dividend / divisor;
});
```

### Accessing External Resources

MCP servers often need to access external resources like databases, APIs, or file systems.

#### Python Example (Web API):

```python
import requests

@mcp.tool()
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    try:
        response = requests.get(f"https://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}")
        data = response.json()
        return f"The current temperature in {city} is {data['current']['temp_c']}°C"
    except Exception as e:
        return f"Error fetching weather: {str(e)}"
```

#### JavaScript Example (File System):

```javascript
const fs = require('fs').promises;

server.tool("read_file", async (params) => {
  const { path } = params;
  
  try {
    const content = await fs.readFile(path, 'utf8');
    return content;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
});
```

### Resource Definitions

In addition to tools, MCP servers can define resources that help structure and organize data. Note that Cursor currently only supports tools, not resources.

```javascript
server.resource("user", {
  schema: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string" },
    },
    required: ["id", "name", "email"],
  },
});
```

## Testing Your MCP Server

Before integrating your server with Cursor, you should test it locally:

### Manual Testing

Run your server and interact with it through the command line:

```bash
echo '{"jsonrpc":"2.0","method":"call","params":{"tool":"hello_world","params":{"name":"Jane"}},"id":1}' | node index.js
```

### Automated Testing

Create unit tests for your tools to ensure they behave as expected.

#### Python Example (with pytest):

```python
def test_hello_world():
    from server import hello_world
    assert hello_world("Jane") == "Hello, Jane!"
    assert hello_world() == "Hello, World!"
```

#### JavaScript Example (with Jest):

```javascript
test('hello_world returns greeting', async () => {
  const { server } = require('./index');
  
  const result1 = await server.tools.hello_world({ name: 'Jane' });
  expect(result1).toBe('Hello, Jane!');
  
  const result2 = await server.tools.hello_world({});
  expect(result2).toBe('Hello, World!');
});
```

## Configuring Your Server in Cursor

Once your MCP server is ready, you can configure it in Cursor:

1. In Cursor, go to Settings > MCP > Add New MCP Server
2. Enter a name for your server
3. For a Python server, enter: `python path/to/your/server.py`
4. For a Node.js server, enter: `node path/to/your/index.js`
5. Add any necessary environment variables

Alternatively, you can edit your `.cursor/mcp.json` file directly:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "python",
      "args": ["path/to/your/server.py"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## Best Practices

1. **Clear Documentation**: Document each tool's purpose, parameters, and return values
2. **Error Handling**: Gracefully handle errors and provide helpful error messages
3. **Performance**: Make your tools efficient to avoid timeouts
4. **Security**: Be cautious about what your tools can access and modify
5. **Statelessness**: Design tools to be stateless when possible
6. **Versioning**: Consider versioning your tools for compatibility

## Examples of Useful MCP Servers

Here are some ideas for MCP servers you might want to build:

1. **Database Connector**: Query and manipulate database data
2. **File System Navigator**: Browse and manipulate files
3. **API Client**: Access external APIs like GitHub, Slack, or Twitter
4. **Memory Store**: Save and retrieve information across sessions
5. **Code Generator**: Generate code from specifications
6. **Data Analyzer**: Analyze and visualize data

## Troubleshooting

If you encounter issues with your MCP server:

1. **Check Logs**: Look for errors in your server logs
2. **Verify Configuration**: Ensure your server is properly configured in Cursor
3. **Test Independently**: Test your server outside of Cursor to isolate issues
4. **Check Permissions**: Ensure your server has the necessary permissions
5. **Validate JSON-RPC**: Make sure your tools return valid JSON-RPC responses

## Resources

- [Official MCP Documentation](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Cursor MCP Documentation](https://docs.cursor.sh/mcp)
- [MCP Python Package](https://pypi.org/project/mcp-server/)
- [MCP JavaScript Package](https://www.npmjs.com/package/@anthropic-ai/mcp)
- [MCP Community Forums](https://forum.anthropic.com/c/developers/mcp/) 