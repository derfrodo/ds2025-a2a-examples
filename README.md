# MCP A2A Examples

A collection of Model Context Protocol (MCP) servers and AI agents demonstrating integration with German infrastructure APIs.
This project showcases how to build modular, interoperable tools for accessing location-based services and data.

## 🚀 Overview

This repository contains:

- **MCP Servers**: Specialized servers that provide API access through the Model Context Protocol
- **AI Agents**: Intelligent agents that can orchestrate multiple MCP servers to provide unified functionality

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

- Node.js (LTS is recommended)
- npm

### Running Individual MCP Servers

Each MCP server can be run independently:

```bash
# Gas stations server
cd gas-stations-mcp
npm install
npm run dev

# E-charging stations server  
cd ladesaeulen-mcp
npm install
npm run dev

# Navigation/geocoding server
cd navigation-mcp
npm install
npm run dev
```

### Running the AI Agent


## A2A Demo

The scripts below must be started in sequentially in seperate consoles.

```bash
cd agents
npm install
npm run start-athur 
```

Wait for the agent to state, that a agent card is available. Afterwards start the a2a-demo which is "Agent Annelise" calling "Agent Athur" to find out a specific location, if the models are smart enough 😅

```bash
cd agents
npm install
npm run a2a-demo

```

## 🔧 Development

Each component has its own README with detailed setup instructions:

- [Gas Stations MCP Server](./gas-stations-mcp/README.md)
- [E-Charging Stations MCP Server](./ladesaeulen-mcp/README.md)  
- [Navigation MCP Server](./navigation-mcp/README.md)
- [AI Agents](./agents/README.md)

## 🌟 Features

- **Modular Architecture**: Each MCP server is independent and focused on a specific API
- **Unified Interface**: AI agents can orchestrate multiple servers seamlessly
- **German Infrastructure Focus**: Specialized for German location-based services
- **MCP Compatibility**: Built on the Model Context Protocol standard
