# MCP A2A Examples

A collection of Model Context Protocol (MCP) servers and AI agents demonstrating integration with German infrastructure APIs.
This project showcases how to build modular, interoperable tools for accessing location-based services and data.

## Table of Contents

- [🚀 Overview](#-overview)
- [📁 Project Structure](#-project-structure)
- [🛠️ Quick Start](#️-quick-start)
- [🎮 Demos](#-demos)
  - [MCP Demo](#mcp-demo)
  - [A2A Demo](#a2a-demo)
- [🔧 Development](#-development)
- [🌟 Features](#-features)

## 🚀 Overview

This repository demonstrates the power of the **Model Context Protocol (MCP)** and **Agent-to-Agent (A2A)** communication through practical examples focused on German infrastructure data.

**What you'll find:**

- **MCP Servers**: Specialized servers that provide API access through the Model Context Protocol for German infrastructure services (gas stations, charging stations, navigation)
- **AI Agents**: Intelligent agents that can orchestrate multiple MCP servers or communicate with other agents to provide unified functionality
- **Real-world Integration**: Complete examples showing how to build location-based services using standardized protocols

## 📁 Project Structure

### MCP Servers

| Server | Description | API Source |
|--------|-------------|------------|
| [`gas-stations-mcp/`](./gas-stations-mcp/) | German gas station locations and fuel prices | [Tankerkoenig API](https://creativecommons.tankerkoenig.de/) |
| [`ladesaeulen-mcp/`](./ladesaeulen-mcp/) | German e-charging station locations | [Ladestationen API](https://ladestationen.api.bund.dev/) |
| [`navigation-mcp/`](./navigation-mcp/) | Geocoding and location search | [Nominatim (OpenStreetMap)](https://nominatim.org/) |

### AI Agents

| Component | Description |
|-----------|-------------|
| [`agents/`](./agents/) | AI agents that connect to multiple MCP-servers or with other agents for integrated functionality |

## 🛠️ Quick Start

### Prerequisites

- **Node.js** (LTS is recommended)
- **npm** package manager

### Running Individual MCP Servers

Each MCP server can be run independently for testing or development:

```bash
# Gas stations server (requires API key)
cd gas-stations-mcp
npm install
cp .env.sample .env
# Edit .env with your TANKERKOENIG_API_KEY
npm run dev

# E-charging stations server (no API key needed)
cd ladesaeulen-mcp
npm install
npm run dev

# Navigation/geocoding server (no API key needed)
cd navigation-mcp
npm install
npm run dev
```

### Running the AI Agent

The agents provide an interactive way to work with the MCP servers:

```bash
cd agents
npm install
cp .env.sample .env
# Edit .env with any required API keys

# For basic MCP interaction
npm run mcp-demo
```

## 🎮 Demos

### MCP Demo

**Direct MCP Server Interaction**

This demo shows how to interact directly with MCP servers through an AI agent:

```bash
cd agents
npm install
npm run mcp-demo 
```

The agent will connect to all three MCP servers and provide a command-line interface where you can ask questions like:
- "Find gas stations near Dortmund"
- "What's the cheapest E10 fuel in a 5km radius of Berlin?"
- "Show me charging stations near Munich"

### A2A Demo

**Agent-to-Agent Communication**

This demonstrates how agents can communicate with each other using the A2A protocol:

**Step 1:** Start Agent Arthur (the service provider):
```bash
cd agents
npm install
npm run start-athur 
```

Wait for the agent to display that an agent card is available.

**Step 2:** Start the A2A demo (Agent Annelise will call Arthur):
```bash
cd agents
npm run a2a-demo
```

Agent Annelise will attempt to find location information by communicating with Agent Arthur, who has access to the MCP tools. This showcases indirect MCP access through agent communication.

## 🔧 Development

Each component has its own README with detailed setup instructions:

- [Gas Stations MCP Server](./gas-stations-mcp/README.md) - German fuel price data
- [E-Charging Stations MCP Server](./ladesaeulen-mcp/README.md) - Electric vehicle charging stations  
- [Navigation MCP Server](./navigation-mcp/README.md) - Geocoding and location search
- [AI Agents](./agents/README.md) - Agent examples for MCP and A2A protocols

### Development Workflow

1. **Set up individual servers**: Each MCP server can be developed and tested independently
2. **Test with MCP Inspector**: Use `npm run inspect` in any server directory for debugging
3. **Integration testing**: Use the agents to test server interactions
4. **A2A protocol testing**: Use the A2A demo to test agent communication

## 🌟 Features

- **🏗️ Modular Architecture**: Each MCP server is independent and focused on a specific API
- **🔗 Unified Interface**: AI agents can orchestrate multiple servers seamlessly  
- **🇩🇪 German Infrastructure Focus**: Specialized for German location-based services
- **📡 Protocol Standards**: Built on MCP and A2A protocol standards
- **🔄 Real-time Data**: Access to live fuel prices and infrastructure data
- **🚀 Easy Deployment**: Simple setup with minimal configuration required
