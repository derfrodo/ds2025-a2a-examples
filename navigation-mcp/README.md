
# Navigation MCP Server

A Model Context Protocol (MCP) server that provides geocoding and location search capabilities using the Nominatim API (OpenStreetMap). Convert addresses to coordinates, find places by name, and calculate distances between locations.

## Table of Contents

- [🚀 Features](#-features)
- [🛠️ Installation](#️-installation)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Usage](#-usage)
- [🔧 Available Tools](#-available-tools)
- [💡 Usage Examples](#-usage-examples)
- [🔍 Zoom Levels](#-zoom-levels)
- [📊 Data Source](#-data-source)

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
Search for locations using structured address components for precise results.

**Parameters:**
- `street` (string, optional): Street name
- `city` (string, optional): City name
- `state` (string, optional): State/region
- `country` (string, optional): Country
- `postalcode` (string, optional): Postal code
- `addressdetails` (boolean, optional): Include address details (default: false)
- `limit` (number, optional): Maximum number of results
- `countrycodes` (string, optional): Restrict search to specific countries (e.g. `'de,at'`)

**Returns:** List of locations with coordinates and detailed address information.

---

### `navigation-free-form-search`
Free-text search for places, addresses, or points of interest using natural language.

**Parameters:**
- `query` (string): Search term or address (e.g., "Berlin Cathedral", "Dortmund city center")
- `limit` (number, optional): Maximum number of results (default: 10)
- `countrycodes` (string, optional): Comma-separated country codes to restrict search

**Returns:** List of matching results with coordinates and address details.

---

### `navigation-reverse-geocode-search`
Convert coordinates to address information (reverse geocoding).

**Parameters:**
- `lat` (number): Latitude coordinate
- `lon` (number): Longitude coordinate
- `zoom` (string, optional): Detail level ('3'-'18', default: '18')
- `addressdetails` (boolean, optional): Include detailed address components

**Returns:** Address and location information for the given coordinates.

---

### `navigation-calculate-distance`
Calculate the distance between two coordinate points using the haversine formula.

**Parameters:**
- `point1` (object): First point as `{ lat: number, lon: number }`
- `point2` (object): Second point as `{ lat: number, lon: number }`
- `precision` (number, optional): Number of decimal places in result (default: 2)

**Returns:** Distance in kilometers.

## 💡 Usage Examples

### Structured Address Search

```javascript
// Find a specific address in Germany
{
  "tool": "navigation-structured-search",
  "parameters": {
    "street": "Friedrichstraße 123",
    "city": "Berlin",
    "country": "Germany",
    "addressdetails": true,
    "countrycodes": "de"
  }
}
```

### Free-form Place Search

```javascript
// Search for landmarks or places
{
  "tool": "navigation-free-form-search",
  "parameters": {
    "query": "Brandenburg Gate Berlin",
    "limit": 5,
    "countrycodes": "de"
  }
}
```

### Reverse Geocoding

```javascript
// Get address from coordinates
{
  "tool": "navigation-reverse-geocode-search",
  "parameters": {
    "lat": 52.5170,
    "lon": 13.3888,
    "zoom": "18",
    "addressdetails": true
  }
}
```

### Distance Calculation

```javascript
// Calculate distance between two cities
{
  "tool": "navigation-calculate-distance",
  "parameters": {
    "point1": { "lat": 52.5200, "lon": 13.4050 },
    "point2": { "lat": 51.3397, "lon": 12.3731 },
    "precision": 2
  }
}
```

### Real-world Scenarios

**Scenario 1: Find nearby POIs**
```javascript
// Search for restaurants in a city center
{
  "tool": "navigation-free-form-search",
  "parameters": {
    "query": "restaurants Dortmund city center",
    "limit": 10,
    "countrycodes": "de"
  }
}
```

**Scenario 2: Address validation and standardization**
```javascript
// Validate and get standardized address
{
  "tool": "navigation-structured-search",
  "parameters": {
    "street": "Robert-Schuman-Str 20",
    "city": "Dortmund",
    "addressdetails": true
  }
}
```

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
- **Global geocoding and reverse geocoding** powered by OpenStreetMap
- **Comprehensive location database** covering worldwide addresses and POIs
- **Free and open usage** with no API key required
- **High-quality data** maintained by the OpenStreetMap community
- **Multiple languages** and international address formats supported

**License**: Results are licensed as "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright"

**Usage Guidelines**: Please respect the usage policy for fair access to this free service.
