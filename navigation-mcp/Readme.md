
# Navigation MCP Server

A Model Context Protocol (MCP) server that provides geocoding and location search capabilities using the Nominatim API (OpenStreetMap). This server enables address-to-coordinate conversion, reverse geocoding, and location searches.

## 🚀 Features

- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Convert coordinates to addresses
- **Location Search**: Find places by name or description
- **Structured Search**: Search with specific address components
- **Distance Calculation**: Calculate distances between points
- **Flexible Detail Levels**: Control address detail from country to building level
- **MCP Compatible**: Works with any MCP-compatible client or agent

## 🛠️ Installation

```bash
npm install
```

## 📋 Prerequisites

### Required

- Node.js (with npm)

### Environment Setup

```bash
cp .env.sample .env
```

No API key is required - this server uses the free Nominatim API from OpenStreetMap.

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

### `navigation-structured-search`
Search for locations with structured address components.

**Parameters:**
- `q` (string): Search query
- `limit` (number, optional): Maximum results (default: 10)
- `addressdetails` (string, optional): Include address details ('0' or '1', default: '1')
- `zoom` (string, optional): Detail level ('3'-'18', see zoom levels below)

### `navigation-reverse-search`
Convert coordinates to address information.

**Parameters:**
- `lat` (number): Latitude coordinate
- `lng` (number): Longitude coordinate
- `zoom` (string, optional): Detail level ('3'-'18', default: '18')
- `addressdetails` (string, optional): Include address details ('0' or '1', default: '1')

### `calculate-distance`
Calculate the distance between two coordinate points.

**Parameters:**
- `lat1` (number): First point latitude
- `lng1` (number): First point longitude  
- `lat2` (number): Second point latitude
- `lng2` (number): Second point longitude

**Returns:** Distance in kilometers

## 🔍 Zoom Levels

The zoom parameter controls the level of address detail:

- **3**: Country level
- **5**: State/region level
- **8**: County level
- **10**: City level
- **12**: Town/borough level
- **13**: Village/suburb level
- **14**: Neighbourhood level
- **15**: Any settlement
- **16**: Major streets
- **17**: Major and minor streets
- **18**: Building level (most detailed)

## 📊 Data Source

This server uses the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/) which provides:
- Global geocoding and reverse geocoding
- OpenStreetMap data
- Free and open usage
- No API key required
- Expect the license of the result to be
  - "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright"
