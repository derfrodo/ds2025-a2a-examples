
# Gas Stations MCP Server

A Model Context Protocol (MCP) server that provides access to German gas station data via the Tankerkoenig API. Find nearby gas stations, get real-time fuel prices, and retrieve detailed station information.

## Table of Contents

- [🚀 Features](#-features)
- [🛠️ Installation](#️-installation)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Usage](#-usage)
- [🔧 Available Tools](#-available-tools)
- [💡 Usage Examples](#-usage-examples)
- [📊 Data Source](#-data-source)

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
Find gas stations near a location with optional filtering and sorting.

**Parameters:**
- `lat` (number): Latitude coordinate
- `lng` (number): Longitude coordinate  
- `rad` (number): Search radius in km (max 25)
- `limit` (number, optional): Max results (default: 10)
- `type` (string, optional): Fuel type filter (`'e5'`, `'e10'`, `'diesel'`, `'all'`)
- `sort` (string, optional): Sort by `'price'` or `'dist'` (distance)
- `withDetails` (boolean, optional): Include detailed station info

**Returns:** Array of gas stations with location, distance, and price information.

---

### `gas-station-prices`
Get current fuel prices for specific station IDs.

**Parameters:**
- `ids` (string): Comma-separated station IDs (e.g., `"123,456,789"`)

**Returns:** Current prices for E5, E10, and Diesel at specified stations.

---

### `gas-station-detail`
Get detailed information about a specific station.

**Parameters:**
- `id` (string): Station ID

**Returns:** Complete station information including address, opening hours, and amenities.

## 💡 Usage Examples

### Find Nearby Gas Stations

```javascript
// Find E10 stations within 10km of Berlin center, sorted by price
{
  "tool": "nearby-gas-stations",
  "parameters": {
    "lat": 52.5200,
    "lng": 13.4050,
    "rad": 10,
    "type": "e10",
    "sort": "price",
    "limit": 5
  }
}
```

### Get Current Prices

```javascript
// Get prices for multiple stations
{
  "tool": "gas-station-prices", 
  "parameters": {
    "ids": "abc123,def456,ghi789"
  }
}
```

### Station Details

```javascript
// Get complete information for a station
{
  "tool": "gas-station-detail",
  "parameters": {
    "id": "abc123"
  }
}
```

### Real-world Scenarios

**Scenario 1: Find cheapest fuel on route**
```javascript
// Find diesel stations within 15km of highway exit
{
  "tool": "nearby-gas-stations",
  "parameters": {
    "lat": 51.2277,
    "lng": 6.7735,
    "rad": 15,
    "type": "diesel",
    "sort": "price",
    "limit": 3,
    "withDetails": true
  }
}
```

**Scenario 2: Check prices at favorite stations**
```javascript
// Monitor prices at regularly used stations
{
  "tool": "gas-station-prices",
  "parameters": {
    "ids": "station1,station2,station3"
  }
}
```

## 📊 Data Source

This server uses the [Tankerkoenig API](https://creativecommons.tankerkoenig.de/), which provides:
- **Real-time fuel prices** from German gas stations (updated every few minutes)
- **Station locations and details** across Germany
- **Data licensed under Creative Commons** for free usage
- **Comprehensive coverage** of major fuel station brands

**Note**: An API key is required and can be obtained for free at the Tankerkoenig website.
