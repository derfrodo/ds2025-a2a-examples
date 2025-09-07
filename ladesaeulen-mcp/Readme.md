
# E-Charging Stations MCP Server (Ladesäulen)

A Model Context Protocol (MCP) server that provides access to German electric vehicle charging station data. This server enables querying for registered charging stations, finding the nearest stations, and calculating distances.

## 🚀 Features

- **Registered Stations**: Access database of registered German charging stations
- **Nearest Stations**: Find charging stations closest to a location
- **Distance Calculation**: Calculate distances between coordinates
- **Detailed Information**: Get comprehensive station data including power ratings, connector types, and locations
- **MCP Compatible**: Works with any MCP-compatible client or agent

## 🛠️ Installation

```bash
npm install
```

## 📋 Prerequisites

### Required

- Node.js 18+

### Environment Setup

```bash
cp .env.sample .env
```

No API key is required - this server uses public German government data.

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

### `e-charging-stations`
Retrieve registered charging stations from the database.

**Parameters:**
- `limit` (number, optional): Maximum number of stations to return (default: 10)

**Returns:** Array of stations with details including:
- Operator (betreiber)
- Charging equipment type
- Number of charging points
- Connector types (up to 4)
- Power ratings (kW)
- Location details (address, coordinates)
- Commission date

### `nearest-e-charging-stations`
Find the nearest charging stations to a given location.

**Parameters:**
- `lat` (number): Latitude coordinate
- `lng` (number): Longitude coordinate
- `limit` (number, optional): Maximum number of stations to return (default: 10)
- `maxDistanceKm` (number, optional): Maximum search distance in km (default: 50)

### `calculate-distance`
Calculate the distance between two coordinate points.

**Parameters:**
- `lat1` (number): First point latitude
- `lng1` (number): First point longitude
- `lat2` (number): Second point latitude
- `lng2` (number): Second point longitude

**Returns:** Distance in kilometers

## 📊 Data Sources

This server uses data from:
- [Open NRW Dataset](https://open.nrw/dataset/deutschland-e-ladesaulen-ne)
- Official German charging station registry

The data includes comprehensive information about:
- Public charging stations across Germany
- Technical specifications (power, connector types)
- Precise locations and addresses
- Operator information
