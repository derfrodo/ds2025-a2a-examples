# Agents
In this folder you will find some examples to visualize and play around with the protocols [MCP](https://modelcontextprotocol.io/) and [a2a](https://a2a-protocol.org).

## Features

- **Stdio interface**: Simple command-line interaction
- **Ollama integration**: Uses Ollama for natural language processing (optional)
- **Multi-MCP support**: Connects to three MCP servers:
  - `tankerkoenig-mcp`: German gas station information
  - `navigation-mcp`: Location search and geocoding
  - `ladesaeulen-mcp`: German e-charging station information

## Prerequisites

### Required
- Node.js (with npm)

### Optional (for AI features)
- **Ollama**: Install and run Ollama with a model (e.g., `llama3.2`)
  ```bash
  # Install Ollama (see https://ollama.ai)
  # Pull a model
  ollama pull llama3.2
  ```

### Environment setup
Copy `.env.sample` to `.env` and configure:
```bash
cp .env.sample .env
# Edit .env with your settings (TANKERKOENIG_API_KEY if using that server)
```

## Installation

```bash
npm install
```

## Available Tools

After connecting, the agent provides access to all tools of the mcps 
- `tankerkoenig-mcp` for german gas station information
- `navigation-mcp` for location search and geocoding
- `ladesaeulen-mcp` for german e-charging station information

## Development

- `npm run start-athur`: Starts the agent "Athur". This agent can access the above-mentioned MCP tools and is required for the a2a demo. Athur can be addressed via the a2a protocol [https://a2a-protocol.org].
- `npm run a2a-demo`: Starts an agent ("Annelise") who will try to find a location. Thanks to the a2a protocol [https://a2a-protocol.org] and integration of Athur via tools, she can indirectly access the MCP tools. Athur must be running before starting and have its agent card ready for retrieval.
- `npm run mcp-demo`: Starts an agent that allows the user to chat via CLI. This agent can directly access the MCP tools.
