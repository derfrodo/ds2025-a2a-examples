import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { z } from "zod";
import { calculateDistance } from "./calculateDistance.js";
import { getEChargersInGermany } from "./data.js";
import { getNearestChargers } from "./getNearestChargers.js";

// Load environment variables from .env file
dotenv.config();

const server = new McpServer({
    name: "ladesaulen-mcp-server",
    version: "1.0.0"
});

server.registerTool(
    "e-charging-stations",
    {
        title: "Fetch registered Charging Stations",
        description: "Fetches registered charging stations by database order.",
        inputSchema: {
            limit: z.number().optional().default(10)
        },
        outputSchema: {
            stations: z.array(
                z.object({
                    betreiber: z.string(),
                    art_der_ladeeinrichung: z.string(),
                    anzahl_ladepunkte: z.number(),
                    steckertypen1: z.string().nullable(),
                    steckertypen2: z.string().nullable(),
                    steckertypen3: z.string().nullable(),
                    steckertypen4: z.string().nullable(),
                    p1_kw: z.number().nullable(),
                    p2_kw: z.number().nullable(),
                    p3_kw: z.number().nullable(),
                    p4_kw: z.number().nullable(),
                    p5_kw: z.number().nullable(),
                    p6_kw: z.number().nullable(),
                    nennleistung_ladeeinrichtung_kw: z.number(),
                    kreis_kreisfreie_stadt: z.string(),
                    ort: z.string(),
                    postleitzahl: z.string(),
                    strasse: z.string(),
                    hausnummer: z.string(),
                    adresszusatz: z.string().nullable(),
                    inbetriebnahmedatum: z.string().nullable(),
                    koordinaten: z.object({
                        lat: z.number(),
                        lon: z.number()
                    }),
                    anzeigename_karte: z.string().nullable(),
                    steckertypen5: z.string().nullable(),
                    steckertypen6: z.string().nullable(),
                })
            )
        }
    },
    async ({ limit }) => {
        const data = getEChargersInGermany();
        const stations = limit > 0 &&
            data.length > limit ?
            data.slice(0, limit) :
            data

        if (stations.length < 10) {
            console.error({ stations })
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ stations }, null, 2)
                }
            ],
            structuredContent: { stations }
        };
    }
);

server.registerTool(
    "nearest-e-charging-stations",
    {
        title: "Fetch registered Charging Stations",
        description: "Fetches registered charging stations based on geometry and other parameters.",
        inputSchema: {
            location: z.object({
                lat: z.number().describe("Latitude of the first point"),
                lon: z.number().describe("Longitude of the first point")
            }),
            limit: z.number().optional().default(10)
        },
        outputSchema: {
            stations: z.array(
                z.object({
                    betreiber: z.string(),
                    art_der_ladeeinrichung: z.string(),
                    anzahl_ladepunkte: z.number(),
                    steckertypen1: z.string().nullable(),
                    steckertypen2: z.string().nullable(),
                    steckertypen3: z.string().nullable(),
                    steckertypen4: z.string().nullable(),
                    p1_kw: z.number().nullable(),
                    p2_kw: z.number().nullable(),
                    p3_kw: z.number().nullable(),
                    p4_kw: z.number().nullable(),
                    p5_kw: z.number().nullable(),
                    p6_kw: z.number().nullable(),
                    nennleistung_ladeeinrichtung_kw: z.number(),
                    kreis_kreisfreie_stadt: z.string(),
                    ort: z.string(),
                    postleitzahl: z.string(),
                    strasse: z.string(),
                    hausnummer: z.string(),
                    adresszusatz: z.string().nullable(),
                    inbetriebnahmedatum: z.string().nullable(),
                    koordinaten: z.object({
                        lat: z.number(),
                        lon: z.number()
                    }),
                    anzeigename_karte: z.string().nullable(),
                    steckertypen5: z.string().nullable(),
                    steckertypen6: z.string().nullable(),
                })
            )
        }
    },
    async ({ location, limit }) => {
        const stations = getNearestChargers(location, limit);
        if (stations.length < 10) {
            console.error({ stations })
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ stations }, null, 2)
                }
            ],
            structuredContent: { stations }
        };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);

