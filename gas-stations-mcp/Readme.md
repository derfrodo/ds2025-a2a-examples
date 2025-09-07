
# Gas Stations MCP Server

A Model Context Protocol (MCP) server that provides access to German gas station data via the Tankerkoenig API. This server enables querying for nearby gas stations, fuel prices, and detailed station information.

## 🚀 Features

- **Nearby Stations**: Find gas stations within a specified radius
- **Fuel Prices**: Get current prices for E5, E10, and Diesel
- **Station Details**: Retrieve detailed information about specific stations
- **Flexible Filtering**: Filter by fuel type, sort by price or distance
- **MCP Compatible**: Works with any MCP-compatible client or agent

## 🛠️ Installation

```bash
npm install
```

## 📋 Prerequisites

### Required

- Node.js (npm)
- Tankerkoenig API key

### Environment Setup

1. Copy the environment sample file:
   ```bash
   cp .env.sample .env
   ```

2. Add your Tankerkoenig API key to `.env`:
   ```bash
   TANKERKOENIG_API_KEY=your_api_key_here
   ```

   Get your free API key at: https://creativecommons.tankerkoenig.de/

## 🚀 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### MCP Inspector (Development)
```bash
npm run inspect
```

## 🔧 Available Tools

### `nearby-gas-stations`
Find gas stations near a location.

**Parameters:**
- `lat` (number): Latitude coordinate
- `lng` (number): Longitude coordinate  
- `rad` (number): Search radius in km (max 25)
- `limit` (number, optional): Max results (default: 10)
- `type` (string, optional): Fuel type filter ('e5', 'e10', 'diesel', 'all')
- `sort` (string, optional): Sort by 'price' or 'dist'
- `withDetails` (boolean, optional): Include detailed station info

### `gas-station-prices`
Get current fuel prices for specific station IDs.

**Parameters:**
- `ids` (string): Comma-separated station IDs

### `gas-station-detail`
Get detailed information about a specific station.

**Parameters:**
- `id` (string): Station ID

## 📊 Data Source

This server uses the [Tankerkoenig API](https://creativecommons.tankerkoenig.de/), which provides:
- Real-time fuel prices from German gas stations
- Station locations and details
- Data licensed under Creative Commons
