
# E-Charging Stations MCP Server (Ladesäulen)

A Model Context Protocol (MCP) server that provides access to German electric vehicle charging station data. Find registered charging stations, locate the nearest ones, and get comprehensive technical specifications.

## Table of Contents

- [🚀 Features](#-features)
- [🛠️ Installation](#️-installation)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Usage](#-usage)
- [🔧 Available Tools](#-available-tools)
- [💡 Usage Examples](#-usage-examples)
- [📊 Data Sources](#-data-sources)

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
Retrieve registered charging stations from the German government database.

**Parameters:**
- `limit` (number, optional): Maximum number of stations to return (default: 10)

**Returns:** Array of charging stations with comprehensive details:
- Operator information (betreiber)
- Charging equipment specifications
- Number of charging points
- Connector types (up to 4 different types)
- Power ratings in kW
- Complete address and GPS coordinates
- Commission date and operational status

---

### `nearest-e-charging-stations`
Find charging stations closest to a specific location with distance filtering.

**Parameters:**
- `lat` (number): Latitude coordinate
- `lng` (number): Longitude coordinate
- `limit` (number, optional): Maximum number of stations to return (default: 10)
- `maxDistanceKm` (number, optional): Maximum search distance in km (default: 50)

**Returns:** Array of nearest stations sorted by distance, including calculated distances.

---

### `calculate-distance`
Calculate the distance between two coordinate points using precise geographic calculations.

**Parameters:**
- `lat1` (number): First point latitude
- `lng1` (number): First point longitude
- `lat2` (number): Second point latitude
- `lng2` (number): Second point longitude

**Returns:** Distance in kilometers with high precision.

## 💡 Usage Examples

### Get General Station Information

```javascript
// Retrieve first 20 charging stations from database
{
  "tool": "e-charging-stations",
  "parameters": {
    "limit": 20
  }
}
```

### Find Nearby Charging Stations

```javascript
// Find stations within 25km of Munich city center
{
  "tool": "nearest-e-charging-stations",
  "parameters": {
    "lat": 48.1351,
    "lng": 11.5820,
    "limit": 15,
    "maxDistanceKm": 25
  }
}
```

### Calculate Distance Between Points

```javascript
// Distance between Berlin and Hamburg
{
  "tool": "calculate-distance",
  "parameters": {
    "lat1": 52.5200,
    "lng1": 13.4050,
    "lat2": 53.5511,
    "lng2": 9.9937
  }
}
```

### Real-world Scenarios

**Scenario 1: Route planning for electric vehicles**
```javascript
// Find fast charging stations along the A1 highway
{
  "tool": "nearest-e-charging-stations",
  "parameters": {
    "lat": 53.0793,
    "lng": 8.8017,
    "limit": 10,
    "maxDistanceKm": 5
  }
}
```

**Scenario 2: Urban charging infrastructure analysis**
```javascript
// Get comprehensive data for urban planning
{
  "tool": "e-charging-stations",
  "parameters": {
    "limit": 100
  }
}
```

**Scenario 3: Distance-based service area calculation**
```javascript
// Calculate service radius from charging hub
{
  "tool": "calculate-distance",
  "parameters": {
    "lat1": 50.9375,
    "lng1": 6.9603,
    "lat2": 51.2277,
    "lng2": 6.7735
  }
}
```

## 📊 Data Sources

This server uses official German government data from:

- **[Open NRW Dataset](https://open.nrw/dataset/deutschland-e-ladesaulen-ne)** - Comprehensive charging station registry
- **Official German charging station registry** - Government-maintained database

### Data Coverage

The dataset includes detailed information about:
- **Public charging stations** across all German states
- **Technical specifications** including power ratings and connector types  
- **Precise locations** with GPS coordinates and full addresses
- **Operator information** and contact details
- **Operational status** and commission dates
- **Infrastructure types** from AC slow charging to DC fast charging

**Data Quality**: Official government data ensures high accuracy and completeness for public infrastructure planning and EV route optimization.
