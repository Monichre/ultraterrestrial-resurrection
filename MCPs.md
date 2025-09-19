
## MCPS

#### 11. Rube MCP Server

- **Name:** Rube (by Composio)
- **Source URL:** [Rube MCP Server](https://rube.app/) | [GitHub](https://github.com/ComposioHQ/Rube)
- **Purpose:** Unified MCP server connecting AI agents to 500+ apps (Gmail, Slack, Notion, GitHub, Airtable, etc.) via natural language commands; works across Claude, Cursor, VSCode, and any MCP client.
- **Config Example:**

  ```json
  {
    "mcpServers": {
      "rube": {
        "type": "streamableHttp",
        "url": "https://rube.app/mcp"
      }
    }
  }
  ```

  - *Setup*: Authenticate in-browser, connect apps via OAuth/API keys, supports team/shared access.
  - *Tools*: All Composio connectors (tasks, email, docs, calendar, CRM, code, and more).

---

#### 12. Composio MCP Server

- **Name:** Composio MCP
- **Source URL:** [Composio MCP](https://mcp.composio.dev/) | [Docs](https://docs.composio.dev/docs/mcp-overview)
- **Purpose:** Exposes all Composio tools (1000+ integrations) through MCP standard; enables AI agents to automate, fetch, update, and chain actions across SaaS and developer tools.
- **Config Example:**

  ```json
  {
    "mcpServers": {
      "composio": {
        "type": "streamableHttp",
        "url": "https://mcp.composio.dev/"
      }
    }
  }
  ```

  - *Setup*: Use with Claude, Cursor, Windsurf, etc.; authenticate and select tools via dashboard or SDK.
  - *Tools*: Gmail, GitHub, Notion, Slack, Supabase, Trello, Google Sheets, and hundreds more.

---

#### 13. Chat.arcade.dev (Arcade MCP Server)

- **Name:** Arcade Chat MCP Server
- **Source URL:** [Chat.arcade.dev](https://chat.arcade.dev/)
- **Purpose:** (Authentication portal for Arcade’s chat platform; no public MCP server config found. If Arcade exposes MCP endpoints, use their documentation for setup.)
- **Config Example:** *(Not available; refer to Arcade’s integration docs for MCP support if/when available)*
  - *Features*: Secure sign-in, team chat, possible future MCP integrations.

---

#### 14. Veyrax MCP Server

- **Name:** Veyrax MCP Server
- **Source URL:** *(No official config or docs found; placeholder for future addition)*
- **Purpose:** *(Not enough public information; if Veyrax exposes an MCP server, use their documentation for setup.)*
- **Config Example:** *(Not available; check Veyrax documentation for details)*
-

Sources:
 • Rube MCP server overview, config, and features. ​⁠<https://github.com/ComposioHQ/Rube> ​⁠<https://rube.app/> ​⁠<https://medium.com/coding-nexus/rube-the-unified-mcp-server-that-connects-ai-agents-to-500-apps-8bf8ff5a4d54>
 • Composio MCP server overview, config, and docs. ​⁠<https://mcp.composio.dev/> ​⁠<https://docs.composio.dev/docs/mcp-overview>

**Today's Date:** June 13, 2024

  I want to add notes about a few of the data layer integrations I am thinking about implementing...because I like to make things harder.

- Convex
- SurrealDB
- FileAI(<https://www.file.ai/?ref=producthunt>)
- Onenode
- <https://www.koncile.ai/en?ref=producthunt>
- Got it. I’ll take your screenshot dump of links and clean it up into a properly formatted list with titles and working URLs. I’ll also fix typos, incomplete URLs, and odd placeholders. Here’s the organized version:
