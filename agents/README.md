# AI Agents

This directory contains example implementations showcasing the **Model Context Protocol (MCP)** and **Agent-to-Agent (A2A)** communication protocols. These agents demonstrate how to build intelligent systems that can access multiple data sources and communicate with other agents.

## Table of Contents

- [🌟 What This Demonstrates](#-what-this-demonstrates)
- [🚀 Features](#-features)
- [📋 Prerequisites](#-prerequisites)
- [🛠️ Installation](#️-installation)
- [🔧 Available Tools](#-available-tools)
- [🎮 Running the Examples](#-running-the-examples)
- [🔄 Development](#-development)

## 🌟 What This Demonstrates

- **MCP Integration**: How agents can directly connect to multiple MCP servers for unified data access
- **A2A Communication**: How agents can communicate with each other using standardized protocols
- **Real-world Applications**: Practical examples of location-based services and infrastructure queries
- **Protocol Standards**: Implementation of emerging standards for AI agent interoperability

## 🚀 Features

- **💬 Stdio Interface**: Simple command-line interaction for testing and development
- **🧠 Ollama Integration**: Uses Ollama for natural language processing (optional but recommended)
- **🔗 Multi-MCP Support**: Seamlessly connects to three specialized MCP servers:
  - `gas-stations-mcp`: Real-time German fuel price data
  - `navigation-mcp`: Geocoding, location search, and mapping
  - `ladesaeulen-mcp`: German electric vehicle charging infrastructure
- **🤝 Agent-to-Agent Communication**: Demonstrates A2A protocol for inter-agent collaboration
- **🎯 Practical Examples**: Real-world scenarios like route planning and price comparison

## 📋 Prerequisites

### Required
- **Node.js** (LTS version recommended) with npm
- Basic understanding of command-line interfaces

### Recommended (for AI features)
- **Ollama**: Local AI model server for natural language processing
  ```bash
  # Install Ollama (see https://ollama.ai for platform-specific instructions)
  
  # Pull a recommended model
  ollama pull llama3.2
  ```

### Environment Setup
Copy the sample environment file and configure as needed:
```bash
cp .env.sample .env
# Edit .env with your settings:
# - TANKERKOENIG_API_KEY: Required for gas station data
# - Other optional configurations
```

## 🛠️ Installation

```bash
npm install
```

## 🔧 Available Tools

Once the agents connect to the MCP servers, they provide access to all integrated tools:

### Gas Station Services (`gas-stations-mcp`)
- Find nearby gas stations by location and radius
- Get real-time fuel prices (E5, E10, Diesel)
- Retrieve detailed station information
- Filter and sort by price or distance

### Navigation Services (`navigation-mcp`)
- Convert addresses to GPS coordinates (geocoding)
- Find addresses from coordinates (reverse geocoding)  
- Search for places and points of interest
- Calculate distances between locations

### E-Charging Infrastructure (`ladesaeulen-mcp`)
- Access German charging station database
- Find nearest charging stations
- Get technical specifications (power, connectors)
- Calculate distances for route planning

## 🎮 Running the Examples

### MCP Demo - Direct Server Interaction
Start an interactive agent that connects directly to MCP servers:

```bash
npm run mcp-demo
```

**What it does:**
- Connects to all three MCP servers
- Provides a command-line chat interface
- Allows natural language queries about locations, fuel prices, and charging stations

**Example queries you can try:**
```
> Find gas stations near Berlin
> What's the cheapest E10 fuel in a 5km radius of Munich?
> Show me charging stations near Hamburg
> How far is it from Dortmund to Cologne?
```

### A2A Demo - Agent-to-Agent Communication

This demo shows how agents can communicate with each other using the A2A protocol.

**Step 1:** Start the service agent (Arthur)
```bash
npm run start-athur
```
Wait for the message indicating the agent card is available.

**Step 2:** Start the client agent (Annelise)
```bash
npm run a2a-demo
```

**What happens:**
- Agent Annelise needs location information
- She discovers and communicates with Agent Arthur via A2A protocol
- Arthur has access to MCP tools and provides the requested data
- Demonstrates indirect MCP access through agent collaboration

## 🔄 Development

### Available Scripts

- **`npm run start-athur`**: Starts Agent Arthur (service provider)
  - Provides MCP tool access via A2A protocol
  - Must be running before starting A2A demo
  - Publishes agent card for discovery

- **`npm run a2a-demo`**: Starts Agent Annelise (service consumer)  
  - Demonstrates A2A protocol usage
  - Communicates with Arthur to access MCP functionality
  - Shows practical agent-to-agent collaboration

- **`npm run mcp-demo`**: Direct MCP interaction demo
  - Command-line interface for testing MCP servers
  - No agent-to-agent communication involved
  - Best for debugging and understanding MCP capabilities

### Development Workflow

1. **Test individual MCP servers** using their respective `npm run dev` commands
2. **Debug MCP interactions** using `npm run mcp-demo`
3. **Test A2A communication** using the two-step A2A demo process
4. **Monitor agent behavior** through console logs and debugging output

### Protocol Resources

- **MCP (Model Context Protocol)**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
- **A2A (Agent-to-Agent Protocol)**: [https://a2a-protocol.org/](https://a2a-protocol.org/)
