# MCP Agent

A minimal agent that uses Ollama as an LLM and connects to multiple Model Context Protocol (MCP) servers to provide integrated functionality.

## Features

- **Stdio interface**: Simple command-line interaction
- **Ollama integration**: Uses Ollama for natural language processing (optional)
- **Multi-MCP support**: Connects to three MCP servers:
  - `tankerkoenig-mcp`: German gas station information
  - `nominatim-mcp`: Location search and geocoding
  - `ladesaeulen-mcp`: German e-charging station information
- **Manual mode**: Works without Ollama using direct tool commands
- **Graceful fallbacks**: Continues working even if some servers are unavailable

## Prerequisites

### Required
- Node.js 18+ with npm

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

## Usage

### Quick demo
```bash
npm run demo
```

### Interactive agent
```bash
npm run dev
```

### Manual mode (without Ollama)
When Ollama is not available, use manual commands:
```
You: list tools
You: call nominatim-search with q=Berlin,limit=1
You: call e-charging-stations with limit=5
```

### AI mode (with Ollama)
Use natural language:
```
You: Find gas stations near Berlin
You: What's the location of Alexanderplatz?
You: Show me charging stations in Munich
```

### Production mode
```bash
npm run build
npm start
```

## Architecture

The agent acts as an orchestrator between:
- **User**: Via stdio interface
- **Ollama** (optional): For natural language understanding and generation
- **MCP Servers**: For accessing specialized tools and data

```
User Input → Agent → [Ollama (analyze)] → MCP Tools → [Ollama (respond)] → User Output
```

## Available Tools

After connecting, the agent provides access to:

### Tankerkoenig (German Gas Stations)
- `tankerkoenig-stations`: Find nearby gas stations
- `tankerkoenig-prices`: Get fuel prices for stations
- `tankerkoenig-detail`: Get detailed station information

### Nominatim (OpenStreetMap Geocoding)
- `nominatim-search`: Search for locations by name/address
- `nominatim-reverse`: Get address from coordinates

### Ladesäulen (German E-Charging Stations)
- `e-charging-stations`: Find registered charging stations
- `nearest-e-charging-stations`: Find nearest charging stations
- `calculate-distance`: Calculate distance between points

## Development

- `npm run demo`: Run demonstration of MCP connections
- `npm test`: Test MCP server connections
- `npm run dev`: Run in development mode
- `npm run check`: Type check TypeScript
- `npm run build`: Build for production

## Example Interactions

### With Ollama (Natural Language)
```
You: Find gas stations near Berlin
🤖 Agent: I found several gas stations near Berlin...

You: What's the exact location of "Alexanderplatz Berlin"?
🤖 Agent: Alexanderplatz is located at coordinates...
```

### Without Ollama (Manual Commands)
```
You: call nominatim-search with q=Berlin,limit=3
📄 Result: {"results": [...]}

You: call tankerkoenig-stations with lat=52.5200,lng=13.4050,rad=5
📄 Result: {"stations": [...]}
```

## Error Handling

The agent is designed to be robust:
- ✅ Continues working if Ollama is unavailable (falls back to manual mode)
- ✅ Handles MCP server connection failures gracefully
- ✅ Provides clear error messages and usage instructions
- ✅ Maintains connections properly and cleans up resources