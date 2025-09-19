import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "cross-fetch";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const server = new McpServer({
    name: "gas-stations-mcp-server",
    version: "1.0.0"
});

const TANKERKOENIG_API_KEY = process.env.TANKERKOENIG_API_KEY;

if (!TANKERKOENIG_API_KEY) {
    throw new Error("TANKERKOENIG_API_KEY environment variable is not set. Please define it in the .env file.");
}

server.registerTool(
    "nearby-gas-stations",
    {
        title: "Fetch Nearby Gas Stations.",
        description: "Fetches nearby gas stations based on latitude, longitude, and radius.",
        inputSchema: {
            lat: z.number().describe("Latitude as a number e.g. 50."),
            lng: z.number().describe("Longitude as a number e.g. 7."),
            rad: z.number().min(0).max(25).describe("Radius/Max distance as number to be used for search in km."),
            limit: z.number().min(0).optional().default(10).describe("Maximum number of stations to return. Default is 10. Set to 0 for unlimited."),
            type: z.optional(z.enum(['e5', 'e10', 'diesel', 'all'])),
            sort: z.optional(z.enum(['price', 'dist'])).describe("Sort by price or distance. Only applicable when type is not 'all'. If type is set to 'all', sort must be ommitted or set to 'dist'."),
            withDetails: z.boolean().optional().default(false).describe("If true, includes more details about each station in the response. Default is false. Fetching details using this query is not recommended."),
        },
        outputSchema: {
            ok: z.boolean().describe("Indicates if the request was successful"),
            license: z.string(),
            data: z.string(),
            status: z.string(),
            stations: z.array(
                z.object({
                    id: z.string(),
                    brand: z.string(),
                    place: z.string(),
                    lat: z.number(),
                    lng: z.number(),
                    dist: z.number(),
                    diesel: z.number().nullable().optional(),
                    e5: z.number().nullable().optional(),
                    e10: z.number().nullable().optional(),
                    isOpen: z.boolean(),
                }))
        }
    },
    async ({ lat, lng, rad, type, sort, limit, withDetails }) => {
        const queryType = type ?? "all";
        const response = await fetch(`https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lng}&rad=${rad}&type=${queryType}&sort=${queryType === "all" ? "dist" : sort ?? "dist"}&apikey=${TANKERKOENIG_API_KEY}`);
        const { stations, ...data } = await response.json();
        const filteredStations = (limit > 0 && limit < stations.length ? stations.slice(0, limit) : stations);
        const structuredContent = {
            ...data,
            stations: withDetails ?
                filteredStations :
                filteredStations.map((station: any) => ({
                    id: station.id,
                    brand: station.brand,
                    place: station.place,
                    lat: station.lat,
                    lng: station.lng,
                    dist: station.dist,
                    ...(typeof station.diesel !== "undefined" ? { diesel: station.diesel, } :
                        type === "diesel" && typeof station.price !== "undefined" ? { diesel: station.price } :
                            {}),
                    ...(typeof station.e5 !== "undefined" ? { e5: station.e5, } :
                        type === "e5" && typeof station.price !== "undefined" ? { e5: station.price } :
                            {}),
                    ...(typeof station.e10 !== "undefined" ? { e10: station.e10, } :
                        type === "e10" && typeof station.price !== "undefined" ? { e10: station.price } :
                            {}),
                    isOpen: station.isOpen
                }))
        };
        return {
            content: [{
                type: "text",
                text: JSON.stringify(structuredContent)
            }],
            structuredContent: structuredContent
        };
    }
);

server.registerTool(
    "gas-station-prices",
    {
        title: "Fetch Fuel Prices",
        description: "Fetches fuel prices for specific station IDs.",
        inputSchema: {
            ids: z.string()
        },
        outputSchema: {
            ok: z.boolean(),
            prices: z.record(z.string(), z.object({
                status: z.string(),
                diesel: z.number().nullable().optional(),
                e5: z.number().nullable().optional(),
                e10: z.number().nullable().optional(),
            }))
        }
    },
    async ({ ids }) => {
        const response = await fetch(`https://creativecommons.tankerkoenig.de/json/prices.php?ids=${ids}&apikey=${TANKERKOENIG_API_KEY}`);
        const data = await response.json();
        const structuredContent = {
            ...data,
        };
        return {
            content: [{
                type: "text",
                text: JSON.stringify(structuredContent)
            }],
            structuredContent: structuredContent
        };
    }
);

server.registerTool(
    "gas-station-detail",
    {
        title: "Fetch Station Details",
        description: "Fetches detailed information about a specific gas station.",
        inputSchema: {
            id: z.string()
        },
        outputSchema: {
            ok: z.boolean(),
            station: z.object({
                id: z.string(),
                name: z.string(),
                brand: z.string(),
                street: z.string(),
                houseNumber: z.string().optional(),
                postCode: z.string(),
                place: z.string(),
                lat: z.number(),
                lng: z.number(),
                diesel: z.number().optional(),
                e5: z.number().optional(),
                e10: z.number().optional()
            })
        }
    },
    async ({ id }) => {
        const response = await fetch(`https://creativecommons.tankerkoenig.de/json/detail.php?id=${id}&apikey=${TANKERKOENIG_API_KEY}`);
        const data = await response.json();
        const structuredContent = {
            ...data,
        };
        return {
            content: [{
                type: "text",
                text: JSON.stringify(structuredContent)
            }],
            structuredContent: structuredContent
        };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);




// server.registerResource(
//     "config",
//     "config://app",
//     {
//         title: "Application Config",
//         description: "Application configuration data",
//         mimeType: "text/plain"
//     },
//     async (uri) => ({
//         contents: [{
//             uri: uri.href,
//             text: "App configuration here"
//         }]
//     })
// );
// server.registerResource(
//     "echo",
//     new ResourceTemplate("echo://{message}", {
//         list: undefined
//     }),
//     {
//         title: "Echo Resource",
//         description: "Echoes back messages as resources"
//     },
//     async (uri, { message }) => ({
//         contents: [{
//             uri: uri.href,
//             text: `Resource echo: ${message}`
//         }]
//     })
// );

// server.registerTool(
//     "echo",
//     {
//         title: "Echo Tool",
//         description: "Echoes back the provided message",
//         inputSchema: { message: z.string() }
//     },
//     async ({ message }) => ({
//         content: [{ type: "text", text: `Tool echo: ${message}` }]
//     })
// );

// server.registerPrompt(
//     "echo",
//     {
//         title: "Echo Prompt",
//         description: "Creates a prompt to process a message",
//         argsSchema: { message: z.string() }
//     },
//     ({ message }) => ({
//         messages: [{
//             role: "user",
//             content: {
//                 type: "text",
//                 text: `Please process this message: ${message}`
//             }
//         }]
//     })
// );
