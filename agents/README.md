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

- `npm run start-athur`: Startet den Agenten "Athur". Dieser kann auf die oben genannten MCP Tools zugreifen und wird für die a2a-demo benötigt. Athur ermöglicht es, über das a2a protocol [https://a2a-protocol.org] angesprochen zu werden.
- `npm run a2a-demo`: Startet eine Agentin ("Annelise"), die versuchen wird, einen Ort zu finden. Dazu kann sie dank des a2a protocol [https://a2a-protocol.org] und einer Einbindung von Athur via Tools indirekt auf die MCP-Tools zurückgreifen. Athur muss vor dem Start ausgeführt werden und seine Agent-Card für den Abruf bereit halten.
- `npm run mcp-demo`: Startet einen Agenten, mit dem der Benutzer via CLI chatten kann. Dieser Agent kann direkt auf die MCP Tools zugreifen
