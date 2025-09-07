
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
Searches for locations using structured address components.

**Parameters:**
- `street` (string, optional): Street name
- `city` (string, optional): City
- `state` (string, optional): State/region
- `country` (string, optional): Country
- `postalcode` (string, optional): Postal code
- `addressdetails` (boolean, optional): Include address details (default: false)
- `limit` (number, optional): Maximum number of results
- `countrycodes` (string, optional): Comma-separated country codes to restrict search (e.g. 'de,at')

**Returns:** List of locations with coordinates and address details.

---


### `navigation-free-form-search`
Free-text search for places, addresses, or POIs.

**Parameters:**
- `query` (string): Search term or address
- `limit` (number, optional): Maximum number of results (default: 3)
- `countrycodes` (string, optional): Comma-separated country codes to restrict search

**Returns:** List of results with coordinates and address details.

---


### `navigation-reverse-geocode-search`
Converts coordinates to address information (reverse geocoding).

**Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude
- `zoom` (string, optional): Level of detail ('3'-'18', default: '18')
- `addressdetails` (boolean, optional): Include address details

**Returns:** Address and additional location information if available.

---


### `navigation-calculate-distance`
Calculates the distance between two coordinate points.

**Parameters:**
- `point1` (object): `{ lat: number, lon: number }` (first point)
- `point2` (object): `{ lat: number, lon: number }` (second point)
- `precision` (number, optional): Number of decimal places (default: 2)

**Returns:** Distance in kilometers (`distance`).

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
