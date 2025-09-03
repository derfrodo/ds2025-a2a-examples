import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "cross-fetch";
import dotenv from "dotenv";

import { calculateDistance } from "./calculateDistance.js";

// Centralized Zod enum for zoom levels and address details
const ZoomLevelEnum = z.enum([
    "3",  // country
    "5",  // state
    "8",  // county
    "10", // city
    "12", // town / borough
    "13", // village / suburb
    "14", // neighbourhood
    "15", // any settlement
    "16", // major streets
    "17", // major and minor streets
    "18"  // building
]).describe(`Level of detail required for the address. Default is 18. This is a number that corresponds roughly to the zoom level used in XYZ tile sources in frameworks like Leaflet.js, Openlayers etc. In terms of address details the zoom:\n3: country\n5: state\n8: county\n10: city\n12: town / borough\n13: village / suburb\n14: neighbourhood\n15: any settlement\n16: major streets\n17: major and minor streets\n18: building`);

// Load environment variables from .env file
dotenv.config();

const server = new McpServer({
    name: "navigation-mcp-server",
    version: "1.0.0"
});

const stationObject = z.object({
    place_id: z.number(),
    licence: z.string(),
    osm_type: z.string(),
    osm_id: z.number(),
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
    address: z.object({
        road: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postcode: z.string().optional()
    }).optional()
});

server.registerTool(
    "navigation-structured-search",
    {
        title: "Structured Search Locations",
        description: "Search for locations using structured data as input.",
        inputSchema: {
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            country: z.string().optional(),
            postalcode: z.string().optional(),
            addressdetails: z.boolean().optional(),
            limit: z.number().optional(),
            countrycodes: z.string().optional().describe("A comma-separated list of country codes to limit the search to specific countries (e.g., 'us,ca' for the United States and Canada).")
        },
        outputSchema: {
            results: z.array(stationObject)
        }
    },
    async ({ street, city, state, country, postalcode, addressdetails, limit, countrycodes }) => {
        const params = new URLSearchParams(
            Object.entries({
                street, city, state, country, postalcode,
                format: "jsonv2",
                addressdetails: addressdetails ? '1' : '0',
                limit: limit?.toString(), countrycodes
            }).filter(([_, value]) => value !== undefined) as [string, string][]
        );
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
        const data = await response.json();
        const structuredContent = { results: data };
        return {
            content: [{
                type: "text",
                text: JSON.stringify(structuredContent)
            }],
            structuredContent
        };
    }
);

server.registerTool(
    "navigation-free-form-search",
    {
        title: "Search Locations",
        description: "Search for locations by free-form data.",
        inputSchema: {
            q: z.string().optional().describe("The search query string. E.g. Dortmund Deutschland"),
            addressdetails: z.boolean().optional().default(false).describe("When set to true (not recommended), include a breakdown of the address into elements. The exact content of the address breakdown depends on the output format"),
            limit: z.number().optional().default(10).describe("Maximum number of results to return. Default is 10."),
            countrycodes: z.string().optional().describe("A comma-separated list of country codes to limit the search to specific countries (e.g., 'us,ca' for the United States and Canada).")
        },
        outputSchema: {
            results: z.array(stationObject)
        }
    },
    async ({ q, addressdetails, limit, countrycodes, }) => {
        const params = new URLSearchParams(
            Object.entries({
                q,
                format: "jsonv2",
                addressdetails: addressdetails ? '1' : '0',
                limit: limit?.toString(),
                countrycodes
            }).filter(([_, value]) => value !== undefined) as [string, string][]
        );
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
        const data = await response.json();
        const structuredContent = { results: data };
        return {
            content: [{
                type: "text",
                text: JSON.stringify(structuredContent)
            }],
            structuredContent
        };
    }
);

const navigationReverseGeocodeSearchOutputSchema = {
    place_id: z.number(),
    licence: z.string(),
    osm_type: z.string(),
    osm_id: z.number(),
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
    category: z.string(),
    boundingbox: z.array(z.string()).describe('Bounding box coordinates. Example: ["51.5078967","51.5079967","7.6354939","7.6355939"]'),
    address: z.object({
        road: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postcode: z.string().optional()
    }).optional()
}

server.registerTool(
    "navigation-reverse-geocode-search",
    {
        title: "Reverse Geocode",
        description: "Get address details for a given latitude and longitude.",
        inputSchema: {
            lat: z.number().describe("Latitude of the first point as a number. (e.g. 52.5200)"),
            lon: z.number().describe("Longitude of the first point as a number. (e.g. 13.4050)"),
            zoom: ZoomLevelEnum.optional().default("18"),
            addressdetails: z.boolean().optional()
        },
        outputSchema: navigationReverseGeocodeSearchOutputSchema
    },
    async ({ lat, lon, zoom, addressdetails }) => {
        const params = new URLSearchParams(
            Object.entries({
                lat: lat.toString(),
                lon: lon.toString(),
                format: "jsonv2",
                zoom,
                addressdetails: addressdetails ? '1' : '0'
            }).filter(([_, value]) => value !== undefined) as [string, string][]
        );
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`);
        const data = await response.json();
        const result = z.object(navigationReverseGeocodeSearchOutputSchema).parse(data);
        return {
            content: [{
                type: "text",
                text: JSON.stringify(result)
            }],
            structuredContent: result
        };
    }
);

server.registerTool(
    "navigation-calculate-distance",
    {
        title: "Calculate Distance",
        description: "Calculates the distance between two geographical points in kilometers.",
        inputSchema: {
            point1: z.object({
                lat: z.number().describe("Latitude of the first point as a number. (e.g. 52.5200)"),
                lon: z.number().describe("Longitude of the first point as a number. (e.g. 13.4050)")
            }),
            point2: z.object({
                lat: z.number().describe("Latitude of the second point as a number. (e.g. 48.8566)"),
                lon: z.number().describe("Longitude of the second point as a number. (e.g. 2.3522)")
            }),
            precision: z.number().optional().default(2).describe("Number of decimal places to round the distance to. Default is 2.")
        },
        outputSchema: {
            distance: z.number().describe("Distance between the two points in kilometers as a number")
        },
    },
    ({ point1, point2, precision }) => {
        const precisionFactor = Math.pow(10, precision);
        const distance = Math.round(calculateDistance(point1, point2) * precisionFactor) / precisionFactor;
        return {
            content: [
                {
                    type: "text",
                    text: distance.toString()
                }
            ],
            structuredContent: { distance }
        };
    }
);


const transport = new StdioServerTransport();
await server.connect(transport);

